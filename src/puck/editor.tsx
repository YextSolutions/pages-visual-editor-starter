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

const siteEntityId = "site";

export interface EditorProps {
  entityType?: string;
  templateConfig: Config;
}

// Render Puck editor
export const Editor = ({ templateConfig }: EditorProps) => {
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
    const c_templateVisualConfiguration = JSON.stringify(data);
    mutation.mutate({
      entityId: siteEntityId,
      body: { c_templateVisualConfiguration },
    });
  };

  // Fetch the data from our site entity
  const { entity } = useEntity(siteEntityId);
  return (
    <>
      {entity?.response?.c_templateVisualConfiguration ? (
        <Puck
          config={templateConfig as Config}
          data={JSON.parse(entity?.response?.c_templateVisualConfiguration)}
          onPublish={save}
          overrides={{
            headerActions: ({ children }) => customHeaderActions(children),
            header: ({ actions }) => customHeader(actions),
          }}
        />
      ) : (
        <>Loading document...</>
      )}
    </>
  );
};
