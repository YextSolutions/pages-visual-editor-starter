import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Link,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  isDarkColor,
  msg,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableCTA,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextArrayField,
  type YextFields,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
};

type FooterImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
};

type FooterLinkValue = {
  cta: unknown;
};
type FooterSocialIcon = "facebook" | "instagram" | "yelp";

type LegacyFooterSocialLinkValue = Omit<TranslatableCTA, "label"> & {
  icon: FooterSocialIcon;
};

type FooterSocialLinkValue = Omit<TranslatableCTA, "label"> & {
  iconImage: FooterImageProps;
};

type FooterAppBadgeItem = {
  cta: ComprehensiveCTAValue;
};

type LegacyFooterAppBadges = {
  appStore?: ComprehensiveCTAValue;
  playStore?: ComprehensiveCTAValue;
};

export type YextCafeAndCoffeeShopFooterProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  brand: {
    name: StyledTextProps;
  };
  socialLinks: FooterSocialLinkValue[];
  footerLinks: FooterLinkValue[];
  legalLinks: FooterLinkValue[];
  fontColor: ThemeColor | undefined;
  copyright: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  appBadges: {
    items: FooterAppBadgeItem[];
  };
};

const socialIconDarkUrls: Record<FooterSocialIcon, string> = {
  facebook:
    "https://a.mktgcdn.com/p/IitzarBM_0CX559xyQ4hh1KJV_p6auz4GoVEvh2Umt8/416x415.png",
  instagram:
    "https://a.mktgcdn.com/p/YVm9XbAozrhbI944Ez5LuRe3xMZMFSkTfbSITCLgVZE/512x512.png",
  yelp: "https://a.mktgcdn.com/p/_5rJ9kfWaGjQCJnPPSObE9LO_caOKHdOzWuIX6o53iA/800x1002.png",
};
const socialIconLightUrls: Record<FooterSocialIcon, string> = {
  facebook:
    "https://a.mktgcdn.com/p/7tT2mgF7Uz5xFTl-R7a6dQd9CvX7EzacDF6BlpTO71c/2084x2084.png",
  instagram:
    "https://a.mktgcdn.com/p/yTPPH5E_uAQyzqBbeK3FqmsFtBJXzbz_zWKkkz3F3pg/800x800.png",
  yelp: "https://a.mktgcdn.com/p/5somDf8PPy-sFAiMAtBBvW0k_MfdIluteCfmjQ42sgc/800x1002.png",
};

const socialIconLabels: Record<FooterSocialIcon, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  yelp: "Yelp",
};

const socialIconAssetDimensions: Record<
  FooterSocialIcon,
  { width: number; height: number }
> = {
  facebook: { width: 2084, height: 2084 },
  instagram: { width: 800, height: 800 },
  yelp: { width: 800, height: 1002 },
};

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

const linkTypeOptions = () => [
  { label: "URL", value: "URL" },
  { label: "Email", value: "Email" },
  { label: "Phone", value: "Phone" },
  { label: "Driving Directions", value: "DRIVING_DIRECTIONS" },
  { label: "Click To Website", value: "CLICK_TO_WEBSITE" },
  { label: "Other", value: "OTHER" },
];

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
  fontColor: ThemeColor | undefined,
  field = "",
  constantValueEnabled = field.length === 0,
): StyledTextProps => ({
  text: createTextField(value, field, constantValueEnabled),
  styles: defaultTextStyles,
  fontColor,
});

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): FooterImageProps => ({
  image: {
    field: "",
    constantValue: {
      url,
      width,
      height,
      alternateText: createTranslatableString(altText),
    },
    constantValueEnabled: true,
  },
});

