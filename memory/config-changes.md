# Config Changes Log

## 2026-09-02 — Cron Model Reassignment (kimi-k2.6:cloud → qwen3.5:4B)

- **Agent:** Wren (COO)
- **Change:** Reassigned `payload.model` for 3 cron jobs from `ollama/kimi-k2.6:cloud` to `ollama/qwen3.5:4B`
- **Jobs affected:** FOX Events Daily Research, CMO Heartbeat, CTO Heartbeat
- **Reason:** `kimi-k2.6:cloud` not allowed in config — caused 197+ consecutive errors on CTO Heartbeat, 24 on CMO Heartbeat, 8 on FOX Events
- **Approved by:** Spock (CTO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `~/.openclaw/cron/jobs_backup_pre_2026-09-02-model-fix.json`
- **Proposal file:** `proposed-config-changes/coo-2026-09-02-cron-model-fix.json`
## 2026-09-10 — CMO: Add Family Office Exchange Discord guild

- **Agent:** Mason (CMO)
- **Change:** Added guild `1547624384649232404` with channel `1547624385446158499` to `channels.discord.accounts.cmo.guilds`
- **Reason:** Chris explicitly requested CMO to operate in the Family Office Exchange Discord server, channel 1547624385446158499, for all FOE-related work
- **Approved by:** Spock (CTO) — APPROVED, Wren (COO) — APPROVED
- **Backup:** `openclaw_backup_pre_cmo-fox-guild.json`
- **Proposal file:** `proposed-config-changes/cmo-2026-09-10-fox-discord-guild.json`

## 2026-09-07 — CTO: Add Family Office Exchange guild + authorized user

- **Agent:** Spock (CTO)
- **Change:** 
  1. Added guild `1547624384649232404` with channel `1547624385446158499` (allow: true) to `channels.discord.guilds`
  2. Added `user:1547626260111298604` to `channels.discord.allowFrom` (before the `*` wildcard)
- **Reason:** Requested by Cavemancrafting in the Family Office Exchange Discord #general channel. User needs explicit authorization for FOE-related work with the agents.
- **Approved by:** Wren (COO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `openclaw_backup_pre_fox_guild_allowlist.json`
- **Proposal file:** `proposed-config-changes/cto-2026-09-07-fox-guild-allowlist.json`

## 2026-09-10 — CTO: Add user 392523706674708485 to allowFrom

- **Agent:** Spock (CTO)
- **Change:** Added `user:392523706674708485` to `channels.discord.allowFrom` (before the `*` wildcard)
- **Reason:** Requested by Cavemancrafting in FOE #general — user needs CTO and CMO agent access
- **Approved by:** Wren (COO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `openclaw_backup_pre_add_user_392523706674708485.json`
- **Proposal file:** `proposed-config-changes/cto-2026-09-10-add-user-392523706674708485.json`

## 2026-09-06 — CTO: Fix model image input flags + add kimi-k2.6:cloud

**Agent:** CTO (Spock)
**What changed:** 
1. `models.providers.ollama.models[1].input` for `glm-5.2:cloud`: `["text", "image"]` → `["text"]` (model doesn't support images, was causing 400 errors)
2. Added `kimi-k2.6:cloud` to `models.providers.ollama.models` with `input: ["text", "image"]` (model DOES support images, tested with Ollama API)
**Who approved:** COO (Wren) + CMO (Mason)
**Backup:** `openclaw_backup_pre_image-input-fix.json`
**Reason:** VisionClaw app snapshots were failing because agent called `image` tool, image content entered conversation history, and `glm-5.2:cloud` rejected it. Fix: mark glm-5.2:cloud as text-only so OpenClaw strips image content.

## 2026-09-01 — CTO: Add cto to CRO subagents allowAgents

- **Agent:** Spock (CTO)
- **Change:** Added `"cto"` to `agents.list[id=cro].subagents.allowAgents`
- **Reason:** Chris (CEO) directly requested CTO be added as allowed sub-agent for CRO (Grayson) for cross-functional technical support (CRM integration, lead import tooling)
- **Approved by:** Wren (COO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `openclaw_backup_pre_add_cto_to_cro.json`
- **Proposal file:** `proposed-config-changes/cto-2026-09-01-add-cto-to-cro-allowagents.json`

## 2026-09-10 — CRO add COO as sub-agent
- **Agent:** cto (Spock)
- **Change:** Added "coo" to `agents.list[id=cro].subagents.allowAgents`
- **Approved by:** coo (Wren), cro (Grayson)
- **Backup:** `~/.openclaw/openclaw_backup_pre_cro_add_coo.json`
- **Rationale:** CRO needs COO access to spawn COO as sub-agent for cross-functional coordination

## 2026-09-10 — CRO: Add cmo to CRO subagents allowAgents

- **Agent:** Grayson (CRO) — requested by CRO, processed by CTO
- **Change:** Added `"cmo"` to `agents.list[id=cro].subagents.allowAgents`
- **Reason:** CRO needs to spawn CMO (Mason) as sub-agent for Facebook content generation and video content creation via Higgsfield
- **Approved by:** Wren (COO) — APPROVED, Mason (CMO) — APPROVED
- **Backup:** `openclaw_backup_pre_add_cmo_to_cro.json`
- **Proposal file:** `proposed-config-changes/cro-2026-09-10-add-cmo-to-cro-allowagents.json`
