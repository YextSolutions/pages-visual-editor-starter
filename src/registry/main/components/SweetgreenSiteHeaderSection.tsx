import React from "react";
import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Link } from "@yext/pages-components";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type NavItem = {
  label: string;
  link: string;
};

export type SweetgreenSiteHeaderSectionProps = {
  leftLinks: NavItem[];
  rightLinks: NavItem[];
  mobileLinks: NavItem[];
  mobileSubLinks: NavItem[];
  orderLabel: StyledTextProps;
};

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
] as const;

const styledTextFields = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      text: YextEntityFieldSelector<any, TranslatableString>({
        label: "Text",
        filter: {
          types: ["type.string"],
        },
      }),
      fontSize: { label: "Font Size", type: "number" },
      fontColor: { label: "Font Color", type: "text" },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        options: [...fontWeightOptions],
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
  }) satisfies Fields<{ value: StyledTextProps }>["value"];

const navArrayField = (label: string) =>
  ({
    label,
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Link",
      link: "#",
    },
    getItemSummary: (item: NavItem) => item.label,
  }) satisfies Fields<{ value: NavItem[] }>["value"];

const SweetgreenSiteHeaderSectionFields: Fields<SweetgreenSiteHeaderSectionProps> =
  {
    leftLinks: navArrayField("Left Links"),
    rightLinks: navArrayField("Right Links"),
    mobileLinks: navArrayField("Mobile Links"),
    mobileSubLinks: navArrayField("Mobile Sub Links"),
    orderLabel: styledTextFields("Order Label"),
  };

const NavLink = ({ item, className }: { item: NavItem; className?: string }) => (
  <Link
    cta={{ link: item.link, linkType: "URL" }}
    className={className}
  >
    {item.label}
  </Link>
);

const SweetgreenSiteHeaderSectionComponent: PuckComponent<SweetgreenSiteHeaderSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const orderText =
      resolveComponentData(props.orderLabel.text, locale, streamDocument) || "";
    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
      <header className="sticky top-0 z-40 border-b border-[#dfe5db] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 text-[#0e150e] md:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e150e]/10 xl:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label="Toggle main navigation"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-[#0e150e]" />
              <span className="block h-0.5 w-5 bg-[#0e150e]" />
            </span>
          </button>
          <nav className="hidden min-w-0 flex-1 justify-start gap-4 xl:flex">
            {props.leftLinks.map((item) => (
              <NavLink
                key={`${item.label}-${item.link}`}
                item={item}
                className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#0e150e] underline-offset-4 hover:underline"
              />
            ))}
          </nav>
          <Link
            cta={{ link: "https://www.sweetgreen.com", linkType: "URL" }}
            className="px-4 text-center font-['SweetSans','Open_Sans',sans-serif] text-[32px] font-bold leading-none tracking-[-0.04em] text-[#0e150e]"
          >
            sweetgreen
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-end gap-4 xl:flex">
            {props.rightLinks.slice(0, 3).map((item) => (
              <NavLink
                key={`${item.label}-${item.link}`}
                item={item}
                className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#0e150e] underline-offset-4 hover:underline"
              />
            ))}
            <Link
              cta={{ link: props.rightLinks[3]?.link ?? "#", linkType: "URL" }}
              className="rounded-full bg-[#00473c] px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#e6ff55]"
            >
              <span
                style={{
                  fontSize: `${props.orderLabel.fontSize}px`,
                  color: props.orderLabel.fontColor,
                  fontWeight: props.orderLabel.fontWeight,
                }}
              >
                {orderText}
              </span>
            </Link>
          </nav>
        </div>
        {mobileOpen && (
          <div className="border-t border-[#dfe5db] bg-[#0e150e] px-4 py-6 text-[#f4f3e7] xl:hidden">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex flex-col gap-4">
                {props.mobileLinks.map((item) => (
                  <NavLink
                    key={`${item.label}-${item.link}`}
                    item={item}
                    className="text-lg font-medium"
                  />
                ))}
              </div>
              <div className="mt-6 border-t border-[#f4f3e7]/20 pt-4">
                {props.mobileSubLinks.map((item) => (
                  <NavLink
                    key={`${item.label}-${item.link}`}
                    item={item}
                    className="text-sm uppercase tracking-[0.14em]"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  };

export const SweetgreenSiteHeaderSection: ComponentConfig<SweetgreenSiteHeaderSectionProps> =
  {
    label: "Sweetgreen Site Header Section",
    fields: SweetgreenSiteHeaderSectionFields,
    defaultProps: {
      leftLinks: [
        { label: "Our Menu", link: "/menu" },
        { label: "Our Mission", link: "/mission" },
        { label: "The Market", link: "http://shop.sweetgreen.com" },
      ],
      rightLinks: [
        { label: "Outpost", link: "https://outpost.sweetgreen.com" },
        { label: "Catering", link: "/catering" },
        { label: "Locations", link: "/locations" },
        { label: "Order", link: "https://order.sweetgreen.com" },
      ],
      mobileLinks: [
        { label: "Our Menu", link: "/menu" },
        { label: "Our Mission", link: "/mission" },
        { label: "The Market", link: "http://shop.sweetgreen.com" },
        { label: "Outpost", link: "http://outpost.sweetgreen.com" },
        { label: "Catering", link: "/catering" },
        { label: "Locations", link: "/locations" },
      ],
      mobileSubLinks: [
        {
          label: "Download the app",
          link: "https://itunes.apple.com/us/app/sweetgreen-rewards/id594329490?mt=8",
        },
      ],
      orderLabel: {
        text: {
          field: "",
          constantValue: {
            en: "Order",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 13,
        fontColor: "#E6FF55",
        fontWeight: 700,
        textTransform: "uppercase",
      },
    },
    render: SweetgreenSiteHeaderSectionComponent,
  };
