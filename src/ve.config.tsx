import { DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  PageSectionCategory,
  PageSectionCategoryComponents,
  PageSectionCategoryProps,
  OtherCategoryComponents,
  OtherCategoryProps,
  DirectoryCategoryComponents,
  DirectoryCategoryProps,
  LocatorCategoryComponents,
  LocatorCategoryProps,
  DeprecatedCategoryComponents,
  DeprecatedCategoryProps,
  DeprecatedCategory,
  OtherCategory,
  DirectoryCategory,
  LocatorCategory,
  AdvancedCoreInfoCategoryProps,
  AdvancedCoreInfoCategoryComponents,
  AdvancedCoreInfoCategory,
} from "@yext/visual-editor";

interface MainProps
  extends PageSectionCategoryProps,
    DeprecatedCategoryProps,
    OtherCategoryProps,
    AdvancedCoreInfoCategoryProps {}

const components: Config<MainProps>["components"] = {
  ...PageSectionCategoryComponents,
  ...DeprecatedCategoryComponents,
  ...OtherCategoryComponents,
  ...AdvancedCoreInfoCategoryComponents,
};

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components,
  categories: {
    pageSections: {
      title: "Page Sections",
      components: PageSectionCategory,
    },
    coreInformation: {
      title: "Core Information",
      components: AdvancedCoreInfoCategory,
    },
    other: {
      title: "Other",
      components: OtherCategory,
    },
    deprecatedComponents: {
      visible: false,
      components: DeprecatedCategory,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
          disallow={AdvancedCoreInfoCategory.filter((k) => k !== "Grid")}
        />
      );
    },
  },
};

interface DirectoryConfigProps
  extends DirectoryCategoryProps,
    DeprecatedCategoryProps,
    OtherCategoryProps {}

export const directoryConfig: Config<DirectoryConfigProps> = {
  components: {
    ...DirectoryCategoryComponents,
    ...DeprecatedCategoryComponents,
    ...OtherCategoryComponents,
  },
  categories: {
    directoryComponents: {
      title: "Directory",
      components: [...DirectoryCategory, ...OtherCategory],
    },
    deprecatedComponents: {
      visible: false,
      components: DeprecatedCategory,
    },
    other: {
      visible: false,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

interface LocatorConfigProps
  extends LocatorCategoryProps,
    DeprecatedCategoryProps,
    OtherCategoryProps {}

export const locatorConfig: Config<LocatorConfigProps> = {
  components: {
    ...LocatorCategoryComponents,
    ...DeprecatedCategoryComponents,
    ...OtherCategoryComponents,
  },
  categories: {
    locatorComponents: {
      title: "Locator",
      components: [...LocatorCategory, ...OtherCategory],
    },
    deprecatedComponents: {
      visible: false,
      components: DeprecatedCategory,
    },
    other: {
      visible: false,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["main", mainConfig],
  ["directory", directoryConfig],
  ["locator", locatorConfig],
]);
