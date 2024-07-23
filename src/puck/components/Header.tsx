import "./puck.css";
import { Data, usePuck, type History } from "@measured/puck";
import {
  PanelLeft,
  PanelRight,
  RotateCcw,
  RotateCw,
  RectangleEllipsis,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/AlertDialog";
import { useCallback, useEffect } from "react";
import { useDocument } from "../../hooks/useDocument";
import { Button } from "../ui/button";
import { useEntityField } from "../../components/EntityField";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const handleClick = (slug: string) => {
  window.open(`/${slug}`, "_blank");
};

export const customHeader = (
  handleClearLocalChanges: () => void,
  handleHistoryChange: (histories: History[], index: number) => void,
  data: Data,
  handleSaveData: (data: Data) => Promise<void>,
  isDevMode: boolean
) => {
  const entityDocument = useDocument();
  const {
    history: {
      back,
      forward,
      histories,
      index,
      hasFuture,
      hasPast,
      setHistories,
      setHistoryIndex,
    },
  } = usePuck();

  useEffect(() => {
    handleHistoryChange(histories, index);
  }, [index, histories, handleHistoryChange]);

  return (
    <header className="puck-header puck-css">
      <div className="header-left">
        <ToggleUIButtons />
        <ToggleEntityFields />
      </div>
      <div className="header-center"></div>
      <div className="actions">
        <Button variant="ghost" size="icon" disabled={!hasPast} onClick={back}>
          <RotateCcw className="sm-icon" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={!hasFuture}
          onClick={forward}
        >
          <RotateCw className="sm-icon" />
        </Button>
        <ClearLocalChangesButton
          disabled={histories.length === 0}
          onClearLocalChanges={() => {
            handleClearLocalChanges();
            setHistories([]);
            setHistoryIndex(-1);
          }}
        />
        <Button
          variant="outline"
          onClick={() => handleClick(entityDocument.slug)}
        >
          View Page
        </Button>
        {isDevMode ? null : <Button
            variant="secondary"
            disabled={histories.length === 0}
            onClick={async () => {
              await handleSaveData(data);
              handleClearLocalChanges();
            }}
        >
          Publish
        </Button>}
      </div>
    </header>
  );
};

interface ClearLocalChangesButtonProps {
  disabled: boolean;
  onClearLocalChanges: () => void;
}

const ClearLocalChangesButton = ({
  disabled,
  onClearLocalChanges,
}: ClearLocalChangesButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button variant="outline">Clear Local Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="puck-css">
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Local Changes</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove your local changes. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onClearLocalChanges}>Confirm</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ToggleUIButtons = () => {
  const {
    dispatch,
    appState: {
      ui: { leftSideBarVisible, rightSideBarVisible },
    },
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleSidebars("left");
        }}
      >
        <PanelLeft className="sm-icon" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleSidebars("right");
        }}
      >
        <PanelRight className="sm-icon" />
      </Button>
    </>
  );
};

const ToggleEntityFields = () => {
  const { toggleTooltips, tooltipsVisible } = useEntityField();
  return (
    <TooltipProvider>
      <Tooltip open={tooltipsVisible}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTooltips} className={tooltipsVisible ? "border-2 border-[#5A58F2] rounded-full" : ""}>
            <RectangleEllipsis className="sm-icon" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Hide Entity Fields
          <TooltipArrow fill="bg-popover" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
