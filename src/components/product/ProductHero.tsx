import { ComponentConfig, Fields } from "@measured/puck";
import { Body, BodyProps } from "../atoms/body";
import { Heading, HeadingProps } from "../atoms/heading";
import { Section } from "../atoms/section";
import { useDocument } from "@yext/pages/util";
import { ProductStream } from "../../types/autogen";
import { Image } from "@yext/pages-components";
import { EntityField } from "@yext/visual-editor";

export type ProductHeroProps = {
  name: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  price: {
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  description: {
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
};

const productHeroFields: Fields<ProductHeroProps> = {
  name: {
    type: "object",
    label: "Product Name",
    objectFields: {
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Page", value: "page" },
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
  price: {
    type: "object",
    label: "Price",
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
  description: {
    type: "object",
    label: "Description",
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
};

const ProductHero: React.FC<ProductHeroProps> = ({
  name,
  price,
  description,
}) => {
  const {
    name: productName,
    c_coverPhoto,
    c_description,
    price: productPrice,
  } = useDocument<ProductStream>();

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <EntityField displayName="Product Name" fieldId="name">
              <Heading level={1} size={name.size} color={name.color}>
                {productName}
              </Heading>
            </EntityField>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <EntityField displayName="Price" fieldId="price">
                <Body size={price.size} weight={price.weight}>
                  ${productPrice.value}
                </Body>
              </EntityField>
            </div>

            <div className="mt-4 space-y-6">
              <EntityField displayName="Description" fieldId="c_description">
                <Body size={description.size} weight={description.weight}>
                  {c_description}
                </Body>
              </EntityField>
            </div>
          </section>
        </div>

        {/* Product image */}
        {c_coverPhoto && (
          <EntityField displayName="Cover Photo" fieldId="c_coverPhoto">
            <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                <Image image={c_coverPhoto} />
              </div>
            </div>
          </EntityField>
        )}
      </div>
    </Section>
  );
};

export const ProductHeroComponent: ComponentConfig<ProductHeroProps> = {
  fields: productHeroFields,
  defaultProps: {
    name: {
      size: "section",
      color: "default",
    },
    price: {
      size: "large",
      weight: "bold",
    },
    description: {
      size: "base",
      weight: "default",
    },
  },
  render: (props) => <ProductHero {...props} />,
};
