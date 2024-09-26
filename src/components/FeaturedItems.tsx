import { ComponentConfig, Fields } from "@measured/puck";
import { Body, BodyProps } from "./atoms/body";
import { CTA, CTAProps } from "./atoms/cta";
import { Heading, HeadingProps } from "./atoms/heading";
import { LocationStream } from "../types/autogen";
import { useDocument } from "@yext/pages/util";
import { Section } from "./atoms/section";
import { EntityField } from "@yext/visual-editor";

export type FeaturedItemsProps = {
  heading: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  cards: {
    heading: {
      size: HeadingProps["size"];
      color: HeadingProps["color"];
    };
    subheading: {
      size: BodyProps["size"];
      weight: BodyProps["weight"];
    };
    body: {
      size: BodyProps["size"];
      weight: BodyProps["weight"];
    };
    cta?: {
      variant: CTAProps["variant"];
    };
  };
};

const featuredItemsFields: Fields<FeaturedItemsProps> = {
  heading: {
    type: "object",
    label: "Heading",
    objectFields: {
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
  cards: {
    type: "object",
    label: "Cards",
    objectFields: {
      heading: {
        type: "object",
        label: "Heading",
        objectFields: {
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
    },
  },
};

const FeaturedItems = ({ heading, cards }: FeaturedItemsProps) => {
  const { c_productSection: productSection } = useDocument<LocationStream>();
  return (
    <Section className="flex flex-col justify-center bg-white components">
      {productSection.sectionTitle && (
        <EntityField
          displayName="Product Section Title"
          fieldId="c_productSection.sectionTitle"
        >
          <Heading size={heading.size} color={heading.color}>
            {productSection.sectionTitle}
          </Heading>
        </EntityField>
      )}
      {productSection.linkedProducts && (
        <EntityField displayName="Linked Entities" fieldId="product">
          <div
            className="flex flex-col min-h-0 min-w-0 gap-6 md:grid md:grid-cols-12"
            style={{
              gridTemplateColumns: `repeat(${productSection.linkedProducts.length}, 1fr)`,
            }}
          >
            {productSection.linkedProducts.map((product, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FeaturedItemCard
                  cta={{
                    label: product.c_productCTA?.name,
                    link: product.c_productCTA?.link,
                    variant: cards.cta?.variant,
                  }}
                  heading={{
                    text: product.name,
                    size: cards.heading.size,
                    color: cards.heading.color,
                  }}
                  subheading={{
                    text: product.c_productPromo,
                    size: cards.subheading.size,
                    weight: cards.subheading.weight,
                  }}
                  body={{
                    text: product.c_description ?? "",
                    size: cards.body.size,
                    weight: cards.body.weight,
                  }}
                  image={{
                    url: product.c_coverPhoto?.image.url,
                  }}
                />
              </div>
            ))}
          </div>
        </EntityField>
      )}
    </Section>
  );
};

export const FeaturedItemsComponent: ComponentConfig<FeaturedItemsProps> = {
  fields: featuredItemsFields,
  defaultProps: {
    heading: {
      size: "section",
      color: "default",
    },
    cards: {
      heading: {
        size: "section",
        color: "default",
      },
      subheading: {
        size: "small",
        weight: "default",
      },
      body: {
        size: "base",
        weight: "default",
      },
    },
  },
  label: "Featured Items",
  render: (props) => <FeaturedItems {...props} />,
};

type FeaturedItemCardProps = {
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
};

const FeaturedItemCard = ({
  image,
  heading,
  subheading,
  body,
  cta,
}: FeaturedItemCardProps) => {
  return (
    <Section
      className={`flex flex-col justify-center bg-white components`}
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
        <Body className="line-clamp-5" weight={body.weight} size={body.size}>
          {body.text}
        </Body>
        {cta && (
          <CTA variant={cta.variant} label={cta.label} url={cta.link ?? "#"} />
        )}
      </div>
    </Section>
  );
};
