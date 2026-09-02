import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HeroImageProps = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type YextBarSocialDiningHeroSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  eyebrow: StyledTextProps;
  heading: StyledTextProps;
  body: StyledRtfProps;
  heroImage: HeroImageProps;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
  tertiaryCta: ComprehensiveCTAValue;
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

const heroScopeClass = "bar-social-dining-hero";
const heroScopedTypographyCss = `
  .${heroScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${heroScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${heroScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${heroScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${heroScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${heroScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${heroScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${heroScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${heroScopeClass} .bar-social-dining-link-typography a {
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

const textStyle = (
  styles: StyledTextValue,
  fontColor?: ThemeColor,
  surfaceColor?: ThemeColor,
): React.CSSProperties => ({
  color: surfaceColor ? resolveTextColor(fontColor, surfaceColor) : undefined,
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const createHeroCta = (
  label: string,
  color: ThemeColor,
  variant: "primary" | "secondary",
): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        ctaType: "textAndLink",
        label: {
          defaultValue: label,
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
      defaultValue: label,
      hasLocalizedValue: "true",
    },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
  },
  styles: {
    variant,
    color,
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
});

const YextBarSocialDiningHeroSectionFields: YextFields<YextBarSocialDiningHeroSectionProps> =
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
    eyebrow: {
      label: "Eyebrow",
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
    heroImage: {
      label: "Hero Image",
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
    primaryCta: {
      label: "Primary CTA",
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: "Secondary CTA",
      type: "comprehensiveCTA",
    },
    tertiaryCta: {
      label: "Tertiary CTA",
      type: "comprehensiveCTA",
    },
  };

const YextBarSocialDiningHeroSectionComponent: PuckComponent<
  YextBarSocialDiningHeroSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const sectionForeground = resolveTextColor(
    undefined,
    props.section.backgroundColor,
  );
  const resolvedEyebrow = resolveComponentData(
    props.eyebrow.text,
    locale,
    streamDocument,
  );
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
    props.heroImage.image,
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
  const hasHeroImage = Boolean(resolvedImageUrl);
  const heroImage = hasHeroImage
    ? (resolvedImage as TranslatableAssetImage)
    : undefined;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningHeroSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{`
            ${heroScopedTypographyCss}

            .bar-social-dining-hero-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              min-height: 560px;
              align-items: stretch;
            }

            @media (max-width: 768px) {
              .bar-social-dining-hero-grid {
                grid-template-columns: 1fr;
                min-height: auto;
              }
            }
          `}</style>
        <section
          className={heroScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
          }}
        >
          <div
            className="bar-social-dining-hero-grid"
            style={{
              gridTemplateColumns: hasHeroImage ? undefined : "minmax(0, 1fr)",
              minHeight: hasHeroImage ? undefined : "auto",
            }}
          >
            <div
              style={{
                alignItems: "center",
                backgroundColor: themeColorToCss(
                  props.section.backgroundColor.selectedColor,
                ),
                color: sectionForeground,
                display: "flex",
                justifyContent: "center",
                padding: "48px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ maxWidth: "520px" }}>
                <EntityField
                  displayName="Eyebrow"
                  fieldId={props.eyebrow.text.field}
                  constantValueEnabled={props.eyebrow.text.constantValueEnabled}
                >
                  <p
                    style={{
                      ...textStyle(
                        props.eyebrow.styles,
                        props.eyebrow.fontColor,
                        props.section.backgroundColor,
                      ),
                      borderBottom: "2px solid currentColor",
                      display: "inline-block",
                      letterSpacing: "0.08em",
                      margin: "0 0 34px",
                      paddingBottom: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {typeof resolvedEyebrow === "string" ? resolvedEyebrow : ""}
                  </p>
                </EntityField>
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h1
                    style={{
                      ...textStyle(
                        props.heading.styles,
                        props.heading.fontColor,
                        props.section.backgroundColor,
                      ),
                      margin: 0,
                    }}
                  >
                    {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                  </h1>
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
                        props.section.backgroundColor,
                      ),
                      marginTop: "26px",
                    }}
                  >
                    {renderRichText(resolvedBody)}
                  </div>
                </EntityField>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    justifyContent: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "24px",
                    maxWidth: "560px",
                    width: "100%",
                  }}
                >
                  <EntityField
                    displayName="Primary CTA"
                    fieldId={props.primaryCta.data.cta.field}
                    constantValueEnabled={
                      props.primaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={props.primaryCta as Partial<ComprehensiveCTAValue>}
                      eventName="primaryCta"
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary CTA"
                    fieldId={props.secondaryCta.data.cta.field}
                    constantValueEnabled={
                      props.secondaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={
                        props.secondaryCta as Partial<ComprehensiveCTAValue>
                      }
                      eventName="secondaryCta"
                    />
                  </EntityField>
                  <EntityField
                    displayName="Tertiary CTA"
                    fieldId={props.tertiaryCta.data.cta.field}
                    constantValueEnabled={
                      props.tertiaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={
                        props.tertiaryCta as Partial<ComprehensiveCTAValue>
                      }
                      eventName="tertiaryCta"
                    />
                  </EntityField>
                </div>
              </div>
            </div>
            {hasHeroImage ? (
              <EntityField
                displayName="Hero Image"
                fieldId={props.heroImage.image.field}
                constantValueEnabled={
                  props.heroImage.image.constantValueEnabled
                }
                fullHeight
              >
                <div
                  style={{
                    display: "flex",
                    minHeight: "360px",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    image={heroImage!}
                    style={{
                      display: "block",
                      flex: "1 1 auto",
                      height: "100%",
                      objectFit:
                        props.heroImage.imageConstrain === "filled"
                          ? "cover"
                          : "contain",
                      objectPosition: "center",
                      width: "100%",
                    }}
                  />
                </div>
              </EntityField>
            ) : null}
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningHeroSection: YextComponentConfig<YextBarSocialDiningHeroSectionProps> =
  {
    label: "Hero Section",
    fields: toPuckFields(YextBarSocialDiningHeroSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        visibleOnLivePage: true,
      },
      eyebrow: {
        text: {
          field: "geomodifier",
          constantValue: {
            defaultValue: "",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: false,
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
      heading: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: false,
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
            defaultValue: getDefaultRTF(
              "An upscale burger restaurant in [[address.city]], [[address.region]] offering dine-in, takeout, delivery, and curbside pickup options. The location serves lunch, dinner, and brunch, with happy hour available on weekdays.",
            ),
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
      heroImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      primaryCta: createHeroCta(
        "Call Ahead",
        {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
        "primary",
      ),
      secondaryCta: createHeroCta(
        "Order Takeout",
        {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
        "primary",
      ),
      tertiaryCta: createHeroCta(
        "View Menu",
        {
          selectedColor: "[#FFFFFF]",
          contrastingColor: "[#171219]",
        },
        "secondary",
      ),
    },
    render: (props) => <YextBarSocialDiningHeroSectionComponent {...props} />,
  };
