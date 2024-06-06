import { Button } from "@measured/puck";
import "./puck.css";
import { useDocument } from "../../hooks/useDocument";
import { usePuck } from "@measured/puck";
import { PanelLeft, PanelRight, RotateCcw, RotateCw } from "lucide-react"
import * as buttons from "../ui/Button"
import { useCallback } from "react";
import { getLocalStorageKey } from "../../utils/localStorageHelper";


const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
};

export const customHeaderActions = (children: any, templateId: string, layoutId: string, entityId: string, role: string, handleClearLocalChanges : Function) => {
  const entityDocument = useDocument();
  const {
    history: { back, forward, historyStore },
  } = usePuck();
  const { hasFuture = false, hasPast = false } = historyStore || {};
  const hasLocalStorage = !!window.localStorage.getItem(getLocalStorageKey(role, templateId, layoutId, entityId));
  return (
    <>
      {children}
      <buttons.Button variant="ghost" size="icon" disabled={!hasPast} onClick={back}>
        <RotateCcw className="sm-icon" />
      </buttons.Button>
      <buttons.Button variant="ghost" size="icon" disabled={!hasFuture} onClick={forward}>
        <RotateCw className="sm-icon" />
      </buttons.Button>
      <Button disabled={!hasLocalStorage} onClick={() => handleClearLocalChanges()}>
        Clear Local Changes
      </Button>
      <Button onClick={() => handleClick(entityDocument.slug)}>
        Live Preview
      </Button>
    </>
  );
};

export interface customHeaderProps {
  actions: any;
}

export const customHeader = ({
  actions
}: customHeaderProps) => {
  return (
    <header className="puck-header">
      <div className="header-left">
        <ToggleUIButtons/>
      </div>
      <div className="header-center">
      </div>
      <div className="actions">{actions}</div>
    </header>
  );
};

const ToggleUIButtons = () => {  
  const {
    dispatch,
    appState: {
      ui: {
        leftSideBarVisible, 
        rightSideBarVisible
      }
    }
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
      <buttons.Button variant="ghost" size="icon" onClick={() => {toggleSidebars("left")}}>
        <PanelLeft className="sm-icon" />
      </buttons.Button>
      <buttons.Button variant="ghost" size="icon" onClick={() => {toggleSidebars("right")}}>
        <PanelRight className="sm-icon" />
      </buttons.Button>
    </>
  )
}