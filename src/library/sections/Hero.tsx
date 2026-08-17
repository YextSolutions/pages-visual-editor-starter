import type { SectionConfig, YextComponentConfig } from "@yext/visual-editor";

type HeroProps = {
  text: string;
};

export const Hero: YextComponentConfig<HeroProps> = {
  label: "Hero",
  fields: {
    text: {
      type: "text",
      label: "Text",
    },
  },
  defaultProps: {
    text: "Welcome",
  },
  render: ({ text }) => (
    <section>
      <h1>{text}</h1>
    </section>
  ),
};

export const config: SectionConfig = {
  id: "hero",
  displayName: "Hero",
  description: "Displays a page heading.",
  pageSetTypes: ["ENTITY"],
  category: "Content",
};
