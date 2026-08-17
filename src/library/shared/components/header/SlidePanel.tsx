import * as React from "react";
import { useTranslation } from "react-i18next";

export const SlidePanel = ({
  isOpen,
  onClose,
  top,
  height,
  previewWindow,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  top: number;
  height: number;
  previewWindow?: Window | null;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const targetWindow = previewWindow || window;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    targetWindow.addEventListener("keydown", handleKeyDown);

    // Auto-focus the panel when it opens so Screen Readers start there
    panelRef.current?.focus();

    return () => targetWindow.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, previewWindow]);

  return (
    <>
      {/* Backdrop blocks content when the panel is open. */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-600 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          top,
          height,
          backdropFilter: "brightness(0.6)",
          WebkitBackdropFilter: "brightness(0.6)",
        }}
        onClick={onClose}
      />

      {/* Panel holds the expanded header menu content. */}
      <div
        role="dialog"
        aria-modal="true" // Tells screen readers this is the only interactive content while open
        ref={panelRef}
        aria-label={t("expandedMenu", "Expanded menu")}
        aria-hidden={!isOpen}
        {...(!isOpen && { inert: "" })}
        tabIndex={-1}
        className={`fixed right-0 z-50 bg-white transition-transform duration-600 ease-in-out ${
          isOpen ? "translate-x-0 overflow-y-auto" : "translate-x-full"
        }`}
        style={{ top, height, width: "80vw", maxWidth: "80vw" }}
      >
        {children}
      </div>
    </>
  );
};
