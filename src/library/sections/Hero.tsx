import type { SectionConfig } from "@yext/visual-editor";

export const Hero = (): JSX.Element => <section>Hero</section>;

export const config: SectionConfig = {
  id: "hero",
  displayName: "Hero",
  description: "Temporary Entity test section.",
  pageSetTypes: ["ENTITY"],
};
