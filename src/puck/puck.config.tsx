import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";
import { Color, ColorProps } from "../components/Color";
import { AdvisorHero, AdvisorHeroProps } from "../components/AdvisorHero";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
  Color: ColorProps;
};

type ProductProps = {
  Toggle: ToggleProps;
  Color: ColorProps;
};

type FinancialProfessionalProps = {
  Toggle: ToggleProps;
  Color: ColorProps;
  AdvisorHero: AdvisorHeroProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Toggle,
    Hero,
    Color,
  },
  root: {
    fields: {},
  },
};

// All the available components for products
export const productConfig: Config<ProductProps> = {
  components: {
    Toggle,
    Color,
  },
  root: {
    fields: {},
  },
};

// All the available components for financial professionals
export const financialProfessionalConfig: Config<FinancialProfessionalProps> = {
  components: {
    Toggle,
    Color,
    AdvisorHero,
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
