import { WithPuckProps } from "@puckeditor/core";
import {
  FilterSearchResponse,
  Matcher,
  NearFilterValue,
  provideHeadless,
  Result,
  SearchHeadlessProvider,
  SelectableStaticFilter,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
import { useAnalytics } from "@yext/pages-components";
import {
  AnalyticsProvider,
  AppliedFilters,
  CardProps,
  Coordinate,
  executeSearch,
  FilterSearch,
  getUserLocation,
  MapMarkerOptions,
  OnDragHandler,
  OnSelectParams,
  Pagination,
  SearchI18nextProvider,
  useAnalytics as useSearchAnalytics,
  VerticalResults,
} from "@yext/search-ui-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSlidersH } from "react-icons/fa";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { usePreviewWindow } from "@yext/visual-editor/section-library-support";
import { getViewport, useWindowWidth } from "@yext/visual-editor/section-library-support";
import { resolveLocalizedAssetImage } from "@yext/visual-editor/section-library-support";
import {
  getPreferredDistanceUnit,
  toMeters,
  toMiles,
} from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import {
  createSearchAnalyticsConfig,
  createSearchHeadlessConfig,
} from "@yext/visual-editor/section-library-support";
import { getThemeColorCssValue } from "@yext/visual-editor/section-library-support";
import { getValueFromQueryString } from "@yext/visual-editor/section-library-support";
import { Button } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { Heading } from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_ENTITY_TYPE,
  LocatorEntityType,
  getLocatorEntityTypeSourceMap,
  isLocatorEntityType,
} from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_LOCATOR_RESULT_CARD_PROPS,
  Location,
  LocatorResultCard,
} from "./LocatorResultCard";
import type { LocatorProps } from "./Locator";
import {
  COUNTRY_CODE_FIELD,
  FilterModal,
  LOCATION_FIELD,
  buildEqualsLocationFilter,
  buildNearLocationFilterFromCoords,
  buildNearLocationFilterFromPrevious,
  deselectOpenNowFilters,
  HOURS_FIELD,
  updateRadiusInNearFiltersOnLocationField,
} from "./Filters";
import {
  areValidCoordinates,
  DEFAULT_RADIUS,
  getConfiguredMapCenterOrDefault,
  LocatorMap,
  LoadingMapPlaceholder,
  LocationStyleConfig,
  makiIconMap,
} from "./Map";
import {
  MobileLocatorResultsSection,
  ResultsCountSummary,
  RESULTS_LIMIT,
  SearchState,
} from "./Results";

export const INITIAL_LOCATION_KEY = "initialLocation";

export const LocatorWrapper = (props: WithPuckProps<LocatorProps>) => {
  const streamDocument = useDocument();
  const { searchAnalyticsConfig, searcher } = React.useMemo(() => {
    const searchHeadlessConfig = createSearchHeadlessConfig(
      streamDocument,
      props.puck.metadata?.experienceKeyEnvVar
    );
    if (searchHeadlessConfig === undefined) {
      return { searchAnalyticsConfig: undefined, searcher: undefined };
    }

    const searchAnalyticsConfig = createSearchAnalyticsConfig(streamDocument);
    return {
      searchAnalyticsConfig,
      searcher: provideHeadless(searchHeadlessConfig),
    };
  }, [streamDocument.id, streamDocument.locale]);

  if (searcher === undefined || searchAnalyticsConfig === undefined) {
    console.warn(
      "Could not create Locator component because Search Headless or Search Analytics config is undefined. Please check your environment variables."
    );
    return <></>;
  }

  searcher.setSessionTrackingEnabled(true);
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <SearchI18nextProvider searcher={searcher}>
        <AnalyticsProvider {...searchAnalyticsConfig}>
          <LocatorInternal {...props} />
        </AnalyticsProvider>
      </SearchI18nextProvider>
    </SearchHeadlessProvider>
  );
};

