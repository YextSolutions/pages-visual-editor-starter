import { useMutation } from "@tanstack/react-query";
import { updateEntity } from "../utils/api";

type Update = {
  handleComplete: (error: Error | null) => void;
};

const useUpdateEntity = ({ handleComplete }: Update) => {
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
    onSettled: (data, error) => {
      handleComplete(error);
    },
  });

  return updateEntityMutation;
};

export default useUpdateEntity;
