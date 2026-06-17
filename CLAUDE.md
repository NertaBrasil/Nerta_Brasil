# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nerta Brasil — Belgian premium automotive chemistry brand, distributed by Provisão. The stack is Next.js (inferred from `.gitignore`).

## Branching Strategy (Gitflow)

Use `/gitflow` for guided branch management. The flow is:

```
main          ← production (only release/* and hotfix/*)
  └── develop ← integration (feature/*, fix/*, chore/*, docs/*, refactor/*, test/*)
        └── release/x.y.z ← staging → merges into main
```

**Branch naming:** `prefix/short-description-in-kebab-case`

| Prefix | Target |
|--------|--------|
| `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/` | `develop` |
| `release/` | `main` |
| `hotfix/` | `main` |

CI validates both the branch name pattern and PR target — violations fail the workflow.

## Pull Requests

Use the PR template (`.github/pull_request_template.md`). Key rules enforced by CI:
- `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*`, `test/*` → `develop`
- `release/*`, `hotfix/*` → `main`
- `develop` → `release/*` (to open a release candidate)

## Design System

O design system da Nerta Brasil está em `.claude/skills/nerta-design/`. Para qualquer trabalho de UI, leia o `SKILL.md` dessa pasta primeiro.

## Arquitetura de Código

As convenções de arquitetura (camadas `app/`, `features/`, `shared/`, `infrastructure/`, separação `queries.ts`/`actions.ts`, dono único de tipos, auth em duas camadas) estão em `.claude/skills/Nerta Brasil Code Architecture/SKILL.md`. Leia antes de criar qualquer arquivo novo em `src/`.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/001-vitrine-catalogo/plan.md`.
<!-- SPECKIT END -->
