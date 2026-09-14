#!/bin/bash
# docker-backup.sh — Weekly Docker container/volume backup
# Run via cron or heartbeat

BACKUP_DIR="${HOME}/.openclaw/workspace/coo/docker-backups"
DATE=$(date +%Y-%m-%d)
mkdir -p "$BACKUP_DIR/$DATE/volumes"

# Export container configs
docker ps -a --format "{{.Names}}" 2>/dev/null | while read name; do
  docker inspect "$name" > "$BACKUP_DIR/$DATE/${name}.json" 2>/dev/null
done

# Export all named volumes
docker volume ls -q 2>/dev/null | while read vol; do
  docker run --rm -v "${vol}:/data" -v "${BACKUP_DIR}/${DATE}/volumes:/backup" alpine \
    tar czf "/backup/${vol}.tar.gz" /data 2>/dev/null
done

# Save image list
docker images --format "{{.Repository}}:{{.Tag}}" > "$BACKUP_DIR/$DATE/images.txt" 2>/dev/null

# Save full ps output
docker ps -a > "$BACKUP_DIR/$DATE/containers.txt" 2>/dev/null

echo "Docker backup completed: $BACKUP_DIR/$DATE"
