import { ComponentConfig } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import { PageStream, RTFType } from "../types/autogen";

import { Section } from "./Section";

import { RTF } from "./atoms/rtf";

export type PageContentProps = {};

export const PageContent: ComponentConfig<PageContentProps> = {
  fields: {},
  render: () => {
    const rtf: RTFType | undefined = useDocument<PageStream>(
      (document) => document?.richTextDescriptionV2
    );

    if (!rtf) {
      return <></>;
    }

    return (
      <Section>
        <RTF rtf={JSON.stringify(rtf?.json)} />
      </Section>
    );
  },
};
