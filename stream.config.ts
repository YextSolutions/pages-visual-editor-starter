import type { LocalEditorConfig } from "@yext/visual-editor/plugin";

const config = {
  defaults: {
    locale: "en",
  },
  pageSetTypes: {
    ENTITY: {
      stream: {
        $id: "local-editor-entity-stream",
        filter: { entityTypes: ["location"] },
        fields: [
          "id",
          "name",
          "slug",
          "address",
          "description",
          "emails",
          "hours",
          "mainPhone",
          "services",
          "yextDisplayCoordinate",
        ],
        localization: { locales: ["en"] },
      },
    },
  },
} satisfies LocalEditorConfig;

export default config;
