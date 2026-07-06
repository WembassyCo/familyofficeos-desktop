# Product Requirements Document (PRD)
# FamilyOfficeOS Desktop Application

**Version:** 1.0.0  
**Date:** July 6, 2026  
**Author:** Wren (COO, Wembassy)  
**Status:** Draft  
**Target Platforms:** macOS, Windows, Linux  
**MVP Timeline:** 12 weeks

---

## 1. Executive Summary

### 1.1 Purpose

FamilyOfficeOS Desktop is an Electron-based cross-platform application that replicates the functionality of the Family Office OS (Fox in a Box) web platform as a native desktop experience. The application provides family offices with secure, offline-capable access to their wealth intelligence platform.

### 1.2 Target Users

- Family office executives and staff
- High-net-worth individuals
- Wealth managers and advisors
- Governance committees and board members
- Family members accessing education content

### 1.3 Success Criteria

| Metric | Target |
|--------|--------|
| Feature Parity | 100% of web features replicated |
| Performance | < 2s initial load, < 100ms local DB queries |
| Offline Capability | Full read access, queued writes offline |
| Platform Support | macOS 12+, Windows 10+, Ubuntu 20.04+ |
| Security | SOC 2 Type II compliance ready |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │   Login     │ │  Dashboard  │ │   Module    │ │  Settings   │     │
│  │   Screen    │ │    View     │ │   Views     │ │    Panel    │     │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │
│                          React 18 + TypeScript                       │
├─────────────────────────────────────────────────────────────────────┤
│                       RENDERER PROCESS                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │   Zustand    │ │  API Client   │ │  Sync Queue  │ │   Cache     │ │
│  │    Store     │ │   (Axios)     │ │   Manager    │ │  Service    │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      ELECTRON MAIN PROCESS                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │   Window     │ │     IPC      │ │    Secure    │ │   Native     │ │
│  │   Manager    │ │   Bridge     │ │   Storage    │ │   Services   │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                         PLATFORM LAYER                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Keychain/   │ │    SQLite    │ │     WebSocket │ │  Auto-Update │ │
│  │  Keystore    │ │    Engine     │ │     Client    │ │   Service    │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      EXTERNAL SERVICES                               │
│     Drupal Backend    │    Plaid API    │   HeyGen API              │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ fos.wembassy.com │  │   OpenBanking │  │   Video Generation   │   │
│  │   (JSON:API)     │  │   Aggregation │  │                      │   │
│  └─────────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

#### 2.2.1 Main Process (Node.js/Electron)

| Component | Responsibility | Key Files |
|-----------|----------------|-----------|
| **Entry Point** | App lifecycle, single instance lock | `main/index.ts` |
| **Window Manager** | Create/manage browser windows | `main/window.ts` |
| **IPC Handlers** | Secure communication bridge | `main/ipc/*.ts` |
| **Auto-Updater** | Silent updates via Squirrel/NSIS | `main/services/auto-update.ts` |
| **Native Storage** | Keychain/Credential Manager | `main/services/keychain.ts` |
| **Tray Manager** | System tray icon/menu | `main/services/tray.ts` |
| **Notifications** | Native OS notifications | `main/services/notifications.ts` |

#### 2.2.2 Renderer Process (React)

| Module | Components | State |
|--------|-----------|-------|
| **Layout** | TopBar, Sidebar, MainContent, RightPanel | `layoutStore` |
| **Directory** | ContactList, OrgGrid, PipelineView, QuoteForm | `directoryStore` |
| **Governance** | DecisionList, VotingPanel, MeetingView, CharterView | `governanceStore` |
| **Wealth** | AccountList, PortfolioChart, AssetDetail, TransactionView | `wealthStore` |
| **Education** | CourseList, VideoPlayer, GenerationProgress | `educationStore` |
| **Common** | Modal, Table, Form, Button, Input, Badge | N/A |

### 2.3 Data Flow

