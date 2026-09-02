import {
  FieldValueFilter,
  FieldValueStaticFilter,
  Matcher,
  NearFilterValue,
  SelectableStaticFilter,
} from "@yext/search-headless-react";
import { AppliedFilters, Facets } from "@yext/search-ui-react";
import React from "react";
import { type MultiSelectorOption } from "@yext/visual-editor/section-library-support";
import { useCollapse } from "react-collapsed";
import { useTranslation } from "react-i18next";
import { FaChevronUp, FaDotCircle, FaRegCircle, FaTimes } from "react-icons/fa";
import { getPreferredDistanceUnit } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { LocatorEntityType } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { translateDistanceUnit } from "./Results";

export const LOCATION_FIELD = "builtin.location";
export const COUNTRY_CODE_FIELD = "address.countryCode";
export const HOURS_FIELD = "builtin.hours";

interface FilterModalProps {
  showFilterModal: boolean;
  showOpenNowOption: boolean; // whether to show the Open Now filter option
  isOpenNowSelected: boolean; // whether the Open Now filter is currently selected by the user
  showDistanceOptions: boolean; // whether to show the Distance filter option
  selectedDistanceOption: number | null;
  handleCloseModalClick: () => void;
  handleOpenNowClick: (selected: boolean) => void;
  handleDistanceClick: (
    distance: number,
    distanceUnit: "mile" | "kilometer"
  ) => void;
  handleClearFiltersClick: () => void;
  accentColorCssValue: string;
  closeButtonRef: React.Ref<HTMLButtonElement>;
}

export const FilterModal = ({
  showFilterModal,
  showOpenNowOption,
  isOpenNowSelected,
  showDistanceOptions,
  selectedDistanceOption,
  handleCloseModalClick,
  handleOpenNowClick,
  handleDistanceClick,
  handleClearFiltersClick,
  accentColorCssValue,
  closeButtonRef,
}: FilterModalProps) => {
  const { t } = useTranslation();
  const popupRef = React.useRef<HTMLDivElement>(null);

  return showFilterModal ? (
    <div
      id="locator-filter-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="locator-filter-modal-title"
      className="absolute md:top-4 -top-20 z-50 md:w-80 w-full flex flex-col bg-white md:left-full md:ml-2 rounded-md shadow-lg max-h-[calc(100%-2rem)]"
      style={
        {
          "--locator-filter-accent-color": accentColorCssValue,
        } as React.CSSProperties
      }
      ref={popupRef}
    >
      <div className="inline-flex justify-between items-center px-6 py-4 gap-4">
        <Body className="font-bold" id="locator-filter-modal-title">
          {t("refineYourSearch", "Refine Your Search")}
        </Body>
        <button
          ref={closeButtonRef}
          style={{ color: accentColorCssValue }}
          onClick={handleCloseModalClick}
          aria-label={t("close", "Close")}
        >
          <FaTimes />
        </button>
      </div>
      <div className="px-6 border-b border-gray-300">
        <AppliedFilters
          hiddenFields={[LOCATION_FIELD, COUNTRY_CODE_FIELD]}
          customCssClasses={{
            removableFilter: "text-md font-normal",
            clearAllButton: "hidden",
          }}
        />
      </div>
      <div className="flex flex-col p-6 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {showOpenNowOption && (
            <OpenNowFilter
              isSelected={isOpenNowSelected}
              onChange={handleOpenNowClick}
            />
          )}
          {showDistanceOptions && (
            <DistanceFilter
              onChange={handleDistanceClick}
              selectedDistanceOption={selectedDistanceOption}
              accentColorCssValue={accentColorCssValue}
            />
          )}
          <Facets
            customCssClasses={{
              divider: "bg-white",
              titleLabel: "font-bold text-md font-body-fontFamily",
              optionInput:
                "h-4 w-4 [accent-color:var(--locator-filter-accent-color)]",
              optionLabel: "text-md font-body-fontFamily font-body-fontWeight",
              option: "space-x-4 font-body-fontFamily",
            }}
          />
        </div>
      </div>
      <div className="border-y border-gray-300 justify-center align-middle">
        <button
          className="w-full py-4 text-center font-bold font-body-fontFamily text-body-fontSize"
          style={{ color: accentColorCssValue }}
          onClick={handleClearFiltersClick}
        >
          {t("clearAll", "Clear All")}
        </button>
      </div>
    </div>
  ) : null;
};

interface OpenNowFilterProps {
  isSelected: boolean;
  onChange: (selected: boolean) => void;
}

