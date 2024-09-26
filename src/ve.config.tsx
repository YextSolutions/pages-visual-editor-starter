import type { Config } from "@measured/puck";
import { HeroComponent as Hero, HeroProps } from "./components/Hero";
import {
  ColumnsComponent as Columns,
  ColumnsProps,
} from "./components/Columns";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CardComponent as Card, CardProps } from "./components/Card";
import {
  StoreInfoCardComponent as StoreInfoCard,
  StoreInfoCardProps,
} from "./components/StoreInfoCard";
import { FAQComponent as FAQ, FAQProps } from "./components/FAQ";
import {
  DeliveryPromoComponent as DeliveryPromo,
  DeliveryPromoProps,
} from "./components/DeliveryPromo";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import {
  HoursCardComponent as HoursCard,
  HoursCardProps,
} from "./components/HoursCard";
import { PromoComponent as Promo, PromoProps } from "./components/Promo";
import {
  FeaturedItemsComponent as FeaturedItems,
  FeaturedItemsProps,
} from "./components/FeaturedItems";
import {
  HeadingTextComponent as HeadingText,
  HeadingTextProps,
} from "./components/text/HeadingText";
import "@yext/visual-editor/style.css";
import { SectionWrapperComponent as Section } from "./components/layout/Section";
import {
  ContainerComponent as Container,
  ContainerProps,
} from "./components/layout/Container";
import { ImageProps, ImageComponent as Image } from "./components/image/Image";

type LocationProps = {
  // Layout
  Columns: ColumnsProps;
  Container: ContainerProps;

  // Text
  HeadingText: HeadingTextProps;

  // Image
  Image: ImageProps;

  // Content
  Hero: HeroProps;
  Card: CardProps;
  FAQ: FAQProps;
  DeliveryPromo: DeliveryPromoProps;
  Banner: BannerProps;
  HoursCard: HoursCardProps;
  StoreInfoCard: StoreInfoCardProps;
  Promo: PromoProps;
  FeaturedItems: FeaturedItemsProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  categories: {
    layout: {
      title: "Layout",
      components: ["Columns", "Container"],
    },
    text: {
      title: "Text",
      components: ["HeadingText"],
    },
    image: {
      title: "Image",
      components: ["Image"],
    },
    content: {
      title: "Content",
      components: [
        "Hero",
        "Card",
        "FAQ",
        "DeliveryPromo",
        "Banner",
        "HoursCard",
        "StoreInfoCard",
        "Promo",
        "FeaturedItems",
      ],
    },
  },
  components: {
    Hero,
    Columns,
    Card,
    FAQ,
    DeliveryPromo,
    Banner,
    HoursCard,
    StoreInfoCard,
    Promo,
    FeaturedItems,
    HeadingText,
    Section,
    Container,
    Image,
  },
  root: {
    render: ({ children, puck: { isEditing } }) => {
      return (
        <>
          <Header isEditing={isEditing} />
          {children}
          <Footer isEditing={isEditing} />
        </>
      );
    },
    fields: {},
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
