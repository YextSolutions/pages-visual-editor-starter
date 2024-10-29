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
import mailIcon from "../assets/mail_outline.svg";


const emailListVariants = cva("list-inside text-font-fontSize p-8", {
  variants: {
    fontSize: {
      xs: "text-xs",
      sm: "text-sm",
      medium: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },
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
      default: "",
      small: "px-4 py-8 md:px-8",
      medium: "px-4 py-16 md:px-8",
      large: "px-[200px] py-24 md:px-8",
    },
  },
  defaultVariants: {
    padding: "default",
    fontSize: "medium",
    fontWeight: "default",
    color: "default",
    textTransform: "none",
  },
});

export interface EmailListProps extends VariantProps<typeof emailListVariants> {
  list: YextEntityField<string[]>;
  includeHyperlink: boolean;
  listLength: number;
}

const EmailListFields: Fields<EmailListProps> = {
  list: YextEntityFieldSelector({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
      allowList: ["emails"],
      includeListsOnly: true,
    },
  }),
  fontSize: {
    label: "Font Size",
    type: "select",
    options: [
      { label: "Extra Small", value: "xs" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "lg" },
      { label: "Extra Large", value: "xl" },
      { label: "2xl", value: "2xl" },
      { label: "3xl", value: "3xl" },
      { label: "4xl", value: "4xl" },
      { label: "5xl", value: "5xl" },
    ],
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
  padding: {
    label: "Padding",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
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
  includeHyperlink: {
    label: "Include Hyperlink",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  listLength: {
    type: "number",
    label: "List Length",
    min: 1,
    max: 100,
  },
};

const EmailList: React.FC<EmailListProps> = ({
  list: emailListField,
  padding,
  fontSize,
  fontWeight,
  color,
  textTransform,
  includeHyperlink,
  listLength,
}) => {
  const document = useDocument();
  let resolvedEmailList: any = resolveYextEntityField(document, emailListField);
  if (!resolvedEmailList) {
    resolvedEmailList = ["sample_email1@gmail.com", "sample_email2@yahoo.com", "sample_email3@msn.com"];
  } else if (!Array.isArray(resolvedEmailList)) {
    resolvedEmailList = [resolvedEmailList];
  }

  return (
    <EntityField displayName="Email List" fieldId={emailListField.field}>
      <ul
        className={cn(
          emailListVariants({ padding, fontSize, fontWeight, color, textTransform }),
          `${includeHyperlink ? "text-blue-600 dark:text-blue-500 hover:underline" : ""}`
        )}
      >
        {resolvedEmailList.slice(0, Math.min(resolvedEmailList.length, listLength)).map((text: any, index: any) => (
          <li key={index} className={`mb-2 flex items-center`}>
            <img className={'m-2'} src={mailIcon}/>
            <span>
              {includeHyperlink ? <a href={text}>{text}</a> : text}
            </span>
          </li>
        ))}
      </ul>
    </EntityField>
  );
};

export const EmailListComponent: ComponentConfig<EmailListProps> = {
  label: "Emails",
  fields: EmailListFields,
  defaultProps: {
    list: {
      field: "",
      constantValue: [],
    },
    includeHyperlink: true,
    listLength: 5
  },
  render: (props) => <EmailList {...props} />,
};

export { EmailList, emailListVariants };
