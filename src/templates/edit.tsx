import {
  Editor,
  usePlatformBridgeDocument,
  usePlatformBridgeEntityFields,
  EntityFieldsProvider,
} from "@yext/visual-editor";

import { componentRegistry } from "../ve.config";
import { GetPath, TemplateProps, TemplateConfig } from "@yext/pages";
import { DocumentProvider } from "@yext/pages/util";

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
  const entityFields = usePlatformBridgeEntityFields();

  return (
    <DocumentProvider value={entityDocument}>
      <EntityFieldsProvider entityFields={entityFields}>
        <Editor
          document={entityDocument}
          componentRegistry={componentRegistry}
        />
      </EntityFieldsProvider>
    </DocumentProvider>
  );
};

export default Edit;
