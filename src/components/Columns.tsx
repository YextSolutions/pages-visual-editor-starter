import { ComponentConfig, DropZone, Fields } from "@measured/puck";
import { Section } from "./atoms/section";
import "./index.css";

export type ColumnsProps = {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
  }[];
};

const Columns = ({ columns, distribution }: ColumnsProps) => {
  return (
    <Section>
      <div
        className="components flex flex-col min-h-0 min-w-0 gap-6 md:grid md:grid-cols-12"
        style={{
          gridTemplateColumns:
            distribution === "manual"
              ? "repeat(12, 1fr)"
              : `repeat(${columns.length}, 1fr)`,
        }}
      >
        {columns.map(({ span }, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              gridColumn:
                span && distribution === "manual"
                  ? `span ${Math.max(Math.min(span, 12), 1)}`
                  : "",
            }}
          >
            <DropZone zone={`column-${idx}`} allow={["HoursCard", "StoreInfoCard", "Card"]} />
          </div>
        ))}
      </div>
    </Section>
  );
};

const columnsFields: Fields<ColumnsProps> = {
  distribution: {
    type: "radio",
    options: [
      {
        value: "auto",
        label: "Auto",
      },
      {
        value: "manual",
        label: "Manual",
      },
    ],
  },
  columns: {
    type: "array",
    getItemSummary: (col, id) =>
      `Column ${id + 1}, span ${
        col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"
      }`,
    arrayFields: {
      span: {
        label: "Span (1-12)",
        type: "number",
        min: 0,
        max: 12,
      },
    },
  },
};

export const ColumnsComponent: ComponentConfig<ColumnsProps> = {
  fields: columnsFields,
  defaultProps: {
    distribution: "auto",
    columns: [{}, {}],
  },
  render: ({ columns, distribution }) => (
    <Columns columns={columns} distribution={distribution} />
  ),
};
