import { ComponentConfig, FieldLabel, Fields } from "@measured/puck";
import { LexicalRichText, Image } from "@yext/pages-components";
import { Section } from "./atoms/section";
import "./index.css";
import { useDocument } from "../hooks/useDocument";
import { ContentBlock as BlockType, PageStream } from "../types/autogen";
import { Heading } from "./atoms/heading";
import ContentBlockSelector from "../puck/fields/ContentBlockSelector";
import { useMemo } from "react";
import { Skeleton } from "./atoms/skeleton";

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

  return (
    <Section className="components">
      <div className="sm:flex">
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

        <div>
          <Heading level={4}>{block.name}</Heading>
          {block?.richTextDescriptionV2 && (
            <LexicalRichText
              serializedAST={JSON.stringify(block.richTextDescriptionV2.json)}
            />
          )}
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
// TODO: render videos
export const ContentBlock: ComponentConfig<ContentBlockProps> = {
  fields: promoFields,
  label: "Content Block",
  render: ({ blockId }) => {
    const contentBlocks: BlockType[] | undefined = useDocument<PageStream>(
      (document) => document.c_contentBlocks
    );

    console.log(blockId);
    console.log(contentBlocks);

    const block = useMemo(() => {
      return contentBlocks?.find((block) => block.id === blockId);
    }, [blockId, contentBlocks]);

    if (!block) {
      return <ContentBlockSkeleton />;
    }

    return <ContentBlockDisplay block={block} />;
  },
};

export const ContentBlockSkeleton = () => {
  return (
    <Section className="components">
      <div className="sm:flex">
        <Skeleton className="h-60 w-44 mb-4 flex-shrink-0 sm:mb-0 sm:mr-4" />

        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4  mt-4 w-96" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-full mt-1" />
        </div>
      </div>
    </Section>
  );
};
