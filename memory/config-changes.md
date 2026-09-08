# Config Changes Log

## 2026-09-02 — Cron Model Reassignment (kimi-k2.6:cloud → qwen3.5:4B)

- **Agent:** Wren (COO)
- **Change:** Reassigned `payload.model` for 3 cron jobs from `ollama/kimi-k2.6:cloud` to `ollama/qwen3.5:4B`
- **Jobs affected:** FOX Events Daily Research, CMO Heartbeat, CTO Heartbeat
- **Reason:** `kimi-k2.6:cloud` not allowed in config — caused 197+ consecutive errors on CTO Heartbeat, 24 on CMO Heartbeat, 8 on FOX Events
- **Approved by:** Spock (CTO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `~/.openclaw/cron/jobs_backup_pre_2026-09-02-model-fix.json`
- **Proposal file:** `proposed-config-changes/coo-2026-09-02-cron-model-fix.json`
## 2026-09-06 — CTO: Fix model image input flags + add kimi-k2.6:cloud

**Agent:** CTO (Spock)
**What changed:** 
1. `models.providers.ollama.models[1].input` for `glm-5.2:cloud`: `["text", "image"]` → `["text"]` (model doesn't support images, was causing 400 errors)
2. Added `kimi-k2.6:cloud` to `models.providers.ollama.models` with `input: ["text", "image"]` (model DOES support images, tested with Ollama API)
**Who approved:** COO (Wren) + CMO (Mason)
**Backup:** `openclaw_backup_pre_image-input-fix.json`
**Reason:** VisionClaw app snapshots were failing because agent called `image` tool, image content entered conversation history, and `glm-5.2:cloud` rejected it. Fix: mark glm-5.2:cloud as text-only so OpenClaw strips image content.
