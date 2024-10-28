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

const textListVariants = cva("list-inside text-font-fontSize p-8", {
  variants: {
    fontWeight: {
      default: "font-body-fontWeight",
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    color: {
      default: "text-body-color",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      text: "text-text",
      background: "text-background",
      foreground: "text-foreground",
    },
    textTransform: {
      none: "",
      uppercase: "ve-uppercase",
      lowercase: "ve-lowercase",
      capitalize: "ve-capitalize",
    },
    padding: {
      default: "px-4 py-16 md:px-8",
      none: "p-0",
      small: "px-4 py-8 md:px-8",
      large: "px-[200px] py-24 md:px-8",
    },
  },
  defaultVariants: {
    padding: "none",
    fontWeight: "default",
    color: "default",
    textTransform: "none",
  },
});

export interface TextListProps extends VariantProps<typeof textListVariants> {
  list: YextEntityField<string[]>;
  textSize?: number;
}

const textListFields: Fields<TextListProps> = {
  list: YextEntityFieldSelector({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
      includeListsOnly: true,
    },
  }),
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
  padding: {
    label: "Padding",
    type: "radio",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "default" },
      { label: "Large", value: "large" },
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
  padding,
  fontWeight,
  color,
  textTransform,
}) => {
  const document = useDocument();
  let resolvedTextList: any = resolveYextEntityField(document, textListField);
  if (!resolvedTextList) {
    resolvedTextList = ["Sample text 1", "Sample text 2", "Sample text 3"];
  } else if (!Array.isArray(resolvedTextList)) {
    resolvedTextList = [resolvedTextList];
  }

  return (
    <EntityField displayName="Text List" fieldId={textListField.field}>
      <ul
        className={cn(
          textListVariants({ padding, fontWeight, color, textTransform }),
          "list-disc"
        )}
      >
        {resolvedTextList.map((text: any, index: any) => (
          <li key={index} className="mb-2">
            {text}
          </li>
        ))}
      </ul>
    </EntityField>
  );
};

export const TextListComponent: ComponentConfig<TextListProps> = {
  label: "Text List",
  fields: textListFields,
  defaultProps: {
    padding: "none",
    list: {
      field: "",
      constantValue: [],
    },
  },
  render: (props) => <TextList {...props} />,
};

export { TextList, textListVariants };
