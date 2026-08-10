// @ts-nocheck
import * as React from "react";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { Background } from "../../atoms/background";
import { CTAWrapperProps } from "../../contentBlocks/CtaWrapper";
import { BodyTextProps } from "../../contentBlocks/BodyText";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { ImageWrapperProps } from "../../contentBlocks/image/Image";
import { ProductStruct } from "@yext/visual-editor/section-library-support";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import { getDefaultRTF } from "@yext/visual-editor/section-library-support";
import { ImgSizesByBreakpoint } from "../../atoms/image";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { PuckComponent, setDeep, Slot, WithId } from "@puckeditor/core";
import {
  useCardContext,
  useParentCardStyles,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import { getRandomPlaceholderImageObject } from "@yext/visual-editor/section-library-support";
import { TextProps } from "../../contentBlocks/Text";
import { ProductSectionVariant } from "./ProductSection";
import { syncParentStyles } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import {
  formatCurrency,
  isCompleteProductPrice,
  isInvalidProductPrice,
} from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";

/**
 * Default product-shaped data used to keep placeholder content aligned with
 * the ProductStruct type.
 */
const defaultProductData = {
  image: {
    url: "https://placehold.co/640x360",
    height: 360,
    width: 640,
  },
  category: { defaultValue: "Category" },
  name: { defaultValue: "Product Name" },
  price: {
    value: 123,
    currencyCode: "USD",
  },
  description: {
    defaultValue: getDefaultRTF(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ),
  },
  cta: {
    label: { defaultValue: "Learn More" },
    link: "#",
    linkType: "URL" as const,
    ctaType: "textAndLink" as const,
  },
} satisfies ProductStruct;

const slotDefaultData = {
  priceText: { defaultValue: "$123.00" },
};

export const defaultProductCardSlotData = (
  id?: string,
  index?: number,
  backgroundColor?: ThemeColor,
  sharedSlotStyles?: Record<string, any>
) => {
  const cardData = {
    type: "ProductCard",
    props: {
      ...(id && { id }),
      ...(index !== undefined && { index }),
      styles: {
        backgroundColor: backgroundColor ?? backgroundColors.background1.value,
      } satisfies ProductCardProps["styles"],
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
                imageConstrain: "fill",
              },
            } satisfies ImageWrapperProps,
          },
        ],
        BrowSlot: [
          {
            type: "TextSlot",
            props: {
              ...(id && { id: `${id}-brow` }),
              data: {
                text: {
                  field: "",
                  constantValue: defaultProductData.category,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "sm",
                fontStyle: "bold",
              },
            } satisfies TextProps,
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
                  constantValue: defaultProductData.name,
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
        PriceSlot: [
          {
            type: "TextSlot",
            props: {
              ...(id && { id: `${id}-price` }),
              data: {
                text: {
                  field: "",
                  constantValue: slotDefaultData.priceText,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
                fontStyle: "bold",
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
                  constantValue: defaultProductData.description,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "base",
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
                  constantValue: defaultProductData.cta,
                  constantValueEnabled: true,
                },
              },
              styles: {
                variant: "secondary",
                presetImage: "app-store",
              },
            } satisfies CTAWrapperProps,
          },
        ],
      },
    } satisfies ProductCardProps,
  };

  Object.entries(cardData.props.slots).forEach(([slotKey, slotArray]) => {
    if (sharedSlotStyles?.[slotKey]) {
      slotArray[0].props.styles = sharedSlotStyles[slotKey];
    }
  });

  return cardData;
};

export type ProductCardProps = {
  /** @internal */
  field?: string;
  image?: ProductStruct["image"];
  category?: ProductStruct["category"];
  name?: ProductStruct["name"];
  price?: ProductStruct["price"];
  description?: ProductStruct["description"];
  cta?: ProductStruct["cta"];
  styles: {
    /** The background color of each individual card
     * @defaultValue Background Color 1
     */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    ImageSlot: Slot;
    BrowSlot: Slot;
    TitleSlot: Slot;
    PriceSlot: Slot;
    DescriptionSlot: Slot;
    CTASlot: Slot;
  };

  /** @internal */
  parentStyles?: {
    variant: ProductSectionVariant;
    showImage: boolean;
    showBrow: boolean;
    showTitle: boolean;
    showPrice: boolean;
    showDescription: boolean;
    showCTA: boolean;
  };

  /** @internal */
  conditionalRender?: {
    price?: boolean;
    brow?: boolean;
    description?: boolean;
    cta?: boolean;
  };

  /** @internal */
  imageStyles?: {
    aspectRatio?: number;
    width?: number;
  };

  /** @internal */
  index?: number;
};

const ProductCardFields: YextFields<ProductCardProps> = {
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
      BrowSlot: { type: "slot" },
      TitleSlot: { type: "slot" },
      PriceSlot: { type: "slot" },
      DescriptionSlot: { type: "slot" },
      CTASlot: { type: "slot" },
    },
    visible: false,
  },
};

