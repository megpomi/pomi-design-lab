# Pomi — Visual Directions Concept Showcase

## Original problem statement
Create 3 distinct visual directions for a premium period tracking app called Pomi (warm editorial wellness; minimal trust-focused clinical-luxury; soft modern feminine utility). For each: concept name, mood, palette, typography, button/card/input style, welcome/onboarding, home, cycle overview, symptom logging, why premium/trustworthy, how it differs from childish trackers. Create previews if possible. Concept exploration only.

## Architecture
- Frontend-only React showcase (no backend use). Data in localStorage per direction (`pomi-concept:{almanac|ledger|bloom}`).
- `src/lib/pomi.js` cycle math, sample data, hooks (usePomi, useLogDraft, useOnboarding)
- `src/directions/{Almanac,Ledger,Bloom}.jsx` 6 screens each + specimen components
- `src/data/directions.js` rationale content; pages: Landing, DirectionPage, Compare

## Implemented (Nov 2026)
- Landing with 3 direction rows + live scaled previews; header nav
- Direction pages: tappable phone (welcome/onboarding 3 steps, home, cycle, log, insights, privacy settings), screen jumper, full rationale panel (palette hex, type specimens, component specimens, screen-by-screen notes, premium/trust, differentiation)
- Working logging persisted per direction; calendar markers; reset sample data
- Compare view (synced screen across 3 directions); mobile responsive
- Tested: iteration_1 97% pass; compare mobile overflow fixed; insights history now follows onboarding cycle length

## Backlog
- P1: Export boards (PNG/PDF) per direction; dark-mode variants
- P2: Full design system for chosen direction (component sheet, states, a11y audit)
