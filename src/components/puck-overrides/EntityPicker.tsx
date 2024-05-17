import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown";
import { EntityConfirmationModal } from "./EntityConfirmationModal";
import { useState } from "react";
import { Button } from "../ui/button";

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
    <DropdownMenuItem key={entity.internalId}>
      <Button
        variant="ghost"
        key={entity.internalId}
        onClick={() => {
          if (entity.internalId !== selectedEntity?.internalId) {
            setModalOpen(true);
            setModalEntity(entity);
          }
        }}
      >
        {entity.name}
      </Button>
    </DropdownMenuItem>
  ));

  return (
    <>
      <EntityConfirmationModal
        isOpen={modalOpen}
        destinationName={modalEntity?.name || ""}
        destinationUrl={modalEntity ? urlFromEntity(modalEntity) : ""}
        onClose={() => setModalOpen(false)}
      />
      <div className="entity-picker">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={selectedEntity ? "default" : "ghost"}>
              {selectedEntity ? selectedEntity.name : "Entity"}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{entityMenuItems}</DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
