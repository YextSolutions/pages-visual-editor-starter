import { DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import {
  Address,
  AddressProps,
  BodyText,
  BodyTextProps,
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
} from "@yext/visual-editor";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import { CardComponent as Card, CardProps } from "./components/Card";
import { Footer } from "./components/Footer.js";

type LocationProps = {
  GridSection: GridSectionProps;
  HoursTable: HoursTableProps;
  BodyText: BodyTextProps;
  HeadingText: HeadingTextProps;
  ImageWrapper: ImageWrapperProps;
  CTA: CTAWrapperProps;
  HoursStatus: HoursStatusProps;
  FlexContainer: FlexContainerProps;
  Address: AddressProps;
  TextList: TextListProps;
  Emails: EmailsProps;
  Phone: PhoneProps;
  GetDirections: GetDirectionsProps;
  Banner: BannerProps;
  Card: CardProps;
  Header: HeaderProps;
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
    render: ({ puck: { isEditing } }) => {
      return (
        <>
          <DropZone zone="header" allow={["Header"]} />
          <DropZone zone="content" disallow={["Header", "Footer"]} />
          {/* <DropZone zone="footer" allow={["Footer"]} /> */}
          <Footer isEditing={isEditing} />
        </>
      );
    },
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
