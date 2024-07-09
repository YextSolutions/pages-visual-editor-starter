import { Puck, Data, Config, usePuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { customHeader } from "./components/Header";
import { useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import {
  MessagePayload,
} from "../types/messagePayload";
import { type History } from "../templates/edit";
import { EntityFieldProvider } from "../components/EntityField";

export interface EditorProps {
  selectedTemplateId: string;
  puckConfig: Config;
  puckData: any; // json object
  role: string;
  isLoading: boolean;
  postParentMessage: (args: any) => void;
  histories: Array<{ data: any; id: string }>;
  index: number;
  clearHistory: (
    role: string,
    templateId: string,
    layoutId?: number,
    entityId?: number
  ) => void;
  messagePayload: MessagePayload;
}

// Render Puck editor
export const Editor = ({
  selectedTemplateId,
  puckConfig,
  puckData,
  role,
  isLoading,
  postParentMessage,
  histories,
  index,
  clearHistory,
  messagePayload,
}: EditorProps) => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const historyIndex = useRef<number>(-1);

  const handleHistoryChange = useCallback(
    (histories: History[], index: number) => {
      if (
        index !== -1 &&
        historyIndex.current !== index &&
        histories.length > 0
      ) {
        historyIndex.current = index;

        postParentMessage({
          localChange: true,
          hash: histories[index].id,
          history: JSON.stringify(histories[index].data),
          layoutId: messagePayload.layoutId,
          entityId: messagePayload.entity?.id,
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

      if (index === -1 && historyIndex.current !== index) {
        historyIndex.current = index;

        postParentMessage({
          clearLocalChanges: true,
          layoutId: messagePayload.layoutId,
          entityId: messagePayload.entity?.id,
        });
      }
    },
    [messagePayload, postParentMessage, getLocalStorageKey]
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
    const templateData = JSON.stringify(data);
    postParentMessage({
      saveVisualConfigData: true,
      templateId: selectedTemplateId,
      layoutId: messagePayload.layoutId,
      entityId: messagePayload.entity?.id,
      VisualConfigurationData: templateData
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
