# UEVIO — Agent Instructions

## Standard Prompt Header

Always start Claude Code sessions with:

```
UEVIO platform — uevio-platform repo.
RULES: minimal tokens, 100% automation, zero questions, use existing patterns.
No OpenSearch — search is PostgreSQL full-text + pg_trgm + PostGIS only.
Deployment: GitHub Actions only. Never manual VPS commands.
Read CLAUDE.md + AGENTS.md before any code change.
Model: Haiku for features/fixes. Sonnet for architecture/infra only.

TASK: [one specific task from the milestone backlog]
```

## Agent Decision Framework

### Before writing ANY code
1. Read CLAUDE.md
2. Read AGENTS.md
3. Check existing patterns in the relevant app/package
4. Use existing `@uevio/*` packages — don't reinvent utilities

### When adding a feature
1. Define Prisma schema change (if needed) + create migration
2. Add Zod validation schema to `@uevio/validation`
3. Implement NestJS API endpoint
4. Implement Next.js page/component
5. Add i18n strings to both `en.ts` and `ar.ts`
6. Write unit tests

### When fixing a bug
1. Reproduce the bug with a test
2. Fix the smallest amount of code necessary
3. Verify no regressions

## Prohibited Operations

| Operation | Reason |
|-----------|--------|
| OpenSearch / Elasticsearch | Memory constraint |
| Manual SSH / VPS commands | Risk of data loss |
| `docker system prune` | Kills 30+ other projects |
| `pm2 kill` | Kills all processes |
| `git push --force` on main | History rewrite |
| `git reset --hard` without verification | Data loss |
| Opus model | Cost |

## Task Milestone Reference

### M0 — Foundation (DONE when repo is scaffolded)
- [x] Monorepo structure
- [x] Docker Compose (dev + staging + prod)
- [x] GitHub Actions CI/CD
- [x] Prisma schema
- [x] Shared packages
- [x] ADR documents

### M1 — Core API
- [ ] NestJS app bootstrap
- [ ] Auth module (NextAuth + Prisma adapter)
- [ ] Business CRUD endpoints
- [ ] Category endpoints
- [ ] Search endpoints (PostgreSQL FTS)
- [ ] Media upload (R2)

### M2 — Public Web
- [ ] Next.js 15 app setup
- [ ] Home page
- [ ] Business listing page
- [ ] Business detail page
- [ ] Search results page
- [ ] Arabic RTL layout

### M3 — Business Portal
- [ ] Business dashboard
- [ ] Profile management
- [ ] Branch management
- [ ] Listings management
- [ ] Review management

### M4 — Admin Panel
- [ ] Business moderation
- [ ] User management
- [ ] Analytics dashboard
- [ ] Verification workflow

### M5 — Marketplace
- [ ] Listing creation
- [ ] Listing search
- [ ] Save/bookmark listings

### M6 — Production
- [ ] Performance optimisation
- [ ] SEO (sitemap, schema.org)
- [ ] Security audit
- [ ] Load testing

## File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- API modules: `feature.module.ts`, `feature.controller.ts`, `feature.service.ts`
- DTOs: `create-feature.dto.ts`, `update-feature.dto.ts`
- Tests: `feature.spec.ts`

## Arabic RTL Guidelines

- Direction attribute: `<html lang="ar" dir="rtl">`
- Use Tailwind `rtl:` variants for mirrored layouts
- Font: IBM Plex Arabic or Cairo for Arabic text
- Keep separate `nameAr`/`descriptionAr` fields — never auto-translate
- Apply `normaliseArabic()` before storing to `search_terms`
