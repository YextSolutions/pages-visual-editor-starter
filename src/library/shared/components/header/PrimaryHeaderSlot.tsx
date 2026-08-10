// @ts-nocheck
import {
  PuckComponent,
  registerOverlayPortal,
  Slot,
  SlotComponent,
} from "@puckeditor/core";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { CTAWrapperProps } from "../contentBlocks/CtaWrapper";
import { TranslatableCTA } from "@yext/visual-editor/section-library-support";
import { ImageWrapperProps } from "../contentBlocks/image/Image";
import { msg } from "@yext/visual-editor/section-library-support";
import { PageSection, PageSectionProps } from "../atoms/pageSection";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useOverflow } from "@yext/visual-editor/section-library-support";
import { usePreviewWindow } from "@yext/visual-editor/section-library-support";
import { getViewport } from "@yext/visual-editor/section-library-support";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { defaultHeaderLinkProps, HeaderLinksProps } from "./HeaderLinks";
import {
  HeaderLinksDisplayModeProvider,
  useExpandedHeaderMenu,
} from "./ExpandedHeaderMenuContext";
import { SlidePanel } from "./SlidePanel";
import { type YextCTAField } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const HAMBURGER_RESERVE_PX = 48;

export interface PrimaryHeaderSlotProps {
  styles: {
    backgroundColor?: ThemeColor;
  };

  /** @internal values that come from the parent ExpandedHeader */
  parentValues?: {
    maxWidth?: PageSectionProps["maxWidth"];
    SecondaryHeaderSlot: Slot;
  };

  /** @internal */
  conditionalRender?: {
    navContent: boolean;
    CTAs: boolean;
    hasLogoImage?: boolean;
  };

  /** @internal */
  slots: {
    PrimaryCTASlot: Slot;
    SecondaryCTASlot: Slot;
    LogoSlot: Slot;
    LinksSlot: Slot;
  };
}

const primaryHeaderSlotFields: YextFields<PrimaryHeaderSlotProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      PrimaryCTASlot: { type: "slot", allow: [] },
      SecondaryCTASlot: { type: "slot", allow: [] },
      LogoSlot: { type: "slot", allow: [] },
      LinksSlot: { type: "slot", allow: [] },
    },
    visible: false,
  },
  parentValues: {
    type: "object",
    objectFields: {
      SecondaryHeaderSlot: { type: "slot", allow: [] },
    },
    visible: false,
  },
};

type CTAContainerProps = {
  showCTAs: boolean;
  showHamburger: boolean;
  PrimaryCTASlot: SlotComponent;
  SecondaryCTASlot: SlotComponent;
};

