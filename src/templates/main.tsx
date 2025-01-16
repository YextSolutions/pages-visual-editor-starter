import "@yext/visual-editor/style.css";
import {
  Template,
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import { Render } from "@measured/puck";
import { mainConfig } from "../ve.config";
import {
  applyTheme,
  VisualEditorProvider,
  normalizeSlug,
} from "@yext/visual-editor";
import { themeConfig } from "../../theme.config";
import { buildSchema } from "../utils/buildSchema";
import { AnalyticsProvider } from "@yext/pages-components";

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/x-icon",
        },
      },
    ],
    other: [applyTheme(document, themeConfig), buildSchema(document)].join(
      "\n"
    ),
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  if (!document?.__?.layout) {
    // temporary: guard for generated repo-based static page
    return `static-${Math.floor(Math.random() * (10000 - 1))}`;
  }

  if (document.slug) {
    return document.slug;
  }

  const localePath = document.locale !== "en" ? `${document.locale}/` : "";
  const path = document.address
    ? `${localePath}${document.address.region}/${document.address.city}/${document.address.line1}`
    : `${localePath}${document.id}`;

  return normalizeSlug(path);
};

const Location: Template<TemplateRenderProps> = (props) => {
  const { document } = props;
  // temporary: guard for generated repo-based static page
  if (!document?.__?.layout) {
    return <></>;
  }

  return (
    <AnalyticsProvider
      // @ts-expect-error ts(2304) the api key will be populated
      apiKey={YEXT_PUBLIC_EVENTS_API_KEY}
      templateData={props}
      currency="USD"
    >
      <VisualEditorProvider document={document}>
        <Render config={mainConfig} data={JSON.parse(document.__.layout)} />
      </VisualEditorProvider>
    </AnalyticsProvider>
  );
};

export default Location;
