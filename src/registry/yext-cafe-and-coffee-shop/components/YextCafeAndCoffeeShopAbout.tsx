import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  Background,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getDefaultRTF,
  msg,
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
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";

type AboutImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

export type YextCafeAndCoffeeShopAboutProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  sectionImage: AboutImageProps;
  content: {
    text: YextEntityField<TranslatableRichText>;
    fontColor?: ThemeColor;
  };
};

const aboutImageUrl =
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg";

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
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
): AboutImageProps => ({
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

.cafe-scope .section-offerings .split--text-right,
.cafe-scope .section-offerings .split--text-right * {
  box-sizing: border-box;
}

.cafe-scope .section-offerings {
  padding-inline: 0;
}

.cafe-scope .section-offerings .split--text-right {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(100%, 1440px);
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-right.split--no-image {
  grid-template-columns: 1fr;
}

.cafe-scope .section-offerings .split--text-right .split__panel {
  min-height: 100%;
}

.cafe-scope .section-offerings .split--text-right .split__panel--image img {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  display: block;
}

.cafe-scope .section-offerings .split--text-right .split__panel--text {
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.75rem);
}

.cafe-scope .section-offerings .split--text-right .split__body {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-right .split__title {
  margin: 0 0 2rem;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

.cafe-scope .section-offerings .split--text-right .split__body p {
  margin: 0 0 1rem;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}

.cafe-scope .section-offerings .split--text-right .split__body p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1023px) {
  .cafe-scope .section-offerings {
    padding-inline: 30px;
  }

  .cafe-scope .section-offerings .split--text-right {
    grid-template-columns: 1fr;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    order: 2;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--text {
    order: 1;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--text {
    padding: 2.5rem 0;
  }

  .cafe-scope .section-offerings .split--text-right .split__body {
    max-width: 100%;
    margin: 0;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    width: calc(100% + 60px);
    margin-inline: -30px;
  }
}

@media (max-width: 700px) {
  .cafe-scope .section-offerings {
    padding-inline: 14px;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    width: calc(100% + 28px);
    margin-inline: -14px;
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

const imageFields = (label: string): YextFields<AboutImageProps> => ({
  image: {
    label: "Image",
    type: "entityField",
    filter: {
      types: ["type.image"],
    },
    disableConstantValueToggle: false,
  },
  aspectRatio: {
    label: msg("fields.options.aspectRatio", "Aspect Ratio"),
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

const defaultHeading: YextCafeAndCoffeeShopAboutProps["heading"] = {
  text: createTextField("About Lorem Ipsum"),
  styles: defaultTextStyles,
  fontColor: undefined,
};

const defaultContent: YextCafeAndCoffeeShopAboutProps["content"] = {
  text: createRtfField(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus, urna eu feugiat efficitur, metus lectus fermentum magna, in suscipit lectus risus sed massa. Integer at eros non sapien gravida aliquet. Praesent vitae sem et ipsum sagittis scelerisque. Sed volutpat, nibh vitae fermentum ultricies, odio nunc condimentum tellus, vitae fringilla velit mi sed justo. Curabitur sodales libero vel augue sollicitudin, vitae mollis tortor pretium. Mauris pulvinar, felis nec interdum lacinia, nisl lorem gravida tellus, vitae eleifend massa lorem nec risus. Nunc aliquet ligula at dui ultrices, eget pharetra nunc pellentesque.",
  ),
  fontColor: undefined,
};

export const YextCafeAndCoffeeShopAboutFields: YextFields<YextCafeAndCoffeeShopAboutProps> =
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
      label: "Image",
      type: "object",
      objectFields: imageFields("Image"),
    },
    content: {
      label: "Content",
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
  };

export const YextCafeAndCoffeeShopAboutDefaultProps: YextCafeAndCoffeeShopAboutProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: defaultHeading,
    sectionImage: createImageField(aboutImageUrl, 1267, 1900, "About image"),
    content: defaultContent,
  };

const YextCafeAndCoffeeShopAboutComponent: PuckComponent<
  YextCafeAndCoffeeShopAboutProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const sectionImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const hasSectionImage = hasImageSource(sectionImage);
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
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
      props.content.fontColor?.selectedColor ??
      props.section.backgroundColor.contrastingColor,
  };
  const resolvedContent = resolveComponentData(
    props.content.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides,
    },
  );
  const maybeRichText =
    typeof resolvedContent === "string" ||
    React.isValidElement(resolvedContent) ? (
      React.isValidElement(resolvedContent) ? (
        resolvedContent
      ) : (
        <MaybeRTF
          data={resolvedContent}
          richTextStyleOverrides={richTextStyleOverrides}
        />
      )
    ) : null;

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopAbout${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            className="local-section split-sections section-offerings"
            aria-label="About"
            background={props.section.backgroundColor}
          >
            <article
              className={`split split--text-right${hasSectionImage ? "" : " split--no-image"}`}
            >
              {hasSectionImage ? (
                <div className="split__panel split__panel--image">
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
                </div>
              ) : null}
              <div
                className="split__panel split__panel--text split__panel--navy"
                style={{
                  backgroundColor: toThemeCss(
                    props.section.backgroundColor.selectedColor,
                  ),
                  color: toThemeCss(
                    props.section.backgroundColor.contrastingColor,
                  ),
                }}
              >
                <div className="split__body">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="split__title"
                      style={getStyledTextCss(
                        props.heading.styles,
                        props.heading.fontColor,
                      )}
                    >
                      {headingText}
                    </h2>
                  </EntityField>
                  <div
                    style={{
                      color: toThemeCss(
                        props.section.backgroundColor.contrastingColor,
                      ),
                    }}
                  >
                    <EntityField
                      displayName="Content"
                      fieldId={props.content.text.field}
                      constantValueEnabled={
                        props.content.text.constantValueEnabled
                      }
                    >
                      {maybeRichText}
                    </EntityField>
                  </div>
                </div>
              </div>
            </article>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopAbout: YextComponentConfig<YextCafeAndCoffeeShopAboutProps> =
  {
    label: "About",
    fields: YextCafeAndCoffeeShopAboutFields,
    defaultProps: YextCafeAndCoffeeShopAboutDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopAboutComponent {...props} />,
  };
