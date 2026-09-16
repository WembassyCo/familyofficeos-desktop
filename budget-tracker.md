# Wembassy Intel — Autonomous Spending Budget

**Created:** September 15, 2026
**Monthly Budget:** $25.00
**Funding Source:** Stripe (Chris McIntosh)
**Stripe Keys:** Stored in macOS Keychain (not in files)

---

## Budget Rules

1. **Total monthly spend cannot exceed $25.00** without Chris's explicit approval
2. **Every charge must be logged here** with: date, amount, vendor, purpose, ROI
3. **Brave Search API usage should be minimized** — use researcher agent (web_fetch) and VPS for routine searches. Reserve Brave for high-value queries only.
4. **Review monthly** — present spending + ROI to Chris at end of each month
5. **No charges over $10 without logging to memory file the same day**
6. If monthly budget is approaching limit, stop all non-essential spending and notify Chris

---

## Search Strategy (Minimize Brave Usage)

**Free alternatives (use these first):**
1. **Researcher agent** — `web_fetch` can fetch and extract content from any URL without Brave
2. **VPS** — can run web scraping scripts, curl, etc.
3. **Mac Mini** — local processing, `curl`, `wget`, etc.
4. **Browser tool** — can navigate to search engines directly

**Brave API reserved for:**
- Quick lookups during heartbeat (1-2 searches max per cycle)
- High-value research where structured search results are needed
- Time-sensitive queries where web_fetch is too slow

**Target usage:** <100 Brave searches/month (of 6,000 available) — keep costs minimal

---

## Spending Log

| Date | Amount | Vendor | Purpose | ROI | Brave Searches Used | Running Balance |
|------|--------|--------|---------|-----|---------------------|-----------------|
| Sep 15 | $0.00 | — | — | — | 1 (test) | $25.00 remaining |

---

## Stripe Configuration

- **Publishable key:** `security find-generic-password -a "wembassy" -s "stripe-publishable-key" -w`
- **Secret key:** `security find-generic-password -a "wembassy" -s "stripe-secret-key" -w`
- **Account:** Chris McIntosh's Stripe account (mostly idle)

---

## Monthly Review Template

```
## [Month] Budget Review

- Total spent: $X.XX
- Remaining: $X.XX
- Brave searches used: X / 6000
- ROI summary: [what each purchase produced]
- Recommendation for next month: [increase/decrease/maintain budget]
```

---

*This file is tracked in git for transparency. API keys are NOT stored here — they live in macOS Keychain.*