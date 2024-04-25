import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useEntity from "../hooks/useEntity";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { EntityDefinition } from "../components/puck-overrides/EntityPicker";
import { TemplateDefinition } from "../components/puck-overrides/TemplatePicker";
const siteEntityId = "site";

export interface EditorProps {
  selectedEntity: EntityDefinition;
  entities: EntityDefinition[];
  selectedTemplate: TemplateDefinition;
  templates: TemplateDefinition[];
  templateConfig: Config;
}

// Render Puck editor
export const Editor = ({
  selectedEntity,
  entities,
  selectedTemplate,
  templates,
  templateConfig,
}: EditorProps) => {
  const mutation = useUpdateEntityMutation();
  const toast = useToast();

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
      entityId: siteEntityId,
      body: { [selectedTemplate.dataField]: templateData },
    });
  };

  // Fetch the data from our site entity
  const { entity: siteEntity } = useEntity(siteEntityId);
  return (
    <>
      {siteEntity?.response?.[selectedTemplate.dataField] ? (
        <Puck
          config={templateConfig}
          data={JSON.parse(siteEntity?.response?.[selectedTemplate.dataField])}
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
      ) : (
        <>Loading document...</>
      )}
    </>
  );
};
