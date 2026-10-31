# Portal maintenance

- English is the default language; Ukrainian is supported. Write or update both language versions in the same change. Agents author the translations; CI must not call an LLM provider.
- Write plain prose. Do not introduce en/em dashes, generic marketing claims or template filler.
- PetriObjModelPaint is the primary application. Petri Net Sim is its web companion with LLM-assisted generation.
- Change source repository addresses only in `sources.json` and update editorial links when ownership changes.
- Imported application docs belong in their source projects. `scripts/sync.mjs` regenerates their portal copies.
- Portal pages are paired between `src/content/docs/` and `src/content/docs/uk/`. Home page copy is paired in `src/components/Home.astro`.
- For imported guides, edit the English document in its source project and the Ukrainian page at the same relative path under `src/content/docs/uk/`. Remove the English fallback notice when supplying an actual translation. Keep commands and API identifiers unchanged; use `/uk/` destinations for translated internal links.
- Run `npm run locales -- --record desktop/docs/desktop-ui` (with the relevant page path and no `.md` suffix) after reviewing a Ukrainian guide against its imported English source. This records `translationSourceHash`. Subsequent source changes are reported for review without overwriting the translation.
- `npm run locales` preserves authored Ukrainian pages and refreshes only explicit English fallbacks. Review `.cache/localization-report.json` for missing translations and source changes. Do not describe English fallback pages as translated.
- Keep downloads grounded in actual published assets and preserve independently versioned Java modules.
- Run `npm test`, `npm run build` and `npm run verify` after relevant changes. Reference outputs require `python scripts/references.py` first.
- Do not transfer source repositories as part of portal work.
