import { createContext, useContext, ReactNode } from "react";

const DocumentContext = createContext<any | undefined>(undefined);

type DocumentProviderProps<T> = {
  value: T;
  children: ReactNode;
};

const DocumentProvider = <T,>({
  value,
  children,
}: DocumentProviderProps<T>) => {
  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

const useDocument = <T,>(selector?: (state: T) => any): T | any => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error(
      "useLocationDocument must be used within a DocumentProvider",
    );
  }

  if (selector) {
    return selector(context);
  }

  return context as T;
};

export { DocumentProvider, useDocument };