const OpenNowFilter = ({ isSelected, onChange }: OpenNowFilterProps) => {
  const { t } = useTranslation();
  const { isExpanded, getToggleProps, getCollapseProps } = useCollapse({
    defaultExpanded: true,
  });
  const iconClassName = isExpanded
    ? "w-3 text-gray-400"
    : "w-3 text-gray-400 transform rotate-180";

  const openNowCheckBoxId = "openNowCheckBox";
  return (
    <div className="flex flex-col gap-4">
      <button
        className="w-full flex justify-between items-center font-bold font-body-fontFamily text-body-fontSize"
        {...getToggleProps()}
      >
        {t("hours", "Hours")}
        <FaChevronUp className={iconClassName} />
      </button>
      <div className="flex flex-row gap-1" {...getCollapseProps()}>
        <div className="inline-flex items-center gap-4">
          <input
            type="checkbox"
            id={openNowCheckBoxId}
            checked={isSelected}
            className={
              "w-4 h-4 form-checkbox cursor-pointer border border-gray-300" +
              " rounded-sm text-primary focus:ring-primary [accent-color:var(--locator-filter-accent-color)]"
            }
            onChange={() => onChange(!isSelected)}
          />
          <label htmlFor={openNowCheckBoxId}>
            <Body>{t("openNow", "Open Now")}</Body>
          </label>
        </div>
      </div>
    </div>
  );
};

interface DistanceFilterProps {
  onChange: (distance: number, unit: "mile" | "kilometer") => void;
  selectedDistanceOption: number | null;
  accentColorCssValue: string;
}

const DistanceFilter = ({
  onChange,
  selectedDistanceOption,
  accentColorCssValue,
}: DistanceFilterProps) => {
  const { t, i18n } = useTranslation();
  const { isExpanded, getToggleProps, getCollapseProps } = useCollapse({
    defaultExpanded: true,
  });
  const iconClassName = isExpanded
    ? "w-3 text-gray-400"
    : "w-3 text-gray-400 transform rotate-180";
  const distanceOptions = [5, 10, 25, 50];
  const unit = getPreferredDistanceUnit(i18n.language);

  return (
    <div className="flex flex-col gap-4">
      <button
        className="w-full flex justify-between items-center font-bold font-body-fontFamily text-body-fontSize"
        {...getToggleProps()}
      >
        {t("distance", "Distance")}
        <FaChevronUp className={iconClassName} />
      </button>
      <div {...getCollapseProps()}>
        {distanceOptions.map((distanceOption) => (
          <div
            className="flex flex-row gap-4 items-center"
            id={`distanceOption-${distanceOption}`}
            key={distanceOption}
          >
            <button
              className="inline-flex bg-white"
              onClick={() => onChange(distanceOption, unit)}
              aria-label={`${t("selectDistanceLessThan", "Select distance less than")} ${distanceOption} ${translateDistanceUnit(t, unit, distanceOption)}`}
            >
              <div style={{ color: accentColorCssValue }}>
                {selectedDistanceOption === distanceOption ? (
                  <FaDotCircle />
                ) : (
                  <FaRegCircle />
                )}
              </div>
            </button>
            <Body className="inline-flex">
              {`< ${distanceOption} ${translateDistanceUnit(t, unit, distanceOption)}`}
            </Body>
          </div>
        ))}
      </div>
    </div>
  );
};

export function getFacetFieldOptions(
  entityTypes: LocatorEntityType[]
): MultiSelectorOption<string>[] {
  const facetFields: MultiSelectorOption<string>[] = [];
  const addedValues: Set<string> = new Set<string>();
  entityTypes.forEach((entityType) =>
    getFacetFieldOptionsForEntityType(entityType).forEach((option) => {
      if (option?.value && !addedValues.has(option.value)) {
        facetFields.push(option);
        addedValues.add(option.value);
      }
    })
  );
  return facetFields.sort((a, b) => a.label.localeCompare(b.label));
}

