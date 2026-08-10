import type { SectionConfig } from "@yext/visual-editor";
import { LocatorComponent } from "../shared/components/locator/Locator";

export const Locator = LocatorComponent;

export const config: SectionConfig = {
  displayName: "Locator",
  description: "Displays the locator page experience.",
  pageSetTypes: ["LOCATOR"],
  category: "Locator",
};
