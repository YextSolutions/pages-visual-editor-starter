import { useMutation } from "@tanstack/react-query";
import { updateEntity } from "../../lib/api";
import { useToast } from "@chakra-ui/react";
import { ApiError } from "../../types/api";
import { cancellableDelay } from "../../lib/utils";

export const useUpdateEntity = () => {
  const toast = useToast();

  const { mutate: handleUpdateEntity } = useMutation({
    mutationFn: async ({
      entityId,
      body,
    }: {
      entityId?: string;
      body: any;
    }) => {
      if (!entityId) {
        throw new Error("Entity ID is required");
      }
      await updateEntity(entityId, body);
    },
    mutationKey: ["updateEntity"],
    onSuccess: async () => {
      const { promise, cancel } = cancellableDelay(3000);
      toast({
        title: "Save completed.",
        status: "success",
        isClosable: true,
        onCloseComplete: cancel,
      });
      await promise;
    },
    onError: async (error: ApiError) => {
      const { promise, cancel } = cancellableDelay();
      toast({
        title: `Error occurred: ${error.message}`,
        status: "error",
        duration: null,
        isClosable: true,
        onCloseComplete: cancel,
      });
      await promise;
    },
  });

  return { handleUpdateEntity };
};
