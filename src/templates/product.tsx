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
import { productConfig } from "../puck/puck.config";
import { DocumentProvider } from "../hooks/useDocument";
import { getTemplateData } from "../utils/managementApiHelper";

export const config: TemplateConfig = {
  name: "product",
  stream: {
    $id: "product-stream",
    filter: {
      entityTypes: ["product"],
    },
    fields: [
      "id", 
      "name", 
      "price", 
      "slug",
      "c_visualConfigurations",
      "c_pages_layouts",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

// Right now product entity data isn't used
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
  return `product/${document.slug || document.name || document.id}`;
};

const Product: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate, price } = document;
  return (
    <DocumentProvider value={document}>
      <div>
        This is the page for a ${Number.parseFloat(price.value).toFixed(2)}{" "}
        {document.name}
      </div>
      <Render config={productConfig as Config} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Product;
