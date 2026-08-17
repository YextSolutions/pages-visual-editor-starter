import { useTemplateProps } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { PageSection } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { HeadingTextProps } from "../contentBlocks/HeadingText";
import { BreadcrumbsSectionProps } from "../pageSections/Breadcrumbs";
import { PuckComponent, setDeep, Slot } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { DirectoryList } from "./DirectoryWrapper";
import { isDirectoryGrid } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export interface DirectoryStyles {
  /**
   * The background color for the directory page heading area.
   * @defaultValue Background Color 1
   */
  backgroundColor: ThemeColor;

  /**
   * The background color for the directory list area.
   * @defaultValue Background Color 1
   */
  listBackgroundColor: ThemeColor;

  /**
   * The color of links in the directory list layout.
   */
  linkColor?: ThemeColor;
}

export interface DirectoryProps {
  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: DirectoryStyles;

  /** @internal */
  slots: {
    TitleSlot: Slot;
    SiteNameSlot: Slot;
    BreadcrumbsSlot: Slot;
    DirectoryGrid: Slot;
  };

  /** @internal */
  analytics: {
    scope?: string;
  };
}

const directoryFields: YextFields<DirectoryProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.headingBackgroundColor", "Heading Background Color"),
        options: "BACKGROUND_COLOR",
      },
      listBackgroundColor: {
        type: "basicSelector",
        label: msg(
          "fields.directoryListBackgroundColor",
          "Directory List Background Color"
        ),
        options: "BACKGROUND_COLOR",
      },
      linkColor: {
        type: "basicSelector",
        label: msg("fields.linkColor", "Link Color"),
        options: "SITE_COLOR",
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      TitleSlot: { type: "slot", allow: [] },
      SiteNameSlot: { type: "slot", allow: [] },
      BreadcrumbsSlot: { type: "slot", allow: [] },
      DirectoryGrid: { type: "slot", allow: [] },
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

const DirectoryComponent: PuckComponent<DirectoryProps> = ({
  styles,
  slots,
}) => {
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();

  return (
    <Background background={styles.backgroundColor}>
      <slots.BreadcrumbsSlot style={{ height: "auto" }} />
      <PageSection className="flex flex-col items-center gap-2">
        <slots.SiteNameSlot style={{ height: "auto", width: "100%" }} />
        <slots.TitleSlot style={{ height: "auto", width: "100%" }} />
      </PageSection>
      {streamDocument.dm_directoryChildren &&
        isDirectoryGrid(streamDocument.dm_directoryChildren) && (
          <slots.DirectoryGrid style={{ height: "auto" }} />
        )}
      {streamDocument.dm_directoryChildren &&
        !isDirectoryGrid(streamDocument.dm_directoryChildren) && (
          <DirectoryList
            streamDocument={streamDocument}
            directoryChildren={streamDocument.dm_directoryChildren}
            relativePrefixToRoot={relativePrefixToRoot ?? ""}
            linkColor={styles.linkColor}
            backgroundColor={styles.listBackgroundColor}
          />
        )}
    </Background>
  );
};

/**
 * The Directory Page component serves as a navigational hub,
 * displaying a list of child entities within a hierarchical structure
 * (e.g., a list of states in a country, or cities in a state).
 * It includes breadcrumbs for easy navigation and renders each child item as a distinct card.
 * Available on Directory templates.
 */
export const Directory: YextComponentConfig<DirectoryProps> = {
  label: msg("components.directory", "Directory"),
  fields: directoryFields,
  resolveFields: (data, params) => {
    if (
      params.metadata.streamDocument?.dm_directoryChildren &&
      isDirectoryGrid(params.metadata.streamDocument.dm_directoryChildren)
    ) {
      const updatedFields = setDeep(
        directoryFields,
        "styles.objectFields.listBackgroundColor.visible",
        false
      );
      return toPuckFields(
        setDeep(updatedFields, "styles.objectFields.linkColor.visible", false)
      );
    }
    return toPuckFields(directoryFields);
  },
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
      listBackgroundColor: backgroundColors.background1.value,
    },
    slots: {
      TitleSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "" },
                constantValueEnabled: false,
                field: "name",
              },
            },
            styles: { level: 2, align: "center" },
          } satisfies HeadingTextProps,
        },
      ],
      SiteNameSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "" },
                constantValueEnabled: true,
                field: "name",
              },
            },
            styles: { level: 4, align: "center" },
          } satisfies HeadingTextProps,
        },
      ],
      BreadcrumbsSlot: [
        {
          type: "BreadcrumbsSlot",
          props: {
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
              scope: "directory",
            },
            liveVisibility: true,
          } satisfies BreadcrumbsSectionProps,
        },
      ],
      DirectoryGrid: [
        {
          type: "DirectoryGrid",
          props: {
            data: {
              field: "dm_directoryChildren",
              constantValueEnabled: false,
              constantValue: [],
              mappings: {
                cardTitle: {
                  field: "name",
                  constantValueEnabled: false,
                  constantValue: undefined,
                },
              },
            },
            styles: {
              backgroundColor: backgroundColors.background1.value,
            },
            slots: {
              CardSlot: [],
            },
          },
        },
      ],
    },
    analytics: {
      scope: "directory",
    },
  },
  render: (props) => (
    <AnalyticsScopeProvider name={props?.analytics?.scope ?? "directory"}>
      <DirectoryComponent {...props} />
    </AnalyticsScopeProvider>
  ),
};
