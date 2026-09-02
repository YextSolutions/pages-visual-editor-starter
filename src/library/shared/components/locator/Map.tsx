import {
  Coordinate,
  MapboxMap,
  MapMarkerOptions,
  OnDragHandler,
  PinComponentProps,
} from "@yext/search-ui-react";
import { Result } from "@yext/search-headless-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ImageField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { MapPinIcon } from "@yext/visual-editor/section-library-support";
import { isVisualEditorTestEnv } from "@yext/visual-editor/section-library-support";
import { Location } from "./LocatorResultCard";

export const DEFAULT_MAP_CENTER: Coordinate = {
  latitude: 40.741611,
  longitude: -74.005371,
}; // New York City
export const DEFAULT_RADIUS = 25;
export const DEFAULT_PIN_ICON_WIDTH = 14;
export const DEFAULT_LOCATION_STYLE = {
  pinIcon: { type: "none" },
  pinColor: backgroundColors.background6.value,
};
export const MAX_PIN_ICON_WIDTH = 27;
const PIN_ICON_MAX_FILE_SIZE_BYTES = 128 * 1024;

export type LocationStyleConfig = Record<
  string,
  {
    color?: ThemeColor;
    icon?: string;
    customImage?: {
      url: string;
      width?: number;
      aspectRatio?: number;
    };
  }
>;

export const LOCATOR_PIN_ICON_FIELD: ImageField = {
  type: "image",
  label: msg("fields.icon", "Icon"),
  hideAltTextField: true,
  maxFileSizeBytes: PIN_ICON_MAX_FILE_SIZE_BYTES,
};

export const getConfiguredMapCenterOrDefault = (mapStartingLocation?: {
  latitude: string;
  longitude: string;
}): Coordinate => {
  if (mapStartingLocation?.latitude && mapStartingLocation.longitude) {
    try {
      return parseMapStartingLocation(mapStartingLocation);
    } catch (e) {
      console.error(e);
    }
  }

  return DEFAULT_MAP_CENTER;
};

const makiIconModules = import.meta.glob(
  "../../../node_modules/@mapbox/maki/icons/*.svg",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

const makiIconEntries = Object.entries(makiIconModules).map(([path, icon]) => {
  const name = path.split("/").pop()?.replace(".svg", "") || path;
  return [name, icon] as const;
});

export const makiIconMap: Record<string, string> =
  Object.fromEntries(makiIconEntries);

const formatMakiIconLabel = (name: string) =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const makiIconOptions = makiIconEntries.map(([name, icon]) => ({
  label: formatMakiIconLabel(name),
  value: name,
  icon,
}));

export const DEFAULT_MAKI_ICON_NAME = makiIconOptions[0]?.value;

export const LoadingMapPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md">
        <Body className="text-gray-700" variant="lg">
          {t("loadingMap", "Loading Map...")}
        </Body>
      </div>
    </div>
  );
};

const LocatorTestMap = () => {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #dcfce7 0%, #dbeafe 55%, #fde68a 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundPosition: "0 0, 0 0",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
};

interface MapProps {
  mapStyle?: string;
  centerCoords?: Coordinate;
  onDragHandler?: OnDragHandler;
  scrollToResult?: (result: Result<Location> | undefined) => void;
  markerOptionsOverride?: (selected: boolean) => MapMarkerOptions;
  locationStyleConfig?: LocationStyleConfig;
}

