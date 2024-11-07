import { ComponentConfig, Fields } from "@measured/puck";
import "./index.css";
import {
  YextEntityField,
  resolveYextEntityField,
  YextEntityFieldSelector,
  Body,
  BodyProps,
  CTA,
  CTAProps,
  Heading,
  HeadingProps,
  Section,
  useDocument,
  NumberOrDefault,
  NumberFieldWithDefaultOption,
} from "@yext/visual-editor";
import { config } from "../templates/location";
import { LocationStream, Cta, ComplexImage } from "../types/autogen";

export type CardProps = {
  image: {
    photo: {
      entityField: YextEntityField<string>;
    };
  };
  heading: {
    text: {
      entityField: YextEntityField<string>;
    };
    fontSize: NumberOrDefault;
    color: HeadingProps["color"];
  };
  subheading: {
    text: string;
    fontSize: NumberOrDefault;
    weight: BodyProps["weight"];
  };
  body: {
    text: {
      entityField: YextEntityField<string>;
    };
    fontSize: NumberOrDefault;
    weight: BodyProps["weight"];
  };
  cta: {
    entityField: YextEntityField<string>;
    variant?: CTAProps["variant"];
  };
  alignment: "items-start" | "items-center";
};

const cardFields: Fields<CardProps> = {
  image: {
    type: "object",
    label: "Image",
    objectFields: {
      photo: {
        type: "object",
        label: "Entity Field",
        objectFields: {
          entityField: YextEntityFieldSelector<typeof config, string>({
            label: "Photo",
            filter: {
              types: ["type.image"],
            },
          }),
        },
      },
    },
  },
  heading: {
    type: "object",
    label: "Heading",
    objectFields: {
      text: {
        type: "object",
        label: "Entity Field",
        objectFields: {
          entityField: YextEntityFieldSelector<typeof config, string>({
            label: "Heading Text",
            filter: {
              types: ["type.string"],
            },
          }),
        },
      },
      fontSize: NumberFieldWithDefaultOption({
        label: "Font Size",
        defaultCustomValue: 24,
      }),
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
  subheading: {
    type: "object",
    label: "Subheading",
    objectFields: {
      text: {
        label: "Text",
        type: "text",
      },
      fontSize: NumberFieldWithDefaultOption({
        label: "Font Size",
        defaultCustomValue: 16,
      }),
      weight: {
        label: "Weight",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Bold", value: "bold" },
        ],
      },
    },
  },
  body: {
    type: "object",
    label: "Body",
    objectFields: {
      text: {
        type: "object",
        label: "Entity Field",
        objectFields: {
          entityField: YextEntityFieldSelector<typeof config, string>({
            label: "Body Text",
            filter: {
              types: ["type.string"],
            },
          }),
        },
      },
      fontSize: NumberFieldWithDefaultOption({
        label: "Font Size",
        defaultCustomValue: 16,
      }),
      weight: {
        label: "Weight",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Bold", value: "bold" },
        ],
      },
    },
  },
  cta: {
    type: "object",
    label: "CTA",
    objectFields: {
      entityField: YextEntityFieldSelector<typeof config, string>({
        label: "Entity Field",
        filter: {
          types: ["c_cta"],
        },
      }),
      variant: {
        label: "Variant",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
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
      { label: "Center", value: "items-center" },
    ],
  },
};

export const Card = ({
  image: imageField,
  heading,
  subheading,
  body,
  cta: ctaField,
  alignment,
}: CardProps) => {
  const document = useDocument<LocationStream>();
  // The null checks on the following lines are only necessary when upgrading a pre-existing field to use a mappable entity field
  const image = resolveYextEntityField<ComplexImage>(
    document,
    imageField?.photo?.entityField,
  )?.image;
  const cta = resolveYextEntityField<Cta>(document, ctaField?.entityField);

  return (
    <Section
      className={`flex flex-col justify-center bg-white components ${alignment}`}
      padding="small"
    >
      {image?.url && (
        <div
          style={{
            backgroundImage: `url('${image?.url}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: 200,
            width: "100%",
          }}
        />
      )}
      <div className="flex flex-col gap-y-3 p-8">
        <Heading
          level={2}
          style={{
            fontSize:
              heading.fontSize === "default"
                ? undefined
                : heading.fontSize + "px",
          }}
          color={heading.color}
        >
          {resolveYextEntityField(document, heading.text.entityField)}
        </Heading>
        <Body
          className="line-clamp-1"
          weight={subheading.weight}
          style={{
            fontSize:
              subheading.fontSize === "default"
                ? undefined
                : subheading.fontSize + "px",
          }}
        >
          {subheading.text}
        </Body>
        <Body
          className="line-clamp-5"
          weight={body.weight}
          style={{
            fontSize:
              body.fontSize === "default" ? undefined : body.fontSize + "px",
          }}
        >
          {resolveYextEntityField(document, body.text.entityField)}
        </Body>
        {cta && (
          <CTA
            variant={ctaField.variant}
            label={cta.name}
            url={cta.link ?? "#"}
          />
        )}
      </div>
    </Section>
  );
};

export const CardComponent: ComponentConfig<CardProps> = {
  fields: cardFields,
  defaultProps: {
    image: {
      photo: {
        entityField: {
          field: "",
          constantValue: "",
        },
      },
    },
    heading: {
      text: {
        entityField: {
          field: "",
          constantValue: "Heading Text",
          constantValueEnabled: true,
        },
      },
      fontSize: "default",
      color: "default",
    },
    subheading: {
      text: "subheading",
      fontSize: "default",
      weight: "default",
    },
    body: {
      text: {
        entityField: {
          field: "",
          constantValue: "Body Text",
          constantValueEnabled: true,
        },
      },
      fontSize: "default",
      weight: "default",
    },
    cta: {
      entityField: {
        field: "",
        constantValue: "",
      },
    },
    alignment: "items-center",
  },
  render: (props) => <Card {...props} />,
};
