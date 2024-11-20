import type { Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import {
  AddressComponent as Address,
  AddressProps,
  BodyTextComponent as BodyText,
  BodyTextProps,
  CTAWrapperComponent as CTA,
  CTAWrapperProps,
  EmailsComponent as Emails,
  EmailsProps,
  FlexContainerComponent as FlexContainer,
  FlexContainerProps,
  GridSectionComponent as GridSection,
  GridSectionProps,
  HeadingTextComponent as HeadingText,
  HeadingTextProps,
  HoursCardComponent as HoursCard,
  HoursCardProps,
  HoursStatusComponent as HoursStatus,
  HoursStatusProps,
  ImageWrapperComponent as ImageWrapper,
  ImageWrapperProps,
  PhoneComponent as Phone,
  PhoneProps,
  TextListComponent as TextList,
  TextListProps,
} from "@yext/visual-editor";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import {
  DEStaticComponentWrapperProps,
  DEStaticComponentWrapperComponent as DEStaticComponent,
} from "./components/DEStaticComponent.js";
import {
  DEEntityComponentWrapperComponent as DEEntityComponent,
  DEComponentProps,
} from "./components/DEEntityComponent.js";
import { Hero, HeroProps } from "./components/Hero.js";
import { Blogs, BlogsProps } from "./components/Blogs.js";
import { FAQComponent, FAQProps } from "./components/FAQs.js";
import {
  FAQsWithStaticFAQsComponent as FAQsStaticData,
  FAQsWithStaticFAQsProps,
} from "./components/FAQsWithStaticFAQs.js";
import {
  BlogsWithStaticDataProps,
  BlogsWithStaticData as BlogsStaticData,
} from "./components/BlogsWithStaticData.js";
import {
  DescriptionSection as Description,
  DescriptionProps,
} from "./components/DescriptionSection.js";

type LocationProps = {
  GridSection: GridSectionProps;
  HoursCard: HoursCardProps;
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
  DEStaticComponent: DEStaticComponentWrapperProps;
  DEEntityComponent: DEComponentProps;
  Hero: HeroProps;
  Blogs: BlogsProps;
  FAQComponent: FAQProps;
  FAQsStaticData: FAQsWithStaticFAQsProps;
  BlogsStaticData: BlogsWithStaticDataProps;
  Description: DescriptionProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    FAQsStaticData,
    FAQComponent,
    Description,
    BlogsStaticData,
    Address,
    Blogs,
    BodyText,
    CTA,
    DEEntityComponent,
    DEStaticComponent,
    Emails,
    FlexContainer,
    GridSection,
    Hero,
    HeadingText,
    HoursCard,
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