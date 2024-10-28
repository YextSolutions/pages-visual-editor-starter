import { ComponentConfig, Fields } from "@measured/puck";
import { BodyProps, Body } from "./atoms/body";
import { CTA, CTAProps } from "./atoms/cta";
import { Heading, HeadingProps } from "./atoms/heading";
import { Section } from "./atoms/section";
import "./index.css";
import {
  YextEntityField,
  resolveYextEntityField,
  YextEntityFieldSelector,
  useDocument,
} from "@yext/visual-editor";
import { config } from "../templates/location";
import { LocationStream, Cta } from "../types/autogen";
import {ImageType, Image, ImageProps} from "@yext/pages-components";
import * as React from "react";

export type CardProps = {
  image: {
    photo: {
      entityField: YextEntityField<ImageType>;
    };
  };
  heading: {
    text: {
      entityField: YextEntityField<string>;
    };
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  subheading: {
    text: string;
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  body: {
    text: {
      entityField: YextEntityField<string>;
    };
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  cta: {
    entityField: YextEntityField<CTAProps>;
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
          entityField: YextEntityFieldSelector<typeof config, ImageType>({
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
  subheading: {
    type: "object",
    label: "Subheading",
    objectFields: {
      text: {
        label: "Text",
        type: "text",
      },
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Small", value: "small" },
          { label: "Base", value: "base" },
          { label: "Large", value: "large" },
        ],
      },
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
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Small", value: "small" },
          { label: "Base", value: "base" },
          { label: "Large", value: "large" },
        ],
      },
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
  const resolvedImage = resolveYextEntityField<ImageProps["image"]>(
    document,
    imageField?.photo?.entityField
  );
  const cta = resolveYextEntityField<Cta>(document, ctaField?.entityField);

  return (
    <Section
      className={`flex flex-col justify-center bg-white components ${alignment}`}
      padding="small"
    >
      {!!resolvedImage &&
          <Image image={resolvedImage} className="w-full h-full object-cover" />
      }
      <div className="flex flex-col gap-y-3 p-8">
        <Heading level={2} size={heading.size} color={heading.color}>
          {resolveYextEntityField(document, heading.text.entityField)}
        </Heading>
        <Body
          className="line-clamp-1"
          weight={subheading.weight}
          size={subheading.size}
        >
          {subheading.text}
        </Body>
        <Body className="line-clamp-5" weight={body.weight} size={body.size}>
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
  label: "Card",
  fields: cardFields,
  defaultProps: {
    image: {
      photo: {
        entityField: {
          field: "",
          constantValue: {
            width: 1000,
            height: 200,
            url: "https://placehold.co/1000x200"
          }
        },
      },
    },
    heading: {
      text: {
        entityField: {
          field: "",
          constantValue: "Heading Text",
          constantValueEnabled: true
        },
      },
      size: "section",
      color: "default",
    },
    subheading: {
      text: "subheading",
      size: "small",
      weight: "default",
    },
    body: {
      text: {
        entityField: {
          field: "",
          constantValue: "Body Text",
          constantValueEnabled: true
        },
      },
      size: "base",
      weight: "default",
    },
    cta: {
      entityField: {
        field: "",
        constantValue: {}
      },
    },
    alignment: "items-center",
  },
  render: (props) => <Card {...props} />,
};
