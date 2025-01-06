import { DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  Address,
  AddressProps,
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
  TextList,
  TextListProps,
  Header,
  HeaderProps,
  Footer,
  FooterProps,
} from "@yext/visual-editor";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";

type LocationProps = {
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
  TextList: TextListProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
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
    TextList,
  },
  root: {
    render: () => {
      return (
        <>
          <DropZone zone="header" allow={["Header"]} />
          <DropZone zone="content" disallow={["Header", "Footer"]} />
          <DropZone zone="footer" allow={["Footer"]} />
        </>
      );
    },
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
