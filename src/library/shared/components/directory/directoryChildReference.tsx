import * as React from "react";
import {
  isDirectoryGrid,
  sortAlphabetically,
} from "@yext/visual-editor/section-library-support";

export type DirectoryChildReference = {
  childIndex: number;
  childId?: string;
};

type DirectoryChild = {
  id?: string;
  name?: string;
  [key: string]: any;
};

const DirectoryChildrenContext = React.createContext<DirectoryChild[]>([]);

export const DirectoryChildrenProvider = ({
  children,
  directoryChildren,
}: {
  children: React.ReactNode;
  directoryChildren: DirectoryChild[];
}) => (
  <DirectoryChildrenContext.Provider value={directoryChildren}>
    {children}
  </DirectoryChildrenContext.Provider>
);

export const useDirectoryChildren = (): DirectoryChild[] =>
  React.useContext(DirectoryChildrenContext);

export const getSortedDirectoryChildren = (
  directoryChildren: unknown
): DirectoryChild[] => {
  if (
    !Array.isArray(directoryChildren) ||
    !isDirectoryGrid(directoryChildren)
  ) {
    return [];
  }

  return sortAlphabetically([...directoryChildren], "name");
};

export const createDirectoryChildReference = (
  child: DirectoryChild | undefined,
  childIndex: number
): DirectoryChildReference => ({
  childIndex,
  ...(typeof child?.id === "string" ? { childId: child.id } : {}),
});

export const matchesDirectoryChildReference = (
  childReference: DirectoryChildReference | undefined,
  child: DirectoryChild | undefined,
  childIndex: number
): boolean => {
  if (!childReference || childReference.childIndex !== childIndex) {
    return false;
  }

  if (childReference.childId && childReference.childId !== child?.id) {
    return false;
  }

  return true;
};

export const resolveDirectoryChildFromReference = (
  directoryChildren: DirectoryChild[],
  childReference: DirectoryChildReference | undefined
): DirectoryChild | undefined => {
  if (!childReference) {
    return undefined;
  }

  const childAtIndex = directoryChildren[childReference.childIndex];
  if (
    matchesDirectoryChildReference(
      childReference,
      childAtIndex,
      childReference.childIndex
    )
  ) {
    return childAtIndex;
  }

  if (childReference.childId) {
    return directoryChildren.find(
      (child) => child?.id === childReference.childId
    );
  }

  return childAtIndex;
};
