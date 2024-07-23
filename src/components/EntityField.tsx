import { createContext, useContext } from "react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./atoms/tooltip";

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
      <Tooltip open={tooltipsVisible && !!tooltipContent}>
        <TooltipTrigger asChild>
          <div className={tooltipsVisible ? "outline-2 outline-dotted outline-[#5A58F2]" : ""}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
          <TooltipArrow fill="bg-popover" />
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

export const useEntityField = () => {
  const context = useContext(EntityFieldContext);
  if (!context) {
    return {
      tooltipsVisible: false,
      toggleTooltips: () => {},
    };
  }
  return context;
};
