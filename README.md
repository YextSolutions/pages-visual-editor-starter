# Pages Visual Editor Section Library Starter

This repository is the base for one Section Library. Add one library under
`src/library`. The Visual Editor plug-in finds the library during a Pages build.

## Library structure

```
src/library/
  library.json
  sections/
    Header.tsx
    Hero.tsx
  shared/
    components/
    utils/
  layouts/
    restaurant-location/
      defaultLayout.json
      metadata.json
```

`shared` is a convention. A section can import shared code, styles, and assets
from any path in this repository.

## Metadata

`library.json` is required when the library is ready to build.

```json
{
  "schemaVersion": 1,
  "id": "bar-social-dining",
  "displayName": "Bar & Social Dining",
  "description": "Sections and layouts for restaurant pages."
}
```

Each section is one `.tsx` file directly in `src/library/sections`. Its file
name is its stable section ID. The file must named-export a Puck component
config with the same name and named-export Section Library metadata.

```tsx
import type { ComponentConfig } from "@puckeditor/core";
import type { SectionConfig } from "@yext/visual-editor";

export const Hero: ComponentConfig = {
  render: () => <section>Hero</section>,
};

export const config: SectionConfig = {
  displayName: "Hero",
  description: "Shows a page hero.",
  pageSetTypes: ["ENTITY"],
  category: "Content",
};
```

Each layout directory has `defaultLayout.json` and `metadata.json`.

```json
{
  "id": "restaurant-location",
  "displayName": "Restaurant Location",
  "previewImageUrl": "https://example.com/restaurant-location.jpg",
  "vertical": "FOOD_AND_DINING",
  "purpose": "LOCATION",
  "pageSetType": "ENTITY"
}
```

The plug-in creates one Pages template and one editor route at
`/edit/<layoutId>` for each layout. It adds only sections that support the
layout page set type. It does not add the Visual Editor built-in sections.

## Local editor

`npm run dev` also creates `/local-editor`. It uses `layoutId`, `entityId`,
and `locale` URL parameters. The local editor reads the Section Library source
and `stream.config.ts` directly. It does not use a template manifest.

The included `starter-location` layout and `Hero` section are a working
example. Run your Pages local data generation flow to add snapshots in
`localData`. Then open `/local-editor` to edit the layout with local snapshot
data. The editor stores drafts by layout and locale in local browser storage.

Restart `npm run dev` after you add or remove a layout or section file. The
plug-in creates one local data Pages template for each layout. It creates
`stream.config.ts` only when the file is missing. It adds a location stream for
ENTITY layouts. You must add streams for DIRECTORY and LOCATOR layouts.

## Build output

`npm run build` writes `assets/section-library-manifest.json` to the Pages
artifact. The file contains library metadata, layout metadata, each template
ID, each editor path, and each default layout. It contains no section source.

Run these commands during development:

```shell
npm install
npm run typecheck
npm run dev
npm run build
```

This development branch uses a local Visual Editor package path. Replace
`file:../visual-editor/packages/visual-editor` with a released package version
before you publish this repository as a standalone Section Library repository.
The local package install builds runnable bundles but does not run the full
Visual Editor type build.
