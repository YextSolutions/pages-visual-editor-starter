import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";
import { AdvisorHero, AdvisorHeroProps } from "../components/AdvisorHero";
import { AdvisorBio, AdvisorBioProps } from "../components/AdvisorBio";
import {
  ContentCarouselProps,
  ContentCarousel,
} from "../components/ContentCarousel";
import { ContentGrid, ContentGridProps } from "../components/ContentGrid";
import { FeaturedBlogs, FeaturedBlogsProps } from "../components/FeaturedBlogs";
import { Locator, LocatorProps } from "../components/Locator";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

type ProductProps = {
  Toggle: ToggleProps;
};

type FinancialProfessionalProps = {
  Toggle: ToggleProps;
  AdvisorHero: AdvisorHeroProps;
  AdvisorBio: AdvisorBioProps;
  ContentCarousel: ContentCarouselProps;
  ContentGrid: ContentGridProps;
  FeaturedBlogs: FeaturedBlogsProps;
  Locator: LocatorProps;
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
    AdvisorHero,
    AdvisorBio,
    ContentCarousel,
    ContentGrid,
    FeaturedBlogs,
    Locator,
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
