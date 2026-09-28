import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  createStyledTextConfig,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  StyledTextComponent,
  ThemeOptions,
  useDocument,
  VisibilityWrapper,
  type ComprehensiveCTAValue,
  type StyledImageValue,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

const themeVars: React.CSSProperties = {
  ["--COLOR-BG" as string]: "var(--palette-tertiary)",
  ["--COLOR-BG-ACCENT" as string]: "var(--palette-tertiary)",
  ["--COLOR-TEXT" as string]: "var(--palette-quaternary)",
  ["--COLOR-BORDER" as string]: "var(--palette-tertiary)",
  ["--COLOR-ACCENT" as string]: "var(--palette-secondary)",
  ["--COLOR-ACCENT-HOVER" as string]: "var(--palette-primary)",
  ["--borderRadius-button-borderRadius" as string]: "9999px",
  ["--footer-bg" as string]: "var(--palette-quaternary)",
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

.wrapper--full {
  width: min(100%, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.color-scheme-1 {
  background: var(--COLOR-BG);
  color: var(--COLOR-TEXT);
}

.promo-banner {
  position: relative;
  min-height: 660px;
  overflow: hidden;
  isolation: isolate;
}

.promo-banner__media,
.promo-banner__image,
.promo-banner__overlay,
.promo-banner__content {
  position: absolute;
  inset: 0;
}

.promo-banner__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-banner__overlay {
  background:
    linear-gradient(180deg, rgba(12, 17, 34, 0.3) 0%, rgba(12, 17, 34, 0.42) 34%, rgba(12, 17, 34, 0.62) 100%),
    linear-gradient(90deg, rgba(22, 28, 52, 0.36) 0%, rgba(22, 28, 52, 0.22) 48%, rgba(22, 28, 52, 0.46) 100%);
}

.promo-banner__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: inherit;
  padding: clamp(20px, 3vw, 36px);
}

.promo-banner__inner {
  width: min(100%, 1500px);
  min-height: 100%;
  margin: 0 auto;
  color: inherit;
  text-align: center;
  display: grid;
  align-content: center;
  justify-items: center;
}

.promo-banner__title {
  max-width: none;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(3.6rem, 7.8vw, 8.3rem);
  font-weight: 600;
  letter-spacing: -0.05rem;
  line-height: 0.92;
}

.promo-banner__title :where(h1, h2, h3, h4, h5, h6, div, span, p) {
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.promo-banner__description {
  max-width: 760px;
  margin: 1.5rem auto 0;
  color: inherit;
  font-size: clamp(1.05rem, 1.55vw, 1.35rem);
  line-height: 1.55;
}

.promo-banner__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 2rem;
}

@media (max-width: 1439px) {
  :root {
    --outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
  }
}

@media (max-width: 768px) {
  .promo-banner {
    min-height: 620px;
  }

  .promo-banner__content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .promo-banner__actions > * {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .promo-banner__actions > * {
    width: auto;
  }
}
`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

type CasualDiningPromoProps = {
  section: {
    visibleOnLivePage: boolean;
    overlayColor: ThemeColor;
  };
  title: StyledPlainTextProps;
  description: StyledRichTextProps;
  image: {
    image: YextEntityField<any>;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
  primaryCta: Partial<ComprehensiveCTAValue>;
  secondaryCta: Partial<ComprehensiveCTAValue>;
};

type RuntimeProps = CasualDiningPromoProps & {
  id?: string;
  puck?: {
    isEditing?: boolean;
  };
};

const titleConfig = createStyledTextConfig({
  kind: "plain",
  label: "Title",
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

const fields: YextFields<CasualDiningPromoProps> = {
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
  title: {
    label: "Title",
    type: "object",
    objectFields: titleConfig.fields!,
  },
  description: {
    label: "Description",
    type: "object",
    objectFields: descriptionConfig.fields!,
  },
  image: {
    label: "Image",
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
};

const CasualDiningPromoComponent = (props: RuntimeProps) => {
  const streamDocument = useDocument<any>();
  const locale = streamDocument.locale ?? "en";
  const resolvedImage = resolveComponentData(
    props.image.image,
    locale,
    streamDocument,
  ) as { url?: string; image?: { url?: string } } | undefined;
  const resolvedImageUrl =
    resolvedImage?.url ?? resolvedImage?.image?.url ?? "";
  const showImage = Boolean(resolvedImage && resolvedImageUrl);
  const overlayColor = props.section.overlayColor ?? defaultOverlayColor;
  const promoSurfaceBackground: ThemeColor = showImage
    ? overlayColor
    : {
        selectedColor: "black",
        contrastingColor: "white",
      };
  const sectionSurfaceStyle = getSurfaceColorStyle(
    promoSurfaceBackground,
    streamDocument,
  );
  const overlayColorCss =
    getThemeColorCssValue(overlayColor) ??
    getThemeColorCssValue(defaultOverlayColor);
  const overlayBackground = showImage
    ? `linear-gradient(180deg, color-mix(in srgb, ${overlayColorCss} 30%, transparent) 0%, color-mix(in srgb, ${overlayColorCss} 42%, transparent) 34%, color-mix(in srgb, ${overlayColorCss} 62%, transparent) 100%), linear-gradient(90deg, color-mix(in srgb, ${overlayColorCss} 36%, transparent) 0%, color-mix(in srgb, ${overlayColorCss} 22%, transparent) 48%, color-mix(in srgb, ${overlayColorCss} 46%, transparent) 100%)`
    : undefined;
  const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius:
      props.image.styles?.borderRadius === "default"
        ? undefined
        : props.image.styles?.borderRadius,
  };
  const imageWrapperStyle: React.CSSProperties = {
    height: "100%",
    overflow: "hidden",
  };

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningPromo${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <RootStyle>
          <Background
            as="section"
            background={promoSurfaceBackground}
            className="promo-banner color-scheme-1"
            id="promo-truffle-mac"
            style={sectionSurfaceStyle}
          >
            <div className="promo-banner__media">
              {showImage ? (
                <EntityField
                  displayName="Image"
                  fieldId={props.image.image.field}
                  constantValueEnabled={props.image.image.constantValueEnabled}
                  fullHeight
                >
                  <div style={imageWrapperStyle}>
                    <Image
                      image={resolvedImage as any}
                      className="promo-banner__image"
                      style={imageStyle}
                    />
                  </div>
                </EntityField>
              ) : null}
            </div>
            <Background
              as="div"
              background={showImage ? overlayColor : promoSurfaceBackground}
              className="promo-banner__content"
              style={{ background: overlayBackground }}
            >
              <div className="promo-banner__inner wrapper--full">
                <div className="promo-banner__title">
                  <EntityField
                    displayName="Title"
                    fieldId={props.title.data.text.field}
                    constantValueEnabled={
                      props.title.data.text.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="plain"
                      {...props.title}
                      tag="h2"
                    />
                  </EntityField>
                </div>
                <div className="promo-banner__description">
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
                <div className="promo-banner__actions">
                  <EntityField
                    displayName="Primary CTA"
                    fieldId={props.primaryCta.data?.cta.field}
                    constantValueEnabled={
                      props.primaryCta.data?.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.primaryCta.data,
                        styles: props.primaryCta.styles,
                      }}
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary CTA"
                    fieldId={props.secondaryCta.data?.cta.field}
                    constantValueEnabled={
                      props.secondaryCta.data?.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.secondaryCta.data,
                        styles: props.secondaryCta.styles,
                      }}
                    />
                  </EntityField>
                </div>
              </div>
            </Background>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningPromo: YextComponentConfig<CasualDiningPromoProps> =
  {
    label: "Promo",
    fields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        overlayColor: defaultOverlayColor,
      },
      title: {
        ...titleConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue:
                "Black Truffle Mac & Cheese for the right comfort-food mood.",
              hasLocalizedValue: "true",
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
                "Creamy cavatappi pasta tossed in a smoked gouda and white cheddar blend, finished with black truffle oil, toasted breadcrumbs, and fresh herbs.",
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
      } as StyledRichTextProps,
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
            alternateText: "Promotional image",
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      primaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              label: {
                defaultValue: "EXPLORE THE DISH",
                hasLocalizedValue: "true",
              },
              link: {
                defaultValue: "#",
                hasLocalizedValue: "true",
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
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              label: {
                defaultValue: "VIEW FULL MENU",
                hasLocalizedValue: "true",
              },
              link: {
                defaultValue: "#featured-menu",
                hasLocalizedValue: "true",
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
    render: (props) => (
      <CasualDiningPromoComponent {...(props as RuntimeProps)} />
    ),
  };
