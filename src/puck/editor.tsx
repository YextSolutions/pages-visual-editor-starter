import { Puck, Data, Config, usePuck, type History } from "@measured/puck";
import "@measured/puck/puck.css";
import { customHeader } from "./components/Header";
import { useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { MessagePayload, SaveState } from "../types/messagePayload";
import { EntityFieldProvider } from "../components/EntityField";

export interface EditorProps {
  selectedTemplateId: string;
  puckConfig: Config;
  puckData: any; // json object
  role: string;
  isLoading: boolean;
  histories: Array<{ data: any; id: string }>;
  index: number;
  clearHistory: (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => void;
  messagePayload: MessagePayload;
  saveState: SaveState;
  saveSaveState: (data: any) => void;
  saveVisualConfigData: (data: any) => void;
  deleteSaveState: () => void;
}

// Render Puck editor
export const Editor = ({
  selectedTemplateId,
  puckConfig,
  puckData,
  role,
  isLoading,
  histories,
  index,
  clearHistory,
  messagePayload,
  saveState,
  saveSaveState,
  saveVisualConfigData,
  deleteSaveState,
}: EditorProps) => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const historyIndex = useRef<number>(-1);

  /**
   * When the Puck history changes save it to localStorage and set a message
   * to the parent which saves the state to the VES database.
   */
  const handleHistoryChange = useCallback(
    (histories: History[], index: number) => {
      if (
        index !== -1 &&
        historyIndex.current !== index &&
        histories.length > 0
      ) {
        historyIndex.current = index;

        console.log("saveState hash", saveState.hash);

        if (saveState.hash !== histories[index].id) {
          console.log("SAVING STATE");
          saveSaveState({
            payload: {
              hash: histories[index].id,
              history: JSON.stringify(histories[index].data),
            },
          });

          window.localStorage.setItem(
            getLocalStorageKey(
              role,
              selectedTemplateId,
              messagePayload.layoutId,
              messagePayload.entity?.id
            ),
            JSON.stringify(histories)
          );
        }
      }
      console.log("NOT SAVING STATE");
      if (index === -1 && historyIndex.current !== index) {
        console.log("DELETING SAVING STATE");
        historyIndex.current = index;

        deleteSaveState();
      }
    },
    [messagePayload, getLocalStorageKey]
  );

  const handleClearLocalChanges = () => {
    clearHistory(
      messagePayload.role,
      selectedTemplateId,
      messagePayload.layoutId,
      messagePayload.entity?.id
    );
  };

  const handleSave = async (data: Data) => {
    console.log("handle save", data);
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
        data={puckData as Partial<Data>}
        initialHistory={
          index === -1 ? undefined : { histories: histories, index: index }
        }
        onChange={change}
        overrides={{
          header: () => {
            const { appState } = usePuck();
            return customHeader(
              handleClearLocalChanges,
              handleHistoryChange,
              appState.data,
              handleSave
            );
          },
        }}
      />
    </EntityFieldProvider>
  );
};
