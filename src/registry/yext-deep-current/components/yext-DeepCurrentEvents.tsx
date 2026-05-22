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


type EventCard = {
  image: EditableImage;
  name: EditableText;
  eventTime: EditableText;
  description: EditableText;
  cta: EditableCta;
};

type EventsContent = {
  sectionHeading: EditableText;
  sectionDescription: EditableText;
  events: EventCard[];
};

type EventsStyles = {
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  cardBackgroundColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
  headingStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  cardTitleStyle: typeof defaultTextStyle;
  linkStyle: typeof defaultLinkStyle;
  imageStyle: typeof defaultImageStyle;
};

type YextDeepCurrentEventsProps = {
  section: SectionTheme & {
    headingTextColor?: ThemeColorValue;
    bodyTextColor?: ThemeColorValue;
    cardBackgroundColor?: ThemeColorValue;
  };
  content?: EventsContent;
  styles?: EventsStyles;
  sectionHeading?: EditableText;
  sectionDescription?: EditableText;
  events?: EventCard[];
};

const defaultImages = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
];

const EventsFields: YextFields<YextDeepCurrentEventsProps> = {
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
      events: {
        label: "Events",
        type: "array",
        defaultItemProps: {
          image: undefined,
          name: createEditableText("Event name"),
          eventTime: createEditableText("Event time"),
          description: createEditableText("Event description"),
          cta: createEditableLink("Learn more", "#"),
        },
        arrayFields: {
          image: {
            type: "image",
            label: "Image",
          },
          name: createEditableTextField("Event Name"),
          eventTime: createEditableTextField("Event Time"),
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
      linkTextColor: {
        label: "Link Text Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      cardBackgroundColor: {
        label: "Card Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
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

export const YextDeepCurrentEventsComponent: PuckComponent<YextDeepCurrentEventsProps> = (
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
  const headingColor = resolveThemeColor(
    styles?.headingTextColor ?? props.section.headingTextColor,
    "#1a1a1a",
  );
  const bodyColor = resolveThemeColor(
    styles?.bodyTextColor ?? props.section.bodyTextColor,
    "#676767",
  );
  const linkColor = resolveThemeColor(styles?.linkTextColor, headingColor);
  const cardBackgroundColor = resolveThemeColor(
    styles?.cardBackgroundColor ?? props.section.cardBackgroundColor,
    "#ffffff",
  );
  const events = (content?.events ?? props.events ?? []).length
    ? (content?.events ?? props.events ?? [])
    : [
        {
          image: undefined,
          name: createEditableText("Event name"),
          eventTime: createEditableText("Event time"),
          description: createEditableText("Event description"),
          cta: createEditableLink("Learn more", "#"),
        },
      ];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentEvents${getAnalyticsScopeHash(props.id)}`}
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
                  "Upcoming Events",
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
                  "Highlight upcoming seminars, planning workshops, or community conversations in the same polished card format used throughout the template.",
                )}
              </p>
            </div>
            <div className="grid justify-center gap-5 lg:grid-cols-3">
              {events.map((event, index) => {
                const title = resolveText(
                  event.name,
                  locale,
                  streamDocument,
                  "Event name",
                );
                const image = resolveImageData(
                  event.image,
                  locale,
                  streamDocument,
                  defaultImages[index % defaultImages.length],
                  title,
                );
                const resolvedCta = resolveCta(event.cta, locale, streamDocument);

                return (
                  <article
                    key={`${title}-${index}`}
                    className="overflow-hidden rounded-[16px] border border-black/5 shadow-[0_6px_22px_rgba(9,30,66,0.08)]"
                    style={{ backgroundColor: cardBackgroundColor }}
                  >
                    <img
                      alt={image.alt}
                      className="h-[220px] w-full object-cover"
                      src={image.src}
                      style={imageStyleToCss(styles?.imageStyle)}
                    />
                    <div className="p-6">
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.18em]"
                        style={{
                          color: bodyColor,
                          ...textStyleToCss(styles?.bodyStyle),
                        }}
                      >
                        {resolveText(
                          event.eventTime,
                          locale,
                          streamDocument,
                          "Event time",
                        )}
                      </p>
                      <h3
                        className="mt-3 text-[1.2rem] font-semibold"
                        style={{
                          color: headingColor,
                          ...textStyleToCss(styles?.cardTitleStyle),
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        className="mt-3 text-sm leading-7"
                        style={{
                          color: bodyColor,
                          ...textStyleToCss(styles?.bodyStyle),
                        }}
                      >
                        {resolveText(
                          event.description,
                          locale,
                          streamDocument,
                          "Event description",
                        )}
                      </p>
                      {resolvedCta?.link ? (
                        <a
                          className="mt-5 inline-flex text-sm font-semibold"
                          href={resolvedCta.link || "#"}
                          style={{
                            color: linkColor,
                            ...linkStyleToCss(styles?.linkStyle),
                          }}
                          rel={resolvedCta.openInNewTab ? "noreferrer" : undefined}
                          target={resolvedCta.openInNewTab ? "_blank" : undefined}
                        >
                          {resolvedCta.label}
                        </a>
                      ) : null}
                    </div>
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

export const YextDeepCurrentEvents: YextComponentConfig<YextDeepCurrentEventsProps> = {
  label: "Deep Current Events",
  fields: EventsFields,
  defaultProps: {
    section: {
      backgroundColor: {
        selectedColor: "[#f8f8f8]",
        contrastingColor: "palette-quaternary",
      },
      visibleOnLivePage: true,
    },
    content: {
      sectionHeading: createEditableText("Upcoming Events"),
      sectionDescription: createEditableText(
        "Highlight upcoming seminars, planning workshops, or community conversations in the same polished card format used throughout the template.",
      ),
      events: [
        {
          image: undefined,
          name: createEditableText("Quarterly Market Outlook Breakfast"),
          eventTime: createEditableText("Thursday, June 20 • 8:30 AM"),
          description: createEditableText(
            "Join local advisors for a discussion on market conditions, retirement confidence, and planning priorities for the second half of the year.",
          ),
          cta: createEditableLink("Reserve your spot", "#"),
        },
        {
          image: undefined,
          name: createEditableText("Retirement Planning Workshop"),
          eventTime: createEditableText("Tuesday, July 9 • 5:30 PM"),
          description: createEditableText(
            "A practical workshop covering income planning, tax-aware withdrawal strategies, and portfolio alignment for retirement transitions.",
          ),
          cta: createEditableLink("View details", "#"),
        },
        {
          image: undefined,
          name: createEditableText("Small Business Owner Roundtable"),
          eventTime: createEditableText("Wednesday, July 24 • 12:00 PM"),
          description: createEditableText(
            "A focused conversation for entrepreneurs exploring succession planning, liquidity events, and long-term financial organization.",
          ),
          cta: createEditableLink("Request an invite", "#"),
        },
      ],
    },
    styles: {
      headingTextColor: {
        selectedColor: "palette-quaternary",
        contrastingColor: "white",
      },
      bodyTextColor: {
        selectedColor: "[#676767]",
        contrastingColor: "white",
      },
      linkTextColor: {
        selectedColor: "palette-quaternary",
        contrastingColor: "white",
      },
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "palette-quaternary",
      },
      headingStyle: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      bodyStyle: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      cardTitleStyle: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      linkStyle: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
        includeCaret: "default",
        letterSpacing: "default",
      },
      imageStyle: {
        borderRadius: "default",
      },
    },
  },
  render: YextDeepCurrentEventsComponent,
};
