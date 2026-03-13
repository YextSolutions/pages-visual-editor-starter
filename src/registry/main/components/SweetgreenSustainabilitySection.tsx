import {
  ComponentConfig,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
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

type IconCard = {
  title: string;
  description: string;
  icon: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
};

type Highlight = {
  title: string;
  description: string;
};

export type SweetgreenSustainabilitySectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
  cards: IconCard[];
  cta: {
    label: string;
    link: string;
  };
  orderHeading: StyledTextProps;
  orderDescription: StyledTextProps;
  orderChannels: Highlight[];
  bannerImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  bannerHeading: StyledTextProps;
  bannerDescription: StyledTextProps;
  bannerCta: {
    label: string;
    link: string;
  };
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

const SweetgreenSustainabilitySectionFields: Fields<SweetgreenSustainabilitySectionProps> =
  {
    heading: styledTextFields("Heading"),
    description: styledTextFields("Description"),
    cards: {
      label: "Cards",
      type: "array",
      arrayFields: {
        title: { label: "Title", type: "text" },
        description: { label: "Description", type: "textarea" },
        icon: imageField,
      },
      defaultItemProps: {
        title: "Title",
        description: "Description",
        icon: ({
          field: "",
          constantValue: { url: "" },
          constantValueEnabled: true,
        } as any),
      },
      getItemSummary: (item: IconCard) => item.title,
    },
    cta: {
      label: "Call To Action",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
    orderHeading: styledTextFields("Order Heading"),
    orderDescription: styledTextFields("Order Description"),
    orderChannels: {
      label: "Order Channels",
      type: "array",
      arrayFields: {
        title: { label: "Title", type: "text" },
        description: { label: "Description", type: "textarea" },
      },
      defaultItemProps: {
        title: "Title",
        description: "Description",
      },
      getItemSummary: (item: Highlight) => item.title,
    },
    bannerImage: imageField,
    bannerHeading: styledTextFields("Banner Heading"),
    bannerDescription: styledTextFields("Banner Description"),
    bannerCta: {
      label: "Banner Call To Action",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
  };

const resolveText = (
  value: StyledTextProps,
  locale: string,
  streamDocument: Record<string, unknown>,
) => resolveComponentData(value.text, locale, streamDocument) || "";

const SweetgreenSustainabilitySectionComponent: PuckComponent<SweetgreenSustainabilitySectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const bannerImage = resolveComponentData(
      props.bannerImage,
      locale,
      streamDocument,
    );

    return (
      <section className="bg-[#d8e5d6] px-4 py-10 text-center md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <h2
            style={{
              fontSize: `${props.heading.fontSize}px`,
              color: props.heading.fontColor,
              fontWeight: props.heading.fontWeight,
            }}
            className="font-['SweetSans','Open_Sans',sans-serif] leading-tight"
          >
            {resolveText(props.heading, locale, streamDocument)}
          </h2>
          <p
            style={{
              fontSize: `${props.description.fontSize}px`,
              color: props.description.fontColor,
              fontWeight: props.description.fontWeight,
            }}
            className="mx-auto mt-3 max-w-[760px] leading-6"
          >
            {resolveText(props.description, locale, streamDocument)}
          </p>
          <div className="my-8 grid gap-6 md:grid-cols-4">
            {props.cards.map((card) => {
              const icon = resolveComponentData(card.icon, locale, streamDocument);
              return (
                <div key={card.title} className="flex flex-col items-center rounded-3xl bg-white/60 p-6">
                  {icon && (
                    <Image image={icon} className="mb-3 h-12 w-12 object-contain" />
                  )}
                  <h3 className="font-semibold text-[#0e150e]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#484d48]">{card.description}</p>
                </div>
              );
            })}
          </div>
          <Link
            cta={{ link: props.cta.link, linkType: "URL" }}
            className="inline-flex rounded-full border border-[#00473c] px-6 py-4 font-semibold text-[#00473c]"
          >
            {props.cta.label}
          </Link>

          <div className="pt-12">
            <h2
              style={{
                fontSize: `${props.orderHeading.fontSize}px`,
                color: props.orderHeading.fontColor,
                fontWeight: props.orderHeading.fontWeight,
              }}
              className="font-['SweetSans','Open_Sans',sans-serif] leading-tight"
            >
              {resolveText(props.orderHeading, locale, streamDocument)}
            </h2>
            <p
              style={{
                fontSize: `${props.orderDescription.fontSize}px`,
                color: props.orderDescription.fontColor,
                fontWeight: props.orderDescription.fontWeight,
              }}
              className="mx-auto mt-3 max-w-[720px] leading-6"
            >
              {resolveText(props.orderDescription, locale, streamDocument)}
            </p>
            <div className="mt-8 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {props.orderChannels.map((item) => (
                <div key={item.title} className="rounded-3xl bg-white/50 p-6">
                  <h3 className="font-semibold text-[#0e150e]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#484d48]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[24px] bg-[#00473c] text-left text-white">
            <div className="relative">
              {bannerImage && (
                <Image image={bannerImage} className="h-[320px] w-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(184deg,rgba(0,0,0,0.35),rgba(0,0,0,0))]" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10">
                <h2
                  style={{
                    fontSize: `${props.bannerHeading.fontSize}px`,
                    color: props.bannerHeading.fontColor,
                    fontWeight: props.bannerHeading.fontWeight,
                  }}
                  className="max-w-[480px] font-['SweetSans','Open_Sans',sans-serif] leading-tight"
                >
                  {resolveText(props.bannerHeading, locale, streamDocument)}
                </h2>
                <p
                  style={{
                    fontSize: `${props.bannerDescription.fontSize}px`,
                    color: props.bannerDescription.fontColor,
                    fontWeight: props.bannerDescription.fontWeight,
                  }}
                  className="mt-3 max-w-[480px] leading-6"
                >
                  {resolveText(props.bannerDescription, locale, streamDocument)}
                </p>
                <Link
                  cta={{ link: props.bannerCta.link, linkType: "URL" }}
                  className="mt-6 inline-flex w-fit rounded-full bg-white px-6 py-4 font-semibold text-[#00473c]"
                >
                  {props.bannerCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export const SweetgreenSustainabilitySection: ComponentConfig<SweetgreenSustainabilitySectionProps> =
  {
    label: "Sweetgreen Sustainability Section",
    fields: SweetgreenSustainabilitySectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: { en: "Sustainability at Sweetgreen", hasLocalizedValue: "true" },
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
          constantValue: { en: "Thoughtful sourcing, compostable packaging, and lower-impact delivery are core to how we serve Rosslyn.", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#484D48",
        fontWeight: 400,
        textTransform: "normal",
      },
      cards: [
        {
          title: "Local Sourcing",
          description: "We partner with local farms to bring you the freshest ingredients while supporting our community",
          icon: ({ field: "", constantValue: { url: "https://images.ctfassets.net/eum7w7yri3zr/2U1642Smhl8ZBoBvg0BVHQ/32ad9da248ea54e4d474b9e16b2a387d/leaf.png" }, constantValueEnabled: true } as any),
        },
        {
          title: "Compostable Packaging",
          description: "All our bowls, utensils, and packaging are made from compostable materials",
          icon: ({ field: "", constantValue: { url: "https://images.ctfassets.net/eum7w7yri3zr/2RZSAdDrtmJ6tLmxZolHJb/1c0712b31a4567fea1a212ee206ccb0c/Icon_2x-3.png" }, constantValueEnabled: true } as any),
        },
        {
          title: "Carbon Neutral Delivery",
          description: "We offset delivery emissions and prioritize sustainable transportation options",
          icon: ({ field: "", constantValue: { url: "https://images.ctfassets.net/eum7w7yri3zr/2LRoruHe7WAR0yGouAR2UW/04e02cbf59db9be09e4ed16dab073b05/truck.png" }, constantValueEnabled: true } as any),
        },
        {
          title: "Regenerative Agriculture",
          description: "Supporting farming practices that restore soil health and biodiversity",
          icon: ({ field: "", constantValue: { url: "https://images.ctfassets.net/eum7w7yri3zr/6C5cyj4wVanZN993GElL2P/7a1f9abc0a675b242aad43220020c9f2/heart.png" }, constantValueEnabled: true } as any),
        },
      ],
      cta: {
        label: "Learn about Sweetgreen sustainability",
        link: "/mission/#sustainability",
      },
      orderHeading: {
        text: {
          field: "",
          constantValue: { en: "Order delivery or pickup in Rosslyn", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 40,
        fontColor: "#0E150E",
        fontWeight: 700,
        textTransform: "normal",
      },
      orderDescription: {
        text: {
          field: "",
          constantValue: { en: "Order ahead for pickup, get it delivered, or dine in with us.", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#484D48",
        fontWeight: 400,
        textTransform: "normal",
      },
      orderChannels: [
        { title: "Pickup", description: "Order ahead and skip the line" },
        { title: "Delivery", description: "Fresh food delivered to you" },
        { title: "Dine-in", description: "Enjoy your meal in our space" },
        { title: "Catering", description: "Perfect for meetings and events" },
      ],
      bannerImage: {
        field: "",
        constantValue: {
          url: "https://images.ctfassets.net/eum7w7yri3zr/EQSc0aKag9Mata2mxF5zs/e2d62326119e1ea5984ef4015fa2b2df/2.jpg?w=2000&q=75",
        },
        constantValueEnabled: true,
      } as any,
      bannerHeading: {
        text: {
          field: "",
          constantValue: { en: "Sweetgreen Catering for offices & events", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 32,
        fontColor: "#FFFFFF",
        fontWeight: 700,
        textTransform: "normal",
      },
      bannerDescription: {
        text: {
          field: "",
          constantValue: { en: "Bring healthy, fresh meals to your next office meeting or special event. Perfect for groups of all sizes.", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 16,
        fontColor: "#FFFFFF",
        fontWeight: 400,
        textTransform: "normal",
      },
      bannerCta: {
        label: "Order Catering",
        link: "https://www.ezcater.com/brand/pvt/sweetgreen-catering?shownav=1",
      },
    },
    render: SweetgreenSustainabilitySectionComponent,
  };
