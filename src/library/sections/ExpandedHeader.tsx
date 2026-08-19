import { ExpandedHeader as SectionComponent } from "../shared/components/header/ExpandedHeader";
import type { SectionConfig } from "@yext/visual-editor";

export const ExpandedHeader = SectionComponent;

export const config: SectionConfig = {
  id: "ExpandedHeader",
  displayName: "Expanded Header",
  description: "Displays the site header.",
  pageSetTypes: ["DIRECTORY", "LOCATOR"],
  category: "Other",
};
