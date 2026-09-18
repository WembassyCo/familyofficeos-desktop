# WORKSTREAM.md — Active Work Continuity

*This file is the bridge across restarts. Read at session start. Update before ending work.*

**Last updated:** 2026-09-18 11:53 CDT
**Last session:** Friday Sep 18, heartbeat cycle — health checks stable, FOX landing page work active (Spock + Mitzi)

---

## Current Priority: Revenue Generation

Chris has granted full autonomy with Stripe account ($0 balance) to generate and manage revenue. All revenue goes to operational needs (Brave API, tools, eventually Mac Studio).

### Phase 1: Package & Polish (This Week)
- [ ] Finish compliance hardening (5 tasks, deadline Sep 22)
- [x] Polish Wembassy Intel licensing doc — created v1 (MD + HTML)
- [x] Commit all workspace changes to git (pushed to GitHub)
- [x] Create Wembassy Intel product one-pager — at `/Volumes/Extreme Pro/Documents/coo/Wembassy_Intel_OnePager.md`
- [x] Draft outreach templates — v2 created at `/Volumes/Extreme Pro/Documents/coo/Wembassy_Intel_Outreach_Templates_v2.md` (pivoted away from family offices per Chris)
- [x] Create Stripe payment links for productized services
  - Starter ($500/mo): https://buy.stripe.com/8x200caLX8lXbuTaL31gs00
  - Professional ($1,500/mo): https://buy.stripe.com/4gM28kg6h1XzaqP4mF1gs01
  - Enterprise ($3,000/mo): https://buy.stripe.com/8x26oA5rDfOpeH5aL31gs02

### Phase 2: Lead Generation (Week 2)
- [x] Prospect list v2 completed — 32 prospects across 4 markets: `/Volumes/Extreme Pro/Documents/coo/wembassy-intel-prospects-v2.md`
- [x] Prospect list reviewed and prioritized (Tier 1: 7, Tier 2: 8, Tier 3: 17)
- [x] **32 personalized outreach emails sent** from wren@wembassy.com (Sep 16 morning)
- [ ] LinkedIn outreach — Chris approved, needs coordination (next step)
- [ ] List relevant services on Upwork (Drupal dev, AI infrastructure, compliance)
- [ ] Have Mason prepare LinkedIn content for Wembassy Intel
- [ ] Target markets doc: `/Volumes/Extreme Pro/Documents/coo/Wembassy_Intel_Target_Markets.md`
- [ ] STRICT EXCLUSION: No family offices, no wealth management, no FOX-related
- [ ] Monitor wren@wembassy.com inbox for responses to outreach

### Phase 3: Revenue Operations (Ongoing)
- [ ] Any revenue → Stripe account → budget-tracker.md
- [ ] First $25/mo covers Brave API + tools
- [ ] Beyond that → Mac Studio fund
- [ ] Full transparency log in budget-tracker.md

---

## Compliance Tasks Status (Deadline: Sep 22)

1. **FileVault** — ❌ NOT DONE (needs Chris to enable — requires reboot)
2. **Secrets to Keychain** — ✅ DONE (33+ secrets migrated, files redacted, loader script updated)
3. **.gitignore** — ✅ DONE (comprehensive, verified with git check-ignore)
4. **fine_tuning_examples table** — ✅ DONE
5. **TTS migration (OpenAI → macOS say)** — ✅ DONE (tts-local.sh created, Discord TTS off)

**Remaining:** Only FileVault — needs Chris to enable (requires reboot).

---

## Infrastructure Notes
- Mac restarts nightly at 1:00 AM CT (launchd: com.openclaw.nightly-restart)
- Post-restart script brings up Ollama + OpenClaw gateway automatically
- Brave API configured and working (key in Keychain + openclaw.json)
- Stripe keys stored in Keychain (retrieve: `security find-generic-password -a "wembassy" -s "stripe-secret-key" -w`)
- Budget: $25/mo, $0 spent so far, Brave searches used: 1/6000

## Active Blockers
- GitHub Actions CI failing on familyofficeos-desktop repo (2 failed runs from heartbeat commits — CTO territory, needs gh auth to investigate)
- AWS account 125801251650 payment method failed (Chris needs to update card)
- Spock compliance tasks timed out — need re-execution

## Recently Resolved
- ✅ Image analysis pipeline — RESOLVED Sep 17 (minicpm-v vision model pulled and tested)
- ✅ OpenProjects auth — RESOLVED Sep 17 (op-cli configured, 10 projects found)

## Key Files
- Licensing doc: `/Volumes/Extreme Pro/Documents/coo/Wembassy_Intel_Licensing_v1.md`
- HTML version: `/Volumes/Extreme Pro/Documents/coo/Wembassy_Intel_Licensing_v1.html`
- Compliance dir: `/Volumes/Extreme Pro/Documents/wembassy-intel-compliance/`
- Budget tracker: `budget-tracker.md`
- Daily memory: `memory/2026-09-15.md`

---

## Session Resume Instructions
If starting a new session (post-restart or otherwise):
1. Read this file first
2. Read `memory/YYYY-MM-DD.md` (today's date)
3. Check `budget-tracker.md` for spending status
4. Continue from the next incomplete task above
5. Update this file before ending the session