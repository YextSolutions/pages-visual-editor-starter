import { useState } from "react";
import { useContentBlocks } from "../../../hooks/useContentBlocks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ContentBlock } from "../../../types/autogen";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/radio";

interface ContentBlockSelectorProps {
  initialId: string;
  name: string;
  onChange: (value: string) => void;
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContentBlockModal = ({
  initialId,
  name,
  value,
  onChange,
  open,
  onOpenChange,
}: ContentBlockSelectorProps) => {
  const { data: blocks, error, isLoading } = useContentBlocks();

  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(
    initialId
  );
  const [previewBlock, setPreviewBlock] = useState<ContentBlock | undefined>();

  const onRadioChange = (blockId: string) => {
    console.log("radio change: " + blockId);
    setSelectedBlockId(blockId);
  };

  const onSubmit = (event: React.FormEvent) => {
    // event.preventDefault();
    onOpenChange(false);
    // if (selectedBlockId) {
    console.log("Selected Block ID: " + selectedBlockId);
    onChange(selectedBlockId);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>Open</DialogTrigger>
      <form onSubmit={onSubmit}>
        <DialogContent className="w-[700px]">
          <DialogHeader>
            <DialogTitle>Content Blocks</DialogTitle>
          </DialogHeader>
          <RadioGroup value={selectedBlockId} onValueChange={onRadioChange}>
            <ul role="list" className="divide-y divide-gray-100">
              {blocks?.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between gap-x-6 py-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <RadioGroupItem value={block.id} id={block.id} />
                      <label
                        htmlFor={block.id}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        {block.name}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <Button
                      onClick={() => setPreviewBlock(block)}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      Preview Block
                    </Button>
                    <Button
                      onClick={() => {}}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      Edit Content
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </RadioGroup>
          <DialogFooter>
            <Button onClick={(e) => onSubmit(e)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ContentBlockModal;
