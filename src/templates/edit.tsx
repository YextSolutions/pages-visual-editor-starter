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
import { type History } from "@measured/puck";
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

// Render the editor
const Edit: () => JSX.Element = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [puckData, setPuckData] = useState<any>({}); // json object
  const [puckDataStatus, setPuckDataStatus] = useState<
    "successful" | "pending" | "error"
  >("pending");
  const [histories, setHistories] = useState<History<any>[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [puckConfig, setPuckConfig] = useState<any>();
  const [messagePayload, setMessagePayload] = useState<MessagePayload>();
  const [saveState, setSaveState] = useState<SaveState>("");

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
    postParentMessage({
      clearLocalChanges: true,
      layoutId: layoutId,
      entityId: entityId,
    });
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    loadPuckDataUsingHistory(); // do something after state has updated
  }, [messagePayload, saveState]);

  const loadPuckDataUsingHistory = () => {
    if (!messagePayload || !saveState) {
      return;
    }

    if (!saveState) {
      console.log("not using save state");
      clearLocalStorage(
        messagePayload.role,
        messagePayload.templateId,
        messagePayload.layoutId,
        messagePayload.entity?.id
      );
      const payloadPuckData = messagePayload?.visualConfigurationData;
      const payloadPuckDataStatus =
        messagePayload?.visualConfigurationDataStatus;
      if (!payloadPuckData && payloadPuckDataStatus === "successful") {
        throw new Error("Could not find VisualConfiguration to load");
      }
      if (payloadPuckDataStatus === "error") {
        throw new Error("An error occurred while fetching visual config data");
      }

      setPuckData(payloadPuckData);
      setPuckDataStatus(payloadPuckDataStatus);
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
      return;
    }

    const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
      (item: any) => item.id === saveState?.Hash // TODO - fix the payload
    );

    // If local storage reset Puck history to it
    if (localHistoryIndex !== -1) {
      setHistoryIndex(localHistoryIndex);
      setHistories(JSON.parse(localHistoryArray));
      return;
    }

    // otherwise start fresh - this user doesn't have localStorage that reflects the saved state
    clearLocalStorage(
      messagePayload.role,
      messagePayload.templateId,
      messagePayload.layoutId,
      messagePayload.entity?.id
    );
  };

  // const loadPuckDataUsingHistory = useCallback(
  //   (messagePayload: MessagePayload) => {
  //     // Nothing in save_state table, start fresh from Content
  //     if (!saveState) {
  //       console.log("not using save state");
  //       clearLocalStorage(
  //         messagePayload.role,
  //         messagePayload.templateId,
  //         messagePayload.layoutId,
  //         messagePayload.entity?.id
  //       );
  //       const payloadPuckData = messagePayload?.visualConfigurationData;
  //       const payloadPuckDataStatus =
  //         messagePayload?.visualConfigurationDataStatus;
  //       if (!payloadPuckData && payloadPuckDataStatus === "successful") {
  //         throw new Error("Could not find VisualConfiguration to load");
  //       }
  //       if (payloadPuckDataStatus === "error") {
  //         throw new Error(
  //           "An error occurred while fetching visual config data"
  //         );
  //       }

  //       setPuckData(payloadPuckData);
  //       setPuckDataStatus(payloadPuckDataStatus);
  //       return;
  //     }

  //     console.log("using save state");
  //     console.log("raw history", saveState.History);
  //     console.log(
  //       "escaped history",
  //       jsonFromEscapedJsonString(saveState.History)
  //     );
  //     // The history stored has both "ui" and "data" keys, but PuckData
  //     // is only concerned with the "data" portion.
  //     setPuckData(jsonFromEscapedJsonString(saveState.History).data); // TODO - fix the payload

  //     // Check localStorage for existing Puck history
  //     const localHistoryArray = window.localStorage.getItem(
  //       getLocalStorageKey(
  //         messagePayload.role,
  //         messagePayload.templateId,
  //         messagePayload.layoutId,
  //         messagePayload.entity?.id
  //       )
  //     );

  //     // No localStorage
  //     if (!localHistoryArray) {
  //       return;
  //     }

  //     const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
  //       (item: any) => item.id === saveState?.Hash // TODO - fix the payload
  //     );

  //     // If local storage reset Puck history to it
  //     if (localHistoryIndex !== -1) {
  //       setHistoryIndex(localHistoryIndex);
  //       setHistories(JSON.parse(localHistoryArray));
  //       return;
  //     }

  //     // otherwise start fresh - this user doesn't have localStorage that reflects the saved state
  //     clearLocalStorage(
  //       messagePayload.role,
  //       messagePayload.templateId,
  //       messagePayload.layoutId,
  //       messagePayload.entity?.id
  //     );
  //   },
  //   [
  //     setHistories,
  //     setHistoryIndex,
  //     setPuckData,
  //     setPuckDataStatus,
  //     clearLocalStorage,
  //     getLocalStorageKey,
  //   ]
  // );

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      window.parent.postMessage(message, targetOrigin);
    }
  };

  // useEffect(() => {
  //   const handleParentMessage = (message: MessageEvent) => {
  //     if (!TARGET_ORIGINS.includes(message.origin)) {
  //       return;
  //     }
  //     if (typeof message.data === "object" && message.data.params) {
  //       const messagePayloadTemp: MessagePayload = convertRawMessageToObject(
  //         message.data.params
  //       );

  //       const puckConfig = puckConfigs.get(messagePayloadTemp.templateId);
  //       setPuckConfig(puckConfig);
  //       setMessagePayload(messagePayloadTemp);
  //       loadPuckDataUsingHistory(messagePayloadTemp);
  //     }
  //   };

  //   const listenForParentMessages = () => {
  //     window.addEventListener("message", handleParentMessage);
  //   };

  //   setMounted(true);
  //   listenForParentMessages();
  //   // is this necessary?
  //   postParentMessage({ entityId: messagePayload?.entity?.id });

  //   return () => {
  //     window.removeEventListener("message", handleParentMessage);
  //   };
  // }, []);

  const { sendToParent: iFrameLoaded } = useSendMessageToParent(
    "iFrameLoaded",
    TARGET_ORIGINS
  );

  useEffect(() => {
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, []);

  useReceiveMessage("saveState", TARGET_ORIGINS, (send, payload) => {
    console.log("saveState from parent:", payload);
    setSaveState(payload);
    send({ status: "success", payload: { message: "saveState received" } });
  });

  useReceiveMessage("payload", TARGET_ORIGINS, (send, payload) => {
    console.log("payload from parent:", payload);
    const messagePayloadTemp: MessagePayload =
      convertRawMessageToObject(payload);
    console.log("payload after convert", messagePayloadTemp);

    const puckConfig = puckConfigs.get(messagePayloadTemp.templateId);
    setPuckConfig(puckConfig);
    setMessagePayload(messagePayloadTemp);
    send({ status: "success", payload: { message: "payload received" } });
  });

  const loadingMessage = !puckConfig
    ? "Loading configuration.."
    : !puckData || puckDataStatus === "pending"
      ? "Loading data.."
      : "";

  const isLoading = !puckData || !puckConfig || !messagePayload || !saveState;

  const progress: number =
    (100 * (!!puckConfig + !!puckData + !!messagePayload)) / 3;

  if (typeof navigator === "undefined") {
    return <></>;
  }

  return (
    <>
      <DocumentProvider value={messagePayload?.entityDocumentData}>
        {!isLoading ? (
          <>
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
            />
          </>
        ) : (
          <LoadingScreen progress={progress} message={loadingMessage} />
        )}
      </DocumentProvider>
      <Toaster closeButton richColors />
    </>
  );
};

export default Edit;
