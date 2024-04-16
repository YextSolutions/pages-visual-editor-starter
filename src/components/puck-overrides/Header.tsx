import { Button } from "@measured/puck";
import "./puck.css"

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
        <span> replace me </span>
      </div>
      <div className="actions">{actions}</div>
    </header>
  )
}