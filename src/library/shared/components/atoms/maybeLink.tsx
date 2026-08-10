// @ts-nocheck
import * as React from "react";
import { CTAVariant, CTA } from "./cta";
import { ThemeColor } from "@yext/visual-editor/section-library-support";

export type MaybeLinkProps = {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  eventName?: string;
  variant?: CTAVariant;
  color?: ThemeColor;
  alwaysHideCaret?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
};

export const MaybeLink = (props: MaybeLinkProps) => {
  const {
    href,
    children,
    className,
    eventName,
    alwaysHideCaret,
    variant = "link",
    color,
    ariaLabel,
    disabled = false,
  } = props;

  if (href) {
    return (
      <CTA
        link={href}
        label={children}
        linkType="URL"
        normalizeLink={false}
        eventName={eventName}
        variant={variant}
        color={color}
        className={className}
        alwaysHideCaret={alwaysHideCaret}
        ariaLabel={ariaLabel}
        disabled={disabled}
      />
    );
  } else {
    return <span className={className}>{props.children}</span>;
  }
};
