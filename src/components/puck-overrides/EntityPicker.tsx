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

export function EntityPicker() {
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetchEntities().then((fetched) => {
      setEntities(fetched);
    });
  }, []);

  const list = entities.map((entity: Entity) => <MenuItem as='a' key={entity.internalId} href={`edit?entityId=${entity.internalId}`}>{entity.name}</MenuItem>);

  return (
      <ChakraProvider>
        <div className='entity-picker'>
          <Menu>
            <MenuButton as={Button} className="dropdown-button">
              Entity <ChevronDownIcon/>
            </MenuButton>
            <MenuList>
              {list}
            </MenuList>
          </Menu>
        </div>
      </ChakraProvider>
  )
}
