// @ts-nocheck
import { getDistance } from "geolib";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import {
  NearbyLocationDoc,
  NearbyLocationsResponse,
} from "./useNearbyLocations";

const V_PARAM = "20250407";
const PAGE_SIZE = 50;
const MAX_PAGES = 100;

type NearbyLocationsRawResponse = {
  meta?: NearbyLocationsResponse["meta"];
  response?: {
    docs?: NearbyLocationDoc[];
    count?: number;
    nextPageToken?: string;
  };
};

/**
 * fetchNearbyLocations constructs a nearby locations query based on the provided
 * parameters and fetches from the content endpoint.
 *
 * Due to the lack of geo sorting, it fetches all nearby locations in range,
 * sorts them by distance, and returns the closest ones up to the specified limit.
 */
export const fetchNearbyLocations = async ({
  streamDocument,
  contentEndpointIdEnvVar,
  latitude,
  longitude,
  radiusMi,
  limit,
  locale,
}: {
  streamDocument: StreamDocument;
  contentEndpointIdEnvVar?: string;
  longitude: number;
  latitude: number;
  radiusMi: number;
  limit: number;
  locale: string;
}): Promise<NearbyLocationsResponse> => {
  const businessId: string = streamDocument?.businessId;
  const entityId: string = streamDocument?.id;
  const apiKey: string =
    streamDocument?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY;
  const contentDeliveryAPIDomain =
    streamDocument?._yext?.contentDeliveryAPIDomain;

  let contentEndpointId = "";
  if (streamDocument?._pageset) {
    try {
      const pagesetJson = JSON.parse(streamDocument._pageset);
      contentEndpointId = pagesetJson?.config?.contentEndpointId;
    } catch (e) {
      console.error("Failed to parse pageset from stream document. err=", e);
    }
  } else if (contentEndpointIdEnvVar) {
    contentEndpointId = streamDocument?._env?.[contentEndpointIdEnvVar];
  }

  if (!businessId) {
    console.warn("Missing businessId! Unable to fetch nearby locations.");
  }
  if (!entityId) {
    console.warn("Missing entityId! Unable to fetch nearby locations.");
  }
  if (!apiKey) {
    console.warn(
      "Missing YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY! Unable to fetch nearby locations."
    );
  }
  if (!contentEndpointId) {
    console.warn(
      "Missing contentEndpointId! Unable to fetch nearby locations."
    );
  }
  if (!contentDeliveryAPIDomain) {
    console.warn(
      "Missing contentDeliveryAPIDomain! Unable to fetch nearby locations."
    );
  }

  if (
    !businessId ||
    !entityId ||
    !apiKey ||
    !contentEndpointId ||
    !contentDeliveryAPIDomain
  ) {
    return {
      meta: { errors: [] },
      response: {
        docs: [],
        count: 0,
      },
    };
  }
  const allDocs: NearbyLocationDoc[] = [];
  let firstPageMeta: NearbyLocationsRawResponse["meta"];
  let count: number = 0; // the total count of entities available given the filter params

  const url = new URL(
    `${contentDeliveryAPIDomain}/v2/accounts/${businessId}/content/${contentEndpointId}`
  );
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("v", V_PARAM);
  url.searchParams.set(
    "yextDisplayCoordinate__geo",
    `(lat:${latitude},lon:${longitude},radius:${radiusMi},unit:mi)`
  );
  url.searchParams.set("meta.locale", locale);
  url.searchParams.set("id__neq", entityId);
  url.searchParams.set("limit", PAGE_SIZE.toString());

  let nextPageToken: string | undefined;
  let pageCount = 0;
  while (pageCount < MAX_PAGES) {
    if (nextPageToken) {
      url.searchParams.set("pageToken", nextPageToken);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    pageCount++;

    const pageData = (await response.json()) as NearbyLocationsRawResponse;
    if (!firstPageMeta) {
      firstPageMeta = pageData.meta;
    }
    if (pageData?.response?.count) {
      // set to the latest count as it may change while processing the pages
      count = pageData.response.count;
    }

    allDocs.push(...(pageData.response?.docs ?? []));
    nextPageToken = pageData.response?.nextPageToken;

    if (!nextPageToken) {
      break;
    }
  }

  if (nextPageToken) {
    console.warn(
      `Reached maximum page limit of ${MAX_PAGES}. There were ${count - allDocs.length} locations that were not fetched.`
    );
  }

  // sort allDocs by distance and trim to nearest `limit` locations
  const origin = { latitude, longitude };
  const nearestDocs = allDocs
    .map((doc) => {
      const coordinate = getDocCoordinate(doc);
      return {
        doc,
        distance: coordinate ? getDistance(origin, coordinate) : Infinity,
      };
    })
    .sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      return getDocStableSortKey(a.doc).localeCompare(
        getDocStableSortKey(b.doc)
      );
    })
    .slice(0, limit)
    .map(({ doc }) => doc);

  return {
    meta: firstPageMeta ?? { errors: [] },
    response: {
      docs: nearestDocs,
      count: count,
    },
  };
};

const getDocCoordinate = (
  doc: NearbyLocationDoc
): { latitude: number; longitude: number } | null => {
  const coord = doc.yextDisplayCoordinate ?? doc.geocodedCoordinate;
  const latitude = coord?.latitude;
  const longitude = coord?.longitude;

  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    return null;
  }

  return { latitude, longitude };
};

const getDocStableSortKey = (doc: NearbyLocationDoc) => {
  return doc.id ?? doc.name ?? JSON.stringify(doc);
};
