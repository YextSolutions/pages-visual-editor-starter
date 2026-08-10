// @ts-nocheck
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { PuckComponent, setDeep, Slot } from "@puckeditor/core";
import { msg } from "@yext/visual-editor/section-library-support";
import { getMaxWidthOptions } from "@yext/visual-editor/section-library-support";
import { PageSectionProps } from "../atoms/pageSection";
import { cva } from "class-variance-authority";
import { defaultPrimaryHeaderProps } from "./PrimaryHeaderSlot";
import { defaultSecondaryHeaderProps } from "./SecondaryHeaderSlot";
import { ExpandedHeaderMenuProvider } from "./ExpandedHeaderMenuContext";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export const headerWrapper = cva("flex flex-col", {
  variants: {
    position: {
      // We use 'sticky' for fixed so that content does not overlap at the top of the page
      fixed: "sticky top-0 z-50",
      scrollsWithPage: "",
    },
  },
  defaultVariants: {
    position: "scrollsWithPage",
  },
});

export interface ExpandedHeaderStyles {
  /** The maximum width of the header */
  maxWidth: PageSectionProps["maxWidth"];
  /** Whether the header is fixed to the top of the page or not */
  headerPosition: "fixed" | "scrollsWithPage";
}

export interface ExpandedHeaderProps {
  /**
   * This object contains properties for customizing the appearance of both header tiers.
   * @propCategory Style Props
   */
  styles: ExpandedHeaderStyles;

  /** @internal */
  slots: {
    PrimaryHeaderSlot: Slot;
    SecondaryHeaderSlot: Slot;
  };

  /** @internal */
  analytics: {
    scope?: string;
  };

  /**
   * Indicates which props should not be checked for missing translations.
   * @internal
   */
  ignoreLocaleWarning?: string[];
}

const expandedHeaderSectionFields: YextFields<ExpandedHeaderProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      maxWidth: {
        type: "basicSelector",
        label: msg("fields.maxWidth", "Max Width"),
        disableSearch: true,
        optionGroups: [
          {
            description: msg(
              "maxWidthTip",
              "For optimal content alignment, we recommend setting the header and footer width to match or exceed the page content grid."
            ),
            options: getMaxWidthOptions(),
          },
        ],
      },
      headerPosition: {
        label: msg("fields.headerPosition", "Header Position"),
        type: "radio",
        options: [
          {
            label: msg("fields.options.scrollsWithPage", "Scrolls with Page"),
            value: "scrollsWithPage",
          },
          { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
        ],
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      PrimaryHeaderSlot: { type: "slot", allow: [] },
      SecondaryHeaderSlot: { type: "slot", allow: [] },
    },
    visible: false,
  },
  analytics: {
    type: "object",
    label: msg("fields.analytics", "Analytics"),
    visible: false,
    objectFields: {
      scope: {
        label: msg("fields.scope", "Scope"),
        type: "text",
      },
    },
  },
};

const ExpandedHeaderWrapper: PuckComponent<ExpandedHeaderProps> = ({
  styles,
  slots,
}) => {
  return (
    <ExpandedHeaderMenuProvider>
      <header className={headerWrapper({ position: styles.headerPosition })}>
        {/* Secondary Header (Top Bar) */}
        <div className="hidden md:flex">
          <slots.SecondaryHeaderSlot
            style={{ height: "auto", width: "100%" }}
          />
        </div>

        {/* Primary Header w/ nav bar */}
        <slots.PrimaryHeaderSlot
          style={{ height: "auto", position: "relative" }}
        />
      </header>
    </ExpandedHeaderMenuProvider>
  );
};

/**
 * The Expanded Header is a two-tiered component for websites with complex navigation needs. It consists of a primary header for the main logo, navigation links, and calls-to-action, plus an optional secondary "top bar" for utility links (like "Contact Us" or "Log In") and a language selector.
 * Available on Location templates.
 */
export const ExpandedHeader: YextComponentConfig<ExpandedHeaderProps> = {
  label: msg("components.expandedHeader", "Expanded Header"),
  fields: expandedHeaderSectionFields,
  defaultProps: {
    styles: {
      maxWidth: "theme",
      headerPosition: "scrollsWithPage",
    },
    slots: {
      PrimaryHeaderSlot: [
        {
          type: "PrimaryHeaderSlot",
          props: defaultPrimaryHeaderProps,
        },
      ],
      SecondaryHeaderSlot: [
        {
          type: "SecondaryHeaderSlot",
          props: defaultSecondaryHeaderProps,
        },
      ],
    },
    analytics: {
      scope: "expandedHeader",
    },
  },
  resolveData: (data) => {
    // Determine which fields to add to ignoreLocaleWarning
    const hiddenProps: string[] = [];

    if (!data.props.slots.SecondaryHeaderSlot[0]?.props.data.show) {
      hiddenProps.push("slots.SecondaryHeaderSlot");
    }

    if (
      !data.props.slots.PrimaryHeaderSlot[0]?.props.slots.PrimaryCTASlot[0]
        ?.props.data.show
    ) {
      hiddenProps.push("slots.PrimaryHeaderSlot[0].props.slots.PrimaryCTASlot");
    }

    if (
      !data.props.slots.PrimaryHeaderSlot[0]?.props.slots.SecondaryCTASlot[0]
        ?.props.data.show
    ) {
      hiddenProps.push(
        "slots.PrimaryHeaderSlot[0].props.slots.SecondaryCTASlot"
      );
    }

    // Ensure maxWidth is passed down to header slots
    if (
      data.props.slots.PrimaryHeaderSlot[0]?.props.parentStyles?.maxWidth !==
      data.props.styles.maxWidth
    ) {
      data = setDeep(
        data,
        "props.slots.PrimaryHeaderSlot[0].props.parentValues.maxWidth",
        data.props.styles.maxWidth
      );
    }

    if (
      data.props.slots.SecondaryHeaderSlot[0]?.props.parentStyles?.maxWidth !==
      data.props.styles.maxWidth
    ) {
      data = setDeep(
        data,
        "props.slots.SecondaryHeaderSlot[0].props.parentStyles.maxWidth",
        data.props.styles.maxWidth
      );
    }

    // Ensure SecondaryHeaderSlot is passed down to PrimaryHeaderSlot's parentValues
    if (
      data.props.slots.PrimaryHeaderSlot[0]?.props.parentValues
        ?.SecondaryHeaderSlot !== data.props.slots.SecondaryHeaderSlot
    ) {
      data = setDeep(
        data,
        "props.slots.PrimaryHeaderSlot[0].props.parentValues.SecondaryHeaderSlot",
        data.props.slots.SecondaryHeaderSlot as Slot
      );
    }

    return {
      ...data,
      props: {
        ...data.props,
        ignoreLocaleWarning: hiddenProps,
      },
    };
  },
  render: (props) => (
    <AnalyticsScopeProvider name={props.analytics?.scope ?? "expandedHeader"}>
      <ExpandedHeaderWrapper {...props} />
    </AnalyticsScopeProvider>
  ),
};
