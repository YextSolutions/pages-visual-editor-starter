// @ts-nocheck
import { PuckComponent } from "@puckeditor/core";
import { TestimonialStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { CardContextProvider } from "@yext/visual-editor/section-library-support";
import { SlotMappedCardWrapperType } from "@yext/visual-editor/section-library-support";
import {
  defaultTestimonialCardSlotData,
  TestimonialCardProps,
} from "./TestimonialCard";
import { renderMappedEntityFieldEmptyState } from "../EntityFieldSectionEmptyState";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { MappedEntityFieldConditionalRender } from "../entityFieldSectionUtils";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { createSlottedItemSource } from "@yext/visual-editor/section-library-support";

export const testimonialCardsSource = createSlottedItemSource<
  TestimonialStruct,
  TestimonialCardProps
>({
  label: msg("components.testimonial", "Testimonial"),
  itemLabel: "Testimonial",
  cardName: "TestimonialCard",
  defaultItemProps: () => defaultTestimonialCardSlotData().props,
  mappingFields: {
    description: {
      type: "entityField",
      label: msg("fields.description", "Description"),
      filter: { types: ["type.rich_text_v2"] },
    },
    contributorName: {
      type: "entityField",
      label: msg("fields.contributorName", "Contributor Name"),
      filter: { types: ["type.string"] },
    },
    contributionDate: {
      type: "entityField",
      label: msg("fields.contributionDate", "Contribution Date"),
      filter: { types: ["type.datetime"] },
    },
  },
});

export type TestimonialCardsWrapperProps =
  SlotMappedCardWrapperType<TestimonialStruct> & {
    styles: {
      /**
       * Whether to show the name slot in the testimonial cards.
       * @defaultValue true
       */
      showName: boolean;

      /**
       * Whether to show the date slot in the testimonial cards.
       * @defaultValue true
       */
      showDate: boolean;
    };

    /** @internal */
    conditionalRender?: MappedEntityFieldConditionalRender;
  };

const testimonialCardsWrapperFields: YextFields<TestimonialCardsWrapperProps> =
  {
    data: testimonialCardsSource.field,
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
        showName: {
          label: msg("fields.showName", "Show Name"),
          type: "radio",
          options: ThemeOptions.SHOW_HIDE,
        },
        showDate: {
          label: msg("fields.showDate", "Show Date"),
          type: "radio",
          options: ThemeOptions.SHOW_HIDE,
        },
      },
    },
  };

const TestimonialCardsWrapperComponent: PuckComponent<
  TestimonialCardsWrapperProps
> = (props) => {
  const { slots } = props;

  return (
    <CardContextProvider parentStyles={props.styles}>
      <slots.CardSlot
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center"
        allow={[]}
      />
    </CardContextProvider>
  );
};

export const TestimonialCardsWrapper: YextComponentConfig<TestimonialCardsWrapperProps> =
  {
    label: msg("components.testimonialCardsWrapper", "Testimonial Cards"),
    fields: testimonialCardsWrapperFields,
    defaultProps: {
      ...testimonialCardsSource.defaultWrapperProps,
      styles: {
        showName: true,
        showDate: true,
      },
    },
    resolveData: (data, params) =>
      testimonialCardsSource.populateSlots(
        data,
        params.metadata.streamDocument
      ),
    render: (props) => {
      if (props.conditionalRender?.isMappedContentEmpty) {
        return renderMappedEntityFieldEmptyState(props.puck.isEditing);
      }

      return <TestimonialCardsWrapperComponent {...props} />;
    },
  };
