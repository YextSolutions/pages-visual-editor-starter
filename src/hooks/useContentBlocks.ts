import { useQuery } from "@tanstack/react-query";
import { ContentBlock } from "../types/autogen";

const fetchContentBlocks = async (
  entityUid?: string
): Promise<ContentBlock[]> => {
  let url =
    "https://cdn.yextapis.com/v2/accounts/me/content/contentBlocks?v=20240722&api_key=81ac3a9e25fa05c9ee97bba3ac14597a";
  if (entityUid) {
    url += `&c_linkedPages=${entityUid}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return data.response.docs;
};

const useContentBlocks = (entityUid?: string) => {
  return useQuery({
    queryKey: ["contentBlocks", entityUid],
    queryFn: () => fetchContentBlocks(entityUid),
  });
};

export { useContentBlocks };
