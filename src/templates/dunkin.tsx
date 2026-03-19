import "../nodePolyfills";
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
  TransformProps,
  TemplateConfig,
} from "@yext/pages";
import { Render, resolveAllData } from "@puckeditor/core";
import {
  applyTheme,
  VisualEditorProvider,
  getPageMetadata,
  applyAnalytics,
  applyHeaderScript,
  applyCertifiedFacts,
  defaultThemeConfig,
  getSchema,
  injectTranslations,
  getCanonicalUrl,
  resolveUrlTemplate,
} from "@yext/visual-editor";
import { AnalyticsProvider, SchemaWrapper } from "@yext/pages-components";
import { DunkinConfig } from "../components/dunkin/DunkinConfig";

export const config = {
  name: "repo-dunkin",
  stream: {
    $id: "repo-dunkin-stream",
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
      locales: ["en"],
    },
    includeCertifiedFacts: true,
  },
  additionalProperties: {
    isVETemplate: true,
  },
} as const satisfies TemplateConfig;

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = (
  data: TemplateRenderProps
): HeadConfig => {
  const { document, relativePrefixToRoot } = data;
  const { title, description } = getPageMetadata(document);
  const schema = getSchema(data);
  const faviconUrl = document?._favicon ?? document?._site?.favicon?.url;

  return {
    title: title ?? "Title",
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
      applyTheme(document, relativePrefixToRoot, defaultThemeConfig),
      SchemaWrapper(schema),
      applyCertifiedFacts(document),
    ].join("\n"),
  };
};

export const getPath: GetPath<
  TemplateProps & { relativePrefixToRoot: string }
> = ({ document, relativePrefixToRoot }) => {
  return (
    "dunkin/" + resolveUrlTemplate(document, relativePrefixToRoot)
  );
};

export const transformProps: TransformProps<TemplateProps> = async (props) => {
  const { document } = props;

  const resolvedPuckData = await resolveAllData(
    JSON.parse(document.__.layout),
    DunkinConfig,
    {
      streamDocument: document,
    }
  );
  document.__.layout = JSON.stringify(resolvedPuckData);

  const translations = await injectTranslations(document);

  return { ...props, document, translations };
};

const Dunkin: Template<TemplateRenderProps> = (props) => {
  const { document } = props;

  const layoutString = document.__.layout;
  let data: any = {};
  try {
    data = JSON.parse(layoutString);
  } catch (e) {
    console.error("Failed to parse layout JSON:", e);
  }

  let requireAnalyticsOptIn = false;
  if (document.__?.visualEditorConfig) {
    try {
      requireAnalyticsOptIn =
        JSON.parse(document.__.visualEditorConfig)?.requireAnalyticsOptIn ??
        false;
    } catch (e) {
      console.error("Failed to parse visualEditorConfig JSON:", e);
    }
  }

  return (
    <AnalyticsProvider
      apiKey={document?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY}
      templateData={props}
      currency="USD"
      requireOptIn={requireAnalyticsOptIn}
    >
        <VisualEditorProvider templateProps={props}>
          <Render
            config={DunkinConfig}
            data={data}
            metadata={{ streamDocument: document }}
          />
        </VisualEditorProvider>
    </AnalyticsProvider>
  );
};

export default Dunkin;
