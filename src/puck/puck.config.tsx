import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";
import { Color, ColorProps } from "../components/Color";
import { AdvisorHero, AdvisorHeroProps } from "../components/AdvisorHero";
import { Callout, CalloutProps } from "../components/Callout";
import { Highlights, HighlightsProps } from "../components/Highlights";
import { AdvisorBio, AdvisorBioProps } from "../components/AdvisorBio";
import {
  ContentCarouselProps,
  ContentCarousel,
} from "../components/ContentCarousel";

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
  Callout: CalloutProps;
  Highlights: HighlightsProps;
  AdvisorBio: AdvisorBioProps;
  ContentCarousel: ContentCarouselProps;
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
    Callout,
    Highlights,
    AdvisorBio,
    ContentCarousel,
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
