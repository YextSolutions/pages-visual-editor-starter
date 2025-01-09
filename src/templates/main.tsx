import "@yext/visual-editor/style.css";
import {
  Template,
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import { Config, Render } from "@measured/puck";
import { locationConfig } from "../ve.config";
import { applyTheme, VisualEditorProvider } from "@yext/visual-editor";
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
  const localePath = document.locale !== "en" ? `${document.locale}/` : "";
  return document.address
    ? `${localePath}${document.address.region}/${document.address.city}/${
        document.address.line1
      }-${document.id.toString()}`
    : document.id.toString();
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
        <Render
          config={locationConfig as Config}
          data={JSON.parse(document.__.layout)}
        />
      </VisualEditorProvider>
    </AnalyticsProvider>
  );
};

export default Location;
