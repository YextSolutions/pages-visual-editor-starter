import { ComponentConfig, Fields } from "@measured/puck";
import { CTA, CTAProps } from "./atoms/cta";

const ctaFields: Fields<CTAProps> = {
  label: {
    label: "Label",
    type: "text",
  },
  link: {
    label: "URL",
    type: "text",
  },
  variant: {
    label: "Variant",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Secondary", value: "secondary" },
      { label: "Link", value: "link" },
    ],
  },
  size: {
    label: "Size",
    type: "radio",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
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

export const CTAComponent: ComponentConfig<CTAProps> = {
  fields: ctaFields,
  defaultProps: {
    label: "Click Me",
    link: "#",
    variant: "default",
    size: "lg",
    linkType: "URL",
  },
  render: (props) => <CTA {...props} />,
};

export { CTA };
