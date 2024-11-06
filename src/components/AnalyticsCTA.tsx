import { ComponentConfig, Fields } from "@measured/puck";
import { YextCTA, YextCTAProps } from "./atoms/cta";

const ctaFields: Fields<YextCTAProps> = {
  label: {
    label: "Label",
    type: "text",
  },
  link: {
    label: "URL",
    type: "text",
  },
  linkType: {
    label: "Link Type",
    type: "radio",
    options: [
      { label: "URL", value: "URL" },
      { label: "Email", value: "Email" },
      { label: "Phone", value: "Phone" },
    ],
  },
};

export const AnalyticsCTA: ComponentConfig<YextCTAProps> = {
  fields: ctaFields,
  defaultProps: {
    label: "Click Me",
    link: "#",
    linkType: "URL",
  },
  render: (props) => <YextCTA {...props} />,
};
