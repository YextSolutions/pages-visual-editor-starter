import {
  Address,
  AddressType,
  CTA,
  ImageProps,
  ImageType,
} from "@yext/pages-components";
import { format_phone } from "../utils/reusableFunctions";
import { Mail, Phone } from "lucide-react";
import { ComponentConfig, Fields } from "@measured/puck";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import Cta from "./cta";

interface HeroProps {
  //@ts-ignore
  backgroundImage: YextEntityField;
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
  //@ts-ignore
  backgroundImage: YextEntityFieldSelector<typeof config>({
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

const HeroCard = ({
  backgroundImage: backgroundImageField,
  title: titleField,
  subTitle: subTitleField,
  address: addressField,
  mainPhone: mainPhoneField,
  emails: emailsField,
  blurBackground = false,
  cta: ctaField,
}: HeroProps) => {
  const document = useDocument();
  const backgroundField = resolveYextEntityField<ImageProps["image"]>(
    document,
    backgroundImageField
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
    <section className="relative h-auto Hero">
      <figure
        className="bg-cover bg-center h-[450px] md:h-[500px]"
        style={{
          backgroundImage: `url("${backgroundField?.url}")`,
        }}
      >
        <figcaption className="h-full w-full absolute top-0 left-0 z-2">
          <div
            className={`${
              blurBackground ? `bg-black bg-opacity-65` : `bg-slate-600`
            } w-full absolute flex items-center justify-center flex-col h-full !text-white`}
          >
            <header className="py-12 h-full gap-4 w-full absolute top-0 left-0 z-2 flex flex-col md:flex-row justify-center items-center mx-auto">
              <section className="text-center space-y-2">
                <h1 className="text-2xl md:text-4xl">{title}</h1>
                <address className="text-base md:text-lg mb-4 space-y-2 not-italic flex flex-col justify-center items-center">
                  <Address
                    className="space-y-2"
                    address={address}
                    lines={[["line1"], ["city", ",", "region", "postalCode"]]}
                  />
                  {mainPhone && (
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
                    additionalClasses="mx-auto"
                  />
                )}
              </section>
            </header>
          </div>
        </figcaption>
      </figure>
    </section>
  );
};

const Hero: ComponentConfig<HeroProps> = {
  fields: defaults,
  defaultProps: {
    backgroundImage: { field: "primaryPhoto", constantValue: "" },
    title: { field: "", constantValue: "" },
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
    mainPhone: { field: "", constantValue: "" },
    emails: { field: "", constantValue: [""] },
  },
  render: (props) => <HeroCard {...props} />,
};

export { Hero, HeroProps };
