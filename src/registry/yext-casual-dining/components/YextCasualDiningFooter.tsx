import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  createStyledTextConfig,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  resolveComponentData,
  StyledTextComponent,
  ThemeOptions,
  useDocument,
  VisibilityWrapper,
  type StyledImageValue,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  type YextEntityField,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";

export type HoursIntervalData = {
  start?: string;
  end?: string;
};

export type HoursDayData = {
  isClosed?: boolean;
  openIntervals?: HoursIntervalData[];
};

export type HoursData = Record<string, string | HoursDayData | undefined>;

export type ImageConstantValue = {
  url?: string;
  width?: number;
  height?: number;
  alternateText?: string;
};

export type ImageFieldValue = {
  field?: string;
  constantValue?: ImageConstantValue;
  constantValueEnabled?: boolean;
};

export type AddressFieldSet = {
  source: "entity" | "custom";
  subheading?: string;
  subheadingFontColor?: ThemeColor;
  customLine1: string;
  customLine2: string;
  customCity: string;
  customState: string;
  customZipCode: string;
  contentFontColor?: ThemeColor;
};

export type LocationAddressField = {
  source: "entity" | "custom";
  entityLine1: unknown;
  entityLine2: unknown;
  entityCity: unknown;
  entityState: unknown;
  entityZipCode: unknown;
  customLine1: string;
  customLine2: string;
  customCity: string;
  customState: string;
  customZipCode: string;
};

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

.rte {
font-size: var(--font-body-medium);
}

.unstyled {
list-style: none;
  padding: 0;
  margin: 0;
}

.section-padding {
padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
}


