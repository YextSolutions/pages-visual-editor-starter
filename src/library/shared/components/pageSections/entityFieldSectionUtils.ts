// @ts-nocheck
import { type YextEntityField } from "@yext/visual-editor/section-library-support";

type CardWrapperSlot = {
  id?: string;
  props?: {
    id?: string;
    data?: YextEntityField<unknown>;
    slots?: {
      CardSlot?: unknown[];
    };
  };
};

export type MappedEntityFieldConditionalRender = {
  isMappedContentEmpty?: boolean;
};

type ConditionalRenderData = {
  props: {
    conditionalRender?: MappedEntityFieldConditionalRender;
  };
};

export const isMappedEntityFieldSelected = (
  entityField?: YextEntityField<unknown>
): boolean => {
  return (
    Boolean(entityField?.field) && entityField?.constantValueEnabled === false
  );
};

export const isMappedEntityFieldCollectionEmpty = (
  entityField: YextEntityField<unknown> | undefined,
  items: unknown[] | undefined
): boolean => {
  return isMappedEntityFieldSelected(entityField) && (items?.length ?? 0) === 0;
};

export const isMappedCardWrapperEmpty = (
  cardWrapperSlot: CardWrapperSlot | undefined
): boolean => {
  return isMappedEntityFieldCollectionEmpty(
    cardWrapperSlot?.props?.data,
    cardWrapperSlot?.props?.slots?.CardSlot
  );
};

export const isMappedCardWrapperSelected = (
  cardWrapperSlot: CardWrapperSlot | undefined
): boolean => {
  return isMappedEntityFieldSelected(cardWrapperSlot?.props?.data);
};

export const withMappedEntityFieldConditionalRender = <
  T extends ConditionalRenderData,
>(
  data: T,
  isMappedContentEmpty: boolean
): T => ({
  ...data,
  props: {
    ...data.props,
    conditionalRender: isMappedContentEmpty
      ? { isMappedContentEmpty: true }
      : undefined,
  },
});
