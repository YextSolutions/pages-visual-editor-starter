import { ComponentConfig, Fields } from "@measured/puck";
import { Heading, HeadingProps } from "../atoms/heading";
import {
  EntityFieldType,
  YextEntityFieldSelector,
  resolveYextEntityField,
} from "@yext/visual-editor";
import { useDocument } from "@yext/pages/util";
export type HeadingTextProps = {
  text: EntityFieldType;
  size: HeadingProps["size"];
  color: HeadingProps["color"];
};

const headingTextFields: Fields<HeadingTextProps> = {
  text: {
    type: "object",
    label: "Heading",
    objectFields: {
      //@ts-expect-error ts(2322)
      entityField: YextEntityFieldSelector<typeof config>({
        label: "Entity Field",
        filter: {
          types: ["type.string"],
          includeSubfields: true,
        },
      }),
    },
  },
  size: {
    label: "Size",
    type: "radio",
    options: [
      { label: "Section", value: "section" },
      { label: "Subheading", value: "subheading" },
    ],
  },

  color: {
    label: "Color",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
    ],
  },
};

const HeadingText = ({ text, size, color }: HeadingTextProps) => {
  const document = useDocument();
  return (
    <Heading size={size} color={color}>
      {resolveYextEntityField(document, text)}
    </Heading>
  );
};

const HeadingTextComponent: ComponentConfig<HeadingTextProps> = {
  fields: headingTextFields,
  defaultProps: {
    text: {
      fieldName: "",
      staticValue: "Heading Text", // default constant value
    },
    size: "section",
    color: "default",
  },
  label: "Heading Text",
  // resolveData: (props, changed) =>
  //   resolveYextEntityField<HeadingTextProps>("myField", props, changed),
  render: (props) => <HeadingText {...props} />,
};

export { HeadingText, HeadingTextComponent, headingTextFields };
