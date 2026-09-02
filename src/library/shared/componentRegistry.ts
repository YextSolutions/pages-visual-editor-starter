import type { Config } from "@puckeditor/core";
import { HeadingText as SharedComponent0 } from "./components/contentBlocks/HeadingText";
import { BreadcrumbsSection as SharedComponent1 } from "./components/pageSections/Breadcrumbs";
import { DirectoryGrid as SharedComponent2 } from "./components/directory/DirectoryWrapper";
import { DirectoryCard as SharedComponent3 } from "./components/directory/DirectoryCard";
import { Address as SharedComponent4 } from "./components/contentBlocks/Address";
import { HoursStatus as SharedComponent5 } from "./components/contentBlocks/HoursStatus";
import { Phone as SharedComponent6 } from "./components/contentBlocks/Phone";
import { directoryRootConfig, locatorRootConfig } from "./roots";

/** Hidden internal Puck components referenced by saved Directory layout data. */
export const sharedComponentMetadata = [
  { id: "HeadingTextSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "BreadcrumbsSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "DirectoryGrid", pageSetTypes: ["DIRECTORY"] },
  { id: "DirectoryCard", pageSetTypes: ["DIRECTORY"] },
  { id: "AddressSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "HoursStatusSlot", pageSetTypes: ["DIRECTORY"] },
  { id: "PhoneSlot", pageSetTypes: ["DIRECTORY"] },
] as const;

/** Puck configs for the hidden internal components. */
export const sharedComponentConfigs: Record<string, Config["components"][string]> = {
  "HeadingTextSlot": SharedComponent0,
  "BreadcrumbsSlot": SharedComponent1,
  "DirectoryGrid": SharedComponent2,
  "DirectoryCard": SharedComponent3,
  "AddressSlot": SharedComponent4,
  "HoursStatusSlot": SharedComponent5,
  "PhoneSlot": SharedComponent6,
};

export const sharedRootConfigs: Partial<Record<string, NonNullable<Config["root"]>>> = {
  DIRECTORY: directoryRootConfig,
  LOCATOR: locatorRootConfig,
};

export const sharedRootPageSetTypes = ["DIRECTORY", "LOCATOR"] as const;

export const sharedRootAllowedComponentIds: Partial<Record<string, string[]>> = {
  DIRECTORY: ["MainContent", "CustomCodeSection"],
  LOCATOR: ["MainContent", "CustomCodeSection"],
};
