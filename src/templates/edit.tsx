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
import { fetchEntities } from "../components/puck-overrides/Ajax";

type Entity = {
  name: string,
  externalId: string,
  internalId: number,
}

export const config: TemplateConfig = {
  name: "edit",
};

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const getEntityId = (): string => {
  if (typeof document !== "undefined") {
    let params = new URL(document.location.toString()).searchParams;
    let entityId = params.get("entityId")
    if (entityId) {
      return entityId
    }
  }

  return ""
}

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const [entity, setEntity] = useState(getEntityId());
  if (!entity) {
    useEffect(() => {
      async function getEntities() {
        let entities = await fetchEntities();
        if (entities.length > 0) {
          setEntity(entities[0].externalId);
        }
      }

      getEntities();
    }, []);
  }

  const { entityDocument } = useEntityDocumentQuery({ templateId: "location", entityId: entity });
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        <Editor isLoading={!entityDocument} />
      </DocumentProvider>
    </ChakraProvider>
  );
};

export default Edit;
