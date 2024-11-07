import { Link, LinkType } from "@yext/pages-components";
import { cn } from "../../utils/cn";

export interface YextCTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  link: string;
  linkType: LinkType;
  eventName?: string;
  obfuscate?: boolean;
  scope?: string;
  currency?: string;
  amount?: number;
}

const YextCTA = ({
  label,
  link,
  className,
  linkType,
  eventName,
  obfuscate,
  scope,
  currency,
  amount,
}: YextCTAProps) => {
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
        eventName={eventName}
        obfuscate={obfuscate}
        scope={scope}
        currency={currency}
        amount={amount}
      />
    </button>
  );
};

YextCTA.displayName = "YextCTA";

export { YextCTA };
