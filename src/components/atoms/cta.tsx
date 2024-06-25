import { Link } from "@yext/pages-components";
import { Button, ButtonProps } from "./button";

export interface CTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  url?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

const CTA = ({ label, url, variant, size, className }: CTAProps) => {
  return (
    <Button asChild className={className} variant={variant} size={size}>
      <Link href={url}>{label}</Link>
    </Button>
  );
};

CTA.displayName = "CTA";

export { CTA };