```
User Action → React Component → Zustand Store → API Client
                                                     ↓
Cache Update ← Local DB ← Sync Queue ← Offline Check
                     ↓
              API Request → Drupal Backend
                     ↓
              Response → Cache Update → UI Update
```

---

## 3. Feature Requirements

### 3.1 Authentication & Security

#### 3.1.1 Login Flow

**User Story:** As a user, I want to log in securely so that I can access my family office data.

**Acceptance Criteria:**
- [ ] Login form with email/password fields
- [ ] POST to `/user/login` with Drupal credentials
- [ ] Session cookie extraction and storage
- [ ] Container selection dropdown (if multiple containers)
- [ ] "Remember me" option with secure keychain storage
- [ ] Biometric unlock after first successful login
- [ ] Auto-lock after configurable timeout (default: 15 min)

**Technical Specs:**
- Credentials stored in platform secure storage
- Session cookie managed by Electron's session API
- Biometric auth via `@node-soap/biometrics` or platform APIs

#### 3.1.2 Session Management

**User Story:** As a user, I want my session to persist securely across app restarts.

**Acceptance Criteria:**
- [ ] Secure credential storage in OS keychain
- [ ] Session refresh before expiry (2 weeks default)
- [ ] Re-authentication prompt on 401 responses
- [ ] Quick unlock with biometrics (Face ID / Touch ID / Windows Hello)
- [ ] Manual logout clears all local data

**Technical Specs:**
```typescript
// Secure storage schema
interface SecureCredentials {
  username: string;
  encryptedPassword: string; // AES-256-GCM
  containerId: string;
  sessionCookie?: string;
  lastLogin: Date;
  biometricEnabled: boolean;
}
```

#### 3.1.3 Security Features

**Acceptance Criteria:**
- [ ] Certificate pinning for API endpoints
- [ ] Screenshot blocking on sensitive screens (optional)
- [ ] Secure clipboard handling
- [ ] App sandboxing and code signing
- [ ] Audit logging for sensitive operations

### 3.2 Core UI/UX

#### 3.2.1 Layout System

**User Story:** As a user, I want a consistent layout across all modules.

**Acceptance Criteria:**
- [ ] TopBar with connection status, notifications, user menu
- [ ] Collapsible Sidebar with module navigation
- [ ] MainContent area for module content
- [ ] RightPanel for contextual information (optional)
- [ ] Responsive design for window resizing
- [ ] Dark theme (matching web Design System V2)

**Design System:**
- Use existing CSS classes from `fox_license/gateway-app/src/index.css`
- CSS Variables for theming
- TailwindCSS for utility classes
- Lucide React for icons

#### 3.2.2 Navigation

**Acceptance Criteria:**
- [ ] Sidebar icons for all modules
- [ ] Keyboard shortcuts (Cmd/Ctrl+1-9 for modules)
- [ ] Breadcrumb navigation in sub-views
- [ ] Back button for drill-down navigation
- [ ] Recently viewed quick access

### 3.3 Directory/CRM Module

#### 3.3.1 Contacts Management

**User Story:** As a user, I want to manage contacts and organizations.

**Acceptance Criteria:**
- [ ] Contact list view (table + card toggle)
- [ ] Contact detail view with full information
- [ ] Add/Edit/Delete contact with validation
- [ ] Organization association
- [ ] Tag-based categorization
- [ ] Search and filter by name, email, tags
- [ ] Bulk operations (select multiple, delete, export)
- [ ] CSV import with mapping UI

**API Endpoints:**
```
GET    /fox-daemon/api/directory/{container}/contacts
POST   /fox-daemon/api/directory/{container}/contacts
GET    /fox-daemon/api/directory/{container}/contacts/{id}
PUT    /fox-daemon/api/directory/{container}/contacts/{id}
DELETE /fox-daemon/api/directory/{container}/contacts/{id}
POST   /fox-daemon/api/directory/{container}/import/csv
```

