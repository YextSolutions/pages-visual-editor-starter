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
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { fetchEntities, fetchTemplates } from "../utils/api";
import { Config } from "@measured/puck";
import { locationConfig } from "../puck/puck.config";

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
    const entityId = params.get("entityId")
    if (entityId) {
      return entityId
    }
  }

  return ""
}

const getTemplateId = (): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const templateId = params.get("templateId")
    if (templateId) {
      return templateId
    }
  }

  return ""
}

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const [entityId, setEntityId] = useState<string>(getEntityId());
  const [templateId, setTemplateId] = useState<string>(getTemplateId());
  const [templateConfig, setTemplateConfig ] = useState<Config>(locationConfig);
  useEffect(() => {
    async function getEntities() {
      const entities = await fetchEntities();
      if (entities.length > 0) {
        setEntityId(entities[0].externalId);
      }
    }

    async function getTemplates() {
      const templates = await fetchTemplates();
      if (templates.length > 0) {
        setTemplateId(templates[0].externalId);
        setTemplateConfig(templates[0].templateConfig);
      }
    }

    if (!entityId) {
      getEntities();
    }
    if (!templateId) {
      getTemplates();
    }
  }, []);

  const { entityDocument } = useEntityDocumentQuery({ templateId: templateId, entityId: entityId });
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        <Editor isLoading={!entityDocument} templateConfig={locationConfig}/>
      </DocumentProvider>
    </ChakraProvider>
  );
};

export default Edit;
