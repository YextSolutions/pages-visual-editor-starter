// @ts-nocheck
import React from "react";
import { PuckContext } from "@puckeditor/core";
import { Address } from "@yext/pages-components";
import { Background } from "../../atoms/background";
import { Heading } from "../../atoms/heading";
import { HeadingLevel } from "@yext/visual-editor/section-library-support";
import { HoursStatusAtom } from "../../atoms/hoursStatus";
import { MaybeLink } from "../../atoms/maybeLink";
import { PhoneAtom } from "../../atoms/phone";
import { useTemplateProps } from "@yext/visual-editor/section-library-support";
import { NearbyLocationCardsWrapperProps } from "./NearbyLocationsCardsWrapper";
import {
  mergeMeta,
  resolveUrlTemplate,
} from "@yext/visual-editor/section-library-support";
import { NearbyLocationDoc } from "./useNearbyLocations";

/** A single card for the Nearby Locations Section */
type NearbyLocationCardProps = {
  /** The location data to display in the card */
  locationData?: NearbyLocationDoc;

  /** @internal Shared styles for the card (controlled by the parent) */
  styles: NearbyLocationCardsWrapperProps["styles"];

  /** @internal The index of the card in the section */
  cardNumber?: number;

  /** @internal The puck context of the parent */
  puck: PuckContext;

  /** @internal The heading level of the parent section (used to meet accessibility guidelines) */
  sectionHeadingLevel?: HeadingLevel;
};

export const NearbyLocationCard: React.FC<NearbyLocationCardProps> = (
  props
) => {
  const { locationData, styles, cardNumber, sectionHeadingLevel } = props;

  if (!locationData) {
    return <></>;
  }

  const { name, hours, comingSoon, address, timezone, mainPhone } =
    locationData;

  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();

  const resolvedUrl = resolveUrlTemplate(
    mergeMeta(locationData, streamDocument),
    relativePrefixToRoot ?? ""
  );

  const showPhone = styles.showPhone && mainPhone;
  const showAddress = styles.showAddress && address;

  return (
    <Background
      background={styles.backgroundColor}
      className="flex flex-col flew-grow h-full rounded-lg overflow-hidden border p-6 sm:p-8"
      as="section"
    >
      <MaybeLink
        eventName={`link${cardNumber}`}
        alwaysHideCaret={true}
        className="mb-2 line-clamp-2 text-wrap break-words w-full"
        href={resolvedUrl}
      >
        <Heading
          color={styles?.color}
          level={styles.headingLevel ?? 4}
          semanticLevelOverride={
            sectionHeadingLevel
              ? sectionHeadingLevel < 6
                ? ((sectionHeadingLevel + 1) as HeadingLevel)
                : "span"
              : undefined
          }
        >
          {name}
        </Heading>
      </MaybeLink>
      {styles.showHours && (hours || comingSoon) && (
        <div
          className={`font-semibold font-body-fontFamily text-body-fontSize ${showPhone || showAddress ? "mb-2" : ""}`}
        >
          <HoursStatusAtom
            hours={hours ?? {}}
            comingSoon={comingSoon}
            className="h-full"
            timezone={timezone}
            showCurrentStatus={styles?.hours?.showCurrentStatus}
            dayOfWeekFormat={styles?.hours?.dayOfWeekFormat}
            showDayNames={styles?.hours?.showDayNames}
            timeFormat={styles?.hours?.timeFormat}
          />
        </div>
      )}
      {showPhone && (
        <PhoneAtom
          eventName={`phone${cardNumber}`}
          phoneNumber={mainPhone}
          format={styles?.phone?.phoneNumberFormat}
          includeHyperlink={styles?.phone?.phoneNumberLink}
          includeIcon={false}
          linkColor={styles?.phone?.color}
        />
      )}
      {showAddress && (
        <div className="font-body-fontFamily font-body-fontWeight text-body-fontSize">
          <Address
            address={address}
            showRegion={styles.address?.showRegion ?? true}
            showCountry={styles.address?.showCountry ?? false}
          />
        </div>
      )}
    </Background>
  );
};