#### 3.3.2 Organizations

**User Story:** As a user, I want to manage organizations and their contacts.

**Acceptance Criteria:**
- [ ] Organization list view
- [ ] Organization detail with related contacts
- [ ] CRUD operations for organizations
- [ ] Organization hierarchy visualization
- [ ] Industry and type categorization

#### 3.3.3 Sales Pipeline

**User Story:** As a user, I want to track leads and opportunities through a sales pipeline.

**Acceptance Criteria:**
- [ ] Lead list with status filters
- [ ] Kanban view for opportunity stages
- [ ] Lead conversion to contact/opportunity
- [ ] Opportunity line items and documents
- [ ] Pipeline value calculations
- [ ] Win/loss tracking

**Stages:**
```
Lead → Qualified → Proposal → Negotiation → Closed (Won/Lost)
```

#### 3.3.4 Quotes, Orders, Invoices

**User Story:** As a user, I want to manage the full quote-to-cash lifecycle.

**Acceptance Criteria:**
- [ ] Quote creation with line items
- [ ] Quote send/accept/reject/revise workflow
- [ ] Order creation from quotes
- [ ] Order lifecycle: confirm → process → ship → invoice → pay
- [ ] Invoice generation and payment tracking
- [ ] Late fee calculation
- [ ] PDF generation for quotes/invoices

#### 3.3.5 Contracts

**Acceptance Criteria:**
- [ ] Contract creation with line items
- [ ] Contract lifecycle: draft → active → renew/cancel
- [ ] Amendment tracking
- [ ] Activity logging
- [ ] Document attachments

#### 3.3.6 Projects

**Acceptance Criteria:**
- [ ] Project list with status/priority filters
- [ ] Project detail with tabs: Overview, Tasks, Team, Milestones, Time, Expenses
- [ ] Task management with status transitions
- [ ] Time entry tracking with approval workflow
- [ ] Expense tracking with receipt attachments
- [ ] Gantt chart visualization (optional v2)

#### 3.3.7 CSV Import

**Acceptance Criteria:**
- [ ] Drag-and-drop file upload (.csv, .tsv, .xlsx)
- [ ] Auto-delimiter detection
- [ ] Fuzzy column name matching
- [ ] Data preview with validation errors
- [ ] Duplicate detection with merge options
- [ ] Progress tracking for large imports
- [ ] Import history log

### 3.4 Governance Module

#### 3.4.1 Digital Charter/Bylaws

**User Story:** As a user, I want to manage family office governance documents.

**Acceptance Criteria:**
- [ ] Charter document upload (PDF)
- [ ] Amendment tracking with version history
- [ ] Section navigation with bookmarks
- [ ] Annotation and commenting (optional v2)

#### 3.4.2 Decisions & Voting

**User Story:** As a user, I want to create and vote on decisions using parliamentary procedure.

**Acceptance Criteria:**
- [ ] Decision creation with description and options
- [ ] Motion proposing and seconding
- [ ] Vote casting with anonymous/public toggle
- [ ] Real-time vote tally display
- [ ] Decision timeline visualization
- [ ] Activation/execution workflow
- [ ] Impact assessment documentation

**Voting Options:**
- Single choice (Yes/No/Abstain)
- Multiple choice (select one)
- Ranked choice (optional v2)

#### 3.4.3 Meetings

**Acceptance Criteria:**
- [ ] Meeting scheduling with calendar integration
- [ ] Agenda builder
- [ ] Attendee management
- [ ] Minutes document attachment
- [ ] Action item tracking
- [ ] Meeting notifications

#### 3.4.4 Roles & Permissions

**Acceptance Criteria:**
- [ ] Role definition and assignment
- [ ] Permission matrix view
- [ ] Role-based access control
- [ ] Family member role assignments

### 3.5 Wealth Intelligence Module

#### 3.5.1 Account Aggregation

