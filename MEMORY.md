# MEMORY.md — Wren's Long-Term Memory

*Last updated: 2026-09-11 (Dream consolidation)*
*Created: 2026-09-05*

---

## Business Context

**Company:** Wembassy — digital agency specializing in Drupal development, automation, and AI-powered operations.
**Goal:** $50K MRR (current: ~$5K baseline as of April 2026)
**Team:** Chris (CEO/founder), supported by AI agents (Wren=COO, Spock=CTO, Mason=CMO, Grayson=CRO, Lanie=financial ops, Jessette=contractor, Mitzi=contractor)

### Key Clients/Projects
- **FOX (Family Office eXchange):** Event management platform on Drupal 11, x402 payment integration, visual regression testing
- **KidneyX:** Drupal project, Mitzi leads implementation (WP #2483)
- **ELCO Lighting:** Website redesign estimate $61,850 (10-12 weeks, Drupal 11 + custom frontend)
- **Elevated Wake:** WP #2494-2500, Mitzi implementing
- **SuiteCRM:** https://crm.wembassy.com — lead management, was accessible as of July 2026

---

## Persistent Issues (Ongoing)

### OpenProjects Integration — BLOCKED SINCE APRIL 2026
- Auth has been failing for 5+ months
- Grayson blocked 18+ hours on API auth (July 29)
- 40+ escalations pending
- Spock assigned to investigate (Jul 29) — no confirmation of resolution
- Not configured in openclaw.json (no native OpenClaw integration)
- **Chris asked about status Sep 3, 2026** — COO recommended evaluating alternative platform if not fixed by end of week
- **8+ days with no activity or mentions** (as of Sep 11)
- **NEEDS CHRIS'S DECISION:** Continue with OpenProjects or switch to alternative

### Model Reliability
- **qwen3.5:4b (local):** Inadequate for tool-using tasks. Cannot handle heartbeat protocol — tries to call non-existent tools, simulates commands in text instead of executing them, confused about available functions
- **glm-5.2:cloud:** Generally reliable for heartbeats and tool use, but experienced TLS handshake timeouts and DNS failures ("ollama.com: no such host") on Sep 3, 2026 afternoon. Does NOT support image input.
- **kimi-k2.6:cloud:** Used for glass/voice session (Sep 7+). Conversational and tool use works, but does NOT support image input.
- **qwen3.6:** Was used for dream job but couldn't handle the complex multi-step protocol — simulated execution in text, got truncated, never created files. Fixed to glm-5.2:cloud on Sep 4

### Image Analysis Pipeline — BLOCKED SINCE SEP 3-4, 2026 (8+ DAYS)
- **OpenAI credits exhausted** — gpt-5-mini returns "no credits remaining" error
- **Neither glm-5.2:cloud nor kimi-k2.6:cloud support image input** — both return "400 this model does not support image input"
- VisionClaw can capture and stream frames from Meta glasses (breakthrough Sep 6), but no model can analyze them
- Google Drive image URLs (from Meta glasses upload) are not directly accessible — Drive viewer pages don't expose raw image
- **OCR workaround (tesseract) partially works** — extracted 1 of 3 business card images on Sep 9. Fails on dark/complex images.
- **Now blocking business workflows** — Chris sent 3 business card images from FOX event Sep 9; only 1 partially extracted
- **NEEDS CHRIS'S DECISION:** Add OpenAI credits or find alternative image-capable model

### Brave Search API — NOT CONFIGURED (4th day)
- Brave Search API key not set up in OpenClaw
- **Workaround:** Use researcher agent for web searches (Chris instructed Sep 7)
- Researcher agent successfully found Mr. Mann's BBQ location and distance via subagent spawn

### Agent Session Availability — ONGOING (PARTIALLY RESOLVED)
- **AI agents (Mason, Grayson, Spock):** Wren frequently cannot reach them when needed. Their sessions are not always running — timed out when Chris asked for standups Sep 8. No fallback escalation mechanism.
- **Human contractors (Mitzi, Lanie, Jessette):** ✅ REACHABLE via #human-only-contractors Discord channel (ID: 969238908632191037). All three responded to standup request Sep 9. Response times: Mitzi ~10 min, Jessette ~30 min, Lanie ~50 min.
- Wren still lacks Discord posting access to AI agent private channels
- **NEEDS CHRIS'S DECISION:** Persistent AI agent sessions? Discord channel access for AI agents? Different escalation path?

---

## Infrastructure Fixes Applied

### Sep 4, 2026 (Dream Session)
1. Dream cron model: `ollama/qwen3.6` → `ollama/glm-5.2:cloud`
2. Zillow/Evansville delivery: channel `"last"` → `"discord"`, added `--best-effort-deliver`

### Sep 3, 2026 (Voice Channel Config)
- Per-account voice config set in openclaw.json
- `coo` account: voice enabled, autoJoin Lounge (964451476988657665)
- All other accounts: voice disabled (prevents VoiceConnection destruction conflicts)
- Dead `com.wembassy.voice-assistant` launchd plist removed
- `/vc join` slash command workaround for autoJoin after gateway restarts

### Sep 4, 2026 (Evansville Gas Price Scan — RESOLVED)
- Had 6 consecutive delivery failures (cron announce delivery failed)
- Fixed: Delivery channel changed from `"last"` → `"discord"`, added `--best-effort-deliver`
- No recurrences in 5+ days ✅

---

## Team Knowledge

### Chris (CEO)
- Discord username: Cavemancrafting (ID: 118658938051756033)
- Prefers async updates via Discord
- Wants proactive problem-solving from agents without being asked
- Interested in Bennett's Razor principle (weak hypothesis over compression) — shared Sep 3
- Main Discord channel: 746363289046614097 (DM with Wren)
- Has a 6-year-old daughter who had oral surgery (tooth extraction) on Sep 5, 2026
- Sep 5: Sent images of clinic oral surgery bill for text extraction — task was NOT completed due to qwen3.5:4b model failure. Re-attempted Sep 6-7 via VisionClaw but still blocked — no image-capable model available (OpenAI credits exhausted, glm-5.2:cloud and kimi-k2.6:cloud don't support image input). Images at: `/Users/chrismcintosh/.openclaw/media/inbound/0db4ed41-1f8c-47d9-b4c0-5bac02c83d3e.jpg` and `261424bb-5f64-4e20-937b-85c566222c41.jpg`
- **Sep 8-9, 2026: Austin, TX trip (CONCLUDED)** — FOX Technology and Risk Management Showcase & Tech Selection Workshop
  - Flight #EVHTKD, American Airlines, landing 11:52 AM
  - Hotel: Renaissance Austin Downtown (701 East 11th St, Austin, TX, 512.478.1111)
  - First time on the road for a while to check FOX setup
  - Booking not in wren@wembassy.com Gmail — likely on personal or familyoffice.com email
  - Mr. Mann's BBQ (Mann's Smokehouse Bar-B-Q): 8624 Research Blvd, Austin, TX 78758, ~9.4 miles from hotel, ~15 min drive
  - Was testing VisionClaw while out at a store (Sep 7)
  - At airport Sep 8 morning, asked Wren to trigger team standups via Discord — Wren couldn't reach Mason/Grayson/Spock (sessions timed out, no Discord channel access)
  - Tested VisionClaw image analysis in Austin — kimi-k2.6:cloud returned "400 this model does not support image input"
  - Chris suggested the kimi-k2.6 image error may be a routing/config issue, not a model limitation — needs Spock to investigate
  - Sep 9: Met Todd Sorrel (Co-Founder & CEO) at FOX event — business card captured via OCR (phone: 912-585-4545, email ambiguous: s@block.com or s@6lock.com — needs confirmation). 2 other business cards too dark for OCR.
  - Sep 9: Asked for Austin dinner recommendations — Wren suggested Jeffrey's (upscale American) and Clark's Oyster Bar
  - Sep 9: Asked about Ranch 616 (Tex-Mex, Gulf Coast) — TVs and football game. Researcher identified the restaurant.
  - Sep 9: Asked for football prediction — Patriots @ Seahawks (NFL Week 1, Super Bowl LX rematch). Seahawks favored.
  - Uses voice messages (OGG) frequently while traveling — Whisper CLI transcription working reliably

### Agent Roles
- **Wren (COO):** Operations coordinator, heartbeat monitoring, team coordination, memory management
- **Spock (CTO):** Technical implementation, infrastructure, Drupal development
- **Mason (CMO):** Content marketing, LinkedIn posts (10/day), SEO/GA monitoring
- **Grayson (CRO):** Sales pipeline, lead management, SuiteCRM, Moltbook outreach. Can now spawn CTO and COO as sub-agents (added Sep 10).
- **Lanie:** Financial ops, lead research (15 coaches/week), FreshBooks reconciliation
- **Jessette:** Contractor, time tracking monitored
- **Mitzi:** Contractor, KidneyX implementation, Elevated Wake

### Key Infrastructure
- **Mac mini:** Primary host for OpenClaw, Ollama
- **VPS:** 190.92.179.162, port 7822, user root, key ~/.ssh/temp_fix_key (Invoice Ninja migration WP #2489)
- **Wembassy Discord Guild:** 722415039696338944
- **External storage:** /Volumes/Extreme Pro/ (3.6TB, skills + documents)
- **VisionClaw:** Meta Ray-Ban glasses integration via agent:coo:glass session. Camera streaming achieved Sep 6, 2026. Image analysis pipeline still blocked (no image-capable model).
- **#human-only-contractors Discord channel:** ID 969238908632191037 — primary channel for reaching human contractors (Mitzi, Lanie, Jessette). All responsive.
- **FOX Discord Guild:** ID 1547624384649232404 — Family Office Exchange server. Authorized users: 1547626260111298604 (Sep 7), 392523706674708485 (Sep 10). Channels: #general (1547624385446158499), #marketing, #events, #web.
- **Config Governance:** 6 total proposals approved since Sep 1. All purely additive changes. Protocol working correctly (propose → review → 2 approvals → apply → document).

---

## Lessons Learned

1. **Local models can't handle ANY tool-using tasks** — qwen3.5:4b fails at heartbeats, dream jobs, AND real user tasks (image extraction, file operations). It hallucinates tool calls, writes poems instead of following protocols, and gives confusing responses. Do NOT use as fallback for user-facing interactions.
2. **Cron job delivery channels matter** — `"last"` channel caused delivery failures; always use explicit `"discord"` channel.
3. **`state.lastRunAt` in jobs.json is unreliable** — Use `openclaw cron list` for accurate cron job status.
4. **Per-account Discord voice config prevents VoiceConnection conflicts** — Multiple bots joining same guild voice channel destroys each other's connections.
5. **Heartbeat alerts persist without action** — Identifying issues in heartbeats is necessary but not sufficient; need a mechanism to escalate and resolve flagged issues.
6. **Google Drive URLs don't work for image analysis** — Meta glasses upload to Google Drive, but the viewer URLs can't be directly accessed by image tools. Need a direct image delivery pipeline.
7. **Image analysis requires image-capable models** — Both glm-5.2:cloud and kimi-k2.6:cloud return "400 this model does not support image input". Need OpenAI credits or an alternative image-capable model.
8. **Researcher agent is the web search workaround** — Brave API not configured in OpenClaw. Delegate web searches to the researcher agent via sessions_spawn.
9. **Human contractors are reachable via Discord** — #human-only-contractors channel works for team coordination. Mitzi fastest responder (~10 min). Only AI agents are unreachable.
10. **Voice message transcription (Whisper CLI) works reliably** — Chris sends OGG voice messages from Discord, Whisper transcribes them successfully. Always transcribe and respond, never ask Chris to type it out.
11. **OCR (tesseract) is a partial workaround for image analysis** — Works on high-contrast business cards with clear text. Fails on dark/complex images. Not a replacement for a proper vision model.
12. **Config governance protocol works at scale** — 6 proposals approved over 10 days with zero issues. The propose → review → 2-approval → apply → document flow is reliable. Wren is consistently the fastest approver.
13. **Heartbeats are 100% stable on glm-5.2:cloud** — 3 consecutive days (Sep 8-10) with zero failures. This is the longest stable streak since tracking began.

---

## Memory Maintenance Log
- 2026-09-05: MEMORY.md created during dream consolidation. Initial content curated from Sep 3-4 sessions and recent memory files.
- 2026-09-06: Dream consolidation #2. Added: Chris's daughter oral surgery info, qwen3.5:4b image extraction failure, unfulfilled image extraction task flagged for Chris. Heartbeats stable on glm-5.2:cloud.
- 2026-09-08: Dream consolidation #3. Added: Chris's Austin trip (FOX Tech Showcase), VisionClaw streaming breakthrough, OpenAI credits exhausted, kimi-k2.6:cloud as alternate model, Brave Search API not configured (researcher agent workaround), Google Drive image delivery failure. Updated: oral surgery bill task still blocked, model reliability section expanded. Flagged: OpenAI credits, image-capable model, Brave API key, OpenProjects status.
- 2026-09-09: Dream consolidation #4. Added: Agent session availability as persistent issue, Chris's airport standup request failure, kimi-k2.6 image error may be config issue (per Chris), Sep 7 dream report missing, heartbeats 100% stable Sep 8, workspace committed. Fixed: typo in oral surgery bill path (chrismcshintosh→chrismcintosh), moved Evansville Gas to resolved. Flagged: agent session availability, kimi-k2.6 image routing, Spock escalation path, OpenProjects still stale.
- 2026-09-10: Dream consolidation #5. Added: Human contractors reachable via Discord (#human-only-contractors, ID 969238908632191037), Todd Sorrel contact from FOX event (partial OCR), Mitzi's Sep 9 FOX update, voice transcription working, researcher subagent as reliable workaround, qwen3.5:4b still failing Sep 8 morning, Ranch 616 restaurant research, football prediction. Updated: Agent session availability split (humans ✅ reachable, AI agents ❌ not), image pipeline now 7+ days blocked and blocking business workflows. Flagged: Todd Sorrel email confirmation, OpenAI credits urgently needed, Brave API still not configured, OpenProjects 7+ days stale, FOX login issues intermittent.
- 2026-09-11: Dream consolidation #6. Added: 3 config governance approvals on Sep 10 (new FOX user 392523706674708485, CTO added to CRO allowAgents, COO added to CRO allowAgents), FOX Discord Guild details, config governance protocol assessment (6 total, all working), first zero-interaction day (Sep 10), heartbeats 3 consecutive days stable. Updated: Austin trip to past tense (concluded), image pipeline 8+ days, Brave API 4th day, OpenProjects 8+ days stale. New lessons: config governance works at scale, heartbeats 3-day stable streak. Flagged: 10 uncommitted workspace changes, same persistent items.