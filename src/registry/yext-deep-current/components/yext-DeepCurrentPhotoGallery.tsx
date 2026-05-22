import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  getAnalyticsScopeHash,
  VisibilityWrapper,
  YextComponentConfig,
  YextFields,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import {
  resolveComponentData as resolveComponentDataFromVisualEditor,
  resolveLocalizedAssetImage as resolveLocalizedAssetImageFromVisualEditor,
  type EnhancedTranslatableCTA as EnhancedTranslatableCTAFromVisualEditor,
  type StyledButtonValue as StyledButtonValueFromVisualEditor,
  type StyledImageValue as StyledImageValueFromVisualEditor,
  type StyledLinkValue as StyledLinkValueFromVisualEditor,
  type StyledTextValue as StyledTextValueFromVisualEditor,
  type ThemeColor as ThemeColorFromVisualEditor,
  type TranslatableAssetImage as TranslatableAssetImageFromVisualEditor,
  type TranslatableString as TranslatableStringFromVisualEditor,
  type YextCTAField as YextCTAFieldFromVisualEditor,
  type YextEntityField as YextEntityFieldFromVisualEditor,
} from "@yext/visual-editor";

type ThemeColorValue = ThemeColorFromVisualEditor;
type EditableMappedText = {
  constantValue: TranslatableStringFromVisualEditor;
  mappedField?: YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor>;
};
type EditableText =
  | EditableMappedText
  | TranslatableStringFromVisualEditor
  | YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor>;
type EditableLink = {
  label: EditableText;
  href: EditableText;
  ariaLabel?: EditableText;
  openInNewTab?: boolean;
};
type EditableCta = EditableLink | YextCTAFieldFromVisualEditor;
type EditableImage = TranslatableAssetImageFromVisualEditor | undefined;
type SectionTheme = {
  backgroundColor: ThemeColorValue;
  backgroundImage?: EditableImage;
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  accentTextColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
  buttonTextColor?: ThemeColorValue;
  visibleOnLivePage: boolean;
};
type ButtonTheme = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  activeBackgroundColor: string;
  activeTextColor: string;
  activeBorderColor: string;
};

const defaultTextStyle: StyledTextValueFromVisualEditor = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultLinkStyle: StyledLinkValueFromVisualEditor = {
  ...defaultTextStyle,
  includeCaret: "default",
  letterSpacing: "default",
};

const defaultButtonStyle: StyledButtonValueFromVisualEditor = {
  ...defaultTextStyle,
  borderRadius: "default",
  letterSpacing: "default",
};

const defaultImageStyle: StyledImageValueFromVisualEditor = {
  borderRadius: "default",
};

const defaultPrimaryButtonTheme: ButtonTheme = {
  backgroundColor: "#000000",
  textColor: "#ffffff",
  borderColor: "#000000",
  hoverBackgroundColor: "#111827",
  hoverTextColor: "#ffffff",
  hoverBorderColor: "#111827",
  activeBackgroundColor: "#374151",
  activeTextColor: "#ffffff",
  activeBorderColor: "#374151",
};

const defaultSecondaryButtonTheme: ButtonTheme = {
  backgroundColor: "#ffffff",
  textColor: "#202020",
  borderColor: "#ffffff",
  hoverBackgroundColor: "#f3f4f6",
  hoverTextColor: "#111827",
  hoverBorderColor: "#f3f4f6",
  activeBackgroundColor: "#e5e7eb",
  activeTextColor: "#111827",
  activeBorderColor: "#e5e7eb",
};

const createDefaultImage = (
  url: string,
  alternateText?: EditableText,
): EditableImage => {
  return {
    url,
    width: 0,
    height: 0,
    alternateText,
  } as unknown as EditableImage;
};

const createCapturedAssetUrl = (filename: string) => {
  return `/src/registry/yext-deep-current/.captured-artifact/assets/${filename}`;
};

const createEditableText = (
  constantValue: string,
  field = "",
): YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor> => {
  return {
    field,
    constantValue,
    constantValueEnabled: true,
  };
};

const createEditableLink = (
  label: string,
  href = "#",
  ariaLabel?: string,
): YextCTAFieldFromVisualEditor => {
  return {
    field: "",
    constantValue: {
      label,
      link: href,
      linkType: "URL",
      ...(ariaLabel ? { ariaLabel } : {}),
    },
    constantValueEnabled: true,
  };
};

const createEditableTextField = (label: string) => {
  return {
    type: "entityField" as const,
    label,
    filter: { types: ["type.string"] as any },
  };
};

