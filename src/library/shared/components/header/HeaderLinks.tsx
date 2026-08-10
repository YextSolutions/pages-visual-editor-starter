// @ts-nocheck
import React from "react";
import { useTranslation } from "react-i18next";
import { FieldLabel, PuckComponent, setDeep } from "@puckeditor/core";
import { CTA } from "../atoms/cta";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { TranslatableCTA } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { useOverflow } from "@yext/visual-editor/section-library-support";
import { usePreviewWindow } from "@yext/visual-editor/section-library-support";
import { getViewport, useWindowWidth } from "@yext/visual-editor/section-library-support";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import { linkTypeOptions } from "@yext/visual-editor/section-library-support";
import {
  useExpandedHeaderMenu,
  useHeaderLinksDisplayMode,
} from "./ExpandedHeaderMenuContext";
import { ThemeColor, ThemeOptions } from "@yext/visual-editor/section-library-support";
import { BodyProps } from "../atoms/body";
import { isNonNormalizableLinkType } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  type YextArrayField,
  type YextCustomFieldRenderProps,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export type HeaderLinksProps = {
  data: {
    links: TranslatableCTA[];
    collapsedLinks: TranslatableCTA[];
  };

  styles: {
    /**
     * Alignment of the header links
     */
    align?: "left" | "center" | "right";

    /**
     * The variant of the header links
     */
    variant?: BodyProps["variant"];

    /**
     * The color of the header links
     */
    color?: ThemeColor;

    /**
     * The weight of the header links
     */
    weight?: "normal" | "bold";
  };

  /** @internal data from the parent section */
  parentData?: {
    type: "Primary" | "Secondary";
  };
};

const defaultLink: TranslatableCTA = {
  linkType: "URL",
  label: { defaultValue: "Header Link" },
  link: "#",
  normalizeLink: true,
  openInNewTab: false,
};

