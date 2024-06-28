import type { Config } from "@measured/puck";
import { HeroComponent as Hero, HeroProps } from "../components/Hero";
import { ColumnsComponent as Columns, ColumnsProps } from "../components/Columns";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CardComponent as Card, CardProps } from "../components/Card";
import { BannerComponent as Banner, BannerProps } from "../components/Banner";

type LocationProps = {
  Hero: HeroProps;
  Columns: ColumnsProps;
  Card: CardProps;
  Banner: BannerProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Hero,
    Columns,
    Card,
    Banner,
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
