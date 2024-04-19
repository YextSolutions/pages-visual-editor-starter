import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { ConfirmationModal, SelectionType } from "./ConfirmationModal";

// Hardcoded, to be replaced
const templates: Template[] = [
  { name: "Location", externalId: "location" },
  { name: "Office", externalId: "office" },
];

type Template = {
  name: string;
  externalId: string;
};

export const urlFromTemplate = (template: Template) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("templateId")) {
    urlParams.set("templateId", template.externalId);
  } else {
    urlParams.append("templateId", template.externalId);
  }
  return `${window.location.pathname}?${urlParams.toString()}`;
};

export function TemplatePicker() {
  const [template, setTemplate] = useState<Template>();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<Template>();

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get("templateId");

  useEffect(() => {
    // TODO get real templates here
    setLoading(false);
    if (templates.length === 1) {
      setTemplate(templates[0]);
      const urlParams = new URLSearchParams(window.location.search);
      if (
        !urlParams.has("templateId") ||
        urlParams.get("templateId") !== templates[0].externalId
      ) {
        window.location.href = urlFromTemplate(templates[0]);
      }
    } else {
      templates.forEach((t: Template) => {
        if (t.externalId?.toString() === templateId) {
          setTemplate(t);
        }
      });
    }
  }, []);

  const templateMenuItems = templates.map((t: Template) => (
    <MenuItem
      as={Button}
      key={t.externalId}
      onClick={() => {
        if (t.externalId !== template?.externalId) {
          setModalTemplate(t);
          setModalOpen(true);
          setTemplate(t); // this should be set when we load a template, but just call here for now
        }
      }}
    >
      {t.name}
    </MenuItem>
  ));

  return (
    <ChakraProvider>
      <ConfirmationModal
        isOpen={modalOpen}
        selectionType={SelectionType.Template}
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
            isLoading={loading}
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
