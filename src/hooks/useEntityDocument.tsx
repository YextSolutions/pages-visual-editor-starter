import { useQuery } from "@tanstack/react-query";
import { fetchEntityDocument } from "../utils/api";

type EntityDocument = {
  templateId?: string;
  entityId?: string;
};

const useEntityDocument = ({ templateId, entityId }: EntityDocument) => {
  const { data: entityDocument, status: entityDocumentStatus } = useQuery({
    queryKey: ["entityDocument", templateId, entityId],
    queryFn: async () => {
      if (!entityId || !templateId) return null;
      const entityDocument = await fetchEntityDocument(templateId, entityId);
      return entityDocument;
    },
    enabled: !!entityId && !!templateId,
  });
  return { entityDocument, entityDocumentStatus };
};

export default useEntityDocument;
