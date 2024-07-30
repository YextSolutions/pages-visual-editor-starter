import { ComponentConfig, FieldLabel, Fields } from "@measured/puck";
import { LexicalRichText, Image } from "@yext/pages-components";
import { Section } from "./atoms/section";
import "./index.css";
import { useDocument } from "../hooks/useDocument";
import { ContentBlock as BlockType, PageStream } from "../types/autogen";
import { Heading } from "./atoms/heading";
import ContentBlockSelector from "../puck/fields/ContentBlockSelector";
import { Skeleton } from "./atoms/skeleton";
import { useElementSize } from "@mantine/hooks";
import { useEffect } from "react";
import { cn } from "../utils/cn";
import useEnvironment from "../hooks/useEnvironment";

export type ContentBlockProps = {
  blockId: string;
};

// TODO: Content Selector on right side
const promoFields: Fields<ContentBlockProps> = {
  blockId: {
    type: "custom",
    label: "Block",
    render: ({ id, name, onChange, value }) => (
      <FieldLabel label={"Block"}>
        <ContentBlockSelector
          name={name}
          value={value}
          onChange={(value) => onChange(value)}
        />
      </FieldLabel>
    ),
  },
};

interface ContentBlockDisplayProps {
  block: BlockType;
}

export const ContentBlockDisplay = ({ block }: ContentBlockDisplayProps) => {
  const fileImg = block?.c_featuredFile?.filePreviewImage;
  const featuredVideoUrl = block?.c_featuredVideo?.video?.url;
  const rtfString = JSON.stringify(block?.richTextDescriptionV2?.json);

  const { ref, width, height } = useElementSize();

  return (
    <Section ref={ref} className="components">
      <div className={cn("sm:flex", width < 700 && "sm:flex-col")}>
        {featuredVideoUrl ? (
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <iframe
              width="242"
              height="185"
              src={"https://www.youtube.com/embed/dQw4w9WgXcQ"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl"
            ></iframe>
          </div>
        ) : fileImg ? (
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <Image
              className="flex-none rounded-2xl object-cover"
              image={fileImg}
              layout="fixed"
              height={242}
              width={185}
            />
          </div>
        ) : null}

        <div className={cn("", width < 700 && "sm:pt-4")}>
          <Heading level={4}>{block.name}</Heading>
          {rtfString && <LexicalRichText serializedAST={rtfString} />}
        </div>
      </div>
      {block.c_featuredFile?.label && (
        <div className="mt-6">
          <a
            href={block.c_featuredFile.file.url}
            target="_top"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-2xl font-semibold"
          >
            {block.c_featuredFile.label}
          </a>
        </div>
      )}
    </Section>
  );
};

// TODO: Entity fields
export const ContentBlock: ComponentConfig<ContentBlockProps> = {
  fields: promoFields,
  label: "Content Block",
  render: ({ blockId }) => {
    const contentBlocks: BlockType[] | undefined = useDocument<PageStream>(
      (document) => document.c_contentBlocks
    );

    const block = contentBlocks?.find((block) => block.id === blockId);

    const isEditor = useEnvironment();

    // if (!block) {
    //   return <ContentBlockSkeleton />;
    // }

    if (!block) {
      if (isEditor) {
        return (
          <ContentBlockSkeleton/>
        );
      } else {
        return <></>;
      }
    }

    return <ContentBlockDisplay block={block} />;
  },
};

export const ContentBlockSkeleton = () => {

  return (
    <Section className="components">
      <div className="flex flex-wrap overflow-hidden">
        <Skeleton className="h-60 w-auto mb-4 flex-shrink-0 sm:mb-0 sm:mr-4" />

        <div className="flex flex-col flex-grow space-y-3">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Section>

  );
};
