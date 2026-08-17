import { setDeep } from "@puckeditor/core";
import { CardProps } from "@yext/search-ui-react";
import { Result } from "@yext/search-headless-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { getPreferredDistanceUnit } from "@yext/visual-editor/section-library-support";
import { getLocatorEntityTypeSourceMap } from "@yext/visual-editor/section-library-support";
import { LocatorConfig } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { Button } from "@yext/visual-editor/section-library-support";
import {
  DEFAULT_LOCATOR_RESULT_CARD_PROPS,
  Location,
  LocatorResultCardFields,
  LocatorResultCardProps,
} from "./LocatorResultCard";

export const RESULTS_LIMIT = 20;
export type SearchState = "not started" | "loading" | "complete";

const BOOLEAN_SUPPORTED_FIELDS = [
  "primaryHeading",
  "secondaryHeading",
  "tertiaryHeading",
] as const;

const getLocatorConfigFromPageSet = (pageSet?: string): LocatorConfig => {
  if (!pageSet) {
    return {};
  }

  try {
    return JSON.parse(pageSet)?.typeConfig?.locatorConfig ?? {};
  } catch {
    console.error("Failed to parse locator config from page set");
    return {};
  }
};

export const translateDistanceUnit = (
  t: (key: string, options?: Record<string, unknown>) => string,
  unit: "mile" | "kilometer",
  count: number
) => {
  if (unit === "mile") {
    return t("mile", { count, defaultValue: "mile" });
  }

  return t("kilometer", { count, defaultValue: "kilometer" });
};

interface MobileLocatorResultsSectionProps {
  CardComponent: React.ComponentType<CardProps<Location>>;
  results: Result<Location>[];
  hasMoreResults: boolean;
  handleShowMoreResults: () => void;
}

export const ResultCardPropsField = ({
  value,
  onChange,
}: {
  value?: LocatorResultCardProps;
  onChange: (value: LocatorResultCardProps) => void;
}) => {
  const streamDocument = useDocument();
  const templateMetadata = useTemplateMetadata();
  const entityTypeSourceMap = getLocatorEntityTypeSourceMap();
  const entityTypeScopes = React.useMemo(() => {
    const locatorConfig = getLocatorConfigFromPageSet(streamDocument?._pageset);
    return locatorConfig.entityTypeScope ?? [];
  }, [streamDocument]);

  /**
   * Builds the field schema for the result card editor, including:
   * - Conditionally removing the primary CTA section when entity scope is not attached to a page set.
   * - Toggling constant value vs. field selector visibility per section.
   */
  const resultCardFields = React.useMemo(() => {
    if (!value?.entityType) {
      return LocatorResultCardFields;
    }
    let fields = LocatorResultCardFields;
    const entityTypeHasSourcePageSet = !!entityTypeSourceMap[value.entityType];
    const scopeExistsForEntityType =
      entityTypeScopes.find(
        (scope) => scope.entityType === value.entityType
      ) !== undefined;

    fields = setDeep(
      fields,
      `objectFields.primaryCTA.objectFields.link.visible`,
      !entityTypeHasSourcePageSet && scopeExistsForEntityType
    );

    // For each section, show either the field selector or the constant value editor.
    BOOLEAN_SUPPORTED_FIELDS.forEach((key) => {
      const headingConfig = value[key];
      const constantValueEnabled = headingConfig?.constantValueEnabled ?? false;
      const field = headingConfig?.field;
      const fieldTypeId = field
        ? templateMetadata?.locatorDisplayFields?.[field]?.field_type_id
        : undefined;
      const booleanFieldSelected =
        !constantValueEnabled && fieldTypeId === "type.boolean";

      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.field.visible`,
        !constantValueEnabled
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.constantValue.visible`,
        constantValueEnabled
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.trueDisplayText.visible`,
        !constantValueEnabled && booleanFieldSelected
      );
      fields = setDeep(
        fields,
        `objectFields.${key}.objectFields.falseDisplayText.visible`,
        booleanFieldSelected
      );
    });

    const imageConstantValueEnabled =
      value.image?.constantValueEnabled ?? false;
    fields = setDeep(
      fields,
      "objectFields.image.objectFields.field.visible",
      !imageConstantValueEnabled
    );
    fields = setDeep(
      fields,
      "objectFields.image.objectFields.constantValue.visible",
      imageConstantValueEnabled
    );

    return fields;
  }, [entityTypeSourceMap, entityTypeScopes, templateMetadata, value]);

  return (
    <YextAutoField
      field={resultCardFields}
      value={value ?? DEFAULT_LOCATOR_RESULT_CARD_PROPS}
      onChange={onChange}
    />
  );
};

export const MobileLocatorResultsSection = ({
  CardComponent,
  results,
  hasMoreResults,
  handleShowMoreResults,
}: MobileLocatorResultsSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      {results.length > 0 && (
        <div>
          {results.map((result, position) => (
            <div
              key={
                result.rawData?.id ??
                result.id ??
                `${result.index ?? "result"}-${position}`
              }
            >
              <CardComponent result={result} />
            </div>
          ))}
        </div>
      )}
      {hasMoreResults && (
        // Mobile replaces numbered pagination with incremental loading.
        <div className="px-8 py-4">
          <Button
            className="w-full justify-center"
            onClick={handleShowMoreResults}
          >
            {t("showMoreLocations", "Show more locations")}
          </Button>
        </div>
      )}
    </>
  );
};

interface ResultsCountSummaryProps {
  searchState: SearchState;
  resultCount: number;
  selectedDistanceOption: number | null;
  filterDisplayName?: string;
}

export const ResultsCountSummary = ({
  searchState,
  resultCount,
  selectedDistanceOption,
  filterDisplayName,
}: ResultsCountSummaryProps) => {
  const { t, i18n } = useTranslation();

  if (resultCount === 0) {
    if (searchState === "not started") {
      return (
        <Body>
          {t(
            "useOurLocatorToFindALocationNearYou",
            "Use our locator to find a location near you"
          )}
        </Body>
      );
    }

    if (searchState === "complete") {
      return (
        <Body>
          {t("noResultsFoundForThisArea", "No results found for this area")}
        </Body>
      );
    }

    return <div />;
  }

  if (filterDisplayName) {
    if (selectedDistanceOption) {
      const unit = getPreferredDistanceUnit(i18n.language);
      return (
        <Body>
          {t("locationsWithinDistanceOf", {
            count: resultCount,
            distance: selectedDistanceOption,
            unit: translateDistanceUnit(t, unit, selectedDistanceOption),
            name: filterDisplayName,
          })}
        </Body>
      );
    }

    return (
      <Body>
        {t("locationsNear", {
          count: resultCount,
          name: filterDisplayName,
        })}
      </Body>
    );
  }

  return (
    <Body>
      {t("locationWithCount", {
        count: resultCount,
      })}
    </Body>
  );
};
