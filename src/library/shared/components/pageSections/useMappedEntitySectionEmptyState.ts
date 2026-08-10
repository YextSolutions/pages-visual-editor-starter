// @ts-nocheck
import * as React from "react";
import { EMPTY_STATE_MARKER_SELECTOR } from "./emptyStateMarker";

export const useMappedEntitySectionEmptyState = ({
  enabled,
  initialIsMappedContentEmpty = false,
}: {
  enabled: boolean;
  initialIsMappedContentEmpty?: boolean;
}) => {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const [isMappedContentEmpty, setIsMappedContentEmpty] = React.useState(
    enabled && initialIsMappedContentEmpty
  );
  const setWrapperRef = React.useCallback((element: HTMLDivElement | null) => {
    setElement(element);
  }, []);

  React.useEffect(() => {
    if (!enabled) {
      setIsMappedContentEmpty(false);
      return;
    }

    setIsMappedContentEmpty(initialIsMappedContentEmpty);
  }, [enabled, initialIsMappedContentEmpty]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!element) {
      return;
    }

    const updateEmptyState = () => {
      setIsMappedContentEmpty(
        element.querySelector(EMPTY_STATE_MARKER_SELECTOR) !== null
      );
    };

    const observer = new MutationObserver(updateEmptyState);
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    updateEmptyState();

    return () => {
      observer.disconnect();
    };
  }, [element, enabled]);

  return { setWrapperRef, isMappedContentEmpty };
};
