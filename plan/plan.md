# Pomi — Three Visual Directions (Concept Showcase)

A showcase web app with three different premium design directions for Pomi, a period tracking app. Each direction has its own phone mockups you can tap through, plus a written design rationale.

## Who it's for
- The Pomi founder or product team choosing a visual direction for the real app.
- Designers, stakeholders or investors reviewing the concepts side by side.

## Core features and experience
- **Showcase landing page**: introduces the three directions with a short concept name, mood line and palette swatches for each, and lets you open any of them.
- **Three directions**, each with its own wordmark, palette, typography, components and copy tone:
  1. **Warm editorial wellness** ("Almanac"): magazine-style layouts, a refined serif paired with a quiet sans, warm cream paper tones, pomegranate ink accents, generous margins, written-style cycle notes.
  2. **Clinical-luxury balance** ("Ledger"): precise grid, calm data clarity, a crisp sans with tabular numbers, soft off-white with deep berry and graphite, thin rules, visible privacy and accuracy cues.
  3. **Soft modern feminine utility** ("Bloom Kit"): rounded but grown-up shapes, a contemporary geometric sans, dusty rose and muted clay tints, tactile chip controls, fast one-handed logging.
- **Six screens per direction**, shown in a realistic phone frame:
  - Welcome / onboarding (2–3 steps: intro, last period date, cycle length)
  - Home / dashboard (current cycle day, phase, next period estimate, one gentle daily note)
  - Cycle overview (that direction's own month calendar or cycle ring with period, fertile window and predicted days)
  - Symptom logging (flow, mood, symptoms, energy, notes)
  - Monthly insights (cycle length trend, common symptoms, plain-language takeaways with honest "estimate" wording)
  - Settings and privacy (data ownership, reminders, export and delete options, shown as concept controls)
- **Working symptom logging**: entries made in any direction are saved on this device and are still there after refreshing. Logged days appear on that direction's calendar and home screen. Each direction keeps its own log. There is a "reset sample data" option.
- **Design rationale panel** next to each phone, covering: concept name, visual mood, colour palette (with hex codes), typography, button/card/input styles, how each screen is approached, why it feels premium and trustworthy, and what sets it apart from childish or generic trackers.
- **Compare view**: the same screen (e.g. Home) from all three directions side by side.

## User flow
1. Open the showcase and read the three direction cards.
2. Open a direction. The phone mockup starts on its welcome screen, with the rationale alongside.
3. Tap through onboarding into the home screen, then use the in-phone tab bar to reach cycle, log, insights and settings.
4. Log symptoms for a day, then see that day marked on the cycle view and reflected on home.
5. Switch to another direction or open Compare to see the same screen across all three.

## UI/UX feel
- Showcase frame: a quiet, gallery-like cream setting that doesn't compete with the concepts.
- In the concepts: warm cream / off-white backgrounds, muted pomegranate, dusty rose and soft berry accents, lots of whitespace, a clear type hierarchy, soft minimalism.
- No cartoons, mascots, emoji, bright pink, startup gradients or sterile medical styling. Any imagery is abstract and restrained (a subtle pomegranate motif, texture or line work), never illustrated characters.
- Copy is calm, honest and non-judgemental. Predictions are labelled as estimates.
- Subtle motion: soft screen transitions, gentle press feedback, a staggered reveal on the showcase landing page.
- On phones, the mockup fills the screen and the rationale moves below it.

## Implementation phases
- **Phase 1 (MVP, built now)**: showcase landing page, all three directions with six tappable screens each, symptom logging saved on this device, rationale panels, compare view.
- **Phase 2**: export each direction as presentation-ready screen images or a PDF board, plus dark-mode variants for each direction.
- **Phase 3**: refine the chosen direction into a fuller design system (component sheet, states, accessibility checks) ready for the production app.

## Assumptions
- This is a concept showcase only. It does not change or connect to the existing production app.
- No sign-in. Logged entries are saved in the browser on the current device and are not shared between devices or people.
- All cycle data shown is sample data. Predictions use a simple average and are not medical advice.
- The Pomi wordmark and palettes are created from scratch for each direction. Concept names ("Almanac", "Ledger", "Bloom Kit") are placeholders and can be changed.
- Settings and privacy controls are illustrative: export, delete and reminders show the intended UX but do not send or export anything real.
- English only. Images are abstract or textural, not photos of people.
