import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  createItemSource,
  getAnalyticsScopeHash,
  getDefaultRTF,
  msg,
  resolveComponentData,
  resolveLocalizedAssetImage,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type EnhancedTranslatableCTA,
  type ComprehensiveCTAValue,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";

type FeaturedCardImageAppearance = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
};

type FeaturedCardTextAppearance = {
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
};

type FeaturedCardItem = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: YextEntityField<TranslatableString>;
  description: YextEntityField<TranslatableRichText>;
  cta: YextEntityField<EnhancedTranslatableCTA>;
};

type FeaturedCardStyles = {
  backgroundColor: ThemeColor;
  image: FeaturedCardImageAppearance;
  title: FeaturedCardTextAppearance;
  description: FeaturedCardTextAppearance;
  cta: ComprehensiveCTAValue["styles"];
};

type FeaturedContentProps = {
  items: typeof featuredSource.value;
  styles: FeaturedCardStyles;
};

export type YextCafeAndCoffeeShopFeaturedProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
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
    fontColor: ThemeColor | undefined;
  };
  content: FeaturedContentProps;
};

const featured1Image =
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg";
const featured2Image =
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg";
const featured3Image =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultCTAButtonStyles: NonNullable<
  ComprehensiveCTAValue["styles"]["button"]
> = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  borderRadius: "default",
  letterSpacing: "default",
};

const createTranslatableString = (value: string): TranslatableString => ({
  defaultValue: value,
  hasLocalizedValue: "true",
});

const resolveTranslatableStringValue = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback = "",
) =>
  value
    ? resolveComponentData(value, locale, streamDocument)?.trim() || fallback
    : fallback;

const createTextField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableString> => ({
  field,
  constantValue: createTranslatableString(value),
  constantValueEnabled,
});

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage> => ({
  field: "",
  constantValue: {
    url,
    width,
    height,
    alternateText: createTranslatableString(altText),
  },
  constantValueEnabled: true,
});

const createCTA = (
  label: string,
  link: string,
): YextEntityField<EnhancedTranslatableCTA> => ({
  field: "",
  constantValue: {
    label: createTranslatableString(label),
    link: createTranslatableString(link),
    linkType: "URL",
    normalizeLink: true,
    openInNewTab: false,
    ctaType: "textAndLink",
  },
  constantValueEnabled: true,
});

const createRtfField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableRichText> => ({
  field,
  constantValue: {
    defaultValue: getDefaultRTF(value),
    hasLocalizedValue: "true",
  },
  constantValueEnabled,
});

const createFeaturedCard = (
  imageUrl: string,
  altText: string,
  title: string,
  description: string,
  buttonLabel: string,
): FeaturedCardItem => ({
  image: createImageField(imageUrl, 1267, 1900, altText),
  title: {
    field: "",
    constantValue: createTranslatableString(title),
    constantValueEnabled: true,
  },
  description: createRtfField(description),
  cta: createCTA(buttonLabel, "#"),
});

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

#featured-items,
#featured-items * {
  box-sizing: border-box;
}

#featured-items .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

#featured-items .button.button--outline {
  background-color: transparent !important;
}

.cafe-scope.no-touchevents #featured-items .button.button--has-fill:hover,
.cafe-scope.no-touchevents #featured-items .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#featured-items {
  margin: 0;
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-featured-bg, #be865c);
}

#featured-items .featured__inner {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#featured-items .featured__title {
  margin: 0 0 2rem;
  color: var(--cr-featured-heading, #000);
  text-align: center;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

#featured-items .featured__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

#featured-items .featured-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  height: auto;
  min-height: 0;
}

#featured-items .featured-card__image {
  margin: 0;
  width: 100%;
}

#featured-items .featured-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#featured-items .featured-card__content {
  display: grid;
  gap: 1rem;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
}

#featured-items .featured-card--no-image .featured-card__content {
  margin-top: auto;
}

#featured-items .featured-card__content h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.12;
  font-weight: 700;
}

#featured-items .featured-card__content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  opacity: 0.85;
}

