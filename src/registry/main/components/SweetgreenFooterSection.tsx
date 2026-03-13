import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  Image,
  TranslatableAssetImage,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { ComplexImageType, ImageType, Link } from "@yext/pages-components";

type FooterLink = {
  label: string;
  link: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SweetgreenFooterSectionProps = {
  appImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  appLinks: FooterLink[];
  columns: FooterColumn[];
};

const imageField = YextEntityFieldSelector<
  any,
  ImageType | ComplexImageType | TranslatableAssetImage
>({
  label: "App Image",
  filter: {
    types: ["type.image"],
  },
});

const SweetgreenFooterSectionFields: Fields<SweetgreenFooterSectionProps> = {
  appImage: imageField,
  appLinks: {
    label: "App Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Link",
      link: "#",
    },
    getItemSummary: (item: FooterLink) => item.label,
  },
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
          link: { label: "Link", type: "text" },
        },
        defaultItemProps: {
          label: "Link",
          link: "#",
        },
        getItemSummary: (item: FooterLink) => item.label,
      },
    },
    defaultItemProps: {
      title: "Column",
      links: [],
    },
    getItemSummary: (item: FooterColumn) => item.title,
  },
};

const SweetgreenFooterSectionComponent: PuckComponent<SweetgreenFooterSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const appImage = resolveComponentData(props.appImage, locale, streamDocument);

    return (
      <footer className="bg-[#d8e5d6] text-[#0e150e]">
        <div className="border-y border-[#0e150e]/10 px-4 py-8 md:px-8">
          <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2">
            <div className="rounded-[24px] bg-white/70 p-6">
              <h2 className="font-['SweetSans','Open_Sans',sans-serif] text-[32px] font-bold">
                Join Our Newsletter
              </h2>
              <p className="mt-3 text-[#484d48]">
                Sign up for exclusive promos, new menu drops, store openings, and more.
              </p>
              <div className="mt-5 flex rounded-full border border-[#0e150e]/10 bg-white p-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-transparent px-4 outline-none"
                />
                <button
                  type="button"
                  className="h-12 w-12 rounded-full bg-[#00473c] text-xl text-[#f4f3e7]"
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid items-center gap-6 rounded-[24px] bg-white/70 p-6 md:grid-cols-[1fr_180px]">
              <div>
                <h2 className="font-['SweetSans','Open_Sans',sans-serif] text-[32px] font-bold">
                  Download the app
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {props.appLinks.map((item) => (
                    <Link
                      key={item.label}
                      cta={{ link: item.link, linkType: "URL" }}
                      className="font-semibold underline underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              {appImage && (
                <Image image={appImage} className="h-[180px] w-full object-contain" />
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-10 md:px-8 md:py-12">
          <div className="mx-auto grid max-w-[1280px] gap-8 sm:grid-cols-2 xl:flex xl:gap-10">
            {props.columns.map((column) => (
              <div key={column.title} className="max-w-[220px]">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em]">
                  {column.title}
                </h2>
                <div className="space-y-3">
                  {column.links.map((item) => (
                    <Link
                      key={`${column.title}-${item.label}`}
                      cta={{ link: item.link, linkType: "URL" }}
                      className="block text-[#0e150e] underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  };

export const SweetgreenFooterSection: ComponentConfig<SweetgreenFooterSectionProps> =
  {
    label: "Sweetgreen Footer Section",
    fields: SweetgreenFooterSectionFields,
    defaultProps: {
      appImage: {
        field: "",
        constantValue: {
          url: "https://images.ctfassets.net/eum7w7yri3zr/QeC14rNAsPTRIuV4EAafd/f6d5c7574ff3f26a87f23d4f9d1c0b8f/PickUp1.png?w=600&q=75",
          width: 1605,
          height: 1596,
        },
        constantValueEnabled: true,
      } as any,
      appLinks: [
        { label: "iOS", link: "https://apps.apple.com/us/app/sweetgreen-rewards/id594329490" },
        { label: "Android", link: "https://play.google.com/store/apps/details?id=com.sweetgreen.android.app&hl=en" },
      ],
      columns: [
        {
          title: "About Us",
          links: [
            { label: "Careers", link: "https://careers.sweetgreen.com/" },
            { label: "Investor Relations", link: "https://investor.sweetgreen.com/overview/default.aspx" },
            { label: "Locations", link: "https://www.sweetgreen.com/locations" },
            { label: "Press", link: "/press" },
            { label: "sweetgreen app", link: "https://apps.apple.com/us/app/sweetgreen-rewards/id594329490" },
            { label: "The Hex Bowl", link: "/hex" },
          ],
        },
        {
          title: "Social Media",
          links: [
            { label: "Instagram", link: "https://www.instagram.com/sweetgreen/" },
            { label: "Twitter", link: "https://twitter.com/sweetgreen" },
            { label: "TikTok", link: "https://www.tiktok.com/@sweetgreen" },
            { label: "Spotify", link: "https://open.spotify.com/user/1224421164" },
            { label: "Facebook", link: "http://facebook.com/sweetgreen" },
          ],
        },
        {
          title: "Support + Services",
          links: [
            { label: "Nutrition + Allergens Guide", link: "https://drive.google.com/file/d/1AQyfAeWWqiZmTIiOHpWMgHi7-sAprnl1/view" },
            { label: "Contact us", link: "https://sierra.chat/agent/KJs113MBlIwai-wBlIwa-e2MUgqOpYOuqqQlOrg0KNw/chat" },
            { label: "Gift Cards", link: "https://order.sweetgreen.com/gift" },
            { label: "Store", link: "https://shop.sweetgreen.com/" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", link: "/privacy-policy" },
            { label: "Terms of Use", link: "/terms" },
            { label: "Your Privacy Choices", link: "privacy-preference-center" },
            { label: "California Notice at Collection", link: "https://www.sweetgreen.com/privacy-policy#additional-information-for-california-residents" },
            { label: "Accessibility Statement", link: "https://www.sweetgreen.com/accessibility-statement" },
            { label: "Consumer Health Data Notice", link: "/consumer-health-data-notice" },
          ],
        },
      ],
    },
    render: SweetgreenFooterSectionComponent,
  };
