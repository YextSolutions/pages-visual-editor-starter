// @ts-nocheck
import { setDeep, type Config } from "@puckeditor/core";
import {
  BannerSection,
  DeprecatedCategoryComponents,
  DirectoryCategoryComponents,
  LocatorCategoryComponents,
  OtherCategoryComponents,
  SlotsCategoryComponents,
} from "@yext/visual-editor";

type SharedComponent = {
  component: Config["components"][string];
  pageSetTypes: string[];
};

const resolveDirectoryRootProps = (
  props: Record<string, any>,
  streamDocument: Record<string, any>,
) => {
  const defaults: Record<string, { title: string; description: string }> = {
    dm_root: { title: "Locations", description: "Browse all locations" },
    dm_country: {
      title: "Locations in [[dm_addressCountryDisplayName]]",
      description: "Browse locations in [[dm_addressCountryDisplayName]]",
    },
    dm_region: {
      title: "Locations in [[dm_addressRegionDisplayName]]",
      description: "Browse locations in [[dm_addressRegionDisplayName]]",
    },
    dm_city: {
      title: "Locations in [[name]]",
      description: "Browse locations in [[name]]",
    },
  };
  const values = defaults[streamDocument?.meta?.entityType?.id];
  if (!values) {
    return props;
  }
  let resolvedProps = { ...props };
  if (props?.title?.constantValue?.defaultValue === "PLACEHOLDER") {
    resolvedProps = setDeep(
      resolvedProps,
      "title.constantValue.defaultValue",
      values.title,
    );
  }
  if (props?.description?.constantValue?.defaultValue === "PLACEHOLDER") {
    resolvedProps = setDeep(
      resolvedProps,
      "description.constantValue.defaultValue",
      values.description,
    );
  }
  return resolvedProps;
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
