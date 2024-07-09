import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "../hooks/useDocument";
import { Editor } from "../puck/editor";
import { useEffect, useState, useCallback } from "react";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../puck/components/LoadingScreen";
import { Toaster } from "../puck/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import {
  convertRawMessageToObject,
  MessagePayload,
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
  const [parentText, setParentText] = useState<string>("");

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

  const loadPuckDataUsingHistory = useCallback(
    (messagePayload: MessagePayload) => {
      // Nothing in save_state table, start fresh from Content
      if (!messagePayload.saveState) {
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
          throw new Error(
            "An error occurred while fetching visual config data"
          );
        }

        setPuckData(payloadPuckData);
        setPuckDataStatus(payloadPuckDataStatus);
        return;
      }

      // The history stored has both "ui" and "data" keys, but PuckData
      // is only concerned with the "data" portion.
      setPuckData(messagePayload.saveState.history.data);

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
        (item: any) => item.id === messagePayload.saveState?.hash
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
    },
    [
      setHistories,
      setHistoryIndex,
      setPuckData,
      setPuckDataStatus,
      clearLocalStorage,
      getLocalStorageKey,
    ]
  );

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      window.parent.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    const handleParentMessage = (message: MessageEvent) => {
      if (!TARGET_ORIGINS.includes(message.origin)) {
        return;
      }
      if (typeof message.data === "object" && message.data.params) {
        const messagePayloadTemp: MessagePayload = convertRawMessageToObject(
          message.data.params
        );

        const puckConfig = puckConfigs.get(messagePayloadTemp.templateId);
        setPuckConfig(puckConfig);
        setMessagePayload(messagePayloadTemp);
        loadPuckDataUsingHistory(messagePayloadTemp);
      }
    };

    const listenForParentMessages = () => {
      window.addEventListener("message", handleParentMessage);
    };

    setMounted(true);
    listenForParentMessages();
    // is this necessary?
    postParentMessage({ entityId: messagePayload?.externalEntityId });

    return () => {
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  useEffect(() => {
    console.log("iFrameLoaded useEffect");
    const { sendToParent: iFrameLoaded } = useSendMessageToParent(
      "iFrameLoaded",
      TARGET_ORIGINS
    );
    console.log("calling iFrameLoaded");
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, [mounted]);

  // const { sendToParent, status } = useSendMessageToParent(
  //   "bar",
  //   TARGET_ORIGINS
  // );

  useReceiveMessage("foo", TARGET_ORIGINS, (send, payload) => {
    console.log("Message from parent:", payload);
    send({ status: "success", payload: { message: "iframe handled foo" } });
  });

  useReceiveMessage("saveState", TARGET_ORIGINS, (send, payload) => {
    console.log("Message from parent:", payload);
    send({ status: "success", payload: { message: "got saveState data" } });
  });

  const loadingMessage = !puckConfig
    ? "Loading configuration.."
    : !puckData || puckDataStatus === "pending"
      ? "Loading data.."
      : "";

  const isLoading = !puckData || !puckConfig || !messagePayload;

  const progress: number =
    (100 * (!!puckConfig + !!puckData + !!messagePayload)) / 3;

  if (typeof navigator === "undefined") {
    return <></>;
  }

  return (
    <>
      <DocumentProvider value={messagePayload?.entityDocumentData}>
        {/* <div>
          <button
            onClick={() => {
              sendToParent({
                payload: {
                  message: "Hello from iframe",
                  date: new Date().toLocaleString(),
                },
              });
            }}
          >
            SEND TO PARENT
          </button>
        </div>
        <div>Send to parent status: {status}</div> */}

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
