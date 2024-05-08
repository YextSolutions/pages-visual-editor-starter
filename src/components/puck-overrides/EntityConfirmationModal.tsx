import { Button } from "../ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog"

export type ConfirmationModalProps = {
  isOpen: boolean;
  destinationName: string;
  destinationUrl: string;
  onClose: () => void;
};

export function EntityConfirmationModal(props: ConfirmationModalProps) {
  const { isOpen, destinationName, destinationUrl, onClose } = props;
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Confirm navigation to {destinationName}</DialogTitle>
          <DialogDescription>
            Any unsaved changes will be lost.
            Are you sure you wish to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={!destinationUrl}
            onClick={() => {
              window.location.href = destinationUrl;
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
