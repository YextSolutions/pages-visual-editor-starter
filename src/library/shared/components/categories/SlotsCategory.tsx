// @ts-nocheck
import { Address, AddressProps } from "../contentBlocks/Address";
import {
  AboutSectionDetailsColumn,
  AboutSectionDetailsColumnProps,
} from "../pageSections/AboutSection/AboutSectionDetailsColumn";
import { BodyTextProps, BodyText } from "../contentBlocks/BodyText";
import { CTAWrapperProps, CTAWrapper } from "../contentBlocks/CtaWrapper";
import {
  HeadingTextProps,
  HeadingText,
} from "../contentBlocks/HeadingText";
import { HoursTable, HoursTableProps } from "../contentBlocks/HoursTable";
import {
  ImageWrapperProps,
  ImageWrapper,
} from "../contentBlocks/image/Image";
import { Video, VideoProps } from "../contentBlocks/Video";
import { TextList, TextListProps } from "../contentBlocks/TextList";
import { PhoneListProps, PhoneList } from "../contentBlocks/PhoneList";
import { Text, TextProps } from "../contentBlocks/Text";
import {
  ProductCardsWrapper,
  ProductCardsWrapperProps,
} from "../pageSections/ProductSection/ProductCardsWrapper";
import {
  ProductCard,
  ProductCardProps,
} from "../pageSections/ProductSection/ProductCard";
import {
  EventCardsWrapper,
  EventCardsWrapperProps,
} from "../pageSections/EventSection/EventCardsWrapper";
import {
  EventCard,
  EventCardProps,
} from "../pageSections/EventSection/EventCard";
import { Emails, EmailsProps } from "../contentBlocks/Emails";
import {
  HoursStatus,
  HoursStatusProps,
} from "../contentBlocks/HoursStatus";
import {
  HeroImage,
  HeroImageProps,
} from "../contentBlocks/image/HeroImage";
import { Timestamp, TimestampProps } from "../contentBlocks/Timestamp";
import {
  NearbyLocationCardsWrapper,
  NearbyLocationCardsWrapperProps,
} from "../pageSections/NearbyLocations/NearbyLocationsCardsWrapper";
import {
  InsightCardsWrapper,
  InsightCardsWrapperProps,
} from "../pageSections/InsightSection/InsightCardsWrapper";
import {
  InsightCard,
  InsightCardProps,
} from "../pageSections/InsightSection/InsightCard";
import {
  PhotoGalleryWrapperProps,
  PhotoGalleryWrapper,
} from "../pageSections/PhotoGallerySection/PhotoGalleryWrapper";
import { FAQCard, FAQCardProps } from "../pageSections/FAQsSection/FAQCard";
import {
  TeamCardsWrapper,
  TeamCardsWrapperProps,
} from "../pageSections/TeamSection/TeamCardsWrapper";
import {
  TeamCard,
  TeamCardProps,
} from "../pageSections/TeamSection/TeamCard";
import {
  TestimonialCardsWrapper,
  TestimonialCardsWrapperProps,
} from "../pageSections/TestimonialSection/TestimonialCardsWrapper";
import {
  TestimonialCard,
  TestimonialCardProps,
} from "../pageSections/TestimonialSection/TestimonialCard";
import {
  FooterLogoSlot,
  FooterLogoSlotProps,
} from "../footer/FooterLogoSlot";
import {
  FooterSocialLinksSlot,
  FooterSocialLinksSlotProps,
} from "../footer/FooterSocialLinksSlot";
import {
  FooterUtilityImagesSlot,
  FooterUtilityImagesSlotProps,
} from "../footer/FooterUtilityImagesSlot";
import {
  FooterLinksSlot,
  FooterLinksSlotProps,
} from "../footer/FooterLinksSlot";
import {
  FooterExpandedLinkSectionSlot,
  FooterExpandedLinkSectionSlotProps,
} from "../footer/FooterExpandedLinkSectionSlot";
import {
  FooterExpandedLinksWrapper,
  FooterExpandedLinksWrapperProps,
} from "../footer/FooterExpandedLinksWrapper";
import {
  CopyrightMessageSlot,
  CopyrightMessageSlotProps,
} from "../footer/CopyrightMessageSlot";
import {
  SecondaryFooterSlot,
  SecondaryFooterSlotProps,
} from "../footer/SecondaryFooterSlot";
import {
  DirectoryCard,
  DirectoryCardProps,
} from "../directory/DirectoryCard";
import {
  DirectoryGrid,
  DirectoryGridProps,
} from "../directory/DirectoryWrapper";
import { Phone, PhoneProps } from "../contentBlocks/Phone";
import {
  BreadcrumbsSection,
  BreadcrumbsSectionProps,
} from "../pageSections/Breadcrumbs";
import {
  PrimaryHeaderSlot,
  PrimaryHeaderSlotProps,
} from "../header/PrimaryHeaderSlot";
import {
  SecondaryHeaderSlot,
  SecondaryHeaderSlotProps,
} from "../header/SecondaryHeaderSlot";
import { HeaderLinks, HeaderLinksProps } from "../header/HeaderLinks";