const createEditableLinkField = (
  label: string,
  _includeAriaLabel = false,
) => {
  return {
    type: "ctaSelector" as const,
    label,
  };
};

const createButtonThemeFields = (label: string) => {
  return {
    type: "object" as const,
    label,
    objectFields: {
      backgroundColor: { type: "text" as const, label: "Background Color" },
      textColor: { type: "text" as const, label: "Text Color" },
      borderColor: { type: "text" as const, label: "Border Color" },
      hoverBackgroundColor: {
        type: "text" as const,
        label: "Hover Background Color",
      },
      hoverTextColor: { type: "text" as const, label: "Hover Text Color" },
      hoverBorderColor: { type: "text" as const, label: "Hover Border Color" },
      activeBackgroundColor: {
        type: "text" as const,
        label: "Active Background Color",
      },
      activeTextColor: { type: "text" as const, label: "Active Text Color" },
      activeBorderColor: {
        type: "text" as const,
        label: "Active Border Color",
      },
    },
  };
};

const createSectionThemeFields = () => {
  return {
    backgroundColor: {
      label: "Background Color",
      type: "basicSelector" as const,
      options: "BACKGROUND_COLOR" as const,
    },
    backgroundImage: {
      type: "image" as const,
      label: "Background Image",
    },
    visibleOnLivePage: {
      label: "Visible on Live Page",
      type: "radio" as const,
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  };
};

const isDefaultToken = (value?: string) => {
  return !value || value === "default";
};

const resolveThemeColor = (
  color?: ThemeColorValue,
  fallback = "#ffffff",
) => {
  const selected = color?.selectedColor;
  if (!selected) {
    return fallback;
  }

  if (selected === "white") {
    return "#ffffff";
  }

  if (selected === "black") {
    return "#000000";
  }

  if (selected.startsWith("[") && selected.endsWith("]")) {
    return selected.slice(1, -1);
  }

  return `var(--colors-${selected})`;
};

const resolveSectionStyles = (
  section: SectionTheme,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallbackColor = "#ffffff",
): CSSProperties => {
  const backgroundImage = resolveImageData(
    section.backgroundImage,
    locale,
    streamDocument,
  );

  return {
    backgroundColor: resolveThemeColor(section.backgroundColor, fallbackColor),
    backgroundImage: backgroundImage.src ? `url(${backgroundImage.src})` : undefined,
    backgroundPosition: backgroundImage.src ? "center" : undefined,
    backgroundRepeat: backgroundImage.src ? "no-repeat" : undefined,
    backgroundSize: backgroundImage.src ? "cover" : undefined,
  };
};

const resolveSectionTextColors = (
  section: SectionTheme,
  defaults: {
    headingTextColor: string;
    bodyTextColor: string;
    accentTextColor?: string;
    linkTextColor?: string;
    buttonTextColor?: string;
  },
) => {
  const headingTextColor = resolveThemeColor(
    section.headingTextColor,
    defaults.headingTextColor,
  );
  const bodyTextColor = resolveThemeColor(
    section.bodyTextColor,
    defaults.bodyTextColor,
  );
  const accentTextColor = resolveThemeColor(
    section.accentTextColor,
    defaults.accentTextColor ?? defaults.headingTextColor,
  );
  const linkTextColor = resolveThemeColor(
    section.linkTextColor,
    defaults.linkTextColor ?? accentTextColor,
  );
  const buttonTextColor = resolveThemeColor(
    section.buttonTextColor,
    defaults.buttonTextColor ?? linkTextColor,
  );

  return {
    headingTextColor,
    bodyTextColor,
    accentTextColor,
    linkTextColor,
    buttonTextColor,
  };
};

const resolveText = (
  value: EditableText | undefined,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallback = "",
): string => {
  if (!value) {
    return fallback;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "constantValue" in value &&
    "mappedField" in value
  ) {
    const mappedField = (value as EditableMappedText).mappedField;

    if (mappedField?.field) {
      const mappedValue = resolveComponentDataFromVisualEditor(
        {
          ...mappedField,
          constantValueEnabled: false,
        } as any,
        locale,
        streamDocument as any,
        { output: "plainText" },
      );

      if (typeof mappedValue === "string" && mappedValue.trim().length > 0) {
        return mappedValue;
      }

      if (
        mappedValue &&
        typeof mappedValue === "object" &&
        "defaultValue" in mappedValue
      ) {
        const defaultValue = (mappedValue as Record<string, unknown>).defaultValue;
        if (typeof defaultValue === "string" && defaultValue.trim().length > 0) {
          return defaultValue;
        }
      }
    }

    return resolveText(
      (value as EditableMappedText).constantValue,
      locale,
      streamDocument,
      fallback,
    );
  }

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
    { output: "plainText" },
  );

  if (typeof resolved === "string") {
    return resolved;
  }

  if (resolved && typeof resolved === "object" && "defaultValue" in resolved) {
    const defaultValue = (resolved as Record<string, unknown>).defaultValue;
    return typeof defaultValue === "string" ? defaultValue : fallback;
  }

  return fallback;
};

