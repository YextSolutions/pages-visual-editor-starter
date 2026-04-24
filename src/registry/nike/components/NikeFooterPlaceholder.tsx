import * as React from "react";
import {
  ComponentConfig,
  FieldLabel,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
import { getAnalyticsScopeHash, VisibilityWrapper } from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

export type NikeFooterPlaceholderProps = {
  text: string;
  section: {
    backgroundColor: string;
    visibleOnLivePage: boolean;
  };
};

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);

const colorField = (label: string, fallback: string) => ({
  label,
  type: "custom" as const,
  render: ({
    value,
    onChange,
    readOnly,
  }: {
    value: unknown;
    onChange: (value: string) => void;
    readOnly?: boolean;
  }) => (
    <FieldLabel label={label}>
      <input
        type="color"
        value={isHexColor(value) ? value : fallback}
        onChange={(event) => onChange(event.currentTarget.value)}
        disabled={readOnly}
      />
    </FieldLabel>
  ),
});

const NikeFooterPlaceholderFields: Fields<NikeFooterPlaceholderProps> = {
  text: {
    label: "Text",
    type: "text",
  },
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: colorField("Background Color", "#f5f5f5"),
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
};

export const NikeFooterPlaceholderComponent: PuckComponent<
  NikeFooterPlaceholderProps
> = (props) => (
  <VisibilityWrapper
    liveVisibility={props.section.visibleOnLivePage}
    isEditing={props.puck.isEditing}
  >
    <AnalyticsScopeProvider
      name={`NikeFooterPlaceholder${getAnalyticsScopeHash(props.id)}`}
    >
      <footer
        style={{
          alignItems: "center",
          backgroundColor: props.section.backgroundColor,
          color: "#777777",
          display: "flex",
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: "13px",
          justifyContent: "center",
          height: "220px",
          marginTop: "48px",
          textAlign: "center",
        }}
      >
        {props.text}
      </footer>
    </AnalyticsScopeProvider>
  </VisibilityWrapper>
);

export const NikeFooterPlaceholder: ComponentConfig<NikeFooterPlaceholderProps> =
  {
    label: "Nike Footer Placeholder",
    fields: NikeFooterPlaceholderFields,
    defaultProps: {
      text: "← Footer component goes here →",
      section: {
        backgroundColor: "#f5f5f5",
        visibleOnLivePage: true,
      },
    },
    render: NikeFooterPlaceholderComponent,
  };
