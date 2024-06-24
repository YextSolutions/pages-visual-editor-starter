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
  JSONValue,
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
    console.log("has entity");
    if (messagePayload.role === Role.INDIVIDUAL) {
      console.log("has individual");
      const entityPuckData = messagePayload.entity.visualConfigurations.find(
        (config: VisualConfiguration) =>
          config.template === messagePayload.templateId
      );

      if (entityPuckData) {
        console.log("has entity data");
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
  console.log("passed validaton");

  // get Puck data from the layout attached to the entity for GLOBAL
  if (messagePayload.role === Role.GLOBAL) {
    console.log("has global");
    const layoutEntity = messagePayload.layouts.find(
      (layout: Layout) => layout.externalId === messagePayload.externalLayoutId
    );

    if (layoutEntity) {
      console.log("has layout data");
      return layoutEntity.visualConfiguration;
    }
  }

  // get Puck data from the default layout
  const defaultEntity = messagePayload.layouts.find(
    (layout: Layout) => layout.isDefault
  );

  if (defaultEntity) {
    console.log("has default data", defaultEntity.visualConfiguration);
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

// Render the editor
const Edit: () => JSX.Element = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [puckData, setPuckData] = useState<JSONValue>({});
  const [histories, setHistories] = useState<Array<any>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [puckConfig, setPuckConfig] = useState<any>();
  const [messagePayload, setMessagePayload] = useState<MessagePayload>();

  const clearHistory = (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => {
    console.log("clearHistory save: layout, entity", layoutId, entityId);
    // setHistories([]);
    // setHistoryIndex(-1);
    // postParentMessage({
    //   clearLocalChanges: true,
    //   layoutId: layoutId,
    //   entityId: entityId,
    // });
    // window.localStorage.removeItem(
    //   getLocalStorageKey(role, templateId, layoutId, entityId)
    // );
  };

  const loadPuckDataUsingHistory = useCallback(
    (messagePayload: MessagePayload) => {
      console.log("calling loadPuckDataUsingHistory");
      // nothing in save_state table, start fresh from Content
      if (!messagePayload.saveState) {
        console.log("no saveState from DB");
        clearHistory(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        );
        setPuckData(getPuckData(messagePayload));
        return;
      }

      const localHistoryArray = window.localStorage.getItem(
        getLocalStorageKey(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        )
      );

      // nothing in localStorage, start fresh from VES data
      if (!localHistoryArray) {
        console.log("no localStorage");
        clearHistory(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        );
        setPuckData(messagePayload.saveState.history);
        return;
      }

      const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
        (item: any) => item.id === messagePayload.saveState?.hash
      );

      // if we have VES data, use it for current puck data
      console.log("has saveState from db");
      setPuckData(messagePayload.saveState.history);

      // if saved history in local storage, use that for future/past
      if (localHistoryIndex !== -1) {
        console.log("found the index");
        setHistoryIndex(localHistoryIndex);
        setHistories(JSON.parse(localHistoryArray));
        return;
      }
      // otherwise start fresh
      console.log("start over");
      clearHistory(
        messagePayload.role,
        messagePayload.templateId,
        messagePayload.layoutId,
        messagePayload.entity?.id
      );
    },
    [setHistories, setHistoryIndex, setPuckData, clearHistory, getPuckData]
  );

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      window.parent.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    console.log("remounting edit.tsx");
    const handleParentMessage = (message: MessageEvent) => {
      if (!TARGET_ORIGINS.includes(message.origin)) {
        return;
      }
      if (typeof message.data === "object" && message.data.params) {
        console.log("message payload raw", message);
        const messagePayloadTemp: MessagePayload = convertRawMessageToObject(
          message.data.params
        );

        const puckConfig = puckConfigs.get(messagePayloadTemp.templateId);
        setPuckConfig(puckConfig);
        setMessagePayload(messagePayloadTemp);
        loadPuckDataUsingHistory(messagePayloadTemp);
        console.log("messagePayloadTemp", messagePayloadTemp);
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