const createCTA = (
  label: string,
  link: string,
  presetImage?: string,
): ComprehensiveCTAValue =>
  ({
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValue: {
          label: createTranslatableString(label),
          link: createTranslatableString(link),
          normalizeLink: true,
          openInNewTab: false,
          ctaType: presetImage ? "presetImage" : "textAndLink",
        },
        constantValueEnabled: true,
        normalizeLink: true,
        openInNewTab: false,
      },
      openInNewTab: false,
    },
    styles: {
      variant: presetImage ? "link" : "link",
      color: undefined,
      presetImage: presetImage,
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

const defaultSocialLink: FooterSocialLinkValue = {
  iconImage: createImageField(
    socialIconLightUrls.facebook,
    socialIconAssetDimensions.facebook.width,
    socialIconAssetDimensions.facebook.height,
    socialIconLabels.facebook,
  ),
  link: createTranslatableString("#"),
  linkType: "URL",
  normalizeLink: true,
  openInNewTab: false,
};

const defaultLink = (label: string): FooterLinkValue => ({
  cta: createCTA(label, "#"),
});

const linkFieldConfig: YextArrayField<FooterLinkValue[]> = {
  type: "array",
  arrayFields: {
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
  },
  defaultItemProps: defaultLink("Footer Link"),
};

const socialLinkFieldConfig: YextArrayField<FooterSocialLinkValue[]> = {
  type: "array",
  arrayFields: {
    iconImage: {
      label: "Icon Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
      },
    },
    link: {
      type: "translatableString",
      label: msg("fields.link", "Link"),
    },
    linkType: {
      type: "basicSelector",
      label: msg("fields.linkType", "Link Type"),
      options: linkTypeOptions(),
    },
    normalizeLink: {
      label: msg("fields.normalizeLink", "Normalize Link"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    openInNewTab: {
      label: msg("fields.openInNewTab", "Open in new tab"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
  },
  defaultItemProps: defaultSocialLink satisfies FooterSocialLinkValue,
  getItemSummary: (item: FooterSocialLinkValue, index?: number) =>
    resolveTranslatableStringValue(
      item.link,
      "en",
      undefined,
      `Social Link ${index ?? 0}`,
    ),
};

const appBadgeFieldConfig: YextArrayField<FooterAppBadgeItem[]> = {
  type: "array",
  arrayFields: {
    cta: {
      label: "Badge",
      type: "comprehensiveCTA",
    },
  },
  defaultItemProps: {
    cta: createCTA("Download on the App Store", "#", "app-store"),
  },
  getItemSummary: (item: FooterAppBadgeItem, index?: number) =>
    resolveTranslatableStringValue(
      item.cta.data.cta.constantValue?.label,
      "en",
      undefined,
      `Badge ${index ?? 0}`,
    ),
};

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

const defaultBrand: YextCafeAndCoffeeShopFooterProps["brand"] = {
  name: createStyledText("Redwood Burger Co.", undefined, "name", false),
};

const defaultSocialLinks: FooterSocialLinkValue[] = (
  ["facebook", "instagram", "yelp"] as const
).map((icon) => ({
  ...defaultSocialLink,
  iconImage: createImageField(
    socialIconLightUrls[icon],
    socialIconAssetDimensions[icon].width,
    socialIconAssetDimensions[icon].height,
    socialIconLabels[icon],
  ),
}));

const defaultFooterLinks: FooterLinkValue[] = [
  "Menu",
  "Order Online",
  "Reservations",
  "Group Events",
  "Catering",
  "Careers",
  "Gift Cards",
  "Contact",
].map((label) => defaultLink(label));

const defaultLegalLinks: FooterLinkValue[] = [
  "Privacy",
  "Terms",
  "Accessibility",
].map((label) => defaultLink(label));

const defaultCopyright: YextCafeAndCoffeeShopFooterProps["copyright"] = {
  text: createTextField("© 2026 {{name}}"),
  styles: defaultTextStyles,
  fontColor: undefined,
};

const defaultAppBadges: YextCafeAndCoffeeShopFooterProps["appBadges"] = {
  items: [
    {
      cta: createCTA("Download on the App Store", "#", "app-store"),
    },
    {
      cta: createCTA("Get it on Google Play", "#", "google-play"),
    },
  ],
};

export const YextCafeAndCoffeeShopFooterFields: YextFields<YextCafeAndCoffeeShopFooterProps> =
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
    brand: {
      label: "Brand",
      type: "object",
      objectFields: {
        name: {
          label: "Name",
          type: "object",
          objectFields: styledTextFields(),
        },
      },
    },
    socialLinks: {
      label: "Social Links",
      ...socialLinkFieldConfig,
    },
    footerLinks: {
      label: "Footer Links",
      ...linkFieldConfig,
    },
    legalLinks: {
      label: "Legal Links",
      ...linkFieldConfig,
    },
    fontColor: {
      label: "Link Font Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    copyright: {
      label: "Copyright",
      type: "object",
      objectFields: {
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
      },
    },
    appBadges: {
      label: "App Badges",
      type: "object",
      objectFields: {
        items: {
          label: "Badges",
          ...appBadgeFieldConfig,
        },
      },
    },
  };

export const YextCafeAndCoffeeShopFooterDefaultProps: YextCafeAndCoffeeShopFooterProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      visibleOnLivePage: true,
    },
    brand: defaultBrand,
    socialLinks: defaultSocialLinks,
    footerLinks: defaultFooterLinks,
    legalLinks: defaultLegalLinks,
    fontColor: undefined,
    copyright: defaultCopyright,
    appBadges: defaultAppBadges,
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
#local-section-sections--23715283370325__footer,
#local-section-sections--23715283370325__footer * {
  box-sizing: border-box;
}

#local-section-sections--23715283370325__footer {
  background: var(--color-background-footer, #121212);
  color: var(--color-text-footer);
  border-top: 1px solid color-mix(
    in srgb,
    var(--color-text-footer) 16%,
    transparent
  );
}

#local-section-sections--23715283370325__footer .visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

#local-section-sections--23715283370325__footer .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, currentColor 80%, transparent);
  background: transparent;
  color: inherit;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cafe-scope.no-touchevents #local-section-sections--23715283370325__footer .button:hover,
.cafe-scope.no-touchevents #local-section-sections--23715283370325__footer .button:focus-visible {
  background-color: color-mix(in srgb, currentColor 22%, transparent);
  outline: none;
}

