# Portal maintenance

- English is the default language; Ukrainian is supported.
- Write plain prose. Do not introduce en/em dashes, generic marketing claims or template filler.
- PetriObjModelPaint is the primary application. Petri Net Sim is its web companion with LLM-assisted generation.
- Change source repository addresses only in `sources.json` and update editorial links when ownership changes.
- Imported application docs belong in their source projects. `scripts/sync.mjs` regenerates their portal copies.
- Translate only imported subtrees. Preserve code and link destinations. Never store API keys in files or logs.
- Keep downloads grounded in actual published assets and preserve independently versioned Java modules.
- Run `npm test`, `npm run build` and `npm run verify` after relevant changes. Reference outputs require `python scripts/references.py` first.
- Do not transfer source repositories as part of portal work.
