import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "@yext/pages/util";
import { Editor } from "../puck/editor";
import { useEffect, useState, useCallback, useRef } from "react";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../puck/components/LoadingScreen";
import { Toaster } from "../puck/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { TemplateMetadata } from "../types/templateMetadata";
import { type History, type Data, type Config } from "@measured/puck";
import { useReceiveMessage, useSendMessageToParent } from "../hooks/useMessage";
import { SaveState } from "../types/saveState";

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

export type PuckInitialHistory = {
  histories: History<any>[];
  index: number;
};

// Render the editor
const Edit: () => JSX.Element = () => {
  const [puckData, setPuckData] = useState<Data>();
  const [puckInitialHistory, setPuckInitialHistory] =
    useState<PuckInitialHistory>({
      histories: [],
      index: -1,
    });
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [templateMetadata, setTemplateMetadata] = useState<TemplateMetadata>();
  const [visualConfigurationData, setVisualConfigurationData] = useState<any>(); // json data
  const [visualConfigurationDataFetched, setVisualConfigurationDataFetched] =
    useState<boolean>(false); // needed because visualConfigurationData can be empty
  const [entityDocument, setEntityDocument] = useState<any>(); // json data
  const [saveState, setSaveState] = useState<SaveState>();
  const [saveStateFetched, setSaveStateFetched] = useState<boolean>(false); // needed because saveState can be empty
  const [devPageSets, setDevPageSets] = useState<any>(undefined);

  useEffect(() => {
    if (templateMetadata?.isDevMode) {
      try {
        setDevPageSets(pageSets); // pageSets is a global variable set by pagesJS
      } catch (ignored) {
        console.warn("pageSets are not defined");
      }
    }
  }, [templateMetadata?.isDevMode]);

  /**
   * Clears the user's localStorage and resets the current Puck history
   * @param isDevMode
   * @param role
   * @param templateId
   * @param layoutId
   * @param entityId
   */
  const clearLocalStorage = (
    isDevMode: boolean,
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => {
    window.localStorage.removeItem(
      getLocalStorageKey(isDevMode, role, templateId, layoutId, entityId)
    );
  };

  /**
   * Clears localStorage and resets the save data in the DB
   * @param isDevMode
   * @param role
   * @param templateId
   * @param layoutId
   * @param entityId
   */
  const clearHistory = (
    isDevMode: boolean,
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => {
    clearLocalStorage(isDevMode, role, templateId, layoutId, entityId);
    deleteSaveState();
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    loadPuckDataUsingHistory(); // do something after state has updated
  }, [templateMetadata, saveState, visualConfigurationData]);

  const loadPuckDataUsingHistory = useCallback(() => {
    if (
      !visualConfigurationDataFetched ||
      !saveStateFetched ||
      !templateMetadata
    ) {
      return;
    }

    if (templateMetadata.isDevMode) {
      // Check localStorage for existing Puck history
      const localHistoryArray = window.localStorage.getItem(
        getLocalStorageKey(
          templateMetadata.isDevMode,
          templateMetadata.role,
          templateMetadata.templateId,
          templateMetadata.layoutId,
          templateMetadata.entityId
        )
      );

      // Use localStorage directly if it exists
      if (localHistoryArray) {
        const localHistories = JSON.parse(localHistoryArray);
        const localHistoryIndex = localHistories.length - 1;
        setPuckInitialHistory({
          histories: localHistories,
          index: localHistoryIndex,
        });
        setPuckData(localHistories[localHistoryIndex].data.data);
        return;
      }

      // Otherwise start from the data saved to Content
      setPuckData(visualConfigurationData);
      return;
    }

    // Nothing in save_state table, start fresh from Content
    if (!saveState) {
      clearLocalStorage(
        templateMetadata.isDevMode,
        templateMetadata.role,
        templateMetadata.templateId,
        templateMetadata.layoutId,
        templateMetadata.entityId
      );

      setPuckData(visualConfigurationData);
      return;
    }

    // The history stored has both "ui" and "data" keys, but PuckData
    // is only concerned with the "data" portion.
    setPuckData(jsonFromEscapedJsonString(saveState.history).data);

    // Check localStorage for existing Puck history
    const localHistoryArray = window.localStorage.getItem(
      getLocalStorageKey(
        templateMetadata.isDevMode,
        templateMetadata.role,
        templateMetadata.templateId,
        templateMetadata.layoutId,
        templateMetadata.entityId
      )
    );

    // No localStorage, start from saveState
    if (!localHistoryArray) {
      return;
    }

    const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
      (item: any) => item.id === saveState?.hash
    );

    // If local storage reset Puck history to it
    if (localHistoryIndex !== -1) {
      setPuckInitialHistory({
        histories: JSON.parse(localHistoryArray),
        index: localHistoryIndex,
      });
      return;
    }

    // otherwise start fresh - this user doesn't have localStorage that reflects the saved state
    clearLocalStorage(
      templateMetadata.isDevMode,
      templateMetadata.role,
      templateMetadata.templateId,
      templateMetadata.layoutId,
      templateMetadata.entityId
    );
  }, [
    setPuckInitialHistory,
    setPuckData,
    clearLocalStorage,
    getLocalStorageKey,
  ]);

  const { sendToParent: iFrameLoaded } = useSendMessageToParent(
    "iFrameLoaded",
    TARGET_ORIGINS
  );

  const { sendToParent: sendDevSaveStateData } = useSendMessageToParent(
    "sendDevSaveStateData",
    TARGET_ORIGINS
  );

  useEffect(() => {
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, []);

  useEffect(() => {
    if (templateMetadata?.isDevMode) {
      const localHistory = window.localStorage.getItem(
        getLocalStorageKey(
          templateMetadata.isDevMode,
          templateMetadata.role,
          templateMetadata.templateId,
          templateMetadata.layoutId,
          templateMetadata.entityId
        )
      );
      const localHistoryArray = localHistory ? JSON.parse(localHistory) : [];
      const historyToSend = JSON.stringify(localHistoryArray.length > 0 ? 
        localHistoryArray[localHistoryArray.length-1].data?.data : {});
        sendDevSaveStateData({ payload: { devSaveStateData: historyToSend } });
    }
  }, [templateMetadata]);

  useReceiveMessage("getSaveState", TARGET_ORIGINS, (send, payload) => {
    setSaveState(payload);
    setSaveStateFetched(true);
    send({ status: "success", payload: { message: "saveState received" } });
  });

  useReceiveMessage("getEntityDocument", TARGET_ORIGINS, (send, payload) => {
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
      setVisualConfigurationData(
        jsonFromEscapedJsonString(payload.visualConfigurationData)
      );
      setVisualConfigurationDataFetched(true);
      send({
        status: "success",
        payload: { message: "getVisualConfigurationData received" },
      });
    }
  );

  useReceiveMessage("getTemplateMetadata", TARGET_ORIGINS, (send, payload) => {
    const puckConfig = puckConfigs.get(payload.templateId);
    setPuckConfig(puckConfig);
    setTemplateMetadata(payload);
    send({ status: "success", payload: { message: "payload received" } });
  });

  const { sendToParent: pushPageSets } = useSendMessageToParent(
      "pushPageSets", TARGET_ORIGINS
  )

  useEffect(() => {
    if (typeof window !== "undefined" && templateMetadata?.isDevMode && devPageSets) {
      pushPageSets({
        payload: devPageSets,
      });
    }
  }, [templateMetadata?.isDevMode, devPageSets]);

  const { sendToParent: saveSaveState } = useSendMessageToParent(
    "saveSaveState",
    TARGET_ORIGINS
  );

  const { sendToParent: deleteSaveState } = useSendMessageToParent(
    "deleteSaveState",
    TARGET_ORIGINS
  );

  const { sendToParent: saveVisualConfigData } = useSendMessageToParent(
    "saveVisualConfigData",
    TARGET_ORIGINS
  );

  const isLoading =
    !puckData ||
    !puckConfig ||
    !templateMetadata ||
    !entityDocument ||
    !saveStateFetched ||
    !visualConfigurationDataFetched;

  const progress: number =
    (100 *
      (!!puckConfig +
        !!puckData +
        !!templateMetadata +
        !!entityDocument +
        saveStateFetched +
        visualConfigurationDataFetched)) /
    6;

  return (
    <>
      {!isLoading ? (
        <DocumentProvider value={entityDocument}>
          <Editor
            puckConfig={puckConfig}
            puckData={puckData}
            isLoading={isLoading}
            puckInitialHistory={puckInitialHistory}
            clearHistory={
              templateMetadata?.isDevMode ? clearLocalStorage : clearHistory
            }
            templateMetadata={templateMetadata}
            saveState={saveState!}
            saveSaveState={saveSaveState}
            saveVisualConfigData={saveVisualConfigData}
            sendDevSaveStateData={sendDevSaveStateData}
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

const jsonFromEscapedJsonString = (escapedJsonString: string) => {
  return JSON.parse(escapedJsonString.replace(/\\"/g, '"'));
};
