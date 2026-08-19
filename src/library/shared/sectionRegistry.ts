import type { Config } from "@puckeditor/core";
import { PrimaryHeaderSlot as SharedComponent0 } from "./components/header/PrimaryHeaderSlot";
import { ImageWrapper as SharedComponent1 } from "./components/contentBlocks/image/Image";
import { HeaderLinks as SharedComponent2 } from "./components/header/HeaderLinks";
import { CTAWrapper as SharedComponent3 } from "./components/contentBlocks/CtaWrapper";
import { SecondaryHeaderSlot as SharedComponent4 } from "./components/header/SecondaryHeaderSlot";
import { HeadingText as SharedComponent5 } from "./components/contentBlocks/HeadingText";
import { BreadcrumbsSection as SharedComponent6 } from "./components/pageSections/Breadcrumbs";
import { DirectoryGrid as SharedComponent7 } from "./components/directory/DirectoryWrapper";
import { FooterLogoSlot as SharedComponent8 } from "./components/footer/FooterLogoSlot";
import { FooterSocialLinksSlot as SharedComponent9 } from "./components/footer/FooterSocialLinksSlot";
import { FooterUtilityImagesSlot as SharedComponent10 } from "./components/footer/FooterUtilityImagesSlot";
import { FooterLinksSlot as SharedComponent11 } from "./components/footer/FooterLinksSlot";
import { FooterExpandedLinksWrapper as SharedComponent12 } from "./components/footer/FooterExpandedLinksWrapper";
import { SecondaryFooterSlot as SharedComponent13 } from "./components/footer/SecondaryFooterSlot";
import { CopyrightMessageSlot as SharedComponent14 } from "./components/footer/CopyrightMessageSlot";
import { directoryRootConfig, locatorRootConfig } from "./roots";

export const sharedSections = [
  { id: "PrimaryHeaderSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "ImageSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "HeaderLinks", pageSetTypes: ["DIRECTORY"] },
  { id: "CTASlot", pageSetTypes: ["DIRECTORY"] },
  { id: "SecondaryHeaderSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "HeadingTextSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "BreadcrumbsSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "DirectoryGrid", pageSetTypes: ["DIRECTORY"] },
  { id: "FooterLogoSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "FooterSocialLinksSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "FooterUtilityImagesSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "FooterLinksSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "FooterExpandedLinksWrapper", pageSetTypes: ["DIRECTORY"] },
  { id: "SecondaryFooterSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "CopyrightMessageSlot", pageSetTypes: ["DIRECTORY"] },
] as const;

export const sharedComponents: Record<string, Config["components"][string]> = {
  "PrimaryHeaderSlot": SharedComponent0,
  "ImageSlot": SharedComponent1,
  "HeaderLinks": SharedComponent2,
  "CTASlot": SharedComponent3,
  "SecondaryHeaderSlot": SharedComponent4,
  "HeadingTextSlot": SharedComponent5,
  "BreadcrumbsSlot": SharedComponent6,
  "DirectoryGrid": SharedComponent7,
  "FooterLogoSlot": SharedComponent8,
  "FooterSocialLinksSlot": SharedComponent9,
  "FooterUtilityImagesSlot": SharedComponent10,
  "FooterLinksSlot": SharedComponent11,
  "FooterExpandedLinksWrapper": SharedComponent12,
  "SecondaryFooterSlot": SharedComponent13,
  "CopyrightMessageSlot": SharedComponent14,
};

export const sharedRootConfigs: Partial<Record<string, NonNullable<Config["root"]>>> = {
  DIRECTORY: directoryRootConfig,
  LOCATOR: locatorRootConfig,
};

export const sharedRootPageSetTypes = ["DIRECTORY", "LOCATOR"] as const;

export const sharedRootAllowedComponentIds: Partial<Record<string, string[]>> = {
  DIRECTORY: ["MainContent", "ExpandedHeader", "ExpandedFooter", "CustomCodeSection"],
  LOCATOR: ["MainContent", "ExpandedHeader", "ExpandedFooter", "CustomCodeSection"],
};
