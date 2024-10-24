import type { Config } from "@measured/puck";

import {
  BodyTextComponent as BodyText,
  BodyTextProps,
  HeadingTextComponent as HeadingText,
  HeadingTextProps,
  ImageWrapperComponent as ImageWrapper,
  ImageWrapperProps,
} from "@yext/visual-editor";

import { HeroComponent as Hero, HeroProps } from "./components/Hero";
import {
  GridSectionComponent as GridSection,
  GridSectionProps,
} from "./components/GridSection";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CardComponent as Card, CardProps } from "./components/Card";
import {
  StoreInfoCardComponent as StoreInfoCard,
  StoreInfoCardProps,
} from "./components/StoreInfoCard";
import { FAQComponent as FAQ, FAQProps } from "./components/FAQ";
import {
  DeliveryPromoComponent as DeliveryPromo,
  DeliveryPromoProps,
} from "./components/DeliveryPromo";
import { BannerComponent as Banner, BannerProps } from "./components/Banner";
import {
  HoursCardComponent as HoursCard,
  HoursCardProps,
} from "./components/HoursCard";
import { PromoComponent as Promo, PromoProps } from "./components/Promo";
import {
  FeaturedItemsComponent as FeaturedItems,
  FeaturedItemsProps,
} from "./components/FeaturedItems";
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

type LocationProps = {
  Hero: HeroProps;
  GridSection: GridSectionProps;
  Card: CardProps;
  FAQ: FAQProps;
  DeliveryPromo: DeliveryPromoProps;
  Banner: BannerProps;
  HoursCard: HoursCardProps;
  StoreInfoCard: StoreInfoCardProps;
  Promo: PromoProps;
  FeaturedItems: FeaturedItemsProps;
  BodyText: BodyTextProps;
  HeadingText: HeadingTextProps;
  ImageWrapper: ImageWrapperProps;
  CTAWrapper: CTAWrapperProps;
  HoursStatusWrapper: HoursStatusWrapperProps;
  FlexContainer: FlexContainerProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Hero,
    GridSection,
    Card,
    FAQ,
    DeliveryPromo,
    Banner,
    HoursCard,
    StoreInfoCard,
    Promo,
    FeaturedItems,
    BodyText,
    HeadingText,
    ImageWrapper,
    CTAWrapper,
    HoursStatusWrapper,
    FlexContainer,
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
