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
import { officeConfig } from "../puck/puck.config";
import { DocumentProvider } from "../hooks/useDocument";

export const config: TemplateConfig = {
  stream: {
    $id: "office-stream",
    filter: {
      entityTypes: ["ce_office"],
    },
    fields: [
      "id",
      "uid",
      "name",
      "address",
      "slug",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

// Right now location entity data isn't used
export const transformProps = async (data) => {
  const { document } = data;
  try {
    const visualTemplate = JSON.parse(document?._site?.c_templateVisualConfiguration);
    return {
      ...data,
      document: {
        ...document,
        visualTemplate,
      },
    }
  } catch (error) {
    console.error("Failed to parse visualTemplate: " + error);
    return data;
  }
}

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

const Office: Template<TemplateRenderProps> = ({ document }) => {
  const { visualTemplate } = document;
  return (
    <DocumentProvider value={document}>
      <Render config={officeConfig as Config} data={visualTemplate}/>
    </DocumentProvider>
  );
};

export default Office;
