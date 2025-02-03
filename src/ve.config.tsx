import { type Config } from "@measured/puck";
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
  FlexContainer,
  FlexContainerProps,
  GetDirections,
  GetDirectionsProps,
  GridSection,
  GridSectionProps,
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
  Header,
  HeaderProps,
  Footer,
  FooterProps,
} from "@yext/visual-editor";

type MainProps = {
  Address: AddressProps;
  Banner: BannerProps;
  BodyText: BodyTextProps;
  Card: CardProps;
  CTA: CTAWrapperProps;
  Emails: EmailsProps;
  FlexContainer: FlexContainerProps;
  Footer: FooterProps;
  GetDirections: GetDirectionsProps;
  GridSection: GridSectionProps;
  Header: HeaderProps;
  HeadingText: HeadingTextProps;
  HoursTable: HoursTableProps;
  HoursStatus: HoursStatusProps;
  ImageWrapper: ImageWrapperProps;
  Phone: PhoneProps;
  Promo: PromoProps;
  TextList: TextListProps;
};

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components: {
    Address,
    Banner,
    BodyText,
    Card,
    CTA,
    Emails,
    FlexContainer,
    Footer,
    GetDirections,
    GridSection,
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

export const componentRegistry = new Map<string, Config<any>>([
  ["main", mainConfig],
]);