**User Story:** As a user, I want to connect my bank accounts and see all my wealth in one place.

**Acceptance Criteria:**
- [ ] Plaid Link integration for account connection
- [ ] Support for 12,000+ US institutions
- [ ] Automatic transaction and holdings sync
- [ ] Account categorization (Checking, Savings, Investment, etc.)
- [ ] Balance history tracking
- [ ] Multi-currency support (optional v2)

**API Endpoints:**
```
POST   /api/wealth/plaid/link-token
POST   /api/wealth/plaid/exchange-token
GET    /api/wealth/accounts
POST   /api/wealth/accounts/{id}/sync
GET    /api/wealth/accounts/{id}/transactions
GET    /api/wealth/accounts/{id}/holdings
```

#### 3.5.2 Asset Management

**User Story:** As a user, I want to track all my assets including real estate and private equity.

**Acceptance Criteria:**
- [ ] Asset list with filtering by type
- [ ] Real estate: address, NOI, cap rate, DSCR
- [ ] Private equity: fund, IRR, TVPI, DPI
- [ ] Public markets: ticker, shares, current price
- [ ] Illiquid assets: manual valuation
- [ ] Asset document attachments

#### 3.5.3 Portfolio Analytics

**User Story:** As a user, I want to see my portfolio performance over time.

**Acceptance Criteria:**
- [ ] Net worth history chart
- [ ] Asset allocation pie chart + history
- [ ] Time-Weighted Return (TWR) calculation
- [ ] Internal Rate of Return (IRR) for PE
- [ ] Benchmark comparison (S&P 500)
- [ ] Top performers list
- [ ] Income history tracking
- [ ] J-Curve visualization for PE funds

**Charts:**
- Line charts for net worth over time
- Stacked area for allocation history
- Pie charts for current allocation
- Bar charts for performance comparison

#### 3.5.4 AI Document Processing

**User Story:** As a user, I want AI to extract data from my investment documents.

**Acceptance Criteria:**
- [ ] Upload capital calls, K-1s, NAV reports
- [ ] AI extraction with confidence scoring
- [ ] Auto-approval for ≥95% confidence
- [ ] Human review queue for low confidence
- [ ] Extracted data mapping to asset records

### 3.6 Family Education Module

#### 3.6.1 Course Management

**User Story:** As a user, I want to create and manage educational courses.

**Acceptance Criteria:**
- [ ] Course list with status filters (draft, published, archived)
- [ ] Course editor with WYSIWYG content
- [ ] Chapter and resource organization
- [ ] Course templates
- [ ] Archive/unarchive functionality

#### 3.6.2 AI Course Generation (v2)

**User Story:** As a user, I want AI to generate complete courses from a topic.

**Acceptance Criteria:**
- [ ] Topic input for research phase
- [ ] Web search for background research
- [ ] AI-generated course outline
- [ ] Multi-phase generation (research → outline → content)
- [ ] Real-time progress via SSE streaming
- [ ] Chapter preview during generation
- [ ] Cancel and resume capabilities
- [ ] HeyGen video generation integration
- [ ] Video download and local caching

**Generation Phases:**
```
Phase 1: Research → Outline (web search + AI)
Phase 2: Start Content Generation (async)
Phase 3: Content Generation with SSE progress stream
```

**API Endpoints:**
```
POST   /api/v2/fos/{container}/education/generate-course/research
POST   /api/v2/fos/{container}/education/generate-course/outline
POST   /api/v2/fos/{container}/education/generate-course/content
POST   /api/v2/fos/{container}/education/generate-course/content/async
GET    /api/v2/fos/{container}/education/generate-course/stream (SSE)
GET    /api/v2/fos/{container}/education/generate-course/status/{job_id}
```

#### 3.6.3 Video Player

