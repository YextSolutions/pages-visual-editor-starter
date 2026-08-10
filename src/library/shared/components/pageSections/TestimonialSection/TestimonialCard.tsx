// @ts-nocheck
import * as React from "react";
import { PuckComponent, Slot, WithId } from "@puckeditor/core";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { Background } from "../../atoms/background";
import { TestimonialStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { BodyTextProps } from "../../contentBlocks/BodyText";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { getDefaultRTF } from "@yext/visual-editor/section-library-support";
import { TimestampProps } from "../../contentBlocks/Timestamp";
import {
  useCardContext,
  useParentCardStyles,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { syncParentStyles } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";

const defaultTestimonial = {
  description: {
    defaultValue: getDefaultRTF(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    ),
  },
  contributorName: { defaultValue: "Name" },
  contributionDate: "2022-08-02T14:00:00",
} satisfies TestimonialStruct;

export const defaultTestimonialCardSlotData = (
  id?: string,
  index?: number,
  backgroundColor?: ThemeColor,
  sharedSlotStyles?: Record<string, any>
) => {
  const cardData = {
    type: "TestimonialCard",
    props: {
      ...(id && { id }),
      ...(index !== undefined && { index }),
      styles: {
        backgroundColor: backgroundColor ?? backgroundColors.background1.value,
      } satisfies TestimonialCardProps["styles"],
      slots: {
        DescriptionSlot: [
          {
            type: "BodyTextSlot",
            props: {
              ...(id && { id: `${id}-description` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultTestimonial.description,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
              },
            } satisfies BodyTextProps,
          },
        ],
        ContributorNameSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              ...(id && { id: `${id}-contributorName` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultTestimonial.contributorName,
                  constantValueEnabled: true,
                },
              },
              styles: {
                level: 3,
                align: "left",
              },
            } satisfies HeadingTextProps,
          },
        ],
        ContributionDateSlot: [
          {
            type: "Timestamp",
            props: {
              ...(id && { id: `${id}-contributionDate` }),
              data: {
                date: {
                  field: "",
                  constantValue: defaultTestimonial.contributionDate,
                  constantValueEnabled: true,
                },
                endDate: {
                  field: "",
                  constantValueEnabled: true,
                  constantValue: "",
                },
              },
              styles: {
                includeTime: false,
                includeRange: false,
              },
            } satisfies TimestampProps,
          },
        ],
      },
    },
  };

  Object.entries(cardData.props.slots).forEach(([slotKey, slotArray]) => {
    if (sharedSlotStyles?.[slotKey]) {
      slotArray[0].props.styles = sharedSlotStyles[slotKey];
    }
  });

  return cardData;
};

export type TestimonialCardProps = {
  /** @internal */
  field?: string;
  description?: TestimonialStruct["description"];
  contributorName?: TestimonialStruct["contributorName"];
  contributionDate?: TestimonialStruct["contributionDate"];
  /** Styling for all the cards. */
  styles: {
    /** The background color of each testimonial card */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    DescriptionSlot: Slot;
    ContributorNameSlot: Slot;
    ContributionDateSlot: Slot;
  };

  /** @internal */
  parentStyles?: {
    showName: boolean;
    showDate: boolean;
  };

  /** @internal */
  conditionalRender?: {
    description: boolean;
    contributorName: boolean;
    contributionDate: boolean;
  };

  /** @internal */
  index?: number;
};

const testimonialCardFields: YextFields<TestimonialCardProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      DescriptionSlot: { type: "slot" },
      ContributorNameSlot: { type: "slot" },
      ContributionDateSlot: { type: "slot" },
    },
    visible: false,
  },
};

