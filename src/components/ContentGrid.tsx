import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import {
  FinancialProfessionalStream,
  ContentCarousel as ContentCarouselType,
  ContentGrid as ContentGridType,
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
import { AdvisorCard } from "./cards/AdvisorCard";

export type ContentGridProps = {
  // content: "services" | "events";
};

// const contentOptions = [
//   { label: "Services", value: "services" },
//   { label: "Events", value: "events" },
// ];

export const ContentGrid: ComponentConfig<ContentGridProps> = {
  fields: {
    // content: {
    //   label: "Content",
    //   type: "select",
    //   options: contentOptions,
    // },
  },
  defaultProps: {
    content: "services",
  },
  render: (
    {
      // content
    }
  ) => {
    // TODO: ask team about types
    // const bio: C_con = useDocument<FinancialProfessionalStream>(
    //   (document) => document.
    // );
    const contentGrid: ContentGridType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentGrid
      );

    const contentGridItems = contentGrid?.financialProfessionals || [];

    // console.log(services);

    // console.log(content);

    // TODO: add placeholder for null content value
    return (
      <Section className="grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contentGridItems.map((item) => (
          <AdvisorCard key={item.id} advisor={item} />
        ))}
      </Section>
    );
  },
};
