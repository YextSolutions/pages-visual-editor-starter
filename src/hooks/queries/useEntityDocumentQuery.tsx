import { useQuery } from "@tanstack/react-query";
import { fetchEntityDocument } from "../../lib/api";

type EntityDocument = {
  templateId?: string;
  entityId?: string;
};

const useEntityDocumentQuery = ({ templateId, entityId }: EntityDocument) => {
  const { data: entityDocument, status: entityDocumentStatus } = useQuery({
    queryKey: ["entityDocument", templateId, entityId],
    queryFn: async () => {
      if (!entityId || !templateId) {
        return null;
      }
      return await fetchEntityDocument(templateId, entityId);
    },
    enabled: !!entityId && !!templateId,
  });
  return { entityDocument, entityDocumentStatus };
};

export default useEntityDocumentQuery;
