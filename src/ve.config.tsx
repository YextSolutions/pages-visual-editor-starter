import { type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  Address,
  AddressProps,
  Banner,
  BannerProps,
  Breadcrumbs,
  BreadcrumbsProps,
  BodyText,
  BodyTextProps,
  Card,
  CardProps,
  CTAWrapper as CTA,
  CTAWrapperProps,
  Directory,
  DirectoryProps,
  Emails,
  EmailsProps,
  Flex,
  FlexProps,
  Footer,
  FooterProps,
  GetDirections,
  GetDirectionsProps,
  Grid,
  GridProps,
  Header,
  HeaderProps,
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
  Promo,
  PromoProps,
  TextList,
  TextListProps,
} from "@yext/visual-editor";

type MainProps = {
  Address: AddressProps;
  Banner: BannerProps;
  BodyText: BodyTextProps;
  Breadcrumbs: BreadcrumbsProps;
  Card: CardProps;
  CTA: CTAWrapperProps;
  Emails: EmailsProps;
  Flex: FlexProps;
  Footer: FooterProps;
  GetDirections: GetDirectionsProps;
  Grid: GridProps;
  Header: HeaderProps;
  HeadingText: HeadingTextProps;
  HoursTable: HoursTableProps;
  HoursStatus: HoursStatusProps;
  ImageWrapper: ImageWrapperProps;
  Phone: PhoneProps;
  Promo: PromoProps;
  TextList: TextListProps;
};

type DirectoryConfigProps = {
  Breadcrumbs: BreadcrumbsProps;
  Directory: DirectoryProps;
  Footer: FooterProps;
  Header: HeaderProps;
};

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components: {
    Address,
    Banner,
    BodyText,
    Breadcrumbs,
    Card,
    CTA,
    Emails,
    Flex,
    Footer,
    GetDirections,
    Grid,
    Header,
    HeadingText,
    HoursTable,
    HoursStatus,
    ImageWrapper,
    Phone,
    Promo,
    TextList,
  },
  root: {
    render: ({ children }) => {
      return <>{children}</>;
    },
  },
};

export const directoryConfig: Config<DirectoryConfigProps> = {
  components: {
    Breadcrumbs,
    Directory,
    Footer,
    Header,
  },
  root: {
    render: ({ children }) => {
      return <>{children}</>;
    },
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["main", mainConfig],
  ["directory", directoryConfig],
]);
