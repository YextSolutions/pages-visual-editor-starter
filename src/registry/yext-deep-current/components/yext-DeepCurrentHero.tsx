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


type HeroContent = {
  statusEyebrow: EditableText;
  headline: EditableText;
  body: EditableText;
  primaryCta: EditableCta;
  secondaryCta: EditableCta;
  heroImage: EditableImage;
  heroImageAriaLabel: EditableText;
};

type HeroStyles = {
  textColor?: ThemeColorValue;
  primaryCtaFillColor?: ThemeColorValue;
  primaryCtaTextColor?: ThemeColorValue;
  secondaryCtaFillColor?: ThemeColorValue;
  secondaryCtaTextColor?: ThemeColorValue;
  ctaFillColor?: ThemeColorValue;
  ctaTextColor?: ThemeColorValue;
  primaryCtaVariant?: "solid" | "outline" | "ghost";
  secondaryCtaVariant?: "solid" | "outline" | "ghost";
  eyebrowStyle: typeof defaultTextStyle;
  headingStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  primaryButtonStyle: typeof defaultButtonStyle;
  secondaryButtonStyle: typeof defaultButtonStyle;
  imageStyle: typeof defaultImageStyle;
};

type YextDeepCurrentHeroProps = {
  section: {
    backgroundColor: ThemeColorValue;
    backgroundImage?: EditableImage;
    gradientColor?: ThemeColorValue;
    showGradientOverlay?: boolean;
    visibleOnLivePage: boolean;
  };
  content?: HeroContent;
  styles?: HeroStyles;
  statusEyebrow?: EditableText;
  headline?: EditableText;
  body?: EditableText;
  primaryCta?: EditableCta;
  secondaryCta?: EditableCta;
  heroImage?: EditableImage;
  heroImageAriaLabel?: EditableText;
  eyebrowStyle?: typeof defaultTextStyle;
  headingStyle?: typeof defaultTextStyle;
  bodyStyle?: typeof defaultTextStyle;
  primaryButtonStyle?: typeof defaultButtonStyle;
  secondaryButtonStyle?: typeof defaultButtonStyle;
  imageStyle?: typeof defaultImageStyle;
};

const defaultHeroImageUrl = createCapturedAssetUrl("hero.jpg");

const getContrastingTextColor = (color: string) => {
  const normalized = color.trim();
  if (!normalized.startsWith("#") || normalized.length !== 7) {
    return "#ffffff";
  }

  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? "#111111" : "#ffffff";
};

const createHeroCtaTheme = (
  variant: "solid" | "outline" | "ghost",
  fillColor: string,
  textColor: string,
): ButtonTheme => {
  if (variant === "outline") {
    return {
      backgroundColor: "transparent",
      textColor,
      borderColor: fillColor,
      hoverBackgroundColor: `${fillColor}1A`,
      hoverTextColor: textColor,
      hoverBorderColor: fillColor,
      activeBackgroundColor: `${fillColor}26`,
      activeTextColor: textColor,
      activeBorderColor: fillColor,
    };
  }

  if (variant === "ghost") {
    return {
      backgroundColor: "transparent",
      textColor,
      borderColor: "transparent",
      hoverBackgroundColor: `${fillColor}14`,
      hoverTextColor: textColor,
      hoverBorderColor: "transparent",
      activeBackgroundColor: `${fillColor}22`,
      activeTextColor: textColor,
      activeBorderColor: "transparent",
    };
  }

  return {
    backgroundColor: fillColor,
    textColor,
    borderColor: fillColor,
    hoverBackgroundColor: fillColor,
    hoverTextColor: textColor,
    hoverBorderColor: fillColor,
    activeBackgroundColor: fillColor,
    activeTextColor: textColor,
    activeBorderColor: fillColor,
  };
};

