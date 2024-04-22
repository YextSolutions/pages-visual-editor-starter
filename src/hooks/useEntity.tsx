import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";

const useEntity = (entityId: string) => {
  const { data: entity, status: status } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      if (!entityId) return null;
      const entity = await fetchEntity(entityId);
      return entity;
    },
    enabled: !!entityId,
  });
  return { entity, status };
};

export default useEntity;
