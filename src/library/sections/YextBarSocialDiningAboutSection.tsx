import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  Image,
  MaybeRTF,
  createItemSource,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
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

type AboutItemMapping = {
  title: YextEntityField<TranslatableString>;
  description: YextEntityField<TranslatableRichText>;
  image: YextEntityField<TranslatableAssetImage>;
};

type AboutItemStyles = {
  title: Omit<StyledTextProps, "text">;
  description: Omit<StyledRtfProps, "text">;
  image: {
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
};

const aboutItemsSource = createItemSource<AboutItemMapping>({
  label: "Items",
  mappingFields: {
    title: {
      type: "entityField",
      label: "Title",
      filter: { types: ["type.string"] },
    },
    description: {
      type: "entityField",
      label: "Description",
      filter: { types: ["type.rich_text_v2"] },
    },
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: [
    {
      title: {
        field: "",
        constantValue: { defaultValue: "Local", hasLocalizedValue: "true" },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "At [[name]], we believe great burgers start with great ingredients and a sense of place. Nestled in the heart of [[address.city]], the restaurant brings together wood-fired flavor, chef-driven comfort food, and the laid-back [[address.city]] energy that makes [[address.region]] unforgettable.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/hlcJpcdE-_vHprzl5MOnrTwEFmdYZRE9WaT_drjPWis/1000x568.png",
          width: 1000,
          height: 568,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        field: "",
        constantValue: {
          defaultValue: "Dynamic",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Whether you’re grabbing brunch before Barton Springs, meeting friends for happy hour after work downtown, or ordering takeout for a night in [[geomodifier]] [[address.city]], [[name]] delivers a distinctly [[address.city]] experience rooted in quality, hospitality, and bold flavor.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/0V-U0Tk9g5iHSg5ONJZW00L2_BGDVymefN7fqI051qE/1000x568.png",
          width: 1000,
          height: 568,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        field: "",
        constantValue: {
          defaultValue: "Convenient",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Conveniently located at [[address.line1]] near [[geomodifier]] [[address.city]], [[name]] offers dine-in, curbside pickup, delivery, and private group accommodations for locals and visitors looking for one of the best upscale burger restaurants in [[address.city]], [[address.region]].",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/IBzkFIQfMJfgyQi-wxH0LQqlhxZD687Qelcs5dAr1U4/1000x568.png",
          width: 1000,
          height: 568,
        },
        constantValueEnabled: true,
      },
    },
  ],
});

type YextBarSocialDiningAboutSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  items: typeof aboutItemsSource.value;
  itemStyles: AboutItemStyles;
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

const resolveRichTextValue = (
  value: unknown,
): RichText | string | undefined => {
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

  return <MaybeRTF data={resolveRichTextValue(value)} />;
};

const aboutScopeClass = "bar-social-dining-about";
const aboutScopedTypographyCss = `
  .${aboutScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${aboutScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${aboutScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${aboutScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${aboutScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${aboutScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${aboutScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${aboutScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${aboutScopeClass} .bar-social-dining-link-typography a {
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
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): React.CSSProperties => ({
  color: resolveTextColor(fontColor, surfaceColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const YextBarSocialDiningAboutSectionFields: YextFields<YextBarSocialDiningAboutSectionProps> =
  {
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
    items: aboutItemsSource.field,
    itemStyles: {
      label: "Item Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
          type: "object",
          objectFields: {
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
        description: {
          label: "Description",
          type: "object",
          objectFields: {
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
        image: {
          label: "Image",
          type: "object",
          objectFields: {
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
      },
    },
  };

const YextBarSocialDiningAboutSectionComponent: PuckComponent<
  YextBarSocialDiningAboutSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedItems = aboutItemsSource.resolveItems(
    props.items,
    streamDocument,
  );
  const descriptionRichTextStyleOverrides = {
    ...props.itemStyles.description.styles,
    color: hasExplicitThemeColor(props.itemStyles.description.fontColor)
      ? props.itemStyles.description.fontColor
      : getReadableForegroundColor(props.section.backgroundColor),
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningAboutSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{`
          ${aboutScopedTypographyCss}

          @media (max-width: 1024px) {
            .bar-social-dining-about-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <section
          className={aboutScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
            padding: "72px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
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
                      props.section.backgroundColor,
                    ),
                    margin: 0,
                  }}
                >
                  {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                </h2>
              </EntityField>
            </div>
            <EntityField
              displayName="Items"
              fieldId={props.items.field}
              constantValueEnabled={props.items.constantValueEnabled}
            >
              <div
                className="bar-social-dining-about-grid"
                style={{
                  display: "grid",
                  gap: "32px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                {resolvedItems.map((item, index) => {
                  const resolvedTitle = resolveComponentData(
                    item.title,
                    locale,
                    streamDocument,
                    { output: "plainText" },
                  );
                  const resolvedDescription = item.description
                    ? resolveComponentData(
                        item.description,
                        locale,
                        streamDocument,
                        {
                          richTextStyleOverrides:
                            descriptionRichTextStyleOverrides,
                        },
                      )
                    : undefined;
                  const resolvedImage = resolveComponentData(
                    item.image,
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
                  const hasItemImage = Boolean(resolvedImageUrl);
                  const itemImage = hasItemImage
                    ? (resolvedImage as TranslatableAssetImage)
                    : undefined;

                  return (
                    <article
                      key={`${resolvedTitle || "item"}-${index}`}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          margin: "0 auto 16px",
                          height: "214px",
                          maxWidth: "214px",
                          minHeight: "214px",
                          overflow:
                            hasItemImage &&
                            props.itemStyles.image.imageConstrain === "filled"
                              ? "hidden"
                              : undefined,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {itemImage ? (
                          <Image
                            image={itemImage}
                            style={{
                              height: "100%",
                              objectFit:
                                props.itemStyles.image.imageConstrain ===
                                "filled"
                                  ? "cover"
                                  : "contain",
                              width: "100%",
                            }}
                          />
                        ) : null}
                      </div>
                      <h3
                        style={{
                          ...textStyle(
                            props.itemStyles.title.styles,
                            props.itemStyles.title.fontColor,
                            props.section.backgroundColor,
                          ),
                          margin: "0 0 8px",
                        }}
                      >
                        {typeof resolvedTitle === "string" ? resolvedTitle : ""}
                      </h3>
                      <div
                        className="bar-social-dining-link-typography"
                        style={{
                          ...textStyle(
                            props.itemStyles.description.styles,
                            props.itemStyles.description.fontColor,
                            props.section.backgroundColor,
                          ),
                          margin: 0,
                        }}
                      >
                        {renderRichText(resolvedDescription)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningAboutSection: YextComponentConfig<YextBarSocialDiningAboutSectionProps> =
  {
    label: "About Section",
    fields: toPuckFields(YextBarSocialDiningAboutSectionFields),
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "What is [[name]]?",
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
      items: aboutItemsSource.defaultValue,
      itemStyles: {
        title: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        description: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        image: {
          aspectRatio: 1,
          imageConstrain: "fixed",
          styles: { borderRadius: "default" },
        },
      },
    },
    render: (props) => <YextBarSocialDiningAboutSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "YextBarSocialDiningAboutSection",
  displayName: "About Section",
  description: "About Section",
  pageSetTypes: ["ENTITY"],
};
