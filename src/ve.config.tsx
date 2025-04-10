import { DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  PageSectionCategory,
  PageSectionCategoryComponents,
  PageSectionCategoryProps,
  LayoutBlockCategory,
  CardCategory,
  ContentBlockCategory,
  LayoutBlockCategoryComponents,
  CardCategoryComponents,
  ContentBlockCategoryComponents,
  OtherCategoryComponents,
  LayoutBlockCategoryProps,
  CardCategoryProps,
  ContentBlockCategoryProps,
  OtherCategoryProps,
  DirectoryCategoryComponents,
  DirectoryCategoryProps,
} from "@yext/visual-editor";

interface MainProps
  extends PageSectionCategoryProps,
    LayoutBlockCategoryProps,
    CardCategoryProps,
    ContentBlockCategoryProps,
    OtherCategoryProps {}

const components: Config<MainProps>["components"] = {
  ...PageSectionCategoryComponents,
  ...LayoutBlockCategoryComponents,
  ...CardCategoryComponents,
  ...ContentBlockCategoryComponents,
  ...OtherCategoryComponents,
};

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components,
  categories: {
    pageSections: {
      title: "Page Sections",
      components: PageSectionCategory,
    },
    layoutBlocks: {
      title: "Layout Blocks",
      components: LayoutBlockCategory,
    },
    cardBlocks: {
      title: "Cards",
      components: CardCategory,
    },
    contentBlocks: {
      title: "Content Blocks",
      components: ContentBlockCategory,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          disallow={[
            ...ContentBlockCategory,
            ...CardCategory,
            ...LayoutBlockCategory,
          ]}
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

interface DirectoryConfigProps
  extends DirectoryCategoryProps,
    OtherCategoryProps {}

export const directoryConfig: Config<DirectoryConfigProps> = {
  components: {
    ...DirectoryCategoryComponents,
    ...OtherCategoryComponents,
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
]);
