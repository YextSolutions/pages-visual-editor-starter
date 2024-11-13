import {
  Address,
  AddressType,
  CTA,
  ImageProps,
  ImageType,
  Image,
} from "@yext/pages-components";
import { format_phone } from "../utils/reusableFunctions";
import { Mail, Phone } from "lucide-react";
import { ComponentConfig, FieldLabel, Fields } from "@measured/puck";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import Cta from "./cta";

interface HeroProps {
  showBackgroundImage?: boolean;
  bannerBackgroundColor: string;
  //@ts-ignore
  backgroundImage: YextEntityField;
  contentAlignment: string;
  //@ts-ignore
  photo: YextEntityField;
  blurBackground?: boolean;
  //@ts-ignore
  title: YextEntityField;
  //@ts-ignore
  subTitle: YextEntityField;
  //@ts-ignore
  address: YextEntityField;
  //@ts-ignore
  mainPhone: YextEntityField;
  //@ts-ignore
  emails: YextEntityField<string[]>;
  //@ts-ignore
  cta: YextEntityField;
}

const defaults: Fields<HeroProps> = {
  showBackgroundImage: {
    label: "Show background Image",
    type: "radio",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
  contentAlignment: {
    label: "Align Content",
    type: "radio",
    options: [
      {
        label: "Left",
        value: "justify-start",
      },
      {
        label: "Center",
        value: "justify-center",
      },
      {
        label: "Right",
        value: "justify-end",
      },
    ],
  },
  bannerBackgroundColor: {
    label: "Background color",
    type: "custom",
    render: ({ field, name, onChange, value }: any) => (
      <FieldLabel label={field.label}>
        <input
          type="color"
          defaultValue={value}
          name={name}
          onChange={(e) => onChange(e.currentTarget.value)}
          style={{ border: "1px solid black", padding: 4 }}
        />
      </FieldLabel>
    ),
  },
  //@ts-ignore
  backgroundImage: YextEntityFieldSelector<typeof config>({
    label: "Image",
    filter: {
      types: ["type.image"],
    },
  }),
  //@ts-ignore
  photo: YextEntityFieldSelector<typeof config>({
    label: "Image",
    filter: {
      types: ["type.image"],
    },
  }),
  blurBackground: {
    label: "Blur Background?",
    type: "radio",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
  //@ts-ignore
  title: YextEntityFieldSelector<typeof config>({
    label: "Title",
    filter: {
      types: ["type.string"],
    },
  }),
  //@ts-ignore
  subTitle: YextEntityFieldSelector<typeof config>({
    label: "Subtitle",
    filter: {
      types: ["type.string"],
    },
  }),
  // @ts-ignore
  address: YextEntityFieldSelector<typeof config>({
    label: "Address",
    filter: {
      types: ["type.address"],
    },
  }),
  //@ts-ignore
  mainPhone: YextEntityFieldSelector<typeof config>({
    label: "Phone",
    filter: {
      types: ["type.phone"],
    },
  }),
  //@ts-ignore
  cta: YextEntityFieldSelector<typeof config>({
    label: "CTA",
    filter: {
      types: ["type.cta"],
    },
  }),
  //@ts-ignore
  emails: YextEntityFieldSelector<typeof config>({
    label: "Emails",
    filter: {
      types: ["type.string"],
      allowList: ["emails"],
      includeListsOnly: true,
    },
  }),
};

/**
 *
 *  ✔ Should be able to change the hero details placements
 *  ✔ Fix CTA top spacing
 *  ✔ Add a headshot
 *  - Create Carousel Hero
 *  - Give an option to add secondary CTA
 *  - Add an announcement bar (between header and hero - https://www.salesforce.com/in/)
 *
 *
 */

const HeroCard = ({
  showBackgroundImage = false,
  backgroundImage: backgroundImageField,
  bannerBackgroundColor,
  title: titleField,
  subTitle: subTitleField,
  address: addressField,
  mainPhone: mainPhoneField,
  emails: emailsField,
  blurBackground = false,
  cta: ctaField,
  contentAlignment,
  photo: photoField,
}: HeroProps) => {
  const document = useDocument();
  const backgroundField = resolveYextEntityField<ImageProps["image"]>(
    document,
    backgroundImageField
  ) as ImageType;
  const photo = resolveYextEntityField<ImageProps["image"]>(
    document,
    photoField
  ) as ImageType;
  const address = resolveYextEntityField<AddressType>(
    document,
    addressField
  ) as AddressType;
  const title = resolveYextEntityField<string>(document, titleField);
  const subTitle = resolveYextEntityField<string>(document, subTitleField);
  const mainPhone = resolveYextEntityField<string>(document, mainPhoneField);
  const emails = resolveYextEntityField<string[]>(document, emailsField);
  const cta = resolveYextEntityField<CTA>(document, ctaField);

  return (
    <figure
      className={`bg-cover bg-center h-[450px] md:h-[500px] w-full bg-no-repeat ${
        showBackgroundImage && blurBackground ? "bg-black bg-opacity-65" : ""
      }`}
      style={{
        backgroundImage: showBackgroundImage
          ? `url("${backgroundField?.url}")`
          : undefined,
        backgroundColor: !showBackgroundImage
          ? bannerBackgroundColor
          : undefined,
      }}
    >
      <figcaption className="h-full w-full top-0 left-0 z-2">
        <div
          className={`${
            blurBackground && showBackgroundImage && "bg-black bg-opacity-65"
          } w-full flex items-center flex-col h-full !text-white`}
        >
          <header
            className={`${contentAlignment} p-12 h-full gap-4 w-full top-0 left-0 z-2 flex flex-col md:flex-row items-center mx-auto`}
          >
            {photo && (
              <figure className="grid place-items-center h-full">
                <Image
                  image={photo}
                  className="!w-32 md:!w-56 !h-56 !max-w-none rounded-full"
                />
              </figure>
            )}
            <section
              className={`${photo ? `text-start` : `text-center`} space-y-4`}
            >
              <h1 className="text-2xl md:text-4xl">{title}</h1>
              <address
                className={`text-base md:text-lg mb-4 space-y-2 not-italic flex flex-col justify-center ${photo ? `items-baseline` : `items-center`}`}
              >
                <Address
                  className="space-y-2"
                  address={address}
                  lines={[["line1"], ["city", ",", "region", "postalCode"]]}
                />
                {mainPhone && (
                  <EntityField
                    displayName="Body"
                    fieldId={
                      mainPhoneField.constantValueEnabled
                        ? "constant value"
                        : mainPhoneField.field
                    }
                  >
                    <a
                      href={`tel:${mainPhone}`}
                      className="flex gap-1 text-center items-center"
                    >
                      <Phone
                        className="md:h-5 md:w-5 h-4 w-4"
                        aria-hidden="true"
                      />
                      {format_phone(mainPhone)}
                    </a>
                  </EntityField>
                )}
                {emails?.[0] && (
                  <a
                    href={`mailto:${emails[0]}`}
                    className="flex gap-1 items-center"
                  >
                    <Mail
                      className="md:h-5 md:w-5 h-4 w-4"
                      aria-hidden="true"
                    />
                    {emails[0]}
                  </a>
                )}
              </address>
              {cta && (
                <Cta
                  cta={cta}
                  ctaType="primaryCta"
                  additionalClasses={photo ? `mr-auto` : `mx-auto`}
                />
              )}
            </section>
          </header>
        </div>
      </figcaption>
    </figure>
  );
};

const Hero: ComponentConfig<HeroProps> = {
  fields: defaults,
  defaultProps: {
    bannerBackgroundColor: "black",
    showBackgroundImage: false,
    backgroundImage: {
      label: "Background Image",
      field: "primaryPhoto",
      constantValue: "",
    },
    photo: {
      field: "primaryPhoto",
      constantValue: "",
    },
    contentAlignment: "Left",
    title: { label: "Hello", field: "", constantValue: "" },
    subTitle: { field: "", constantValue: "" },
    blurBackground: false,
    address: {
      field: "address",
      constantValue: "",
    },
    cta: {
      field: "",
      constantValue: {
        label: "",
        link: "",
        linkType: "",
      },
    },
    mainPhone: {
      field: "",
      constantValue: "1234567890",
      constantValueEnabled: false,
    },
    emails: { field: "", constantValue: [""] },
  },
  //@ts-expect-error
  resolveFields(data, { changed, lastFields, fields }) {
    if (!changed.showBackgroundImage) return lastFields;
    if (!data.props.showBackgroundImage) {
      return {
        ...fields,
        backgroundImage: undefined,
        blurBackground: undefined,
      };
    } else {
      return {
        ...fields,
        bannerBackgroundColor: undefined,
      };
    }
    return fields;
  },
  render: (props) => <HeroCard {...props} />,
};

export { Hero, HeroProps };
