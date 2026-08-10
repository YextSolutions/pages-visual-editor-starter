// @ts-nocheck
export const EMPTY_STATE_MARKER_ATTRIBUTE = "data-empty-state";
export const EMPTY_STATE_MARKER_SELECTOR = '[data-empty-state="true"]';

export const EmptyStateMarker = () => (
  <div data-empty-state="true" aria-hidden="true" />
);
