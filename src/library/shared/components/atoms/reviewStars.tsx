// @ts-nocheck
import * as React from "react";
import { FaRegStar, FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa";
import { Body } from "./body";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { getThemeColorCssValue } from "@yext/visual-editor/section-library-support";

export type AggregateRating = {
  averageRating: number;
  reviewCount: number;
};

export type ReviewStarsProps = {
  averageRating: number;
  reviewCount?: number;
  className?: string;
  color?: ThemeColor;
};

export const ReviewStars = (props: ReviewStarsProps) => {
  const { averageRating, reviewCount, className, color } = props;
  const background = useBackground();
  const hasDarkBackground = background?.isDarkColor;
  const roundedAverageRating = Math.round(averageRating * 10) / 10;
  const HalfStar = hasDarkBackground ? FaStarHalf : FaStarHalfAlt;
  const starColorValue = getThemeColorCssValue(color?.selectedColor);
  const starColor = hasDarkBackground
    ? "text-white"
    : "text-palette-primary-dark";
  const { t } = useTranslation();

  return (
    <div className={themeManagerCn("flex items-center gap-3", className)}>
      <Body className="font-bold">{roundedAverageRating}</Body>
      <div
        className={`flex items-center gap-0.5 ${starColorValue ? "" : starColor}`}
        style={starColorValue ? { color: starColorValue } : undefined}
      >
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, i) =>
            averageRating - i >= 0.75 ? (
              <FaStar key={i} />
            ) : averageRating - i >= 0.25 ? (
              <HalfStar key={i} />
            ) : (
              <FaRegStar
                key={i}
                style={hasDarkBackground ? { display: "none" } : undefined}
              />
            )
          )}
      </div>
      {reviewCount && (
        <Body className="ml-1">
          {t("totalReviews", {
            count: reviewCount,
          })}
        </Body>
      )}
    </div>
  );
};

/**
 * Extracts the aggregate rating from the document's schema.
 * @param document - The document containing the schema.
 * @returns The aggregate rating object if found, otherwise undefined.
 */
export function getAggregateRating(document: any): AggregateRating {
  const reviews = document?.ref_reviewsAgg;
  if (!Array.isArray(reviews))
    return {
      averageRating: 0,
      reviewCount: 0,
    };

  const firstPartyReview = reviews.find(
    (r) =>
      r.publisher === "FIRSTPARTY" &&
      typeof r.averageRating === "number" &&
      typeof r.reviewCount === "number"
  );

  if (!firstPartyReview)
    return {
      averageRating: 0,
      reviewCount: 0,
    };

  return {
    averageRating: firstPartyReview.averageRating,
    reviewCount: firstPartyReview.reviewCount,
  };
}
