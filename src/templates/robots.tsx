import type {
  TemplateProps,
  TemplateRenderProps,
  GetPath,
  TemplateConfig,
} from "@yext/pages";

export const config: TemplateConfig = {
  name: "robots",
};

export const getPath: GetPath<TemplateProps> = () => {
  return `robots.txt`;
};

export const render = (data: TemplateRenderProps) => {
  return `User-agent: *
Sitemap: https://${data.document.siteDomain}/sitemap.xml
`;
};
