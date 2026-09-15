# Meeting Notes Skill

**Agent:** COO (Wren)  
**Version:** 0.1.0  
**Created:** September 15, 2026  
**Author:** Spock (CTO)

## Description

Processes meeting transcripts to generate AI-powered summaries, action items, follow-up emails, and meeting-type-specific structured outputs. Receives transcripts from the Caveman Meeting Notes Electron app via WebSocket.

## Triggers

- WebSocket message with `type: "process_meeting"` from the Electron app
- Direct agent request: "summarize this meeting" / "extract action items"
- Cron-based: auto-process after meeting recording stops

## Configuration

```json
{
  "name": "meeting-notes",
  "version": "0.1.0",
  "actions": [
    "summarize_meeting",
    "extract_action_items",
    "draft_followup_email",
    "query_past_meetings",
    "apply_template"
  ],
  "language": "en",
  "storage_path": "meetings/"
}
```

## Inputs

### process_meeting
```json
{
  "type": "process_meeting",
  "meeting_id": "uuid",
  "transcript": [
    {
      "speaker_label": "SPEAKER_00",
      "text": "Let's discuss the Q3 budget...",
      "start_time": 12.34,
      "end_time": 15.67
    }
  ],
  "template": "standup|sales_call|technical_review|client_meeting|interview|general",
  "actions": ["summarize", "extract_actions", "draft_followup"]
}
```

## Outputs

### meeting_processed
```json
{
  "type": "meeting_processed",
  "meeting_id": "uuid",
  "summary": "## Meeting Summary\n\nKey points...",
  "action_items": [
    {
      "text": "Send Q3 budget report to Chris by Friday",
      "assignee": "Wren",
      "due_date": "2026-09-19",
      "priority": "high"
    }
  ],
  "followup_email": {
    "subject": "Follow-up: Q3 Budget Discussion",
    "body": "Hi team,\n\nThanks for the discussion today..."
  },
  "key_decisions": [
    "Budget increased by 15% for Q3",
    "New hire approved for engineering team"
  ],
  "participants": ["Chris", "Wren", "Spock"]
}
```

## Actions

### 1. summarize_meeting
Generates a structured meeting summary with:
- Executive summary (2-3 sentences)
- Key discussion points (bulleted)
- Decisions made
- Open questions
- Participant list

Uses the template-specific prompt if a template is specified.

### 2. extract_action_items
Pulls action items from the transcript:
- Action description
- Assignee (from speaker context)
- Due date (if mentioned)
- Priority (inferred from language)

### 3. draft_followup_email
Writes a follow-up email:
- Subject line
- Greeting
- Summary of what was discussed
- Action items with assignees
- Next steps
- Professional sign-off

### 4. query_past_meetings
RAG search over past meeting transcripts:
- Input: natural language query
- Searches stored meeting summaries + transcripts
- Returns relevant excerpts with meeting references

### 5. apply_template
Applies a meeting-type-specific template:

| Template | Structure |
|----------|-----------|
| standup | Blockers, completed, planned |
| sales_call | Pain points, demo notes, next steps, deal stage |
| technical_review | Architecture decisions, trade-offs, action items |
| client_meeting | Client concerns, proposals, feedback, next steps |
| interview | Candidate assessment, strengths, concerns, recommendation |

## Storage

Meetings are stored in the COO workspace:

```
~/.openclaw/workspace/coo/meetings/
  ├── {meeting-id}/
  │   ├── transcript.json    — Full transcript with speakers
  │   ├── summary.md         — AI summary
  │   ├── action-items.json  — Extracted action items
  │   ├── followup.txt       — Email draft
  │   └── metadata.json      — Meeting metadata
  └── index.json             — Searchable index
```

## WebSocket Protocol

The Electron app connects to the OpenClaw gateway via WebSocket:

```
→ {"type": "process_meeting", ...}
← {"type": "meeting_processed", ...}
← {"type": "processing_progress", "percent": 50, "step": "extracting_actions"}
← {"type": "error", "message": "..."}
```

## Dependencies

- OpenClaw gateway running (ws://localhost:8750)
- COO agent configured
- Meeting storage directory writable

## Error Handling

- If transcript is empty, return error with message
- If transcript is too long (>50k chars), chunk processing
- If template is unknown, fall back to "general" template
- If action extraction finds no actions, return empty array (not error)
- If email draft fails, return the summary without the email