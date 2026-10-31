---
title: "Frontend"
---

> Український переклад цієї сторінки ще не доступний. Нижче наведено англійський оригінал.


> Source: [sergiorbk/petri-net-sim](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/frontend/README.md). Release v1.4.0: `6559ad8`. [License](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/LICENSE).


The UI: a chat that builds Petri nets, a canvas that edits them, and a
simulator that runs them in the browser.

**Stack:** React 18 · TypeScript · Vite 6 · React Flow · Zustand · Tailwind CSS 4

Prompts stream to the LangGraph agent and the net is drawn as it arrives.
Simulation runs client-side, so stepping through a model does not wait on the
network.

Normally you run this through the monorepo's Compose stack: see the
[root README](/uk/web/overview/). The rest of this file is for running it alone.

## Standalone development

Needs Node.js 20+ and the backend reachable on `http://localhost:6201`.

```bash
npm install
npm run dev           # Vite dev server on http://localhost:6203
npm run build         # type-check, then production build to dist/
npm run test          # Vitest, watching
npm run test:run      # Vitest, one pass
npm run typecheck     # tsc -b --noEmit
```

The dev server proxies `/api/*` to the backend; `VITE_PROXY_TARGET` points it
somewhere else. In production `dist/` is served by nginx (`nginx.conf`), which
also proxies `/api`, `/mcp` and the API docs to the backend container.

## Layout

| Path | What lives there |
|------|------------------|
| `src/apps/` | The routed apps: simulator, gallery, chat workbench |
| `src/shell/` | Activity bar and the frame around every app |
| `src/components/` | Chat, canvas, settings and shared UI |
| `src/stores/` | Zustand stores: editor, simulation, chat, auth, UI |
| `src/lib/` | PNML import and export, API clients, the simulation engine |
