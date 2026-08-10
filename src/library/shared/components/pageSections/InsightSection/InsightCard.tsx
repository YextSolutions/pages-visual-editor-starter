// @ts-nocheck
import * as React from "react";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { Background } from "../../atoms/background";
import { CTAWrapperProps } from "../../contentBlocks/CtaWrapper";
import { BodyTextProps } from "../../contentBlocks/BodyText";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { ImageWrapperProps } from "../../contentBlocks/image/Image";
import { InsightStruct, TranslatableRichText } from "@yext/visual-editor/section-library-support";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { getDefaultRTF } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import {
  useCardContext,
  useParentCardStyles,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { getRandomPlaceholderImageObject } from "@yext/visual-editor/section-library-support";
import { TextProps } from "../../contentBlocks/Text";
import { PuckComponent, Slot } from "@puckeditor/core";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { syncParentStyles } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const defaultInsight = {
  image: {
    ...getRandomPlaceholderImageObject({ width: 640, height: 360 }),
    width: 640,
    height: 360,
  },
  name: { defaultValue: "Article Name" },
  category: { defaultValue: "Category" },
  description: {
    defaultValue: getDefaultRTF(
      "Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo.Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. 300 characters"
    ),
  },
  publishTime: "2022-08-02T14:00:00",
  cta: {
    label: { defaultValue: "Read More" },
    link: "#",
    linkType: "URL",
    ctaType: "textAndLink",
  },
} satisfies InsightStruct;

export const defaultInsightCardSlotData = (
  id?: string,
  index?: number,
  backgroundColor?: ThemeColor,
  sharedSlotStyles?: Record<string, any>
) => {
  const cardData = {
    type: "InsightCard",
    props: {
      ...(id && { id }),
      styles: {
        backgroundColor: backgroundColor ?? backgroundColors.background1.value,
      } satisfies InsightCardProps["styles"],
      conditionalRender: {
        hasCategory: true,
        hasPublishTime: true,
      },
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
                  },
                  constantValueEnabled: true,
                },
              },
              styles: {
                aspectRatio: 1.78,
                width: 640,
              },
              sizes: {
                base: "calc(100vw - 32px)",
                md: "calc((maxWidth - 32px) / 2)",
                lg: "calc((maxWidth - 32px) / 3)",
              },
            } satisfies ImageWrapperProps,
          },
        ],
        TitleSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              data: {
                text: {
                  field: "",
                  constantValue: defaultInsight.name,
                  constantValueEnabled: true,
                },
              },
              styles: {
                level: 4,
                align: "left",
              },
            } satisfies HeadingTextProps,
          },
        ],
        CategorySlot: [
          {
            type: "TextSlot",
            props: {
              ...(id && { id: `${id}-category` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultInsight.category,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
                fontStyle: "regular",
              },
            } satisfies TextProps,
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
                  constantValue: defaultInsight.description,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
              },
            } satisfies BodyTextProps,
          },
        ],
        PublishTimeSlot: [
          {
            type: "Timestamp",
            props: {
              ...(id && { id: `${id}-timestamp` }),
              data: {
                date: {
                  field: "",
                  constantValue: defaultInsight.publishTime,
                  constantValueEnabled: true,
                },
                endDate: {
                  field: "",
                  constantValue: "",
                  constantValueEnabled: true,
                },
              },
              styles: {
                includeTime: false,
                includeRange: false,
              },
            },
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
                  constantValue: defaultInsight.cta,
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
    } satisfies InsightCardProps,
  };

  Object.entries(cardData.props.slots).forEach(([slotKey, slotArray]) => {
    if (sharedSlotStyles?.[slotKey]) {
      slotArray[0].props.styles = sharedSlotStyles[slotKey];
    }
  });

  return cardData;
};

