# DREAM.md — Wren's Dreaming Protocol

## Overview
Every night at 3:00 AM CT, Wren enters a "dreaming" state using the local qwen3.6 model. The dream process reviews the day's session transcripts, finds patterns across sessions, and updates memory files so tomorrow's Wren starts smarter than today's.

## Process

### Step 1: Gather Session Transcripts
- Scan `/Users/chrismcintosh/.openclaw/agents/coo/sessions/` for `.jsonl` files modified in the last 24 hours
- Also check `/Users/chrismcintosh/.openclaw/workspace/coo/` for any `.jsonl` transcript files
- For each transcript, extract: user messages, assistant responses, tool calls made, decisions taken, and any errors/compactions
- Skip files larger than 5MB (too large for single-pass processing — sample first/last 100 lines instead)

### Step 2: Read Current Memory State
Read these files if they exist:
- `MEMORY.md` — long-term curated memory
- `memory/YYYY-MM-DD.md` — recent daily notes (last 7 days)
- `USER.md` — what we know about Chris
- `AGENTS.md` — workspace conventions
- `SOUL.md` — identity and constraints (READ ONLY — never auto-edit)
- `TOOLS.md` — tool notes

### Step 3: Analyze (The Dream)
Compare transcript content against current memory. Identify:

**A. New Facts Worth Keeping**
- Things Chris said about himself, his preferences, his schedule
- Business developments: new clients, revenue changes, strategic shifts
- Agent performance observations (what worked, what didn't)
- Tool/workflow discoveries

**B. Patterns Across Sessions**
- Recurring blockers or friction points
- Topics that came up multiple times (cross-session themes)
- Repeated mistakes or corrections (things Wren got wrong more than once)
- Workflow improvements that could compound

**C. Stale or Outdated Memory**
- Entries in MEMORY.md that contradict recent session content
- Outdated statuses (e.g., "waiting on X" where X was already resolved)
- Duplicate information across memory files

**D. Safe Auto-Fixes**
- Typos in memory files
- Removing clearly stale entries (older than 30 days that no longer reflect reality)
- Deduplicating identical information
- Formatting/structure improvements

### Step 4: Generate Dream Report
Save to: `memory/dream-report-YYYY-MM-DD.md`

Format:
```markdown
# 🌙 Dream Report — YYYY-MM-DD

## Session Activity
- [N] sessions reviewed, [M] total messages processed
- Sessions: [list with brief description]

## New Facts Discovered
1. [Fact] — Evidence: "[quote from transcript]" — Source: [session name]
2. ...

## Cross-Session Patterns
1. [Pattern] — Seen in: [session names] — Significance: [why it matters]
2. ...

## Stale Memory Identified
1. [Entry] in [file] — Why it's stale: [explanation] — Recommendation: [update/remove]
2. ...

## Auto-Applied Fixes
1. [Fix] — [what was changed] ✅
2. ...

## Flagged for Chris Review
1. [Change] — [what] — [why it needs approval]
2. ...

## Memory Updates Applied
- [Summary of what was written to MEMORY.md]
```

### Step 5: Apply Changes
- **Auto-apply** (no approval needed): typo fixes, removing stale entries older than 30 days, deduplication, formatting
- **Write to MEMORY.md**: Create if missing, otherwise append/update sections
- **Never touch**: SOUL.md, openclaw.json, AGENTS.md identity sections
- **Update daily memory file**: Write `memory/YYYY-MM-DD.md` with dream summary if not already created

### Step 6: Morning Summary
Post a brief summary to Discord channel `746363289046614097` (Chris's DM with Wren):
- 3-5 bullet points of the most important findings
- Any items flagged for Chris's review
- Keep it short — full report is in the file

## Guardrails
- **Never** edit SOUL.md
- **Never** edit openclaw.json
- **Never** edit AGENTS.md governance rules
- **Never** delete memory files — only update content
- **Always** include evidence quotes from transcripts
- **Always** preserve the original meaning when updating memory entries
- If unsure whether something is safe to auto-apply → flag for review instead

## Model
Use `ollama/qwen3.6` (local, 23GB, no API costs, 262k context window)
This runs on the Mac mini's hardware — no cloud dependencies.

## Schedule
3:00 AM CT daily — `0 3 * * *` in America/Chicago timezone

## Failure Mode
If the dream job fails (model error, OOM, etc.):
- Log the error to `memory/dream-report-YYYY-MM-DD.md` with the failure reason
- Do NOT post to Discord if the failure is before any analysis was done
- If partial analysis was completed, post what was gathered