const TestimonialCardComponent: PuckComponent<TestimonialCardProps> = (
  props
) => {
  const { styles, slots, puck, conditionalRender } = props;

  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardStyles: TestimonialCardProps["styles"];
    slotStyles: Record<string, TestimonialCardProps["styles"]>;
  }>();
  const parentStyles =
    useParentCardStyles<TestimonialCardProps["parentStyles"]>() ??
    props.parentStyles;

  const { slotStyles, getPuck, slotProps } =
    useGetCardSlots<TestimonialCardProps>(props.id);

  const showDescription = Boolean(
    conditionalRender?.description || puck.isEditing
  );
  const showContributorName =
    parentStyles?.showName &&
    Boolean(conditionalRender?.contributorName || puck.isEditing);
  const showContributionDate =
    parentStyles?.showDate &&
    Boolean(conditionalRender?.contributionDate || puck.isEditing);

  // sharedCardProps useEffect
  // When the context changes, dispatch an update to sync the changes to puck
  React.useEffect(() => {
    if (!puck.isEditing || !sharedCardProps || !getPuck) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardStyles) === JSON.stringify(styles) &&
      JSON.stringify(slotStyles) === JSON.stringify(sharedCardProps?.slotStyles)
    ) {
      return;
    }

    const { dispatch, getSelectorForId } = getPuck();
    const selector = getSelectorForId(props.id);
    if (!selector || !slotProps) {
      return;
    }

    const newSlotData: TestimonialCardProps["slots"] = {
      DescriptionSlot: [],
      ContributorNameSlot: [],
      ContributionDateSlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      newSlotData[key as keyof TestimonialCardProps["slots"]] = [
        {
          ...deepMerge(
            { props: { styles: { ...sharedCardProps?.slotStyles?.[key] } } },
            value[0]
          ),
        },
      ];
    });

    // oxlint-disable-next-line no-unused-vars: remove props.puck before dispatching to avoid writing it to the saved data
    const { puck: _, editMode: __, ...otherProps } = props;
    dispatch({
      type: "replace" as const,
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: {
        type: "TestimonialCard",
        props: {
          ...otherProps,
          styles: {
            ...otherProps.styles,
            backgroundColor:
              sharedCardProps?.cardStyles.backgroundColor ||
              backgroundColors.background1.value,
          },
          slots: newSlotData,
        } satisfies TestimonialCardProps,
      },
    });
  }, [sharedCardProps]);

  // styles and slotStyles useEffect
  // When the card's shared props or the card's slots' shared props change, update the context
  React.useEffect(() => {
    if (!puck.isEditing || !slotProps) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardStyles) === JSON.stringify(styles) &&
      JSON.stringify(sharedCardProps?.slotStyles) === JSON.stringify(slotStyles)
    ) {
      return;
    }

    setSharedCardProps({
      cardStyles: styles,
      slotStyles: slotStyles,
    });
  }, [styles, slotStyles]);

  return (
    <div
      ref={puck.dragRef}
      className="flex flex-col rounded-lg overflow-hidden border bg-white h-full"
    >
      <Background
        background={backgroundColors.background1.value}
        className="p-8 grow"
      >
        {showDescription && (
          <slots.DescriptionSlot style={{ height: "auto" }} allow={[]} />
        )}
      </Background>
      {(showContributorName || showContributionDate) && (
        <Background background={styles.backgroundColor} className="p-8">
          <div className="flex flex-col gap-1">
            {showContributorName && (
              <slots.ContributorNameSlot
                style={{ height: "auto" }}
                allow={[]}
              />
            )}
            {showContributionDate && (
              <slots.ContributionDateSlot
                style={{ height: "auto" }}
                allow={[]}
              />
            )}
          </div>
        </Background>
      )}
    </div>
  );
};

export const TestimonialCard: YextComponentConfig<TestimonialCardProps> = {
  label: msg("components.testimonialCard", "Testimonial Card"),
  fields: testimonialCardFields,
  inline: true,
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      DescriptionSlot: [],
      ContributorNameSlot: [],
      ContributionDateSlot: [],
    },
  },
  resolveData: (data, params) => {
    const field = data.props.field ?? "";
    const isLinkedMode = Boolean(field);
    const descriptionSlotProps = data.props.slots.DescriptionSlot?.[0]
      ?.props as WithId<BodyTextProps> | undefined;
    const contributorNameSlotProps = data.props.slots.ContributorNameSlot?.[0]
      ?.props as WithId<HeadingTextProps> | undefined;
    const contributionDateSlotProps = data.props.slots.ContributionDateSlot?.[0]
      ?.props as WithId<any> | undefined;
    const { description, contributorName, contributionDate } = data.props;
    const resolvedContributorNameFromItem =
      contributorName &&
      resolveComponentData(
        contributorName,
        i18nComponentsInstance.language || "en",
        params.metadata.streamDocument,
        {
          output: "plainText",
        }
      );
    const resolvedDescription = isLinkedMode
      ? description
      : descriptionSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            descriptionSlotProps.data.text,
            i18nComponentsInstance.language || "en"
          )
        : undefined;
    const resolvedContributorName = isLinkedMode
      ? resolvedContributorNameFromItem
      : contributorNameSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            contributorNameSlotProps.data.text,
            i18nComponentsInstance.language || "en"
          )
        : undefined;
    const resolvedContributionDate = isLinkedMode
      ? contributionDate
      : contributionDateSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            contributionDateSlotProps.data.date,
            i18nComponentsInstance.language || "en"
          )
        : undefined;

    const showDescription = Boolean(resolvedDescription);
    const showContributorName = Boolean(resolvedContributorName);
    const showContributionDate = Boolean(resolvedContributionDate);

    let updatedData = {
      ...data,
      props: {
        ...data.props,
        conditionalRender: {
          description: showDescription,
          contributorName: showContributorName,
          contributionDate: showContributionDate,
        },
      } satisfies TestimonialCardProps,
    };

    updatedData = syncParentStyles(params, updatedData, [
      "showName",
      "showDate",
    ]);

    return bindSlots(updatedData as typeof data, {
      DescriptionSlot: description
        ? ({
            field,
            richText: description,
          } satisfies BodyTextProps["parentData"])
        : undefined,
      ContributorNameSlot: resolvedContributorNameFromItem
        ? ({
            field,
            text: resolvedContributorNameFromItem,
          } satisfies HeadingTextProps["parentData"])
        : undefined,
      ContributionDateSlot: contributionDate
        ? ({
            field,
            date: contributionDate,
          } satisfies TimestampProps["parentData"])
        : undefined,
    });
  },
  render: (props) => <TestimonialCardComponent {...props} />,
};
