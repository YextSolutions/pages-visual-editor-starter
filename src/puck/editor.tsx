import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { toast } from "sonner"
import { useEffect } from "react";

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
}

// Render Puck editor
export const Editor = ({
  selectedTemplate,
  entityId,
  puckConfig,
  puckData,
}: EditorProps) => {
  const toastId = "toast"
  const mutation = useUpdateEntityMutation();

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
    mutation.mutate({
      entityId: entityId,
      body: { [selectedTemplate.dataField]: templateData },
    });
  };

  return (
    <Puck
      config={puckConfig}
      data={JSON.parse(puckData)}
      onPublish={save}
      overrides={{
        headerActions: ({ children }) => customHeaderActions(children),
        header: ({ actions }) =>
          customHeader({
            actions: actions
          }),
      }}
    />
  );
};