const resolveCta = (
  value: EditableCta | undefined,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "object" && value !== null && "href" in value) {
    return {
      ariaLabel: resolveText(
        (value as EditableLink).ariaLabel,
        locale,
        streamDocument,
      ),
      label: resolveText(
        (value as EditableLink).label,
        locale,
        streamDocument,
      ),
      link: resolveText(
        (value as EditableLink).href,
        locale,
        streamDocument,
      ),
      openInNewTab: Boolean((value as EditableLink).openInNewTab),
    };
  }

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
  ) as unknown as EnhancedTranslatableCTAFromVisualEditor | undefined;

  if (!resolved) {
    return undefined;
  }

  const label = resolveText(
    resolved.label as EditableText | undefined,
    locale,
    streamDocument,
  );
  const link = resolveText(
    resolved.link as EditableText | undefined,
    locale,
    streamDocument,
  );

  return {
    ...resolved,
    label,
    link,
  };
};

const buttonThemeToCss = (theme: ButtonTheme): CSSProperties => {
  return {
    backgroundColor: theme.backgroundColor,
    borderColor: theme.borderColor,
    color: theme.textColor,
  };
};

const buttonThemeToStylesheet = (
  className: string,
  theme: ButtonTheme,
) => {
  return `
.${className} {
  background-color: ${theme.backgroundColor};
  border-color: ${theme.borderColor};
  color: ${theme.textColor};
}
.${className}:hover {
  background-color: ${theme.hoverBackgroundColor};
  border-color: ${theme.hoverBorderColor};
  color: ${theme.hoverTextColor};
}
.${className}:active {
  background-color: ${theme.activeBackgroundColor};
  border-color: ${theme.activeBorderColor};
  color: ${theme.activeTextColor};
}
`;
};

const resolveImageData = (
  value: EditableImage,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallbackUrl = "",
  fallbackAlt = "",
) => {
  const normalizeAssetUrl = (url?: string) => {
    if (!url) {
      return url;
    }

    if (!url.startsWith("file://")) {
      return url;
    }

    try {
      const fileUrl = new URL(url);
      const srcIndex = fileUrl.pathname.indexOf("/src/");
      if (srcIndex === -1) {
        return url;
      }

      return encodeURI(fileUrl.pathname.slice(srcIndex));
    } catch {
      return url;
    }
  };

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
  ) as unknown as TranslatableAssetImageFromVisualEditor | undefined;
  const localizedImage = resolveLocalizedAssetImageFromVisualEditor(
    resolved ?? value,
    locale,
  );
  const alt = resolveText(
    localizedImage?.alternateText,
    locale,
    streamDocument,
    localizedImage?.assetImage?.altText || fallbackAlt,
  );

  return {
    alt,
    src: normalizeAssetUrl(
      localizedImage?.assetImage?.transformedImage?.url ||
        localizedImage?.assetImage?.originalImage?.url ||
        localizedImage?.assetImage?.sourceUrl ||
        localizedImage?.url ||
        fallbackUrl,
    ),
  };
};

const textStyleToCss = (
  styles?: Partial<StyledTextValueFromVisualEditor>,
): CSSProperties => {
  return {
    fontFamily: isDefaultToken(styles?.fontFamily)
      ? undefined
      : styles?.fontFamily,
    fontSize: isDefaultToken(styles?.fontSize) ? undefined : styles?.fontSize,
    fontWeight: isDefaultToken(styles?.fontWeight)
      ? undefined
      : styles?.fontWeight,
    fontStyle: isDefaultToken(styles?.fontStyle) ? undefined : styles?.fontStyle,
    textTransform: isDefaultToken(styles?.textTransform)
      ? undefined
      : styles?.textTransform,
  };
};

const linkStyleToCss = (
  styles?: Partial<StyledLinkValueFromVisualEditor>,
): CSSProperties => {
  return {
    ...textStyleToCss(styles),
    letterSpacing: isDefaultToken(styles?.letterSpacing)
      ? undefined
      : styles?.letterSpacing,
  };
};

