import { Button, Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "./puck.config";
import useEntity from "../hooks/useEntity";
import useUpdateEntity from "../hooks/useUpdateEntity";

const siteEntityId = "site";

export interface EditorProps {
  entityType?: string;
}

// Render Puck editor 
export const Editor = (props: EditorProps) => {
  const updateEntityMutation = useUpdateEntity({
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
      {entity?.c_templateVisualConfiguration ? 
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
  window.location.href = '/cafe';
};

const customHeaderActions = (children: any) => {
  return (
    <>
      {children}
      <Button onClick={handleClick}>Live Preview</Button>
    </>
  );
};