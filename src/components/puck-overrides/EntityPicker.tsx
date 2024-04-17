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
import { ConfirmationModal } from "./ConfirmationModal";

export type Entity = {
  name: string,
  externalId: string,
  internalId: number,
}

export const urlFromEntity = (entity?: Entity) => {
  return entity ? `edit?entityId=${entity.internalId}` : "edit";
}

export function EntityPicker() {
  const [entity, setEntity] = useState<Entity>();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntity, setModalEntity] = useState<Entity>();

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
        fetched.forEach((e: Entity) => {
          if (e.internalId?.toString() == entityId) {
            setEntity(e);
          }
        })
      }
    });
  }, []);

  const list = entities.map((listEntity: Entity) => <MenuItem className={entity?.internalId == listEntity.internalId ? "current-entity-item" : undefined} as={Button} key={listEntity.internalId} onClick={() => {
    if (listEntity.internalId != entity?.internalId) {
      setModalOpen(true);
      setModalEntity(listEntity);
    }
  }}>{listEntity.name}</MenuItem>);

  return (
      <ChakraProvider>
        <ConfirmationModal isOpen={modalOpen} entity={modalEntity} onClose={() => setModalOpen(false)}/>
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
