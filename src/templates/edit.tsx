import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "../hooks/useDocument";
import { Editor } from "../puck/editor";
import { useEffect, useState, useCallback, useRef } from "react";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../puck/components/LoadingScreen";
import { Toaster } from "../puck/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import {
  convertRawMessageToObject,
  jsonFromEscapedJsonString,
  MessagePayload,
  SaveState,
} from "../types/messagePayload";
import { type History, type Data, type Config } from "@measured/puck";
import { useReceiveMessage, useSendMessageToParent } from "../hooks/useMessage";

export const Role = {
  GLOBAL: "global",
  INDIVIDUAL: "individual",
};

export const config: TemplateConfig = {
  name: "edit",
};

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const TARGET_ORIGINS = [
  "http://localhost",
  "https://dev.yext.com",
  "https://qa.yext.com",
  "https://sandbox.yext.com",
  "https://www.yext.com",
  "https://app-qa.eu.yext.com",
  "https://app.eu.yext.com",
];

type Status = "pending" | "error" | "success";

// Render the editor
const Edit: () => JSX.Element = () => {
  const [puckData, setPuckData] = useState<Data>();
  const [histories, setHistories] = useState<History<any>[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [messagePayload, setMessagePayload] = useState<any>();
  const [visualConfigurationData, setVisualConfigurationData] = useState<any>(); // json data
  const [entityDocument, setEntityDocument] = useState<any>(); // json data
  const [saveState, setSaveState] = useState<SaveState>();

  /**
   * Clears the user's localStorage and resets the current Puck history
   * @param role
   * @param templateId
   * @param layoutId
   * @param entityId
   */
  const clearLocalStorage = (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => {
    setHistories([]);
    setHistoryIndex(-1);
    window.localStorage.removeItem(
      getLocalStorageKey(role, templateId, layoutId, entityId)
    );
  };

  /**
   * Clears localStorage and resets the save data in the DB
   * @param role
   * @param templateId
   * @param layoutId
   * @param entityId
   */
  const clearHistory = (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => {
    clearLocalStorage(role, templateId, layoutId, entityId);
    deleteSaveState({
      payload: {
        clearLocalChanges: true,
        layoutId: layoutId,
        entityId: entityId,
      },
    });
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    loadPuckDataUsingHistory(); // do something after state has updated
  }, [messagePayload, saveState, visualConfigurationData]);

  const loadPuckDataUsingHistory = useCallback(() => {
    if (!visualConfigurationData || !saveState || !messagePayload) {
      return;
    }

    // Nothing in save_state table, start fresh from Content
    if (!saveState) {
      console.log("not using save state");
      clearLocalStorage(
        messagePayload.role,
        messagePayload.templateId,
        messagePayload.layoutId,
        messagePayload.entity?.id
      );
      setPuckData(visualConfigurationData);
      return;
    }

    console.log("using save state");
    console.log("raw history", saveState.History);
    console.log(
      "escaped history",
      jsonFromEscapedJsonString(saveState.History)
    );
    // The history stored has both "ui" and "data" keys, but PuckData
    // is only concerned with the "data" portion.
    setPuckData(jsonFromEscapedJsonString(saveState.History).data); // TODO - fix the payload
    console.log("puck data set");

    // Check localStorage for existing Puck history
    const localHistoryArray = window.localStorage.getItem(
      getLocalStorageKey(
        messagePayload.role,
        messagePayload.templateId,
        messagePayload.layoutId,
        messagePayload.entity?.id
      )
    );

    // No localStorage
    if (!localHistoryArray) {
      console.log("no localStorage");
      return;
    }

    const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
      (item: any) => item.id === saveState?.Hash // TODO - fix the payload
    );

    // If local storage reset Puck history to it
    if (localHistoryIndex !== -1) {
      console.log("resetting histories");
      setHistoryIndex(localHistoryIndex);
      setHistories(JSON.parse(localHistoryArray));
      return;
    }

    console.log("clearing localStorage");
    // otherwise start fresh - this user doesn't have localStorage that reflects the saved state
    clearLocalStorage(
      messagePayload.role,
      messagePayload.templateId,
      messagePayload.layoutId,
      messagePayload.entity?.id
    );
  }, [
    setHistories,
    setHistoryIndex,
    setPuckData,
    clearLocalStorage,
    getLocalStorageKey,
  ]);

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      console.log("posting message", message);
      window.parent.postMessage(message, targetOrigin);
    }
  };

  const { sendToParent: iFrameLoaded } = useSendMessageToParent(
    "iFrameLoaded",
    TARGET_ORIGINS
  );

  useEffect(() => {
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, []);

  useReceiveMessage("getSaveState", TARGET_ORIGINS, (send, payload) => {
    console.log("saveState from parent:", payload);
    setSaveState(payload);
    send({ status: "success", payload: { message: "saveState received" } });
  });

  useReceiveMessage("getEntityDocument", TARGET_ORIGINS, (send, payload) => {
    console.log("getEntityDocument from parent:", payload);
    setEntityDocument(payload);
    send({
      status: "success",
      payload: { message: "getEntityDocument received" },
    });
  });

  useReceiveMessage(
    "getVisualConfigurationData",
    TARGET_ORIGINS,
    (send, payload) => {
      console.log("getVisualConfigurationData from parent:", payload);
      setVisualConfigurationData(
        jsonFromEscapedJsonString(payload.visualConfigurationData)
      );
      send({
        status: "success",
        payload: { message: "getVisualConfigurationData received" },
      });
    }
  );

  useReceiveMessage("getPayload", TARGET_ORIGINS, (send, payload) => {
    console.log("payload from parent:", payload);
    const puckConfig = puckConfigs.get(payload.templateId);
    setPuckConfig(puckConfig);
    setMessagePayload(payload);
    send({ status: "success", payload: { message: "payload received" } });
  });

  const { sendToParent: saveSaveState } = useSendMessageToParent(
    "saveSaveState",
    TARGET_ORIGINS
  );

  const { sendToParent: deleteSaveState } = useSendMessageToParent(
    "deleteSaveState",
    TARGET_ORIGINS
  );

  const isLoading =
    !puckData ||
    !puckConfig ||
    !messagePayload ||
    !entityDocument ||
    !saveState ||
    !visualConfigurationData;

  const progress: number =
    (100 *
      (!!puckConfig +
        !!puckData +
        !!messagePayload +
        !!entityDocument +
        !!saveState +
        !!visualConfigurationData)) /
    6;

  return (
    <>
      {!isLoading ? (
        <DocumentProvider value={entityDocument}>
          <Editor
            selectedTemplateId={messagePayload.templateId}
            puckConfig={puckConfig}
            puckData={puckData}
            role={messagePayload.role}
            isLoading={isLoading}
            postParentMessage={postParentMessage}
            index={historyIndex}
            histories={histories}
            clearHistory={clearHistory}
            messagePayload={messagePayload}
            saveSaveState={saveSaveState}
          />
        </DocumentProvider>
      ) : (
        <LoadingScreen progress={progress} />
      )}
      <Toaster closeButton richColors />
    </>
  );
};

export default Edit;
