---
name: Editorial Minimalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#4d6705'
  on-secondary: '#ffffff'
  secondary-container: '#ceef83'
  on-secondary-container: '#526d0d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#121c28'
  on-tertiary-container: '#7a8594'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ceef83'
  secondary-fixed-dim: '#b2d26a'
  on-secondary-fixed: '#151f00'
  on-secondary-fixed-variant: '#384e00'
  tertiary-fixed: '#d9e3f4'
  tertiary-fixed-dim: '#bdc7d8'
  on-tertiary-fixed: '#121c28'
  on-tertiary-fixed-variant: '#3e4755'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style

This design system embodies a high-end editorial aesthetic characterized by meticulous restraint and structural clarity. It draws inspiration from premium architectural and fashion publications, utilizing a minimalist philosophy where negative space is as much a design element as the content itself. 

The emotional response is one of precision, sophistication, and quiet confidence. By prioritizing a monochromatic foundation with a singular, high-vibrancy accent, the UI establishes a hierarchy that feels both contemporary and timeless. The style leans into **Minimalism** with a touch of **Bold** typographic character, ensuring that information is presented with maximum legibility and an uncompromising sense of quality.

## Colors

The color palette is strictly curated to maintain an editorial feel. The primary engine of the design is the high-contrast relationship between absolute black (#000000) and pure white (#FFFFFF). 

- **Primary (Black):** Used for all primary typography, structural borders, and high-emphasis interactive states.
- **Secondary (Lime-Green):** Reserved exclusively for subtle accents, success states, or micro-interactions to provide a modern, technical spark.
- **Tertiary (Slate Gray):** Utilized for secondary information, meta-data, and disabled states to reduce visual noise.
- **Backgrounds:** Surfaces should alternate between pure white and an extremely light gray (derived from #4B5563 at 5% opacity) to define content sections without the need for heavy shadows or borders.

## Typography

This design system uses **Space Grotesk** across all levels to achieve a cohesive, technical-yet-humanist look. The typographic hierarchy relies on dramatic scale shifts and variations in weight rather than color. 

Large display headlines should utilize tight letter-spacing and heavy weights to create "text blocks" that act as graphic elements. Body text must maintain generous line-heights (1.6) to ensure readability against the high-contrast background. All labels and functional micro-copy should be rendered in uppercase with increased letter-spacing for an architectural feel.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop and a fluid fluid model on mobile. Content is contained within a 12-column grid with a maximum width of 1440px to ensure the editorial composition remains controlled.

Key spacing principles:
- **Excessive Margins:** Large horizontal margins (64px+) provide the "white box" breathing room necessary for the aesthetic.
- **Vertical Rhythm:** Use a base 8px unit, but prefer large gaps (section-gap) between major content blocks to create a sense of luxury and focus.
- **Alignment:** Strict adherence to the grid is required. Text should align to the left margin, while imagery may occasionally break the grid to create visual interest.

## Elevation & Depth

This design system avoids traditional shadows to maintain a flat, modernist feel. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Use #FFFFFF for the primary surface and #F9FAFB for background containers or secondary sections.
- **Borders:** Instead of shadows, use 1px solid borders in #000000 for high-emphasis elements or #E5E7EB for subtle separation.
- **Overlays:** For modals or menus, use a solid white background with a crisp 1px black border. If a backdrop is required, use a white tint with 80% opacity to maintain the "light" feel of the interface.

## Shapes

The shape language is strictly **Sharp (0px)**. All containers, buttons, and input fields must use 90-degree angles. This geometric rigidity reinforces the architectural, grid-based nature of the design and differentiates it from more "friendly" consumer-grade interfaces. Circular shapes are only permitted for avatars or specific status indicators.

## Components

### Buttons
Primary buttons are solid black rectangles with white, uppercase bold text. Secondary buttons use a 1px black outline. The hover state for primary buttons should reveal the Lime-Green accent as a subtle bottom border or background shift.

### Input Fields
Inputs are defined by a single 1px black bottom border (underline style) or a full rectangular stroke. They should not have background fills unless they are in an error state. Labels sit above the input in a small, uppercase bold format.

### Chips & Tags
Small, rectangular boxes with 1px black borders. Use the Lime-Green accent for "active" or "selected" tags to draw immediate attention.

### Cards
Cards are minimalist containers with no shadows. Separation is achieved through 1px light gray borders or simply by utilizing the grid's whitespace. Titles within cards should be bold and prominent.

### Lists
Lists use generous vertical padding (24px+) between items. Individual items are separated by a 1px light gray horizontal rule that spans the full width of the container.

### Interactive Elements
Hover states on links should be indicated by a solid Lime-Green underline rather than a color change, maintaining the integrity of the black typography.