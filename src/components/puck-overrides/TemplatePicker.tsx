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
import { fetchTemplates } from "../../utils/api";
import { TemplateConfirmationModal } from "./TemplateConfirmationModal";

export type Template = {
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<Template>();

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get("templateId");

  useEffect(() => {
    fetchTemplates().then((fetchedTemplates) => {
      setLoading(false);
      setTemplates(fetchedTemplates);
      if (fetchedTemplates.length === 1) {
        setTemplate(fetchedTemplates[0]);
        const urlParams = new URLSearchParams(window.location.search);
        if (
          !urlParams.has("templateId") ||
          urlParams.get("templateId") !== fetchedTemplates[0].externalId
        ) {
          window.location.href = urlFromTemplate(fetchedTemplates[0]);
        }
      } else {
        fetchedTemplates.forEach((t: Template) => {
          if (t.externalId?.toString() === templateId) {
            setTemplate(t);
          }
        });
      }
    });
  }, []);

  const templateMenuItems = templates.map((t: Template) => (
    <MenuItem
      as={Button}
      key={t.externalId}
      onClick={() => {
        if (t.externalId !== template?.externalId) {
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
