## Sweetgreen Rosslyn Capture Plan

- URL: https://www.sweetgreen.com/locations/rosslyn
- Title: Sweetgreen Rosslyn | Order Salads & Bowls in Arlington, VA
- Captured: 2026-03-13T17:29:14.994Z

### Ordered Sections

1. `SweetgreenSiteHeaderSection.tsx`
   Layout signature: full-width white header, centered logo, desktop nav split left/right, CTA order button on the right, mobile navigation drawer hidden behind hamburger.
2. `SweetgreenLocationHeroSection.tsx`
   Layout signature: full-width pale green band, contained 2-column grid at desktop, copy/CTAs on left and rounded hero image on right.
3. `SweetgreenFindUsSection.tsx`
   Layout signature: white section, centered intro copy, 2-column lower grid with map/media panel and details stack.
4. `SweetgreenMenuSection.tsx`
   Layout signature: oatmeal band, intro row with CTA, tab buttons above 3-up product grid.
5. `SweetgreenPromoCardsSection.tsx`
   Layout signature: pale green band, two equal-height image cards with rounded corners, text overlay/content block and one CTA each.
6. `SweetgreenRequestLocationSection.tsx`
   Layout signature: oatmeal band, centered heading/body and compact request form shell.
7. `SweetgreenSustainabilitySection.tsx`
   Layout signature: pale green band, centered heading/body, 4-up icon highlights, CTA button, followed by 4-up order channels grid and one dark image banner.
8. `SweetgreenFaqSection.tsx`
   Layout signature: pale green band, 2-column layout at desktop with intro copy on left and stacked accordions on right.
9. `SweetgreenFooterSection.tsx`
   Layout signature: pale green footer with two promo cards on top and four link columns beneath.

### Header/Footer Link Parity

| section | group/band | index | label | href | behavior |
| --- | --- | --- | --- | --- | --- |
| header | desktop-left | 1 | Our Menu | /menu | link |
| header | desktop-left | 2 | Our Mission | /mission | link |
| header | desktop-left | 3 | The Market | http://shop.sweetgreen.com | link |
| header | desktop-right | 1 | Outpost | https://outpost.sweetgreen.com | link |
| header | desktop-right | 2 | Catering | /catering | link |
| header | desktop-right | 3 | Locations | /locations | link |
| header | desktop-right | 4 | Order | https://order.sweetgreen.com | link |
| header | mobile-main | 1 | Our Menu | /menu | link |
| header | mobile-main | 2 | Our Mission | /mission | link |
| header | mobile-main | 3 | The Market | http://shop.sweetgreen.com | link |
| header | mobile-main | 4 | Outpost | http://outpost.sweetgreen.com | link |
| header | mobile-main | 5 | Catering | /catering | link |
| header | mobile-main | 6 | Locations | /locations | link |
| header | mobile-sub | 1 | Download the app | https://itunes.apple.com/us/app/sweetgreen-rewards/id594329490?mt=8 | link |
| footer | promo-card-1 | 1 | Newsletter submit | # | form submit |
| footer | promo-card-2 | 1 | iOS | https://apps.apple.com/us/app/sweetgreen-rewards/id594329490 | link |
| footer | promo-card-2 | 2 | Android | https://play.google.com/store/apps/details?id=com.sweetgreen.android.app&hl=en | link |
| footer | About Us | 1 | Careers | https://careers.sweetgreen.com/ | link |
| footer | About Us | 2 | Investor Relations | https://investor.sweetgreen.com/overview/default.aspx | link |
| footer | About Us | 3 | Locations | https://www.sweetgreen.com/locations | link |
| footer | About Us | 4 | Press | /press | link |
| footer | About Us | 5 | sweetgreen app | https://apps.apple.com/us/app/sweetgreen-rewards/id594329490 | link |
| footer | About Us | 6 | The Hex Bowl | /hex | link |
| footer | Social Media | 1 | Instagram | https://www.instagram.com/sweetgreen/ | link |
| footer | Social Media | 2 | Twitter | https://twitter.com/sweetgreen | link |
| footer | Social Media | 3 | TikTok | https://www.tiktok.com/@sweetgreen | link |
| footer | Social Media | 4 | Spotify | https://open.spotify.com/user/1224421164 | link |
| footer | Social Media | 5 | Facebook | http://facebook.com/sweetgreen | link |
| footer | Support + Services | 1 | Nutrition + Allergens Guide | https://drive.google.com/file/d/1AQyfAeWWqiZmTIiOHpWMgHi7-sAprnl1/view | link |
| footer | Support + Services | 2 | Contact us | https://sierra.chat/agent/KJs113MBlIwai-wBlIwa-e2MUgqOpYOuqqQlOrg0KNw/chat | modal/button |
| footer | Support + Services | 3 | Gift Cards | https://order.sweetgreen.com/gift | link |
| footer | Support + Services | 4 | Store | https://shop.sweetgreen.com/ | link |
| footer | Legal | 1 | Privacy Policy | /privacy-policy | link |
| footer | Legal | 2 | Terms of Use | /terms | link |
| footer | Legal | 3 | Your Privacy Choices | privacy-preference-center | modal/button |
| footer | Legal | 4 | California Notice at Collection | https://www.sweetgreen.com/privacy-policy#additional-information-for-california-residents | link |
| footer | Legal | 5 | Accessibility Statement | https://www.sweetgreen.com/accessibility-statement | link |
| footer | Legal | 6 | Consumer Health Data Notice | /consumer-health-data-notice | link |

### Implementation Checklist

- [x] `SweetgreenSiteHeaderSection.tsx`
- [x] `SweetgreenLocationHeroSection.tsx`
- [x] `SweetgreenFindUsSection.tsx`
- [x] `SweetgreenMenuSection.tsx`
- [x] `SweetgreenPromoCardsSection.tsx`
- [x] `SweetgreenRequestLocationSection.tsx`
- [x] `SweetgreenSustainabilitySection.tsx`
- [x] `SweetgreenFaqSection.tsx`
- [x] `SweetgreenFooterSection.tsx`
