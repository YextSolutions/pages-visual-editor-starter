import {EntityContent, YextResponse} from "../types/api";
import {Template} from "../components/puck-overrides/TemplatePicker";
import {Entity} from "../components/puck-overrides/EntityPicker";

export const fetchEntity = async (entityId: string): Promise<Entity> => {
  const response = await fetch(`/api/entity/${entityId}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch entity: " + JSON.stringify(json));
  }
  return await json as Entity;
};

export const fetchTemplate = async (templateId: string): Promise<Template> => {
  const response = await fetch(`/api/template/${templateId}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch template: " + JSON.stringify(json));
  }
  return await json as Template;
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

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const res = await fetch("api/template/list");
    const json = await res.json();
    return json.map((template) => {
      return {
        name: template.name,
        externalId: template.externalId,
        templateConfig: template.templateConfig,
      };
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
 * @return {Promise<Entity[]>}
 */
export async function fetchEntities(entityTypes?: string[]): Promise<Entity[]> {
  try {
    let reqUrl = "api/entity/list"
    if (entityTypes) {
      reqUrl += `?entityTypes=${entityTypes}`;
    }
    const res = await fetch(reqUrl);
    const json = await res.json();
    const entities = json.response.entities;
    return entities.map((entity) => {
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
