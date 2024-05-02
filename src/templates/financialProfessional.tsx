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

export const config: TemplateConfig = {
  stream: {
    $id: "financialProfessional-stream",
    filter: {
      savedFilterIds: ["1384352191"],
    },
    fields: [
      "id",
      "name",
      "slug",
      "c_hero",
      "c_advisorBio",
      "c_contentCarousel.title",
      "c_contentCarousel.services.id",
      // "c_contentCarousel.services.entityType",
      "c_contentCarousel.services.name",
      "c_contentCarousel.services.c_description",
      "c_contentCarousel.services.c_iconName",
      "c_contentCarousel.events.id",
      // "c_contentCarousel.events.entityType",
      "c_contentCarousel.events.name",
      "c_contentCarousel.events.c_description",
      "c_contentCarousel.events.c_coverPhoto",
      // "c_contentGrid",
      "c_contentGrid.financialProfessionals.id",
      "c_contentGrid.financialProfessionals.name",
      "c_contentGrid.financialProfessionals.mainPhone",
      "c_contentGrid.financialProfessionals.emails",
      "c_contentGrid.financialProfessionals.c_role",
      "c_contentGrid.financialProfessionals.photoGallery",
      "c_insights.featuredBlogs.name",
      "c_insights.featuredBlogs.c_category",
      "c_insights.featuredBlogs.c_description",
      "c_insights.featuredBlogs.datePosted",
      "c_insights.featuredBlogs.landingPageUrl",
      "c_insights.featuredBlogs.photoGallery",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

// Right now financial professional entity data isn't used
export const transformProps = async (data) => {
  const { document } = data;
  try {
    const visualTemplate = JSON.parse(
      document?._site?.c_financialProfessionalVisualConfiguration
    );
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
  console.log(document);
  return (
    <DocumentProvider value={document}>
      <Render
        config={financialProfessionalConfig as Config}
        data={visualTemplate}
      />
    </DocumentProvider>
  );
};

export default FinancialProfessional;
