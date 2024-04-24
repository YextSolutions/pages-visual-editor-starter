import { Button } from "@measured/puck";
import {EntityPicker, EntityPickerProps} from "./EntityPicker";
import "./puck.css";
import { TemplatePicker } from "./TemplatePicker";
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
  entityId: string;
  templateId: string;
}

export const customHeader = ({ actions, entityId, templateId }: customHeaderProps) => {
  return (
    <header className="header">
      <div className="header-left" />
      <div className="header-center">
        <TemplatePicker />
        <EntityPicker entityId={entityId} templateId={templateId}/>
      </div>
      <div className="actions">{actions}</div>
    </header>
  );
};
