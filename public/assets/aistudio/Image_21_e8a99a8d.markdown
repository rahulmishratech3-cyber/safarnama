---
name: Sovereign Mobility
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#45474c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#201100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2300'
  on-tertiary-container: '#c88000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets urban travelers, intercity commuters, and holidaying families in India seeking an elevated, completely trustworthy transit experience. The aesthetic balances high-velocity utility with the hospitality of premium regional travel. It evokes reliability, promptness, and effortless luxury without alienating daily city commuters.

The visual direction mixes Modern Utility with Tactile Softness:
- Clean, open surfaces inspired by world-class mobility platforms, paired with deliberate warmth.
- High-contrast touch points and structured wayfinding tailored for on-the-move, one-handed mobile usage.
- Tactile feedback through subtly lifted surface layers, high-visibility badges, and generous tap targets engineered for variable lighting conditions across urban and rural transit corridors.

## Colors

The palette establishes an authoritative, reliable base punctuated by functional and warm saffron highlights.

- **Primary Canvas & Structural Core:** Slate Navy (`#1E293B`) serves as the dominant brand anchor, grounding navigation bars, structural titles, and primary vehicle categories. Deep Slate (`#0F172A`) commands maximum legibility for primary headings and critical readouts.
- **Action & Interactive Signals:** Electric Royal Blue (`#2563EB`) directs active paths, selection states, live map routes, and links.
- **Warm Accent & Badges:** Saffron Gold (`#F59E0B`) with deep-burn Orange (`#EA580C`) renders high-value booking incentives, limited-time outstation offers, package highlights, and instant call-to-actions.
- **Surfaces & Atmosphere:** Pure White (`#FFFFFF`) forms the foreground cards, resting on a base canvas layered with Cool Slate (`#F8FAFC`) and divider-level Slate Tint (`#F1F5F9`).
- **Semantic Accents:** Emerald (`#10B981`) designates confirmed bookings, driver arrival indicators, verified cab tags, and completed payments. Secondary metadata utilizes Muted Slate (`#64748B`), and subtle helper cues lean on Light Slate (`#94A3B8`).

## Typography

Plus Jakarta Sans brings a contemporary, approachable, yet engineered rhythm to all mobile screens.

- **Headlines:** Use `headline-xl-mobile` and `headline-lg` strictly for destination showcases, fare estimates, and onboarding hooks. Ensure bold weights (`700` and `800`) are maintained to ensure rapid reading during quick thumb navigation.
- **Fare & Currency Data:** Currency symbols and fare numerals must be displayed using `headline-md` or `headline-lg` with tight tracking (`-0.02em`) to stand out instantly inside ride summary tiles.
- **Labels & Micro-copy:** Badge indicators, ETA tags, driver verification tags, and vehicle categories rely on uppercase or title-case `label-sm` and `label-md` with extra-bold rendering for immediate visual hierarchy against background cards.

## Layout & Spacing

The mobile layout prioritizes reachability, continuous thumb flow, and glanceable modularity.

- **System Structure:** Standard Android system status bar (`24px` to `32px` inset) followed by a low-profile top bar containing back navigation, location pickers, or contextual profile status.
- **Content Flow:** Built on a fluid 4-column layout for phones, scaling to a 6-to-8 column adaptive model on tablets and foldables.
- **Screen Margins:** Fixed `16px` (`margin-mobile`) horizontal margin prevents edge clipping while maximizing vertical real estate for map-backed views and vehicle selection lists.
- **Safe Zones:** Sticky bottom primary action bars (e.g., "Confirm Sedan", "Book Outstation Trip") require a minimum bottom clearance of `16px` above the native gesture navigation line or bottom nav bar.

## Elevation & Depth

Visual hierarchy is conveyed through floating tonal planes, layered over clean maps or neutral grey canvasing:

