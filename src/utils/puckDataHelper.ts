import { C_pages_layouts, C_visualConfigurations, C_visualLayouts } from "../types/autogen";

export function getTemplatePuckData(
    entityConfigurations: C_visualConfigurations[],
    entityLayoutConfigurations: C_pages_layouts[],
    siteLayoutConfigurations: C_visualLayouts[],
    templateName: string | undefined,
): string {
  if (!templateName) {
    throw new Error("Unable to parse puck data, template name must be defined in config.");
  }
  // check base entity
  for (const entityConfiguration of entityConfigurations) {
    if (entityConfiguration.template === templateName) {
      return entityConfiguration.data;
    }
  }
  // check layouts referenced by the base entity
  for (const entityLayout of entityLayoutConfigurations) {
    if (entityLayout.c_visualConfiguration?.template === templateName) {
      return entityLayout.c_visualConfiguration.data;
    }
  }
  // check layouts referenced by the site entity
  for (const siteLayout of siteLayoutConfigurations) {
    if (siteLayout.c_visualConfiguration?.template === templateName) {
      return siteLayout.c_visualConfiguration.data;
    }
  }
  throw new Error(`Failed to find layout for template ${templateName}`);
}