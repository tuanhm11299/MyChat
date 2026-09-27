# 0002 — Backend: Clean Architecture + CQRS + vertical slices (NestJS)

Status: Accepted

## Context

A chat backend grows many small use cases (send message, edit, react, mark read, add participant…).
We want each one easy to find and change without breaking the others, and business rules
testable without a database.

## Decision

- **NestJS** (TypeScript) as the framework: DI container, modules, first-class WebSocket and CQRS
  support, and a large ecosystem.
- **Modules per business area** under `src/modules/`.
- **Clean Architecture** in each module: `domain/` (pure TS) ← `infrastructure/` and `features/`.
- **CQRS** with `@nestjs/cqrs`: commands change state through domain aggregates; queries read the
  database directly.
- **Vertical slices**: one folder per use case under `features/`, with a fixed set of files.
- Boundaries are enforced by ESLint `no-restricted-imports` rules.
- **Node.js 24 LTS**: NestJS 12 ships ES modules, which Jest can load only on Node ≥ 24.9.

## Consequences

- More files per feature than a classic "service + controller" layout, but each file is small and
  has one job. Finding code is predictable: use case name → folder.
- No generic base repositories/handlers: some repetition is accepted in exchange for code that
  reads top-to-bottom without jumping through abstractions.
- New contributors should read `src/modules/identity/` first; it's the reference.