const buttonStyleToCss = (
  styles?: Partial<StyledButtonValueFromVisualEditor>,
): CSSProperties => {
  return {
    ...textStyleToCss(styles),
    borderRadius: isDefaultToken(styles?.borderRadius)
      ? undefined
      : styles?.borderRadius,
    letterSpacing: isDefaultToken(styles?.letterSpacing)
      ? undefined
      : styles?.letterSpacing,
  };
};

const imageStyleToCss = (
  styles?: Partial<StyledImageValueFromVisualEditor>,
): CSSProperties => {
  return {
    borderRadius: isDefaultToken(styles?.borderRadius)
      ? undefined
      : styles?.borderRadius,
  };
};


type GalleryImage = {
  image: EditableImage;
  caption: EditableText;
};

type GalleryContent = {
  sectionHeading: EditableText;
  sectionDescription: EditableText;
  photos: GalleryImage[];
};

type GalleryStyles = {
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  headingStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  captionStyle: typeof defaultTextStyle;
  imageStyle: typeof defaultImageStyle;
};

type YextDeepCurrentPhotoGalleryProps = {
  section: SectionTheme & {
    headingTextColor?: ThemeColorValue;
    bodyTextColor?: ThemeColorValue;
  };
  content?: GalleryContent;
  styles?: GalleryStyles;
  sectionHeading?: EditableText;
  sectionDescription?: EditableText;
  galleryType: "grid" | "carousel";
  photos?: GalleryImage[];
};

const galleryDefaults = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
];