- **Level 0 (Canvas):** `#F8FAFC` base application surface.
- **Level 1 (Cards & Modules):** Pure `#FFFFFF` surfaces with subtle border definition (`1px solid #F1F5F9`) and a soft, spread shadow: `0px 4px 20px -2px rgba(15, 23, 42, 0.06)`. Used for trip detail cards, coupon banners, and package itineraries.
- **Level 2 (Active Sheets & Sticky Trays):** Bottom sheets and sticky booking controls hover with `0px -6px 24px -4px rgba(15, 23, 42, 0.10)` to separate operational actions cleanly from underlying scrolling content.
- **Level 3 (Tactile CTAs & Overlays):** Action buttons leverage a matching tinted drop shadow (e.g., `#2563EB` casts `0px 8px 18px -4px rgba(37, 99, 235, 0.35)`; `#F59E0B` casts `0px 8px 18px -4px rgba(245, 158, 11, 0.35)`), reinforcing pushable depth.

## Shapes

The interface embraces generous, smooth curvature to maintain an approachable, modern feel:

- **Vehicle & Itinerary Cards:** Use `16px` border radii (`rounded-2xl`) for a contained, friendly product preview.
- **Buttons:** Main touch targets utilize matching `12px` to `16px` curvature, or continuous pill geometry (`rounded-full`) for floating location markers and utility pills.
- **Chips & Quick Filters:** Fully rounded pill forms (`rounded-full`) provide a tactile aesthetic suitable for swipeable filter carousels (e.g., "Sedan", "SUV", "Top Rated", "AC Included").

## Components

### Buttons (CTAs)
- **Primary "Bade" Button:** Height ranges between `48px` and `54px`. Background `#2563EB` or `#F59E0B`, text `#FFFFFF` using `label-lg`, rounded-2xl geometry (`16px`), accompanied by a color-matched ambient drop shadow.
- **Secondary / Outstation Actions:** Crisp `#FFFFFF` fill with `1.5px` border of `#1E293B` or `#2563EB`, text colored to match the border.
- **Icon Actions:** Minimum touch boundary of `48px × 48px` even if the icon is `24px`.

### Booking & Vehicle Selection Cards
- Contained within `#FFFFFF` with `16px` radius and light stroke (`#F1F5F9`).
- Left aligned: Vehicle thumbnail and category name (`headline-sm`).
- Center/Subtext: ETA, capacity, luggage space (`body-sm`, `#64748B`).
- Right aligned: Strikethrough base price alongside highlighted live price (`headline-md`, `#0F172A`).
- Active state: `#2563EB` border of `2px` with a subtle blue tint background (`rgba(37, 99, 235, 0.03)`).

### Tour Package Cards
- High-aspect ratio image block with `16px` top radii.
- Saffron badge tag positioned at the top right ("2D/1N", "All-Inclusive Fuel").
- Package title in `headline-sm`, pricing breakdown per km or per group, and instant "View Itinerary" secondary button.

### Form Inputs & Location Bars
- Height: `52px`. Background `#F8FAFC` in rest state, transitioning to `#FFFFFF` with `#2563EB` stroke on focus.
- Pickup indicator marked with an Emerald circle; Drop-off denoted with an Amber/Red square pin.
- Text size locked to `body-lg` for legible real-time address queries and GPS autocomplete results.

### Chips & Badges
- **Status & Feature Badges:** Compact tags with `4px` horizontal padding, `2px` vertical padding, font `label-sm`. Emerald background tint with `#065F46` text for "Driver Arrived" or "Sanitized Cab"; Amber tint with `#92400E` text for "Fastest Route" or "Best Value".
- **Filter Chips:** Height `36px`, pill-shaped, neutral border `#E2E8F0`, transitioning to solid `#0F172A` with `#FFFFFF` text when selected.

### Bottom Navigation & Sticky Floating Action Bars
- **Bottom Navigation:** Fixed bottom bar featuring 4 primary anchors (City Ride, Outstation, Tour Packages, Account), active icons tinted `#2563EB`.
- **Floating Action Tray:** Overlays maps with a minimum elevation of Level 2, housing the vehicle selector, estimated fare range, and the full-width primary booking button.