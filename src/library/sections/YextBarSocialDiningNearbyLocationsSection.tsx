import { parsePhoneNumber } from "awesome-phonenumber";
import type { SectionConfig } from "@yext/visual-editor";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Link,
  getDirections,
} from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  type NearbyLocationDoc,
  type StyledTextValue,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
} from "@yext/visual-editor";
import type {
  AddressType,
  Coordinate,
  ListingType,
} from "@yext/pages-components";

type NearbyLocationShape = NearbyLocationDoc & {
  address?: AddressType;
  mainPhone?: string;
  googlePlaceId?: string;
  listings?: ListingType[];
  yextDisplayCoordinate?: Coordinate;
};

type YextBarSocialDiningNearbyLocationsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  radius: number;
  limit: number;
  cardBackgroundColor: ThemeColor;
};

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
    "palette-primary-dark": "hsl(from var(--colors-palette-primary) h s 20)",
    "palette-secondary-dark":
      "hsl(from var(--colors-palette-secondary) h s 20)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (surfaceColor: ThemeColor): ThemeColor => {
  switch (surfaceColor.selectedColor) {
    case "white":
    case "palette-primary-light":
    case "palette-secondary-light":
    case "palette-tertiary-light":
    case "palette-quaternary-light":
      return {
        selectedColor: "black",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "black":
    case "palette-primary-dark":
    case "palette-secondary-dark":
      return {
        selectedColor: "white",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-primary":
      return {
        selectedColor: "palette-primary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-secondary":
      return {
        selectedColor: "palette-secondary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-tertiary":
      return {
        selectedColor: "palette-tertiary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-quaternary":
      return {
        selectedColor: "palette-quaternary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    default:
      return {
        selectedColor: surfaceColor.contrastingColor || "black",
        contrastingColor: surfaceColor.selectedColor,
      };
  }
};

const resolveTextColor = (
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(fontColor)
      ? fontColor
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const formatPhoneNumber = (value?: string): string => {
  if (!value) {
    return "";
  }

  const parsedPhoneNumber = parsePhoneNumber(value.replace(/[^\d+]/g, ""));
  if (!parsedPhoneNumber.valid || !parsedPhoneNumber.number) {
    return value;
  }

  return parsedPhoneNumber.number.national;
};

const nearbyLocationsScopeClass = "bar-social-dining-nearby-locations";
const nearbyLocationsScopedTypographyCss = `
  .${nearbyLocationsScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${nearbyLocationsScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${nearbyLocationsScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${nearbyLocationsScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${nearbyLocationsScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${nearbyLocationsScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${nearbyLocationsScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${nearbyLocationsScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${nearbyLocationsScopeClass} .bar-social-dining-link-typography a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const YextBarSocialDiningNearbyLocationsSectionFields: YextFields<YextBarSocialDiningNearbyLocationsSectionProps> =
  {
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
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
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
    radius: {
      label: "Radius",
      type: "number",
      min: 1,
      max: 50,
    },
    limit: {
      label: "Limit",
      type: "number",
      min: 1,
      max: 12,
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const YextBarSocialDiningNearbyLocationsSectionComponent: PuckComponent<
  YextBarSocialDiningNearbyLocationsSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument<
    StreamDocument & { yextDisplayCoordinate?: Coordinate }
  >();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const coordinate = streamDocument.yextDisplayCoordinate;
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const enabled =
    coordinate?.latitude !== undefined &&
    coordinate?.longitude !== undefined &&
    Boolean(props.radius) &&
    Boolean(props.limit);

  const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
    useNearbyLocations({
      streamDocument,
      latitude: coordinate?.latitude,
      longitude: coordinate?.longitude,
      radiusMi: props.radius,
      limit: props.limit,
      enabled,
    });

  const nearbyLocationDocs = (nearbyLocationsData?.response?.docs ??
    []) as NearbyLocationShape[];
  const sectionForeground = resolveTextColor(
    undefined,
    props.section.backgroundColor,
  );
  const cardForeground = resolveTextColor(undefined, props.cardBackgroundColor);

  if (!enabled) {
    return <></>;
  }

  if (
    (nearbyLocationsStatus !== "success" || !nearbyLocationDocs.length) &&
    !props.puck.isEditing
  ) {
    return <></>;
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningNearbyLocationsSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{nearbyLocationsScopedTypographyCss}</style>
        <section
          className={nearbyLocationsScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
            padding: "72px 24px 48px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <div style={{ marginBottom: "28px" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    color: resolveTextColor(
                      props.heading.fontColor,
                      props.section.backgroundColor,
                    ),
                    fontStyle:
                      props.heading.styles.fontStyle === "default"
                        ? undefined
                        : props.heading.styles.fontStyle,
                    fontWeight:
                      props.heading.styles.fontWeight === "default"
                        ? undefined
                        : props.heading.styles.fontWeight,
                    margin: 0,
                    textTransform:
                      props.heading.styles.textTransform === "default"
                        ? undefined
                        : props.heading.styles.textTransform,
                  }}
                >
                  {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                </h2>
              </EntityField>
            </div>
            {nearbyLocationsStatus === "pending" ? (
              <p style={{ color: sectionForeground }}>
                Loading nearby locations
              </p>
            ) : nearbyLocationsStatus !== "success" ||
              !nearbyLocationDocs.length ? (
              <p style={{ color: sectionForeground }}>
                No nearby locations found for this location
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  overflowX: "auto",
                }}
              >
                {nearbyLocationDocs.map((locationData, index) => {
                  const mergedDocument = mergeMeta(
                    locationData,
                    streamDocument,
                  );
                  const resolvedUrl = resolveUrlTemplate(
                    mergedDocument,
                    relativePrefixToRoot ?? "",
                  );
                  const directionsUrl =
                    getDirections(
                      locationData.address,
                      locationData.listings,
                      locationData.googlePlaceId,
                      undefined,
                      locationData.yextDisplayCoordinate,
                    ) ?? resolvedUrl;

                  return (
                    <article
                      key={locationData.id ?? locationData.name ?? index}
                      style={{
                        backgroundColor: themeColorToCss(
                          props.cardBackgroundColor.selectedColor,
                        ),
                        border: "1px solid rgba(23, 18, 25, 0.08)",
                        color: cardForeground,
                        minWidth: "240px",
                        padding: "18px 16px",
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 8px",
                        }}
                      >
                        {locationData.name ?? "Nearby location"}
                      </h3>
                      <p style={{ margin: "0 0 8px" }}>
                        {locationData.address
                          ? `${locationData.address.line1}, ${locationData.address.city}, ${locationData.address.region ?? ""} ${locationData.address.postalCode}`.trim()
                          : ""}
                      </p>
                      {locationData.mainPhone ? (
                        <p style={{ margin: "0 0 24px" }}>
                          {formatPhoneNumber(locationData.mainPhone)}
                        </p>
                      ) : null}
                      <div className="bar-social-dining-link-typography">
                        <Link
                          cta={{
                            link: directionsUrl,
                            linkType: "URL",
                          }}
                          eventName={`locationCta-${index}`}
                        >
                          Get Directions
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningNearbyLocationsSection: YextComponentConfig<YextBarSocialDiningNearbyLocationsSectionProps> =
  {
    label: "Nearby Locations Section",
    fields: toPuckFields(YextBarSocialDiningNearbyLocationsSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Nearby [[name]] Locations",
            hasLocalizedValue: "true",
          },
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
      radius: 10,
      limit: 3,
      cardBackgroundColor: {
        selectedColor: "palette-quaternary",
        contrastingColor: "palette-quaternary-contrast",
      },
    },
    render: (props) => (
      <YextBarSocialDiningNearbyLocationsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  displayName: "Nearby Locations",
  description: "Displays nearby restaurant locations.",
  pageSetTypes: ["ENTITY"],
  category: "Location",
};
