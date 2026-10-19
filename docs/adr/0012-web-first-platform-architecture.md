# Web-First Platform Experience and Workspace Architecture

## Context
Originally, a mobile-first 5-tab application layout was proposed. However, professional video creators, marketing agencies, and course learners primarily conduct asset generation, prompt editing, and video downloads on desktop and laptop browsers.

## Decision
We pivot the platform to a **Website-First / Desktop-First Platform**:
1. **Top Global Navigation Bar**: Brand Logo, `Learn (Academy)`, `AI Coach`, `Video Studio`, `My Videos`, `Coin Wallet Balance` with Quick PromptPay Topup, and User Profile.
2. **Expansive Desktop Layouts**:
   - **Video Studio**: Pro split-panel workspace (Left: Multi-model parameters, image reference dropzone, prompt editor; Right: Real-time generation monitor, 4K preview player, quick remix/download actions).
   - **AI Coach**: Creative studio canvas with live prompt syntax highlighter, camera movement selector, and 1-click Studio export.
   - **Learn**: Rich LMS experience with sidebar curriculum navigation and high-definition video player.
3. **Responsive Mobile Compatibility**: Fully accessible and functional on mobile devices with adaptive responsive styling.

## Rationale
- Professional content creators work with multiple tabs, reference image folders, and video editing suites on desktop computers.
- Dual-panel workspaces significantly improve productivity compared to restricted mobile viewports.
