import React from "react";
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

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type MenuItem = {
  name: string;
  tag: string;
  description: string;
  image: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
};

type MenuTab = {
  label: string;
  items: MenuItem[];
};

export type SweetgreenMenuSectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
  cta: {
    label: string;
    link: string;
  };
  tabs: MenuTab[];
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

const imageField = YextEntityFieldSelector<
  any,
  ImageType | ComplexImageType | TranslatableAssetImage
>({
  label: "Image",
  filter: {
    types: ["type.image"],
  },
});

const SweetgreenMenuSectionFields: Fields<SweetgreenMenuSectionProps> = {
  heading: styledTextFields("Heading"),
  description: styledTextFields("Description"),
  cta: {
    label: "Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  tabs: {
    label: "Tabs",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          name: { label: "Name", type: "text" },
          tag: { label: "Tag", type: "text" },
          description: { label: "Description", type: "textarea" },
          image: imageField,
        },
        defaultItemProps: {
          name: "Menu Item",
          tag: "",
          description: "Description",
          image: ({
            field: "",
            constantValue: { url: "" },
            constantValueEnabled: true,
          } as any),
        },
        getItemSummary: (item: MenuItem) => item.name,
      },
    },
    defaultItemProps: {
      label: "Tab",
      items: [],
    },
    getItemSummary: (item: MenuTab) => item.label,
  },
};

const SweetgreenMenuSectionComponent: PuckComponent<SweetgreenMenuSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const [activeTab, setActiveTab] = React.useState(0);
    const tab = props.tabs[activeTab] ?? props.tabs[0];
    const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const description =
      resolveComponentData(props.description.text, locale, streamDocument) || "";

    return (
      <section className="bg-[#e8e8e0] px-4 py-10 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[580px]">
              <h2
                style={{
                  fontSize: `${props.heading.fontSize}px`,
                  color: props.heading.fontColor,
                  fontWeight: props.heading.fontWeight,
                }}
                className="mb-2 font-['SweetSans','Open_Sans',sans-serif] leading-tight"
              >
                {heading}
              </h2>
              <p
                style={{
                  fontSize: `${props.description.fontSize}px`,
                  color: props.description.fontColor,
                  fontWeight: props.description.fontWeight,
                }}
                className="leading-6"
              >
                {description}
              </p>
            </div>
            <Link
              cta={{ link: props.cta.link, linkType: "URL" }}
              className="inline-flex rounded-full border border-[#00473c] px-6 py-4 font-semibold text-[#00473c]"
            >
              {props.cta.label}
            </Link>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto">
            {props.tabs.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  index === activeTab
                    ? "border-[#00473c] bg-[#00473c] text-[#f4f3e7]"
                    : "border-[#0e150e]/20 bg-transparent text-[#0e150e]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tab?.items.map((item) => {
              const image = resolveComponentData(item.image, locale, streamDocument);
              return (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                >
                  {image && (
                    <Image image={image} className="h-[220px] w-full object-cover" />
                  )}
                  <div className="p-5">
                    <h3 className="font-['SweetSans','Open_Sans',sans-serif] text-2xl font-bold text-[#0e150e]">
                      {item.name}
                    </h3>
                    {item.tag ? (
                      <p className="mt-2 inline-flex rounded-full bg-[#d8e5d6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#00473c]">
                        {item.tag}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-[#484d48]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

export const SweetgreenMenuSection: ComponentConfig<SweetgreenMenuSectionProps> =
  {
    label: "Sweetgreen Menu Section",
    fields: SweetgreenMenuSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "Healthy Salads, Bowls & Protein Plates",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 40,
        fontColor: "#0E150E",
        fontWeight: 700,
        textTransform: "normal",
      },
      description: {
        text: {
          field: "",
          constantValue: {
            en: "Explore our menu crafted with fresh, seasonal ingredients, where you can customize your dish or create your own unique meal!",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#484D48",
        fontWeight: 400,
        textTransform: "normal",
      },
      cta: {
        label: "View our full menu",
        link: "https://order.sweetgreen.com/rosslyn/menu",
      },
      tabs: [
        {
          label: "Popular",
          items: [
            {
              name: "Harvest Bowl",
              tag: "Warm bowl",
              description:
                "Shredded kale, wild rice, roasted sweet potatoes, roasted almonds, apples, goat cheese, roasted chicken, balsamic vinaigrette",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/2fzUiiiZaXmKS3W7Onhed/0a32387828a104e88e8a6e44db71d864/Product_2x.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
            {
              name: "Kale Caesar",
              tag: "Salad",
              description:
                "Chopped romaine, shredded kale, tomatoes, parmesan crisps, roasted chicken, shaved parmesan, caesar, lime squeeze",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/3Z9cz58oOFOHzVcJ36Ds4s/4f059ac20c3eaec7109a8ef28eb02170/Product_2x1.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
            {
              name: "Hot Honey Chicken",
              tag: "Protein plate",
              description:
                "Herbed quinoa, crispy onions, warm roasted sweet potatoes, herb roasted chicken, veg slaw, hot honey mustard sauce",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/1qxMkaZ1pIyESd1o14hhg5/22012efed3e5a8a35b02a7c443063a52/Product_2x11.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
          ],
        },
        {
          label: "Salads",
          items: [
            {
              name: "Super Green Goddess",
              tag: "Online only",
              description:
                "Organic shredded kale, organic baby spinach, roasted sweet potatoes, shredded cabbage, spicy broccoli, roasted almonds, chickpeas, raw carrots, green goddess ranch",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/3Cd7T1nDVBgY2eqyXJLhUU/e9b6243f508f6fb497e8ff2012e624d9/1221.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
            {
              name: "Garden Cobb",
              tag: "",
              description:
                "Chopped romaine, organic spring mix, roasted sweet potatoes, roasted almonds, tomatoes, avocado, hard boiled egg, blue cheese",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/3fVJ1uEll4N4Cey1juT6g4/99099177e3d69255b6ed605fc0ae7559/2222.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
            {
              name: "Kale Caesar",
              tag: "Salad",
              description:
                "Chopped romaine, shredded kale, tomatoes, parmesan crisps, roasted chicken, shaved parmesan, caesar, lime squeeze",
              image: ({
                field: "",
                constantValue: {
                  url: "https://images.ctfassets.net/eum7w7yri3zr/3Z9cz58oOFOHzVcJ36Ds4s/4f059ac20c3eaec7109a8ef28eb02170/Product_2x1.png?w=600&q=75",
                  width: 686,
                  height: 606,
                },
                constantValueEnabled: true,
              } as any),
            },
          ],
        },
      ],
    },
    render: SweetgreenMenuSectionComponent,
  };