const CTAContainer: React.FC<CTAContainerProps> = (props) => {
  const { showCTAs, PrimaryCTASlot, SecondaryCTASlot, showHamburger } = props;

  if (!showCTAs) {
    return null;
  }

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 md:gap-2 md:items-center ${showHamburger ? "mr-8" : ""}`}
    >
      <PrimaryCTASlot style={{ height: "auto" }} />
      <SecondaryCTASlot style={{ height: "auto" }} />
    </div>
  );
};

const PrimaryHeaderSlotWrapper: PuckComponent<PrimaryHeaderSlotProps> = ({
  styles,
  slots,
  parentValues,
  conditionalRender,
  puck,
}) => {
  const { t } = useTranslation();
  const previewWindow = usePreviewWindow();
  const menuContext = useExpandedHeaderMenu();

  const headerRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = React.useRef<HTMLButtonElement>(null);

  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [layout, setLayout] = React.useState({
    viewportWidth: previewWindow?.innerWidth ?? 1024,
    panelTop: 0,
    panelHeight: 0,
  });

  const handleCloseMenu = React.useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const showCTAs = puck.isEditing || conditionalRender?.CTAs;
  const showNavContent = puck.isEditing || conditionalRender?.navContent;
  const { isTablet, isDesktop } = getViewport(layout.viewportWidth);

  const primaryOverflow = useOverflow(
    containerRef,
    contentRef,
    showNavContent ? HAMBURGER_RESERVE_PX : 0
  );

  const primaryHasCollapsedLinks =
    menuContext?.primaryHasCollapsedLinks ?? false;
  const secondaryOverflow = menuContext?.secondaryOverflow ?? false;
  const showHamburger =
    primaryOverflow || primaryHasCollapsedLinks || secondaryOverflow;
  const hasExtraMargin =
    showHamburger && (isDesktop || isTablet) && !primaryOverflow && !showCTAs;

  // Handles resizing, scrolling, and panel positioning in one place.
  React.useLayoutEffect(() => {
    const win = previewWindow || window;
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateLayout = () => {
      const rect = header.getBoundingClientRect();
      setLayout({
        viewportWidth: rect.width || win.innerWidth,
        panelTop: rect.bottom,
        panelHeight: Math.max(0, win.innerHeight - rect.bottom),
      });
    };

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(header);
    win.addEventListener("resize", updateLayout);
    win.addEventListener("scroll", updateLayout, { passive: true });

    updateLayout();

    return () => {
      resizeObserver.disconnect();
      win.removeEventListener("resize", updateLayout);
      win.removeEventListener("scroll", updateLayout);
    };
  }, [previewWindow, isMobileMenuOpen]); // Re-sync when menu opens to ensure panel snaps to header

  // Puck portal registration for the hamburger button
  React.useEffect(
    () => registerOverlayPortal(hamburgerButtonRef.current),
    [hamburgerButtonRef.current]
  );

  // Sync overflow state with parent context
  React.useEffect(() => {
    menuContext?.setPrimaryOverflow(primaryOverflow);
    return () => menuContext?.setPrimaryOverflow(false);
  }, [menuContext, primaryOverflow]);

  // Auto-close menu when overflow disappears
  React.useEffect(() => {
    if (
      puck.isEditing &&
      !showHamburger &&
      isMobileMenuOpen &&
      layout.viewportWidth > 360
    ) {
      setMobileMenuOpen(false);
    }
  }, [puck.isEditing, showHamburger, isMobileMenuOpen, layout.viewportWidth]);

  const LogoSlot = (
    <div
      className="flex-shrink-0"
      style={{
        minHeight: conditionalRender?.hasLogoImage ? undefined : "100px",
      }}
    >
      <slots.LogoSlot style={{ height: "auto", width: "auto" }} />
    </div>
  );

  // Header links rendered inline within the header bar.
  const NavContent = (
    <HeaderLinksDisplayModeProvider value="inline">
      <slots.LinksSlot style={{ height: "auto" }} />
    </HeaderLinksDisplayModeProvider>
  );

  const renderMenuContent = (variant: "mobile" | "tablet" | "desktop") => {
    const showCtasInMenu = variant === "mobile";
    const showSecondaryInMenu = variant === "mobile" || secondaryOverflow;

    return (
      <>
        <PageSection
          verticalPadding={"sm"}
          background={styles.backgroundColor}
          maxWidth={parentValues?.maxWidth}
        >
          <HeaderLinksDisplayModeProvider value="menu">
            <slots.LinksSlot style={{ height: "auto" }} />
          </HeaderLinksDisplayModeProvider>
        </PageSection>

        {/* Secondary Header (Menu) */}
        {parentValues && (
          <HeaderLinksDisplayModeProvider value="menu">
            <div className={showSecondaryInMenu ? "flex" : "flex md:hidden"}>
              <parentValues.SecondaryHeaderSlot
                style={{ height: "auto", width: "100%" }}
              />
            </div>
          </HeaderLinksDisplayModeProvider>
        )}

        {showCTAs && showCtasInMenu && (
          <PageSection
            verticalPadding={"sm"}
            background={styles.backgroundColor}
            maxWidth={parentValues?.maxWidth}
          >
            <div className={`flex flex-col gap-4`}>
              <slots.PrimaryCTASlot style={{ height: "auto" }} />
              <slots.SecondaryCTASlot style={{ height: "auto" }} />
            </div>
          </PageSection>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col" ref={headerRef}>
        <PageSection
          maxWidth={parentValues?.maxWidth}
          verticalPadding={"header"}
          background={styles.backgroundColor}
          className="flex flex-row justify-between w-full items-center gap-8"
        >
          <div className="block">{LogoSlot}</div>
          {/* Desktop Navigation & Mobile Hamburger */}
          {showNavContent && (
            <div
              className="flex-grow flex justify-end items-center min-w-0"
              ref={containerRef}
            >
              {/* 1. The "Measure" Div: Always rendered but visually hidden. */}
              {/* Its width is our source of truth. */}
              <div
                ref={contentRef}
                className="flex items-center gap-8 h-0 opacity-0 pointer-events-none absolute top-0 left-[-9999px] invisible"
                aria-hidden="true"
              >
                <div>{NavContent}</div>
                <CTAContainer
                  showCTAs={!!showCTAs}
                  showHamburger={showHamburger}
                  PrimaryCTASlot={slots.PrimaryCTASlot}
                  SecondaryCTASlot={slots.SecondaryCTASlot}
                />
              </div>

              {/* 2. The "Render" Div: Conditionally shown or hidden based on the measurement. */}
              <div className="hidden md:flex items-center gap-8">
                {!primaryOverflow && <div>{NavContent}</div>}
                <CTAContainer
                  showCTAs={!!showCTAs}
                  showHamburger={showHamburger}
                  PrimaryCTASlot={slots.PrimaryCTASlot}
                  SecondaryCTASlot={slots.SecondaryCTASlot}
                />
              </div>

              {/* Hamburger Button - Shown when nav overflows or on small screens */}
              <button
                ref={hamburgerButtonRef}
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={
                  isMobileMenuOpen
                    ? t("closeMenu", "Close menu")
                    : t("openMenu", "Open menu")
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className={`text-xl z-10 ${showHamburger ? "md:block" : "md:hidden"} 
                ${hasExtraMargin ? "ml-8" : ""}`}
              >
                {isMobileMenuOpen ? (
                  <FaTimes size="1.5rem" />
                ) : (
                  <FaBars size="1.5rem" />
                )}
              </button>
            </div>
          )}
        </PageSection>
      </div>

      {/* Mobile Menu Panel (Flyout) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={`absolute left-0 top-full w-full z-50 transition-all duration-300 ease-in-out md:hidden lg:block ${
            isMobileMenuOpen
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {renderMenuContent(isDesktop ? "desktop" : "mobile")}
        </div>
      )}

      {/* Tablet slide-out menu */}
      {isTablet && (
        <div className="hidden md:block lg:hidden">
          <SlidePanel
            isOpen={isMobileMenuOpen}
            onClose={handleCloseMenu}
            top={layout.panelTop}
            height={layout.panelHeight}
            previewWindow={previewWindow}
          >
            {renderMenuContent("tablet")}
          </SlidePanel>
        </div>
      )}
    </>
  );
};