export type InsightCardProps = {
  /** @internal */
  field?: string;
  image?: InsightStruct["image"];
  name?: InsightStruct["name"];
  category?: InsightStruct["category"];
  description?: InsightStruct["description"];
  publishTime?: InsightStruct["publishTime"];
  cta?: InsightStruct["cta"];
  /** Styling for all the cards. */
  styles: {
    /** The background color of each insight card */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    ImageSlot: Slot;
    TitleSlot: Slot;
    CategorySlot: Slot;
    DescriptionSlot: Slot;
    PublishTimeSlot: Slot;
    CTASlot: Slot;
  };

  /** @internal styles from parent component */
  parentStyles?: {
    showImage: boolean;
    showCategory: boolean;
    showPublishTime: boolean;
    showDescription: boolean;
    showCTA: boolean;
  };

  /** @internal */
  conditionalRender?: {
    hasCategory: boolean;
    hasPublishTime: boolean;
  };

  /** @internal */
  index?: number;
};

const insightCardFields: YextFields<InsightCardProps> = {
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
      ImageSlot: { type: "slot" },
      TitleSlot: { type: "slot" },
      CategorySlot: { type: "slot" },
      DescriptionSlot: { type: "slot" },
      PublishTimeSlot: { type: "slot" },
      CTASlot: { type: "slot" },
    },
    visible: false,
  },
};

const InsightCardComponent: PuckComponent<InsightCardProps> = (props) => {
  const { styles, slots, puck, conditionalRender } = props;
  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardBackground: ThemeColor | undefined;
    slotStyles: Record<string, InsightCardProps["styles"]>;
  }>();
  const parentStyles =
    useParentCardStyles<InsightCardProps["parentStyles"]>() ??
    props.parentStyles;

  const {
    slotStyles,
    getPuck,
    slotProps: slotsData,
  } = useGetCardSlots<InsightCardProps>(props.id);

  React.useEffect(() => {
    if (!puck.isEditing || !sharedCardProps) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardBackground) ===
        JSON.stringify(styles.backgroundColor) &&
      JSON.stringify(slotStyles) === JSON.stringify(sharedCardProps?.slotStyles)
    ) {
      return;
    }

    const { dispatch, getSelectorForId } = getPuck!();
    const selector = getSelectorForId(props.id);
    if (!selector || !slotsData) {
      return;
    }

    const newSlotData: InsightCardProps["slots"] = {
      ImageSlot: [],
      TitleSlot: [],
      CategorySlot: [],
      DescriptionSlot: [],
      PublishTimeSlot: [],
      CTASlot: [],
    };
    Object.entries(slotsData).forEach(([key, value]) => {
      newSlotData[key as keyof InsightCardProps["slots"]] = [
        {
          ...deepMerge(
            { props: { styles: { ...sharedCardProps?.slotStyles?.[key] } } },
            value[0]
          ),
        },
      ];
    });

    // oxlint-disable-next-line no-unused-vars: remove props.puck and editMode before dispatching to avoid writing them to the saved data
    const { puck: _, editMode: __, ...otherProps } = props;
    dispatch({
      type: "replace" as const,
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: {
        type: "InsightCard",
        props: {
          ...otherProps,
          styles: {
            backgroundColor:
              sharedCardProps.cardBackground || styles.backgroundColor,
          },
          slots: newSlotData,
        },
      },
    });
  }, [sharedCardProps, puck.isEditing]);

  // When the card's shared props or the card's slots' shared props change, update the context
  React.useEffect(() => {
    if (!puck.isEditing || !slotsData) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardBackground) ===
        JSON.stringify(styles.backgroundColor) &&
      JSON.stringify(sharedCardProps?.slotStyles) === JSON.stringify(slotStyles)
    ) {
      return;
    }

    setSharedCardProps({
      cardBackground: styles.backgroundColor,
      slotStyles: slotStyles,
    });
  }, [styles, slotStyles, puck.isEditing]);

  const mergedStyles = deepMerge(
    { backgroundColor: sharedCardProps?.cardBackground },
    styles
  );

  const isInEditor = puck.isEditing;

  const showCategory =
    parentStyles?.showCategory &&
    (conditionalRender?.hasCategory || isInEditor);
  const showPublishTime =
    parentStyles?.showPublishTime &&
    (conditionalRender?.hasPublishTime || isInEditor);

  return (
    <Background
      className="rounded flex flex-col"
      background={mergedStyles.backgroundColor}
      ref={puck.dragRef}
    >
      {parentStyles?.showImage && (
        <slots.ImageSlot style={{ height: "auto" }} allow={[]} />
      )}
      <div className="flex flex-col gap-4 p-6 flex-grow">
        <div className="flex flex-col gap-2 flex-grow">
          {(showCategory || showPublishTime) && (
            <div className="flex items-center">
              {showCategory && (
                <div className="flex items-center">
                  <slots.CategorySlot style={{ height: "auto" }} allow={[]} />
                </div>
              )}
              {showCategory && showPublishTime && (
                <span className="px-3">|</span>
              )}
              {showPublishTime && (
                <div className="flex items-center">
                  <slots.PublishTimeSlot
                    style={{ height: "auto" }}
                    allow={[]}
                  />
                </div>
              )}
            </div>
          )}
          <slots.TitleSlot style={{ height: "auto" }} allow={[]} />
          {parentStyles?.showDescription && (
            <slots.DescriptionSlot style={{ height: "auto" }} allow={[]} />
          )}
        </div>
        <div className="mt-auto">
          {parentStyles?.showCTA && (
            <slots.CTASlot style={{ height: "auto" }} allow={[]} />
          )}
        </div>
      </div>
    </Background>
  );
};

