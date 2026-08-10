// @ts-nocheck
import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, LinkType } from "@yext/pages-components";
import { Button, ButtonProps } from "./button";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { normalizeLink } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { FaAngleRight, FaExternalLinkAlt } from "react-icons/fa";
import { getDirections } from "@yext/pages-components";
import { PresetImageType, FOOD_DELIVERY_SERVICES } from "@yext/visual-editor/section-library-support";
import { presetImageIcons } from "@yext/visual-editor/section-library-support";
import {
  getThemeColorCssValue,
  getThemeColorHexValue,
  hexToRGB,
  isColorContrastWcagCompliant,
} from "@yext/visual-editor/section-library-support";

const LINK_TEXT_TRANSFORM_CSS_VAR =
  "var(--textTransform-link-textTransform)" as React.CSSProperties["textTransform"];
const BUTTON_TEXT_TRANSFORM_CSS_VAR =
  "var(--textTransform-button-textTransform)" as React.CSSProperties["textTransform"];

export type CTAProps = {
  // Core props
  label: React.ReactNode;
  ctaType?: "textAndLink" | "getDirections" | "presetImage";
  actionType?: "link" | "button";

  // ctaType specific props
  link?: string;
  linkType?: LinkType;
  normalizeLink: boolean;
  presetImageType?: PresetImageType;

  // button actionType specific props
  id?: string;
  dataAttributes?: Record<`data-${string}`, string>;

  // Styling and behavior props
  variant?: ButtonProps["variant"];
  className?: string;
  eventName?: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  alwaysHideCaret?: boolean;
  ariaLabel?: string;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => void;
  disabled?: boolean;
  color?: ThemeColor;
  openInNewTab?: boolean;
  /**
   * When true and variant is "link", applies vertical padding (py-3) to the CTA.
   * @defaultValue false
   */
  setPadding?: boolean;
};

/**
 * The different visual variants for CTA buttons.
 * "primary": the default button style. A button filled with the primary theme color.
 * "secondary": an outlined button style. A button with a border in the primary theme color and transparent background.
 * "link": a text link style. A button with no border or background, just a hyperlink in the link theme color.
 * "directoryLink": a text link style optimized for directory listings.
 * "headerFooterMainLink": a text link style optimized for main links in the header and footer.
 * "headerFooterSecondaryLink": a text link style optimized for secondary links in the header and footer.
 */
export type CTAVariant = ButtonProps["variant"];

/** Returns whether a CTA variant supports user-configurable color overrides. */
export const isCtaVariantWithColor = (variant?: CTAVariant): boolean =>
  variant === "primary" || variant === "secondary" || variant === "link";

const presetImageTypeToName = (presetImageType: PresetImageType) => {
  switch (presetImageType) {
    case "app-store":
      return "App Store";
    case "google-play":
      return "Google Play";
    case "galaxy-store":
      return "Galaxy Store";
    case "app-gallery":
      return "App Gallery";
    case "deliveroo":
      return "Deliveroo";
    case "doordash":
      return "DoorDash";
    case "grubhub":
      return "Grubhub";
    case "skip-the-dishes":
      return "Skip The Dishes";
    case "postmates":
      return "Postmates";
    case "uber-eats":
      return "Uber Eats";
    case "ezcater":
      return "ezCater";
    default:
      return presetImageType;
  }
};