export const LocatorMap: React.FC<MapProps> = ({
  mapStyle,
  centerCoords,
  onDragHandler,
  scrollToResult,
  markerOptionsOverride,
  locationStyleConfig,
}) => {
  const entityDocument: StreamDocument = useDocument();

  const documentIsUndefined = typeof document === "undefined";
  const iframe = documentIsUndefined
    ? undefined
    : (document.getElementById("preview-frame") as HTMLIFrameElement);

  const locatorMapDiv = documentIsUndefined
    ? null
    : ((iframe?.contentDocument || document)?.getElementById(
        "locatorMapDiv"
      ) as HTMLDivElement | null);

  const mapPadding = React.useMemo(
    () => getMapboxMapPadding(locatorMapDiv),
    [locatorMapDiv]
  );
  const mapboxOptions = React.useMemo(
    () => ({
      center: centerCoords,
      fitBoundsOptions: { padding: mapPadding },
      ...(mapStyle ? { style: mapStyle } : {}),
    }),
    [centerCoords, mapPadding, mapStyle]
  );
  const PinComponent = React.useMemo(
    () =>
      function PinComponent<T>(pinProps: PinComponentProps<T>) {
        return (
          <LocatorMapPin
            {...pinProps}
            locationStyleConfig={locationStyleConfig}
          />
        );
      },
    [locationStyleConfig]
  );

  if (isVisualEditorTestEnv()) {
    return <LocatorTestMap />;
  }

  // During page generation we don't exist in a browser context
  //@ts-expect-error MapboxGL is not loaded in iframe content window
  if (iframe?.contentDocument && !iframe.contentWindow?.mapboxgl) {
    // We are in an iframe, and mapboxgl is not loaded in yet
    return <LoadingMapPlaceholder />;
  }

  let mapboxApiKey = entityDocument._env?.YEXT_MAPBOX_API_KEY;
  if (
    iframe?.contentDocument &&
    entityDocument._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY
  ) {
    // If we are in the layout editor, use the non-URL-restricted Mapbox API key
    mapboxApiKey = entityDocument._env.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY;
  }

  return (
    <MapboxMap
      mapboxAccessToken={mapboxApiKey || ""}
      mapboxOptions={mapboxOptions}
      onDrag={onDragHandler}
      PinComponent={PinComponent}
      iframeWindow={iframe?.contentWindow ?? undefined}
      allowUpdates={!!iframe?.contentDocument}
      onPinClick={scrollToResult}
      markerOptionsOverride={markerOptionsOverride}
    />
  );
};

type LocatorMapPinProps<T> = PinComponentProps<T> & {
  locationStyleConfig?: LocationStyleConfig;
};

const LocatorMapPin = <T,>({
  result,
  selected,
  locationStyleConfig,
}: LocatorMapPinProps<T>) => {
  const entityType = result.entityType;
  const entityLocationStyle = entityType
    ? locationStyleConfig?.[entityType]
    : undefined;

  return (
    <MapPinIcon
      color={entityLocationStyle?.color}
      resultIndex={result.index}
      icon={entityLocationStyle?.customImage?.url ?? entityLocationStyle?.icon}
      iconWidth={
        entityLocationStyle?.customImage?.width ?? DEFAULT_PIN_ICON_WIDTH
      }
      disableContrastIcon={!!entityLocationStyle?.customImage}
      aspectRatio={entityLocationStyle?.customImage?.aspectRatio}
      selected={selected}
    />
  );
};

export const getMapboxMapPadding = (divElement: HTMLDivElement | null) => {
  if (!divElement) {
    return 50;
  }

  const { width, height } = divElement.getBoundingClientRect();
  const mapVerticalPadding = Math.max(50, height * 0.2);
  const mapHorizontalPadding = Math.max(50, width * 0.2);
  return {
    top: mapVerticalPadding,
    bottom: mapVerticalPadding,
    left: mapHorizontalPadding,
    right: mapHorizontalPadding,
  };
};

export const parseMapStartingLocation = (mapStartingLocation: {
  latitude: string;
  longitude: string;
}): Coordinate => {
  const lat = parseFloat(mapStartingLocation.latitude);
  const lng = parseFloat(mapStartingLocation.longitude);

  const err: string[] = [];
  if (isNaN(lat) || lat < -90 || lat > 90) {
    err.push("Latitude must be a number between -90 and 90.");
  }
  if (isNaN(lng) || lng < -180 || lng > 180) {
    err.push("Longitude must be a number between -180 and 180.");
  }
  if (err.length) {
    throw new Error(err.join("\n"));
  }

  return {
    latitude: lat,
    longitude: lng,
  };
};

/** Checks whether a given lat and lng are valid coordinates */
export function areValidCoordinates(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
