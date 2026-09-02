import { PuckComponent, Slot } from "@puckeditor/core";
import React from "react";
import { useCardContext } from "@yext/visual-editor/section-library-support";
import {
  TemplatePropsContext,
  useTemplateProps,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import {
  mergeMeta,
  resolveUrlTemplateOfChild,
} from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import { AddressProps } from "../contentBlocks/Address";
import { HeadingTextProps } from "../contentBlocks/HeadingText";
import { HoursStatusProps } from "../contentBlocks/HoursStatus";
import { PhoneProps } from "../contentBlocks/Phone";
import {
  DirectoryChildReference,
  getSortedDirectoryChildren,
  resolveDirectoryChildFromReference,
  useDirectoryChildren,
} from "./directoryChildReference";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { normalizeSlug } from "@yext/visual-editor/section-library-support";

const defaultCardTitle: YextEntityField<TranslatableString> = {
  field: "name",
  constantValue: { defaultValue: "[[name]]" },
  constantValueEnabled: false,
};

// DirectoryCardLinkOverrideField is a yes/no toggle
// that displays an entity field selector when set to yes.
export type DirectoryCardLinkOverrideFieldValue =
  YextEntityField<TranslatableString> & {
    enabled: boolean;
    normalizeLink: boolean;
  };

export const createDefaultLinkOverrideFieldValue =
  (): DirectoryCardLinkOverrideFieldValue => ({
    enabled: false,
    normalizeLink: false,
    field: "",
    constantValue: {
      defaultValue: "",
      hasLocalizedValue: "true",
    },
    constantValueEnabled: false,
  });

const isHeadingTextField = (
  value: unknown
): value is HeadingTextProps["data"]["text"] =>
  typeof value === "object" &&
  value !== null &&
  ("field" in value || "constantValue" in value);

export const defaultDirectoryCardSlotData = (
  id: string,
  index: number,
  childRef?: DirectoryChildReference,
  existingCardStyle?: DirectoryCardProps["styles"],
  existingSlots?: DirectoryCardProps["slots"]
) => {
  const existingHeadingText =
    existingSlots?.HeadingSlot?.[0]?.props?.data?.text;
  const existingHeadingStyles = existingSlots?.HeadingSlot?.[0]?.props?.styles;
  const existingAddressStyles = existingSlots?.AddressSlot?.[0]?.props?.styles;
  const existingPhoneStyles = existingSlots?.PhoneSlot?.[0]?.props?.styles;
  const existingHoursStyles = existingSlots?.HoursSlot?.[0]?.props?.styles;
  const headingTextField = isHeadingTextField(existingHeadingText)
    ? existingHeadingText
    : {
        field: "",
        constantValue: existingHeadingText ?? defaultCardTitle.constantValue,
        constantValueEnabled: true,
      };

  return {
    type: "DirectoryCard",
    props: {
      id,
      index,
      data: {
        cardTitle: defaultCardTitle,
        linkOverride: createDefaultLinkOverrideFieldValue(),
        showAddress: true,
        showHoursStatus: true,
        showPhoneNumber: true,
      },
      styles: {
        backgroundColor:
          existingCardStyle?.backgroundColor ??
          backgroundColors.background1.value,
      },
      slots: {
        HeadingSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              ...(id && { id: `${id}-heading` }),
              data: {
                text: headingTextField,
              },
              styles: {
                ...existingHeadingStyles,
                level: existingHeadingStyles?.level ?? 3,
                align: existingHeadingStyles?.align ?? "left",
              },
            } satisfies HeadingTextProps,
          },
        ],
        AddressSlot: [
          {
            type: "AddressSlot",
            props: {
              ...(id && { id: `${id}-address` }),
              data: {
                address: {
                  field: "address",
                  constantValue: {
                    line1: "",
                    city: "",
                    postalCode: "",
                    countryCode: "",
                  },
                },
              },
              styles: {
                ...existingAddressStyles,
                showRegion: existingAddressStyles?.showRegion ?? true,
                showCountry: existingAddressStyles?.showCountry ?? true,
                showGetDirectionsLink:
                  existingAddressStyles?.showGetDirectionsLink ?? false,
                ctaVariant: existingAddressStyles?.ctaVariant ?? "link",
              },
              parentData: {
                field: "profile.address",
              },
            } satisfies AddressProps,
          },
        ],
        PhoneSlot: [
          {
            type: "PhoneSlot",
            props: {
              ...(id && { id: `${id}-phone` }),
              data: {
                number: {
                  constantValue: "",
                  field: "mainPhone",
                },
                label: {
                  constantValue: "",
                  hasLocalizedValue: "true",
                  field: "",
                },
              },
              styles: {
                ...existingPhoneStyles,
                phoneFormat: existingPhoneStyles?.phoneFormat ?? "domestic",
                includePhoneHyperlink:
                  existingPhoneStyles?.includePhoneHyperlink ?? true,
                includeIcon: existingPhoneStyles?.includeIcon ?? false,
              },
              parentData: {
                field: "profile.mainPhone",
              },
            } satisfies PhoneProps,
          },
        ],
        HoursSlot: [
          {
            type: "HoursStatusSlot",
            props: {
              ...(id && { id: `${id}-hours` }),
              data: {
                hours: {
                  constantValue: {},
                  field: "hours",
                },
              },
              styles: {
                ...existingHoursStyles,
                dayOfWeekFormat: existingHoursStyles?.dayOfWeekFormat ?? "long",
                showDayNames: existingHoursStyles?.showDayNames ?? true,
                showCurrentStatus:
                  existingHoursStyles?.showCurrentStatus ?? true,
                className:
                  existingHoursStyles?.className ??
                  "mb-2 font-semibold font-body-fontFamily text-body-fontSize h-full",
              },
              parentData: {
                field: "profile.hours",
              },
            } satisfies HoursStatusProps,
          },
        ],
      },
      ...(childRef
        ? {
            parentData: {
              childRef,
            },
          }
        : {}),
    },
  };
};

