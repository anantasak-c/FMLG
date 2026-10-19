# Thai AI Video Platform

A Thai-first, Website-First AI Video web platform combining online learning, prompt assistance (AI Coach), and direct-provider video generation (Video Studio) powered by a unified THB PromptPay Coin economy.

## Language

### Economy & Account
**Coin**:
The internal platform usage credit purchased with Thai Baht (THB) via PromptPay slip verification, used to pay for AI Coach exports and Video Studio generations.
_Avoid_: Token, crypto, cryptocurrency, point

**Slip Verification**:
The automated bank transfer slip validation process powered by SlipOK API that verifies payment authenticity and deposits Coins or unlocks Courses.
_Avoid_: Manual check, receipt upload

**Wallet**:
The ledger holding a user's Coin balance and immutable history of top-ups, generation spends, and auto-refunds. Purchased Coin has no expiry during the customer pilot.
_Avoid_: Bank account, credit pool

### Core Products
**AI Coach**:
An interactive conversational assistant powered by a server-side Prompt Engine that conducts Thai Creative Brief interviews, applies versioned FOMOlogy knowledge, and generates provider-ready Prompt Packages.
_Avoid_: Chatbot, bot, AI assistant

**Prompt Package**:
The immutable exported AI Coach result comprising a final generation prompt, risk-specific negative prompt, quality checklist, optional Thai dialogue sheet, and explicit assumptions. It is owned by an authenticated user.
_Avoid_: Raw prompt, chat response

**Studio Draft**:
An editable, non-billable set of Video Studio generation settings prefilled from a Prompt Package. It never creates a Generation Job by itself.
_Avoid_: Auto-generation, queued render

**Provider Profile**:
The selected upstream video workflow's prompt-formatting, knowledge requirements, quality gate, and Video Studio default rules. A Provider Profile is chosen before an AI Coach export, even when execution is simulated by a test adapter.
_Avoid_: Model switcher, generic prompt mode

**Guest Coach Session**:
An unauthenticated, temporary AI Coach interview that may collect a creative brief but cannot create a persistent Prompt Package or Studio Draft until the user signs in.
_Avoid_: Anonymous export, guest wallet

**Creative Brief**:
The structured, editable representation of the user's video intent, collected through the intake form and Adaptive Grill AI. It becomes an immutable Prompt Package only at export.
_Avoid_: Chat transcript, final prompt

**Confirmed Creative Brief**:
A user-owned, durable Creative Brief that crossed the authentication boundary and is ready for compilation. It is not a Prompt Package and contains no generated prompt.
_Avoid_: Pending prompt, draft export

**Ready-to-Generate Brief**:
A Creative Brief that AI Coach judges sufficient for its selected Generation Source Mode and Generation Tier. The creator may immediately create a video or choose to add more detail.
_Avoid_: Required final question, locked prompt, automatic generation

**Prompt Package**:
The paid AI Coach export containing a final generation prompt, risk-specific negative prompt, checklist, unresolved assumptions, and optional dialogue sheet.
_Avoid_: Prompt only, raw response

**Advanced Prompt View**:
The desktop-only view that lets an advanced creator inspect and copy a Prompt Package's compiled English generation prompt. LINE MINI App never exposes provider prompt syntax.
_Avoid_: LIFF prompt editor, raw prompt by default

**Studio Draft**:
An editable Video Studio configuration created from a Prompt Package. Saving or opening a Studio Draft never starts a Generation Job or spends Coins.
_Avoid_: Auto-generation, queued render

**Prompt Engine**:
The server-side port that runs the AI Coach interview and compilation stages. It has a deterministic fake implementation for tests and provider-specific API adapters only in live environments.
_Avoid_: Codex CLI backend, browser-held API key

**Development Credit**:
Non-purchased Coin entitlement used only in development and automated tests to exercise the Wallet ledger and paid Prompt Package flow before Slip Verification is connected.
_Avoid_: Free production Coins, mock payment

**Pilot Credit**:
A non-purchased Coin entitlement granted once to an eligible customer pilot account. The current allowance covers one Economy Generation; afterward the creator tops up their Wallet to use further Generation Tiers.
_Avoid_: Development Credit, public promotion, unlimited free use

**Pilot Allowlist**:
The set of pre-approved LINE accounts permitted to enter the customer pilot, receive Pilot Credit, and start Generation Jobs. Accounts outside the list receive a waiting-state screen rather than public access.
_Avoid_: Open beta, public registration, invite-only by URL

**Generation Support Handoff**:
The LIFF help action that opens the FOMOlogy LINE Official Account chat with the relevant Generation Job ID and status attached. It gives the support team enough context without asking a beginner to describe technical details.
_Avoid_: Email ticket, copy-paste error report, generic help page

**Video Studio**:
The desktop-first dual-panel video creation workspace offering Beginner and Advanced parameter controls with live generation monitoring.
_Avoid_: Video generator, rendering engine

**LINE MINI App**:
The mobile-first FOMOlogy experience opened inside LINE for Thai beginner creators. It leads with AI Coach, simple live Economy Generation, and result viewing; the desktop Video Studio remains the advanced workspace for detailed controls and future provider options.
_Avoid_: Separate mobile product, LINE chatbot

**Course**:
A structured video academy product purchased directly in THB with bundled Bonus Coins and HLS adaptive video streaming with progress tracking.
_Avoid_: Lesson package, tutorial

