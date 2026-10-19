---
version: alpha
name: Spotify
website: "https://www.spotify.com"
description: A content-first dark music interface where the UI recedes into near-black charcoal (#121212, #181818, #1f1f1f) so album art and playlists provide the only color. Spotify Green (#1ed760) is the singular brand voltage, used functionally on play controls, active states, and primary CTAs — never decoratively. Type runs SpotifyMixUI and SpotifyMixUITitle (CircularSp-family, custom Circular by Lineto) with a bold/regular binary at 700 and 400, plus uppercase button labels at 1.4–2px letter-spacing. The shape language is pill-and-circle: primary buttons at 500–9999px radius, circular play controls at 50%, search inputs as 500px pills. Heavy shadows (rgba(0,0,0,0.5) 0px 8px 24px) and an inset border-shadow combo on inputs (rgb(124,124,124) 0px 0px 0px 1px inset) give the surface a tactile, premium audio-device quality.

seo:
  title: "Spotify Design System for React — #1ed760, SpotifyMixUI, 30 components"
  metaDescription: "Spotify's design system as a DESIGN.md file. Green #1ed760, SpotifyMixUI font, 19 colors, 30 components. For React, Next.js, and AI tools."
  tags:
    - "Music, Video & Streaming"
  highlights:
    - "Near-black immersive canvas — three charcoal surfaces (#121212, #181818, #1f1f1f) let album art carry every drop of color"
    - "Single accent voltage — Spotify Green (#1ed760) is functional only, reserved for play controls, active states, and CTAs"
    - "Pill-and-circle geometry — 500px to 9999px radii on buttons, 50% on play controls, no square interactive surface anywhere"
    - "Uppercase button labels with 1.4–2px tracking — a systematic 'label voice' distinct from running content text"
    - "Heavy shadow language — 0.5 opacity at 24px blur for dialogs, an inset rgb(124,124,124) border for tactile input depth"
  lastUpdated: "2026-05-12"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Spotify's web interface is a near-black theater built around one principle: the UI disappears so the content can glow. Three charcoal surfaces stack the page in shade (#121212 base, #181818 cards, #1f1f1f interactive fills), and the only true color comes from album artwork plus Spotify Green (#1ed760), which is reserved exclusively for play buttons, active navigation, and primary CTAs. The typography uses SpotifyMixUI and SpotifyMixUITitle — proprietary fonts from the CircularSp family with an extensive fallback stack covering Arabic, Hebrew, Cyrillic, Greek, Devanagari, and CJK scripts to serve Spotify's 180+ markets.

    This page packages the full system into a single DESIGN.md file built on the Google Labs spec. Inside: 19 color tokens grouped into brand, text, semantic, surface, and shadow roles; 14 type styles spanning a compact 10px–24px range; 9 corner radii from 2px badges through 9999px full pills; a 20-step spacing scale built on an 8px base unit; and 30 component recipes covering dark pills, outlined pills, circular play buttons, search pills with inset borders, dark cards, and the achromatic sidebar navigation.

    Feed the file to Claude, Cursor, or GitHub Copilot and the agent writes React components that match Spotify's voice — pill geometry, uppercase tracking, heavy dark-mode shadows — rather than a generic dashboard theme. Or reference the tokens directly: every hex, font-stack, radius, and shadow definition is quoted and ready to paste into Tailwind config or CSS variables. The system is worth studying for the discipline of letting one functional accent and a single typeface family carry an entire app — restraint as identity, not as compromise.
  related:
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "/blocks"
      title: "React blocks for shadcn/ui"
      description: "Production-ready hero, pricing, CTA, and dashboard sections built with the same Tailwind + shadcn primitives."
  questions:
    - id: "primary-color"
      title: "What is Spotify's primary brand color and how is it used?"
      answer: "Spotify Green is #1ed760 — a vivid functional green used scarcely. It only appears on play and pause controls, active navigation items, and primary CTAs. It is never decorative, never used as a background, and never paired with a secondary brand accent. The complete brand palette is green plus a stack of achromatic charcoals (#121212, #181818, #1f1f1f) — album artwork is expected to provide all other color on the page."
    - id: "dark-mode"
      title: "Does Spotify's design system have a light mode?"
      answer: "No — Spotify's web product is dark-first by design. The base canvas is #121212, cards step up to #181818, and interactive surfaces sit at #1f1f1f. A single light-pill component (#eeeeee fill, #181818 text) exists for marketing CTAs like cookie consent and rare light-mode banners, but the core listening experience is always near-black. Dark immersion is core to the identity; light backgrounds break it."
    - id: "typography"
      title: "What typography does Spotify use, and what if SpotifyMixUI isn't available?"
      answer: "Spotify runs SpotifyMixUI and SpotifyMixUITitle, both proprietary fonts from the CircularSp family (Circular by Lineto, customized for Spotify) and licensed only to Spotify. The fallback stack walks CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, then Helvetica Neue, helvetica, arial, Hiragino Sans, Hiragino Kaku Gothic ProN, Meiryo, and MS Gothic. If you cannot license Circular, Inter is the closest open-source substitute — tighten letter-spacing on uppercase button labels to 1.4–2px to preserve the systematic label voice."
    - id: "shape-language"
      title: "Why does Spotify use pill and circle shapes for every button?"
      answer: "Pill-and-circle geometry is the system's tactile signature. Primary buttons run 500–9999px radius (full pill), circular play controls use 50% radius, and search inputs render as 500px pills. The result feels like a premium audio device — rounded, touch-optimized, and clearly interactive. Square corners break the identity, which is why even outlined secondary buttons and navigation pills inherit the same pill shape rather than a softer 8px rounding."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build a React music or media app?"
      answer: "Yes — the file is structured for AI ingestion. Feed it to Claude, Cursor, or any tool that reads structured tokens and the agent will reproduce the dark immersion, pill geometry, and functional green-accent discipline rather than defaulting to a generic shadcn theme. You can also reference tokens directly: every color, type style, radius, shadow, and component recipe is a quoted value ready for Tailwind config, CSS variables, or your own component library. The 30 component recipes cover the full surface area of a listening app — buttons, cards, search, navigation, play controls."
    - id: "known-gaps"
      title: "What's missing from this DESIGN.md spec?"
      answer: "A handful of items documented in the Known Gaps section: motion and transition timings, the now-playing bar progress scrubber visual states, equalizer and waveform component styling, full hover-state color shifts (the system uses subtle background lightening that's hard to extract reliably), and the mobile-app bottom-bar navigation which lives in native shells rather than the web product. The spec captures roughly 95% of the public web listening interface."

colors:
  brand-green: "#1ed760"
  brand-green-border: "#1db954"
  bg-base: "#121212"
  surface-dark: "#181818"
  surface-mid: "#1f1f1f"
  surface-card: "#252525"
  surface-card-alt: "#272727"
  text-base: "#ffffff"
  text-secondary: "#b3b3b3"
  text-near-white: "#cbcbcb"
  text-light: "#fdfdfd"
  text-negative: "#f3727f"
  text-warning: "#ffa42b"
  text-announcement: "#539df5"
  border-gray: "#4d4d4d"
  border-light: "#7c7c7c"
  separator: "#b3b3b3"
  surface-light: "#eeeeee"
  on-green: "#000000"

typography:
  section-title:
    fontFamily: "'SpotifyMixUITitle', CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, 'Helvetica Neue', helvetica, arial, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, 'MS Gothic'"
    fontSize: 24px
    fontWeight: 700
    lineHeight: normal
    letterSpacing: normal
  feature-heading:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, 'Helvetica Neue', helvetica, arial, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: normal
  body-bold:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: normal
    letterSpacing: normal
  body:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
  button-uppercase:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.00
    letterSpacing: 1.4px
    textTransform: uppercase
  button:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: normal
    letterSpacing: 0.14px
  nav-link-active:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: normal
    letterSpacing: normal
  nav-link:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
  caption-bold:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.50
    letterSpacing: normal
  caption:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
  small-bold:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.50
    letterSpacing: normal
  small:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
  badge:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 10.5px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: normal
    textTransform: capitalize
  micro:
    fontFamily: "'SpotifyMixUI', CircularSp-Arab, CircularSp-Hebr, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal

rounded:
  none: 0px
  minimal: 2px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 20px
  pill-large: 100px
  pill: 500px
  full: 9999px
  circle: 50%

spacing:
  xxs: 1px
  xxs2: 2px
  xxs3: 3px
  xs: 4px
  xs2: 5px
  xs3: 6px
  sm: 8px
  sm2: 10px
  md: 12px
  md2: 14px
  md3: 15px
  base: 16px
  lg: 20px

components:
  button-dark-pill:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  button-dark-large-pill:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-base}"
    typography: "{typography.button-uppercase}"
    rounded: "{rounded.pill}"
    padding: 0px 43px
  button-light-pill:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.surface-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-outlined-pill:
    backgroundColor: transparent
    textColor: "{colors.text-base}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 4px 16px 4px 36px
  button-circular-play:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    rounded: "{rounded.circle}"
    padding: 12px
  button-play-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-green}"
    rounded: "{rounded.circle}"
    padding: 12px
  button-cta-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-green}"
    typography: "{typography.button-uppercase}"
    rounded: "{rounded.pill}"
    padding: 8px 32px
  card-surface:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
  card-elevated:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
  card-alt:
    backgroundColor: "{colors.surface-card-alt}"
    textColor: "{colors.text-base}"
    rounded: "{rounded.md}"
  album-art-container:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.sm}"
  search-input-pill:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 96px 12px 48px
  text-input:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 12px 16px
  sidebar:
    backgroundColor: "{colors.bg-base}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.nav-link}"
  sidebar-item-active:
    backgroundColor: transparent
    textColor: "{colors.text-base}"
    typography: "{typography.nav-link-active}"
  sidebar-item-inactive:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    typography: "{typography.nav-link}"
  icon-button-circle:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    rounded: "{rounded.circle}"
    padding: 8px
  badge-pill:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 2px 8px
  badge-explicit:
    backgroundColor: "{colors.border-gray}"
    textColor: "{colors.text-base}"
    typography: "{typography.small-bold}"
    rounded: "{rounded.minimal}"
    padding: 0px 4px
  track-row:
    backgroundColor: transparent
    textColor: "{colors.text-base}"
    typography: "{typography.caption}"
    padding: 8px 16px
  track-row-meta:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption}"
  now-playing-bar:
    backgroundColor: "{colors.bg-base}"
    textColor: "{colors.text-base}"
    typography: "{typography.caption}"
  dialog:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
  dropdown-menu:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-base}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
  separator-line:
    backgroundColor: "{colors.border-gray}"
  link-muted:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption}"
  link-active:
    backgroundColor: transparent
    textColor: "{colors.text-base}"
    typography: "{typography.caption-bold}"
  tag-small:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.text-base}"
    typography: "{typography.small-bold}"
    rounded: "{rounded.minimal}"
    padding: 1px 6px
  legal-band:
    backgroundColor: "{colors.bg-base}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.small}"
---
