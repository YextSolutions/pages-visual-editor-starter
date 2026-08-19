import { ExpandedFooter as SectionComponent } from "../shared/components/footer/ExpandedFooter";
import type { SectionConfig } from "@yext/visual-editor";

export const ExpandedFooter = SectionComponent;

export const config: SectionConfig = {
  id: "ExpandedFooter",
  displayName: "Expanded Footer",
  description: "Displays the site footer.",
  pageSetTypes: ["DIRECTORY", "LOCATOR"],
  category: "Other",
};
