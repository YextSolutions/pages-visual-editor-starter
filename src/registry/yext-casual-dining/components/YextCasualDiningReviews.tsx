import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  createStyledTextConfig,
  EntityField,
  getAggregateRating,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  StyledTextComponent,
  useDocument,
  VisibilityWrapper,
  type StyledPlainTextProps,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";

const themeVars: React.CSSProperties = {
  ["--COLOR-BG" as string]: "var(--palette-tertiary)",
  ["--COLOR-BG-ACCENT" as string]: "var(--palette-tertiary)",
  ["--COLOR-TEXT" as string]: "var(--palette-quaternary)",
  ["--COLOR-BORDER" as string]: "var(--palette-tertiary)",
  ["--COLOR-ACCENT" as string]: "var(--palette-secondary)",
  ["--COLOR-ACCENT-HOVER" as string]: "var(--palette-primary)",
  ["--BTN-PRIMARY-BG" as string]: "var(--palette-primary)",
  ["--BTN-SECONDARY-TEXT" as string]: "var(--palette-quaternary)",
  ["--footer-bg" as string]: "var(--palette-quaternary)",
};

const capturedStyles = String.raw`:root {
--content-max: 1440px;
  --outer: 32px;
  --outer-mobile: 16px;
  --gutter: 24px;
  --inner: 20px;
  --radius: 14px;
  --radius-small: 10px;
  --font-heading: "Bricolage Grotesque", sans-serif;
  --font-body: "DM Sans", sans-serif;
  --font-body-small: 0.9rem;
  --font-body-medium: 1.02rem;
  --font-body-large: 1.12rem;
  --font-heading-x-small: clamp(1.6rem, 2.1vw, 2.15rem);
  --font-heading-small: clamp(2rem, 2.8vw, 2.95rem);
  --font-heading-large: clamp(2.7rem, 4.9vw, 5rem);
  --font-heading-hero: clamp(3.4rem, 8vw, 7.4rem);
  --section-padding: 50px;
  --section-padding-large: 80px;
  --line: 1.45;
}

*,
*::before,
*::after {
box-sizing: border-box;
}

html {
scroll-behavior: smooth;
}

body {
margin: 0;
  min-width: 320px;
  color: var(--COLOR-TEXT);
  background: var(--COLOR-BG);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: var(--line);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img {
display: block;
  max-width: 100%;
}

a {
color: inherit;
  text-decoration: none;
  transition:
    color 180ms ease,
    opacity 180ms ease,
    text-decoration-color 180ms ease;
}

a:hover {
color: var(--COLOR-ACCENT-HOVER);
}

a:focus-visible,
button:focus-visible,
input:focus-visible {
outline: 2px solid var(--COLOR-ACCENT);
  outline-offset: 3px;
}

button,
input {
font: inherit;
}

button {
cursor: pointer;
}

summary {
list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
display: none;
}

.svg-sprite {
position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.visually-hidden {
position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.wrapper--full-padded {
width: min(100%, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.text-left {
text-align: left;
}

.body-medium {
font-size: var(--font-body-medium);
}

.color-scheme-1 {
background: var(--COLOR-BG);
  color: var(--COLOR-TEXT);
}

.heading-large {
margin: 0;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.heading-large {
font-size: var(--font-heading-large);
  line-height: 0.96;
}

.heading-large :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.grid {
display: grid;
  gap: var(--gutter);
}

.grid--reviews {
grid-template-columns: repeat(2, minmax(0, 1fr));
}

.reviews {
padding: 80px 0 72px;
}

.reviews__intro {
max-width: 980px;
  margin: 0 auto 36px;
  text-align: center;
}

.reviews__rating {
display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.reviews__rating-score {
margin: 0;
  font-family: var(--font-heading);
  font-size: 1.55rem;
  line-height: 1;
}

.reviews__rating-score :where(div, span, p) {
margin: 0;
  font: inherit;
}

.reviews__rating-divider {
color: currentColor;
  opacity: 0.38;
}

.rating-stars {
display: inline-flex;
  gap: 6px;
}

.reviews__rating-text {
margin: 0;
  color: inherit;
}

.reviews__label {
margin: 20px 0 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: inherit;
}

.reviews__label :where(div, span, p) {
margin: 0;
  font: inherit;
}

.reviews__grid-item {
min-width: 0;
}

.review {
height: 100%;
  background: transparent;
  border: 1px solid currentColor;
}

.review__content {
display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 0 24px 24px;
}

.review__content--first-party {
padding: 28px 30px 30px;
  justify-content: flex-start;
}

.review__content blockquote {
margin: 0;
}

.review__content p {
margin: 0;
}

.review__quote-block {
color: inherit;
  line-height: 1.5;
}

.review__author {
margin-top: 22px;
}

.review__author--first-party {
margin-top: 0;
  margin-bottom: 18px;
}

.review__author__name {
font-family: var(--font-heading);
  font-size: 1.12rem;
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.review__author__name :where(div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.review__author__content {
display: grid;
  gap: 4px;
}

.review__meta {
margin: 0;
  font-weight: 700;
  color: inherit;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}
}

@media (max-width: 768px) {
.reviews__intro {
margin-bottom: 24px;
}
.grid--reviews {
grid-template-columns: 1fr;
}

.review {
grid-template-columns: 1fr;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

type ReviewComment = {
  content?: string;
  commentDate?: string;
};

type Review = {
  authorName?: string;
  rating?: number;
  content?: string;
  reviewDate?: string;
  comments?: ReviewComment[];
};

type ReviewsAggregate = {
  publisher?: string;
  topReviews?: Review[];
};

type StreamDocumentWithReviews = {
  locale?: string;
  ref_reviewsAgg?: ReviewsAggregate[];
};

type CasualDiningReviewsProps = {
  section: {
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledPlainTextProps;
  summary: {
    fontOptions: StyledPlainTextProps["fontOptions"];
    rating: {
      fontOptions: StyledPlainTextProps["fontOptions"];
    };
    starColor?: ThemeColor;
  };
  subheading: StyledPlainTextProps;
  cardStyling: {
    header: {
      fontOptions: StyledPlainTextProps["fontOptions"];
    };
    content: {
      fontOptions: StyledPlainTextProps["fontOptions"];
    };
    starColor?: ThemeColor;
  };
  content: {
    showReviewCount: boolean;
    maxReviews: number;
  };
};

const headingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Heading",
  includeColor: true,
});

const subheadingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Subheading",
  includeColor: true,
});

const summaryTextConfig = createStyledTextConfig({
  kind: "plain",
  label: "Summary Text",
  includeColor: true,
});

const summaryRatingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Summary Rating",
  includeColor: true,
});

const cardHeaderConfig = createStyledTextConfig({
  kind: "plain",
  label: "Card Header",
  includeColor: true,
});

const cardContentConfig = createStyledTextConfig({
  kind: "plain",
  label: "Card Content",
  includeColor: true,
});

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }
  return null;
};

const buildStarString = (value: unknown): string => {
  const numericValue = toFiniteNumber(value);
  if (numericValue == null) {
    return "";
  }
  const filledStars = Math.max(0, Math.min(5, Math.round(numericValue)));
  return `${"★".repeat(filledStars)}${"☆".repeat(5 - filledStars)}`;
};

const formatAverageRating = (value: unknown): string => {
  const numericValue = toFiniteNumber(value);
  return numericValue == null ? "" : numericValue.toFixed(1);
};

const formatReviewCountLabel = (value: unknown): string => {
  const numericValue = toFiniteNumber(value);
  if (numericValue == null) {
    return "";
  }
  const roundedValue = Math.max(0, Math.round(numericValue));
  return `${roundedValue} ${roundedValue === 1 ? "Review" : "Reviews"}`;
};

const fields: YextFields<CasualDiningReviewsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      cardBackgroundColor: {
        label: "Card Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: headingConfig.fields!,
  },
  summary: {
    label: "Summary Styling",
    type: "object",
    objectFields: {
      rating: {
        label: "Rating",
        type: "object",
        objectFields: {
          fontOptions: {
            ...summaryRatingConfig.fields!.fontOptions,
            label: "Font Options",
          },
        },
      },
      starColor: {
        label: "Star Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      fontOptions: {
        ...summaryTextConfig.fields!.fontOptions,
        label: "Review Count Styling",
      },
    },
  },
  subheading: {
    label: "Subheading",
    type: "object",
    objectFields: subheadingConfig.fields!,
  },
  cardStyling: {
    label: "Card Styles",
    type: "object",
    objectFields: {
      header: {
        label: "Header",
        type: "object",
        objectFields: {
          fontOptions: {
            ...cardHeaderConfig.fields!.fontOptions,
            label: "Font Options",
          },
        },
      },
      content: {
        label: "Content",
        type: "object",
        objectFields: {
          fontOptions: {
            ...cardContentConfig.fields!.fontOptions,
            label: "Font Options",
          },
        },
      },
      starColor: {
        label: "Star Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  content: {
    label: "Reviews Content",
    type: "object",
    objectFields: {
      showReviewCount: {
        label: "Show Review Count",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      maxReviews: {
        label: "Max Reviews",
        type: "number",
      },
    },
  },
};

const defaultProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    cardBackgroundColor: {
      selectedColor: "white",
      contrastingColor: "black",
    },
    visibleOnLivePage: true,
  },
  heading: {
    ...(headingConfig.defaultProps as StyledPlainTextProps),
    data: {
      text: {
        field: "",
        constantValue: {
          defaultValue: "Reviews",
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
    },
  },
  summary: {
    fontOptions: summaryTextConfig.defaultProps.fontOptions,
    rating: {
      fontOptions: summaryRatingConfig.defaultProps.fontOptions,
    },
  },
  subheading: {
    ...(subheadingConfig.defaultProps as StyledPlainTextProps),
    data: {
      text: {
        field: "",
        constantValue: {
          defaultValue: "Recent Reviews:",
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
    },
  },
  cardStyling: {
    header: {
      fontOptions: cardHeaderConfig.defaultProps.fontOptions,
    },
    content: {
      fontOptions: cardContentConfig.defaultProps.fontOptions,
    },
  },
  content: {
    showReviewCount: true,
    maxReviews: 4,
  },
};

const sampleReviews: Review[] = [
  {
    authorName: "Sample Guest",
    rating: 5,
    content:
      "Sample review data shown only in the editor. This will not appear on the live page.",
  },
  {
    authorName: "Sample Guest",
    rating: 4,
    content:
      "Sample review data shown only in the editor. This will not appear on the live page.",
  },
];

const CasualDiningReviewsComponent: PuckComponent<CasualDiningReviewsProps> = (
  props,
) => {
  const streamDocument = useDocument<StreamDocumentWithReviews>();
  const isEditing = Boolean(props.puck?.isEditing);
  const aggregateRating = getAggregateRating(streamDocument);
  const firstPartyAggregate = streamDocument?.ref_reviewsAgg?.find(
    (aggregate: any) => aggregate.publisher === "FIRSTPARTY",
  );
  const reviews = firstPartyAggregate?.topReviews ?? [];
  const hasReviews = reviews.length > 0;
  const maxReviews =
    props.content?.maxReviews ?? defaultProps.content.maxReviews;
  const displayedReviews = (
    hasReviews ? reviews : isEditing ? sampleReviews : []
  ).slice(0, maxReviews);
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const sectionTextColor = sectionSurfaceStyle?.color;
  const summaryStarColor =
    getThemeColorCssValue(props.summary?.starColor) ?? sectionTextColor;
  const reviewCardStyle = getSurfaceColorStyle(
    props.section.cardBackgroundColor,
    streamDocument,
    {
      fallbackTextColor: sectionTextColor,
    },
  );
  const cardTextColor = reviewCardStyle?.color;
  const cardStarColor =
    getThemeColorCssValue(props.cardStyling?.starColor) ?? cardTextColor;
  const displayedAverageRating = formatAverageRating(
    hasReviews ? aggregateRating.averageRating : isEditing ? 4.5 : null,
  );
  const displayedStars = buildStarString(
    hasReviews ? aggregateRating.averageRating : isEditing ? 4.5 : null,
  );
  const displayedReviewCountLabel = formatReviewCountLabel(
    hasReviews ? aggregateRating.reviewCount : isEditing ? 2 : null,
  );

  if (!displayedReviews.length) {
    return <></>;
  }

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningReviews${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="reviews reviews--section text-left reviews--have-images color-scheme-1"
            id="reviews"
            style={sectionSurfaceStyle}
          >
            <div className="wrapper--full-padded">
              <div className="reviews__intro">
                <div className="heading-large">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.data.text.field}
                    constantValueEnabled={
                      props.heading.data.text.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="plain"
                      {...props.heading}
                      tag="h2"
                      puck={isEditing ? { isEditing: true } : undefined}
                    />
                  </EntityField>
                </div>
                {displayedAverageRating && displayedStars ? (
                  <div
                    className="reviews__rating"
                    aria-label={`${displayedAverageRating} stars out of 5${displayedReviewCountLabel ? ` from ${displayedReviewCountLabel}` : ""}`}
                  >
                    <div className="reviews__rating-score">
                      <StyledTextComponent
                        kind="plain"
                        fontOptions={props.summary.rating.fontOptions}
                        data={{
                          text: {
                            field: "",
                            constantValue: {
                              defaultValue: displayedAverageRating,
                            },
                            constantValueEnabled: true,
                          },
                        }}
                        tag="p"
                        puck={isEditing ? { isEditing: true } : undefined}
                      />
                    </div>
                    <div
                      className="rating-stars"
                      aria-hidden="true"
                      style={{ color: summaryStarColor }}
                    >
                      <span>{displayedStars}</span>
                    </div>
                    {props.content?.showReviewCount !== false &&
                    displayedReviewCountLabel ? (
                      <>
                        <span
                          className="reviews__rating-divider"
                          aria-hidden="true"
                        >
                          |
                        </span>
                        <div className="reviews__rating-text body-medium">
                          <StyledTextComponent
                            kind="plain"
                            fontOptions={props.summary.fontOptions}
                            data={{
                              text: {
                                field: "",
                                constantValue: {
                                  defaultValue: displayedReviewCountLabel,
                                },
                                constantValueEnabled: true,
                              },
                            }}
                            tag="p"
                            puck={isEditing ? { isEditing: true } : undefined}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}
                <div className="reviews__label">
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.subheading.data.text.field}
                    constantValueEnabled={
                      props.subheading.data.text.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="plain"
                      {...props.subheading}
                      tag="p"
                      puck={isEditing ? { isEditing: true } : undefined}
                    />
                  </EntityField>
                </div>
              </div>
              <div className="reviews__grid grid grid--reviews">
                {displayedReviews.map((review, index) => {
                  return (
                    <article
                      key={review.authorName || review.reviewDate || index}
                      className="reviews__grid-item"
                    >
                      <div
                        className="review review--first-party"
                        style={reviewCardStyle}
                      >
                        <div className="review__content review__content--first-party">
                          <div className="review__author review__author--first-party">
                            <div className="review__author__content">
                              <div className="review__author__name">
                                <StyledTextComponent
                                  kind="plain"
                                  fontOptions={props.cardStyling.header.fontOptions}
                                  data={{
                                    text: {
                                      field: "",
                                      constantValue: {
                                        defaultValue: review.authorName ?? "",
                                      },
                                      constantValueEnabled: true,
                                    },
                                  }}
                                  tag="div"
                                  puck={isEditing ? { isEditing: true } : undefined}
                                />
                              </div>
                              {review.rating != null ? (
                                <p
                                  className="review__meta"
                                  style={{ color: cardStarColor }}
                                >
                                  {buildStarString(review.rating)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <blockquote className="review__quote-block review__quote-block--first-party body-medium">
                            <StyledTextComponent
                              kind="plain"
                              fontOptions={props.cardStyling.content.fontOptions}
                              data={{
                                text: {
                                  field: "",
                                  constantValue: {
                                    defaultValue: review.content ?? "",
                                  },
                                  constantValueEnabled: true,
                                },
                              }}
                              tag="p"
                              puck={isEditing ? { isEditing: true } : undefined}
                            />
                          </blockquote>
                          {review.comments?.[0]?.content ? (
                            <div className="review__comments">
                              <StyledTextComponent
                                kind="plain"
                                fontOptions={props.cardStyling.content.fontOptions}
                                data={{
                                  text: {
                                    field: "",
                                    constantValue: {
                                      defaultValue: review.comments[0].content,
                                    },
                                    constantValueEnabled: true,
                                  },
                                }}
                                tag="p"
                                puck={isEditing ? { isEditing: true } : undefined}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningReviews: YextComponentConfig<CasualDiningReviewsProps> =
  {
    label: "Reviews",
    fields,
    defaultProps,
    render: (props) => <CasualDiningReviewsComponent {...props} />,
  };
