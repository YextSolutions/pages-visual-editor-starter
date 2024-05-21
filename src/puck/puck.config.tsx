import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";
import { AdvisorHero, AdvisorHeroProps } from "../components/AdvisorHero";
import { AdvisorBio, AdvisorBioProps } from "../components/AdvisorBio";
import { ContentGrid, ContentGridProps } from "../components/ContentGrid";
import { FeaturedBlogs, FeaturedBlogsProps } from "../components/FeaturedBlogs";
import { Locator, LocatorProps } from "../components/Locator";
import Root from "./root";
import { BodyContainer, BodyContainerProps } from "../components/BodyContainer";
import { ContactForm, ContactFormProps } from "../components/ContactForm";
import { Columns, ColumnsProps } from "../components/Columns";
import { InfoCard, InfoCardProps } from "../components/cards/InfoCard";
import { ServicesProps, Services } from "../components/Services";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

type ProductProps = {
  Toggle: ToggleProps;
};

type FinancialProfessionalProps = {
  AdvisorHero: AdvisorHeroProps;
  AdvisorBio: AdvisorBioProps;
  ContentGrid: ContentGridProps;
  FeaturedBlogs: FeaturedBlogsProps;
  Locator: LocatorProps;
  BodyContainer: BodyContainerProps;
  ContactForm: ContactFormProps;
  Columns: ColumnsProps;
  InfoCard: InfoCardProps;
  Services: ServicesProps;
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
    AdvisorHero,
    AdvisorBio,
    ContentGrid,
    FeaturedBlogs,
    Locator,
    BodyContainer,
    ContactForm,
    Columns,
    InfoCard,
    Services,
  },
  categories: {
    layouts: {
      components: ["Columns", "BodyContainer", "InfoCard"],
    },
    core: {
      components: [
        "AdvisorHero",
        "AdvisorBio",
        "ContentGrid",
        "FeaturedBlogs",
        "Services",
      ],
    },
    forms: {
      components: ["ContactForm"],
    },
    other: {
      components: ["Locator"],
    },
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
