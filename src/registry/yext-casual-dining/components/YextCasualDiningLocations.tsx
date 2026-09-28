import * as React from "react";
import { Address, AnalyticsScopeProvider } from "@yext/pages-components";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  Body,
  CTA,
  EntityField,
  Heading,
  ThemeOptions,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  mapboxStaticMapStyleOptions,
  MapboxStaticMapComponent,
  resolveComponentData,
  useDocument,
  useNearbyLocations,
  VisibilityWrapper,
  type BodyProps,
  type CTAVariant,
  type HeadingLevel,
  type ThemeColor,
  type TranslatableString,
  type YextEntityField,
  type YextComponentConfig,
  type YextFields,
  resolveUrlTemplate,
  mergeMeta,
  useTemplateProps,
} from "@yext/visual-editor";

const themeVars: React.CSSProperties = {
  ["--COLOR-BG" as string]: "var(--palette-tertiary)",
  ["--COLOR-BG-ACCENT" as string]: "var(--palette-tertiary)",
  ["--COLOR-TEXT" as string]: "var(--palette-quaternary)",
  ["--COLOR-BORDER" as string]: "var(--palette-tertiary)",
  ["--COLOR-ACCENT" as string]: "var(--palette-secondary)",
  ["--COLOR-ACCENT-HOVER" as string]: "var(--palette-primary)",
  ["--BTN-PRIMARY-BG" as string]: "var(--palette-primary)",
  ["--BTN-SECONDARY-TEXT" as string]: "var(--palette-quaternary)",
  ["--footer-bg" as string]: "var(--palette-quaternary)",
};

