import type { SectionConfig, YextComponentConfig } from "@yext/visual-editor";

type HeroProps = {
  heading: string;
};

export const Hero: YextComponentConfig<HeroProps> = {
  label: "Hero",
  fields: {
    heading: {
      type: "text",
      label: "Heading",
    },
  },
  defaultProps: {
    heading: "Welcome",
  },
  render: ({ heading }) => (
    <section>
      <h1>{heading}</h1>
    </section>
  ),
};

export const config: SectionConfig = {
  displayName: "Hero",
  description: "Displays a page heading.",
  pageSetTypes: ["ENTITY"],
  category: "Content",
};
