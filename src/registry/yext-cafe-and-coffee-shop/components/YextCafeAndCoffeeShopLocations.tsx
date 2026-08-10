import type { PuckContext } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import type {
  AddressType,
  Coordinate,
  HoursType,
  StatusParams,
} from "@yext/pages-components";
import * as React from "react";
import {
  Address,
  AnalyticsScopeProvider,
  HoursStatus,
  HoursTable,
  Link,
  getDirections,
} from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  getPreferredDistanceUnit,
  MapboxStaticMapComponent,
  mapboxStaticMapStyleOptions,
  mergeMeta,
  type MapboxStaticProps,
  resolveComponentData,
  resolveUrlTemplate,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

const yextCafeAndCoffeeShopStyles = String.raw`
p {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
li {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
h1 {
  font-family: var(--fontFamily-h1-fontFamily);
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h1-fontWeight);
  font-style: var(--fontStyle-h1-fontStyle);
  text-transform: var(--textTransform-h1-textTransform);
}
h2 {
  font-family: var(--fontFamily-h2-fontFamily);
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h2-fontWeight);
  font-style: var(--fontStyle-h2-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h3 {
  font-family: var(--fontFamily-h3-fontFamily);
  font-size: var(--fontSize-h3-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h3-fontWeight);
  font-style: var(--fontStyle-h3-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h4 {
  font-family: var(--fontFamily-h4-fontFamily);
  font-size: var(--fontSize-h4-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h4-fontWeight);
  font-style: var(--fontStyle-h4-fontStyle);
  text-transform: var(--textTransform-h4-textTransform);
}
h5 {
  font-family: var(--fontFamily-h5-fontFamily);
  font-size: var(--fontSize-h5-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h5-fontWeight);
  font-style: var(--fontStyle-h5-fontStyle);
  text-transform: var(--textTransform-h5-textTransform);
}
h6 {
  font-family: var(--fontFamily-h6-fontFamily);
  font-size: var(--fontSize-h6-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h6-fontWeight);
  font-style: var(--fontStyle-h6-fontStyle);
  text-transform: var(--textTransform-h6-textTransform);
}
a, button {
  font-family: var(--fontFamily-link-fontFamily);
  font-size: var(--fontSize-link-fontSize);
  font-weight: var(--fontWeight-link-fontWeight);
  font-style: var(--fontStyle-link-fontStyle);
  line-height: 1.5;
  text-decoration: underline;
  text-transform: var(--textTransform-link-textTransform);
  letter-spacing: var(--letterSpacing-link-letterSpacing);
}
#locations-section,
#locations-section * {
  box-sizing: border-box;
}

#locations-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-locations-bg, #121212);
}

#locations-section .locations__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, auto);
  column-gap: 18px;
  row-gap: 0;
  align-items: stretch;
}

#locations-section .locations__heading {
  grid-column: 1 / -1;
  margin: 0 0 2rem;
  text-align: center;
  color: var(--cr-locations-heading, #d2a180);
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

#locations-section .locations__map {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  height: 100%;
  min-height: clamp(360px, 42vw, 560px);
  align-self: stretch;
  border-radius: 16px;
  overflow: hidden;
}

#locations-section .locations__map > * {
  width: 100%;
  height: 100%;
}

#locations-section .locations__map .mapbox-static-map-shell,
#locations-section .locations__map .mapbox-static-map-picture,
#locations-section .locations__map .mapbox-static-map-image {
  width: 100%;
  height: 100%;
}

#locations-section .locations__map .mapbox-static-map-image {
  object-fit: cover;
  object-position: center;
}

#locations-section .locations__grid {
  grid-column: 2;
  grid-row: 2;
  margin-top: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

#locations-section .locations__status {
  margin: 0;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
  border-radius: 16px;
  background: var(--cr-locations-bg, #121212);
  color: currentColor;
  font-size: 16px;
  line-height: 1.5;
}

#locations-section .location-card {
  border-radius: 16px;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
  display: grid;
  gap: 1rem;
  box-shadow: none;
  background: var(--cr-locations-bg, #121212);
}

#locations-section .location-card h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.12;
  font-weight: 700;
}

#locations-section .location-card__name-link {
  color: inherit;
  font: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-decoration: none;
}

.cafe-scope.no-touchevents #locations-section .location-card__name-link:hover,
.cafe-scope.no-touchevents #locations-section .location-card__name-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
  outline: none;
}

#locations-section .location-card p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  opacity: 1;
}

#locations-section .location-card p + p {
  margin-top: 0.14rem;
}

#locations-section .location-card__hours {
  display: grid;
  gap: 0.6rem;
}

#locations-section .location-card__hours .HoursTable {
  font-size: 16px;
  line-height: 1.5;
}

#locations-section .location-card__hours .HoursTable-row {
  padding: 0.12rem 0;
}

#locations-section .location-card__hours .HoursTable-day,
#locations-section .location-card__hours .HoursTable-intervals {
  font-size: inherit;
}

#locations-section .location-card__distance {
  margin-top: 0.35rem;
  padding-top: 0.55rem;
  border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  font-size: 15px;
  line-height: 1.45;
}

#locations-section .location-card__cta {
  margin-top: 0.62rem;
  width: auto;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 42px;
  padding: 0.7rem 1.25rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

  .cafe-scope.no-touchevents #locations-section .location-card__cta:hover,
.cafe-scope.no-touchevents #locations-section .location-card__cta:focus-visible {
  background-color: color-mix(in srgb, currentColor 22%, transparent);
  border-color: currentColor;
  outline: none;
}

@media (max-width: 1023px) {
  #locations-section .locations__wrap {
    padding-inline: 30px;
    grid-template-columns: 1fr;
  }

  #locations-section .locations__grid {
    grid-column: 1;
    grid-row: 2;
  }

  #locations-section .locations__map {
    grid-column: 1;
    grid-row: 3;
    min-height: 300px;
    margin-top: 18px;
  }

  #locations-section .locations__heading {
    text-align: left;
  }
}

@media (max-width: 767px) {
  #locations-section .locations__wrap {
    padding-inline: 14px;
  }

  #locations-section .locations__map {
    min-height: 240px;
  }

  #locations-section .location-card h3 {
    font-size: 18px;
  }
}`;

type YextCafeAndCoffeeShopLocationsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      fontStyle: string;
      textTransform: string;
    };
    fontColor?: ThemeColor;
  };
  map: {
    coordinate: YextEntityField<Coordinate>;
    mapStyle: string;
    height?: string;
    zoom: number;
  };
  nearby: {
    radiusMi: number;
    limit: number;
    cardBackgroundColor: ThemeColor | undefined;
    cardTitleColor: ThemeColor | undefined;
    cardDetailColor: ThemeColor | undefined;
    statusColor: ThemeColor | undefined;
    ctaColor: ThemeColor | undefined;
    showHours: boolean;
    showPhone: boolean;
    showAddress: boolean;
    content: {
      loadingText: YextEntityField<TranslatableString>;
      emptyText: YextEntityField<TranslatableString>;
      nearbyLocationFallbackName: YextEntityField<TranslatableString>;
      directionsLabel: YextEntityField<TranslatableString>;
      distanceTemplateMiles: YextEntityField<TranslatableString>;
      distanceTemplateKilometers: YextEntityField<TranslatableString>;
    };
    hoursStyles: {
      showCurrentStatus: boolean;
      timeFormat: "12h" | "24h";
      dayOfWeekFormat: "short" | "long";
      showDayNames: boolean;
    };
    phone: {
      phoneFormat: "international" | "domestic";
      includeHyperlink?: boolean;
    };
    address: {
      showRegion: boolean;
      showCountry: boolean;
    };
  };
};

type RuntimeProps = YextCafeAndCoffeeShopLocationsProps & {
  id?: string;
  puck?: PuckContext;
};

const resolveTranslatableStringValue = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback = "",
) =>
  value
    ? resolveComponentData(value, locale, streamDocument)?.trim() || fallback
    : fallback;

const resolveTextFieldValue = (
  field: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback = "",
) =>
  resolveComponentData(field, locale, streamDocument)?.trim() ||
  resolveTranslatableStringValue(
    field.constantValue,
    locale,
    streamDocument,
    fallback,
  ).trim();

