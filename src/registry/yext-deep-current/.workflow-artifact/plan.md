# Component Plan

## Contract Metadata

- Artifact Name: plan.md
- Stage: vle-plan-components
- Template Name: deep-current
- Template Kind: built-in
- Based On Capture Output: src/registry/deep-current/.captured-artifact/capture-output.md
- Based On Intermediate JSX: src/registry/deep-current/.captured-artifact/intermediate-jsx.jsx
- Based On Capture Manifest: src/registry/deep-current/.captured-artifact/manifest.json
- Requested Source: file:///Users/rcameron/Downloads/deep_current/index.html
- Resolved Source: file:///Users/rcameron/Downloads/deep_current/index.html

## Page Metadata

- Page Title: Northstar Wealth Partners - Uptown Charlotte
- Final URL: file:///Users/rcameron/Downloads/deep_current/index.html
- Captured At: 2026-05-15T02:05:18.975Z
- Planning Completed At: 2026-05-15T02:10:44Z

## Ordered Sections

### Section 1

- Section ID: header
- Order: 1
- Source Landmark or Selector: `header.site-header` plus hidden mobile panel
- Source Node IDs: `n11`, `n29`
- Breakpoint Deltas:
  - Desktop shows inline nav and utility icons while tablet/mobile collapse to a centered brand row with a left hamburger trigger.
  - Mobile menu content exists as a hidden owned panel and should remain section-owned instead of becoming a separate layout band.
- Interaction Model: Owns a hamburger-triggered mobile menu plus visible nav and icon links.
- Parity-Critical Details:
  - White shell with thin bottom border, 24px side padding, dark wordmark, muted gray nav text, and compact icon links.
  - Desktop keeps nav centered between brand and icons; mobile keeps only brand plus menu trigger in the bar while nav moves into the owned overlay panel.
- Target Component Name: DeepCurrentHeader
- Target Component File: src/registry/deep-current/components/DeepCurrentHeader.tsx
- Analytics Scope: `DeepCurrentHeader + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic link events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Full-bleed white shell with shell-owned bottom rule and 24px horizontal padding; single flex row on desktop with left brand, centered nav, right icon cluster; mobile swaps to a compact three-column bar with hamburger, centered logo, and hidden overlay panel that expands below the header.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the breakpoint-specific nav collapse, the owned mobile drawer, and the exact sparse shell geometry manually because a generic library navbar would over-introduce chrome and spacing.
- Data Requirements: No runtime data binding required; keep link destinations internal to the generated template and expose only section-level visibility/background controls.
- Hours Decisions: No hours treatment in this section.
- Notes: Header and hidden mobile panel remain one owned section for downstream layout and analytics.

### Section 2

- Section ID: hero
- Order: 2
- Source Landmark or Selector: first `main` child hero band
- Source Node IDs: `n49`
- Breakpoint Deltas:
  - Desktop keeps a wide left text block over a teal shell with the jar image occupying the right half.
  - Tablet/mobile compress the headline width, tighten spacing, and visually rely more on the overlaid image while keeping the CTA pair stacked in one group.
- Interaction Model: No owned default-state interactive behavior beyond visible CTA link navigation.
- Parity-Critical Details:
  - Teal full-bleed shell with white copy, translucent status pill, two contrasting CTA treatments, and right-side image crop with soft overlay.
  - Background ownership belongs to the hero shell while the status pill and CTA fills remain their own visible surfaces.
- Target Component Name: DeepCurrentHero
- Target Component File: src/registry/deep-current/components/DeepCurrentHero.tsx
- Analytics Scope: `DeepCurrentHero + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic CTA names
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Full-bleed hero shell with contained inner width and 24px shell padding; two-column desktop composition with media bleeding behind the right half and a narrower text stack constrained to the left; mobile shifts to a single stacked shell with image retained as background art behind the content card.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the asymmetric text/media balance, translucent status pill, and CTA styling manually because the hero identity depends on custom shell ownership and crop placement more than reusable primitives.
- Data Requirements: CTA fill ownership stays on each CTA object conceptually, but this first pass keeps hero copy and CTA labels captured in component defaults.
- Hours Decisions: No hours treatment in this section.
- Notes: Built-in styling should lean on palette variables rather than captured literal fonts.

