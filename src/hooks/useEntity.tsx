import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";

/**
 * If an entityId is provided and has data, returns the data from that entity. Returns
 * data from the site entity as a fallback.
 */
export const GetPuckData = (
  siteEntityId: string,
  field?: string,
  entityId?: string,
): string => {
  const {entity, status} = useEntity(entityId ?? "");
  const {entity: siteEntity, status: siteEntityStatus} = useEntity(siteEntityId);
  if (!field) {
    return "";
  }
  if (status === "success" && entity.response?.[field]) {
    return entity.response[field];
  }
  if (siteEntityStatus === "success" && siteEntity.response?.[field]) {
    return siteEntity.response[field];
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