const ProductCardComponent: PuckComponent<ProductCardProps> = (props) => {
  const { styles, puck, conditionalRender, slots } = props;
  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardBackground: ThemeColor | undefined;
    slotStyles: Record<string, ProductCardProps["styles"]>;
  }>();
  const inheritedParentStyles =
    useParentCardStyles<ProductCardProps["parentStyles"]>();

  const parentStyles = inheritedParentStyles ?? props.parentStyles;
  const variant = parentStyles?.variant ?? "immersive";

  const { slotStyles, getPuck, slotProps } = useGetCardSlots<ProductCardProps>(
    props.id
  );

  // sharedCardProps useEffect
  // When the context changes, dispatch an update to sync the changes to puck
  React.useEffect(() => {
    if (!puck.isEditing || !sharedCardProps || !getPuck) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardBackground) ===
        JSON.stringify(styles.backgroundColor) &&
      JSON.stringify(slotStyles) === JSON.stringify(sharedCardProps?.slotStyles)
    ) {
      return;
    }

    const { dispatch, getSelectorForId } = getPuck();
    const selector = getSelectorForId(props.id);
    if (!selector || !slotProps) {
      return;
    }

    const newSlotData: ProductCardProps["slots"] = {
      ImageSlot: [],
      BrowSlot: [],
      TitleSlot: [],
      PriceSlot: [],
      DescriptionSlot: [],
      CTASlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      newSlotData[key as keyof ProductCardProps["slots"]] = [
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
        type: "ProductCard",
        props: {
          ...otherProps,
          styles: {
            ...otherProps.styles,
            backgroundColor:
              sharedCardProps?.cardBackground ||
              backgroundColors.background1.value,
          },
          slots: newSlotData,
        } satisfies ProductCardProps,
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
  }, [styles, slotStyles]);

  const hasPrice =
    parentStyles?.showPrice && (conditionalRender?.price || puck.isEditing);
  const hasDescription =
    parentStyles?.showDescription &&
    (conditionalRender?.description || puck.isEditing);
  const hasCTA =
    parentStyles?.showCTA && (conditionalRender?.cta || puck.isEditing);
  const hasBrow =
    parentStyles?.showBrow && (conditionalRender?.brow || puck.isEditing);
  const bottomPadding = hasCTA ? "pb-8" : "pb-4";

  return (
    <Background
      className={themeManagerCn(
        "flex flex-col h-full",
        variant !== "minimal" && "rounded-lg overflow-hidden border"
      )}
      background={variant === "minimal" ? undefined : styles.backgroundColor}
      ref={puck.dragRef}
    >
      {parentStyles?.showImage && (
        <div className={variant === "classic" ? "px-8 pt-8" : ""}>
          <div className={"w-full"}>
            <slots.ImageSlot style={{ height: "fit-content" }} allow={[]} />
          </div>
        </div>
      )}
      <div
        className={themeManagerCn(
          "flex flex-col flex-grow gap-4 pt-4",
          variant !== "minimal" && bottomPadding,
          variant !== "minimal" && "px-8"
        )}
      >
        <div className="gap-4 flex flex-col flex-grow">
          {(hasBrow || parentStyles?.showTitle) && (
            <div className="flex flex-col">
              {hasBrow && (
                <slots.BrowSlot style={{ height: "auto" }} allow={[]} />
              )}

              {parentStyles?.showTitle && (
                <slots.TitleSlot style={{ height: "auto" }} allow={[]} />
              )}
            </div>
          )}
          {hasPrice && (
            <div className="flex gap-4 border-l-2 border-primary-200 pl-4 items-center">
              <slots.PriceSlot style={{ height: "auto" }} allow={[]} />
            </div>
          )}

          {hasDescription && (
            <slots.DescriptionSlot style={{ height: "auto" }} allow={[]} />
          )}
        </div>
        {hasCTA && <slots.CTASlot style={{ height: "auto" }} allow={[]} />}
      </div>
    </Background>
  );
};

