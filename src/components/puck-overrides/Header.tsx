import { Button } from "@measured/puck";
import { EntityDefinition, EntityPicker } from "./EntityPicker";
import "./puck.css";
import { TemplateDefinition, TemplatePicker } from "./TemplatePicker";
import { useDocument } from "../../hooks/useDocument";
import { usePuck } from "@measured/puck";
import { PanelLeft, PanelRight, RotateCcw, RotateCw } from "lucide-react"
import * as buttons from "../ui/Button"
import { useCallback } from "react";


const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
};

const handleClearLocalChanges = () => {
  window.localStorage.clear();
  window.location.reload();
};

export const customHeaderActions = (children: any) => {
  const entityDocument = useDocument();
  const {
    history: { back, forward, historyStore },
  } = usePuck();
  const { hasFuture = false, hasPast = false } = historyStore || {};
  return (
    <>
      {children}
      <buttons.Button variant="ghost" size="icon" disabled={!hasPast} onClick={back}>
        <RotateCcw className="sm-icon" />
      </buttons.Button>
      <buttons.Button variant="ghost" size="icon" disabled={!hasFuture} onClick={forward}>
        <RotateCw className="sm-icon" />
      </buttons.Button>
      <Button onClick={() => handleClearLocalChanges()}>
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
  entity: EntityDefinition;
  template: TemplateDefinition;
  entities: EntityDefinition[];
  templates: TemplateDefinition[];
}

export const customHeader = ({
  actions,
  entity,
  template,
  entities,
  templates,
}: customHeaderProps) => {
  return (
    <header className="puck-header">
      <div className="header-left">
        <ToggleUIButtons/>
      </div>
      <div className="header-center">
        <TemplatePicker selectedTemplate={template} templates={templates} />
        <EntityPicker selectedEntity={entity} entities={entities} />
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