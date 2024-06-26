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
    size: HeadingProps["size"];
    color: HeadingProps["color"];
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
};

const cardFields: Fields<CardProps> = {
  image: {
    type: "object",
    objectFields: {
      url: { type: "text" },
    },
  },
  heading: {
    type: "object",
    label: "Location Name",
    objectFields: {
      text: { type: "text" },
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
      text: { type: "text" },
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
  body: {
    type: "object",
    label: "Body",
    objectFields: {
      text: { type: "text" },
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Small", value: "small" },
          { label: "Base", value: "base" },
          { label: "Large", value: "Large" },
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
      label: { type: "text" },
      link: { type: "text" },
      variant: {
        label: "Variant",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Outline", value: "outline" },
          { label: "Link", value: "link" },
        ],
      },
    },
  },
};

const Card = ({ image, heading, subheading, body, cta }: CardProps) => {
  return (
    <Section className="components">
      {image?.url && (
        <div
          style={{
            backgroundImage: `url('${image?.url}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderRadius: 24,
            height: 356,
            width: "100%",
          }}
        />
      )}
      <Heading level={2} size={heading.size} color={heading.color}>
        {heading.text}
      </Heading>
      <Heading level={1} size={subheading.size} color={subheading.color}>
        {subheading.text}
      </Heading>
      <Body weight={body.weight} size={body.size}>
        {body.text}
      </Body>
      {cta && (
        <CTA variant={cta.variant} label={cta.label} url={cta.link ?? "#"} />
      )}
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
      text: "heading",
      size: "subheading",
      color: "default",
    },
    body: {
      text: "body",
      size: "base",
      weight: "default",
    },
  },
  render: ({ image, heading, subheading, body, cta }) => (
    <Card
      image={image}
      heading={heading}
      subheading={subheading}
      body={body}
      cta={cta}
    />
  ),
};
