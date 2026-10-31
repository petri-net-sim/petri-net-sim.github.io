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
npm run translate
```

For sibling development checkouts, run `npm run sync -- --local`. Update `sources.json` when a project changes repository location. Source repositories stay in their current owners' accounts.

## Publication

GitHub Pages source must be **GitHub Actions**. `.github/workflows/pages.yml` checks every pull request and publishes from `main`, on manual runs, and every six hours to pick up upstream releases and documentation updates. GitHub can delay scheduled runs. The first-party Pages deployment uses the repository's built-in token, with no personal access token required.

Builds import guides from release tags, resolve download assets through GitHub Releases, export both applications' OpenAPI schemas, generate Java API reference documentation, build the site and verify internal links. Broken references stop publication, preserving the previous deployment. Application docs correspond to published releases; shared modeling materials follow their default branch. Each imported page records its exact source commit.

## Automatic Ukrainian translation

Add the following under repository Settings > Secrets and variables > Actions:

- Secret `TRANSLATION_API_KEY`: your chosen provider key.
- Variable `TRANSLATION_API_URL`: the full HTTPS Chat Completions endpoint of an OpenAI-compatible provider.
- Variable `TRANSLATION_MODEL`: the provider's model identifier.

Then run the publication workflow. Translation sends only public documentation to that provider. Provider usage may be billed to its account. Translations are cached by source hash, language, prompt version and model. Only changed pages are translated, with a default cap of 40 new pages per run. Code blocks, inline code and link destinations must remain unchanged or the page falls back to its English original. Machine translations are labeled. Without provider settings, publication still succeeds with a clear English fallback notice in Ukrainian navigation.

Portal introduction pages in `src/content/docs/uk` and the Ukrainian home page are maintained as site content. Automatic translation only writes the imported `desktop`, `web` and `modeling` subtrees.

## Reference generation

The CI environment provides Java 23, Maven, Python 3.13 and uv. Run `python scripts/references.py` after synchronizing sources to generate the OpenAPI contracts and Javadoc. The script exports FastAPI's schema without starting its lifecycle or connecting to a database. The Java server is started on loopback only to retrieve its schema and is stopped afterward.

```sh
npm test
npm run build
npm run verify
```

Edit application documentation in its source repository. Edit theory, tutorials, navigation and home page content here. Generated imports retain source attribution and their original license. See `public/licenses/` and the linked source files. This repository does not grant new rights to upstream code, images or documentation.
