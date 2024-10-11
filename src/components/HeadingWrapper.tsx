import * as React from "react";
import { ComponentConfig, Fields } from "@measured/puck";
import { Heading, HeadingProps, headingVariants } from "./atoms/heading";
import {
  EntityField,
  resolveYextEntityField,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import { config } from "../templates/location";
import { LocationStream } from "../types/autogen";
import { useDocument } from "@yext/pages/util";

export interface HeadingWrapperProps extends HeadingProps {
  text: YextEntityField;
}

const HeadingWrapper = React.forwardRef<
  HTMLHeadingElement,
  HeadingWrapperProps
>(({ text, ...headingProps }, ref) => {
  const document = useDocument<LocationStream>();

  return (
    <EntityField fieldId={text.field}>
      <Heading ref={ref} {...headingProps}>
        {resolveYextEntityField(document, text)}
      </Heading>
    </EntityField>
  );
});

HeadingWrapper.displayName = "HeadingWrapper";

const headingWrapperFields: Fields<HeadingWrapperProps> = {
  text: YextEntityFieldSelector<typeof config>({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
    },
  }),
  level: {
    type: "number",
    label: "Heading Level",
    min: 1,
    max: 6,
  },
  size: {
    type: "select",
    options: [
      { value: "page", label: "Page" },
      { value: "section", label: "Section" },
      { value: "subheading", label: "Subheading" },
    ],
  },
  color: {
    type: "select",
    options: [
      { value: "default", label: "Default" },
      { value: "primary", label: "Primary" },
      { value: "secondary", label: "Secondary" },
      { value: "accent", label: "Accent" },
    ],
  },
};

export const HeadingWrapperComponent: ComponentConfig<HeadingWrapperProps> = {
  fields: headingWrapperFields,
  defaultProps: {
    text: {
      field: "",
      constantValue: "Text",
      constantValueEnabled: true,
    },
    content: "Heading",
    level: 2,
    size: "section",
    color: "default",
  },
  render: (props) => <HeadingWrapper {...props} />,
};

export { HeadingWrapper, headingVariants };
