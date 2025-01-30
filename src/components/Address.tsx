import * as React from "react";
import { ComponentConfig, Fields } from "@measured/puck";
import {
  AddressType,
  getDirections,
  Link,
  Address as RenderAddress,
} from "@yext/pages-components";
import { Section, sectionVariants } from "./atoms/section.js";
import "@yext/pages-components/style.css";
import { VariantProps } from "class-variance-authority";
import {
  useDocument,
  resolveYextEntityField,
  EntityField,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";

type AddressProps = {
  address: YextEntityField<AddressType>;
  alignment: "items-start" | "items-center";
  padding: VariantProps<typeof sectionVariants>["padding"];
  showGetDirections: boolean;
};

const addressFields: Fields<AddressProps> = {
  address: YextEntityFieldSelector<any, AddressType>({
    label: "Address",
    filter: { types: ["type.address"] },
  }),
  alignment: {
    label: "Align card",
    type: "radio",
    options: [
      { label: "Left", value: "items-start" },
      { label: "Center", value: "items-center" },
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
  showGetDirections: {
    label: "Show Get Directions Link",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};

const Address = ({
  alignment,
  padding,
  address: addressField,
  showGetDirections,
}: AddressProps) => {
  const a = 123;

  // @ts-expect-error ahwejgha
  a.replace("abc", 123);

  const document = useDocument();
  const address = resolveYextEntityField(document, addressField);
  const coordinates = getDirections(
    address as AddressType,
    undefined,
    undefined,
    { provider: "google" }
  );

  return (
    <Section
      className={`flex flex-col justify-center components ${alignment} font-body-fontFamily font-body-fontWeight text-body-fontSize text-body-color`}
      padding={padding}
    >
      {address && (
        <div>
          <EntityField
            displayName="Address"
            fieldId={addressField.field}
            constantValueEnabled={addressField.constantValueEnabled}
          >
            <RenderAddress
              address={address as AddressType}
              lines={[["line1"], ["line2", "city", "region", "postalCode"]]}
            />
            {coordinates && showGetDirections && (
              <Link
                cta={{
                  link: coordinates,
                  label: "Get Directions",
                  linkType: "URL",
                }}
                target="_blank"
                className="font-bold text-palette-primary underline hover:no-underline md:px-4;"
              />
            )}
          </EntityField>
        </div>
      )}
    </Section>
  );
};

const AddressComponent: ComponentConfig<AddressProps> = {
  fields: addressFields,
  defaultProps: {
    alignment: "items-start",
    padding: "none",
    address: {
      field: "address",
      constantValue: {
        line1: "",
        city: "",
        region: "",
        postalCode: "",
        countryCode: "",
      },
    },
    showGetDirections: true,
  },
  label: "Address",
  render: (props) => <Address {...props} />,
};

export { type AddressProps, AddressComponent as Address };
