// @ts-nocheck
import * as React from "react";
import { PuckComponent, setDeep } from "@puckeditor/core";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { TranslatableString, TranslatableCTA } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { CTA } from "../atoms/cta";
import { Body } from "../atoms/body";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { defaultLink, defaultLinks } from "./ExpandedFooter";
import { isNonNormalizableLinkType } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export interface FooterExpandedLinkSectionSlotProps {
  data: {
    label: YextEntityField<TranslatableString>;
    links: TranslatableCTA[];
  };
  styles?: {
    /** Color applied to section label and links. */
    color?: ThemeColor;
  };
  /** @internal */
  index?: number;
}

const FooterExpandedLinkSectionSlotInternal: PuckComponent<
  FooterExpandedLinkSectionSlotProps
> = (props) => {
  const { data, styles, puck } = props;
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const background = useBackground();
  const isDarkBackground = background?.isDarkColor ?? false;

  const label = resolveComponentData(data.label, i18n.language, streamDocument);
  const links = data.links;

  const defaultColor: ThemeColor = isDarkBackground
    ? { selectedColor: "white", contrastingColor: "black" }
    : { selectedColor: "palette-primary-dark", contrastingColor: "white" };
  const resolvedColor = styles?.color ?? defaultColor;

  return (
    <div className="flex flex-col gap-6">
      <Body className="break-words" color={resolvedColor}>
        {label}
      </Body>
      <div className="flex flex-col gap-4">
        {links && links.length > 0
          ? links.map((linkData, index) => {
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
                  key={index}
                  variant="headerFooterMainLink"
                  eventName={`cta.expandedFooter.${index}-Link-${index + 1}`}
                  label={linkLabel}
                  linkType={linkData.linkType}
                  link={link}
                  normalizeLink={
                    isNonNormalizableLinkType(linkData.linkType)
                      ? false
                      : (linkData.normalizeLink ?? true)
                  }
                  className="justify-center md:justify-start block break-words whitespace-normal"
                  color={resolvedColor}
                />
              );
            })
          : puck.isEditing && <div className="h-6 min-w-[100px]" />}
      </div>
    </div>
  );
};

const defaultFooterExpandedLinkSectionProps: FooterExpandedLinkSectionSlotProps =
  {
    data: {
      label: {
        field: "",
        constantValue: { defaultValue: "Footer Label" },
        constantValueEnabled: true,
      },
      links: defaultLinks,
    },
  };

const shouldShowNormalizeLinkField = (links?: TranslatableCTA[]) => {
  return (
    !links?.length ||
    links.some((link) => !isNonNormalizableLinkType(link?.linkType))
  );
};

const footerExpandedLinkSectionSlotFields: YextFields<FooterExpandedLinkSectionSlotProps> =
  {
    data: {
      type: "object",
      label: msg("fields.data", "Data"),
      objectFields: {
        label: {
          type: "translatableString",
          label: msg("fields.label", "Label"),
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
                { label: msg("fields.options.phone", "Phone"), value: "PHONE" },
                { label: msg("fields.options.email", "Email"), value: "EMAIL" },
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
              typeof item.label === "string"
                ? item.label
                : item.label?.[locale];
            return label || pt("link", "Link") + " " + ((index ?? 0) + 1);
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
    index: {
      type: "number",
      visible: false,
    },
  };

export const FooterExpandedLinkSectionSlot: YextComponentConfig<FooterExpandedLinkSectionSlotProps> =
  {
    label: msg(
      "components.footerExpandedLinkSectionSlot",
      "Expanded Link Section"
    ),
    fields: footerExpandedLinkSectionSlotFields,
    resolveFields: (data) =>
      setDeep(
        toPuckFields(footerExpandedLinkSectionSlotFields),
        "data.objectFields.links.arrayFields.normalizeLink.visible",
        shouldShowNormalizeLinkField(data.props.data.links)
      ),
    defaultProps: defaultFooterExpandedLinkSectionProps,
    render: (props) => <FooterExpandedLinkSectionSlotInternal {...props} />,
  };
