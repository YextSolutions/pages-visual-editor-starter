import type { Config } from "@measured/puck";

import {
  BodyTextComponent as BodyText,
  BodyTextProps,
} from "./components/BodyText.js";

import {
  ImageWrapperComponent as ImageWrapper,
  ImageWrapperProps,
} from "./components/Image.js";

import {
  HeadingTextComponent as HeadingText,
  HeadingTextProps,
} from "./components/HeadingText";

// import { HeroComponent as Hero, HeroProps } from "./components/Hero";
import {
  GridSectionComponent as GridSection,
  GridSectionProps,
} from "./components/GridSection";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
// import { CardComponent as Card, CardProps } from "./components/Card";
// import {
//   StoreInfoCardComponent as StoreInfoCard,
//   StoreInfoCardProps,
// } from "./components/StoreInfoCard";
// import { FAQComponent as FAQ, FAQProps } from "./components/FAQ";
// import {
//   DeliveryPromoComponent as DeliveryPromo,
//   DeliveryPromoProps,
// } from "./components/DeliveryPromo";
// import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import {
  HoursCardComponent as HoursCard,
  HoursCardProps,
} from "./components/HoursCard";
// import { PromoComponent as Promo, PromoProps } from "./components/Promo";
// import {
//   FeaturedItemsComponent as FeaturedItems,
//   FeaturedItemsProps,
// } from "./components/FeaturedItems";
import {
  CTAWrapperComponent as CTAWrapper,
  CTAWrapperProps,
} from "./components/CtaWrapper";
import {
  HoursStatusWrapperComponent as HoursStatusWrapper,
  HoursStatusWrapperProps,
} from "./components/HoursStatus";

import "@yext/visual-editor/style.css";
import {
  FlexContainerComponent as FlexContainer,
  FlexContainerProps,
} from "./components/FlexContainer";
import {
  AddressProps,
  AddressComponent as Address,
} from "./components/Address.js";
import {
  TextListComponent as TextList,
  TextListProps,
} from "./components/TextList.js";
import {EmailListComponent as EmailList, EmailListProps} from "./components/EmailsList";

type LocationProps = {
  // Hero: HeroProps;
  GridSection: GridSectionProps;
  // Card: CardProps;
  // FAQ: FAQProps;
  // DeliveryPromo: DeliveryPromoProps;
  // Banner: BannerProps;
  HoursCard: HoursCardProps;
  // StoreInfoCard: StoreInfoCardProps;
  // Promo: PromoProps;
  // FeaturedItems: FeaturedItemsProps;
  BodyText: BodyTextProps;
  HeadingText: HeadingTextProps;
  ImageWrapper: ImageWrapperProps;
  CTAWrapper: CTAWrapperProps;
  HoursStatusWrapper: HoursStatusWrapperProps;
  FlexContainer: FlexContainerProps;
  Address: AddressProps;
  TextList: TextListProps;
  EmailList: EmailListProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Address,
    BodyText,
    CTAWrapper,
    FlexContainer,
    GridSection,
    HeadingText,
    HoursCard,
    HoursStatusWrapper,
    ImageWrapper,
    TextList,
    EmailList,
    // Hero,
    // Card,
    // FAQ,
    // DeliveryPromo,
    // Banner,
    // StoreInfoCard,
    // Promo,
    // FeaturedItems,
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
