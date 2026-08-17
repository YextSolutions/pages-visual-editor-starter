import { FieldLabel, setDeep } from "@puckeditor/core";
import { type MultiSelectorValue } from "@yext/visual-editor/section-library-support";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { TranslatableAssetImage } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_ENTITY_TYPE,
  getEntityTypeLabel,
  getLocatorEntityTypeSourceMap,
  isLocatorEntityType,
  LocatorEntityType,
} from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  type YextCustomFieldRenderProps,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
import { ImageStylingFields } from "../contentBlocks/image/styling";
import { getFacetFieldOptions } from "./Filters";
import {
  DEFAULT_LOCATOR_RESULT_CARD_PROPS,
  DistanceDisplayOption,
  LocatorResultCardProps,
} from "./LocatorResultCard";
import { ResultCardPropsField } from "./Results";
import { LocatorWrapper } from "./LocatorWrapper";
import {
  DEFAULT_LOCATION_STYLE,
  DEFAULT_MAKI_ICON_NAME,
  DEFAULT_PIN_ICON_WIDTH,
  LOCATOR_PIN_ICON_FIELD,
  MAX_PIN_ICON_WIDTH,
  makiIconOptions,
} from "./Map";
const DEFAULT_TITLE = "Find a Location";
const DEFAULT_DISTANCE_DISPLAY = "distanceFromUser";

export interface LocatorProps {
  /**
   * The visual theme for the map tiles, chosen from a predefined list of Mapbox styles.
   * @defaultValue 'mapbox://styles/mapbox/streets-v12'
   */
  mapStyle?: string;

  /**
   * Props to customize the locator map pin styles.
   * Controls map pin appearance depending on the result's entity type.
   * The number of entries is locked to the locator entity types for the page set.
   */
  locationStyles: Array<{
    /** The entity type this style applies to. */
    entityType: LocatorEntityType;
    /** Whether to render an icon in the pin. */
    pinIcon?: {
      type: "none" | "icon" | "customImage";
      /** Defaults to the first available Maki icon when type is 'icon'. */
      iconName?: string;
      /** Image rendered within the pin when type is 'customImage'. */
      image?: TranslatableAssetImage;
      /**
       * Width of the custom image rendered within the pin.
       * @defaultValue 14
       * */
      width?: number;
      /** Aspect ratio of the custom image rendered within the pin. */
      aspectRatio?: number;
    };
    /** The color applied to the pin. */
    pinColor?: ThemeColor;
  }>;

  /**
   * Configuration for the filters available in the locator search experience.
   */
  filters: {
    /**
     * If 'true', displays a button to filter for locations that are currently open.
     * @defaultValue false
     */
    openNowButton: boolean;
    /**
     * If 'true', displays several distance options to filter searches to only locations within
     * a certain radius.
     * @defaultValue false
     */
    showDistanceOptions: boolean;
    /** Accent color for filter button and icons. */
    accentColor?: ThemeColor;
    /** Which fields are facetable in the search experience */
    facetFields?: MultiSelectorValue<string>;
  };

  /**
   * The starting location for the map.
   */
  mapStartingLocation?: {
    latitude: string;
    longitude: string;
  };
  /**
   * Configuration for the locator page heading.
   * Allows customizing the title text and its color.
   */
  pageHeading?: {
    /** The title displayed at the top of the locator page. */
    title: TranslatableString;
    /**
     * The color applied to the locator page title.
     * @defaultValue inherited from theme
     */
    color?: ThemeColor;
  };
  /**
   * Props to customize the locator result card component.
   * Controls which fields are displayed and their styling depending on the result's entity type.
   * The number of entries is locked to the locator entity types for the page set.
   */
  resultCard: Array<{
    /** Props to customize the locator result card component. */
    props: LocatorResultCardProps;
  }>;
  /** Controls which distance value to display on each locator result card. */
  distanceDisplay?: DistanceDisplayOption;
}

