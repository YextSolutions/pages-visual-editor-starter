// @ts-nocheck
import * as React from "react";
import { Slot, PuckComponent, setDeep } from "@puckeditor/core";
import { msg } from "@yext/visual-editor/section-library-support";
import { ThemeColor, ThemeOptions } from "@yext/visual-editor/section-library-support";
import { PageSection, PageSectionProps } from "../atoms/pageSection";
import { defaultCopyrightMessageSlotProps } from "./CopyrightMessageSlot";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const defaultLink = {
  linkType: "URL" as const,
  label: { defaultValue: "Footer Link" },
  link: "#",
  openInNewTab: false,
};

const defaultLinks = [
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
];

export interface SecondaryFooterSlotProps {
  /**
   * Styling configuration for the secondary footer.
   * @propCategory Style Props
   */
  styles: {
    backgroundColor?: ThemeColor;
    desktopContentAlignment: "left" | "center" | "right";
    mobileContentAlignment: "left" | "center" | "right";
    showLinks: boolean;
  };

  /** @internal */
  slots: {
    SecondaryLinksWrapperSlot: Slot;
    CopyrightSlot: Slot;
  };

  /** The maximum width inherited from parent. @internal */
  maxWidth?: PageSectionProps["maxWidth"];
}

const secondaryFooterSlotFields: YextFields<SecondaryFooterSlotProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      desktopContentAlignment: {
        label: msg(
          "fields.desktopContentAlignment",
          "Desktop Content Alignment"
        ),
        type: "radio",
        options: ThemeOptions.ALIGNMENT,
      },
      mobileContentAlignment: {
        label: msg("fields.mobileContentAlignment", "Mobile Content Alignment"),
        type: "radio",
        options: ThemeOptions.ALIGNMENT,
      },
      showLinks: {
        label: msg("fields.showLinks", "Show Links"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      SecondaryLinksWrapperSlot: { type: "slot" },
      CopyrightSlot: { type: "slot" },
    },
    visible: false,
  },
  maxWidth: {
    type: "text",
    visible: false,
  },
};

const SecondaryFooterSlotWrapper: PuckComponent<SecondaryFooterSlotProps> = ({
  styles,
  slots,
  maxWidth = "theme",
  puck,
}) => {
  const { backgroundColor } = styles;

  return (
    <PageSection
      ref={puck.dragRef}
      verticalPadding={"footerSecondary"}
      background={backgroundColor}
      maxWidth={maxWidth}
      className={`flex flex-col gap-5`}
    >
      {styles.showLinks && (
        <slots.SecondaryLinksWrapperSlot
          style={{ height: "auto" }}
          allow={[]}
        />
      )}
      <slots.CopyrightSlot style={{ height: "auto" }} allow={[]} />
    </PageSection>
  );
};

/**
 * The Secondary Footer Slot is a sub-section of the Expanded Footer that contains copyright information and secondary links.
 */
export const SecondaryFooterSlot: YextComponentConfig<SecondaryFooterSlotProps> =
  {
    label: msg("components.secondaryFooter", "Secondary Footer"),
    fields: secondaryFooterSlotFields,
    defaultProps: {
      styles: {
        desktopContentAlignment: "left",
        mobileContentAlignment: "left",
        showLinks: true,
      },
      slots: {
        SecondaryLinksWrapperSlot: [
          {
            type: "FooterLinksSlot",
            props: {
              data: {
                links: defaultLinks,
              },
              variant: "secondary",
              eventNamePrefix: "secondary",
              desktopContentAlignment: "left",
              mobileContentAlignment: "left",
            },
          },
        ],
        CopyrightSlot: [
          {
            type: "CopyrightMessageSlot",
            props: defaultCopyrightMessageSlotProps,
          },
        ],
      },
    },
    resolveData: async (data) => {
      let updatedData = { ...data };

      // Pass alignment to SecondaryLinksWrapperSlot based on parent styles
      if (data.props.slots?.SecondaryLinksWrapperSlot?.[0]?.props) {
        updatedData = setDeep(
          updatedData,
          "props.slots.SecondaryLinksWrapperSlot[0].props.desktopContentAlignment",
          data.props.styles.desktopContentAlignment
        );
        updatedData = setDeep(
          updatedData,
          "props.slots.SecondaryLinksWrapperSlot[0].props.mobileContentAlignment",
          data.props.styles.mobileContentAlignment
        );
      }

      // Pass alignment to CopyrightSlot based on parent styles
      if (data.props.slots?.CopyrightSlot?.[0]?.props) {
        updatedData = setDeep(
          updatedData,
          "props.slots.CopyrightSlot[0].props.desktopContentAlignment",
          data.props.styles.desktopContentAlignment
        );
        updatedData = setDeep(
          updatedData,
          "props.slots.CopyrightSlot[0].props.mobileContentAlignment",
          data.props.styles.mobileContentAlignment
        );
      }

      return updatedData;
    },
    inline: true,
    render: (props) => <SecondaryFooterSlotWrapper {...props} />,
  };
