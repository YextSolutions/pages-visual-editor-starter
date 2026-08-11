import {
  Directory as DirectoryComponent,
  type SectionConfig,
} from "@yext/visual-editor";

export const Directory = DirectoryComponent;

export const config: SectionConfig = {
  displayName: "Directory",
  description: "Displays the directory page experience.",
  pageSetTypes: ["DIRECTORY"],
  category: "Directory",
};
