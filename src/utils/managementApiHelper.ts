import {PagesHttpRequest} from "@yext/pages/dist/types/src";
import {pageLayoutTypeId, pageLayoutVisualConfigField} from "../puck/editor";
import getEntities from "../functions/http/api/entity/list";
import {C_visualConfigurations} from "../types/autogen";

async function getLayoutsDirect() {
  const httpRequest: PagesHttpRequest = {
    queryParams: {
      "entityTypes": pageLayoutTypeId,
    },
    method: "GET",
    body: "",
    pathParams: {},
    headers: {},
  }
  const res = await getEntities(httpRequest);
  if (res.statusCode >= 400) {
    throw new Error("Failed to fetch layouts");
  }
  try {
    const json = JSON.parse(res.body);
    return json.response.entities;
  } catch (ignored) {
    throw new Error("Failed to parse layout response");
  }
}

/**
 * Gets the template (puck) data to be rendered live.
 * Data is chosen first from base entity overrides, then from page layouts referenced by the base
 * entity, then from page layouts referenced from the _site entity.
 * @param entityVisualConfigurations visualConfigs stored on the base entity
 * @param entityLayoutIds internal ids of layouts referenced by the base entity
 * @param siteLayoutIds internal ids of layouts referenced by the site entity
 * @param templateName the name of the template
 * @return templateData to be passed to puck
 */
export async function getTemplateData(entityVisualConfigurations: C_visualConfigurations[], entityLayoutIds: string[], siteLayoutIds: string[], templateName: string | undefined): Promise<string> {
  if (!templateName) {
    throw new Error("Template name must be defined in the config");
  }
  let templateData = "";
  // check the base entity for puck data
  entityVisualConfigurations.forEach((entityVisualConfig: C_visualConfigurations) => {
    if (entityVisualConfig.template === templateName) {
      templateData = entityVisualConfig.data;
    }
  });

  // go through the layouts
  if (!templateData) {
    const layouts = await getLayoutsDirect();
    // check for layouts related to the base entity
    layouts.forEach((layout: any) => {
      // for some odd reason, entity relationship comes back as an 'object' that is just a string
      // but also has invisible characters so direct comparison doesn't work.
      // Parsing to int lets us compare properly.
      const layoutInternalId = parseInt(layout.meta.uid);
      const visualConfig = layout[pageLayoutVisualConfigField];
      entityLayoutIds.map((obj: any) => parseInt(obj)).forEach((id: number) => {
        if (id === layoutInternalId && visualConfig.template === templateName) {
          templateData = visualConfig.data;
        }
      });
    });
    // check for layouts from the _site entity
    if (!templateData) {
      layouts.forEach((layout: any) => {
        const layoutInternalId = parseInt(layout.meta.uid);
        const visualConfig = layout[pageLayoutVisualConfigField];
        siteLayoutIds.map((obj: any) => parseInt(obj)).forEach((id: number) => {
          if (id === layoutInternalId && visualConfig.template === templateName) {
            templateData = visualConfig.data;
          }
        });
      });
    }
  }
  return templateData;
}