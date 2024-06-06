import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";
import {
  customHeader,
  customHeaderActions,
} from "../components/puck-overrides/Header";
import { toast } from "sonner";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import { useEffect, useState } from "react";
import { getLocalStorageKey } from "../utils/localStorageHelper";

export type EntityDefinition = {
  name: string;
  externalId: string;
  internalId: number;
};

export type LayoutDefinition = {
  name: string;
  externalId: string;
  internalId: number;
  visualConfiguration: VisualConfiguration;
};

export type VisualConfiguration = {
  template: string;
  data: string;
};

export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
};

export interface EditorProps {
  selectedTemplate: TemplateDefinition;
  entityId: string;
  layoutId: string;
  puckConfig: Config;
  puckData: string;
  role: string;
  isLoading: boolean;
}

export const siteEntityVisualConfigField = "c_visualLayouts",
  pageLayoutVisualConfigField = "c_visualConfiguration",
  pageLayoutTypeId = "ce_pagesLayout",
  baseEntityVisualConfigField = "c_visualConfigurations",
  baseEntityPageLayoutsField = "c_pages_layouts";

// Render Puck editor
export const Editor = ({
  selectedTemplate,
  layoutId,
  entityId,
  puckConfig,
  puckData,
  role,
  isLoading,
}: EditorProps) => {
  const toastId = "toast";
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
      const response = await fetchEntity(entityId);
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
        getLocalStorageKey(role, selectedTemplate.id, layoutId, entityId)
      );
      mutation.mutate({
        entityId: entityId,
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
        getLocalStorageKey(role, selectedTemplate.id, layoutId, entityId)
      );
      mutation.mutate({
        entityId: layoutId,
        body: {
          [pageLayoutVisualConfigField]: visualConfig,
        },
      });
    }
  };

  const change = async (data: Data) => {
    if (isLoading) {
      return;
    }
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    window.localStorage.setItem(
      getLocalStorageKey(role, selectedTemplate.id, layoutId, entityId),
      JSON.stringify(data)
    );
  };
  return (
    <div className="font-lato">
      <Puck
        config={puckConfig}
        data={JSON.parse(puckData)}
        onPublish={(data: Data) => save(data, role)}
        onChange={change}
        overrides={{
          headerActions: ({ children }) =>
            customHeaderActions(
              children,
              selectedTemplate.id,
              layoutId,
              entityId,
              role
            ),
          header: ({ actions }) =>
            customHeader({
              actions: actions,
            }),
        }}
      />
    </div>
  );
};
