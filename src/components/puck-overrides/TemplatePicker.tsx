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

// Hardcoded, to be replaced
const templates: Template[] = [{ name: "location", externalId: "location" }];

type Template = {
  name: string;
  externalId: string;
};

const urlFromTemplate = (template: Template) => {
  return `edit?templateId=${template.externalId}`;
};

export function TemplatePicker() {
  const [template, setTemplate] = useState<Template>();
  const [loading, setLoading] = useState(false);

  const list = templates.map((t: Template) => (
    <MenuItem
      as={Button}
      key={t.externalId}
      onClick={() => {
        setTemplate(t);
        window.location.href = urlFromTemplate(t);
      }}
    >
      {t.name}
    </MenuItem>
  ));

  return (
    <ChakraProvider>
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
          <MenuList>{list}</MenuList>
        </Menu>
      </div>
    </ChakraProvider>
  );
}