const capturedStyles = String.raw`:root {
--content-max: 1440px;
  --outer: 32px;
  --outer-mobile: 16px;
  --gutter: 24px;
  --inner: 20px;
  --radius: 14px;
  --radius-small: 10px;
  --font-heading: "Bricolage Grotesque", sans-serif;
  --font-body: "DM Sans", sans-serif;
  --font-body-small: 0.9rem;
  --font-body-medium: 1.02rem;
  --font-body-large: 1.12rem;
  --font-heading-x-small: clamp(1.6rem, 2.1vw, 2.15rem);
  --font-heading-small: clamp(2rem, 2.8vw, 2.95rem);
  --font-heading-large: clamp(2.7rem, 4.9vw, 5rem);
  --font-heading-hero: clamp(3.4rem, 8vw, 7.4rem);
  --section-padding: 50px;
  --section-padding-large: 80px;
  --line: 1.45;
}

*,
*::before,
*::after {
box-sizing: border-box;
}

html {
scroll-behavior: smooth;
}

body {
margin: 0;
  min-width: 320px;
  color: var(--COLOR-TEXT);
  background: var(--COLOR-BG);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: var(--line);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img {
display: block;
  max-width: 100%;
}

a {
color: inherit;
  text-decoration: none;
  transition:
    color 180ms ease,
    opacity 180ms ease,
    text-decoration-color 180ms ease;
}

a:hover {
color: var(--COLOR-ACCENT-HOVER);
}

a:focus-visible,
button:focus-visible,
input:focus-visible {
outline: 2px solid var(--COLOR-ACCENT);
  outline-offset: 3px;
}

button,
input {
font: inherit;
}

button {
cursor: pointer;
}

summary {
list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
display: none;
}

.svg-sprite {
position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.visually-hidden {
position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.wrapper,
.grid-container {
width: min(var(--content-max), calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.product-item__eyebrow {
margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-padding {
padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
}

.color-scheme-1 {
background: var(--COLOR-BG);
  color: var(--COLOR-TEXT);
}

.heading-small {
margin: 0;
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.core-info__item--contact .core-info__link + .core-info__stack {
margin-top: 28px;
}

.core-info__item--contact .core-info__link {
margin-top: 0;
}

.core-info__link {
display: inline-flex;
  align-items: center;
  margin-top: 16px;
  font-weight: 700;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.16em;
}

.core-info__link:hover {
color: var(--COLOR-ACCENT-HOVER);
}

.grid {
display: grid;
  gap: var(--gutter);
}

.grid__heading-text {
max-width: 980px;
}

.grid__heading-holder--inline {
margin-bottom: 28px;
}

.product-item__eyebrow {
margin-bottom: 10px;
  color: inherit;
  opacity: 0.76;
}

.faq-shell .wrapper {
width: min(980px, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.location-map--full-bleed {
width: 100%;
  margin: 0;
  padding: 0;
  background: inherit;
}

.location-map__frame {
width: 100%;
  height: 360px;
  overflow: hidden;
}

.location-map__frame .mapbox-static-map-shell,
.location-map__frame .mapbox-static-map-picture,
.location-map__frame .mapbox-static-map-image {
width: 100%;
  height: 100%;
}

.location-map__frame .mapbox-static-map-image {
object-fit: cover;
  object-position: center;
}

.locations-grid {
grid-template-columns: repeat(3, minmax(0, 1fr));
}

.location-card {
display: flex;
  flex-direction: column;
  padding: 26px 24px 28px;
  background: var(--COLOR-BG-ACCENT);
  border: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  border-radius: 16px;
}

.location-card__title {
margin: 0 0 14px;
}

.location-card__address,
.location-card__meta {
margin: 0;
  color: inherit;
  opacity: 0.76;
}

.location-card__address {
margin-bottom: 8px;
}

.location-card__cta-link {
margin-top: 22px;
}

.locations-empty-state {
margin: 0;
  padding: 18px 20px;
  color: inherit;
  opacity: 0.82;
  background: color-mix(in srgb, currentColor 10%, transparent);
  border: 1px dashed color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}

.grid__heading-holder--inline {
margin-bottom: 24px;
}

.locations-grid {
grid-template-columns: repeat(2, minmax(0, 1fr));
}
}

@media (max-width: 768px) {
.locations-grid {
grid-template-columns: 1fr;
}

.location-card {
padding: 22px 20px 24px;
}
}

@media (min-width: 481px) and (max-width: 768px) {
.location-card__cta-link {
margin-top: 18px;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

const getCoordinatePair = (coordinate?: {
  latitude?: number;
  longitude?: number;
}) => {
  if (
    typeof coordinate?.latitude !== "number" ||
    typeof coordinate?.longitude !== "number"
  ) {
    return undefined;
  }

  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  };
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceText = (
  origin?: { latitude?: number; longitude?: number },
  destination?: { latitude?: number; longitude?: number },
) => {
  if (
    typeof origin?.latitude !== "number" ||
    typeof origin?.longitude !== "number" ||
    typeof destination?.latitude !== "number" ||
    typeof destination?.longitude !== "number"
  ) {
    return "";
  }

  const earthRadiusMi = 3958.7613;
  const latDelta = toRadians(destination.latitude - origin.latitude);
  const lngDelta = toRadians(destination.longitude - origin.longitude);
  const latOne = toRadians(origin.latitude);
  const latTwo = toRadians(destination.latitude);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(latOne) *
      Math.cos(latTwo) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2);
  const distance =
    2 * earthRadiusMi * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return `${Math.round(distance * 10) / 10} miles away`;
};

const getDirectionsUrl = (coordinate?: {
  latitude?: number;
  longitude?: number;
}) =>
  typeof coordinate?.latitude === "number" &&
  typeof coordinate?.longitude === "number"
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinate.latitude},${coordinate.longitude}`
    : "#";

type CasualDiningLocationsProps = {
  section: {
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: {
      level: HeadingLevel;
      color?: ThemeColor;
    };
  };
  cardStyles: {
    header: {
      level: HeadingLevel;
      color?: ThemeColor;
    };
    body: {
      variant: BodyProps["variant"];
      color?: ThemeColor;
    };
    cta: {
      variant: CTAVariant;
      color?: ThemeColor;
    };
  };
  map: {
    limit: number;
    radius: number;
    coordinate: YextEntityField<{
      latitude: number;
      longitude: number;
    }>;
    mapStyle: string;
    zoom?: number;
  };
  id?: string;
  puck?: {
    isEditing?: boolean;
  };
};

type CasualDiningLocationsFieldProps = Omit<
  CasualDiningLocationsProps,
  "id" | "puck"
>;

