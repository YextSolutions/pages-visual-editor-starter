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
import { SectionTitle, SectionTitleProps } from "./ui/sectionTitle";

export type ContentCarouselProps = {
  content: "services" | "events";
  backgroundColor: string;
  // sectionTitle: string;
  sectionTitle?: SectionTitleProps;
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
    content: "services",
    backgroundColor: "bg-white",
    sectionTitle: {
      title: "Section",
      align: "center",
      size: "md",
    },
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
        <SectionTitle {...sectionTitle} />
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
  sectionTitle?: SectionTitleProps;
}

const ContentCarouselSkeleton = ({
  backgroundColor,
  sectionTitle,
}: ContentCarouselSkeletonProps) => {
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
