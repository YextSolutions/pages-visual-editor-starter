import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
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

type ExploreCard = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

export type YetiExploreStoreSectionProps = {
  heading: StyledTextProps;
  cards: ExploreCard[];
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

const YetiExploreStoreSectionFields: Fields<YetiExploreStoreSectionProps> = {
  heading: createStyledTextField("Heading"),
  cards: {
    label: "Cards",
    type: "array",
    arrayFields: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "text" },
      imageUrl: { label: "Image Url", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      title: "Card",
      description: "Description",
      imageUrl: "",
      link: "#",
    },
    getItemSummary: (item: ExploreCard) => item.title,
  } as any,
};

export const YetiExploreStoreSectionComponent: PuckComponent<
  YetiExploreStoreSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";

  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto max-w-[1540px] px-6 md:px-[34px]">
        <p
          className="text-[28px] leading-none tracking-[1.4px] md:tracking-[1.6px]"
          style={{
            color: props.heading.fontColor,
            fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
            fontSize: `${props.heading.fontSize}px`,
            fontWeight: props.heading.fontWeight,
            textTransform: props.heading.textTransform,
          }}
        >
          {heading}
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-[18px]">
          {props.cards.map((card) => (
            <div
              key={`${card.title}-${card.link}`}
              className="relative h-[410px] min-w-[260px] flex-[0_0_23.8%] overflow-hidden rounded-[2px] bg-[#1f2125] md:h-[445px] md:min-w-[23.8%]"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.08) 100%), url(${card.imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-[54px] pr-[35px]">
                {card.link ? (
                  <Link
                    cta={{ link: card.link, linkType: "URL", label: card.title }}
                    target={card.link.startsWith("http") ? "_blank" : undefined}
                    rel={card.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ textDecoration: "none", color: "#ffffff" }}
                  >
                    <p
                      style={{
                        color: "#ffffff",
                        fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                        fontSize: "28px",
                        fontWeight: 900,
                        lineHeight: "1",
                        letterSpacing: "1.3px",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.title}
                    </p>
                    <p
                      className="mt-[10px]"
                      style={{
                        color: "#ffffff",
                        fontFamily: "'urw-din', 'Oswald', sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {card.description}
                    </p>
                  </Link>
                ) : (
                  <>
                    <p
                      style={{
                        color: "#ffffff",
                        fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                        fontSize: "28px",
                        fontWeight: 900,
                        lineHeight: "1",
                        letterSpacing: "1.3px",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.title}
                    </p>
                    <p
                      className="mt-[10px]"
                      style={{
                        color: "#ffffff",
                        fontFamily: "'urw-din', 'Oswald', sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {card.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3" style={{ color: "#002b45" }}>
          <div className="h-[2px] w-[95px] bg-[#002b45]" />
          <p style={{ fontSize: "13px", fontFamily: "'urw-din', 'Oswald', sans-serif" }}>
            1 / 3
          </p>
          <p style={{ fontSize: "18px" }}>‹</p>
          <p style={{ fontSize: "18px" }}>›</p>
        </div>
      </div>
    </section>
  );
};

export const YetiExploreStoreSection: ComponentConfig<YetiExploreStoreSectionProps> =
  {
    label: "Yeti Explore Store",
    fields: YetiExploreStoreSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "Explore Our Store",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 32,
        fontColor: "#002b45",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      cards: [
        {
          title: "Gift Wrapping",
          description:
            "We’ll make sure your purchase is gift ready with complimentary wrapping paper and a YETI gift tag.",
          imageUrl:
            "https://yeti-webmedia.imgix.net/m/14c68cf7b51b5c21/original/230107_PLP_TV_Lifestyle_GiftWrap_Desktop-2x.jpg?auto=format,compress&h=750",
          link: "",
        },
        {
          title: "Visit Our Garage",
          description: "Personalize your Tundra® Cooler only in stores.",
          imageUrl:
            "https://yeti-webmedia.imgix.net/m/f7e93674cdfe9c6/original/230107_HP_TV_Product_1-4_Spotlight_Studio_GG_Desktop-2x.jpg?auto=format,compress&h=750",
          link: "",
        },
        {
          title: "Get Rewarded for Recycling",
          description:
            "Receive $5 off your $25+ purchase for old, damaged, or unwanted Rambler® products only in store. See more.",
          imageUrl:
            "https://yeti-webmedia.imgix.net/m/2d483e0edf43662d/original/230107_PLP_TV_Lifestyle_Recycle_Desktop-2x.jpg?auto=format,compress&h=750",
          link: "https://www.yeti.com/rambler-buy-back.html",
        },
        {
          title: "Events",
          description:
            "Looking for some local action? Check out our upcoming events, including live music and book tours. See more.",
          imageUrl:
            "https://yeti-webmedia.imgix.net/m/5f18bc18f671f952/original/230107_PLP_TV_Lifestyle_Live_Events_Desktop-2x.jpg?auto=format,compress&h=750",
          link: "https://www.facebook.com/Yeti/events",
        },
      ],
    },
    render: YetiExploreStoreSectionComponent,
  };
