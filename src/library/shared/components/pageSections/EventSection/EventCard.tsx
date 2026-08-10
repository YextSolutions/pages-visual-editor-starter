// @ts-nocheck
import * as React from "react";
import { PuckComponent, Slot, WithId, setDeep } from "@puckeditor/core";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { Background } from "../../atoms/background";
import { EventStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { ImageWrapperProps } from "../../contentBlocks/image/Image";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { BodyTextProps } from "../../contentBlocks/BodyText";
import { CTAWrapperProps } from "../../contentBlocks/CtaWrapper";
import { TimestampProps } from "../../contentBlocks/Timestamp";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { ImgSizesByBreakpoint } from "../../atoms/image";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { getDefaultRTF } from "@yext/visual-editor/section-library-support";
import {
  useCardContext,
  useParentCardStyles,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { getRandomPlaceholderImageObject } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { syncParentStyles } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const defaultEvent = {
  image: {
    url: "https://placehold.co/640x360",
    height: 360,
    width: 640,
  },
  title: { defaultValue: "Event Title" },
  dateTime: "2022-12-12T14:00:00",
  description: {
    defaultValue: getDefaultRTF(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ),
  },
  cta: {
    label: { defaultValue: "Learn More" },
    link: "#",
    linkType: "URL",
    ctaType: "textAndLink",
  },
} satisfies EventStruct;

export const defaultEventCardSlotData = (
  id?: string,
  index?: number,
  backgroundColor?: ThemeColor,
  truncateDescription?: boolean,
  sharedSlotStyles?: Record<string, any>
) => {
  const cardData = {
    type: "EventCard",
    props: {
      ...(id && { id }),
      ...(index !== undefined && { index }),
      styles: {
        backgroundColor: backgroundColor ?? backgroundColors.background1.value,
        truncateDescription: truncateDescription ?? true,
      } satisfies EventCardProps["styles"],
      slots: {
        ImageSlot: [
          {
            type: "ImageSlot",
            props: {
              ...(id && { id: `${id}-image` }),
              data: {
                image: {
                  field: "",
                  constantValue: {
                    ...getRandomPlaceholderImageObject({
                      width: 640,
                      height: 360,
                    }),
                    width: 640,
                    height: 360,
                    alternateText: "Event Image",
                  },
                  constantValueEnabled: true,
                },
              },
              styles: {
                aspectRatio: 1.78,
                width: 640,
              },
              hideWidthProp: true,
            } satisfies ImageWrapperProps,
          },
        ],
        TitleSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              ...(id && { id: `${id}-title` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultEvent.title,
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
        DateTimeSlot: [
          {
            type: "Timestamp",
            props: {
              ...(id && { id: `${id}-timestamp` }),
              data: {
                date: {
                  field: "",
                  constantValue: defaultEvent.dateTime,
                  constantValueEnabled: true,
                },
                endDate: {
                  field: "",
                  constantValue: "",
                  constantValueEnabled: true,
                },
              },
              styles: {
                includeTime: true,
                includeRange: false,
              },
            } satisfies TimestampProps,
          },
        ],
        DescriptionSlot: [
          {
            type: "BodyTextSlot",
            props: {
              ...(id && { id: `${id}-description` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultEvent.description,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
              },
              parentStyles: {
                className: "md:line-clamp-2",
              },
            } satisfies BodyTextProps,
          },
        ],
        CTASlot: [
          {
            type: "CTASlot",
            props: {
              ...(id && { id: `${id}-cta` }),
              data: {
                actionType: "link",
                normalizeLink: true,
                buttonText: { defaultValue: "Button" },
                entityField: {
                  field: "",
                  constantValue: defaultEvent.cta,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "primary",
                presetImage: "app-store",
              },
              eventName: index !== undefined ? `cta${index}` : undefined,
            } satisfies CTAWrapperProps,
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

export type EventCardProps = {
  /** @internal */
  field?: string;

  image?: EventStruct["image"];
  title?: EventStruct["title"];
  dateTime?: EventStruct["dateTime"];
  description?: EventStruct["description"];
  cta?: EventStruct["cta"];

  /** Styling for all the cards. */
  styles: {
    /** The background color of each event card */
    backgroundColor?: ThemeColor;
    /** Whether to truncate the event description text */
    truncateDescription: boolean;
  };

  /** @internal */
  slots: {
    ImageSlot: Slot;
    TitleSlot: Slot;
    DateTimeSlot: Slot;
    DescriptionSlot: Slot;
    CTASlot: Slot;
  };

  /** @internal styles from parent component */
  parentStyles?: {
    showImage: boolean;
    showDateTime: boolean;
    showDescription: boolean;
    showCTA: boolean;
  };

  /** @internal*/
  conditionalRender?: {
    image?: boolean;
    title: boolean;
    dateTime: boolean;
    description?: boolean;
    cta?: boolean;
  };

  /** @internal */
  index?: number;
};

const eventCardFields: YextFields<EventCardProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      truncateDescription: {
        label: msg("fields.truncateDescription", "Truncate Description"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      ImageSlot: { type: "slot" },
      TitleSlot: { type: "slot" },
      DateTimeSlot: { type: "slot" },
      DescriptionSlot: { type: "slot" },
      CTASlot: { type: "slot" },
    },
    visible: false,
  },
};

const EventCardComponent: PuckComponent<EventCardProps> = (props) => {
  const { styles, slots, puck, conditionalRender } = props;

  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardStyles: EventCardProps["styles"];
    slotStyles: Record<string, EventCardProps["styles"]>;
  }>();
  const parentStyles =
    useParentCardStyles<EventCardProps["parentStyles"]>() ?? props.parentStyles;

  const { slotStyles, getPuck, slotProps } = useGetCardSlots<EventCardProps>(
    props.id
  );

  const showImage =
    parentStyles?.showImage &&
    Boolean(conditionalRender?.image || puck.isEditing);
  const showTitle = Boolean(conditionalRender?.title || puck.isEditing);
  const showDateTime =
    parentStyles?.showDateTime &&
    Boolean(conditionalRender?.dateTime || puck.isEditing);
  const showDescription =
    parentStyles?.showDescription &&
    (Boolean(conditionalRender?.description) || puck.isEditing);
  const showCTA =
    parentStyles?.showCTA && Boolean(conditionalRender?.cta || puck.isEditing);

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

    const newSlotData: EventCardProps["slots"] = {
      ImageSlot: [],
      TitleSlot: [],
      DateTimeSlot: [],
      DescriptionSlot: [],
      CTASlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      newSlotData[key as keyof EventCardProps["slots"]] = [
        {
          ...deepMerge(
            { props: { styles: { ...sharedCardProps?.slotStyles?.[key] } } },
            value[0]
          ),
        },
      ];
      if (key === "DescriptionSlot") {
        newSlotData.DescriptionSlot[0].props.parentStyles = {
          className:
            sharedCardProps.cardStyles.truncateDescription !== false
              ? "md:line-clamp-2"
              : undefined,
        };
      }
    });

    // oxlint-disable-next-line no-unused-vars: remove props.puck before dispatching to avoid writing it to the saved data
    const { puck: _, editMode: __, ...otherProps } = props;
    dispatch({
      type: "replace" as const,
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: {
        type: "EventCard",
        props: {
          ...otherProps,
          styles: {
            ...otherProps.styles,
            backgroundColor:
              sharedCardProps?.cardStyles.backgroundColor ||
              backgroundColors.background1.value,
            truncateDescription:
              sharedCardProps?.cardStyles.truncateDescription,
          },
          slots: newSlotData,
        } satisfies EventCardProps,
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
    <Background
      background={styles.backgroundColor}
      className="flex flex-col md:flex-row rounded-lg overflow-hidden md:items-start"
    >
      {showImage && (
        <div className="lg:w-[45%] w-full">
          <slots.ImageSlot style={{ height: "auto" }} allow={[]} />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 w-full md:w-[55%] justify-between flex-grow">
        <div className="flex flex-col gap-2">
          {showTitle && (
            <slots.TitleSlot style={{ height: "auto" }} allow={[]} />
          )}
          {showDateTime && (
            <slots.DateTimeSlot
              style={{ height: "auto" }}
              allow={[]}
              minEmptyHeight={20}
            />
          )}
          {showDescription && (
            <slots.DescriptionSlot style={{ height: "auto" }} allow={[]} />
          )}
        </div>
        {showCTA && <slots.CTASlot style={{ height: "auto" }} allow={[]} />}
      </div>
    </Background>
  );
};

export const EventCard: YextComponentConfig<EventCardProps> = {
  label: msg("components.eventCard", "Event Card"),
  fields: eventCardFields,
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
      truncateDescription: true,
    },
    slots: {
      ImageSlot: [],
      TitleSlot: [],
      DateTimeSlot: [],
      DescriptionSlot: [],
      CTASlot: [],
    },
  },
  resolveData: (data, params) => {
    const field = data.props.field ?? "";
    const isLinkedMode = Boolean(field);
    const imageSlotProps = data.props.slots.ImageSlot?.[0]?.props as
      | WithId<ImageWrapperProps>
      | undefined;
    const titleSlotProps = data.props.slots.TitleSlot?.[0]?.props as
      | WithId<HeadingTextProps>
      | undefined;
    const dateTimeSlotProps = data.props.slots.DateTimeSlot?.[0]
      ?.props as WithId<TimestampProps | undefined>;
    const descriptionSlotProps = data.props.slots.DescriptionSlot?.[0]
      ?.props as WithId<BodyTextProps | undefined>;
    const ctaSlotProps = data.props.slots.CTASlot?.[0]?.props as
      | WithId<CTAWrapperProps>
      | undefined;

    const resolvedImage = isLinkedMode
      ? data.props.image
      : imageSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            imageSlotProps.data.image,
            i18nComponentsInstance.language || "en"
          )
        : undefined;

    const showImage = Boolean(
      (resolvedImage as any)?.url ||
        (resolvedImage as any)?.image?.url ||
        ((resolvedImage as any)?.hasLocalizedValue &&
          (resolvedImage as any)?.[i18nComponentsInstance.language || "en"]
            ?.url)
    );
    const showDescription = Boolean(
      isLinkedMode
        ? data.props.description
        : descriptionSlotProps &&
            resolveYextEntityField(
              params.metadata.streamDocument,
              descriptionSlotProps.data.text,
              i18nComponentsInstance.language || "en"
            )
    );
    const showTitle = Boolean(
      isLinkedMode
        ? data.props.title
        : titleSlotProps &&
            resolveYextEntityField(
              params.metadata.streamDocument,
              titleSlotProps.data.text,
              i18nComponentsInstance.language || "en"
            )
    );
    const showDateTime = Boolean(
      isLinkedMode
        ? data.props.dateTime?.trim()
        : dateTimeSlotProps &&
            resolveYextEntityField(
              params.metadata.streamDocument,
              dateTimeSlotProps.data.date,
              i18nComponentsInstance.language || "en"
            )?.trim()
    );
    const showCTA = Boolean(
      isLinkedMode
        ? data.props.cta?.label
        : ctaSlotProps &&
            resolveComponentData(
              ctaSlotProps.data.entityField,
              i18nComponentsInstance.language || "en",
              params.metadata.streamDocument
            )?.label
    );

    let updatedData = {
      ...data,
      props: {
        ...data.props,
        conditionalRender: {
          image: showImage,
          title: showTitle,
          dateTime: showDateTime,
          description: showDescription,
          cta: showCTA,
        },
      } satisfies EventCardProps,
    };

    // Set constant values for ImageSlot sizes and className props
    updatedData = setDeep(
      updatedData,
      "props.slots.ImageSlot[0].props.className",
      "max-w-full h-full object-cover"
    );
    updatedData = setDeep(updatedData, "props.slots.ImageSlot[0].props.sizes", {
      base: "calc(100vw - 32px)",
      lg: "calc(maxWidth * 0.45)",
    } satisfies ImgSizesByBreakpoint);

    // Set the CTA's event name
    updatedData = setDeep(
      updatedData,
      "props.slots.CTASlot[0].props.eventName",
      `cta${data.props.index}`
    );

    // Set truncateDescription for the DescriptionSlot
    updatedData = setDeep(
      updatedData,
      "props.slots.DescriptionSlot[0].props.parentStyles.className",
      data.props.styles.truncateDescription !== false
        ? "md:line-clamp-2"
        : undefined
    );

    updatedData = syncParentStyles(params, updatedData, [
      "showImage",
      "showDateTime",
      "showDescription",
      "showCTA",
    ]);

    const { image, title, dateTime, description, cta } = updatedData.props;
    const resolvedTitle =
      title &&
      resolveComponentData(
        title,
        i18nComponentsInstance.language || "en",
        params.metadata.streamDocument,
        { output: "plainText" }
      );

    return bindSlots(updatedData as typeof data, {
      ImageSlot: image
        ? ({ field, image } satisfies ImageWrapperProps["parentData"])
        : undefined,
      TitleSlot: resolvedTitle
        ? ({
            field,
            text: resolvedTitle,
          } satisfies HeadingTextProps["parentData"])
        : undefined,
      DateTimeSlot: dateTime
        ? ({ field, date: dateTime } satisfies TimestampProps["parentData"])
        : undefined,
      DescriptionSlot: description
        ? ({
            field,
            richText: description,
          } satisfies BodyTextProps["parentData"])
        : undefined,
      CTASlot: cta
        ? ({ field, cta } satisfies CTAWrapperProps["parentData"])
        : undefined,
    });
  },
  render: (props) => <EventCardComponent {...props} />,
};
