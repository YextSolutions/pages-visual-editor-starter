import "@yext/visual-editor/style.css";
import {
  Template,
  TemplateConfig,
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import {componentRegistry} from "../ve.config";
import {
  applyTheme, Editor,
  VisualEditorProvider,
  YextSchemaField,
} from "@yext/visual-editor";
import { themeConfig } from "../../theme.config";
import { buildSchema } from "../utils/buildSchema";
import tailwindConfig from "../../tailwind.config";
import { devTemplateStream } from "../dev.config";

export const config = {
  name: "dev-location",
  stream: {
    $id: "dev-location-stream",
    filter: {
      entityTypes: ["location"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "slug",
      "name",
      "hours",
      "dineInHours",
      "driveThroughHours",
      "address",
      "yextDisplayCoordinate",
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
      "services",
      "c_deliveryPromo",
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
  const emptyLayout = {
    root: {},
    content: [],
    zones: {},
  };
  const updatedDocument = data;
  if (!updatedDocument.document.__) {
    updatedDocument.document.__ = {};
  }
  updatedDocument.document.__.layout = emptyLayout;

  return updatedDocument;
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
    other: [applyTheme(document, themeConfig), buildSchema(document)].join(
      "\n"
    ),
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  const localePath = document.locale !== "en" ? `${document.locale}/` : "";
  return "dev/" + document.address
      ? `${localePath}${document.address.region}/${document.address.city}/${
          document.address.line1
      }-${document.id.toString()}`
      : `${localePath}${document.id.toString()}`;
};

const Dev: Template<TemplateRenderProps> = (props) => {
  const { document } = props;
  const entityFields = devTemplateStream.stream.schema.fields as unknown as YextSchemaField[];

  return (
      <VisualEditorProvider
          document={document}
          entityFields={entityFields}
          tailwindConfig={tailwindConfig}
      >
        <Editor
            document={document}
            componentRegistry={componentRegistry}
            themeConfig={themeConfig}
            localDev={true}
        />
      </VisualEditorProvider>
  );
};

export default Dev;
