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
  template: TemplateDefinition;
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
  if (updatedTemplateId) {
    urlParams.delete("entityId");
  }
  return `${window.location.pathname}?${urlParams.toString()}`;
};

export function TemplatePicker({ template, templates }: TemplatePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<TemplateDefinition>();

  const templateMenuItems = templates.map((t: TemplateDefinition) => (
    <MenuItem
      as={Button}
      key={t.id}
      onClick={() => {
        if (t.id !== template?.id) {
          setModalTemplate(t);
          setModalOpen(true);
        }
      }}
    >
      {t.name}
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
            variant={template ? "solid" : "ghost"}
            isActive={!!template}
          >
            {template ? template.name : "Template"}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>{templateMenuItems}</MenuList>
        </Menu>
      </div>
    </ChakraProvider>
  );
}