export const defaultPrimaryHeaderProps: PrimaryHeaderSlotProps = {
  styles: {
    backgroundColor: backgroundColors.background1.value,
  },
  slots: {
    LogoSlot: [
      {
        type: "ImageSlot",
        props: {
          data: {
            image: {
              field: "",
              constantValue: {
                // Placeholder logo, uploaded to account 4174974
                url: "https://a.mktgcdn.com/p/wa83C1O1lvtxHI9cGqEdP2HILyUzbD0jvtzwWpOAJfE/196x196.jpg",
                height: 100,
                width: 100,
              },
              constantValueEnabled: true,
            },
          },
          styles: {
            aspectRatio: 1,
            width: 100,
          },
        } satisfies ImageWrapperProps,
      },
    ],
    LinksSlot: [
      {
        type: "HeaderLinks",
        props: {
          ...defaultHeaderLinkProps,
          parentData: {
            type: "Primary",
          },
        } satisfies HeaderLinksProps,
      },
    ],
    PrimaryCTASlot: [
      {
        type: "CTASlot",
        props: {
          data: {
            show: true,
            actionType: "link",
            normalizeLink: true,
            buttonText: { defaultValue: "Button" },
            entityField: {
              field: "",
              constantValue: {
                label: { defaultValue: "Call to Action" },
                link: { defaultValue: "#" },
                linkType: "URL",
                ctaType: "textAndLink",
              },
              constantValueEnabled: true,
            },
          },
          styles: {
            variant: "primary",
            presetImage: "app-store",
          },
          eventName: "primaryCta",
        } satisfies CTAWrapperProps,
      },
    ],
    SecondaryCTASlot: [
      {
        type: "CTASlot",
        props: {
          data: {
            show: true,
            actionType: "link",
            normalizeLink: true,
            buttonText: { defaultValue: "Button" },
            entityField: {
              field: "",
              constantValue: {
                label: { defaultValue: "Call to Action" },
                link: { defaultValue: "#" },
                linkType: "URL",
                ctaType: "textAndLink",
              },
              constantValueEnabled: true,
            },
          },
          styles: {
            variant: "secondary",
            presetImage: "app-store",
          },
          eventName: "secondaryCta",
        } satisfies CTAWrapperProps,
      },
    ],
  },
};

