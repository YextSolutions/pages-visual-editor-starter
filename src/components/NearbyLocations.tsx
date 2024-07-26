import { ComponentConfig } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import { AssociatedLocation, BranchStream } from "../types/autogen";

import { Section } from "./Section";

import { backgroundColors } from "../puck/theme";
import useEnvironment from "../hooks/useEnvironment";
import { LocationCard } from "./cards/LocationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./atoms/carousel";
import { SectionTitleProps, SectionTitle } from "./atoms/sectionTitle";
import { Skeleton } from "./atoms/skeleton";

export type NearbyLocationsProps = {
  backgroundColor: string;
  sectionTitle?: SectionTitleProps;
};

export const NearbyLocations: ComponentConfig<NearbyLocationsProps> = {
  label: "Nearby Locations",
  fields: {
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
    sectionTitle: {
      type: "object",
      objectFields: {
        title: { type: "text" },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "radio",
          options: [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
        },
      },
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
    sectionTitle: {
      title: "Section",
      align: "center",
      size: "md",
    },
  },
  render: ({ backgroundColor, sectionTitle }) => {
    // TODO: ask team about types
    const locations: AssociatedLocation[] = useDocument<BranchStream>(
      (document) => document.c_associatedLocations?.associatedLocations
    );

    const isEditor = useEnvironment();

    if (!locations) {
      if (isEditor) {
        return (
          <EventsSkeleton
            backgroundColor={backgroundColor}
            sectionTitle={sectionTitle}
          />
        );
      } else {
        return <></>;
      }
    }

    return (
      <Section className={backgroundColor}>
        <div className="mb-8">
          <SectionTitle {...sectionTitle} />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </Section>
    );
  },
};

interface EventsSkeletonProps {
  backgroundColor: string;
  sectionTitle?: SectionTitleProps;
}

const EventsSkeleton = ({
  backgroundColor,
  sectionTitle,
}: EventsSkeletonProps) => {
  const itemCount = 3; // Typical number of items to display for layout consistency

  return (
    <Section className={backgroundColor}>
      <SectionTitle {...sectionTitle} />
      <Carousel>
        <CarouselContent>
          {Array.from({ length: itemCount }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-3/ md:basis-1/2 lg:basis-1/3"
            >
              <CardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  );
};

const CardSkeleton = () => {
  return (
    <div className="h-full gap-y-4 rounded-lg border border-zinc-200">
      <Skeleton className="h-14 w-14 mx-auto" />{" "}
      <Skeleton className="h-8 w-full mb-2" />{" "}
      <Skeleton className="h-24 w-full" />{" "}
    </div>
  );
};
