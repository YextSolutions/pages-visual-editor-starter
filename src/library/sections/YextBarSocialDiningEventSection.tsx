import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  MaybeRTF,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type RichText,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor as ThemeColorType,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  resolveComponentData,
  toPuckFields,
  useDocument,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColorType;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColorType;
};

type EventImageProps = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type YextBarSocialDiningEventSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  overlayColor: ThemeColor;
  heading: StyledTextProps;
  body: StyledRtfProps;
  bannerImage: EventImageProps;
  cta: ComprehensiveCTAValue;
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

const hasExplicitThemeColor = (
  color?: ThemeColorType,
): color is ThemeColorType => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (
  surfaceColor: ThemeColorType,
): ThemeColorType => {
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
  color: ThemeColorType | undefined,
  surfaceColor: ThemeColorType,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(color)
      ? color
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const textStyle = (
  styles: StyledTextValue,
  fontColor?: ThemeColorType,
  surfaceColor?: ThemeColorType,
): React.CSSProperties => ({
  color: surfaceColor ? resolveTextColor(fontColor, surfaceColor) : undefined,
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const normalizeRichText = (value: unknown): RichText | string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "html" in value) {
    return value as RichText;
  }

  return undefined;
};

const renderRichText = (value: unknown): React.ReactNode => {
  if (React.isValidElement(value)) {
    return value;
  }

  return <MaybeRTF data={normalizeRichText(value)} />;
};

const eventScopeClass = "bar-social-dining-event";
const eventScopedTypographyCss = `
  .${eventScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${eventScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${eventScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${eventScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${eventScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${eventScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${eventScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${eventScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${eventScopeClass} .bar-social-dining-link-typography a {
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

const YextBarSocialDiningEventSectionFields: YextFields<YextBarSocialDiningEventSectionProps> =
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
    overlayColor: {
      label: "Overlay Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    body: {
      label: "Body",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    bannerImage: {
      label: "Banner Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: { types: ["type.image"] },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "basicSelector",
          options: "ASPECT_RATIO",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
  };

const YextBarSocialDiningEventSectionComponent: PuckComponent<
  YextBarSocialDiningEventSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
  );
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const resolvedImage = resolveComponentData(
    props.bannerImage.image,
    locale,
    streamDocument,
  );
  const resolvedImageUrl =
    typeof resolvedImage === "object" &&
    resolvedImage !== null &&
    "url" in resolvedImage &&
    typeof resolvedImage.url === "string"
      ? resolvedImage.url.trim()
      : typeof resolvedImage === "object" &&
          resolvedImage !== null &&
          "image" in resolvedImage &&
          resolvedImage.image &&
          typeof resolvedImage.image === "object" &&
          "url" in resolvedImage.image &&
          typeof resolvedImage.image.url === "string"
        ? resolvedImage.image.url.trim()
        : "";
  const sectionBackgroundColor = themeColorToCss(
    props.section.backgroundColor.selectedColor,
  );
  const overlayColor = themeColorToCss(props.overlayColor.selectedColor);
  const overlayForeground = resolveTextColor(undefined, props.overlayColor);
  const hasBannerImage = Boolean(resolvedImageUrl);
  const bannerAspectRatio =
    props.bannerImage.aspectRatio > 0 ? props.bannerImage.aspectRatio : 4;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningEventSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{`
          ${eventScopedTypographyCss}

          .bar-social-dining-event-layout {
            display: grid;
            min-width: 0;
            overflow: hidden;
            width: 100%;
          }

          .bar-social-dining-event-media,
          .bar-social-dining-event-overlay,
          .bar-social-dining-event-content {
            grid-area: 1 / 1;
            min-width: 0;
          }

          .bar-social-dining-event-content {
            align-items: center;
            box-sizing: border-box;
            display: grid;
            justify-items: center;
            padding: clamp(24px, 4vw, 36px) 32px;
            position: relative;
            width: 100%;
            z-index: 1;
          }

          .bar-social-dining-event-copy {
            max-width: 540px;
            min-width: 0;
            width: 100%;
          }

          .bar-social-dining-event-copy h2,
          .bar-social-dining-event-copy .bar-social-dining-link-typography {
            max-width: 100%;
            overflow-wrap: anywhere;
            word-break: break-word;
          }
        `}</style>
        <section
          className={eventScopeClass}
          style={{
            backgroundColor: sectionBackgroundColor,
            padding: "72px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
              minWidth: 0,
              width: "100%",
            }}
          >
            <div
              className="bar-social-dining-event-layout"
              style={{
                backgroundColor:
                  overlayColor ??
                  "rgba(23, 18, 25, 0.18)",
                backgroundImage: hasBannerImage
                  ? `url("${resolvedImageUrl}")`
                  : undefined,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize:
                  props.bannerImage.imageConstrain === "filled"
                    ? "cover"
                    : "contain",
              }}
            >
              <div
                className="bar-social-dining-event-media"
                style={{
                  aspectRatio: bannerAspectRatio,
                  width: "100%",
                }}
              />
              <div
                className="bar-social-dining-event-overlay"
                style={{
                  background:
                    overlayColor ??
                    "linear-gradient(90deg, rgba(23, 18, 25, 0.18), rgba(23, 18, 25, 0.04))",
                  opacity: hasBannerImage ? 0.45 : 1,
                }}
              />
              <div
                className="bar-social-dining-event-content"
                style={{
                  color: overlayForeground,
                }}
              >
                <div className="bar-social-dining-event-copy">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={props.heading.text.constantValueEnabled}
                  >
                    <h2
                      style={{
                        ...textStyle(
                          props.heading.styles,
                          props.heading.fontColor,
                          props.overlayColor,
                        ),
                        marginBottom: "12px",
                      }}
                    >
                      {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                    </h2>
                  </EntityField>
                  <EntityField
                    displayName="Body"
                    fieldId={props.body.text.field}
                    constantValueEnabled={props.body.text.constantValueEnabled}
                  >
                    <div
                      className="bar-social-dining-link-typography"
                      style={{
                        ...textStyle(
                          props.body.styles,
                          props.body.fontColor,
                          props.overlayColor,
                        ),
                        marginBottom: "16px",
                      }}
                    >
                      {renderRichText(resolvedBody)}
                    </div>
                  </EntityField>
                  <EntityField
                    displayName="Call to Action"
                    fieldId={props.cta.data.cta.field}
                    constantValueEnabled={
                      props.cta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={props.cta as Partial<ComprehensiveCTAValue>}
                      className="bar-social-dining-event-cta"
                      eventName="primaryCta"
                    />
                  </EntityField>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningEventSection: YextComponentConfig<YextBarSocialDiningEventSectionProps> =
  {
    label: "Event Section",
    fields: toPuckFields(YextBarSocialDiningEventSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      overlayColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Host Your Next Group Event at [[name]]",
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
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: {
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>Planning a birthday dinner, team happy hour, or weekend gathering in [[geomodifier]] [[address.city]]? [[name]] offers group dining and private event options with elevated comfort food, craft cocktails, and a warm hospitality-first atmosphere.</span></p><ul><li><span>Private and semi-private dining</span></li><li><span>Curated burger and cocktail packages</span></li><li><span>Flexible group seating for up to 35 guests</span></li></ul>',
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Planning a birthday dinner, team happy hour, or weekend gathering in [[geomodifier]] [[address.city]]? [[name]] offers group dining and private event options with elevated comfort food, craft cocktails, and a warm hospitality-first atmosphere.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Private and semi-private dining","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","value":1,"version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Curated burger and cocktail packages","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","value":2,"version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Flexible group seating for up to 35 guests","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","value":3,"version":1}],"direction":"ltr","format":"","indent":0,"listType":"bullet","start":1,"tag":"ul","type":"list","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
            } as RichText,
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
      bannerImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 4,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              ctaType: "textAndLink",
              label: {
                defaultValue: "Plan Your Event",
                hasLocalizedValue: "true",
              },
              link: {
                defaultValue: "#",
                hasLocalizedValue: "true",
              },
              linkType: "URL",
            },
            constantValueEnabled: true,
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: {
            defaultValue: "Plan Your Event",
            hasLocalizedValue: "true",
          },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: {
            defaultValue: "Plan Your Event",
            hasLocalizedValue: "true",
          },
        },
        styles: {
          variant: "primary",
          color: {
            selectedColor: "palette-tertiary",
            contrastingColor: "palette-tertiary-contrast",
          },
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            borderRadius: "default",
          },
          link: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            includeCaret: "default",
          },
        },
      } as ComprehensiveCTAValue,
    },
    render: (props) => <YextBarSocialDiningEventSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "YextBarSocialDiningEventSection",
  displayName: "Event Section",
  description: "Event Section",
  pageSetTypes: ["ENTITY"],
};
