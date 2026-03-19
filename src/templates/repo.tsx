import "@yext/visual-editor/style.css";
import "../index.css";
import {
  Template,
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
  TagType,
  TemplateConfig,
  TransformProps,
} from "@yext/pages";
import { Data, Render, resolveAllData } from "@puckeditor/core";
import {
  applyTheme,
  VisualEditorProvider,
  getPageMetadata,
  applyAnalytics,
  applyHeaderScript,
  migrate,
  migrationRegistry,
  filterComponentsFromConfig,
  resolveUrlTemplate,
  defaultThemeConfig,
  mainConfig,
  getSchema,
  getCanonicalUrl,
} from "@yext/visual-editor";
import { AnalyticsProvider, SchemaWrapper } from "@yext/pages-components";

export const config = {
  name: "repo-based-location",
  stream: {
    $id: "repo-location-stream",
    filter: {
      entityTypes: ["location"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "slug",
      "name",
      "hours",
      "address",
      "additionalHoursText",
      "mainPhone",
      "emails",
    ],
    localization: {
      locales: ["en", "es"],
    },
    // @ts-expect-error pending pages update
    includeCertifiedFacts: true,
  },
  additionalProperties: {
    isVETemplate: true,
  },
} as const satisfies TemplateConfig;

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = (
  data: TemplateRenderProps
): HeadConfig => {
  const { document } = data;
  const { title, description } = getPageMetadata(document);
  const schema = getSchema(data);
  const faviconUrl = document?._favicon ?? document?._site?.favicon?.url;

  return {
    title: title,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "link" as TagType,
        attributes: {
          rel: "icon",
          type: "image/x-icon",
        },
      },
      ...(data.document.siteDomain
        ? [
            {
              type: "link" as TagType,
              attributes: {
                rel: "canonical",
                href: getCanonicalUrl(data),
              },
            },
          ]
        : []),
      ...(description
        ? [
            {
              type: "meta" as TagType,
              attributes: {
                name: "description",
                content: description,
              },
            },
          ]
        : []),
      ...(faviconUrl
        ? [
            {
              type: "link" as TagType,
              attributes: {
                rel: "icon",
                type: "image/x-icon",
                href: faviconUrl,
              },
            },
          ]
        : []),
    ],
    other: [
      applyAnalytics(document),
      applyHeaderScript(document),
      applyTheme(document, defaultThemeConfig),
      SchemaWrapper(schema),
    ].join("\n"),
  };
};

export const getPath: GetPath<
  TemplateProps & { relativePrefixToRoot: string }
> = ({ document, relativePrefixToRoot }) => {
  return (
    "repo-based/" + resolveUrlTemplate(document, relativePrefixToRoot)
  );
};

export const transformProps: TransformProps<TemplateProps> = async (props) => {
  const { document } = props;
  const migratedData = migrate(
    JSON.parse(document.__.layout),
    migrationRegistry,
    mainConfig,
    document
  );
  const updatedData = await resolveAllData(migratedData, mainConfig, {
    streamDocument: document,
  });

  return { ...props, data: updatedData };
};

const RepoLocation: Template<TemplateRenderProps & { data: Data }> = (
  props
) => {
  const { document, data } = props;
  const filteredConfig = filterComponentsFromConfig(
    mainConfig,
    document?._additionalLayoutComponents,
    document?._additionalLayoutCategories
  );

  return (
    <AnalyticsProvider
      apiKey={document?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY}
      templateData={props}
      currency="USD"
    >
      <VisualEditorProvider templateProps={props}>
        <Render
          config={filteredConfig}
          data={data}
          metadata={{ streamDocument: document }}
        />
      </VisualEditorProvider>
    </AnalyticsProvider>
  );
};

export default RepoLocation;