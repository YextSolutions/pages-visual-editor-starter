import { useQuery } from "@tanstack/react-query";
import { fetchEntity, fetchLayouts } from "../utils/api";

export const useEntity = (entityId: string) => {
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

export const useLayouts = () => {
  const { data: layouts, status: status } = useQuery({
    queryKey: ["layouts", "all"],
    queryFn: async () => {
      return await fetchLayouts();
    },
  });
  return { layouts, status };
}
