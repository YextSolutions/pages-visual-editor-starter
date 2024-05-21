import { ComponentConfig } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import {
  FinancialProfessionalStream,
  ContentCarousel as ContentCarouselType,
  ServicesOffered,
  LinkedService,
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
import { backgroundColors } from "../puck/theme";
import { Skeleton } from "./ui/skeleton";
import useEnvironment from "../hooks/useEnvironment";

export type ServicesProps = {
  backgroundColor: string;
  sectionTitle: string;
};

export const Services: ComponentConfig<ServicesProps> = {
  fields: {
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
    backgroundColor: "bg-white",
    sectionTitle: "Section",
  },
  render: ({ backgroundColor, sectionTitle }) => {
    // TODO: ask team about types
    const services: LinkedService[] = useDocument<FinancialProfessionalStream>(
      (document) => document?.c_servicesOffered?.servicesOptions || []
    );

    const isEditor = useEnvironment();

    if (!services || services.length === 0) {
      if (isEditor) {
        return (
          <ServicesSkeleton
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
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {sectionTitle}
        </h2>
        <Carousel>
          <CarouselContent>
            {services.map((service) => (
              <CarouselItem
                className="basis-3/ md:basis-1/2 lg:basis-1/3"
                key={service.id}
              >
                <ServiceCard service={service} />
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

interface ServicesSkeletonProps {
  backgroundColor: string;
  sectionTitle: string;
}

const ServicesSkeleton = ({
  backgroundColor,
  sectionTitle,
}: ServicesSkeletonProps) => {
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
