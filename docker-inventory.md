# Docker Container Inventory

*Last updated: 2026-09-14 (fresh install after engine rebuild)*
*Maintained by: Wren (COO) — updated whenever containers are added/removed*

---

## Current Containers

None — Docker Desktop was reinstalled fresh on 2026-09-14 after engine corruption.

---

## Previous Containers (LOST — need restoration)

*These containers existed before the Docker engine failure on 2026-09-14. VM disk was wiped during repair. Need Chris to confirm what was running so we can restore.*

- [ ] TODO: Chris to confirm what containers/images were running
- [ ] TODO: Rebuild from docker-compose files once identified

---

## Inventory Format

When containers are running, this file should contain:

| Name | Image | Purpose | Ports | Volumes | docker-compose location | Backup status |
|------|-------|---------|-------|---------|------------------------|---------------|

---

## Update Protocol

1. **After any container create/remove:** Wren updates this file
2. **Weekly (during heartbeat or dream job):** Wren runs `docker ps -a` and reconciles against this file
3. **Before any Docker maintenance:** Wren exports `docker inspect` output for all containers to `/Volumes/Extreme Pro/Documents/coo/docker-backups/`

---

*This file is the source of truth for what Docker containers exist — independent of the Docker engine.*