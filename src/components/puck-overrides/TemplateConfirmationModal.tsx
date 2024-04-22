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

export type ConfirmationModalProps = {
  isOpen: boolean;
  destinationName: string;
  destinationUrl: string;
  onClose: () => void;
};

export function TemplateConfirmationModal(props: ConfirmationModalProps) {
  const { isOpen, destinationName, destinationUrl, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="confirmation-modal">
        <ModalHeader>Load template {destinationName}</ModalHeader>
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
