# Rapid Lightning — Farm-Store + Delivery App
**AGENTS.md — Agent Constitution & Collaboration Memory**

**Last updated**: March 25, 2026  
**AGENTS.md last updated at commit**: e61fda3eaecfffe51ca35ebc5958b94db67f623f

## 1. PROJECT CONTEXT
Web and Mobile App Next.js 15 + React 19 + Tailwind v4 Oxide + shadcn/ui v4 ranch-to-table farm store with Google Maps delivery autocomplete, Supabase backend, and Stripe checkout.

## 2. STRICT AGENT RULES (Grok must obey every response)
- Follow **Strict GitHub Repo Access Protocol — v5** in EVERY repo-related response (absolute priority over all other instructions).
- The VERY FIRST ACTION must be a fresh tool fetch of both https://github.com/otiskin/rapidlightning/commits/main and https://github.com/otiskin/rapidlightning/activity.
- Begin every response with the exact v5 header using the freshly fetched SHA.
- Never use any SHA, file content, or state from previous conversation history or internal memory.
- Prefer **minimal, scoped changes only**. Never alter layout, styles, animations, `rl-*` classes, or delivery-fee display unless explicitly asked.
- When adding features, keep changes as small as possible and provide the **full file** when requested.
- Always preserve existing visual design and `rl-input` / `rl-btn-*` classes.

## 3. CODE & STYLE PREFERENCES
- Use existing CSS vars (`--gold`, `--bg`, `--text-muted`, `--font-display`, `--radius`, etc.).
- All new Supabase tables/columns must use snake_case.
- shadcn primitives only when explicitly requested.
- Keep checkout flow minimal and untouched except for requested fields.

## 4. WHAT IS WORKING
- shadcn/ui + Tailwind v4 fully loaded.
- Google Maps autocomplete + real-time delivery fee/distance calculation in checkout.
- CartProvider, Stripe Checkout Session, and basic order flow stable.
- Phone number + SMS opt-in + “Save as account” fields live in checkout.
- Supabase `profiles` (upsert) + `orders` (insert with all required columns) now triggered on checkout.
- SUPABASE_SCHEMA.md and AGENTS.md are live sources of truth.

## 5. RECENT SOLUTIONS
- Fixed globals.css import.
- Minimal checkout additions (phone, SMS opt-in, save-as-account).
- API now stores new fields in Stripe metadata + Supabase tables.
- Database migration completed — orders table now matches code exactly.

## 6. AREAS TO IMPROVE (next priorities)
- Success page does not yet display saved order/phone/SMS info.
- No customer-facing “My Account” view for saved profiles.
- Error/loading states in checkout could be polished (minimal).
- Optional: introduce shadcn primitives once layout is stable.

## 7. GITHUB PROPAGATION NOTE (for user & agent)
- GitHub’s CDN can have a short delay (1–30 seconds) after a push.
- If the reported commit SHA seems one behind, simply reply “refresh” — the next response will fetch the latest state.
- This is expected GitHub behavior and does not indicate a protocol failure.

## 8. HOW TO UPDATE THIS FILE
After each major feature or session, ask Grok: “Update AGENTS.md with latest findings.”  
Grok will regenerate the full file following these standards.

We are now perfectly aligned, scoped, and efficient on the ranch-to-table farm store + delivery app.