export interface SlotsCategoryProps {
  AddressSlot: AddressProps;
  AboutSectionDetailsColumn: AboutSectionDetailsColumnProps;
  BreadcrumbsSlot: BreadcrumbsSectionProps;
  BodyTextSlot: BodyTextProps;
  CopyrightMessageSlot: CopyrightMessageSlotProps;
  CTASlot: CTAWrapperProps;
  DirectoryCard: DirectoryCardProps;
  DirectoryGrid: DirectoryGridProps;
  EmailsSlot: EmailsProps;
  EventCard: EventCardProps;
  EventCardsWrapper: EventCardsWrapperProps;
  FAQCard: FAQCardProps;
  FooterExpandedLinkSectionSlot: FooterExpandedLinkSectionSlotProps;
  FooterExpandedLinksWrapper: FooterExpandedLinksWrapperProps;
  FooterLinksSlot: FooterLinksSlotProps;
  FooterLogoSlot: FooterLogoSlotProps;
  FooterSocialLinksSlot: FooterSocialLinksSlotProps;
  FooterUtilityImagesSlot: FooterUtilityImagesSlotProps;
  HeaderLinks: HeaderLinksProps;
  HeadingTextSlot: HeadingTextProps;
  HeroImageSlot: HeroImageProps;
  HoursStatusSlot: HoursStatusProps;
  HoursTableSlot: HoursTableProps;
  ImageSlot: ImageWrapperProps;
  InsightCardsWrapper: InsightCardsWrapperProps;
  InsightCard: InsightCardProps;
  NearbyLocationCardsWrapper: NearbyLocationCardsWrapperProps;
  PhoneNumbersSlot: PhoneListProps;
  PhoneSlot: PhoneProps;
  PhotoGalleryWrapper: PhotoGalleryWrapperProps;
  PrimaryHeaderSlot: PrimaryHeaderSlotProps;
  ProductCardsWrapper: ProductCardsWrapperProps;
  ProductCard: ProductCardProps;
  SecondaryFooterSlot: SecondaryFooterSlotProps;
  SecondaryHeaderSlot: SecondaryHeaderSlotProps;
  TeamCard: TeamCardProps;
  TeamCardsWrapper: TeamCardsWrapperProps;
  TestimonialCard: TestimonialCardProps;
  TestimonialCardsWrapper: TestimonialCardsWrapperProps;
  TextListSlot: TextListProps;
  TextSlot: TextProps;
  Timestamp: TimestampProps;
  VideoSlot: VideoProps;
}

const lockedPermissions = {
  delete: false,
  drag: false,
  duplicate: false,
  insert: false,
};

const ExpandedHeaderComponents = {
  HeaderLinks: { ...HeaderLinks, permissions: lockedPermissions },
  PrimaryHeaderSlot: { ...PrimaryHeaderSlot, permissions: lockedPermissions },
  SecondaryHeaderSlot: {
    ...SecondaryHeaderSlot,
    permissions: lockedPermissions,
  },
};

