import * as React from "react";
import { ComponentConfig, Fields } from "@measured/puck";
import {
  EntityField,
  YextEntityField,
  resolveYextEntityField,
  YextEntityFieldSelector,
  useDocument,
} from "@yext/visual-editor";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const textListVariants = cva("ve-list-inside", {
  variants: {
    fontWeight: {
      default: "",
      thin: "ve-font-thin",
      extralight: "ve-font-extralight",
      light: "ve-font-light",
      normal: "ve-font-normal",
      medium: "ve-font-medium",
      semibold: "ve-font-semibold",
      bold: "ve-font-bold",
      extrabold: "ve-font-extrabold",
      black: "ve-font-black",
    },
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      text: "text-text",
      background: "text-primary-background",
    },
    textTransform: {
      none: "",
      uppercase: "ve-uppercase",
      lowercase: "ve-lowercase",
      capitalize: "ve-capitalize",
    },
  },
  defaultVariants: {
    fontWeight: "default",
    color: "default",
    textTransform: "none",
  },
});

export interface TextListProps
  extends VariantProps<typeof textListVariants> {
  list: YextEntityField;
  textSize?: number;
}

const textListFields: Fields<TextListProps> = {
  list: YextEntityFieldSelector({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
      // includeListsOnly: true, // TODO: Uncomment this once the VE library package has been updated
    },
  }),
  textSize: {
    label: "Text Size",
    type: "number",
    min: 1,
  },
  fontWeight: {
    label: "Font Weight",
    type: "select",
    options: [
      { label: "Default", value: "default" },
      { label: "Thin", value: "thin" },
      { label: "Extra Light", value: "extralight" },
      { label: "Light", value: "light" },
      { label: "Normal", value: "normal" },
      { label: "Medium", value: "medium" },
      { label: "Semibold", value: "semibold" },
      { label: "Bold", value: "bold" },
      { label: "Extrabold", value: "extrabold" },
      { label: "Black", value: "black" },
    ],
  },
  color: {
    label: "Color",
    type: "select",
    options: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Accent", value: "accent" },
      { label: "Text", value: "text" },
      { label: "Background", value: "background" },
    ],
  },
  textTransform: {
    label: "Text Transform",
    type: "select",
    options: [
      { label: "None", value: "none" },
      { label: "Uppercase", value: "uppercase" },
      { label: "Lowercase", value: "lowercase" },
      { label: "Capitalize", value: "capitalize" },
    ],
  },
};

const TextList: React.FC<TextListProps> = ({
  list: textListField,
  textSize,
  fontWeight,
  color,
  textTransform,
}) => {
  const document = useDocument();
  let resolvedTextList: any = resolveYextEntityField(
    document,
    textListField
  );
  if (!resolvedTextList) {
    resolvedTextList = ["Sample text 1", "Sample text 2", "Sample text 3"];
  } else if (!Array.isArray(resolvedTextList)) {
    resolvedTextList = [resolvedTextList];
  }

  const dynamicStyles = {
    fontSize: textSize ? textSize + "px" : undefined,
  };

  return (
    <EntityField displayName="Text List" fieldId={textListField.field}>
      <ul
        className={cn(textListVariants({ fontWeight, color, textTransform }))}
        style={dynamicStyles ?? ""}
      >
        {resolvedTextList.map((text: any, index: any) => (
          <li key={index} className="ve-mb-2">{text}</li>
        ))}
      </ul>
    </EntityField>
  );
};

export const TextListComponent: ComponentConfig<TextListProps> = {
  label: "Text List",
  fields: textListFields,
  defaultProps: {
    list: {
      field: "",
      constantValue: "",
    },
  },
  render: (props) => <TextList {...props} />,
};

export { TextList, textListVariants };