#local-section-sections--23715283370325__footer .footer__inner {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: clamp(2rem, 3vw, 2.8rem) 40px clamp(1rem, 2vw, 1.5rem);
}

#local-section-sections--23715283370325__footer .footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.85fr);
  gap: clamp(1.5rem, 2.6vw, 3rem);
  align-items: start;
  padding-bottom: clamp(1.4rem, 2.2vw, 2rem);
}

#local-section-sections--23715283370325__footer .footer__brand {
  min-width: 0;
}

#local-section-sections--23715283370325__footer .footer__brand h2 {
  display: block;
  width: 100%;
  margin: 0;
  color: inherit;
  letter-spacing: 0.01em;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: clamp(18px, 2.4vw, 28px);
  line-height: 0.98;
  font-weight: 500;
}

#local-section-sections--23715283370325__footer .footer h3 {
  margin: 0;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
}

#local-section-sections--23715283370325__footer .footer p {
  margin: 1rem 0 0;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
}

#local-section-sections--23715283370325__footer .footer__social {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.35rem;
}

#local-section-sections--23715283370325__footer .footer__social a {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  text-decoration: none;
  transition: opacity 0.18s ease;
}

#local-section-sections--23715283370325__footer .footer__social a:hover,
#local-section-sections--23715283370325__footer .footer__social a:focus-visible {
  opacity: 0.72;
  outline: none;
}

#local-section-sections--23715283370325__footer .footer__stores {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

#local-section-sections--23715283370325__footer .footer__stores .footer__store-badge {
  min-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

#local-section-sections--23715283370325__footer .footer__stores img {
  height: 34px;
  width: auto;
  display: block;
  object-fit: contain;
}

#local-section-sections--23715283370325__footer .footer__links {
  align-self: start;
  justify-self: end;
  width: min(100%, 360px);
}

#local-section-sections--23715283370325__footer .footer__links ul {
  margin: 0.9rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.2rem;
  row-gap: 0.65rem;
}

