import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useEntity from "../hooks/useEntity";
import { useUpdateEntity } from "../hooks/mutations/useUpdateEntity";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { EntityDefinition } from "../components/puck-overrides/EntityPicker";
import { TemplateDefinition } from "../components/puck-overrides/TemplatePicker";

export interface EditorProps {
  selectedEntity: EntityDefinition;
  entities: EntityDefinition[];
  selectedTemplate: TemplateDefinition;
  templates: TemplateDefinition[];
  siteEntityId: string;
  puckConfig: Config;
  puckData: string;
}

// Render Puck editor
export const Editor = ({
  selectedEntity,
  entities,
  selectedTemplate,
  templates,
  siteEntityId,
  puckConfig,
  puckData,
}: EditorProps) => {
  const { handleUpdateEntity } = useUpdateEntity();

  // Save the data to our site entity
  const save = async (data: Data) => {
    const templateData = JSON.stringify(data);
    handleUpdateEntity({
      entityId: siteEntityId,
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