const GalleryFields: YextFields<YextDeepCurrentPhotoGalleryProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      backgroundImage: {
        type: "image",
        label: "Background Image",
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
  content: {
    label: "Content",
    type: "object",
    objectFields: {
      sectionHeading: createEditableTextField("Heading"),
      sectionDescription: createEditableTextField("Description"),
      photos: {
        label: "Photos",
        type: "array",
        defaultItemProps: {
          image: undefined,
          caption: createEditableText("Gallery caption"),
        },
        arrayFields: {
          image: {
            type: "image",
            label: "Image",
          },
          caption: createEditableTextField("Caption"),
        },
      },
    },
  },
  galleryType: {
    label: "Gallery Type",
    type: "select",
    options: [
      { label: "Grid", value: "grid" },
      { label: "Carousel", value: "carousel" },
    ],
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      headingTextColor: {
        label: "Heading Text Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      bodyTextColor: {
        label: "Body Text Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      headingStyle: {
        type: "styledText",
        label: "Heading Style",
        visible: false,
      },
      bodyStyle: {
        type: "styledText",
        label: "Body Style",
        visible: false,
      },
      captionStyle: {
        type: "styledText",
        label: "Caption Style",
        visible: false,
      },
      imageStyle: {
        type: "styledImage",
        label: "Image Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentPhotoGalleryComponent: PuckComponent<
  YextDeepCurrentPhotoGalleryProps
> = (props) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { i18n } = useTranslation();
  const streamDocument = useDocument() as Record<string, unknown> | undefined;
  const locale = i18n.language;
  const content = props.content;
  const styles = props.styles;
  const sectionStyles = resolveSectionStyles(
    props.section,
    locale,
    streamDocument,
    "#f8f8f8",
  );
  const headingColor = resolveThemeColor(
    styles?.headingTextColor ?? props.section.headingTextColor,
    "#1a1a1a",
  );
  const bodyColor = resolveThemeColor(
    styles?.bodyTextColor ?? props.section.bodyTextColor,
    "#676767",
  );
  const photos = (content?.photos ?? props.photos ?? []).length
    ? (content?.photos ?? props.photos ?? [])
    : [{ image: undefined, caption: createEditableText("Gallery caption") }];
  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentPhotoGallery${getAnalyticsScopeHash(props.id)}`}
      >
        <section className="overflow-x-clip py-11" style={sectionStyles}>
          <div className="mx-auto max-w-[1410px] px-6">
            <div className="mx-auto mb-8 max-w-[820px] text-center">
              <h2
                className="text-[2.2rem] font-bold tracking-[-0.04em]"
                style={{
                  color: headingColor,
                  ...textStyleToCss(styles?.headingStyle),
                }}
              >
                {resolveText(
                  content?.sectionHeading ?? props.sectionHeading,
                  locale,
                  streamDocument,
                  "Inside Our Charlotte Office",
                )}
              </h2>
              <p
                className="mt-3 text-sm leading-7"
                style={{
                  color: bodyColor,
                  ...textStyleToCss(styles?.bodyStyle),
                }}
              >
                {resolveText(
                  content?.sectionDescription ?? props.sectionDescription,
                  locale,
                  streamDocument,
                  "Share a visual tour of the office, meeting spaces, and client experience with a gallery that fits the same calm, editorial tone as the rest of the page.",
                )}
              </p>
            </div>
            {props.galleryType === "carousel" ? (
              <div className="mx-auto max-w-[1160px]">
                <div className="relative overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_10px_28px_rgba(9,30,66,0.08)]">
                  {(() => {
                    const caption = resolveText(
                      activePhoto.caption,
                      locale,
                      streamDocument,
                      "Gallery caption",
                    );
                    const image = resolveImageData(
                      activePhoto.image,
                      locale,
                      streamDocument,
                      galleryDefaults[activeIndex % galleryDefaults.length],
                      caption,
                    );
                    return (
                      <>
                        <img
                          alt={image.alt}
                          className="h-[280px] w-full object-cover md:h-[520px]"
                          src={image.src}
                          style={imageStyleToCss(styles?.imageStyle)}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(8,14,22,0)_0%,rgba(8,14,22,0.74)_100%)] px-6 pb-6 pt-16">
                          <p
                            className="text-sm text-white md:text-base"
                            style={textStyleToCss(styles?.captionStyle)}
                          >
                            {caption}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium"
                    onClick={() =>
                      setActiveIndex((value) =>
                        value === 0 ? photos.length - 1 : value - 1,
                      )
                    }
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium"
                    onClick={() =>
                      setActiveIndex((value) =>
                        value === photos.length - 1 ? 0 : value + 1,
                      )
                    }
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid justify-center gap-5 md:grid-cols-2 xl:grid-cols-4">
                {photos.map((photo, index) => {
                  const caption = resolveText(
                    photo.caption,
                    locale,
                    streamDocument,
                    "Gallery caption",
                  );
                  const resolvedImage = resolveImageData(
                    photo.image,
                    locale,
                    streamDocument,
                    galleryDefaults[index % galleryDefaults.length],
                    caption,
                  );
                  return (
                    <figure
                      key={`${caption}-${index}`}
                      className="overflow-hidden rounded-[16px] border border-black/5 bg-white shadow-[0_6px_22px_rgba(9,30,66,0.08)]"
                    >
                      <img
                        alt={resolvedImage.alt}
                        className="h-[240px] w-full object-cover"
                        src={resolvedImage.src}
                        style={imageStyleToCss(styles?.imageStyle)}
                      />
                      <figcaption
                        className="px-5 py-4 text-sm leading-6"
                        style={{
                          color: bodyColor,
                          ...textStyleToCss(styles?.captionStyle),
                        }}
                      >
                        {caption}
                      </figcaption>
                    </figure>
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

export const YextDeepCurrentPhotoGallery: YextComponentConfig<YextDeepCurrentPhotoGalleryProps> =
  {
    label: "Deep Current Photo Gallery",
    fields: GalleryFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "[#f8f8f8]",
          contrastingColor: "palette-quaternary",
        },
        visibleOnLivePage: true,
      },
      content: {
        sectionHeading: createEditableText("Inside Our Charlotte Office"),
        sectionDescription: createEditableText(
          "Share a visual tour of the office, meeting spaces, and client experience with a gallery that fits the same calm, editorial tone as the rest of the page.",
        ),
        photos: [
          {
            image: undefined,
            caption: createEditableText(
              "Welcoming reception spaces designed for calm, focused conversations.",
            ),
          },
          {
            image: undefined,
            caption: createEditableText(
              "Private meeting rooms for wealth planning and advisory sessions.",
            ),
          },
          {
            image: undefined,
            caption: createEditableText(
              "Collaborative spaces where clients and advisors can work through planning details.",
            ),
          },
          {
            image: undefined,
            caption: createEditableText(
              "Bright, professional interiors that reflect the Northstar brand aesthetic.",
            ),
          },
        ],
      },
      galleryType: "grid",
      styles: {
        headingTextColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "white",
        },
        bodyTextColor: {
          selectedColor: "[#676767]",
          contrastingColor: "white",
        },
        headingStyle: defaultTextStyle,
        bodyStyle: defaultTextStyle,
        captionStyle: defaultTextStyle,
        imageStyle: defaultImageStyle,
      },
    },
    render: YextDeepCurrentPhotoGalleryComponent,
  };
