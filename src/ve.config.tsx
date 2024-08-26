import type { Config } from "@measured/puck";
import { HeroComponent as Hero, HeroProps } from "./components/Hero";
import { ColumnsComponent as Columns, ColumnsProps } from "./components/Columns";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CardComponent as Card, CardProps } from "./components/Card";
import { StoreInfoCardComponent as StoreInfoCard, StoreInfoCardProps } from "./components/StoreInfoCard";
import { FAQComponent as FAQ, FAQProps } from "./components/FAQ";
import {DeliveryPromoComponent as DeliveryPromo, DeliveryPromoProps} from "./components/DeliveryPromo";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import {HoursCardComponent as HoursCard, HoursCardProps} from "./components/HoursCard";
import {PromoComponent as Promo, PromoProps} from "./components/Promo";
import {FeaturedItemsComponent as FeaturedItems, FeaturedItemsProps} from "./components/FeaturedItems";

import "@yext/visual-editor/style.css"

type LocationProps = {
  Hero: HeroProps;
  Columns: ColumnsProps;
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
  },
  root: {
    render: ({ children }) => {
      return (
        <>
          <Header />
          {children}
          <Footer />
        </>
      );
    },
    fields: {},
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
