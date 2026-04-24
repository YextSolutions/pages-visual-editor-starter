# Generation Output

## Contract Metadata

- Artifact Name: generation-output.md
- Stage: vle-generate-components
- Template Name: nike
- Based On Plan Artifact: src/registry/nike/.workflow-artifact/plan.md
- Based On Intermediate JSX: src/registry/nike/.captured-artifact/intermediate-jsx.jsx
- Generation Completed At: 2026-04-24T20:52:00.000Z

## File Changes

- Created Files:
  - src/registry/nike/components/NikeStoreHeader.tsx
  - src/registry/nike/components/NikeHouseOfInnovationTier.tsx
  - src/registry/nike/components/NikeDirectTier.tsx
  - src/registry/nike/components/NikePilotTier.tsx
  - src/registry/nike/components/NikeUniteTier.tsx
  - src/registry/nike/components/NikePartnerTier.tsx
  - src/registry/nike/components/NikeFooterPlaceholder.tsx
- Updated Files:
  - none
- Unchanged Files:
  - src/registry/nike/.captured-artifact/intermediate-jsx.jsx

## Section To Component Mapping

- Section ID: nike-store-header
  - Component Name: NikeStoreHeader
  - Component File: src/registry/nike/components/NikeStoreHeader.tsx
  - Status: created
- Section ID: house-of-innovation-paris-tier
  - Component Name: NikeHouseOfInnovationTier
  - Component File: src/registry/nike/components/NikeHouseOfInnovationTier.tsx
  - Status: created
- Section ID: nike-santa-monica-tier
  - Component Name: NikeDirectTier
  - Component File: src/registry/nike/components/NikeDirectTier.tsx
  - Status: created
- Section ID: nike-pilot-coming-soon-tier
  - Component Name: NikePilotTier
  - Component File: src/registry/nike/components/NikePilotTier.tsx
  - Status: created
- Section ID: nike-unite-salem-tier
  - Component Name: NikeUniteTier
  - Component File: src/registry/nike/components/NikeUniteTier.tsx
  - Status: created
- Section ID: nike-partner-store-tier
  - Component Name: NikePartnerTier
  - Component File: src/registry/nike/components/NikePartnerTier.tsx
  - Status: created
- Section ID: nike-footer-placeholder
  - Component Name: NikeFooterPlaceholder
  - Component File: src/registry/nike/components/NikeFooterPlaceholder.tsx
  - Status: created

## Emitted Analytics Mapping

- Section ID: nike-store-header
  - Interaction ID: header-link-0
  - Scope: NikeStoreHeader + analytics hash suffix
  - Event Name: headerLink0
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: house-of-innovation-paris-tier
  - Interaction ID: get-directions
  - Scope: NikeHouseOfInnovationTier + analytics hash suffix
  - Event Name: getDirections
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: nike-santa-monica-tier
  - Interaction ID: get-directions
  - Scope: NikeDirectTier + analytics hash suffix
  - Event Name: getDirections
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: nike-pilot-coming-soon-tier
  - Interaction ID: notify-me
  - Scope: NikePilotTier + analytics hash suffix
  - Event Name: notifyMe
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: nike-unite-salem-tier
  - Interaction ID: get-directions
  - Scope: NikeUniteTier + analytics hash suffix
  - Event Name: getDirections
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: nike-partner-store-tier
  - Interaction ID: get-directions
  - Scope: NikePartnerTier + analytics hash suffix
  - Event Name: getDirections
  - Runtime Primitive: Link eventName
  - Mapping Kind: synthesized
- Section ID: nike-footer-placeholder
  - Interaction ID: placeholder
  - Scope: NikeFooterPlaceholder + analytics hash suffix
  - Event Name: none
  - Runtime Primitive: none
  - Mapping Kind: synthesized

## Component Order

- Component Order Used For Layout Data: NikeStoreHeader, NikeHouseOfInnovationTier, NikeDirectTier, NikePilotTier, NikeUniteTier, NikePartnerTier, NikeFooterPlaceholder

## Default Layout

- Default Layout Command: VISUAL_EDITOR_STARTER_ROOT=/Users/asanehisa/pages-test-local/pages-visual-editor-starter pnpm --dir /Users/asanehisa/pages-template-generation-skill run generate-default-layout-data -- nike NikeStoreHeader NikeHouseOfInnovationTier NikeDirectTier NikePilotTier NikeUniteTier NikePartnerTier NikeFooterPlaceholder

## Generation Notes

- Implementation Notes: Generated custom-fit components to preserve the stacked Figma export, section-level visibility/background fields, editable repeated product/card arrays, CTA color ownership, and synthesized analytics scopes/events.
- Assumptions Applied: The supplied Figma export uses image placeholders rather than reusable image URLs, so components render editable media placeholder surfaces instead of attempting to bind missing assets.