const linkFieldConfig: YextArrayField<TranslatableCTA[]> = {
  type: "array",
  arrayFields: {
    label: {
      type: "translatableString",
      label: msg("fields.label", "Label"),
      filter: { types: ["type.string"] },
    },
    link: {
      type: "translatableString",
      label: msg("fields.link", "Link"),
    },
    linkType: {
      type: "basicSelector",
      label: msg("fields.linkType", "Link Type"),
      options: linkTypeOptions(),
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
  defaultItemProps: defaultLink satisfies TranslatableCTA,
  getItemSummary: (item, i) => {
    return (
      resolveComponentData(item.label, i18nComponentsInstance.language) ||
      pt("link", "Link") + " " + ((i ?? 0) + 1)
    );
  },
};

const headerLinksFields: YextFields<HeaderLinksProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      links: {
        type: "custom",
        render: ({
          onChange,
          value,
        }: YextCustomFieldRenderProps<HeaderLinksProps["data"]["links"]>) => {
          const tooltip = pt(
            "fields.linksTooltip",
            "Links will automatically collapse if the viewport is too narrow"
          );
          return (
            <div>
              <FieldLabel
                label={pt("fields.links", "Links")}
                el="div"
                className="mb-3"
              >
                <p className="ve-text-xs ve-mb-3">{tooltip}</p>
                <YextAutoField
                  value={value}
                  onChange={onChange}
                  field={linkFieldConfig}
                />
              </FieldLabel>
            </div>
          );
        },
      },
      collapsedLinks: {
        ...linkFieldConfig,
        label: msg("fields.collapsedLinks", "Collapsed Links"),
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      align: {
        label: msg("fields.align", "Align"),
        type: "radio",
        options: ThemeOptions.ALIGNMENT,
      },
      variant: {
        label: msg("fields.variant", "Variant"),
        type: "radio",
        options: ThemeOptions.BODY_VARIANT,
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
      weight: {
        label: msg("fields.weight", "Weight"),
        type: "radio",
        options: [
          { label: msg("fields.options.normal", "Normal"), value: "normal" },
          { label: msg("fields.options.bold", "Bold"), value: "bold" },
        ],
      },
    },
  },
};

const HeaderLinksComponent: PuckComponent<HeaderLinksProps> = ({
  data,
  styles,
  parentData,
  puck,
}) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument();
  const previewWindow = usePreviewWindow();

  const navRef = React.useRef<HTMLDivElement | null>(null);
  const measureContainerRef = React.useRef<HTMLUListElement | null>(null);
  const displayMode = useHeaderLinksDisplayMode();
  const menuContext = useExpandedHeaderMenu();

  const windowWidth = useWindowWidth(previewWindow);
  const { isMobile, isDesktop } = getViewport(windowWidth);
  const isOverflow = useOverflow(navRef, measureContainerRef, 0);

  const type = parentData?.type || "Primary";
  const isSecondary = type === "Secondary";
  const primaryOverflow = menuContext?.primaryOverflow ?? false;
  const ariaLabel =
    displayMode === "menu"
      ? type === "Primary"
        ? t("primaryHeaderLinksMenu", "Primary Header Links (Menu)")
        : t("secondaryHeaderLinksMenu", "Secondary Header Links (Menu)")
      : type === "Primary"
        ? t("primaryHeaderLinks", "Primary Header Links")
        : t("secondaryHeaderLinks", "Secondary Header Links");

  const validLinks = React.useMemo(
    () => data.links?.filter((item) => !!item?.link) || [],
    [data.links]
  );
  const validAlwaysCollapsedLinks = React.useMemo(
    () =>
      isSecondary
        ? []
        : data.collapsedLinks?.filter((item) => !!item?.link) || [],
    [isSecondary, data.collapsedLinks]
  );

  // Derive styles based on display mode and styles props.
  const justifyClass = React.useMemo(() => {
    if (displayMode === "menu") {
      return isDesktop ? "justify-end" : "justify-start";
    }

    const alignmentMap = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };
    return alignmentMap[styles?.align || "right"];
  }, [displayMode, isDesktop, styles?.align]);
  const weightClass = styles?.weight === "bold" ? "font-bold" : "font-normal";
  const sizeClass = styles?.variant
    ? {
        xs: "text-body-xs-fontSize",
        sm: "text-body-sm-fontSize",
        base: "text-body-fontSize",
        lg: "text-body-lg-fontSize",
      }[styles.variant]
    : "text-body-fontSize";

  const linksToRender = React.useMemo(() => {
    if (displayMode !== "menu" || isSecondary) {
      return validLinks;
    }

    const showAll = isMobile || primaryOverflow;
    return showAll
      ? [...validLinks, ...validAlwaysCollapsedLinks]
      : validAlwaysCollapsedLinks;
  }, [
    displayMode,
    isSecondary,
    isMobile,
    primaryOverflow,
    validLinks,
    validAlwaysCollapsedLinks,
  ]);

  // Update setPrimaryHasCollapsedLinks for menuContext
  React.useEffect(() => {
    if (menuContext && displayMode === "inline" && !isSecondary) {
      menuContext.setPrimaryHasCollapsedLinks(
        validAlwaysCollapsedLinks.length > 0
      );
      return () => menuContext.setPrimaryHasCollapsedLinks(false);
    }
  }, [menuContext, displayMode, isSecondary, validAlwaysCollapsedLinks.length]);

  const renderLink = (item: TranslatableCTA, index: number) => (
    <CTA
      variant={
        !isSecondary ? "headerFooterMainLink" : "headerFooterSecondaryLink"
      }
      color={styles?.color}
      openInNewTab={item.openInNewTab}
      eventName={`cta.${type.toLowerCase()}.${index}`}
      label={resolveComponentData(item.label, i18n.language, streamDocument)}
      linkType={item.linkType}
      link={resolveComponentData(item.link, i18n.language, streamDocument)}
      normalizeLink={
        isNonNormalizableLinkType(item.linkType)
          ? false
          : (item.normalizeLink ?? true)
      }
      className={`${justifyClass} ${weightClass} ${sizeClass} w-full text-wrap break-words`}
    />
  );

  // Early return for empty state
  if (validLinks.length + validAlwaysCollapsedLinks.length === 0) {
    return puck.isEditing ? (
      <nav className="h-5 min-w-[100px] min-h-[30px] opacity-20" />
    ) : (
      <></>
    );
  }

  return (
    <nav
      aria-label={ariaLabel}
      ref={navRef}
      className={`flex md:gap-6 md:items-center ${justifyClass} ${puck.isEditing ? " min-w-[100px] min-h-[30px]" : ""}`}
    >
      {/* Hidden measure list for overflow math */}
      <ul
        ref={measureContainerRef}
        className="flex flex-col md:flex-row absolute top-0 left-[-9999px] invisible"
      >
        {validLinks.map((item, i) => (
          <li key={`measure-${i}`} className="py-4 md:py-0">
            {renderLink(item, i)}
          </li>
        ))}
      </ul>

      {/* Visible list */}
      {(!isSecondary || displayMode === "menu" || isMobile || !isOverflow) && (
        <ul
          className={`flex flex-col w-full sm:w-auto gap-0 ${
            displayMode === "menu"
              ? isDesktop
                ? "md:flex-row md:gap-6 md:items-center justify-end"
                : "justify-start"
              : `${justifyClass} md:flex-row md:gap-6`
          } ${sizeClass} ${weightClass}`}
        >
          {linksToRender.map((item, i) => (
            <li key={`visible-${i}`} className="py-4 lg:py-0">
              {renderLink(item, i)}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export const defaultHeaderLinkProps: HeaderLinksProps = {
  data: {
    links: [defaultLink, defaultLink, defaultLink],
    collapsedLinks: [],
  },
  styles: {
    align: "right",
    variant: "sm",
    weight: "normal",
  },
};

export const HeaderLinks: YextComponentConfig<HeaderLinksProps> = {
  label: msg("components.headerLinks", "Header Links"),
  fields: headerLinksFields,
  resolveFields: (data, params) => {
    let updatedFields = headerLinksFields;

    updatedFields = setDeep(
      updatedFields,
      "styles.objectFields.align.visible",
      params.parent?.type !== "PrimaryHeaderSlot"
    );

    updatedFields = setDeep(
      updatedFields,
      "data.objectFields.collapsedLinks.visible",
      params.parent?.type === "PrimaryHeaderSlot"
    );

    updatedFields = setDeep(
      updatedFields,
      "data.objectFields.links.arrayFields.normalizeLink.visible",
      !data.props.data.links?.length ||
        data.props.data.links.some(
          (link) => !isNonNormalizableLinkType(link?.linkType)
        )
    );

    updatedFields = setDeep(
      updatedFields,
      "data.objectFields.collapsedLinks.arrayFields.normalizeLink.visible",
      !data.props.data.collapsedLinks?.length ||
        data.props.data.collapsedLinks.some(
          (link) => !isNonNormalizableLinkType(link?.linkType)
        )
    );

    return toPuckFields(updatedFields);
  },
  defaultProps: defaultHeaderLinkProps,
  render: (props) => <HeaderLinksComponent {...props} />,
};
