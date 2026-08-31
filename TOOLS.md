# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Skill Locations

**System Skills (Built-in):**
`/opt/homebrew/lib/node_modules/openclaw/skills/`

**Agent Registry (Subagents):**
`/Volumes/Extreme Pro/skills/AGENT_REGISTRY.md`

**Custom Skills (NEW RULE):**
`/Volumes/Extreme Pro/skills/` ← **All new custom skills go here**

**DO NOT** put new custom skills in `~/.openclaw/skills/` anymore.

---

## Google Drive Sync Protocol

**Rule:** All generated assets must be synced to organized Google Drive for online access.

**Process:**
1. Generate file locally in `~/.openclaw/workspace/coo/`
2. Upload to appropriate Google Drive folder using `gog drive upload`
3. Update file naming convention: `PROJECTNAME_DocumentType_v1.ext`
4. Share link in Discord/communication channel

**Folder Structure:**
```
Wembassy/
├── Marketing/
│   ├── Service_Pages/
│   ├── Proposals/
│   └── SOPs/
├── FOX/
│   ├── Project_Management/
│   └── Automation/
└── Personal/
    └── Moving/
```

**Account:** wren@wembassy.com (default Drive access)

---

Add whatever helps you do your job. This is your cheat sheet.
