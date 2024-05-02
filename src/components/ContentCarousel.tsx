import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
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

export type ContentCarouselProps = {
  content: "services" | "events";
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
  },
  defaultProps: {
    content: "services",
  },
  render: ({ content }) => {
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

    console.log(contentCarousel);

    console.log(services);

    console.log(content);

    // TODO: add placeholder for null content value
    return (
      <Section>
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
