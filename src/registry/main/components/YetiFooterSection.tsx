import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { useState } from "react";
import { Link } from "@yext/pages-components";
import {
  resolveComponentData,
  TranslatableString,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: FontWeight;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterSubgroup = {
  label: string;
  href: string;
  links: FooterLink[];
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
  subgroups: FooterSubgroup[];
  localeLabel: string | null;
  locales: FooterLink[];
};

export type YetiFooterSectionProps = {
  signupTitle: StyledTextProps;
  signupCopy: StyledTextProps;
  copyright: StyledTextProps;
  socialLinks: FooterLink[];
  columns: FooterColumn[];
};

const defaultSocialLinks: FooterLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/Yeti/" },
  { label: "Instagram", href: "https://www.instagram.com/yeti" },
  {
    label: "Youtube",
    href: "https://www.youtube.com/channel/UCAZ5PoEUL2_clEdDBrFF-aQ",
  },
  { label: "TikTok", href: "https://www.tiktok.com/@yeti" },
];

const defaultColumns: FooterColumn[] = [
  {
    title: "Customer Support",
    links: [
      { label: "Help", href: "https://www.yeti.com/help-guide.html" },
      { label: "FAQ", href: "https://www.yeti.com/faq.html" },
      { label: "Contact", href: "https://www.yeti.com/contact-us.html" },
      { label: "ID.me", href: "https://www.yeti.com/id-me.html" },
      { label: "Order Status", href: "https://www.yeti.com/order-track" },
      {
        label: "Shipping",
        href: "https://www.yeti.com/shipping-and-returns.html",
      },
      { label: "Returns", href: "https://www.yeti.com/returns" },
      {
        label: "Register Your YETI",
        href: "https://www.yeti.com/register-product.html",
      },
      {
        label: "Product Recalls",
        href: "https://www.yeti.com/faq.html#product-recalls",
      },
      {
        label: "Accessibility",
        href: "https://www.yeti.com/accessibility-statement.html",
      },
    ],
    subgroups: [],
    localeLabel: "USA / EN",
    locales: [
      { label: "USA / ES", href: "https://www.yeti.com/es" },
      { label: "AU / EN", href: "https://au.yeti.com/" },
      { label: "CA / EN", href: "https://www.yeti.ca" },
      { label: "CA / FR", href: "https://www.yeti.ca/fr" },
      { label: "EU / EN", href: "https://eu.yeti.com/" },
      { label: "FR / FR", href: "https://fr.yeti.com/" },
      { label: "IT / IT", href: "https://it.yeti.com/" },
      { label: "DE / DE", href: "https://de.yeti.com/" },
      { label: "IE / EN", href: "https://ie.yeti.com/" },
      { label: "NL / NL", href: "https://nl.yeti.com/" },
      { label: "NZ / EN", href: "https://nz.yeti.com/" },
      { label: "GB / EN", href: "https://uk.yeti.com/" },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "About Us",
        href: "https://www.yeti.com/stories/our-story.html",
      },
      { label: "News", href: "https://www.yeti.com/news.html" },
      { label: "#KeepTheWildWild", href: "https://www.yeti.com/wild.html" },
      {
        label: "Rambler™ Buy Back",
        href: "https://www.yeti.com/rambler-buy-back.html",
      },
      {
        label: "#BuiltForTheWild",
        href: "https://www.yeti.com/built-for-the-wild.html",
      },
      {
        label: "Ambassadors",
        href: "https://www.yeti.com/stories/ambassadors.html",
      },
      { label: "Careers", href: "https://www.yeti.com/yeti-careers.html" },
      {
        label: "Recruitment Scam Warning",
        href: "https://www.yeti.com/recruitment-scam-warning.html",
      },
      {
        label: "Corporate Sales",
        href: "https://www.yeti.com/corporate-sales.html",
      },
      {
        label: "Investor Relations",
        href: "https://investors.yeti.com/overview/default.aspx",
      },
      { label: "Dealer Resources", href: "https://www.yeti.com/dealers.html" },
      {
        label: "Affiliate Program",
        href: "https://www.yeti.com/affiliate.html",
      },
      { label: "Patents", href: "https://www.yeti.com/patents.html" },
    ],
    subgroups: [],
    localeLabel: null,
    locales: [],
  },
  {
    title: "Stores",
    links: [
      {
        label: "See All Stores",
        href: "https://www.yeti.com/yeti-store-locations.html",
      },
      { label: "Dealer Locator", href: "https://www.yeti.com/find-a-store" },
    ],
    subgroups: [
      {
        label: "US Stores",
        href: "https://www.yeti.com/mclean-store.html",
        links: [
          {
            label: "Scottsdale, AZ",
            href: "https://www.yeti.com/scottsdale-store.html",
          },
          {
            label: "Carlsbad, CA",
            href: "https://www.yeti.com/carlsbad-store.html",
          },
          {
            label: "El Segundo, CA",
            href: "https://www.yeti.com/el-segundo-store.html",
          },
          {
            label: "San Jose, CA",
            href: "https://www.yeti.com/san-jose-store.html",
          },
          {
            label: "Denver, CO",
            href: "https://www.yeti.com/denver-store.html",
          },
          {
            label: "Fort Lauderdale, FL",
            href: "https://www.yeti.com/fort-lauderdale-store.html",
          },
          {
            label: "Orlando, FL",
            href: "https://www.yeti.com/orlando-store.html",
          },
          {
            label: "Palm Beach, FL",
            href: "https://www.yeti.com/palm-beach-store.html",
          },
          {
            label: "Honolulu, HI",
            href: "https://www.yeti.com/honolulu-store.html",
          },
          {
            label: "Leawood, KS",
            href: "https://www.yeti.com/leawood-store.html",
          },
          { label: "Edina, MN", href: "https://www.yeti.com/edina-store.html" },
          {
            label: "Gretna, NE",
            href: "https://www.yeti.com/nebraska-store.html",
          },
          {
            label: "Paramus, NJ",
            href: "https://www.yeti.com/paramus-store.html",
          },
          {
            label: "Short Hills, NJ",
            href: "https://www.yeti.com/short-hills-store.html",
          },
          {
            label: "New York City, NY",
            href: "https://www.yeti.com/new-york-city-store.html",
          },
          {
            label: "Portland, OR",
            href: "https://www.yeti.com/portland-store.html",
          },
          {
            label: "King of Prussia, PA",
            href: "https://www.yeti.com/king-of-prussia-store.html",
          },
          {
            label: "Charleston, SC",
            href: "https://www.yeti.com/charleston-store.html",
          },
          {
            label: "Austin, TX - Flagship",
            href: "https://www.yeti.com/austin-tx-flagship.html",
          },
          {
            label: "Austin, TX - Domain Northside",
            href: "https://www.yeti.com/austin-domain-northside.html",
          },
          {
            label: "Dallas, TX",
            href: "https://www.yeti.com/dallas-knox-store.html",
          },
          {
            label: "Houston, TX",
            href: "https://www.yeti.com/houston-store.html",
          },
          {
            label: "San Antonio, TX",
            href: "https://www.yeti.com/san-antonio-store.html",
          },
          {
            label: "Southlake, TX",
            href: "https://www.yeti.com/southlake-store.html",
          },
          {
            label: "The Woodlands, TX",
            href: "https://www.yeti.com/the-woodlands-store.html",
          },
          {
            label: "McLean, VA",
            href: "https://www.yeti.com/mclean-store.html",
          },
        ],
      },
      {
        label: "International Stores",
        href: "https://www.yeti.com/mclean-store.html",
        links: [
          {
            label: "Calgary, AB",
            href: "https://www.yeti.com/calgary-store.html",
          },
        ],
      },
    ],
    localeLabel: null,
    locales: [],
  },
  {
    title: "Privacy & Compliance",
    links: [
      {
        label: "Privacy Policy",
        href: "https://www.yeti.com/privacy-policy.html",
      },
      {
        label: "Manage Cookies",
        href: "https://www.yeti.com/mclean-store.html#",
      },
      {
        label: "Terms & Conditions",
        href: "https://www.yeti.com/terms-conditions.html",
      },
      {
        label: "Your Privacy Choices",
        href: "https://privacyportal-uk.onetrust.com/webform/4f182994-8eb0-425e-8b18-28dabe88ca95/b836298d-c182-464c-b233-9e98f4c1f1f2",
      },
      {
        label: "Report a Vulnerability",
        href: "https://www.yeti.com/report-vulnerability.html",
      },
      {
        label: "Modern Slavery Statement",
        href: "https://www.yeti.com/on/demandware.static/-/Library-Sites-YetiSharedLibrary/default/dw495d4e58/YETI%20Modern%20Slavery%20Statement_062025.docx.pdf",
      },
      {
        label: "Supplier Code of Conduct",
        href: "https://www.yeti.com/on/demandware.static/-/Library-Sites-YetiSharedLibrary/default/dwa8c41aeb/YETI_Supplier_Code_of_Conduct.pdf",
      },
      {
        label: "Our Human Rights Policy",
        href: "https://www.yeti.com/on/demandware.static/-/Library-Sites-YetiSharedLibrary/default/pdfs/2024_Human_Rights_Policy.pdf",
      },
      {
        label: "Our Suppliers",
        href: "https://www.yeti.com/on/demandware.static/-/Library-Sites-YetiSharedLibrary/default/dwc632160e/Our-Suppliers-2025.pdf",
      },
      {
        label: "YETI RSL Program",
        href: "https://www.yeti.com/on/demandware.static/-/Library-Sites-YetiSharedLibrary/default/dw4b2428ed/YETI%20RSL%20PROGRAM%20-%20JUNE%202025.pdf",
      },
    ],
    subgroups: [],
    localeLabel: null,
    locales: [],
  },
];

