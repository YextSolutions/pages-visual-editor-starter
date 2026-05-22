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


type ServiceCard = {
  image: EditableImage;
  imageAriaLabel: EditableText;
  title: EditableText;
  description: EditableText;
  cta: EditableCta;
};

type FeaturedServicesContent = {
  sectionHeading: EditableText;
  sectionDescription: EditableText;
  cards: ServiceCard[];
};

type FeaturedServicesStyles = {
  headingStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  cardTitleStyle: typeof defaultTextStyle;
  linkStyle: typeof defaultLinkStyle;
  imageStyle: typeof defaultImageStyle;
};

type YextDeepCurrentFeaturedServicesProps = {
  section: SectionTheme;
  content?: FeaturedServicesContent;
  styles?: FeaturedServicesStyles;
  sectionHeading?: EditableText;
  sectionDescription?: EditableText;
  cards?: ServiceCard[];
  headingStyle?: typeof defaultTextStyle;
  bodyStyle?: typeof defaultTextStyle;
  cardTitleStyle?: typeof defaultTextStyle;
  linkStyle?: typeof defaultLinkStyle;
  imageStyle?: typeof defaultImageStyle;
};

const defaultServiceImageUrls = [
  createCapturedAssetUrl("service1.jpg"),
  createCapturedAssetUrl("service2.jpg"),
  createCapturedAssetUrl("service3.jpg"),
  createCapturedAssetUrl("service4.jpg"),
];

