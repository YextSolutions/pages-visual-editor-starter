import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../lib/api";

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
