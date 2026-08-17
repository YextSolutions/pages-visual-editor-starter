import * as React from "react";
import { PuckComponent, setDeep } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { CTA } from "@yext/visual-editor/section-library-support";
import { TranslatableCTA } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { defaultLink, defaultLinks } from "./ExpandedFooter";
import { isNonNormalizableLinkType } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export interface FooterLinksSlotProps {
  data: {
    links: TranslatableCTA[];
  };
  color?: ThemeColor;
  /** @internal */
  variant?: "primary" | "secondary";
  /** @internal */
  eventNamePrefix?: string;
  /** @internal */
  desktopContentAlignment?: "left" | "center" | "right";
  /** @internal */
  mobileContentAlignment?: "left" | "center" | "right";
}

const primaryFooterLinksSlotContainer = cva(
  "w-full grid grid-cols-1 gap-6 md:grid-cols-5",
  {
    variants: {
      isEditing: {
        true: "min-h-[30px]",
        false: "",
      },
      desktopContentAlignment: {
        left: "md:justify-items-start",
        center: "md:justify-items-center",
        right: "md:justify-items-end",
      },
      mobileContentAlignment: {
        left: "justify-items-start",
        center: "justify-items-center",
        right: "justify-items-end",
      },
    },
    defaultVariants: {
      isEditing: false,
      desktopContentAlignment: "left",
      mobileContentAlignment: "left",
    },
  }
);

const secondaryFooterLinksSlotContainer = cva(
  "w-full flex flex-col md:flex-row md:flex-wrap gap-5",
  {
    variants: {
      isEditing: {
        true: "min-h-[30px]",
        false: "",
      },
      desktopContentAlignment: {
        left: "md:justify-start",
        center: "md:justify-center",
        right: "md:justify-end",
      },
      mobileContentAlignment: {
        left: "items-start",
        center: "items-center",
        right: "items-end",
      },
    },
    defaultVariants: {
      isEditing: false,
      desktopContentAlignment: "left",
      mobileContentAlignment: "left",
    },
  }
);

const primaryLinkClassName = cva("block break-words whitespace-normal", {
  variants: {
    desktopContentAlignment: {
      left: "md:text-left",
      center: "md:text-center",
      right: "md:text-right",
    },
    mobileContentAlignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
  compoundVariants: [
    {
      desktopContentAlignment: "left",
      className: "md:justify-start",
    },
    {
      desktopContentAlignment: "center",
      className: "md:justify-center",
    },
    {
      desktopContentAlignment: "right",
      className: "md:justify-end",
    },
    {
      mobileContentAlignment: "left",
      className: "justify-start",
    },
    {
      mobileContentAlignment: "center",
      className: "justify-center",
    },
    {
      mobileContentAlignment: "right",
      className: "justify-end",
    },
  ],
});

const secondaryLinkClassName = cva(
  "flex-none max-w-full break-words whitespace-normal",
  {
    variants: {
      desktopContentAlignment: {
        left: "md:text-left",
        center: "md:text-center",
        right: "md:text-right",
      },
      mobileContentAlignment: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      desktopContentAlignment: "left",
      mobileContentAlignment: "left",
    },
  }
);

const FooterLinksSlotInternal: PuckComponent<FooterLinksSlotProps> = (
  props
) => {
  const {
    data,
    color,
    variant = "primary",
    eventNamePrefix = "footer",
    desktopContentAlignment = "left",
    mobileContentAlignment = "left",
    puck,
  } = props;
  const streamDocument = useDocument();
  const { i18n } = useTranslation();

  if (!data.links || data.links.length === 0) {
    return puck.isEditing ? <div className="h-10 min-w-[100px]" /> : <></>;
  }

  const links = data.links.map((linkData, index) => {
    const label = resolveComponentData(
      linkData.label,
      i18n.language,
      streamDocument
    );

    const link = resolveComponentData(
      linkData.link,
      i18n.language,
      streamDocument
    );

    return (
      <CTA
        key={index}
        link={link}
        label={label}
        linkType={linkData.linkType}
        variant={
          variant === "primary"
            ? "headerFooterMainLink"
            : "headerFooterSecondaryLink"
        }
        openInNewTab={linkData.openInNewTab}
        normalizeLink={
          isNonNormalizableLinkType(linkData.linkType)
            ? false
            : (linkData.normalizeLink ?? true)
        }
        color={color}
        eventName={`cta.${eventNamePrefix}.${index}-Link-${index + 1}`}
        className={(variant === "primary"
          ? primaryLinkClassName
          : secondaryLinkClassName)({
          desktopContentAlignment,
          mobileContentAlignment,
        })}
      />
    );
  });

  if (variant === "primary") {
    return (
      <div
        className={primaryFooterLinksSlotContainer({
          isEditing: puck.isEditing,
          desktopContentAlignment,
          mobileContentAlignment,
        })}
      >
        {links}
      </div>
    );
  }

  return (
    <div
      className={secondaryFooterLinksSlotContainer({
        isEditing: puck.isEditing,
        desktopContentAlignment,
        mobileContentAlignment,
      })}
    >
      {links}
    </div>
  );
};

const shouldShowNormalizeLinkField = (links?: TranslatableCTA[]) => {
  return (
    !links?.length ||
    links.some((link) => !isNonNormalizableLinkType(link?.linkType))
  );
};

const defaultFooterLinkProps: FooterLinksSlotProps = {
  data: {
    links: defaultLinks,
  },
  variant: "primary",
  desktopContentAlignment: "left",
  mobileContentAlignment: "left",
};

const footerLinksSlotFields: YextFields<FooterLinksSlotProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      links: {
        type: "array",
        label: msg("fields.links", "Links"),
        arrayFields: {
          linkType: {
            label: msg("fields.linkType", "Link Type"),
            type: "radio",
            options: [
              { label: msg("fields.options.url", "URL"), value: "URL" },
              {
                label: msg("fields.options.phone", "Phone"),
                value: "PHONE",
              },
              {
                label: msg("fields.options.email", "Email"),
                value: "EMAIL",
              },
            ],
          },
          label: {
            type: "translatableString",
            label: msg("fields.label", "Label"),
            filter: { types: ["type.string"] },
          },
          link: {
            label: msg("fields.link", "Link"),
            type: "text",
          },
          normalizeLink: {
            label: msg("fields.normalizeLink", "Normalize Link"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          openInNewTab: {
            label: msg("fields.openInNewTab", "Open in new tab"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
        defaultItemProps: defaultLink,
        getItemSummary: (item: any, index?: number) => {
          const locale = i18nComponentsInstance.language || "en";
          const label =
            typeof item.label === "string" ? item.label : item.label?.[locale];
          return label || pt("link", "Link") + " " + ((index ?? 0) + 1);
        },
      },
    },
  },
  color: {
    type: "basicSelector",
    label: msg("fields.color", "Color"),
    options: "SITE_COLOR",
  },
  variant: {
    type: "radio",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
    ],
    visible: false,
  },
  eventNamePrefix: {
    type: "text",
    visible: false,
  },
};

export const FooterLinksSlot: YextComponentConfig<FooterLinksSlotProps> = {
  label: msg("components.footerLinksSlot", "Links"),
  fields: footerLinksSlotFields,
  resolveFields: (data) =>
    setDeep(
      toPuckFields(footerLinksSlotFields),
      "data.objectFields.links.arrayFields.normalizeLink.visible",
      shouldShowNormalizeLinkField(data.props.data.links)
    ),
  defaultProps: defaultFooterLinkProps,
  render: (props) => <FooterLinksSlotInternal {...props} />,
};