### Section 3

- Section ID: details-and-services
- Order: 3
- Source Landmark or Selector: `section#locations`, `section#services`, separator
- Source Node IDs: `n70`, `n165`, `n193`
- Breakpoint Deltas:
  - Location cards render as three columns on desktop and stack vertically on tablet/mobile.
  - Featured service cards collapse from four-up desktop tiles to two-up tablet and single-column mobile cards while preserving the centered section intro and trailing CTA.
- Interaction Model: Owns one expandable hours detail row plus visible service and utility links.
- Parity-Critical Details:
  - The location-details band owns the light gray shell while each information card owns its own off-white surface, border, and radius.
  - Featured services sit on a near-white band with image-first cards, text links, and a single centered filled CTA below the card grid.
  - The hours card includes a live-status-style row treatment and a plus-row disclosure affordance that should remain visually present.
- Target Component Name: DeepCurrentDetails
- Target Component File: src/registry/deep-current/components/DeepCurrentDetails.tsx
- Analytics Scope: `DeepCurrentDetails + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic indexed card/link events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Two consecutive page bands owned by one generated component: first a full-bleed light-gray shell with contained centered heading and a three-card grid of padded surfaces, then a near-white featured-services band with centered heading, responsive service-card grid, and a centered CTA row; separator rule remains between the second and following bands.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the stacked dual-band structure, owned card surfaces, and service-card media/text spacing manually because collapsing both source sections into one generated component requires careful background and separator ownership.
- Data Requirements: Shared background color field belongs to the card surfaces in the location grid and service cards remain captured-first in this pass.
- Hours Decisions: Source shows a live status row plus a weekday table; this first pass preserves the visible treatment manually and leaves a later validator pass to upgrade to stricter hours-runtime wiring if requested.
- Notes: Grouped intentionally to reduce starter complexity while preserving visible band order and hierarchy.

### Section 4

- Section ID: story-and-testimonials
- Order: 4
- Source Landmark or Selector: `section#about`, `section#testimonials`
- Source Node IDs: `n195`, `n205`
- Breakpoint Deltas:
  - About copy stays centered with constrained width at all breakpoints.
  - Testimonial controls compress inward on smaller viewports while the quote remains centered and the pager dots stay below the author block.
- Interaction Model: Owns previous/next testimonial controls plus visible CTA link navigation.
- Parity-Critical Details:
  - About band is airy, centered, and text-heavy with one compact filled CTA.
  - Testimonials shift onto a soft gray surface with oversized italic quote, left/right circular controls, and pager dots under the active slide.
- Target Component Name: DeepCurrentStory
- Target Component File: src/registry/deep-current/components/DeepCurrentStory.tsx
- Analytics Scope: `DeepCurrentStory + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic CTA/control events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Two vertically consecutive contained sections within one generated component: first a centered white/near-white narrative block with narrow measure and single CTA, then a light-gray testimonial carousel shell with contained heading, centered quote stack, absolute-feeling edge controls, and pager dots.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the quote emphasis, large negative space, and owned carousel controls manually because a library testimonial block would flatten the captured spacing and control placement.
- Data Requirements: Testimonial items remain captured constants in the component for now; CTA stays internal to the component.
- Hours Decisions: No hours treatment in this section.
- Notes: Testimonials can safely be state-driven inside the section without affecting page layout ownership.

### Section 5

- Section ID: advisors-and-faq
- Order: 5
- Source Landmark or Selector: `section#advisors`, separator, `section#faqs`
- Source Node IDs: `n239`, `n278`, `n280`
- Breakpoint Deltas:
  - Advisor cards display side-by-side on desktop and stack one per row on narrower viewports.
  - FAQ rows keep the first item open by default and maintain full-width accordion rows at every breakpoint.
