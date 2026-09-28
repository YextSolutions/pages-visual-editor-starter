import * as React from "react";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import { type PuckComponent } from "@puckeditor/core";
import {
  ComprehensiveCTA,
  Background,
  createStyledTextConfig,
  EntityField,
  Image,
  StyledTextComponent,
  ThemeOptions,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
  type ComprehensiveCTAValue,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type TranslatableAssetImage,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

const themeVars: React.CSSProperties = {
  ["--COLOR-BG" as string]: "var(--palette-tertiary)",
  ["--COLOR-TEXT" as string]: "var(--palette-quaternary)",
  ["--COLOR-ACCENT" as string]: "var(--palette-secondary)",
  ["--COLOR-ACCENT-HOVER" as string]: "var(--palette-primary)",
  ["--borderRadius-button-borderRadius" as string]: "9999px",
};

const capturedStyles = String.raw`
:root {
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

.index-hero {
  padding: 0;
  margin-bottom: -1px;
}

.screen-height-full--mobile {
  min-height: calc(100svh - 78px);
}

.frame {
  display: grid;
}

.frame__item {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.video-background,
.video__poster,
.image__hero__frame,
.image__hero__pane,
.image__hero__scale,
.image__fill {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-background {
  min-height: max(520px, calc(100svh - 278px));
  overflow: hidden;
}

.video__poster,
.image__hero__frame,
.image__hero__pane,
.image__hero__scale {
  position: absolute;
  inset: 0;
}

.hero__media-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__content__wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  min-height: inherit;
  padding: clamp(28px, 4vw, 64px);
}

.content-align--bottom-left {
  justify-content: flex-start;
}

.hero__content {
  max-width: 760px;
  color: inherit;
}

.hero__content--compact {
  max-width: 700px;
}

.hero__content p {
  margin: 0;
}

.hero__subheading {
  margin-bottom: 18px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__subheading :where(p, div, span) {
  margin: 0;
}

.hero__title {
  margin: 0;
  font-family: var(--font-heading, inherit);
  font-size: clamp(3rem, 6.3vw, 5.5rem);
  font-weight: 500;
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.hero__title :where(h1, div, span) {
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.hero__rte {
  max-width: 56ch;
  margin-top: 16px;
}

.hero__rte,
.hero__rte :where(p, span, strong, em, a, ul, ol, li, blockquote) {
  color: var(--hero-rtf-color, inherit) !important;
  font-family: var(--hero-rtf-font-family, inherit) !important;
  font-size: var(--hero-rtf-font-size, inherit) !important;
  font-weight: var(--hero-rtf-font-weight, inherit) !important;
  font-style: var(--hero-rtf-font-style, inherit) !important;
  text-transform: var(--hero-rtf-text-transform, inherit) !important;
}

.hero__rte p + p {
  margin-top: 0.85rem;
}

.hero__button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.hero__button {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero__content__wrapper {
    align-items: flex-start;
    padding: 28px 20px 26px;
  }

  .hero__button-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .hero__button,
  .hero__button > * {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .hero__content {
    max-width: 620px;
  }

  .hero__button-group {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
  }

  .hero__button,
  .hero__button > * {
    width: auto;
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: clamp(2.4rem, 14vw, 3rem);
  }
}
`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

const geomodifierConfig = createStyledTextConfig({
  kind: "plain",
  label: "Geomodifier",
  includeColor: true,
});

const headingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Heading",
  includeColor: true,
});

const descriptionConfig = createStyledTextConfig({
  kind: "richText",
  label: "Description",
  includeColor: true,
});

const defaultOverlayColor: ThemeColor = {
  selectedColor: "palette-secondary",
  contrastingColor: "palette-secondary-contrast",
};

type ImageFieldProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
};

type HeroCtaRow = {
  item: ComprehensiveCTAValue;
};

type CasualDiningNewHeroProps = {
  section: {
    visibleOnLivePage: boolean;
    overlayColor: ThemeColor;
  };
  background: ImageFieldProps;
  geomodifier: StyledPlainTextProps;
  heading: StyledPlainTextProps;
  description: StyledRichTextProps;
  ctas: HeroCtaRow[];
  id?: string;
  puck?: {
    isEditing?: boolean;
  };
};

type CasualDiningNewHeroFieldProps = Omit<
  CasualDiningNewHeroProps,
  "id" | "puck"
>;

