import { EntityContent, YextResponse } from "../types/api";
import {
  EntityDefinition,
  LayoutDefinition,
  pageLayoutTypeId,
  pageLayoutVisualConfigField,
  TemplateDefinition,
} from "../puck/editor";

export const fetchEntity = async (entityId: string): Promise<any> => {
  const response = await fetch(`/api/entity/${entityId}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch entity: " + JSON.stringify(json));
  }
  return await json;
};

export const fetchTemplate = async (
  templateId: string,
): Promise<TemplateDefinition> => {
  const response = await fetch(`/api/template/${templateId}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch template: " + JSON.stringify(json));
  }
  return (await json) as TemplateDefinition;
};

export const updateEntity = async (
  entityId: string,
  body: any,
): Promise<void> => {
  const response = await fetch(`/api/entity/${entityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

export const fetchTemplates = async (): Promise<TemplateDefinition[]> => {
  try {
    const res = await fetch("api/template/list");
    const json = await res.json();
    return json.map((template: TemplateDefinition) => {
      const templateDef: TemplateDefinition = {
        name: template.name,
        id: template.id,
        entityTypes: template.entityTypes,
      };
      return templateDef;
    });
  } catch (e) {
    throw new Error("Failed to fetch templates: " + e.message);
  }
};

export const fetchEntityDocument = async (
  templateId: string,
  entityId: string,
): Promise<YextResponse<EntityContent>> => {
  try {
    const response = await fetch(
      `/api/streams/${templateId}/entity/${entityId}/fetchentitydocument`,
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches entities using the getEntities() function and parses the response.
 * @param entityTypes {string[] | undefined} entityTypes to filter by
 * @return {Promise<EntityDefinition[]>}
 */
export async function fetchEntities(
  entityTypes?: string[],
): Promise<EntityDefinition[]> {
  try {
    let reqUrl = "api/entity/list";
    if (entityTypes) {
      reqUrl += `?entityTypes=${entityTypes}`;
    }
    const res = await fetch(reqUrl);
    const json = await res.json();
    const entities = json.response.entities;
    return entities.map((entity: any) => {
      return {
        name: entity.name,
        externalId: entity.meta.id,
        internalId: entity.meta.uid,
      };
    });
  } catch (e) {
    throw new Error("Failed to fetch entities: " + e.message);
  }
}

/**
 * Fetches layouts using the getEntities() function and parses the response.
 * @return {Promise<LayoutDefinition[]>}
 */
export async function fetchLayouts(): Promise<LayoutDefinition[]> {
  try {
    const reqUrl = `api/entity/list?entityTypes=${pageLayoutTypeId}`;
    const res = await fetch(reqUrl);
    const json = await res.json();
    const entities = json.response.entities;
    return entities.map((entity: any): LayoutDefinition => {
      return {
        name: entity.name,
        externalId: entity.meta.id,
        internalId: entity.meta.uid,
        visualConfiguration: {
          template: entity[pageLayoutVisualConfigField].template,
          data: entity[pageLayoutVisualConfigField].data,
        },
      };
    });
  } catch (e) {
    throw new Error("Failed to fetch layouts: " + e.message);
  }
}
