import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
} from '@chakra-ui/react'
import { ChevronDownIcon } from "@chakra-ui/icons";
import { fetchEntities } from "./Ajax";
import { useEffect, useState } from "react";

type Entity = {
  name: string,
  externalId: string,
  internalId: number,
}

const urlFromEntity = (entity: Entity) => {
  return `edit?entityId=${entity.internalId}`;
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
