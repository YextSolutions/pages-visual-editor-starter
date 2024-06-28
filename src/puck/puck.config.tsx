import type { Config } from "@measured/puck";
import { HeroComponent as Hero, HeroProps } from "../components/Hero";
import { ColumnsComponent as Columns, ColumnsProps } from "../components/Columns";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CardComponent as Card, CardProps } from "../components/Card";
import {DeliveryPromoComponent as DeliveryPromo, DeliveryPromoProps} from "../components/DeliveryPromo";
import {PromoComponent as Promo, PromoProps} from "../components/Promo";

type LocationProps = {
  Hero: HeroProps;
  Columns: ColumnsProps;
  Card: CardProps;
  DeliveryPromo: DeliveryPromoProps;
  Promo: PromoProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Hero,
    Columns,
    Card,
    DeliveryPromo,
    Promo
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

export const puckConfigs = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
