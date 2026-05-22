# Component Plan

## Contract Metadata

- Artifact Name: plan.md
- Stage: vle-plan-components
- Template Name: yext-elevated-woodfire
- Template Kind: built-in
- Based On Capture Output: src/registry/yext-elevated-woodfire/.captured-artifact/capture-output.md
- Based On Intermediate JSX: src/registry/yext-elevated-woodfire/.captured-artifact/intermediate-jsx.jsx
- Based On Capture Manifest: src/registry/yext-elevated-woodfire/.captured-artifact/manifest.json
- Requested Source: file:///Users/bstephan/pages-visual-editor-starter/YextElevatedWoodfire/index.html
- Resolved Source: file:///Users/bstephan/pages-visual-editor-starter/YextElevatedWoodfire/index.html

## Page Metadata

- Page Title: Redwood Burger Co. - South Lamar
- Final URL: file:///Users/bstephan/pages-visual-editor-starter/YextElevatedWoodfire/index.html
- Captured At: 2026-05-11T19:31:25.059Z
- Planning Completed At: 2026-05-11T19:34:16Z

## Ordered Sections

### Section 1

- Section ID: yext-elevated-woodfire-page-shell
- Order: 1
- Source Landmark or Selector: document shell rooted at header.hero, main, and footer.site-footer
- Source Node IDs: n12, n56, n321
- Breakpoint Deltas: Desktop uses full header nav, two-column detail/offerings/mosaic layouts, three featured cards, two-column reviews, and three nearby location columns; tablet preserves desktop nav around 1024px while reducing multi-column layouts; mobile hides desktop nav/social links behind a menu button, stacks all cards and location content, moves offerings image below text, and makes hero CTAs full width.
- Interaction Model: Header mobile menu owns hidden overlay navigation; FAQ items use native details expansion; footer subscribe form and all visible links are link/form interactions. No additional default-state interactive behavior beyond visible link navigation.
- Parity-Critical Details: Full-bleed burger hero image with an absolute white hero card, non-sticky centered header nav, rounded pill CTAs, pale green offering/review bands, off-white page body, white feature-card overlays with large rounded top-right corners, full-bleed event image with dark overlay, closed FAQ rows, map frame above nearby location cards, and dark three-column footer must remain recognizable. Visible shell, card, CTA, overlay, footer, and map-frame colors are controlled by component fields and Theme Editor variables.
- Target Component Names: YextElevatedWoodfireHeroSection, YextElevatedWoodfireDetailsSection, YextElevatedWoodfireOfferingsSection, YextElevatedWoodfireAboutSection, YextElevatedWoodfireFeaturedItemsSection, YextElevatedWoodfireReviewsSection, YextElevatedWoodfireEventSection, YextElevatedWoodfireFaqSection, YextElevatedWoodfireFindUsSection, YextElevatedWoodfireFooterSection
- Target Component Files: individual component entry files in src/registry/yext-elevated-woodfire/components/ backed by shared YextElevatedWoodfirePage.tsx section renderer
- Analytics Scope: YextElevatedWoodfirePage plus analytics hash suffix
- Analytics Source: non-migration synthesized analytics from visible link/control order
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Full-bleed page shell with header/footer in normal flow. Hero shell is full-bleed with 660px desktop image height and an absolute card at lower left; mobile uses 560px hero height and an inset rounded card. Main sections alternate full-width bands with contained content, desktop shell padding generally 78-110px vertical and 24px horizontal content gutters, no global inner card wrapper. Details use two equal panels then stack. Offerings use a two-column image/text grid then mobile text-first stack. About uses two-column text/art with art allowed to bleed at wide desktop, then stacks. Featured items use three/two/one card grid with image crop and overlay. Reviews use two/one card grid. Event banner is full-bleed media with centered overlay. FAQ uses centered 980px list. Find-us uses contained map then three/two/one columns. Footer is full-bleed dark with three columns, then two/one responsive flow.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Implement as separate section-level Puck components for hero/header, details, offerings, about, featured items, reviews, event banner, FAQs, find-us, and footer. Use a shared renderer/CSS module to preserve full-page visual parity and Theme Editor variable behavior without forcing one default-layout component. Use Visual Editor fields for section/background colors, text, images, repeated links/cards/FAQs/locations, map settings, hours, phone, and review fallback text.
- Data Requirements: Heading text uses styled text fields; paragraph copy uses editable text defaults; CTA objects include Label, Link, Background Color, and Button Styles; image objects use Visual Editor image fields; details bind address, mainPhone, and hours to entity fields when available; map binds yextDisplayCoordinate; reviews read first-party reviews from streamDocument and use fallback editor content only when no first-party data is present; nearby cards are editor-managed fallback cards for this built-in source because no embedded nearby payload exists. Shared card/background fields own detail panels, review cards, FAQ cards, feature overlays, event overlay, and footer shell colors.
- Hours Decisions: Use HoursStatus for the hero live status and HoursTable for the details hours panel. Styling overrides are required for row spacing, current-day weight, right-aligned note, 12-hour time format, long day names, Monday start, no collapsed days, no additional hours text in table body, and status copy matching `Open Now • Closes 9:00 PM`.
- Notes: Local source images resolve from the supplied source directory. The template is built-in, so captured colors map to semantic Theme Editor variable defaults rather than literal brand-only CSS.

## Interaction Analytics Map

- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: header-nav-links
  - Event Name: headerLink0/headerLink1/headerLink2
  - Source Selector Or Origin: n20, n21, n22
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: header-social-links
  - Event Name: headerSocial0/headerSocial1/headerSocial2
  - Source Selector Or Origin: n25, n27, n29
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: hero-ctas
  - Event Name: heroCta0/heroCta1/heroCta2
  - Source Selector Or Origin: n53, n54, n55
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: details-links
  - Event Name: detailsLink0/detailsLink1
  - Source Selector Or Origin: n68, n69
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: item-card-links
  - Event Name: itemLink0/itemLink1/itemLink2
  - Source Selector Or Origin: n135, n141, n147
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: event-cta
  - Event Name: eventCta
  - Source Selector Or Origin: n216
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: faq-toggle
  - Event Name: faqToggle0 through faqToggle8
  - Source Selector Or Origin: n222, n225, n228, n231, n234, n237, n240, n243, n246
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: location-links
  - Event Name: locationLink0/locationLink1/locationLink2
  - Source Selector Or Origin: n306, n313, n320
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: footer-links
  - Event Name: footerLink0 through footerLink10
  - Source Selector Or Origin: n327, n329, n331, n338, n340, n342, n344, n347, n349, n351, n353
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: yext-elevated-woodfire-page-shell
  - Interaction ID: footer-legal-links
  - Event Name: footerLegal0/footerLegal1/footerLegal2
  - Source Selector Or Origin: n366, n367, n368
  - Preservation Mode: indexed
  - Is Indexed: yes

## Header Parity Table

| Section | Group or Band          | Index | Label     | Href | Expand/Collapse Behavior        | Trigger Type | Notes                          |
| ------- | ---------------------- | ----- | --------- | ---- | ------------------------------- | ------------ | ------------------------------ |
| Header  | Desktop nav left       | 0     | Menu      | #    | none                            | link         | Hidden below mobile breakpoint |
| Header  | Desktop nav left       | 1     | Catering  | #    | none                            | link         | Hidden below mobile breakpoint |
| Header  | Desktop nav left       | 2     | Contact   | #    | none                            | link         | Hidden below mobile breakpoint |
| Header  | Desktop nav right      | 0     | Facebook  | #    | none                            | icon link    | 20px white social image        |
| Header  | Desktop nav right      | 1     | Instagram | #    | none                            | icon link    | 20px white social image        |
| Header  | Desktop nav right      | 2     | Yelp      | #    | none                            | icon link    | 20px white social image        |
| Header  | Mobile nav trigger     | 0     | Open menu | #    | expands mobile overlay          | button       | Three-line button on right     |
| Header  | Mobile overlay links   | 0     | Menu      | #    | closes overlay after navigation | link         | Hidden by default              |
| Header  | Mobile overlay links   | 1     | Catering  | #    | closes overlay after navigation | link         | Hidden by default              |
| Header  | Mobile overlay links   | 2     | Contact   | #    | closes overlay after navigation | link         | Hidden by default              |
| Header  | Mobile overlay socials | 0     | Facebook  | #    | closes overlay after navigation | icon link    | Hidden by default              |
| Header  | Mobile overlay socials | 1     | Instagram | #    | closes overlay after navigation | icon link    | Hidden by default              |
| Header  | Mobile overlay socials | 2     | Yelp      | #    | closes overlay after navigation | icon link    | Hidden by default              |

## Footer Parity Table

| Section | Group or Band        | Index | Label         | Href | Expand/Collapse Behavior | Trigger Type | Notes                   |
| ------- | -------------------- | ----- | ------------- | ---- | ------------------------ | ------------ | ----------------------- |
| Footer  | Social media         | 0     | Facebook      | #    | none                     | icon link    | 20px white social image |
| Footer  | Social media         | 1     | Instagram     | #    | none                     | icon link    | 20px white social image |
| Footer  | Social media         | 2     | Yelp          | #    | none                     | icon link    | 20px white social image |
| Footer  | Quick links column 1 | 0     | Menu          | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 1 | 1     | Order Online  | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 1 | 2     | Reservations  | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 1 | 3     | Group Events  | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 2 | 0     | Catering      | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 2 | 1     | Careers       | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 2 | 2     | Gift Cards    | #    | none                     | link         | Source order preserved  |
| Footer  | Quick links column 2 | 3     | Contact       | #    | none                     | link         | Source order preserved  |
| Footer  | Legal links          | 0     | Privacy       | #    | none                     | link         | Bottom bar              |
| Footer  | Legal links          | 1     | Terms         | #    | none                     | link         | Bottom bar              |
| Footer  | Legal links          | 2     | Accessibility | #    | none                     | link         | Bottom bar              |

## Implementation Checklist

- ordered section-to-component checklist: Generate separate components in top-to-bottom order: `YextElevatedWoodfireHeroSection`, `YextElevatedWoodfireDetailsSection`, `YextElevatedWoodfireOfferingsSection`, `YextElevatedWoodfireAboutSection`, `YextElevatedWoodfireFeaturedItemsSection`, `YextElevatedWoodfireReviewsSection`, `YextElevatedWoodfireEventSection`, `YextElevatedWoodfireFaqSection`, `YextElevatedWoodfireFindUsSection`, `YextElevatedWoodfireFooterSection`.
- config or layout-data implications: `src/ve.config.tsx` is absent, so wrapper runtime registration is skipped; `defaultLayout.json` must contain one root `MainContent` with the ten section components in `props.content`.
- planning notes that affected section boundaries or ownership: Revised from a single shell component to separate section entries per user request while preserving the shared source order, analytics names, and visual shell CSS.
