import type { Config } from "@measured/puck";
import { HeroComponent as Hero, HeroProps } from "../components/Hero";
import { ColumnsComponent as Columns, ColumnsProps } from "../components/Columns";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CardComponent as Card, CardProps } from "../components/Card";
import { FAQComponent as FAQ, FAQProps } from "../components/FAQ";
import { BannerComponent as Banner, BannerProps } from "../components/Banner";
import {HoursCardComponent as HoursCard, HoursCardProps} from "../components/HoursCard";

type LocationProps = {
  Hero: HeroProps;
  Columns: ColumnsProps;
  Card: CardProps;
  FAQ: FAQProps;
  Banner: BannerProps;
  HoursCard: HoursCardProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Hero,
    Columns,
    Card,
    FAQ,
    Banner,
    HoursCard,
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
