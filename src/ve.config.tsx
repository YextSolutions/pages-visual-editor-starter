import type { Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import {
  Address as Address,
  AddressProps,
  BodyText as BodyText,
  BodyTextProps,
  CTAWrapper as CTA,
  CTAWrapperProps,
  Emails as Emails,
  EmailsProps,
  FlexContainer as FlexContainer,
  FlexContainerProps,
  GridSection as GridSection,
  GridSectionProps,
  HeadingText as HeadingText,
  HeadingTextProps,
  HoursTable as HoursTable,
  HoursTableProps,
  HoursStatus as HoursStatus,
  HoursStatusProps,
  ImageWrapper as ImageWrapper,
  ImageWrapperProps,
  Phone as Phone,
  PhoneProps,
  TextList as TextList,
  TextListProps,
} from "@yext/visual-editor";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

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
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Address,
    BodyText,
    CTA,
    Emails,
    FlexContainer,
    GridSection,
    HeadingText,
    HoursTable,
    HoursStatus,
    ImageWrapper,
    Phone,
    TextList,
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
