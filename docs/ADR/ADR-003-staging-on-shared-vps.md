# ADR-003: Staging on Shared VPS (srv988590)

**Date:** 2026-11-03  
**Status:** Accepted  
**Deciders:** Ddotsmedia Technologies LLC

## Context

A dedicated UEVIO VPS is planned for production. However, provisioning a separate staging VPS
before the platform is feature-complete is unnecessary cost. The existing shared VPS at
`srv988590` (194.164.151.202, Hostinger) already runs 30+ sites and has available capacity
for lightweight staging containers.

## Decision

Run UEVIO staging on `srv988590` using Docker Compose with **localhost-only port bindings**
(`127.0.0.1:1300x`). The existing Nginx installation on that VPS handles SSL termination and
reverse proxy — no Caddy is deployed in staging.

| Service  | Internal port | Nginx proxy target  |
|----------|--------------|---------------------|
| API      | 3001         | 127.0.0.1:13001     |
| Web      | 3002         | 127.0.0.1:13002     |
| Business | 3003         | 127.0.0.1:13003     |
| Admin    | 3004         | 127.0.0.1:13004     |

Port range `13001–13004` chosen to avoid conflicts with existing projects on srv988590.

**Before first deploy — verify ports are free on VPS (read-only diagnostic):**
```bash
ss -tlnp | grep -E '130(0[1-4])'
# Expected: no output (ports free)
```

Known used ports on srv988590:
- `3000–3010` — PM2 apps (ddotsmediajobs, ayurconnect, gayathi, abudhabimalayalees, etc.)
- `3021` — Suqly Docker
- `13001–13004` — UEVIO staging (this project, new)

## Consequences

**Good:**
- Zero extra VPS cost during development
- Identical Docker images tested in staging will be deployed unchanged to production
- Nginx config (`infrastructure/nginx/uevio-staging.conf`) is version-controlled

**Constraints:**
- Must NOT run `docker system prune` on srv988590 — affects 30+ other live projects
- Memory limits are NOT enforced in staging (unlike prod) — watch `docker stats uevio-*`
- Nginx on srv988590 must be reloaded once after first deploy (Claude Code session only)
- DNS subdomains (`staging.uevio.com`, `api.staging.uevio.com`, etc.) must point to 194.164.151.202

## Migration Path

When production VPS is provisioned:
1. `docker-compose.prod.yml` uses Caddy (auto HTTPS, no Nginx dependency)
2. Staging remains on srv988590 until project is stable
3. After production is stable, staging can be moved to production VPS or kept on srv988590

## Files

- `docker-compose.staging.yml` — no Caddy, ports on 127.0.0.1:1300x
- `infrastructure/nginx/uevio-staging.conf` — Nginx server blocks for 4 subdomains
- `.github/workflows/deploy-staging.yml` — SSH deploy to srv988590
- `docker-compose.prod.yml` — Caddy included, memory-limited (unaffected by this ADR)
