# Adoption of Spotify Design System (Dark-First & Spotify Green)

## Context
The platform requires an immersive, modern, tactile media creation interface where creative video outputs and content provide the vibrant visuals while the application shell remains sleek and unobtrusive.

## Decision
We adopt the official **Spotify Design System** specified in [DESIGN.md](../../DESIGN.md):
1. **Three-Tier Near-Black Canvas**: `#121212` (Base background), `#181818` (Cards/Panels), `#1f1f1f` (Interactive fills/inputs), `#252525` (Hover card elevation).
2. **Single Functional Brand Accent**: Spotify Green (`#1ed760` / `#1db954`), reserved exclusively for video play controls, active navigation links, and primary CTA pill buttons.
3. **Pill-and-Circle Geometry**: `500px` to `9999px` radii on all primary buttons and inputs, `50%` on circular play/status controls, and `8px` (`rounded-md`) for content cards.
4. **Uppercase Button Label Voice**: `14px` bold labels with `1.4px` letter tracking (`uppercase`).
5. **Tactile Elevation & Depth**: Heavy dark elevation shadows (`rgba(0,0,0,0.5) 0px 8px 24px`) and inset border shadows on inputs (`rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset`).

## Rationale
- Elevates the platform to a tier-one media streaming studio aesthetic.
- Provides immediate visual contrast between the dark application chrome and colorful video thumbnails/generations.
