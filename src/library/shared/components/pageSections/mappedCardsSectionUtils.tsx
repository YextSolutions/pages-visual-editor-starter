// @ts-nocheck
import * as React from "react";
import { SlotComponent } from "@puckeditor/core";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { PageSection } from "../atoms/pageSection";
import {
  isMappedCardWrapperEmpty,
  isMappedCardWrapperSelected,
} from "./entityFieldSectionUtils";
import { useMappedEntitySectionEmptyState } from "./useMappedEntitySectionEmptyState";

type CardWrapperSlot = Parameters<typeof isMappedCardWrapperSelected>[0];

/**
 * Section-level metadata used to determine whether a cards section should
 * observe its nested wrapper for a mapped-empty state and what that initial
 * empty state should be before observers run.
 */
export type MappedCardsSectionConditionalRender = {
  watchForMappedContentEmptyState: boolean;
  initialMappedContentEmpty?: boolean;
};

/**
 * Derives the section-level mapped-empty observer state from the nested cards
 * wrapper slot that owns the mapped entity field.
 */
export const getMappedCardsSectionConditionalRender = (
  cardsWrapperSlot: CardWrapperSlot
): MappedCardsSectionConditionalRender => ({
  watchForMappedContentEmptyState:
    isMappedCardWrapperSelected(cardsWrapperSlot),
  initialMappedContentEmpty: isMappedCardWrapperEmpty(cardsWrapperSlot),
});

/**
 * Renders the shared cards-section layout: a section wrapper, an optional
 * heading slot, and the cards wrapper slot inside the observed container.
 */
export const MappedCardsSectionContent = ({
  backgroundColor,
  showSectionHeading,
  SectionHeadingSlot,
  CardsWrapperSlot,
  setCardsWrapperRef,
}: {
  backgroundColor?: ThemeColor;
  showSectionHeading: boolean;
  SectionHeadingSlot: SlotComponent;
  CardsWrapperSlot: SlotComponent;
  setCardsWrapperRef?: (element: HTMLDivElement | null) => void;
}) => {
  return (
    <PageSection background={backgroundColor} className="flex flex-col gap-8">
      {showSectionHeading && (
        <SectionHeadingSlot style={{ height: "auto" }} allow={[]} />
      )}
      <div ref={setCardsWrapperRef}>
        <CardsWrapperSlot style={{ height: "auto" }} allow={[]} />
      </div>
    </PageSection>
  );
};

/**
 * Keeps the nested cards wrapper mounted while mapped-empty detection is
 * enabled, hiding the section on live when the wrapper reports an empty-state
 * marker and otherwise rendering the visible section content.
 */
export const MappedCardsSectionShell = ({
  conditionalRender,
  isEditing,
  CardsWrapperSlot,
  children,
}: {
  conditionalRender?: MappedCardsSectionConditionalRender;
  isEditing: boolean;
  CardsWrapperSlot: SlotComponent;
  children: (
    setCardsWrapperRef: (element: HTMLDivElement | null) => void
  ) => React.ReactNode;
}) => {
  const watchForMappedContentEmptyState =
    conditionalRender?.watchForMappedContentEmptyState ?? false;
  const initialMappedContentEmpty =
    conditionalRender?.initialMappedContentEmpty ?? false;
  const { setWrapperRef, isMappedContentEmpty } =
    useMappedEntitySectionEmptyState({
      enabled: watchForMappedContentEmptyState,
      initialIsMappedContentEmpty: initialMappedContentEmpty,
    });

  if (watchForMappedContentEmptyState && isMappedContentEmpty && !isEditing) {
    return (
      <div ref={setWrapperRef} className="hidden" aria-hidden="true">
        <CardsWrapperSlot style={{ height: "auto" }} allow={[]} />
      </div>
    );
  }

  return children(setWrapperRef);
};