#local-section-sections--23715283370325__footer .footer__links .menu-link,
#local-section-sections--23715283370325__footer .footer__bottom nav a {
  text-decoration: none;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 400;
  transition: color 0.16s ease, opacity 0.18s ease;
}

#local-section-sections--23715283370325__footer .footer__bottom nav .text-animation--underline-in-header,
#local-section-sections--23715283370325__footer .footer__links .text-animation--underline-in-header {
  display: inline;
}

#local-section-sections--23715283370325__footer .footer__bottom nav a:hover,
#local-section-sections--23715283370325__footer .footer__bottom nav a:focus-visible,
#local-section-sections--23715283370325__footer .footer__links .menu-link:hover,
#local-section-sections--23715283370325__footer .footer__links .menu-link:focus-visible {
  opacity: 0.72;
  outline: none;
}

#local-section-sections--23715283370325__footer .footer__bottom {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 14px;
  line-height: 1.4;
  border-top: 1px solid color-mix(
    in srgb,
    var(--color-text-footer) 16%,
    transparent
  );
  padding-top: 1rem;
}

#local-section-sections--23715283370325__footer .footer__bottom nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

@media (max-width: 1100px) {
  #local-section-sections--23715283370325__footer .footer__top {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  #local-section-sections--23715283370325__footer .footer__links {
    justify-self: start;
    width: 100%;
  }

  #local-section-sections--23715283370325__footer .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 767px) {
  #local-section-sections--23715283370325__footer .footer__inner {
    padding-inline: 14px;
  }

  #local-section-sections--23715283370325__footer .footer__top {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  #local-section-sections--23715283370325__footer .footer__brand,
  #local-section-sections--23715283370325__footer .footer__links {
    margin: 0;
  }

  #local-section-sections--23715283370325__footer .footer__links ul {
    grid-template-columns: 1fr 1fr;
    row-gap: 0.9rem;
  }

  #local-section-sections--23715283370325__footer .footer__bottom nav {
    gap: 0.8rem;
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
  fallback = "",
) =>
  resolveComponentData(field, locale, streamDocument)?.trim() ||
  resolveTranslatableStringValue(
    field.constantValue,
    locale,
    streamDocument,
    fallback,
  ).trim();
  
const resolveBrandName = (
  brand: YextCafeAndCoffeeShopFooterProps["brand"],
  locale: string,
  streamDocument: StreamDocument | undefined,
) => {
  const preferredName = resolveTextFieldValue(
    brand.name.text,
    locale,
    streamDocument,
    "Redwood Burger Co.",
  );

  const geomodifier =
    typeof streamDocument?.geomodifier === "string"
      ? streamDocument.geomodifier.trim()
      : typeof streamDocument?.location?.geomodifier === "string"
        ? streamDocument.location.geomodifier.trim()
        : "";

  return geomodifier && preferredName.endsWith(` - ${geomodifier}`)
    ? preferredName
        .slice(0, preferredName.length - geomodifier.length - 3)
        .trim()
    : preferredName;
};

const getLinkTarget = (openInNewTab: boolean, isEditing = false) =>
  openInNewTab ? "_blank" : isEditing ? undefined : "_top";

const resolveFooterLinkLabel = (
  value: unknown,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback: string,
) =>
  resolveTranslatableStringValue(
    (value as ComprehensiveCTAValue).data.cta.constantValue?.label,
    locale,
    streamDocument,
    fallback,
  );

