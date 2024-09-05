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
import { financialprofessionalConfig } from "../ve.config";
import { DocumentProvider } from "@yext/pages/util";
import { resolveVisualEditorData } from "@yext/visual-editor";

export const config: TemplateConfig = {
  name: "financialprofessional",
  stream: {
    $id: "financialprofessional-stream",
    filter: {
      entityTypes: ["financialProfessional"],
    },
    fields: [
      "id",
      "name",
      "slug",
      "c_visualConfigurations",
      "c_pages_layouts.c_visualConfiguration",
    ],
    localization: {
      locales: ["en"],
    },
  },
  additionalProperties: {
    isVETemplate: true,
    isDraft: true,
  }
};

export const transformProps = async (data: TemplateRenderProps) => {
  return resolveVisualEditorData(data, "financialprofessional");
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1"
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ? document.slug : "financialprofessional/" + document.id;
};

const Financialprofessional: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate } = document;
  return (
    <DocumentProvider value={document}>
      <Render config={financialprofessionalConfig as Config} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Financialprofessional;
