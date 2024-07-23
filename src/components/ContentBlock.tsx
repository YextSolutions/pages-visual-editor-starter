import { ComponentConfig, FieldLabel, Fields } from "@measured/puck";
import { LexicalRichText, Image } from "@yext/pages-components";
import { Section } from "./atoms/section";
import "./index.css";
import { useDocument } from "../hooks/useDocument";
import { ContentBlock as BlockType, PageStream } from "../types/autogen";
import { Heading } from "./atoms/heading";
import ContentBlockSelector from "../puck/fields/ContentBlockSelector";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";

export type ContentBlockProps = {
  blockId: string;
};
const promoFields: Fields<ContentBlockProps> = {
  blockId: {
    type: "custom",
    label: "Block",
    render: ({ id, name, onChange, value }) => (
      <FieldLabel label={name ?? id}>
        <ContentBlockSelector
          name={name}
          value={value}
          onChange={(value) => onChange(value)}
        />
      </FieldLabel>
    ),
  },
};

const ContentBlockDisplay = ({ blockId }: ContentBlockProps) => {
  const contentBlocks: BlockType[] | undefined = useDocument<PageStream>(
    (document) => document.c_contentBlocks
  );

  // console.log(blockId);

  // const block = contentBlocks?.find((block) => block.id === blockId);
  const block = contentBlocks?.[0];

  const fileImg = block?.c_featuredFile?.filePreviewImage;

  if (!block) {
    return null;
  }

  return (
    <Section className="components">
      <div className="sm:flex">
        {fileImg && (
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <Image
              className="flex-none rounded-2xl object-cover"
              image={fileImg}
              layout="fixed"
              height={242}
              width={185}
            />
          </div>
        )}

        <div>
          <Heading level={4}>{block.name}</Heading>
          {block?.richTextDescriptionV2 && (
            <LexicalRichText
              // this is correct
              serializedAST={JSON.stringify(block.richTextDescriptionV2.json)}
            />
          )}
        </div>
      </div>
    </Section>
  );
};

export const ContentBlock: ComponentConfig<ContentBlockProps> = {
  fields: promoFields,
  label: "Content Block",
  render: ({ blockId }) => <ContentBlockDisplay blockId={blockId} />,
};
