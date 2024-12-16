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
// import { buildSchema } from "../utils/buildSchema";

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
    other: applyTheme(document, themeConfig),
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  if (!document?.address?.region) {
    return `static-${Math.floor(Math.random() * (10000 - 1))}`;
  }
  return document.slug
    ? document.slug
    : `${document.locale}/${document.address.region}/${document.address.city}/${
        document.address.line1
      }-${document.id.toString()}`;
};

const Location: Template<TemplateRenderProps> = ({ document }) => {
  if (!document?.__?.layout) {
    return <p>Location static page.</p>;
  }
  return (
    <VisualEditorProvider document={document}>
      <Render config={locationConfig as Config} data={document.__.layout} />
    </VisualEditorProvider>
  );
};

export default Location;
