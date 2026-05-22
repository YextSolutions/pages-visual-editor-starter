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


type HeaderNavItem = {
  cta: EditableCta;
  ariaLabel: EditableText;
};

type HeaderActionIcon =
  | "search"
  | "user"
  | "phone"
  | "mail"
  | "calendar"
  | "arrow-right"
  | "none";
type HeaderActionDisplay = "icon-only" | "text-only" | "icon-and-text";

type HeaderAction = {
  cta: EditableCta;
  ariaLabel: EditableText;
  icon: HeaderActionIcon;
  display: HeaderActionDisplay;
  visible: boolean;
};

type HeaderAlignment = "left" | "center" | "right";

type HeaderLayout = {
  linksAlignment: HeaderAlignment;
  logoWidth: number;
};

type HeaderContent = {
  brandLogo: EditableImage;
  brandName: EditableText;
  brandHref: string;
  brandAriaLabel: EditableText;
  navigationAriaLabel: EditableText;
  navigationLinks: HeaderNavItem[];
  openMenuAriaLabel: EditableText;
  closeMenuAriaLabel: EditableText;
  actions: HeaderAction[];
};

type HeaderStyles = {
  brandTextColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
  layout?: HeaderLayout;
  brandStyle: typeof defaultTextStyle;
  navLinkStyle: typeof defaultLinkStyle;
  iconButtonStyle: typeof defaultLinkStyle;
};

type HeaderSectionTheme = SectionTheme & {
  headingTextColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
};

type YextDeepCurrentHeaderProps = {
  section: HeaderSectionTheme;
  content?: HeaderContent;
  styles?: HeaderStyles;
  brandLogo?: EditableImage;
  brandName?: EditableText;
  brandHref?: string;
  brandAriaLabel?: EditableText;
  navigationAriaLabel?: EditableText;
  navigationLinks?: HeaderNavItem[];
  openMenuAriaLabel?: EditableText;
  closeMenuAriaLabel?: EditableText;
  actions?: HeaderAction[];
  layout?: HeaderLayout;
  brandStyle?: typeof defaultTextStyle;
  navLinkStyle?: typeof defaultLinkStyle;
  iconButtonStyle?: typeof defaultLinkStyle;
};

const createDefaultNavItem = (label: string, href: string): HeaderNavItem => ({
  cta: {
    field: "",
    constantValue: {
      label,
      link: href,
      linkType: "URL",
    },
    constantValueEnabled: true,
  },
  ariaLabel: createEditableText(label),
});

const createDefaultAction = (
  label: string,
  icon: HeaderActionIcon,
): HeaderAction => ({
  cta: {
    field: "",
    constantValue: {
      label,
      link: "#",
      linkType: "URL",
    },
    constantValueEnabled: true,
  },
  ariaLabel: createEditableText(label),
  icon,
  display: "icon-only",
  visible: true,
});