export const ProductCard: YextComponentConfig<ProductCardProps> = {
  label: msg("slots.productCard", "Product Card"),
  fields: ProductCardFields,
  inline: true,
  resolveData: (data, params) => {
    const locale = i18nComponentsInstance.language || "en";
    const field = data.props.field ?? "";
    const isLinkedMode = Boolean(field);
    const imageSlotProps = data.props.slots.ImageSlot?.[0]?.props as
      | (WithId<ImageWrapperProps> & {
          styles?: { aspectRatio?: number; width?: number };
        })
      | undefined;
    const priceSlotProps = data.props.slots.PriceSlot?.[0]?.props as
      | WithId<TextProps>
      | undefined;
    const priceEntityField = priceSlotProps?.data.text as
      | YextEntityField<ProductStruct["price"]>
      | undefined;
    const entityPrice = isLinkedMode
      ? data.props.price
      : priceEntityField
        ? resolveYextEntityField<ProductStruct["price"]>(
            params.metadata.streamDocument,
            priceEntityField,
            locale
          )
        : undefined;

    const resolvedPriceFromEntity = formatCurrency(
      entityPrice?.value,
      entityPrice?.currencyCode,
      locale
    );
    const fallbackPriceCandidate =
      !isLinkedMode && priceSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            priceSlotProps?.data?.text,
            locale
          )
        : undefined;
    const resolvedFallbackPrice = !fallbackPriceCandidate
      ? fallbackPriceCandidate
      : isCompleteProductPrice(fallbackPriceCandidate, locale)
        ? formatCurrency(
            fallbackPriceCandidate.value,
            fallbackPriceCandidate.currencyCode,
            locale
          )
        : isInvalidProductPrice(fallbackPriceCandidate, locale)
          ? undefined
          : resolveComponentData(
              fallbackPriceCandidate,
              locale,
              params.metadata.streamDocument,
              { output: "plainText" }
            );
    const resolvedPrice = resolvedPriceFromEntity
      ? resolvedPriceFromEntity
      : resolvedFallbackPrice;
    const showPrice = Boolean(resolvedPrice);

    const browSlotProps = data.props.slots.BrowSlot?.[0]?.props as
      | WithId<TextProps>
      | undefined;
    const resolvedBrow = isLinkedMode
      ? data.props.category
      : browSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            browSlotProps.data.text,
            locale
          )
        : undefined;
    const showBrow = Boolean(resolvedBrow);

    const descriptionSlotProps = data.props.slots.DescriptionSlot?.[0]
      ?.props as WithId<BodyTextProps> | undefined;

    const resolvedDescription = isLinkedMode
      ? data.props.description
      : descriptionSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            descriptionSlotProps.data.text,
            locale
          )
        : undefined;
    const showDescription = Boolean(resolvedDescription);

    const ctaSlotProps = data.props.slots.CTASlot?.[0]?.props as
      | WithId<CTAWrapperProps>
      | undefined;
    const resolvedCTA = isLinkedMode
      ? data.props.cta
      : ctaSlotProps
        ? resolveYextEntityField(
            params.metadata.streamDocument,
            ctaSlotProps.data.entityField,
            locale
          )
        : undefined;
    const showCTA = Boolean(resolvedCTA);

    let updatedData = {
      ...data,
      props: {
        ...data.props,
        conditionalRender: {
          price: showPrice,
          brow: showBrow,
          description: showDescription,
          cta: showCTA,
        },
        imageStyles: {
          aspectRatio: imageSlotProps?.styles?.aspectRatio,
          width: imageSlotProps?.styles?.width,
        },
      } satisfies ProductCardProps,
    };

    updatedData = syncParentStyles(params, updatedData, [
      "variant",
      "showImage",
      "showBrow",
      "showTitle",
      "showPrice",
      "showDescription",
      "showCTA",
    ]);

    // Set the image's sizes attribute
    updatedData = setDeep(updatedData, "props.slots.ImageSlot[0].props.sizes", {
      base: "calc(100vw - 32px)",
      md: "calc((maxWidth - 32px) / 2)",
      lg: "calc((maxWidth - 32px) / 3)",
    } satisfies ImgSizesByBreakpoint);

    // Set the CTA's event name
    updatedData = setDeep(
      updatedData,
      "props.slots.CTASlot[0].props.eventName",
      `cta${data.props.index}`
    );

    const {
      image: linkedImage,
      category: linkedCategory,
      name: linkedName,
      description: linkedDescription,
      price: linkedPrice,
      cta: linkedCTA,
    } = updatedData.props;
    const image = isLinkedMode ? linkedImage : undefined;
    const name = isLinkedMode ? linkedName : undefined;
    const resolvedName =
      name &&
      resolveComponentData(name, locale, params.metadata.streamDocument, {
        output: "plainText",
      });
    const brow = isLinkedMode ? linkedCategory : undefined;
    const description = isLinkedMode ? linkedDescription : undefined;
    const cta = isLinkedMode ? linkedCTA : undefined;

    return bindSlots(updatedData as typeof data, {
      ImageSlot: image
        ? ({ field, image } satisfies ImageWrapperProps["parentData"])
        : undefined,
      TitleSlot: resolvedName
        ? ({
            field,
            text: resolvedName,
          } satisfies HeadingTextProps["parentData"])
        : undefined,
      BrowSlot: brow
        ? ({ field, text: brow } satisfies TextProps["parentData"])
        : undefined,
      PriceSlot:
        linkedPrice && resolvedPriceFromEntity
          ? ({
              field,
              text: resolvedPriceFromEntity,
            } satisfies TextProps["parentData"])
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
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      ImageSlot: [],
      BrowSlot: [],
      TitleSlot: [],
      PriceSlot: [],
      DescriptionSlot: [],
      CTASlot: [],
    },
  },
  render: (props) => <ProductCardComponent {...props} />,
};
