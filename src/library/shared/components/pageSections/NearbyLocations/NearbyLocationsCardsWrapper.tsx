// @ts-nocheck
import * as React from "react";
import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import {
  backgroundColors,
  ThemeColor,
  HeadingLevel,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { Body } from "../../atoms/body";
import {
  msg,
  pt,
  usePlatformTranslation,
} from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  formatDistance,
  getPreferredDistanceUnit,
  toKilometers,
} from "@yext/visual-editor/section-library-support";
import {
  useNearbyLocations,
  type NearbyLocationDoc,
} from "./useNearbyLocations";
import { NearbyLocationCard } from "./NearbyLocationCard";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { MapPinOff } from "lucide-react";
import { updateFields } from "../HeroSection";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
import {
  EMPTY_STATE_MARKER_ATTRIBUTE,
  EmptyStateMarker,
} from "../emptyStateMarker";

export type NearbyLocationCardsWrapperProps = {
  /** The search parameters for finding nearby locations. */
  data: {
    /**
     * The search radius in miles.
     * @defaultValue 10
     */
    radius: number;

    /**
     * The maximum number of locations to find and display.
     * @defaultValue 3
     */
    limit: number;
  };

  /** Styling for the individual location cards. */
  styles: {
    /** The card background color. */
    backgroundColor?: ThemeColor;

    /** The heading level for the card title. */
    headingLevel?: HeadingLevel;
    /**
     * The color applied to the card title
     * @defaultValue inherited from theme
     */
    color?: ThemeColor;
    /** Styling for the hours display on each card. */
    hours: {
      /** Whether to display the current status ("Open Now" or "Closed") */
      showCurrentStatus: boolean;
      timeFormat?: "12h" | "24h";
      /** How to format the days of the week (short:Mon, long:Monday) */
      dayOfWeekFormat?: "short" | "long";
      /** Whether to include the day of the week */
      showDayNames?: boolean;
    };

    /** Styling for the phone display on each card. */
    phone: {
      /**
       * The display format for phone numbers on the cards.
       * @defaultValue 'domestic'
       */
      phoneNumberFormat: "domestic" | "international";

      /**
       * If `true`, wraps phone numbers in a clickable `tel:` hyperlink.
       * @defaultValue false
       */
      phoneNumberLink: boolean;

      /**
       * The color applied to phone links (and icon if enabled) on each card.
       */
      color?: ThemeColor;
    };

    /** Styling for the address on each card */
    address?: {
      /** Whether to include the region in the Address */
      showRegion: boolean;

      /** Whether to include the country in the Address */
      showCountry: boolean;
    };

    /**
     * Whether to show the location's hours on the card.
     * @defaultValue true
     */
    showHours: boolean;

    /**
     * Whether to show the location's phone on the card.
     * @defaultValue true
     */
    showPhone: boolean;

    /**
     * Whether to show the location's address on the card.
     * @defaultValue true
     */
    showAddress: boolean;
  };

  /** @internal */
  sectionHeadingLevel?: HeadingLevel;
};