const SectionFields: YextFields<YextDeepCurrentHeaderProps> = {
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
      brandLogo: {
        type: "image",
        label: "Logo",
      },
      brandName: {
        type: "entityField",
        label: "Brand Text",
        filter: { types: ["type.string"] },
      },
      brandHref: {
        type: "text",
        label: "Brand URL",
      },
      brandAriaLabel: {
        type: "entityField",
        label: "Brand Aria Label",
        filter: { types: ["type.string"] },
      },
      navigationAriaLabel: {
        type: "entityField",
        label: "Navigation Aria Label",
        filter: { types: ["type.string"] },
      },
      navigationLinks: {
        type: "array",
        label: "Links",
        defaultItemProps: createDefaultNavItem("Link", "#"),
        arrayFields: {
          cta: {
            type: "ctaSelector",
            label: "Link",
          },
          ariaLabel: {
            type: "entityField",
            label: "Aria Label",
            filter: { types: ["type.string"] },
          },
        },
      },
      openMenuAriaLabel: {
        type: "entityField",
        label: "Open Menu Aria Label",
        filter: { types: ["type.string"] },
      },
      closeMenuAriaLabel: {
        type: "entityField",
        label: "Close Menu Aria Label",
        filter: { types: ["type.string"] },
      },
      actions: {
        type: "array",
        label: "Actions",
        defaultItemProps: createDefaultAction("Action", "search"),
        arrayFields: {
          cta: {
            type: "ctaSelector",
            label: "CTA",
          },
          ariaLabel: {
            type: "entityField",
            label: "Aria Label",
            filter: { types: ["type.string"] },
          },
          icon: {
            type: "select",
            label: "Icon",
            options: [
              { label: "Search", value: "search" },
              { label: "User", value: "user" },
              { label: "Phone", value: "phone" },
              { label: "Mail", value: "mail" },
              { label: "Calendar", value: "calendar" },
              { label: "Arrow Right", value: "arrow-right" },
              { label: "None", value: "none" },
            ],
          },
          display: {
            type: "select",
            label: "Display",
            options: [
              { label: "Icon Only", value: "icon-only" },
              { label: "Text Only", value: "text-only" },
              { label: "Icon and Text", value: "icon-and-text" },
            ],
          },
          visible: {
            type: "radio",
            label: "Visible",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
      },
    },
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      brandTextColor: {
        label: "Brand Text Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      linkTextColor: {
        label: "Link Text Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      layout: {
        type: "object",
        label: "Layout",
        objectFields: {
          linksAlignment: {
            type: "select",
            label: "Links Alignment",
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
          logoWidth: {
            type: "number",
            label: "Logo Width",
          },
        },
      },
      brandStyle: {
        type: "styledText",
        label: "Brand Text Style",
        visible: false,
      },
      navLinkStyle: {
        type: "styledLink",
        label: "Navigation Link Style",
        visible: false,
      },
      iconButtonStyle: {
        type: "styledLink",
        label: "Icon Label Style",
        visible: false,
      },
    },
  },
};

const iconStroke = "currentColor";

const alignmentToJustifyContent: Record<
  HeaderAlignment,
  "flex-start" | "center" | "flex-end"
> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const SearchIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M10.875 18.75a7.875 7.875 0 1 0 0-15.75 7.875 7.875 0 0 0 0 15.75ZM16.443 16.443 21 21"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

const UserIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M12 12.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM4.5 21a7.5 7.5 0 0 1 15 0"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M4.75 5.5c0-.69.56-1.25 1.25-1.25h2.34c.6 0 1.11.42 1.23 1l.53 2.63c.08.4-.03.81-.31 1.11l-1.3 1.39a14.51 14.51 0 0 0 5.14 5.14l1.39-1.3c.3-.28.71-.39 1.11-.31l2.63.53c.58.12 1 .63 1 1.23V18c0 .69-.56 1.25-1.25 1.25h-.75C10.63 19.25 4.75 13.37 4.75 6.25V5.5Z"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const MailIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M4 7.25A2.25 2.25 0 0 1 6.25 5h11.5A2.25 2.25 0 0 1 20 7.25v9.5A2.25 2.25 0 0 1 17.75 19H6.25A2.25 2.25 0 0 1 4 16.75v-9.5Z"
      stroke={iconStroke}
      strokeWidth="2"
    />
    <path
      d="m5 7 7 5 7-5"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M7.25 4.75v2.5M16.75 4.75v2.5M4.75 9.25h14.5M6.25 6.25h11.5A1.5 1.5 0 0 1 19.25 7.75v10A1.5 1.5 0 0 1 17.75 19.25H6.25a1.5 1.5 0 0 1-1.5-1.5v-10a1.5 1.5 0 0 1 1.5-1.5Z"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={iconStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const actionIconByType: Record<HeaderActionIcon, React.ReactNode> = {
  search: <SearchIcon />,
  user: <UserIcon />,
  phone: <PhoneIcon />,
  mail: <MailIcon />,
  calendar: <CalendarIcon />,
  "arrow-right": <ArrowRightIcon />,
  none: null,
};