**Acceptance Criteria:**
- [ ] Native video playback (MP4, WebM)
- [ ] Adaptive quality based on bandwidth
- [ ] Download for offline viewing
- [ ] Progress tracking and resume
- [ ] Closed captions support

#### 3.6.4 User Skills

**Acceptance Criteria:**
- [ ] Skill creation and assignment
- [ ] Progress tracking
- [ ] Certification management
- [ ] Skill assessment quizzes

### 3.7 Watchlist Module

**User Story:** As a user, I want to monitor news stories about topics I care about.

**Acceptance Criteria:**
- [ ] Watchlist entry CRUD
- [ ] News story aggregation
- [ ] Automated scanning schedule
- [ ] Story reading with source links
- [ ] Saved stories collection

### 3.8 Voice Module

**User Story:** As a user, I want speech-to-text and text-to-speech capabilities.

**Acceptance Criteria:**
- [ ] Audio recording with Whisper transcription
- [ ] Language selection
- [ ] Text-to-speech with voice options (Piper)
- [ ] Audio file export

**API Endpoints:**
```
POST   /fox-daemon/api/voice/transcribe
GET    /fox-daemon/api/voice/voices
```

### 3.9 Sync & Integration

#### 3.9.1 Offline Support

**User Story:** As a user, I want to access my data even without internet.

