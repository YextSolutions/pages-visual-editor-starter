import { Role } from "../templates/edit";

const ROLE = "ROLE_",
  TEMPLATE = "TEMPLATE_",
  LAYOUT = "LAYOUT_",
  ENTITY = "ENTITY_";

export function getLocalStorageKey(
  role: string,
  templateId: string,
  layoutId?: number,
  entityId?: number
) {
  if (!role || !templateId || (!entityId && !layoutId)) {
    throw new Error(
      "Unable to generate local storage key, missing query parameters"
    );
  }
  if (role === Role.INDIVIDUAL) {
    if (!entityId) {
      throw new Error(`EntityId required for role ${role}`);
    }
    return ROLE + role + TEMPLATE + templateId + ENTITY + entityId;
  }

  if (!layoutId) {
    throw new Error(`LayoutId required for role ${role}`);
  }
  return ROLE + role + TEMPLATE + templateId + LAYOUT + layoutId;
}