const fontWeightOptions = [
  { label: "Thin", value: 100 },
  { label: "Extra Light", value: 200 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semi Bold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extra Bold", value: 800 },
  { label: "Black", value: 900 },
];

const textTransformOptions = [
  { label: "Normal", value: "normal" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

const createStyledTextField = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      text: YextEntityFieldSelector<any, TranslatableString>({
        label: "Text",
        filter: { types: ["type.string"] },
      }),
      fontSize: { label: "Font Size", type: "number" },
      fontColor: { label: "Font Color", type: "text" },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        options: fontWeightOptions,
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        options: textTransformOptions,
      },
    },
  }) as const;

const YetiFooterSectionFields: Fields<YetiFooterSectionProps> = {
  signupTitle: createStyledTextField("Signup Title"),
  signupCopy: createStyledTextField("Signup Copy"),
  copyright: createStyledTextField("Copyright"),
  socialLinks: {
    label: "Social Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      href: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Social Link",
      href: "#",
    },
    getItemSummary: (item: FooterLink) => item.label,
  } as any,
  columns: {
    label: "Columns",
    type: "array",
    arrayFields: {
      title: { label: "Title", type: "text" },
      links: {
        label: "Links",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
          href: { label: "Link", type: "text" },
        },
        defaultItemProps: {
          label: "Link",
          href: "#",
        },
        getItemSummary: (item: FooterLink) => item.label,
      },
      subgroups: {
        label: "Subgroups",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
          href: { label: "Link", type: "text" },
          links: {
            label: "Links",
            type: "array",
            arrayFields: {
              label: { label: "Label", type: "text" },
              href: { label: "Link", type: "text" },
            },
            defaultItemProps: {
              label: "Link",
              href: "#",
            },
            getItemSummary: (item: FooterLink) => item.label,
          },
        },
        defaultItemProps: {
          label: "Subgroup",
          href: "#",
          links: [],
        },
        getItemSummary: (item: FooterSubgroup) => item.label,
      },
      localeLabel: { label: "Locale Label", type: "text" },
      locales: {
        label: "Locales",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
          href: { label: "Link", type: "text" },
        },
        defaultItemProps: {
          label: "Locale",
          href: "#",
        },
        getItemSummary: (item: FooterLink) => item.label,
      },
    },
    defaultItemProps: {
      title: "Column",
      links: [],
      subgroups: [],
      localeLabel: null,
      locales: [],
    },
    getItemSummary: (item: FooterColumn) => item.title,
  } as any,
};

