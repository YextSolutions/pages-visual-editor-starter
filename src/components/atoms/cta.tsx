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
  const labelText = [
    linkType && `linkType: ${linkType}`,
    eventName && `eventName: ${eventName}`,
    obfuscate !== undefined && `obfuscate: ${obfuscate}`,
    scope && `scope: ${scope}`,
    currency && `currency: ${currency}`,
    amount !== undefined && `amount: ${amount}`,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <button
      className={cn(
        "flex items-center gap-2 bg-red-500 text-white p-4 rounded-md",
        className
      )}
    >
      <Link
        cta={{
          label: labelText,
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
