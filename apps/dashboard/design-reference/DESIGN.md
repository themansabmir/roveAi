---
name: Kinetic Obsidian
colors:
  surface: '#fcf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fcf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#484555'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#797587'
  outline-variant: '#c9c3d8'
  surface-tint: '#603ae7'
  primary: '#5f38e5'
  on-primary: '#ffffff'
  primary-container: '#7856ff'
  on-primary-container: '#fffdff'
  inverse-primary: '#cabeff'
  secondary: '#5d5e67'
  on-secondary: '#ffffff'
  secondary-container: '#e0deea'
  on-secondary-container: '#61626b'
  tertiary: '#934800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b85c00'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#480fcf'
  secondary-fixed: '#e2e1ec'
  secondary-fixed-dim: '#c6c5d0'
  on-secondary-fixed: '#1a1b23'
  on-secondary-fixed-variant: '#45464f'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#fcf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system embodies high-precision utility for data-dense AI workflows. Built for sales intelligence operators and revenue teams, the visual language rejects decorative excess in favor of crisp typography, structural boundaries, and disciplined informational density. 

The aesthetic is ultra-clean minimalism executed with architectural rigor:
- **Tone:** Authoritative, silent, surgical, and exceptionally fast.
- **Visual Doctrine:** Zero heavy drop-shadows, zero linear gradients, and zero non-functional ornamentation. Visual relationships are communicated strictly via 1px muted hairline borders, subtle background tiering, and high-legibility typography.
- **Accents:** A single vibrant kinetic violet serves as the primary action trigger, drawing sharp focus across a monochromatic canvas.

## Colors

The palette establishes an ultra-calm, bone-white canvas punctuated by surgical accents.

### Palette Architecture
- **Canvas Base (`#FAFAF8`):** An organic, off-white foundation that eliminates display glare during extended analytical sessions.
- **Surface Elevation (`#FFFFFF`):** High-priority containers, data cards, and active table rows resting above the canvas.
- **Subtle Surface / Hover (`#F4F4F2`):** Interactive cell states, secondary toolbars, and inactive toggle tracks.
- **Hairline Border (`#EAEAEC`):** A uniform 1px micro-border applied consistently across all cards, table divisions, and input outlines.
- **Primary Text (`#111114`):** Near-black charcoal delivering maximum contrast without the harshness of pure `#000000`.
- **Secondary / Muted Text (`#85858F`):** Medium grey for structural labels, table column headers, and secondary timestamps.
- **Accent Action (`#7856FF`):** Electric violet reserved exclusively for primary CTAs, active filter indicators, and high-signal AI confirmation states.

### Status & Feedback
Status tokens must not rely on saturated green/red/yellow washes. Badges use a neutral badge style: `#6A6A74` or `#85858F` text over a `#F0F0EE` pill. Contextual system alerts use subtle, low-saturation tint backgrounds paired with dark foreground text and hairline borders.

## Typography

The typography is rendered exclusively in **Geist**—a geometric, neutral neo-grotesque optimized for high-density tabular data and screen legibility.

### Rules of Engagement
- **Hierarchy:** Primary body copy runs strictly at `14px` (`body-md`), with supporting metadata restricted to a hard floor of `12px` (`label-sm`, `caption`). Font sizes below `12px` are prohibited.
- **Weights:** Restricted strictly to three weights: Regular (`400`) for descriptive copy and data values, Medium (`500`) for interactive labels, buttons, and navigation, and Semibold (`600`) for headers and numeric metric readouts.
- **Tabular Numerics:** All currency, percentages, lead counters, and enrichment scores must use tabular numbers (`font-variant-numeric: tabular-nums`) to ensure strict alignment in grid tables and metric widgets.

## Layout & Spacing

The layout is built on a high-density, multi-pane fluid model engineered for data exploration and list building.

### Grid & Structure
- **Global Structure:** A fixed vertical navigation bar (64px collapsed, 220px expanded) paired with a fluid central workspace and an optional collateral side-drawer (380px fixed width) for deep-dive lead profiles.
- **Columns & Breakpoints:**
  - **Desktop (≥ 1280px):** 12-column layout with 24px gutters and 32px canvas margins.
  - **Tablet (768px – 1279px):** 8-column layout with 16px gutters and 24px margins; panels stack into contextual overlays.
  - **Mobile (< 768px):** 4-column layout with 16px margins; complex tables transform into compact cards with pinned action drawers.