export type DirectoryCardProps = {
  /** @internal */
  field?: string;

  data: {
    cardTitle: YextEntityField<TranslatableString>;
    linkOverride: DirectoryCardLinkOverrideFieldValue;
    showAddress: boolean;
    showHoursStatus: boolean;
    showPhoneNumber: boolean;
  };

  /** Styling for all the cards. */
  styles: {
    /** The background color of each directory card */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    HeadingSlot: Slot;
    AddressSlot: Slot;
    PhoneSlot: Slot;
    HoursSlot: Slot;
  };

  /** @internal */
  parentData?: {
    childRef: DirectoryChildReference;
  };

  /** @internal */
  index?: number;
};

const DirectoryCardComponent: PuckComponent<DirectoryCardProps> = (props) => {
  const { data, styles, slots, parentData, index, puck } = props;
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();
  const directoryChildrenFromContext = useDirectoryChildren();
  const sortedDirectoryChildren = React.useMemo(
    () =>
      directoryChildrenFromContext.length
        ? directoryChildrenFromContext
        : getSortedDirectoryChildren(streamDocument.dm_directoryChildren),
    [directoryChildrenFromContext, streamDocument.dm_directoryChildren]
  );
  const resolvedChild = React.useMemo(
    () =>
      resolveDirectoryChildFromReference(
        sortedDirectoryChildren,
        parentData?.childRef
      ),
    [parentData?.childRef, sortedDirectoryChildren]
  );
  // Give nested slots a child-scoped document context instead of duplicating
  // child values into each slot's parentData.
  const childDocumentContext = React.useMemo(
    () =>
      resolvedChild
        ? {
            document: {
              ...streamDocument,
              ...mergeMeta(resolvedChild, streamDocument),
            },
            relativePrefixToRoot,
          }
        : {
            document: streamDocument,
            relativePrefixToRoot,
          },
    [resolvedChild, relativePrefixToRoot, streamDocument]
  );

  const linkOverrideValue = data.linkOverride.enabled
    ? resolveComponentData(
        data.linkOverride,
        streamDocument.locale || "en",
        childDocumentContext.document
      )
    : "";
  const resolvedLinkOverride =
    typeof linkOverrideValue === "string"
      ? data.linkOverride.normalizeLink
        ? normalizeSlug(linkOverrideValue)
        : linkOverrideValue
      : "";

  // If there is a value for link override, it should be used.
  // Otherwise, construct the url based on the entity page's url template.
  let resolvedUrl: undefined | string;
  if (resolvedLinkOverride) {
    resolvedUrl = resolvedLinkOverride;
  } else if (resolvedChild) {
    resolvedUrl = resolveUrlTemplateOfChild(
      resolvedChild,
      streamDocument,
      relativePrefixToRoot
    );
  }

  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardStyles: DirectoryCardProps["styles"];
    slotStyles: Record<string, DirectoryCardProps["styles"]>;
  }>();

  const { slotStyles, getPuck, slotProps } =
    useGetCardSlots<DirectoryCardProps>(props.id);

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

    const newSlotData: DirectoryCardProps["slots"] = {
      HeadingSlot: [],
      PhoneSlot: [],
      HoursSlot: [],
      AddressSlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      const nextSlotValue = deepMerge(
        { props: { styles: { ...sharedCardProps?.slotStyles?.[key] } } },
        value[0]
      );
      newSlotData[key as keyof DirectoryCardProps["slots"]] = [
        {
          ...nextSlotValue,
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
        type: "DirectoryCard",
        props: {
          ...otherProps,
          data: props.data,
          styles: {
            backgroundColor:
              sharedCardProps?.cardStyles.backgroundColor ||
              backgroundColors.background1.value,
          },
          slots: newSlotData,
        } satisfies DirectoryCardProps,
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
      className="h-full flex flex-col p-8 border border-gray-400 rounded gap-4"
      background={styles.backgroundColor}
    >
      <TemplatePropsContext.Provider value={childDocumentContext}>
        <div className="mb-2 max-w-full w-full">
          <MaybeLink
            eventName={`link${index}`}
            alwaysHideCaret={true}
            className="text-wrap break-words block w-full"
            href={resolvedUrl}
            disabled={puck.isEditing}
          >
            <slots.HeadingSlot style={{ height: "auto" }} />
          </MaybeLink>
        </div>
        {data.showHoursStatus && resolvedChild?.hours && (
          <slots.HoursSlot style={{ height: "auto" }} />
        )}
        {data.showPhoneNumber && resolvedChild?.mainPhone && (
          <slots.PhoneSlot style={{ height: "auto" }} />
        )}
        {data.showAddress && resolvedChild?.address && (
          <div className="font-body-fontFamily font-body-fontWeight text-body-fontSize">
            <slots.AddressSlot style={{ height: "auto" }} />
          </div>
        )}
      </TemplatePropsContext.Provider>
    </Background>
  );
};

const directoryCardFields: YextFields<DirectoryCardProps> = {
  // The data fields are configured by directoryCardsSource.mappingFields in DirectoryWrapper.tsx.
  data: {
    type: "custom",
    visible: false,
    render: () => <></>,
  },
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
      HeadingSlot: { type: "slot" },
      AddressSlot: { type: "slot" },
      PhoneSlot: { type: "slot" },
      HoursSlot: { type: "slot" },
    },
    visible: false,
  },
};

export const DirectoryCard: YextComponentConfig<DirectoryCardProps> = {
  label: msg("slots.directoryCard", "Directory Card"),
  fields: directoryCardFields,
  defaultProps: {
    data: {
      cardTitle: defaultCardTitle,
      linkOverride: createDefaultLinkOverrideFieldValue(),
      showAddress: true,
      showHoursStatus: true,
      showPhoneNumber: true,
    },
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      HeadingSlot: [],
      PhoneSlot: [],
      HoursSlot: [],
      AddressSlot: [],
    },
  },
  resolveData: (data) =>
    bindSlots(data, {
      HeadingSlot:
        typeof data.props.data?.cardTitle === "string"
          ? ({
              field: data.props.field ?? "name",
              text: data.props.data.cardTitle,
            } satisfies HeadingTextProps["parentData"])
          : undefined,
    }),
  render: (props) => <DirectoryCardComponent {...props} />,
};
