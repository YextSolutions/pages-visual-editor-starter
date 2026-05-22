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


type ResourceLink = {
  cta: EditableCta;
};

type ResourceCard = {
  image: EditableImage;
  imageAriaLabel: EditableText;
  title: EditableText;
  description: EditableText;
  textLinks: ResourceLink[];
  primaryCta: EditableCta;
};

type ResourcesContent = {
  cards: ResourceCard[];
};

type ResourcesStyles = {
  titleStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  linkStyle: typeof defaultLinkStyle;
  buttonStyle: typeof defaultButtonStyle;
  imageStyle: typeof defaultImageStyle;
};

type YextDeepCurrentResourcesProps = {
  section: SectionTheme;
  content?: ResourcesContent;
  styles?: ResourcesStyles;
  cards?: ResourceCard[];
  titleStyle?: typeof defaultTextStyle;
  bodyStyle?: typeof defaultTextStyle;
  linkStyle?: typeof defaultLinkStyle;
  buttonStyle?: typeof defaultButtonStyle;
  imageStyle?: typeof defaultImageStyle;
};

const promoImageOne = createCapturedAssetUrl("promo1.jpg");
const promoImageTwo = createCapturedAssetUrl("promo2.jpg");

const SectionFields: YextFields<YextDeepCurrentResourcesProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: createSectionThemeFields(),
  },
  content: {
    label: "Content",
    type: "object",
    objectFields: {
      cards: {
        type: "array",
        label: "Resource Cards",
        defaultItemProps: {
          image: createDefaultImage("", "Resource image"),
          imageAriaLabel: createEditableText("Resource image"),
          title: createEditableText("Card title"),
          description: createEditableText("Card description"),
          textLinks: [],
          primaryCta: createEditableLink("Learn more", "#"),
        },
        arrayFields: {
          image: {
            type: "image",
            label: "Image",
          },
          imageAriaLabel: createEditableTextField("Image Aria Label"),
          title: createEditableTextField("Title"),
          description: createEditableTextField("Description"),
          textLinks: {
            type: "array",
            label: "Text Links",
            defaultItemProps: {
              cta: createEditableLink("Link", "#"),
            },
            arrayFields: {
              cta: createEditableLinkField("Link"),
            },
          },
          primaryCta: createEditableLinkField("Primary CTA"),
        },
      },
    },
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      titleStyle: {
        type: "styledText",
        label: "Title Style",
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
      imageStyle: {
        type: "styledImage",
        label: "Image Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentResourcesComponent: PuckComponent<YextDeepCurrentResourcesProps> = (
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
    headingTextColor: "#ffffff",
    bodyTextColor: "#f2f5f7",
    linkTextColor: "#ffffff",
    buttonTextColor: "#111111",
  });

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentResources${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          id="disclosures"
          className="overflow-x-clip py-11"
          style={sectionStyles}
        >
          <div className="mx-auto max-w-[1410px] px-6">
            <div className="grid justify-center gap-5 lg:[grid-template-columns:repeat(2,minmax(320px,620px))]">
              {(content?.cards ?? props.cards ?? []).map((card, index) => {
                const primaryCta = resolveCta(card.primaryCta, locale, streamDocument);
                const title = resolveText(
                  card.title,
                  locale,
                  streamDocument,
                  "Card title",
                );
                const image = resolveImageData(
                  card.image,
                  locale,
                  streamDocument,
                  index === 0 ? promoImageOne : promoImageTwo,
                  title,
                );

                return (
                  <article
                    key={`${title}-${index}`}
                    className="relative w-full overflow-hidden rounded-[16px] shadow-[0_6px_22px_rgba(9,30,66,0.08)]"
                  >
                    <img
                      alt={image.alt}
                      aria-label={resolveText(
                        card.imageAriaLabel,
                        locale,
                        streamDocument,
                        image.alt,
                      )}
                      className="h-full min-h-[280px] w-full object-cover"
                      src={image.src}
                      style={imageStyleToCss(styles?.imageStyle ?? props.imageStyle)}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(8,14,22,0.56)_0%,rgba(5,10,16,0.72)_40%,rgba(3,7,12,0.86)_100%)]" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3
                        className="text-[1.35rem] font-semibold"
                        style={{
                          color: textColors.headingTextColor,
                          ...textStyleToCss(styles?.titleStyle ?? props.titleStyle),
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        className="mt-3 max-w-[560px] text-sm leading-7"
                        style={{
                          color: textColors.bodyTextColor,
                          ...textStyleToCss(styles?.bodyStyle ?? props.bodyStyle),
                        }}
                      >
                        {resolveText(
                          card.description,
                          locale,
                          streamDocument,
                          "Card description",
                        )}
                      </p>
                      {card.textLinks.length > 0 ? (
                        <div className="mt-5 grid gap-2 text-sm font-medium">
                          {card.textLinks.map((link, linkIndex) => {
                            const resolvedCta = resolveCta(
                              link.cta,
                              locale,
                              streamDocument,
                            );

                            if (!resolvedCta) {
                              return null;
                            }

                            return (
                              <a
                                key={`${resolvedCta.label}-${linkIndex}`}
                                href={resolvedCta.link || "#"}
                                rel={resolvedCta.openInNewTab ? "noreferrer" : undefined}
                                style={{
                                  color: textColors.linkTextColor,
                                  ...linkStyleToCss(styles?.linkStyle ?? props.linkStyle),
                                }}
                                target={resolvedCta.openInNewTab ? "_blank" : undefined}
                              >
                                {resolvedCta.label || "Link"}
                              </a>
                            );
                          })}
                        </div>
                      ) : null}
                      {primaryCta ? (
                        <div className="mt-5">
                          <a
                            href={primaryCta.link || "#"}
                            rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
                            target={primaryCta.openInNewTab ? "_blank" : undefined}
                          >
                            <span
                              className="inline-flex min-h-[42px] items-center rounded-[10px] border border-black bg-white px-6 py-2.5 text-sm font-bold"
                              style={{
                                color: textColors.buttonTextColor,
                                ...buttonStyleToCss(styles?.buttonStyle ?? props.buttonStyle),
                              }}
                            >
                              {primaryCta.label || "Learn more"}
                            </span>
                          </a>
                        </div>
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

export const YextDeepCurrentResources: YextComponentConfig<YextDeepCurrentResourcesProps> =
  {
    label: "Deep Current Resources",
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
      cards: [
        {
          image: createDefaultImage(promoImageOne, "Before you meet with us"),
          imageAriaLabel: createEditableText("Before you meet with us"),
          title: createEditableText("Before You Meet With Us"),
          description: createEditableText(
            "Prospective clients can review advisor credentials, disclosures, and service information before scheduling a consultation. Additional regulatory and advisory disclosures are available through the links below.",
          ),
          textLinks: [
            {
              cta: createEditableLink("Advisory disclosures", "#"),
            },
            {
              cta: createEditableLink("Regulatory information", "#"),
            },
            {
              cta: createEditableLink("Privacy policy", "#"),
            },
            {
              cta: createEditableLink("FINRA BrokerCheck", "#"),
            },
          ],
          primaryCta: createEditableLink("", "#"),
        },
        {
          image: createDefaultImage(
            promoImageTwo,
            "Community and client resources",
          ),
          imageAriaLabel: createEditableText("Community and client resources"),
          title: createEditableText("Community & Client Resources"),
          description: createEditableText(
            "Northstar Wealth Partners regularly hosts educational workshops and retirement planning events for Charlotte-area residents. Clients can also schedule appointments, review meeting details, and securely manage communications through the Northstar client portal and mobile app.",
          ),
          textLinks: [],
          primaryCta: createEditableLink("View Event Calendar", "#"),
        },
      ],
    },
    styles: {
      titleStyle: defaultTextStyle,
      bodyStyle: defaultTextStyle,
      linkStyle: defaultLinkStyle,
      buttonStyle: defaultButtonStyle,
      imageStyle: defaultImageStyle,
    },
    },
    render: YextDeepCurrentResourcesComponent,
  };
