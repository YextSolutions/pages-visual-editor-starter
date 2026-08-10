// @ts-nocheck
import { PuckComponent, Slot } from "@puckeditor/core";
import { YextComponentConfig } from "@yext/visual-editor/section-library-support";

export interface MainContentProps {
  content: Slot;
}

const MainContentComponent: PuckComponent<MainContentProps> = ({
  content: Content,
  puck,
}) => {
  return (
    <main
      id="main-content"
      style={{
        minHeight: puck.isEditing ? "400px" : undefined,
      }}
    >
      <Content
        disallow={[
          "ExpandedHeader",
          "ExpandedFooter",
          "Header",
          "Footer",
          "MainContent",
        ]}
      />
    </main>
  );
};

export const MainContent: YextComponentConfig<MainContentProps> = {
  label: "Main Content",
  fields: {
    content: {
      type: "slot",
      allow: [],
      visible: false,
    },
  },
  defaultProps: {
    content: [],
  },
  permissions: {
    delete: false,
    drag: false,
    duplicate: false,
  },
  render: (props) => <MainContentComponent {...props} />,
};
