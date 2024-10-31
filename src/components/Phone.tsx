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

const phoneVariants = cva("components", {
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
      primary: "text-palette-primary",
      secondary: "text-palette-secondary",
      accent: "text-palette-accent",
      text: "text-palette-text",
      background: "text-palette-background",
      foreground: "text-palette-foreground",
    },
  },
  defaultVariants: {
    fontWeight: "default",
    color: "default",
  },
});

export interface PhoneProps extends VariantProps<typeof phoneVariants> {
  phone: YextEntityField<string>;
  textSize?: number;
}

/*
 * formatUsPhoneNumber formats a US phone number into one of the following forms,
 * depending on whether the number includes the +1 area code:
 * +1 (123) 456-7890 or (123) 456-7890. If the number is not a US phone number,
 * it returns the original phone number string unchanged.
 */
const formatUsPhoneNumber = (phoneNumberString: string): string => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
};

const PhoneFields: Fields<PhoneProps> = {
  phone: YextEntityFieldSelector({
    label: "Entity Field",
    filter: {
      types: ["type.phone"],
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
};

const Phone: React.FC<PhoneProps> = ({
  phone,
  textSize,
  fontWeight,
  color,
}) => {
  const document = useDocument();
  const resolvedPhone: any = resolveYextEntityField(document, phone);

  const dynamicStyles = {
    fontSize: textSize ? textSize + "px" : undefined,
  };

  return (
    <EntityField displayName="Phone" fieldId={phone.field}>
      <p
        className={cn(phoneVariants({ fontWeight, color }))}
        style={dynamicStyles ?? ""}
      >
        {formatUsPhoneNumber(resolvedPhone)}
      </p>
    </EntityField>
  );
};

export const PhoneComponent: ComponentConfig<PhoneProps> = {
  label: "Phone",
  fields: PhoneFields,
  defaultProps: {
    textSize: 16,
    phone: {
      field: "mainPhone",
      constantValue: "",
    },
  },
  render: (props) => <Phone {...props} />,
};

export { Phone, phoneVariants };
