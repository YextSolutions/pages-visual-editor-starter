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
import { fetchEntities } from "../utils/api";

type Entity = {
  name: string;
  externalId: string;
  internalId: number;
};

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
    let entityId = params.get("entityId");
    if (entityId) {
      return entityId;
    }
  }

  return "";
};

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const [entityId, setEntityId] = useState(getEntityId());
  useEffect(() => {
    async function getEntities() {
      let entities = await fetchEntities();
      if (entities.length > 0) {
        setEntityId(entities[0].externalId);
      }
    }

    if (!entityId) {
      getEntities();
    }
  }, []);

  const { entityDocument } = useEntityDocumentQuery({
    templateId: "location",
    entityId: entityId,
  });
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        <Editor isLoading={!entityDocument} />
      </DocumentProvider>
    </ChakraProvider>
  );
};

export default Edit;
