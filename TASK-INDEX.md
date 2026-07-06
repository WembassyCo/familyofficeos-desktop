# FamilyOfficeOS Desktop - Task Index

**Project:** https://github.com/WembassyCo/familyofficeos-desktop  
**Status:** Task Breakdown In Progress  
**Last Updated:** July 6, 2026

---

## Overview

This project is a 12-week Electron-based desktop application build to replicate the Family Office OS web platform. The work is broken into 5 sequential phases, each with detailed tasks that can be assigned to agents.

---

## Phase Breakdown

| Phase | Duration | Focus | Task File | Status |
|-------|----------|-------|-----------|--------|
| **Phase 1** | Weeks 1-4 | Foundation | [TASKS-PHASE1.md](./TASKS-PHASE1.md) | 🟡 In Progress |
| **Phase 2** | Weeks 5-6 | Core CRM | [TASKS-PHASE2.md](./TASKS-PHASE2.md) | 🟡 In Progress |
| **Phase 3** | Weeks 7-8 | Governance | [TASKS-PHASE3.md](./TASKS-PHASE3.md) | 🟡 In Progress |
| **Phase 4** | Weeks 9-10 | Wealth Intelligence | [TASKS-PHASE4.md](./TASKS-PHASE4.md) | 🟡 In Progress |
| **Phase 5** | Weeks 11-12 | Family Education | [TASKS-PHASE5.md](./TASKS-PHASE5.md) | 🟡 In Progress |

---

## Phase Summaries

### Phase 1: Foundation (Weeks 1-4)
**Prerequisites:** None

1. Project Setup
   - Electron + Vite + React + TypeScript
   - Build configuration
   - Directory structure

2. Authentication
   - Login screen with Drupal integration
   - Biometric unlock (Face ID/Touch ID/Windows Hello)
   - Secure credential storage (Keychain/Keystore)
   - Session management

3. Core Layout
   - TopBar with connection status
   - Collapsible Sidebar
   - MainContent area
   - Design System V2 implementation

4. Initial CRM
   - Contacts CRUD
   - Organizations CRUD
   - Basic list/detail views

---

### Phase 2: Core CRM (Weeks 5-6)
**Prerequisites:** Phase 1 complete

1. Sales Pipeline
   - Leads management
   - Opportunities with Kanban view
   - Stage transitions

2. Financial Documents
   - Quotes lifecycle
   - Orders management
   - Invoices and payments

3. CSV Import
   - File upload with drag-drop
   - Column mapping UI
   - Duplicate detection

4. Projects
   - Project CRUD
   - Tasks with status
   - Time tracking
   - Milestones

---

### Phase 3: Governance (Weeks 7-8)
**Prerequisites:** Phase 1-2 complete

1. Charter Management
   - PDF document viewer
   - Amendment tracking

2. Decision & Voting
   - Decision creation
   - Parliamentary procedure (motion/second)
   - Real-time voting UI
   - Vote tallying

3. Meetings
   - Scheduling
   - Agenda builder
   - Minutes attachment

4. Roles & Permissions
   - Role management
   - Permission matrix

---

### Phase 4: Wealth Intelligence (Weeks 9-10)
**Prerequisites:** Phase 1-3 complete

1. Plaid Integration
   - Account connection
   - Transaction sync
   - Balance tracking

2. Portfolio Dashboard
   - Net worth chart
   - Asset allocation
   - Performance metrics

3. Asset Management
   - Real estate properties
   - Private equity funds
   - Public securities
   - Illiquid assets

4. Analytics
   - TWR calculations
   - IRR for PE
   - Benchmark comparison

---

### Phase 5: Family Education (Weeks 11-12)
**Prerequisites:** Phase 1-4 complete

1. Course Management
   - Course CRUD
   - Templates
   - Chapter organization

2. AI Generation v2
   - Research phase
   - Outline generation
   - Content generation
   - SSE streaming progress

3. Video Player
   - Native playback
   - Download for offline
   - Progress tracking

4. Skills Tracking
   - User skills
   - Certifications
   - Progress tracking

---

## Agent Assignment Strategy

### Recommended Agent Roles

| Agent | Phase(s) | Focus Area |
|-------|----------|------------|
| **Spock (CTO)** | All | Technical architecture, Electron main process, native integrations |
| **Mitzi** | 1, 2 | UI components, React frontend, CSS/Design System |
| **Knox (QA)** | All | Test coverage, E2E tests with Playwright |
| **R2D2** | 4, 5 | API research, Plaid integration, HeyGen API |
| **Grayson** | - | Requirements review, user acceptance |

---

## Key Technical Decisions

### Tech Stack
- **Framework:** Electron 28+
- **Frontend:** React 18 + TypeScript 5
- **Build:** Vite + electron-vite
- **State:** Zustand
- **Styling:** TailwindCSS + Design System V2
- **Charts:** Recharts
- **Testing:** Playwright (E2E), Vitest (Unit)
- **Local DB:** better-sqlite3 (encrypted)

### Design System
Reuse existing `fox_license/gateway-app/src/index.css`
- CSS Variables for theming
- Component classes: `fox-btn`, `fox-panel`, `fox-card`, etc.
- Lucide React for icons

---

## API Reference Quick Links

| Module | Base Path |
|--------|-----------|
| Auth | `/user/login` |
| Directory | `/fox-daemon/api/directory/{container}/` |
| Governance | `/fox-daemon/api/governance/{container}/` |
| Education v1 | `/api/v1/fos/{container}/education/` |
| Education v2 | `/api/v2/fos/{container}/education/` |
| Wealth | `/api/wealth/` |

---

## Getting Started

### For Developers

1. Clone repo: `git clone https://github.com/WembassyCo/familyofficeos-desktop.git`
2. Review PRD: [PRD.md](./PRD.md)
3. Check current phase: See Phase Summary above
4. Pick next unassigned task from phase task file

### For Project Managers

1. Start with Phase 1 tasks
2. Assign tasks sequentially (dependencies matter)
3. Each task is designed for 4-8 hour completion
4. Review Definition of Done before marking complete

---

## Sub-Agents Working On This

| Sub-Agent | Task | Session Key |
|-----------|------|-------------|
| Archer (PRD) | Phase 1 Tasks | `agent:prd:subagent:5a8e2267-a875-471b-b3db-a2e9d3238932` |
| Archer (PRD) | Phase 2 Tasks | `agent:prd:subagent:90221ce8-4f62-4de5-ad17-5806df3d60ea` |
| Archer (PRD) | Phase 3 Tasks | `agent:prd:subagent:0b5a5e2e-f513-4dd2-8c77-a2565456bbc4` |
| Archer (PRD) | Phase 4 Tasks | `agent:prd:subagent:01554aba-2604-43ea-940d-328a4ee260c7` |
| Archer (PRD) | Phase 5 Tasks | `agent:prd:subagent:8ddf5b06-4c63-4c44-a7ff-1623fd427e41` |

---

## Notes

- Tasks are sequential within each phase
- Phases can overlap once dependencies are clear
- Each task has explicit Definition of Done
- Estimated hours are for experienced developers
- Review PRD Section 5 for complete API documentation

---

**Next Steps:**
1. Wait for sub-agents to complete task breakdowns
2. Review and approve task files
3. Begin assigning Phase 1 tasks to Spock/Mitzi
4. Set up CI/CD pipeline for automated builds

---

*Generated by Wren (COO) - July 6, 2026*