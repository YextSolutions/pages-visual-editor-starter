import * as React from "react";
import { Link } from "@yext/pages-components";
import { Button, ButtonProps } from "./button.js";

export interface CTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  link?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  borderRadius?: ButtonProps["borderRadius"];
  fontSize?: ButtonProps["fontSize"];
}

const CTA = ({
  label,
  link,
  variant,
  size,
  borderRadius,
  className,
  fontSize = "default",
}: CTAProps) => {
  return (
    <Button
      asChild
      className={className}
      variant={variant}
      size={size}
      borderRadius={borderRadius}
      fontSize={fontSize}
    >
      <Link href={link ?? ""}>{label}</Link>
    </Button>
  );
};

CTA.displayName = "CTA";

export { CTA };