- Interaction Model: Owns FAQ expand/collapse behavior plus visible advisor-page links.
- Parity-Critical Details:
  - Team cards own the pale card surface, border, avatar framing, credential list divider, and subdued utility link styling.
  - FAQ rows are divider-led, text-first disclosures with only one open by default and a plus/minus indicator aligned at the far edge.
- Target Component Name: DeepCurrentAdvisors
- Target Component File: src/registry/deep-current/components/DeepCurrentAdvisors.tsx
- Analytics Scope: `DeepCurrentAdvisors + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic indexed card/accordion events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: White full-bleed shell split into a team section with centered heading and responsive two-card grid, followed by a separator rule and a constrained FAQ accordion stack whose max-width is narrower than the shell content width.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the card chrome, divider ownership, and accordion default-open state manually because the captured FAQ and advisor stacks are simple but spacing-sensitive.
- Data Requirements: Advisor cards and FAQ rows are editor-owned captured constants in this pass; inner card surface backgrounds remain fixed to the visible card owner.
- Hours Decisions: No hours treatment in this section.
- Notes: Separator ownership stays with the component so the FAQ top edge matches the captured transition.

### Section 6

- Section ID: resources-and-nearby
- Order: 6
- Source Landmark or Selector: `section#disclosures`, `section#nearby-locations`
- Source Node IDs: `n310`, `n339`
- Breakpoint Deltas:
  - Promo cards render as two columns on desktop and stack vertically on tablet/mobile while preserving the full-image overlay treatment.
  - Nearby-locations layout uses a two-column blank-map-plus-cards arrangement on desktop and stacks cards over the map frame on smaller viewports.
- Interaction Model: No owned default-state interactive behavior beyond visible link and CTA navigation.
- Parity-Critical Details:
  - Both promo cards require dark image overlays, white copy, and one card with text-link list versus one with a filled white CTA button.
  - Nearby cards own their pale surfaces and border while the map frame is intentionally blank/light in the captured screenshots and should remain a framed placeholder rather than inventing new provider chrome.
