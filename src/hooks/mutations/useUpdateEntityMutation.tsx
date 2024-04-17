import { useMutation } from "@tanstack/react-query";
import { updateEntity } from "../../utils/api";

const useUpdateEntity = () => {
  const updateEntityMutation = useMutation({
    mutationFn: async ({
      entityId,
      body,
    }: {
      entityId?: string;
      body: any;
    }) => {
      if (!entityId) {
        throw new Error("entityId is required");
      }
      await updateEntity(entityId, body);
    },
    mutationKey: ["updateEntity"],
  });

  return updateEntityMutation;
};

export default useUpdateEntity;
