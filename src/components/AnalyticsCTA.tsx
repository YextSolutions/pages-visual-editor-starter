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
  eventName: {
    label: "Event Name",
    type: "text",
  },
  obfuscate: {
    label: "Obfuscate",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  scope: {
    label: "Scope",
    type: "text",
  },
  currency: {
    label: "Currency",
    type: "text",
  },
  amount: {
    label: "Amount",
    type: "number",
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
