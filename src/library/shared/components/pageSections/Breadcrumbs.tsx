import { useTranslation } from "react-i18next";
import { useTemplateProps } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import { PageSection } from "@yext/visual-editor/section-library-support";
import { VisibilityWrapper } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import {
  ThemeColor,
  backgroundColors,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { setDeep } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { ComponentErrorBoundary } from "@yext/visual-editor/section-library-support";
import { resolveBreadcrumbs } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export interface BreadcrumbsData {
  /**
   * The display label for the first link in the breadcrumb trail (the top-level directory page).
   * @defaultValue "Directory Root"
   */
  directoryRoot: TranslatableString;

  /**
   * The display label for the last link in the breadcrumb trail (the current page).
   * @defaultValue Name
   */
  currentPage: YextEntityField<TranslatableString>;
}

export interface BreadcrumbsStyles {
  /**
   * The background color of the section.
   * @defaultValue Background Color 1
   */
  backgroundColor?: ThemeColor;

  /**
   * The link color of breadcrumbs.
   */
  linkColor?: ThemeColor;

  /**
   * Whether to show the current page's link in the breadcrumb trail (last link).
   * @defaultValue true
   */
  showCurrentPage: boolean;
}

/**
 * @public Defines the complete set of properties for the BreadcrumbsSection component.
 */
export interface BreadcrumbsSectionProps {
  /**
   * This object contains the content used by the component.
   * @propCategory Data Props
   */
  data: BreadcrumbsData;

  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: BreadcrumbsStyles;

  /**
   * @internal
   */
  analytics: {
    scope?: string;
  };

  /**
   * If 'true', the component is visible on the live page; if 'false', it's hidden.
   * @defaultValue true
   */
  liveVisibility: boolean;
}

const breadcrumbsSectionFields: YextFields<BreadcrumbsSectionProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      directoryRoot: {
        type: "translatableString",
        label: msg(
          "fields.directoryRootLinkLabel",
          "Directory Root Link Label"
        ),
        filter: { types: ["type.string"] },
      },
      currentPage: {
        type: "entityField",
        label: msg("fields.currentPageLinkLabel", "Current Page Link Label"),
        filter: { types: ["type.string"] },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      linkColor: {
        type: "basicSelector",
        label: msg("fields.linkColor", "Link Color"),
        options: "SITE_COLOR",
      },
      showCurrentPage: {
        label: msg(
          "fields.showCurrentPagesLinkLabel",
          "Show Current Page's Link Label"
        ),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
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
  liveVisibility: {
    label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
  },
};

// BreadcrumbsComponent renders breadcrumbs for DM related pages.
// If there are no dm_directoryParents nor dm_directoryChildren,
// then displays nothing. In the case of a root DM page, there are
// no dm_directoryParents but there are dm_directoryChildren so
// that root entity's name will be in the breadcrumbs.
export const BreadcrumbsComponent = ({
  data,
  styles,
}: BreadcrumbsSectionProps) => {
  const { t, i18n } = useTranslation();
  const separator = "/";
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const directoryRoot = resolveComponentData(
    data.directoryRoot,
    i18n.language,
    streamDocument
  );
  const currentPage = resolveComponentData(
    data.currentPage,
    i18n.language,
    streamDocument
  );
  const breadcrumbsToRender = breadcrumbs
    .map((breadcrumb, index) => ({ ...breadcrumb, index }))
    .filter(
      ({ index }) => styles.showCurrentPage || index < breadcrumbs.length - 1
    );

  if (!breadcrumbsToRender.length) {
    return null;
  }

  return (
    <PageSection
      as={"nav"}
      verticalPadding="sm"
      aria-label={t("breadcrumb", "Breadcrumb")}
      background={styles?.backgroundColor}
    >
      <ol className="inline p-0 m-0 list-none">
        {breadcrumbsToRender.map(({ name, slug, index }) => {
          const isRoot = index === 0;
          const isCurrentPage = index === breadcrumbs.length - 1;
          // Root pages have a single breadcrumb, so the first and last crumb are the same item.
          const isRootPage = isRoot && isCurrentPage;
          const href = relativePrefixToRoot
            ? relativePrefixToRoot + slug
            : slug;
          let label = name;
          if (isCurrentPage && currentPage) {
            label = currentPage;
          }
          if ((isRootPage || isRoot) && directoryRoot) {
            label = directoryRoot;
          }

          return (
            <li key={index} className="contents whitespace-normal break-words">
              {!isRoot && (
                <span className="mx-2" aria-hidden>
                  {separator}
                </span>
              )}

              {/* encourage the browser to break after a full breadcrumb, if necessary */}
              <wbr />

              <MaybeLink
                eventName={`link${index}`}
                href={isCurrentPage ? "" : href}
                className="inline text-body-sm-fontSize font-link-fontWeight font-link-fontFamily whitespace-normal break-words"
                color={styles?.linkColor}
                alwaysHideCaret
              >
                {label}
              </MaybeLink>
            </li>
          );
        })}
      </ol>
    </PageSection>
  );
};

/**
 * The Breadcrumbs component automatically generates and displays a navigational hierarchy based on a page's position within a Yext directory structure. It renders a list of links showing the path from the main directory root to the current page, helping users understand their location on the site.
 * Available on Location templates.
 */
export const BreadcrumbsSection: YextComponentConfig<BreadcrumbsSectionProps> =
  {
    label: msg("components.breadcrumbs", "Breadcrumbs"),
    fields: breadcrumbsSectionFields,
    resolveFields: (_data, params) => {
      const streamDocument = params.metadata?.streamDocument;
      if (!streamDocument) {
        return toPuckFields<BreadcrumbsSectionProps>(breadcrumbsSectionFields);
      }

      // On root pages there is only one breadcrumb, so "currentPage" duplicates "directoryRoot".
      const breadcrumbCount = resolveBreadcrumbs(streamDocument).length;
      return setDeep(
        toPuckFields<BreadcrumbsSectionProps>(breadcrumbsSectionFields),
        "data.objectFields.currentPage.visible",
        breadcrumbCount !== 1
      );
    },
    defaultProps: {
      data: {
        directoryRoot: { defaultValue: "Directory Root" },
        currentPage: {
          constantValue: { defaultValue: "[[name]]" },
          field: "name",
          constantValueEnabled: false,
        },
      },
      styles: {
        backgroundColor: backgroundColors.background1.value,
        showCurrentPage: true,
      },
      analytics: {
        scope: "breadcrumbs",
      },
      liveVisibility: true,
    },
    render: (props) => {
      return (
        <ComponentErrorBoundary
          isEditing={props.puck.isEditing}
          resetKeys={[props]}
        >
          <AnalyticsScopeProvider
            name={props?.analytics?.scope ?? "breadcrumbs"}
          >
            <VisibilityWrapper
              liveVisibility={props.liveVisibility}
              isEditing={props.puck.isEditing}
              iconSize="md"
            >
              <BreadcrumbsComponent {...props} />
            </VisibilityWrapper>
          </AnalyticsScopeProvider>
        </ComponentErrorBoundary>
      );
    },
  };