const HeaderActionLink = ({
  action,
  locale,
  streamDocument,
  label,
  children,
  style,
}: {
  action: HeaderAction;
  locale: string;
  streamDocument: Record<string, unknown> | undefined;
  label: string;
  children?: React.ReactNode;
  style: React.CSSProperties;
}) => {
  const resolvedCta = resolveCta(action.cta, locale, streamDocument);
  const href = resolvedCta?.link || "#";
  const linkLabel = resolvedCta?.label || label;
  const ariaLabel = resolveText(action.ariaLabel, locale, streamDocument, linkLabel);
  const icon = actionIconByType[action.icon];
  const showIcon = action.display !== "text-only" && icon;
  const showLabel = action.display !== "icon-only";

  if (!action.visible) {
    return null;
  }

  return (
    <a
      aria-label={ariaLabel}
      href={href}
      rel={resolvedCta?.openInNewTab ? "noreferrer" : undefined}
      style={style}
      target={resolvedCta?.openInNewTab ? "_blank" : undefined}
    >
      {children ?? (
        <span className="flex items-center gap-2">
          {showIcon ? <span className="flex items-center justify-center">{icon}</span> : null}
          {showLabel ? <span>{linkLabel}</span> : null}
        </span>
      )}
    </a>
  );
};

export const YextDeepCurrentHeaderComponent: PuckComponent<YextDeepCurrentHeaderProps> = (
  props,
) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { i18n } = useTranslation();
  const streamDocument = useDocument() as Record<string, unknown> | undefined;
  const locale = i18n.language;
  const content = props.content;
  const styles = props.styles;
  const sectionStyles = resolveSectionStyles(
    props.section,
    locale,
    streamDocument,
    "#ffffff",
  );
  const brandTextColor = resolveThemeColor(
    styles?.brandTextColor ?? props.section.headingTextColor,
    "#1a1a1a",
  );
  const linkTextColor = resolveThemeColor(
    styles?.linkTextColor ?? props.section.linkTextColor,
    "#666666",
  );
  const brandLogo = resolveImageData(
    content?.brandLogo ?? props.brandLogo,
    locale,
    streamDocument,
  );
  const brandName = resolveText(
    content?.brandName ?? props.brandName,
    locale,
    streamDocument,
    "Northstar Wealth Partners",
  );
  const brandHref = content?.brandHref ?? props.brandHref ?? "#";
  const brandAriaLabel = resolveText(
    content?.brandAriaLabel ?? props.brandAriaLabel,
    locale,
    streamDocument,
    brandName,
  );
  const navigationAriaLabel = resolveText(
    content?.navigationAriaLabel ?? props.navigationAriaLabel,
    locale,
    streamDocument,
    "Primary",
  );
  const openMenuAriaLabel = resolveText(
    content?.openMenuAriaLabel ?? props.openMenuAriaLabel,
    locale,
    streamDocument,
    "Open menu",
  );
  const closeMenuAriaLabel = resolveText(
    content?.closeMenuAriaLabel ?? props.closeMenuAriaLabel,
    locale,
    streamDocument,
    "Close menu",
  );
  const layout = {
    linksAlignment: "center" as HeaderAlignment,
    logoWidth: 168,
    ...(props.layout ?? {}),
    ...(styles?.layout ?? {}),
  };
  const brandLogoMaxWidth = layout.logoWidth > 0 ? layout.logoWidth : 168;
  const legacyProps = props as YextDeepCurrentHeaderProps & {
    searchAction?: HeaderAction;
    loginAction?: HeaderAction;
  };
  const configuredActions =
    (content?.actions ?? props.actions)?.length
      ? (content?.actions ?? props.actions)
      : [legacyProps.searchAction, legacyProps.loginAction].filter(
          (action): action is HeaderAction => Boolean(action),
        );
  const visibleActions = (configuredActions ?? []).filter((action) => action.visible);
  const navigationLinks = content?.navigationLinks ?? props.navigationLinks ?? [];
  const brandStyle = styles?.brandStyle ?? props.brandStyle ?? defaultTextStyle;
  const navLinkStyle = styles?.navLinkStyle ?? props.navLinkStyle ?? defaultLinkStyle;
  const iconButtonStyle =
    styles?.iconButtonStyle ??
    props.iconButtonStyle ?? {
      ...defaultLinkStyle,
      includeCaret: "none",
    };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentHeader${getAnalyticsScopeHash(props.id)}`}
      >
        <header
          style={{
            ...sectionStyles,
            borderBottom: "1px solid rgba(17, 24, 39, 0.09)",
          }}
        >
          <div className="mx-auto flex max-w-[1410px] items-center justify-between gap-5 px-6 py-4 md:hidden">
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? closeMenuAriaLabel : openMenuAriaLabel}
              className="flex h-10 w-10 items-center justify-center md:hidden"
              style={{ color: linkTextColor }}
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              <span className="relative block h-[2px] w-[22px] bg-current before:absolute before:left-0 before:top-[-7px] before:h-[2px] before:w-[22px] before:bg-current before:content-[''] after:absolute after:left-0 after:top-[7px] after:h-[2px] after:w-[22px] after:bg-current after:content-['']" />
            </button>

            <a
              aria-label={brandAriaLabel}
              className="flex flex-1 items-center justify-center gap-3 text-center text-sm font-semibold md:flex-none md:justify-start md:text-left"
              href={brandHref}
              style={{
                color: brandTextColor,
                ...textStyleToCss(brandStyle),
              }}
            >
              {brandLogo.src ? (
                <img
                  alt={brandLogo.alt || brandName}
                  className="h-10 w-auto max-w-[160px] object-contain"
                  src={brandLogo.src}
                />
              ) : null}
              {brandName}
            </a>

            <nav
              aria-label={navigationAriaLabel}
              className="hidden min-w-0 items-center gap-[26px] text-[15px] font-medium md:flex"
            >
              {navigationLinks.map((item, index) => {
                const resolvedCta = resolveCta(item.cta, locale, streamDocument);
                const linkLabel = resolvedCta?.label || `Link ${index + 1}`;
                const href = resolvedCta?.link || "#";
                const ariaLabel = resolveText(
                  item.ariaLabel,
                  locale,
                  streamDocument,
                  linkLabel,
                );

                return (
                  <a
                    key={`${href}-${index}`}
                    aria-label={ariaLabel}
                    href={href}
                    rel={resolvedCta?.openInNewTab ? "noreferrer" : undefined}
                    style={{
                      color: linkTextColor,
                      ...linkStyleToCss(navLinkStyle),
                    }}
                    target={resolvedCta?.openInNewTab ? "_blank" : undefined}
                  >
                    {linkLabel}
                  </a>
                );
              })}
            </nav>

            <div className="hidden items-center gap-[14px] md:flex" style={{ color: linkTextColor }}>
              {visibleActions.map((action, index) => (
                <HeaderActionLink
                  key={`top-${index}`}
                  action={action}
                  label={`Action ${index + 1}`}
                  locale={locale}
                  streamDocument={streamDocument}
                  style={{
                    color: linkTextColor,
                    ...buttonStyleToCss(iconButtonStyle),
                  }}
                />
              ))}
            </div>

            <div className="h-10 w-10 md:hidden" />
          </div>

          <div className="mx-auto hidden max-w-[1410px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-6 py-4 md:grid">
            <a
              aria-label={brandAriaLabel}
              className="flex min-w-0 items-center gap-3 text-sm font-semibold"
              href={brandHref}
              style={{
                color: brandTextColor,
                ...textStyleToCss(brandStyle),
              }}
            >
              {brandLogo.src ? (
                <img
                  alt={brandLogo.alt || brandName}
                  className="h-10 w-auto object-contain"
                  src={brandLogo.src}
                  style={{ maxWidth: `${brandLogoMaxWidth}px` }}
                />
              ) : null}
              {brandName}
            </a>

            <nav
              aria-label={navigationAriaLabel}
              className="flex min-w-0 w-full items-center gap-[26px] text-[15px] font-medium"
              style={{
                justifyContent: alignmentToJustifyContent[layout.linksAlignment],
              }}
            >
              {navigationLinks.map((item, index) => {
                const resolvedCta = resolveCta(item.cta, locale, streamDocument);
                const linkLabel = resolvedCta?.label || `Link ${index + 1}`;
                const href = resolvedCta?.link || "#";
                const ariaLabel = resolveText(
                  item.ariaLabel,
                  locale,
                  streamDocument,
                  linkLabel,
                );

                return (
                  <a
                    key={`desktop-${href}-${index}`}
                    aria-label={ariaLabel}
                    href={href}
                    rel={resolvedCta?.openInNewTab ? "noreferrer" : undefined}
                    style={{
                      color: linkTextColor,
                      ...linkStyleToCss(navLinkStyle),
                    }}
                    target={resolvedCta?.openInNewTab ? "_blank" : undefined}
                  >
                    {linkLabel}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-[14px]" style={{ color: linkTextColor }}>
              {visibleActions.map((action, index) => (
                <HeaderActionLink
                  key={`desktop-${index}`}
                  action={action}
                  label={`Action ${index + 1}`}
                  locale={locale}
                  streamDocument={streamDocument}
                  style={{
                    color: linkTextColor,
                    ...buttonStyleToCss(iconButtonStyle),
                  }}
                />
              ))}
            </div>
          </div>

          {menuOpen ? (
            <div className="border-t border-black/5 bg-white md:hidden">
              <div className="mx-auto max-w-[1410px] px-6 py-5">
                <nav aria-label={navigationAriaLabel} className="flex flex-col gap-4">
                  {navigationLinks.map((item, index) => {
                    const resolvedCta = resolveCta(item.cta, locale, streamDocument);
                    const linkLabel = resolvedCta?.label || `Link ${index + 1}`;
                    const href = resolvedCta?.link || "#";
                    const ariaLabel = resolveText(
                      item.ariaLabel,
                      locale,
                      streamDocument,
                      linkLabel,
                    );

                    return (
                      <a
                        key={`mobile-${href}-${index}`}
                        aria-label={ariaLabel}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        rel={resolvedCta?.openInNewTab ? "noreferrer" : undefined}
                        style={{
                          color: brandTextColor,
                          ...linkStyleToCss(navLinkStyle),
                        }}
                        target={resolvedCta?.openInNewTab ? "_blank" : undefined}
                      >
                        {linkLabel}
                      </a>
                    );
                  })}
                </nav>
                <div className="mt-5 flex flex-wrap items-center gap-4" style={{ color: linkTextColor }}>
                  {visibleActions.map((action, index) => (
                    <HeaderActionLink
                      key={`mobile-action-${index}`}
                      action={{
                        ...action,
                        display:
                          action.display === "icon-only" ? "icon-and-text" : action.display,
                      }}
                      label={`Action ${index + 1}`}
                      locale={locale}
                      streamDocument={streamDocument}
                      style={{
                        color: linkTextColor,
                        ...buttonStyleToCss(iconButtonStyle),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </header>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextDeepCurrentHeader: YextComponentConfig<YextDeepCurrentHeaderProps> = {
  label: "Deep Current Header",
  fields: SectionFields,
  defaultProps: {
    section: {
      backgroundColor: {
        selectedColor: "white",
        contrastingColor: "black",
      },
      visibleOnLivePage: true,
    },
    content: {
      brandLogo: createDefaultImage(""),
      brandName: createEditableText("Northstar Wealth Partners"),
      brandHref: "#",
      brandAriaLabel: createEditableText("Northstar Wealth Partners home"),
      navigationAriaLabel: createEditableText("Primary navigation"),
      navigationLinks: [
        createDefaultNavItem("Locations", "#locations"),
        createDefaultNavItem("Services", "#services"),
        createDefaultNavItem("Advisors", "#advisors"),
        createDefaultNavItem("Disclosures", "#disclosures"),
        createDefaultNavItem("Contact", "#contact"),
      ],
      openMenuAriaLabel: createEditableText("Open menu"),
      closeMenuAriaLabel: createEditableText("Close menu"),
      actions: [
        createDefaultAction("Search", "search"),
        createDefaultAction("Account", "user"),
      ],
    },
    styles: {
      layout: {
        linksAlignment: "center",
        logoWidth: 168,
      },
      brandStyle: defaultTextStyle,
      navLinkStyle: defaultLinkStyle,
      iconButtonStyle: {
        ...defaultLinkStyle,
        includeCaret: "none",
      },
    },
  },
  render: YextDeepCurrentHeaderComponent,
};