### Spacing Discipline
Maintain generous exterior whitespace around major functional groups while using compact, rhythmically consistent gaps (`space-xs` to `space-md`) inside table rows and data cells to maximize vertical information yield.

## Elevation & Depth

This design system is completely flat and non-skeuomorphic. It achieves hierarchy purely through surface tonal contrast and hairline strokes.

- **Elimination of Shadows:** No drop shadows (`box-shadow: none`) are permitted on cards, tables, inputs, or popovers.
- **Micro-Borders:** All structural boundaries rely on a crisp `1px solid #EAEAEC`.
- **Surface Layering:**
  - Layer 0 (Base Canvas): `#FAFAF8`
  - Layer 1 (Cards, Modules, Table Body): `#FFFFFF` enclosed by a 1px `#EAEAEC` border.
  - Layer 2 (Overlays, Tooltips, Dropdowns): `#FFFFFF` framed by a 1px `#111114` (dark contrast stroke) or 1px `#EAEAEC` border with zero blur.
- **Interactive Shift:** Hover states never raise the elevation; they shift surface fills dynamically from `#FFFFFF` to `#F4F4F2`.

## Shapes

The design uses soft, disciplined corner geometry to preserve a technical, tool-like edge without feeling abrasive.

- **Inputs, Buttons & Cards:** Set at `0.25rem` (4px) to retain an architectural, modern feel.
- **Large Panels & Modals:** Set to `0.5rem` (8px).
- **Status Badges & Chips:** Form an exception with fully pill-rounded shapes (`9999px`) to immediately distinguish system tags and taxonomy indicators from interactive structural blocks.

## Components

### Buttons
- **Primary Action:** Solid background of `#7856FF`, text `#FFFFFF`, 4px border radius. No borders, no shadows. Hover: `#6644EE`. Focus: Outline 2px offset with `#7856FF`.
- **Secondary Action:** Background `#FFFFFF`, 1px solid border `#EAEAEC`, text `#111114`. Hover: Background `#F4F4F2`.
- **Tertiary / Ghost:** Transparent background, text `#85858F`. Hover: Background `#F4F4F2`, text `#111114`.
- **Height Scale:** Compact 32px for data tables; standard 36px for primary page headers. Font size 13px/14px, weight 500.

### Input Fields & Search Bars
- Background `#FFFFFF`, 1px solid border `#EAEAEC`, text `#111114`, placeholder text `#85858F`.
- Corner radius: 4px. Height: 36px (compact 32px inside filter toolbars).
- Focus state: Border color transitions sharply to `#111114` or `#7856FF` with no ambient blur or ring glow.

### Chips & Status Badges
- **Status Badge:** Neutral background `#F0F0EE`, text `#6A6A74`, radius `9999px` (pill), horizontal padding 8px, vertical padding 2px. Font size 12px, weight 500.
- **Filter Chips:** Background `#FFFFFF`, border 1px solid `#EAEAEC`, text `#111114`. When active: Background `#111114`, border 1px solid `#111114`, text `#FFFFFF`.

### Cards & Modules
- Background `#FFFFFF`, border 1px solid `#EAEAEC`, radius 4px.
- Internal padding: 16px or 20px. Header segments are separated by a continuous 1px `#EAEAEC` horizontal rule rather than empty space alone.

### Data Tables (Core Lead Grid)
- **Table Header:** Background `#FAFAF8`, text `#85858F`, font size 12px, uppercase tracking, height 36px, bottom border 1px `#EAEAEC`.
- **Table Row:** Background `#FFFFFF`, text `#111114`, font size 14px, height 44px, bottom border 1px `#EAEAEC`. Hover state: background `#F4F4F2`.
- **Selection:** Selected rows use `#F4F4F2` background with a 2px vertical border indicator in `#7856FF` on the left anchor.

### Checkboxes & Radios
- Size: 16x16px square (checkbox) or circle (radio).
- Default: Border 1px solid `#85858F`, background `#FFFFFF`.
- Checked: Border `#7856FF`, background `#7856FF`, checkmark icon in `#FFFFFF`.