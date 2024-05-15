import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";

/**
 * If the role is "individual" and the entity's config data is populated, 
 * returns the entityId's config data. Else returns the site entity's config data. 
 * If the role is "individual" then keep loading until the entityId is not null.
 */
export const GetPuckData = (
  siteEntityId: string,
  field: string,
  entityId?: string,
  role?: string
): string => {
  const { entity, status } = useEntity(role === Role.INDIVIDUAL && entityId ? entityId : siteEntityId);
  if (role === Role.INDIVIDUAL && !entityId) {
    return "";
  } else if (status === "success" && entity.response?.[field]) {
    return entity?.response?.[field] ?? "";
  } 
  return "";
};

const useEntity = (entityId: string) => {
  const { data: entity, status: status } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      if (!entityId) return null;
      return await fetchEntity(entityId);
    },
    enabled: !!entityId,
  });
  return { entity, status };
};

export default useEntity;
