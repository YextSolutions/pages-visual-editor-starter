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
import { ContentBlockDisplay } from "../../../components/ContentBlock";
import { ChevronLeft } from "lucide-react";

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
  const [showPreview, setShowPreview] = useState(false);

  const onPreviewBlock = (block: ContentBlock) => {
    setPreviewBlock(block);
    setShowPreview(true);
  };

  const onRadioChange = (blockId: string) => {
    console.log("radio change: " + blockId);
    setSelectedBlockId(blockId);
  };

  const onCancel = () => {
    onOpenChange(false);
  };

  const onSubmit = () => {
    onOpenChange(false);
    if (selectedBlockId) {
      console.log("Selected Block ID: " + selectedBlockId);
      onChange(selectedBlockId);
    }
  };

  const onBackFromPreview = () => {
    setShowPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="min-w-[1100px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Content Blocks</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] relative overflow-hidden">
          <div
            className={`transition-transform duration-300 ease-in-out ${
              showPreview ? "-translate-x-full" : "translate-x-0"
            } flex`}
          >
            <div className="w-full flex-shrink-0">
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
                          onClick={() => onPreviewBlock(block)}
                          className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        >
                          Preview Block
                        </Button>
                        <Button
                          asChild
                          className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        >
                          <a
                            href={`https://www.yext.com/s/4189325/entity/edit3?entityIds=${block.uid}`}
                            target="_top"
                            rel="noopener noreferrer"
                          >
                            Edit Block
                          </a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </RadioGroup>
            </div>
            <div className="w-full flex-shrink-0">
              {previewBlock && (
                <div className="flex-grow overflow-auto">
                  <ContentBlockDisplay block={previewBlock} />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          {showPreview ? (
            <Button onClick={onBackFromPreview} className="mb-4 self-start">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>Confirm</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentBlockModal;
