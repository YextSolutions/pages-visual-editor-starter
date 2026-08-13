# Pages Visual Editor Starter

This branch supports an Entity-only Section Library. A Section Library is the
source that users fork and edit.

## Section Library structure

```text
src/library/
  library.json
  sections/
    Hero.tsx
  layouts/
    location/
      metadata.json
      defaultLayout.json
```

`library.json` defines `schemaVersion: 1`, a stable library ID, a display name,
and a description. This starter is valid without a library. Add `library.json`
and one Entity layout before you build a Section Library site.

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

Each layout metadata file must set `pageSetType` to `ENTITY`. Its
`defaultLayout.json` must reference only Section Library section IDs, apart
from the built-in `MainContent` wrapper.

## Build output

The Visual Editor plug-in generates Pages templates while it builds. It writes
`assets/section-library-manifest.json` into the Pages artifact. The artifact
contains library and layout metadata, render and editor paths, and default
layout data. It contains no section source.

For current Platform support, the plug-in also generates a legacy
`.template-manifest.json` with `main` and the real layout ID. Platform uses
these entries to find the default code template and default layout.

## Local package

This branch uses a GitHub-hosted Visual Editor test tarball for Platform
testing. During cross-repository development, you can temporarily replace it
with the sibling `../visual-editor/packages/visual-editor` path and update the
lockfile. Restore a reviewed GitHub-hosted tarball before Platform testing.
Replace the test tarball with a released package before this starter becomes a
standalone public repository.

## Development

```sh
npm install
npm run dev
npm run build
npm run typecheck
```

Use `npm run build` before deployment. It produces the same Pages artifact
shape that Platform uses.
