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
import { DocumentProvider } from "@yext/pages/util";
import { Config, Render } from "@measured/puck";
import { locationConfig } from "../puck/puck.config";
import { getTemplatePuckData } from "../utils/puckDataHelper";

export const config: TemplateConfig = {
  name: "location",
  stream: {
    $id: "location-stream",
    filter: {
      entityTypes: ["location"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "slug",
      "c_visualConfigurations",
      "c_pages_layouts.c_visualConfiguration",
      "name",
      "hours",
      "address",
      "c_productSection.sectionTitle",
      "c_productSection.linkedProducts.name",
      "c_productSection.linkedProducts.c_productPromo",
      "c_productSection.linkedProducts.c_description",
      "c_productSection.linkedProducts.c_coverPhoto",
      "c_productSection.linkedProducts.c_productCTA",
      "c_hero",
      "c_faqSection.linkedFAQs.question",
      "c_faqSection.linkedFAQs.answerV2",
      "additionalHoursText",
      "mainPhone",
      "emails",
      "c_deliveryPromo",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

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
      config.name,
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
  return document.slug
    ? document.slug
    : `${document.locale}/${document.address.region}/${document.address.city}/${
        document.address.line1
      }-${document.id.toString()}`;
};

const Location: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate } = document;
  return (
    <DocumentProvider value={document}>
      <Render config={locationConfig as Config} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Location;
