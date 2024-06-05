import type { Config } from "@measured/puck";
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
import { Divider, DividerProps } from "../components/VerticalDivider";

type BranchProps = {
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
  Divider: DividerProps;
};

// type ProductProps = {
//   Toggle: ToggleProps;
//   Hero: HeroProps;
// };

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
  Divider: DividerProps;
};

// All the available components for locations
export const branchConfig: Config<BranchProps> = {
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
    Divider: Divider,
  },
  categories: {
    layouts: {
      components: ["Columns", "BodyContainer", "InfoCard", "Divider"],
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

// All the available components for products
// export const productConfig: Config<ProductProps> = {
//   components: {
//     Toggle,
//     Hero,
//   },
//   root: {
//     render: Root,
//   },
// };

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
    Divider,
  },
  categories: {
    layouts: {
      components: ["Columns", "BodyContainer", "InfoCard", "Divider"],
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
  ["ce_branch", branchConfig],
  // ["product", productConfig],
  ["financialProfessional", financialProfessionalConfig],
]);
