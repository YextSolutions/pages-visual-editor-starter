import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  CardProps,
  Coordinate,
  useCardAnalyticsCallback,
} from "@yext/search-ui-react";
import { Background } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
  HeadingLevel,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { Body, BodyProps } from "@yext/visual-editor/section-library-support";
import { CTA, CTAVariant } from "@yext/visual-editor/section-library-support";
import { Heading } from "@yext/visual-editor/section-library-support";
import { Image } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { PhoneAtom } from "@yext/visual-editor/section-library-support";
import { useTemplateProps } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { HoursStatusAtom } from "@yext/visual-editor/section-library-support";
import { HoursTableAtom } from "@yext/visual-editor/section-library-support";
import { type BasicSelectorField } from "@yext/visual-editor/section-library-support";
import type {
  YextCustomFieldRenderProps,
  YextObjectField,
} from "@yext/visual-editor/section-library-support";
import {
  buildLocatorDisplayOptions,
  type ImageField,
} from "@yext/visual-editor/section-library-support";
import { ConstantValueModeToggler } from "@yext/visual-editor/section-library-support";
import { type EmbeddedStringOption } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { TranslatableAssetImage } from "@yext/visual-editor/section-library-support";
import {
  Address,
  AddressType,
  getDirections,
  HoursType,
  ListingType,
} from "@yext/pages-components";
import {
  HoursTableProps,
  HoursTableStyleFields,
} from "../contentBlocks/HoursTable";
import { getImageUrl } from "../contentBlocks/image/Image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@yext/visual-editor/section-library-support";
import {
  FaAngleRight,
  FaMapMarkerAlt,
  FaRegClock,
  FaRegEnvelope,
} from "react-icons/fa";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { FieldTypeData } from "@yext/visual-editor/section-library-support";
import {
  formatDistance,
  fromMeters,
  getPreferredDistanceUnit,
} from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_ENTITY_TYPE,
  LocatorEntityType,
} from "@yext/visual-editor/section-library-support";
import { resolveLocatorResultUrl } from "@yext/visual-editor/section-library-support";
import {
  getBackgroundColorClasses,
  getBackgroundColorStyle,
  getTextColorClass,
  getTextColorStyle,
} from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";

export interface LocatorResultCardProps {
  /** The entity type this result card applies to. */
  entityType: LocatorEntityType;

  /** Settings for the main heading of the card */
  primaryHeading: {
    /**
     * The field from the data to use for the primary heading
     * @defaultValue "name"
     */
    field?: string;
    /** Static value for the primary heading */
    constantValue?: TranslatableString;
    /** Whether to use the static value for the primary heading */
    constantValueEnabled?: boolean;
    /** Static text to display when the selected boolean field is true */
    trueDisplayText?: TranslatableString;
    /** Static text to display when the selected boolean field is false */
    falseDisplayText?: TranslatableString;
    /** The heading level for the primary heading */
    headingLevel: HeadingLevel;
    /**
     * The color applied to the primary heading text
     * @defaultValue inherited from theme
     */
    color?: ThemeColor;
  };

