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

  return "cafe"
} 

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const { entityDocument } = useEntityDocumentQuery({ templateId: "location", entityId: getEntityId()});
  return (
    <ChakraProvider>
      <DocumentProvider value={entityDocument?.response.document}>
        <Editor isLoading={!entityDocument}/>
      </DocumentProvider> 
    </ChakraProvider>
  );
};

export default Edit;
