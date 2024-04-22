import { EntityContent, YextResponse } from "../types/api";

export const fetchEntity = async (entityId: string): Promise<any> => {
  const response = await fetch(`/api/entity/${entityId}`);
  const body = await response.json();
  return body;
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

export const fetchEntityDocument = async (
  templateId: string,
  entityId: string,
): Promise<YextResponse<EntityContent>> => {
  try {
    const response = await fetch(
      `/api/streams/${templateId}/entity/${entityId}/fetchentitydocument`,
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches entities using the getEntities() function and parses the response.
 * @return {Promise<Entity[]>}
 */
export async function fetchEntities() {
  try {
    const res = await fetch("api/entity/list");
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
