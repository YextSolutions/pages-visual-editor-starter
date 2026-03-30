import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  Image,
  TranslatableAssetImage,
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { ComplexImageType, ImageType, Link } from "@yext/pages-components";
import * as React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BROWN = "#3e342f";
const PINK = "#c63663";
const BORDER = "#d5d5d5";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type LinkItem = {
  label: string;
  link: string;
};

export type DunkinHeaderSectionProps = {
  logoImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  desktopLinks: LinkItem[];
  mobileLinks: LinkItem[];
  signUpCta: LinkItem;
  signInCta: LinkItem;
  announcementText: StyledTextProps;
  announcementLink: LinkItem;
};

const createStyledTextFields = (label: string) =>
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
        options: [
          { label: "Thin", value: 100 },
          { label: "Extra Light", value: 200 },
          { label: "Light", value: 300 },
          { label: "Regular", value: 400 },
          { label: "Medium", value: 500 },
          { label: "Semi Bold", value: 600 },
          { label: "Bold", value: 700 },
          { label: "Extra Bold", value: 800 },
          { label: "Black", value: 900 },
        ],
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Uppercase", value: "uppercase" },
          { label: "Lowercase", value: "lowercase" },
          { label: "Capitalize", value: "capitalize" },
        ],
      },
    },
  }) as const;

const navArrayFields = {
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
} as const;

const buttonLinkStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  fontFamily: PRIMARY_FONT,
  fontSize: "11px",
  fontWeight: 800,
  lineHeight: "11px",
  minHeight: "28px",
  padding: "0 15px",
  textTransform: "uppercase" as const,
  textDecoration: "none",
};

