import { DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  Address,
  AddressProps,
  Banner,
  BannerProps,
  BodyText,
  BodyTextProps,
  Card,
  CardProps,
  CTAWrapper as CTA,
  CTAWrapperProps,
  Emails,
  EmailsProps,
  Flex,
  FlexProps,
  GetDirections,
  GetDirectionsProps,
  Grid,
  GridProps,
  HeadingText,
  HeadingTextProps,
  HoursTable,
  HoursTableProps,
  HoursStatus,
  HoursStatusProps,
  ImageWrapper,
  ImageWrapperProps,
  Phone,
  PhoneProps,
  TextList,
  TextListProps,
  Header,
  HeaderProps,
  Footer,
  FooterProps,
  Breadcrumbs,
  BreadcrumbsProps,
  Directory,
  DirectoryProps,
  Promo,
  PromoProps,
  MapboxStaticMap,
  MapboxStaticProps,
  Testimonials,
  TestimonialsProps,
  NearbyLocations,
  NearbyLocationsProps,
  ProductsSection,
  ProductsSectionProps,
  People,
  PeopleProps,
  FAQsSection,
  FAQsSectionProps,
  Events,
  EventsProps,
  HeroSectionProps,
  HeroSection,
  PhotoGallerySectionProps,
  PhotoGallerySection,
  CoreInfoSectionProps,
  CoreInfoSection,
  InsightsSection,
  InsightsSectionProps,
} from "@yext/visual-editor";

type MainProps = {
  Address: AddressProps;
  Banner: BannerProps;
  BodyText: BodyTextProps;
  Breadcrumbs: BreadcrumbsProps;
  Card: CardProps;
  CoreInfoSection: CoreInfoSectionProps;
  CTA: CTAWrapperProps;
  Emails: EmailsProps;
  Events: EventsProps;
  FAQsSection: FAQsSectionProps;
  Flex: FlexProps;
  Footer: FooterProps;
  GetDirections: GetDirectionsProps;
  Grid: GridProps;
  Header: HeaderProps;
  HeadingText: HeadingTextProps;
  HeroSection: HeroSectionProps;
  HoursTable: HoursTableProps;
  HoursStatus: HoursStatusProps;
  InsightsSection: InsightsSectionProps;
  ImageWrapper: ImageWrapperProps;
  NearbyLocations: NearbyLocationsProps;
  MapboxStaticMap: MapboxStaticProps;
  People: PeopleProps;
  Phone: PhoneProps;
  PhotoGallerySection: PhotoGallerySectionProps;
  ProductsSection: ProductsSectionProps;
  Promo: PromoProps;
  TextList: TextListProps;
  Testimonials: TestimonialsProps;
};

const components: Config<MainProps>["components"] = {
  Address,
  Banner,
  BodyText,
  Breadcrumbs,
  Card,
  CTA,
  CoreInfoSection,
  Emails,
  Events,
  FAQsSection,
  Flex,
  Footer,
  GetDirections,
  Grid,
  Header,
  HeadingText,
  HeroSection,
  HoursStatus,
  HoursTable,
  ImageWrapper,
  InsightsSection,
  MapboxStaticMap,
  NearbyLocations,
  People,
  Phone,
  PhotoGallerySection,
  ProductsSection,
  Promo,
  Testimonials,
  TextList,  
};

const pageSections: (keyof MainProps)[] = [
  "Banner",
  "Breadcrumbs",
  "Card",
  "CoreInfoSection",
  "Events",
  "FAQsSection",
  "HeroSection",
  "InsightsSection",
  "PhotoGallerySection",
  "ProductsSection",
  "Promo",
  "People",
  "Testimonials",
];

const layoutBlocks: (keyof MainProps)[] = ["Flex", "Grid"];

const contentBlocks: (keyof MainProps)[] = [
  "Address",
  "BodyText",
  "CTA",
  "Emails",
  "GetDirections",
  "HeadingText",
  "HoursStatus",
  "HoursTable",
  "ImageWrapper",
  "MapboxStaticMap",
  "Phone",
  "TextList",
];

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components,
  categories: {
    pageSections: {
      title: "Page Sections",
      components: pageSections,
    },
    layoutBlocks: {
      title: "Layout Blocks",
      components: layoutBlocks,
    },
    contentBlocks: {
      title: "Content Blocks",
      components: contentBlocks,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          disallow={contentBlocks}
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

type DirectoryConfigProps = {
  Breadcrumbs: BreadcrumbsProps;
  Directory: DirectoryProps;
  Footer: FooterProps;
  Header: HeaderProps;
};

export const directoryConfig: Config<DirectoryConfigProps> = {
  components: {
    Breadcrumbs,
    Directory,
    Footer,
    Header,
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["main", mainConfig],
  ["directory", directoryConfig],
]);
