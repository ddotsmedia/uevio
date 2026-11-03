# UEVIO Platform — Claude Code Instructions

## Project Overview
UAE-wide business directory + marketplace. Monorepo: pnpm workspaces + Turborepo.

## CRITICAL RULES — READ FIRST

### 🚫 NEVER DO
- **NO OpenSearch** — search is PostgreSQL full-text + pg_trgm + PostGIS ONLY
- **NO manual VPS commands** — ALL deployments via GitHub Actions ONLY
- **NO `pm2 kill`** — FORBIDDEN. Use `pm2 restart [name]` / `pm2 stop [name]` only
- **NO destructive commands** without 6-step verification: `rm -rf`, `git reset --hard`, `git push --force`, `docker system prune`
- **NO Opus model** — Haiku for features, Sonnet for architecture/infra only
- **NO breaking changes** to Prisma schema without a migration

### ✅ ALWAYS DO
- Read this file + AGENTS.md before ANY code change
- Use `@uevio/*` package imports — never relative paths across apps
- Run `pnpm db:generate` after any schema change
- Keep Arabic and English content fields separate (nameEn/nameAr pattern)
- Apply Arabic normalisation via `buildSearchTerms()` before saving to `search_terms`
- Use GitHub Actions for all CI/CD — never SSH manually

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| API | NestJS + TypeScript |
| Workers | BullMQ |
| Database | PostgreSQL 16 + PostGIS + pg_trgm |
| Cache/Queue | Redis 7 |
| Auth | NextAuth v5 |
| ORM | Prisma 5 |
| Monorepo | pnpm workspaces + Turborepo |
| Containers | Docker Compose |
| Reverse proxy | Caddy (auto HTTPS) |
| CDN/WAF | Cloudflare |
| Object storage | Cloudflare R2 |
| CI/CD | GitHub Actions |

## Apps

| App | Port | Purpose |
|-----|------|---------|
| `apps/api` | 3001 | NestJS REST API |
| `apps/web` | 3002 | Public site + customer |
| `apps/business` | 3003 | Business owner portal |
| `apps/admin` | 3004 | Admin panel |
| `apps/worker` | — | BullMQ workers |

## Packages

- `@uevio/database` — Prisma client + schema
- `@uevio/shared` — Types, utils, Arabic normalisation
- `@uevio/config` — Env validation (Zod)
- `@uevio/i18n` — EN/AR translations
- `@uevio/permissions` — RBAC definitions
- `@uevio/validation` — Zod schemas
- `@uevio/ui` — shadcn/ui components
- `@uevio/auth` — NextAuth config

## Search Architecture

PostgreSQL only — NO OpenSearch. See ADR-001.

```sql
-- Full-text (English)
GIN index on to_tsvector('english', name_en || ' ' || description_en)

-- Fuzzy/partial
GIN index on name_en gin_trgm_ops

-- Arabic (pre-normalised at application layer)
GIN index on to_tsvector('simple', search_terms)

-- Geo
GIST index on coordinates (PostGIS)
```

Arabic pipeline: `stripDiacritics → normaliseAlef → normaliseYa → normaliseHa`  
See `packages/shared/src/utils/arabic.ts`

## i18n

- Default locale: English (`/en/...`)
- Arabic (`/ar/...`) — full RTL layout
- All content fields: `nameEn`/`nameAr`, `descriptionEn`/`descriptionAr` pattern
- Translations in `packages/i18n/src/`

## RBAC Roles

CUSTOMER, BUSINESS_OWNER, BUSINESS_ADMIN, BRANCH_MANAGER, BUSINESS_STAFF,  
SUPER_ADMIN, PLATFORM_ADMIN, BUSINESS_MODERATOR, VERIFICATION_OFFICER,  
CONTENT_MANAGER, SEO_MANAGER, FINANCE_ADMIN, SUPPORT_AGENT, ADVERTISING_MANAGER, ANALYST

See `packages/permissions/src/index.ts`

## Development

```bash
# Start infrastructure (DB + Redis)
docker compose up -d

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate:dev

# Seed database
pnpm db:seed

# Start all apps
pnpm dev
```

## Deployment

```bash
# Staging: push to develop branch
git push origin develop
# → GitHub Actions builds images, deploys to staging VPS

# Production: create a version tag
git tag v1.0.0 && git push origin v1.0.0
# → GitHub Actions deploys to production VPS
```

**NEVER** run docker/ssh/pm2 commands manually in chat or terminal.

## Model Usage

- **Haiku**: All feature work, bug fixes, CRUD, UI components
- **Sonnet**: Architecture decisions, infra changes, complex debugging, Prisma schema design

## GitHub Secrets Required

```
VPS_HOST, VPS_USER, VPS_SSH_KEY          # Staging VPS
PROD_VPS_HOST, PROD_VPS_USER, PROD_VPS_SSH_KEY  # Production VPS
DATABASE_URL, REDIS_URL
NEXTAUTH_SECRET
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
SMTP_HOST, SMTP_USER, SMTP_PASS
API_SECRET_KEY
POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
REDIS_PASSWORD
```
