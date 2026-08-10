import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { HoursStatus, type HoursType } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getAggregateRating,
  isDarkColor,
  resolveComponentData,
  resolveLocalizedAssetImage,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  type ComprehensiveCTAValue,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  useDocument,
  VisibilityWrapper,
  Background,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HeroCta = {
  item: ComprehensiveCTAValue;
};

type CtaColorState = {
  styles?: {
    variant?: string | null;
    color?: ThemeColor;
  };
};

type HeroHoursStatusTemplateProps = Parameters<
  NonNullable<React.ComponentProps<typeof HoursStatus>["statusTemplate"]>
>[0];

type ReviewAggregateRating = {
  averageRating: number;
  reviewCount: number;
};

export type YextCafeAndCoffeeShopHeroProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  background: {
    image: YextEntityField<TranslatableAssetImage>;
  };
  hours: {
    hours: YextEntityField<HoursType>;
    hoursStyles: {
      showCurrentStatus: boolean;
      timeFormat: "12h" | "24h";
      dayOfWeekFormat: "short" | "long";
      showDayNames: boolean;
      openStatusBackgroundColor?: ThemeColor;
      openStatusTextColor?: ThemeColor;
      closedStatusBackgroundColor?: ThemeColor;
      closedStatusTextColor?: ThemeColor;
    };
  };
  subheading: StyledTextProps;
  reviewsRatingAndCount: {
    showStarsLabel: boolean;
    fontColor?: ThemeColor;
  };
  ctas: HeroCta[];
};

const heroImageUrl =
  "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg";
const REVIEW_PUBLISHER_VALUE = "FIRSTPARTY";

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultCTAButtonStyles = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  borderRadius: "default",
  letterSpacing: "default",
};

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

const createStyledText = (
  value: string,
  fontColor: ThemeColor | undefined = undefined,
  field = "",
  constantValueEnabled = field.length === 0,
): StyledTextProps => ({
  text: createTextField(value, field, constantValueEnabled),
  styles: defaultTextStyles,
  fontColor,
});

const createAssetImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): YextEntityField<TranslatableAssetImage> => ({
  field: "",
  constantValue: {
    url,
    width,
    height,
    alternateText: createTranslatableString(altText),
  },
  constantValueEnabled: true,
});

const createCTA = (
  label: string,
  link: string,
  variant: string | undefined = "primary",
  color: ThemeColor | undefined,
): ComprehensiveCTAValue =>
  ({
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValueEnabled: true,
        constantValue: {
          ctaType: "textAndLink",
          label: { defaultValue: label },
          link: { defaultValue: link },
        },
      },
      openInNewTab: false,
    },
    styles: {
      variant: variant,
      color: color,
      button: defaultCTAButtonStyles,
      link: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
        letterSpacing: "default",
        includeCaret: "default",
      },
    },
  }) as ComprehensiveCTAValue;

