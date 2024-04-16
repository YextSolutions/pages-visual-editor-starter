import { Button, Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "./puck.config";
import useEntity from "../hooks/useEntity";
import useUpdateEntityMutation from "../hooks/mutations/useUpdateEntityMutation";

const siteEntityId = "site";

export interface EditorProps {
  isLoading?: boolean;
  entityType?: string;
}

// Render Puck editor 
export const Editor = ({isLoading}: EditorProps) => {
  const updateEntityMutation = useUpdateEntityMutation({
    handleComplete: handleUpdateEntity,
  });
  
  // Save the data to our site entity
  const save = async (data: Data) => {
    const c_templateVisualConfiguration = JSON.stringify(data)
    console.log("Save in progess...")
    updateEntityMutation.mutate({
      entityId: siteEntityId,
      body: { c_templateVisualConfiguration },
    });
  };

  // Fetch the data from our site entity
  const { entity } = useEntity(siteEntityId);

  return (
    <>
      {entity?.c_templateVisualConfiguration && !isLoading ? 
      <Puck config={config as Config} 
        data={JSON.parse(entity?.c_templateVisualConfiguration)} 
        onPublish={save}
        overrides={{
          headerActions: ({ children }) => customHeaderActions(children),
        }}
      /> : 
      <>Loading...</>}   
    </>
  );
}

const handleUpdateEntity = (error: Error | null) => {
  if (error) {
    console.log("Error occured: " + error.message)
  } else {
    console.log("Save completed.")
  }
};

const handleClick = () => {
  window.open('/cafe', '_blank');
};

const customHeaderActions = (children: any) => {
  return (
    <>
      {children}
      <Button onClick={handleClick}>Live Preview</Button>
    </>
  );
};