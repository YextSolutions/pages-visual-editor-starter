// @ts-nocheck
import { PuckComponent, setDeep } from "@puckeditor/core";
import { ThemeColor, ThemeOptions } from "@yext/visual-editor/section-library-support";
import { CTA, CTAVariant, isCtaVariantWithColor } from "../atoms/cta";
import {
  EnhancedTranslatableCTA,
  PresetImageType,
  TranslatableString,
} from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { isNonNormalizableLinkType } from "@yext/visual-editor/section-library-support";
import { getCTAType } from "@yext/visual-editor/section-library-support";
import { type YextCTAField } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface CTAWrapperProps {
  data: {
    /** Whether to show the CTA */
    show?: boolean;
    /** Whether CTA renders as a link or a button */
    actionType?: "link" | "button";
    /** Whether CTA links should be normalized before rendering */
    normalizeLink: boolean;
    /** The call to action to display */
    entityField: YextCTAField;
    /** Static text for the button label */
    buttonText?: TranslatableString;
    /** Sets id attribute on the button */
    customId?: string;
    /** Sets className attribute on the button */
    customClass?: string;
    /** Renders as data-* attributes */
    dataAttributes?: Array<{ key: string; value: string }>;
    /** Override for screen reader label */
    ariaLabel?: TranslatableString;
  };

  styles: {
    /** The visual style of the CTA. */
    variant: CTAVariant;
    /** The image to use if the CTA is set to preset image */
    presetImage?: PresetImageType;
    color?: ThemeColor;
  };

  /** Additional CSS classes to apply to the CTA. */
  className?: string;

  /** @internal Controlled data from the parent section. */
  parentData?: {
    field: string;
    cta: EnhancedTranslatableCTA;
  };

  /** @internal Controlled style from the parent section */
  parentStyles?: {
    classNameFn?: (variant: CTAVariant) => string;
  };

  /** @internal Event name to be used for click analytics */
  eventName?: string;
}

const ctaWrapperFields: YextFields<CTAWrapperProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      show: {
        label: msg("fields.showCTA", "Show CTA"),
        type: "radio",
        options: [
          { label: msg("fields.options.show", "Show"), value: true },
          { label: msg("fields.options.hide", "Hide"), value: false },
        ],
        visible: false,
      },
      actionType: {
        label: msg("fields.actionType", "Action Type"),
        type: "radio",
        options: [
          { label: msg("fields.options.link", "Link"), value: "link" },
          { label: msg("fields.options.button", "Button"), value: "button" },
        ],
      },
      entityField: {
        type: "ctaSelector",
        label: msg("fields.cta", "CTA"),
      },
      normalizeLink: {
        label: msg("fields.normalizeLink", "Normalize Link"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
        visible: false,
      },
      buttonText: {
        type: "translatableString",
        label: msg("fields.buttonText", "Button Text"),
        filter: { types: ["type.string"] },
      },
      customId: {
        label: msg("fields.customId", "Custom ID"),
        type: "text",
      },
      customClass: {
        label: msg("fields.customClass", "Custom Class"),
        type: "text",
      },
      dataAttributes: {
        label: msg("fields.dataAttributes", "Data Attributes"),
        type: "array",
        defaultItemProps: {
          key: "",
          value: "",
        },
        arrayFields: {
          key: {
            label: msg("fields.key", "Key"),
            type: "text",
          },
          value: {
            label: msg("fields.value", "Value"),
            type: "text",
          },
        },
        getItemSummary: (
          item: any,
          index: number // TODO(SUMO-8378): remove typings
        ) =>
          item?.key?.trim()
            ? item.key
            : `${pt("dataAttribute", "Attribute")} ${(index ?? 0) + 1}`,
      },
      ariaLabel: {
        type: "translatableString",
        label: msg("fields.ariaLabel", "Aria Label"),
        filter: { types: ["type.string"] },
      },
    } as any, // TODO(SUMO-8378): remove `as any` once Puck fixes their objectField typing
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      variant: {
        label: msg("fields.variant", "Variant"),
        type: "radio",
        options: ThemeOptions.CTA_VARIANT,
      },
      presetImage: {
        type: "basicSelector",
        label: msg("fields.presetImage", "Preset Image"),
        options: "PRESET_IMAGE",
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
    },
  },
};

