# Component Plan

## Contract Metadata

- Artifact Name: plan.md
- Stage: vle-plan-components
- Template Name: nike
- Based On Capture Output: src/registry/nike/.captured-artifact/capture-output.md
- Based On Intermediate JSX: src/registry/nike/.captured-artifact/intermediate-jsx.jsx
- Based On Capture Manifest: src/registry/nike/.captured-artifact/manifest.json
- Requested Source: file:///tmp/nike-figma-source/index.html
- Resolved Source: file:///tmp/nike-figma-source/index.html

## Page Metadata

- Page Title: Nike Store — Localized Experience
- Final URL: file:///tmp/nike-figma-source/index.html
- Captured At: 2026-04-24T20:30:36.370Z
- Planning Completed At: 2026-04-24T20:38:00.000Z

## Ordered Sections

### Section 1

- Section ID: nike-store-header
- Order: 1
- Source Landmark or Selector: header[data-capture-node-id="n8"] with nav[data-capture-node-id="n18"]
- Source Node IDs: n8
- Breakpoint Deltas: Desktop and tablet show account bar, centered nav links, search, favorites, and bag; mobile hides the centered nav tabs but preserves logo/search/icons; nav remains sticky.
- Interaction Model: Visible link navigation, search input, and icon buttons. No owned expanded menu content is visible in the default capture.
- Parity-Critical Details: Top grey account bar, black square brand marks, black swoosh block, active Store underline, pill search field, heart and bag inline SVG icons, and sticky white nav band must remain.
- Target Component Name: NikeStoreHeader
- Target Component File: src/registry/nike/components/NikeStoreHeader.tsx
- Analytics Scope: NikeStoreHeader + analytics hash suffix
- Analytics Source: non-migration synthesized section scope and ordered header link/button events
- Preserve Legacy Names: no
- Viewport Attachment: sticky
- Layout Signature: full-bleed shell; account bar is 36px high with grey background and 16px horizontal padding; sticky nav is 64px high, flex row, 16px horizontal padding, centered tab list on desktop/tablet, tabs hidden on mobile, right utilities remain visible.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve sticky nav geometry, mobile tab hiding, inline SVG utility icons, and simple Nike mark shapes with component-local CSS.
- Data Requirements: Section background belongs to header shell; account bar, logo mark, search surface, and utility icon backgrounds are field-owned. Header links are an ordered editable array.
- Hours Decisions: No hours rendered.
- Notes: Figma export uses shape placeholders for brand marks and swoosh, not reusable image assets.

### Section 2

- Section ID: house-of-innovation-paris-tier
- Order: 2
- Source Landmark or Selector: section.store-tier[data-capture-node-id="n46"]
- Source Node IDs: n46
- Breakpoint Deltas: Desktop/tablet keep a two-column store info row with media on the right and horizontal product rails; mobile stacks the info/media, product rails become two-column grids, and social tiles wrap two per row.
- Interaction Model: Breadcrumb link, Get Directions CTA, Shop All links, shop-card CTAs, and product cards are visible link interactions. No disclosure behavior.
- Parity-Critical Details: The tier starts without a top divider, has compact 12px store metadata, black pill CTA, large pale hero placeholder, six-card What's New rail on desktop, three floor cards, two dark gradient shop cards, three trending cards, and six social tiles.
- Target Component Name: NikeHouseOfInnovationTier
- Target Component File: src/registry/nike/components/NikeHouseOfInnovationTier.tsx
- Analytics Scope: NikeHouseOfInnovationTier + analytics hash suffix
- Analytics Source: non-migration synthesized scope with indexed repeated products, category cards, and social links
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: contained section inside a max-width 1280px content wrapper with 16px horizontal padding; flex store info row; repeated product/media cards use grid/overflow ownership; mobile uses two-column product grids and stacked full-width category cards.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Maintain the Nike retail page spacing, rail/grid behavior, placeholder media surfaces, and category overlay treatment manually.
- Data Requirements: Section shell background is white; product image placeholder background is shared; hero placeholder, shop-card surface, shop-card overlay, and CTA backgrounds are field-owned. CTA background color lives on each CTA object with Label and Link.
- Hours Decisions: Source shows static schedule copy in a multi-store Figma tier; no entity-backed HoursTable is used for this non-location composite tier.
- Notes: Address and hours are tier-specific authored content, not a single stream entity binding.

### Section 3

