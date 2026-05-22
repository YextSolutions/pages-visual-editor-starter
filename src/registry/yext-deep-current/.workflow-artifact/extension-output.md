# Extension Output

## Artifact Name

extension-output.md

## Stage

vle-extend-template

## Template Name

deep-current

## Decisions Made At

2026-05-15

## Section Decisions

### About

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentStory.tsx`
- Generated Component: None
- Rationale: `DeepCurrentStory` already provides a centered heading plus multi-paragraph narrative content and CTA, which satisfies the about-section role.

### Banner

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentBanner.tsx`
- Rationale: The current template has no lightweight announcement band or centered full-width banner treatment separate from the hero.

### Breadcrumbs

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentBreadcrumbs.tsx`
- Rationale: No existing component renders directory breadcrumb links from `resolveBreadcrumbs(streamDocument)`.

### Header

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentHeader.tsx`
- Generated Component: None
- Rationale: `DeepCurrentHeader` already supplies a responsive header with logo, navigation links, and mobile-menu behavior.

### Hero

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentHero.tsx`
- Generated Component: None
- Rationale: `DeepCurrentHero` already covers the lead image, heading, body copy, and CTA treatment expected from the hero section.

### Core Information

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentDetails.tsx`
- Generated Component: None
- Rationale: `DeepCurrentDetails` already renders address-style information, hours, secondary hours, and utility actions in a location-details format.

### Cards

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentFeaturedServices.tsx`
- Generated Component: None
- Rationale: `DeepCurrentFeaturedServices` already provides a repeatable card grid with images, headings, body text, and CTA support.

### Promo

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentResources.tsx`
- Generated Component: None
- Rationale: `DeepCurrentResources` already functions as a promo-style section with large image-backed cards, overlay copy, and action treatment.

### Frequently Asked Questions (FAQs)

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentFaqs.tsx`
- Generated Component: None
- Rationale: `DeepCurrentFaqs` already provides a dedicated collapsible FAQ stack.

### Photo Gallery

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentPhotoGallery.tsx`
- Rationale: No existing component offers a reusable photo gallery section with a grid/carousel presentation toggle.

### Events

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentEvents.tsx`
- Rationale: No current component renders an upcoming-events card collection with event name and time metadata.

### Nearby Locations

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentNearbyLocations.tsx`
- Generated Component: None
- Rationale: `DeepCurrentNearbyLocations` already serves the nearby-locations role with supporting cards and a companion map treatment.

### Static Map

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentStaticMap.tsx`
- Rationale: The nearby-locations section includes a map, but its primary purpose is the nearby-location composite layout rather than a standalone current-location map section, so a dedicated static-map section is still missing.

### Testimonials

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentTestimonials.tsx`
- Generated Component: None
- Rationale: `DeepCurrentTestimonials` already provides a dedicated testimonial carousel with quote-focused presentation.

### Reviews

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentReviews.tsx`
- Rationale: Testimonials are editor-managed quote content and do not satisfy the required first-party review data contract from `streamDocument.ref_reviewsAgg`.

### Team

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentAdvisors.tsx`
- Generated Component: None
- Rationale: `DeepCurrentAdvisors` already provides a dedicated team/advisor card section with profile details and CTA links.

### Video

- Matched Existing Component: None
- Generated Component: `src/registry/deep-current/components/DeepCurrentVideo.tsx`
- Rationale: The template does not currently expose any dedicated video/embed section.

### Footer

- Matched Existing Component: `src/registry/deep-current/components/DeepCurrentFooter.tsx`
- Generated Component: None
- Rationale: `DeepCurrentFooter` already provides the expected footer structure and navigation treatment.