const LocatorInternal = ({
  mapStyle,
  locationStyles,
  filters: { openNowButton, showDistanceOptions, accentColor, facetFields },
  mapStartingLocation,
  resultCard: resultCardConfigs,
  distanceDisplay,
  pageHeading,
}: LocatorProps) => {
  // Adds unified [enable|disable]YextAnalytics to the window for both Pages and Search
  // analytics. Typically used during consent banner implementation.
  const searchAnalytics = useSearchAnalytics();
  const pagesAnalytics = useAnalytics();
  useEffect(() => {
    (window as any).enableYextAnalytics = () => {
      searchAnalytics?.optIn();
      pagesAnalytics?.optIn();
    };
    (window as any).disableYextAnalytics = () => {
      searchAnalytics?.optOut();
      pagesAnalytics?.optOut();
    };

    return () => {
      delete (window as any).enableYextAnalytics;
      delete (window as any).disableYextAnalytics;
    };
  }, [searchAnalytics, pagesAnalytics]);

  const { t, i18n } = useTranslation();
  const previewWindow = usePreviewWindow();
  const windowWidth = useWindowWidth(previewWindow);
  const { isMobile } = getViewport(windowWidth);
  const preferredUnit = getPreferredDistanceUnit(i18n.language);
  const streamDocument = useDocument();
  const entityTypeSourceMap = getLocatorEntityTypeSourceMap(streamDocument);
  const entityTypes =
    Object.keys(entityTypeSourceMap).filter(isLocatorEntityType);
  const resultCount = useSearchState(
    (state) => state.vertical.resultsCount || 0
  );
  const searchResults = useSearchState(
    (state) => (state.vertical.results || []) as Result<Location>[]
  );
  const queryParamString =
    typeof window === "undefined" ? "" : window.location.search;
  const initialLocationParam = getValueFromQueryString(
    INITIAL_LOCATION_KEY,
    queryParamString
  );

  const iframe =
    typeof document === "undefined"
      ? undefined
      : (document.getElementById("preview-frame") as HTMLIFrameElement);

  let mapboxApiKey = streamDocument._env?.YEXT_MAPBOX_API_KEY;
  if (
    iframe?.contentDocument &&
    streamDocument._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY
  ) {
    // If we are in the layout editor, use the non-URL-restricted Mapbox API key
    mapboxApiKey = streamDocument._env.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY;
  }

  const [showSearchAreaButton, setShowSearchAreaButton] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState<Coordinate | undefined>();
  const [mapRadius, setMapRadius] = React.useState<number | undefined>();
  /** Explicit filter radius selected by the user, in meters */
  const [selectedDistanceMeters, setSelectedDistanceMeters] = React.useState<
    number | null
  >(null);
  const [selectedDistanceOption, setSelectedDistanceOption] = React.useState<
    number | null
  >(null);
  /** Radius of last location near filter returned by the filter search API */
  const apiFilterRadius = React.useRef<number | null>(null);

  const handleDrag: OnDragHandler = (center, bounds) => {
    setMapCenter({
      latitude: center.latitude,
      longitude: center.longitude,
    });
    setMapRadius(center.distanceTo(bounds.getNorthEast()));
    setShowSearchAreaButton(true);
  };

  const [isOpenNowSelected, setIsOpenNowSelected] = React.useState(false);
  const openNowFilter: SelectableStaticFilter = React.useMemo(
    () => ({
      filter: {
        kind: "fieldValue",
        fieldId: HOURS_FIELD,
        matcher: Matcher.OpenAt,
        value: "now",
      },
      selected: isOpenNowSelected,
      displayName: t("openNow", "Open Now"),
    }),
    [isOpenNowSelected]
  );

  const searchActions = useSearchActions();

  const handleSearchAreaClick = () => {
    if (mapCenter && mapRadius) {
      searchActions.setOffset(0);
      const locationFilter: SelectableStaticFilter = {
        selected: true,
        displayName: "",
        filter: {
          kind: "fieldValue",
          fieldId: LOCATION_FIELD,
          value: {
            lat: mapCenter.latitude,
            lng: mapCenter.longitude,
            radius: mapRadius,
            name: t("customSearchArea", "Custom Search Area"),
          },
          matcher: Matcher.Near,
        },
      };
      searchActions.setStaticFilters([locationFilter, openNowFilter]);
      searchActions.executeVerticalQuery();
      setSearchState("loading");
      setShowSearchAreaButton(false);
    }
  };

  const selectedFacets: string[] = React.useMemo(
    () =>
      facetFields?.selections
        ?.filter((selection) => selection.value !== undefined)
        ?.map((selection) => selection.value as string) ?? [],
    [facetFields]
  );
  React.useEffect(() => {
    searchActions.setFacetAllowList(selectedFacets);
  }, [searchActions, selectedFacets]);

  const filterDisplayName = useSearchState(
    (state) =>
      state.filters?.static?.find(
        (filter) =>
          filter.filter.kind === "fieldValue" &&
          (filter.filter.fieldId === LOCATION_FIELD ||
            filter.filter.fieldId === COUNTRY_CODE_FIELD)
      )?.displayName
  );

  const handleFilterSelect = (params: OnSelectParams) => {
    const newDisplayName = params.newDisplayName;
    const filter = params.newFilter;

    let locationFilter: SelectableStaticFilter;
    let nearFilterValue: NearFilterValue | undefined;
    switch (filter.matcher) {
      case Matcher.Near: {
        nearFilterValue = filter.value as NearFilterValue;
        apiFilterRadius.current = nearFilterValue.radius;
        // only overwrite radius from filter if display options are enabled
        const radius =
          showDistanceOptions && selectedDistanceMeters
            ? selectedDistanceMeters
            : nearFilterValue.radius;
        locationFilter = buildNearLocationFilterFromPrevious(
          nearFilterValue,
          newDisplayName,
          radius
        );
        break;
      }
      case Matcher.Equals: {
        apiFilterRadius.current = null;
        locationFilter = buildEqualsLocationFilter(filter, newDisplayName);
        break;
      }
      default: {
        throw new Error(`Unsupported matcher type: ${filter.matcher}`);
      }
    }

    searchActions.setOffset(0);
    searchActions.setStaticFilters([locationFilter, openNowFilter]);
    searchActions.executeVerticalQuery();
    setSearchState("loading");
    if (
      nearFilterValue?.lat &&
      nearFilterValue?.lng &&
      areValidCoordinates(nearFilterValue.lat, nearFilterValue.lng)
    ) {
      setMapCenter({
        latitude: nearFilterValue.lat,
        longitude: nearFilterValue.lng,
      });
      setMapRadius(nearFilterValue.radius);
    }
  };

  const searchLoading: boolean | undefined = useSearchState(
    (state) => state.searchStatus.isLoading
  );
  const [searchState, setSearchState] =
    React.useState<SearchState>("not started");

  React.useEffect(() => {
    if (!searchLoading && searchState === "loading") {
      setSearchState("complete");
    }
  }, [searchLoading, searchState]);

  React.useEffect(() => {
    if (selectedDistanceOption === null) {
      setSelectedDistanceMeters(null);
      return;
    }

    setSelectedDistanceMeters(toMeters(selectedDistanceOption, preferredUnit));
  }, [preferredUnit, selectedDistanceOption]);

  const resultsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const resultsContainer = React.useRef<HTMLDivElement>(null);
  const [mobileResults, setMobileResults] = React.useState<Result<Location>[]>(
    []
  );
  // Tracks the selected pin index to highlight the corresponding result card.
  const [selectedResultIndex, setSelectedResultIndex] = React.useState<
    number | null
  >(null);

  const setResultsRef = React.useCallback((index: number) => {
    if (!resultsRef?.current) return null;
    return (result: HTMLDivElement) => (resultsRef.current[index] = result);
  }, []);

  const scrollToResult = React.useCallback(
    (result: Result<Location> | undefined) => {
      if (result) {
        if (typeof result.index === "number") {
          setSelectedResultIndex(result.index);
        }
        let scrollPos = 0;
        // the search results that are listed above this result
        const previousResultsRef = resultsRef.current.filter(
          (r, index) => r && result.index && index < result.index
        );

        // sum up the height of all search results that are listed above this result
        if (previousResultsRef.length > 0) {
          scrollPos = previousResultsRef
            .map((elem) => elem?.scrollHeight ?? 0)
            .reduce((total, height) => total + height);
        }

        resultsContainer.current?.scroll({
          top: scrollPos,
          behavior: "smooth",
        });
      } else {
        setSelectedResultIndex(null);
      }
    },
    []
  );

  const markerOptionsOverride = React.useCallback(
    (selected: boolean): MapMarkerOptions => {
      return {
        offset: (selected ? [0, -21] : [0, -14]) as [number, number],
      };
    },
    []
  );

  const getResultCardProps = React.useCallback(
    (entityType?: LocatorEntityType) => {
      const existingConfig = (resultCardConfigs ?? []).find(
        (item) => item.props.entityType === entityType
      );
      if (existingConfig) {
        return existingConfig.props;
      }

      return DEFAULT_LOCATOR_RESULT_CARD_PROPS;
    },
    [resultCardConfigs]
  );

  const CardComponent = React.useCallback(
    (result: CardProps<Location>) => {
      let resultCardProps = DEFAULT_LOCATOR_RESULT_CARD_PROPS;
      const resultEntityType = result.result.entityType;
      if (resultEntityType && isLocatorEntityType(resultEntityType)) {
        resultCardProps = getResultCardProps(resultEntityType);
      } else {
        console.warn(
          "Unexpected entityType from search result: ",
          resultEntityType
        );
      }
      return (
        <LocatorResultCard
          {...result}
          resultCardProps={resultCardProps}
          isSelected={result.result.index === selectedResultIndex}
          distanceDisplay={distanceDisplay}
          searchLocationName={filterDisplayName}
        />
      );
    },
    [
      distanceDisplay,
      filterDisplayName,
      getResultCardProps,
      selectedResultIndex,
    ]
  );

  const [userLocationRetrieved, setUserLocationRetrieved] =
    React.useState<boolean>(false);

  const locationStylesConfig = React.useMemo(() => {
    const config: LocationStyleConfig = {};
    (locationStyles ?? []).forEach((locationStyle) => {
      const entityType = locationStyle.entityType;
      if (!entityType) return;
      const iconValue =
        locationStyle.pinIcon?.type === "icon"
          ? locationStyle.pinIcon.iconName
          : undefined;
      const customImageValue =
        locationStyle.pinIcon?.type === "customImage"
          ? resolveLocalizedAssetImage(
              locationStyle.pinIcon.image,
              i18n.language
            )
          : undefined;
      const customImageUrl = customImageValue?.url?.trim();
      config[entityType] = {
        color: locationStyle.pinColor,
        icon:
          typeof iconValue === "string" ? makiIconMap[iconValue] : undefined,
        customImage: customImageUrl
          ? {
              url: customImageUrl,
              width: locationStyle.pinIcon?.width,
              aspectRatio: locationStyle.pinIcon?.aspectRatio,
            }
          : undefined,
      };
    });
    return config;
  }, [i18n.language, locationStyles]);

  const initialMapCenter = React.useMemo(
    () => getConfiguredMapCenterOrDefault(mapStartingLocation),
    [mapStartingLocation]
  );
  const [centerCoords, setCenterCoords] =
    React.useState<Coordinate>(initialMapCenter);
  const [isInitialMapLocationResolved, setIsInitialMapLocationResolved] =
    React.useState(false);
  const canShowMoreMobileResults =
    isMobile && mobileResults.length < resultCount;

  const mapProps = React.useMemo(
    () => ({
      mapStyle,
      centerCoords,
      onDragHandler: handleDrag,
      scrollToResult,
      markerOptionsOverride,
      locationStyleConfig: locationStylesConfig,
    }),
    [
      centerCoords,
      handleDrag,
      mapStyle,
      markerOptionsOverride,
      scrollToResult,
      locationStylesConfig,
    ]
  );

  React.useEffect(() => {
    let isCancelled = false;

    const resolveLocationAndSearch = async () => {
      setIsInitialMapLocationResolved(false);
      setCenterCoords(initialMapCenter);
      setMapCenter(initialMapCenter);

      const radius =
        showDistanceOptions && selectedDistanceMeters
          ? selectedDistanceMeters
          : toMeters(DEFAULT_RADIUS, preferredUnit);
      // default location filter to configured starting location or NYC
      let initialLocationFilter = buildNearLocationFilterFromCoords(
        initialMapCenter.latitude,
        initialMapCenter.longitude,
        radius
      );
      const doSearch = () => {
        searchActions.setVerticalLimit(RESULTS_LIMIT);
        searchActions.setOffset(0);
        searchActions.setStaticFilters([initialLocationFilter]);
        searchActions.executeVerticalQuery();
        setSearchState("loading");
        if (
          initialLocationFilter.filter.kind === "fieldValue" &&
          initialLocationFilter.filter.matcher === Matcher.Near
        ) {
          const filterValue = initialLocationFilter.filter
            .value as NearFilterValue;
          const nextCenterCoords: Coordinate = {
            longitude: filterValue.lng,
            latitude: filterValue.lat,
          };
          if (
            !isCancelled &&
            areValidCoordinates(
              nextCenterCoords.latitude,
              nextCenterCoords.longitude
            )
          ) {
            setCenterCoords(nextCenterCoords);
            setMapCenter(nextCenterCoords);
            setMapRadius(filterValue.radius);
          }
        }
        if (!isCancelled) {
          setIsInitialMapLocationResolved(true);
        }
      };

      const foundStartingLocationFromQueryParam = async (
        queryParam: string
      ): Promise<boolean> => {
        return searchActions
          .executeFilterSearch(queryParam, false, [
            {
              fieldApiName: LOCATION_FIELD,
              entityType: entityTypes[0] ?? DEFAULT_ENTITY_TYPE,
              fetchEntities: false,
            },
          ])
          .then((response: FilterSearchResponse | undefined) => {
            const firstResult = response?.sections[0]?.results[0];
            const resultFilter = firstResult?.filter;
            if (!firstResult || !resultFilter) {
              return false;
            }

            switch (resultFilter.matcher) {
              case Matcher.Near: {
                const filterFromResult = resultFilter.value as NearFilterValue;
                initialLocationFilter = buildNearLocationFilterFromPrevious(
                  filterFromResult,
                  firstResult.value
                );
                apiFilterRadius.current = filterFromResult.radius;
                return true;
              }
              case Matcher.Equals: {
                initialLocationFilter = buildEqualsLocationFilter(
                  resultFilter,
                  firstResult.value
                );
                apiFilterRadius.current = null;
                return true;
              }
              default: {
                return false;
              }
            }
          })
          .catch((e) => {
            console.warn("Filter search for initial location failed:", e);
            return false;
          });
      };

      // 1. Check if a location could be determined from the initialLocation query parameter
      if (
        initialLocationParam &&
        (await foundStartingLocationFromQueryParam(initialLocationParam))
      ) {
        doSearch();
        return;
      }

      try {
        // 2. Try to get user location via Geolocation API
        const location = await getUserLocation();
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        setUserLocationRetrieved(true);

        // Try to reverse-geocode the coordinates to a human-readable place name using Mapbox
        let displayName: string | undefined;
        try {
          if (mapboxApiKey) {
            const lang =
              (streamDocument.locale as string) ||
              (typeof navigator !== "undefined"
                ? navigator.language
                : undefined) ||
              "en";
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxApiKey}&types=place,region,country&limit=1&language=${encodeURIComponent(
              lang
            )}`;

            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              const feature = data.features && data.features[0];
              displayName = feature?.place_name || undefined;
            }
          }
        } catch (e) {
          console.warn("Reverse geocoding failed:", e);
        } finally {
          initialLocationFilter = buildNearLocationFilterFromCoords(
            lat,
            lng,
            radius,
            displayName
          );
        }
      } catch {
        // Fall back to configured starting location or default center.
      }

      doSearch();
    };

    resolveLocationAndSearch().catch((e) => {
      if (!isCancelled) {
        setIsInitialMapLocationResolved(true);
      }
      console.error("Failed perform search:", e);
    });
    return () => {
      isCancelled = true;
    };
  }, [initialLocationParam, initialMapCenter, searchActions]);

  const handleOpenNowClick = (selected: boolean) => {
    if (selected === isOpenNowSelected) {
      // Prevents us from trying to set Open Now filter to false when it's not set
      return;
    }
    searchActions.setFilterOption({
      filter: {
        kind: "fieldValue",
        fieldId: HOURS_FIELD,
        matcher: Matcher.OpenAt,
        value: "now",
      },
      selected,
      displayName: t("openNow", "Open Now"),
    });
    setIsOpenNowSelected(selected);
    searchActions.setOffset(0);
    executeSearch(searchActions);
  };

  const searchFilters = useSearchState((state) => state.filters);
  const currentOffset = useSearchState((state) => state.vertical.offset);
  const previousOffset = React.useRef<number | undefined>(undefined);
  const prevIsMobile = React.useRef(isMobile);

  // Scroll to top when pagination changes
  React.useEffect(() => {
    if (
      !isMobile &&
      currentOffset !== previousOffset.current &&
      previousOffset.current !== undefined
    ) {
      resultsContainer.current?.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
    previousOffset.current = currentOffset;
  }, [currentOffset, isMobile]);

  React.useEffect(() => {
    const switchedToMobile = isMobile && !prevIsMobile.current;

    prevIsMobile.current = isMobile;

    if (
      !switchedToMobile ||
      searchLoading !== false ||
      (currentOffset ?? 0) === 0
    ) {
      return;
    }

    // Always reload from offset 0 if switching to mobile
    setMobileResults([]);
    searchActions.setOffset(0);
    executeSearch(searchActions);
    setSearchState("loading");
  }, [currentOffset, isMobile, searchActions, searchLoading]);

  React.useEffect(() => {
    if (!isMobile || searchLoading !== false) {
      return;
    }

    setMobileResults((previousResults) => {
      // Mobile keeps a single growing list: later offsets append, while
      // offset 0 replaces the list after a fresh search.
      return (currentOffset ?? 0) > 0 && searchResults.length > 0
        ? [...previousResults, ...searchResults]
        : searchResults;
    });
  }, [currentOffset, isMobile, searchLoading, searchResults]);

  const handleDistanceClick = (
    distance: number,
    distanceUnit: "mile" | "kilometer"
  ) => {
    const existingFilters = searchFilters.static || [];
    let updatedFilters: SelectableStaticFilter[];
    const distanceInMeters = toMeters(distance, distanceUnit);
    if (selectedDistanceOption === distance) {
      setSelectedDistanceMeters(null);
      setSelectedDistanceOption(null);
      // revert to API radius (or default if none was found) if user clicks the same distance again
      updatedFilters = updateRadiusInNearFiltersOnLocationField(
        existingFilters,
        apiFilterRadius.current ?? toMeters(DEFAULT_RADIUS, preferredUnit)
      );
    } else {
      setSelectedDistanceOption(distance);
      updatedFilters = updateRadiusInNearFiltersOnLocationField(
        existingFilters,
        distanceInMeters
      );
    }
    searchActions.setStaticFilters(updatedFilters);
    searchActions.setOffset(0);
    executeSearch(searchActions);
  };

  const handleClearFiltersClick = () => {
    const existingFilters = searchFilters.static || [];
    // revert to API radius (or default if none was found)
    const partiallyUpdatedFilters = updateRadiusInNearFiltersOnLocationField(
      existingFilters,
      apiFilterRadius.current ?? toMeters(DEFAULT_RADIUS, preferredUnit)
    );
    const updatedFilters = deselectOpenNowFilters(partiallyUpdatedFilters);

    // Both open now and distance filters must be updated in the same setStaticFilters call to
    // avoid problems due to the asynchronous nature of state updates.
    searchActions.setStaticFilters(updatedFilters);
    searchActions.resetFacets();
    // Execute search to update AppliedFilters components
    searchActions.setOffset(0);
    executeSearch(searchActions);
    setSelectedDistanceMeters(null);
    setSelectedDistanceOption(null);
  };

  // If something else causes the filters to update, check if the hours filter is still present
  // and toggle off the Open Now toggle if not.
  React.useEffect(() => {
    setIsOpenNowSelected(
      searchFilters.static
        ? !!searchFilters.static.find((staticFilter) => {
            return (
              staticFilter.filter.kind === "fieldValue" &&
              staticFilter.filter.fieldId === HOURS_FIELD &&
              staticFilter.selected === true
            );
          })
        : false
    );
  }, [searchFilters]);

  const hasFacetOptions =
    (
      useSearchState((state) =>
        state.filters.facets?.filter((f) => f.options.length)
      ) ?? []
    ).length > 0;
  const hasFilterModalToggle =
    openNowButton || showDistanceOptions || hasFacetOptions;
  const filterAccentColorCssVariable =
    getThemeColorCssValue(accentColor?.selectedColor) ??
    "var(--colors-palette-primary-dark)";
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const filterToggleButtonRef = React.useRef<HTMLButtonElement>(null);
  const filterModalCloseButtonRef = React.useRef<HTMLButtonElement>(null);
  const hasOpenedFilterModalRef = React.useRef(false);
  const resolvedHeading =
    (pageHeading?.title &&
      resolveComponentData(pageHeading.title, i18n.language, streamDocument)) ||
    t("findALocation", "Find a Location");

  const requireMapOptIn: boolean = streamDocument.__?.visualEditorConfig
    ? JSON.parse(streamDocument.__?.visualEditorConfig)?.requireMapOptIn
    : false;
  // If no opt-in is required, the map is already enabled.
  const [mapEnabled, setMapEnabled] = React.useState(!requireMapOptIn);
  // Adds unified [enable|disable]Map functions to the window.
  useEffect(() => {
    (window as any).enableMap = () => setMapEnabled(true);
    (window as any).disableMap = () => setMapEnabled(false);

    return () => {
      delete (window as any).enableMap;
      delete (window as any).disableMap;
    };
  }, []);

  useEffect(() => {
    if (showFilterModal) {
      hasOpenedFilterModalRef.current = true;
      filterModalCloseButtonRef.current?.focus();
      return;
    }

    if (hasOpenedFilterModalRef.current) {
      filterToggleButtonRef.current?.focus();
    }
  }, [showFilterModal]);

  return (
    <div className="components flex h-screen w-full mx-auto">
      {/* Left Section: FilterSearch + Results. Full width for small screens */}
      <div
        className="relative h-screen w-full md:w-2/5 lg:w-[40rem] flex flex-col md:min-w-[24rem]"
        id="locatorLeftDiv"
      >
        <div className="px-8 py-6 gap-4 flex flex-col">
          <Heading level={1} color={pageHeading?.color}>
            {resolvedHeading}
          </Heading>
          <FilterSearch
            searchFields={[
              {
                fieldApiName: LOCATION_FIELD,
                entityType: entityTypes[0] ?? DEFAULT_ENTITY_TYPE,
              },
            ]}
            onSelect={handleFilterSelect}
            placeholder={t("searchHere", "Search here...")}
            ariaLabel={t("findALocation", "Find a Location")}
            customCssClasses={{
              filterSearchContainer: "font-body-fontFamily",
              focusedOption: "bg-gray-200 hover:bg-gray-200 block",
              option: "hover:bg-gray-100 px-4 py-3",
              inputElement:
                "rounded-md p-4 h-11 font-body-fontFamily font-body-fontWeight text-body-fontSize placeholder:text-gray-700",
              currentLocationButton:
                "h-7 w-7 font-body-fontFamily font-body-fontWeight text-body-fontSize text-palette-primary-dark",
              label:
                "font-body-fontFamily font-body-fontWeight text-body-fontSize text-palette-primary-dark",
            }}
            showCurrentLocationButton={userLocationRetrieved}
            geolocationProps={{
              radius:
                preferredUnit === "mile"
                  ? DEFAULT_RADIUS
                  : toMiles(DEFAULT_RADIUS), // this component uses miles, not meters
            }}
          />
        </div>
        <div className="relative flex-1 flex flex-col min-h-0">
          <div className="px-8 py-4 text-body-fontSize border-y border-gray-300 inline-block">
            <div className="flex flex-row justify-between" id="levelWithModal">
              <ResultsCountSummary
                searchState={searchState}
                resultCount={resultCount}
                selectedDistanceOption={selectedDistanceOption}
                filterDisplayName={filterDisplayName}
              />
              {hasFilterModalToggle && (
                <button
                  ref={filterToggleButtonRef}
                  className="inline-flex justify-between items-center gap-2 bg-white font-bold font-body-fontFamily text-body-sm-fontSize"
                  style={{ color: filterAccentColorCssVariable }}
                  onClick={() => setShowFilterModal((prev) => !prev)}
                  aria-haspopup="dialog"
                  aria-expanded={showFilterModal}
                  aria-controls="locator-filter-modal"
                >
                  {t("filter", "Filter")}
                  <FaSlidersH />
                </button>
              )}
            </div>
            <div className="flex flex-row justify-between">
              <AppliedFilters
                hiddenFields={[LOCATION_FIELD, COUNTRY_CODE_FIELD]}
                customCssClasses={{
                  removableFilter:
                    "text-md font-normal mt-2 mb-0 font-body-fontFamily",
                  clearAllButton: "hidden",
                  appliedFiltersContainer: "mt-0 mb-0",
                }}
              />
            </div>
          </div>
          {resultCount > 0 && (
            <div
              id="innerDiv"
              className="md:flex-1 md:overflow-y-auto"
              ref={resultsContainer}
            >
              {isMobile ? (
                <MobileLocatorResultsSection
                  CardComponent={CardComponent}
                  results={mobileResults}
                  hasMoreResults={canShowMoreMobileResults}
                  handleShowMoreResults={() => {
                    if (searchLoading || mobileResults.length >= resultCount) {
                      return;
                    }

                    searchActions.setOffset(mobileResults.length);
                    executeSearch(searchActions);
                    setSearchState("loading");
                  }}
                />
              ) : (
                <VerticalResults
                  CardComponent={CardComponent}
                  setResultsRef={setResultsRef}
                />
              )}
            </div>
          )}
          {!isMobile && resultCount > RESULTS_LIMIT && (
            <div className="border-t border-gray-300 pt-4">
              <Pagination
                customCssClasses={{
                  selectedLabel:
                    "bg-palette-primary text-palette-primary-contrast border-palette-primary",
                }}
              />
            </div>
          )}
          <FilterModal
            showFilterModal={showFilterModal}
            showOpenNowOption={openNowButton}
            isOpenNowSelected={isOpenNowSelected}
            handleOpenNowClick={handleOpenNowClick}
            showDistanceOptions={showDistanceOptions}
            selectedDistanceOption={selectedDistanceOption}
            handleDistanceClick={handleDistanceClick}
            handleCloseModalClick={() => setShowFilterModal(false)}
            handleClearFiltersClick={handleClearFiltersClick}
            accentColorCssValue={filterAccentColorCssVariable}
            closeButtonRef={filterModalCloseButtonRef}
          />
        </div>
      </div>

      {/* Right Section: Map. Hidden for small screens */}
      <div id="locatorMapDiv" className="md:flex-1 md:flex hidden relative">
        {mapEnabled && isInitialMapLocationResolved && (
          <LocatorMap {...mapProps} />
        )}
        {mapEnabled && !isInitialMapLocationResolved && (
          <LoadingMapPlaceholder />
        )}
        {!mapEnabled && (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <div className="p-6">
              <Body
                className="text-gray-700 font-bold text-center"
                variant="lg"
              >
                {t(
                  "mapRequiresOptIn",
                  "This map can only be displayed if cookies are enabled"
                )}
              </Body>
              <div className="flex justify-center p-2">
                <Button
                  onClick={() => setMapEnabled(true)}
                  className="py-2 px-4 basis-full sm:w-auto justify-center"
                >
                  {t("enableCookies", "Enable Cookies")}
                </Button>
              </div>
            </div>
          </div>
        )}
        {showSearchAreaButton && (
          <div className="absolute top-10 left-0 right-0 flex justify-center">
            <Button
              onClick={handleSearchAreaClick}
              className="py-2 px-4 shadow-xl"
            >
              <Body>{t("searchThisArea", "Search This Area")}</Body>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
