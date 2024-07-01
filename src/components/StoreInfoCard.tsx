import {ComponentConfig, Fields} from "@measured/puck";
import {useDocument} from "../hooks/useDocument";
import {LocationStream, Hours} from "../types/autogen";
import { Address, getDirections, HoursTable, HoursType} from "@yext/pages-components";
import {Section} from "./atoms/section";
import {Heading, HeadingProps} from "./atoms/heading";
import { Link } from "@yext/pages-components";
import { IconContext } from "react-icons";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";


import "@yext/pages-components/style.css";

export type StoreInfoCardProps = {
  heading: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
};
const hoursCardFields: Fields<StoreInfoCardProps> = {
  heading: {
    type: "object",
    label: "Heading",
    objectFields: {
      text: {
        label: "Text",
        type: "text"
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
};

const HoursCard = ({heading}: StoreInfoCardProps) => {
  const address = useDocument<LocationStream>((document) => document.address);
  const phoneNumber = useDocument<LocationStream>((document) => document.mainPhone);
  const emails = useDocument<LocationStream>((document) => document.emails);
  const coordinates = getDirections(address);
 
  return (
      <Section
        className='flex flex-col justify-center components items-center'
        padding='small'
      >
        <div>
          <Heading
              level={2}
              size={heading.size}
              className={'mb-4'}
              color={heading.color}
          >
            {heading.text}
          </Heading>
          <Address
              address={address}
          />
          <Link
                key={0}
                href={coordinates}
                className="hover:text-gray-300"
              >
                {'Get Directions'}
              </Link>
        <IconContext.Provider
        value={{ color: 'red'}}
        >
          <HiOutlinePhone />
          <div>{phoneNumber}</div>
          <MdOutlineEmail/>
          <div>{emails}</div>
        </IconContext.Provider>
        </div>
      </Section>
  );
};

export const StoreInfoCardComponent: ComponentConfig<StoreInfoCardProps> = {
  fields: hoursCardFields,
  defaultProps: {
    heading: {
      text: "Hours",
      size: "subheading",
      color: "default",
    },
  },
  label: 'Store Info Card',
  render: ({heading}) => (
    <HoursCard
      heading={heading}
    />
  ),
};