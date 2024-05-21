import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { toast } from "sonner"
import { useEffect, useState } from "react";

export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
  dataField: string;
};

export interface EditorProps {
  selectedTemplate: TemplateDefinition;
  entityId: string;
  puckConfig: Config;
  puckData: string;
  role: string;
  isLoading: boolean;
}

// Render Puck editor
export const Editor = ({
  selectedTemplate,
  entityId,
  puckConfig,
  puckData,
  role,
  isLoading,
}: EditorProps) => {
  const toastId = "toast"
  const mutation = useUpdateEntityMutation();
  const [canEdit, setCanEdit] = useState<boolean>(false);


  useEffect(() => {
    if (mutation.isPending) {
      toast("Save in progress...", {
        id: toastId,
      });
    } else if (mutation.isSuccess) {
      toast.success("Save completed.", {
        id: toastId,
      })
    } else if (mutation.isError) {
      toast.error(`Error occured: ${mutation.error.message}`, {
        id: toastId,
      })
    }
  }, [mutation]);

  // Save the data to our site entity
  const save = async (data: Data) => {
    const templateData = JSON.stringify(data);
    window.localStorage.removeItem(role + selectedTemplate.id);
    mutation.mutate({
      entityId: entityId,
      body: { [selectedTemplate.dataField]: templateData },
    });
  };

  const change = async (data: Data) => {
    if (isLoading) {
      return
    }
    if (!canEdit) {
      setCanEdit(true);
      return
    }
      
    window.localStorage.setItem(role + selectedTemplate.id, JSON.stringify(data));
  };

  return (
    <Puck
      config={puckConfig}
      data={JSON.parse(puckData)}
      onPublish={save}
      onChange={change}
      overrides={{
        headerActions: ({ children }) => customHeaderActions(children, selectedTemplate.id, role),
        header: ({ actions }) =>
          customHeader({
            actions: actions
          }),
      }}
    />
  );
};
