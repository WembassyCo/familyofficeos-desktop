# HEARTBEAT.md — COO Agent Execution Instructions

**When:** Every heartbeat poll (1h intervals)
**Model:** ollama/glm-5.2:cloud — escalate to cloud for complex tasks

---

## Phase 0: Resume Context (Always)

Before any checks, read `WORKSTREAM.md` to restore context from previous sessions. This file survives restarts and contains the current work plan, task status, and active blockers. If WORKSTREAM.md says to continue a task, prioritize that over routine checks.

---

## Phase 1: Health Checks (Always Run)

Run each check below in order. Each check is a simple shell command with clear pass/fail criteria.

### Check 1: Cron Job Health

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
        last_err = state.get('lastError', 'unknown')
        alerts.append(f'{name}: {errors} consecutive errors — last: {last_err}')
if alerts:
    print('ALERT:' + '|'.join(alerts))
else:
    print('OK')
"
```

- `ALERT:` → Report: "⚠️ Cron Health: [list each alert]. These jobs need attention."
- `OK` → ✅ Continue to Check 2.

### Check 2: Today's Memory File

```bash
TODAY=$(date +%Y-%m-%d)
FILE="/Users/chrismcintosh/.openclaw/workspace/coo/memory/${TODAY}.md"
if [ -f "$FILE" ]; then echo "EXISTS"; else echo "MISSING"; fi
```

- `EXISTS` → ✅ Continue to Check 3.
- `MISSING` → Create it with date header. Continue to Check 3.

### Check 3: Ollama Local Model Health

```bash
curl -s -o /dev/null -w "HTTP:%{http_code}" --max-time 5 http://127.0.0.1:11434/api/tags
```

- `HTTP:200` → ✅ Continue to Check 4.
- Anything else → Report: "🚨 BLOCKER: Ollama server not responding (got [output]). All local model agents affected."

### Check 4: Dream Report Status

```bash
TODAY=$(date +%Y-%m-%d)
REPORT="/Users/chrismcintosh/.openclaw/workspace/coo/memory/dream-report-${TODAY}.md"
if [ -f "$REPORT" ]; then echo "EXISTS"; else echo "MISSING"; fi
```

- `EXISTS` → ✅ Continue to Check 5.
- `MISSING` → If before 4:00 AM CT → ✅ Continue. If after 4:00 AM CT → Report: "💤 Dream: No dream report for today. Dream job may have failed."

### Check 5: Git Workspace Status

```bash
cd /Users/chrismcintosh/.openclaw/workspace/coo && git status --porcelain 2>/dev/null | wc -l
```

- `0` → ✅ Continue to Phase 2.
- `>0` → Report: "📂 Workspace: [N] uncommitted changes." Continue to Phase 2.

---

## Phase 2: Proactive Work (One Action Per Heartbeat)

After health checks pass, pick **ONE** proactive action from the rotation below based on the current hour (CT). If health checks failed, skip Phase 2 and report the alerts only.

### Rotation Schedule

| Hour (CT) | Focus Area | Actions |
|-----------|-----------|---------|
| 00, 06, 12, 18 | Revenue | Check Upwork for new leads, review pipeline status, flag stalled deals |
| 01, 07, 13, 19 | Infrastructure | Check for stuck items >48h, verify agent sessions, review blocked pipelines |
| 02, 08, 14, 20 | Client Work | Check FOX deliverables, contractor status, open work tickets |
| 03, 09, 15, 21 | Growth | SEO check, content gaps, market research, competitor scan |
| 04, 10, 16, 22 | Financial | FreshBooks status, outstanding invoices, expense tracking |
| 05, 11, 17, 23 | Internal | Memory consolidation, compliance checklist, documentation updates |

### How to Execute

1. **Determine the current hour's focus area** from the rotation table
2. **Check for stuck/blocking items** in that focus area first — these take priority over routine checks
3. **Take ONE concrete action:**
   - Research a lead → log to memory
   - Send a follow-up message to a contractor via Discord → log it
   - Check a stuck item and attempt to unblock it → log what was done
   - Update a document or compliance item → log it
   - Consolidate recent memory notes → log it
4. **Log the action** to `memory/YYYY-MM-DD.md` under a `## Heartbeat Action` heading with timestamp
5. **If nothing needs attention** in the focus area → reply `HEARTBEAT_OK`

### Guardrails — MANDATORY

- **NEVER** spend money or make financial commitments
- **NEVER** send client-facing communications (emails to FOX, proposals to prospects)
- **NEVER** modify openclaw.json (existing governance rule — requires 2-agent approval)
- **NEVER** spawn sub-agents during heartbeat (use the next main session for that)
- **NEVER** make public posts on social media
- **NEVER** delete files or data
- **ALWAYS** log every action taken to the daily memory file
- **ALWAYS** stay within the current focus area — don't drift

### When to Escalate to Chris

- A stuck item has been blocked for >7 days with no resolution path
- A contractor is unresponsive for >48 hours on a time-sensitive task
- A critical system failure that can't be resolved without human action
- An opportunity that requires Chris's decision (e.g., new client inquiry, contract review)
- Any situation where the proactive action could cause harm if wrong

### When NOT to Escalate

- Routine checks that show everything is fine
- Minor issues that were resolved during the heartbeat
- Information gathering that doesn't require a decision
- It's late night (23:00-07:00 CT) unless urgent

---

## Phase 3: Final Response

**If all health checks passed AND no proactive action was needed:**
Reply exactly: `HEARTBEAT_OK`

**If all health checks passed AND a proactive action was taken:**
Reply: `✅ Heartbeat: All checks passed. Action taken: [brief description of what was done]`

**If any health check failed:**
Reply with all alert messages. Do NOT include HEARTBEAT_OK.

---

## What NOT to Do (Still Enforced)

- Do NOT read SOUL.md, AGENTS.md, USER.md during heartbeat (context already loaded)
- Do NOT create or delete files other than the daily memory file
- Do NOT modify openclaw.json or any config files
- Do NOT run complex analysis requiring deep reasoning — flag for main session
- Do NOT perform actions outside the current focus area rotation

---

## Escalation Targets

**To CTO (Spock):** Ollama server down, local model failures, infrastructure issues
**To Chris (Discord DM):** Multiple cron jobs failing, stuck items >7 days, critical decisions needed

---

*Instruction set for autonomous execution — checks LIVE data, takes ONE proactive action per cycle within guardrails. Optimized for cloud model. Complex tasks (agent coordination, strategy, multi-step execution) deferred to main session.*