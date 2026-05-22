import * as React from "react";
import type { HoursType } from "@yext/pages-components";
import { PuckComponent } from "@puckeditor/core";
import {
  getAnalyticsScopeHash,
  HoursTableAtom,
  VisibilityWrapper,
  YextComponentConfig,
  YextFields,
  resolveComponentData,
  useDocument,
  type YextEntityField,
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


type InfoRow = {
  label: EditableText;
  value: EditableText;
};

type DetailsContent = {
  sectionHeading: EditableText;
  infoCardTitle: EditableText;
  infoRows: InfoRow[];
  primaryAction: EditableCta;
  secondaryAction: EditableCta;
  hoursTitle: EditableText;
  hoursData: YextEntityField<HoursType>;
  hoursFooterText: EditableText;
  secondaryHoursData: YextEntityField<HoursType>;
  clientServicesTitle: EditableText;
  languagesLabel: EditableText;
  languagesValue: EditableText;
  accessibilityLabel: EditableText;
  accessibilityValue: EditableText;
  servicesLabel: EditableText;
  serviceItems: { text: EditableText }[];
};

type DetailsStyles = {
  headingStyle: typeof defaultTextStyle;
  cardTitleStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  linkStyle: typeof defaultLinkStyle;
  buttonStyle: typeof defaultButtonStyle;
};

type YextDeepCurrentDetailsProps = {
  section: SectionTheme;
  content?: DetailsContent;
  styles?: DetailsStyles;
  sectionHeading?: EditableText;
  infoCardTitle?: EditableText;
  infoRows?: InfoRow[];
  primaryAction?: EditableCta;
  secondaryAction?: EditableCta;
  hoursTitle?: EditableText;
  hoursData?: YextEntityField<HoursType>;
  hoursFooterText?: EditableText;
  secondaryHoursData?: YextEntityField<HoursType>;
  clientServicesTitle?: EditableText;
  languagesLabel?: EditableText;
  languagesValue?: EditableText;
  accessibilityLabel?: EditableText;
  accessibilityValue?: EditableText;
  servicesLabel?: EditableText;
  serviceItems?: { text: EditableText }[];
  headingStyle?: typeof defaultTextStyle;
  cardTitleStyle?: typeof defaultTextStyle;
  bodyStyle?: typeof defaultTextStyle;
  linkStyle?: typeof defaultLinkStyle;
  buttonStyle?: typeof defaultButtonStyle;
};

const SectionFields: YextFields<YextDeepCurrentDetailsProps> = {
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
      infoCardTitle: createEditableTextField("Primary Card Heading"),
      infoRows: {
        type: "array",
        label: "Details",
        defaultItemProps: {
          label: createEditableText("Label"),
          value: createEditableText("Value"),
        },
        arrayFields: {
          label: createEditableTextField("Label"),
          value: createEditableTextField("Value"),
        },
      },
      primaryAction: createEditableLinkField("Primary Action"),
      secondaryAction: createEditableLinkField("Secondary Action"),
      hoursTitle: createEditableTextField("Hours Heading"),
      hoursData: {
        type: "entityField",
        label: "Hours",
        filter: { types: ["type.hours"] },
        disableConstantValueToggle: true,
      },
      hoursFooterText: createEditableTextField("Secondary Hours Heading"),
      secondaryHoursData: {
        type: "entityField",
        label: "Secondary Hours",
        filter: { types: ["type.hours"] },
        disableConstantValueToggle: true,
      },
      clientServicesTitle: createEditableTextField("Secondary Card Heading"),
      languagesLabel: createEditableTextField("Languages Label"),
      languagesValue: createEditableTextField("Languages Value"),
      accessibilityLabel: createEditableTextField("Accessibility Label"),
      accessibilityValue: createEditableTextField("Accessibility Value"),
      servicesLabel: createEditableTextField("Services Label"),
      serviceItems: {
        type: "array",
        label: "Service Items",
        defaultItemProps: {
          text: createEditableText("Service item"),
        },
        arrayFields: {
          text: createEditableTextField("Text"),
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
      cardTitleStyle: {
        type: "styledText",
        label: "Card Title Style",
        visible: false,
      },
      bodyStyle: {
        type: "styledText",
        label: "Body Style",
        visible: false,
      },
      linkStyle: {
        type: "styledLink",
        label: "Text Link Style",
        visible: false,
      },
      buttonStyle: {
        type: "styledButton",
        label: "Button Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentDetailsComponent: PuckComponent<YextDeepCurrentDetailsProps> = (
  props,
) => {
  const [showSecondaryHours, setShowSecondaryHours] = React.useState(false);
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
    bodyTextColor: "#676767",
    accentTextColor: "#1a1a1a",
    linkTextColor: "#666666",
    buttonTextColor: "#ffffff",
  });
  const sectionHeading = resolveText(
    content?.sectionHeading ?? props.sectionHeading,
    locale,
    streamDocument,
    "Location Details",
  );
  const infoCardTitle = resolveText(
    content?.infoCardTitle ?? props.infoCardTitle,
    locale,
    streamDocument,
    "Location Information",
  );
  const hoursTitle = resolveText(
    content?.hoursTitle ?? props.hoursTitle,
    locale,
    streamDocument,
    "Lobby Hours",
  );
  const clientServicesTitle = resolveText(
    content?.clientServicesTitle ?? props.clientServicesTitle,
    locale,
    streamDocument,
    "Client Services",
  );
  const languagesLabel = resolveText(
    content?.languagesLabel ?? props.languagesLabel,
    locale,
    streamDocument,
    "Languages",
  );
  const languagesValue = resolveText(
    content?.languagesValue ?? props.languagesValue,
    locale,
    streamDocument,
    "English, Spanish, Chinese, French",
  );
  const accessibilityLabel = resolveText(
    content?.accessibilityLabel ?? props.accessibilityLabel,
    locale,
    streamDocument,
    "Accessibility",
  );
  const accessibilityValue = resolveText(
    content?.accessibilityValue ?? props.accessibilityValue,
    locale,
    streamDocument,
    "ADA compliant entrance, elevator access, private consultation rooms",
  );
  const servicesLabel = resolveText(
    content?.servicesLabel ?? props.servicesLabel,
    locale,
    streamDocument,
    "Services",
  );
  const primaryAction = resolveCta(
    content?.primaryAction ?? props.primaryAction,
    locale,
    streamDocument,
  );
  const secondaryAction = resolveCta(
    content?.secondaryAction ?? props.secondaryAction,
    locale,
    streamDocument,
  );
  const hoursData = resolveComponentData(
    (content?.hoursData ?? props.hoursData) as any,
    locale,
    streamDocument as any,
  ) as HoursType | undefined;
  const secondaryHoursTitle = resolveText(
    content?.hoursFooterText ?? props.hoursFooterText,
    locale,
    streamDocument,
    "ATM Deposit Cut-Off Hours",
  );
  const secondaryHoursData = resolveComponentData(
    (content?.secondaryHoursData ?? props.secondaryHoursData) as any,
    locale,
    streamDocument as any,
  ) as HoursType | undefined;
  const shouldShowSecondaryHours = Boolean(
    secondaryHoursData || props.puck.isEditing,
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentDetails${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          id="locations"
          className="overflow-x-clip py-11"
          style={sectionStyles}
        >
          <div className="mx-auto max-w-[1410px] px-6">
            <div className="mx-auto mb-8 max-w-[780px] text-center">
              <h2
                className="text-[2.2rem] font-bold tracking-[-0.04em]"
                style={{
                  color: textColors.headingTextColor,
                  ...textStyleToCss(styles?.headingStyle ?? props.headingStyle),
                }}
              >
                {sectionHeading}
              </h2>
            </div>
            <div className="grid justify-center gap-5 lg:[grid-template-columns:repeat(3,minmax(280px,430px))]">
              <article className="min-w-0 w-full rounded-[14px] border border-black/5 bg-[#f7f7fa] p-6 shadow-sm">
                <h3
                  className="mb-4 text-[1.02rem] font-semibold"
                  style={{
                    color: textColors.accentTextColor,
                    ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                  }}
                >
                  {infoCardTitle}
                </h3>
                <div
                  className="space-y-3 text-sm leading-6"
                  style={{ color: textColors.bodyTextColor }}
                >
                  {(content?.infoRows ?? props.infoRows ?? []).map((row, index) => (
                    <div key={index}>
                      <div
                        className="font-semibold"
                        style={{
                          color: textColors.accentTextColor,
                          ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                        }}
                      >
                        {resolveText(row.label, locale, streamDocument, "Label")}
                      </div>
                      <div
                        style={{
                          color: textColors.bodyTextColor,
                          ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                        }}
                      >
                        {resolveText(row.value, locale, streamDocument, "Value")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {primaryAction ? (
                    <a
                      href={primaryAction.link || "#"}
                      rel={primaryAction.openInNewTab ? "noreferrer" : undefined}
                      target={primaryAction.openInNewTab ? "_blank" : undefined}
                    >
                      <span
                        className="inline-flex min-h-[38px] items-center rounded-[10px] bg-black px-4 text-xs font-bold text-white"
                        style={{
                          color: textColors.buttonTextColor,
                          ...buttonStyleToCss(styles?.buttonStyle ?? props.buttonStyle),
                        }}
                      >
                        {primaryAction.label || "Visit Website"}
                      </span>
                    </a>
                  ) : null}
                  {secondaryAction ? (
                    <a
                      href={secondaryAction.link || "#"}
                      rel={secondaryAction.openInNewTab ? "noreferrer" : undefined}
                      style={{
                        color: textColors.linkTextColor,
                        ...linkStyleToCss(styles?.linkStyle ?? props.linkStyle),
                      }}
                      target={secondaryAction.openInNewTab ? "_blank" : undefined}
                    >
                      <span className="inline-flex min-h-[38px] items-center px-1 text-xs font-medium">
                        {secondaryAction.label || "Book Appointment"}
                      </span>
                    </a>
                  ) : null}
                </div>
              </article>

              <article className="min-w-0 w-full rounded-[14px] border border-black/5 bg-[#f7f7fa] p-6 shadow-sm">
                <h3
                  className="mb-4 text-[1.02rem] font-semibold"
                  style={{
                    color: textColors.accentTextColor,
                    ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                  }}
                >
                  {hoursTitle}
                </h3>
                {hoursData ? (
                  <HoursTableAtom
                    className="text-sm leading-6 text-[#676767] [&_.HoursTable-row]:grid [&_.HoursTable-row]:grid-cols-[1fr_auto] [&_.HoursTable-row]:gap-3"
                    hours={hoursData}
                    collapseDays={false}
                    startOfWeek="monday"
                  />
                ) : (
                  <div
                    className="text-sm leading-6"
                    style={{ color: textColors.bodyTextColor }}
                  >
                    Hours unavailable
                  </div>
                )}
                {shouldShowSecondaryHours ? (
                  <div className="mt-5 border-t border-black/10 pt-4">
                    <button
                      className="flex w-full items-center justify-between text-left text-sm font-semibold"
                      onClick={() =>
                        setShowSecondaryHours((currentValue) => !currentValue)
                      }
                      style={{
                        color: textColors.accentTextColor,
                        ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                      }}
                      type="button"
                    >
                      <span>{secondaryHoursTitle}</span>
                      <span className="text-lg leading-none">
                        {showSecondaryHours ? "−" : "+"}
                      </span>
                    </button>
                    {showSecondaryHours ? (
                      <div className="mt-4">
                        {secondaryHoursData ? (
                          <HoursTableAtom
                            className="text-sm leading-6 text-[#676767] [&_.HoursTable-row]:grid [&_.HoursTable-row]:grid-cols-[1fr_auto] [&_.HoursTable-row]:gap-3"
                            hours={secondaryHoursData}
                            collapseDays={false}
                            startOfWeek="monday"
                          />
                        ) : (
                          <div
                            className="text-sm leading-6"
                            style={{ color: textColors.bodyTextColor }}
                          >
                            Hours unavailable
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>

              <article className="min-w-0 w-full rounded-[14px] border border-black/5 bg-[#f7f7fa] p-6 shadow-sm">
                <h3
                  className="mb-4 text-[1.02rem] font-semibold"
                  style={{
                    color: textColors.accentTextColor,
                    ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                  }}
                >
                  {clientServicesTitle}
                </h3>
                <div
                  className="space-y-5 text-sm leading-6"
                  style={{ color: textColors.bodyTextColor }}
                >
                  <div>
                    <div
                      className="font-semibold"
                      style={{
                        color: textColors.accentTextColor,
                        ...textStyleToCss(props.cardTitleStyle),
                      }}
                    >
                      {languagesLabel}
                    </div>
                    <div
                      style={{
                        color: textColors.bodyTextColor,
                        ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                      }}
                    >
                      {languagesValue}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{
                        color: textColors.accentTextColor,
                        ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                      }}
                    >
                      {accessibilityLabel}
                    </div>
                    <div
                      style={{
                        color: textColors.bodyTextColor,
                        ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                      }}
                    >
                      {accessibilityValue}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{
                        color: textColors.accentTextColor,
                        ...textStyleToCss(styles?.cardTitleStyle ?? props.cardTitleStyle),
                      }}
                    >
                      {servicesLabel}
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {(content?.serviceItems ?? props.serviceItems ?? []).map((item, index) => (
                        <li
                          key={index}
                          style={{
                            color: textColors.bodyTextColor,
                            ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                          }}
                        >
                          {resolveText(
                            item.text,
                            locale,
                            streamDocument,
                            "Service item",
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextDeepCurrentDetails: YextComponentConfig<YextDeepCurrentDetailsProps> = {
  label: "Deep Current Location Details",
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
      sectionHeading: createEditableText("Location Details"),
      infoCardTitle: createEditableText("Location Information"),
      infoRows: [
        {
          label: createEditableText("Address"),
          value: createEditableText("111 S Tryon St, Suite 1600, Charlotte, NC 28203"),
        },
        {
          label: createEditableText("Main Phone"),
          value: createEditableText("+1 (704) 555-0116"),
        },
        {
          label: createEditableText("Customer Service"),
          value: createEditableText("+1 (704) 555-0112"),
        },
        {
          label: createEditableText("Email"),
          value: createEditableText("uptown.charlotte@northstarwealthpartners.com"),
        },
        {
          label: createEditableText("NMLS number"),
          value: createEditableText("1987654"),
        },
      ],
      primaryAction: createEditableLink("Visit Website", "#"),
      secondaryAction: createEditableLink("Book Appointment", "#"),
      hoursTitle: createEditableText("Lobby Hours"),
      hoursData: {
        field: "hours",
        constantValue: undefined as unknown as HoursType,
        constantValueEnabled: false,
      },
      hoursFooterText: createEditableText("ATM Deposit Cut-Off Hours"),
      secondaryHoursData: {
        field: "driveThroughHours",
        constantValue: undefined as unknown as HoursType,
        constantValueEnabled: false,
      },
      clientServicesTitle: createEditableText("Client Services"),
      languagesLabel: createEditableText("Languages"),
      languagesValue: createEditableText("English, Spanish, Chinese, French"),
      accessibilityLabel: createEditableText("Accessibility"),
      accessibilityValue: createEditableText(
        "ADA compliant entrance, elevator access, private consultation rooms",
      ),
      servicesLabel: createEditableText("Services"),
      serviceItems: [
        { text: createEditableText("Private consultations") },
        { text: createEditableText("Accessible entrance") },
        { text: createEditableText("Notary on-site") },
        { text: createEditableText("Drive-thru ATM") },
      ],
    },
    styles: {
      headingStyle: defaultTextStyle,
      cardTitleStyle: defaultTextStyle,
      bodyStyle: defaultTextStyle,
      linkStyle: defaultLinkStyle,
      buttonStyle: defaultButtonStyle,
    },
  },
  render: YextDeepCurrentDetailsComponent,
};
