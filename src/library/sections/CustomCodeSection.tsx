import { CustomCodeSection as CustomCodeSectionComponent } from "@yext/visual-editor";
import type { SectionConfig } from "@yext/visual-editor";

export const CustomCodeSection = CustomCodeSectionComponent;

export const config: SectionConfig = {
  displayName: "Custom Code",
  description: "Adds custom code to the page.",
  pageSetTypes: ["ENTITY"],
  category: "Advanced",
};
