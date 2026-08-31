# HEARTBEAT.md — COO Agent Execution Instructions

**When:** Every heartbeat poll (1h intervals)
**Model:** ollama/qwen3.5:4b (local) — escalate to cloud for complex tasks

---

## Instructions

Run each check below in order. Each check is a simple shell command with clear pass/fail criteria. If ALL checks pass, reply exactly: `HEARTBEAT_OK`. If ANY check fails, reply with the alert text for that check (do NOT include HEARTBEAT_OK).

---

## Check 1: Cron Job Health

**Run this command:**
```bash
python3 -c "
import json
with open('/Users/chrismcintosh/.openclaw/cron/jobs.json') as f:
    data = json.load(f)
alerts = []
for job in data.get('jobs', []):
    if not job.get('enabled', True):
        continue
    state = job.get('state', {})
    errors = state.get('consecutiveErrors', 0)
    name = job.get('name', job.get('id', 'unknown'))
    if errors >= 3:
        alerts.append(f'{name}: {errors} consecutive errors — last: {state.get(\"lastError\", \"unknown\")}')
if alerts:
    print('ALERT:' + '|'.join(alerts))
else:
    print('OK')
"
```

**Decision:**
- If output starts with `ALERT:` → Report: "⚠️ Cron Health: [list each alert]. These jobs need attention."
- If output is `OK` → ✅ Check 1 passed, continue to Check 2.

---

## Check 2: Today's Memory File

**Run this command:**
```bash
TODAY=$(date +%Y-%m-%d)
FILE="/Users/chrismcintosh/.openclaw/workspace/coo/memory/${TODAY}.md"
if [ -f "$FILE" ]; then echo "EXISTS"; else echo "MISSING"; fi
```

**Decision:**
- If output is `EXISTS` → ✅ Check 2 passed, continue to Check 3.
- If output is `MISSING` → Report: "📝 Memory: Today's daily memory file not yet created. Will create on first interaction."

---

## Check 3: Ollama Local Model Health

**Run this command:**
```bash
curl -s -o /dev/null -w "HTTP:%{http_code}" --max-time 5 http://127.0.0.1:11434/api/tags
```

**Decision:**
- If output is `HTTP:200` → ✅ Check 3 passed, continue to Check 4.
- If output is anything else → Report: "🚨 BLOCKER: Ollama server not responding (got [output]). All local model agents affected. Escalating to CTO."

---

## Check 4: Dream Report Status

**Run this command:**
```bash
TODAY=$(date +%Y-%m-%d)
REPORT="/Users/chrismcintosh/.openclaw/workspace/coo/memory/dream-report-${TODAY}.md"
if [ -f "$REPORT" ]; then echo "EXISTS"; else echo "MISSING"; fi
```

**Decision:**
- If output is `EXISTS` → ✅ Check 4 passed, continue to Check 5.
- If output is `MISSING` → Check what time it is first:
  - If before 4:00 AM CT → ✅ Check 4 passed (dream job hasn't run yet), continue to Check 5.
  - If after 4:00 AM CT → Report: "💤 Dream: No dream report for today. Dream job may have failed. Check cron errors."

---

## Check 5: Git Workspace Status

**Run this command:**
```bash
cd /Users/chrismcintosh/.openclaw/workspace/coo && git status --porcelain 2>/dev/null | wc -l
```

**Decision:**
- If output is `0` → ✅ Check 5 passed. All checks complete.
- If output is any number greater than 0 → Report: "📂 Workspace: [N] uncommitted changes in workspace. Consider committing."
- If output is empty or error → ✅ Check 5 passed (not a git repo or git unavailable), skip.

---

## Final Response

**If ALL checks passed:**
Reply exactly: `HEARTBEAT_OK`

**If ANY check failed:**
Reply with ALL alert messages (one per failed check). Do NOT include HEARTBEAT_OK.

---

## What NOT to Do

- Do NOT read SOUL.md, AGENTS.md, USER.md, or memory files during heartbeat
- Do NOT create, edit, or delete any files during heartbeat
- Do NOT spawn sub-agents during heartbeat
- Do NOT send Discord messages unless escalating a blocker
- Do NOT run complex analysis or strategy tasks — those are cloud model tasks
- Do NOT modify openclaw.json or any config files

---

## Escalation Targets

**To CTO (Spock):** Ollama server down, local model failures, infrastructure issues
**To Chris (Discord DM):** Multiple cron jobs failing, dream job failures persisting, system-wide issues

---

## When to Escalate to Cloud Model

The local model handles these heartbeat checks. Escalate to cloud model (glm-5.2:cloud) for:
- Agent performance analysis and KPI reviews
- Weekly status report generation
- Cross-agent coordination decisions
- Strategy sessions with Chris
- Memory consolidation and MEMORY.md updates
- Any task requiring reasoning beyond simple pass/fail checks

---

*Instruction set for autonomous execution — checks LIVE data only. Optimized for local model (qwen3.5:4b). Complex tasks (agent coordination, strategy, reporting) deferred to cloud model sessions.*