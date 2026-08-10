// @ts-nocheck
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AddressType, HoursType } from "@yext/pages-components";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { fetchNearbyLocations } from "./utils";

type Coordinate = {
  latitude?: number;
  longitude?: number;
};

export type NearbyLocationDoc = {
  /** The entity id of the location */
  id?: string;
  /** The name of the location */
  name?: string;
  /** The hours of the location */
  hours?: HoursType;
  comingSoon?: boolean;
  /** The address of the location */
  address?: AddressType;
  /** The timezone of the location */
  timezone?: string;
  /** The phone number of the location */
  mainPhone?: string;
  yextDisplayCoordinate?: Coordinate;
  geocodedCoordinate?: Coordinate;
};

export type NearbyLocationsResponse = {
  meta?: {
    uuid?: string;
    errors?: unknown[];
  };
  response: {
    /** The entity data for the nearby locations. */
    docs: NearbyLocationDoc[];
    /** The number of nearby locations returned. */
    count: number;
  };
};

type useNearbyLocationsOptions = {
  streamDocument: StreamDocument;
  /** The latitude of the location. */
  latitude?: number;
  /** The longitude of the location. */
  longitude?: number;
  /** The maximum radius to search for nearby locations. */
  radiusMi: number;
  /** The maximum number of locations to return. */
  limit: number;
  /** Enable/disable the query. */
  enabled: boolean;
  /**
   * Optionally, provide a override for the content endpoint id.
   * Uses streamDocument._pageset.config.contentEndpointId by default.
   */
  contentEndpointIdOverride?: string;
};

export const useNearbyLocations = (
  options: useNearbyLocationsOptions
): UseQueryResult<NearbyLocationsResponse, Error> => {
  const {
    streamDocument,
    contentEndpointIdOverride: contentEndpointIdEnvVar,
    latitude,
    longitude,
    radiusMi,
    limit,
    enabled,
  } = options;
  const {
    i18n: { language: locale },
  } = useTranslation();

  return useQuery({
    queryKey: [
      "NearbyLocations",
      streamDocument?.businessId,
      streamDocument?.id,
      streamDocument?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY,
      streamDocument?._pageset,
      contentEndpointIdEnvVar,
      contentEndpointIdEnvVar
        ? streamDocument?._env?.[contentEndpointIdEnvVar]
        : undefined,
      streamDocument?._yext?.contentDeliveryAPIDomain,
      latitude,
      longitude,
      radiusMi,
      limit,
      locale,
    ],
    queryFn: async () =>
      await fetchNearbyLocations({
        streamDocument,
        contentEndpointIdEnvVar,
        latitude: latitude || 0,
        longitude: longitude || 0,
        radiusMi,
        limit,
        locale,
      }),
    enabled,
  });
};