### Discovery & Marketplace
**Explore Feed**:
The curated discovery surface for reusable creative templates. Its primary action starts an AI Coach interview from a selected creative brief; the customer pilot offers the templates free of charge.
_Avoid_: Social feed, community timeline

**Prompt Pack**:
A FOMOlogy-curated template product that includes a reusable creative brief, example output, usage guidance, and a route into AI Coach. It is not an unadapted raw prompt; Coin-priced Premium Packs are deferred until after the customer pilot.
_Avoid_: Prompt text, prompt file

**Saved Idea**:
An Explore Feed template a user has bookmarked without purchasing or creating a Studio Draft.
_Avoid_: Draft, owned Prompt Pack

**Adaptive Grill Choice UI**:
The single-question-at-a-time interface used by AI Coach to collect a Creative Brief through suggested answers and a custom response. It has no fixed question count: AI Coach stops as soon as the Creative Brief is sufficient for the selected Generation Source Mode and Generation Tier.
_Avoid_: Long chat form, questionnaire page

### Pipeline & Infrastructure
**Generation Job**:
An asynchronous, private-by-default video creation task tracked through pending, processing, completed, and failed states, processed via a serverless queue and Cloudflare R2 storage. A completed video may enter the Explore Feed only with its creator's separate consent.
_Avoid_: Render task, video request

**Retention Policy**:
The automated lifecycle rule that purges user-generated videos from Cloudflare R2 after 15 days.
_Avoid_: Permanent library, unlimited vault

**Watermark Policy**:
The rule that downloaded Generation Job results have no FOMOlogy watermark, including the one-time pilot output. FOMOlogy branding belongs in the product experience, not over the creator's video.
_Avoid_: Branded output, forced end card

**Creator Output Rights**:
The customer-facing policy that a creator retains rights in their generated output as between the creator and FOMOlogy, subject to applicable law and provider terms. The creator is responsible for holding rights and consent for every submitted image, person, voice, and other input.
_Avoid_: Guaranteed uniqueness, rights clearance, FOMOlogy-owned output

**Input Rights Confirmation**:
The creator's first-generation acknowledgement that they hold the required rights and consent for submitted media and identifiable people. It is recorded against their LINE account and followed by a lightweight reminder when they upload later media.
_Avoid_: Per-click legal form, silent consent, provider waiver

**Model Router**:
The backend adapter module that coordinates direct API requests, parameter formatting, and status polling for upstream providers. The Economy Video Engine is its first live provider.
_Avoid_: API proxy, model switcher

**Generation Tier**:
The creator-visible quality and price choice selected by a Provider Profile. In the customer-pilot MVP, Economy is the only live tier and communicates the outcome in plain language rather than exposing model parameters.
_Avoid_: Generic model switcher, provider picker

**Economy Generation**:
A Generation Job run through the Economy Video Engine on Runpod/ComfyUI for the lowest-cost option. It is a selectable generation tier, not a mandatory intermediate state before a final render.
_Avoid_: Required draft, preview-only output

**2K Upscale**:
A future provider-specific job that takes an existing completed video and outputs a 2K result. It is available only after a source video exists.
_Avoid_: 2K text-to-video, initial generation setting

**Generation Completion Notification**:
A LINE Official Account message sent when a Generation Job completes, with a deep link to the creator's result. The same result remains available from My Work.
_Avoid_: Push-only notification, email alert

**Generation Feedback**:
The optional result-level response collected after a creator views a completed video: either `ตรงใจ` or `ยังไม่ตรงใจ`, with a short reason only for the latter. It is used to improve AI Coach, Prompt Packages, and Generation Tiers.
_Avoid_: Star rating, mandatory survey, support ticket

**First Generation Success**:
The pilot's primary success measure: an eligible creator completes their first Generation Job. It measures whether the LIFF entry, AI Coach, generation choice, consent, and asynchronous result flow work as one understandable journey.
_Avoid_: Coin revenue, app open, prompt view

**Generation Source Mode**:
The input a creator supplies to start a Generation Job. The customer pilot supports Text-to-Video and Image-to-Video; Video-to-Video is outside the first release scope.
_Avoid_: Input type, media setting

**LIFF Image Input**:
A single Image-to-Video source image selected from the creator's mobile album or captured with their camera inside LINE MINI App. The app validates and crops it before generation; multi-image and start/end-frame controls belong to desktop Video Studio.
_Avoid_: Multi-reference upload, advanced media workflow

**Publishing Target**:
The creator-facing destination selected in LINE MINI App: Reels/TikTok, Facebook Post, or YouTube/Large Screen. AI Coach maps it to the required aspect ratio and a suitable duration rather than asking beginners for technical settings.
_Avoid_: Aspect-ratio selector, duration parameter

**Audio Choice**:
The simple `มีเสียง` or `ไม่มีเสียง` decision made before a Generation Job. AI Coach asks about dialogue only after the creator chooses audio, allowing silent clips for creators who will add sound elsewhere.
_Avoid_: Generate-audio parameter, required soundtrack

**Dialogue Preview**:
A short Thai line drafted by AI Coach for a creator who chose dialogue. The creator can accept it or edit it before generation; the platform compiles the final provider prompt without exposing prompt syntax.
_Avoid_: Hidden dialogue, raw provider prompt, forced script
