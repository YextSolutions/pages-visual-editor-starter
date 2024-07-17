import { Puck, Data, Config, usePuck, type History } from "@measured/puck";
import "@measured/puck/puck.css";
import { customHeader } from "./components/Header";
import { useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { TemplateMetadata } from "../types/templateMetadata";
import { EntityFieldProvider } from "../components/EntityField";
import { SaveState } from "../types/saveState";

export interface EditorProps {
  puckConfig: Config;
  puckData: any; // json object
  isLoading: boolean;
  histories: Array<{ data: any; id: string }>;
  index: number;
  clearHistory: (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => void;
  templateMetadata: TemplateMetadata;
  saveState: SaveState;
  saveSaveState: (data: any) => void;
  saveVisualConfigData: (data: any) => void;
  deleteSaveState: () => void;
}

// Render Puck editor
export const Editor = ({
  puckConfig,
  puckData,
  isLoading,
  histories,
  index,
  clearHistory,
  templateMetadata,
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

        if (saveState.hash !== histories[index].id) {
          saveSaveState({
            payload: {
              hash: histories[index].id,
              history: JSON.stringify(histories[index].data),
            },
          });

          window.localStorage.setItem(
            getLocalStorageKey(
              templateMetadata.role,
              templateMetadata.templateId,
              templateMetadata.layoutId,
              templateMetadata.entityId
            ),
            JSON.stringify(histories)
          );
        }
      }

      if (index === -1 && historyIndex.current !== index) {
        historyIndex.current = index;

        deleteSaveState();
      }
    },
    [templateMetadata, getLocalStorageKey]
  );

  const handleClearLocalChanges = () => {
    clearHistory(
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