export const PrimaryHeaderSlot: YextComponentConfig<PrimaryHeaderSlotProps> = {
  label: msg("components.primaryHeader", "Primary Header"),
  fields: primaryHeaderSlotFields,
  resolveData: (data, params) => {
    const streamDocument = params.metadata.streamDocument;
    const locale = streamDocument?.locale ?? "en";

    if (!streamDocument || !locale) {
      return data;
    }

    const logoSlotItem = data.props.slots.LogoSlot?.[0];

    const hasLogoImage =
      logoSlotItem?.type === "ImageSlot" &&
      !!(
        logoSlotItem?.props?.data?.image?.constantValue ||
        logoSlotItem?.props?.data?.image?.field
      );

    // Check if PrimaryCTA has data to display
    const primaryCTA = resolveComponentData(
      data.props.slots.PrimaryCTASlot[0]?.props.data
        .entityField as YextCTAField,
      locale,
      streamDocument
    );
    const showPrimaryCTA: boolean =
      data.props.slots.PrimaryCTASlot[0]?.props.data.show &&
      !!primaryCTA?.label &&
      !!primaryCTA?.link;

    const secondaryCTA = resolveComponentData(
      data.props.slots.SecondaryCTASlot[0]?.props.data
        .entityField as YextCTAField,
      locale,
      streamDocument
    );
    const showSecondaryCTA: boolean =
      data.props.slots.SecondaryCTASlot[0]?.props.data.show &&
      !!secondaryCTA?.label &&
      !!secondaryCTA?.link;

    const showNavContent: boolean =
      showPrimaryCTA ||
      showSecondaryCTA ||
      !!data.props.slots.LinksSlot?.[0]?.props.data.links?.some(
        (l: TranslatableCTA) => l.label && l.link
      ) ||
      !!(
        data.props.parentValues?.SecondaryHeaderSlot?.[0]?.props.data.show &&
        data.props.parentValues?.SecondaryHeaderSlot?.[0]?.props.data.links?.some(
          (l: TranslatableCTA) => l.label && l.link
        )
      );

    return {
      ...data,
      props: {
        ...data.props,
        conditionalRender: {
          navContent: showNavContent,
          CTAs: showPrimaryCTA || showSecondaryCTA,
          hasLogoImage,
        },
      },
    };
  },
  defaultProps: defaultPrimaryHeaderProps,
  render: (props) => <PrimaryHeaderSlotWrapper {...props} />,
};
