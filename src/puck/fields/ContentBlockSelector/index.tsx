import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import ContentBlockModal from "./ContentBlockModal";
import { useState } from "react";

const queryClient = new QueryClient();

interface ContentBlockSelectorProps {
  name: string;
  onChange: (value: string) => void;
  value: string;
}

const ContentBlockSelector = ({
  name,
  onChange,
  value,
}: ContentBlockSelectorProps) => {
  const [open, setOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <ContentBlockModal
        initialId={value}
        name={name}
        value={value}
        onChange={onChange}
        open={open}
        onOpenChange={setOpen}
      />
    </QueryClientProvider>
  );
};

export default ContentBlockSelector;
