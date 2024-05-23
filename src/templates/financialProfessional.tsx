import "../index.css";
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
import { financialProfessionalConfig } from "../puck/puck.config";
import { DocumentProvider } from "../hooks/useDocument";
import { getTemplateData } from "../utils/managementApiHelper";

export const config: TemplateConfig = {
  name: "financialProfessional",
  stream: {
    $id: "financialProfessional-stream",
    filter: {
      entityTypes: ["financialProfessional"],
    },
    fields: [
      "id", 
      "name", 
      "slug",
      "c_visualConfigurations",
      "c_pages_layouts",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

// Right now financial professional entity data isn't used
export const transformProps = async (data) => {
  const { document } = data;
  const entityVisualConfigurations = document.c_visualConfigurations ?? [];
  const entityLayoutIds = document.c_pages_layouts ?? [];
  const siteLayoutIds = document._site?.c_visualLayouts ?? [];
  try {
    const templateData = await getTemplateData(entityVisualConfigurations, entityLayoutIds, siteLayoutIds, config.name);
    const visualTemplate = JSON.parse(templateData);
    return {
      ...data,
      document: {
        ...document,
        visualTemplate,
      },
    };
  } catch (error) {
    console.error("Failed to parse visualTemplate: " + error);
    return data;
  }
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
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return `financialProfessional/${document.slug || document.name || document.id}`;
};

const FinancialProfessional: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate, name } = document;
  return (
    <DocumentProvider value={document}>
      <div>Welcome to the professional page for {name}!</div>
      <Render
        config={financialProfessionalConfig as Config}
        data={visualTemplate}
      />
    </DocumentProvider>
  );
};

export default FinancialProfessional;
