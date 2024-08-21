import { ComponentConfig, Fields } from "@measured/puck";
import { Body } from "../atoms/body";
import { Heading } from "../atoms/heading";
import { Section } from "../atoms/section";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useDocument } from "@yext/pages/util";
import { ProductStream } from "../../types/autogen";
import { Image } from "@yext/pages-components";

export type ProductHeroProps = {};

const productHeroFields: Fields<ProductHeroProps> = {};

const ProductHero: React.FC<ProductHeroProps> = () => {
  const { name, c_coverPhoto, c_description, price } =
    useDocument<ProductStream>();

  console.log("description", c_description);
  console.log("price", price);

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <Heading level={1} size="section" color="default">
              {name}
            </Heading>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="flex items-center">
              {/* <Body size="large" weight="bold">
                {price}
              </Body> */}
            </div>

            {/* <div className="mt-4 space-y-6">
              <Body size="base">{description}</Body>
            </div> */}

            <div className="mt-6 flex items-center">
              <CheckIcon
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-green-500"
              />
              <Body size="small" className="ml-2 text-gray-500">
                In stock and ready to ship
              </Body>
            </div>
          </section>
        </div>

        {/* Product image */}
        {c_coverPhoto && (
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <Image image={c_coverPhoto} />
            </div>
          </div>
        )}

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>
            {/* Form content can be added here if needed */}
          </section>
        </div>
      </div>
    </Section>
  );
};

export const ProductHeroComponent: ComponentConfig<ProductHeroProps> = {
  fields: productHeroFields,
  defaultProps: {},
  render: (props) => <ProductHero {...props} />,
};
