import * as React from "react";

export type HeaderLinksDisplayMode = "inline" | "menu";

export const HeaderLinksDisplayModeContext =
  React.createContext<HeaderLinksDisplayMode>("inline");

export const HeaderLinksDisplayModeProvider =
  HeaderLinksDisplayModeContext.Provider;

export const useHeaderLinksDisplayMode = (): HeaderLinksDisplayMode => {
  return React.useContext(HeaderLinksDisplayModeContext);
};

type ExpandedHeaderMenuContextValue = {
  primaryHasCollapsedLinks: boolean;
  setPrimaryHasCollapsedLinks: (value: boolean) => void;
  primaryOverflow: boolean;
  setPrimaryOverflow: (value: boolean) => void;
  secondaryOverflow: boolean;
  setSecondaryOverflow: (value: boolean) => void;
};

const ExpandedHeaderMenuContext =
  React.createContext<ExpandedHeaderMenuContextValue | null>(null);

export const ExpandedHeaderMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [primaryHasCollapsedLinks, setPrimaryHasCollapsedLinks] =
    React.useState(false);
  const [primaryOverflow, setPrimaryOverflow] = React.useState(false);
  const [secondaryOverflow, setSecondaryOverflow] = React.useState(false);

  const value = React.useMemo(
    () => ({
      primaryHasCollapsedLinks,
      setPrimaryHasCollapsedLinks,
      primaryOverflow,
      setPrimaryOverflow,
      secondaryOverflow,
      setSecondaryOverflow,
    }),
    [primaryHasCollapsedLinks, primaryOverflow, secondaryOverflow]
  );

  return (
    <ExpandedHeaderMenuContext.Provider value={value}>
      {children}
    </ExpandedHeaderMenuContext.Provider>
  );
};

export const useExpandedHeaderMenu = () => {
  const context = React.useContext(ExpandedHeaderMenuContext);
  if (!context) {
    throw new Error(
      "useExpandedHeaderMenu must be used within an ExpandedHeaderMenuProvider"
    );
  }
  return context;
};
