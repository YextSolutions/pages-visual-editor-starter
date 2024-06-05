import { ComponentConfig, DropZone } from "@measured/puck";
import { useRef } from "react";

export type BodyContainerProps = {
  additionalSpacing: "gap-y-0" | "gap-y-4" | "gap-y-8" | "gap-y-12";
  sections: {
    title: string;
  }[];
};

export const BodyContainer: ComponentConfig<BodyContainerProps> = {
  fields: {
    additionalSpacing: {
      type: "radio",
      label: "Additional Spacing",
      options: [
        { label: "None", value: "gap-y-0" },
        { label: "Small", value: "gap-y-8" },
        { label: "Medium", value: "gap-y-16" },
        { label: "Large", value: "gap-y-24" },
      ],
    },
    sections: {
      label: "Sections",
      type: "array",
      getItemSummary: (col) => col.title,
      arrayFields: {
        title: {
          label: "Section Title",
          type: "text",
        },
      },
    },
  },
  defaultProps: {
    additionalSpacing: "gap-y-0",
    sections: [
      {
        title: "Column 1",
      },
      {
        title: "Column 2",
      },
    ],
  },
  render: ({ additionalSpacing, sections }) => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleNavClick = (index: number) => {
      const ref = sectionRefs.current[index];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth" });
      }
    };

    return (
      <div className={`flex flex-col ${additionalSpacing}`}>
        <div className="py-4 border-b-2 border-gray-50 justify-center items-center gap-16 inline-flex">
          {sections.map(({ title }, idx) => (
            <div
              key={idx}
              className="text-blue-950 text-base font-bold leading-[30px] cursor-pointer"
              onClick={() => handleNavClick(idx)}
            >
              {title}
            </div>
          ))}
        </div>
        {sections.map((_section, idx) => (
          <div
            key={idx}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
          >
            <DropZone
              zone={`section-${idx}`}
              allow={[
                "AdvisorBio",
                "ContentGrid",
                "FeaturedBlogs",
                "Locator",
                "Columns",
                "Services",
              ]}
            />
          </div>
        ))}
      </div>
    );
  },
};