function getFacetFieldOptionsForEntityType(
  entityType: LocatorEntityType
): MultiSelectorOption<string>[] {
  let filterOptions: MultiSelectorOption<string>[] = [
    {
      label: msg("fields.options.facets.city", "City"),
      value: "address.city",
    },
    {
      label: msg("fields.options.facets.postalCode", "Postal Code"),
      value: "address.postalCode",
    },
    {
      label: msg("fields.options.facets.region", "Region"),
      value: "address.region",
    },
    {
      label: msg("fields.options.facets.brandName", "Brand Name"),
      value: "brandReference.name",
    },
  ];
  switch (entityType) {
    case "location":
      filterOptions = filterOptions.concat(
        {
          label: msg("fields.options.facets.associations", "Associations"),
          value: "associations",
        },
        {
          label: msg("fields.options.facets.brands", "Brands"),
          value: "brands",
        },
        {
          label: msg("fields.options.facets.keywords", "Keywords"),
          value: "keywords",
        },
        {
          label: msg("fields.options.facets.languages", "Languages"),
          value: "languages",
        },
        {
          label: msg("fields.options.facets.paymentOptions", "Payment Options"),
          value: "paymentOptions",
        },
        {
          label: msg("fields.options.facets.products", "Products"),
          value: "products",
        },
        {
          label: msg("fields.options.facets.services", "Services"),
          value: "services",
        },
        {
          label: msg("fields.options.facets.specialties", "Specialties"),
          value: "specialities",
        }
      );
      break;
    case "restaurant":
      filterOptions = filterOptions.concat(
        {
          label: msg(
            "fields.options.facets.acceptsReservations",
            "Accepts Reservations"
          ),
          value: "acceptsReservations",
        },
        {
          label: msg("fields.options.facets.associations", "Associations"),
          value: "associations",
        },
        {
          label: msg("fields.options.facets.brands", "Brands"),
          value: "brands",
        },
        {
          label: msg("fields.options.facets.keywords", "Keywords"),
          value: "keywords",
        },
        {
          label: msg("fields.options.facets.languages", "Languages"),
          value: "languages",
        },
        {
          label: msg("fields.options.facets.mealsServed", "Meals Served"),
          value: "mealsServed",
        },
        {
          label: msg("fields.options.facets.neighborhood", "Neighborhood"),
          value: "neighborhood",
        },
        {
          label: msg("fields.options.facets.paymentOptions", "Payment Options"),
          value: "paymentOptions",
        },
        {
          label: msg(
            "fields.options.facets.pickupAndDeliveryServices",
            "Pickup and Delivery Services"
          ),
          value: "pickupAndDeliveryServices",
        },
        {
          label: msg("fields.options.facets.priceRange", "Price Range"),
          value: "priceRange",
        },
        {
          label: msg("fields.options.facets.services", "Services"),
          value: "services",
        },
        {
          label: msg("fields.options.facets.specialties", "Specialties"),
          value: "specialities",
        }
      );
      break;
    case "healthcareFacility":
      filterOptions = filterOptions.concat(
        {
          label: msg(
            "fields.options.facets.acceptingNewPatients",
            "Accepting New Patients"
          ),
          value: "acceptingNewPatients",
        },
        {
          label: msg(
            "fields.options.facets.conditionsTreated",
            "Conditions Treated"
          ),
          value: "conditionsTreated",
        },
        {
          label: msg(
            "fields.options.facets.insuranceAccepted",
            "Insurance Accepted"
          ),
          value: "insuranceAccepted",
        },
        {
          label: msg("fields.options.facets.paymentOptions", "Payment Options"),
          value: "paymentOptions",
        },
        {
          label: msg("fields.options.facets.services", "Services"),
          value: "services",
        }
      );
      break;
    case "healthcareProfessional":
      filterOptions = filterOptions.concat(
        {
          label: msg(
            "fields.options.facets.acceptingNewPatients",
            "Accepting New Patients"
          ),
          value: "acceptingNewPatients",
        },
        {
          label: msg(
            "fields.options.facets.admittingHospitals",
            "Admitting Hospitals"
          ),
          value: "admittingHospitals",
        },
        {
          label: msg("fields.options.facets.brands", "Brands"),
          value: "brands",
        },
        {
          label: msg("fields.options.facets.certifications", "Certifications"),
          value: "certifications",
        },
        {
          label: msg(
            "fields.options.facets.conditionsTreated",
            "Conditions Treated"
          ),
          value: "conditionsTreated",
        },
        {
          label: msg("fields.options.facets.degrees", "Degrees"),
          value: "degrees",
        },
        {
          label: msg("fields.options.facets.gender", "Gender"),
          value: "gender",
        },
        {
          label: msg(
            "fields.options.facets.insuranceAccepted",
            "Insurance Accepted"
          ),
          value: "insuranceAccepted",
        },
        {
          label: msg("fields.options.facets.languages", "Languages"),
          value: "languages",
        },
        {
          label: msg("fields.options.facets.neighborhood", "Neighborhood"),
          value: "neighborhood",
        },
        {
          label: msg("fields.options.facets.officeName", "Office Name"),
          value: "officeName",
        },
        {
          label: msg("fields.options.facets.services", "Services"),
          value: "services",
        }
      );
      break;
    case "hotel":
      filterOptions = filterOptions.concat(
        { label: msg("fields.options.facets.bar", "Bar"), value: "bar" },
        {
          label: msg("fields.options.facets.catsAllowed", "Cats Allowed"),
          value: "catsAllowed",
        },
        {
          label: msg("fields.options.facets.dogsAllowed", "Dogs Allowed"),
          value: "dogsAllowed",
        },
        {
          label: msg("fields.options.facets.parking", "Parking"),
          value: "parking",
        },
        { label: msg("fields.options.facets.pools", "Pools"), value: "pools" }
      );
      break;
    case "financialProfessional":
      filterOptions = filterOptions.concat(
        {
          label: msg("fields.options.facets.certifications", "Certifications"),
          value: "certifications",
        },
        {
          label: msg("fields.options.facets.interests", "Interests"),
          value: "interests",
        },
        {
          label: msg("fields.options.facets.languages", "Languages"),
          value: "languages",
        },
        {
          label: msg("fields.options.facets.services", "Services"),
          value: "services",
        },
        {
          label: msg("fields.options.facets.specialties", "Specialties"),
          value: "specialties",
        },
        {
          label: msg(
            "fields.options.facets.yearsOfExperience",
            "Years of Experience"
          ),
          value: "yearsOfExperience",
        }
      );
      break;
    default:
      break;
  }
  return filterOptions;
}

