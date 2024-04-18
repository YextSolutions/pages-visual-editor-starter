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
import { useToast } from '@chakra-ui/react'
import { useDocument } from "../../hooks/useDocument";


type Entity = {
  name: string,
  externalId: string,
  internalId: number,
}

const urlFromEntity = (entity: Entity) => {
  return `edit?entityId=${entity.externalId}`;
}

export function EntityPicker() {
  const [entity, setEntity] = useState<Entity>();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast()

  const urlParams = new URLSearchParams(window.location.search);
  const entityId = urlParams.get("entityId");
  const entityDocument = useDocument()

  useEffect(() => {
    fetchEntities().then((entities) => {
      setLoading(false);
      setEntities(entities);
      if (entities.length === 0) {
          toast({
          title: `No entities associated with template`,
          status: 'info',
          isClosable: true,
        })
      } else if (entityId) {
        entities.forEach(e => {
            if (e.externalId === entityId) {
              setEntity(e);
            }
        })
      } else {
        setEntity(entityDocument);
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
