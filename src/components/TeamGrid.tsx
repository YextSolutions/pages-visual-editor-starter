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
import { SectionTitle, SectionTitleProps } from "./ui/sectionTitle";

export type TeamGridProps = {
  sectionTitle?: SectionTitleProps;
  backgroundColor: string;
};

export const TeamGrid: ComponentConfig<TeamGridProps> = {
  label: "Team Grid",
  fields: {
    // content: {
    //   label: "Content",
    //   type: "select",
    //   options: contentOptions,
    // },
    sectionTitle: {
      type: "object",
      label: "Section Title",
      objectFields: {
        title: { type: "text", label: "Title" },
        align: {
          type: "radio",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "radio",
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
      },
    },
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
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
    const contentGrid: ContentGridType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_contentGrid
      );

    const contentGridItems = contentGrid?.financialProfessionals || [];

    const isEditor = useEnvironment();

    if (!contentGrid) {
      if (isEditor) {
        return (
          <TeamGridSkeleton
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
        <SectionTitle {...sectionTitle} />
        <div className="grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contentGridItems.map((item) => (
            <AdvisorCard key={item.id} advisor={item} />
          ))}
        </div>
      </Section>
    );
  },
};

interface TeamGridSkeletonProps {
  backgroundColor: string;
  sectionTitle?: SectionTitleProps;
}

const TeamGridSkeleton = ({
  backgroundColor,
  sectionTitle,
}: TeamGridSkeletonProps) => {
  return (
    <Section className="flex flex-col">
      <SectionTitle {...sectionTitle} />
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
