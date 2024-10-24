import {
  applyTheme,
  Editor,
  EntityFieldsProvider,
  usePlatformBridgeDocument,
  usePlatformBridgeEntityFields,
} from "@yext/visual-editor";
import { componentRegistry } from "../ve.config";
import {
  GetPath,
  TemplateProps,
  TemplateConfig,
  HeadConfig,
  TemplateRenderProps,
  GetHeadConfig,
} from "@yext/pages";
import { DocumentProvider } from "@yext/visual-editor";
import { themeConfig } from "../../theme.config";

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

export const config: TemplateConfig = {
  name: "edit",
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  const theme = applyTheme(document, themeConfig);
  console.log(theme);
  return {
    other: theme,
  };
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