const fields: YextFields<CasualDiningNewHeroFieldProps> = {
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
      overlayColor: {
        label: "Overlay Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  background: {
    label: "Background Image",
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: "Image",
        filter: {
          types: ["type.image"],
        },
      },
      aspectRatio: {
        label: "Aspect Ratio",
        type: "basicSelector",
        options: ThemeOptions.ASPECT_RATIO,
      },
      imageConstrain: {
        label: "Image Constrain",
        type: "select",
        options: [
          { label: "Fixed", value: "fixed" },
          { label: "Filled", value: "filled" },
        ],
      },
    },
  },
  geomodifier: {
    label: "Geomodifier",
    type: "object",
    objectFields: geomodifierConfig.fields!,
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: headingConfig.fields!,
  },
  description: {
    label: "Description",
    type: "object",
    objectFields: descriptionConfig.fields!,
  },
  ctas: {
    label: "Calls to Action",
    type: "array",
    arrayFields: {
      item: {
        label: "CTA",
        type: "comprehensiveCTA",
      },
    },
    defaultItemProps: {
      item: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              label: {
                defaultValue: "",
                hasLocalizedValue: "true" as const,
              },
              link: {
                defaultValue: "#",
                hasLocalizedValue: "true" as const,
              },
              openInNewTab: false,
              ctaType: "textAndLink",
            },
            constantValueEnabled: true,
          },
          openInNewTab: false,
        },
        styles: {
          variant: "secondary",
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            borderRadius: "default",
          },
        },
      },
    },
    getItemSummary: (_row: HeroCtaRow, index?: number) =>
      `CTA ${(index ?? 0) + 1}`,
  },
};

const defaultCtas: HeroCtaRow[] = [
  {
    item: {
      data: {
        actionType: "link",
        cta: {
          field: "",
          selectedType: "textAndLink",
          constantValue: {
            label: {
              defaultValue: "ORDER FOR PICKUP",
              hasLocalizedValue: "true" as const,
            },
            link: {
              defaultValue: "#",
              hasLocalizedValue: "true" as const,
            },
            openInNewTab: false,
            ctaType: "textAndLink",
          },
          constantValueEnabled: true,
        },
        openInNewTab: false,
      },
      styles: {
        variant: "primary",
        color: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
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
      },
    },
  },
  {
    item: {
      data: {
        actionType: "link",
        cta: {
          field: "",
          selectedType: "textAndLink",
          constantValue: {
            label: {
              defaultValue: "ORDER FOR DELIVERY",
              hasLocalizedValue: "true" as const,
            },
            link: {
              defaultValue: "#",
              hasLocalizedValue: "true" as const,
            },
            openInNewTab: false,
            ctaType: "textAndLink",
          },
          constantValueEnabled: true,
        },
        openInNewTab: false,
      },
      styles: {
        variant: "primary",
        color: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
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
      },
    },
  },
  {
    item: {
      data: {
        actionType: "link",
        cta: {
          field: "",
          selectedType: "textAndLink",
          constantValue: {
            label: {
              defaultValue: "VIEW MENU",
              hasLocalizedValue: "true" as const,
            },
            link: {
              defaultValue: "#featured-menu",
              hasLocalizedValue: "true" as const,
            },
            openInNewTab: false,
            ctaType: "textAndLink",
          },
          constantValueEnabled: true,
        },
        openInNewTab: false,
      },
      styles: {
        variant: "secondary",
        button: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
          letterSpacing: "default",
          borderRadius: "default",
        },
      },
    },
  },
];

