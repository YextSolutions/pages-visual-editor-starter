// @ts-nocheck
import type { Config } from "@puckeditor/core";
import { DeprecatedCategoryComponents } from "./components/categories/DeprecatedCategory";
import { DirectoryCategoryComponents } from "./components/categories/DirectoryCategory";
import { LocatorCategoryComponents } from "./components/categories/LocatorCategory";
import { OtherCategoryComponents } from "./components/categories/OtherCategory";
import { SlotsCategoryComponents } from "./components/categories/SlotsCategory";
import { BannerSection } from "./components/pageSections/Banner";
import { resolveDirectoryRootProps } from "@yext/visual-editor/section-library-support";

type SharedComponent = {
  component: Config["components"][string];
  pageSetTypes: string[];
};

export const sharedComponents: Record<string, SharedComponent> = {
  ...Object.fromEntries(
    Object.entries(DirectoryCategoryComponents)
      .filter(([id]) => id !== "Directory")
      .map(([id, component]) => [
        id,
        { component, pageSetTypes: ["DIRECTORY"] },
      ]),
  ),
  ...Object.fromEntries(
    Object.entries(LocatorCategoryComponents)
      .filter(([id]) => id !== "Locator")
      .map(([id, component]) => [id, { component, pageSetTypes: ["LOCATOR"] }]),
  ),
  ...Object.fromEntries(
    Object.entries(SlotsCategoryComponents).map(([id, component]) => [
      id,
      { component, pageSetTypes: ["DIRECTORY", "LOCATOR"] },
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(OtherCategoryComponents)
      .filter(
        ([id]) =>
          !["CustomCodeSection", "ExpandedHeader", "ExpandedFooter"].includes(
            id,
          ),
      )
      .map(([id, component]) => [
        id,
        { component, pageSetTypes: ["DIRECTORY", "LOCATOR"] },
      ]),
  ),
  DirectoryHeader: {
    component: OtherCategoryComponents.ExpandedHeader,
    pageSetTypes: ["DIRECTORY"],
  },
  DirectoryFooter: {
    component: OtherCategoryComponents.ExpandedFooter,
    pageSetTypes: ["DIRECTORY"],
  },
  LocatorHeader: {
    component: OtherCategoryComponents.ExpandedHeader,
    pageSetTypes: ["LOCATOR"],
  },
  LocatorFooter: {
    component: OtherCategoryComponents.ExpandedFooter,
    pageSetTypes: ["LOCATOR"],
  },
  DirectoryLegacyHeader: {
    component: DeprecatedCategoryComponents.Header,
    pageSetTypes: ["DIRECTORY"],
  },
  DirectoryLegacyFooter: {
    component: DeprecatedCategoryComponents.Footer,
    pageSetTypes: ["DIRECTORY"],
  },
  LocatorLegacyHeader: {
    component: DeprecatedCategoryComponents.Header,
    pageSetTypes: ["LOCATOR"],
  },
  LocatorLegacyFooter: {
    component: DeprecatedCategoryComponents.Footer,
    pageSetTypes: ["LOCATOR"],
  },
  BannerSection: {
    component: BannerSection,
    pageSetTypes: ["DIRECTORY", "LOCATOR"],
  },
};

export const sharedRootConfigs: Record<string, NonNullable<Config["root"]>> = {
  DIRECTORY: {
    resolveData: (data, params) => ({
      ...data,
      props: resolveDirectoryRootProps(
        data.props ?? {},
        params.metadata?.streamDocument ?? {},
      ),
    }),
  },
};

export const sharedRootAllowedComponents: Record<string, string[]> = {
  DIRECTORY: [
    "DirectoryHeader",
    "DirectoryFooter",
    "DirectoryLegacyHeader",
    "DirectoryLegacyFooter",
    "MainContent",
  ],
  LOCATOR: [
    "LocatorHeader",
    "LocatorFooter",
    "LocatorLegacyHeader",
    "LocatorLegacyFooter",
    "MainContent",
  ],
};