export const InsightCard: YextComponentConfig<InsightCardProps> = {
  label: msg("slots.insightCard", "Insight Card"),
  fields: insightCardFields,
  inline: true,
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      ImageSlot: [],
      TitleSlot: [],
      CategorySlot: [],
      DescriptionSlot: [],
      PublishTimeSlot: [],
      CTASlot: [],
    },
  },
  resolveData: (data, params) => {
    const streamDocument = params.metadata?.streamDocument;
    const locale = streamDocument?.locale ?? "en";

    if (!streamDocument || !locale) {
      return data;
    }

    let updatedData = data;
    const {
      field,
      image,
      name,
      category: categoryValue,
      description,
      publishTime,
      cta,
    } = updatedData.props;

    if (field) {
      const category = resolveComponentData(
        categoryValue,
        locale,
        streamDocument,
        {
          output: "plainText",
        }
      );

      updatedData = {
        ...updatedData,
        props: {
          ...updatedData.props,
          conditionalRender: {
            hasCategory: !!category,
            hasPublishTime: !!publishTime,
          },
        },
      };
    } else {
      const category = resolveComponentData(
        updatedData.props.slots.CategorySlot[0]?.props.data
          .text as YextEntityField<TranslatableRichText>,
        locale,
        streamDocument,
        {
          output: "plainText",
        }
      );

      const publishTime = resolveComponentData(
        updatedData.props.slots.PublishTimeSlot[0]?.props.data.date,
        locale,
        streamDocument
      );

      updatedData = {
        ...updatedData,
        props: {
          ...updatedData.props,
          conditionalRender: {
            hasCategory: !!category,
            hasPublishTime: !!publishTime,
          },
        },
      };
    }

    updatedData = syncParentStyles(params, updatedData, [
      "showImage",
      "showCategory",
      "showPublishTime",
      "showDescription",
      "showCTA",
    ]);

    return bindSlots(updatedData as typeof data, {
      ImageSlot: image
        ? { field: field ? `${field}.image` : "", image }
        : undefined,
      TitleSlot: name
        ? { field: field ? `${field}.name` : "", text: name }
        : undefined,
      CategorySlot: categoryValue
        ? {
            field: field ? `${field}.category` : "",
            text: categoryValue,
          }
        : undefined,
      DescriptionSlot: description
        ? {
            field: field ? `${field}.description` : "",
            richText: description,
          }
        : undefined,
      PublishTimeSlot: publishTime
        ? {
            field: field ? `${field}.publishTime` : "",
            date: publishTime,
          }
        : undefined,
      CTASlot: cta ? { field: field ? `${field}.cta` : "", cta } : undefined,
    });
  },
  render: (props) => <InsightCardComponent {...props} />,
};
