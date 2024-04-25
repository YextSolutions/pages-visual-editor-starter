import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { TemplateConfirmationModal } from "./TemplateConfirmationModal";

export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
  dataField: string;
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
    <MenuItem
      as={Button}
      key={template.id}
      onClick={() => {
        if (template.id !== selectedTemplate?.id) {
          setModalTemplate(template);
          setModalOpen(true);
        }
      }}
    >
      {template.name}
    </MenuItem>
  ));

  return (
    <ChakraProvider>
      <TemplateConfirmationModal
        isOpen={modalOpen}
        destinationName={modalTemplate?.name || ""}
        destinationUrl={modalTemplate ? urlFromTemplate(modalTemplate) : ""}
        onClose={() => setModalOpen(false)}
      />
      <div className="entity-picker">
        <Menu>
          <MenuButton
            as={Button}
            className="dropdown-button"
            variant={selectedTemplate ? "solid" : "ghost"}
            isActive={!!selectedTemplate}
          >
            {selectedTemplate ? selectedTemplate.name : "Template"}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>{templateMenuItems}</MenuList>
        </Menu>
      </div>
    </ChakraProvider>
  );
}
