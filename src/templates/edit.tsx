import { Editor, usePlatformBridgeDocument } from "@yext/visual-editor";
import { GetPath, TemplateProps, TemplateConfig } from "@yext/pages";
import { DocumentProvider } from "@yext/pages/util";
import "@yext/visual-editor/style.css";
import { veConfigs } from "../ve.config";

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

export const config: TemplateConfig = {
  name: "edit",
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const entityDocument = usePlatformBridgeDocument();

  return (
    <DocumentProvider value={entityDocument}>
      <Editor document={entityDocument} componentRegistry={veConfigs} />
    </DocumentProvider>
  );
};

export default Edit;
