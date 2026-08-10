import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  Background,
  EntityField,
  Image,
  getDefaultRTF,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveComponentData,
  MaybeRTF,
  type StreamDocument,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  ComprehensiveCTAValue,
} from "@yext/visual-editor";

type EventsImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type CtaColorState = {
  styles?: {
    variant?: string | null;
    color?: ThemeColor;
  };
};

export type YextCafeAndCoffeeShopEventsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  sectionImage: EventsImageProps;
  content: {
    paragraphs: {
      text: YextEntityField<TranslatableRichText>;
      fontColor?: ThemeColor;
    };
    button: any;
  };
};

const eventImageUrl =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
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

const createRtfField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableRichText> => ({
  field,
  constantValue: {
    en: getDefaultRTF(value),
    hasLocalizedValue: "true",
  },
  constantValueEnabled,
});

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): EventsImageProps => ({
  image: {
    field: "",
    constantValue: {
      url,
      width,
      height,
      alternateText: createTranslatableString(altText),
    },
    constantValueEnabled: true,
  },
  aspectRatio: 1.5,
  imageConstrain: "filled",
  styles: defaultImageStyles,
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
#events-section,
#events-section * {
  box-sizing: border-box;
}

#events-section .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.7rem 1.15rem;
  border-radius: 999px;
  border: 1px solid transparent;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

#events-section .button.button--outline {
  background-color: transparent !important;
}

.cafe-scope.no-touchevents #events-section .button.button--has-fill:hover,
.cafe-scope.no-touchevents #events-section .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#events-section {
  margin: 0;
  padding-block: 0;
  padding-inline: 0;
}

#events-section .events__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(100%, 1440px);
  margin: 0 auto;
}

#events-section .events__grid.events__grid--no-image {
  grid-template-columns: 1fr;
}

#events-section .events__panel {
  min-height: 100%;
}

#events-section .events__panel--text {
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.5rem);
}

#events-section .events__content {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
}

#events-section .events__title {
  margin: 0 0 2rem;
  text-align: left;
  font-size: clamp(28px, 3vw, 46px);
  line-height: 1.15;
  font-weight: 700;
}

#events-section .events__panel--text p {
  margin: 0 0 1rem;
  font-size: 20px;
  line-height: 1.5;
  font-weight: 400;
}

#events-section .events__panel--text p:last-of-type {
  margin-bottom: 0;
}

#events-section .events__cta {
  margin-top: 2rem;
  width: auto;
}

#events-section .events__panel--image {
  width: 100%;
  height: 100%;
  display: flex;
}

#events-section .events__panel--image > div {
  width: 100%;
  height: 100%;
}

#events-section .events__panel--image img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
}

@media (max-width: 1023px) {
  #events-section {
    padding-inline: 30px;
  }

  #events-section .events__grid {
    grid-template-columns: 1fr;
  }

  #events-section .events__panel--text {
    padding: 2.5rem 0;
  }

  #events-section .events__content {
    max-width: 100%;
    margin: 0;
  }

  #events-section .events__panel--image {
    width: calc(100% + 60px);
    margin-inline: -30px;
  }

  #events-section .events__panel--image img {
    height: auto;
  }

  #events-section .events__title {
    font-size: clamp(24px, 6vw, 38px);
  }

  #events-section .events__panel--text p {
    font-size: 16px;
  }
}

