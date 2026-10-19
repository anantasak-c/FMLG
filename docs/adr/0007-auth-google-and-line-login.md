# Primary Authentication via Google OAuth and LINE Login

## Context
Our target demographic is Thai mobile-first users. Traditional email verification workflows experience high drop-off rates in the Thai market.

## Decision
We configure Supabase Auth with Google OAuth, LINE Login, and Email/Password as our primary authentication methods.

## Rationale
- LINE is Thailand's dominant messaging and mobile ecosystem platform, allowing 1-tap sign-in from social media and mobile browsers.
- Google OAuth provides universal friction-free login across desktop and Android devices.
