import { useDocument } from "../hooks/useDocument";
import {
  C_primaryHighlights,
  FinancialProfessionalStream,
} from "../types/autogen";
import { HighlightCard } from "./HighlightCard";
import { Section } from "./Section";

export interface HighlightsProps {}

export const Highlights = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    const c_primaryHighlights: C_primaryHighlights =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_primaryHighlights
      );

    return (
      <Section className="grid grid-cols-1 md:grid-cols-3">
        {c_primaryHighlights?.highlights?.map((highlight, index) => (
          <HighlightCard {...highlight} />
        ))}
      </Section>
    );
  },
};
