import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import {
  EntityField,
  Body,
  BodyProps,
  CTA,
  CTAProps,
  Heading,
  HeadingProps,
  Section,
  useDocument,
  FontSizeSelector,
} from "@yext/visual-editor";

export type FeaturedItemsProps = {
  heading: {
    fontSize: HeadingProps["fontSize"];
    color: HeadingProps["color"];
  };
  cards: {
    heading: {
      fontSize: HeadingProps["fontSize"];
      color: HeadingProps["color"];
    };
    subheading: {
      fontSize: BodyProps["fontSize"];
      weight: BodyProps["fontWeight"];
    };
    body: {
      fontSize: BodyProps["fontSize"];
      weight: BodyProps["fontWeight"];
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
      fontSize: FontSizeSelector(),
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
          fontSize: FontSizeSelector(),
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
          fontSize: FontSizeSelector(),
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
          fontSize: FontSizeSelector(),
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
          <Heading
            color={heading.color}
            fontSize={heading.fontSize}
          >
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
                    size: cards.heading.fontSize,
                    color: cards.heading.color,
                  }}
                  subheading={{
                    text: product.c_productPromo,
                    size: cards.subheading.fontSize,
                    weight: cards.subheading.weight,
                  }}
                  body={{
                    text: product.c_description ?? "",
                    size: cards.body.fontSize,
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
      fontSize: "default",
      color: "default",
    },
    cards: {
      heading: {
        fontSize: "default",
        color: "default",
      },
      subheading: {
        fontSize: "default",
        weight: "default",
      },
      body: {
        fontSize: "default",
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
    size: HeadingProps["fontSize"];
    color: HeadingProps["color"];
  };
  subheading: {
    text: string;
    size: BodyProps["fontSize"];
    weight: BodyProps["fontWeight"];
  };
  body: {
    text: string;
    size: BodyProps["fontSize"];
    weight: BodyProps["fontWeight"];
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
        <Heading
          level={2}
          color={heading.color}
          fontSize={heading.size}
        >
          {heading.text}
        </Heading>
        <Body
          className="line-clamp-1"
          fontWeight={subheading.weight}
          fontSize={subheading.size}
        >
          {subheading.text}
        </Body>
        <Body
          className="line-clamp-5"
          fontWeight={body.weight}
          fontSize={body.size}
        >
          {body.text}
        </Body>
        {cta && (
          <CTA variant={cta.variant} label={cta.label} link={cta.link ?? "#"} />
        )}
      </div>
    </Section>
  );
};
