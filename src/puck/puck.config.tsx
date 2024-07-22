import type { Config, Content } from "@measured/puck";
import { Hero, HeroProps } from "../components/Hero";
import { Bio, BioProps } from "../components/Bio";
import { TeamGrid, TeamGridProps } from "../components/TeamGrid";
import { FeaturedBlogs, FeaturedBlogsProps } from "../components/FeaturedBlogs";
import { Locator, LocatorProps } from "../components/Locator";
import Root from "./root";
import { BodyContainer, BodyContainerProps } from "../components/BodyContainer";
import { ContactForm, ContactFormProps } from "../components/ContactForm";
import { InfoCard, InfoCardProps } from "../components/cards/InfoCard";
import { ServicesProps, Services } from "../components/Services";
import { Divider, DividerProps } from "../components/VerticalDivider";
import {
  FeaturedEventsProps,
  FeaturedEvents,
} from "../components/FeaturedEvents";
import { ColumnsProps, ColumnsComponent } from "../components/Columns";
import { PromoProps, PromoComponent } from "../components/Promo";
import { ContentBlockProps, ContentBlock } from "../components/ContentBlock";

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
  // Services: ServicesProps;
  Divider: DividerProps;
  FeaturedEvents: FeaturedEventsProps;
};

type PageProps = {
  Hero: HeroProps;
  Bio: BioProps;
  TeamGrid: TeamGridProps;
  FeaturedBlogs: FeaturedBlogsProps;
  Locator: LocatorProps;
  BodyContainer: BodyContainerProps;
  ContactForm: ContactFormProps;
  Columns: ColumnsProps;
  InfoCard: InfoCardProps;
  // Services: ServicesProps;
  Divider: DividerProps;
  FeaturedEvents: FeaturedEventsProps;
  Promo: PromoProps;
  ContentBlock: ContentBlockProps;
};

// All the available components for locations
// export const branchConfig: Config<BranchProps> = {
//   components: {
//     Hero,
//     Bio,
//     TeamGrid,
//     FeaturedBlogs,
//     Locator,
//     BodyContainer,
//     ContactForm,
//     Columns,
//     InfoCard,
//     Services,
//     Divider,
//     FeaturedEvents,
//     NearbyLocations,
//     LocationCore,
//   },
//   categories: {
//     layouts: {
//       components: ["Columns", "BodyContainer", "InfoCard"],
//     },
//     core: {
//       components: [
//         "Hero",
//         "Bio",
//         "TeamGrid",
//         "FeaturedBlogs",
//         "Services",
//         "FeaturedEvents",
//         "NearbyLocations",
//         "LocationCore",
//       ],
//     },
//     forms: {
//       components: ["ContactForm"],
//     },
//     other: {
//       components: ["Locator"],
//     },
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
    TeamGrid,
    FeaturedBlogs,
    Locator,
    BodyContainer,
    ContactForm,
    Columns: ColumnsComponent,
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
        // "Services",
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

export const pageConfig: Config<PageProps> = {
  components: {
    Hero,
    Bio,
    TeamGrid,
    FeaturedBlogs,
    Locator,
    BodyContainer,
    ContactForm,
    Columns: ColumnsComponent,
    InfoCard,
    Services,
    Divider,
    FeaturedEvents,
    Promo: PromoComponent,
    ContentBlock,
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
        // "Services",
        "FeaturedEvents",
      ],
    },
    forms: {
      components: ["ContactForm"],
    },
    other: {
      components: ["Locator", "Promo", "ContentBlock"],
    },
  },
  root: {
    render: Root,
  },
};

export const puckConfigs = new Map<string, Config>([
  ["financialProfessional", financialProfessionalConfig],
  ["page", pageConfig],
]);