const fields: YextFields<CasualDiningLocationsFieldProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      cardBackgroundColor: {
        label: "Card Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  map: {
    label: "Map",
    type: "object",
    objectFields: {
      limit: {
        label: "Limit",
        type: "number",
        min: 1,
        max: 25,
      },
      radius: {
        label: "Radius",
        type: "number",
        min: 1,
        max: 1000,
      },
      coordinate: {
        label: "Coordinates",
        type: "entityField",
        filter: {
          types: ["type.coordinate"],
        },
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
  heading: {
    label: "Heading",
    type: "object",
    objectFields: {
      text: {
        label: "Text",
        type: "entityField",
        filter: {
          types: ["type.string"],
        },
      },
      styles: {
        label: "Text Styles",
        type: "object",
        objectFields: {
          level: {
            label: "Heading Level",
            type: "basicSelector",
            options: "HEADING_LEVEL",
          },
          color: {
            label: "Font Color",
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
    },
  },
  cardStyles: {
    label: "Card Styles",
    type: "object",
    objectFields: {
      header: {
        label: "Header",
        type: "object",
        objectFields: {
          level: {
            label: "Heading Level",
            type: "basicSelector",
            options: "HEADING_LEVEL",
          },
          color: {
            label: "Font Color",
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
      body: {
        label: "Body Text",
        type: "object",
        objectFields: {
          variant: {
            label: "Text Size",
            type: "radio",
            options: ThemeOptions.BODY_VARIANT,
          },
          color: {
            label: "Font Color",
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
      cta: {
        label: "Get Directions",
        type: "object",
        objectFields: {
          variant: {
            label: "Variant",
            type: "radio",
            options: [
              { label: "Link", value: "link" },
              { label: "Outline", value: "secondary" },
              { label: "Solid", value: "primary" },
            ],
          },
          color: {
            label: "Font Color",
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
    },
  },
};

const defaultProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    cardBackgroundColor: {
      selectedColor: "palette-tertiary",
      contrastingColor: "palette-tertiary-contrast",
    },
    visibleOnLivePage: true,
  },
  heading: {
    text: {
      field: "",
      constantValue: "Nearby Redwood locations",
      constantValueEnabled: true,
    },
    styles: {
      level: 2,
    },
  },
  cardStyles: {
    header: {
      level: 3,
    },
    body: {
      variant: "base",
    },
    cta: {
      variant: "link",
    },
  },
  map: {
    limit: 3,
    radius: 25,
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
};

const CasualDiningLocationsComponent: PuckComponent<
  CasualDiningLocationsProps
> = (props) => {
  const { relativePrefixToRoot } = useTemplateProps();
  const streamDocument = useDocument<{
    locale?: string;
    yextDisplayCoordinate?: {
      latitude?: number;
      longitude?: number;
    };
    geocodedCoordinate?: {
      latitude?: number;
      longitude?: number;
    };
  }>();
  const isEditing = Boolean(props.puck?.isEditing);
  const sourceCoordinate = getCoordinatePair(
    streamDocument?.yextDisplayCoordinate ?? streamDocument?.geocodedCoordinate,
  );
  const nearbyLocationsQuery = useNearbyLocations({
    streamDocument,
    latitude: sourceCoordinate?.latitude,
    longitude: sourceCoordinate?.longitude,
    radiusMi: props.map.radius,
    limit: props.map.limit,
    enabled: Boolean(sourceCoordinate),
  });
  // Nearby editor test data is now provided by visual-editor, so this component
  // reads directly from the query response instead of maintaining local samples.
  const nearbyLocationItems = nearbyLocationsQuery.data?.response.docs ?? [];
  const resolvedHeadingText =
    (
      resolveComponentData as (
        value: YextEntityField<TranslatableString>,
        locale: string | undefined,
        streamDocument: unknown,
      ) => string | undefined
    )(props.heading.text, streamDocument?.locale, streamDocument) ?? "";
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
    {
      fallbackBackgroundColor: "var(--colors-palette-secondary)",
    },
  );
  const sectionTextColor = sectionSurfaceStyle?.color;
  const cardSurfaceStyle = getSurfaceColorStyle(
    props.section.cardBackgroundColor,
    streamDocument,
    {
      fallbackTextColor: sectionTextColor,
    },
  );
  const cardTextColor = cardSurfaceStyle?.color;
  const showLocationsSection = isEditing || nearbyLocationItems.length > 0;

  if (!showLocationsSection && !isEditing) {
    return <></>;
  }

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningLocations${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="location-map location-map--full-bleed color-scheme-1"
            id="location-map"
            style={sectionSurfaceStyle}
          >
            <div className="location-map__frame">
              <EntityField
                displayName="Map Coordinate"
                fieldId={props.map.coordinate.field}
                constantValueEnabled={
                  props.map.coordinate.constantValueEnabled
                }
                fullHeight
              >
                <MapboxStaticMapComponent
                  coordinate={props.map.coordinate}
                  mapStyle={props.map.mapStyle}
                  zoom={props.map.zoom}
                  height="100%"
                  id={props.id ?? "default"}
                  puck={props.puck}
                />
              </EntityField>
            </div>
          </Background>

          {showLocationsSection ? (
            <Background
              as="section"
              background={props.section.backgroundColor}
              className="index-products section-padding color-scheme-1"
              id="locations"
              style={sectionSurfaceStyle}
            >
              <div className="grid-container wrapper">
                {nearbyLocationItems.length > 0 ? (
                  <>
                    <div className="grid__heading-holder grid__heading-holder--inline">
                      <div className="grid__heading-text">
                        <div className="grid__heading">
                          <EntityField
                            displayName="Heading"
                            fieldId={props.heading.text.field}
                            constantValueEnabled={
                              props.heading.text.constantValueEnabled
                            }
                          >
                            <Heading
                              level={props.heading.styles.level}
                              color={props.heading.styles.color}
                              style={{ margin: 0 }}
                            >
                              {resolvedHeadingText}
                            </Heading>
                          </EntityField>
                        </div>
                      </div>
                    </div>
                    <div className="grid locations-grid">
                      {nearbyLocationItems.map((row, index) => {
                        const resolvedUrl = resolveUrlTemplate(
                          mergeMeta(row, streamDocument),
                          relativePrefixToRoot ?? "",
                        );
                        const locationCoordinate = getCoordinatePair(
                          row.yextDisplayCoordinate ?? row.geocodedCoordinate,
                        );
                        const directionsUrl = getDirectionsUrl(
                          locationCoordinate,
                        );
                        const distanceText = getDistanceText(
                          sourceCoordinate,
                          locationCoordinate,
                        );
                        return (
                          <Background
                            as="div"
                            key={index}
                            background={props.section.cardBackgroundColor}
                            className="location-card"
                            style={{
                              ...cardSurfaceStyle,
                              color: cardTextColor,
                            }}
                          >
                            {distanceText ? (
                              <Body
                                variant={props.cardStyles.body.variant}
                                color={props.cardStyles.body.color}
                                className="product-item__eyebrow"
                                style={{ margin: 0 }}
                              >
                                {distanceText}
                              </Body>
                            ) : null}
                            <Heading
                              level={props.cardStyles.header.level}
                              color={props.cardStyles.header.color}
                              className="location-card__title"
                              style={{ margin: "0 0 14px", lineHeight: 1.02 }}
                            >
                              {row.name}
                            </Heading>
                            {row.address && (
                              <Body
                                variant={props.cardStyles.body.variant}
                                color={props.cardStyles.body.color}
                                className="location-card__address"
                                style={{ marginBottom: 8 }}
                              >
                                <Address address={row.address} />
                              </Body>
                            )}
                            <Body
                              variant={props.cardStyles.body.variant}
                              color={props.cardStyles.body.color}
                              className="location-card__meta"
                            >
                              {row.mainPhone}
                            </Body>
                            <CTA
                              label="Get Directions"
                              link={directionsUrl === "#" ? resolvedUrl : directionsUrl}
                              variant={props.cardStyles.cta.variant}
                              color={props.cardStyles.cta.color}
                              className="core-info__link location-card__cta-link"
                              alwaysHideCaret
                            />
                          </Background>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="locations-empty-state">
                    No nearby locations are available yet.
                  </p>
                )}
              </div>
            </Background>
          ) : (
            <></>
          )}
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningLocations: YextComponentConfig<CasualDiningLocationsFieldProps> =
  {
    label: "Locations",
    fields,
    defaultProps,
    render: (props) => <CasualDiningLocationsComponent {...props} />,
  };
