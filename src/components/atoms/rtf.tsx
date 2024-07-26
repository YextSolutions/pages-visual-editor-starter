import * as React from "react";
import { LexicalRichText } from "@yext/pages-components";

export interface RTFProps {
  rtf: string;
}

const RTF: React.FC<RTFProps> = ({ rtf }) => {
  return <LexicalRichText serializedAST={rtf} />;
};

export { RTF };
