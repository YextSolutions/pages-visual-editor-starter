import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

type ProductProps = {
  Toggle: ToggleProps;
};

type FinancialProfessionalProps = {
  Toggle: ToggleProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Toggle,
    Hero,
  },
  root: {
    fields: {},
  },
};

// All the available components for products
export const productConfig: Config<ProductProps> = {
  components: {
    Toggle,
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
]);
