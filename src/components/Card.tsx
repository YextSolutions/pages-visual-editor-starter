import { ComponentConfig, Fields } from "@measured/puck";
import { BodyProps, Body } from "./atoms/body";
import { CTA, CTAProps } from "./atoms/cta";
import { Heading, HeadingProps } from "./atoms/heading";
import { Section } from "./atoms/section";
import "./index.css";

export type CardProps = {
  image?: {
    url?: string;
  };
  heading: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  subheading: {
    text: string;
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  body: {
    text: string;
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  cta?: {
    label?: string;
    link?: string;
    variant?: CTAProps["variant"];
  };
  alignment: "items-start" | "items-center";
};

const cardFields: Fields<CardProps> = {
  image: {
    type: "object",
    objectFields: {
      url: { 
        label: "Url",
        type: "text" 
      },
    },
  },
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
  subheading: {
    type: "object",
    label: "Subheading",
    objectFields: {
      text: { 
        label: "Text",
        type: "text" 
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
        label: "Text",
        type: "textarea" 
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
      label: { 
        label: "Label",
        type: "text" 
      },
      link: { 
        label: "Link",
        type: "text" 
      },
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
      { label: "Center", value: "items-center"},
    ]
  }
};

export const Card = ({ image, heading, subheading, body, cta, alignment }: CardProps) => {
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
        <Heading level={2} size={heading.size} color={heading.color}>
          {heading.text}
        </Heading>
        <Body
          className="line-clamp-1"
          weight={subheading.weight}
          size={subheading.size}
        >
          {subheading.text}
        </Body>
        <Body 
          className="line-clamp-5"
          weight={body.weight}
          size={body.size}
        >
          {body.text}
        </Body>
        {cta && (
          <CTA variant={cta.variant} label={cta.label} url={cta.link ?? "#"} />
        )}
      </div>
    </Section>
  );
};

export const CardComponent: ComponentConfig<CardProps> = {
  fields: cardFields,
  defaultProps: {
    heading: {
      text: "heading",
      size: "section",
      color: "default",
    },
    subheading: {
      text: "subheading",
      size: "small",
      weight: "default",
    },
    body: {
      text: "body",
      size: "base",
      weight: "default",
    },
    alignment: "items-center"
  },
  render: ({ image, heading, subheading, body, cta, alignment }) => (
    <Card
      image={image}
      heading={heading}
      subheading={subheading}
      body={body}
      cta={cta}
      alignment={alignment}
    />
  ),
};
