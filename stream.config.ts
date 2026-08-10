import type { LocalEditorConfig } from "@yext/visual-editor/plugin";

const config = {
  defaults: {
    layoutId: "yext-bar-social-dining",
    locale: "en",
  },
  layouts: {
    "yext-bar-social-dining": {
      stream: {
        $id: "local-editor-yext-bar-social-dining-stream",
        filter: { entityTypes: ["location"] },
        fields: [
          "id",
          "name",
          "slug",
          "address",
          "description",
          "emails",
          "geomodifier",
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
