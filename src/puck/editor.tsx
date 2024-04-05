/* eslint-disable @typescript-eslint/no-unused-vars */
import { Puck, Data, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "./puck.config";
  
// Describe the initial data
const initialData = {
  content: [
    {
      type:"Banner",
      props: {
        name:"Banner",
        id:"Banner-1694032984497"
      }
    }
  ],
  root: {
    props: {
      name:""
    }
  },
};
 
// Save the data to your database
const save = (data: Data) => {
  console.log(JSON.stringify(data));
};
 
// Render Puck editor
export default function Editor() {
  return (
    <Puck config={config as Config} data={initialData} onPublish={save}>
    </Puck>
  );
}