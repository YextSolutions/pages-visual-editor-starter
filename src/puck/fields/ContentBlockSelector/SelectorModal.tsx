import { useState, useEffect, useMemo } from "react";
import { useContentBlocks } from "../../../hooks/useContentBlocks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/radio";
import { ContentBlockDisplay } from "../../../components/ContentBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDocument } from "../../../hooks/useDocument";
import { PageStream } from "../../../types/autogen";

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
  const entityId: string | undefined = useDocument<PageStream>(
    (document) => document.id
  );

  console.log(entityId);

  const [blockPreviewIdx, setBlockPreviewIdx] = useState<number | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(
    initialId
  );
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | null
  >(null);

  const itemsPerPage = 6;
  const totalPages = blocks ? Math.ceil(blocks.length / itemsPerPage) : 0;

  const paginatedBlocks = useMemo(() => {
    if (!blocks) return [];
    return Array.from({ length: totalPages }, (_, i) =>
      blocks.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
    );
  }, [blocks, totalPages, open]);

  const PageComponent = useMemo(() => {
    return paginatedBlocks.map((page, index) => (
      <ul role="list" key={index} className="divide-y divide-gray-100">
        {page.map((block, idx) => (
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
                onClick={() => onPreviewBlock(idx)}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                Preview Block
              </Button>
              <Button asChild>
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
    ));
  }, [paginatedBlocks]);

  const getPreviewBlock = () => {
    if (blockPreviewIdx === null || !blocks) return null;

    return <ContentBlockDisplay block={blocks[blockPreviewIdx]} />;
  };

  const onPreviewBlock = (blockIdx: number) => {
    setBlockPreviewIdx(blockIdx);
    setShowPreview(true);
  };

  const onRadioChange = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const onCancel = () => {
    onOpenChange(false);
  };

  const onSubmit = () => {
    onOpenChange(false);
    if (selectedBlockId) {
      onChange(selectedBlockId);
    }
  };

  const onBackFromPreview = () => {
    setShowPreview(false);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setAnimationDirection("left");
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setAnimationDirection("right");
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimationDirection(null), 300);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const selectedBlockName = blocks?.find((block) => block.id === value)?.name;

  const variants = {
    enter: (direction: string) => {
      return {
        x: direction === "left" ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => {
      return {
        x: direction === "left" ? -1000 : 1000,
        opacity: 0,
      };
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button className="max-w-64">
        <DialogTrigger className="w-full truncate">
          {initialId ? selectedBlockName : "Select Block"}
        </DialogTrigger>
      </Button>
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
            <div className="w-full flex-shrink-0 overflow-hidden">
              <RadioGroup value={selectedBlockId} onValueChange={onRadioChange}>
                <AnimatePresence initial={false} custom={animationDirection}>
                  <motion.div
                    key={currentPage}
                    custom={animationDirection}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute top-0 left-0 w-full"
                  >
                    {PageComponent[currentPage]}
                  </motion.div>
                </AnimatePresence>
              </RadioGroup>
            </div>
            <div className="w-full flex-shrink-0">
              {blocks && (
                <div className="flex-grow overflow-auto">
                  {getPreviewBlock()}
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
              <div className="flex justify-between w-full">
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <div>
                  <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button onClick={onSubmit}>Confirm</Button>
                </div>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  variant="outline"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentBlockModal;
