import "@yext/visual-editor/style.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import { Config, Render } from "@measured/puck";
import { locationConfig } from "../ve.config";
import {
  resolveVisualEditorData,
  applyTheme,
  DocumentProvider,
} from "@yext/visual-editor";
import { themeConfig } from "../../theme.config";

export const config = {
  name: "homepage-test",
  stream: {
    $id: "homepage-test-stream",
    filter: {
      entityIds: ["veridian-bank"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "slug",
      "visualConfigurations",
      "pageLayouts.visualConfiguration",
      "name",
    ],
    localization: {
      locales: ["en"],
    },
  },
  additionalProperties: {
    isVETemplate: true,
  },
} as const satisfies TemplateConfig;

export const transformProps = async (data: any) => {
  return resolveVisualEditorData(data, "de-homepage-layout");
};

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
  return document.slug
    ? document.slug
    : `${document.locale}/${document.address.region}/${document.address.city}/${
        document.address.line1
      }-${document.id.toString()}`;
};

const Homapage_Test: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate } = document;
  return (
    <DocumentProvider value={document}>
      <Render config={locationConfig as Config} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Homapage_Test;
