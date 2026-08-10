// @ts-nocheck
import * as React from "react";
import { CircleSlash2 } from "lucide-react";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import { Body } from "../atoms/body";
import { EmptyStateMarker } from "./emptyStateMarker";
import { EMPTY_STATE_MARKER_ATTRIBUTE } from "./emptyStateMarker";

/**
 * Shared editor empty state shown when a section or cards wrapper is mapped to
 * an entity field that resolves empty.
 *
 * This is used in two ways:
 * - direct-data sections such as FAQ render it as the full editor replacement
 *   for the hidden section
 * - wrapper-backed sections such as Product, Team, Event, Insight,
 *   Testimonial, and Photo Gallery render it from the nested wrapper so the
 *   parent section can detect the empty-state marker and hide the live section
 *
 * When `showEmptyStateMarker` is true, the box also emits the shared
 * `data-empty-state` marker that observer-based section shells watch for.
 */
export const EntityFieldSectionEmptyStateBox = ({
  showEmptyStateMarker = false,
}: {
  showEmptyStateMarker?: boolean;
}) => {
  const templateMetadata = useTemplateMetadata();
  const entityTypeDisplayName = templateMetadata?.entityTypeDisplayName;

  return (
    <div
      className="relative h-[300px] w-full bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center py-8 gap-2.5"
      {...{
        [EMPTY_STATE_MARKER_ATTRIBUTE]: showEmptyStateMarker
          ? "true"
          : undefined,
      }}
      data-testid="entity-field-section-empty-state"
    >
      <CircleSlash2 className="w-12 h-12 text-gray-400" />
      <div className="flex flex-col items-center gap-0">
        <Body variant="base" className="text-gray-500 font-medium">
          {pt(
            "emptyStateSectionHidden",
            "Section hidden for this {{entityType}}",
            {
              entityType: entityTypeDisplayName
                ? entityTypeDisplayName.toLowerCase()
                : "page",
            }
          )}
        </Body>
        <Body variant="base" className="text-gray-500 font-normal">
          {pt(
            "emptyStateFieldEmpty",
            "{{entityType}}'s mapped field is empty",
            {
              entityType: entityTypeDisplayName
                ? entityTypeDisplayName.charAt(0).toUpperCase() +
                  entityTypeDisplayName.slice(1)
                : "Entity",
            }
          )}
        </Body>
      </div>
    </div>
  );
};

export const renderMappedEntityFieldEmptyState = (isEditing: boolean) => {
  return isEditing ? (
    <EntityFieldSectionEmptyStateBox showEmptyStateMarker />
  ) : (
    <EmptyStateMarker />
  );
};
