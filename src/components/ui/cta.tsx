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
      <a href={url}>{label}</a>
    </Button>
  );
};

CTA.displayName = "CTA";

export { CTA };
