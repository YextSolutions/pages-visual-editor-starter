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
import Root from "./root";
import { BodyContainer, BodyContainerProps } from "../components/BodyContainer";
import { ContactForm, ContactFormProps } from "../components/ContactForm";
import { Columns, ColumnsProps } from "../components/Columns";
import { InfoCard, InfoCardProps } from "../components/cards/InfoCard";

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
  BodyContainer: BodyContainerProps;
  ContactForm: ContactFormProps;
  Columns: ColumnsProps;
  InfoCard: InfoCardProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Toggle,
    Hero,
  },
  root: {
    render: Root,
  },
};

// All the available components for products
export const productConfig: Config<ProductProps> = {
  components: {
    Toggle,
  },
  root: {
    render: Root,
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
    BodyContainer,
    ContactForm,
    Columns,
    InfoCard,
  },
  root: {
    render: Root,
  },
};

export const puckConfigs = new Map<string, Config>([
  ["location", locationConfig],
  ["product", productConfig],
  ["financialProfessional", financialProfessionalConfig],
]);