  /** Settings for the secondary heading of the card */
  secondaryHeading: {
    /** The field from the data to use for the secondary heading */
    field?: string;
    /** Static value for the secondary heading */
    constantValue?: TranslatableString;
    /** Whether to use the static value for the secondary heading */
    constantValueEnabled?: boolean;
    /** Static text to display when the selected boolean field is true */
    trueDisplayText?: TranslatableString;
    /** Static text to display when the selected boolean field is false */
    falseDisplayText?: TranslatableString;
    /** The variant for the secondary heading */
    variant: BodyProps["variant"];
    /** Whether the secondary heading is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the tertiary heading of the card */
  tertiaryHeading: {
    /** The field from the data to use for the tertiary heading */
    field?: string;
    /** Static value for the tertiary heading */
    constantValue?: TranslatableString;
    /** Whether to use the static value for the tertiary heading */
    constantValueEnabled?: boolean;
    /** Static text to display when the selected boolean field is true */
    trueDisplayText?: TranslatableString;
    /** Static text to display when the selected boolean field is false */
    falseDisplayText?: TranslatableString;
    /** The variant for the tertiary heading */
    variant: BodyProps["variant"];
    /** Whether the tertiary heading is visible in live mode */
    liveVisibility: boolean;
  };

  /** Whether to show icons for certain fields */
  icons: boolean;

  /** The accent color used for icon backgrounds and contact/action links. */
  accentColor?: ThemeColor;

  /** Settings for the hours block */
  hours: {
    /** The field from the data to use for the hours */
    field?: string;
    /** Styles for the hours table */
    table: Omit<HoursTableProps["styles"], "alignment">;
    /** Whether the hours block is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the address block */
  address: {
    /**
     * Whether to include the region in the Address
     * @defaultValue true
     */
    showRegion?: boolean;

    /**
     * Whether to include the country in the Address
     * @defaultValue false
     */
    showCountry?: boolean;

    /** Whether to show the "Get Directions" link */
    showGetDirectionsLink: boolean;

    /** Whether the address block is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the phone block */
  phone: {
    /**
     * The field from the data to use for the phone number
     * @defaultValue "mainPhone"
     */
    field?: string;
    /**
     * The format to use for the phone number
     * @defaultValue "domestic"
     */
    phoneFormat: "domestic" | "international";
    /** Whether to include a hyperlink for the phone number */
    includePhoneHyperlink: boolean;
    /** Whether the phone block is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the email block */
  email: {
    /**
     * The field from the data to use for the email address
     * @defaultValue "emails"
     */
    field?: string;
    /** Whether the email block is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the services block */
  services: {
    /**The field from the data to use for the services
     * @defaultValue "services"
     */
    field?: string;
    /** Whether the services block is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the primary CTA */
  primaryCTA: {
    /** Label for the primary CTA */
    label: TranslatableString;
    /** Whether the primary CTA link should be normalized before rendering */
    normalizeLink: boolean;
    /** The variant for the primary CTA */
    variant: CTAVariant;
    /** Whether the primary CTA is visible in live mode */
    liveVisibility: boolean;
    /** Static URL to use for primary CTA when an entity page URL is not found */
    link?: TranslatableString;
  };

  /** Settings for the secondary CTA */
  secondaryCTA: {
    /** Label for the secondary CTA */
    label: TranslatableString;
    /** Template for the secondary CTA link, which can contain entity field references */
    link: TranslatableString;
    /** Whether the secondary CTA link should be normalized before rendering */
    normalizeLink: boolean;
    /** The variant for the secondary CTA */
    variant: CTAVariant;
    /** Whether the secondary CTA is visible in live mode */
    liveVisibility: boolean;
  };

  /** Settings for the image */
  image: {
    /** The field from the data to use for the image */
    field?: string;
    /** Static value for the image */
    constantValue?: TranslatableAssetImage;
    /** Whether to use the static value for the image */
    constantValueEnabled?: boolean;
    /** Whether the image block is visible in live mode */
    liveVisibility: boolean;
  };
}

export type DistanceDisplayOption =
  | "distanceFromUser"
  | "distanceFromSearch"
  | "bothDistances"
  | "hidden";

export const DEFAULT_LOCATOR_RESULT_CARD_PROPS: LocatorResultCardProps = {
  entityType: DEFAULT_ENTITY_TYPE,
  primaryHeading: {
    field: "name",
    constantValue: "",
    constantValueEnabled: false,
    headingLevel: 3,
  },
  secondaryHeading: {
    field: "name",
    constantValue: "",
    constantValueEnabled: false,
    variant: "base",
    liveVisibility: false,
  },
  tertiaryHeading: {
    field: "name",
    constantValue: "",
    constantValueEnabled: false,
    variant: "base",
    liveVisibility: false,
  },
  icons: true,
  hours: {
    field: "hours",
    table: {
      startOfWeek: "today",
      collapseDays: false,
      showAdditionalHoursText: false,
    },
    liveVisibility: true,
  },
  address: {
    showRegion: true,
    showCountry: false,
    showGetDirectionsLink: true,
    liveVisibility: true,
  },
  phone: {
    field: "mainPhone",
    phoneFormat: "domestic",
    includePhoneHyperlink: true,
    liveVisibility: true,
  },
  email: {
    field: "emails",
    liveVisibility: false,
  },
  services: {
    field: "services",
    liveVisibility: false,
  },
  primaryCTA: {
    label: "Visit Page",
    normalizeLink: true,
    variant: "primary",
    liveVisibility: true,
  },
  secondaryCTA: {
    label: "Call to Action",
    link: "#",
    normalizeLink: true,
    variant: "secondary",
    liveVisibility: false,
  },
  image: {
    field: "headshot",
    constantValue: {
      url: "",
      height: 0,
      width: 0,
    },
    constantValueEnabled: false,
    liveVisibility: false,
  },
};

const LOCATOR_IMAGE_CONSTANT_CONFIG: ImageField = {
  type: "image",
  label: msg("fields.image", "Image"),
  getAltTextOptions: (templateMetadata) =>
    buildLocatorDisplayOptions(templateMetadata?.locatorDisplayFields),
};

const getDisplayFieldOptions = (
  fieldTypeId: string | string[]
): EmbeddedStringOption[] => {
  // TODO: This breaks the rule of hooks, refactor the custom render path
  const templateMetadata = useTemplateMetadata();
  if (!templateMetadata?.locatorDisplayFields) {
    return [];
  }
  const displayFields = templateMetadata.locatorDisplayFields;
  const fieldTypeIds = Array.isArray(fieldTypeId) ? fieldTypeId : [fieldTypeId];
  return Object.keys(templateMetadata.locatorDisplayFields)
    .filter((key) => fieldTypeIds.includes(displayFields[key].field_type_id))
    .map((key) => {
      const fieldData: FieldTypeData = displayFields[key];
      return {
        label: fieldData.field_name,
        value: key,
      };
    });
};

const DisplayFieldSelector = (
  fieldTypeId: string | string[]
): BasicSelectorField => ({
  type: "basicSelector",
  label: msg("fields.field", "Field"),
  options: () => getDisplayFieldOptions(fieldTypeId),
  translateOptions: false,
});

export const LocatorResultCardFields: YextObjectField<LocatorResultCardProps> =
  {
    label: msg("fields.resultCard", "Result Card"),
    type: "object",
    objectFields: {
      entityType: {
        label: msg("fields.entityType", "Entity Type"),
        type: "text",
        visible: false,
      },
      primaryHeading: {
        label: msg("fields.primaryHeading", "Primary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.primaryHeading", "Primary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          headingLevel: {
            type: "basicSelector",
            label: msg("fields.headingLevel", "Heading Level"),
            options: "HEADING_LEVEL",
          },
          color: {
            type: "basicSelector",
            label: msg("fields.color", "Color"),
            options: "SITE_COLOR",
          },
        },
      },
      secondaryHeading: {
        label: msg("fields.secondaryHeading", "Secondary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.secondaryHeading", "Secondary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          variant: {
            label: msg("fields.variant", "Variant"),
            type: "radio",
            options: ThemeOptions.BODY_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      tertiaryHeading: {
        label: msg("fields.tertiaryHeading", "Tertiary Heading"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.string"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={pt(msg("fields.tertiaryHeading", "Tertiary Heading"))}
                showLocale={true}
              />
            ),
          },
          constantValue: {
            type: "translatableString",
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions(["type.string"]),
          },
          field: DisplayFieldSelector(["type.string", "type.boolean"]),
          trueDisplayText: {
            type: "translatableString",
            label: msg("fields.whenTrue", "When true"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          falseDisplayText: {
            type: "translatableString",
            label: msg("fields.whenFalse", "When false"),
            showApplyAllOption: false,
            showFieldSelector: false,
          },
          variant: {
            label: msg("fields.variant", "Variant"),
            type: "radio",
            options: ThemeOptions.BODY_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      icons: {
        label: msg("fields.icons", "Icons"),
        type: "radio",
        options: [
          { label: msg("fields.options.show", "Show"), value: true },
          { label: msg("fields.options.hide", "Hide"), value: false },
        ],
      },
      accentColor: {
        type: "basicSelector",
        label: msg("fields.accentColor", "Accent Color"),
        options: "SITE_COLOR",
      },
      hours: {
        label: msg("fields.hours", "Hours"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.hours"),
          table: {
            type: "object",
            label: msg("fields.hoursColumn", "Hours Column"),
            objectFields: HoursTableStyleFields,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      address: {
        label: msg("fields.address", "Address"),
        type: "object",
        objectFields: {
          showRegion: {
            label: msg("fields.showRegion", "Show Region"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          showCountry: {
            label: msg("fields.showCountry", "Show Country"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          showGetDirectionsLink: {
            label: msg(
              "fields.showGetDirectionsLink",
              "Show Get Directions Link"
            ),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      phone: {
        label: msg("fields.phone", "Phone"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.phone"),
          phoneFormat: {
            label: msg("fields.phoneFormat", "Phone Format"),
            type: "radio",
            options: [
              {
                label: msg("fields.options.domestic", "Domestic"),
                value: "domestic",
              },
              {
                label: msg("fields.options.international", "International"),
                value: "international",
              },
            ],
          },
          includePhoneHyperlink: {
            label: msg(
              "fields.includePhoneHyperlink",
              "Include Phone Hyperlink"
            ),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      email: {
        label: msg("fields.email", "Email"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.string"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      services: {
        label: msg("fields.services", "Services"),
        type: "object",
        objectFields: {
          field: DisplayFieldSelector("type.string"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      primaryCTA: {
        label: msg("fields.primaryCTA", "Primary CTA"),
        type: "object",
        objectFields: {
          label: {
            type: "translatableString",
            label: msg("fields.label", "Label"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          variant: {
            label: msg("fields.ctaVariant", "CTA Variant"),
            type: "radio",
            options: ThemeOptions.CTA_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
          link: {
            type: "translatableString",
            label: msg("fields.link", "Link"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          normalizeLink: {
            label: msg("fields.normalizeLink", "Normalize Link"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
      },
      secondaryCTA: {
        label: msg("fields.secondaryCTA", "Secondary CTA"),
        type: "object",
        objectFields: {
          label: {
            type: "translatableString",
            label: msg("fields.label", "Label"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          link: {
            type: "translatableString",
            label: msg("fields.link", "Link"),
            showApplyAllOption: false,
            showFieldSelector: true,
            getOptions: () => getDisplayFieldOptions("type.string"),
          },
          normalizeLink: {
            label: msg("fields.normalizeLink", "Normalize Link"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          variant: {
            label: msg("fields.ctaVariant", "CTA Variant"),
            type: "radio",
            options: ThemeOptions.CTA_VARIANT,
          },
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
      image: {
        label: msg("fields.image", "Image"),
        type: "object",
        objectFields: {
          constantValueEnabled: {
            type: "custom",
            render: ({
              value,
              onChange,
            }: YextCustomFieldRenderProps<boolean | undefined>) => (
              <ConstantValueModeToggler
                fieldTypeFilter={["type.image"]}
                constantValueEnabled={value ?? false}
                toggleConstantValueEnabled={(constantValueEnabled) =>
                  onChange(constantValueEnabled)
                }
                label={msg("fields.image", "Image")}
                showLocale={true}
              />
            ),
          },
          constantValue: LOCATOR_IMAGE_CONSTANT_CONFIG,
          field: DisplayFieldSelector("type.image"),
          liveVisibility: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.show", "Show"), value: true },
              { label: msg("fields.options.hide", "Hide"), value: false },
            ],
          },
        },
      },
    },
  };

export interface Location {
  address: AddressType;
  hours?: HoursType;
  additionalHoursText?: string;
  id: string;
  mainPhone?: string;
  name: string;
  neighborhood?: string;
  slug?: string;
  timezone: string;
  yextDisplayCoordinate?: Coordinate;
  ref_listings?: ListingType[];
  [key: string]: any; // Allow any other fields
}

export const LocatorResultCard = React.memo(
  ({
    result,
    resultCardProps: props,
    distanceDisplay = "distanceFromUser",
    searchLocationName,
    isSelected,
  }: {
    result: CardProps<Location>["result"];
    resultCardProps: LocatorResultCardProps;
    distanceDisplay?: DistanceDisplayOption;
    searchLocationName?: string;
    isSelected?: boolean;
  }): React.JSX.Element => {
    const { t, i18n } = useTranslation();

    const location = result.rawData;
    const resolvedAccentBackgroundColor =
      props.accentColor ?? backgroundColors.background2.value;
    const resolvedAccentLinkColor =
      props.accentColor ?? backgroundColors.background6.value;
    const distance =
      distanceDisplay === "distanceFromUser"
        ? result.distance
        : distanceDisplay === "distanceFromSearch"
          ? result.distanceFromFilter
          : undefined;

    const unit = getPreferredDistanceUnit(i18n.language);
    const unitLabel = unit === "mile" ? "mi" : "km"; // Abbreviations do not need translation
    const displayDistance =
      typeof distance === "number"
        ? `${formatDistance(fromMeters(distance, unit), i18n.language)} ${unitLabel}`
        : undefined;
    const searchDistance =
      typeof result.distanceFromFilter === "number"
        ? `${formatDistance(
            fromMeters(result.distanceFromFilter, unit),
            i18n.language
          )} ${unitLabel}`
        : undefined;
    const userDistance =
      typeof result.distance === "number"
        ? `${formatDistance(fromMeters(result.distance, unit), i18n.language)} ${unitLabel}`
        : undefined;
    const displayDistanceContent =
      distanceDisplay === "bothDistances" ? (
        <>
          {searchDistance && (
            <Body variant="sm">
              {searchLocationName ? (
                <Trans
                  i18nKey="distanceLineFromSearchLocation"
                  values={{
                    distance: searchDistance,
                    searchLocation: searchLocationName,
                  }}
                  components={{
                    strong: <strong style={{ fontWeight: "bolder" }} />,
                  }}
                  defaults="<strong>{{distance}}</strong> from {{searchLocation}}"
                />
              ) : (
                <Trans
                  i18nKey="distanceLineFromSearch"
                  values={{ distance: searchDistance }}
                  components={{
                    strong: <strong style={{ fontWeight: "bolder" }} />,
                  }}
                  defaults="<strong>{{distance}}</strong> from search"
                />
              )}
            </Body>
          )}
          {userDistance && (
            <Body variant="sm">
              <Trans
                i18nKey="distanceLineFromYou"
                values={{ distance: userDistance }}
                components={{
                  strong: <strong style={{ fontWeight: "bolder" }} />,
                }}
                defaults="<strong>{{distance}}</strong> from you"
              />
            </Body>
          )}
        </>
      ) : (
        displayDistance
      );
    const showDistance =
      distanceDisplay === "bothDistances"
        ? searchDistance !== undefined || userDistance !== undefined
        : displayDistance !== undefined;

    const handleGetDirectionsClick = useCardAnalyticsCallback(
      result,
      "DRIVING_DIRECTIONS"
    );
    const handleSecondaryCTAClick = useCardAnalyticsCallback(
      result,
      "CTA_CLICK"
    );
    const handlePhoneNumberClick = useCardAnalyticsCallback(
      result,
      "TAP_TO_CALL"
    );

    const getDirectionsLink: string | undefined = (() => {
      const listings = location.ref_listings ?? [];
      const listingsLink = getDirections(
        undefined,
        listings,
        undefined,
        { provider: "google" },
        undefined
      );
      const coordinateLink = getDirections(
        undefined,
        undefined,
        undefined,
        { provider: "google" },
        location.yextDisplayCoordinate
      );

      return listingsLink || coordinateLink;
    })();

    return (
      <Background
        background={backgroundColors.background1.value}
        className="container flex flex-row border-b border-gray-300 p-4 md:p-6 lg:p-8 gap-4"
        style={isSelected ? { backgroundColor: "#F9F9F9" } : undefined}
      >
        <div className="flex flex-wrap gap-4 w-full">
          <div className="w-full flex flex-col gap-4">
            {/** Heading section */}
            <div className="flex flex-row justify-between items-start gap-6">
              <div className="flex flex-row items-start gap-6 flex-1 min-w-0">
                <ImageSection image={props.image} location={location} />
                <div className="flex flex-row items-center gap-4 min-w-0">
                  <Background
                    background={
                      props?.primaryHeading?.color ??
                      backgroundColors.background6.value
                    }
                    className="flex-shrink-0 w-6 h-6 rounded-full font-bold hidden md:flex items-center justify-center text-body-sm-fontSize"
                  >
                    {result.index}
                  </Background>
                  <HeadingTextSection
                    primaryHeading={props.primaryHeading}
                    secondaryHeading={props.secondaryHeading}
                    tertiaryHeading={props.tertiaryHeading}
                    location={location}
                  />
                </div>
              </div>
              {showDistance && (
                <div
                  className={
                    "font-body-fontFamily font-body-sm-fontWeight text-body-sm-fontSize rounded-full hidden lg:flex flex-col items-end text-right min-w-fit"
                  }
                >
                  {displayDistanceContent}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 md:pl-10">
              <HoursSection
                location={location}
                result={result}
                hoursProps={props.hours}
                showIcons={props.icons}
                accentColor={resolvedAccentBackgroundColor}
              />

              {/** Core Info section */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/** Contact Section */}
                <div className="flex flex-col gap-4 lg:w-[280px]">
                  {location.address && props.address.liveVisibility && (
                    <div className="flex flex-row items-start gap-2">
                      {props.icons && (
                        <CardIcon
                          backgroundColor={resolvedAccentBackgroundColor}
                        >
                          <FaMapMarkerAlt className="w-4 h-4" />
                        </CardIcon>
                      )}
                      <div className="flex flex-col gap-1 w-full">
                        <div className="font-body-fontFamily font-body-fontWeight text-body-fontSize gap-4">
                          <Address
                            address={location.address}
                            showRegion={props.address.showRegion}
                            showCountry={props.address.showCountry}
                          />
                        </div>
                        {getDirectionsLink &&
                          props.address.showGetDirectionsLink && (
                            <a
                              href={getDirectionsLink}
                              onClick={handleGetDirectionsClick}
                              aria-label={t("getDirectionsForLocation", {
                                address: location.address.line1,
                                defaultValue: "Get Directions for {{address}}",
                              })}
                              className={themeManagerCn(
                                "components h-fit items-center w-fit underline gap-2 decoration-0 hover:no-underline font-link-fontFamily text-link-fontSize tracking-link-letterSpacing flex font-bold",
                                getTextColorClass(resolvedAccentLinkColor)
                              )}
                              style={getTextColorStyle(resolvedAccentLinkColor)}
                            >
                              {t("getDirections", "Get Directions")}
                              <FaAngleRight size={"12px"} />
                            </a>
                          )}
                      </div>
                    </div>
                  )}
                  <PhoneSection
                    phone={props.phone}
                    handlePhoneNumberClick={handlePhoneNumberClick}
                    location={location}
                    icons={props.icons}
                    backgroundColor={resolvedAccentBackgroundColor}
                    linkColor={resolvedAccentLinkColor}
                  />
                  <EmailSection
                    email={props.email}
                    location={location}
                    icons={props.icons}
                    index={result.index}
                    iconBackgroundColor={resolvedAccentBackgroundColor}
                    linkColor={resolvedAccentLinkColor}
                  />
                </div>
                {/** Secondary Info Section */}
                <div className="flex flex-col gap-4 lg:w-[240px]">
                  <ServicesSection
                    services={props.services}
                    location={location}
                  />
                </div>
              </div>
            </div>
          </div>
          {showDistance && (
            <div
              className={`
              font-body-fontFamily font-body-sm-fontWeight text-body-sm-fontSize flex flex-col items-start text-left lg:hidden md:ml-10 py-1 w-fit max-w-full break-words
              ${distanceDisplay === "bothDistances" ? "rounded-md px-3" : "rounded-full px-2"}
              ${getBackgroundColorClasses(backgroundColors.background2.value)}`}
            >
              {displayDistanceContent}
            </div>
          )}
          {/** CTA section */}
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full md:pl-10 items-center md:items-stretch lg:items-center">
            <PrimaryCTA
              primaryCTA={props.primaryCTA}
              primaryHeading={props.primaryHeading}
              result={result}
            />
            {props.secondaryCTA.liveVisibility && (
              <CTA
                link={resolveComponentData(
                  props.secondaryCTA.link,
                  i18n.language,
                  location
                )}
                label={
                  resolveComponentData(
                    props.secondaryCTA.label,
                    i18n.language,
                    location
                  ) || t("callToAction", "Call to Action")
                }
                variant={props.secondaryCTA.variant}
                normalizeLink={props.secondaryCTA.normalizeLink}
                onClick={handleSecondaryCTAClick}
                className="basis-full sm:w-auto justify-center"
              />
            )}
          </div>
        </div>
      </Background>
    );
  }
);

const PrimaryCTA = (props: {
  primaryCTA: LocatorResultCardProps["primaryCTA"];
  primaryHeading: LocatorResultCardProps["primaryHeading"];
  result: CardProps<Location>["result"];
}) => {
  const { primaryCTA, primaryHeading, result } = props;
  const location = result.rawData;
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();
  const { t, i18n } = useTranslation();

  const primaryHeadingText = resolveText({
    config: primaryHeading,
    location,
    language: i18n.language,
    fieldId: primaryHeading.field,
    fallback: location.name,
  });

  // Always uses the entity page link if one exists. If not, tries to resolve URL from the static
  // template in the Link prop, and if that also fails, doesn't render at all.
  let resolvedUrl = resolveLocatorResultUrl(
    location,
    streamDocument,
    relativePrefixToRoot
  );
  if (resolvedUrl === undefined && primaryCTA?.link) {
    resolvedUrl = resolveComponentData(
      primaryCTA.link,
      i18n.language,
      location
    );
  }

  const showPrimaryCta = primaryCTA.liveVisibility && resolvedUrl;

  const handlePrimaryCtaClick = useCardAnalyticsCallback(
    result,
    "VIEW_WEBSITE"
  );

  return (
    showPrimaryCta && (
      <CTA
        link={resolvedUrl}
        label={
          resolveComponentData(
            props.primaryCTA.label,
            i18n.language,
            location
          ) || t("visitPage", "Visit Page")
        }
        ariaLabel={t("visitPageForName", {
          name: primaryHeadingText,
          defaultValue: "Visit Page for {{name}}",
        })}
        variant={primaryCTA.variant}
        normalizeLink={primaryCTA.normalizeLink}
        onClick={handlePrimaryCtaClick}
        className="basis-full sm:w-auto justify-center"
      />
    )
  );
};

const CardIcon: React.FC<{
  children: React.ReactNode;
  backgroundColor?: ThemeColor;
}> = ({ children, backgroundColor }) => {
  return (
    <div
      className={`h-10 w-10 flex justify-center rounded-full items-center ${getBackgroundColorClasses(
        backgroundColor ?? backgroundColors.background2.value
      )}`}
      style={getBackgroundColorStyle(
        backgroundColor ?? backgroundColors.background2.value
      )}
    >
      {children}
    </div>
  );
};

const ImageSection = (props: {
  image: LocatorResultCardProps["image"];
  location: Location;
}) => {
  const { image, location } = props;
  const { i18n } = useTranslation();

  if (image.constantValueEnabled) {
    const resolvedImage = image.constantValue
      ? resolveComponentData(image.constantValue, i18n.language, location)
      : undefined;
    const imageUrl = getImageUrl(resolvedImage, i18n.language);
    const showImageSection =
      !!imageUrl && image.liveVisibility && !!resolvedImage;
    return (
      showImageSection && (
        <Image
          image={resolvedImage}
          streamDocumentOverride={location}
          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-image-borderRadius min-w-fit"
        />
      )
    );
  }

  const imageRecord = parseRecordFromLocation(location, image.field);
  const imageData = {
    url: imageRecord?.url,
    alternateText: imageRecord?.alternateText || location.name,
    // these will probably get overridden by CSS but providing defaults for safety
    height: imageRecord?.height ?? 80,
    width: imageRecord?.width ?? 80,
  };
  const showImageSection = imageRecord && image.liveVisibility;

  return (
    showImageSection && (
      <Image
        image={imageData}
        streamDocumentOverride={location}
        className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-image-borderRadius min-w-fit"
      />
    )
  );
};

const HeadingTextSection = (props: {
  primaryHeading: LocatorResultCardProps["primaryHeading"];
  secondaryHeading: LocatorResultCardProps["secondaryHeading"];
  tertiaryHeading: LocatorResultCardProps["tertiaryHeading"];
  location: Location;
}) => {
  const { primaryHeading, secondaryHeading, tertiaryHeading, location } = props;
  const { i18n } = useTranslation();

  const primaryHeadingText = resolveText({
    config: primaryHeading,
    location,
    language: i18n.language,
    fieldId: primaryHeading.field,
    fallback: location.name,
  });

  const secondaryHeadingText = resolveText({
    config: secondaryHeading,
    location,
    language: i18n.language,
    fieldId: secondaryHeading.field,
  });

  const tertiaryHeadingText = resolveText({
    config: tertiaryHeading,
    location,
    language: i18n.language,
    fieldId: tertiaryHeading.field,
  });

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <Heading
        color={primaryHeading?.color}
        className={`font-bold ${primaryHeading?.color ? "" : "text-palette-primary-dark"}`}
        level={primaryHeading.headingLevel}
      >
        {primaryHeadingText}
      </Heading>
      {secondaryHeadingText && secondaryHeading.liveVisibility && (
        <Body variant={secondaryHeading.variant} className="font-bold">
          {secondaryHeadingText}
        </Body>
      )}
      {tertiaryHeadingText && tertiaryHeading.liveVisibility && (
        <Body variant={tertiaryHeading.variant}>{tertiaryHeadingText}</Body>
      )}
    </div>
  );
};

const HoursSection = (props: {
  location: Location;
  result: CardProps<Location>["result"];
  hoursProps: LocatorResultCardProps["hours"];
  showIcons: boolean;
  accentColor?: ThemeColor;
}) => {
  const { location, result, hoursProps, showIcons, accentColor } = props;
  const [isExpanded, setIsExpanded] = React.useState(false);
  const triggerId = React.useId();
  const contentId = React.useId();

  const hoursData = parseHoursFromLocation(location, hoursProps.field);
  const comingSoon = location["comingSoon"];
  const showHoursSection =
    (hoursData || comingSoon) && hoursProps.liveVisibility;
  const hoursStatusRow = (
    <div className="flex flex-row items-center gap-2">
      {showIcons && (
        <CardIcon backgroundColor={accentColor}>
          <FaRegClock className="w-4 h-4" />
        </CardIcon>
      )}
      <HoursStatusAtom
        hours={hoursData ?? {}}
        comingSoon={comingSoon}
        timezone={location.timezone}
        className="text-body-fontSize mb-0"
        showDayNames={false}
        boldCurrentStatus={true}
      />
    </div>
  );

  return (
    showHoursSection && (
      <div className="font-body-fontFamily text-body-fontSize gap-8">
        {comingSoon ? (
          hoursStatusRow
        ) : (
          <Accordion>
            <AccordionItem
              key={`result-${result.index}-hours`}
              className="py-0"
              onToggle={(event) => setIsExpanded(event.currentTarget.open)}
            >
              <AccordionTrigger
                id={triggerId}
                aria-controls={contentId}
                aria-expanded={isExpanded}
                className="justify-start"
                role="button"
              >
                {hoursStatusRow}
              </AccordionTrigger>
              <AccordionContent
                id={contentId}
                aria-labelledby={triggerId}
                role="region"
              >
                <div className="flex flex-col gap-2">
                  <HoursTableAtom
                    hours={hoursData ?? {}}
                    comingSoon={comingSoon}
                    startOfWeek={hoursProps.table.startOfWeek}
                    collapseDays={hoursProps.table.collapseDays}
                    className="[&_.HoursTable-row]:w-fit"
                  />
                  {location.additionalHoursText &&
                    hoursProps.table.showAdditionalHoursText && (
                      <div className="text-body-sm-fontSize">
                        {location.additionalHoursText}
                      </div>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    )
  );
};

const PhoneSection = (props: {
  phone: LocatorResultCardProps["phone"];
  handlePhoneNumberClick: () => void;
  location: Location;
  icons: boolean;
  index?: number;
  backgroundColor: ThemeColor;
  linkColor: ThemeColor;
}) => {
  const {
    phone,
    handlePhoneNumberClick,
    location,
    icons,
    index,
    backgroundColor,
    linkColor,
  } = props;
  const { t } = useTranslation();

  const phoneNumber = parseStringFromLocation(location, phone.field);
  const showPhoneNumber = phone.field && phone.liveVisibility && phoneNumber;
  return (
    showPhoneNumber && (
      <PhoneAtom
        backgroundColor={backgroundColor}
        eventName={`phone${index}`}
        label={t("phone", "Phone")}
        format={phone.phoneFormat}
        phoneNumber={phoneNumber}
        includeHyperlink={phone.includePhoneHyperlink}
        includeIcon={icons}
        linkColor={linkColor}
        onClick={handlePhoneNumberClick}
      />
    )
  );
};

const EmailSection = (props: {
  email: LocatorResultCardProps["email"];
  location: Location;
  icons: boolean;
  index?: number;
  iconBackgroundColor: ThemeColor;
  linkColor: ThemeColor;
}) => {
  const { email, location, index, icons, iconBackgroundColor, linkColor } =
    props;

  const emailAddresses = parseArrayFromLocation(location, email.field);
  const showEmailSection =
    email.liveVisibility &&
    emailAddresses &&
    emailAddresses.length > 0 &&
    typeof emailAddresses[0] === "string";
  return (
    showEmailSection && (
      <div className="flex flex-row items-center gap-2">
        {icons && (
          <CardIcon backgroundColor={iconBackgroundColor}>
            <FaRegEnvelope className="w-4 h-4" />
          </CardIcon>
        )}
        <CTA
          eventName={`email${index}`}
          link={emailAddresses[0]}
          label={emailAddresses[0]}
          linkType="EMAIL"
          normalizeLink={false}
          variant="link"
          color={linkColor}
        />
      </div>
    )
  );
};

const ServicesSection = (props: {
  services: LocatorResultCardProps["services"];
  location: Location;
}) => {
  const { services, location } = props;
  const { t } = useTranslation();

  const servicesList = parseArrayFromLocation(location, services.field);
  const showServicesSection =
    services.liveVisibility &&
    servicesList &&
    servicesList.length > 0 &&
    servicesList.every((service) => typeof service === "string");
  return (
    showServicesSection && (
      <div className="flex flex-col gap-2">
        <Body variant="base" className="font-bold">
          {t("services", "Services")}
        </Body>
        <Body variant="base">{servicesList.join(", ")}</Body>
      </div>
    )
  );
};

/**
 * Resolves the text for a text element based on the constant value, field value, and fallback.
 */
const resolveText = (params: {
  config: {
    constantValue?: TranslatableString;
    constantValueEnabled?: boolean;
    trueDisplayText?: TranslatableString;
    falseDisplayText?: TranslatableString;
  };
  location: Location;
  language: string;
  fieldId: string | undefined;
  fallback?: string;
}): string | undefined => {
  const { config, location, language, fieldId, fallback } = params;

  const resolvedConstantValue =
    config.constantValueEnabled && config.constantValue
      ? resolveComponentData(config.constantValue, language, location)
      : undefined;
  if (typeof resolvedConstantValue === "string") {
    return resolvedConstantValue || fallback;
  }

  let resolvedText: string | undefined;
  const projectedValue = resolveProjectedField(location, fieldId);
  if (typeof projectedValue === "boolean") {
    const resolvedTrueDisplayText = config.trueDisplayText
      ? resolveComponentData(config.trueDisplayText, language, location)
      : undefined;
    const resolvedFalseDisplayText = config.falseDisplayText
      ? resolveComponentData(config.falseDisplayText, language, location)
      : undefined;
    resolvedText = projectedValue
      ? resolvedTrueDisplayText
      : resolvedFalseDisplayText;
  } else {
    resolvedText = parseStringFromLocation(location, fieldId);
  }

  return resolvedText ?? fallback;
};

/** Parses a string from the given location using the provided field ID. */
const parseStringFromLocation = (
  location: Location,
  fieldId: string | undefined
): string | undefined => {
  const value = resolveProjectedField(location, fieldId);
  if (value === undefined || value === null) {
    return undefined;
  }
  return String(value);
};

/** Parses an array from the given location using the provided field ID. */
const parseArrayFromLocation = (
  location: Location,
  fieldId: string | undefined
): Array<any> | undefined => {
  const fieldValue = resolveProjectedField(location, fieldId);
  if (Array.isArray(fieldValue)) {
    return fieldValue;
  }
  return undefined;
};

/** Parses a record with string keys from the given location using the provided field ID. */
const parseRecordFromLocation = (
  location: Location,
  fieldId: string | undefined
): Record<string, any> | undefined => {
  return resolveProjectedField(location, fieldId);
};

/** Parses an hours object from the given location using the provided hours field ID. */
const parseHoursFromLocation = (
  location: Location,
  hoursFieldId: string | undefined
): HoursType | undefined => {
  return resolveProjectedField(location, hoursFieldId) as HoursType;
};

/**
 * Dereferences a projected field ID that uses "." as its separator. Returns the value of the
 * root field.
 */
const resolveProjectedField = (
  object: Record<string, any>,
  projectFieldId: string | undefined
): any => {
  if (!projectFieldId) {
    return undefined;
  }
  // We can get away with this simple implementation for now since we know exactly what fields
  // can be in the locator response
  let current = object;
  for (const fieldId of projectFieldId.split(".")) {
    if (!current?.hasOwnProperty(fieldId)) {
      return undefined;
    }
    current = current[fieldId];
  }

  return current;
};