const SectionFields: YextFields<YextDeepCurrentHeroProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      gradientColor: {
        label: "Overlay Gradient Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      showGradientOverlay: {
        label: "Show Gradient Overlay",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
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
      statusEyebrow: createEditableTextField("Status Eyebrow"),
      headline: createEditableTextField("Headline"),
      body: createEditableTextField("Body Copy"),
      primaryCta: createEditableLinkField("Primary CTA"),
      secondaryCta: createEditableLinkField("Secondary CTA"),
      heroImage: {
        type: "image",
        label: "Hero Image",
      },
      heroImageAriaLabel: createEditableTextField("Hero Image Aria Label"),
    },
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      textColor: {
        label: "Text Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      primaryCtaFillColor: {
        label: "Primary CTA Fill Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      primaryCtaTextColor: {
        label: "Primary CTA Text Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      secondaryCtaFillColor: {
        label: "Secondary CTA Fill Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      secondaryCtaTextColor: {
        label: "Secondary CTA Text Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      primaryCtaVariant: {
        label: "Primary CTA Style",
        type: "select",
        options: [
          { label: "Solid", value: "solid" },
          { label: "Outline", value: "outline" },
          { label: "Ghost", value: "ghost" },
        ],
      },
      secondaryCtaVariant: {
        label: "Secondary CTA Style",
        type: "select",
        options: [
          { label: "Outline", value: "outline" },
          { label: "Solid", value: "solid" },
          { label: "Ghost", value: "ghost" },
        ],
      },
      eyebrowStyle: {
        type: "styledText",
        label: "Eyebrow Text Style",
        visible: false,
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
      primaryButtonStyle: {
        type: "styledButton",
        label: "Primary Button Style",
        visible: false,
      },
      secondaryButtonStyle: {
        type: "styledButton",
        label: "Secondary Button Style",
        visible: false,
      },
      imageStyle: {
        type: "styledImage",
        label: "Hero Image Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentHeroComponent: PuckComponent<YextDeepCurrentHeroProps> = (
  props,
) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument() as Record<string, unknown> | undefined;
  const locale = i18n.language;
  const sectionStyles = resolveSectionStyles(
    props.section,
    locale,
    streamDocument,
    "#0d7e86",
  );
  const content = props.content ?? {
    statusEyebrow: props.statusEyebrow,
    headline: props.headline,
    body: props.body,
    primaryCta: props.primaryCta,
    secondaryCta: props.secondaryCta,
    heroImage: props.heroImage,
    heroImageAriaLabel: props.heroImageAriaLabel,
  };
  const styles = props.styles ?? {
    textColor: undefined,
    primaryCtaFillColor: undefined,
    primaryCtaTextColor: undefined,
    secondaryCtaFillColor: undefined,
    secondaryCtaTextColor: undefined,
    ctaFillColor: undefined,
    ctaTextColor: undefined,
    primaryCtaVariant: "solid",
    secondaryCtaVariant: "solid",
    eyebrowStyle: props.eyebrowStyle ?? defaultTextStyle,
    headingStyle: props.headingStyle ?? defaultTextStyle,
    bodyStyle: props.bodyStyle ?? defaultTextStyle,
    primaryButtonStyle: props.primaryButtonStyle ?? defaultButtonStyle,
    secondaryButtonStyle: props.secondaryButtonStyle ?? defaultButtonStyle,
    imageStyle: props.imageStyle ?? defaultImageStyle,
  };
  const showGradientOverlay = props.section.showGradientOverlay !== false;
  const gradientColor = resolveThemeColor(
    props.section.gradientColor,
    "#0d7e86",
  );
  const textColor = resolveThemeColor(styles.textColor, "#ffffff");
  const primaryCtaFillColor = resolveThemeColor(
    styles.primaryCtaFillColor ?? styles.ctaFillColor,
    "#202020",
  );
  const primaryCtaTextColor = resolveThemeColor(
    styles.primaryCtaTextColor ?? styles.ctaTextColor,
    getContrastingTextColor(primaryCtaFillColor),
  );
  const secondaryCtaFillColor = resolveThemeColor(
    styles.secondaryCtaFillColor ?? styles.ctaFillColor,
    "#ffffff",
  );
  const secondaryCtaTextColor = resolveThemeColor(
    styles.secondaryCtaTextColor ?? styles.ctaTextColor,
    getContrastingTextColor(secondaryCtaFillColor),
  );
  const primaryCtaTheme = createHeroCtaTheme(
    styles.primaryCtaVariant || "solid",
    primaryCtaFillColor,
    primaryCtaTextColor,
  );
  const secondaryCtaTheme = createHeroCtaTheme(
    styles.secondaryCtaVariant || "solid",
    secondaryCtaFillColor,
    secondaryCtaTextColor,
  );
  const overlayGradient = `linear-gradient(90deg, color-mix(in srgb, ${gradientColor} 88%, transparent) 0%, color-mix(in srgb, ${gradientColor} 74%, transparent) 38%, color-mix(in srgb, ${gradientColor} 26%, transparent) 68%, color-mix(in srgb, ${gradientColor} 8%, transparent) 100%)`;
  const statusEyebrow = resolveText(
    content.statusEyebrow,
    locale,
    streamDocument,
    "Open Now: Closes at 5:00 PM",
  );
  const headline = resolveText(
    content.headline,
    locale,
    streamDocument,
    "Northstar Wealth Partners - Uptown Charlotte",
  );
  const body = resolveText(
    content.body,
    locale,
    streamDocument,
    "Northstar Wealth Partners - Uptown Charlotte provides wealth management, retirement planning, and financial advisory services for individuals, families, and business owners across the Charlotte metro area.",
  );
  const primaryCta = resolveCta(content.primaryCta, locale, streamDocument);
  const secondaryCta = resolveCta(content.secondaryCta, locale, streamDocument);
  const heroImage = resolveImageData(
    content.heroImage,
    locale,
    streamDocument,
    defaultHeroImageUrl,
    "Savings jar",
  );
  const heroImageAriaLabel = resolveText(
    content.heroImageAriaLabel,
    locale,
    streamDocument,
    heroImage.alt,
  );
  const backgroundImage = props.section.backgroundImage
    ? resolveImageData(
        props.section.backgroundImage,
        locale,
        streamDocument,
        heroImage.src,
        heroImage.alt,
      )
    : heroImage;
  const primaryButtonClass = `yext-deep-current-hero-primary-${props.id}`;
  const secondaryButtonClass = `yext-deep-current-hero-secondary-${props.id}`;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentHero${getAnalyticsScopeHash(props.id)}`}
      >
        <style>
          {buttonThemeToStylesheet(primaryButtonClass, primaryCtaTheme)}
          {buttonThemeToStylesheet(secondaryButtonClass, secondaryCtaTheme)}
        </style>
        <section
          className="overflow-x-clip"
          style={{
            ...sectionStyles,
            backgroundImage: undefined,
          }}
        >
          <div className="relative isolate overflow-hidden">
            {backgroundImage.src ? (
              <img
                alt={backgroundImage.alt}
                aria-label={heroImageAriaLabel}
                className="absolute inset-0 h-full w-full object-cover object-[72%_50%]"
                src={backgroundImage.src}
                style={imageStyleToCss(styles.imageStyle)}
              />
            ) : null}
            {showGradientOverlay ? (
              <div
                className="absolute inset-0"
                style={{ backgroundImage: overlayGradient }}
              />
            ) : null}
            <div className="relative mx-auto flex min-h-[540px] max-w-[1410px] items-center px-6 py-12 md:min-h-[640px] md:py-16 lg:min-h-[680px] lg:py-20">
              <div
                className="relative z-[1] flex min-w-0 max-w-[980px] flex-col gap-6 py-2"
                style={{ color: textColor }}
              >
              <div
                className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em]"
                style={{
                  borderColor: "rgba(255,255,255,0.48)",
                  backgroundColor: "rgba(255,255,255,0.72)",
                  color: "#44525c",
                  ...textStyleToCss(styles.eyebrowStyle),
                }}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" />
                {statusEyebrow}
              </div>
              <div className="space-y-4">
                <h1
                  className="max-w-[980px] text-[2.7rem] font-bold leading-[0.98] tracking-[-0.055em] md:text-[4.5rem] lg:text-[5rem]"
                  style={{ color: textColor, ...textStyleToCss(styles.headingStyle) }}
                >
                  {headline}
                </h1>
                <p
                  className="max-w-[900px] text-[1rem] leading-8 md:text-[1.08rem]"
                  style={{
                    color: textColor,
                    opacity: 0.92,
                    ...textStyleToCss(styles.bodyStyle),
                  }}
                >
                  {body}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 pt-1">
                {primaryCta ? (
                  <a
                    href={primaryCta.link || "#"}
                    rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
                    target={primaryCta.openInNewTab ? "_blank" : undefined}
                  >
                    <span
                      className={`inline-flex min-h-[60px] items-center rounded-[14px] border px-8 py-3 text-base font-semibold transition-colors ${primaryButtonClass}`}
                      style={{
                        ...buttonThemeToCss(primaryCtaTheme),
                        ...buttonStyleToCss(styles.primaryButtonStyle),
                      }}
                    >
                      {primaryCta.label || "Schedule Consultation"}
                    </span>
                  </a>
                ) : null}
                {secondaryCta ? (
                  <a
                    href={secondaryCta.link || "#"}
                    rel={secondaryCta.openInNewTab ? "noreferrer" : undefined}
                    target={secondaryCta.openInNewTab ? "_blank" : undefined}
                  >
                    <span
                      className={`inline-flex min-h-[60px] items-center rounded-[14px] border px-8 py-3 text-base font-semibold transition-colors ${secondaryButtonClass}`}
                      style={{
                        ...buttonThemeToCss(secondaryCtaTheme),
                        ...buttonStyleToCss(styles.secondaryButtonStyle),
                      }}
                    >
                      {secondaryCta.label || "Get Directions"}
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextDeepCurrentHero: YextComponentConfig<YextDeepCurrentHeroProps> = {
  label: "Deep Current Hero",
  fields: SectionFields,
  defaultProps: {
    section: {
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      backgroundImage: undefined,
      gradientColor: {
        selectedColor: "[#0D7E86]",
        contrastingColor: "white",
        isDarkColor: true,
      },
      showGradientOverlay: true,
      visibleOnLivePage: true,
    },
    content: {
      statusEyebrow: createEditableText("Open Now: Closes at 5:00 PM"),
      headline: createEditableText(
        "Northstar Wealth Partners - Uptown Charlotte",
      ),
      body: createEditableText(
        "Northstar Wealth Partners - Uptown Charlotte provides wealth management, retirement planning, and financial advisory services for individuals, families, and business owners across the Charlotte metro area.",
      ),
      primaryCta: createEditableLink("Schedule Consultation", "#"),
      secondaryCta: createEditableLink("Get Directions", "#"),
      heroImage: createDefaultImage(defaultHeroImageUrl, "Savings jar"),
      heroImageAriaLabel: createEditableText("Savings jar"),
    },
    styles: {
      textColor: {
        selectedColor: "white",
        contrastingColor: "black",
        isDarkColor: false,
      },
      primaryCtaFillColor: {
        selectedColor: "[#202020]",
        contrastingColor: "white",
        isDarkColor: true,
      },
      primaryCtaTextColor: {
        selectedColor: "white",
        contrastingColor: "black",
        isDarkColor: false,
      },
      secondaryCtaFillColor: {
        selectedColor: "white",
        contrastingColor: "black",
        isDarkColor: false,
      },
      secondaryCtaTextColor: {
        selectedColor: "[#202020]",
        contrastingColor: "white",
        isDarkColor: true,
      },
      primaryCtaVariant: "solid",
      secondaryCtaVariant: "solid",
      eyebrowStyle: defaultTextStyle,
      headingStyle: defaultTextStyle,
      bodyStyle: defaultTextStyle,
      primaryButtonStyle: defaultButtonStyle,
      secondaryButtonStyle: defaultButtonStyle,
      imageStyle: defaultImageStyle,
    },
  },
  render: YextDeepCurrentHeroComponent,
};
