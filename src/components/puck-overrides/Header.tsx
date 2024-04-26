import { Button } from "@measured/puck";
import { EntityDefinition, EntityPicker } from "./EntityPicker";
import "./puck.css";
import { TemplateDefinition, TemplatePicker } from "./TemplatePicker";
import { useDocument } from "../../hooks/useDocument";

const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
};

export const customHeaderActions = (children: any) => {
  const entityDocument = useDocument();
  return (
    <>
      {children}
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
    <header className="header">
      <div className="header-left" />
      <div className="header-center">
        {/* <TemplatePicker selectedTemplate={template} templates={templates} />
        <EntityPicker selectedEntity={entity} entities={entities} /> */}
      </div>
      <div className="actions">{actions}</div>
    </header>
  );
};
