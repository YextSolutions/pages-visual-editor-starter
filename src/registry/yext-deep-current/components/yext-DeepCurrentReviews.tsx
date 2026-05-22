import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  getAggregateRating,
  getAnalyticsScopeHash,
  VisibilityWrapper,
  YextComponentConfig,
  YextFields,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
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


type ReviewComment = {
  content?: string;
  commentDate?: string;
};

type ReviewItem = {
  authorName?: string;
  rating?: number;
  content?: string;
  reviewDate?: string;
  comments?: ReviewComment[];
};

type ReviewAggregate = {
  publisher?: string;
  topReviews?: ReviewItem[];
};

type ReviewStreamDocument = {
  ref_reviewsAgg?: ReviewAggregate[];
};

type ReviewsContent = {
  sectionHeading: EditableText;
  summaryLabel: EditableText;
};

type ReviewsStyles = {
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  accentColor?: ThemeColorValue;
  cardBackgroundColor?: ThemeColorValue;
};

type YextDeepCurrentReviewsProps = {
  section: SectionTheme & {
    headingTextColor?: ThemeColorValue;
    bodyTextColor?: ThemeColorValue;
    accentColor?: ThemeColorValue;
    cardBackgroundColor?: ThemeColorValue;
  };
  content?: ReviewsContent;
  styles?: ReviewsStyles;
  sectionHeading?: EditableText;
  summaryLabel?: EditableText;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const renderStars = (rating: number, color: string) => {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} style={{ color, opacity: index < rating ? 1 : 0.28 }}>
      ★
    </span>
  ));
};

const ReviewsFields: YextFields<YextDeepCurrentReviewsProps> = {
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
      summaryLabel: createEditableTextField("Summary Label"),
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
      accentColor: {
        label: "Accent Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      cardBackgroundColor: {
        label: "Card Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
};

export const YextDeepCurrentReviewsComponent: PuckComponent<YextDeepCurrentReviewsProps> = (
  props,
) => {
  const streamDocument = useDocument<ReviewStreamDocument>();
  const sectionStyles = resolveSectionStyles(
    props.section,
    "en",
    streamDocument as Record<string, unknown> | undefined,
    "#f8f8f8",
  );
  const headingColor = resolveThemeColor(
    props.styles?.headingTextColor ?? props.section.headingTextColor,
    "#1a1a1a",
  );
  const bodyColor = resolveThemeColor(
    props.styles?.bodyTextColor ?? props.section.bodyTextColor,
    "#676767",
  );
  const accentColor = resolveThemeColor(
    props.styles?.accentColor ?? props.section.accentColor,
    "#202020",
  );
  const cardBackgroundColor = resolveThemeColor(
    props.styles?.cardBackgroundColor ?? props.section.cardBackgroundColor,
    "#ffffff",
  );
  const aggregate = getAggregateRating(streamDocument as never) as {
    averageRating?: number;
    reviewCount?: number;
  };
  const firstPartyAggregate = streamDocument.ref_reviewsAgg?.find(
    (item) => item.publisher === "FIRSTPARTY",
  );
  const reviews = firstPartyAggregate?.topReviews ?? [];
  const streamData = streamDocument as Record<string, unknown> | undefined;
  const sectionHeading = resolveText(
    props.content?.sectionHeading ?? props.sectionHeading,
    "en",
    streamData,
    "Client Reviews",
  );
  const summaryLabel = resolveText(
    props.content?.summaryLabel ?? props.summaryLabel,
    "en",
    streamData,
    "Average rating",
  );

  if (!reviews.length && !props.puck.isEditing) {
    return <></>;
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextDeepCurrentReviews${getAnalyticsScopeHash(props.id)}`}
      >
        <section className="overflow-x-clip py-11" style={sectionStyles}>
          <div className="mx-auto max-w-[1410px] px-6">
            <div className="mx-auto mb-8 max-w-[820px] text-center">
              <h2
                className="text-[2.2rem] font-bold tracking-[-0.04em]"
                style={{ color: headingColor }}
              >
                {sectionHeading}
              </h2>
              {reviews.length ? (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1 text-lg">
                    {renderStars(
                      Math.round(aggregate.averageRating ?? 0),
                      accentColor,
                    )}
                  </div>
                  <p className="text-sm" style={{ color: bodyColor }}>
                    {summaryLabel}{" "}
                    <span className="font-semibold" style={{ color: headingColor }}>
                      {(aggregate.averageRating ?? 0).toFixed(1)}
                    </span>{" "}
                    from{" "}
                    <span className="font-semibold" style={{ color: headingColor }}>
                      {aggregate.reviewCount ?? reviews.length}
                    </span>{" "}
                    reviews
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm" style={{ color: bodyColor }}>
                  No first-party reviews available for this location.
                </p>
              )}
            </div>
            {reviews.length ? (
              <div className="grid justify-center gap-5 lg:grid-cols-3">
                {reviews.map((review, index) => (
                  <article
                    key={`${review.authorName || "review"}-${index}`}
                    className="rounded-[16px] border border-black/5 p-6 shadow-[0_6px_22px_rgba(9,30,66,0.08)]"
                    style={{ backgroundColor: cardBackgroundColor }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-semibold" style={{ color: headingColor }}>
                        {review.authorName || "Anonymous"}
                      </h3>
                      <div className="text-sm">
                        {renderStars(Math.round(review.rating ?? 0), accentColor)}
                      </div>
                    </div>
                    {review.reviewDate ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.16em]" style={{ color: bodyColor }}>
                        {formatDate(review.reviewDate)}
                      </p>
                    ) : null}
                    {review.content ? (
                      <p className="mt-4 text-sm leading-7" style={{ color: bodyColor }}>
                        {review.content}
                      </p>
                    ) : null}
                    {review.comments?.[0]?.content ? (
                      <div className="mt-5 rounded-[12px] border border-black/5 bg-black/[0.03] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: headingColor }}>
                          Business Response
                        </p>
                        <p className="mt-2 text-sm leading-7" style={{ color: bodyColor }}>
                          {review.comments[0].content}
                        </p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextDeepCurrentReviews: YextComponentConfig<YextDeepCurrentReviewsProps> = {
  label: "Deep Current Reviews",
  fields: ReviewsFields,
  defaultProps: {
    section: {
      backgroundColor: {
        selectedColor: "[#f8f8f8]",
        contrastingColor: "palette-quaternary",
      },
      visibleOnLivePage: true,
    },
    content: {
      sectionHeading: createEditableText("Client Reviews"),
      summaryLabel: createEditableText("Average rating"),
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
      accentColor: {
        selectedColor: "[#1f6f64]",
        contrastingColor: "white",
      },
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "palette-quaternary",
      },
    },
  },
  render: YextDeepCurrentReviewsComponent,
};
