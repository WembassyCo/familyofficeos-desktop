# Docker Backup Strategy

*Created: 2026-09-14 — after Docker VM data loss incident*
*Owner: Wren (COO) + Spock (CTO)*

---

## What Happened

On 2026-09-14, Docker Desktop's VM engine became corrupted and wouldn't start. During troubleshooting, the Docker VM disk was deleted to force a clean rebuild. This destroyed all containers, images, and volumes. No backup existed and no inventory was maintained outside Docker itself.

**This must never happen again.**

---

## Policy

### Destructive Actions (ALL agents)

**Before ANY destructive action — defined as anything that deletes, overwrites, resets, or destroys data, configurations, containers, VMs, or files — the following steps are MANDATORY:**

1. **STOP** — Do not execute the destructive action
2. **ASSESS** — Identify exactly what data/state will be lost
3. **BACKUP** — Create a backup of the data/state if possible
4. **NOTIFY** — Tell Chris (or the requesting human) exactly what will be lost and what the consequences are
5. **CONFIRM** — Wait for explicit confirmation: "yes, do it" or equivalent
6. **EXECUTE** — Only then perform the action
7. **DOCUMENT** — Log what was done, what was lost, and why in `memory/YYYY-MM-DD.md`

**No exceptions. Even if Chris said "fix it" or "just do it" — you must still confirm what will be lost before destroying it.**

**Examples of destructive actions:**
- Deleting Docker VM data, images, containers, volumes
- `rm -rf` on any non-temporary directory
- Database drops or truncations
- Factory resets of any software
- Overwriting config files without backup
- Deleting git branches with uncommitted work
- `docker system prune -a` or `docker volume rm`
- Reformatting drives
- Uninstalling software that stores local data

**Examples that do NOT require this protocol:**
- Creating new files or containers
- Editing text files (git tracks changes)
- Pulling new images
- Starting/stopping containers (non-destructive)
- Killing non-critical processes

---

### Docker-Specific Backup Strategy

#### 1. Container Inventory (External List)
- **File:** `~/.openclaw/workspace/coo/docker-inventory.md`
- **Content:** Name, image, purpose, ports, volumes, compose file location for every container
- **Updated:** Every time a container is created or removed
- **Reconciled:** Weekly via `docker ps -a` comparison

#### 2. Container Configuration Export
- **Location:** `~/.openclaw/workspace/coo/docker-backups/` (move to `/Volumes/Extreme Pro/Documents/coo/docker-backups/` when external drive is mounted)
- **Content:** `docker inspect <container>` output for each container (names, volumes, env vars, networks, ports)
- **Frequency:** Weekly (via cron or heartbeat task)
- **Script:** `~/.openclaw/workspace/coo/scripts/docker-backup.sh`

#### 3. Volume Data Backup
- **Location:** `/Volumes/Extreme Pro/Documents/coo/docker-backups/volumes/`
- **Content:** Tar archives of named Docker volumes
- **Frequency:** Weekly (or daily for critical data)
- **Method:** `docker run --rm -v <volume>:/data -v <backup-dir>:/backup alpine tar czf /backup/<volume>-$(date +%Y%m%d).tar.gz /data`

#### 4. Pre-Maintenance Checkpoint
Before ANY Docker maintenance, repair, or upgrade:
1. Run `docker ps -a` and save output to backup directory
2. Run `docker inspect` for each container and save
3. Export volume data for all named volumes
4. Confirm with Chris that backups are complete before proceeding

---

### Backup Script

```bash
#!/bin/bash
# docker-backup.sh — Weekly Docker container/volume backup
# Run via cron or heartbeat

BACKUP_DIR="/Volumes/Extreme Pro/Documents/coo/docker-backups"
DATE=$(date +%Y-%m-%d)
mkdir -p "$BACKUP_DIR/$DATE"

# Export container configs
docker ps -a --format "{{.Names}}" | while read name; do
  docker inspect "$name" > "$BACKUP_DIR/$DATE/${name}.json"
done

# Export all named volumes
docker volume ls -q | while read vol; do
  docker run --rm -v "${vol}:/data" -v "${BACKUP_DIR}/${DATE}/volumes:/backup" alpine \
    tar czf "/backup/${vol}.tar.gz" /data 2>/dev/null
done

# Save image list
docker images --format "{{.Repository}}:{{.Tag}}" > "$BACKUP_DIR/$DATE/images.txt"

# Save full ps output
docker ps -a > "$BACKUP_DIR/$DATE/containers.txt"

echo "Docker backup completed: $BACKUP_DIR/$DATE"
```

---

### Restoration Process

If Docker needs to be rebuilt:
1. Install Docker Desktop fresh
2. Review `docker-inventory.md` for list of expected containers
3. Review latest backup in `/Volumes/Extreme Pro/Documents/coo/docker-backups/`
4. Pull required images from `images.txt`
5. Recreate containers from saved `docker inspect` JSON or docker-compose files
6. Restore volumes from tar archives
7. Verify all containers are running
8. Update `docker-inventory.md`

---

*This strategy exists because we lost all Docker data on 2026-09-14 by deleting a corrupted VM disk without backing up first. Never again.*