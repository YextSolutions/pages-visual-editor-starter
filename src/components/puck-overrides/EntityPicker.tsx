import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { EntityConfirmationModal } from "./EntityConfirmationModal";
import { useState } from "react";

export type EntityDefinition = {
  name: string;
  externalId: string;
  internalId: number;
};

export interface EntityPickerProps {
  selectedEntity: EntityDefinition;
  entities: EntityDefinition[];
}

export const urlFromEntity = (entity: EntityDefinition) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("entityId")) {
    urlParams.set("entityId", entity.externalId);
  } else {
    urlParams.append("entityId", entity.externalId);
  }
  return `${window.location.pathname}?${urlParams.toString()}`;
};

export function EntityPicker({ selectedEntity, entities }: EntityPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntity, setModalEntity] = useState<EntityDefinition>();

  const entityMenuItems = entities.map((entity: EntityDefinition) => (
    <MenuItem
      className={
        selectedEntity?.internalId === entity.internalId
          ? "current-entity-item"
          : undefined
      }
      as={Button}
      key={entity.internalId}
      onClick={() => {
        if (entity.internalId !== selectedEntity?.internalId) {
          setModalOpen(true);
          setModalEntity(entity);
        }
      }}
    >
      {entity.name}
    </MenuItem>
  ));

  return (
    <ChakraProvider>
      <EntityConfirmationModal
        isOpen={modalOpen}
        destinationName={modalEntity?.name || ""}
        destinationUrl={modalEntity ? urlFromEntity(modalEntity) : ""}
        onClose={() => setModalOpen(false)}
      />
      <div className="entity-picker">
        <Menu>
          <MenuButton
            as={Button}
            className="dropdown-button"
            variant={selectedEntity ? "solid" : "ghost"}
            isActive={!!selectedEntity}
          >
            {selectedEntity ? selectedEntity.name : "Entity"}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>{entityMenuItems}</MenuList>
        </Menu>
      </div>
    </ChakraProvider>
  );
}