const styledTextFields = (): YextFields<StyledTextProps> => ({
  text: {
    label: "Text",
    type: "entityField",
    filter: {
      types: ["type.string"],
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
});

const defaultHeading: YextCafeAndCoffeeShopHeroProps["heading"] =
  createStyledText("", undefined, "name", false);

const defaultBackground: YextCafeAndCoffeeShopHeroProps["background"] = {
  image: createAssetImageField(heroImageUrl, 1900, 1267, "Hero image"),
};

const defaultHours: YextCafeAndCoffeeShopHeroProps["hours"] = {
  hours: {
    field: "hours",
    constantValue: {},
    constantValueEnabled: false,
  },
  hoursStyles: {
    showCurrentStatus: true,
    timeFormat: "12h",
    dayOfWeekFormat: "long",
    showDayNames: true,
    openStatusBackgroundColor: {
      selectedColor: "[#ffffff]",
      contrastingColor: "black",
    },
    openStatusTextColor: {
      selectedColor: "[#2f7a38]",
      contrastingColor: "white",
    },
    closedStatusBackgroundColor: {
      selectedColor: "[#1f2937]",
      contrastingColor: "white",
    },
    closedStatusTextColor: {
      selectedColor: "[#ffffff]",
      contrastingColor: "black",
    },
  },
};

const defaultReviews: YextCafeAndCoffeeShopHeroProps["reviewsRatingAndCount"] =
  {
    showStarsLabel: true,
    fontColor: undefined,
  };

const defaultCtas: HeroCta[] = [
  {
    item: createCTA("Call Ahead", "#", "primary", undefined),
  },
  {
    item: createCTA("Order Takeout", "#", "primary", undefined),
  },
  {
    item: createCTA("View Menu", "#", "secondary", undefined),
  },
];

export const YextCafeAndCoffeeShopHeroFields: YextFields<YextCafeAndCoffeeShopHeroProps> =
  {
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
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: styledTextFields(),
    },
    background: {
      label: "Background",
      type: "object",
      objectFields: {
        image: {
          label: "Image",
          type: "entityField",
          filter: {
            types: ["type.image"],
          },
          disableConstantValueToggle: false,
        },
      },
    },
    hours: {
      label: "Hours",
      type: "object",
      objectFields: {
        hours: {
          label: "Hours",
          type: "entityField",
          filter: {
            types: ["type.hours"],
          },
          disableConstantValueToggle: true,
        },
        hoursStyles: {
          label: "Hours Styles",
          type: "object",
          objectFields: {
            showCurrentStatus: {
              label: "Show Current Status",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            timeFormat: {
              label: "Time Format",
              type: "select",
              options: [
                { label: "12 Hour", value: "12h" },
                { label: "24 Hour", value: "24h" },
              ],
            },
            dayOfWeekFormat: {
              label: "Day Of Week Format",
              type: "select",
              options: [
                { label: "Short", value: "short" },
                { label: "Long", value: "long" },
              ],
            },
            showDayNames: {
              label: "Show Day Names",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            openStatusBackgroundColor: {
              label: "Open Pill Background Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            openStatusTextColor: {
              label: "Open Pill Text Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            closedStatusBackgroundColor: {
              label: "Closed Pill Background Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            closedStatusTextColor: {
              label: "Closed Pill Text Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
    subheading: {
      label: "Subheading",
      type: "object",
      objectFields: styledTextFields(),
    },
    reviewsRatingAndCount: {
      label: "Reviews",
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
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    ctas: {
      label: "CTAs",
      type: "array",
      arrayFields: {
        item: {
          label: "CTA",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: defaultCtas[0],
      getItemSummary: (_row, index) => `CTA ${(index ?? 0) + 1}`,
      max: 3,
    },
  };

export const YextCafeAndCoffeeShopHeroDefaultProps: YextCafeAndCoffeeShopHeroProps =
  {
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
    },
    heading: defaultHeading,
    background: defaultBackground,
    hours: defaultHours,
    subheading: createStyledText("", undefined, "geomodifier", false),
    reviewsRatingAndCount: defaultReviews,
    ctas: defaultCtas,
  };

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
#local-section-template--23715283763541__flex_slideshow_ypPb7P,
#local-section-template--23715283763541__flex_slideshow_ypPb7P * {
  box-sizing: border-box;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1px solid;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, opacity 0.18s ease;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button--small {
  padding: 0.5rem 1rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button.button--outline {
  background-color: transparent !important;
}

.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_slideshow_ypPb7P .button.button--has-fill:hover,
.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_slideshow_ypPb7P .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button:focus-visible {
  outline: 2px solid rgba(255,255,255,0.7);
  outline-offset: 2px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
  position: relative;
  min-height: clamp(520px, 78vh, 760px);
  overflow: hidden;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__media {
  position: absolute;
  inset: 0;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 66% center;
  display: block;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
  position: relative;
  z-index: 1;
  min-height: inherit;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.75rem) 40px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
  max-width: 54rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .card__text > *:last-child {
  margin-bottom: 0;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-brandline {
  margin: 0 0 1rem;
  font-size: 24px;
  line-height: 1;
  font-weight: 400;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-title-main {
  margin: 0;
  font-size: 48px;
  line-height: 0.96;
  font-weight: 700;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-line {
  margin: 1rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 16px;
  line-height: 1;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-main,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  line-height: 1;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-score {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-divider,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-label {
  font-weight: 600;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-stars {
  gap: 1px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-count {
  display: inline-flex;
  align-items: center;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.95rem;
  flex-wrap: wrap;
  font-size: 16px;
  line-height: 1.5;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-open-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0.46rem 0.88rem;
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-close-time {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.18rem;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-cta-group {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

@media (max-width: 1100px) {
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
    min-height: clamp(460px, 66vh, 600px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
    align-items: center;
    padding-inline: 30px;
    padding-bottom: 1.5rem;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
    max-width: 30rem;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-brandline {
    font-size: 20px;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-title-main {
    font-size: 30px;
  }
}

@media (max-width: 700px) {
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
    min-height: clamp(420px, 58vh, 520px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
    justify-content: center;
    padding-inline: 14px;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 1.25rem 1rem;
    text-align: center;
    border-radius: 14px;
    backdrop-filter: blur(3px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-line,
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
    justify-content: center;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-cta-group {
    flex-direction: column;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .button {
    width: 100%;
  }
}`;

const toThemeCss = (token?: string) => {
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

const getStyleValue = (value: string) =>
  value === "default" || value.length === 0 ? undefined : value;

const hasExplicitCtaColor = (cta: CtaColorState) => {
  const selectedColor = cta.styles?.color?.selectedColor;
  return Boolean(selectedColor && selectedColor !== "default");
};

const getStyledTextStyle = (
  value: StyledTextProps,
  fallbackColor?: string,
): React.CSSProperties => ({
  color: toThemeCss(value.fontColor?.selectedColor) ?? fallbackColor,
  fontFamily: getStyleValue(value.styles.fontFamily),
  fontSize: getStyleValue(value.styles.fontSize),
  fontWeight: getStyleValue(value.styles.fontWeight),
  fontStyle: getStyleValue(value.styles.fontStyle),
  textTransform: getStyleValue(value.styles.textTransform),
});

const resolveTextFieldValue = (
  field: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: StreamDocument | undefined,
) =>
  resolveComponentData(field, locale, streamDocument)?.trim() ||
  resolveTranslatableStringValue(
    field.constantValue,
    locale,
    streamDocument,
    "",
  ).trim();

const hasImageSource = (
  image: TranslatableAssetImage | undefined,
): image is TranslatableAssetImage => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  if (
    "image" in image &&
    image.image &&
    typeof image.image === "object" &&
    "url" in image.image &&
    typeof image.image.url === "string" &&
    image.image.url.trim()
  ) {
    return true;
  }

  return false;
};

const getResolvedImage = (
  value: YextEntityField<TranslatableAssetImage>,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallbackAlt = "",
) => {
  const resolved = resolveComponentData(value, locale, streamDocument);
  const image = resolveLocalizedAssetImage(
    resolved ?? value.constantValue,
    locale,
  );

  return {
    url: hasImageSource(image) ? image.url : "",
    alt:
      resolveTranslatableStringValue(
        image?.alternateText,
        locale,
        streamDocument,
        fallbackAlt,
      ) || fallbackAlt,
  };
};

const hasHeroStatusDetail = (status: HeroHoursStatusTemplateProps) =>
  !status.comingSoon &&
  !status.currentInterval?.is24h?.() &&
  Boolean(status.futureInterval);

const getHeroStatusTime = (status: HeroHoursStatusTemplateProps) => {
  if (!hasHeroStatusDetail(status)) {
    return "";
  }

  return status.isOpen
    ? (status.currentInterval?.getEndTime("en-US", status.timeOptions) ?? "")
    : (status.futureInterval?.getStartTime("en-US", status.timeOptions) ?? "");
};

const getHeroStatusDay = (
  status: HeroHoursStatusTemplateProps,
  showDayNames: boolean,
) => {
  if (!showDayNames || !hasHeroStatusDetail(status)) {
    return "";
  }

  const dayOptions = { weekday: "long", ...status.dayOptions };

  return status.isOpen
    ? (status.currentInterval?.end
        ?.setLocale("en-US")
        .toLocaleString(dayOptions) ?? "")
    : (status.futureInterval?.start
        ?.setLocale("en-US")
        .toLocaleString(dayOptions) ?? "");
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

const getFirstPartyReviewAggregateRating = (
  streamDocument: StreamDocument | undefined,
): ReviewAggregateRating | null => {
  const aggregates = (streamDocument as Record<string, unknown> | undefined)
    ?.ref_reviewsAgg;

  if (!Array.isArray(aggregates)) {
    return null;
  }

  const firstPartyAggregate = aggregates.find((item) => {
    return (
      item &&
      typeof item === "object" &&
      (item as Record<string, unknown>).publisher === REVIEW_PUBLISHER_VALUE
    );
  });

  if (!firstPartyAggregate || typeof firstPartyAggregate !== "object") {
    return null;
  }

  const aggregateRecord = firstPartyAggregate as Record<string, unknown>;
  const averageRating = toFiniteNumber(aggregateRecord.averageRating);
  const reviewCount = toFiniteNumber(aggregateRecord.reviewCount);

  if (averageRating == null || reviewCount == null) {
    return null;
  }

  return {
    averageRating,
    reviewCount,
  };
};

const YextCafeAndCoffeeShopHeroComponent: PuckComponent<
  YextCafeAndCoffeeShopHeroProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const heading = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const sectionBackgroundColor = toThemeCss(
    props.section.backgroundColor.selectedColor,
  );
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const heroOverlayBackgroundColor = `color-mix(in srgb, ${toThemeCss(
    props.section.backgroundColor.selectedColor,
  )} 56%, transparent)`;
  const subheading = resolveTextFieldValue(
    props.subheading.text,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.hours.hours,
    locale,
    streamDocument,
  );
  const aggregateRating =
    getFirstPartyReviewAggregateRating(streamDocument) ??
    getAggregateRating(streamDocument);
  const ratingValue = aggregateRating.averageRating.toFixed(1);
  const reviewCountValue = String(aggregateRating.reviewCount);
  const shouldShowHeroReviewSummary = aggregateRating.reviewCount > 0;
  const backgroundImage = getResolvedImage(
    props.background.image,
    locale,
    streamDocument,
  );
  const openPillBackgroundColor =
    toThemeCss(
      props.hours.hoursStyles.openStatusBackgroundColor?.selectedColor,
    ) ?? sectionForeground;
  const openPillTextColor =
    toThemeCss(props.hours.hoursStyles.openStatusTextColor?.selectedColor) ??
    sectionBackgroundColor;
  const closedPillBackgroundColor =
    toThemeCss(
      props.hours.hoursStyles.closedStatusBackgroundColor?.selectedColor,
    ) ?? sectionBackgroundColor;
  const closedPillTextColor =
    toThemeCss(props.hours.hoursStyles.closedStatusTextColor?.selectedColor) ??
    sectionForeground;

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopHero${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <div
            id="local-section-template--23715283763541__flex_slideshow_ypPb7P"
            className="local-section static-hero-section section-hero"
          >
            <section
              className="static-hero"
              aria-label="Hero"
              style={{
                ...(backgroundImage.url
                  ? {}
                  : {
                      backgroundColor: toThemeCss(
                        props.section.backgroundColor.selectedColor,
                      ),
                    }),
              }}
            >
              {backgroundImage.url ? (
                <EntityField
                  displayName="Background Image"
                  fieldId={props.background.image.field}
                  constantValueEnabled={
                    props.background.image.constantValueEnabled
                  }
                >
                  <div className="static-hero__media" aria-hidden="true">
                    <img src={backgroundImage.url} alt={backgroundImage.alt} />
                  </div>
                </EntityField>
              ) : null}
              <div className="static-hero__content container--large">
                <Background
                  background={props.section.backgroundColor}
                  className="static-hero__text card__text w-full sm:max-w-[54rem] "
                  style={
                    {
                      padding: "32px",
                      backgroundColor: heroOverlayBackgroundColor,
                      borderRadius: "16px",
                    } as React.CSSProperties
                  }
                >
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="hero-brandline"
                      style={getStyledTextStyle(
                        props.heading,
                        sectionForeground,
                      )}
                    >
                      {heading}
                    </h2>
                  </EntityField>
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.subheading.text.field}
                    constantValueEnabled={
                      props.subheading.text.constantValueEnabled
                    }
                  >
                    <h1
                      className="hero-title-main"
                      style={getStyledTextStyle(
                        props.subheading,
                        sectionForeground,
                      )}
                    >
                      {subheading}
                    </h1>
                  </EntityField>
                  {shouldShowHeroReviewSummary ? (
                    <p className="hero-rating-line">
                      <span className="hero-rating-main">
                        <span
                          className="hero-rating-score"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          {ratingValue}
                        </span>
                        {props.reviewsRatingAndCount.showStarsLabel ? (
                          <span
                            className="hero-rating-label"
                            style={{
                              color: toThemeCss(
                                props.reviewsRatingAndCount.fontColor
                                  ?.selectedColor,
                              ),
                            }}
                          >
                            Stars
                          </span>
                        ) : null}
                        <span
                          className="hero-stars"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          ★★★★★
                        </span>
                      </span>
                      <span className="hero-rating-meta">
                        <span
                          className="hero-divider"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          |
                        </span>
                        <span
                          className="hero-rating-count"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          {reviewCountValue}
                        </span>
                      </span>
                    </p>
                  ) : null}
                  {props.hours.hoursStyles.showCurrentStatus ? (
                    <EntityField
                      displayName="Hours"
                      fieldId={props.hours.hours.field}
                      constantValueEnabled={
                        props.hours.hours.constantValueEnabled
                      }
                    >
                      <HoursStatus
                        hours={resolvedHours as HoursType}
                        comingSoon={streamDocument?.comingSoon}
                        timezone={streamDocument?.timezone ?? "UTC"}
                        dayOptions={
                          props.hours.hoursStyles.showDayNames
                            ? {
                                weekday:
                                  props.hours.hoursStyles.dayOfWeekFormat,
                              }
                            : undefined
                        }
                        statusTemplate={(status) => {
                          const pillLabel = status.comingSoon
                            ? "Coming Soon"
                            : status.currentInterval?.is24h?.()
                              ? "Open 24 Hours"
                              : !status.futureInterval
                                ? "Temporarily Closed"
                                : status.isOpen
                                  ? "Open Now"
                                  : "Closed";
                          const detailPrefix = status.isOpen
                            ? "Closes at"
                            : "Opens at";
                          const detailTime = getHeroStatusTime(status);
                          const detailDay = getHeroStatusDay(
                            status,
                            props.hours.hoursStyles.showDayNames,
                          );

                          return (
                            <div className="hero-status-line">
                              <span
                                className="hero-open-pill"
                                style={{
                                  backgroundColor: status.isOpen
                                    ? openPillBackgroundColor
                                    : closedPillBackgroundColor,
                                  color: status.isOpen
                                    ? openPillTextColor
                                    : closedPillTextColor,
                                }}
                              >
                                {pillLabel}
                              </span>
                              {detailTime ? (
                                <span className="hero-close-time">
                                  <span>{detailPrefix}</span>
                                  <span>{detailTime}</span>
                                  {detailDay ? <span>{detailDay}</span> : null}
                                </span>
                              ) : null}
                            </div>
                          );
                        }}
                        timeOptions={{
                          hour12: props.hours.hoursStyles.timeFormat === "12h",
                        }}
                      />
                    </EntityField>
                  ) : null}
                  <div className="hero-cta-group">
                    {props.ctas.slice(0, 3).map(({ item }, index) => {
                      const variant = item.styles?.variant as
                        string | undefined;
                      const heroActionClass =
                        index === 0
                          ? " hero-action--call"
                          : index === 1
                            ? " hero-action--menu"
                            : index === 2
                              ? " hero-action--limited"
                              : "";
                      const buttonClassName =
                        variant === "link"
                          ? heroActionClass
                          : variant === "outline" || variant === "secondary"
                            ? `button button--small button--outline${heroActionClass}`
                            : `button button--small button--has-fill${heroActionClass}`;
                      const fallbackOutlineColor =
                        (variant === "outline" || variant === "secondary") &&
                        !hasExplicitCtaColor(item)
                          ? isDarkColor(
                              props.section.backgroundColor,
                              streamDocument,
                            )
                            ? "white"
                            : "black"
                          : undefined;
                      const explicitOutlineColor = hasExplicitCtaColor(item)
                        ? toThemeCss(item.styles?.color?.selectedColor)
                        : undefined;
                      const outlineColor =
                        variant === "outline" || variant === "secondary"
                          ? (explicitOutlineColor ?? fallbackOutlineColor)
                          : undefined;

                      return (
                        <EntityField
                          key={index}
                          displayName={`Hero Call to Action ${index + 1}`}
                          fieldId={item.data.cta.field}
                          constantValueEnabled={
                            item.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={item as Partial<ComprehensiveCTAValue>}
                            className={buttonClassName}
                            style={
                              outlineColor
                                ? {
                                    color: outlineColor,
                                    borderColor: outlineColor,
                                  }
                                : undefined
                            }
                          />
                        </EntityField>
                      );
                    })}
                  </div>
                </Background>
              </div>
            </section>
          </div>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopHero: YextComponentConfig<YextCafeAndCoffeeShopHeroProps> =
  {
    label: "Hero",
    fields: YextCafeAndCoffeeShopHeroFields,
    defaultProps: YextCafeAndCoffeeShopHeroDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopHeroComponent {...props} />,
  };
