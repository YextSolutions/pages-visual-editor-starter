import { Link, LinkType } from "@yext/pages-components";
import { cn } from "../../utils/cn";

export interface YextCTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  link: string;
  linkType: LinkType;
}

const YextCTA = ({ label, link, className, linkType }: YextCTAProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 bg-red-500 text-white p-4 rounded-md",
        className
      )}
    >
      <Link
        cta={{
          label,
          link: link ?? "",
          linkType: linkType ?? "URL",
        }}
      />
    </button>
  );
};

YextCTA.displayName = "YextCTA";

export { YextCTA };
