import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { toast } from "sonner"
import { useEffect } from "react";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import { VisualConfiguration } from "../hooks/useEntity";

export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
};

export interface EditorProps {
  selectedTemplate: TemplateDefinition;
  entityId: string;
  puckConfig: Config;
  puckData: string;
  role: string;
  siteEntityId: string;
}

export const
    siteEntityVisualConfigField = "c_visualLayouts",
    pageLayoutVisualConfigField = "c_visualConfiguration",
    baseEntityVisualConfigField = "c_visualConfigurations",
    baseEntityPageLayoutsField = "c_pages_layouts";

// Render Puck editor
export const Editor = ({
  selectedTemplate,
  entityId,
  puckConfig,
  puckData,
  role,
  siteEntityId,
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
  const save = async (data: Data, role: string) => {
    const templateData = JSON.stringify(data);
    if (role === Role.INDIVIDUAL) {
      // since we are updating a list, we must get the original data, append to it, then push
      const response = await fetchEntity(entityId);
      const entity = response.response;
      const visualConfigs: VisualConfiguration[] = entity[baseEntityVisualConfigField] ?? [];
      const existingTemplate = visualConfigs.find((visualConfig: VisualConfiguration) => visualConfig.template === selectedTemplate.id);
      if (existingTemplate) {
        existingTemplate.data = templateData;
      } else {
        visualConfigs.push({
          template: selectedTemplate.id,
          data: templateData,
        });
      }
      mutation.mutate({
        entityId: entityId,
        body: {
          [baseEntityVisualConfigField]: visualConfigs
        },
      });
    } else if (role === Role.GLOBAL) {
      // for global role, we need to find the Page Layout entity through the Site entity
      const response = await fetchEntity(siteEntityId);
      const siteEntity = response.response;
      // get Page Layouts attached to the Site entity
      const visualConfigIds = siteEntity[siteEntityVisualConfigField];
      for (const visualConfigId of visualConfigIds) {
        const configResponse = await fetchEntity(visualConfigId);
        const config: VisualConfiguration = configResponse.response[pageLayoutVisualConfigField];
        if (config.template === selectedTemplate.id) {
          config.data = templateData;
          mutation.mutate({
            entityId: visualConfigId,
            body: {
              [pageLayoutVisualConfigField]: config
            },
          });
          return;
        }
      }
      // we failed to update a Page Layout with the changes at this point
      throw new Error("Unable to find a page layout for template: " + selectedTemplate.name);
    }
  };

  return (
    <Puck
      config={puckConfig}
      data={JSON.parse(puckData)}
      onPublish={(data: Data) => save(data, role)}
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
