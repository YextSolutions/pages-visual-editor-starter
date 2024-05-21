import { ComponentConfig, DropZone } from "@measured/puck";
import { useRef } from "react";

export type BodyContainerProps = {
  sections: {
    title: string;
  }[];
};

export const BodyContainer: ComponentConfig<BodyContainerProps> = {
  fields: {
    sections: {
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
    sections: [
      {
        title: "Column 1",
      },
      {
        title: "Column 2",
      },
    ],
  },
  render: ({ sections }) => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleNavClick = (index: number) => {
      const ref = sectionRefs.current[index];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth" });
      }
    };

    return (
      <div className="flex flex-col">
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
