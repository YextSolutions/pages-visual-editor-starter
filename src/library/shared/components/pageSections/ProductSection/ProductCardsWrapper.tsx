// @ts-nocheck
import { ProductStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { PuckComponent } from "@puckeditor/core";
import { CardContextProvider } from "@yext/visual-editor/section-library-support";
import { SlotMappedCardWrapperType } from "@yext/visual-editor/section-library-support";
import {
  defaultProductCardSlotData,
  ProductCardProps,
} from "./ProductCard";
import { ProductSectionVariant } from "./ProductSection";
import { renderMappedEntityFieldEmptyState } from "../EntityFieldSectionEmptyState";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { MappedEntityFieldConditionalRender } from "../entityFieldSectionUtils";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { createSlottedItemSource } from "@yext/visual-editor/section-library-support";

export const productCardsSource = createSlottedItemSource<
  ProductStruct,
  ProductCardProps
>({
  label: msg("components.products", "Products"),
  itemLabel: "Product",
  cardName: "ProductCard",
  defaultItemProps: () => defaultProductCardSlotData().props,
  mappingFields: {
    image: {
      type: "entityField",
      label: msg("fields.image", "Image"),
      filter: { types: ["type.image"] },
    },
    category: {
      type: "entityField",
      label: msg("fields.browText", "Brow Text"),
      filter: { types: ["type.string", "type.rich_text_v2"] },
    },
    name: {
      type: "entityField",
      label: msg("fields.title", "Title"),
      filter: { types: ["type.string"] },
    },
    price: {
      type: "entityField",
      label: msg("fields.price", "Price"),
      filter: { types: ["type.price"] },
    },
    description: {
      type: "entityField",
      label: msg("fields.description", "Description"),
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      type: "entityField",
      label: msg("fields.cta", "CTA"),
      filter: { types: ["type.cta"] },
    },
  },
});

export type ProductCardsWrapperProps =
  SlotMappedCardWrapperType<ProductStruct> & {
    styles: {
      showImage: boolean;
      showBrow: boolean;
      showTitle: boolean;
      showPrice: boolean;
      showDescription: boolean;
      showCTA: boolean;
      variant?: ProductSectionVariant;
    };

    /** @internal */
    conditionalRender?: MappedEntityFieldConditionalRender;
  };

const productCardsWrapperFields: YextFields<ProductCardsWrapperProps> = {
  data: productCardsSource.field,
  slots: {
    type: "object",
    objectFields: {
      CardSlot: { type: "slot" },
    },
    visible: false,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      showImage: {
        label: msg("fields.showImage", "Show Image"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showBrow: {
        label: msg("fields.showBrow", "Show Brow Text"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showTitle: {
        label: msg("fields.showTitle", "Show Title"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showPrice: {
        label: msg("fields.showPrice", "Show Price"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showDescription: {
        label: msg("fields.showDescription", "Show Description"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showCTA: {
        label: msg("fields.showCTA", "Show CTA"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
};

const ProductCardsWrapperComponent: PuckComponent<ProductCardsWrapperProps> = (
  props
) => {
  const { slots } = props;

  return (
    <CardContextProvider parentStyles={props.styles}>
      <slots.CardSlot
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 align-stretch"
        allow={[]}
      />
    </CardContextProvider>
  );
};

export const ProductCardsWrapper: YextComponentConfig<ProductCardsWrapperProps> =
  {
    label: msg("slots.productCards", "Product Cards"),
    fields: productCardsWrapperFields,
    defaultProps: {
      ...productCardsSource.defaultWrapperProps,
      styles: {
        showImage: true,
        showBrow: true,
        showTitle: true,
        showPrice: true,
        showDescription: true,
        showCTA: true,
      },
    },
    resolveData: (data, params) =>
      productCardsSource.populateSlots(data, params.metadata.streamDocument),
    render: (props) => {
      if (props.conditionalRender?.isMappedContentEmpty) {
        return renderMappedEntityFieldEmptyState(props.puck.isEditing);
      }

      return <ProductCardsWrapperComponent {...props} />;
    },
  };
