import {
  Editor,
  useDocumentProvider,
} from "@yext/visual-editor";
import {componentRegistry} from "../ve.config";
import {GetPath, TemplateProps, TemplateConfig} from "@yext/pages";
import {DocumentProvider} from "@yext/pages/util";
import '@yext/visual-editor/style.css'

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

export const config: TemplateConfig = {
  name: "edit",
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const entityDocument = useDocumentProvider();

  return (
    <DocumentProvider value={entityDocument}>
      <Editor document={entityDocument} componentRegistry={componentRegistry} />
    </DocumentProvider>
  );
};

export default Edit;
