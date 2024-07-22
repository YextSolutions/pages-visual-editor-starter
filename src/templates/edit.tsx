import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "../hooks/useDocument";
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

// Render the editor
const Edit: () => JSX.Element = () => {
  const [puckData, setPuckData] = useState<Data>();
  const [histories, setHistories] = useState<History<any>[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [templateMetadata, setTemplateMetadata] = useState<TemplateMetadata>();
  const [visualConfigurationData, setVisualConfigurationData] = useState<any>(); // json data
  const [visualConfigurationDataFetched, setVisualConfigurationDataFetched] =
    useState<boolean>(false); // needed because visualConfigurationData can be empty
  const [entityDocument, setEntityDocument] = useState<any>(); // json data
  const [saveState, setSaveState] = useState<SaveState>();
  const [saveStateFetched, setSaveStateFetched] = useState<boolean>(false); // needed because saveState can be empty

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

    // Nothing in save_state table, start fresh from Content
    if (!saveState) {
      clearLocalStorage(
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
        templateMetadata.role,
        templateMetadata.templateId,
        templateMetadata.layoutId,
        templateMetadata.entityId
      )
    );

    // No localStorage
    if (!localHistoryArray) {
      return;
    }

    const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
      (item: any) => item.id === saveState?.hash
    );

    // If local storage reset Puck history to it
    if (localHistoryIndex !== -1) {
      setHistoryIndex(localHistoryIndex);
      setHistories(JSON.parse(localHistoryArray));
      return;
    }

    // otherwise start fresh - this user doesn't have localStorage that reflects the saved state
    clearLocalStorage(
      templateMetadata.role,
      templateMetadata.templateId,
      templateMetadata.layoutId,
      templateMetadata.entityId
    );
  }, [
    setHistories,
    setHistoryIndex,
    setPuckData,
    clearLocalStorage,
    getLocalStorageKey,
  ]);

  const { sendToParent: iFrameLoaded } = useSendMessageToParent(
    "iFrameLoaded",
    TARGET_ORIGINS
  );

  useEffect(() => {
    iFrameLoaded({ payload: { message: "iFrame is loaded" } });
  }, []);

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
            index={historyIndex}
            histories={histories}
            clearHistory={templateMetadata?.isDevMode ? clearLocalStorage : clearHistory}
            templateMetadata={templateMetadata}
            saveState={saveState}
            saveSaveState={saveSaveState}
            saveVisualConfigData={saveVisualConfigData}
            deleteSaveState={deleteSaveState}
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
