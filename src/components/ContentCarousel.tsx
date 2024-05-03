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

export type ContentCarouselProps = {
  content: "services" | "events";
  backgroundColor: string;
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
  },
  defaultProps: {
    content: "services",
    backgroundColor: "bg-white",
  },
  render: ({ content, backgroundColor }) => {
    // TODO: ask team about types
    // const bio: C_con = useDocument<FinancialProfessionalStream>(
    //   (document) => document.
    // );
    const contentCarousel: ContentCarouselType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentCarousel
      );

    const services = contentCarousel?.services || [];
    const events = contentCarousel?.events || [];

    // TODO: add placeholder for null content value
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