const SectionFields: YextFields<YextDeepCurrentFeaturedServicesProps> = {
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
      sectionDescription: createEditableTextField("Description"),
      cards: {
        type: "array",
        label: "Service Cards",
        defaultItemProps: {
          image: createDefaultImage("", "Service image"),
          imageAriaLabel: createEditableText("Service image"),
          title: createEditableText("Service title"),
          description: createEditableText("Service description"),
          cta: createEditableLink("Learn more", "#"),
        },
        arrayFields: {
          image: {
            type: "image",
            label: "Image",
          },
          imageAriaLabel: createEditableTextField("Image Aria Label"),
          title: createEditableTextField("Title"),
          description: createEditableTextField("Description"),
          cta: createEditableLinkField("CTA"),
        },
      },
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
      bodyStyle: {
        type: "styledText",
        label: "Body Style",
        visible: false,
      },
      cardTitleStyle: {
        type: "styledText",
        label: "Card Title Style",
        visible: false,
      },
      linkStyle: {
        type: "styledLink",
        label: "Link Style",
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

export const YextDeepCurrentFeaturedServicesComponent: PuckComponent<YextDeepCurrentFeaturedServicesProps> = (
  props,
) => {
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
  const textColors = resolveSectionTextColors(props.section, {
    headingTextColor: "#1a1a1a",
    bodyTextColor: "#676767",
    accentTextColor: "#000000",
    linkTextColor: "#666666",
  });

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentFeaturedServices${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          id="services"
          className="overflow-x-clip border-t border-black/5 py-11"
          style={sectionStyles}
        >
          <div className="mx-auto max-w-[1410px] px-6">
            <div className="mx-auto mb-8 max-w-[1100px] text-center">
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
                  "Featured Services",
                )}
              </h2>
              <p
                className="mt-3 text-sm"
                style={{
                  color: textColors.bodyTextColor,
                  ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                }}
              >
                {resolveText(
                  content?.sectionDescription ?? props.sectionDescription,
                  locale,
                  streamDocument,
                  "Explore the advisory services available at Northstar Wealth Partners - Uptown Charlotte.",
                )}
              </p>
            </div>
            <div className="grid justify-center gap-5 md:[grid-template-columns:repeat(2,minmax(280px,360px))] xl:[grid-template-columns:repeat(4,minmax(240px,300px))]">
              {(content?.cards ?? props.cards ?? []).map((card, index) => {
                const resolvedCta = resolveCta(card.cta, locale, streamDocument);
                const title = resolveText(
                  card.title,
                  locale,
                  streamDocument,
                  "Service title",
                );
                const description = resolveText(
                  card.description,
                  locale,
                  streamDocument,
                  "Service description",
                );
                const image = resolveImageData(
                  card.image,
                  locale,
                  streamDocument,
                  defaultServiceImageUrls[index] || "",
                  title,
                );
                const imageAriaLabel = resolveText(
                  card.imageAriaLabel,
                  locale,
                  streamDocument,
                  image.alt,
                );

                return (
                  <article
                    key={`${title}-${index}`}
                    className="grid min-w-0 w-full content-start gap-4"
                  >
                    <img
                      alt={image.alt}
                      aria-label={imageAriaLabel}
                      className="aspect-[4/3] w-full rounded-[12px] object-cover"
                      src={image.src}
                      style={imageStyleToCss(styles?.imageStyle ?? props.imageStyle)}
                    />
                    <div className="space-y-2">
                      <h3
                        className="text-[1.15rem] font-semibold"
                        style={{
                          color: textColors.accentTextColor,
                          ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        className="text-sm leading-6"
                        style={{
                          color: textColors.bodyTextColor,
                          ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                        }}
                      >
                        {description}
                      </p>
                    </div>
                    {resolvedCta ? (
                      <a
                        href={resolvedCta.link || "#"}
                        rel={resolvedCta.openInNewTab ? "noreferrer" : undefined}
                        style={linkStyleToCss(styles?.linkStyle ?? props.linkStyle)}
                        target={resolvedCta.openInNewTab ? "_blank" : undefined}
                      >
                        <span
                          className="inline-flex pt-1 text-sm font-medium"
                          style={{ color: textColors.linkTextColor }}
                        >
                          {resolvedCta.label || "Learn more"}
                        </span>
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextDeepCurrentFeaturedServices: YextComponentConfig<YextDeepCurrentFeaturedServicesProps> =
  {
    label: "Deep Current Featured Services",
    fields: SectionFields,
    defaultProps: {
    section: {
      backgroundColor: {
        selectedColor: "[#f8f8f8]",
        contrastingColor: "palette-quaternary",
      },
      visibleOnLivePage: true,
    },
    content: {
      sectionHeading: createEditableText("Featured Services"),
      sectionDescription: createEditableText(
        "Explore the advisory services available at Northstar Wealth Partners - Uptown Charlotte.",
      ),
      cards: [
        {
          image: createDefaultImage(defaultServiceImageUrls[0], "Wealth Management"),
          imageAriaLabel: createEditableText("Wealth Management image"),
          title: createEditableText("Wealth Management"),
          description: createEditableText(
            "Portfolio oversight and account review support for clients seeking ongoing guidance.",
          ),
          cta: createEditableLink("Schedule a Wealth Review", "#"),
        },
        {
          image: createDefaultImage(defaultServiceImageUrls[1], "Retirement Planning"),
          imageAriaLabel: createEditableText("Retirement Planning image"),
          title: createEditableText("Retirement Planning"),
          description: createEditableText(
            "Planning conversations for retirement timelines, income needs, and account coordination.",
          ),
          cta: createEditableLink("Book a Retirement Consultation", "#"),
        },
        {
          image: createDefaultImage(defaultServiceImageUrls[2], "Investment Management"),
          imageAriaLabel: createEditableText("Investment Management image"),
          title: createEditableText("Investment Management"),
          description: createEditableText(
            "Ongoing investment strategy support based on client objectives and risk considerations.",
          ),
          cta: createEditableLink("Request an Investment Review", "#"),
        },
        {
          image: createDefaultImage(defaultServiceImageUrls[3], "Financial Planning"),
          imageAriaLabel: createEditableText("Financial Planning image"),
          title: createEditableText("Financial Planning"),
          description: createEditableText(
            "Goal-based planning conversations covering cash flow, savings, and long-term priorities.",
          ),
          cta: createEditableLink("Speak With an Advisor", "#"),
        },
      ],
    },
    styles: {
      headingStyle: defaultTextStyle,
      bodyStyle: defaultTextStyle,
      cardTitleStyle: defaultTextStyle,
      linkStyle: defaultLinkStyle,
      imageStyle: defaultImageStyle,
    },
    },
    render: YextDeepCurrentFeaturedServicesComponent,
  };