@media (max-width: 700px) {
  #events-section {
    padding-inline: 14px;
  }

  #events-section .events__panel--image {
    width: calc(100% + 28px);
    margin-inline: -14px;
  }

  #events-section .events__title {
    font-size: clamp(22px, 8vw, 34px);
  }

  #events-section .events__panel--text p {
    font-size: 16px;
  }
}
`;

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

const hasExplicitCtaColor = (cta: CtaColorState) => {
  const selectedColor = cta.styles?.color?.selectedColor;
  return Boolean(selectedColor && selectedColor !== "default");
};

const getStyledTextCss = (
  styles: StyledTextValue,
  color?: ThemeColor,
): React.CSSProperties => ({
  color: toThemeCss(color?.selectedColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

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

const imageFields = (label: string): YextFields<EventsImageProps> => ({
  image: {
    label: "Image",
    type: "entityField",
    filter: {
      types: ["type.image"],
    },
    disableConstantValueToggle: false,
  },
  aspectRatio: {
    label: "Aspect Ratio",
    type: "number",
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
    label: `${label} Styles`,
    type: "styledImage",
  },
});

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultContent = {
  paragraphs: {
    text: createRtfField(
      "Bring your crew together for birthdays, office parties, and laid-back celebrations in a warm neighborhood setting. Our team can help you plan food, drinks, and space that fit the vibe of your group.",
    ),
    fontColor: undefined,
  },
  button: {
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValue: {
          label: {
            defaultValue: "Plan Your Event",
          },
          link: {
            defaultValue: "#",
          },
          normalizeLink: true,
          openInNewTab: false,
        },
        constantValueEnabled: true,
      },
      openInNewTab: false,
    },
    styles: {
      variant: "secondary",
      color: undefined,
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
  } satisfies ComprehensiveCTAValue,
};

const getEventsCtaClassName = (cta: unknown) => {
  const variant = (cta as { styles?: { variant?: string } }).styles?.variant;

  if (variant === "link") {
    return undefined;
  }

  return variant === "outline" || variant === "secondary"
    ? "button button--outline"
    : "button button--has-fill";
};

const getEventsCtaStyle = (
  cta: CtaColorState,
  backgroundColor: ThemeColor,
  streamDocument?: StreamDocument,
): React.CSSProperties | undefined => {
  const variant = cta.styles?.variant as string | undefined;

  if (
    (variant !== "outline" && variant !== "secondary") ||
    hasExplicitCtaColor(cta)
  ) {
    return undefined;
  }

  const fallbackOutlineColor = isDarkColor(backgroundColor, streamDocument)
    ? "white"
    : "black";

  return {
    color: fallbackOutlineColor,
    borderColor: fallbackOutlineColor,
  };
};

export const YextCafeAndCoffeeShopEventsFields: YextFields<YextCafeAndCoffeeShopEventsProps> =
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
    sectionImage: {
      label: "Section Image",
      type: "object",
      objectFields: imageFields("Section Image"),
    },
    content: {
      label: "Content",
      type: "object",
      objectFields: {
        paragraphs: {
          label: "Paragraphs",
          type: "object",
          objectFields: {
            text: {
              label: "Text",
              type: "entityField",
              filter: {
                types: ["type.rich_text_v2"],
              },
              disableConstantValueToggle: false,
            },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        button: {
          label: "Button",
          type: "comprehensiveCTA",
        },
      },
    },
  };

export const YextCafeAndCoffeeShopEventsDefaultProps: YextCafeAndCoffeeShopEventsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-tertiary",
        contrastingColor: "palette-tertiary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: {
      text: createTextField("Host Your Next Group Event"),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
    sectionImage: createImageField(eventImageUrl, 1267, 1900, "Event image"),
    content: defaultContent,
  };

const YextCafeAndCoffeeShopEventsComponent = (
  props: YextCafeAndCoffeeShopEventsProps & {
    id?: string;
    puck?: {
      isEditing?: boolean;
    };
  },
) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const sectionImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const hasSectionImage = hasImageSource(sectionImage);
  const sectionImageWrapperStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio:
      props.sectionImage.aspectRatio > 0
        ? props.sectionImage.aspectRatio
        : undefined,
    borderRadius:
      props.sectionImage.styles?.borderRadius === "default"
        ? undefined
        : props.sectionImage.styles?.borderRadius,
    overflow:
      props.sectionImage.imageConstrain === "filled" ||
      Boolean(
        props.sectionImage.styles?.borderRadius &&
        props.sectionImage.styles.borderRadius !== "default",
      )
        ? "hidden"
        : undefined,
  };
  const sectionImageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: props.sectionImage.aspectRatio > 0 ? "100%" : "auto",
    objectFit:
      props.sectionImage.imageConstrain === "filled" ? "cover" : "contain",
  };
  const richTextStyleOverrides = {
    color:
      props.content.paragraphs.fontColor?.selectedColor ??
      props.section.backgroundColor.contrastingColor,
  };
  const resolvedParagraphs = resolveComponentData(
    props.content.paragraphs.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides,
    },
  );

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopEvents${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <Background
            id="events-section"
            className="local-section section-events"
            aria-label="Group Events"
            background={props.section.backgroundColor}
          >
            <div
              className={`events__grid${hasSectionImage ? "" : " events__grid--no-image"}`}
            >
              <article
                className="events__panel events__panel--text"
                style={{
                  backgroundColor: toThemeCss(
                    props.section.backgroundColor.selectedColor,
                  ),
                  color: sectionForeground,
                }}
              >
                <div className="events__content">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="events__title"
                      style={{
                        ...getStyledTextCss(
                          props.heading.styles,
                          props.heading.fontColor,
                        ),
                        color:
                          toThemeCss(props.heading.fontColor?.selectedColor) ??
                          sectionForeground,
                      }}
                    >
                      {resolveTextFieldValue(
                        props.heading.text,
                        locale,
                        streamDocument,
                        "Host Your Next Group Event",
                      )}
                    </h2>
                  </EntityField>
                  <div
                    style={{
                      color: sectionForeground,
                    }}
                  >
                    <EntityField
                      displayName="Paragraphs"
                      fieldId={props.content.paragraphs.text.field}
                      constantValueEnabled={
                        props.content.paragraphs.text.constantValueEnabled
                      }
                    >
                      {React.isValidElement(resolvedParagraphs) ? (
                        resolvedParagraphs
                      ) : typeof resolvedParagraphs === "string" ? (
                        <MaybeRTF
                          data={resolvedParagraphs}
                          richTextStyleOverrides={richTextStyleOverrides}
                        />
                      ) : null}
                    </EntityField>
                  </div>
                  <div className="events__cta">
                    <EntityField
                      displayName="Button"
                      fieldId={props.content.button.data.cta.field}
                      constantValueEnabled={
                        props.content.button.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={props.content.button}
                        className={getEventsCtaClassName(props.content.button)}
                        style={getEventsCtaStyle(
                          props.content.button,
                          props.section.backgroundColor,
                          streamDocument,
                        )}
                      />
                    </EntityField>
                  </div>
                </div>
              </article>
              {hasSectionImage ? (
                <article className="events__panel events__panel--image">
                  <EntityField
                    displayName="Section Image"
                    fieldId={props.sectionImage.image.field}
                    constantValueEnabled={
                      props.sectionImage.image.constantValueEnabled
                    }
                  >
                    <div style={sectionImageWrapperStyle}>
                      <Image
                        image={sectionImage}
                        className="h-full"
                        style={sectionImageStyle}
                      />
                    </div>
                  </EntityField>
                </article>
              ) : null}
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopEvents: YextComponentConfig<YextCafeAndCoffeeShopEventsProps> =
  {
    label: "Events",
    fields: YextCafeAndCoffeeShopEventsFields,
    defaultProps: YextCafeAndCoffeeShopEventsDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopEventsComponent {...props} />,
  };
