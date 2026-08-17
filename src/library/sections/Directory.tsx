import { Directory as DirectoryComponent } from "../shared/components/directory/Directory";
import type { SectionConfig } from "@yext/visual-editor";

export const Directory = DirectoryComponent;

export const config: SectionConfig = {
  id: "Directory",
  displayName: "Directory",
  description: "Displays the directory page experience.",
  pageSetTypes: ["DIRECTORY"],
  category: "Directory",
};
