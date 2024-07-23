import { Editor, useReceiveMessage, TARGET_ORIGINS, TemplateMetadata } from "@yext/visual-editor";
import {useState} from "react";
import {Config} from "@measured/puck";
import {puckConfigs} from "../puck/puck.config";

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

export const config: TemplateConfig = {
  name: "edit",
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [entityDocument, setEntityDocument] = useState<any>(); // json data
  const [templateMetadata, setTemplateMetadata] = useState<TemplateMetadata>();

  useReceiveMessage("getEntityDocument", TARGET_ORIGINS, (send, payload) => {
    setEntityDocument(payload);
    send({
      status: "success",
      payload: { message: "getEntityDocument received" },
    });
  });

  useReceiveMessage("getTemplateMetadata", TARGET_ORIGINS, (send, payload) => {
    const puckConfig = puckConfigs.get(payload.templateId);
    setPuckConfig(puckConfig);
    setTemplateMetadata(payload as TemplateMetadata);
    send({ status: "success", payload: { message: "payload received" } });
  });

  return (
    <Editor document={entityDocument} puckConfig={puckConfig!} templateMetadata={templateMetadata!}/>
  );
};

export default Edit;
