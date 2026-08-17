import { LocatorComponent } from "../shared/components/locator/Locator";
import type { SectionConfig } from "@yext/visual-editor";

export const Locator = LocatorComponent;

export const config: SectionConfig = {
  id: "Locator",
  displayName: "Locator",
  description: "Displays the locator page experience.",
  pageSetTypes: ["LOCATOR"],
  category: "Locator",
};
