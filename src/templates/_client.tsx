import { PageContext } from "@yext/pages";
import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { render };

const queryClient = new QueryClient();

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("reactele"),
    <QueryClientProvider client={queryClient}>
      <Page {...pageProps} />
    </QueryClientProvider>
  );
};
