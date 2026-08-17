import * as React from "react";
import { PuckComponent, setDeep } from "@puckeditor/core";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { TranslatableString, TranslatableCTA } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  getDisplayValue,
  resolveComponentData,
} from "@yext/visual-editor/section-library-support";
import { CTA } from "@yext/visual-editor/section-library-support";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { defaultLink, defaultLinks } from "./ExpandedFooter";
import { isNonNormalizableLinkType } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { cva } from "class-variance-authority";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

const defaultSection = {
  label: { defaultValue: "Footer Label" },
  links: defaultLinks,
};

const footerExpandedLinksWrapperFields: YextFields<FooterExpandedLinksWrapperProps> =
  {
    data: {
      type: "object",
      label: msg("fields.data", "Data"),
      objectFields: {
        sections: {
          type: "array",
          label: msg("fields.expandedFooterLinks", "Expanded Footer Links"),
          arrayFields: {
            label: {
              type: "translatableString",
              label: msg("fields.sectionLabel", "Section Label"),
              filter: { types: ["type.string"] },
            },
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
                  label: msg("fields.linkLabel", "Link Label"),
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
                    {
                      label: msg("fields.options.yes", "Yes"),
                      value: true,
                    },
                    {
                      label: msg("fields.options.no", "No"),
                      value: false,
                    },
                  ],
                },
                openInNewTab: {
                  label: msg("fields.openInNewTab", "Open in new tab"),
                  type: "radio",
                  options: [
                    {
                      label: msg("fields.options.yes", "Yes"),
                      value: true,
                    },
                    { label: msg("fields.options.no", "No"), value: false },
                  ],
                },
              },
              defaultItemProps: defaultLink,
              getItemSummary: (item: TranslatableCTA, index?: number) => {
                const locale = i18nComponentsInstance.language || "en";
                const label = getDisplayValue(item.label, locale);
                return label || pt("link", "Link") + " " + ((index ?? 0) + 1);
              },
            },
          },
          defaultItemProps: defaultSection,
          getItemSummary: (
            item: FooterExpandedLinksWrapperProps["data"]["sections"][number],
            index?: number
          ) => {
            const locale = i18nComponentsInstance.language || "en";
            const label = getDisplayValue(item.label, locale);
            return label || pt("section", "Section") + " " + ((index ?? 0) + 1);
          },
        },
      },
    },
    styles: {
      type: "object",
      label: msg("fields.styles", "Styles"),
      objectFields: {
        color: {
          type: "basicSelector",
          label: msg("fields.color", "Color"),
          options: "SITE_COLOR",
        },
      },
    },
  };

export interface FooterExpandedLinksWrapperProps {
  data: {
    sections: {
      label: TranslatableString;
      links: TranslatableCTA[];
    }[];
  };
  styles?: {
    color?: ThemeColor;
  };
  /** @internal */
  desktopContentAlignment?: "left" | "center" | "right";
  /** @internal */
  mobileContentAlignment?: "left" | "center" | "right";
}