const createTextDefault = (
  value: string,
  fontSize: number,
  fontColor: string,
  fontWeight: StyledTextProps["fontWeight"],
  textTransform: StyledTextProps["textTransform"],
): StyledTextProps => ({
  text: {
    field: "",
    constantValue: {
      en: value,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  fontSize,
  fontColor,
  fontWeight,
  textTransform,
});

const resolveText = (
  value: StyledTextProps,
  locale: string,
  streamDocument: Record<string, unknown>,
) => resolveComponentData(value.text, locale, streamDocument) || "";

const textStyles = (value: StyledTextProps) => ({
  fontSize: `${value.fontSize}px`,
  color: value.fontColor,
  fontWeight: value.fontWeight,
  textTransform: value.textTransform,
});

export const DunkinHeaderSectionFields: Fields<DunkinHeaderSectionProps> = {
  logoImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Logo Image",
    filter: { types: ["type.image"] },
  }),
  desktopLinks: {
    label: "Desktop Links",
    ...navArrayFields,
  },
  mobileLinks: {
    label: "Mobile Links",
    ...navArrayFields,
  },
  signUpCta: {
    label: "Sign Up Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  signInCta: {
    label: "Sign In Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  announcementText: createStyledTextFields("Announcement Text"),
  announcementLink: {
    label: "Announcement Link",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
};

export const DunkinHeaderSectionComponent: PuckComponent<
  DunkinHeaderSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const resolvedLogo = resolveComponentData(
    props.logoImage,
    locale,
    streamDocument,
  );
  const announcementText = resolveText(
    props.announcementText,
    locale,
    streamDocument,
  );

  return (
    <header className="border-b bg-white" style={{ borderColor: BORDER }}>
      <div className="px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="hidden items-center gap-8 lg:flex">
            {props.desktopLinks.slice(0, 3).map((item) => (
              <Link
                key={`desktop-left-${item.label}`}
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  color: BROWN,
                  fontFamily: PRIMARY_FONT,
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            cta={{
              link: "https://www.dunkindonuts.com/en",
              label: "Dunkin Home",
              linkType: "URL",
            }}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <div className="w-[118px] lg:w-[154px]">
              {resolvedLogo ? <Image image={resolvedLogo} /> : null}
            </div>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {props.desktopLinks.slice(3).map((item) => (
              <Link
                key={`desktop-right-${item.label}`}
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  color: BROWN,
                  fontFamily: PRIMARY_FONT,
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              cta={{
                link: props.signUpCta.link,
                label: props.signUpCta.label,
                linkType: "URL",
              }}
              style={{
                ...buttonLinkStyles,
                background: "#ffffff",
                border: `1px solid ${BROWN}`,
                color: BROWN,
              }}
            >
              {props.signUpCta.label}
            </Link>
            <Link
              cta={{
                link: props.signInCta.link,
                label: props.signInCta.label,
                linkType: "URL",
              }}
              style={{
                ...buttonLinkStyles,
                background: PINK,
                border: `1px solid ${PINK}`,
                color: "#ffffff",
              }}
            >
              {props.signInCta.label}
            </Link>
          </div>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center text-[22px] lg:hidden"
            style={{ color: BROWN }}
            onClick={() => setMobileOpen((current) => !current)}
            type="button"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {mobileOpen ? (
          <div
            className="mt-4 block border-t pt-4 lg:hidden"
            style={{ borderColor: BORDER }}
          >
            <div className="flex flex-col gap-4">
              {props.mobileLinks.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  cta={{ link: item.link, label: item.label, linkType: "URL" }}
                  style={{
                    color: BROWN,
                    fontFamily: PRIMARY_FONT,
                    fontSize: "14px",
                    fontWeight: 800,
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link
                  cta={{
                    link: props.signUpCta.link,
                    label: props.signUpCta.label,
                    linkType: "URL",
                  }}
                  style={{
                    ...buttonLinkStyles,
                    background: "#ffffff",
                    border: `1px solid ${BROWN}`,
                    color: BROWN,
                  }}
                >
                  {props.signUpCta.label}
                </Link>
                <Link
                  cta={{
                    link: props.signInCta.link,
                    label: props.signInCta.label,
                    linkType: "URL",
                  }}
                  style={{
                    ...buttonLinkStyles,
                    background: PINK,
                    border: `1px solid ${PINK}`,
                    color: "#ffffff",
                  }}
                >
                  {props.signInCta.label}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="flex min-h-[31px] flex-wrap items-center justify-center gap-1 px-4 py-2 text-center text-white"
        style={{ background: PINK }}
      >
        <span
          style={{
            fontFamily: SECONDARY_FONT,
            ...textStyles(props.announcementText),
          }}
        >
          {announcementText}
        </span>
        <Link
          cta={{
            link: props.announcementLink.link,
            label: props.announcementLink.label,
            linkType: "URL",
          }}
          style={{
            color: "#ffffff",
            fontFamily: SECONDARY_FONT,
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          {props.announcementLink.label}
        </Link>
      </div>
    </header>
  );
};

export const DunkinHeaderSection: ComponentConfig<DunkinHeaderSectionProps> = {
  label: "Dunkin Header",
  fields: DunkinHeaderSectionFields,
  defaultProps: {
    logoImage: {
      field: "",
      constantValue: {
        url: "https://a.mktgcdn.com/p/AFzJiaugPerH1sBtPat7cIwU1QCYLZGMl2D1N8tjeJY/310x60.png",
        width: 310,
        height: 60,
      },
      constantValueEnabled: true,
    },
    desktopLinks: [
      { label: "Menu", link: "https://www.dunkindonuts.com/en/menu" },
      { label: "Locations", link: "https://www.dunkindonuts.com/en/locations" },
      {
        label: "Delivery",
        link: "https://www.dunkindonuts.com/en/dunkin-delivers",
      },
      {
        label: "Dunkin' Rewards",
        link: "https://www.dunkindonuts.com/en/dd-perks",
      },
      {
        label: "Dunkin' Card",
        link: "https://www.dunkindonuts.com/en/dd-cards",
      },
      { label: "Shop", link: "https://www.dunkinathome.com/" },
    ],
    mobileLinks: [
      { label: "Menu", link: "https://www.dunkindonuts.com/en/menu" },
      {
        label: "Delivery",
        link: "https://www.dunkindonuts.com/en/dunkin-delivers",
      },
      {
        label: "Dunkin' Rewards",
        link: "https://www.dunkindonuts.com/en/dd-perks",
      },
    ],
    signUpCta: {
      label: "Sign Up",
      link: "https://www.dunkindonuts.com/en/dd-perks/registration",
    },
    signInCta: {
      label: "Sign In",
      link: "https://www.dunkindonuts.com/en/sign-in",
    },
    announcementText: createTextDefault(
      "Come run with us! Apply to join our exceptional team",
      12,
      "#ffffff",
      400,
      "normal",
    ),
    announcementLink: {
      label: "here.",
      link: "https://careers.dunkindonuts.com/us/en",
    },
  },
  render: DunkinHeaderSectionComponent,
};
