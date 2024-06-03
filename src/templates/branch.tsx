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
import { branchConfig } from "../puck/puck.config";
import { DocumentProvider } from "../hooks/useDocument";
import { getTemplatePuckData } from "../utils/puckDataHelper";

export const config: TemplateConfig = {
  name: "ce_branch",
  stream: {
    $id: "branch-stream",
    filter: {
      entityTypes: ["ce_branch"],
    },
    fields: [
      "id",
      "name",
      "slug",
      "c_visualConfigurations",
      "c_pages_layouts.c_visualConfiguration",
      "c_hero",
      "c_advisorBio",
      "c_servicesOffered.servicesOptions.id",
      "c_servicesOffered.servicesOptions.name",
      "c_servicesOffered.servicesOptions.c_description",
      "c_servicesOffered.servicesOptions.c_iconName",
      "c_contentGrid.financialProfessionals.id",
      "c_contentGrid.financialProfessionals.name",
      "c_contentGrid.financialProfessionals.mainPhone",
      "c_contentGrid.financialProfessionals.emails",
      "c_contentGrid.financialProfessionals.c_role",
      "c_contentGrid.financialProfessionals.photoGallery",
      "c_insights.blogs.name",
      "c_insights.blogs.c_category",
      "c_insights.blogs.c_description",
      "c_insights.blogs.datePosted",
      "c_insights.blogs.landingPageUrl",
      "c_insights.blogs.photoGallery",
      "c_locator",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

// Right now financial professional entity data isn't used
export const transformProps = async (data) => {
  const { document } = data;
  const entityConfigurations = document.c_visualConfigurations ?? [];
  const entityLayoutConfigurations = document.c_pages_layouts ?? [];
  const siteLayoutConfigurations = document._site?.c_visualLayouts;
  try {
    const templateData = getTemplatePuckData(
      entityConfigurations,
      entityLayoutConfigurations,
      siteLayoutConfigurations,
      config.name
    );
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
  return document.slug ? document.slug : `branch/${document.id}`;
};

const Branch: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate, name } = document;
  console.log(document);
  return (
    <DocumentProvider value={document}>
      <Render config={branchConfig as Config} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Branch;
