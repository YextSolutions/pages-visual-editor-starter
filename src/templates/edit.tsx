import {
  Editor,
  EntityFieldsProvider,
  usePlatformBridgeDocument,
  usePlatformBridgeEntityFields,
} from "@yext/visual-editor";
import { componentRegistry } from "../ve.config";
import { GetPath, TemplateProps, TemplateConfig } from "@yext/pages";
import { DocumentProvider } from "@yext/pages/util";
import { themeConfig } from "../../theme.config";

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
          themeConfig={themeConfig}
        />
      </EntityFieldsProvider>
    </DocumentProvider>
  );
};

export default Edit;
