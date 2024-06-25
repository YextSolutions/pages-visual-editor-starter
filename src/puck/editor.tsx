import { Puck, Data, Config, usePuck } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import { customHeader } from "../components/puck-overrides/Header";
import { toast } from "sonner";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import { useEffect, useState, useRef, useCallback } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import {
  MessagePayload,
  Template,
  VisualConfiguration,
} from "../types/messagePayload";
import { type History } from "../templates/edit";

export interface EditorProps {
  selectedTemplate: Template;
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
  selectedTemplate,
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

  useEffect(() => {
    console.log("mounting editor.tsx");
  }, []);

  useEffect(() => {
    console.log("rendering editor.tsx");
  });

  const handleHistoryChange = useCallback(
    (histories: History[], index: number) => {
      console.log("calling handleHistoryChange");
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
            selectedTemplate.id,
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
      selectedTemplate.id,
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

  // Save the data to our site entity
  const save = async (data: Data, role: string) => {
    const templateData = JSON.stringify(data);
    if (role === Role.INDIVIDUAL) {
      // since we are updating a list, we must get the original data, append to it, then push
      const response = await fetchEntity(
        messagePayload.entity?.externalId || "" // this should be handled better
      );
      const entity = response.response;
      const visualConfigs: VisualConfiguration[] =
        entity[baseEntityVisualConfigField] ?? [];
      const existingTemplate = visualConfigs.find(
        (visualConfig: VisualConfiguration) =>
          visualConfig.template === selectedTemplate.id
      );
      if (existingTemplate) {
        existingTemplate.data = templateData;
      } else {
        visualConfigs.push({
          template: selectedTemplate.id,
          data: templateData,
        });
      }
      window.localStorage.removeItem(
        getLocalStorageKey(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        )
      );
      mutation.mutate({
        entityId: messagePayload.entity?.externalId || "", // this should be handled better
        body: {
          [baseEntityVisualConfigField]: visualConfigs,
        },
      });
    } else if (role === Role.GLOBAL) {
      // for global role, we save to the layout entity
      const visualConfig: VisualConfiguration = {
        data: templateData,
        template: selectedTemplate.id,
      };
      window.localStorage.removeItem(
        getLocalStorageKey(
          messagePayload.role,
          messagePayload.templateId,
          messagePayload.layoutId,
          messagePayload.entity?.id
        )
      );
      mutation.mutate({
        entityId: messagePayload.externalLayoutId,
        body: {
          [pageLayoutVisualConfigField]: visualConfig,
        },
      });
    }
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

  const handleSave = async (data: Data) => {
    await save(data, role);
  };

  console.log("saved histories", histories);
  console.log("saved histories index", index);

  return (
    <Puck
      config={puckConfig}
      data={puckData as Partial<Data>}
      onPublish={(data: Data) => save(data, role)}
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
