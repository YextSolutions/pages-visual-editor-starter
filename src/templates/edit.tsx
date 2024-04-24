import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor } from "../puck/editor";
import { DocumentProvider } from "../hooks/useDocument";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchEntities, fetchTemplate, fetchTemplates} from "../utils/api";
import { Config } from "@measured/puck";
import {locationConfig, puckConfigs} from "../puck/puck.config";

export const config: TemplateConfig = {
  name: "edit",
};
// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const getEntityId = (): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const entityId = params.get("entityId");
    if (entityId) {
      return entityId;
    }
  }
  return "";
};

const getTemplateId = (): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const templateId = params.get("templateId");
    if (templateId) {
      return templateId;
    }
  }

  return "";
};

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const [entityId, setEntityId] = useState<string>(getEntityId());
  const [templateId, setTemplateId] = useState<string>(getTemplateId());
  const [templateConfig, setTemplateConfig] = useState<Config>();
  useEffect(() => {
    async function getEntities(entityTypes: string[]) {
      const entities = await fetchEntities(entityTypes);
      if (entities.length > 0) {
        setEntityId(entities[0].externalId);
      }
    }

    async function getTemplates() {
      const templates = await fetchTemplates();
      if (templates.length > 0) {
        setTemplateId(templates[0].externalId);
        setTemplateConfig(puckConfigs.get(templates[0].externalId));
        await getEntities([templates[0].externalId]);
      }
    }

    async function getTemplateConfig(templateId: string) {
      const template = await fetchTemplate(templateId);
      setTemplateConfig(puckConfigs.get(template.externalId));
    }

    if (!templateId) {
      getTemplates();
    }
    if (templateId && !entityId) {
      getEntities([templateId]);
    }
    if (templateId && !templateConfig) {
      getTemplateConfig(templateId);
    }
  }, []);

  const { entityDocument } = useEntityDocumentQuery({
    templateId: templateId,
    entityId: entityId,
  });
  const isLoading = !entityDocument?.response.document || !templateConfig;
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        {!isLoading ? (
          <Editor templateId={templateId} entityId={entityId} templateConfig={templateConfig} />
        ) : (
          <div>Loading configuration...</div>
        )}
      </DocumentProvider>
    </ChakraProvider>
  );
};
export default Edit;
