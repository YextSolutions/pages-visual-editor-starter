import { ComponentConfig, Fields } from "@measured/puck";
import { Heading, HeadingProps } from "./atoms/heading";
import { Body, BodyProps } from "./atoms/body";
import { ButtonProps } from "./atoms/button";
import { C_deliveryPromo, LocationStream } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import { Image } from "@yext/pages-components";
import { CTA } from "./atoms/cta";
import { Section } from "./atoms/section";
import { cn } from "../utils/cn";
import "./index.css";
import useScreenSizes from "../hooks/useDeviceSizes";

export type DeliveryPromoProps = {
  imageMode: "left" | "right";
  promoTitle: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  promoDescription: {
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
  promoCTA: {
    variant: ButtonProps["variant"];
  };
};
const deliveryPromoFields: Fields<DeliveryPromoProps> = {
  imageMode: {
    label: "Image Mode",
    type: "radio",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  promoTitle: {
    type: "object",
    label: "Promo Title",
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
  promoDescription: {
    type: "object",
    label: "Promo Description",
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
  promoCTA: {
    type: "object",
    label: "Promo CTA",
    objectFields: {
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

const DeliveryPromo = ({
  imageMode,
  promoTitle,
  promoDescription,
  promoCTA,
}: DeliveryPromoProps) => {
  const deliveryPromo: C_deliveryPromo = useDocument<LocationStream>(
    (document) => document.c_deliveryPromo
  );

  const { isLargeDevice } = useScreenSizes();

  return (
    <Section className="components">
      <div
        className={cn(
          "flex flex-col mx-auto max-w-[343px] bg-white rounded-[30px] md:gap-8 md:max-w-[640px]" +
            " lg:max-w-full lg:flex-row overflow-hidden",
          imageMode === "right" && "lg:flex-row-reverse"
        )}
      >
        {deliveryPromo.image && (
          <Image
            image={deliveryPromo.image}
            layout={isLargeDevice ? "fixed" : undefined}
            width={isLargeDevice ? 640 : undefined}
            height={isLargeDevice ? 474 : undefined}
          />
        )}
        <div className="flex flex-col justify-center gap-y-4 md:gap-y-8 p-4 md:px-16 md:py-0">
          {deliveryPromo.title && (
            <Heading size={promoTitle.size} color={promoTitle.color}>
              {deliveryPromo.title}
            </Heading>
          )}
          {deliveryPromo.description && (
            <Body size={promoDescription.size} weight={promoDescription.weight}>
              {deliveryPromo.description}
            </Body>
          )}
          {deliveryPromo.cta && (
            <CTA
              variant={promoCTA.variant}
              label={deliveryPromo.cta.name}
              url={deliveryPromo.cta.link ?? "#"}
            />
          )}
        </div>
      </div>
    </Section>
  );
};

export const DeliveryPromoComponent: ComponentConfig<DeliveryPromoProps> = {
  fields: deliveryPromoFields,
  defaultProps: {
    imageMode: "right",
    promoTitle: {
      size: "section",
      color: "default",
    },
    promoDescription: {
      size: "base",
      weight: "default",
    },
    promoCTA: {
      variant: "default",
    },
  },
  label: "Delivery Promo",
  render: ({ imageMode, promoTitle, promoDescription, promoCTA }) => (
    <DeliveryPromo
      imageMode={imageMode}
      promoTitle={promoTitle}
      promoDescription={promoDescription}
      promoCTA={promoCTA}
    />
  ),
};
