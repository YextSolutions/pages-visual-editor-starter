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
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchEntities, fetchTemplates } from "../utils/api";
import { Config } from "@measured/puck";
import { puckConfigs } from "../puck/puck.config";
import { TemplateDefinition } from "../components/puck-overrides/TemplatePicker";
import { EntityDefinition } from "../components/puck-overrides/EntityPicker";

export const config: TemplateConfig = {
  name: "edit",
};
// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const getUrlEntityId = (): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const entityId = params.get("entityId");
    if (entityId) {
      return entityId;
    }
  }
  return "";
};

const getUrlTemplateId = (): string => {
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
  const [templates, setTemplates] = useState<TemplateDefinition[]>();
  const [template, setTemplate] = useState<TemplateDefinition>();
  const [entities, setEntities] = useState<EntityDefinition[]>();
  const [entity, setEntity] = useState<EntityDefinition>();
  const [templateConfig, setTemplateConfig] = useState<Config>();

  const toast = useToast();

  useEffect(() => {
    async function getData() {
      // get templates
      const fetchedTemplates = await fetchTemplates();
      let targetTemplate: TemplateDefinition = fetchedTemplates[0];
      const urlTemplateId = getUrlTemplateId();
      if (urlTemplateId) {
        let found = false;
        fetchedTemplates.forEach((fetchedTemplate: TemplateDefinition) => {
          if (fetchedTemplate.id === urlTemplateId) {
            targetTemplate = fetchedTemplate;
            found = true;
          }
        });
        if (!found) {
          toast({
            status: "error",
            duration: 5000,
            colorScheme: "red",
            position: "top",
            description: `Could not find template with id '${urlTemplateId}'`,
          });
        }
      }
      // get entities
      const fetchedEntities = await fetchEntities(targetTemplate.entityTypes);
      let targetEntity: EntityDefinition = fetchedEntities[0];
      const urlEntityId = getUrlEntityId();
      if (urlEntityId) {
        let found = false;
        fetchedEntities.forEach((fetchedEntity: EntityDefinition) => {
          if (fetchedEntity.externalId === urlEntityId) {
            targetEntity = fetchedEntity;
            found = true;
          }
        });
        if (!found) {
          toast({
            status: "error",
            duration: 5000,
            colorScheme: "red",
            position: "top",
            description: `Could not find entity with id '${urlEntityId}' belonging to template '${targetTemplate.id}'`,
          });
        }
      }
      // get puckConfig from hardcoded map
      const puckConfig = puckConfigs.get(targetTemplate.id);

      setTemplates(fetchedTemplates);
      setTemplate(targetTemplate);
      setEntities(fetchedEntities);
      setEntity(targetEntity);
      setTemplateConfig(puckConfig);
    }
    getData();
  }, []);

  const { entityDocument } = useEntityDocumentQuery({
    templateId: template?.id,
    entityId: entity?.externalId,
  });
  const isLoading =
    !entityDocument?.response.document ||
    !templateConfig ||
    !template ||
    !templates ||
    !entity ||
    !entities;
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        {!isLoading ? (
          <Editor
            selectedEntity={entity}
            entities={entities}
            selectedTemplate={template}
            templates={templates}
            templateConfig={templateConfig}
          />
        ) : (
          <div>Loading configuration...</div>
        )}
      </DocumentProvider>
    </ChakraProvider>
  );
};
export default Edit;
