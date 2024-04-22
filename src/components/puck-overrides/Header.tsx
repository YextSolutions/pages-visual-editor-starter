import { Button } from "@measured/puck";
import { EntityPicker } from "./EntityPicker";
import "./puck.css";
import { TemplatePicker } from "./TemplatePicker";
import { useDocument } from "../../hooks/useDocument";

const handleClick = (slug: string) => {
  window.open(`/${slug}`, '_blank');
};

export const customHeaderActions = (children: any) => {
  const entityDocument = useDocument();
  return (
    <>
      {children}
      <Button onClick={() => handleClick(entityDocument.slug)}>Live Preview</Button>
    </>
  );
};

export const customHeader = (actions: any) => {
  return (
    <header className="header">
      <div className="header-left" />
      <div className="header-center">
        <TemplatePicker />
        <EntityPicker />
      </div>
      <div className="actions">{actions}</div>
    </header>
  );
};
