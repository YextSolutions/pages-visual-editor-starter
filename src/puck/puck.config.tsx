import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from '../components/Hero';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LocationCore } from "../components/LocationCore";
import { LocationHero } from "../components/LocationHero";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
  LocationHero: any;
  LocationCore: any;
};

type ProductProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

type FinancialProfessionalProps = {
  Toggle: ToggleProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Toggle,
    Hero,
    LocationHero,
    LocationCore,
  },
  root: {
    render: ({ children }) => {
      return (
      <>
        <Header/>
          {children}
        <Footer/>
      </>
      );
    },
    fields: {},
  },
};

// All the available components for products
export const productConfig: Config<ProductProps> = {
  components: {
    Toggle,
    Hero,
  },
  root: {
    fields: {},
  },
};

// All the available components for financial professionals
export const financialProfessionalConfig: Config<FinancialProfessionalProps> = {
  components: {
    Toggle,
  },
  root: {
    fields: {},
  },
};

export const puckConfigs = new Map<string, Config>([
  ["location", locationConfig],
  ["product", productConfig],
  ["financialProfessional", financialProfessionalConfig],
  ["teamPage", financialProfessionalConfig],
  ["advisorPage", financialProfessionalConfig],
  ["showroom", locationConfig]
]);
