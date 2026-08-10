// @ts-nocheck
import { useTranslation } from "react-i18next";
import { getAggregateRating, ReviewStars } from "../../atoms/reviewStars";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { HeroVariantProps } from "../HeroSection";
import { PuckComponent } from "@puckeditor/core";

// Shared styling for the various parent containers of HeroContent
export const heroContentParentCn = (styles: HeroVariantProps["styles"]) => {
  const desktopContainerPosition =
    styles.variant === "spotlight" || styles.variant === "immersive"
      ? styles.desktopContainerPosition
      : "left";
  const width = styles.variant === "compact" ? "" : "w-full";
  return `flex flex-col gap-y-6 md:gap-y-8 ${width} break-words ${desktopContainerPosition === "left" ? "items-start sm:text-start" : "items-center sm:text-center"} ${styles.mobileContentAlignment === "left" ? "text-start" : "text-center"}`;
};

export const HeroContent: PuckComponent<HeroVariantProps> = ({
  styles,
  slots,
  conditionalRender,
  puck,
}) => {
  const { t } = useTranslation();
  const streamDocument = useDocument();
  const { averageRating, reviewCount } = getAggregateRating(streamDocument);

  const desktopContainerPosition =
    styles.variant === "spotlight" || styles.variant === "immersive"
      ? styles.desktopContainerPosition
      : "left";

  const showHours =
    styles.showHoursStatus && (conditionalRender?.hours || puck.isEditing);

  const showHeader =
    styles.showBusinessName ||
    styles.showGeomodifier ||
    showHours ||
    (styles.showAverageReview && reviewCount > 0);

  return (
    <>
      {showHeader && (
        <header
          className="flex flex-col gap-y-4 w-full sm:w-initial"
          aria-label={t("heroHeader", "Hero Header")}
        >
          <section
            className="flex flex-col gap-y-0"
            aria-label={t("businessInformation", "Business Information")}
          >
            {styles.showBusinessName && (
              <slots.BusinessNameSlot style={{ height: "auto" }} allow={[]} />
            )}
            {styles.showGeomodifier && (
              <slots.GeomodifierSlot style={{ height: "auto" }} allow={[]} />
            )}
          </section>
          {showHours && (
            <slots.HoursStatusSlot style={{ height: "auto" }} allow={[]} />
          )}
          {reviewCount > 0 && styles.showAverageReview && (
            <ReviewStars
              averageRating={averageRating}
              reviewCount={reviewCount}
              color={styles.reviewStarsColor}
              className={themeManagerCn(
                styles.mobileContentAlignment === "left"
                  ? "justify-start"
                  : "justify-center",
                desktopContainerPosition === "left"
                  ? "sm:justify-start"
                  : "sm:justify-center"
              )}
            />
          )}
        </header>
      )}
      {(styles.showPrimaryCTA || styles.showSecondaryCTA) && (
        <div
          className={themeManagerCn(
            "flex flex-col gap-y-4 md:gap-x-4 md:flex-row w-full flex-wrap sm:items-center ",
            styles.mobileContentAlignment === "center"
              ? "items-center"
              : "items-start",
            desktopContainerPosition === "center"
              ? "justify-center"
              : "justify-start"
          )}
          aria-label={t("callToActions", "Call to Actions")}
        >
          {styles.showPrimaryCTA && (
            <slots.PrimaryCTASlot
              className="sm:!w-fit !w-full h-auto"
              allow={[]}
            />
          )}
          {styles.showSecondaryCTA && (
            <slots.SecondaryCTASlot
              className="sm:!w-fit !w-full h-auto"
              allow={[]}
            />
          )}
        </div>
      )}
    </>
  );
};
