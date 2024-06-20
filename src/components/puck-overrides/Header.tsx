import "./puck.css";
import { usePuck } from "@measured/puck";
import { PanelLeft, PanelRight, RotateCcw, RotateCw } from "lucide-react"
import * as buttons from "./button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/AlertDialog"
import { useCallback, useEffect } from "react";
import { getLocalStorageKey } from "../../utils/localStorageHelper";
import { useDocument } from "../../hooks/useDocument";
import { Button } from "./button";

const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
};

export const customHeaderActions = (
  children: any,
  templateId: string,
  layoutId: string,
  entityId: string,
  role: string,
  handleClearLocalChanges: Function,
  handleHistoryChange: (history: any) => void
) => {
  const entityDocument = useDocument();
  const {
    history: { back, forward, historyStore },
  } = usePuck();
  const { hasFuture = false, hasPast = false } = historyStore || {};
  const hasLocalStorage = !!window.localStorage.getItem(
    getLocalStorageKey(role, templateId, layoutId, entityId)
  );
  useEffect(() => {
    handleHistoryChange(historyStore);
  }, [historyStore?.index]);

  return (
    <>
    {children}
    <buttons.Button variant="ghost" size="icon" disabled={!hasPast} onClick={back}>
      <RotateCcw className="sm-icon" />
    </buttons.Button>
    <buttons.Button variant="ghost" size="icon" disabled={!hasFuture} onClick={forward}>
      <RotateCw className="sm-icon" />
    </buttons.Button>
    <ClearLocalChangesButton disabled={!hasLocalStorage} onClearLocalChanges={handleClearLocalChanges} />
    <Button onClick={() => handleClick(entityDocument.slug)}>
      Live Preview
    </Button>
  </>

  );
};

interface ClearLocalChangesButtonProps {
  disabled: boolean
  onClearLocalChanges: Function
}

const ClearLocalChangesButton = ({
  disabled,
  onClearLocalChanges
}: ClearLocalChangesButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button>Clear Local Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Local Changes</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove your local changes. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => onClearLocalChanges()}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export interface customHeaderProps {
  actions: any;
}

export const customHeader = ({ actions }: customHeaderProps) => {
  return (
    <header className="puck-header">
      <div className="header-left">
        <ToggleUIButtons />
      </div>
      <div className="header-center"></div>
      <div className="actions">{actions}</div>
    </header>
  );
};

const ToggleUIButtons = () => {
  const {
    dispatch,
    appState: {
      ui: { leftSideBarVisible, rightSideBarVisible },
    },
  } = usePuck();

  const toggleSidebars = useCallback(
    (sidebar: "left" | "right") => {
      const widerViewport = window.matchMedia("(min-width: 638px)").matches;
      const sideBarVisible =
        sidebar === "left" ? leftSideBarVisible : rightSideBarVisible;
      const oppositeSideBar =
        sidebar === "left" ? "rightSideBarVisible" : "leftSideBarVisible";

      dispatch({
        type: "setUi",
        ui: {
          [`${sidebar}SideBarVisible`]: !sideBarVisible,
          ...(!widerViewport ? { [oppositeSideBar]: false } : {}),
        },
      });
    },
    [dispatch, leftSideBarVisible, rightSideBarVisible]
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleSidebars("left");
        }}
      >
        <PanelLeft className="sm-icon" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleSidebars("right");
        }}
      >
        <PanelRight className="sm-icon" />
      </Button>
    </>
  );
};