const fields: YextFields<YextCafeAndCoffeeShopLocationsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: {
      text: {
        label: "Heading",
        type: "entityField",
        filter: { includeListsOnly: false, types: ["type.string"] },
        disableConstantValueToggle: false,
      },
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  map: {
    label: "Map",
    type: "object",
    objectFields: {
      coordinate: {
        type: "entityField",
        label: "Coordinates",
        filter: { types: ["type.coordinate"] },
      },
      mapStyle: {
        label: "Mapbox Map Style",
        type: "select",
        options: mapboxStaticMapStyleOptions,
      },
      zoom: {
        label: "Zoom",
        type: "number",
        min: 0,
        max: 22,
      },
    },
  },
  nearby: {
    label: "Nearby Locations",
    type: "object",
    objectFields: {
      radiusMi: {
        label: "Radius (mi)",
        type: "number",
        min: 1,
        max: 100,
      },
      limit: {
        label: "Result Limit",
        type: "number",
        min: 1,
        max: 12,
      },
      cardBackgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      cardTitleColor: {
        label: "Title Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      cardDetailColor: {
        label: "Detail Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      statusColor: {
        label: "Status Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      ctaColor: {
        label: "CTA Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      showHours: {
        label: "Show Hours",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showPhone: {
        label: "Show Phone",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showAddress: {
        label: "Show Address",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      content: {
        label: "Content",
        type: "object",
        objectFields: {
          loadingText: {
            label: "Loading Text",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
          emptyText: {
            label: "Empty State Text",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
          nearbyLocationFallbackName: {
            label: "Fallback Location Name",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
          directionsLabel: {
            label: "Directions Label",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
          distanceTemplateMiles: {
            label: "Distance Template (Miles)",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
          distanceTemplateKilometers: {
            label: "Distance Template (Kilometers)",
            type: "entityField",
            filter: { includeListsOnly: false, types: ["type.string"] },
            disableConstantValueToggle: false,
          },
        },
      },
      hoursStyles: {
        label: "Hours Styles",
        type: "object",
        objectFields: {
          showCurrentStatus: {
            label: "Show Current Status",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          timeFormat: {
            label: "Time Format",
            type: "select",
            options: [
              { label: "12 Hour", value: "12h" },
              { label: "24 Hour", value: "24h" },
            ],
          },
          dayOfWeekFormat: {
            label: "Day Of Week Format",
            type: "select",
            options: [
              { label: "Short", value: "short" },
              { label: "Long", value: "long" },
            ],
          },
          showDayNames: {
            label: "Show Day Names",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
      },
      phone: {
        label: "Phone",
        type: "object",
        objectFields: {
          phoneFormat: {
            label: "Phone Number Format",
            type: "radio",
            options: [
              { label: "Domestic", value: "domestic" },
              { label: "International", value: "international" },
            ],
          },
          includeHyperlink: {
            label: "Include Phone Hyperlink",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
      },
      address: {
        label: "Address",
        type: "object",
        objectFields: {
          showRegion: {
            label: "Show Region",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          showCountry: {
            label: "Show Country",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
      },
    },
  },
};

const defaultProps: YextCafeAndCoffeeShopLocationsProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    visibleOnLivePage: true,
  },
  heading: {
    text: {
      field: "",
      constantValue: "Where To Find Us",
      constantValueEnabled: true,
    },
    styles: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
    },
    fontColor: undefined,
  },
  map: {
    coordinate: {
      field: "yextDisplayCoordinate",
      constantValue: {
        latitude: 0,
        longitude: 0,
      },
      constantValueEnabled: false,
    },
    mapStyle: "streets-v12",
    zoom: 13,
  },
  nearby: {
    radiusMi: 10,
    limit: 3,
    cardBackgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    cardTitleColor: undefined,
    cardDetailColor: undefined,
    statusColor: undefined,
    ctaColor: undefined,
    showHours: true,
    showPhone: true,
    showAddress: true,
    content: {
      loadingText: {
        field: "",
        constantValue: "Loading nearby locations",
        constantValueEnabled: true,
      },
      emptyText: {
        field: "",
        constantValue: "No nearby locations found for this location",
        constantValueEnabled: true,
      },
      nearbyLocationFallbackName: {
        field: "",
        constantValue: "Nearby Location",
        constantValueEnabled: true,
      },
      directionsLabel: {
        field: "",
        constantValue: "Get Directions",
        constantValueEnabled: true,
      },
      distanceTemplateMiles: {
        field: "",
        constantValue: "Located {distance} miles from this location",
        constantValueEnabled: true,
      },
      distanceTemplateKilometers: {
        field: "",
        constantValue: "Located {distance} km from this location",
        constantValueEnabled: true,
      },
    },
    hoursStyles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      dayOfWeekFormat: "long",
      showDayNames: true,
    },
    phone: {
      phoneFormat: "domestic",
      includeHyperlink: true,
    },
    address: {
      showRegion: true,
      showCountry: false,
    },
  },
};

const toThemeCss = (token?: string) => {
  if (!token) {
    return undefined;
  }

  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }

  if (token === "white") {
    return "#ffffff";
  }

  if (token === "black") {
    return "#000000";
  }

  if (token.endsWith("-light")) {
    return `hsl(from var(--colors-${token.replace("-light", "")}) h s 98)`;
  }

  if (token.endsWith("-dark")) {
    return `hsl(from var(--colors-${token.replace("-dark", "")}) h s 20)`;
  }

  if (token.startsWith("palette-")) {
    return `var(--colors-${token})`;
  }

  return token;
};

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const getDistanceMiles = (
  from: Coordinate | undefined,
  to: Coordinate | undefined,
) => {
  if (
    from?.latitude === undefined ||
    from?.longitude === undefined ||
    to?.latitude === undefined ||
    to?.longitude === undefined
  ) {
    return null;
  }

  const earthRadiusMiles = 3958.7613;
  const latitudeDelta = degreesToRadians(to.latitude - from.latitude);
  const longitudeDelta = degreesToRadians(to.longitude - from.longitude);
  const fromLatitude = degreesToRadians(from.latitude);
  const toLatitude = degreesToRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusMiles * angularDistance;
};

const formatDistanceText = (
  currentCoordinate: Coordinate | undefined,
  nearbyCoordinate: Coordinate | undefined,
  milesTemplate: string,
  kilometerTemplate: string,
  countryCode?: string,
) => {
  const distanceMiles = getDistanceMiles(currentCoordinate, nearbyCoordinate);
  if (distanceMiles === null) return "";

  const preferredUnit = getPreferredDistanceUnit(countryCode ?? "US");
  if (preferredUnit === "kilometer") {
    const distanceKilometers = distanceMiles * 1.60934;
    return kilometerTemplate.replace(
      "{distance}",
      distanceKilometers.toFixed(1),
    );
  }

  return milesTemplate.replace("{distance}", distanceMiles.toFixed(1));
};

const getLocationName = (locationData: any, fallbackName: string) => {
  if (typeof locationData?.name === "string" && locationData.name.trim()) {
    return locationData.name.trim();
  }
  if (
    typeof locationData?.dm_directoryName === "string" &&
    locationData.dm_directoryName.trim()
  ) {
    return locationData.dm_directoryName.trim();
  }
  return fallbackName;
};

const getLocationPhone = (locationData: any) => {
  if (
    typeof locationData?.mainPhone === "string" &&
    locationData.mainPhone.trim()
  ) {
    return locationData.mainPhone.trim();
  }
  if (
    typeof locationData?.dm_directoryPhone === "string" &&
    locationData.dm_directoryPhone.trim()
  ) {
    return locationData.dm_directoryPhone.trim();
  }
  return "";
};

const getPhoneRegionCode = (address: AddressType | undefined) => {
  const countryCode = address?.countryCode?.trim().toUpperCase();
  return countryCode?.length === 2 ? countryCode : "US";
};

const formatLocationPhone = (
  phoneNumber: string,
  phoneFormat: "international" | "domestic",
  address: AddressType | undefined,
) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, {
    regionCode: getPhoneRegionCode(address),
  });
  const formattedPhoneNumber =
    parsedPhoneNumber.valid && parsedPhoneNumber.number
      ? phoneFormat === "international"
        ? parsedPhoneNumber.number.international
        : parsedPhoneNumber.number.national
      : phoneNumber;

  return {
    formattedPhoneNumber,
    telDigits: phoneNumber.replace(/\D/g, ""),
  };
};

const hasNearbyStatusDetail = (status: StatusParams) =>
  !status.comingSoon &&
  !status.currentInterval?.is24h?.() &&
  Boolean(status.futureInterval);

const getNearbyStatusTime = (status: StatusParams) => {
  if (!hasNearbyStatusDetail(status)) {
    return "";
  }

  return status.isOpen
    ? (status.currentInterval?.getEndTime("en-US", status.timeOptions) ?? "")
    : (status.futureInterval?.getStartTime("en-US", status.timeOptions) ?? "");
};

const getNearbyStatusDay = (status: StatusParams, showDayNames: boolean) => {
  if (!showDayNames || !hasNearbyStatusDetail(status)) {
    return "";
  }

  const dayOptions = { weekday: "long", ...status.dayOptions };

  return status.isOpen
    ? (status.currentInterval?.end
        ?.setLocale("en-US")
        .toLocaleString(dayOptions) ?? "")
    : (status.futureInterval?.start
        ?.setLocale("en-US")
        .toLocaleString(dayOptions) ?? "");
};

const renderNearbyHoursStatus = (
  status: StatusParams,
  showDayNames: boolean,
) => {
  const currentLabel = status.comingSoon
    ? "Coming Soon"
    : status.currentInterval?.is24h?.()
      ? "Open 24 Hours"
      : !status.futureInterval
        ? "Temporarily Closed"
        : status.isOpen
          ? "Open Now"
          : "Closed";
  const detailPrefix = status.isOpen ? "Closes at" : "Opens at";
  const detailTime = getNearbyStatusTime(status);
  const detailDay = getNearbyStatusDay(status, showDayNames);

  return (
    <div className="HoursStatus">
      <span className="HoursStatus-current">{currentLabel}</span>
      {hasNearbyStatusDetail(status) ? (
        <>
          <span className="HoursStatus-separator"> - </span>
          <span className="HoursStatus-future">{detailPrefix}</span>
          <span className="HoursStatus-time"> {detailTime}</span>
          {detailDay ? (
            <span className="HoursStatus-dayOfWeek"> {detailDay}</span>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

const NearbyLocationsContent = ({
  docs,
  streamDocument,
  relativePrefixToRoot,
  currentCoordinate,
  nearby,
  cardBackgroundFallback,
  sectionForeground,
  locale,
}: {
  docs: any[];
  streamDocument: any;
  relativePrefixToRoot?: string;
  currentCoordinate: Coordinate | undefined;
  nearby: YextCafeAndCoffeeShopLocationsProps["nearby"];
  cardBackgroundFallback?: ThemeColor;
  sectionForeground: string | undefined;
  locale: string;
}) => {
  const fallbackLocationName = resolveTextFieldValue(
    nearby.content.nearbyLocationFallbackName,
    locale,
    streamDocument,
    "Nearby Location",
  );
  const directionsLabel = resolveTextFieldValue(
    nearby.content.directionsLabel,
    locale,
    streamDocument,
    "Get Directions",
  );
  const distanceTemplateMiles = resolveTextFieldValue(
    nearby.content.distanceTemplateMiles,
    locale,
    streamDocument,
    "Located {distance} miles from this location",
  );
  const distanceTemplateKilometers = resolveTextFieldValue(
    nearby.content.distanceTemplateKilometers,
    locale,
    streamDocument,
    "Located {distance} km from this location",
  );
  return (
    <>
      {docs.map((locationData, index) => {
        const mergedDocument = mergeMeta(locationData, streamDocument);
        const resolvedUrl = resolveUrlTemplate(
          mergedDocument,
          relativePrefixToRoot ?? "",
        );
        const usesFallbackLocationName =
          !(
            typeof locationData?.name === "string" && locationData.name.trim()
          ) &&
          !(
            typeof locationData?.dm_directoryName === "string" &&
            locationData.dm_directoryName.trim()
          );
        const name = getLocationName(locationData, fallbackLocationName);
        const address = locationData?.address as AddressType | undefined;
        const phone = getLocationPhone(locationData);
        const hours = locationData?.hours as HoursType | undefined;
        const distanceText = formatDistanceText(
          currentCoordinate,
          locationData?.yextDisplayCoordinate,
          distanceTemplateMiles,
          distanceTemplateKilometers,
          streamDocument?.address?.countryCode,
        );
        const distanceTemplateField =
          getPreferredDistanceUnit(
            streamDocument?.address?.countryCode ?? "US",
          ) === "kilometer"
            ? nearby.content.distanceTemplateKilometers
            : nearby.content.distanceTemplateMiles;
        const directionsUrl = getDirections(
          address,
          locationData?.listings,
          locationData?.googlePlaceId,
          undefined,
          locationData?.yextDisplayCoordinate,
        );
        const nearbyCardBackground =
          nearby.cardBackgroundColor ?? cardBackgroundFallback;
        const nearbyCardBackgroundColor = toThemeCss(
          nearbyCardBackground?.selectedColor,
        );
        const nearbyCardForeground =
          toThemeCss(nearbyCardBackground?.contrastingColor) ??
          sectionForeground;
        const nearbyTitleColor =
          toThemeCss(nearby.cardTitleColor?.selectedColor) ??
          nearbyCardForeground;
        const nearbyDetailColor =
          toThemeCss(nearby.cardDetailColor?.selectedColor) ??
          nearbyCardForeground;
        const nearbyCtaColor =
          toThemeCss(nearby.ctaColor?.selectedColor) ?? nearbyDetailColor;
        const formattedPhone = phone
          ? formatLocationPhone(phone, nearby.phone.phoneFormat, address)
          : null;

        return (
          <article
            key={
              locationData?.id ??
              locationData?.uid ??
              locationData?.meta?.id ??
              `${name}-${index}`
            }
            className="location-card"
            style={{
              backgroundColor: nearbyCardBackgroundColor,
              color: nearbyDetailColor,
            }}
          >
            <h3
              style={{
                color: nearbyTitleColor,
              }}
            >
              {usesFallbackLocationName ? (
                <EntityField
                  displayName="Fallback Location Name"
                  fieldId={nearby.content.nearbyLocationFallbackName.field}
                  constantValueEnabled={
                    nearby.content.nearbyLocationFallbackName
                      .constantValueEnabled
                  }
                >
                  <a
                    className="location-card__name-link"
                    href={resolvedUrl}
                    target="_top"
                  >
                    {name}
                  </a>
                </EntityField>
              ) : (
                <a
                  className="location-card__name-link"
                  href={resolvedUrl}
                  target="_top"
                >
                  {name}
                </a>
              )}
            </h3>
            {nearby.showAddress && address ? (
              <Address
                address={address}
                showRegion={nearby.address.showRegion}
                showCountry={nearby.address.showCountry}
                style={{
                  color: nearbyDetailColor,
                  fontSize: "16px",
                  lineHeight: 1.5,
                  fontWeight: 400,
                  margin: 0,
                }}
              />
            ) : null}
            {nearby.showPhone && formattedPhone ? (
              nearby.phone.includeHyperlink && formattedPhone.telDigits ? (
                <Link
                  cta={{
                    link: formattedPhone.telDigits,
                    linkType: "PHONE",
                  }}
                  style={{
                    color: nearbyDetailColor,
                  }}
                >
                  {formattedPhone.formattedPhoneNumber}
                </Link>
              ) : (
                <p
                  style={{
                    color: nearbyDetailColor,
                  }}
                >
                  {formattedPhone.formattedPhoneNumber}
                </p>
              )
            ) : null}
            {nearby.showHours && hours ? (
              <div className="location-card__hours">
                {nearby.hoursStyles.showCurrentStatus ? (
                  <HoursStatus
                    hours={hours}
                    comingSoon={streamDocument?.comingSoon}
                    timezone={
                      locationData?.timezone ??
                      streamDocument?.timezone ??
                      "UTC"
                    }
                    dayOptions={
                      nearby.hoursStyles.showDayNames
                        ? {
                            weekday: nearby.hoursStyles.dayOfWeekFormat,
                          }
                        : undefined
                    }
                    timeOptions={{
                      hour12: nearby.hoursStyles.timeFormat === "12h",
                    }}
                    statusTemplate={(status) =>
                      renderNearbyHoursStatus(
                        status,
                        nearby.hoursStyles.showDayNames,
                      )
                    }
                  />
                ) : (
                  <HoursTable
                    hours={hours}
                    comingSoon={streamDocument?.comingSoon}
                  />
                )}
              </div>
            ) : null}
            {distanceText ? (
              <EntityField
                displayName="Distance Text"
                fieldId={distanceTemplateField.field}
                constantValueEnabled={
                  distanceTemplateField.constantValueEnabled
                }
              >
                <p
                  className="location-card__distance"
                  style={{
                    color: nearbyDetailColor,
                  }}
                >
                  {distanceText}
                </p>
              </EntityField>
            ) : null}
            {directionsUrl ? (
              <EntityField
                displayName="Directions Label"
                fieldId={nearby.content.directionsLabel.field}
                constantValueEnabled={
                  nearby.content.directionsLabel.constantValueEnabled
                }
              >
                <Link
                  href={directionsUrl}
                  className="location-card__cta"
                  style={{
                    color: nearbyCtaColor,
                  }}
                >
                  {directionsLabel}
                </Link>
              </EntityField>
            ) : null}
          </article>
        );
      })}
    </>
  );
};

const YextCafeAndCoffeeShopLocationsComponent = (props: RuntimeProps) => {
  const streamDocument = useDocument<StreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const isEditing = Boolean(props.puck?.isEditing);
  const locale = streamDocument?.locale ?? "en";
  const nearby = {
    ...defaultProps.nearby,
    ...(props.nearby ?? {}),
    content: {
      ...defaultProps.nearby.content,
      ...(props.nearby?.content ?? {}),
    },
    hoursStyles: {
      ...defaultProps.nearby.hoursStyles,
      ...(props.nearby?.hoursStyles ?? {}),
    },
    phone: {
      ...defaultProps.nearby.phone,
      ...(props.nearby?.phone ?? {}),
    },
    address: {
      ...defaultProps.nearby.address,
      ...(props.nearby?.address ?? {}),
    },
  };
  const currentCoordinate = streamDocument?.yextDisplayCoordinate;
  const enableNearbyLocations =
    currentCoordinate?.latitude !== undefined &&
    currentCoordinate?.longitude !== undefined &&
    nearby.radiusMi > 0 &&
    nearby.limit > 0;

  const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
    useNearbyLocations({
      streamDocument,
      latitude: currentCoordinate?.latitude,
      longitude: currentCoordinate?.longitude,
      radiusMi: nearby.radiusMi,
      limit: nearby.limit,
      enabled: enableNearbyLocations,
    });

  const nearbyLocationDocs = nearbyLocationsData?.response?.docs ?? [];
  let mapboxApiKey = streamDocument?._env?.YEXT_MAPBOX_API_KEY ?? "";
  const iframe =
    typeof document === "undefined"
      ? null
      : (document.getElementById("preview-frame") as HTMLIFrameElement | null);
  if (
    iframe?.contentDocument &&
    streamDocument?._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY
  ) {
    mapboxApiKey = streamDocument._env.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY;
  }
  const hasMapboxApiKey = mapboxApiKey.trim().length > 0;
  const shouldHideSection =
    !isEditing && !hasMapboxApiKey && nearbyLocationDocs.length === 0;
  const shouldShowNearbyPlaceholder =
    isEditing &&
    (!enableNearbyLocations ||
      nearbyLocationsStatus === "error" ||
      nearbyLocationsStatus === "success") &&
    nearbyLocationDocs.length === 0;
  const shouldShowNearbyLoading =
    enableNearbyLocations && nearbyLocationsStatus === "pending";
  const shouldShowNearbyCards =
    nearbyLocationsStatus === "success" && nearbyLocationDocs.length > 0;
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const statusTextColor =
    toThemeCss(nearby.statusColor?.selectedColor) ?? sectionForeground;
  const loadingText = resolveTextFieldValue(
    nearby.content.loadingText,
    locale,
    streamDocument,
    "Loading nearby locations",
  );
  const emptyText = resolveTextFieldValue(
    nearby.content.emptyText,
    locale,
    streamDocument,
    "No nearby locations found for this location",
  );
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const mapProps: MapboxStaticProps = {
    ...props.map,
    apiKey: mapboxApiKey,
  };
  const mapPuck: PuckContext = props.puck ?? {
    renderDropZone: () => null,
    metadata: {},
    isEditing: isEditing,
    dragRef: null,
  };

  if (shouldHideSection) {
    return null;
  }

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopLocations${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={
            {
              "--cr-locations-bg": toThemeCss(
                props.section.backgroundColor?.selectedColor,
              ),
              "--cr-locations-heading":
                toThemeCss(props.heading.fontColor?.selectedColor) ??
                sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <section
            id="locations-section"
            className="local-section section-locations"
            aria-label="Where to find us"
          >
            <div className="locations__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="locations__heading"
                  style={{
                    color:
                      toThemeCss(props.heading.fontColor?.selectedColor) ??
                      sectionForeground,
                    fontFamily:
                      props.heading.styles.fontFamily === "default"
                        ? undefined
                        : props.heading.styles.fontFamily,
                    fontSize:
                      props.heading.styles.fontSize === "default"
                        ? undefined
                        : props.heading.styles.fontSize,
                    fontWeight:
                      props.heading.styles.fontWeight === "default"
                        ? undefined
                        : props.heading.styles.fontWeight,
                    fontStyle:
                      props.heading.styles.fontStyle === "default"
                        ? undefined
                        : props.heading.styles.fontStyle,
                    textTransform:
                      props.heading.styles.textTransform === "default"
                        ? undefined
                        : props.heading.styles.textTransform,
                  }}
                >
                  {headingText}
                </h2>
              </EntityField>
              <div className="locations__map">
                <EntityField
                  displayName="Map Coordinates"
                  fieldId={props.map.coordinate.field}
                  constantValueEnabled={
                    props.map.coordinate.constantValueEnabled
                  }
                >
                  <MapboxStaticMapComponent
                    {...mapProps}
                    height="100%"
                    id={`${props.id ?? "locations"}-map`}
                    puck={mapPuck}
                  />
                </EntityField>
              </div>
              {shouldShowNearbyLoading ? (
                <div className="locations__grid">
                  <EntityField
                    displayName="Loading Text"
                    fieldId={nearby.content.loadingText.field}
                    constantValueEnabled={
                      nearby.content.loadingText.constantValueEnabled
                    }
                  >
                    <p
                      className="locations__status"
                      style={{
                        color: statusTextColor,
                      }}
                    >
                      {loadingText}
                    </p>
                  </EntityField>
                </div>
              ) : null}
              {shouldShowNearbyPlaceholder ? (
                <div className="locations__grid">
                  <EntityField
                    displayName="Empty State Text"
                    fieldId={nearby.content.emptyText.field}
                    constantValueEnabled={
                      nearby.content.emptyText.constantValueEnabled
                    }
                  >
                    <p
                      className="locations__status"
                      style={{
                        color: statusTextColor,
                      }}
                    >
                      {emptyText}
                    </p>
                  </EntityField>
                </div>
              ) : null}
              {shouldShowNearbyCards ? (
                <div className="locations__grid">
                  <NearbyLocationsContent
                    docs={nearbyLocationDocs}
                    streamDocument={streamDocument}
                    relativePrefixToRoot={relativePrefixToRoot}
                    currentCoordinate={currentCoordinate}
                    nearby={nearby}
                    cardBackgroundFallback={props.section.backgroundColor}
                    sectionForeground={sectionForeground}
                    locale={locale}
                  />
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopLocations: YextComponentConfig<YextCafeAndCoffeeShopLocationsProps> =
  {
    label: "Locations",
    fields,
    defaultProps,
    render: (props) => (
      <YextCafeAndCoffeeShopLocationsComponent {...(props as RuntimeProps)} />
    ),
  };
