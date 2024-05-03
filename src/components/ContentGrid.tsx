import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { useDocument } from "../hooks/useDocument";
import {
  FinancialProfessionalStream,
  ContentGrid as ContentGridType,
} from "../types/autogen";

import { Section } from "./Section";

import { AdvisorCard } from "./cards/AdvisorCard";
import { backgroundColors } from "../puck/theme";
import { cn } from "../utils/cn";

export type ContentGridProps = {
  // content: "services" | "events";
  backgroundColor: string;
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
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
  },
  render: ({ backgroundColor }) => {
    // TODO: ask team about types
    const contentGrid: ContentGridType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentGrid
      );

    const contentGridItems = contentGrid?.financialProfessionals || [];

    // TODO: add placeholder for null content value
    return (
      <Section
        className={cn(
          "grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          backgroundColor
        )}
      >
        {contentGridItems.map((item) => (
          <AdvisorCard key={item.id} advisor={item} />
        ))}
      </Section>
    );
  },
};
