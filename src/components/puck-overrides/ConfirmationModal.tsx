import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export enum SelectionType {
  Entity,
  Template,
}

export type ConfirmationModalProps = {
  isOpen: boolean;
  selectionType: SelectionType;
  destinationName: string;
  destinationUrl: string;
  onClose: () => void;
};

export function ConfirmationModal(props: ConfirmationModalProps) {
  const { isOpen, selectionType, destinationName, destinationUrl, onClose } =
    props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="entity-confirmation-modal">
        <ModalHeader>
          {selectionType === SelectionType.Entity
            ? `Confirm navigation to ${destinationName}`
            : `Load template ${destinationName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p className="content-line">Any unsaved changes will be lost.</p>
          <p className="content-line">Are you sure you wish to continue?</p>
        </ModalBody>
        <ModalFooter className={"footer"}>
          <Button onClick={onClose} className="close-button">
            Close
          </Button>
          <Button
            disabled={!destinationUrl}
            onClick={() => {
              window.location.href = destinationUrl;
            }}
            className="primary-button"
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
