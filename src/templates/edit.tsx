import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import Editor from "../puck/editor";

export const config: TemplateConfig = {
  name: "edit",
};

export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const Edit: Template<TemplateRenderProps> = () => {
  return <Editor/>;
};

export default Edit;
