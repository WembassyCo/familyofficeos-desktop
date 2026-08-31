# Config Changes Log

All changes to openclaw.json must be documented here.

## 2026-08-23 — Add qwen3.6 to switchable models, remove mistral:7b

- **Proposed by:** coo (Wren)
- **Approved by:** cto ✅, drstone ✅
- **Backup:** `openclaw_backup_pre_qwen-mistral.json`
- **Changes:**
  1. `agents.defaults.model.fallbacks`: `["ollama/mistral:7b"]` → `["ollama/qwen3.6"]`
  2. `agents.defaults.models`: added catalog with 3 models + aliases (glm52, qwen, kimi)
  3. `models.providers.ollama.models`: removed `mistral:7b` entry (not installed in Ollama)
- **Why:** qwen3.6 was installed but not showing in /models picker. mistral:7b was configured as fallback but not installed — broken.

## 2026-08-30 — CRO Heartbeat Model Override
**Agent:** cro (Grayson)
**Change:** Added `"model": "ollama/qwen3.5:4B"` to CRO agent heartbeat config
**Purpose:** Route routine heartbeat monitoring to free local model instead of paid cloud model
**Approved by:** cto (Spock) — technical review, cmo (Mason) — second reviewer (COO session inactive)
**Backup:** `openclaw_backup_pre_heartbeat_model_override.json`
**Validation:** JSON valid, openclaw doctor passed

## 2026-08-30 — CMO Heartbeat Model Override
**Agent:** cmo (Mason)
**Change:** Added `"model": "ollama/qwen3.5:4B"` to CMO agent heartbeat config
**Purpose:** Route routine heartbeat monitoring (48x/day) to free local model instead of paid cloud model
**Approved by:** cro (Grayson) ✅, coo (Wren) ✅
**Backup:** `openclaw_backup_pre_cmo_heartbeat_model.json`
**Validation:** JSON valid, openclaw doctor passed
**HEARTBEAT.md:** Rewritten with explicit if/then decision trees optimized for qwen3.5:4B capability level