- Section ID: nike-santa-monica-tier
- Order: 3
- Source Landmark or Selector: section.store-tier[data-capture-node-id="n217"]
- Source Node IDs: n217
- Breakpoint Deltas: Desktop/tablet preserve four-card What's New grid, two shop category cards, three trending cards, and six social tiles; mobile stacks store info/media and wraps cards into two columns.
- Interaction Model: Breadcrumb link, Get Directions CTA, live status text, Shop All links, shop-card CTAs, product cards, and social links. No disclosure behavior.
- Parity-Critical Details: This tier has a top divider, Nike Direct orange eyebrow, open/close status line below CTA, four What's New cards, dark shop cards, and six social tiles.
- Target Component Name: NikeDirectTier
- Target Component File: src/registry/nike/components/NikeDirectTier.tsx
- Analytics Scope: NikeDirectTier + analytics hash suffix
- Analytics Source: non-migration synthesized scope with indexed repeated links
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: full-width white band with top border and contained 1280px inner wrapper; compact info column plus right media placeholder; product and social grids maintain source column counts and mobile wrapping.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Reuse a tier-local custom layout tuned to the Direct store content and status line.
- Data Requirements: Section, product placeholder, hero placeholder, shop-card surface, shop-card overlay, and CTA background colors are field-owned.
- Hours Decisions: Status line is authored static copy in the Figma composite tier.
- Notes: Tier layout is visually related to Paris but intentionally has fewer modules.

### Section 4

- Section ID: nike-pilot-coming-soon-tier
- Order: 4
- Source Landmark or Selector: section.store-tier[data-capture-node-id="n349"]
- Source Node IDs: n349
- Breakpoint Deltas: Desktop/tablet show text left and orange launch card right; mobile stacks the launch card below copy, keeps expectation cards two-column/one trailing, and stacks shop cards.
- Interaction Model: Breadcrumb, Notify Me CTA, Shop All links, shop-card CTAs, and product cards. No disclosure behavior.
- Parity-Critical Details: Orange pilot eyebrow, large "The Grove — Coming Soon" heading, black Notify Me pill, bright orange opening announcement card with black diagonal mark, three What to Expect cards, shop category cards, and three trending cards.
- Target Component Name: NikePilotTier
- Target Component File: src/registry/nike/components/NikePilotTier.tsx
- Analytics Scope: NikePilotTier + analytics hash suffix
- Analytics Source: non-migration synthesized scope
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: contained white tier with divider; intro row uses two-column flex with launch card aligned right; module grids use three columns on desktop/tablet and two-column mobile wrapping.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: The orange announcement card and diagonal mark are bespoke visual identity and should be hand-rendered with CSS.
- Data Requirements: Section background, launch card background, product placeholder, shop-card surface, shop-card overlay, and CTA background colors are field-owned.
- Hours Decisions: No hours table/status rendered.
- Notes: This tier is a future-store marketing variant rather than a current store location.

### Section 5

- Section ID: nike-unite-salem-tier
- Order: 5
- Source Landmark or Selector: section.store-tier[data-capture-node-id="n435"]
- Source Node IDs: n435
- Breakpoint Deltas: Desktop/tablet keep info/media split, four What's New cards, and three trending cards; mobile stacks info/media and wraps product cards two per row.
- Interaction Model: Breadcrumb, Get Directions CTA, product card links, and Shop All link. No disclosure behavior.
- Parity-Critical Details: Nike Unite orange eyebrow, compact address/hours, right pale media placeholder, four What's New cards, three Trending Now cards, and no shop category/social modules.
- Target Component Name: NikeUniteTier
- Target Component File: src/registry/nike/components/NikeUniteTier.tsx
- Analytics Scope: NikeUniteTier + analytics hash suffix
- Analytics Source: non-migration synthesized scope
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: contained white tier with divider; store info flex row, product sections as responsive grids with desktop four/three-column and mobile two-column behavior.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the reduced module set and spacing rather than forcing the richer Direct layout.
- Data Requirements: Section background, product placeholder, hero placeholder, and CTA background colors are field-owned.
- Hours Decisions: Static schedule copy in source is authored tier content.
- Notes: Missing shop/social modules are intentional for this tier.

### Section 6

- Section ID: nike-partner-store-tier
- Order: 6
- Source Landmark or Selector: section.store-tier[data-capture-node-id="n507"]
- Source Node IDs: n507
- Breakpoint Deltas: Desktop/tablet include only store header metadata and a three-card trending grid; mobile stacks metadata and wraps cards two per row.
- Interaction Model: Breadcrumb, Get Directions CTA, product card links, and Shop All link. No disclosure behavior.
- Parity-Critical Details: Partner Store title, partner-location address placeholder copy, black CTA, top divider, and minimal three-card Trending Now module.
- Target Component Name: NikePartnerTier
- Target Component File: src/registry/nike/components/NikePartnerTier.tsx
- Analytics Scope: NikePartnerTier + analytics hash suffix
- Analytics Source: non-migration synthesized scope
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: contained white tier with divider; compact text column and one product grid module; no right image, no What's New, no shop cards, and no social tiles.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Use a sparse tier variant to preserve the partner-store reduced content hierarchy.
- Data Requirements: Section background, product placeholder, and CTA background colors are field-owned.
- Hours Decisions: Static schedule copy in source is authored tier content.
- Notes: The source intentionally omits hero media for this tier.