const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): image is ImageType | ComplexImageType | TranslatableAssetImage => {
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

const resolveSocialIconAltText = (
  icon: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback: string,
) => {
  if (!icon || typeof icon !== "object") {
    return fallback;
  }

  if (
    "alternateText" in icon &&
    icon.alternateText &&
    typeof icon.alternateText === "object"
  ) {
    return resolveTranslatableStringValue(
      icon.alternateText as TranslatableString,
      locale,
      streamDocument,
      fallback,
    );
  }

  if (
    "image" in icon &&
    icon.image &&
    typeof icon.image === "object" &&
    "alternateText" in icon.image &&
    icon.image.alternateText &&
    typeof icon.image.alternateText === "object"
  ) {
    return resolveTranslatableStringValue(
      icon.image.alternateText as TranslatableString,
      locale,
      streamDocument,
      fallback,
    );
  }

  return fallback;
};

const YextCafeAndCoffeeShopFooterComponent: PuckComponent<
  YextCafeAndCoffeeShopFooterProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const isDarkBackground = isDarkColor(
    props.section.backgroundColor,
    streamDocument,
  );
  const brandName = resolveBrandName(props.brand, locale, streamDocument);
  const copyrightText = resolveTextFieldValue(
    props.copyright.text,
    locale,
    streamDocument,
  ).replace(/\{\{name\}\}/g, brandName);

  const wrapperStyle: React.CSSProperties &
    Record<
      "--color-background-footer" | "--color-text-footer",
      string | undefined
    > = {
    "--color-background-footer": toThemeCss(
      props.section.backgroundColor.selectedColor,
    ),
    "--color-text-footer": toThemeCss(
      props.section.backgroundColor.contrastingColor,
    ),
  };
  const brandTextColor = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );
  const footerLinkColor =
    toThemeCss(props.fontColor?.selectedColor) ??
    toThemeCss(props.section.backgroundColor.contrastingColor);
  const socialLinks = (
    props.socialLinks as Array<
      FooterSocialLinkValue | LegacyFooterSocialLinkValue
    >
  ).map((item) => {
    if ("iconImage" in item) {
      return item;
    }

    const legacyIconUrl = isDarkBackground
      ? socialIconLightUrls[item.icon]
      : socialIconDarkUrls[item.icon];
    const legacyDimensions = socialIconAssetDimensions[item.icon];

    return {
      ...item,
      iconImage: createImageField(
        legacyIconUrl,
        legacyDimensions.width,
        legacyDimensions.height,
        socialIconLabels[item.icon],
      ),
    };
  });
  const appBadgeItems =
    "items" in props.appBadges
      ? props.appBadges.items
      : [
          ...((props.appBadges as LegacyFooterAppBadges).appStore
            ? [{ cta: (props.appBadges as LegacyFooterAppBadges).appStore! }]
            : []),
          ...((props.appBadges as LegacyFooterAppBadges).playStore
            ? [{ cta: (props.appBadges as LegacyFooterAppBadges).playStore! }]
            : []),
        ];

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopFooter${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={wrapperStyle}
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <div
            id="local-section-sections--23715283370325__footer"
            className="local-section local-section-group-footer-group main-footer footer section-footer"
          >
            <div className="footer__inner">
              <div className="footer__top">
                <section
                  className="footer__brand"
                  aria-label="Brand and socials"
                >
                  <EntityField
                    displayName="Brand Name"
                    fieldId={props.brand.name.text.field}
                    constantValueEnabled={
                      props.brand.name.text.constantValueEnabled
                    }
                  >
                    <h2
                      style={getStyledTextStyle(
                        props.brand.name,
                        brandTextColor,
                      )}
                    >
                      {brandName}
                    </h2>
                  </EntityField>
                  <div className="footer__social">
                    {socialLinks.map((item, index) => {
                      const iconImage = resolveComponentData(
                        item.iconImage.image,
                        locale,
                        streamDocument,
                      ) as
                        | ImageType
                        | ComplexImageType
                        | TranslatableAssetImage
                        | undefined;
                      const iconLabel = resolveSocialIconAltText(
                        iconImage,
                        locale,
                        streamDocument,
                        `Social Link ${index + 1}`,
                      );
                      const imageStyle: React.CSSProperties = {
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "contain",
                      };

                      return (
                        <Link
                          key={`${iconLabel}-${index}`}
                          cta={{
                            link: resolveTranslatableStringValue(
                              item.link,
                              locale,
                              streamDocument,
                              "#",
                            ),
                            linkType: item.linkType,
                          }}
                          aria-label={iconLabel}
                          target={getLinkTarget(
                            Boolean(item.openInNewTab),
                            isEditing,
                          )}
                          rel={
                            item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {hasImageSource(iconImage) ? (
                            <EntityField
                              displayName={`Social Icon ${index + 1}`}
                              fieldId={item.iconImage.image.field}
                              constantValueEnabled={
                                item.iconImage.image.constantValueEnabled
                              }
                              className="h-full w-full"
                            >
                              <div className="h-full w-full">
                                <Image
                                  image={iconImage}
                                  className="h-full w-full"
                                  style={imageStyle}
                                />
                              </div>
                            </EntityField>
                          ) : null}
                          <span className="visually-hidden">{iconLabel}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="footer__stores">
                    {appBadgeItems.map((item, index) => (
                      <EntityField
                        key={`footer-badge-${index}`}
                        displayName={`App Store Badge ${index + 1}`}
                        fieldId={item.cta.data.cta.field}
                        constantValueEnabled={
                          item.cta.data.cta.constantValueEnabled
                        }
                      >
                        <ComprehensiveCTA
                          value={item.cta as Partial<ComprehensiveCTAValue>}
                          className="footer__store-badge"
                        />
                      </EntityField>
                    ))}
                  </div>
                </section>

                <nav className="footer__links" aria-label="Footer links">
                  <ul>
                    {props.footerLinks.map((item, index) => {
                      const label = resolveFooterLinkLabel(
                        item.cta,
                        locale,
                        streamDocument,
                        `Footer Link ${index + 1}`,
                      );
                      const cta = item.cta as ComprehensiveCTAValue;
                      return (
                        <li key={`${label}-${index}`}>
                          <EntityField
                            displayName={`Footer Link ${index + 1}`}
                            fieldId={cta.data.cta.field}
                            constantValueEnabled={
                              cta.data.cta.constantValueEnabled
                            }
                          >
                            <ComprehensiveCTA
                              className="menu-link"
                              value={{
                                ...cta,
                                sx: {
                                  color: footerLinkColor,
                                },
                              }}
                            />
                          </EntityField>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="footer__bottom">
                <EntityField
                  displayName="Copyright"
                  fieldId={props.copyright.text.field}
                  constantValueEnabled={
                    props.copyright.text.constantValueEnabled
                  }
                >
                  <span
                    style={{
                      color: toThemeCss(
                        props.copyright.fontColor?.selectedColor,
                      ),
                      fontFamily: getStyleValue(
                        props.copyright.styles.fontFamily,
                      ),
                      fontSize: getStyleValue(props.copyright.styles.fontSize),
                      fontWeight: getStyleValue(
                        props.copyright.styles.fontWeight,
                      ),
                      fontStyle: getStyleValue(
                        props.copyright.styles.fontStyle,
                      ),
                      textTransform: getStyleValue(
                        props.copyright.styles.textTransform,
                      ),
                    }}
                  >
                    {copyrightText}
                  </span>
                </EntityField>
                <nav aria-label="Legal links">
                  {props.legalLinks.map((item, index) => {
                    const label = resolveFooterLinkLabel(
                      item.cta,
                      locale,
                      streamDocument,
                      `Legal Link ${index + 1}`,
                    );
                    const cta = item.cta as ComprehensiveCTAValue;
                    return (
                      <EntityField
                        key={`${label}-${index}`}
                        displayName={`Legal Link ${index + 1}`}
                        fieldId={cta.data.cta.field}
                        constantValueEnabled={cta.data.cta.constantValueEnabled}
                      >
                        <ComprehensiveCTA
                          value={{
                            ...cta,
                            sx: {
                              color: footerLinkColor,
                            },
                          }}
                        />
                      </EntityField>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopFooter: YextComponentConfig<YextCafeAndCoffeeShopFooterProps> =
  {
    label: "Footer",
    fields: YextCafeAndCoffeeShopFooterFields,
    defaultProps: YextCafeAndCoffeeShopFooterDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopFooterComponent {...props} />,
  };