.heading-x-small {
margin: 0;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.heading-x-small {
font-size: var(--font-heading-x-small);
  line-height: 1;
}

.heading-x-small :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.footer-sections {
background: var(--footer-bg);
  color: var(--footer-text);
}

.site-footer-wrapper {
padding-top: 75px;
  padding-bottom: 30px;
}

.site-footer {
border-top: 0;
}

.footer__blocks {
display: grid;
  grid-template-columns: 1.5fr 0.2fr minmax(0, 1fr);
  gap: 28px;
  align-items: start;
  padding-top: 32px;
}

.footer__socials {
display: flex;
  gap: 12px;
  margin-top: 22px;
}

.footer__socials a:hover,
.footer__quicklinks a:hover,
.supporting-menu__copyright a:hover {
color: inherit;
  opacity: 0.92;
}

.footer__socials a {
display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.footer__social-icon {
width: 20px;
  height: 20px;
  opacity: 0.88;
}

.supporting-menu {
padding-top: 18px;
  padding-bottom: 32px;
}

.supporting-menu__inner {
display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.supporting-menu__item {
display: flex;
  align-items: center;
}

.footer__block__title {
margin-bottom: 10px;
}

.footer__menus {
display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 28px;
  align-items: start;
}

.app-badges {
display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.app-badge--image {
display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  min-width: 0;
  overflow: hidden;
}

.app-badge--image img {
display: block;
  max-width: none;
  object-fit: contain;
height: 58px;
  width: auto;
}

.inline-list {
display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}

.footer__blocks {
grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
}

.footer__block--divider {
display: none;
}
}

@media (max-width: 768px) {
.footer__blocks {
grid-template-columns: 1fr;
}

.footer__blocks {
gap: 22px;
    text-align: center;
}

.footer__block__title,
.footer__socials,
.footer__quicklinks,
.footer__menus,
.supporting-menu__inner,
.supporting-menu__copyright {
justify-content: center;
    text-align: center;
}

.footer__block__title {
display: flex;
    justify-content: center;
}

.footer__socials {
margin-left: auto;
    margin-right: auto;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

const brandTextConfig = createStyledTextConfig({
  kind: "plain",
  label: "Text",
  includeColor: true,
});

const descriptionConfig = createStyledTextConfig({
  kind: "richText",
  label: "Description",
  includeColor: true,
});

type FooterImageField = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type FooterLinkItem = {
  text: YextEntityField<TranslatableString>;
  href: YextEntityField<TranslatableString>;
};

type FooterLinkRow = {
  item?: FooterLinkItem;
};

type FooterLinkColumn = {
  label?: YextEntityField<TranslatableString>;
  links?: FooterLinkRow[];
};

type FooterSocialLinkItem = {
  label: YextEntityField<TranslatableString>;
  href: YextEntityField<TranslatableString>;
  icon: YextEntityField<TranslatableAssetImage>;
};

type FooterSocialLinkRow = {
  item?: FooterSocialLinkItem;
};

type FooterBottomLinkRow = {
  item?: {
    text: YextEntityField<TranslatableString>;
    href: YextEntityField<TranslatableString>;
  };
};

type FooterBadgeField = {
  cta: ComprehensiveCTAValue;
};

type CasualDiningFooterProps = {
  id?: string;
  puck?: {
    isEditing?: boolean;
  };
  section: {
    backgroundColor?: ThemeColor;
    footerBackgroundColor?: ThemeColor;
    visibleOnLivePage: boolean;
  };
  brand: {
    text: StyledPlainTextProps;
    image: FooterImageField;
  };
  description: StyledRichTextProps;
  socialLinks: FooterSocialLinkRow[];
  appBadges: FooterBadgeField[];
  footerLinks: {
    columns: FooterLinkColumn[];
  };
  legalLinks: FooterBottomLinkRow[];
};

const footerSocialIcons = [
  {
    label: "Facebook",
    href: "#",
    icon: "https://a.mktgcdn.com/p/W4VnI9z2cPOas-03ha0Aj7DtCCeIhHHtvDoGE11AFHA/2084x2084.png",
  },
  {
    label: "Instagram",
    href: "#",
    icon: "https://a.mktgcdn.com/p/J8WQMUeh5I-eDaSwo1-UZ0gKIf98EeV8uEwoccQVmbc/800x800.png",
  },
  {
    label: "Yelp",
    href: "#",
    icon: "https://a.mktgcdn.com/p/LZy74DpCsv6FZ7l6O_GFfMLkjlMDrqL6c0EGXswYpSA/800x1002.png",
  },
];

const footerInfoLinks = [
  { label: "Menu", href: "#featured-menu" },
  { label: "Order online", href: "#" },
  { label: "Reservations", href: "#" },
  { label: "FAQs", href: "#faq" },
];

const footerShopLinks = [
  { label: "Catering", href: "#faq" },
  { label: "Careers", href: "#" },
  { label: "Gift Cards", href: "#" },
  { label: "Subscribe to emails", href: "#" },
  { label: "Contact", href: "#footer" },
];

const footerLegalLinks = [
  { label: "© 2026 [[name]]. All Rights Reserved.", href: "#" },
  { label: "Reservations", href: "#" },
  { label: "Gift Cards", href: "#" },
  { label: "Contact", href: "#" },
];

const footerBadgePresets = [
  {
    presetImage: "app-store" as const,
    label: "Download on the App Store",
    href: "#",
  },
  {
    presetImage: "google-play" as const,
    label: "Get it on Google Play",
    href: "#",
  },
];

const createFooterLinkItems = (links: Array<{ label: string; href: string }>) =>
  links.map((item): FooterLinkRow => ({
    item: {
      text: {
        field: "",
        constantValue: {
          defaultValue: item.label,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
      href: {
        field: "",
        constantValue: {
          defaultValue: item.href,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
    },
  }));

const fields: YextFields<CasualDiningFooterProps> = {
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
      footerBackgroundColor: {
        label: "Footer Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  brand: {
    label: "Brand",
    type: "object",
    objectFields: {
      text: {
        label: "Text",
        type: "object",
        objectFields: brandTextConfig.fields!,
      },
      image: {
        label: "Image",
        type: "object",
        objectFields: {
          image: {
            type: "entityField",
            label: "Image",
            filter: {
              types: ["type.image"],
            },
          },
          aspectRatio: {
            label: "Aspect Ratio",
            type: "basicSelector",
            options: ThemeOptions.ASPECT_RATIO,
          },
          imageConstrain: {
            label: "Image Constrain",
            type: "select",
            options: [
              { label: "Fixed", value: "fixed" },
              { label: "Filled", value: "filled" },
            ],
          },
          styles: {
            label: "Image Styles",
            type: "styledImage",
          },
        },
      },
    },
  },
  description: {
    label: "Description",
    type: "object",
    objectFields: descriptionConfig.fields!,
  },
  socialLinks: {
    label: "Social Links",
    type: "array",
    arrayFields: {
      item: {
        label: "Item",
        type: "object",
        objectFields: {
          label: {
            label: "Label",
            type: "entityField",
            filter: {
              types: ["type.string"],
            },
          },
          href: {
            label: "Link",
            type: "entityField",
            filter: {
              types: ["type.string"],
            },
          },
          icon: {
            label: "Icon",
            type: "entityField",
            filter: {
              types: ["type.image"],
            },
          },
        },
      },
    },
    defaultItemProps: {
      item: {
        label: {
          field: "",
          constantValue: {
            defaultValue: "Social Link",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        href: {
          field: "",
          constantValue: {
            defaultValue: "#",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        icon: {
          field: "",
          constantValue: {
            url: "",
            width: 0,
            height: 0,
            alternateText: "",
          },
          constantValueEnabled: true,
        },
      },
    } satisfies FooterSocialLinkRow,
    getItemSummary: (_row: FooterSocialLinkRow | undefined, index?: number) =>
      `Social Link ${(index ?? 0) + 1}`,
  },
  appBadges: {
    label: "App Badges",
    type: "array",
    arrayFields: {
      cta: {
        label: "CTA",
        type: "comprehensiveCTA",
      },
    },
    defaultItemProps: {
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "presetImage",
              label: "",
              link: "#",
              linkType: "URL",
            },
            selectedType: "presetImage",
          },
          openInNewTab: true,
        },
        styles: {
          variant: "link",
          presetImage: "app-store",
        },
      },
    },
    getItemSummary: (_item, index) => `CTA ${(index ?? 0) + 1}`,
  },
  footerLinks: {
    label: "Column Links",
    type: "object",
    objectFields: {
      columns: {
        label: "Columns",
        type: "array",
        defaultItemProps: {
          label: {
            field: "",
            constantValue: {
              defaultValue: "",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
          links: [],
        },
        arrayFields: {
          label: {
            label: "Column Label",
            type: "entityField",
            filter: {
              types: ["type.string"],
            },
          },
          links: {
            label: "Links",
            type: "array",
            defaultItemProps: {
              item: {
                text: {
                  field: "",
                  constantValue: {
                    defaultValue: "",
                    hasLocalizedValue: "true" as const,
                  },
                  constantValueEnabled: true,
                },
                href: {
                  field: "",
                  constantValue: {
                    defaultValue: "#",
                    hasLocalizedValue: "true" as const,
                  },
                  constantValueEnabled: true,
                },
              },
            },
            arrayFields: {
              item: {
                label: "Link",
                type: "object",
                objectFields: {
                  text: {
                    label: "Text",
                    type: "entityField",
                    filter: {
                      types: ["type.string"],
                    },
                  },
                  href: {
                    label: "Link",
                    type: "entityField",
                    filter: {
                      types: ["type.string"],
                    },
                  },
                },
              },
            },
            getItemSummary: (_row, index?: number) => `Link ${(index ?? 0) + 1}`,
          },
        },
        getItemSummary: (
          _column: FooterLinkColumn | undefined,
          index?: number,
        ) => `Column ${(index ?? 0) + 1}`,
      },
    },
  },
  legalLinks: {
    label: "Footer Links",
    type: "array",
    defaultItemProps: {
      item: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        href: {
          field: "",
          constantValue: {
            defaultValue: "#",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
      },
    },
    arrayFields: {
      item: {
        label: "Item",
        type: "object",
        objectFields: {
          text: {
            label: "Text",
            type: "entityField",
            filter: {
              types: ["type.string"],
            },
          },
          href: {
            label: "Link",
            type: "entityField",
            filter: {
              types: ["type.string"],
            },
          },
        },
      },
    },
    getItemSummary: (_row: FooterBottomLinkRow | undefined, index?: number) =>
      `Footer Link ${(index ?? 0) + 1}`,
  },
};

const defaultProps: CasualDiningFooterProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-primary-dark",
      contrastingColor: "white",
    },
    footerBackgroundColor: {
      selectedColor: "palette-quaternary",
      contrastingColor: "palette-quaternary-contrast",
    },
    visibleOnLivePage: true,
  },
  brand: {
    text: {
      ...brandTextConfig.defaultProps,
      data: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: false,
        },
      },
    } as StyledPlainTextProps,
    image: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
          width: 100,
          height: 100,
          alternateText: "Brand logo",
        },
        constantValueEnabled: true,
      },
      aspectRatio: 1,
      imageConstrain: "fixed",
      styles: {
        borderRadius: "default",
      },
    },
  },
  description: {
    ...descriptionConfig.defaultProps,
    data: {
      text: {
        field: "",
        constantValue: {
          defaultValue:
            "[[geomodifier]], [[address.city]]. Upscale burgers, all-day comfort food, brunch, happy hour, and group dining rooted in [[address.region]] hospitality.",
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
    },
  } as StyledRichTextProps,
  socialLinks: footerSocialIcons.map((item) => ({
    item: {
      label: {
        field: "",
        constantValue: {
          defaultValue: item.label,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
      href: {
        field: "",
        constantValue: {
          defaultValue: item.href,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
      icon: {
        field: "",
        constantValue: {
          url: item.icon,
          width: 22,
          height: 22,
          alternateText: item.label,
        },
        constantValueEnabled: true,
      },
    },
  })) satisfies Array<FooterSocialLinkRow>,
  appBadges: footerBadgePresets.map((item): FooterBadgeField => ({
    cta: {
      data: {
        actionType: "link",
        cta: {
          field: "",
          constantValueEnabled: true,
          constantValue: {
            ctaType: "presetImage",
            label: "",
            link: item.href,
            linkType: "URL",
          },
          selectedType: "presetImage",
        },
        openInNewTab: true,
      },
      styles: {
        variant: "link",
        presetImage: item.presetImage,
      },
    },
  })),
  footerLinks: {
    columns: [
      {
        label: {
          field: "",
          constantValue: {
            defaultValue: "Info",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        links: createFooterLinkItems(footerInfoLinks),
      },
      {
        label: {
          field: "",
          constantValue: {
            defaultValue: "Quick Shop",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        links: createFooterLinkItems(footerShopLinks),
      },
    ],
  },
  legalLinks: footerLegalLinks.map((item) => ({
    item: {
      text: {
        field: "",
        constantValue: {
          defaultValue: item.label,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
      href: {
        field: "",
        constantValue: {
          defaultValue: item.href,
          hasLocalizedValue: "true" as const,
        },
        constantValueEnabled: true,
      },
    },
  })) satisfies Array<FooterBottomLinkRow>,
};

const CasualDiningFooterComponent = (props: CasualDiningFooterProps) => {
  const streamDocument = useDocument();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const socialLinks =
    Array.isArray(props.socialLinks) && props.socialLinks.length > 0
      ? props.socialLinks
      : defaultProps.socialLinks;
  const brandImageStyles = props.brand?.image?.styles ?? {
    borderRadius: "default",
  };
  const resolvedBrandImage = resolveComponentData(
    props.brand?.image?.image,
    locale,
    streamDocument,
  );
  const brandImageUrl = props.brand?.image?.image?.constantValue?.url;
  const footerColumns = Array.isArray(props.footerLinks?.columns)
    ? props.footerLinks.columns
    : defaultProps.footerLinks.columns;
  const legalLinks = props.legalLinks ?? defaultProps.legalLinks;
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section?.backgroundColor,
    streamDocument,
  );
  const sectionTextColor = sectionSurfaceStyle?.color;
  const footerBottomSurfaceStyle = getSurfaceColorStyle(
    props.section?.footerBackgroundColor,
    streamDocument,
    {
      fallbackTextColor: sectionTextColor,
    },
  );
  const footerBottomTextColor = footerBottomSurfaceStyle?.color;

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningFooter${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <RootStyle>
          <Background
            as="footer"
            background={props.section?.backgroundColor}
            className="footer-sections"
            id="footer"
            style={{
              ...sectionSurfaceStyle,
              ["--footer-text" as string]: sectionTextColor,
            }}
          >
            <div className="site-footer-wrapper section-padding color-scheme-footer">
              <div className="site-footer wrapper--full-padded">
                <div className="footer__blocks">
                  <div className="footer__block footer__block--text">
                    {brandImageUrl ? (
                      <div className="footer__block__title">
                        <EntityField
                          displayName="Brand Image"
                          fieldId={props.brand.image.image.field}
                          constantValueEnabled={
                            props.brand.image.image.constantValueEnabled
                          }
                        >
                          <Image
                            image={resolvedBrandImage!}
                            style={{
                              display: "block",
                              margin: "0 auto",
                              width: "auto",
                              maxHeight: 100,
                              height:
                                props.brand?.image?.aspectRatio > 0
                                  ? "100%"
                                  : "auto",
                              objectFit:
                                props.brand?.image?.imageConstrain === "filled"
                                  ? "cover"
                                  : "contain",
                              borderRadius:
                                brandImageStyles.borderRadius === "default"
                                  ? undefined
                                  : brandImageStyles.borderRadius,
                            }}
                          />
                        </EntityField>
                      </div>
                    ) : null}
                    <div className="h3 footer__block__title heading-x-small">
                      <EntityField
                        displayName="Brand Text"
                        fieldId={props.brand.text.data.text.field}
                        constantValueEnabled={
                          props.brand.text.data.text.constantValueEnabled
                        }
                      >
                        <StyledTextComponent
                          kind="plain"
                          {...props.brand.text}
                          tag="h3"
                          puck={
                            props.puck?.isEditing
                              ? { isEditing: true }
                              : undefined
                          }
                        />
                      </EntityField>
                    </div>
                    <div className="footer__block__content">
                      <div className="rte">
                        <EntityField
                          displayName="Description"
                          fieldId={props.description.data.text.field}
                          constantValueEnabled={
                            props.description.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="richText"
                            {...props.description}
                            puck={
                              props.puck?.isEditing
                                ? { isEditing: true }
                                : undefined
                            }
                          />
                        </EntityField>
                      </div>
                      <div className="footer__socials">
                        {socialLinks.map((row, index: number) => {
                          const item = row?.item;
                          if (!item) {
                            return null;
                          }
                          const href = resolveComponentData(
                            item.href,
                            locale,
                            streamDocument,
                          );
                          const label = resolveComponentData(
                            item.label,
                            locale,
                            streamDocument,
                          );
                          const icon = resolveComponentData(
                            item.icon,
                            locale,
                            streamDocument,
                          );
                          const resolvedLabel =
                            typeof label === "string"
                              ? label
                              : `social-${index}`;
                          const hasIcon =
                            !!icon &&
                            typeof icon === "object" &&
                            ("url" in icon ||
                              ("image" in icon &&
                                !!icon.image &&
                                typeof icon.image === "object" &&
                                "url" in icon.image));
                          const iconUrl =
                            hasIcon && icon && typeof icon === "object"
                              ? "url" in icon
                                ? icon.url
                                : "image" in icon &&
                                    icon.image &&
                                    typeof icon.image === "object" &&
                                    "url" in icon.image
                                  ? icon.image.url
                                  : undefined
                              : undefined;
                          return (
                            <EntityField
                              key={`social-${index}`}
                              displayName="Social Link Destination"
                              fieldId={item.href.field}
                              constantValueEnabled={
                                item.href.constantValueEnabled
                              }
                            >
                              <a
                                href={
                                  typeof href === "string" ? href : undefined
                                }
                                aria-label={resolvedLabel}
                                style={{ color: sectionTextColor }}
                              >
                                {hasIcon && typeof iconUrl === "string" ? (
                                  <EntityField
                                    displayName="Social Icon"
                                    fieldId={item.icon.field}
                                    constantValueEnabled={
                                      item.icon.constantValueEnabled
                                    }
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="footer__social-icon"
                                      style={{
                                        display: "block",
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "currentColor",
                                        WebkitMaskImage: `url(${iconUrl})`,
                                        maskImage: `url(${iconUrl})`,
                                        WebkitMaskRepeat: "no-repeat",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                        maskPosition: "center",
                                        WebkitMaskSize: "contain",
                                        maskSize: "contain",
                                      }}
                                    />
                                  </EntityField>
                                ) : (
                                  <EntityField
                                    displayName="Social Label"
                                    fieldId={item.label.field}
                                    constantValueEnabled={
                                      item.label.constantValueEnabled
                                    }
                                  >
                                    <span>{resolvedLabel}</span>
                                  </EntityField>
                                )}
                              </a>
                            </EntityField>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="footer__block footer__block--divider footer__block--divider--inline" />

                  <div className="footer__menus">
                    {footerColumns.map((row, columnIndex: number) => {
                      const column =
                        row && typeof row === "object"
                          ? row
                          : defaultProps.footerLinks.columns[columnIndex];
                      if (!column) {
                        return null;
                      }
                      const links = Array.isArray(column.links)
                        ? column.links
                        : [];
                      const resolvedColumnLabel = column?.label
                        ? resolveComponentData(
                            column.label as any,
                            locale,
                            streamDocument,
                          )
                        : undefined;
                      const columnLabel =
                        typeof resolvedColumnLabel === "string"
                          ? resolvedColumnLabel
                          : `Column ${columnIndex + 1}`;

                      return (
                        <div
                          className="footer__block footer__block--menu"
                          key={columnLabel}
                        >
                          {column.label ? (
                            <EntityField
                              displayName="Footer Column Heading"
                              fieldId={column.label.field}
                              constantValueEnabled={
                                column.label.constantValueEnabled
                              }
                            >
                              <h3
                                className="h3 footer__block__title heading-x-small"
                                style={{ color: sectionTextColor }}
                              >
                                {columnLabel}
                              </h3>
                            </EntityField>
                          ) : (
                            <h3
                              className="h3 footer__block__title heading-x-small"
                              style={{ color: sectionTextColor }}
                            >
                              {columnLabel}
                            </h3>
                          )}
                          <div className="footer__block__content">
                            <ul className="footer__quicklinks unstyled">
                              {links.map((linkRow, linkIndex) => {
                                const fallbackColumn =
                                  defaultProps.footerLinks.columns[columnIndex];
                                const item =
                                  (linkRow && typeof linkRow === "object"
                                    ? linkRow.item
                                    : undefined) ??
                                  fallbackColumn?.links?.[linkIndex]?.item;
                                if (!item) {
                                  return null;
                                }
                                const resolvedHref = resolveComponentData(
                                  item.href,
                                  locale,
                                  streamDocument,
                                );
                                const resolvedText = resolveComponentData(
                                  item.text,
                                  locale,
                                  streamDocument,
                                );

                                return (
                                  <li key={`${columnLabel}-${linkIndex}`}>
                                    <EntityField
                                      displayName="Footer Link Destination"
                                      fieldId={item.href.field}
                                      constantValueEnabled={
                                        item.href.constantValueEnabled
                                      }
                                    >
                                      <EntityField
                                        displayName="Footer Link Text"
                                        fieldId={item.text.field}
                                        constantValueEnabled={
                                          item.text.constantValueEnabled
                                        }
                                      >
                                        <a
                                          href={
                                            typeof resolvedHref === "string"
                                              ? resolvedHref
                                              : undefined
                                          }
                                          style={{ color: sectionTextColor }}
                                        >
                                          {typeof resolvedText === "string"
                                            ? resolvedText
                                            : null}
                                        </a>
                                      </EntityField>
                                    </EntityField>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <section
              className="supporting-menu section-padding color-scheme-footer"
              style={footerBottomSurfaceStyle}
            >
              <div className="supporting-menu__inner wrapper--full-padded">
                <div className="supporting-menu__item supporting-menu__item--copyright">
                  <ul className="supporting-menu__copyright inline-list body-small">
                    {legalLinks.map((row, index: number) => {
                      const item = row?.item ?? legalLinks[index]?.item;
                      if (!item) {
                        return null;
                      }
                      const href = resolveComponentData(
                        item.href,
                        locale,
                        streamDocument,
                      );
                      const text = resolveComponentData(
                        item.text,
                        locale,
                        streamDocument,
                      );
                      return (
                        <li key={`legal-${index}`}>
                          <EntityField
                            displayName="Legal Link Destination"
                            fieldId={item.href.field}
                            constantValueEnabled={
                              item.href.constantValueEnabled
                            }
                          >
                            <EntityField
                              displayName="Legal Link Text"
                              fieldId={item.text.field}
                              constantValueEnabled={
                                item.text.constantValueEnabled
                              }
                            >
                              <a
                                href={
                                  typeof href === "string" ? href : undefined
                                }
                                style={{ color: footerBottomTextColor }}
                              >
                                {typeof text === "string" ? text : null}
                              </a>
                            </EntityField>
                          </EntityField>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="supporting-menu__item supporting-menu__item--apps">
                  <div className="app-badges">
                    {(props.appBadges ?? defaultProps.appBadges).map(
                      (badge, index) => {
                        const badgeCta = badge?.cta;
                        if (!badgeCta) {
                          return null;
                        }

                        return (
                          <EntityField
                            key={`app-badge-${index}`}
                            displayName="App Badge"
                            fieldId={badgeCta.data.cta.field}
                            constantValueEnabled={
                              badgeCta.data.cta.constantValueEnabled
                            }
                          >
                            <ComprehensiveCTA
                              value={badgeCta}
                              eventName={`footerBadge${index}`}
                              className="app-badge--image"
                            />
                          </EntityField>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </section>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningFooter = {
  label: "Footer",
  fields,
  defaultProps,
  render: (props: unknown) => (
    <CasualDiningFooterComponent {...(props as CasualDiningFooterProps)} />
  ),
} satisfies YextComponentConfig<CasualDiningFooterProps>;
