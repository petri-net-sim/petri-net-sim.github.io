---
title: "Contributing to Petri Net Sim"
---

> Український переклад цієї сторінки ще не доступний. Нижче наведено англійський оригінал.


> Source: [sergiorbk/petri-net-sim](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/CONTRIBUTING.md). Release v1.4.0: `6559ad8`. [License](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/LICENSE).


Thanks for considering a contribution. See [AGENTS.md](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/AGENTS.md) for the
full layout, commands and house rules. This file covers the parts specific
to outside contributions.

## Before you start

- Bug or small fix: open a pull request directly.
- New feature or behavior change: open an issue first to discuss the
  approach before investing time in an implementation.

## License of contributions

This project is licensed under the [PolyForm Noncommercial License 1.0.0](https://github.com/sergiorbk/petri-net-sim/tree/6559ad86f3b2b6d433fc326f08daf7d862d3777c/LICENSE).
By submitting a pull request you agree that your contribution is licensed
under the same terms.

## Development setup

```bash
# Backend, from backend/
uv sync --extra dev
uv run pytest

# Frontend, from frontend/
npm ci
npm run typecheck
npm run test:run
```

`make dev` runs the whole stack with hot reload. See [AGENTS.md](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/AGENTS.md)
for the full command reference and the project layout.

A few conventions worth knowing before your first PR:

- Commits are conventional-commit prefixed (`feat(scope): ...`,
  `fix(scope): ...`), narrative in the body.
- Every user-facing string is a key in both
  `frontend/src/i18n/locales/en.json` and `uk.json`, never a literal in a
  component.
- Comments explain why, not what the code already says.

## Pull requests

This project is trunk-based: `main` is the only long-lived branch.

- Branch off `main`, keep it short-lived (days, not weeks).
- Open a pull request into `main`. CI must pass.
- Delete the branch once it merges.

## Reporting bugs

Open a [bug report issue](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/.github/ISSUE_TEMPLATE/bug_report.yml) with steps
to reproduce, expected vs. actual behavior, and which part of the stack is
affected. For security-relevant bugs, see [SECURITY.md](https://github.com/sergiorbk/petri-net-sim/blob/6559ad86f3b2b6d433fc326f08daf7d862d3777c/SECURITY.md) instead
of opening a public issue.
