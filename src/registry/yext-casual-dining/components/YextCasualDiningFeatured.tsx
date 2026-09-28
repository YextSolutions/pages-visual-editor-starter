import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { type ComplexImageType, type ImageType } from "@yext/pages-components";
import { type PuckComponent } from "@puckeditor/core";
import { getDefaultRTF } from "@yext/visual-editor";
import {
  Background,
  ComprehensiveCTA,
  createItemSource,
  createStyledTextConfig,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
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
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
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

.body-medium,
.grid__description,
.product-item__caption {
font-size: var(--font-body-medium);
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
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.heading-small {
font-size: clamp(1.4rem, 1.8vw, 1.8rem);
}

.heading-small :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.btn {
display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding-inline: 1.7rem;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    transform 180ms ease,
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    opacity 180ms ease;
}

.btn:hover {
transform: translateY(-1px);
  color: inherit;
}

.btn--solid {
box-shadow: none;
}

.btn--primary {
background: var(--BTN-PRIMARY-BG);
  color: inherit;
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.grid {
display: grid;
  gap: var(--gutter);
}

.grid--products {
grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid__heading-text {
max-width: 980px;
}

.grid__heading-holder--inline {
display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gutter);
  flex-wrap: wrap;
}

.grid__heading-actions {
display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  padding-top: 0.15em;
}

.grid__items-holder {
width: 100%;
  margin-top: 18px;
}

.product-item {
position: relative;
}

.product-item--card {
background: var(--COLOR-BG-ACCENT);
  color: var(--COLOR-TEXT);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-item__image {
position: relative;
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  background: transparent;
}

.product-item__bg {
position: absolute;
  inset: 0;
  background: transparent;
}

.product-item__bg figure {
width: 100%;
  height: 100%;
  margin: 0;
}

.product-item__bg :is(img, .product-packshot) {
display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-item__info {
padding: 20px 20px 22px;
  flex: 1;
}

.product-item--centered .product-item__info {
text-align: center;
}

.product-item__title {
margin: 0;
  font-family: var(--font-heading);
  font-size: 1.32rem;
  line-height: 1.06;
}

.product-item__title :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.product-item__caption {
margin: 12px 0 0;
  color: inherit;
  opacity: 0.76;
}

.faq-shell .wrapper {
width: min(980px, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

@media (max-width: 1279px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}

.grid--products {
grid-template-columns: repeat(3, minmax(0, 1fr));
}
}

@media (max-width: 768px) {
.hero__button .btn {
width: 100%;
}

.grid--products {
grid-template-columns: 1fr;
}

.grid__heading-holder--inline {
flex-direction: column;
}

.grid__heading-actions {
justify-content: flex-start;
  width: 100%;
}

.grid__heading-actions .btn {
width: 100%;
}

.promo-banner__actions .btn {
width: 100%;
}
}

@media (min-width: 481px) and (max-width: 768px) {
.hero__button .btn {
width: auto;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

type FeaturedCardImageStyles = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type FeaturedCardFields = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: YextEntityField<TranslatableString>;
  description: YextEntityField<TranslatableRichText>;
};

type FeaturedCardStyles = {
  image: FeaturedCardImageStyles;
  title: Pick<StyledPlainTextProps, "fontOptions">;
  description: Pick<StyledRichTextProps, "fontOptions">;
};

type CasualDiningFeaturedProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
  };
  heading: StyledPlainTextProps;
  description: StyledRichTextProps;
  sectionCta: ComprehensiveCTAValue;
  cards: {
    data: typeof featuredCardsSource.value;
    styles: FeaturedCardStyles;
  };
  id?: string;
  puck?: {
    isEditing?: boolean;
  };
};

type CasualDiningFeaturedFieldProps = Omit<
  CasualDiningFeaturedProps,
  "id" | "puck"
>;

const featuredItems = [
  {
    title: "Redwood Smokehouse Burger",
    description:
      "Smoked cheddar, crispy onions, bourbon bacon jam, arugula, and redwood sauce.",
    image:
      "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
    alt: "Featured menu image",
  },
  {
    title: "South Lamar Chicken Sandwich",
    description:
      "Buttermilk fried chicken with hot honey glaze, pickles, lettuce, and chipotle aioli.",
    image:
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
    alt: "Featured menu image",
  },
  {
    title: "Hill Country Steak Salad",
    description:
      "Skirt steak, avocado, roasted corn, cotija, tortilla strips, and cilantro-lime vinaigrette.",
    image:
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
    alt: "Featured menu image",
  },
  {
    title: "Black Truffle Mac & Cheese",
    description:
      "Creamy cavatappi with smoked gouda, white cheddar, black truffle oil, toasted breadcrumbs, and herbs.",
    image:
      "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
    alt: "Featured menu image",
  },
];

const featuredCardsSource = createItemSource<FeaturedCardFields>({
  label: "Cards",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: {
        types: ["type.image"],
      },
    },
    title: {
      label: "Title",
      type: "entityField",
      filter: {
        types: ["type.string"],
      },
    },
    description: {
      label: "Description",
      type: "entityField",
      filter: {
        types: ["type.rich_text_v2"],
      },
    },
  },
  defaultValues: featuredItems.map((item) => ({
    image: {
      field: "",
      constantValue: {
        url: item.image,
        width: 1267,
        height: 1900,
        alternateText: item.alt,
      },
      constantValueEnabled: true,
    },
    title: {
      field: "",
      constantValue: {
        defaultValue: item.title,
        hasLocalizedValue: "true" as const,
      },
      constantValueEnabled: true,
    },
    description: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(item.description),
        hasLocalizedValue: "true" as const,
      },
      constantValueEnabled: true,
    },
  })),
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

const cardTitleConfig = createStyledTextConfig({
  kind: "plain",
  label: "Title",
  includeColor: true,
});

const cardDescriptionConfig = createStyledTextConfig({
  kind: "richText",
  label: "Description",
  includeColor: true,
});

const fields: YextFields<CasualDiningFeaturedFieldProps> = {
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
  sectionCta: {
    label: "Section CTA",
    type: "comprehensiveCTA",
  },
  cards: {
    label: "Cards",
    type: "object",
    objectFields: {
      data: featuredCardsSource.field,
      styles: {
        label: "Styles",
        type: "object",
        objectFields: {
          image: {
            label: "Image",
            type: "object",
            objectFields: {
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
          title: {
            label: "Title",
            type: "object",
            objectFields: {
              fontOptions: cardTitleConfig.fields!.fontOptions,
            },
          },
          description: {
            label: "Description",
            type: "object",
            objectFields: {
              fontOptions: cardDescriptionConfig.fields!.fontOptions,
            },
          },
        },
      },
    },
  },
};

const defaultCardStyles: FeaturedCardStyles = {
  image: {
    aspectRatio: 1,
    imageConstrain: "filled",
    styles: {
      borderRadius: "default",
    },
  },
  title: {
    fontOptions: cardTitleConfig.defaultProps!.fontOptions,
  },
  description: {
    fontOptions: cardDescriptionConfig.defaultProps!.fontOptions,
  },
};

const CasualDiningFeaturedComponent: PuckComponent<
  CasualDiningFeaturedProps
> = (props) => {
  const streamDocument = useDocument<{ locale?: string }>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const cards = props.cards ?? {
    data: featuredCardsSource.defaultValue,
    styles: defaultCardStyles,
  };
  const cardData = featuredCardsSource.resolveItems(cards.data, streamDocument);
  const cardStyles = cards.styles ?? defaultCardStyles;
  const cardImageStyles = cardStyles.image?.styles;
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section?.backgroundColor,
    streamDocument,
    {
      fallbackBackgroundColor: "var(--colors-palette-secondary)",
    },
  );
  const cardSurfaceStyle = getSurfaceColorStyle(
    props.section?.cardBackgroundColor,
    streamDocument,
    {
      fallbackTextColor: sectionSurfaceStyle?.color,
    },
  );

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningFeatured${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section?.backgroundColor}
            className="index-products section-padding color-scheme-1"
            id="featured-menu"
            style={sectionSurfaceStyle}
          >
            <div className="grid-container wrapper">
              <div className="grid__heading-holder grid__heading-holder--inline">
                <div className="grid__heading-text">
                  <div className="grid__heading heading-small">
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
                        tag="h2"
                      />
                    </EntityField>
                  </div>
                  <div className="grid__description body-medium">
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
                </div>
                <div className="grid__heading-actions">
                  <EntityField
                    displayName="Section CTA"
                    fieldId={props.sectionCta.data.cta.field}
                    constantValueEnabled={
                      props.sectionCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.sectionCta.data,
                        styles: props.sectionCta.styles,
                      }}
                    />
                  </EntityField>
                </div>
              </div>
              <div className="grid__items-holder">
                <EntityField
                  displayName="Cards"
                  fieldId={cards.data.field}
                  constantValueEnabled={cards.data.constantValueEnabled}
                >
                  <div className="grid grid--products">
                    {cardData.map((item, index) => {
                      const image = resolveComponentData(
                        item.image,
                        locale,
                        streamDocument,
                      ) as { url?: string } | undefined;
                      const imageToRender =
                        image &&
                        typeof image === "object" &&
                        "url" in image &&
                        image.url
                          ? image
                          : undefined;

                      return (
                        <article
                          key={index}
                          className={`product-item product-item--centered product-item--outer-text product-item--card${imageToRender ? "" : " product-item--no-image"}`}
                          style={cardSurfaceStyle}
                        >
                          {imageToRender ? (
                            <div
                              className="product-item__image"
                              style={{
                                aspectRatio:
                                  cardStyles.image?.aspectRatio > 0
                                    ? cardStyles.image.aspectRatio
                                    : undefined,
                              }}
                            >
                              <div className="product-item__bg">
                                <figure className="image-wrapper image-wrapper--cover">
                                  <Image
                                    image={imageToRender}
                                    className="product-packshot"
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      height:
                                        cardStyles.image?.aspectRatio > 0
                                          ? "100%"
                                          : "auto",
                                      objectFit:
                                        cardStyles.image?.imageConstrain ===
                                        "filled"
                                          ? "cover"
                                          : "contain",
                                      borderRadius:
                                        cardImageStyles?.borderRadius ===
                                        "default"
                                          ? undefined
                                          : cardImageStyles?.borderRadius,
                                    }}
                                  />
                                </figure>
                              </div>
                            </div>
                          ) : null}
                          <div className="product-item__info">
                            <div className="product-item__title">
                              <StyledTextComponent
                                kind="plain"
                                {...cardStyles.title}
                                data={{
                                  text: {
                                    field: "",
                                    constantValue: item.title ?? "",
                                    constantValueEnabled: true,
                                  },
                                }}
                                tag="h3"
                              />
                            </div>
                            <div className="product-item__caption">
                              <StyledTextComponent
                                kind="richText"
                                {...cardStyles.description}
                                data={{
                                  text: {
                                    field: "",
                                    constantValue:
                                      item.description ?? getDefaultRTF(""),
                                    constantValueEnabled: true,
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </EntityField>
              </div>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningFeatured: YextComponentConfig<CasualDiningFeaturedFieldProps> =
  {
    label: "Featured",
    fields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
        cardBackgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
      heading: {
        ...headingConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "Featured menu items",
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
                "House favorites for brunch, lunch, happy hour, and late takeout.",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledRichTextProps,
      sectionCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              label: {
                defaultValue: "VIEW FULL MENU",
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
        },
      },
      cards: {
        data: featuredCardsSource.defaultValue,
        styles: defaultCardStyles,
      },
    },
    render: (props) => <CasualDiningFeaturedComponent {...props} />,
  };
