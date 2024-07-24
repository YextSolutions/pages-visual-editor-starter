import {
  Editor,
  useReceiveMessage,
  TARGET_ORIGINS,
  TemplateMetadata,
  useSendMessageToParent
} from "@yext/visual-editor";
import {useEffect, useState} from "react";
import {Config} from "@measured/puck";
import {puckConfigs} from "../puck/puck.config";
import {GetPath, TemplateProps, TemplateConfig} from "@yext/pages";

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

  const { sendToParent: iFrameLoaded } = useSendMessageToParent(
      "iFrameLoaded",
      TARGET_ORIGINS
  );

  useEffect(() => {
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, []);

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

  useEffect(() => {
    console.log(entityDocument);
  }, [entityDocument])

  return (
      !entityDocument || !templateMetadata || !puckConfig?
      <p>loading</p>:
      <Editor document={entityDocument} puckConfig={puckConfig!} templateMetadata={templateMetadata!}/>
  );
};

export default Edit;