const CTAWrapperComponent: PuckComponent<CTAWrapperProps> = (props) => {
  const { t, i18n } = useTranslation();
  const { data, styles, className, parentData, puck, parentStyles, eventName } =
    props;
  const streamDocument = useDocument();

  const actionType = data.actionType ?? "link";
  const cta =
    actionType === "link"
      ? parentData
        ? parentData.cta
        : resolveComponentData(data.entityField, i18n.language, streamDocument)
      : undefined;
  const { ctaType } =
    actionType === "link"
      ? getCTAType(data.entityField)
      : { ctaType: undefined };

  let combinedClassName = className;
  if (parentStyles?.classNameFn) {
    combinedClassName = themeManagerCn(
      parentStyles.classNameFn(styles.variant),
      className
    );
  }

  let resolvedLinkLabel =
    cta && resolveComponentData(cta.label, i18n.language, streamDocument);
  const resolvedButtonLabel = data.buttonText
    ? resolveComponentData(data.buttonText, i18n.language, streamDocument)
    : "";
  const resolvedAriaLabel = data.ariaLabel
    ? resolveComponentData(data.ariaLabel, i18n.language, streamDocument)
    : "";
  if (
    actionType === "link" &&
    (parentData || !data.entityField.constantValueEnabled) &&
    ctaType === "getDirections"
  ) {
    resolvedLinkLabel = t("getDirections", "Get Directions");
  }

  const showCTA =
    actionType === "button"
      ? Boolean(resolvedButtonLabel?.trim()) && (data.show ?? true)
      : Boolean(
          cta &&
            (ctaType === "presetImage" || resolvedLinkLabel) &&
            (data.show ?? true)
        );

  const resolvedButtonClassName = themeManagerCn(
    combinedClassName,
    actionType === "button" ? data.customClass : undefined
  );

  const dataAttributeProps =
    actionType === "button" && data.dataAttributes?.length
      ? data.dataAttributes.reduce(
          (acc, { key, value }) => {
            const trimmedKey = key?.trim();
            if (!trimmedKey) {
              return acc;
            }
            const normalizedKey = trimmedKey.startsWith("data-")
              ? trimmedKey
              : `data-${trimmedKey}`;
            acc[normalizedKey as `data-${string}`] = value ?? "";
            return acc;
          },
          {} as Record<`data-${string}`, string>
        )
      : undefined;

  const ctaElement = (
    <CTA
      actionType={actionType}
      setPadding={true}
      label={actionType === "button" ? resolvedButtonLabel : resolvedLinkLabel}
      link={
        actionType === "link" && cta
          ? ctaType === "getDirections"
            ? undefined
            : resolveComponentData(cta.link, i18n.language, streamDocument)
          : undefined
      }
      linkType={actionType === "link" && cta ? cta.linkType : undefined}
      ctaType={actionType === "button" ? "textAndLink" : ctaType}
      presetImageType={actionType === "link" ? styles.presetImage : undefined}
      variant={styles.variant}
      className={
        actionType === "button" ? resolvedButtonClassName : combinedClassName
      }
      eventName={eventName}
      color={styles.color}
      id={data.customId}
      ariaLabel={actionType === "button" ? resolvedAriaLabel : undefined}
      dataAttributes={dataAttributeProps}
      normalizeLink={data.normalizeLink}
    />
  );

  return showCTA ? (
    actionType === "link" ? (
      <EntityField
        displayName={pt("cta", "CTA")}
        fieldId={parentData ? parentData.field : data.entityField.field}
        constantValueEnabled={
          !parentData && data.entityField.constantValueEnabled
        }
      >
        {ctaElement}
      </EntityField>
    ) : (
      ctaElement
    )
  ) : puck.isEditing ? (
    <div className="h-[50px] min-w-[130px]" />
  ) : (
    <></>
  );
};

export const CTAWrapper: YextComponentConfig<CTAWrapperProps> = {
  label: msg("components.callToAction", "Call to Action"),
  fields: ctaWrapperFields,
  defaultProps: {
    data: {
      actionType: "link",
      normalizeLink: true,
      entityField: {
        field: "",
        constantValue: {
          label: "Call to Action",
          link: "#",
          linkType: "URL",
        },
        selectedType: "textAndLink",
      },
      buttonText: { defaultValue: "Button" },
      customId: "",
      customClass: "",
      dataAttributes: [],
      ariaLabel: { defaultValue: "Button" },
    },
    styles: {
      variant: "primary",
      presetImage: "app-store",
    },
  },
  resolveFields: (data) => {
    const updatedFields = resolveDataFromParent(ctaWrapperFields, data);
    const ctaVariant = data.props.styles.variant;
    const actionType = data.props.data.actionType ?? "link";
    const ctaType = getCTAType(data.props.data.entityField).ctaType;
    const constantLinkType = data.props.data.entityField.constantValueEnabled
      ? data.props.data.entityField.constantValue?.linkType
      : undefined;
    const effectiveCtaType = actionType === "button" ? "textAndLink" : ctaType;
    const showButtonFields = actionType === "button";
    const showNormalizeLinkField =
      !showButtonFields && !isNonNormalizableLinkType(constantLinkType);

    if (effectiveCtaType === "presetImage") {
      setDeep(updatedFields, "styles.objectFields.variant.visible", false);
      setDeep(updatedFields, "styles.objectFields.presetImage.visible", true);
    } else {
      setDeep(updatedFields, "styles.objectFields.variant.visible", true);
      setDeep(updatedFields, "styles.objectFields.presetImage.visible", false);
    }

    // If the show field exists, make it visible in the editor
    if (data.props.data.show !== undefined) {
      setDeep(updatedFields, "data.objectFields.show.visible", true);
    } else {
      setDeep(updatedFields, "data.objectFields.show.visible", false);
    }

    const showColor =
      isCtaVariantWithColor(ctaVariant) && effectiveCtaType !== "presetImage";
    setDeep(updatedFields, "styles.objectFields.color.visible", showColor);

    if (data.props.parentData) {
      return updatedFields;
    }

    setDeep(
      updatedFields,
      "data.objectFields.entityField.visible",
      !showButtonFields
    );
    setDeep(
      updatedFields,
      "data.objectFields.normalizeLink.visible",
      showNormalizeLinkField
    );
    setDeep(
      updatedFields,
      "data.objectFields.buttonText.visible",
      showButtonFields
    );
    setDeep(
      updatedFields,
      "data.objectFields.customId.visible",
      showButtonFields
    );
    setDeep(
      updatedFields,
      "data.objectFields.customClass.visible",
      showButtonFields
    );
    setDeep(
      updatedFields,
      "data.objectFields.dataAttributes.visible",
      showButtonFields
    );
    setDeep(
      updatedFields,
      "data.objectFields.ariaLabel.visible",
      showButtonFields
    );

    return updatedFields;
  },
  render: (props) => <CTAWrapperComponent {...props} />,
};
