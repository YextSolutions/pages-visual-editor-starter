import { ComponentConfig, Fields } from "@measured/puck";

import { Section } from "./atoms/section";
import "./index.css";
import { useDocument } from "../hooks/useDocument";
import { PageStream } from "../types/autogen";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";

export type ContentBlockProps = {};
const promoFields: Fields<ContentBlockProps> = {};

const ContentBlockDisplay = ({}: ContentBlockProps) => {
  const document = useDocument<PageStream>((document) => document);
  console.log(document);
  return <Section className="components"></Section>;
};

export const ContentBlock: ComponentConfig<ContentBlockProps> = {
  fields: promoFields,

  label: "Content Block",
  render: ({}) => <ContentBlockDisplay />,
};
