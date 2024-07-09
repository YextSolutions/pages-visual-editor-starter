import { createContext, useContext, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider } from "./atoms/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

type EntityFieldProps = {
  displayName?: string;
  fieldId?: string;
  children: React.ReactNode;
};

export const EntityField = ({
  displayName,
  fieldId,
  children,
}: EntityFieldProps) => {
  const { tooltipsVisible } = useEntityField();

  let tooltipContent: string = "";
  if (displayName && fieldId) {
    tooltipContent = `${displayName} (${fieldId})`;
  } else if (fieldId) {
    tooltipContent = `(${fieldId})`;
  } else if (displayName) {
    tooltipContent = `${displayName}`;
  }

  return (
    <TooltipProvider>
      <Tooltip open={tooltipsVisible}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type EntityFieldContextProps = {
  tooltipsVisible: boolean;
  toggleTooltips: () => void;
};

const EntityFieldContext = createContext<EntityFieldContextProps | undefined>(
  undefined
);

export const EntityFieldProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tooltipsVisible, setTooltipsVisible] = useState(true);

  const toggleTooltips = () => {
    setTooltipsVisible((prev: boolean) => !prev);
  };

  return (
    <EntityFieldContext.Provider value={{ tooltipsVisible, toggleTooltips }}>
      {children}
    </EntityFieldContext.Provider>
  );
};

export const useEntityField = () => {
  const context = useContext(EntityFieldContext);
  if (!context) {
    throw new Error("useEntityField must be used within a EntityFieldProvider");
    // prob do smth else
  }
  return context;
};
