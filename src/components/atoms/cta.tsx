import { Link, LinkType } from "@yext/pages-components";
import { Button, ButtonProps } from "./button";

export interface CTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  link: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  linkType: LinkType;
}

const CTA = ({ label, link, variant, size, className, linkType }: CTAProps) => {
  return (
    <Button asChild className={className} variant={variant} size={size}>
      <Link
        cta={{
          label,
          link: link ?? "",
          linkType: linkType ?? "URL",
        }}
      />
    </Button>
  );
};

CTA.displayName = "CTA";

export { CTA };
