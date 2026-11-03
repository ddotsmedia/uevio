# ADR-002: Turborepo + pnpm Workspaces Monorepo

**Date:** 2026-11-03  
**Status:** Accepted  

## Decision

All UEVIO applications (3x Next.js, NestJS API, BullMQ worker) and shared packages live in a single monorepo managed by pnpm workspaces and Turborepo.

## Rationale

- Shared packages (`@uevio/database`, `@uevio/shared`, `@uevio/permissions`) are imported across all apps with no duplication
- Turborepo's remote caching drastically reduces CI build times
- A single `git push` triggers coordinated builds and deployments
- TypeScript types are always consistent across the stack

## Structure

```
apps/
  api/         NestJS REST API
  worker/      BullMQ workers
  web/         Next.js public site
  business/    Next.js business portal
  admin/       Next.js admin
packages/
  database/    Prisma schema + client
  shared/      Types, utils, constants
  config/      Env validation
  i18n/        Translations EN/AR
  permissions/ RBAC definitions
  validation/  Zod schemas
  ui/          shadcn/ui components
  auth/        NextAuth config
```
