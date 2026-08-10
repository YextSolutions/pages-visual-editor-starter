import type { PuckComponent } from "@puckeditor/core";
import type { SectionConfig } from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  type ThemeColor,
  type StyledTextValue,
  type StreamDocument,
  type ThemeColor as ThemeColorType,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  getAggregateRating,
  getAnalyticsScopeHash,
  resolveComponentData,
  toPuckFields,
  useDocument,
} from "@yext/visual-editor";

type ReviewAggregate = {
  publisher?: string;
  topReviews?: Array<{
    authorName?: string;
    rating?: number;
    content?: string;
    reviewDate?: string;
  }>;
};

type YextBarSocialDiningReviewsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColorType;
  };
  cardBackgroundColor: ThemeColor;
  starColor: ThemeColor | undefined;
};

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (
  color?: ThemeColorType,
): color is ThemeColorType => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (
  surfaceColor: ThemeColorType,
): ThemeColorType => {
  switch (surfaceColor.selectedColor) {
    case "white":
    case "palette-primary-light":
    case "palette-secondary-light":
    case "palette-tertiary-light":
    case "palette-quaternary-light":
      return {
        selectedColor: "black",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "black":
    case "palette-primary-dark":
    case "palette-secondary-dark":
      return {
        selectedColor: "white",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-primary":
      return {
        selectedColor: "palette-primary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-secondary":
      return {
        selectedColor: "palette-secondary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-tertiary":
      return {
        selectedColor: "palette-tertiary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-quaternary":
      return {
        selectedColor: "palette-quaternary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    default:
      return {
        selectedColor: surfaceColor.contrastingColor || "black",
        contrastingColor: surfaceColor.selectedColor,
      };
  }
};

const resolveTextColor = (
  color: ThemeColorType | undefined,
  surfaceColor: ThemeColorType,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(color)
      ? color
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const textStyle = (
  styles: StyledTextValue,
  color?: ThemeColorType,
  surfaceColor?: ThemeColorType,
): React.CSSProperties => ({
  color: surfaceColor ? resolveTextColor(color, surfaceColor) : undefined,
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const renderStars = (rating?: number): string => {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  return `${"★".repeat(normalizedRating)}${"☆".repeat(5 - normalizedRating)}`;
};

const reviewsScopeClass = "bar-social-dining-reviews";
const reviewsScopedTypographyCss = `
  .${reviewsScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${reviewsScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${reviewsScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${reviewsScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${reviewsScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${reviewsScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${reviewsScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${reviewsScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${reviewsScopeClass} .bar-social-dining-link-typography a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const YextBarSocialDiningReviewsSectionFields: YextFields<YextBarSocialDiningReviewsSectionProps> =
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
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
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
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    starColor: {
      label: "Star Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
  };

const YextBarSocialDiningReviewsSectionComponent: PuckComponent<
  YextBarSocialDiningReviewsSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument<
    StreamDocument & { ref_reviewsAgg?: ReviewAggregate[] }
  >();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const { averageRating, reviewCount } = getAggregateRating(streamDocument);
  const firstPartyAggregate = streamDocument.ref_reviewsAgg?.find(
    (aggregate) => aggregate.publisher === "FIRSTPARTY",
  );
  const reviews = firstPartyAggregate?.topReviews?.slice(0, 3) ?? [];
  const sectionBackgroundColor = themeColorToCss(
    props.section.backgroundColor.selectedColor,
  );
  const sectionForegroundColor = resolveTextColor(
    undefined,
    props.section.backgroundColor,
  );
  const cardBackgroundColor = themeColorToCss(
    props.cardBackgroundColor.selectedColor,
  );
  const cardForegroundColor = resolveTextColor(
    undefined,
    props.cardBackgroundColor,
  );
  const starColor = resolveTextColor(
    props.starColor,
    props.cardBackgroundColor,
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
        name={`YextBarSocialDiningReviewsSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{reviewsScopedTypographyCss}</style>
        <section
          className={reviewsScopeClass}
          style={{
            backgroundColor: sectionBackgroundColor,
            color: sectionForegroundColor,
            padding: "72px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    ...textStyle(
                      props.heading.styles,
                      props.heading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: 0,
                  }}
                >
                  {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                </h2>
              </EntityField>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  margin: "8px 0 0",
                  textTransform: "uppercase",
                }}
              >
                {averageRating
                  ? `${averageRating.toFixed(1)} stars based on ${reviewCount} reviews`
                  : "No first-party reviews yet"}
              </p>
            </div>
            {reviews.length ? (
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                {reviews.map((review, index) => (
                  <article
                    key={`${review.authorName ?? "review"}-${index}`}
                    style={{
                      backgroundColor: cardBackgroundColor,
                      border: "1px solid rgba(23, 18, 25, 0.45)",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "235px",
                      padding: "18px 14px 16px",
                    }}
                  >
                    <p
                      style={{
                        color: starColor,
                        fontSize: "0.75rem",
                        letterSpacing: "0.3em",
                        margin: "0 0 18px",
                      }}
                    >
                      {renderStars(review.rating)}{" "}
                      <span
                        style={{
                          color: cardForegroundColor,
                          letterSpacing: "normal",
                          marginLeft: "10px",
                        }}
                      >
                        {typeof review.rating === "number"
                          ? `${review.rating}/5 stars`
                          : "Review"}
                      </span>
                    </p>
                    <p
                      style={{
                        color: cardForegroundColor,
                        flexGrow: 1,
                        margin: "0 0 16px",
                      }}
                    >
                      {review.content ?? "No first-party review content yet."}
                    </p>
                    <h3
                      style={{
                        color: cardForegroundColor,
                        margin: 0,
                      }}
                    >
                      {review.authorName ?? "Anonymous"}
                    </h3>
                    {review.reviewDate ? (
                      <p
                        style={{
                          color: cardForegroundColor,
                          margin: "2px 0 0",
                        }}
                      >
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center" }}>
                No first-party reviews. This section won&apos;t be displayed on
                the live page.
              </p>
            )}
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningReviewsSection: YextComponentConfig<YextBarSocialDiningReviewsSectionProps> =
  {
    label: "Reviews Section",
    fields: toPuckFields(YextBarSocialDiningReviewsSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Reviews",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      cardBackgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      starColor: undefined,
    },
    render: (props) => (
      <YextBarSocialDiningReviewsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  displayName: "Reviews",
  description: "Displays restaurant reviews.",
  pageSetTypes: ["ENTITY"],
  category: "Location",
};
