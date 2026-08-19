import { BannerSection as SectionComponent } from "../shared/components/pageSections/Banner";
import type { SectionConfig } from "@yext/visual-editor";

export const BannerSection = SectionComponent;

export const config: SectionConfig = {
  id: "BannerSection",
  displayName: "Banner",
  description: "Displays a full-width banner.",
  pageSetTypes: ["DIRECTORY", "LOCATOR"],
  category: "Standard Sections",
};
