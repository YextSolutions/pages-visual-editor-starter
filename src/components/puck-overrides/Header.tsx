import { Button } from "@measured/puck";
import { EntityPicker } from "./EntityPicker";
import "./puck.css"
import { TemplatePicker } from "./TemplatePicker";

const handleClick = () => {
  window.open('/cafe', '_blank');
};

export const customHeaderActions = (children: any) => {
  return (
    <>
      {children}
      <Button onClick={handleClick}>Live Preview</Button>
    </>
  );
};

export const customHeader = (actions: any) => {
  return (
    <header className="header">
      <div className="header-left"/>
      <div className="header-center"> 
        <TemplatePicker/> 
        <EntityPicker/>
      </div>
      <div className="actions">{actions}</div>
    </header>
  )
}