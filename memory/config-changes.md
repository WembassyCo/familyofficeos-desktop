# Config Changes Log

## 2026-09-02 — Cron Model Reassignment (kimi-k2.6:cloud → qwen3.5:4B)

- **Agent:** Wren (COO)
- **Change:** Reassigned `payload.model` for 3 cron jobs from `ollama/kimi-k2.6:cloud` to `ollama/qwen3.5:4B`
- **Jobs affected:** FOX Events Daily Research, CMO Heartbeat, CTO Heartbeat
- **Reason:** `kimi-k2.6:cloud` not allowed in config — caused 197+ consecutive errors on CTO Heartbeat, 24 on CMO Heartbeat, 8 on FOX Events
- **Approved by:** Spock (CTO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `~/.openclaw/cron/jobs_backup_pre_2026-09-02-model-fix.json`
- **Proposal file:** `proposed-config-changes/coo-2026-09-02-cron-model-fix.json`