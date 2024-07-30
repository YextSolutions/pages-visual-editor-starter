import * as React from "react";
import { LexicalRichText } from "@yext/pages-components";
import { EditorThemeClasses } from "lexical";


export interface RTFProps {
  rtf: string;
}

const theme: EditorThemeClasses = {
  paragraph: 'text-base my-4',
  heading: {
    h1: 'text-4xl font-bold my-4 py-4',
    h2: 'text-3xl font-semibold my-4',
    h3: 'text-2xl font-medium my-4',
    h4: 'text-xl font-medium my-4',
    h5: 'text-lg font-medium my-4',
    h6: 'text-base font-medium my-4',
  },
  list: {
    nested: {
      listitem: 'ml-6',
    },
    ol: 'list-decimal list-inside my-2',
    ul: 'list-disc list-inside my-2',
    listitem: 'ml-4',
  },
  table: 'table-auto my-4',
  tableCell: 'px-4 py-2',
  link: 'text-blue-500 underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  }
};

const RTF: React.FC<RTFProps> = ({ rtf }) => {
  return <LexicalRichText serializedAST={rtf} nodeClassNames={theme} />;
};

export { RTF };
