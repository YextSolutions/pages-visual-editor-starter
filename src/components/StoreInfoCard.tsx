import { ComponentConfig, Fields } from "@measured/puck";
import { useDocument } from "@yext/pages/util";
import { LocationStream } from "../types/autogen";
import {Address, AddressType, getDirections} from "@yext/pages-components";
import { Section } from "./atoms/section";
import { Heading, HeadingProps } from "./atoms/heading";
import { Link } from "@yext/pages-components";
import { IconContext } from "react-icons";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
import { EntityField } from "@yext/visual-editor";
import "@yext/pages-components/style.css";
import {CardProps} from "./Card";

export type StoreInfoCardProps = {
  heading: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  alignment: CardProps["alignment"];
};

const storeInfoCardFields: Fields<StoreInfoCardProps> = {
  heading: {
    type: "object",
    label: "Heading",
    objectFields: {
      text: {
        label: "Text",
        type: "text",
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
    },
  },
  alignment: {
    label: "Align card",
    type: "radio",
    options: [
      { label: "Left", value: "items-start" },
      { label: "Center", value: "items-center"},
    ]
  }
};

const StoreInfoCard = ({ heading, alignment }: StoreInfoCardProps) => {
  const {address, mainPhone, emails} = useDocument<LocationStream>();
  const phoneNumber = formatPhoneNumber(mainPhone);
  const coordinates = getDirections(address as AddressType);

  return (
    <Section
      className={`flex flex-col justify-center components ${alignment}`}
      padding="small"
    >
      <div>
        <Heading
          level={2}
          size={heading.size}
          className={"mb-4"}
          color={heading.color}
        >
          {heading.text}
        </Heading>
        <EntityField displayName="Address" fieldId="address">
          <Address
            address={address as AddressType}
            lines={[["line1"], ["line2", "city", "region", "postalCode"]]}
          />
        </EntityField>
        <div className="pt-2.5" />
        <Link
          cta={{ link: coordinates, label: "Get Directions", linkType: "URL" }}
          className="font-bold text-primary no-underline hover:underline md:px-4;"
        />
        <IconContext.Provider value={{ color: "red" }}>
          {phoneNumber && (
            <EntityField displayName="Phone Number" fieldId="mainPhone">
              <div className="pt-2.5 gap-x-1.5 flex flex-row items-center">
                <HiOutlinePhone />
                {phoneNumber}
              </div>
            </EntityField>
          )}
          {emails && (
            <EntityField displayName="Emails" fieldId="emails">
              <div>
                {emails.map((email: any) => (
                  <div
                    className="pt-2.5 gap-x-1.5 flex flex-row items-center"
                    key="email"
                  >
                    <MdOutlineEmail />
                    <Link
                      cta={{ link: email, label: email, linkType: "Email" }}
                      className="no-underline hover:underline text-primary"
                    />
                  </div>
                ))}
              </div>
            </EntityField>
          )}
        </IconContext.Provider>
      </div>
    </Section>
  );
};

export const StoreInfoCardComponent: ComponentConfig<StoreInfoCardProps> = {
  fields: storeInfoCardFields,
  defaultProps: {
    heading: {
      text: "Information",
      size: "subheading",
      color: "default",
    },
    alignment: "items-center"
  },
  label: "Store Info Card",
  render: ({ heading, alignment }) => <StoreInfoCard heading={heading} alignment={alignment}/>,
};

function formatPhoneNumber(phoneNumberString?: string) {
  if (!phoneNumberString) {
    return null;
  }
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return ["(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
}
