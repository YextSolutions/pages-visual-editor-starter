import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveBreadcrumbs,
  resolveComponentData,
  toPuckFields,
  useDocument,
  useTemplateProps,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type BreadcrumbEntry = {
  name?: string;
  slug?: string;
  breadcrumbIndex: number;
  isRoot: boolean;
  isCurrentPage: boolean;
};

type BreadcrumbStreamDocument = StreamDocument & {
  address?: {
    line1?: string;
  };
  name?: string;
  locale?: string;
};

type YextBarSocialDiningBreadcrumbsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  includeCurrentLocation: boolean;
};

const breadcrumbsScopeClass = "bar-social-dining-breadcrumbs";

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
    "palette-primary-dark": "hsl(from var(--colors-palette-primary) h s 20)",
    "palette-secondary-dark":
      "hsl(from var(--colors-palette-secondary) h s 20)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (
  surfaceColor: ThemeColor,
  streamDocument: BreadcrumbStreamDocument,
): ThemeColor => {
  return {
    selectedColor: isDarkColor(surfaceColor, streamDocument)
      ? "white"
      : "black",
    contrastingColor: surfaceColor.selectedColor,
  };
};

const resolveTextColor = (
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
  streamDocument: BreadcrumbStreamDocument,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(fontColor)
      ? fontColor
      : getReadableForegroundColor(surfaceColor, streamDocument)
    ).selectedColor,
  );
};

const textStyle = ({
  styles,
  fontColor,
  surfaceColor,
  streamDocument,
}: {
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
  surfaceColor: ThemeColor;
  streamDocument: BreadcrumbStreamDocument;
}): React.CSSProperties => ({
  color: resolveTextColor(fontColor, surfaceColor, streamDocument),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
  letterSpacing: "0.08em",
  lineHeight: 1.4,
  textDecoration: "none",
});

const breadcrumbsScopedCss = `
  .${breadcrumbsScopeClass} .bar-social-dining-breadcrumbs-link {
    transition: opacity 150ms ease;
  }

  .${breadcrumbsScopeClass} .bar-social-dining-breadcrumbs-link:hover {
    opacity: 0.78;
  }
`;

const YextBarSocialDiningBreadcrumbsSectionFields: YextFields<YextBarSocialDiningBreadcrumbsSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    rootLabel: {
      label: "Root Label",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
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
    includeCurrentLocation: {
      label: "Include Current Location",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  };

const YextBarSocialDiningBreadcrumbsSectionComponent: PuckComponent<
  YextBarSocialDiningBreadcrumbsSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument<BreadcrumbStreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const resolvedRootLabelValue = resolveComponentData(
    props.rootLabel.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const rootLabelText =
    typeof resolvedRootLabelValue === "string" ? resolvedRootLabelValue : "";
  const currentPageLabel =
    streamDocument.name?.trim() || streamDocument.address?.line1?.trim() || "";
  const currentPageFieldId = streamDocument.name?.trim()
    ? "name"
    : streamDocument.address?.line1?.trim()
      ? "address.line1"
      : "";
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const breadcrumbEntries: BreadcrumbEntry[] = breadcrumbs.map(
    (breadcrumb, index) => ({
      name: breadcrumb.name,
      slug: breadcrumb.slug,
      breadcrumbIndex: index,
      isRoot: index === 0,
      isCurrentPage: index === breadcrumbs.length - 1,
    }),
  );
  const visibleEntries = breadcrumbEntries.filter((entry) => {
    if (breadcrumbEntries.length <= 1) {
      return true;
    }

    return props.includeCurrentLocation || !entry.isCurrentPage;
  });
  const sectionBackgroundColor = themeColorToCss(
    props.section.backgroundColor.selectedColor,
  );
  const resolvedTextStyle = textStyle({
    styles: props.rootLabel.styles,
    fontColor: props.rootLabel.fontColor,
    surfaceColor: props.section.backgroundColor,
    streamDocument,
  });

  if (!visibleEntries.length) {
    return props.puck.isEditing ? (
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
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningBreadcrumbsSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{breadcrumbsScopedCss}</style>
        <section
          className={breadcrumbsScopeClass}
          style={{
            backgroundColor: sectionBackgroundColor,
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <nav aria-label="Breadcrumb">
              <ol
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {visibleEntries.length ? (
                  visibleEntries.map((entry, index) => {
                    const label = entry.isRoot
                      ? rootLabelText || entry.name || ""
                      : entry.isCurrentPage
                        ? currentPageLabel
                        : entry.name || "";
                    const href =
                      relativePrefixToRoot && entry.slug
                        ? relativePrefixToRoot + entry.slug
                        : entry.slug || "";
                    const isLinked = !entry.isCurrentPage && Boolean(href);

                    const content = entry.isRoot ? (
                      <EntityField
                        displayName="Root Label"
                        fieldId={props.rootLabel.text.field}
                        constantValueEnabled={
                          props.rootLabel.text.constantValueEnabled
                        }
                      >
                        {isLinked ? (
                          <Link
                            cta={{
                              link: href,
                              linkType: "URL",
                            }}
                            className="bar-social-dining-breadcrumbs-link"
                            eventName={`link${entry.breadcrumbIndex}`}
                            style={resolvedTextStyle}
                          >
                            {label}
                          </Link>
                        ) : (
                          <span
                            aria-current={
                              entry.isCurrentPage ? "page" : undefined
                            }
                            style={resolvedTextStyle}
                          >
                            {label}
                          </span>
                        )}
                      </EntityField>
                    ) : entry.isCurrentPage && currentPageFieldId ? (
                      <EntityField
                        displayName="Current Page"
                        fieldId={currentPageFieldId}
                        constantValueEnabled={false}
                      >
                        <span aria-current="page" style={resolvedTextStyle}>
                          {label}
                        </span>
                      </EntityField>
                    ) : isLinked ? (
                      <Link
                        cta={{
                          link: href,
                          linkType: "URL",
                        }}
                        className="bar-social-dining-breadcrumbs-link"
                        eventName={`link${entry.breadcrumbIndex}`}
                        style={resolvedTextStyle}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span
                        aria-current={entry.isCurrentPage ? "page" : undefined}
                        style={resolvedTextStyle}
                      >
                        {label}
                      </span>
                    );

                    return (
                      <li
                        key={`breadcrumb-${entry.breadcrumbIndex}`}
                        style={{
                          alignItems: "center",
                          display: "inline-flex",
                          gap: "8px",
                        }}
                      >
                        {index > 0 ? (
                          <span
                            aria-hidden
                            style={{
                              ...resolvedTextStyle,
                              opacity: 0.55,
                            }}
                          >
                            /
                          </span>
                        ) : null}
                        <wbr />
                        {content}
                      </li>
                    );
                  })
                ) : (
                  <li style={{ display: "inline-flex" }}>
                    <EntityField
                      displayName="Root Label"
                      fieldId={props.rootLabel.text.field}
                      constantValueEnabled={
                        props.rootLabel.text.constantValueEnabled
                      }
                    >
                      <span style={resolvedTextStyle}>
                        {rootLabelText || "All Locations"}
                      </span>
                    </EntityField>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningBreadcrumbsSection: YextComponentConfig<YextBarSocialDiningBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs Section",
    fields: toPuckFields(YextBarSocialDiningBreadcrumbsSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      rootLabel: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "All Locations",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "uppercase",
        },
        fontColor: undefined,
      },
      includeCurrentLocation: true,
    },
    render: (props) => (
      <YextBarSocialDiningBreadcrumbsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "YextBarSocialDiningBreadcrumbsSection",
  displayName: "Breadcrumbs Section",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};
