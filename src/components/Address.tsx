import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream, Address as AddressEntity } from "../types/autogen";
import {
  AddressType,
  getDirections,
  GetDirectionsConfig,
  Link,
  Address as RenderAddress,
} from "@yext/pages-components";
import { Section, sectionVariants } from "./atoms/section";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import "./index.css";
import "@yext/pages-components/style.css";
import { CardProps } from "./Card";
import { VariantProps } from "class-variance-authority";
import { config } from "../templates/location";

export type AddressProps = {
  address: YextEntityField<AddressType>;
  getDirectionsProvider: GetDirectionsConfig["provider"];
  alignment: CardProps["alignment"];
  padding: VariantProps<typeof sectionVariants>["padding"];
};

const addressFields: Fields<AddressProps> = {
  address: YextEntityFieldSelector<typeof config, AddressType>({
    label: "Address",
    filter: { types: ["type.address"] },
  }),
  getDirectionsProvider: {
    label: "Maps Provider",
    type: "radio",
    options: [
      { label: "Google", value: "google" },
      { label: "Apple", value: "apple" },
      { label: "Bing", value: "bing" },
    ],
  },
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
};

const Address = ({
  alignment,
  padding,
  address: addressField,
  getDirectionsProvider,
}: AddressProps) => {
  const document = useDocument<LocationStream>();
  const address = resolveYextEntityField<AddressEntity>(document, addressField);
  console.log(1);
  const coordinates = getDirections(
    address as AddressType,
    undefined,
    undefined,
    { provider: getDirectionsProvider }
  );
  console.log(coordinates);

  return (
    <Section
      className={`flex flex-col justify-center components ${alignment} font-body-fontWeight text-body-fontSize text-body-color`}
      padding={padding}
    >
      {address && (
        <div>
          <EntityField
            displayName="Address"
            fieldId={
              addressField.constantValueEnabled ? "constant value" : "address"
            }
          >
            <RenderAddress
              address={address as AddressType}
              lines={[["line1"], ["line2", "city", "region", "postalCode"]]}
            />
            {coordinates && (
              <Link
                cta={{
                  link: coordinates,
                  label: "Get Directions",
                  linkType: "URL",
                }}
                target="_blank"
                className="font-bold text-primary no-underline hover:underline md:px-4;"
              />
            )}
          </EntityField>
        </div>
      )}
    </Section>
  );
};

export const AddressComponent: ComponentConfig<AddressProps> = {
  fields: addressFields,
  defaultProps: {
    alignment: "items-start",
    padding: "none",
    getDirectionsProvider: "google",
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
  },
  label: "Address",
  render: (props) => <Address {...props} />,
};
