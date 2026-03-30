import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Link } from "@yext/pages-components";
import { useDocument } from "@yext/visual-editor";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BORDER = "#d5d5d5";
const BROWN = "#3e342f";
const OFF_WHITE = "#fbf7f4";

type LinkItem = {
  label: string;
  link: string;
};

type SocialItem = {
  label: string;
  link: string;
  icon: "twitter" | "facebook" | "pinterest" | "instagram" | "youtube";
};

export type DunkinFooterSectionProps = {
  quickLinks: LinkItem[];
  policyLinks: LinkItem[];
  socialLinks: SocialItem[];
  copyrightText: string;
};

const renderSocialIcon = (icon: SocialItem["icon"]) => {
  switch (icon) {
    case "facebook":
      return <FaFacebookF />;
    case "pinterest":
      return <FaPinterestP />;
    case "instagram":
      return <FaInstagram />;
    case "youtube":
      return <FaYoutube />;
    default:
      return <FaXTwitter />;
  }
};

export const DunkinFooterSectionFields: Fields<DunkinFooterSectionProps> = {
  quickLinks: {
    label: "Quick Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Link",
      link: "#",
    },
    getItemSummary: (item: LinkItem) => item.label,
  },
  policyLinks: {
    label: "Policy Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Policy",
      link: "#",
    },
    getItemSummary: (item: LinkItem) => item.label,
  },
  socialLinks: {
    label: "Social Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
      icon: {
        label: "Icon",
        type: "select",
        options: [
          { label: "Twitter", value: "twitter" },
          { label: "Facebook", value: "facebook" },
          { label: "Pinterest", value: "pinterest" },
          { label: "Instagram", value: "instagram" },
          { label: "YouTube", value: "youtube" },
        ],
      },
    },
    defaultItemProps: {
      label: "Social",
      link: "#",
      icon: "twitter",
    },
    getItemSummary: (item: SocialItem) => item.label,
  },
  copyrightText: { label: "Copyright Text", type: "text" },
};

export const DunkinFooterSectionComponent: PuckComponent<
  DunkinFooterSectionProps
> = (props) => {
  useDocument();

  return (
    <footer
      className="px-4 py-8 md:px-8 md:py-10"
      style={{ backgroundColor: OFF_WHITE }}
    >
      <div className="mx-auto flex max-w-[1170px] flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-[2]">
          <p
            style={{
              color: BROWN,
              fontFamily: SECONDARY_FONT,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Quick Links
          </p>
          <div className="mt-5 grid max-w-[520px] grid-cols-2 gap-4 md:grid-cols-4">
            {props.quickLinks.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  color: BROWN,
                  fontFamily: SECONDARY_FONT,
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p
            style={{
              color: BROWN,
              fontFamily: SECONDARY_FONT,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Follow Us
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {props.socialLinks.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: item.icon === "instagram" ? "999px" : "0px",
                  background: item.icon === "instagram" ? BROWN : "transparent",
                  color: item.icon === "instagram" ? "#ffffff" : BROWN,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: item.icon === "facebook" ? "20px" : "18px",
                  textDecoration: "none",
                }}
              >
                {renderSocialIcon(item.icon)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        className="mx-auto mt-8 flex max-w-[1170px] flex-col items-center gap-4 md:mt-10 md:border-t md:pt-6"
        style={{ borderColor: BORDER }}
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {props.policyLinks.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              cta={{ link: item.link, label: item.label, linkType: "URL" }}
              style={{
                color: BROWN,
                fontFamily: SECONDARY_FONT,
                fontSize: "11px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p
          style={{
            color: BROWN,
            fontFamily: SECONDARY_FONT,
            fontSize: "11px",
            letterSpacing: "0.08em",
          }}
        >
          {props.copyrightText}
        </p>
      </div>
    </footer>
  );
};

export const DunkinFooterSection: ComponentConfig<DunkinFooterSectionProps> = {
  label: "Dunkin Footer",
  fields: DunkinFooterSectionFields,
  defaultProps: {
    quickLinks: [
      { label: "Press Room", link: "https://news.dunkindonuts.com/" },
      {
        label: "Mobile App",
        link: "https://www.dunkindonuts.com/en/dd-cards/mobile-app",
      },
      { label: "Corporate", link: "https://www.dunkinbrands.com/" },
      {
        label: "Sustainability",
        link: "https://www.dunkindonuts.com/en/sustainability",
      },
      {
        label: "About Us",
        link: "https://www.dunkindonuts.com/en/about/about-us",
      },
      {
        label: "Franchising",
        link: "http://www.dunkinfranchising.com/franchisee/en.html",
      },
      {
        label: "Contact Us",
        link: "https://www.dunkindonuts.com/en/about/contact-us/faqs",
      },
      { label: "Site Map", link: "https://www.dunkindonuts.com/en/site-map" },
    ],
    policyLinks: [
      {
        label: "Terms of Use",
        link: "https://www.dunkindonuts.com/en/terms-of-use",
      },
      {
        label: "Privacy Policy",
        link: "https://www.dunkindonuts.com/en/privacy-policy",
      },
      {
        label: "Do Not Sell My Personal Info",
        link: "https://www.dunkindonuts.com/en/do-not-sell",
      },
      {
        label: "CA Privacy",
        link: "https://www.dunkindonuts.com/en/consumer-rights",
      },
      {
        label: "Your Ad Choice",
        link: "https://www.dunkindonuts.com/en/privacy-policy#choices",
      },
      {
        label: "CA Transparency in Supply Chains Act",
        link: "https://www.dunkindonuts.com/en/ca-transparency-in-supply-chain",
      },
      {
        label: "Web Accessibility",
        link: "https://www.dunkindonuts.com/en/web-accessibility",
      },
    ],
    socialLinks: [
      {
        label: "Twitter",
        link: "https://twitter.com/dunkindonuts?lang=en",
        icon: "twitter",
      },
      {
        label: "Facebook",
        link: "https://www.facebook.com/DunkinUS/",
        icon: "facebook",
      },
      {
        label: "Pinterest",
        link: "https://www.pinterest.com/DunkinDonuts/",
        icon: "pinterest",
      },
      {
        label: "Instagram",
        link: "https://www.instagram.com/dunkin/?hl=en",
        icon: "instagram",
      },
      {
        label: "YouTube",
        link: "https://www.youtube.com/user/dunkindonuts#",
        icon: "youtube",
      },
    ],
    copyrightText: "© 2026 DD IP Holder LLC",
  },
  render: DunkinFooterSectionComponent,
};
