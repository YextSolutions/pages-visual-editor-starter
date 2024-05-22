import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown";
import { useState } from "react";
import { TemplateConfirmationModal } from "./TemplateConfirmationModal";

export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
};

export interface TemplatePickerProps {
  selectedTemplate: TemplateDefinition;
  templates: TemplateDefinition[];
}

export const urlFromTemplate = (template: TemplateDefinition) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let updatedTemplateId = false;
  if (urlParams.has("templateId")) {
    if (urlParams.get("templateId") !== template.id) {
      urlParams.set("templateId", template.id);
      updatedTemplateId = true;
    }
  } else {
    urlParams.append("templateId", template.id);
    updatedTemplateId = true;
  }
  // when we change the templateId, we need to clear the entityId since the entity may not
  // belong to the new template
  if (updatedTemplateId) {
    urlParams.delete("entityId");
  }
  return `${window.location.pathname}?${urlParams.toString()}`;
};

export function TemplatePicker({
  selectedTemplate,
  templates,
}: TemplatePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<TemplateDefinition>();

  const templateMenuItems = templates.map((template: TemplateDefinition) => (
    <DropdownMenuItem
      key={template.id}
      onClick={() => {
        if (template.id !== selectedTemplate?.id) {
          setModalOpen(true);
          setModalTemplate(template);
        }
      }}
    >
      {template.name}
    </DropdownMenuItem>
  ));

  return (
    <>
      <TemplateConfirmationModal
        isOpen={modalOpen}
        destinationName={modalTemplate?.name || ""}
        destinationUrl={modalTemplate ? urlFromTemplate(modalTemplate) : ""}
        onClose={() => setModalOpen(false)}
      />
      <div className="entity-picker">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={selectedTemplate ? "default" : "ghost"}>
              {selectedTemplate ? selectedTemplate.name : "Template"}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{templateMenuItems}</DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
