import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";

/**
 * If the role is "individual" and the entity's config data is populated, 
 * returns the entityId's config data. Else returns the site entity's config data. 
 */
export const getPuckData = (
  siteEntityId: string,
  field: string,
  entityId?: string,
  role?: string
): string => {
  const { entity, status } = useEntity(role === Role.INDIVIDUAL && entityId ? entityId : siteEntityId);
  const { entity: siteEntity, status: siteEntityStatus } = useEntity(siteEntityId);
  if (status === "success" && entity.response?.[field]) {
    return entity?.response?.[field] ?? "";
  } else if (
    role === Role.INDIVIDUAL &&
    siteEntityStatus === "success" &&
    siteEntity.response?.[field]
  ) {
    return siteEntity?.response?.[field] ?? "";
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
