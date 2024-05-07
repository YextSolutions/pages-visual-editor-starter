import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { useToast } from "../components/ui/useToast"
import { useEffect } from "react";
import { EntityDefinition } from "../components/puck-overrides/EntityPicker";
import { TemplateDefinition } from "../components/puck-overrides/TemplatePicker";

export interface EditorProps {
  selectedEntity: EntityDefinition;
  entities: EntityDefinition[];
  selectedTemplate: TemplateDefinition;
  templates: TemplateDefinition[];
  entityId: string;
  puckConfig: Config;
  puckData: string;
}

// Render Puck editor
export const Editor = ({
  selectedEntity,
  entities,
  selectedTemplate,
  templates,
  entityId,
  puckConfig,
  puckData,
}: EditorProps) => {
  const mutation = useUpdateEntityMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (mutation.isPending) {
      toast({
        title: "Save in progress...",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    } else if (mutation.isSuccess) {
      toast({
        title: "Save completed.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else if (mutation.isError) {
      toast({
        title: `Error occured: ${mutation.error.message}`,
        status: "error",
        isClosable: true,
      });
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
            actions: actions,
            entity: selectedEntity,
            template: selectedTemplate,
            entities: entities,
            templates: templates,
          }),
      }}
    />
  );
};
