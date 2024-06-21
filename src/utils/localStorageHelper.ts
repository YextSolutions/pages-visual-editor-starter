import { Role } from "../templates/edit";

const ROLE = "ROLE_",
  TEMPLATE = "TEMPLATE_",
  LAYOUT = "LAYOUT_",
  ENTITY = "ENTITY_";

export function getLocalStorageKey(
  role: string,
  templateId: string,
  layoutId: number,
  entityId: number
) {
  if (!role || !templateId || (!entityId && !layoutId)) {
    throw new Error(
      "Unable to generate local storage key, missing query parameters"
    );
  }
  if (role === Role.INDIVIDUAL) {
    return ROLE + role + TEMPLATE + templateId + ENTITY + entityId;
  }
  return ROLE + role + TEMPLATE + templateId + LAYOUT + layoutId;
}
