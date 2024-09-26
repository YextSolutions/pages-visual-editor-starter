import {ComponentConfig, Fields} from '@measured/puck';
import {Heading, HeadingProps} from './atoms/heading';
import {Body, BodyProps} from './atoms/body';
import {CTA, CTAProps} from "./atoms/cta";
import {Section} from "./atoms/section";
import {cn} from "../utils/cn";
import "./index.css";
import { EntityFieldType, resolveYextEntityField, YextEntityFieldSelector } from '@yext/visual-editor';
import { config } from '../templates/location';
import { useDocument } from '@yext/pages/util';
import { LocationStream } from '../types/autogen';

const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/640x360';

export type PromoProps = {
  imageMode: 'left' | 'right';
  promoTitle: {
    size: HeadingProps['size'];
    color: HeadingProps['color'];
    text: EntityFieldType;
  };
  promoDescription: {
    size: BodyProps['size'];
    weight: BodyProps['weight'];
    text: EntityFieldType;
  };
  promoCta?: {
    label?: string;
    link?: string;
    variant?: CTAProps["variant"];
  };
  image?: {
    url?: string;
  };
};
const promoFields: Fields<PromoProps> = {
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
      text: YextEntityFieldSelector<typeof config>({
        label: "Entity Field",
        filter: {
          types: ["type.string"]
        }
      }),
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
      text: YextEntityFieldSelector<typeof config>({
        label: "Entity Field",
        filter: {
          types: ["type.string"]
        }
      }),
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
  promoCta: {
    type: "object",
    label: "Promo CTA",
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
  image: {
    type: "object",
    objectFields: {
      url: {
        label: "Promo Image Url",
        type: "text"
      },
    },
  },
};

const Promo = ({imageMode, promoTitle, promoDescription, promoCta, image}: PromoProps) => {
  const document = useDocument<LocationStream>();
  return (
      <Section className='components'>
        <div
            className={cn(
                "flex flex-col md:flex-row bg-white overflow-hidden rounded-[30px] md:gap-8",
                imageMode === "right" && "md:flex-row-reverse",
            )}
        >
          {image?.url && <img
              src={image?.url}
              alt={'image'} //TODO: add alt prop?
              className='md:max-w-[60%]'
          />}
          <div className='flex flex-col justify-center gap-y-4 md:gap-y-8 p-4 md:px-16 md:py-0 w-full break-all'>
            {promoTitle?.text && <Heading
                size={promoTitle.size}
                color={promoTitle.color}
            >
              {resolveYextEntityField(document, promoTitle.text)}
            </Heading>}
            {promoDescription?.text && <Body
                size={promoDescription.size}
                weight={promoDescription.weight}
            >
              {resolveYextEntityField(document, promoDescription.text)}
            </Body>}
            {promoCta && <CTA
                variant={promoCta.variant}
                label={promoCta.label}
                url={promoCta.link ?? '#'}
            />}
          </div>
        </div>
      </Section>
  );
};

export const PromoComponent: ComponentConfig<PromoProps> = {
  fields: promoFields,
  defaultProps: {
    imageMode: 'right',
    promoTitle: {
      text: {
        fieldName: "",
        staticValue: "Title"
      },
      size: 'section',
      color: 'default',
    },
    promoDescription: {
      text: {
        fieldName: "",
        staticValue: "Description"
      },
      size: "base",
      weight: "default",
    },
    promoCta: {
      variant: 'default',
    },
    image: {
      url: PLACEHOLDER_IMAGE_URL,
    }
  },
  label: 'Promo',
  render: ({imageMode, promoTitle, promoDescription, promoCta, image}) => (
      <Promo
          imageMode={imageMode}
          promoTitle={promoTitle}
          promoDescription={promoDescription}
          promoCta={promoCta}
          image={image}
      />
  ),
};