# Dual-Theme Architecture (Light-First Default Canvas & Dark Mode)

## Context
Creators frequently operate in daytime desktop environments where a clean, high-contrast, bright aesthetic minimizes eye fatigue. The platform adopts a **Light-First** default interface while preserving full Dark Mode support.

## Decision
1. **Light Mode (Default Experience)**:
   - Base Background: Clean, crisp canvas (`#f6f8fa` / `#ffffff`).
   - Sidebar & Content Cards: Pure elevated white (`#ffffff`) with subtle structural borders (`#e1e4e8` / `#d0d7de`) and soft depth shadows (`0 4px 12px rgba(0,0,0,0.05)`).
   - Interactive Inputs & Selects: Soft neutral fill (`#f0f2f5`) with inset border and focus border in Spotify Green (`#1db954`).
   - Typography: High-contrast deep slate (`#121212` headings, `#57606a` secondary text).
   - Brand Accent: Functional Spotify Green (`#1ed760` / `#1db954`) on CTAs, active indicators, and play controls.
2. **Dark Mode (Toggle Option)**:
   - Charcoal canvas (`#121212`, `#181818`, `#1f1f1f`) available on-demand via the top header toggle.
3. **Pill & Circle Geometry Preserved**:
   - `500px` / `9999px` full-pill buttons, `50%` circular media controls, and uppercase tracking (`1.4px`) remain invariant across both themes.
4. **Approachable AI Coach Controls**:
   - AI Coach leads with plain Thai labels and a short intake form. Technical controls are progressively disclosed only when useful; users do not need prompt-engineering knowledge to complete a Creative Brief or create a Studio Draft.

## Rationale
- Immediate clarity and readability for daytime productivity.
- Eliminates "harsh darkness" while retaining Spotify's iconic shape language and functional green voltage.
- Keeps the creative workflow usable for creators who do not understand video-model terminology.
