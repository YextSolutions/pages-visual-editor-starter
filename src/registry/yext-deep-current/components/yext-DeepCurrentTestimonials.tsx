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


type TestimonialItem = {
  quote: EditableText;
  name: EditableText;
  role: EditableText;
};

type TestimonialsContent = {
  sectionHeading: EditableText;
  testimonials: TestimonialItem[];
  previousButtonAriaLabel: EditableText;
  nextButtonAriaLabel: EditableText;
};

type TestimonialsStyles = {
  headingStyle: typeof defaultTextStyle;
  quoteStyle: typeof defaultTextStyle;
  attributionStyle: typeof defaultTextStyle;
};

type YextDeepCurrentTestimonialsProps = {
  section: SectionTheme;
  content?: TestimonialsContent;
  styles?: TestimonialsStyles;
  sectionHeading?: EditableText;
  testimonials?: TestimonialItem[];
  previousButtonAriaLabel?: EditableText;
  nextButtonAriaLabel?: EditableText;
  headingStyle?: typeof defaultTextStyle;
  quoteStyle?: typeof defaultTextStyle;
  attributionStyle?: typeof defaultTextStyle;
};

const SectionFields: YextFields<YextDeepCurrentTestimonialsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: createSectionThemeFields(),
  },
  content: {
    label: "Content",
    type: "object",
    objectFields: {
      sectionHeading: createEditableTextField("Heading"),
      testimonials: {
        type: "array",
        label: "Testimonials",
        defaultItemProps: {
          quote: createEditableText("Quote"),
          name: createEditableText("Name"),
          role: createEditableText("Role"),
        },
        arrayFields: {
          quote: createEditableTextField("Quote"),
          name: createEditableTextField("Name"),
          role: createEditableTextField("Role"),
        },
      },
      previousButtonAriaLabel: createEditableTextField("Previous Button Aria Label"),
      nextButtonAriaLabel: createEditableTextField("Next Button Aria Label"),
    },
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      headingStyle: {
        type: "styledText",
        label: "Heading Style",
        visible: false,
      },
      quoteStyle: {
        type: "styledText",
        label: "Quote Style",
        visible: false,
      },
      attributionStyle: {
        type: "styledText",
        label: "Attribution Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentTestimonialsComponent: PuckComponent<YextDeepCurrentTestimonialsProps> =
  (props) => {
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
      "#ececef",
    );
    const textColors = resolveSectionTextColors(props.section, {
      headingTextColor: "#1a1a1a",
      bodyTextColor: "#7a7a7a",
      accentTextColor: "#1a1a1a",
      linkTextColor: "#8a8a8a",
      buttonTextColor: "#555555",
    });
    const testimonials = content?.testimonials ?? props.testimonials ?? [];
    const testimonialCount = testimonials.length;
    const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];

    if (!activeTestimonial) {
      return <div />;
    }

    const previousAriaLabel = resolveText(
      content?.previousButtonAriaLabel ?? props.previousButtonAriaLabel,
      locale,
      streamDocument,
      "Previous testimonial",
    );
    const nextAriaLabel = resolveText(
      content?.nextButtonAriaLabel ?? props.nextButtonAriaLabel,
      locale,
      streamDocument,
      "Next testimonial",
    );

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`YextDeepCurrentTestimonials${getAnalyticsScopeHash(props.id)}`}
        >
        <section
          id="testimonials"
          className="overflow-x-clip py-11"
          style={sectionStyles}
        >
            <div className="mx-auto max-w-[1410px] px-6">
              <div className="mx-auto max-w-[780px] text-center">
                <h2
                  className="text-[2.2rem] font-bold tracking-[-0.04em]"
                  style={{
                    color: textColors.headingTextColor,
                    ...textStyleToCss(styles?.headingStyle ?? props.headingStyle),
                  }}
                >
                  {resolveText(
                    content?.sectionHeading ?? props.sectionHeading,
                    locale,
                    streamDocument,
                    "Testimonials",
                  )}
                </h2>
              </div>
              <div className="relative mx-auto mt-8 max-w-[980px] text-center">
                <div className="mb-6 flex justify-center gap-3 md:hidden">
                  <button
                    aria-label={previousAriaLabel}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-xl"
                    style={{ color: textColors.buttonTextColor }}
                    onClick={() =>
                      setActiveIndex((value) =>
                        value === 0 ? testimonialCount - 1 : value - 1,
                      )
                    }
                    type="button"
                  >
                    ←
                  </button>
                  <button
                    aria-label={nextAriaLabel}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-xl"
                    style={{ color: textColors.buttonTextColor }}
                    onClick={() =>
                      setActiveIndex((value) =>
                        value === testimonialCount - 1 ? 0 : value + 1,
                      )
                    }
                    type="button"
                  >
                    →
                  </button>
                </div>
                <button
                  aria-label={previousAriaLabel}
                  className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-xl md:flex"
                  style={{ color: textColors.buttonTextColor }}
                  onClick={() =>
                    setActiveIndex((value) =>
                      value === 0 ? testimonialCount - 1 : value - 1,
                    )
                  }
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label={nextAriaLabel}
                  className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-xl md:flex"
                  style={{ color: textColors.buttonTextColor }}
                  onClick={() =>
                    setActiveIndex((value) =>
                      value === testimonialCount - 1 ? 0 : value + 1,
                    )
                  }
                  type="button"
                >
                  →
                </button>
                <blockquote
                  className="mx-auto max-w-[760px] px-0 text-[1.7rem] italic leading-[1.45] tracking-[-0.02em] md:px-14 md:text-[2.1rem]"
                  style={{
                    color: textColors.bodyTextColor,
                    ...textStyleToCss(styles?.quoteStyle ?? props.quoteStyle),
                  }}
                >
                  “
                  {resolveText(
                    activeTestimonial.quote,
                    locale,
                    streamDocument,
                    "Quote",
                  )}
                  ”
                </blockquote>
                <div className="mt-8">
                  <div
                    className="text-[1.05rem] font-semibold"
                    style={{
                      color: textColors.accentTextColor,
                      ...textStyleToCss(styles?.attributionStyle ?? props.attributionStyle),
                    }}
                  >
                    {resolveText(
                      activeTestimonial.name,
                      locale,
                      streamDocument,
                      "Name",
                    )}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: textColors.linkTextColor,
                      ...textStyleToCss(styles?.attributionStyle ?? props.attributionStyle),
                    }}
                  >
                    {resolveText(
                      activeTestimonial.role,
                      locale,
                      streamDocument,
                      "Role",
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={`${resolveText(testimonial.name, locale, streamDocument, `testimonial-${index}`)}-${index}`}
                      aria-label={`Show testimonial ${index + 1}`}
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === activeIndex ? "" : "bg-[#b6b6bc]"
                      }`}
                      style={
                        index === activeIndex
                          ? { backgroundColor: textColors.accentTextColor }
                          : undefined
                      }
                      onClick={() => setActiveIndex(index)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const YextDeepCurrentTestimonials: YextComponentConfig<YextDeepCurrentTestimonialsProps> =
  {
    label: "Deep Current Testimonials",
    fields: SectionFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "[#ececef]",
          contrastingColor: "palette-quaternary",
        },
        visibleOnLivePage: true,
      },
      content: {
        sectionHeading: createEditableText("Testimonials"),
        testimonials: [
          {
            quote: createEditableText(
              "The Uptown Charlotte team helped us understand our retirement timeline and organize the next steps with clarity.",
            ),
            name: createEditableText("Denise Carter"),
            role: createEditableText("Client"),
          },
          {
            quote: createEditableText(
              "We appreciated how personalized the advice felt from the first meeting through our follow-up planning sessions.",
            ),
            name: createEditableText("Marco Johnson"),
            role: createEditableText("Client"),
          },
          {
            quote: createEditableText(
              "They made long-term financial planning feel approachable and gave us a path forward we could act on immediately.",
            ),
            name: createEditableText("Sonia Patel"),
            role: createEditableText("Client"),
          },
        ],
        previousButtonAriaLabel: createEditableText("Previous testimonial"),
        nextButtonAriaLabel: createEditableText("Next testimonial"),
      },
      styles: {
        headingStyle: defaultTextStyle,
        quoteStyle: defaultTextStyle,
        attributionStyle: defaultTextStyle,
      },
    },
    render: YextDeepCurrentTestimonialsComponent,
  };
