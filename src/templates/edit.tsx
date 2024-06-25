import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "../hooks/useDocument";
import { Editor } from "../puck/editor";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { useEffect, useState, useCallback } from "react";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../components/puck-overrides/LoadingScreen";
import { Toaster } from "../components/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import {
  convertRawMessageToObject,
  Layout,
  MessagePayload,
  VisualConfiguration,
} from "../types/messagePayload";

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

// used to track 'priority' of data, where lower is prioritized
export const enum DataSource {
  Entity = 0,
  LayoutId = 1,
  EntityLayout = 2,
  SiteLayout = 3,
  AnyLayout = 4,
  None = 5,
}

const getPuckData = (messagePayload: MessagePayload): any => {
  console.log("calling getPuckData");

  // get Puck data from the base entity for INDIVIDUAL
  if (messagePayload.entity) {
    if (messagePayload.role === Role.INDIVIDUAL) {
      const entityPuckData = messagePayload.entity.visualConfigurations.find(
        (config: VisualConfiguration) =>
          config.template === messagePayload.templateId
      );

      if (entityPuckData) {
        return entityPuckData.data;
      }
    }
  }

  // validate no shenanigans with the account setup
  messagePayload.layouts.forEach((layout: Layout) => {
    if (
      layout.externalId === messagePayload.externalLayoutId &&
      layout.templateId !== messagePayload.templateId
    ) {
      throw new Error(
        `Mismatch between layout and template: ${messagePayload.externalLayoutId}, ${messagePayload.templateId}`
      );
    }
  });

  // get Puck data from the layout attached to the entity for GLOBAL
  if (messagePayload.role === Role.GLOBAL) {
    const layoutEntity = messagePayload.layouts.find(
      (layout: Layout) => layout.externalId === messagePayload.externalLayoutId
    );

    if (layoutEntity) {
      return layoutEntity.visualConfiguration;
    }
  }

  // get Puck data from the default layout
  const defaultEntity = messagePayload.layouts.find(
    (layout: Layout) => layout.isDefault
  );

  if (defaultEntity) {
    return defaultEntity.visualConfiguration;
  }

  throw new Error("Could not find VisualConfiguration to load");
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

// TODO: Import from Puck once it's exported
export type History<D = any> = {
  id: string;
  data: D;
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [puckData, setPuckData] = useState<any>({}); // json object
  const [histories, setHistories] = useState<History<any>[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [puckConfig, setPuckConfig] = useState<any>();
  const [messagePayload, setMessagePayload] = useState<MessagePayload>();

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
    console.log("calling clearLocalStorage");
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
    console.log("calling clearHistory");
    clearLocalStorage(role, templateId, layoutId, entityId);
    postParentMessage({
      clearLocalChanges: true,
      layoutId: layoutId,
      entityId: entityId,
    });
  };

  const loadPuckDataUsingHistory = useCallback(
    (messagePayload: MessagePayload) => {
      console.log("calling loadPuckDataUsingHistory");
      // Nothing in save_state table, start fresh from Content
      if (!messagePayload.saveState) {
        clearLocalStorage(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        );
        setPuckData(getPuckData(messagePayload));
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
      clearLocalStorage,
      getPuckData,
      getLocalStorageKey,
    ]
  );

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      window.parent.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    console.log("rendering edit.tsx");
  });

  useEffect(() => {
    console.log("mounting edit.tsx");
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

  // get the document
  const { entityDocument } = useEntityDocumentQuery({
    templateId: messagePayload?.templateId,
    entityId: messagePayload?.externalEntityId,
  });
  const document = entityDocument?.response.document;

  const loadingMessage = !puckConfig
    ? "Loading configuration.."
    : !puckData
      ? "Loading data.."
      : !document
        ? "Loading document.."
        : "";

  const isLoading = !document || !puckData || !puckConfig || !messagePayload;

  const progress: number =
    (100 * (!!puckConfig + !!puckData + !!messagePayload + !!document)) / 4;

  if (!mounted || typeof navigator === "undefined") {
    return <></>;
  }

  return (
    <>
      <DocumentProvider value={document}>
        {!isLoading && !!puckData && !!messagePayload ? (
          <>
            <Editor
              selectedTemplate={messagePayload.template}
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
