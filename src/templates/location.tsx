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
import { locationConfig } from "../puck/puck.config";
import { DocumentProvider } from "../hooks/useDocument";
import { getTemplateData } from "../utils/managementApiHelper";

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
      "name",
      "address",
      "slug",
      "c_hero",
      "c_locationHero",
      "c_locationCore",
      "c_visualConfigurations",
      "c_pages_layouts",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

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
