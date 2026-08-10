import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getAggregateRating,
  resolveComponentData,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

type ReviewCardData = {
  authorName: string;
  rating: string;
  reviewDate: string;
  content: string;
};

type ReviewAggregateRating = {
  averageRating: number;
  reviewCount: number;
};

export type YextCafeAndCoffeeShopReviewsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      fontStyle: string;
      textTransform: string;
    };
    fontColor: ThemeColor | undefined;
  };
  content: {
    rating: {
      showStarsLabel: boolean;
    };
    subheading: {
      text: YextEntityField<TranslatableString>;
      styles: {
        fontFamily: string;
        fontSize: string;
        fontWeight: string;
        fontStyle: string;
        textTransform: string;
      };
      fontColor: ThemeColor | undefined;
    };
  };
};

const REVIEW_TOP_REVIEWS_FIELD_PATH = "ref_reviewsAgg.topReviews";
const REVIEW_PUBLISHER_VALUE = "FIRSTPARTY";

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
#reviews-section,
#reviews-section * {
  box-sizing: border-box;
}

#reviews-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-reviews-bg, #4d3726);
}

#reviews-section .reviews__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#reviews-section .reviews__heading {
  margin: 0 0 2rem;
  color: var(--cr-reviews-heading, #ffffff);
  text-align: center;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

#reviews-section .reviews__summary {
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 18px;
  line-height: 1.2;
}

#reviews-section .reviews__summary-main,
#reviews-section .reviews__summary-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1.2;
}

#reviews-section .reviews__summary > *,
#reviews-section .reviews__summary-main > *,
#reviews-section .reviews__summary-meta > * {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

#reviews-section .reviews__score {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
}

#reviews-section .reviews__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  font-weight: 600;
  line-height: 1.2;
}

#reviews-section .reviews__stars {
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  gap: 2px;
  letter-spacing: 0.03em;
  line-height: 1;
}

#reviews-section .reviews__stars > span {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

#reviews-section .reviews__count,
#reviews-section .reviews__divider {
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  opacity: 1;
}

#reviews-section .reviews__recent {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
}

#reviews-section .reviews__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

#reviews-section .review-card {
  border: 0;
  border-radius: 20px;
  padding: clamp(1.5rem, 2.1vw, 1.9rem);
  display: grid;
  align-content: start;
  gap: 0;
  min-height: 100%;
}

#reviews-section .review-card__head {
  margin: 0 0 12px;
}

#reviews-section .review-card__head h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.1;
  font-weight: 500;
}

#reviews-section .review-card__meta {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

#reviews-section .review-card__rating {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.28rem;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 1;
}

#reviews-section .review-card__rating .reviews__label {
  font-size: inherit;
  line-height: inherit;
}

#reviews-section .review-card__score {
  display: inline-flex;
  align-items: center;
  line-height: 1.3;
  font-weight: 600;
}

#reviews-section .review-card__stars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1;
}

#reviews-section .review-card__stars > span {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
}

#reviews-section .review-card__date {
  display: block;
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 400;
  opacity: 0.9;
}

#reviews-section .review-card__text {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  opacity: 1;
}

