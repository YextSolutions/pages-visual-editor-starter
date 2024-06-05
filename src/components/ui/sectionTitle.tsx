import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Field } from "@measured/puck";

const titleVariants = cva("text-blue-950 font-bold mb-8", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    size: {
      lg: "text-5xl leading-[64px]",
      md: "text-[34px] leading-10",
      sm: "text-2xl leading-10",
    },
  },
});

const sectionTitleFieldConfig: Field<SectionTitleProps> = {
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
};

export interface SectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  title?: string;
}

const SectionTitle = ({ title, align, size, className }: SectionTitleProps) => {
  return (
    <h3 className={cn(titleVariants({ align, size, className }))}>{title}</h3>
  );
};

SectionTitle.displayName = "SectionTitle";

export { SectionTitle, titleVariants, sectionTitleFieldConfig };
