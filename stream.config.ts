import type { LocalEditorConfig } from "@yext/visual-editor/plugin";

const baseLocationStream = {
  filter: { entityTypes: ["location"] },
  fields: [
    "id",
    "uid",
    "meta",
    "slug",
    "name",
    "hours",
    "dineInHours",
    "driveThroughHours",
    "address",
    "yextDisplayCoordinate",
    // "c_productSection.sectionTitle",
    // "c_hero",
    // "dm_directoryParents_defaultdirectory.slug",
    // "dm_directoryParents_defaultdirectory.name",
    "additionalHoursText",
    "mainPhone",
    "emails",
    "services",
    // "c_deliveryPromo",
    "ref_listings",
    // "ref_reviewsAgg.topReviews",
    // "ref_reviewsAgg.publisher",
    // "ref_reviewsAgg.reviewsCount",
    // "ref_reviewsAgg.averageRating",
  ],
  localization: {
    locales: ["en"],
  },
};

const config = {
  defaults: {
    templateId: "directory",
    locale: "en",
  },
  templates: {
    "directory": {
      // stream: {
      //   filter: { entityTypes: ["ce_city", "ce_region", "ce_state", "ce_root"] },
      //   $id: "local-editor-directory-stream",
      //   fields: [
      //     "dm_directoryParents.name",
      //     "dm_directoryParents.slug",
      //     "dm_directoryChildren.name",
      //     "dm_directoryChildren.address",
      //     "dm_directoryChildren.slug",
      //   ],
      // },
    },
    "locator": {
      // stream: {
      //   filter: { entityTypes: ["locator"] },
      //   $id: "local-editor-locator-stream",
      //   fields: [],
      // },
    },
    "edward-jones-pages": {
      stream: {
        ...baseLocationStream,
        $id: "local-editor-edward-jones-pages-stream",
      },
    },
    "edwardjonespages": {
      stream: {
        ...baseLocationStream,
        $id: "local-editor-edwardjonespages-stream",
      },
    },
  },
} satisfies LocalEditorConfig;

export default config;
