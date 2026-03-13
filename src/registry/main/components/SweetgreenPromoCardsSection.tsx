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

type PromoCard = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaLink: string;
  image: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
};

export type SweetgreenPromoCardsSectionProps = {
  cards: PromoCard[];
};

const imageField = YextEntityFieldSelector<
  any,
  ImageType | ComplexImageType | TranslatableAssetImage
>({
  label: "Image",
  filter: {
    types: ["type.image"],
  },
});

const SweetgreenPromoCardsSectionFields: Fields<SweetgreenPromoCardsSectionProps> =
  {
    cards: {
      label: "Cards",
      type: "array",
      arrayFields: {
        eyebrow: { label: "Eyebrow", type: "text" },
        title: { label: "Title", type: "text" },
        description: { label: "Description", type: "textarea" },
        ctaLabel: { label: "Call To Action Label", type: "text" },
        ctaLink: { label: "Call To Action Link", type: "text" },
        image: imageField,
      },
      defaultItemProps: {
        eyebrow: "Eyebrow",
        title: "Title",
        description: "Description",
        ctaLabel: "Learn more",
        ctaLink: "#",
        image: ({
          field: "",
          constantValue: { url: "" },
          constantValueEnabled: true,
        } as any),
      },
      getItemSummary: (item: PromoCard) => item.title,
    },
  };

const SweetgreenPromoCardsSectionComponent: PuckComponent<SweetgreenPromoCardsSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";

    return (
      <section className="bg-[#d8e5d6] px-4 py-10 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2">
          {props.cards.map((card) => {
            const image = resolveComponentData(card.image, locale, streamDocument);
            return (
              <div
                key={card.title}
                className="overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                {image && (
                  <Image image={image} className="h-[260px] w-full object-cover" />
                )}
                <div className="p-6">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#00473c]">
                    {card.eyebrow}
                  </p>
                  <h2 className="font-['SweetSans','Open_Sans',sans-serif] text-[32px] font-bold leading-tight text-[#0e150e]">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-[#484d48]">{card.description}</p>
                  <Link
                    cta={{ link: card.ctaLink, linkType: "URL" }}
                    className="mt-5 inline-flex rounded-full border border-[#00473c] px-5 py-3 font-semibold text-[#00473c]"
                  >
                    {card.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

export const SweetgreenPromoCardsSection: ComponentConfig<SweetgreenPromoCardsSectionProps> =
  {
    label: "Sweetgreen Promo Cards Section",
    fields: SweetgreenPromoCardsSectionFields,
    defaultProps: {
      cards: [
        {
          eyebrow: "Order your greens ahead and earn points",
          title: "Sweetgreen app",
          description:
            "Earn rewards, save your favorites, skip the line with mobile ordering, and get your food even faster.",
          ctaLabel: "Download the SG app",
          ctaLink: "https://order.sweetgreen.com",
          image: ({
            field: "",
            constantValue: {
              url: "https://images.ctfassets.net/eum7w7yri3zr/3zDaRJYVrBHrAc772QhQrB/4a3a549439f7ec09d2d30aed155404ec/Upsell.png?w=1200&q=75",
            },
            constantValueEnabled: true,
          } as any),
        },
        {
          eyebrow: "Love free stuff?",
          title: "SG Rewards",
          description:
            "Earn 10 points for every eligible $1 you spend. Redeem your points for rewards at checkout.",
          ctaLabel: "Sign up and save",
          ctaLink: "https://order.sweetgreen.com/",
          image: ({
            field: "",
            constantValue: {
              url: "https://images.ctfassets.net/eum7w7yri3zr/6d79XrHQ0f7Z6wr8ucpSrr/77962aef265943424af3f9a84f5b9d17/Upsell__1_.png?w=1200&q=75",
            },
            constantValueEnabled: true,
          } as any),
        },
      ],
    },
    render: SweetgreenPromoCardsSectionComponent,
  };
