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
import { ConfirmationModal } from "./ConfirmationModal";
import { fetchEntities } from "../../utils/api";
import { useToast } from '@chakra-ui/react'
import { useDocument } from "../../hooks/useDocument";


export type Entity = {
  name: string;
  externalId: string;
  internalId: number;
};

export const urlFromEntity = (entity: Entity) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("entityId")) {
    urlParams.set("entityId", entity.externalId)
  } else {
    urlParams.append("entityId", entity.externalId)
  }
  return `${window.location.pathname}?${urlParams.toString()}`;
};

export function EntityPicker() {
  const [entity, setEntity] = useState<Entity>();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntity, setModalEntity] = useState<Entity>();

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
        entities.forEach(entity => {
          if (entity.externalId === entityId) {
            setEntity(entity);
          }
        })
      } else {
        setEntity(entities[0]);
      }
    })
  })

  const entityMenuItems = entities.map((listEntity: Entity) => (
    <MenuItem
      className={
        entity?.internalId === listEntity.internalId
          ? "current-entity-item"
          : undefined
      }
      as={Button}
      key={listEntity.internalId}
      onClick={() => {
        if (listEntity.internalId !== entity?.internalId) {
          setModalOpen(true);
          setModalEntity(listEntity);
        }
      }}
    >
      {listEntity.name}
    </MenuItem>
  ));

  return (
    <ChakraProvider>
      <ConfirmationModal
        isOpen={modalOpen}
        entity={modalEntity}
        onClose={() => setModalOpen(false)}
      />
      <div className="entity-picker">
        <Menu>
          <MenuButton
            as={Button}
            className="dropdown-button"
            variant={entity ? "solid" : "ghost"}
            isActive={!!entity}
            isLoading={loading}
          >
            {entity ? entity.name : "Entity"}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>{entityMenuItems}</MenuList>
        </Menu>
      </div>
    </ChakraProvider>
  );
}
