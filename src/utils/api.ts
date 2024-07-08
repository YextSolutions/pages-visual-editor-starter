import { EntityContent, YextResponse } from "../types/api";

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
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
