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
              <p className='content-line'>
                Any unsaved changes will be lost.
              </p>
              <p className='content-line'>
                Are you sure you wish to continue?
              </p>
            </ModalBody>
            <ModalFooter className={'footer'}>
              <Button onClick={onClose} className="close-button button">
                Close
              </Button>
              <Button disabled={!entity} onClick={() => {
                window.location.href = urlFromEntity(entity);
              }} className="primary-button button">Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  )
}