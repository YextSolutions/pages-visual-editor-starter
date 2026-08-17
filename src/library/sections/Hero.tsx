import type { SectionConfig } from "@yext/visual-editor";

type HeroProps = {
  text?: string;
};

export const Hero = ({ text = "Hero" }: HeroProps): JSX.Element => (
  <section>{text}</section>
);

export const config: SectionConfig = {
  id: "hero",
  displayName: "Hero",
  description: "Temporary Entity test section.",
  pageSetTypes: ["ENTITY"],
  fields: {
    text: {
      label: "Text",
      type: "text",
    },
  },
};
