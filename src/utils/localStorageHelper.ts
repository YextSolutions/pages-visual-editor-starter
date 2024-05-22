import {Role} from "../templates/edit";

export function getLocalStorageKey(role: string, templateId: string, entityId?: string) {
  if (role === Role.INDIVIDUAL && entityId) {
    return role + "_" + templateId + "_" + entityId;
  }
  return role + "_" + templateId;
}