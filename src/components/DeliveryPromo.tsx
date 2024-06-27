import {ComponentConfig, Fields} from '@measured/puck';
import {HeadingProps} from './atoms/heading';
import {BodyProps} from './atoms/body';
import {ButtonProps} from './atoms/button';

export type DeliveryPromoProps = {
  imageMode: 'left' | 'right';
  promoTitle: {
    size: HeadingProps['size'];
    color: HeadingProps['color'];
  };
  promoDescription: {
    text: string;
    size: BodyProps['size'];
    weight: BodyProps['weight'];
  };
  promoCTA: {
    variant: ButtonProps['variant'];
  };
};
const deliveryPromoFields: Fields<DeliveryPromoProps> = {
  imageMode: {
    label: 'Image Mode',
    type: 'radio',
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

const DeliveryPromo = ({}: DeliveryPromoProps) => {
  return (
      <></>
  );
};

export const DeliveryPromoComponent: ComponentConfig<DeliveryPromoProps> = {
  fields: deliveryPromoFields,
  defaultProps: {
    imageMode: 'right',
    promoTitle: {
      size: 'section',
      color: 'default',
    },
    promoDescription: {
      text: "body",
      size: "base",
      weight: "default",
    },
    promoCTA: {
      variant: 'default',
    },
  },
  label: 'Delivery Promo',
  render: ({imageMode, promoTitle, promoDescription, promoCTA}) => (
    <DeliveryPromo
      imageMode={imageMode}
      promoTitle={promoTitle}
      promoDescription={promoDescription}
      promoCTA={promoCTA}
    />
  ),
};