const linkStyle = {
  color: "inherit",
  textDecoration: "none",
};

const FooterActionLink = ({
  item,
  external,
}: {
  item: FooterLink;
  external?: boolean;
}) => (
  <Link
    cta={{
      link: item.href,
      linkType: "URL",
      label: item.label,
    }}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    style={linkStyle}
  >
    {item.label}
  </Link>
);

const socialGlyph = (label: string) => {
  switch (label) {
    case "Facebook":
      return "f";
    case "Instagram":
      return "◎";
    case "Youtube":
      return "▶";
    case "TikTok":
      return "♪";
    default:
      return label.slice(0, 1).toUpperCase();
  }
};

export const YetiFooterSectionComponent: PuckComponent<YetiFooterSectionProps> = (
  props,
) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "US Stores": false,
    "International Stores": false,
  });
  const signupTitle =
    resolveComponentData(props.signupTitle.text, locale, streamDocument) || "";
  const signupCopy =
    resolveComponentData(props.signupCopy.text, locale, streamDocument) || "";
  const copyright =
    resolveComponentData(props.copyright.text, locale, streamDocument) || "";

  return (
    <section className="bg-[#002b45] text-white">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        <div className="bg-[#0c405f] px-6 lg:px-0">
          <div className="py-6 lg:mx-auto lg:max-w-[360px]">
            <p
              className="mb-[5px] text-[32px]"
              style={{
                color: props.signupTitle.fontColor,
                fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                fontSize: `${props.signupTitle.fontSize}px`,
                fontWeight: props.signupTitle.fontWeight,
                lineHeight: "1",
                letterSpacing: "1.6px",
                textTransform: props.signupTitle.textTransform,
              }}
            >
              {signupTitle}
            </p>
            <p
              className="text-[14px]"
              style={{
                color: props.signupCopy.fontColor,
                fontFamily: "'urw-din', 'Oswald', sans-serif",
                fontSize: `${props.signupCopy.fontSize}px`,
                fontWeight: props.signupCopy.fontWeight,
                lineHeight: "1.5",
                letterSpacing: "0.08px",
                textTransform: props.signupCopy.textTransform,
              }}
            >
              {signupCopy}
            </p>
            <div className="mt-[26px] flex items-center border-b border-white pb-2">
              <p
                className="flex-1"
                style={{
                  color: "#ffffff",
                  fontFamily: "'urw-din', 'Oswald', sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Enter your email
              </p>
              <p style={{ fontSize: "20px" }}>›</p>
            </div>
            <p
              className="mt-[10px]"
              style={{
                color: "#ffffff",
                fontFamily: "'urw-din', 'Oswald', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "1.5",
              }}
            >
              By entering your email address you agree to receive marketing messages
              from YETI. You may unsubscribe at any time.
            </p>

            <div className="mt-10 flex gap-3">
              {props.socialLinks.map((item) => (
                <div
                  key={item.label}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white"
                  style={{
                    fontSize: "11px",
                    fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  <Link
                    cta={{
                      link: item.href,
                      linkType: "URL",
                      label: item.label,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {socialGlyph(item.label)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-[30px] lg:px-[60px] lg:py-[60px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
            {props.columns.map((column) => (
              <div key={column.title}>
                <p
                  className="mb-2"
                  style={{
                    color: "#ffffff",
                    fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                    fontSize: "18px",
                    fontWeight: 900,
                    lineHeight: "1",
                    letterSpacing: "0.7px",
                    textTransform: "uppercase",
                  }}
                >
                  {column.title}
                </p>

                {column.links.map((item) => (
                  <p
                    key={`${column.title}-${item.label}`}
                    style={{
                      color: "#ffffff",
                      fontFamily: "'urw-din', 'Oswald', sans-serif",
                      fontSize: "14px",
                      lineHeight: "2.43",
                    }}
                  >
                    <FooterActionLink
                      item={item}
                      external={item.href.startsWith("http") && !item.href.includes("yeti.com")}
                    />
                  </p>
                ))}

                {column.subgroups.map((group) => {
                  const isOpen = openGroups[group.label] ?? false;
                  return (
                    <div className="mt-[6px]" key={`${column.title}-${group.label}`}>
                      <div
                        className="flex cursor-pointer items-center justify-between"
                        onClick={() =>
                          setOpenGroups((current) => ({
                            ...current,
                            [group.label]: !isOpen,
                          }))
                        }
                      >
                        <p
                          style={{
                            color: "#ffffff",
                            fontFamily: "'urw-din', 'Oswald', sans-serif",
                            fontSize: "14px",
                            lineHeight: "2.43",
                          }}
                        >
                          {group.label}
                        </p>
                        <p style={{ fontSize: "12px" }}>{isOpen ? "▴" : "▾"}</p>
                      </div>
                      {isOpen && (
                        <div className="pb-2 pl-0">
                          {group.links.map((item) => (
                            <p
                              key={`${group.label}-${item.label}`}
                              style={{
                                color: "#ffffff",
                                fontFamily: "'urw-din', 'Oswald', sans-serif",
                                fontSize: "14px",
                                lineHeight: "2.1",
                              }}
                            >
                              <FooterActionLink item={item} />
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {column.localeLabel && (
                  <div className="mt-2">
                    <p
                      style={{
                        color: "#ffffff",
                        fontFamily: "'urw-din', 'Oswald', sans-serif",
                        fontSize: "14px",
                        lineHeight: "2.43",
                      }}
                    >
                      {column.localeLabel}
                    </p>
                    {column.locales.map((item) => (
                      <p
                        key={`${column.title}-${item.label}`}
                        style={{
                          color: "#ffffff",
                          fontFamily: "'urw-din', 'Oswald', sans-serif",
                          fontSize: "14px",
                          lineHeight: "2",
                        }}
                      >
                        <FooterActionLink item={item} />
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#002134] py-[5px] text-center">
        <p
          className="text-[12px]"
          style={{
            color: props.copyright.fontColor,
            fontFamily: "'urw-din', 'Oswald', sans-serif",
            fontSize: `${props.copyright.fontSize}px`,
            fontWeight: props.copyright.fontWeight,
            lineHeight: "1.5",
            letterSpacing: "0.07px",
            textTransform: props.copyright.textTransform,
          }}
        >
          {copyright}
        </p>
      </div>
    </section>
  );
};

export const YetiFooterSection: ComponentConfig<YetiFooterSectionProps> = {
  label: "Yeti Footer",
  fields: YetiFooterSectionFields,
  defaultProps: {
    signupTitle: {
      text: {
        field: "",
        constantValue: {
          en: "Sign Me Up",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      fontSize: 36,
      fontColor: "#ffffff",
      fontWeight: 900,
      textTransform: "uppercase",
    },
    signupCopy: {
      text: {
        field: "",
        constantValue: {
          en: "Be the first to know about new products, films, and events.",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      fontSize: 14,
      fontColor: "#ffffff",
      fontWeight: 400,
      textTransform: "normal",
    },
    copyright: {
      text: {
        field: "",
        constantValue: {
          en: "©2026 YETI COOLERS, LLC. ALL RIGHTS RESERVED",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      fontSize: 14,
      fontColor: "#ffffff",
      fontWeight: 400,
      textTransform: "uppercase",
    },
    socialLinks: defaultSocialLinks,
    columns: defaultColumns,
  },
  render: YetiFooterSectionComponent,
};
