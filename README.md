# Pages Visual Editor Starter

This branch supports a Section Library with one Entity layout, one Directory
layout, and one Locator layout. A Section Library is the source that users fork
and edit.

## Section Library structure

```text
src/library/
  library.json
  sections/
    Hero.tsx
    Directory.tsx
    Locator.tsx
  shared/
    sectionRegistry.ts
  layouts/
    location/
      metadata.json
      defaultLayout.json
    directory/
      metadata.json
      defaultLayout.json
    locator/
      metadata.json
      defaultLayout.json
```

`library.json` defines `schemaVersion: 1`, a stable library ID, a display name,
and a description. This starter is valid without a library. Add `library.json`
and one layout for each page set type before you build a Section Library site.

Each flat section file must named-export a component with the same name as its
file stem and a `config` value.

```tsx
import type { SectionConfig } from "@yext/visual-editor";

export const Hero = () => <section>Hero</section>;

export const config: SectionConfig = {
  id: "hero",
  displayName: "Hero",
  description: "Shows a page hero.",
  pageSetTypes: ["ENTITY"],
  category: "Content",
};
```

`config.id` is the stable ID stored in layout data. Do not change it after a
layout uses the section. You can rename a section file and its component export
without breaking existing layouts if `config.id` does not change.

The library must contain exactly one layout with each `pageSetType`: `ENTITY`,
`DIRECTORY`, and `LOCATOR`. Entity metadata also sets `previewImageUrl` and can
set verticals and purposes. Directory and Locator metadata sets only the layout
ID, display name, and page set type.

`defaultLayout.json` can reference visible section IDs and compatible shared
component IDs, apart from the built-in `MainContent` wrapper. A visible section
config sets its supported page set types. The editor shows only visible sections
that support the selected layout type.

`shared/sectionRegistry.ts` registers copied Directory and Locator components.
It exports `sharedSections`, `sharedComponents`, `sharedRootConfigs`, and
`sharedRootAllowedComponentIds`. Shared components render and stay editable in
stored layout data, but do not show in the add-component menu. Directory and
Locator source can import stable runtime APIs only from
`@yext/visual-editor/section-library-support`. It must not import Visual Editor
internal or `dist` paths.

## Build output

The Visual Editor plug-in generates Pages templates while it builds. It writes
`assets/section-library-manifest.json` into the Pages artifact. The artifact
contains library and layout metadata, render and editor paths, and default
layout data. It contains no section source.

For current Platform support, the plug-in also generates temporary `main`,
`directory`, `locator`, and `edit` aliases. The legacy `.template-manifest.json`
contains only `main`, `directory`, and `locator`. Platform uses these entries to
find the default code templates and default layouts. Real layout IDs stay only
in the Section Library artifact manifest.

The Locator default has no header or footer. The Directory default includes its
editable, namespaced header and footer.

## Local package

Use a reviewed GitHub-hosted Visual Editor test tarball for Platform testing.
During cross-repository development, you can temporarily use the sibling
`../visual-editor/packages/visual-editor` path and update the lockfile. Restore
the GitHub-hosted tarball before Platform testing. Replace the test tarball with
a released package before this starter becomes a standalone public repository.

## Development

```sh
npm install
npm run dev
npm run build
npm run typecheck
```

Use `npm run build` before deployment. It produces the same Pages artifact
shape that Platform uses.
