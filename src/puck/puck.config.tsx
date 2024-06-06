import type { Config } from "@measured/puck";
import { Hero, HeroProps } from "../components/Hero";
import { Bio, BioProps } from "../components/Bio";
import { TeamGrid, TeamGridProps } from "../components/TeamGrid";
import { FeaturedBlogs, FeaturedBlogsProps } from "../components/FeaturedBlogs";
import { Locator, LocatorProps } from "../components/Locator";
import Root from "./root";
import { BodyContainer, BodyContainerProps } from "../components/BodyContainer";
import { ContactForm, ContactFormProps } from "../components/ContactForm";
import { Columns, ColumnsProps } from "../components/Columns";
import { InfoCard, InfoCardProps } from "../components/cards/InfoCard";
import { ServicesProps, Services } from "../components/Services";
import { Divider, DividerProps } from "../components/VerticalDivider";
import {
  FeaturedEventsProps,
  FeaturedEvents,
} from "../components/FeaturedEvents";

type BranchProps = {
  Hero: HeroProps;
  Bio: BioProps;
  TeamGrid: TeamGridProps;
  FeaturedBlogs: FeaturedBlogsProps;
  Locator: LocatorProps;
  BodyContainer: BodyContainerProps;
  ContactForm: ContactFormProps;
  Columns: ColumnsProps;
  InfoCard: InfoCardProps;
  Services: ServicesProps;
  Divider: DividerProps;
  FeaturedEvents: FeaturedEventsProps;
};

// type ProductProps = {
//   Toggle: ToggleProps;
//   Hero: HeroProps;
// };

type FinancialProfessionalProps = {
  Hero: HeroProps;
  Bio: BioProps;
  TeamGrid: TeamGridProps;
  FeaturedBlogs: FeaturedBlogsProps;
  Locator: LocatorProps;
  BodyContainer: BodyContainerProps;
  ContactForm: ContactFormProps;
  Columns: ColumnsProps;
  InfoCard: InfoCardProps;
  Services: ServicesProps;
  Divider: DividerProps;
  FeaturedEvents: FeaturedEventsProps;
};

// All the available components for locations
export const branchConfig: Config<BranchProps> = {
  components: {
    Hero,
    Bio,
    TeamGrid,
    FeaturedBlogs,
    Locator,
    BodyContainer,
    ContactForm,
    Columns,
    InfoCard,
    Services,
    Divider,
    FeaturedEvents,
  },
  categories: {
    layouts: {
      components: ["Columns", "BodyContainer", "InfoCard"],
    },
    core: {
      components: [
        "Hero",
        "Bio",
        "TeamGrid",
        "FeaturedBlogs",
        "Services",
        "FeaturedEvents",
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
    Hero,
    Bio,
    TeamGrid: TeamGrid,
    FeaturedBlogs,
    Locator,
    BodyContainer,
    ContactForm,
    Columns,
    InfoCard,
    Services,
    Divider,
    FeaturedEvents,
  },
  categories: {
    layouts: {
      components: ["Columns", "BodyContainer", "InfoCard", "Divider"],
    },
    core: {
      components: [
        "Hero",
        "Bio",
        "TeamGrid",
        "FeaturedBlogs",
        "Services",
        "FeaturedEvents",
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
