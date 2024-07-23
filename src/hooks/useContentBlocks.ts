import { useQuery } from "@tanstack/react-query";
import { ContentBlock } from "../types/autogen";

const fetchContentBlocks = async (): Promise<ContentBlock[]> => {
  const response = await fetch(
    "https://cdn.yextapis.com/v2/accounts/me/content/contentBlocks?v=20240722&api_key=81ac3a9e25fa05c9ee97bba3ac14597a"
  );
  const data = await response.json();
  return data.response.docs;
};

const useContentBlocks = () => {
  return useQuery({
    queryKey: ["contentBlocks"],
    queryFn: fetchContentBlocks,
  });
};

export { useContentBlocks };
