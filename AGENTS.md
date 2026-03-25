
# Rapid Lightning — Farm-Store + Delivery App
**AGENTS.md — Agent Constitution & Collaboration Memory**

**Last updated**: March 24, 2026  
**AGENTS.md last updated at commit**: 94841637d829a39f3663329e907b3b7a7a26a6c0

## 1. PROJECT CONTEXT
Mobile-first Next.js 15 + React 19 + Tailwind v4 Oxide + shadcn/ui v4 ranch-to-table farm store with Google Maps delivery autocomplete, Supabase backend, and Stripe checkout.

## 2. STRICT AGENT RULES (Grok must obey every response)
- Follow **Strict GitHub Repo Access Protocol — v2** in EVERY repo-related response:
  1. Freshly fetch https://github.com/otiskin/rapidlightning/commits/main AND https://github.com/otiskin/rapidlightning/activity.
  2. Extract and state the exact latest SHA, title, timestamp, author.
  3. Always use commit-specific raw URLs only.
  4. Never rely on chat history or previous SHAs.
- Prefer **minimal, scoped changes only**. Never alter layout, styles, animations, `rl-*` classes, or delivery-fee display unless explicitly asked.
- When adding features, keep changes as small as possible and provide the **full file** when requested.
- Always preserve existing visual design and `rl-input` / `rl-btn-*` classes.
- Use imperative language in rules and code comments.
- Keep AGENTS.md itself under 300 lines and update it only after major features or sessions.

## 3. CODE & STYLE PREFERENCES
- Use existing CSS vars (`--gold`, `--bg`, `--text-muted`, `--font-display`, `--radius`, etc.).
- All new Supabase tables/columns must use snake_case.
- shadcn primitives only when explicitly requested.
- Keep checkout flow minimal and untouched except for requested fields.

## 4. WHAT IS WORKING
- shadcn/ui + Tailwind v4 fully loaded (`globals.css` import fixed).
- Google Maps autocomplete + real-time delivery fee/distance calculation in checkout.
- CartProvider, Stripe Checkout Session, and basic order flow stable.
- Phone number + SMS opt-in + “Save as account” fields live in checkout.
- Supabase `profiles` (upsert on email) + `orders` (insert with phone, sms_opt_in, etc.) now triggered on checkout.

## 5. RECENT SOLUTIONS
- Fixed missing globals.css import.
- Minimal checkout additions (phone, SMS opt-in, save-as-account).
- API now stores new fields in Stripe metadata + Supabase tables.

## 6. AREAS TO IMPROVE (next priorities)
- Success page does not yet display saved order/phone/SMS info.
- No customer-facing “My Account” view for saved profiles.
- Error/loading states in checkout could be polished (minimal).
- Optional: introduce shadcn primitives once layout is stable.

## 7. HOW TO UPDATE THIS FILE
After each major feature or session, ask Grok: “Update AGENTS.md with latest findings.”  
Grok will regenerate the full file following these standards.

We are now perfectly aligned, scoped, and efficient on the ranch-to-table farm store + delivery app.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->