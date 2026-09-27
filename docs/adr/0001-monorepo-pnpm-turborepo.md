# 0001 — Monorepo with pnpm + Turborepo; Gradle for mobile

Status: Accepted

## Context

The API, the web app and the mobile apps change together (a new endpoint usually touches all of
them). Separate repositories would make those changes span several pull requests.

## Decision

- One repository.
- TypeScript projects (`apps/api`, `apps/web`, `packages/*`) are **pnpm workspaces**, orchestrated by
  **Turborepo** (`turbo.json`), which runs `build/lint/test` in dependency order and caches results.
- The Kotlin project (`mobile/`) is a normal **Gradle** build, not part of the pnpm workspace.
  Mobile developers open `mobile/` in Android Studio / Fleet; nothing in it depends on Node.

## Consequences

- One `pnpm install` at the root sets up all TypeScript projects.
- Shared TypeScript code (`packages/contracts`) is used without publishing to npm.
- Kotlin can't import TypeScript contracts, so they are mirrored by hand (see
  [api/contracts.md](../api/contracts.md)). Code generation from OpenAPI can replace this later
  if drift becomes a problem.