export const SlotsCategoryComponents = {
  AboutSectionDetailsColumn: {
    ...AboutSectionDetailsColumn,
    permissions: lockedPermissions,
  },
  AddressSlot: { ...Address, permissions: lockedPermissions },
  BodyTextSlot: { ...BodyText, permissions: lockedPermissions },
  BreadcrumbsSlot: { ...BreadcrumbsSection, permissions: lockedPermissions },
  CopyrightMessageSlot: {
    ...CopyrightMessageSlot,
    permissions: lockedPermissions,
  },
  CTASlot: { ...CTAWrapper, permissions: lockedPermissions },
  DirectoryCard: { ...DirectoryCard, permissions: lockedPermissions },
  DirectoryGrid: { ...DirectoryGrid, permissions: lockedPermissions },
  EmailsSlot: { ...Emails, permissions: lockedPermissions },
  EventCard: { ...EventCard, permissions: lockedPermissions },
  EventCardsWrapper: { ...EventCardsWrapper, permissions: lockedPermissions },
  ...ExpandedHeaderComponents,
  FAQCard: { ...FAQCard, permissions: lockedPermissions },
  FooterExpandedLinkSectionSlot: {
    ...FooterExpandedLinkSectionSlot,
    permissions: lockedPermissions,
  },
  FooterExpandedLinksWrapper: {
    ...FooterExpandedLinksWrapper,
    permissions: lockedPermissions,
  },
  FooterLinksSlot: { ...FooterLinksSlot, permissions: lockedPermissions },
  FooterLogoSlot: { ...FooterLogoSlot, permissions: lockedPermissions },
  FooterSocialLinksSlot: {
    ...FooterSocialLinksSlot,
    permissions: lockedPermissions,
  },
  FooterUtilityImagesSlot: {
    ...FooterUtilityImagesSlot,
    permissions: lockedPermissions,
  },
  HeadingTextSlot: { ...HeadingText, permissions: lockedPermissions },
  HeroImageSlot: { ...HeroImage, permissions: lockedPermissions },
  HoursStatusSlot: { ...HoursStatus, permissions: lockedPermissions },
  HoursTableSlot: { ...HoursTable, permissions: lockedPermissions },
  ImageSlot: { ...ImageWrapper, permissions: lockedPermissions },
  InsightCardsWrapper: {
    ...InsightCardsWrapper,
    permissions: lockedPermissions,
  },
  InsightCard: { ...InsightCard, permissions: lockedPermissions },
  NearbyLocationCardsWrapper: {
    ...NearbyLocationCardsWrapper,
    permissions: lockedPermissions,
  },
  PhoneNumbersSlot: { ...PhoneList, permissions: lockedPermissions },
  PhoneSlot: { ...Phone, permissions: lockedPermissions },
  PhotoGalleryWrapper: {
    ...PhotoGalleryWrapper,
    permissions: lockedPermissions,
  },
  ProductCardsWrapper: {
    ...ProductCardsWrapper,
    permissions: lockedPermissions,
  },
  ProductCard: { ...ProductCard, permissions: lockedPermissions },
  SecondaryFooterSlot: {
    ...SecondaryFooterSlot,
    permissions: lockedPermissions,
  },
  TeamCard: { ...TeamCard, permissions: lockedPermissions },
  TeamCardsWrapper: { ...TeamCardsWrapper, permissions: lockedPermissions },
  TestimonialCard: { ...TestimonialCard, permissions: lockedPermissions },
  TestimonialCardsWrapper: {
    ...TestimonialCardsWrapper,
    permissions: lockedPermissions,
  },
  TextListSlot: { ...TextList, permissions: lockedPermissions },
  TextSlot: { ...Text, permissions: lockedPermissions },
  Timestamp: { ...Timestamp, permissions: lockedPermissions },
  VideoSlot: { ...Video, permissions: lockedPermissions },
};

export const SlotsCategory = Object.keys(
  SlotsCategoryComponents
) as (keyof SlotsCategoryProps)[];