@media (max-width: 1023px) {
  #reviews-section .reviews__wrap {
    padding-inline: 30px;
  }

  #reviews-section .reviews__grid {
    grid-template-columns: 1fr 1fr;
  }

  #reviews-section .review-card {
    padding: 1.45rem;
  }

  #reviews-section .review-card__head {
    margin-bottom: 12px;
  }

  #reviews-section .review-card__meta {
    gap: 8px;
    margin-bottom: 14px;
  }

  #reviews-section .reviews__heading,
  #reviews-section .reviews__recent,
  #reviews-section .reviews__summary {
    text-align: left;
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  #reviews-section .reviews__wrap {
    padding-inline: 14px;
  }

  #reviews-section .reviews__grid {
    grid-template-columns: 1fr;
  }

  #reviews-section .reviews__summary {
    flex-wrap: wrap;
    gap: 10px;
  }

  #reviews-section .review-card {
    padding: 1.35rem;
    gap: 0.9rem;
  }

  #reviews-section .review-card__head {
    margin-bottom: 10px;
  }

  #reviews-section .review-card__meta {
    gap: 7px;
    margin-bottom: 12px;
  }
}`;

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

const defaultTextStyles = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const toThemeCss = (value?: ThemeColor | string) => {
  const token = typeof value === "string" ? value : value?.selectedColor;
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

const getValueAtPath = (value: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((current, part) => {
    if (current == null) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(part);
      return Number.isInteger(index) ? current[index] : undefined;
    }

    if (typeof current === "object") {
      return current[part as keyof typeof current];
    }

    return undefined;
  }, value);

const getFirstPartyReviewsAggregate = (
  streamDocument: StreamDocument | undefined,
) => {
  const aggregates = getValueAtPath(streamDocument, "ref_reviewsAgg");

  if (!Array.isArray(aggregates)) {
    return null;
  }

  const match = aggregates.find((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    return getValueAtPath(item, "publisher") === REVIEW_PUBLISHER_VALUE;
  });

  return match && typeof match === "object" ? match : null;
};

const toFiniteNumber = (value: unknown) => {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  return Number.isFinite(numericValue) ? numericValue : null;
};

const getFirstPartyAggregateRating = (
  streamDocument: StreamDocument | undefined,
): ReviewAggregateRating | null => {
  const firstPartyAggregate = getFirstPartyReviewsAggregate(streamDocument);
  const averageRating = toFiniteNumber(
    getValueAtPath(firstPartyAggregate, "averageRating"),
  );
  const reviewCount = toFiniteNumber(
    getValueAtPath(firstPartyAggregate, "reviewCount"),
  );

  if (averageRating == null || reviewCount == null) {
    return null;
  }

  return {
    averageRating,
    reviewCount,
  };
};

const formatReviewCountLabel = (value: string) => {
  const numericValue = Number.parseInt(value, 10);
  if (!Number.isFinite(numericValue)) {
    return value.trim();
  }
  return `${numericValue} ${numericValue === 1 ? "Review" : "Reviews"}`;
};

const getFilledStars = (rating: string) => {
  const numericRating = Number.parseFloat(rating);
  if (!Number.isFinite(numericRating)) {
    return 0;
  }
  return Math.max(0, Math.min(5, Math.floor(numericRating)));
};

const formatReviewDate = (value: unknown) => {
  if (value == null) {
    return "";
  }

  const date =
    typeof value === "number"
      ? new Date(value)
      : typeof value === "string" && value.trim().length > 0
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
};

const toRenderableText = (value: unknown, fallback = "") => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    if ("text" in (value as Record<string, unknown>)) {
      const text = (value as Record<string, unknown>).text;
      if (typeof text === "string" || typeof text === "number") {
        return String(text);
      }
    }

    if ("defaultValue" in (value as Record<string, unknown>)) {
      const defaultValue = (value as Record<string, unknown>).defaultValue;
      if (
        typeof defaultValue === "string" ||
        typeof defaultValue === "number"
      ) {
        return String(defaultValue);
      }
    }
  }

  return fallback;
};

const normalizeFirstPartyReview = (value: unknown): ReviewCardData | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const content = toRenderableText(record.content).trim();

  if (!content) {
    return null;
  }

  return {
    authorName: toRenderableText(record.authorName).trim(),
    rating: toRenderableText(record.rating).trim(),
    reviewDate: formatReviewDate(record.reviewDate),
    content,
  };
};

const getFirstPartyTopReviews = (
  streamDocument: StreamDocument | undefined,
) => {
  const firstPartyAggregate = getFirstPartyReviewsAggregate(streamDocument);
  const aggregateTopReviews = getValueAtPath(firstPartyAggregate, "topReviews");
  const directTopReviews = getValueAtPath(
    streamDocument,
    REVIEW_TOP_REVIEWS_FIELD_PATH,
  );

  const topReviews = Array.isArray(aggregateTopReviews)
    ? aggregateTopReviews
    : Array.isArray(directTopReviews)
      ? directTopReviews.filter((item) => {
          return (
            item &&
            typeof item === "object" &&
            getValueAtPath(item, "publisher") === REVIEW_PUBLISHER_VALUE
          );
        })
      : [];

  return topReviews
    .map((item) => normalizeFirstPartyReview(item))
    .filter((item): item is ReviewCardData => Boolean(item?.content.trim()))
    .slice(0, 4);
};

export const YextCafeAndCoffeeShopReviewsFields: YextFields<YextCafeAndCoffeeShopReviewsProps> =
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
    content: {
      label: "Content",
      type: "object",
      objectFields: {
        rating: {
          label: "Review Rating",
          type: "object",
          objectFields: {
            showStarsLabel: {
              label: "Show Stars Label",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
          },
        },
        subheading: {
          label: "Subheading",
          type: "object",
          objectFields: {
            text: {
              label: "Text",
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
      },
    },
  };

const YextCafeAndCoffeeShopReviewsDefaultProps: YextCafeAndCoffeeShopReviewsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: {
      text: createTextField("Reviews"),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
    content: {
      rating: {
        showStarsLabel: true,
      },
      subheading: {
        text: createTextField("Recent Reviews:"),
        styles: defaultTextStyles,
        fontColor: undefined,
      },
    },
  };

const YextCafeAndCoffeeShopReviewsComponent = (
  props: YextCafeAndCoffeeShopReviewsProps & {
    id?: string;
    puck?: {
      isEditing?: boolean;
    };
  },
) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const entityReviews = getFirstPartyTopReviews(streamDocument);
  const hasEntityReviews = entityReviews.length > 0;
  const aggregateRating =
    getFirstPartyAggregateRating(streamDocument) ??
    getAggregateRating(streamDocument);
  const hasAggregateReviews = aggregateRating.reviewCount > 0;
  const isPreviewMode = Boolean(props.puck?.isEditing);
  const sectionBackgroundColor = toThemeCss(props.section.backgroundColor);
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const reviewCardBorder = sectionBackgroundColor
    ? `1px solid color-mix(in srgb, ${sectionBackgroundColor} 14%, transparent)`
    : undefined;

  if (!isPreviewMode && !hasEntityReviews && !hasAggregateReviews) {
    return null;
  }

  const rating = String(aggregateRating.averageRating);
  const reviewCountValue = String(aggregateRating.reviewCount);
  const hasRating = aggregateRating.averageRating > 0;
  const hasReviewCount = aggregateRating.reviewCount > 0;
  const reviewCountLabel = hasReviewCount
    ? formatReviewCountLabel(reviewCountValue)
    : "";
  const showStarsLabel = Boolean(props.content.rating.showStarsLabel);
  const filledStars = getFilledStars(rating);
  const reviews = hasEntityReviews
    ? entityReviews
    : isPreviewMode
      ? [
          {
            authorName: "Jane Doe",
            rating: "5",
            reviewDate: "01/01/2026",
            content:
              "A warm placeholder review that appears while editing when real review data is unavailable.",
          },
          {
            authorName: "Alex Smith",
            rating: "4",
            reviewDate: "01/12/2026",
            content:
              "Another placeholder review card to show the final layout in the editor.",
          },
          {
            authorName: "Morgan Lee",
            rating: "5",
            reviewDate: "02/03/2026",
            content:
              "This card is only shown in editing mode until the live entity has review content.",
          },
          {
            authorName: "Taylor Chen",
            rating: "5",
            reviewDate: "02/20/2026",
            content:
              "Placeholder content helps confirm spacing, typography, and card rhythm.",
          },
        ]
      : [];

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopReviews${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isPreviewMode}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={
            {
              "--cr-reviews-bg": toThemeCss(props.section.backgroundColor),
              "--cr-reviews-heading":
                toThemeCss(props.heading.fontColor?.selectedColor) ??
                sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            id="reviews-section"
            className="local-section section-reviews"
            aria-label="Reviews"
            background={props.section.backgroundColor}
          >
            <div className="reviews__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="reviews__heading"
                  style={{
                    color:
                      toThemeCss(props.heading.fontColor?.selectedColor) ??
                      sectionForeground,
                    fontFamily:
                      props.heading.styles.fontFamily === "default"
                        ? undefined
                        : props.heading.styles.fontFamily,
                    fontSize:
                      props.heading.styles.fontSize === "default"
                        ? undefined
                        : props.heading.styles.fontSize,
                    fontWeight:
                      props.heading.styles.fontWeight === "default"
                        ? undefined
                        : props.heading.styles.fontWeight,
                    fontStyle:
                      props.heading.styles.fontStyle === "default"
                        ? undefined
                        : props.heading.styles.fontStyle,
                    textTransform:
                      props.heading.styles.textTransform === "default"
                        ? undefined
                        : props.heading.styles.textTransform,
                  }}
                >
                  {resolveTextFieldValue(
                    props.heading.text,
                    locale,
                    streamDocument,
                  )}
                </h2>
              </EntityField>
              {reviews.length > 0 ? (
                <>
                  {hasRating || hasReviewCount ? (
                    <p className="reviews__summary">
                      {hasRating ? (
                        <span className="reviews__summary-main">
                          <span
                            className="reviews__score"
                            style={{ color: sectionForeground }}
                          >
                            {rating}
                          </span>
                          {showStarsLabel ? (
                            <span
                              className="reviews__label"
                              style={{ color: sectionForeground }}
                            >
                              Stars
                            </span>
                          ) : null}
                          <span className="reviews__stars" aria-hidden="true">
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={`summary-star-${index}`}
                                style={{
                                  color: sectionForeground,
                                  opacity: index < filledStars ? 1 : 0.28,
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </span>
                        </span>
                      ) : null}
                      {reviewCountLabel ? (
                        <span className="reviews__summary-meta">
                          {hasRating ? (
                            <span
                              className="reviews__divider"
                              style={{ color: sectionForeground }}
                            >
                              |
                            </span>
                          ) : null}
                          <span
                            className="reviews__count"
                            style={{ color: sectionForeground }}
                          >
                            {reviewCountLabel}
                          </span>
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.content.subheading.text.field}
                    constantValueEnabled={
                      props.content.subheading.text.constantValueEnabled
                    }
                  >
                    <p
                      className="reviews__recent"
                      style={{
                        color:
                          toThemeCss(
                            props.content.subheading.fontColor?.selectedColor,
                          ) ?? sectionForeground,
                        fontFamily:
                          props.content.subheading.styles.fontFamily ===
                          "default"
                            ? undefined
                            : props.content.subheading.styles.fontFamily,
                        fontSize:
                          props.content.subheading.styles.fontSize === "default"
                            ? undefined
                            : props.content.subheading.styles.fontSize,
                        fontWeight:
                          props.content.subheading.styles.fontWeight ===
                          "default"
                            ? undefined
                            : props.content.subheading.styles.fontWeight,
                        fontStyle:
                          props.content.subheading.styles.fontStyle ===
                          "default"
                            ? undefined
                            : props.content.subheading.styles.fontStyle,
                        textTransform:
                          props.content.subheading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.content.subheading.styles.textTransform,
                      }}
                    >
                      {resolveTextFieldValue(
                        props.content.subheading.text,
                        locale,
                        streamDocument,
                        "Recent Reviews:",
                      )}
                    </p>
                  </EntityField>
                  <div className="reviews__grid">
                    {reviews.map((review, index) => {
                      const reviewFilledStars = getFilledStars(review.rating);
                      const hasReviewRating = review.rating.trim().length > 0;
                      const hasReviewDate = review.reviewDate.trim().length > 0;

                      return (
                        <article
                          key={`${review.authorName || "review"}-${index}`}
                          className="review-card"
                          style={{
                            backgroundColor: sectionForeground,
                            color: sectionBackgroundColor,
                            border: reviewCardBorder,
                            boxShadow: "0 18px 40px rgba(17, 17, 17, 0.08)",
                          }}
                        >
                          <div className="review-card__head">
                            <h3 style={{ color: sectionBackgroundColor }}>
                              {review.authorName}
                            </h3>
                          </div>
                          {hasReviewRating || hasReviewDate ? (
                            <div className="review-card__meta">
                              {hasReviewRating ? (
                                <p className="review-card__rating">
                                  <span
                                    className="review-card__score"
                                    style={{ color: sectionBackgroundColor }}
                                  >
                                    {review.rating}
                                  </span>
                                  {showStarsLabel ? (
                                    <span
                                      className="reviews__label"
                                      style={{ color: sectionBackgroundColor }}
                                    >
                                      Stars
                                    </span>
                                  ) : null}
                                  <span
                                    className="review-card__stars"
                                    aria-hidden="true"
                                  >
                                    {Array.from(
                                      { length: 5 },
                                      (_, starIndex) => (
                                        <span
                                          key={`review-${index}-star-${starIndex}`}
                                          style={{
                                            color: sectionBackgroundColor,
                                            opacity:
                                              starIndex < reviewFilledStars
                                                ? 1
                                                : 0.28,
                                          }}
                                        >
                                          ★
                                        </span>
                                      ),
                                    )}
                                  </span>
                                </p>
                              ) : null}
                              {hasReviewDate ? (
                                <p
                                  className="review-card__date"
                                  style={{ color: sectionBackgroundColor }}
                                >
                                  {review.reviewDate}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                          <p
                            className="review-card__text"
                            style={{ color: sectionBackgroundColor }}
                          >
                            {review.content}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopReviews: YextComponentConfig<YextCafeAndCoffeeShopReviewsProps> =
  {
    label: "Reviews",
    fields: YextCafeAndCoffeeShopReviewsFields,
    defaultProps: YextCafeAndCoffeeShopReviewsDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopReviewsComponent {...props} />,
  };