/**
 * Returns true if the given filter is a "near" filter on the builtin.location field; otherwise,
 * returns false.
 */
const isLocationNearFilter = (filter: SelectableStaticFilter) =>
  filter.filter.kind === "fieldValue" &&
  filter.filter.fieldId === LOCATION_FIELD &&
  filter.filter.matcher === Matcher.Near;

/**
 * Returns true if the given filter is an "open at" filter on the builtin.hours field; otherwise,
 * returns false.
 */
const isOpenNowFilter = (filter: SelectableStaticFilter) =>
  filter.filter.kind === "fieldValue" &&
  filter.filter.fieldId === HOURS_FIELD &&
  filter.filter.matcher === Matcher.OpenAt;

/**
 * Builds a "near" static filter on the builtin.location field from a previous near filter
 * value, with optional overrides for display name and radius
 */
export function buildNearLocationFilterFromPrevious(
  previousValue: NearFilterValue,
  displayName?: string,
  radius?: number
): SelectableStaticFilter {
  return {
    selected: true,
    displayName,
    filter: {
      kind: "fieldValue",
      fieldId: LOCATION_FIELD,
      value: {
        ...previousValue,
        radius: radius ?? previousValue.radius,
      },
      matcher: Matcher.Near,
    },
  };
}

/**
 * Builds a "near" static filter on the builtin.location field from given coordinates, with
 * optional radius and display name.
 */
export function buildNearLocationFilterFromCoords(
  lat: number,
  lng: number,
  radius: number,
  displayName?: string
): SelectableStaticFilter {
  return {
    selected: true,
    displayName,
    filter: {
      kind: "fieldValue",
      fieldId: LOCATION_FIELD,
      value: {
        lat,
        lng,
        radius,
      },
      matcher: Matcher.Near,
    },
  };
}

/**
 * Builds an "equals" static filter on the builtin.location field from a previous equals filter,
 * with a new display name.
 */
export function buildEqualsLocationFilter(
  filter: FieldValueFilter,
  newDisplayName: string
): SelectableStaticFilter {
  return {
    displayName: newDisplayName,
    selected: true,
    filter: {
      kind: "fieldValue",
      fieldId: filter.fieldId,
      value: filter.value,
      matcher: Matcher.Equals,
    },
  };
}

/**
 * Helper function to iterate through a list of static filters and update all near filters on the
 * location field to have the new radius.
 */
export function updateRadiusInNearFiltersOnLocationField(
  filters: SelectableStaticFilter[],
  newRadius: number
): SelectableStaticFilter[] {
  return filters.map((filter) => {
    if (isLocationNearFilter(filter)) {
      const previousFilter = filter.filter as FieldValueStaticFilter;
      const previousValue = previousFilter.value as NearFilterValue;
      return {
        ...filter,
        filter: {
          ...previousFilter,
          value: {
            ...previousValue,
            radius: newRadius,
          },
        },
      } as SelectableStaticFilter;
    }

    return filter;
  });
}

/**
 * Helper function to iterate through a list of static filters and set the selected field to
 * false on any Open Now filters.
 */
export function deselectOpenNowFilters(
  filters: SelectableStaticFilter[]
): SelectableStaticFilter[] {
  return filters.map((filter) => {
    if (isOpenNowFilter(filter)) {
      return {
        ...filter,
        selected: false,
      };
    }

    return filter;
  });
}