// useResolvedCtaProps resolves the CTA props based on the current context and ctaType
const useResolvedCtaProps = (props: CTAProps) => {
  const {
    ctaType = "textAndLink",
    variant,
    className,
    alwaysHideCaret,
    ariaLabel,
    normalizeLink: shouldNormalizeLink,
  } = props;
  const { t } = useTranslation();
  const streamDocument = useDocument();
  const background = useBackground();

  const resolvedDynamicProps = useMemo(() => {
    const resolvedLink = shouldNormalizeLink
      ? normalizeLink(props.link, props.linkType)
      : (props.link ?? "");

    switch (ctaType) {
      case "getDirections": {
        const listings = streamDocument.ref_listings ?? [];
        const listingsLink = getDirections(
          undefined,
          listings,
          undefined,
          { provider: "google" },
          undefined
        );
        const coordinateLink = getDirections(
          undefined,
          undefined,
          undefined,
          { provider: "google" },
          streamDocument.yextDisplayCoordinate
        );
        // Prefer hardcoded link, then listings link, then coordinate link
        // User settable link props should not be used for get directions
        return {
          link: resolvedLink || listingsLink || coordinateLink || "#",
          linkType: "DRIVING_DIRECTIONS" as const,
          label: props.label || t("getDirections", "Get Directions"),
          ariaLabel: ariaLabel || t("getDirections", "Get Directions"),
        };
      }
      case "presetImage":
        if (!props.presetImageType) {
          return null;
        }

        let label = presetImageIcons[props.presetImageType];

        if (
          props.presetImageType &&
          (FOOD_DELIVERY_SERVICES as readonly string[]).includes(
            props.presetImageType
          ) &&
          React.isValidElement(label)
        ) {
          const buttonBackgroundColor = background?.isDarkColor
            ? "#FFFFFF"
            : "#F9F9F9";

          label = React.cloneElement(label as React.ReactElement, {
            backgroundColor: buttonBackgroundColor,
          });
        }

        return {
          link: resolvedLink || "#",
          linkType: props.linkType ?? "URL",
          label,
          ariaLabel:
            ariaLabel ||
            t("buttonWithIcon", `Button with {{presetImageType}} icon`, {
              presetImageType: presetImageTypeToName(props.presetImageType),
            }),
        };

      case "textAndLink":
      default:
        return {
          link: resolvedLink || "#",
          linkType: props.linkType ?? "URL",
          label: props.label,
          ariaLabel: ariaLabel ?? "",
        };
    }
  }, [props, streamDocument, background, shouldNormalizeLink, ariaLabel, t]);

  if (!resolvedDynamicProps) {
    return null;
  }

  const buttonVariant = ctaType === "presetImage" ? "link" : variant;

  const showCaret =
    !alwaysHideCaret &&
    ctaType !== "presetImage" &&
    variant === "link" &&
    resolvedDynamicProps.linkType !== "EMAIL" &&
    resolvedDynamicProps.linkType !== "PHONE";

  const buttonClassName = themeManagerCn(
    "flex",
    {
      // Let preset images determine their natural size - no forced width constraints
      "w-fit h-[51px] items-center justify-center": ctaType === "presetImage",
      // Special handling for food delivery services to give them more visual prominence
      "!w-auto":
        ctaType === "presetImage" &&
        props.presetImageType &&
        (FOOD_DELIVERY_SERVICES as readonly string[]).includes(
          props.presetImageType
        ),
    },
    className
  );

  return {
    ...resolvedDynamicProps,
    buttonVariant,
    buttonClassName,
    showCaret,
    background,
  };
};

