import type { Config } from "@measured/puck";
import { Hero, HeroProps } from "../components/Hero";
import { ColumnsComponent as Columns, ColumnsProps } from "../components/Columns";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type LocationProps = {
  Hero: HeroProps;
  Columns: ColumnsProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Hero,
    Columns
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

export const puckConfigs = new Map<string, Config>([
  ["location", locationConfig],
]);
