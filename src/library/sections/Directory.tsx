import { Directory as SectionComponent } from "../shared/components/directory/Directory";
import type { SectionConfig } from "@yext/visual-editor";

export const Directory = SectionComponent;

export const config: SectionConfig = {
  id: "Directory",
  displayName: "Directory",
  description: "Displays the directory page experience.",
  pageSetTypes: ["DIRECTORY"],
  category: "Standard Sections",
};
