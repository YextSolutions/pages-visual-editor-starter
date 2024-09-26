import { ComponentConfig, Fields } from "@measured/puck";
import "./index.css";
import { Section } from "./atoms/section";

export type ColumnsProps = {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
  }[];
  renderDropZone?: any;
};

const Columns = ({ columns, distribution, renderDropZone }: ColumnsProps) => {
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
            {renderDropZone({ zone: `column-${idx}` })}
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
      `Column ${id + 1}, span ${col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"}`,
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
  render: ({ columns, distribution, puck: { renderDropZone } }) => (
    <Columns
      renderDropZone={renderDropZone}
      columns={columns}
      distribution={distribution}
    />
  ),
};
