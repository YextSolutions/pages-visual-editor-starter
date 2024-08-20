import { ComponentConfig, Fields } from "@measured/puck";
import { Body } from "../atoms/body";
import { Heading } from "../atoms/heading";
import { Section } from "../atoms/section";
import { CTA } from "../atoms/cta";
import {
  StarIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";

export type ProductHeroProps = {
  name: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: {
    id: number;
    name: string;
    href: string;
  }[];
  sizes: {
    name: string;
    description: string;
  }[];
  reviews: {
    average: number;
    totalCount: number;
  };
};

const productHeroFields: Fields<ProductHeroProps> = {
  name: { type: "text", label: "Product Name" },
  price: { type: "text", label: "Price" },
  description: { type: "textarea", label: "Description" },
  imageSrc: { type: "text", label: "Image URL" },
  imageAlt: { type: "text", label: "Image Alt Text" },
  breadcrumbs: {
    type: "array",
    label: "Breadcrumbs",
    itemFields: {
      id: { type: "number", label: "ID" },
      name: { type: "text", label: "Name" },
      href: { type: "text", label: "Link" },
    },
  },
  sizes: {
    type: "array",
    label: "Sizes",
    itemFields: {
      name: { type: "text", label: "Size Name" },
      description: { type: "text", label: "Size Description" },
    },
  },
  reviews: {
    type: "object",
    label: "Reviews",
    objectFields: {
      average: { type: "number", label: "Average Rating" },
      totalCount: { type: "number", label: "Total Reviews" },
    },
  },
};

const ProductHero: React.FC<ProductHeroProps> = ({
  name,
  price,
  description,
  imageSrc,
  imageAlt,
  breadcrumbs,
  sizes,
  reviews,
}) => {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center text-sm">
                    <a
                      href={breadcrumb.href}
                      className="font-medium text-gray-500 hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    {breadcrumbIdx !== breadcrumbs.length - 1 ? (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

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
              <Body size="large" weight="bold">
                {price}
              </Body>

              <div className="ml-4 border-l border-gray-300 pl-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={cn(
                            reviews.average > rating
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                  </div>
                  <Body size="small" className="ml-2 text-gray-500">
                    {reviews.totalCount} reviews
                  </Body>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <Body size="base">{description}</Body>
            </div>

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
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img
              alt={imageAlt}
              src={imageSrc}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

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
  defaultProps: {
    name: "Everyday Ruck Snack",
    price: "$220",
    description:
      "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg",
    imageAlt:
      "Model wearing light green backpack with black canvas straps and front zipper pouch.",
    breadcrumbs: [
      { id: 1, name: "Travel", href: "#" },
      { id: 2, name: "Bags", href: "#" },
    ],
    sizes: [
      {
        name: "18L",
        description: "Perfect for a reasonable amount of snacks.",
      },
      {
        name: "20L",
        description: "Enough room for a serious amount of snacks.",
      },
    ],
    reviews: { average: 4, totalCount: 1624 },
  },
  render: (props) => <ProductHero {...props} />,
};