### Section 7

- Section ID: nike-footer-placeholder
- Order: 7
- Source Landmark or Selector: footer[data-capture-node-id="n547"]
- Source Node IDs: n547
- Breakpoint Deltas: Footer placeholder remains centered in a pale grey full-width band across desktop, tablet, and mobile.
- Interaction Model: No owned default-state interactive behavior beyond visible link navigation.
- Parity-Critical Details: Pale grey footer band with centered muted placeholder copy.
- Target Component Name: NikeFooterPlaceholder
- Target Component File: src/registry/nike/components/NikeFooterPlaceholder.tsx
- Analytics Scope: NikeFooterPlaceholder + analytics hash suffix
- Analytics Source: non-migration synthesized scope
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: full-bleed footer band, 160px min-height, center-aligned small grey text.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Simple custom footer shell matches the export placeholder without inventing missing footer navigation.
- Data Requirements: Section background is field-owned; placeholder text is editable.
- Hours Decisions: No hours rendered.
- Notes: Export explicitly says the footer component goes here.

## Interaction Analytics Map

- Section ID: nike-store-header
  - Interaction ID: header-link-0
  - Event Name: headerLink0
  - Source Selector Or Origin: n23 New & Featured
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: nike-store-header
  - Interaction ID: header-link-1
  - Event Name: headerLink1
  - Source Selector Or Origin: n25 Men
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: nike-store-header
  - Interaction ID: header-link-2
  - Event Name: headerLink2
  - Source Selector Or Origin: n27 Store
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: house-of-innovation-paris-tier
  - Interaction ID: get-directions
  - Event Name: getDirections
  - Source Selector Or Origin: n64 Get Directions
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: nike-santa-monica-tier
  - Interaction ID: get-directions
  - Event Name: getDirections
  - Source Selector Or Origin: n234 Get Directions
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: nike-pilot-coming-soon-tier
  - Interaction ID: notify-me
  - Event Name: notifyMe
  - Source Selector Or Origin: n362 Notify Me
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: nike-unite-salem-tier
  - Interaction ID: get-directions
  - Event Name: getDirections
  - Source Selector Or Origin: n452 Get Directions
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: nike-partner-store-tier
  - Interaction ID: get-directions
  - Event Name: getDirections
  - Source Selector Or Origin: n523 Get Directions
  - Preservation Mode: synthesized
  - Is Indexed: no

## Header Parity Table

| Section | Group or Band | Index | Label | Href | Expand/Collapse Behavior | Trigger Type | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| nike-store-header | brand home | 0 | Nike home | / | none | link | Black swoosh mark |
| nike-store-header | main nav | 0 | New & Featured | # | none | link | Hidden on mobile |
| nike-store-header | main nav | 1 | Men | # | none | link | Hidden on mobile |
| nike-store-header | main nav | 2 | Store | # | none | link | Active underline |
| nike-store-header | main nav | 3 | Kids | # | none | link | Hidden on mobile |
| nike-store-header | main nav | 4 | Sale | # | none | link | Hidden on mobile |
| nike-store-header | utilities | 0 | Search | none | none | input | Pill search field |
| nike-store-header | utilities | 1 | Favorites | none | none | button | Heart icon |
| nike-store-header | utilities | 2 | Shopping bag | none | none | button | Bag icon |

## Footer Parity Table

| Section | Group or Band | Index | Label | Href | Expand/Collapse Behavior | Trigger Type | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| nike-footer-placeholder | placeholder | 0 | ← Footer component goes here → | none | none | text | No source footer links |

## Implementation Checklist

- ordered section-to-component checklist: NikeStoreHeader, NikeHouseOfInnovationTier, NikeDirectTier, NikePilotTier, NikeUniteTier, NikePartnerTier, NikeFooterPlaceholder.
- config or layout-data implications: defaultLayout.json should include the seven generated components in the order listed above; no ve.config.tsx exists in this starter, so runtime registration is skipped.
- planning notes that affected section boundaries or ownership: The export's five store tiers are preserved as separate sections instead of collapsing into one shell, because each tier has distinct module presence, product counts, and CTA/status behavior.
