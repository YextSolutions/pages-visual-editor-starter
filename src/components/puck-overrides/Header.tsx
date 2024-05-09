import { Button } from "@measured/puck";
import { EntityDefinition, EntityPicker } from "./EntityPicker";
import "./puck.css";
import { TemplateDefinition, TemplatePicker } from "./TemplatePicker";
import { useDocument } from "../../hooks/useDocument";
import { usePuck } from "@measured/puck";
import { RotateCcw, RotateCw } from "lucide-react"
import * as buttons from "../ui/Button"


const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
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
        <RotateCcw className="h-4 w-4" />
      </buttons.Button>
      <buttons.Button variant="ghost" size="icon" disabled={!hasFuture} onClick={forward}>
        <RotateCw className="h-4 w-4" />
      </buttons.Button>
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
      <div className="header-left" />
      <div className="header-center">
        <TemplatePicker selectedTemplate={template} templates={templates} />
        <EntityPicker selectedEntity={entity} entities={entities} />
      </div>
      <div className="actions">{actions}</div>
    </header>
  );
};
