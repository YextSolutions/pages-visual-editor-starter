import { ImageType, AddressType } from "@yext/pages-components";

export type RTF2 = {
  readonly json?: string;
  readonly html?: string;
}

export type SingleOption = {
  textValue?: string;
  displayName?: string;
}

export type TextModuleType = {
  title?: string;
  description?: RTF2;
}

export type MediaBlockType = {
  title: string;
  description: RTF2;
  photo: ComplexImageType;
  video: VideoEmbedType;
  vidVisorVideo?: VidVisorType;
  mediaToDisplay?: string;
  blockOrientation?: string;
}

export type CTAType = {
  title?: string;
  subtitle?: string;
  cTAURL?: string;
}

export type CTAModuleType = {
  title?: string;
  subtitle?: string;
  button?: CTAProps;
}

export type CTAProps = {
  label: string;
  link: string;
  eventName?: string;
  className?: string;
}

export type ComplexImageType = {
  alternateText?: string;
  height?: number;
  width?: number;
  url?: string;
  description?: string;
}

export type VideoEmbedType = {
  uRL?: string;
  thumbnail?: ComplexImageType;
  alternateText?: string;
}

export type VidVisorType = {
  videoType?: string;
  videoID?: string;
}

export type TextBlockType = {
  title?: string;
  description?: RTF2;
}

export type TextBlockModuleType = {
  title?: string;
  description?: RTF2;
  textBlocks?: TextBlockType[];
}

export type CardType = {
  imageIcon?: ImageType;
  title?: string;
  description?: RTF2;
  cTA?: CTAProps;
}

export type CardModuleType = {
  cardSectionTitle?: string;
  cardSectionDescription?: RTF2;
  showSectionInNav?: boolean;
  cardNavigationLinkTitle?: string;
  card?: CardType[];
}

export type Blog = {
  name: string;
  c_publishDate: string;
  c_author: string;
  c_blogImage: ImageType;
  c_shortDescription: string;
  c_primaryCTA: CTAProps;
}

export type Location = {
  name: string;
  address: AddressType;
  websiteUrl?: WebsiteUrl;
  emails?: string[];
  mainPhone?: string;
  linkedInUrl?: string;
  description?: string;
  c_advisorTitle?: string[];
  c_advisorTeamMemberTitleFR?: string[];
  c_advisorBio?: RTF2;
  c_advisorHeadshot?: ImageType;
  c_advisorDesignations?: string[];
  c_partnerImage?: ImageType;
  c_partnerDegreesAndDesignations?: string[];
  c_partnerTitle?: string[];
  c_partnerDescription?: string;
  c_salesforceID?: string;
}

export type TeamEvent = {
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestSpeakers: string;
  eventDescription: RTF2;
  eventCTA: CTAProps;
}

export type JumpLink = {
  displayInNav?: boolean;
  jumpLinkText?: string;
}

export type WebsiteUrl = {
  url?: string;
  displayUrl?: string;
}
