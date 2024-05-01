import { cn } from "../utils/cn";

export interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const Section = ({ children, className }: SectionProps) => {
  return (
    <div
      className={cn(
        "container mx-auto px-4 py-24 gap-x-12 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
