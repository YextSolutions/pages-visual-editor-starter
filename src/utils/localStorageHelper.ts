export function getLocalStorageKey(role: string, templateId: string, entityId?: string) {
  if (entityId) {
    return role + "_" + templateId + "_" + entityId;
  }
  return role + "_" + templateId;
}