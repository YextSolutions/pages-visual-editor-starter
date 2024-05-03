import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { useDocument } from "../hooks/useDocument";
import {
  FinancialProfessionalStream,
  ContentGrid as ContentGridType,
} from "../types/autogen";

import { Section } from "./Section";

import { AdvisorCard, AdvisorCardSkeleton } from "./cards/AdvisorCard";
import { backgroundColors } from "../puck/theme";
import { cn } from "../utils/cn";
import useEnvironment from "../hooks/useEnvironment";

export type ContentGridProps = {
  // content: "services" | "events";
  sectionTitle: string;
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
    sectionTitle: {
      label: "Section Title",
      type: "text",
    },
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
    sectionTitle: "Section",
  },
  render: ({ backgroundColor, sectionTitle }) => {
    // TODO: ask team about types
    const contentGrid: ContentGridType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentGrid
      );

    const contentGridItems = contentGrid?.financialProfessionals || [];

    const isEditor = useEnvironment();

    if (!contentGrid) {
      if (isEditor) {
        return (
          <ContentGridSkeleton
            backgroundColor={backgroundColor}
            sectionTitle={sectionTitle}
          />
        );
      } else {
        return <></>;
      }
    }

    // TODO: add placeholder for null content value
    return (
      <Section className={cn("flex flex-col", backgroundColor)}>
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {sectionTitle}
        </h2>
        <div className="grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contentGridItems.map((item) => (
            <AdvisorCard key={item.id} advisor={item} />
          ))}
        </div>
      </Section>
    );
  },
};

interface ContentGridSkeletonProps {
  backgroundColor: string;
  sectionTitle: string;
}

const ContentGridSkeleton = ({
  backgroundColor,
  sectionTitle,
}: ContentGridSkeletonProps) => {
  return (
    <Section className="flex flex-col">
      <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
        {sectionTitle}
      </h2>
      <div
        className={`grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${backgroundColor}`}
      >
        {/* Repeat placeholders for multiple advisors */}
        {Array.from({ length: 6 }).map((_, index) => (
          <AdvisorCardSkeleton key={index} />
        ))}
      </div>
    </Section>
  );
};
