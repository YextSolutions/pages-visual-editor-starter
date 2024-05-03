import { ComponentConfig } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import {
  FinancialProfessionalStream,
  ContentCarousel as ContentCarouselType,
} from "../types/autogen";

import { Section } from "./Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { ServiceCard } from "./cards/ServiceCard";
import { EventCard } from "./cards/EventCard";
import { backgroundColors } from "../puck/theme";
import { Skeleton } from "./ui/skeleton";
import useEnvironment from "../hooks/useEnvironment";

export type ContentCarouselProps = {
  content: "services" | "events";
  backgroundColor: string;
  sectionTitle: string;
};

const contentOptions = [
  { label: "Services", value: "services" },
  { label: "Events", value: "events" },
];

export const ContentCarousel: ComponentConfig<ContentCarouselProps> = {
  fields: {
    content: {
      label: "Content",
      type: "select",
      options: contentOptions,
    },
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
    sectionTitle: {
      label: "Section Title",
      type: "text",
    },
  },
  defaultProps: {
    content: "services",
    backgroundColor: "bg-white",
    sectionTitle: "Section",
  },
  render: ({ content, backgroundColor, sectionTitle }) => {
    // TODO: ask team about types
    const contentCarousel: ContentCarouselType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentCarousel
      );

    const services = contentCarousel?.services || [];
    const events = contentCarousel?.events || [];

    const isEditor = useEnvironment();

    if (!contentCarousel) {
      if (isEditor) {
        return (
          <ContentCarouselSkeleton
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
        {/* TODO: move to a prop on the section */}
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {contentCarousel?.title}
        </h2>
        <Carousel>
          <CarouselContent>
            {content === "services"
              ? services.map((service) => (
                  <CarouselItem
                    className="basis-3/ md:basis-1/2 lg:basis-1/3"
                    key={service.id}
                  >
                    <ServiceCard service={service} />
                  </CarouselItem>
                ))
              : events.map((event) => (
                  <CarouselItem key={event.id}>
                    <EventCard event={event} />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>
    );
  },
};

interface ContentCarouselSkeletonProps {
  backgroundColor: string;
  sectionTitle: string;
}

const ContentCarouselSkeleton = ({
  backgroundColor,
  sectionTitle,
}: ContentCarouselSkeletonProps) => {
  const itemCount = 3; // Typical number of items to display for layout consistency

  return (
    <Section className={backgroundColor}>
      <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
        {sectionTitle}
      </h2>
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
