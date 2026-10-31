# Petri Net Simulation Portal

English and Ukrainian portal for PetriObjModelPaint, Petri Net Sim and their shared modeling resources.

Production: https://petri-net-sim.github.io/

## Local development

Requires Node.js 24. The site uses Astro and Starlight.

```sh
npm ci
npm run dev
```

The repository includes a documentation snapshot. To refresh it from published application releases and the current shared modeling resources:

```sh
npm run sync
npm run locales
```

For sibling development checkouts, run `npm run sync -- --local`. Update `sources.json` when a project changes repository location. Source repositories stay in their current owners' accounts.

## Publication

GitHub Pages source must be **GitHub Actions**. `.github/workflows/pages.yml` checks every pull request and publishes from `main`, on manual runs, and every six hours to pick up upstream releases and documentation updates. GitHub can delay scheduled runs. The first-party Pages deployment uses the repository's built-in token, with no personal access token required.

Builds import guides from release tags, resolve download assets through GitHub Releases, export both applications' OpenAPI schemas, generate Java API reference documentation, build the site and verify internal links. Broken references stop publication, preserving the previous deployment. Application docs correspond to published releases; shared modeling materials follow their default branch. Each imported page records its exact source commit.

## English and Ukrainian authoring

Agents write and update both languages in the same change. No translation provider, API key or external LLM call is required by the publication workflow.

Portal pages are paired between `src/content/docs/` and `src/content/docs/uk/`. Home page text is paired in `src/components/Home.astro`. Application guides retain their upstream English source; Ukrainian versions are authored at the matching relative path under `src/content/docs/uk/`.

`npm run locales` preserves authored translations. Pages without a Ukrainian translation show the English original with an explicit notice. Remove that notice when replacing a fallback with a real translation. Keep code, commands and API identifiers unchanged and localize internal documentation links to `/uk/`.

After reviewing a translated guide, record its source version, for example `npm run locales -- --record desktop/docs/desktop-ui`. This stores `translationSourceHash` in its frontmatter. Future changes to the English source are listed in `.cache/localization-report.json` and the CI log for agent review. They never overwrite authored Ukrainian text. `AGENTS.md` documents the editing workflow.

## Reference generation

The CI environment provides Java 23, Maven, Python 3.13 and uv. Run `python scripts/references.py` after synchronizing sources to generate the OpenAPI contracts and Javadoc. The script exports FastAPI's schema without starting its lifecycle or connecting to a database. The Java server is started on loopback only to retrieve its schema and is stopped afterward.

```sh
npm test
npm run build
npm run verify
```

Edit application documentation in its source repository. Edit theory, tutorials, navigation and home page content here. Generated imports retain source attribution and their original license. See `public/licenses/` and the linked source files. This repository does not grant new rights to upstream code, images or documentation.
