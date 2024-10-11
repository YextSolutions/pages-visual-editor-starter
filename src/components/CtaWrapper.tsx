import { ComponentConfig, Fields } from "@measured/puck";
import { CTA, CTAProps } from "./atoms/cta";
import { cn } from "../utils/cn";

export interface CTAWrapperProps extends CTAProps {
  label: string;
  url: string;
}

const ctaWrapperFields: Fields<CTAWrapperProps> = {
  label: {
    type: "text",
    label: "CTA Label",
  },
  url: {
    type: "text",
    label: "CTA URL",
  },
  variant: {
    type: "select",
    label: "Variant",
    options: [
      { label: "Default", value: "default" },
      { label: "Secondary", value: "secondary" },
      { label: "Outline", value: "outline" },
      { label: "Ghost", value: "ghost" },
      { label: "Link", value: "link" },
    ],
  },
  size: {
    type: "select",
    label: "Size",
    options: [
      { label: "Default", value: "default" },
      { label: "Small", value: "sm" },
      { label: "Large", value: "lg" },
    ],
  },
};

const CTAWrapper: React.FC<CTAWrapperProps> = ({
  label,
  url,
  variant,
  size,
  className,
  ...rest
}) => {
  return (
    <CTA
      label={label}
      url={url}
      variant={variant}
      size={size}
      className={cn(className)}
      {...rest}
    />
  );
};

export const CTAWrapperComponent: ComponentConfig<CTAWrapperProps> = {
  fields: ctaWrapperFields,
  defaultProps: {
    label: "Click me",
    url: "#",
    variant: "default",
    size: "default",
  },
  render: (props) => <CTAWrapper {...props} />,
};

export { CTAWrapper };
