import { Puck, Data, Config, usePuck, type History } from "@measured/puck";
import "@measured/puck/puck.css";
import { customHeader } from "./components/Header";
import { useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { TemplateMetadata } from "../types/templateMetadata";
import { EntityFieldProvider } from "../components/EntityField";
import { SaveState } from "../types/saveState";
import { PuckInitialHistory } from "../templates/edit";

export interface EditorProps {
  puckConfig: Config;
  puckData: any; // json object
  puckInitialHistory: PuckInitialHistory;
  isLoading: boolean;
  clearHistory: (
    isDevMode: boolean,
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => void;
  templateMetadata: TemplateMetadata;
  saveState: SaveState;
  setSaveState: React.Dispatch<React.SetStateAction<SaveState | undefined>>;
  saveSaveState: (data: any) => void;
  saveVisualConfigData: (data: any) => void;
}

// Render Puck editor
export const Editor = ({
  puckConfig,
  puckData,
  puckInitialHistory,
  isLoading,
  clearHistory,
  templateMetadata,
  saveState,
  setSaveState,
  saveSaveState,
  saveVisualConfigData,
}: EditorProps) => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const historyIndex = useRef<number>(-1);

  /**
   * When the Puck history changes save it to localStorage and send a message
   * to the parent which saves the state to the VES database.
   */
  const handleHistoryChange = useCallback(
    (histories: History[], index: number) => {
      console.log("handle history change");
      console.log("index", index);
      if (
        index !== -1 &&
        historyIndex.current !== index &&
        histories.length > 0
      ) {
        historyIndex.current = index;
        console.log("setting localStorage");
        window.localStorage.setItem(
          getLocalStorageKey(
            templateMetadata.isDevMode,
            templateMetadata.role,
            templateMetadata.templateId,
            templateMetadata.layoutId,
            templateMetadata.entityId
          ),
          JSON.stringify(histories)
        );

        if (templateMetadata.isDevMode) {
          // return;
        }

        console.log("saveState", saveState);
        console.log("histories[index].id", histories[index].id);
        if (saveState?.hash !== histories[index].id) {
          saveSaveState({
            payload: {
              hash: histories[index].id,
              history: JSON.stringify(histories[index].data),
            },
          });
          // setSaveState({
          //   hash: histories[index].id,
          //   history: JSON.stringify(histories[index]),
          // });
        }
      }
    },
    [templateMetadata, getLocalStorageKey]
  );

  const handleClearLocalChanges = () => {
    clearHistory(
      templateMetadata.isDevMode,
      templateMetadata.role,
      templateMetadata.templateId,
      templateMetadata.layoutId,
      templateMetadata.entityId
    );
  };

  const handleSave = async (data: Data) => {
    saveVisualConfigData({
      payload: { visualConfigurationData: JSON.stringify(data) },
    });
  };

  const change = async () => {
    if (isLoading) {
      return;
    }
    if (!canEdit) {
      setCanEdit(true);
      return;
    }
  };

  return (
    <EntityFieldProvider>
      <Puck
        config={puckConfig}
        data={
          (puckData as Partial<Data>) ?? { root: {}, content: [], zones: {} }
        }
        initialHistory={puckInitialHistory}
        onChange={change}
        overrides={{
          header: () => {
            const { appState } = usePuck();
            return customHeader(
              handleClearLocalChanges,
              handleHistoryChange,
              appState.data,
              handleSave,
              templateMetadata.isDevMode
            );
          },
        }}
      />
    </EntityFieldProvider>
  );
};