const nearbyLocationCardsWrapperFields: YextFields<NearbyLocationCardsWrapperProps> =
  {
    data: {
      type: "object",
      label: msg("fields.data", "Data"),
      objectFields: {
        radius: {
          type: "number",
          label: msg("fields.radiusMiles", "Radius (Miles)"),
          min: 0,
        },
        limit: {
          type: "number",
          label: msg("fields.limit", "Limit"),
          min: 1,
          max: 50,
        },
      },
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
        headingLevel: {
          type: "basicSelector",
          label: msg("fields.headingLevel", "Heading Level"),
          options: "HEADING_LEVEL",
        },
        color: {
          type: "basicSelector",
          label: msg("fields.cardTitleColor", "Card Title Color"),
          options: "SITE_COLOR",
        },
        hours: {
          type: "object",
          label: msg("fields.hours", "Hours"),
          objectFields: {
            showCurrentStatus: {
              label: msg("fields.showCurrentStatus", "Show Current Status"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            timeFormat: {
              label: msg("fields.timeFormat", "Time Format"),
              type: "radio",
              options: [
                {
                  label: msg("fields.options.hour12", "12-hour"),
                  value: "12h",
                },
                {
                  label: msg("fields.options.hour24", "24-hour"),
                  value: "24h",
                },
              ],
            },
            showDayNames: {
              label: msg("fields.showDayNames", "Show Day Names"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            dayOfWeekFormat: {
              label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
              type: "radio",
              options: [
                {
                  label: msg("fields.options.short", "Short"),
                  value: "short",
                },
                {
                  label: msg("fields.options.long", "Long"),
                  value: "long",
                },
              ],
            },
          },
        },
        phone: {
          type: "object",
          label: msg("fields.phone", "Phone"),
          objectFields: {
            phoneNumberFormat: {
              label: msg("fields.phoneNumberFormat", "Phone Number Format"),
              type: "radio",
              options: ThemeOptions.PHONE_OPTIONS,
            },
            phoneNumberLink: {
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
            color: {
              type: "basicSelector",
              label: msg("fields.color", "Color"),
              options: "SITE_COLOR",
            },
          },
        },
        address: {
          type: "object",
          label: msg("fields.address", "Address"),
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
          },
        },
        showHours: {
          label: msg("fields.showHours", "Show Hours"),
          type: "radio",
          options: ThemeOptions.SHOW_HIDE,
        },
        showPhone: {
          label: msg("fields.showPhone", "Show Phone"),
          type: "radio",
          options: ThemeOptions.SHOW_HIDE,
        },
        showAddress: {
          label: msg("fields.showAddress", "Show Address"),
          type: "radio",
          options: ThemeOptions.SHOW_HIDE,
        },
      },
    },
  };

const NearbyLocationCardsWrapperComponent: PuckComponent<
  NearbyLocationCardsWrapperProps
> = (props) => {
  const { data, puck, styles, sectionHeadingLevel, id } = props;
  const streamDocument = useDocument();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const coordinate = resolveComponentData(
    {
      field: "yextDisplayCoordinate",
      constantValue: {
        latitude: 0,
        longitude: 0,
      },
      constantValueEnabled: false,
    },
    locale,
    streamDocument
  );

  const enableNearbyLocations =
    coordinate?.latitude !== undefined &&
    coordinate?.longitude !== undefined &&
    !!data?.radius &&
    !!data?.limit;

  const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
    useNearbyLocations({
      streamDocument,
      contentEndpointIdOverride: puck.metadata?.contentEndpointIdEnvVar,
      latitude: coordinate?.latitude,
      longitude: coordinate?.longitude,
      radiusMi: data?.radius,
      limit: data?.limit,
      enabled: enableNearbyLocations,
    });

  // Show loading state only when query is enabled and pending
  if (enableNearbyLocations && nearbyLocationsStatus === "pending") {
    return (
      <Body data-loading="true">
        {t("loadingNearbyLocations", "Loading nearby locations...")}
      </Body>
    );
  }

  // Render an empty state if no nearby locations are found
  // The parent component will hide the entire section if it is the live page
  if (!enableNearbyLocations || !nearbyLocationsData?.response?.docs?.length) {
    if (puck.isEditing) {
      return <NearbyLocationsEmptyState radius={data.radius} />;
    } else {
      return <EmptyStateMarker />;
    }
  }

  return (
    <>
      {nearbyLocationsStatus === "success" &&
        !!nearbyLocationsData?.response?.docs && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"
            id={id + "-wrapper"}
          >
            {nearbyLocationsData.response.docs.map(
              (location: NearbyLocationDoc, index: number) => (
                <NearbyLocationCard
                  key={index}
                  cardNumber={index}
                  styles={styles}
                  locationData={location}
                  puck={puck}
                  sectionHeadingLevel={sectionHeadingLevel}
                />
              )
            )}
          </div>
        )}
    </>
  );
};

export const defaultNearbyLocationsCardsProps: NearbyLocationCardsWrapperProps =
  {
    data: {
      radius: 10,
      limit: 3,
    },
    styles: {
      backgroundColor: backgroundColors.background1.value,
      headingLevel: 3,
      hours: {
        showCurrentStatus: true,
        timeFormat: "12h",
        showDayNames: true,
        dayOfWeekFormat: "long",
      },
      phone: {
        phoneNumberFormat: "domestic",
        phoneNumberLink: true,
      },
      address: {
        showRegion: true,
        showCountry: false,
      },
      showHours: true,
      showPhone: true,
      showAddress: true,
    },
  };

export const NearbyLocationCardsWrapper: YextComponentConfig<NearbyLocationCardsWrapperProps> =
  {
    label: msg("slots.nearbyLocationCards", "Nearby Location Cards"),
    fields: nearbyLocationCardsWrapperFields,
    defaultProps: defaultNearbyLocationsCardsProps,
    resolveFields: (data) => {
      let fields = nearbyLocationCardsWrapperFields;

      if (!data.props.styles.showHours) {
        fields = updateFields(fields, ["styles.hours.visible"], false);
      }

      if (!data.props.styles.showPhone) {
        fields = updateFields(fields, ["styles.phone.visible"], false);
      }

      if (!data.props.styles.showAddress) {
        fields = updateFields(fields, ["styles.address.visible"], false);
      }

      return toPuckFields(fields);
    },
    render: (props) => <NearbyLocationCardsWrapperComponent {...props} />,
  };

/** @internal */
const NearbyLocationsEmptyState: React.FC<{
  radius?: number;
}> = ({ radius }) => {
  const templateMetadata = useTemplateMetadata();
  const entityTypeDisplayName =
    templateMetadata?.entityTypeDisplayName?.toLowerCase();

  const { i18n } = usePlatformTranslation();

  const unit = getPreferredDistanceUnit(i18n.language);
  const distance =
    unit === "mile" ? (radius ?? 10) : toKilometers(radius ?? 10);
  const formattedDistance = Number(
    formatDistance(distance, i18n.language, 0, 0)
  );

  return (
    <div
      {...{ [EMPTY_STATE_MARKER_ATTRIBUTE]: "true" }}
      className="relative h-[300px] w-full bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center py-8 gap-2.5"
    >
      <MapPinOff className="w-12 h-12 text-gray-400" />
      <div className="flex flex-col items-center gap-0">
        <Body variant="base" className="text-gray-500 font-medium">
          {pt(
            "nearbyLocationsEmptyStateSectionHidden",
            "Section hidden for this {{entityType}}",
            {
              entityType: entityTypeDisplayName
                ? entityTypeDisplayName
                : "page",
            }
          )}
        </Body>
        <Body variant="base" className="text-gray-500 font-normal">
          {pt("nearbyLocationsEmptyState", {
            entityType: entityTypeDisplayName
              ? entityTypeDisplayName
              : "entity",
            radius: formattedDistance,
            unit: pt(unit, { count: formattedDistance }),
          })}
        </Body>
      </div>
    </div>
  );
};
