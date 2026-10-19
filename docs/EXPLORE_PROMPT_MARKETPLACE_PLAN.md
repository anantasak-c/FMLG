# Explore Feed & Prompt Marketplace Plan

## Status

Confirmed product direction for the frontend-first phase.

## Product intent

FOMOlogy will add an **Explore Feed**: a curated discovery surface for Thai creators who need an idea before they can create a video. It is not a social network. Every item must lead to a useful next action: save it, share it in LINE, or use it as the starting point for AI Coach.

The feed becomes a **Prompt Marketplace** by mixing free templates with paid, FOMOlogy-curated Prompt Packs. Users pay for a reusable creative starting point and guided outcome—not for an opaque block of raw English prompt text.

## Primary user journey

```text
Explore Feed
  → choose a work category
  → open a template or Prompt Pack
  → preview outcome, use case, tags, and price
  → “Use this idea”
  → Adaptive Grill Choice UI in AI Coach
  → editable Creative Brief
  → free Prompt Package preview
  → buy/unlock Prompt Pack when needed
  → create Studio Draft
  → confirm Coin cost and generate video
```

## Explore Feed

- Launch as a top-level `Explore` destination on web and LINE MINI App.
- Prioritize work-to-be-done categories over visual styles:
  - Sell a product
  - Review a shop
  - Promote a service
  - Knowledge clip
  - Tell a story
  - Promotion or seasonal campaign
- Launch with 24 curated items: four templates per category.
- Search and filters use Thai labels. `All` and `Free` are always available.
- Cards use image thumbnails by default; play a short preview only after tap/hover to protect mobile data use.
- Card actions in MVP:
  - `Use this idea` (primary)
  - Save
  - Share in LINE
- Do not expose like counts or follower mechanics in MVP.

## Prompt Marketplace

### Catalog and pricing

Only FOMOlogy-curated, rights-cleared Prompt Packs are sellable in the first release. Creator-submitted packs are a later marketplace phase.

| Pack | Price | Includes |
| --- | ---: | --- |
| Basic | 15 Coins | Creative starting point and guided AI Coach route |
| Pro | 35 Coins | Full Prompt Package route, negative-prompt guidance, checklist |
| Campaign | 75 Coins | Multi-shot / multi-format campaign recipe |

### Preview and purchase

- The listing shows example output, use case, tags, the outcome structure, and price.
- Full prompt and negative-prompt content remain locked until purchase/unlock.
- Free templates and paid packs appear in one feed but have visible labels and a `Free` filter.
- The listing shows the starting Coin price before the user begins; final generation cost is confirmed once before a video is generated.
- Purchase uses Coin. If the Wallet balance is insufficient, open PromptPay top-up without losing the selected item.
- An owned item replaces its price with `Open again` and `You own this`.

### Rights, updates, and refunds

- The buyer may reuse an unlocked pack for their own commercial video work.
- The buyer may not resell, distribute, or publish the unlocked source Prompt Pack.
- Sharing sends people back to the marketplace listing, never the unlocked content.
- Compatibility fixes and small corrections update the owned pack for free.
- Major content additions are released as a new edition.
- Do not refund after content is unlocked. Refund Coins automatically when unlock or Studio Draft creation fails due to a system error.

## My Work information architecture

Keep these user-owned states separate:

| Area | Meaning |
| --- | --- |
| Saved Ideas | Bookmarked Explore templates that are not owned or in production |
| My Prompt Packs | Purchased/unlocked Prompt Packs |
| Studio Drafts | Editable generation settings created from a Creative Brief or Prompt Package |

## Adaptive Grill Choice UI

Replace a long free-form interview with one focused question at a time.

- Show question progress (`1 / N`).
- Provide three short suggested answers; visibly mark the recommended answer.
- Allow a custom answer.
- Web: centered dialog, keyboard-friendly (Tab, arrows, Enter/Space).
- LINE MINI App: full-width bottom sheet optimized for tapping.
- Each answer updates the Creative Brief, not a final prompt directly.
- The user previews a Prompt Package free before any paid export or generation.

## Channel-specific UI

### LINE MINI App

- Four tabs: Home, Coach, My Work, Me.
- Home is goal-first and lightweight; Explore is an entry section or first destination.
- AI Coach uses the Adaptive Grill Choice UI.
- Image-to-video is a first-class simple choice.
- Video-to-video is placed under `Advanced` / `Open full Studio` because uploads and controls are heavier.
- Use LINE identity for purchase and ownership. Guests may browse and save locally but must sign in before purchase.

### Web

- Explore is a first-class navigation item next to AI Coach and Video Studio.
- Use a responsive masonry/grid feed with thumbnail previews.
- Keep Studio as the advanced workspace for image-to-video, video-to-video, detailed controls, and monitoring.
- AI Coach uses the same question logic as LIFF but presents it as a centered dialog.

## Frontend-first build order

1. Add Explore navigation and a responsive curated feed to the web preview.
2. Add template detail / purchase states and saved-item states using mock data.
3. Add `Saved Ideas`, `My Prompt Packs`, and `Studio Drafts` to My Work.
4. Replace free-form Coach intake with the Adaptive Grill Choice UI.
5. Add LIFF Explore and a bottom-sheet Grill flow.
6. Connect the flows to backend ownership, Wallet ledger, purchase, content entitlement, and real media assets.

## MVP non-goals

- Creator-upload marketplace
- Public profile/following/like-count system
- Sharing unlocked Prompt Pack content directly
- Automatic generation without a final Coin confirmation
- Showing provider/model controls to beginner LIFF users
