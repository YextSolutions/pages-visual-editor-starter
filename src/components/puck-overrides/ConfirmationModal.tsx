import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import {Entity, urlFromEntity} from "./EntityPicker";

export type ConfirmationModalProps = {
  isOpen: boolean,
  entity?: Entity,
  onClose: () => void,
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  const { isOpen, entity, onClose } = props;

  return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent className='entity-confirmation-modal'>
            <ModalHeader>Confirm navigation to {entity?.name}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <div>Any unsaved changes will be lost.</div>
            </ModalBody>
            <ModalFooter className={'footer'}>
              <Button onClick={onClose} className="close-button button">
                Close
              </Button>
              <Button disabled={!entity} onClick={() => {
                if (entity) {
                  window.location.href = urlFromEntity(entity);
                }
              }} className="primary-button button">Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  )
}