const expandedLinksWrapperAlignment = cva("w-full flex", {
  variants: {
    desktopContentAlignment: {
      left: "md:justify-start",
      center: "md:justify-center",
      right: "md:justify-end",
    },
    mobileContentAlignment: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
});

const expandedLinksContainerAlignment = cva(
  "grid grid-cols-1 gap-6 md:w-fit md:[grid-template-columns:repeat(var(--expanded-footer-section-columns),minmax(var(--expanded-footer-section-width),var(--expanded-footer-section-width)))]",
  {
    variants: {
      desktopContentAlignment: {
        left: "md:text-left md:justify-items-start",
        center: "md:text-center md:justify-items-center",
        right: "md:text-right md:justify-items-end",
      },
      mobileContentAlignment: {
        left: "text-left justify-items-start",
        center: "text-center justify-items-center",
        right: "text-right justify-items-end",
      },
    },
    defaultVariants: {
      desktopContentAlignment: "left",
      mobileContentAlignment: "left",
    },
  }
);

const expandedSectionAlignment = cva("flex flex-col gap-6", {
  variants: {
    desktopContentAlignment: {
      left: "md:items-start",
      center: "md:items-center",
      right: "md:items-end",
    },
    mobileContentAlignment: {
      left: "items-start",
      center: "items-center",
      right: "items-end",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
});

const expandedLinkJustification = cva("block break-words whitespace-normal", {
  variants: {
    desktopContentAlignment: {
      left: "md:justify-start",
      center: "md:justify-center",
      right: "md:justify-end",
    },
    mobileContentAlignment: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
});

const shouldShowNormalizeLinkField = (
  sections?: FooterExpandedLinksWrapperProps["data"]["sections"]
) => {
  return (
    !sections?.length ||
    sections.some(
      (section) =>
        !section.links?.length ||
        section.links.some((link) => !isNonNormalizableLinkType(link?.linkType))
    )
  );
};

const FooterExpandedLinksWrapperInternal: PuckComponent<
  FooterExpandedLinksWrapperProps
> = (props) => {
  const {
    data,
    styles,
    desktopContentAlignment = "left",
    mobileContentAlignment = "left",
  } = props;
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const background = useBackground();
  const isDarkBackground = background?.isDarkColor ?? false;

  const sections = data.sections || [];
  const defaultLabelColor = isDarkBackground
    ? ({ selectedColor: "white", contrastingColor: "black" } as ThemeColor)
    : ({ selectedColor: "black", contrastingColor: "white" } as ThemeColor);
  const defaultLinkColor = isDarkBackground
    ? ({ selectedColor: "white", contrastingColor: "black" } as ThemeColor)
    : ({
        selectedColor: "palette-primary-dark",
        contrastingColor: "white",
      } as ThemeColor);
  const resolvedLabelColor = styles?.color ?? defaultLabelColor;
  const resolvedLinkColor = styles?.color ?? defaultLinkColor;
  const desktopSectionColumns = Math.max(1, Math.min(sections.length, 4));

  return (
    <div
      className={expandedLinksWrapperAlignment({
        desktopContentAlignment,
        mobileContentAlignment,
      })}
    >
      <div
        className={expandedLinksContainerAlignment({
          desktopContentAlignment,
          mobileContentAlignment,
        })}
        style={
          {
            "--expanded-footer-section-columns": desktopSectionColumns,
            "--expanded-footer-section-width": "12rem",
          } as React.CSSProperties
        }
      >
        {sections.map((section, sectionIndex) => {
          const label = resolveComponentData(
            section.label,
            i18n.language,
            streamDocument
          );
          const links = section.links || [];

          return (
            <div
              key={sectionIndex}
              className={expandedSectionAlignment({
                desktopContentAlignment,
                mobileContentAlignment,
              })}
            >
              <Body
                className="break-words font-link-fontWeight font-body-fontFamily font-body-fontWeight"
                color={resolvedLabelColor}
              >
                {label}
              </Body>
              <div className="flex flex-col gap-4">
                {links.map((linkData, linkIndex) => {
                  const linkLabel = resolveComponentData(
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
                      openInNewTab={linkData.openInNewTab}
                      key={linkIndex}
                      variant="headerFooterMainLink"
                      eventName={`cta.expandedFooter.${sectionIndex}-Link-${linkIndex + 1}`}
                      label={linkLabel}
                      linkType={linkData.linkType}
                      link={link}
                      normalizeLink={
                        isNonNormalizableLinkType(linkData.linkType)
                          ? false
                          : (linkData.normalizeLink ?? true)
                      }
                      className={themeManagerCn(
                        expandedLinkJustification({
                          desktopContentAlignment,
                          mobileContentAlignment,
                        })
                      )}
                      color={resolvedLinkColor}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FooterExpandedLinksWrapper: YextComponentConfig<FooterExpandedLinksWrapperProps> =
  {
    label: msg("components.expandedLinks", "Expanded Links"),
    fields: footerExpandedLinksWrapperFields,
    resolveFields: (data) =>
      toPuckFields(
        setDeep(
          footerExpandedLinksWrapperFields,
          "data.objectFields.sections.arrayFields.links.arrayFields.normalizeLink.visible",
          shouldShowNormalizeLinkField(data.props.data.sections)
        )
      ),
    defaultProps: {
      data: {
        sections: [
          { ...defaultSection },
          { ...defaultSection },
          { ...defaultSection },
          { ...defaultSection },
        ],
      },
    },
    render: (props) => <FooterExpandedLinksWrapperInternal {...props} />,
  };
