import {
  Address,
  AddressType,
  ImageProps,
  ImageType,
} from "@yext/pages-components";
import { format_phone } from "../utils/reusableFunctions";
import { Mail, Phone } from "lucide-react";
import { ComponentConfig, Fields } from "@measured/puck";
import {
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";

interface emailProps {
  email: string;
}

interface HeroProps {
  //@ts-ignore
  backgroundImage: YextEntityField;
  title: string;
  subTitle: string;
  //@ts-ignore
  address: YextEntityField;
  mainPhone: string;
  emails: emailProps[];
}

const defaults: Fields<HeroProps> = {
  //@ts-ignore
  backgroundImage: YextEntityFieldSelector<typeof config>({
    label: "Image",
    filter: {
      types: ["type.image"],
    },
  }),
  title: {
    label: "Heading",
    type: "text",
  },
  subTitle: {
    label: "Subheading",
    type: "text",
  },

  // @ts-ignore
  address: YextEntityFieldSelector<typeof config>({
    label: "Address",
    filter: {
      types: ["type.address"],
    },
  }),

  mainPhone: {
    label: "Main Phone",
    type: "text",
  },
  emails: {
    label: "Emails",
    type: "array",
    arrayFields: {
      email: {
        label: "Emails",
        type: "text",
      },
    },
  },
};

const HeroCard = ({
  backgroundImage: backgroundImageField,
  title,
  subTitle,
  address: addressField,
  mainPhone,
  emails,
}: HeroProps) => {
  const document = useDocument();
  const _backgroundField = resolveYextEntityField<ImageProps["image"]>(
    document,
    backgroundImageField
  ) as ImageType;
  const _addressField = resolveYextEntityField<AddressType>(
    document,
    addressField
  ) as AddressType;

  return (
    <section className="relative h-auto Hero">
      <figure
        className="bg-cover bg-center h-[450px] md:h-[500px]"
        style={{
          backgroundImage: `url("${_backgroundField?.url}")`,
        }}
      >
        <figcaption className="h-full w-full absolute top-0 left-0 z-2">
          <div
            className="w-full absolute bg-black bg-opacity-65 flex items-center justify-center flex-col h-full text-white"
            style={{ color: "white !important" }}
          >
            <header className="py-12 h-full gap-4 w-full absolute top-0 left-0 z-2 flex flex-col md:flex-row justify-center items-center mx-auto">
              <section className="text-center space-y-2">
                <h1 className="text-2xl md:text-4xl">{title}</h1>
                <p className="text-lg md:text-2xl">{_addressField?.city}</p>
                <address className="text-base md:text-lg mb-4 space-y-2 not-italic flex flex-col justify-center items-center">
                  <Address
                    className="space-y-2"
                    address={_addressField as AddressType}
                    lines={[["line1"], ["city", ",", "region", "postalCode"]]}
                  />
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
                  <a
                    href={`mailto:${emails[0]}`}
                    className="flex gap-1 items-center"
                  >
                    <Mail
                      className="md:h-5 md:w-5 h-4 w-4"
                      aria-hidden="true"
                    />
                    {emails[0].email}
                  </a>
                </address>
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
    title: "Title",
    subTitle: "Sub title",

    address: {
      field: "address",
      constantValue: "",
    },
    mainPhone: "1234567",
    emails: [{ email: "test@test.com" }],
  },
  render: (props) => <HeroCard {...props} />,
};

export { Hero, HeroProps };
