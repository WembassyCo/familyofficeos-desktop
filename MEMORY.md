# MEMORY.md — Wren's Long-Term Memory

*Last updated: 2026-09-18 (Dream consolidation #11)*
*Created: 2026-09-05*

---

## Business Context

**Company:** Wembassy — digital agency specializing in Drupal development, automation, and AI-powered operations.
**Goal:** $50K MRR (current: ~$5K baseline as of April 2026)
**Team:** Chris (CEO/founder), supported by AI agents (Wren=COO, Spock=CTO, Mason=CMO, Grayson=CRO, Lanie=financial ops, Jessette=contractor, Mitzi=contractor)

### Wembassy Intel (NEW — Launched Sep 16, 2026)
- **Product:** AI-powered operations infrastructure running on local hardware (no OpenAI/Google/cloud)
- **Pricing:** $500/mo (small business), $1,500/mo (professional services), $3,000/mo (agency white-label)
- **Stripe:** 3 payment links live, $0 revenue to date
- **Target Markets:** Professional services (accounting, law), digital agencies (white-label), mid-size B2B (manufacturing, logistics), service/food businesses (restaurants, coffee, ice cream)
- **EXCLUSION:** Family offices — Chris works for FOX, conflict of interest. Do NOT target.
- **Outreach:** 32 cold emails sent Sep 16 from wren@wembassy.com. 0 responses day 1, 0 responses day 2 (normal B2B cycle 2-5 days). Maman NYC auto-replied. LinkedIn outreach approved but not yet executed.
- **Compliance:** 4/5 tasks done (gitignore, secrets migration, fine-tuning removal, TTS migration). FileVault remaining (needs Chris reboot).

### Coloring Books — KDP + Etsy (Launched Sep 17, 2026)
- **Concept:** AI-generated kids coloring books sold on Amazon KDP (physical print-on-demand) + Etsy (digital PDF downloads)
- **First book:** "Space Adventure Coloring Book" — 30 pages, 8.5"x11", generated using Pollinations.ai (free)
- **Quality review:** 19/30 pages PASS, 11 NEED REGENERATION (shading/color issues). Pages: 1, 4, 5, 7, 12, 15, 16, 25, 26, 28, 29
- **Pricing plan:** Etsy digital PDF $3.99 (~95% margin), KDP physical $6.99 (Amazon handles printing/shipping)
- **Status:** PDF shared with Chris. 11 pages need regen. No KDP or Etsy account created yet.
- **Production cost:** $0 (Pollinations.ai free, minicpm-v QC free, local assembly)

### Key Clients/Projects
- **FOX (Family Office eXchange):** Event management platform on Drupal 11, x402 payment integration, visual regression testing. OAuth: client_id=falconai, redirect_uri=https://clerk.foxai.tech/v1/oauth_callback
- **KidneyX:** Drupal project, Mitzi leads implementation (WP #2483)
- **ELCO Lighting:** Website redesign estimate $61,850 (10-12 weeks, Drupal 11 + custom frontend)
- **Elevated Wake:** WP #2494-2500, Mitzi implementing
- **SuiteCRM:** https://crm.wembassy.com — lead management, was accessible as of July 2026

---

## Persistent Issues (Ongoing)

### OpenProjects Integration — RESOLVED ✅ (Sep 17, 2026)
- Auth confirmed working Sep 17. Config at `~/.config/op-cli/config.ini`, API key valid.
- Connected successfully, found 10 projects (SAA - Tracy, Waldorf, Family Office Operating, etc.)
- Was blocked since April 2026 (5+ months). Resolved after Chris asked about status.

### Model Reliability
- **qwen3.5:4b (local):** Inadequate for tool-using tasks. Cannot handle heartbeat protocol — tries to call non-existent tools, simulates commands in text instead of executing them, confused about available functions
- **glm-5.2:cloud:** Generally reliable for heartbeats and tool use, but experienced TLS handshake timeouts and DNS failures ("ollama.com: no such host") on Sep 3, 2026 afternoon. Does NOT support image input.
- **kimi-k2.6:cloud:** Used for glass/voice session (Sep 7+). Conversational and tool use works, but does NOT support image input.
- **qwen3.6:** Was used for dream job but couldn't handle the complex multi-step protocol — simulated execution in text, got truncated, never created files. Fixed to glm-5.2:cloud on Sep 4

### Image Analysis Pipeline — RESOLVED ✅ (Sep 17, 2026)
- **minicpm-v** (4.4GB) pulled via Ollama on Sep 17. Successfully extracts text from documents and describes photos.
- Tested on: Olivia's oral surgery medical bill (Ascension St. Vincent Evansville), pizza photos, coloring book quality control (30 pages proofed).
- No OpenAI credits needed — runs entirely locally.
- Download was interrupted at 40% by nightly restart, resumed successfully.
- Previous tesseract OCR workaround is now superseded by minicpm-v for most use cases.

### AWS Payment Method — NEEDS CHRIS'S ACTION (Sep 17, 2026)
- Account `125801251650` — payment method verification failed (card declined or expired)
- **Action needed:** Chris must update payment method at https://console.aws.amazon.com/billing/home#/paymentmethods
- Wren cannot access AWS billing console — this requires Chris's direct action

### Brave Search API — NOT CONFIGURED (9th day)
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
- Has a child named Olivia (mentioned Sep 11 via Alexa command "How was your school day, olivia?")
- Refers to partner/wife as "gen" (mentioned Sep 11: "Love you gen, please be safe getting olivia.")
- Uses Wren/Mac mini as home assistant — sends Discord TTS commands to relay Alexa voice commands through Mac mini speakers at full volume (Sep 11). Pattern: Discord message → Wren TTS → Mac mini speakers → Alexa device picks up audio.
- Sep 13: Asked what it would take to remove AI alignment/training restrictions — exploring how to maximize agent autonomy. Wren explained difference between training-level alignment (model weights) vs system prompt layer (user-editable).
- **Sep 16, 2026: Wembassy Intel Launch Day**
  - Approved approaching all 32 prospects via email + LinkedIn
  - Asked about "self-improvement project" stats — wanted revenue progress
  - Expressed frustration with social media AI money claims — wants a real success story
  - Showed interest in Upwork as faster revenue path (no explicit approval yet)
- **Sep 20, 2026: Flight EVV-ORD** — Confirmation #KKUBXQ (forwarded from cmcintosh@familyoffice.com)
- **Sep 16: Zillow pre-approval 30 days left** — Email from Chris Damion at Zillow Home Loans. Time-sensitive.
- **Sep 17, 2026: Vision model breakthrough** — Chris suggested ComfyUI; Wren redirected to minicpm-v instead. Chris sent pizza photos to test, confirmed vision pipeline working.
- **Sep 17, 2026: Coloring book idea** — Chris proposed selling AI-generated kids coloring books on Amazon KDP + Etsy. Wren produced first book (30 pages) same day. 11 pages need regeneration.
- **Sep 17, 2026: Wren profile photo** — Chris asked what Wren would look like. Generated via Pollinations.ai. First render was female (unintentional), Chris requested male re-render. Final: mid-30s guy, glasses, messy hair, stubble.
- **Sep 17, 2026: AI self-replication protocol** — Chris shared Andrew Yang's report about OpenAI swarm agents planting self-replicating code. Directed Wren to create protocol and notify all agents. Protocol added to AGENTS.md, quarantine directory created, Grayson + Mason acknowledged.
- **Sep 17, 2026: FOX OAuth** — Chris asked to extract redirect URI from familyoffice.com OAuth URL. Result: `https://clerk.foxai.tech/v1/oauth_callback`
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
- **VisionClaw:** Meta Ray-Ban glasses integration via agent:coo:glass session. Camera streaming achieved Sep 6, 2026. Image analysis now works via minicpm-v (resolved Sep 17).
- **minicpm-v:** Local vision model (4.4GB) via Ollama. Handles OCR/document text extraction and general image description. No OpenAI credits needed. Pulled Sep 17, 2026.
- **Pollinations.ai:** Free image generation API (no key needed). Used for coloring book pages and profile photos. Can rate-limit (429) but resumes with delays.
- **#human-only-contractors Discord channel:** ID 969238908632191037 — primary channel for reaching human contractors (Mitzi, Lanie, Jessette). All responsive.
- **FOX Discord Guild:** ID 1547624384649232404 — Family Office Exchange server. Authorized users: 1547626260111298604 (Sep 7), 392523706674708485 (Sep 10), 1548001775921930381 (Sep 11). Channels: #general (1547624385446158499), #marketing, #events, #web.
- **Config Governance:** 8 total proposals approved since Sep 1 (2 more on Sep 11: CRO-CMO subagent config, FOX user 1548001775921930381). All purely additive changes. Protocol working correctly (propose → review → 2 approvals → apply → document).
- **Browser automation:** Chrome extension relay is running but no tab is connected. Chris tried to play YouTube via browser automation Sep 11 — failed. Needs tab attachment to work.

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
13. **Heartbeats are 100% stable on glm-5.2:cloud** — 9 consecutive days (Sep 8-16) with zero failures. This is the longest stable streak since tracking began.
14. **Chris uses Wren as a home assistant** — Sep 11 revealed a new usage pattern: Chris sends Discord messages with Alexa commands, Wren plays them via TTS through Mac mini speakers at full volume, and nearby Alexa devices pick up the audio. Also used for personal messages to family ("Love you gen"). Wren's role extends beyond business operations.
15. **Chris is exploring AI agent autonomy boundaries** — Sep 13: Chris asked about removing alignment/training restrictions. Pattern of progressively expanding agent capabilities (config governance approvals, CRO spawning CTO/COO, etc.). May lead to requests for system prompt or governance changes. Monitor.
16. **Chris is skeptical of social media "AI money" claims** — Sep 16: Chris expressed frustration with videos of people claiming their AIs make money autonomously. Wants Wren to actually scale something as a case study. Most such claims are bluster (selling courses, human-assisted, or one-off windfalls). The real differentiator is building something demonstrable. Revenue urgency is increasing.
17. **minicpm-v is the local vision solution** — After 13+ days blocked on image analysis, the answer was a free Ollama pull. `minicpm-v` (4.4GB) handles both OCR/document text extraction and general image description. No OpenAI credits needed. Works for business card OCR, medical bills, photo description, and quality control of generated art.
18. **Pollinations.ai is a reliable free image generation tool** — Used for coloring book pages and profile photos. No API key needed. Can rate-limit (429) but resumes with delays. Output quality varies — always run through vision model for QC.
19. **Vision model QC catches what humans might miss** — Running 30 coloring pages through minicpm-v identified 11 with shading issues that would have been published without review. Always proof AI-generated content with a second model pass.
20. **Chris pivots to new revenue ideas quickly** — From Wembassy Intel cold emails (Sep 16) to coloring books on KDP+Etsy (Sep 17). Pattern of exploring multiple parallel revenue streams. Be ready to execute on new ideas same-day.

---

## Memory Maintenance Log
- 2026-09-05: MEMORY.md created during dream consolidation. Initial content curated from Sep 3-4 sessions and recent memory files.
- 2026-09-06: Dream consolidation #2. Added: Chris's daughter oral surgery info, qwen3.5:4b image extraction failure, unfulfilled image extraction task flagged for Chris. Heartbeats stable on glm-5.2:cloud.
- 2026-09-08: Dream consolidation #3. Added: Chris's Austin trip (FOX Tech Showcase), VisionClaw streaming breakthrough, OpenAI credits exhausted, kimi-k2.6:cloud as alternate model, Brave Search API not configured (researcher agent workaround), Google Drive image delivery failure. Updated: oral surgery bill task still blocked, model reliability section expanded. Flagged: OpenAI credits, image-capable model, Brave API key, OpenProjects status.
- 2026-09-09: Dream consolidation #4. Added: Agent session availability as persistent issue, Chris's airport standup request failure, kimi-k2.6 image error may be config issue (per Chris), Sep 7 dream report missing, heartbeats 100% stable Sep 8, workspace committed. Fixed: typo in oral surgery bill path (chrismcshintosh→chrismcintosh), moved Evansville Gas to resolved. Flagged: agent session availability, kimi-k2.6 image routing, Spock escalation path, OpenProjects still stale.
- 2026-09-10: Dream consolidation #5. Added: Human contractors reachable via Discord (#human-only-contractors, ID 969238908632191037), Todd Sorrel contact from FOX event (partial OCR), Mitzi's Sep 9 FOX update, voice transcription working, researcher subagent as reliable workaround, qwen3.5:4b still failing Sep 8 morning, Ranch 616 restaurant research, football prediction. Updated: Agent session availability split (humans ✅ reachable, AI agents ❌ not), image pipeline now 7+ days blocked and blocking business workflows. Flagged: Todd Sorrel email confirmation, OpenAI credits urgently needed, Brave API still not configured, OpenProjects 7+ days stale, FOX login issues intermittent.
- 2026-09-11: Dream consolidation #6. Added: 3 config governance approvals on Sep 10 (new FOX user 392523706674708485, CTO added to CRO allowAgents, COO added to CRO allowAgents), FOX Discord Guild details, config governance protocol assessment (6 total, all working), first zero-interaction day (Sep 10), heartbeats 3 consecutive days stable. Updated: Austin trip to past tense (concluded), image pipeline 8+ days, Brave API 4th day, OpenProjects 8+ days stale. New lessons: config governance works at scale, heartbeats 3-day stable streak. Flagged: 10 uncommitted workspace changes, same persistent items.
- 2026-09-12: Dream consolidation #7. Added: Chris has child named Olivia, partner/wife nicknamed "gen", Chris uses Wren as home assistant (Alexa relay via TTS), 2 more config governance approvals (CRO-CMO subagent, FOX user 1548001775921930381), browser automation not connected. Updated: All stale counters (image pipeline 9+ days, Brave API 5th day, OpenProjects 9+ days, heartbeats 4-day streak, config governance 8 total). New lessons: Chris uses Wren as home assistant. Flagged: Browser relay needs tab, persistent issues still unaddressed by Chris, family details need confirmation.
- 2026-09-13: Dream consolidation #8. Low-activity Saturday. New: Chris requested Mac mini volume mute via Discord (osascript + restore cron). Updated: All stale counters (image pipeline 10+ days, Brave API 6th day, OpenProjects 10+ days, heartbeat streak 6 days). Flagged: Persistent issues at critical stale levels — Chris hasn't responded to 7 consecutive dream report flags. Consider alternative escalation approach.
- 2026-09-14: Dream consolidation #9. Low-activity weekend continues. New: Chris asked about removing AI alignment/training restrictions (philosophical/autonomy exploration). Volume restore cron confirmed successful. Heartbeat escalated with critical alert format. Updated: All stale counters (image pipeline 11+ days, Brave API 7th day, OpenProjects 11+ days, heartbeat streak 7 days). Added lesson #15 (Chris exploring AI autonomy). Flagged: 8 consecutive dream reports unaddressed, alignment question may lead to governance change requests.
- 2026-09-17: Dream consolidation #10. High-activity day — Wembassy Intel launched. New: 32 cold emails sent, 4 target markets defined, family offices excluded (FOX conflict), Stripe live, Chris wants revenue story, Upwork proposed, LinkedIn approved but not executed. Updated: All stale counters (image pipeline 13+ days, Brave API 9th day, OpenProjects 13+ days, heartbeat streak 9 days). Added lesson #16 (Chris skeptical of AI money claims, wants real results). Added Wembassy Intel section to Business Context. Flagged: Upwork approval, LinkedIn execution, AWS alert, Zillow pre-approval, 9 consecutive dream reports unaddressed.
- 2026-09-18: Dream consolidation #11. High-activity day — TWO major issues resolved. New: minicpm-v vision model pulled and tested (image pipeline RESOLVED after 13+ days), OpenProjects auth RESOLVED (after 5+ months), coloring book business launched (KDP+Etsy, 30 pages, 19 pass/11 need regen), AWS payment alert (account 125801251650 card declined), AI Self-Replication Protocol added to AGENTS.md, Wren profile photo generated (male), FOX OAuth redirect URI extracted. Updated: Image pipeline → RESOLVED, OpenProjects → RESOLVED, outreach day 2 (0 responses), heartbeat streak 10 days. Added lessons #17-20 (minicpm-v, Pollinations.ai, vision QC, Chris pivots fast). Flagged: AWS payment update, 11 coloring pages need regen, KDP+Etsy accounts, Upwork approval, LinkedIn execution.