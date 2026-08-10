// @ts-nocheck
import * as React from "react";
import { PuckComponent, Slot, WithId, setDeep } from "@puckeditor/core";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { Background } from "../../atoms/background";
import { PersonStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { ImageWrapperProps } from "../../contentBlocks/image/Image";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { CTAWrapperProps } from "../../contentBlocks/CtaWrapper";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { ImgSizesByBreakpoint } from "../../atoms/image";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { EmailsProps } from "../../contentBlocks/Emails";
import { PhoneListProps } from "../../contentBlocks/PhoneList";
import {
  useCardContext,
  useParentCardStyles,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { TextProps } from "../../contentBlocks/Text";
import { syncParentStyles } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";

const defaultPerson = {
  name: { defaultValue: "First Last" },
  title: { defaultValue: "Associate Agent" },
  phoneNumber: "+12027706619",
  email: "jkelley@[company].com",
  cta: {
    label: { defaultValue: "Visit Profile" },
    link: "#",
    linkType: "URL",
    ctaType: "textAndLink",
  },
  headshot: {
    // Placeholder headshot, uploaded to account 4174974
    url: "https://a.mktgcdn.com/p/EQRaOZG5zFlcbEHYaH16EV6WmkzV8kd6vMd73Myg4AA/196x196.jpg",
    height: 80,
    width: 80,
    alternateText: "Headshot Image",
  },
} satisfies PersonStruct;

export const defaultTeamCardSlotData = (
  id?: string,
  index?: number,
  backgroundColor?: ThemeColor,
  sharedSlotStyles?: Record<string, any>
) => {
  const cardData = {
    type: "TeamCard",
    props: {
      ...(id && { id }),
      ...(index !== undefined && { index }),
      styles: {
        backgroundColor: backgroundColor ?? backgroundColors.background1.value,
      } satisfies TeamCardProps["styles"],
      slots: {
        ImageSlot: [
          {
            type: "ImageSlot",
            props: {
              ...(id && { id: `${id}-image` }),
              data: {
                image: {
                  field: "",
                  constantValue: defaultPerson.headshot,
                  constantValueEnabled: true,
                },
              },
              styles: {
                aspectRatio: 1,
                width: 200,
              },
              hideWidthProp: true,
            } satisfies ImageWrapperProps,
          },
        ],
        NameSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              ...(id && { id: `${id}-name` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultPerson.name,
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
        TitleSlot: [
          {
            type: "TextSlot",
            props: {
              ...(id && { id: `${id}-title` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultPerson.title,
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
        PhoneSlot: [
          {
            type: "PhoneNumbersSlot",
            props: {
              ...(id && { id: `${id}-phone` }),
              data: {
                phoneNumbers: [
                  {
                    number: {
                      field: "",
                      constantValue: defaultPerson.phoneNumber,
                      constantValueEnabled: true,
                    },
                    label: { defaultValue: "" },
                  },
                ],
              },
              styles: {
                phoneFormat: "domestic",
                includePhoneHyperlink: true,
              },
              eventName: index !== undefined ? `card${index}-phone` : undefined,
            } satisfies PhoneListProps,
          },
        ],
        EmailSlot: [
          {
            type: "EmailsSlot",
            props: {
              ...(id && { id: `${id}-email` }),
              data: {
                list: {
                  field: "",
                  constantValue: [defaultPerson.email],
                  constantValueEnabled: true,
                },
              },
              styles: {
                listLength: 1,
              },
              eventName: index !== undefined ? `card${index}-email` : undefined,
            } satisfies EmailsProps,
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
                  constantValue: defaultPerson.cta,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "primary",
                presetImage: "app-store",
              },
              eventName: index !== undefined ? `card${index}-cta` : undefined,
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

export type TeamCardProps = {
  /** @internal */
  field?: string;
  headshot?: PersonStruct["headshot"];
  name?: PersonStruct["name"];
  title?: PersonStruct["title"];
  phoneNumber?: PersonStruct["phoneNumber"];
  email?: PersonStruct["email"];
  cta?: PersonStruct["cta"];
  /** Styling for all the cards. */
  styles: {
    /** The background color of each team card */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    ImageSlot: Slot;
    NameSlot: Slot;
    TitleSlot: Slot;
    PhoneSlot: Slot;
    EmailSlot: Slot;
    CTASlot: Slot;
  };

  /** @internal */
  parentStyles?: {
    showImage: boolean;
    showTitle: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showCTA: boolean;
  };

  /** @internal */
  conditionalRender?: {
    image?: boolean;
    name: boolean;
    title?: boolean;
    phone?: boolean;
    email?: boolean;
    cta?: boolean;
  };

  /** @internal */
  index?: number;
};

const teamCardFields: YextFields<TeamCardProps> = {
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
      NameSlot: { type: "slot" },
      TitleSlot: { type: "slot" },
      PhoneSlot: { type: "slot" },
      EmailSlot: { type: "slot" },
      CTASlot: { type: "slot" },
    },
    visible: false,
  },
};

const TeamCardComponent: PuckComponent<TeamCardProps> = (props) => {
  const { styles, slots, puck, conditionalRender } = props;

  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardStyles: TeamCardProps["styles"];
    slotStyles: Record<string, TeamCardProps["styles"]>;
  }>();
  const parentStyles =
    useParentCardStyles<TeamCardProps["parentStyles"]>() ?? props.parentStyles;

  const { slotStyles, getPuck, slotProps } = useGetCardSlots<TeamCardProps>(
    props.id
  );

  const showName = Boolean(conditionalRender?.name || puck.isEditing);
  const showTitle =
    parentStyles?.showTitle &&
    Boolean(conditionalRender?.title || puck.isEditing);
  const showPhone =
    parentStyles?.showPhone &&
    Boolean(conditionalRender?.phone || puck.isEditing);
  const showEmail =
    parentStyles?.showEmail &&
    Boolean(conditionalRender?.email || puck.isEditing);
  const showCta =
    parentStyles?.showCTA && Boolean(conditionalRender?.cta || puck.isEditing);

  const showImage =
    parentStyles?.showImage && (conditionalRender?.image || puck.isEditing);

  const showTopSection = showImage || showName || showTitle;

  const showBottomSection = showPhone || showEmail || showCta;

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

    const newSlotData: TeamCardProps["slots"] = {
      ImageSlot: [],
      NameSlot: [],
      TitleSlot: [],
      PhoneSlot: [],
      EmailSlot: [],
      CTASlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      newSlotData[key as keyof TeamCardProps["slots"]] = [
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
        type: "TeamCard",
        props: {
          ...otherProps,
          styles: {
            ...otherProps.styles,
            backgroundColor:
              sharedCardProps?.cardStyles.backgroundColor ||
              backgroundColors.background1.value,
          },
          slots: newSlotData,
        } satisfies TeamCardProps,
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
      {showTopSection && (
        <Background
          background={styles.backgroundColor}
          className="flex p-8 gap-6"
        >
          {showImage && (
            <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden">
              <slots.ImageSlot style={{ height: "auto" }} allow={[]} />
            </div>
          )}
          <div className="flex flex-col justify-center gap-1">
            {showName && (
              <slots.NameSlot style={{ height: "auto" }} allow={[]} />
            )}
            {showTitle && (
              <slots.TitleSlot style={{ height: "auto" }} allow={[]} />
            )}
          </div>
        </Background>
      )}
      {showTopSection && showBottomSection && <hr className="border" />}
      {showBottomSection && (
        <Background
          background={backgroundColors.background1.value}
          className="flex flex-grow p-8"
        >
          <div className="flex flex-col flex-grow gap-4">
            {showPhone && (
              <slots.PhoneSlot style={{ height: "auto" }} allow={[]} />
            )}
            {showEmail && (
              <slots.EmailSlot style={{ height: "auto" }} allow={[]} />
            )}
            {showCta && (
              <div className="mt-auto w-full md:w-auto">
                <slots.CTASlot style={{ height: "auto" }} allow={[]} />
              </div>
            )}
          </div>
        </Background>
      )}
    </div>
  );
};

export const TeamCard: YextComponentConfig<TeamCardProps> = {
  label: msg("components.teamCard", "Team Card"),
  fields: teamCardFields,
  inline: true,
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      ImageSlot: [],
      NameSlot: [],
      TitleSlot: [],
      PhoneSlot: [],
      EmailSlot: [],
      CTASlot: [],
    },
  },
  resolveData: (data, params) => {
    const field = data.props.field ?? "";
    const isLinkedMode = Boolean(field);

    const imageSlotProps = data.props.slots.ImageSlot?.[0]?.props as
      | WithId<ImageWrapperProps>
      | undefined;
    const nameSlotProps = data.props.slots.NameSlot?.[0]?.props as
      | WithId<HeadingTextProps>
      | undefined;
    const titleSlotProps = data.props.slots.TitleSlot?.[0]?.props as
      | WithId<TextProps>
      | undefined;
    const phoneSlotProps = data.props.slots.PhoneSlot?.[0]?.props as
      | WithId<any>
      | undefined;
    const emailSlotProps = data.props.slots.EmailSlot?.[0]?.props as
      | WithId<any>
      | undefined;
    const ctaSlotProps = data.props.slots.CTASlot?.[0]?.props as
      | WithId<CTAWrapperProps>
      | undefined;

    const showImage = Boolean(
      isLinkedMode
        ? data.props.headshot ||
            (imageSlotProps?.data.image.constantValue &&
              "hasLocalizedValue" in imageSlotProps.data.image.constantValue) ||
            (imageSlotProps?.data.image.constantValue &&
              "url" in imageSlotProps.data.image.constantValue &&
              imageSlotProps.data.image.constantValue.url) ||
            (imageSlotProps?.data.image.constantValue &&
              "image" in imageSlotProps.data.image.constantValue &&
              imageSlotProps.data.image.constantValue.image?.url)
        : imageSlotProps &&
            (imageSlotProps.data.image.field ||
              (imageSlotProps.data.image.constantValue &&
                "hasLocalizedValue" in
                  imageSlotProps.data.image.constantValue) ||
              (imageSlotProps.data.image.constantValue &&
                "url" in imageSlotProps.data.image.constantValue &&
                imageSlotProps.data.image.constantValue.url) ||
              (imageSlotProps.data.image.constantValue &&
                "image" in imageSlotProps.data.image.constantValue &&
                imageSlotProps.data.image.constantValue.image?.url))
    );
    const showName = Boolean(
      isLinkedMode
        ? data.props.name
        : nameSlotProps &&
            resolveYextEntityField(
              params.metadata.streamDocument,
              nameSlotProps.data.text,
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
    const showPhone = Boolean(
      isLinkedMode
        ? data.props.phoneNumber ||
            (phoneSlotProps?.data?.phoneNumbers?.length &&
              phoneSlotProps.data.phoneNumbers.some(
                (phone: any) =>
                  phone.number?.constantValue || phone.number?.field
              ))
        : phoneSlotProps?.data?.phoneNumbers?.length &&
            phoneSlotProps.data.phoneNumbers.some(
              (phone: any) => phone.number?.constantValue || phone.number?.field
            )
    );
    const showEmail = Boolean(
      isLinkedMode
        ? data.props.email ||
            emailSlotProps?.data?.list?.constantValue?.length ||
            emailSlotProps?.data?.list?.field
        : emailSlotProps?.data?.list?.constantValue?.length ||
            emailSlotProps?.data?.list?.field
    );
    const showCTA = Boolean(
      isLinkedMode
        ? data.props.cta?.label ||
            ctaSlotProps?.data?.entityField?.constantValue?.label ||
            ctaSlotProps?.data?.entityField?.field
        : ctaSlotProps?.data?.entityField?.constantValue?.label ||
            ctaSlotProps?.data?.entityField?.field ||
            (ctaSlotProps &&
              resolveYextEntityField(
                params.metadata.streamDocument,
                ctaSlotProps.data.entityField
              )?.label)
    );

    let updatedData = {
      ...data,
      props: {
        ...data.props,
        conditionalRender: {
          image: showImage,
          name: showName,
          title: showTitle,
          phone: showPhone,
          email: showEmail,
          cta: showCTA,
        },
      } satisfies TeamCardProps,
    };

    // Set constant values for ImageSlot sizes and className props
    updatedData = setDeep(
      updatedData,
      "props.slots.ImageSlot[0].props.className",
      "max-w-full h-full object-cover"
    );
    updatedData = setDeep(updatedData, "props.slots.ImageSlot[0].props.sizes", {
      base: "80px",
    } satisfies ImgSizesByBreakpoint);

    // Set the CTA's event name
    updatedData = setDeep(
      updatedData,
      "props.slots.CTASlot[0].props.eventName",
      `card${data.props.index}-cta`
    );

    // Set the Phone's event name
    updatedData = setDeep(
      updatedData,
      "props.slots.PhoneSlot[0].props.eventName",
      `card${data.props.index}-phone`
    );

    // Set the Email's event name
    updatedData = setDeep(
      updatedData,
      "props.slots.EmailSlot[0].props.eventName",
      `card${data.props.index}-email`
    );

    updatedData = syncParentStyles(params, updatedData, [
      "showImage",
      "showTitle",
      "showPhone",
      "showEmail",
      "showCTA",
    ]);

    const { headshot, name, title, phoneNumber, email, cta } =
      updatedData.props;
    const resolvedName =
      name &&
      resolveComponentData(
        name,
        i18nComponentsInstance.language || "en",
        params.metadata.streamDocument,
        {
          output: "plainText",
        }
      );
    return bindSlots(updatedData as typeof data, {
      ImageSlot: headshot
        ? ({
            field,
            image: headshot,
          } satisfies ImageWrapperProps["parentData"])
        : undefined,
      NameSlot: resolvedName
        ? ({
            field,
            text: resolvedName,
          } satisfies HeadingTextProps["parentData"])
        : undefined,
      TitleSlot: title
        ? ({ field, text: title } satisfies TextProps["parentData"])
        : undefined,
      PhoneSlot: isLinkedMode
        ? {
            field,
            phoneNumbers: phoneNumber
              ? [{ number: phoneNumber, label: "" }]
              : [],
          }
        : undefined,
      EmailSlot: isLinkedMode
        ? {
            field,
            list: email ? [email] : [],
          }
        : undefined,
      CTASlot: cta
        ? ({ field, cta } satisfies CTAWrapperProps["parentData"])
        : undefined,
    });
  },
  render: (props) => <TeamCardComponent {...props} />,
};
