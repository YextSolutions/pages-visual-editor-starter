import type { Config } from "@measured/puck";
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
} from "@yext/visual-editor";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import { CardComponent as Card, CardProps } from "./components/Card";
import { Header } from "./components/Header.js";
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
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Address,
    BodyText,
    CTA,
    FlexContainer,
    GetDirections,
    GridSection,
    HeadingText,
    HoursTable,
    HoursStatus,
    ImageWrapper,
    TextList,
    Emails,
    Phone,
    Banner,
    Card,
  },
  root: {
    render: ({ children, puck: { isEditing } }) => {
      return (
        <>
          <Header isEditing={isEditing} />
          {children}
          <Footer isEditing={isEditing} />
        </>
      );
    },
    fields: {},
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);
