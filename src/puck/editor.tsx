import { Puck, Data, Config, usePuck, type History } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import { customHeader } from "./components/Header";
import { toast } from "sonner";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import { useEffect, useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { MessagePayload, VisualConfiguration } from "../types/messagePayload";

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

export const siteEntityVisualConfigField = "c_visualLayouts",
  pageLayoutVisualConfigField = "c_visualConfiguration",
  pageLayoutTypeId = "ce_pagesLayout",
  baseEntityVisualConfigField = "c_visualConfigurations",
  baseEntityPageLayoutsField = "c_pages_layouts";

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
  const toastId = "toast";
  const mutation = useUpdateEntityMutation();
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

  useEffect(() => {
    if (mutation.isPending) {
      toast("Save in progress...", {
        id: toastId,
      });
    } else if (mutation.isSuccess) {
      toast.success("Save completed.", {
        id: toastId,
      });
    } else if (mutation.isError) {
      toast.error(`Error occured: ${mutation.error.message}`, {
        id: toastId,
      });
    }
  }, [mutation]);

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
  );
};
