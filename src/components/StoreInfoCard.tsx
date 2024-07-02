import { ComponentConfig, Fields } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import { LocationStream } from "../types/autogen";
import { Address, getDirections } from "@yext/pages-components";
import { Section } from "./atoms/section";
import { Heading, HeadingProps } from "./atoms/heading";
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

const storeInfoCardFields: Fields<StoreInfoCardProps> = {
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

const StoreInfoCard = ({ heading }: StoreInfoCardProps) => {
    const address = useDocument<LocationStream>((document) => document.address);
    const phoneNumber = formatPhoneNumber(useDocument<LocationStream>((document) => document.mainPhone));
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
                    lines={[['line1'], ['line2', 'city', 'region', 'postalCode']]}
                />
                <div className="pt-1" />
                <Link
                    cta={{ link: coordinates, label: "Get Directions", linkType: "URL" }}
                    className="font-bold text-primary hover:underline md:px-4;"
                />
                <IconContext.Provider
                    value={{ color: 'red' }}
                >
                    {
                        phoneNumber &&
                        <div
                            className="pt-1 gap-x-1.5 flex flex-row items-center">
                            <HiOutlinePhone />
                            {phoneNumber}
                        </div>
                    }
                    {
                        emails &&
                        <div
                            className="pt-1 gap-x-1.5 flex flex-row items-center underline text-primary">
                            <MdOutlineEmail />
                            {emails.join(",<br>")}
                        </div>
                    }
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
    },
    label: 'Store Info Card',
    render: ({ heading }) => (
        <StoreInfoCard
            heading={heading}
        />
    ),
};

function formatPhoneNumber(phoneNumberString?: string) {
    if (!phoneNumberString) {
        return null;
    }
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
}