**Acceptance Criteria:**
- [ ] Local SQLite database for all entities
- [ ] Read operations work offline
- [ ] Write operations queued for sync
- [ ] Conflict detection and resolution UI
- [ - Sync status indicator
- [ ] Background sync when online

**Sync Queue Schema:**
```typescript
interface SyncQueueItem {
  id: string;
  entityType: 'contact' | 'organization' | 'decision' | ...;
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: unknown;
  timestamp: Date;
  retryCount: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'COMPLETED';
  errorMessage?: string;
}
```

#### 3.9.2 External Integrations

**Acceptance Criteria:**
- [ ] Google Contacts sync
- [ ] Microsoft 365 sync
- [ ] Calendar integration (iCal, Google, Outlook)
- [ ] File cloud mounts (Google Drive, Dropbox, OneDrive)
- [ ] Webhook management
- [ ] Conflict resolution UI

### 3.10 Notifications

**User Story:** As a user, I want to be notified about important events.

**Acceptance Criteria:**
- [ ] Native OS notifications
- [ ] Notification categories: Decisions, Meetings, Sync, System
- [ ] In-app notification center
- [ ] Notification preferences
- [ ] Badge counts on app icon
- [ ] Tray notifications

### 3.11 Settings

**Acceptance Criteria:**
- [ ] Account settings (profile, password)
- [ ] Container settings (if admin)
- [ ] Notification preferences
- [ ] Display preferences (theme, font size)
- [ ] Offline settings (cache size, auto-sync)
- [ ] Security settings (biometric, auto-lock)
- [ ] Integration management
- [ ] Export data

---

## 4. Technical Requirements

### 4.1 Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Cold Start | < 3 seconds |
| Warm Start | < 1 second |
| Local DB Query | < 50ms |
| API Response | < 500ms (p95) |
| UI Interaction | 60 FPS target |
| Memory Usage | < 500MB typical |
| Bundle Size | < 100MB installer |

### 4.2 Platform Support

| Platform | Minimum Version | Architecture |
|----------|-----------------|--------------|
| macOS | 12.0 (Monterey) | Intel, Apple Silicon |
| Windows | 10 (Build 19041+) | x64, ARM64 |
| Linux | Ubuntu 20.04+ | x64, ARM64 |

### 4.3 Security Requirements

- Code signing for all platforms
- Certificate pinning for API calls
- Encrypted SQLite with SQLCipher
- Secure credential storage
- App sandboxing
- CSP headers in renderer
- No eval() or unsafe-inline scripts
- Dependency vulnerability scanning

### 4.4 Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Adjustable font sizes
- Reduced motion support

---

## 5. API Reference Summary

### 5.1 Authentication

```bash
# Login
POST /user/login
Content-Type: application/json

{
  "name": "username",
  "pass": "password"
}

# Returns: Set-Cookie header with session
```

### 5.2 Container Resolution

```bash
# Get user's containers
GET /jsonapi/fox_container/fox_container
Cookie: SESSxxxxx=xxxxx

# Returns containers the user has access to
```

### 5.3 Module Endpoints

| Module | Base Path |
|--------|-----------|
| Directory | `/fox-daemon/api/directory/{container_name}/` |
| Governance | `/fox-daemon/api/governance/{container_name}/` |
| Education v1 | `/api/v1/fos/{container_name}/education/` |
| Education v2 | `/api/v2/fos/{container_name}/education/` |
| Wealth | `/api/wealth/` |
| Watchlist | `/api/v1/watchlist` |
| Voice | `/fox-daemon/api/voice/` |

### 5.4 WebSocket Gateway

```
URL: wss://fos.wembassy.com/ws/container/{container_name}/gateway

Events:
- chat.message
- sync.update
- course.generation.progress
- decision.vote
- notification
```

---

## 6. User Stories Summary

### Phase 1: Foundation (Weeks 1-4)
- [ ] US-001: Login with secure credential storage
- [ ] US-002: Biometric unlock
- [ ] US-003: Basic layout with navigation
- [ ] US-004: Contacts list and detail view
- [ ] US-005: Organizations management

### Phase 2: Core CRM (Weeks 5-6)
- [ ] US-006: Sales pipeline (Leads, Opportunities)
- [ ] US-007: Quotes and Orders
- [ ] US-008: Invoices and Payments
- [ ] US-009: CSV import

### Phase 3: Governance (Weeks 7-8)
- [ ] US-010: Charter document management
- [ ] US-011: Decision creation and voting
- [ ] US-012: Meeting scheduling

### Phase 4: Wealth (Weeks 9-10)
- [ ] US-013: Plaid account connection
- [ ] US-014: Portfolio dashboard
- [ ] US-015: Asset management
- [ ] US-016: Performance analytics

### Phase 5: Education (Weeks 11-12)
- [ ] US-017: Course management
- [ ] US-018: AI course generation v2
- [ ] US-019: Video player with download

### Phase 6: Polish (Post-MVP)
- [ ] US-020: Full offline support
- [ ] US-021: Mobile responsive (if needed)
- [ ] US-022: Advanced reporting

---

## 7. Open Questions

1. **Data Migration**: Do we need to migrate existing web app user data/settings?
2. **Multi-Window**: Should we support multiple app windows?
3. **Printing**: What documents need native print support?
4. **Mobile**: Is a mobile app planned, and should we share code?
5. **Third-Party Plugins**: Will desktop support custom plugins?

---

## 8. Appendix

### 8.1 Design System Colors

```css
:root {
  /* Background */
  --bg0: #0e1117;
  --bg1: #161b22;
  --bg2: #1c2128;
  --bg3: #22262d;
  --bg4: #2d333b;
  
  /* Text */
  --fg0: #e6edf3;
  --fg1: #c9d1d9;
  --fg2: #8b949e;
  --fg3: #6e7681;
  
  /* Accent */
  --accent: #c9a96e;  /* Gold */
  --accent-hover: #d4b87a;
  --accent-dark: #a88b5a;
  
  /* Status */
  --success: #238636;
  --warning: #9e8a5a;
  --error: #da3633;
  --info: #58a6ff;
}
```

### 8.2 Icon Mapping

| Feature | Icon |
|---------|------|
| Directory | Users |
| Organizations | Building2 |
| Governance | Scale |
| Wealth | TrendingUp |
| Education | GraduationCap |
| Watchlist | Eye |
| Voice | Mic |
| Settings | Settings |

---

**End of Document**

*Next Step: Review PRD with stakeholders, create technical architecture document, begin implementation planning.*