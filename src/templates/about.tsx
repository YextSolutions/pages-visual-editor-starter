import {
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
} from "@yext/pages";
 
export const getPath: GetPath<TemplateProps> = () => {
  return "about";
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = () => {
  return {
    title: "about",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const About = (data: TemplateRenderProps) => {
  return (
    <div>about page</div>
  );
};

export default About;
