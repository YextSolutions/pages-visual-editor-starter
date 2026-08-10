import type { SectionConfig } from "@yext/visual-editor";
import { Directory as DirectoryComponent } from "../shared/components/directory/Directory";

export const Directory = DirectoryComponent;

export const config: SectionConfig = {
  displayName: "Directory",
  description: "Displays the directory page experience.",
  pageSetTypes: ["DIRECTORY"],
  category: "Directory",
};
