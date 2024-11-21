import {
  applyTheme,
  Editor,
  usePlatformBridgeDocument,
  usePlatformBridgeEntityFields,
  VisualEditorProvider,
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
import { themeConfig } from "../../theme.config";
import tailwindConfig from "../../tailwind.config";

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
  return {
    other: applyTheme(document, themeConfig),
  };
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const entityDocument = usePlatformBridgeDocument();
  const entityFields = usePlatformBridgeEntityFields();

  return (
    <VisualEditorProvider
      document={entityDocument}
      entityFields={entityFields}
      tailwindConfig={tailwindConfig}
    >
      <Editor
        document={entityDocument}
        componentRegistry={componentRegistry}
        themeConfig={themeConfig}
      />
    </VisualEditorProvider>
  );
};

export default Edit;
