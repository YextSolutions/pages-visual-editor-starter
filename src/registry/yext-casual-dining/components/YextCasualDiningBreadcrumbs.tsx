import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import { Link } from "@yext/pages-components";
import {
  Background,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveBreadcrumbs,
  useDocument,
  useTemplateProps,
  VisibilityWrapper,
  type ThemeColor,
  type StyledTextValue,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";

type CasualDiningBreadcrumbsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  includeCurrentLocation: boolean;
  breadcrumbLinks: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
};

const fields: YextFields<CasualDiningBreadcrumbsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  includeCurrentLocation: {
    label: "Include Current Location",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  breadcrumbLinks: {
    label: "Breadcrumb Links",
    type: "object",
    objectFields: {
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
};

const YextCasualDiningBreadcrumbsComponent: PuckComponent<
  CasualDiningBreadcrumbsProps
> = (props) => {
  const streamDocument = useDocument();
  const { relativePrefixToRoot } = useTemplateProps();
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const visibleBreadcrumbs =
    props.includeCurrentLocation || breadcrumbs.length <= 1
    ? breadcrumbs
    : breadcrumbs.slice(0, -1);
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
    { fallbackBackgroundColor: "var(--colors-palette-secondary)" },
  );
  const breadcrumbLinkStyle: React.CSSProperties = {
    color: getThemeColorCssValue(props.breadcrumbLinks.fontColor),
    fontFamily:
      props.breadcrumbLinks.styles.fontFamily === "default"
        ? "var(--fontFamily-link-fontFamily)"
        : props.breadcrumbLinks.styles.fontFamily,
    fontSize:
      props.breadcrumbLinks.styles.fontSize === "default"
        ? "var(--fontSize-link-fontSize)"
        : props.breadcrumbLinks.styles.fontSize,
    fontStyle:
      props.breadcrumbLinks.styles.fontStyle === "default"
        ? undefined
        : props.breadcrumbLinks.styles.fontStyle,
    fontWeight:
      props.breadcrumbLinks.styles.fontWeight === "default"
        ? "var(--fontWeight-link-fontWeight)"
        : props.breadcrumbLinks.styles.fontWeight,
    textTransform:
      props.breadcrumbLinks.styles.textTransform === "default"
        ? "var(--textTransform-link-textTransform)"
        : props.breadcrumbLinks.styles.textTransform,
    letterSpacing: "var(--letterSpacing-link-letterSpacing)",
  };

  if (!breadcrumbs.length) {
    return props.puck?.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        No breadcrumbs available (section will be hidden on live page). Create a
        directory to enable breadcrumbs.
      </p>
    ) : (
      <></>
    );
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={Boolean(props.puck?.isEditing)}
    >
      <Background
        as="nav"
        background={props.section.backgroundColor}
        aria-label="Breadcrumb"
        style={sectionSurfaceStyle}
      >
        <ol
          className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 sm:px-8"
          style={breadcrumbLinkStyle}
        >
          {visibleBreadcrumbs.map(({ name, slug }, breadcrumbIndex) => {
            const isCurrentPage =
              props.includeCurrentLocation &&
              breadcrumbIndex === visibleBreadcrumbs.length - 1;
            const label = isCurrentPage ? streamDocument.name || name : name;
            const href = relativePrefixToRoot
              ? relativePrefixToRoot + slug
              : slug;

            return (
              <li key={slug} className="flex items-center gap-x-2">
                {breadcrumbIndex > 0 && (
                  <span aria-hidden="true" className="opacity-70">
                    /
                  </span>
                )}
                {isCurrentPage ? (
                  <span aria-current="page">{label}</span>
                ) : (
                  <Link
                    eventName={`breadcrumb${breadcrumbIndex}`}
                    href={href}
                    style={breadcrumbLinkStyle}
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Background>
    </VisibilityWrapper>
  );
};

export const YextCasualDiningBreadcrumbs: YextComponentConfig<CasualDiningBreadcrumbsProps> =
  {
    label: "Breadcrumbs",
    fields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
        visibleOnLivePage: true,
      },
      includeCurrentLocation: true,
      breadcrumbLinks: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
    },
    render: YextCasualDiningBreadcrumbsComponent,
  };
