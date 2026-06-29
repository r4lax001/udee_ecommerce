---
name: Artisanal Heritage
colors:
  surface: '#fff8f5'
  surface-dim: '#dfd9d6'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2f0'
  surface-container: '#f3ecea'
  surface-container-high: '#eee7e4'
  surface-container-highest: '#e8e1df'
  on-surface: '#1d1b1a'
  on-surface-variant: '#4f453f'
  inverse-surface: '#33302e'
  inverse-on-surface: '#f6efed'
  outline: '#81756e'
  outline-variant: '#d2c4bc'
  surface-tint: '#705a4c'
  primary: '#26170c'
  on-primary: '#ffffff'
  primary-container: '#3d2b1f'
  on-primary-container: '#ac9181'
  inverse-primary: '#dec1af'
  secondary: '#7f5530'
  on-secondary: '#ffffff'
  secondary-container: '#ffc698'
  on-secondary-container: '#7a512c'
  tertiary: '#281600'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f2b0f'
  on-tertiary-container: '#b0916d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fbddca'
  primary-fixed-dim: '#dec1af'
  on-primary-fixed: '#28180d'
  on-primary-fixed-variant: '#574335'
  secondary-fixed: '#ffdcc1'
  secondary-fixed-dim: '#f3bc8e'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#643e1b'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#e3c199'
  on-tertiary-fixed: '#291801'
  on-tertiary-fixed-variant: '#5a4224'
  background: '#fff8f5'
  on-background: '#1d1b1a'
  surface-variant: '#e8e1df'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  huge: 64px
---

## Brand & Style

The design system is anchored in a **Corporate / Modern** aesthetic with a heavy emphasis on **warmth and tactile comfort**. It targets a high-end demographic that values craftsmanship, reliability, and the quiet luxury of home. The UI should evoke a sense of "digital slow-living"—calm, organized, and deeply professional.

The style utilizes a sophisticated "Parchment and Wood" visual metaphor. It avoids the coldness of pure white and harsh blacks, replacing them with ivory tones and deep walnut browns. Large whitespace and deliberate use of the "Warm Underline Accent" signature element create an editorial feel, reminiscent of premium interior design lookbooks.

## Colors

The palette is derived from natural timber and masonry. 
- **Primary (Dark Walnut):** Used for high-priority navigation and primary "Commit" actions.
- **Accent (Saddle Brown):** Reserved for interactive highlights and showing monetary value.
- **Backgrounds:** The primary background uses a creamy ivory to reduce eye strain and provide a "warm" canvas. Section alternates (Parchment) should be used to break up long scrolling product pages.
- **Feedback:** Success and error states are muted to maintain the sophisticated mood; avoid neon-bright variants.

## Typography

The design system uses **Be Vietnam Pro** (as a high-quality alternative to Prompt for better Thai/Latin height matching) for headlines to provide a friendly yet architectural feel. **Inter** is used for body text and UI labels to ensure maximum legibility at small sizes.

- **Hierarchical Rules:** Headline levels (H2) must always be followed by the "Warm Underline Accent" (40px wide, 2px thick, #A0724A) centered or left-aligned depending on text alignment.
- **Language Support:** Ensure line heights are generous (minimum 1.5x for body text) to accommodate Thai vowel markers without clipping.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid** grid. On desktop, content is constrained to a 1280px container to maintain an editorial feel.
- **Rhythm:** Use an 8px base grid for component-level spacing (padding within cards, spacing between labels). Use the larger scale (48px, 64px) for vertical section spacing to maintain an airy, premium feel.
- **Adaptive Strategy:** On mobile, margins reduce to 16px. Product grids should transition from 3 or 4 columns on desktop to 1 or 2 columns on mobile depending on image complexity.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Soft Ambient Shadows**. 
- **Base Level:** Surface Alt (#F2EBE2) used for background regions.
- **Raised Level:** Cards and Input fields use White (#FFFFFF) with a delicate shadow (0 2px 8px rgba(61,43,31,0.08)).
- **Interactive Level:** On hover, elements should lift using a more pronounced shadow (0 6px 16px rgba(61,43,31,0.14)).

Shadows are tinted with the Primary color (#3D2B1F) instead of pure black to maintain the warmth of the wood-inspired palette.

## Shapes

The shape language reflects the craftsmanship of fine furniture—combining sturdy structures with softened edges. 
- **Buttons:** 12px radius (Large/Rounded) to feel inviting to the touch.
- **Cards:** 8px radius for a stable, professional appearance.
- **Inputs:** 4px radius for a more precise, functional look.
- **Badges/Chips:** 24px (Pill) to contrast against the structured grid of product images.

## Components

### Buttons
- **Primary:** Background #3D2B1F, Text #FFFFFF, 12px radius.
- **Secondary:** Border 1px #3D2B1F, Text #3D2B1F, no background.
- **Ghost:** Text #A0724A, no border, used for less prominent actions.

### Cards (Product)
- Background #FFFFFF, 8px radius, Shadow "Card".
- Title in #2A1F14, Price in #A0724A (Medium weight).

### Input Fields
- 4px radius, Border 1px #DDD0C4. 
- Focus state: Border 1px #A0724A with a subtle 2px glow of the same color at 10% opacity.

### Badges (Status/Discounts)
- Background #C8A882, Text #2A1F14, 24px radius, uppercase label-sm font.

### Signature Heading
- Every H2 heading must include a #A0724A horizontal rule (40px x 2px) positioned 8px below the text baseline. This is the hallmark of the design system.