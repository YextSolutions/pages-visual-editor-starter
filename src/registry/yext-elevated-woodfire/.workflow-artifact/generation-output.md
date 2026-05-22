# Generation Output

## Contract Metadata

- Artifact Name: generation-output.md
- Stage: vle-generate-components
- Template Name: yext-elevated-woodfire
- Template Kind: built-in
- Based On Plan Artifact: src/registry/yext-elevated-woodfire/.workflow-artifact/plan.md
- Based On Intermediate JSX: src/registry/yext-elevated-woodfire/.captured-artifact/intermediate-jsx.jsx
- Generation Completed At: 2026-05-11T19:36:00Z

## File Changes

- Created Files:
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfirePage.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireHeroSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireDetailsSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireOfferingsSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireAboutSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireFeaturedItemsSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireReviewsSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireEventSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireFaqSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireFindUsSection.tsx
  - src/registry/yext-elevated-woodfire/components/YextElevatedWoodfireFooterSection.tsx
- Updated Files:
  - src/registry/yext-elevated-woodfire/defaultLayout.json
- Unchanged Files:
  - none

## Section To Component Mapping

- Section ID: yext-elevated-woodfire-page-shell
  - Component Names: YextElevatedWoodfireHeroSection, YextElevatedWoodfireDetailsSection, YextElevatedWoodfireOfferingsSection, YextElevatedWoodfireAboutSection, YextElevatedWoodfireFeaturedItemsSection, YextElevatedWoodfireReviewsSection, YextElevatedWoodfireEventSection, YextElevatedWoodfireFaqSection, YextElevatedWoodfireFindUsSection, YextElevatedWoodfireFooterSection
  - Component Files: src/registry/yext-elevated-woodfire/components/YextElevatedWoodfire\*Section.tsx plus shared renderer in src/registry/yext-elevated-woodfire/components/YextElevatedWoodfirePage.tsx
  - Status: created

## Emitted Analytics Mapping

- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: header-nav-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: headerLink0/headerLink1/headerLink2
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: header-social-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: headerSocial0/headerSocial1/headerSocial2
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: hero-ctas
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: heroCta0/heroCta1/heroCta2
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: details-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: detailsLink0/detailsLink1
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: item-card-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: itemLink0/itemLink1/itemLink2
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: event-cta
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: eventCta
  - Runtime Primitive: Link
  - Mapping Kind: synthesized
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: location-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: locationLink0/locationLink1/locationLink2
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: faq-toggles
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: faqToggle0 through faqToggle8
  - Runtime Primitive: useAnalytics
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: footer-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: footerLink0 through footerLink10
  - Runtime Primitive: Link
  - Mapping Kind: indexed
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: footer-legal-links
  - Scope: YextElevatedWoodfirePage plus analytics hash suffix
  - Event Name: footerLegal0/footerLegal1/footerLegal2
  - Runtime Primitive: Link
  - Mapping Kind: indexed

## Component Order

- Component Order Used For Layout Data: YextElevatedWoodfireHeroSection, YextElevatedWoodfireDetailsSection, YextElevatedWoodfireOfferingsSection, YextElevatedWoodfireAboutSection, YextElevatedWoodfireFeaturedItemsSection, YextElevatedWoodfireReviewsSection, YextElevatedWoodfireEventSection, YextElevatedWoodfireFaqSection, YextElevatedWoodfireFindUsSection, YextElevatedWoodfireFooterSection

## Default Layout

- Default Layout Command: VISUAL_EDITOR_STARTER_ROOT=/Users/bstephan/pages-visual-editor-starter pnpm --dir /Users/bstephan/cross-repo-codex/pages-template-generation-skill run generate-default-layout-data -- yext-elevated-woodfire YextElevatedWoodfireHeroSection YextElevatedWoodfireDetailsSection YextElevatedWoodfireOfferingsSection YextElevatedWoodfireAboutSection YextElevatedWoodfireFeaturedItemsSection YextElevatedWoodfireReviewsSection YextElevatedWoodfireEventSection YextElevatedWoodfireFaqSection YextElevatedWoodfireFindUsSection YextElevatedWoodfireFooterSection

## Generation Notes

- Implementation Notes: Revised the built-in template into separate section-level Puck components while preserving the captured YextElevatedWoodfire page order from hero through footer. The section components share the generated renderer/CSS and use Theme Editor CSS variables plus styled fields for major palette, typography, button, section, and image-radius roles; they bind hours, address, phone, map coordinate, nearby locations, and first-party review data where the current runtime supports those data sources.
- Assumptions Applied: No `src/fonts/fonts.json` file was present, so no repo font was selected and `Selected Repo Font Family` is effectively `none`; captured local image assets were seeded as absolute localhost HTTP URLs because the input source was a local directory rather than a public URL.