- Target Component Name: DeepCurrentResources
- Target Component File: src/registry/deep-current/components/DeepCurrentResources.tsx
- Analytics Scope: `DeepCurrentResources + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic indexed link events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Two owned bands inside one component: first a neutral shell with a responsive two-card promo grid using full-bleed imagery and absolute overlays, then a white nearby-locations band with centered heading and a responsive two-column layout composed of a tall framed map placeholder and a stacked list of cards.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the image-overlay cards and the captured blank map frame manually because both treatments depend on shell-specific layering and column ownership rather than stock card primitives.
- Data Requirements: Nearby location content remains captured constants in this pass and the map frame stays decorative-only.
- Hours Decisions: No hours treatment in this section.
- Notes: The captured screenshots show the map frame effectively blank, so the generated shell should preserve that visible state rather than introducing an unsolicited runtime map.

### Section 7

- Section ID: footer
- Order: 7
- Source Landmark or Selector: `footer.global-block.footer`
- Source Node IDs: `n369`
- Breakpoint Deltas:
  - Desktop keeps brand and footer nav on one row with copyright below a divider.
  - Smaller viewports stack the brand and nav while keeping the same teal shell and muted white link treatment.
- Interaction Model: No owned default-state interactive behavior beyond visible footer link navigation.
- Parity-Critical Details:
  - Teal shell, muted white links, top row brand/nav split, thin translucent divider, and centered copyright line must stay intact.
  - Footer links remain inline and lightweight rather than turning into button-like affordances.
- Target Component Name: DeepCurrentFooter
- Target Component File: src/registry/deep-current/components/DeepCurrentFooter.tsx
- Analytics Scope: `DeepCurrentFooter + analytics hash suffix`
- Analytics Source: non-migration synthesized scope and deterministic footer link events
- Preserve Legacy Names: no
- Viewport Attachment: none
- Layout Signature: Full-bleed teal footer shell with contained inner width, 24px shell padding, top flex row that wraps on small viewports, thin translucent divider below the top row, and centered copyright text below the divider.
- Implementation Strategy: custom-fit
- Implementation Strategy Details: Preserve the shell geometry, link grouping, and subdued link treatment manually because the footer identity is mostly spacing and color ownership.
- Data Requirements: No runtime data binding required in this pass.
- Hours Decisions: No hours treatment in this section.
- Notes: Footer remains root-level outside `MainContent`.

## Interaction Analytics Map

- Section ID: header
  - Interaction ID: mobileMenuToggle
  - Event Name: mobileMenuToggle
  - Source Selector Or Origin: `button.site-header__menu-btn`
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: header
  - Interaction ID: navLink0
  - Event Name: headerLink0
  - Source Selector Or Origin: `a[href="#locations"]`
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: header
  - Interaction ID: navLink1
  - Event Name: headerLink1
  - Source Selector Or Origin: `a[href="#services"]`
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: header
  - Interaction ID: navLink2
  - Event Name: headerLink2
  - Source Selector Or Origin: `a[href="#advisors"]`
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: header
  - Interaction ID: navLink3
  - Event Name: headerLink3
  - Source Selector Or Origin: `a[href="#disclosures"]`
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: header
  - Interaction ID: navLink4
  - Event Name: headerLink4
  - Source Selector Or Origin: `a[href="#contact"]`
  - Preservation Mode: synthesized
  - Is Indexed: yes
- Section ID: header
  - Interaction ID: searchLink
  - Event Name: searchLink
  - Source Selector Or Origin: `a[aria-label="Search"]`
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: header
  - Interaction ID: loginLink
  - Event Name: loginLink
  - Source Selector Or Origin: `a[aria-label="Log in"]`
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: hero
  - Interaction ID: primaryCta
  - Event Name: primaryCta
  - Source Selector Or Origin: hero primary CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: hero
  - Interaction ID: secondaryCta
  - Event Name: secondaryCta
  - Source Selector Or Origin: hero secondary CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: details-and-services
  - Interaction ID: locationWebsite
  - Event Name: locationWebsite
  - Source Selector Or Origin: location details website CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: details-and-services
  - Interaction ID: locationAppointment
  - Event Name: locationAppointment
  - Source Selector Or Origin: location details appointment CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: details-and-services
  - Interaction ID: servicesCta0
  - Event Name: servicesCta0
  - Source Selector Or Origin: first featured service link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: details-and-services
  - Interaction ID: servicesCta1
  - Event Name: servicesCta1
  - Source Selector Or Origin: second featured service link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: details-and-services
  - Interaction ID: servicesCta2
  - Event Name: servicesCta2
  - Source Selector Or Origin: third featured service link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: details-and-services
  - Interaction ID: servicesCta3
  - Event Name: servicesCta3
  - Source Selector Or Origin: fourth featured service link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: details-and-services
  - Interaction ID: exploreServices
  - Event Name: exploreServices
  - Source Selector Or Origin: featured services section CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: story-and-testimonials
  - Interaction ID: bookAppointment
  - Event Name: bookAppointment
  - Source Selector Or Origin: about section CTA
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: story-and-testimonials
  - Interaction ID: testimonialPrev
  - Event Name: testimonialPrev
  - Source Selector Or Origin: testimonial previous button
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: story-and-testimonials
  - Interaction ID: testimonialNext
  - Event Name: testimonialNext
  - Source Selector Or Origin: testimonial next button
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: advisors-and-faq
  - Interaction ID: advisorPage0
  - Event Name: advisorPage0
  - Source Selector Or Origin: first advisor card link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: advisorPage1
  - Event Name: advisorPage1
  - Source Selector Or Origin: second advisor card link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: faqToggle0
  - Event Name: faqToggle0
  - Source Selector Or Origin: first FAQ trigger
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: faqToggle1
  - Event Name: faqToggle1
  - Source Selector Or Origin: second FAQ trigger
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: faqToggle2
  - Event Name: faqToggle2
  - Source Selector Or Origin: third FAQ trigger
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: faqToggle3
  - Event Name: faqToggle3
  - Source Selector Or Origin: fourth FAQ trigger
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: advisors-and-faq
  - Interaction ID: faqToggle4
  - Event Name: faqToggle4
  - Source Selector Or Origin: fifth FAQ trigger
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: disclosureLink0
  - Event Name: disclosureLink0
  - Source Selector Or Origin: first disclosure promo link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: disclosureLink1
  - Event Name: disclosureLink1
  - Source Selector Or Origin: second disclosure promo link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: disclosureLink2
  - Event Name: disclosureLink2
  - Source Selector Or Origin: third disclosure promo link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: disclosureLink3
  - Event Name: disclosureLink3
  - Source Selector Or Origin: fourth disclosure promo link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: eventCalendar
  - Event Name: eventCalendar
  - Source Selector Or Origin: resources promo button
  - Preservation Mode: synthesized
  - Is Indexed: no
- Section ID: resources-and-nearby
  - Interaction ID: nearbyDirections0
  - Event Name: nearbyDirections0
  - Source Selector Or Origin: first nearby card CTA
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: nearbyDirections1
  - Event Name: nearbyDirections1
  - Source Selector Or Origin: second nearby card CTA
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: resources-and-nearby
  - Interaction ID: nearbyDirections2
  - Event Name: nearbyDirections2
  - Source Selector Or Origin: third nearby card CTA
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: footer
  - Interaction ID: footerLink0
  - Event Name: footerLink0
  - Source Selector Or Origin: first footer link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: footer
  - Interaction ID: footerLink1
  - Event Name: footerLink1
  - Source Selector Or Origin: second footer link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: footer
  - Interaction ID: footerLink2
  - Event Name: footerLink2
  - Source Selector Or Origin: third footer link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: footer
  - Interaction ID: footerLink3
  - Event Name: footerLink3
  - Source Selector Or Origin: fourth footer link
  - Preservation Mode: indexed
  - Is Indexed: yes
- Section ID: footer
  - Interaction ID: footerLink4
  - Event Name: footerLink4
  - Source Selector Or Origin: fifth footer link
  - Preservation Mode: indexed
  - Is Indexed: yes

## Header Parity Table

| Section | Group or Band | Index | Label | Href | Expand/Collapse Behavior | Trigger Type | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Header | Primary Nav | 0 | Locations | #locations | None | Click | Visible desktop nav item |
| Header | Primary Nav | 1 | Services | #services | None | Click | Visible desktop nav item |
| Header | Primary Nav | 2 | Advisors | #advisors | None | Click | Visible desktop nav item |
| Header | Primary Nav | 3 | Disclosures | #disclosures | None | Click | Visible desktop nav item |
| Header | Primary Nav | 4 | Contact | #contact | None | Click | Visible desktop nav item |
| Header | Utility Icons | 5 | Search | # | None | Click | Search icon link |
| Header | Utility Icons | 6 | Log in | # | None | Click | Account icon link |
| Header | Mobile Trigger | 7 | Open menu | button | Expands owned mobile panel | Click | Visible on tablet/mobile |

## Footer Parity Table

| Section | Group or Band | Index | Label | Href | Expand/Collapse Behavior | Trigger Type | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Footer | Footer Nav | 0 | Locations | #locations | None | Click | Inline footer link |
| Footer | Footer Nav | 1 | Services | #services | None | Click | Inline footer link |
| Footer | Footer Nav | 2 | Advisors | #advisors | None | Click | Inline footer link |
| Footer | Footer Nav | 3 | Disclosures | #disclosures | None | Click | Inline footer link |
| Footer | Footer Nav | 4 | Contact | #contact | None | Click | Inline footer link |

## Implementation Checklist

- ordered section-to-component checklist
- config or layout-data implications
- planning notes that affected section boundaries or ownership

Supporting notes:

- The plan intentionally groups adjacent captured bands into seven generated components so the minimal starter stays tractable while preserving the visible section order and root-level header/footer ownership required by default layout generation.
- `defaultLayout.json` should place `DeepCurrentHeader` and `DeepCurrentFooter` at the root level and nest `DeepCurrentHero`, `DeepCurrentDetails`, `DeepCurrentStory`, `DeepCurrentAdvisors`, and `DeepCurrentResources` inside the single required `MainContent`.
