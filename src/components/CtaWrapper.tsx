import { ComponentConfig, Fields } from "@measured/puck";
import { CTA, CTAProps } from "./atoms/cta";
import { cn } from "../utils/cn";
import { resolveYextEntityField, useDocument, YextEntityField, YextEntityFieldSelector } from "@yext/visual-editor";
import { config } from "../templates/location";
import { Cta, LocationStream } from "../types/autogen";

export interface CTAWrapperProps extends CTAProps {
  entityField: YextEntityField
}

const ctaWrapperFields: Fields<CTAWrapperProps> = {
  entityField: YextEntityFieldSelector<typeof config>({
    label: "Entity Field",
    filter: {
      types: ["c_cta"],
    },
  }),
  variant: {
    type: "select",
    label: "Variant",
    options: [
      { label: "Default", value: "default" },
      { label: "Secondary", value: "secondary" },
      { label: "Outline", value: "outline" },
      { label: "Link", value: "link" },
    ],
  },
};

const CTAWrapper: React.FC<CTAWrapperProps> = ({
  entityField,
  variant,
  className,
  ...rest
}) => {
  const document = useDocument<LocationStream>();
  const cta = resolveYextEntityField<Cta>(document, entityField);

  return (
    <CTA
      label={cta?.name}
      url={cta?.link ?? "#"}
      variant={variant}
      className={cn(className)}
      {...rest}
    />
  );
};

export const CTAWrapperComponent: ComponentConfig<CTAWrapperProps> = {
  label: "Call to Action",
  fields: ctaWrapperFields,
  defaultProps: {
    entityField: {
      field: "",
      constantValue: ""
    },
    variant: "default",
  },
  render: (props) => <CTAWrapper {...props} />,
};

export { CTAWrapper };
