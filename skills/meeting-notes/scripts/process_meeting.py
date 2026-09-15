#!/usr/bin/env python3
"""
Caveman Meeting Notes — Meeting Processor Script

Processes a meeting transcript to generate:
1. Structured summary (using template-specific prompts)
2. Action items (with assignee, due date, priority)
3. Follow-up email draft

Usage:
  python process_meeting.py --transcript transcript.json --template general

Input format (transcript.json):
  [
    {
      "speaker_label": "SPEAKER_00",
      "text": "Let's discuss the quarterly budget.",
      "start_time": 12.34,
      "end_time": 15.67
    },
    ...
  ]

Output (stdout): JSON object with summary, action_items, followup_email
"""

import json
import sys
import os
import argparse
from pathlib import Path
from datetime import datetime

# ─── Prompt Loading ───

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def load_prompt(name: str) -> str:
    """Load a prompt file from the prompts directory."""
    path = PROMPTS_DIR / f"{name}.txt"
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text()


def load_template_prompt(template: str) -> str:
    """Load a template-specific prompt."""
    path = PROMPTS_DIR / "templates" / f"{template}.txt"
    if not path.exists():
        # Fall back to general
        path = PROMPTS_DIR / "templates" / "general.txt"
    if not path.exists():
        return ""
    return path.read_text()


# ─── Transcript Formatting ───

def format_transcript_for_llm(transcript: list) -> str:
    """Format transcript segments into readable text for the LLM."""
    lines = []
    for seg in transcript:
        speaker = seg.get("speaker_label") or seg.get("speaker_name") or "Unknown"
        text = seg.get("text", "").strip()
        if not text:
            continue
        timestamp = ""
        if seg.get("start_time") is not None:
            mins = int(seg["start_time"] // 60)
            secs = int(seg["start_time"] % 60)
            timestamp = f"[{mins}:{secs:02d}] "
        lines.append(f"{timestamp}{speaker}: {text}")
    return "\n".join(lines)


def extract_participants(transcript: list) -> list:
    """Extract unique speaker labels from transcript."""
    speakers = set()
    for seg in transcript:
        label = seg.get("speaker_label") or seg.get("speaker_name")
        if label:
            speakers.add(label)
    return sorted(speakers)


def estimate_duration(transcript: list) -> str:
    """Estimate meeting duration from transcript timestamps."""
    if not transcript:
        return "0m"
    start = min(seg.get("start_time", 0) for seg in transcript)
    end = max(seg.get("end_time", 0) for seg in transcript)
    duration_sec = end - start
    mins = int(duration_sec // 60)
    if mins < 60:
        return f"{mins}m"
    hours = mins // 60
    remaining = mins % 60
    return f"{hours}h {remaining}m"


# ─── Meeting Processing ───

def process_meeting(transcript: list, template: str = "general", actions: list = None):
    """
    Process a meeting transcript and return summary, action items, and email.

    This function prepares the data. The actual LLM processing happens
    in the OpenClaw agent (COO/Wren) which calls this script to prepare
    the prompt, then uses the LLM to generate the output.
    """
    if actions is None:
        actions = ["summarize", "extract_actions", "draft_followup"]

    if not transcript:
        return {
            "error": "Empty transcript",
            "summary": None,
            "action_items": [],
            "followup_email": None
        }

    participants = extract_participants(transcript)
    duration = estimate_duration(transcript)
    formatted = format_transcript_for_llm(transcript)
    template_prompt = load_template_prompt(template)
    summarize_prompt = load_prompt("summarize").replace("{TEMPLATE_TYPE}", template)
    actions_prompt = load_prompt("extract-actions")
    followup_prompt = load_prompt("draft-followup")

    # Prepare output structure
    result = {
        "meeting_id": None,  # Set by caller
        "date": datetime.now().isoformat(),
        "participants": participants,
        "duration": duration,
        "template": template,
        "segment_count": len(transcript),
        "prompts": {
            "summarize": summarize_prompt,
            "extract_actions": actions_prompt,
            "draft_followup": followup_prompt,
            "template_specific": template_prompt,
        },
        "formatted_transcript": formatted,
        "summary": None,
        "action_items": [],
        "followup_email": None,
        "key_decisions": [],
    }

    return result


# ─── Storage ───

def save_meeting(meeting_data: dict, storage_dir: Path):
    """Save meeting data to the storage directory."""
    meeting_id = meeting_data.get("meeting_id", "unknown")
    meeting_dir = storage_dir / meeting_id
    meeting_dir.mkdir(parents=True, exist_ok=True)

    # Save transcript
    (meeting_dir / "transcript.json").write_text(
        json.dumps(meeting_data.get("transcript", []), indent=2)
    )

    # Save summary
    if meeting_data.get("summary"):
        (meeting_dir / "summary.md").write_text(meeting_data["summary"])

    # Save action items
    if meeting_data.get("action_items"):
        (meeting_dir / "action-items.json").write_text(
            json.dumps(meeting_data["action_items"], indent=2)
        )

    # Save follow-up email
    if meeting_data.get("followup_email"):
        (meeting_dir / "followup.txt").write_text(
            json.dumps(meeting_data["followup_email"], indent=2)
        )

    # Save metadata
    metadata = {
        "meeting_id": meeting_id,
        "date": meeting_data.get("date"),
        "participants": meeting_data.get("participants", []),
        "duration": meeting_data.get("duration"),
        "template": meeting_data.get("template"),
        "segment_count": meeting_data.get("segment_count"),
    }
    (meeting_dir / "metadata.json").write_text(json.dumps(metadata, indent=2))

    # Update index
    index_path = storage_dir / "index.json"
    index = []
    if index_path.exists():
        index = json.loads(index_path.read_text())
    index.append(metadata)
    index_path.write_text(json.dumps(index, indent=2))


# ─── Main ───

def main():
    parser = argparse.ArgumentParser(description="Process a meeting transcript")
    parser.add_argument("--transcript", required=True, help="Path to transcript JSON file")
    parser.add_argument("--template", default="general", help="Meeting template type")
    parser.add_argument("--actions", nargs="+", default=["summarize", "extract_actions", "draft_followup"])
    parser.add_argument("--storage-dir", default=None, help="Directory to save meeting data")
    parser.add_argument("--meeting-id", default=None, help="Meeting UUID")

    args = parser.parse_args()

    # Load transcript
    transcript_path = Path(args.transcript)
    if not transcript_path.exists():
        print(json.dumps({"error": f"Transcript file not found: {transcript_path}"}))
        sys.exit(1)

    transcript = json.loads(transcript_path.read_text())
    if not isinstance(transcript, list):
        print(json.dumps({"error": "Transcript must be a JSON array"}))
        sys.exit(1)

    # Process
    result = process_meeting(transcript, args.template, args.actions)
    result["meeting_id"] = args.meeting_id or f"meeting-{int(datetime.now().timestamp())}"
    result["transcript"] = transcript

    # Save if storage dir provided
    if args.storage_dir:
        storage_dir = Path(args.storage_dir)
        save_meeting(result, storage_dir)

    # Output result (without the full transcript in stdout)
    output = {k: v for k, v in result.items() if k != "transcript"}
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()