export const CTA = (props: CTAProps) => {
  const {
    eventName,
    target,
    variant,
    ctaType,
    onClick,
    disabled = false,
    color,
    openInNewTab = false,
    setPadding = false,
    actionType = "link",
    id,
    dataAttributes,
  } = props;

  const { t } = useTranslation();
  const streamDocument = useDocument();
  const resolvedProps = useResolvedCtaProps(props);
  const isButton = actionType === "button";

  if (!resolvedProps) {
    return null;
  }

  const {
    link,
    linkType,
    label,
    ariaLabel,
    buttonVariant,
    buttonClassName,
    showCaret,
    background,
  } = resolvedProps;
  const isDarkBackground = background?.isDarkColor;
  const resolvedCtaColorHex = React.useMemo(
    () => getThemeColorHexValue(color?.selectedColor, streamDocument),
    [color?.selectedColor, streamDocument]
  );
  const resolvedBackgroundColorHex = React.useMemo(
    () => getThemeColorHexValue(background?.selectedColor, streamDocument),
    [background?.selectedColor, streamDocument]
  );
  const resolvedCtaColorRgb = resolvedCtaColorHex
    ? hexToRGB(resolvedCtaColorHex)
    : undefined;
  const resolvedBackgroundColorRgb = resolvedBackgroundColorHex
    ? hexToRGB(resolvedBackgroundColorHex)
    : undefined;
  const shouldUseConfiguredSecondaryColor =
    !!color?.selectedColor &&
    !!resolvedCtaColorHex &&
    (!isDarkBackground ||
      (!!resolvedCtaColorRgb &&
        !!resolvedBackgroundColorRgb &&
        isColorContrastWcagCompliant(
          resolvedCtaColorRgb,
          resolvedBackgroundColorRgb,
          12,
          400
        )));
  const dynamicStyle: React.CSSProperties = (() => {
    const bg = getThemeColorCssValue(color?.selectedColor);
    const textColor = getThemeColorCssValue(color?.contrastingColor);
    const border = bg;

    if (variant === "primary") {
      return {
        backgroundColor: bg,
        color: textColor,
        borderColor: border,
      };
    }

    if (
      variant === "secondary" &&
      (shouldUseConfiguredSecondaryColor || !isDarkBackground)
    ) {
      return {
        borderColor: border,
        color: border,
      };
    }

    if (
      variant === "link" ||
      variant === "directoryLink" ||
      variant === "headerFooterMainLink" ||
      variant === "headerFooterSecondaryLink"
    ) {
      return {
        color: bg,
      };
    }

    return {};
  })();
  const disabledStyle: React.CSSProperties = {
    ...(ctaType !== "presetImage" ? dynamicStyle : undefined),
    cursor: "default",
    pointerEvents: "auto",
  };

  const linkContent = (
    <>
      {label}
      {ctaType !== "presetImage" && (
        <FaAngleRight
          size="12px"
          // For directoryLink, the theme value for caret is ignored
          className={variant === "directoryLink" ? "block sm:hidden" : ""}
          // display does not support custom Tailwind utilities so the property must be set directly
          style={{
            display:
              variant === "directoryLink"
                ? undefined
                : showCaret
                  ? "var(--display-link-caret)"
                  : "none",
          }}
        />
      )}
    </>
  );

  if (disabled) {
    return (
      <Button
        type="button"
        className={buttonClassName}
        variant={buttonVariant}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          ...disabledStyle,
          textTransform: buttonVariant?.toLowerCase().includes("link")
            ? LINK_TEXT_TRANSFORM_CSS_VAR
            : BUTTON_TEXT_TRANSFORM_CSS_VAR,
        }}
      >
        {linkContent}
      </Button>
    );
  }

  const computedAriaLabel = isButton
    ? ariaLabel || undefined
    : openInNewTab && ariaLabel && ariaLabel.trim() !== ""
      ? t("aria.opensInNewTab", "{{label}} (opens in a new tab)", {
          label: ariaLabel,
        })
      : ariaLabel || undefined;

  const linkPadding: ButtonProps["linkPadding"] =
    buttonVariant === "link" && setPadding ? "yOnly" : "none";

  if (isButton) {
    return (
      <Button
        id={id}
        type="button"
        style={{
          ...(ctaType !== "presetImage" ? dynamicStyle : undefined),
          textTransform: buttonVariant?.toLowerCase().includes("link")
            ? LINK_TEXT_TRANSFORM_CSS_VAR
            : BUTTON_TEXT_TRANSFORM_CSS_VAR,
        }}
        className={buttonClassName}
        variant={buttonVariant}
        linkPadding={linkPadding}
        aria-label={computedAriaLabel}
        onClick={onClick}
        {...dataAttributes}
      >
        {linkContent}
      </Button>
    );
  }

  return (
    <Button
      style={ctaType !== "presetImage" ? dynamicStyle : undefined}
      asChild
      className={buttonClassName}
      variant={buttonVariant}
      linkPadding={linkPadding}
    >
      <Link
        cta={{ link: link || "#", linkType }}
        eventName={eventName}
        target={openInNewTab ? "_blank" : target}
        aria-label={computedAriaLabel}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        onClick={onClick}
        // textTransform has to be applied via styles because there is no custom tailwind utility
        style={{
          ...(ctaType !== "presetImage" ? dynamicStyle : undefined),
          // @ts-ignore: the css variable here resolves to a valid enum value
          textTransform: buttonVariant?.toLowerCase().includes("link")
            ? LINK_TEXT_TRANSFORM_CSS_VAR
            : BUTTON_TEXT_TRANSFORM_CSS_VAR,
        }}
      >
        {linkContent}
        {openInNewTab && (
          <FaExternalLinkAlt
            aria-hidden="true"
            className="inline-block ml-1 w-3 h-3 align-middle relative -top-px"
          />
        )}
      </Link>
    </Button>
  );
};
