import { CustomCodeSection as SectionComponent } from "../shared/components/customCode/CustomCodeSection";
import type { SectionConfig } from "@yext/visual-editor";

export const CustomCodeSection = SectionComponent;

export const config: SectionConfig = {
  id: "CustomCodeSection",
  displayName: "Custom Code Section",
  description: "Adds custom HTML, CSS, and JavaScript.",
  pageSetTypes: ["DIRECTORY", "LOCATOR"],
  category: "Other",
};