#featured-items .featured-card__cta {
  width: 100%;
  justify-self: stretch;
  align-self: stretch;
  border-width: 1px;
}

@media (max-width: 1023px) {
  #featured-items .featured__inner {
    padding-inline: 30px;
  }

  #featured-items .featured__title {
    text-align: left;
  }

  #featured-items .featured__grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 700px) {
  #featured-items .featured__inner {
    padding-inline: 14px;
  }
}`;

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

const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): image is ImageType | ComplexImageType | TranslatableAssetImage => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  if (
    "image" in image &&
    image.image &&
    typeof image.image === "object" &&
    "url" in image.image &&
    typeof image.image.url === "string" &&
    image.image.url.trim()
  ) {
    return true;
  }

  return false;
};

const resolveCardImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  locale: string,
): ImageType | ComplexImageType | TranslatableAssetImage | undefined => {
  if (hasImageSource(image)) {
    return image;
  }

  const localizedImage = resolveLocalizedAssetImage(
    image as ImageType | TranslatableAssetImage | undefined,
    locale,
  );

  return hasImageSource(localizedImage) ? localizedImage : undefined;
};

const imageAppearanceFields = (): YextFields<FeaturedCardImageAppearance> => ({
  aspectRatio: {
    type: "basicSelector",
    label: msg("fields.options.aspectRatio", "Aspect Ratio"),
    options: [
      { label: "1:1", value: 1 },
      { label: "5:4", value: 1.25 },
      { label: "4:3", value: 1.33 },
      { label: "3:2", value: 1.5 },
      { label: "5:3", value: 1.67 },
      { label: "16:9", value: 1.78 },
      { label: "2:1", value: 2 },
      { label: "3:1", value: 3 },
      { label: "4:1", value: 4 },
      { label: "4:5", value: 0.8 },
      { label: "3:4", value: 0.75 },
      { label: "2:3", value: 0.67 },
      { label: "3:5", value: 0.6 },
      { label: "9:16", value: 0.56 },
      { label: "1:2", value: 0.5 },
      { label: "1:3", value: 0.33 },
      { label: "1:4", value: 0.25 },
    ],
  },
  imageConstrain: {
    label: "Image Constrain",
    type: "select",
    options: [
      { label: "Fixed", value: "fixed" },
      { label: "Filled", value: "filled" },
    ],
  },
});

const textAppearanceFields = (
  label: string,
): YextFields<FeaturedCardTextAppearance> => ({
  styles: {
    label: `${label} Styles`,
    type: "styledText",
  },
  fontColor: {
    label: "Font Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
});

const defaultContent = [
  createFeaturedCard(
    featured1Image,
    "Featured item 1",
    "Seasonal Espresso Flight",
    "A rotating trio of espresso pours selected to highlight bright, rich, and unexpected notes.",
    "Order Now",
  ),
  createFeaturedCard(
    featured2Image,
    "Featured item 2",
    "House Pastry Pairing",
    "Flaky, buttery pastries baked daily and matched with the coffees they love most.",
    "See Menu",
  ),
  createFeaturedCard(
    featured3Image,
    "Featured item 3",
    "Weekend Brunch Picks",
    "Coffee-forward brunch plates and signature drinks built for slower mornings and bigger groups.",
    "Book a Table",
  ),
] satisfies FeaturedCardItem[];

const defaultFeaturedImage: FeaturedCardImageAppearance = {
  aspectRatio: 1.25,
  imageConstrain: "filled",
};

const featuredSource = createItemSource<FeaturedCardItem>({
  label: "Featured Cards",
  mappingFields: {
    image: {
      label: "Card Image",
      type: "entityField",
      filter: {
        types: ["type.image"],
      },
      disableConstantValueToggle: false,
    },
    title: {
      label: "Title",
      type: "entityField",
      filter: {
        includeListsOnly: false,
        types: ["type.string" as const],
      },
      disableConstantValueToggle: false,
    },
    description: {
      label: "Description",
      type: "entityField",
      filter: {
        types: ["type.rich_text_v2"],
      },
      disableConstantValueToggle: false,
    },
    cta: {
      label: "Call to Action",
      type: "entityField",
      filter: {
        types: ["type.cta"],
      },
      disableConstantValueToggle: false,
    },
  },
  defaultValues: defaultContent,
});

export const YextCafeAndCoffeeShopFeaturedFields: YextFields<YextCafeAndCoffeeShopFeaturedProps> =
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
          label: "Heading",
          type: "entityField",
          filter: {
            includeListsOnly: false,
            types: ["type.string" as const],
          },
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
    content: {
      label: "Content",
      type: "object",
      objectFields: {
        items: {
          label: "Cards",
          ...featuredSource.field,
        },
        styles: {
          label: "Styles",
          type: "object",
          objectFields: {
            backgroundColor: {
              label: "Card Background Color",
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            image: {
              label: "Image",
              type: "object",
              objectFields: imageAppearanceFields(),
            },
            title: {
              label: "Title",
              type: "object",
              objectFields: textAppearanceFields("Title"),
            },
            description: {
              label: "Description",
              type: "object",
              objectFields: textAppearanceFields("Description"),
            },
            cta: {
              label: "Call to Action",
              type: "object",
              objectFields: {
                variant: {
                  label: "Variant",
                  type: "select",
                  options: [
                    { label: "Primary", value: "primary" },
                    { label: "Secondary", value: "secondary" },
                    { label: "Link", value: "link" },
                  ],
                },
                color: {
                  label: "Color",
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
                button: {
                  label: "Button Styles",
                  type: "styledButton",
                },
              },
            },
          },
        },
      },
    },
  };

const YextCafeAndCoffeeShopFeaturedDefaultProps: YextCafeAndCoffeeShopFeaturedProps =
  {
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
    },
    heading: {
      text: createTextField("Featured Items"),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
    content: {
      items: featuredSource.defaultValue,
      styles: {
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
        image: defaultFeaturedImage,
        title: {
          styles: defaultTextStyles,
          fontColor: undefined,
        },
        description: {
          styles: defaultTextStyles,
          fontColor: undefined,
        },
        cta: {
          variant: "primary",
          color: undefined,
          button: defaultCTAButtonStyles,
        },
      },
    },
  };

const YextCafeAndCoffeeShopFeaturedComponent: PuckComponent<
  YextCafeAndCoffeeShopFeaturedProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const featuredImage = {
    ...defaultFeaturedImage,
    ...props.content.styles.image,
  };
  const items = featuredSource.resolveItems(
    props.content.items,
    streamDocument,
  );
  const cardImageWrapperStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio:
      featuredImage.aspectRatio > 0 ? featuredImage.aspectRatio : undefined,
    overflow: featuredImage.imageConstrain === "filled" ? "hidden" : undefined,
  };
  const cardImageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: featuredImage.aspectRatio > 0 ? "100%" : "auto",
    objectFit: featuredImage.imageConstrain === "filled" ? "cover" : "contain",
  };

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopFeatured${getAnalyticsScopeHash(props.id ?? "default")}`}
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
              "--cr-featured-bg": toThemeCss(
                props.section.backgroundColor.selectedColor,
              ),
              "--cr-featured-heading":
                toThemeCss(props.heading.fontColor?.selectedColor) ??
                sectionForeground,
              "--cr-featured-card-title":
                toThemeCss(
                  props.content.styles.title.fontColor?.selectedColor,
                ) ?? sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            id="featured-items"
            className="local-section section-featured"
            background={props.section.backgroundColor}
          >
            <div className="featured__inner">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="featured__title"
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
              <EntityField
                displayName="Featured Cards"
                fieldId={props.content.items.field}
                constantValueEnabled={props.content.items.constantValueEnabled}
              >
                <div className="featured__grid">
                  {items.map((item, index) => {
                    const title = resolveTranslatableStringValue(
                      item.title,
                      locale,
                      streamDocument,
                      "",
                    );
                    const cardForeground =
                      toThemeCss(
                        props.content.styles.backgroundColor.contrastingColor,
                      ) ?? sectionForeground;
                    const descriptionColor =
                      toThemeCss(
                        props.content.styles.description.fontColor
                          ?.selectedColor,
                      ) ?? cardForeground;
                    const descriptionRichTextStyleOverrides = {
                      ...props.content.styles.description.styles,
                      color: descriptionColor,
                    };
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
                    const resolvedCardImage = resolveCardImageSource(
                      item.image,
                      locale,
                    );
                    const hasCardImage = hasImageSource(resolvedCardImage);
                    const itemImageWrapperStyle: React.CSSProperties = {
                      ...cardImageWrapperStyle,
                    };
                    const itemImageStyle: React.CSSProperties = {
                      ...cardImageStyle,
                    };
                    const cta = item.cta;
                    const ctaValue: ComprehensiveCTAValue | undefined = cta
                      ? {
                          data: {
                            actionType: "link",
                            cta: {
                              field: "",
                              constantValue: cta,
                              constantValueEnabled: true,
                              selectedType: cta.ctaType,
                            },
                            openInNewTab: cta.openInNewTab ?? false,
                          },
                          styles: props.content.styles.cta,
                        }
                      : undefined;
                    const cardImageContent = (
                      <div style={itemImageWrapperStyle}>
                        <Image
                          image={resolvedCardImage!}
                          className="h-full"
                          style={itemImageStyle}
                        />
                      </div>
                    );

                    return (
                      <article
                        key={`${title || "card"}-${index}`}
                        className={`featured-card${hasCardImage ? "" : " featured-card--no-image"}`}
                        style={{
                          backgroundColor: toThemeCss(
                            props.content.styles.backgroundColor.selectedColor,
                          ),
                          color: toThemeCss(
                            props.content.styles.backgroundColor
                              .contrastingColor,
                          ),
                        }}
                      >
                        {hasCardImage ? (
                          <figure className="featured-card__image">
                            {cardImageContent}
                          </figure>
                        ) : null}
                        <div className="featured-card__content">
                          <h3
                            style={{
                              color: toThemeCss(
                                props.content.styles.title.fontColor
                                  ?.selectedColor,
                              ),
                              fontFamily:
                                props.content.styles.title.styles.fontFamily ===
                                "default"
                                  ? undefined
                                  : props.content.styles.title.styles
                                      .fontFamily,
                              fontSize:
                                props.content.styles.title.styles.fontSize ===
                                "default"
                                  ? undefined
                                  : props.content.styles.title.styles.fontSize,
                              fontWeight:
                                props.content.styles.title.styles.fontWeight ===
                                "default"
                                  ? undefined
                                  : props.content.styles.title.styles
                                      .fontWeight,
                              fontStyle:
                                props.content.styles.title.styles.fontStyle ===
                                "default"
                                  ? undefined
                                  : props.content.styles.title.styles.fontStyle,
                              textTransform:
                                props.content.styles.title.styles
                                  .textTransform === "default"
                                  ? undefined
                                  : props.content.styles.title.styles
                                      .textTransform,
                            }}
                          >
                            {title}
                          </h3>
                          <div style={{ color: descriptionColor }}>
                            {React.isValidElement(resolvedDescription) ? (
                              resolvedDescription
                            ) : typeof resolvedDescription === "string" ? (
                              <MaybeRTF
                                data={resolvedDescription}
                                richTextStyleOverrides={
                                  descriptionRichTextStyleOverrides
                                }
                              />
                            ) : null}
                          </div>
                          {ctaValue ? (
                            <ComprehensiveCTA
                              value={ctaValue}
                              className="button featured-card__cta"
                            />
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopFeatured: YextComponentConfig<YextCafeAndCoffeeShopFeaturedProps> =
  {
    label: "Featured",
    fields: YextCafeAndCoffeeShopFeaturedFields,
    defaultProps: YextCafeAndCoffeeShopFeaturedDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopFeaturedComponent {...props} />,
  };
