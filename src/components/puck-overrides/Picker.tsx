import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
} from '@chakra-ui/react'
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { fetchEntities } from '../../utils/api';

type Entity = {
  name: string,
  externalId: string,
  internalId: number,
}

const urlFromEntity = (entity: Entity) => {
  const currentPath = window.location.href;
  if (currentPath.includes('entityId=')) {
    return currentPath.split('entityId=')[0] + `entityId=${entity.externalId}`;
  } else if (currentPath.includes('templateId=')) {
    return currentPath + `&entityId=${entity.externalId}`
  }
  return currentPath + `?entityId=${entity.externalId}`
}

export function EntityPicker() {
  const [entity, setEntity] = useState<Entity>();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const entityId = urlParams.get("entityId");

  useEffect(() => {
    fetchEntities().then((fetched) => {
      setLoading(false);
      setEntities(fetched);
      if (fetched.length == 1) {
        setEntity(fetched[0]);
        const targetUrl = urlFromEntity(fetched[0]);
        if (!window.location.href.includes(targetUrl)) {
          window.location.href = targetUrl;
        }
      } else {
        fetched.forEach(e => {
          if (e.internalId == entityId) {
            setEntity(e);
          }
        })
      }
    });
  }, []);

  const list = entities.map((e: Entity) => <MenuItem as={Button} key={e.internalId} onClick={() => {
    setEntity(e);
    window.location.href = urlFromEntity(e);
  }}>{e.name}</MenuItem>);

  return (
      <ChakraProvider>
        <div className='entity-picker'>
          <Menu>
            <MenuButton as={Button} className="dropdown-button" variant={entity ? "solid" : "ghost"} isActive={!!entity} isLoading={loading}>
              {entity ? entity.name : "Entity"}
              <ChevronDownIcon/>
            </MenuButton>
            <MenuList>
              {list}
            </MenuList>
          </Menu>
        </div>
      </ChakraProvider>
  )
}

type Template = {
  name: string,
  externalId: string,
}

const urlFromTemplate = (template: Template) => {
  return `edit?templateId=${template.externalId}`
}

export function TemplatePicker() {
  const [template, setTemplate] = useState<Template>();
  const [loading, setLoading] = useState(false);
  
  const templates: Template[] = [
    { name: "location", externalId: "location" },
  ];

  const list = templates.map((t: Template) => <MenuItem as={Button} key={t.externalId} onClick={() => {
    setTemplate(t);
    window.location.href = urlFromTemplate(t);
  }}>{t.name}</MenuItem>);

  return (
    <ChakraProvider>
      <div className='entity-picker'>
        <Menu>
          <MenuButton as={Button} className="dropdown-button" variant={template ? "solid" : "ghost"} isActive={!!template} isLoading={loading}>
            {template ? template.name : "Template"}
            <ChevronDownIcon/>
          </MenuButton>
          <MenuList>
            {list}
          </MenuList>
        </Menu>
      </div>
    </ChakraProvider>
) 
}