const CasualDiningNewHeroComponent: PuckComponent<CasualDiningNewHeroProps> = (
  props,
) => {
  const streamDocument = useDocument<{ locale?: string }>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const resolvedBackgroundImage = props.background?.image
    ? (resolveComponentData(props.background.image, locale, streamDocument) as
        ImageType | ComplexImageType | TranslatableAssetImage | undefined)
    : undefined;
  const resolvedBackgroundImageUrl =
    resolvedBackgroundImage && "url" in resolvedBackgroundImage
      ? resolvedBackgroundImage.url
      : resolvedBackgroundImage &&
          "image" in resolvedBackgroundImage &&
          resolvedBackgroundImage.image
        ? resolvedBackgroundImage.image.url
        : "";
  const ctaRows = props.ctas ?? defaultCtas;
  const showBackgroundImage = Boolean(
    resolvedBackgroundImage && resolvedBackgroundImageUrl,
  );
  const overlayColor = props.section.overlayColor ?? defaultOverlayColor;
  const heroSurfaceBackground: ThemeColor = showBackgroundImage
    ? overlayColor
    : {
        selectedColor: "white",
        contrastingColor: "palette-quaternary",
      };
  const heroSurfaceStyle = getSurfaceColorStyle(
    heroSurfaceBackground,
    streamDocument,
  );
  const overlayColorCss =
    getThemeColorCssValue(overlayColor) ??
    getThemeColorCssValue(defaultOverlayColor);
  const overlayBackground = showBackgroundImage
    ? `linear-gradient(180deg, color-mix(in srgb, ${overlayColorCss} 30%, transparent) 0%, color-mix(in srgb, ${overlayColorCss} 42%, transparent) 34%, color-mix(in srgb, ${overlayColorCss} 62%, transparent) 100%), linear-gradient(90deg, color-mix(in srgb, ${overlayColorCss} 36%, transparent) 0%, color-mix(in srgb, ${overlayColorCss} 22%, transparent) 48%, color-mix(in srgb, ${overlayColorCss} 46%, transparent) 100%)`
    : undefined;

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningNewHero${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <RootStyle>
          <Background
            as="section"
            background={heroSurfaceBackground}
            className="index-hero"
            style={heroSurfaceStyle}
          >
            <div className="frame">
              <div className="hero__video frame__item">
                <div
                  className="video-background screen-height-full--mobile"
                  style={{
                    backgroundColor:
                      getThemeColorCssValue(heroSurfaceBackground) ?? "inherit",
                  }}
                >
                  {showBackgroundImage ? (
                    <div className="video__poster">
                      <EntityField
                        displayName="Background Image"
                        fieldId={props.background.image.field}
                        constantValueEnabled={
                          props.background.image.constantValueEnabled
                        }
                        fullHeight
                      >
                        <div className="image__hero__frame">
                          <div className="image__hero__pane">
                            <div className="image__hero__scale image__fill">
                              <Image
                                image={
                                  resolvedBackgroundImage as
                                    | ImageType
                                    | ComplexImageType
                                    | TranslatableAssetImage
                                }
                                className="hero__media-image"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </EntityField>
                    </div>
                  ) : null}
                  <Background
                    as="div"
                    background={showBackgroundImage ? overlayColor : heroSurfaceBackground}
                    className="hero__content__wrapper content-align--bottom-left"
                    style={{ background: overlayBackground }}
                  >
                    <div className="hero__content hero__content--compact">
                      <div className="hero__subheading">
                        <EntityField
                          displayName="Geomodifier"
                          fieldId={props.geomodifier.data.text.field}
                          constantValueEnabled={
                            props.geomodifier.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="plain"
                            {...props.geomodifier}
                            tag="p"
                          />
                        </EntityField>
                      </div>
                      <div className="hero__title">
                        <EntityField
                          displayName="Heading"
                          fieldId={props.heading.data.text.field}
                          constantValueEnabled={
                            props.heading.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="plain"
                            {...props.heading}
                            tag="h1"
                          />
                        </EntityField>
                      </div>
                      <div className="hero__rte body-medium block-padding">
                        <EntityField
                          displayName="Description"
                          fieldId={props.description.data.text.field}
                          constantValueEnabled={
                            props.description.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="richText"
                            {...props.description}
                          />
                        </EntityField>
                      </div>
                      <div className="hero__button-group">
                        {ctaRows.map((row, index) => {
                          const resolvedCta = row?.item ?? defaultCtas[index]?.item;
                          if (!resolvedCta) {
                            return null;
                          }

                          const ctaValue = {
                            data: resolvedCta.data,
                            styles: resolvedCta.styles,
                            className: resolvedCta.className,
                            eventName: resolvedCta.eventName,
                            sx: resolvedCta.sx,
                          } as Partial<ComprehensiveCTAValue>;

                          return (
                            <div key={index} className="hero__button">
                              <EntityField
                                displayName="Hero CTA"
                                fieldId={resolvedCta.data.cta.field}
                                constantValueEnabled={
                                  resolvedCta.data.cta.constantValueEnabled
                                }
                              >
                                <ComprehensiveCTA value={ctaValue} />
                              </EntityField>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Background>
                </div>
              </div>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningHero: YextComponentConfig<CasualDiningNewHeroFieldProps> =
  {
    label: "Hero",
    fields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        overlayColor: defaultOverlayColor,
      },
      background: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
            width: 1900,
            height: 1267,
            alternateText: "Guest dining in a moody restaurant setting",
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0,
        imageConstrain: "filled",
      },
      geomodifier: {
        ...geomodifierConfig.defaultProps,
        data: {
          text: {
            field: "geomodifier",
            constantValue: {
              defaultValue: "",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: false,
          },
        },
      } as StyledPlainTextProps,
      heading: {
        ...headingConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "Order Online from [[name]] Restaurant",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledPlainTextProps,
      description: {
        ...descriptionConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue:
                "[[name]] is an upscale burger restaurant located in [[address.city]], [[address.region]]. We offer dine-in, takeout, delivery, curbside pickup, weekend brunch, and weekday happy hour.",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledRichTextProps,
      ctas: defaultCtas,
    },
    render: (props) => <CasualDiningNewHeroComponent {...props} />,
  };