const locatorFields: YextFields<LocatorProps> = {
  mapStyle: {
    type: "basicSelector",
    label: msg("fields.mapStyle", "Map Style"),
    options: [
      {
        label: msg("fields.options.default", "Default"),
        value: "mapbox://styles/mapbox/streets-v12",
      },
      {
        label: msg("fields.options.satellite", "Satellite"),
        value: "mapbox://styles/mapbox/satellite-streets-v12",
      },
      {
        label: msg("fields.options.light", "Light"),
        value: "mapbox://styles/mapbox/light-v11",
      },
      {
        label: msg("fields.options.dark", "Dark"),
        value: "mapbox://styles/mapbox/dark-v11",
      },
      {
        label: msg("fields.options.navigationDay", "Navigation (Day)"),
        value: "mapbox://styles/mapbox/navigation-day-v1",
      },
      {
        label: msg("fields.options.navigationNight", "Navigation (Night)"),
        value: "mapbox://styles/mapbox/navigation-night-v1",
      },
    ],
  },
  locationStyles: {
    type: "array",
    label: msg("fields.pinStyles", "Location styles"),
    getItemSummary: (item: LocatorProps["locationStyles"][number]) =>
      getEntityTypeLabel(item.entityType),
    arrayFields: {
      entityType: {
        label: msg("fields.entityType", "Entity Type"),
        type: "text",
        visible: false,
      },
      pinIcon: {
        type: "custom",
        render: ({
          value,
          onChange,
        }: YextCustomFieldRenderProps<
          LocatorProps["locationStyles"][number]["pinIcon"]
        >) => {
          const selectedType = value?.type ?? "none";
          return (
            <div className="flex flex-col gap-3">
              <YextAutoField
                field={{
                  type: "basicSelector",
                  label: msg("fields.pinIcon", "Pin Icon"),
                  options: [
                    {
                      label: msg("fields.options.none", "None"),
                      value: "none",
                    },
                    {
                      label: msg("fields.options.icon", "Icon"),
                      value: "icon",
                    },
                    {
                      label: msg("fields.options.customImage", "Custom image"),
                      value: "customImage",
                    },
                  ],
                }}
                value={selectedType}
                onChange={(type) =>
                  onChange({
                    ...value,
                    type,
                    iconName:
                      type === "icon"
                        ? (value?.iconName ?? DEFAULT_MAKI_ICON_NAME)
                        : undefined,
                  })
                }
              />
              {selectedType === "icon" && (
                <YextAutoField
                  field={{
                    type: "basicSelector",
                    label: msg("fields.icon", "Icon"),
                    options: makiIconOptions,
                  }}
                  value={value?.iconName}
                  onChange={(iconName) =>
                    onChange({ ...value, type: "icon", iconName })
                  }
                />
              )}
              {selectedType === "customImage" && (
                <>
                  <YextAutoField
                    field={{
                      ...LOCATOR_PIN_ICON_FIELD,
                    }}
                    value={value?.image}
                    onChange={(image) =>
                      onChange({ ...value, type: "customImage", image })
                    }
                  />
                  <FieldLabel label={pt("fields.options.width", "Width")}>
                    <YextAutoField
                      field={{
                        type: "number",
                        min: 1,
                        max: MAX_PIN_ICON_WIDTH,
                      }}
                      value={value?.width ?? DEFAULT_PIN_ICON_WIDTH}
                      onChange={(width) =>
                        onChange({
                          ...value,
                          type: "customImage",
                          width,
                        })
                      }
                    />
                  </FieldLabel>
                  <YextAutoField
                    field={ImageStylingFields.aspectRatio}
                    value={value?.aspectRatio}
                    onChange={(aspectRatio) =>
                      onChange({
                        ...value,
                        type: "customImage",
                        aspectRatio,
                      })
                    }
                  />
                </>
              )}
            </div>
          );
        },
      },
      pinColor: {
        type: "basicSelector",
        label: msg("fields.pinColor", "Pin Color"),
        options: "BACKGROUND_COLOR",
      },
    },
    defaultItemProps: {
      entityType: DEFAULT_ENTITY_TYPE,
      pinIcon: { type: "none" },
      pinColor: backgroundColors.background6.value,
    },
  },
  filters: {
    label: msg("fields.filters", "Filters"),
    type: "object",
    objectFields: {
      openNowButton: {
        label: msg("fields.options.includeOpenNow", "Include Open Now Button"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      showDistanceOptions: {
        label: msg(
          "fields.options.showDistanceOptions",
          "Include Distance Options"
        ),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      accentColor: {
        type: "basicSelector",
        label: msg("fields.accentColor", "Accent Color"),
        options: "SITE_COLOR",
      },
      facetFields: {
        type: "multiSelector",
        label: msg("fields.dynamicFilters", "Dynamic Filters"),
        dropdownLabel: msg("fields.field", "Field"),
        options: () => {
          const entityTypeSourceMap = getLocatorEntityTypeSourceMap();
          const entityTypes =
            Object.keys(entityTypeSourceMap).filter(isLocatorEntityType);
          return getFacetFieldOptions(entityTypes);
        },
        placeholderOptionLabel: msg(
          "fields.options.selectAField",
          "Select a field"
        ),
      } as any, // TODO(SUMO-8378): remove 'as any' when puck fixes objectFields typing
    },
  },
  mapStartingLocation: {
    type: "object",
    label: msg("fields.options.mapStartingLocation", "Map Starting Location"),
    objectFields: {
      latitude: {
        label: msg("fields.latitude", "Latitude"),
        type: "text",
      },
      longitude: {
        label: msg("fields.longitude", "Longitude"),
        type: "text",
      },
    },
  },
  pageHeading: {
    type: "object",
    label: msg("fields.pageHeading", "Page Heading"),
    objectFields: {
      title: {
        type: "translatableString",
        label: msg("fields.title", "Title"),
        filter: { types: ["type.string"] },
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
    },
  },
  resultCard: {
    type: "array",
    label: msg("fields.resultCard", "Result Card"),
    getItemSummary: (item: LocatorProps["resultCard"][number]) =>
      getEntityTypeLabel(item.props.entityType),
    arrayFields: {
      props: {
        type: "custom",
        render: ({
          value,
          onChange,
        }: YextCustomFieldRenderProps<
          LocatorProps["resultCard"][number]["props"]
        >) => <ResultCardPropsField value={value} onChange={onChange} />,
      },
    },
    defaultItemProps: {
      props: DEFAULT_LOCATOR_RESULT_CARD_PROPS,
    },
  },
  distanceDisplay: {
    type: "basicSelector",
    label: msg("fields.distanceDisplay", "Distance Display"),
    options: [
      {
        label: msg("fields.options.distanceFromUser", "Distance from User"),
        value: "distanceFromUser",
      },
      {
        label: msg("fields.options.distanceFromSearch", "Distance from Search"),
        value: "distanceFromSearch",
      },
      {
        label: msg("fields.options.bothDistances", "Both Distances"),
        value: "bothDistances",
      },
      {
        label: msg("fields.options.hidden", "Hidden"),
        value: "hidden",
      },
    ],
  },
};

/**
 * Available on Locator templates.
 */
export const LocatorComponent: YextComponentConfig<LocatorProps> = {
  fields: locatorFields,
  /**
   * Locks array lengths for `locationStyles` and `resultCard` to the current
   * locator entity types so each entity type has exactly one entry.
   */
  resolveFields: (_data, params) => {
    const entityDocument = params.metadata?.streamDocument;
    const entityTypeSourceMap = entityDocument
      ? getLocatorEntityTypeSourceMap(entityDocument)
      : { [DEFAULT_ENTITY_TYPE]: undefined };
    const entityTypes = Object.keys(
      entityTypeSourceMap
    ) as (keyof typeof entityTypeSourceMap)[];
    const entityTypeCount = entityTypes.length;

    let updatedFields: YextFields<LocatorProps> = { ...locatorFields };
    updatedFields = setDeep(
      updatedFields,
      "locationStyles.min",
      entityTypeCount
    );
    updatedFields = setDeep(
      updatedFields,
      "locationStyles.max",
      entityTypeCount
    );
    updatedFields = setDeep(updatedFields, "resultCard.min", entityTypeCount);
    updatedFields = setDeep(updatedFields, "resultCard.max", entityTypeCount);

    return toPuckFields<LocatorProps>(updatedFields);
  },
  defaultProps: {
    locationStyles: [],
    resultCard: [],
    filters: {
      openNowButton: false,
      showDistanceOptions: false,
    },
    pageHeading: {
      title: { defaultValue: DEFAULT_TITLE },
    },
    distanceDisplay: DEFAULT_DISTANCE_DISPLAY,
  },
  label: msg("components.locator", "Locator"),
  /**
   * Reconciles `props.locationStyles` and `props.resultCard` so
   * each list has exactly one entry per current locator entity type.
   * Missing or mismatched entries are rebuilt from existing
   * values and backfilled with defaults.
   */
  resolveData: (data, params) => {
    const entityDocument = params.metadata?.streamDocument;
    const entityTypeSourceMap = entityDocument
      ? getLocatorEntityTypeSourceMap(entityDocument)
      : { [DEFAULT_ENTITY_TYPE]: undefined };
    const entityTypes = Object.keys(
      entityTypeSourceMap
    ) as (keyof typeof entityTypeSourceMap)[];

    const previousLocationStyles = data.props.locationStyles ?? [];
    const previousResultCard = data.props.resultCard ?? [];
    const hasSameEntityTypes = (currentEntityTypes: string[]) =>
      currentEntityTypes.length === entityTypes.length &&
      entityTypes.every((entityType) =>
        currentEntityTypes.includes(entityType)
      );

    const locationStylesByEntityType = new globalThis.Map(
      previousLocationStyles
        .filter((item) => !!item.entityType)
        .map((item) => [item.entityType, item] as const)
    );
    const resultCardsByEntityType = new globalThis.Map(
      previousResultCard
        .filter((item) => !!item?.props?.entityType)
        .map((item) => [item.props.entityType, item] as const)
    );

    const previousLocationStyleEntityTypes = previousLocationStyles.map(
      (item) => item.entityType
    );
    const previousResultCardEntityTypes = previousResultCard.map(
      (item) => item.props?.entityType
    );

    const shouldReconcileLocationStyles =
      previousLocationStyles.length === 0 ||
      !hasSameEntityTypes(previousLocationStyleEntityTypes);
    const shouldReconcileResultCards =
      previousResultCard.length === 0 ||
      !hasSameEntityTypes(previousResultCardEntityTypes);

    if (shouldReconcileLocationStyles) {
      const newLocationStyles = entityTypes.map((entityType) => ({
        ...DEFAULT_LOCATION_STYLE,
        ...locationStylesByEntityType.get(entityType),
        entityType,
      }));
      data = setDeep(data, "props.locationStyles", newLocationStyles);
    }

    if (shouldReconcileResultCards) {
      const newResultCards = entityTypes.map((entityType) => {
        const existing = resultCardsByEntityType.get(entityType);
        return {
          props: {
            ...(existing?.props ?? DEFAULT_LOCATOR_RESULT_CARD_PROPS),
            entityType,
          },
        };
      });
      data = setDeep(data, "props.resultCard", newResultCards);
    }

    return data;
  },
  render: (props) => <LocatorWrapper {...props} />,
};
