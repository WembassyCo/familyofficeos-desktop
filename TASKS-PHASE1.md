# Phase 1: Foundation — Task Breakdown

**Project:** FamilyOfficeOS Desktop (Electron)  
**Repository:** https://github.com/WembassyCo/familyofficeos-desktop  
**PRD:** PRD.md (root of repo)  
**Phase Duration:** Weeks 1–4 (20 working days)  
**Phase Scope:** Project setup, Authentication, Core Layout, Contacts/Organizations CRUD  
**Reference API Base:** `https://fos.wembassy.com`  
**Reference Design System:** `gateway-app/src/index.css`  

---

## Prerequisites

Before starting Phase 1 tasks, the following must be in place:

1. **Node.js 18+** installed on development machine
2. **GitHub repository** created at `WembassyCo/familyofficeos-desktop` (exists)
3. **Design System V2** available for reference at `~/gateway-app/src/index.css`
4. **API access** to `https://fos.wembassy.com` with valid test credentials
5. **Apple Developer / Windows code signing** certificates (for later; not needed for dev)

---

## Task Sequence Overview

| # | Task | Est. Hours | Dependencies |
|---|------|-----------|--------------|
| T1.1 | Electron + Vite + React + TypeScript project scaffold | 6h | None |
| T1.2 | ESLint, Prettier, Vitest, and project tooling | 4h | T1.1 |
| T1.3 | Design System V2 port — CSS variables, base styles, TailwindCSS | 6h | T1.1 |
| T1.4 | Shared UI component library (Button, Input, Select, Badge, Modal, Table) | 8h | T1.3 |
| T1.5 | Main process entry, window manager, and IPC bridge foundation | 6h | T1.1 |
| T1.6 | API client with Axios interceptors, auth header injection, error handling | 6h | T1.5 |
| T1.7 | Zustand store foundation — auth store + layout store | 4h | T1.6 |
| T1.8 | Login screen — form, API call, session cookie extraction | 8h | T1.6, T1.7 |
| T1.9 | Secure credential storage — OS keychain integration | 6h | T1.5, T1.8 |
| T1.10 | Biometric unlock — Touch ID / Windows Hello / Face ID | 6h | T1.9 |
| T1.11 | Auto-lock and session refresh | 4h | T1.8, T1.9 |
| T1.12 | Core layout — TopBar component | 6h | T1.4, T1.7 |
| T1.13 | Core layout — Sidebar component with module navigation | 6h | T1.4, T1.7 |
| T1.14 | Core layout — MainContent area + routing | 4h | T1.4, T1.7 |
| T1.15 | Core layout — RightPanel + collapsible drawer | 4h | T1.14 |
| T1.16 | Container selection — dropdown after login | 4h | T1.8, T1.12 |
| T1.17 | Directory module — types, API service, and Zustand store | 6h | T1.6, T1.7 |
| T1.18 | Contacts — list view (table + card toggle) | 8h | T1.17, T1.14 |
| T1.19 | Contacts — detail view with full information | 6h | T1.18 |
| T1.20 | Contacts — add/edit/delete with validation | 6h | T1.19 |
| T1.21 | Contacts — search, filter, tag categorization | 6h | T1.20 |
| T1.22 | Organizations — list view | 6h | T1.17, T1.14 |
| T1.23 | Organizations — detail view with related contacts | 6h | T1.22 |
| T1.24 | Organizations — CRUD operations | 6h | T1.23 |
| T1.25 | Keyboard shortcuts and navigation polish | 4h | T1.13, T1.14 |

**Total Estimated Hours:** ~144h (≈ 3.6 weeks for a single developer)

---

## Task Details

---

### T1.1 — Electron + Vite + React + TypeScript Project Scaffold

**Est. Hours:** 6  
**Dependencies:** None  
**US Coverage:** US-003 (partial — foundation for all UI)

**Description:**  
Initialize the Electron desktop application project using `electron-vite` with React and TypeScript. This is the foundational task that everything else builds upon.

**Files to Create:**
```
familyofficeos-desktop/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.web.json
├── electron.vite.config.ts
├── .env.example
├── .gitignore
├── .eslintrc.cjs                    (placeholder; filled in T1.2)
├── .prettierrc                      (placeholder; filled in T1.2)
├── src/
│   ├── main/
│   │   └── index.ts                 (placeholder; filled in T1.5)
│   ├── preload/
│   │   └── index.ts                 (context bridge setup)
│   └── renderer/
│       ├── index.html
│       ├── main.tsx                 (React root mount)
│       └── App.tsx                  (placeholder shell)
├── resources/
│   └── icon.png                     (app icon placeholder)
└── README.md
```

**Definition of Done:**
- [ ] `npm install` succeeds without errors
- [ ] `npm run dev` launches Electron window with React app
- [ ] Hot Module Replacement works for renderer changes
- [ ] Main process, preload, and renderer are separate entry points
- [ ] TypeScript compiles with zero errors (`npm run typecheck`)
- [ ] `.env.example` documents `VITE_API_BASE_URL`, `VITE_WS_URL`
- [ ] Git repo initialized with initial commit

---

### T1.2 — ESLint, Prettier, Vitest, and Project Tooling

**Est. Hours:** 4  
**Dependencies:** T1.1  

**Description:**  
Configure code quality tooling: ESLint with React + TypeScript rules, Prettier formatting, and Vitest for unit testing.

**Files to Create/Modify:**
```
.eslintrc.cjs
.prettierrc
.prettierignore
vitest.config.ts
src/renderer/__tests__/App.test.tsx    (smoke test)
scripts/test.sh
scripts/lint.sh
```

**Definition of Done:**
- [ ] `npm run lint` catches and reports ESLint errors
- [ ] `npm run format` auto-formats code with Prettier
- [ ] `npm run test` runs Vitest and passes a smoke test
- [ ] ESLint includes React hooks rules, TypeScript strict rules
- [ ] Pre-commit hook configured (husky + lint-staged) for format on commit
- [ ] `npm run typecheck` runs `tsc --noEmit` successfully

---

### T1.3 — Design System V2 Port (CSS Variables, Base Styles, TailwindCSS)

**Est. Hours:** 6  
**Dependencies:** T1.1  

**Description:**  
Port the Design System V2 from `fox_license/gateway-app/src/index.css` into the Electron app. This includes all CSS custom properties (colors, spacing, typography, borders), base resets, and utility class setup via TailwindCSS.

**Reference:** `~/gateway-app/src/index.css`

**Files to Create:**
```
src/renderer/styles/
├── design-system.css        (all :root CSS variables + reset)
├── components.css           (fox-* component classes ported)
├── animations.css            (keyframes: fox-spin, fox-pulse, etc.)
├── tailwind.css              (TailwindCSS directives + custom theme)
└── index.css                 (aggregation import)
tailwind.config.ts
postcss.config.js
```

**Key CSS Variables to Port (from reference):**
- Background: `--bg0` through `--bg4` (#0e1117 → #2d333b)
- Foreground: `--fg0` through `--fg3` (#e6edf3 → #6e7681)
- Accent: `--accent` (#c9a96e gold), `--accent-hover`, `--accent-dark`
- Status: `--success`, `--warning`, `--error`, `--info`
- Borders: `--border`, `--border-hover`
- Spacing: `--spacing-xs` through `--spacing-xl`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Typography: `--font-mono`, `--font-sans`

**Key Component Classes to Port:**
- Layout: `.fox-app`, `.fox-layout`, `.fox-gateway-content`, `.fox-topbar`, `.fox-sidebar`, `.fox-main`
- Status indicators: `.fox-status-dot`, `.fox-status-dot.connected/disconnected`
- Loading: `.fox-gateway-loading`, `.fox-gateway-spinner`
- Buttons: `.fox-btn`, `.fox-btn-primary`, `.fox-btn-secondary`, `.fox-btn-danger`, `.fox-btn-ghost`
- Inputs: `.fox-input`, `.fox-select`, `.fox-textarea`
- Cards/containers: `.fox-card`, `.fox-panel`
- Badges: `.fox-badge`
- Tables: `.fox-table`, `.fox-table-header`, `.fox-table-row`

**Definition of Done:**
- [ ] All CSS custom properties from reference `index.css` are in `design-system.css`
- [ ] TailwindCSS configured with custom theme matching the design system
- [ ] `tailwind.config.ts` extends colors, spacing, and fonts from CSS variables
- [ ] Dark theme renders correctly as the only theme (no light mode needed in v1)
- [ ] Rendering of `.fox-app` container fills viewport with correct `--bg0` background
- [ ] All status dot animations work (`.fox-status-dot.connected`, `.connecting`, `.disconnected`)
- [ ] Component classes ported for TopBar, Sidebar, MainContent layout
- [ ] `npm run dev` renders a blank app shell with correct dark theme styling

---

### T1.4 — Shared UI Component Library (Button, Input, Select, Badge, Modal, Table)

**Est. Hours:** 8  
**Dependencies:** T1.3  

**Description:**  
Create reusable React components that match the Design System V2 styling. These will be used throughout the application. Port patterns from `gateway-app/src/components/ui/`.

**Reference Files:**
- `fox_license/gateway-app/src/components/ui/FoxButton.tsx`
- `fox_license/gateway-app/src/components/ui/FoxInput.tsx`
- `fox_license/gateway-app/src/components/ui/FoxSelect.tsx`
- `fox_license/gateway-app/src/components/ui/Dialog.tsx`
- `fox_license/gateway-app/src/components/ui/Alert.tsx`
- `fox_license/gateway-app/src/components/ui/Progress.tsx`
- `fox_license/gateway-app/src/components/ui/Tabs.tsx`

**Files to Create:**
```
src/renderer/components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── TextArea.tsx
├── Badge.tsx
├── Modal.tsx
├── Dialog.tsx            (confirmation dialog)
├── Table.tsx             (sortable, filterable data table)
├── Tabs.tsx
├── Alert.tsx
├── Progress.tsx
├── Spinner.tsx
├── Tooltip.tsx
├── Dropdown.tsx
├── Avatar.tsx
├── Card.tsx
├── index.ts              (barrel export)
└── __tests__/
    ├── Button.test.tsx
    ├── Input.test.tsx
    ├── Modal.test.tsx
    └── Table.test.tsx
```

**Definition of Done:**
- [ ] Each component renders correctly with Design System V2 styling
- [ ] All components support `className` prop for Tailwind overrides
- [ ] Button supports variants: `primary`, `secondary`, `danger`, `ghost`, `accent`
- [ ] Button supports sizes: `sm`, `md`, `lg`
- [ ] Input supports: text, email, password, search; with label, error state, icon prefix
- [ ] Modal supports: open/close, title, size variants, keyboard dismiss (Esc)
- [ ] Table supports: sortable columns, row selection, loading skeleton
- [ ] All components have basic accessibility (aria labels, keyboard navigation)
- [ ] Unit tests pass for Button, Input, Modal, Table

---

### T1.5 — Main Process Entry, Window Manager, and IPC Bridge Foundation

**Est. Hours:** 6  
**Dependencies:** T1.1  

**Description:**  
Set up the Electron main process with window management, single-instance lock, and the IPC bridge pattern for secure communication between main and renderer processes.

**Files to Create:**
```
src/main/
├── index.ts                (app lifecycle, single-instance lock)
├── window.ts               (BrowserWindow creation, config)
├── ipc/
│   ├── index.ts            (IPC handler registration)
│   ├── auth.ts             (auth IPC handlers — placeholder)
│   ├── filesystem.ts       (filesystem IPC — placeholder)
│   └── notifications.ts    (notification IPC — placeholder)
├── services/
│   ├── auto-update.ts      (electron-updater stub)
│   ├── keychain.ts         (keychain/credential manager stub)
│   ├── tray.ts             (system tray stub)
│   └── notifications.ts    (native notifications stub)
src/preload/
├── index.ts                (contextBridge.exposeInMainWorld)
```

**Key Implementation Details:**
- Window manager creates the main window at 1280×800 with min 960×600
- Single-instance lock prevents multiple app instances
- `contextBridge.exposeInMainWorld` exposes a typed `electronAPI` object
- IPC channels follow naming convention: `module:action` (e.g., `auth:login`, `auth:get-credentials`)
- Window state persistence (position, size) saved to localStorage via main process

**Definition of Done:**
- [ ] App launches with a single main window at correct size
- [ ] Second instance attempt focuses existing window (single-instance lock)
- [ ] `contextBridge` exposes typed API: `window.electronAPI.auth.*`, `window.electronAPI.fs.*`
- [ ] Window state (position, size) persists across restarts
- [ ] Dev tools accessible in development mode, hidden in production
- [ ] Appropriate Content Security Policy set in main window
- [ ] Preload script compiles and injects without errors
- [ ] IPC channel naming convention documented in code comments

---

### T1.6 — API Client with Axios Interceptors, Auth Header Injection, Error Handling

**Est. Hours:** 6  
**Dependencies:** T1.5  

**Description:**  
Create the renderer-side API client using Axios with interceptors for session cookie management, 401 re-authentication, and consistent error handling. This client communicates with `https://fos.wembassy.com`.

**Reference:**  
API patterns from `fox_license/gateway-app/src/services/apiService.ts` and `contactService.ts`

**Files to Create:**
```
src/renderer/services/
├── apiClient.ts            (Axios instance with interceptors)
├── authService.ts          (login, logout, session management)
├── directoryService.ts      (contacts + organizations API — stub)
└── types.ts                (API response/error types)
src/renderer/lib/
├── constants.ts             (API_BASE_URL, WS_URL, etc.)
└── errors.ts                (custom error classes)
```

**Key Implementation Details:**
- Axios instance configured with `baseURL` from env var (`VITE_API_BASE_URL` or `https://fos.wembassy.com`)
- Request interceptor injects session cookie header
- Response interceptor catches 401 → triggers re-auth flow
- Error class hierarchy: `ApiError`, `AuthError`, `NetworkError`
- All API calls return typed responses: `{ success: boolean; data?: T; error?: string }`
- Login: `POST /user/login` with `{ name, pass }` → extracts session cookie from `Set-Cookie` header

**Definition of Done:**
- [ ] `apiClient` instance created with correct base URL
- [ ] Request interceptor adds session cookie to all authenticated requests
- [ ] Response interceptor catches 401 and emits event for re-auth
- [ ] Error types exported and usable in stores/components
- [ ] `authService.login(username, password)` returns session data
- [ ] `authService.getContainers()` fetches user's containers after login
- [ ] `authService.logout()` clears session data
- [ ] TypeScript types for all API response shapes defined
- [ ] Unit tests for interceptors (mock Axios)

---

### T1.7 — Zustand Store Foundation (Auth Store + Layout Store)

**Est. Hours:** 4  
**Dependencies:** T1.6  

**Description:**  
Create the core Zustand stores for authentication state and layout state. These are the foundation stores that all modules will depend on.

**Reference:** `fox_license/gateway-app/src/stores/gatewayStore.ts` (for patterns)

**Files to Create:**
```
src/renderer/stores/
├── authStore.ts             (user, session, container, login/logout actions)
├── layoutStore.ts           (sidebarMode, sidebarCollapsed, activeModule, breadcrumbs)
├── directoryStore.ts        (contacts, organizations, filters — stub for T1.17)
└── index.ts                 (barrel export)
src/renderer/types/
├── auth.ts                  (User, Container, Session types)
├── layout.ts                (SidebarMode, LayoutState types)
└── index.ts                 (barrel export)
```

**Auth Store Shape:**
```typescript
interface AuthState {
  user: User | null;
  container: Container | null;
  containers: Container[];
  sessionCookie: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  autoLockTimeout: number; // minutes, default 15
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  selectContainer: (containerId: string) => void;
  refreshSession: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  setAutoLockTimeout: (minutes: number) => void;
}
```

**Layout Store Shape:**
```typescript
interface LayoutState {
  sidebarMode: 'directory' | 'governance' | 'wealth' | 'education' | 'watchlist' | 'voice' | 'settings';
  sidebarCollapsed: boolean;
  activeModule: string;
  breadcrumbs: Breadcrumb[];
  rightPanelOpen: boolean;
  rightPanelContent: string | null;
}

interface LayoutActions {
  setSidebarMode: (mode: SidebarMode) => void;
  toggleSidebar: () => void;
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
  openRightPanel: (content: string) => void;
  closeRightPanel: () => void;
}
```

**Definition of Done:**
- [ ] `useAuthStore` provides full auth state and actions
- [ ] `useLayoutStore` provides layout state and actions
- [ ] Stores use Zustand's `persist` middleware for session recovery
- [ ] Stores are typed with no `any` types
- [ ] `login()` action calls `authService.login()` and updates state
- [ ] `logout()` action clears all auth state and session data
- [ ] `selectContainer()` updates `container` in auth store
- [ ] Layout store defaults: `sidebarMode='directory'`, `sidebarCollapsed=false`

---

### T1.8 — Login Screen (Form, API Call, Session Cookie Extraction)

**Est. Hours:** 8  
**Dependencies:** T1.6, T1.7  

**Description:**  
Build the complete login screen with email/password form, "Remember me" toggle, error display, and session management. This is the first screen users see when they open the app.

**US Coverage:** US-001 — Login with secure credential storage

**Files to Create:**
```
src/renderer/
├── pages/
│   └── LoginPage.tsx
├── components/auth/
│   ├── LoginForm.tsx
│   ├── LoginError.tsx
│   ├── ContainerSelector.tsx
│   └── BiometricPrompt.tsx    (placeholder for T1.10)
├── hooks/
│   └── useAuth.ts             (convenience hook for authStore)
└── guards/
    └── AuthGuard.tsx           (route guard that redirects to login)
```

**Login Flow:**
1. User enters username + password
2. App calls `POST /user/login` with `{ name, pass }`
3. On success: extracts session cookie from `Set-Cookie` header
4. App calls `GET /jsonapi/fox_container/fox_container` with session cookie
5. If multiple containers: show `ContainerSelector` dropdown
6. If single container: auto-select and proceed to main app
7. If "Remember me" checked: store credentials in OS keychain (T1.9)
8. On error: display `LoginError` with message

**Definition of Done:**
- [ ] Login form renders with username and password inputs
- [ ] Form validates: required fields, minimum length
- [ ] Submit calls `authService.login()` and updates `authStore`
- [ ] Session cookie extracted and stored
- [ ] Container selection works for multi-container users
- [ ] "Remember me" checkbox toggles credential storage preference
- [ ] Error messages displayed for: invalid credentials, network error, server error
- [ ] Loading state shown during authentication
- [ ] `AuthGuard` component redirects unauthenticated users to `/login`
- [ ] Successful login navigates to main app layout
- [ ] Form accessible: labels, focus management, enter key submits

---

### T1.9 — Secure Credential Storage (OS Keychain Integration)

**Est. Hours:** 6  
**Dependencies:** T1.5, T1.8  

**Description:**  
Implement secure credential storage using the OS keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service). This allows "Remember me" functionality and biometric unlock.

**US Coverage:** US-001 (Remember me), US-002 (partial — credential retrieval)

**Files to Create:**
```
src/main/services/
├── keychain.ts               (full implementation replacing stub)
src/main/ipc/
├── auth.ts                   (IPC handlers for credential storage)
src/renderer/services/
├── credentialService.ts      (renderer-side API for keychain access via IPC)
```

**Key Implementation:**
- Uses `keytar` or `safeStorage` from Electron for platform-specific secure storage
- IPC channel `auth:save-credentials` → stores encrypted credentials
- IPC channel `auth:get-credentials` → retrieves credentials (requires biometric or OS auth)
- IPC channel `auth:delete-credentials` → removes stored credentials
- Credentials schema:
  ```typescript
  interface SecureCredentials {
    username: string;
    encryptedPassword: string;  // AES-256-GCM encrypted
    containerId: string;
    sessionCookie?: string;
    lastLogin: string;           // ISO date
    biometricEnabled: boolean;
  }
  ```

**Definition of Done:**
- [ ] Credentials stored in OS keychain on all three platforms (macOS, Windows, Linux)
- [ ] `auth:save-credentials` IPC handler works end-to-end
- [ ] `auth:get-credentials` returns stored credentials
- [ ] `auth:delete-credentials` removes credentials from keychain
- [ ] Password is encrypted (AES-256-GCM) before storage
- [ ] "Remember me" on login saves credentials to keychain
- [ ] App restart with stored credentials auto-fills username (not password)
- [ ] Manual logout clears all stored credentials
- [ ] Keychain access fails gracefully if OS keychain unavailable

---

### T1.10 — Biometric Unlock (Touch ID / Windows Hello / Face ID)

**Est. Hours:** 6  
**Dependencies:** T1.9  

**Description:**  
Implement biometric authentication for app unlock. After first login with "Remember me," the user can unlock the app using their device's biometric capability instead of re-entering their password.

**US Coverage:** US-002 — Biometric unlock

**Files to Create:**
```
src/main/services/
├── biometrics.ts             (biometric auth using platform APIs)
src/main/ipc/
├── auth.ts                   (add biometric IPC handlers)
src/renderer/components/auth/
├── BiometricPrompt.tsx       (full implementation replacing placeholder)
├── BiometricSetup.tsx        (enable/disable biometric in settings)
src/renderer/pages/
├── UnlockPage.tsx             (lock screen with biometric + PIN fallback)
```

**Key Implementation:**
- macOS: `@nicolo-ribaudo/node-mac-permissions` or `TouchID` via Electron's `safeStorage`
- Windows: Windows Hello via `@nicolo-ribaudo/win-biometrics` or equivalent
- Linux: Polkit authentication dialog
- Fallback: PIN/password entry if biometric unavailable or fails
- Auto-lock triggers the lock screen after configurable timeout (default 15 min)

**Definition of Done:**
- [ ] Biometric prompt appears on app unlock after auto-lock or restart
- [ ] Touch ID works on macOS (with fingerprint sensor)
- [ ] Windows Hello works on Windows 10+
- [ ] Fallback to password entry if biometric unavailable or fails
- [ ] `BiometricSetup` allows enabling/disabling biometric in settings
- [ ] Unlock screen shows user avatar/name and "Unlock with [biometric type]"
- [ ] After successful biometric auth, credentials retrieved from keychain and session restored
- [ ] Failed biometric attempts (3 max) fall back to password

---

### T1.11 — Auto-Lock and Session Refresh

**Est. Hours:** 4  
**Dependencies:** T1.8, T1.9  

**Description:**  
Implement auto-lock after configurable timeout and session refresh to keep the session alive while the app is open.

**Files to Create:**
```
src/renderer/services/
├── sessionService.ts         (auto-lock timer, session refresh)
src/renderer/hooks/
├── useAutoLock.ts            (hook for auto-lock behavior)
├── useSessionRefresh.ts      (hook for periodic session refresh)
src/main/ipc/
├── auth.ts                   (session refresh IPC handlers)
```

**Key Implementation:**
- Auto-lock timer: configurable (5, 10, 15, 30, 60 minutes), default 15
- Timer resets on any user interaction (mouse, keyboard)
- On lock: hide main window, show unlock screen
- Session refresh: `GET /session/token` every 10 minutes while authenticated
- On 401 response: lock the app and show unlock screen

**Definition of Done:**
- [ ] Auto-lock activates after configured timeout
- [ ] Timer resets on mouse movement, key press, click
- [ ] Lock screen shows with biometric or password unlock
- [ ] Session refresh fires periodically while app is active
- [ ] 401 responses from API trigger lock screen
- [ ] Settings page allows changing auto-lock timeout
- [ ] App window minimizes/hides on lock (platform appropriate)

---

### T1.12 — Core Layout: TopBar Component

**Est. Hours:** 6  
**Dependencies:** T1.4, T1.7  

**Description:**  
Build the TopBar component that appears at the top of the app. This includes branding, connection status, notifications, and user menu.

**Reference:** `fox_license/gateway-app/src/components/layout/TopBar.tsx`

**US Coverage:** US-003 — Basic layout with navigation

**Files to Create:**
```
src/renderer/components/layout/
├── TopBar.tsx
├── TopBar.module.css          (or use Tailwind utility classes)
├── ConnectionStatus.tsx
├── NotificationBell.tsx       (stub — just icon + count)
├── UserMenu.tsx
└── Breadcrumb.tsx
```

**TopBar Layout (matching reference):**
```
┌──────────────────────────────────────────────────────────────┐
│ [⟐] Family OS      [🟢 Connected]    [🔔] [👤 J. Smith ▾] │
└──────────────────────────────────────────────────────────────┘
```

**Elements:**
- **Left:** Brand mark (SVG from reference) + "Family OS" text
- **Center:** Connection status indicator (green dot = connected, yellow = connecting, red = disconnected)
- **Right:** Notification bell (with count badge), User menu (avatar, name, dropdown with Profile/Settings/Logout)

**Definition of Done:**
- [ ] TopBar renders at 48px height with `--bg1` background and `--border` bottom
- [ ] Brand mark SVG matches reference design
- [ ] Connection status dot shows correct state (connected/connecting/disconnected)
- [ ] Connection status text updates with state
- [ ] Notification bell renders with count badge (stub: always 0)
- [ ] User menu shows avatar initials + name
- [ ] User dropdown: Profile, Settings, Logout options
- [ ] Logout calls `authStore.logout()` and returns to login screen
- [ ] TopBar responsive: collapses text on narrow windows

---

### T1.13 — Core Layout: Sidebar Component with Module Navigation

**Est. Hours:** 6  
**Dependencies:** T1.4, T1.7  

**Description:**  
Build the collapsible Sidebar with icon-based navigation for all modules. This is the primary navigation mechanism for the app.

**Reference:** `fox_license/gateway-app/src/components/layout/Sidebar.tsx`

**US Coverage:** US-003 — Basic layout with navigation

**Files to Create:**
```
src/renderer/components/layout/
├── Sidebar.tsx
├── SidebarItem.tsx
└── Sidebar.module.css
```

**Sidebar Items (from PRD):**
| Icon (Lucide) | Label | Mode |
|---|---|---|
| `Users` | Directory | `directory` |
| `Building2` | Organizations | `organizations` |
| `Scale` | Governance | `governance` |
| `TrendingUp` | Wealth | `wealth` |
| `GraduationCap` | Education | `education` |
| `Eye` | Watchlist | `watchlist` |
| `Mic` | Voice | `voice` |
| `Settings` | Settings | `settings` |

**Key Implementation:**
- Sidebar width: 56px (collapsed) with icon-only buttons matching reference `.fox-sidebar` styling
- Active item highlighted with `--accent` color
- Hover state with tooltip showing full module name
- Bottom section: Settings icon
- Keyboard shortcuts: Cmd/Ctrl+1-8 for module switching

**Definition of Done:**
- [ ] Sidebar renders at 56px width with `--bg1` background
- [ ] All 8 module icons render with correct Lucide icons
- [ ] Active item shows `--accent` highlight
- [ ] Hover shows tooltip with module name
- [ ] Click updates `layoutStore.sidebarMode`
- [ ] Keyboard shortcuts Cmd/Ctrl+1-8 switch modules
- [ ] Settings at bottom separated by spacer
- [ ] Sidebar matches reference `.fox-sidebar` styling

---

### T1.14 — Core Layout: MainContent Area + Routing

**Est. Hours:** 4  
**Dependencies:** T1.4, T1.7  

**Description:**  
Build the main content area that renders the active module's panel based on `layoutStore.sidebarMode`. Set up React Router for nested views within modules.

**Reference:** `fox_license/gateway-app/src/components/layout/MainContent.tsx`

**US Coverage:** US-003 — Basic layout with navigation

**Files to Create:**
```
src/renderer/components/layout/
├── MainContent.tsx
├── AppLayout.tsx              (composition of TopBar + Sidebar + MainContent)
src/renderer/pages/
├── DashboardPage.tsx         (default landing page — placeholder)
├── DirectoryPage.tsx          (placeholder for T1.18+)
├── GovernancePage.tsx         (placeholder)
├── WealthPage.tsx             (placeholder)
├── EducationPage.tsx          (placeholder)
├── WatchlistPage.tsx          (placeholder)
├── VoicePage.tsx              (placeholder)
├── SettingsPage.tsx            (placeholder)
src/renderer/
├── router.tsx                 (React Router config)
```

**Key Implementation:**
- Uses React Router v6 with nested routes
- `MainContent` renders `<Outlet />` inside the `.fox-content` container
- Module switching changes the route: `/directory`, `/governance`, etc.
- Default route after login: `/directory`
- Each placeholder page shows module name + icon in a centered empty state

**Definition of Done:**
- [ ] `AppLayout` composes TopBar + Sidebar + MainContent correctly
- [ ] Clicking sidebar items navigates to the correct route
- [ ] Each module renders its placeholder page with correct name
- [ ] URL reflects active module: `/directory`, `/governance`, etc.
- [ ] Browser back/forward navigates between modules
- [ ] Default route after login is `/directory`
- [ ] Layout fills viewport correctly with no overflow
- [ ] Window resize preserves layout integrity

---

### T1.15 — Core Layout: RightPanel + Collapsible Drawer

**Est. Hours:** 4  
**Dependencies:** T1.14  

**Description:**  
Build the right panel / drawer that slides in from the right for contextual information. This is used for detail views, settings panels, and auxiliary content.

**Reference:** `fox_license/gateway-app/src/components/layout/RightPanel.tsx`

**Files to Create:**
```
src/renderer/components/layout/
├── RightPanel.tsx
├── RightPanel.module.css
```

**Key Implementation:**
- Right panel slides in/out from the right with CSS transition
- Width: configurable (default 360px)
- Open/close state managed by `layoutStore.rightPanelOpen` + `rightPanelContent`
- Close button (X) in top-right corner
- Content rendered based on `rightPanelContent` string identifier
- Overlays main content on narrow windows; side-by-side on wide windows

**Definition of Done:**
- [ ] Right panel slides in/out with smooth transition
- [ ] Close button works to dismiss panel
- [ ] Panel width is 360px by default
- [ ] `layoutStore.openRightPanel(content)` opens the panel
- [ ] `layoutStore.closeRightPanel()` closes the panel
- [ ] On windows < 960px, panel overlays content
- [ ] On windows >= 960px, panel appears beside main content

---

### T1.16 — Container Selection (Dropdown After Login)

**Est. Hours:** 4  
**Dependencies:** T1.8, T1.12  

**Description:**  
After successful login, if the user has access to multiple containers (family offices), show a container selection screen before entering the main app. If only one container, auto-select it.

**US Coverage:** US-001 (Container selection dropdown)

**Files to Create:**
```
src/renderer/pages/
├── ContainerSelectPage.tsx
src/renderer/components/auth/
├── ContainerCard.tsx
```

**Key Implementation:**
- After login, check `authStore.containers` array length
- If 1 container: auto-select, navigate to main app
- If >1 containers: show `ContainerSelectPage` with card grid
- Each card shows: container name, description, role
- Selected container stored in `authStore.container`
- Container selection persists to local storage for next launch

**Definition of Done:**
- [ ] Container selection screen shows after login with multiple containers
- [ ] Single container: auto-selects and skips selection screen
- [ ] Container cards display name and description
- [ ] Selecting a container updates `authStore.container`
- [ ] Selected container persists across app restarts
- [ ] User can switch containers from settings (future: not in this task)
- [ ] Back button returns to login screen

---

### T1.17 — Directory Module: Types, API Service, and Zustand Store

**Est. Hours:** 6  
**Dependencies:** T1.6, T1.7  

**Description:**  
Set up the Directory module foundation: TypeScript types matching the API, API service methods for contacts and organizations CRUD, and the Zustand store for directory state management.

**Reference:**  
- Types: `fox_license/gateway-app/src/types/contact.ts`, `organization.ts`  
- Service: `fox_license/gateway-app/src/services/contactService.ts`  
- Hook: `fox_license/gateway-app/src/components/features/Directory/ContactsTab/useContacts.ts`

**Files to Create:**
```
src/renderer/types/
├── contact.ts                (Contact interface + ContactFormData)
├── organization.ts           (Organization interface)
├── address.ts                (Address interface)
├── relationship.ts           (Relationship interface)
├── taxonomy.ts               (TaxonomyItem interface)
├── filters.ts                (DirectoryFilter types)
└── directory.ts              (barrel export)
src/renderer/services/
├── contactService.ts         (CRUD: list, get, create, update, delete)
├── organizationService.ts    (CRUD: list, get, create, update, delete)
├── taxonomyService.ts        (get tiers, statuses, types, industries)
└── directory.ts              (barrel export)
src/renderer/stores/
├── directoryStore.ts         (full implementation)
```

**API Endpoints:**
```
GET    /fox-daemon/api/directory/{container}/contacts
POST   /fox-daemon/api/directory/{container}/contacts
GET    /fox-daemon/api/directory/{container}/contacts/{id}
PUT    /fox-daemon/api/directory/{container}/contacts/{id}
DELETE /fox-daemon/api/directory/{container}/contacts/{id}

GET    /fox-daemon/api/directory/{container}/organizations
POST   /fox-daemon/api/directory/{container}/organizations
GET    /fox-daemon/api/directory/{container}/organizations/{id}
PUT    /fox-daemon/api/directory/{container}/organizations/{id}
DELETE /fox-daemon/api/directory/{container}/organizations/{id}
```

**Directory Store Shape:**
```typescript
interface DirectoryState {
  contacts: Contact[];
  organizations: Organization[];
  selectedContact: Contact | null;
  selectedOrganization: Organization | null;
  filters: DirectoryFilters;
  loading: boolean;
  error: string | null;
  viewMode: 'table' | 'cards';
  activeTab: 'contacts' | 'organizations' | 'leads' | 'opportunities' | 'quotes' | 'orders' | 'invoices' | 'activities';
  taxonomies: {
    tiers: TaxonomyItem[];
    statuses: TaxonomyItem[];
    orgTypes: TaxonomyItem[];
    industries: TaxonomyItem[];
  };
}
```

**Definition of Done:**
- [ ] All TypeScript types match API response shapes from reference
- [ ] `contactService.list(filters)` calls GET contacts with query params
- [ ] `contactService.create(data)` calls POST contacts
- [ ] `contactService.update(id, data)` calls PUT contacts/{id}
- [ ] `contactService.remove(id)` calls DELETE contacts/{id}
- [ ] Same CRUD methods work for `organizationService`
- [ ] `taxonomyService.get('contact_tiers')` returns TaxonomyItem[]
- [ ] `directoryStore` manages contacts, organizations, filters, and view state
- [ ] Store loads data on mount and caches results
- [ ] Error states properly set on API failures

---

### T1.18 — Contacts: List View (Table + Card Toggle)

**Est. Hours:** 8  
**Dependencies:** T1.17, T1.14  

**Description:**  
Build the contacts list view with table and card view modes, search, and basic filtering. This is the primary view for the Directory module.

**Reference:** `fox_license/gateway-app/src/components/features/Directory/ContactsTab/ContactsTab.tsx`

**US Coverage:** US-004 — Contacts list and detail view

**Files to Create:**
```
src/renderer/components/directory/contacts/
├── ContactsList.tsx           (main list component)
├── ContactsTable.tsx          (table view)
├── ContactCard.tsx            (card view item)
├── ContactFilters.tsx         (filter bar: search, tier, status)
├── ContactBulkActions.tsx     (select multiple, delete, export)
├── ViewToggle.tsx             (table/card view switch)
└── ContactsEmptyState.tsx     (empty state when no contacts)
src/renderer/hooks/
└── useContacts.ts             (data fetching + CRUD hook)
```

**Key Implementation:**
- Default view: table with columns: Name, Email, Phone, Organization, Tier, Status
- Card view: 3-column grid of contact cards with avatar initials, name, org
- View toggle in top-right of list header
- Search bar at top with debounced search (300ms)
- Filter dropdowns: Tier, Status (populated from `taxonomyService`)
- Row click → navigates to contact detail (T1.19)
- Checkbox selection for bulk operations
- Pagination or infinite scroll (prefer pagination for desktop)
- Loading skeleton state
- Empty state with "Add Contact" CTA

**Definition of Done:**
- [ ] Table view renders contacts with all columns
- [ ] Card view renders contact cards in grid layout
- [ ] View toggle switches between table and card mode
- [ ] Search filters contacts by name or email (debounced)
- [ ] Tier and Status dropdowns filter the list
- [ ] Clicking a row navigates to `/directory/contacts/{id}`
- [ ] Checkbox selection enables bulk action toolbar
- [ ] Loading skeleton shown while fetching data
- [ ] Empty state shown when no contacts match filters
- [ ] Pagination works for large contact lists (>50 contacts)

---

### T1.19 — Contacts: Detail View with Full Information

**Est. Hours:** 6  
**Dependencies:** T1.18  

**Description:**  
Build the contact detail view that shows all contact information including addresses, relationships, and related organizations.

**Reference:** `fox_license/gateway-app/src/components/features/Directory/ContactsTab/ContactDetailModal.tsx`

**US Coverage:** US-004 — Contacts list and detail view

**Files to Create:**
```
src/renderer/components/directory/contacts/
├── ContactDetail.tsx          (full detail view)
├── ContactHeader.tsx         (name, title, org, avatar)
├── ContactInfo.tsx            (email, phone, address, social)
├── ContactOrganizations.tsx  (related organizations list)
├── ContactActivities.tsx     (recent activities — stub)
└── ContactTimeline.tsx       (activity timeline — stub)
src/renderer/hooks/
└── useContactDetail.ts        (fetch single contact + related data)
```

**Key Implementation:**
- Detail view opens in RightPanel (if wide enough) or replaces main content
- Header: avatar initials, full name, title, organization
- Sections: Contact Info, Organizations, Activities (stubs)
- Back button returns to contacts list
- Breadcrumb updates: Directory > Contacts > [Name]
- Edit button navigates to edit form (T1.20)

**Definition of Done:**
- [ ] Contact detail loads by ID from URL param
- [ ] Header shows name, title, organization with avatar
- [ ] Contact info section shows email, phone, address
- [ ] Organizations section lists related organizations
- [ ] Back button returns to contacts list with previous filters preserved
- [ ] Breadcrumb updates correctly
- [ ] Loading state while fetching
- [ ] Error state if contact not found
- [ ] Detail renders in RightPanel on wide windows

---

### T1.20 — Contacts: Add/Edit/Delete with Validation

**Est. Hours:** 6  
**Dependencies:** T1.19  

**Description:**  
Build the contact add/edit form with validation, and the delete confirmation flow.

**Reference:**  
- `fox_license/gateway-app/src/components/common/ContactForm.tsx`  
- `fox_license/gateway-app/src/components/features/Directory/ContactsTab/useContacts.ts`

**US Coverage:** US-004 — Contacts list and detail view

**Files to Create:**
```
src/renderer/components/directory/contacts/
├── ContactForm.tsx             (add/edit form)
├── ContactFormFields.tsx       (field groups: name, contact, address)
├── ContactDeleteConfirm.tsx    (delete confirmation dialog)
src/renderer/components/common/
├── ContactForm.tsx             (shared form component — might already exist in ui/)
```

**Form Fields:**
- **Name Section:** First name*, Last name*, Title, Department
- **Contact Section:** Email, Phone (primary, mobile), LinkedIn
- **Address Section:** Street, City, State, ZIP, Country (repeatable)
- **Organization:** Organization dropdown (searchable)
- **Classification:** Tier, Status (dropdowns from taxonomy)
- **Tags:** Tag input with autocomplete
- **Biography:** Textarea
- **Preferred Contact Method:** Dropdown
- **Do Not Contact:** Checkbox

**Validation Rules:**
- First name: required
- Last name: required
- Email: valid format if provided
- At least one contact method (email or phone)

**Definition of Done:**
- [ ] "Add Contact" button opens form in RightPanel or new route
- [ ] Edit button on detail view opens pre-filled form
- [ ] All form fields render with correct input types
- [ ] Validation: first name and last name required
- [ ] Validation: email format check
- [ ] Organization dropdown is searchable
- [ ] Tags input with autocomplete
- [ ] Address section supports multiple addresses
- [ ] Save calls `contactService.create()` or `contactService.update()`
- [ ] Success: returns to contact list with updated data
- [ ] Error: displays inline validation errors
- [ ] Delete: confirmation dialog before calling `contactService.remove()`
- [ ] Delete success: returns to contact list

---

### T1.21 — Contacts: Search, Filter, Tag Categorization

**Est. Hours:** 6  
**Dependencies:** T1.20  

**Description:**  
Enhance the contacts list with advanced search, multi-field filters, and tag-based categorization.

**US Coverage:** US-004 — Search and filter by name, email, tags

**Files to Create:**
```
src/renderer/components/directory/contacts/
├── AdvancedSearch.tsx          (multi-field search form)
├── FilterPanel.tsx             (collapsible filter panel)
├── TagInput.tsx                (tag input with autocomplete + creation)
├── TagBadge.tsx                (tag display badge)
└── SavedFilters.tsx            (save/load filter presets — stub)
src/renderer/hooks/
└── useContactFilters.ts        (filter state management)
```

**Key Implementation:**
- Search bar: searches across name, email, phone simultaneously
- Advanced search: expandable form with individual field search
- Filters: Tier, Status, Organization, Tags (multi-select)
- Active filters shown as removable badges above the list
- Tag categorization: click a tag on a contact to filter by that tag
- Filter state preserved in URL query params for deep linking
- Clear all filters button

**Definition of Done:**
- [ ] Search bar filters contacts in real-time (debounced 300ms)
- [ ] Advanced search expands to show individual fields
- [ ] Tier, Status, Organization filters work as multi-select dropdowns
- [ ] Tags filter works with tag autocomplete
- [ ] Active filters shown as removable badge chips
- [ ] "Clear all" button resets all filters
- [ ] Filter state preserved in URL query params
- [ ] Tag badges on contact cards/rows are clickable to filter
- [ ] Tag input in contact form allows creating new tags

---

### T1.22 — Organizations: List View

**Est. Hours:** 6  
**Dependencies:** T1.17, T1.14  

**Description:**  
Build the organizations list view with table and card modes, search, and filtering. Mirrors the contacts list view structure.

**Reference:** `fox_license/gateway-app/src/components/features/Directory/OrganizationsTab/OrganizationsTab.tsx`

**US Coverage:** US-005 — Organizations management

**Files to Create:**
```
src/renderer/components/directory/organizations/
├── OrganizationsList.tsx      (main list component)
├── OrganizationsTable.tsx     (table view)
├── OrganizationCard.tsx       (card view item)
├── OrganizationFilters.tsx    (filter bar: search, type, industry, tier)
└── OrganizationsEmptyState.tsx
src/renderer/hooks/
└── useOrganizations.ts         (data fetching + CRUD hook)
```

**Key Implementation:**
- Table columns: Name, Type, Industry, Tier, Website, Status
- Card view: organization name, type badge, description snippet
- Filter by: Type, Industry, Tier, Status
- Search by: name, website, description
- Tab navigation between contacts/organizations in Directory module

**Definition of Done:**
- [ ] Organization table renders with all columns
- [ ] Card view renders organization cards
- [ ] View toggle switches between table and card
- [ ] Search filters organizations by name, website
- [ ] Type, Industry, Tier filters work
- [ ] Clicking a row navigates to `/directory/organizations/{id}`
- [ ] Loading skeleton while fetching
- [ ] Empty state with "Add Organization" CTA

---

### T1.23 — Organizations: Detail View with Related Contacts

**Est. Hours:** 6  
**Dependencies:** T1.22  

**Description:**  
Build the organization detail view showing full organization info plus a list of associated contacts.

**Reference:** `fox_license/gateway-app/src/components/features/Directory/OrganizationsTab/OrganizationDetailModal.tsx`

**US Coverage:** US-005 — Organization detail with related contacts

**Files to Create:**
```
src/renderer/components/directory/organizations/
├── OrganizationDetail.tsx          (full detail view)
├── OrganizationHeader.tsx         (name, type, industry, logo placeholder)
├── OrganizationInfo.tsx           (website, description, revenue, employees)
├── OrganizationContacts.tsx       (list of associated contacts)
├── OrganizationContactRow.tsx     (single contact row in org detail)
└── OrganizationHierarchy.tsx      (parent/child orgs — stub)
src/renderer/hooks/
└── useOrganizationDetail.ts        (fetch org + contacts)
```

**Key Implementation:**
- Header: organization name, type badge, industry, website link
- Info section: description, annual revenue, employee count, address
- Contacts section: list of contacts associated with this organization
- Each contact row: name, title, email — clickable to navigate to contact detail
- Hierarchy section: parent/child organizations (stub for future)
- Back button returns to organizations list
- Edit button navigates to edit form (T1.24)

**Definition of Done:**
- [ ] Organization detail loads by ID from URL param
- [ ] Header shows name, type badge, industry, website
- [ ] Info section shows all organization fields
- [ ] Contacts section lists all associated contacts
- [ ] Contact rows are clickable → navigate to contact detail
- [ ] Back button returns to organizations list
- [ ] Breadcrumb updates: Directory > Organizations > [Name]
- [ ] Loading and error states handled

---

### T1.24 — Organizations: CRUD Operations

**Est. Hours:** 6  
**Dependencies:** T1.23  

**Description:**  
Build the organization add/edit form with validation and delete flow.

**Reference:**  
- `fox_license/gateway-app/src/components/common/OrganizationForm.tsx`

**US Coverage:** US-005 — CRUD operations for organizations

**Files to Create:**
```
src/renderer/components/directory/organizations/
├── OrganizationForm.tsx            (add/edit form)
├── OrganizationFormFields.tsx      (field groups)
├── OrganizationDeleteConfirm.tsx  (delete confirmation)
```

**Form Fields:**
- **Basic:** Name*, Type (dropdown), Industry (dropdown), Website
- **Details:** Description (textarea), Annual Revenue, Employee Count (range)
- **Classification:** Tier, Source, Status
- **Address:** Street, City, State, ZIP, Country (repeatable)

**Validation Rules:**
- Name: required
- Website: valid URL format if provided
- Annual Revenue: positive number if provided

**Definition of Done:**
- [ ] "Add Organization" button opens form
- [ ] Edit button on detail view opens pre-filled form
- [ ] All form fields render with correct input types
- [ ] Validation: name required, website URL format check
- [ ] Type and Industry dropdowns populated from taxonomy service
- [ ] Address section supports multiple addresses
- [ ] Save calls `organizationService.create()` or `.update()`
- [ ] Success: returns to organization list with updated data
- [ ] Error: displays inline validation errors
- [ ] Delete: confirmation dialog before calling `organizationService.remove()`
- [ ] Delete success: returns to organization list

---

### T1.25 — Keyboard Shortcuts and Navigation Polish

**Est. Hours:** 4  
**Dependencies:** T1.13, T1.14  

**Description:**  
Add keyboard shortcuts for module navigation and polish the overall layout transitions and routing behavior.

**US Coverage:** US-003 — Keyboard shortcuts, breadcrumb navigation

**Files to Create:**
```
src/renderer/hooks/
├── useKeyboardShortcuts.ts     (global keyboard shortcut handler)
├── useBreadcrumbs.ts           (breadcrumb management)
src/renderer/components/layout/
├── Breadcrumb.tsx              (full implementation)
├── NavigationHistory.ts        (track recently viewed items)
```

**Keyboard Shortcuts:**
| Shortcut | Action |
|---|---|
| Cmd/Ctrl+1 | Switch to Directory |
| Cmd/Ctrl+2 | Switch to Governance |
| Cmd/Ctrl+3 | Switch to Wealth |
| Cmd/Ctrl+4 | Switch to Education |
| Cmd/Ctrl+5 | Switch to Watchlist |
| Cmd/Ctrl+6 | Switch to Voice |
| Cmd/Ctrl+7 | Switch to Settings |
| Cmd/Ctrl+K | Command palette (future: stub) |
| Cmd/Ctrl+F | Focus search in active module |
| Cmd/Ctrl+[ | Navigate back |
| Cmd/Ctrl+] | Navigate forward |
| Esc | Close right panel / modal |

**Navigation Polish:**
- Breadcrumb: Directory > Contacts > John Smith
- Recently viewed: store last 10 items in `layoutStore`
- Smooth transitions between modules (CSS transition)
- Focus management: focus content area on module switch

**Definition of Done:**
- [ ] Cmd/Ctrl+1-7 switches between all modules
- [ ] Cmd/Ctrl+F focuses search in active module
- [ ] Esc closes right panel or active modal
- [ ] Breadcrumb updates correctly for all navigation paths
- [ ] Breadcrumb items are clickable for navigation
- [ ] Recently viewed items accessible via Cmd/Ctrl+K (stub)
- [ ] Module transitions are smooth (no layout jumps)
- [ ] Focus management works for keyboard users
- [ ] Browser back/forward works correctly

---

## Cross-Cutting Concerns

### Testing Strategy

Each task should include:
1. **Unit tests** (Vitest) for services, stores, and hooks
2. **Component tests** (Vitest + React Testing Library) for UI components
3. **E2E tests** (Playwright) for critical flows: login, navigation, contact CRUD

**E2E Test Plan (for Phase 1):**
```
e2e/
├── auth.spec.ts          (login, logout, session persistence)
├── navigation.spec.ts    (sidebar, keyboard shortcuts, breadcrumbs)
├── contacts.spec.ts      (list, detail, create, edit, delete)
└── organizations.spec.ts (list, detail, create, edit, delete)
```

### Design System Compliance

All components must use the Design System V2 CSS variables and class patterns from:
- `fox_license/gateway-app/src/index.css`
- `fox_license/gateway-app/src/components/ui/` (for component patterns)
- `fox_license/gateway-app/src/components/layout/` (for layout patterns)

**Key patterns to follow:**
- Use `.fox-*` class naming convention
- Use CSS variables for all colors, spacing, typography
- Follow the dark theme exclusively (no light mode in v1)
- Use Lucide React for all icons
- Follow existing component patterns from the web app

### API Integration Notes

- Base URL: `https://fos.wembassy.com`
- Auth: Session cookie from `POST /user/login`
- Container resolution: `GET /jsonapi/fox_container/fox_container`
- All directory endpoints prefixed: `/fox-daemon/api/directory/{container_name}/`
- The `container_name` comes from `authStore.container.name`

---

## Dependency Graph

```
T1.1 (Scaffold)
├── T1.2 (Tooling)
├── T1.3 (Design System)
│   └── T1.4 (UI Components)
│       ├── T1.12 (TopBar) ──→ T1.16 (Container Select)
│       ├── T1.13 (Sidebar) ──→ T1.25 (Keyboard Shortcuts)
│       └── T1.14 (MainContent) ──→ T1.15 (RightPanel)
│                                  ──→ T1.25 (Keyboard Shortcuts)
├── T1.5 (Main Process + IPC)
│   └── T1.6 (API Client)
│       └── T1.7 (Stores)
│           ├── T1.12 (TopBar)
│           ├── T1.13 (Sidebar)
│           ├── T1.14 (MainContent)
│           └── T1.17 (Directory Types + Services)
│               ├── T1.18 (Contacts List)
│               │   └── T1.19 (Contact Detail)
│               │       └── T1.20 (Contact CRUD)
│               │           └── T1.21 (Search + Filters)
│               └── T1.22 (Organizations List)
│                   └── T1.23 (Org Detail)
│                       └── T1.24 (Org CRUD)
└── T1.8 (Login Screen)
    ├── T1.9 (Secure Storage)
    │   └── T1.10 (Biometric Unlock)
    └── T1.11 (Auto-Lock)
```

---

## Week-by-Week Plan

### Week 1: Foundation

| Day | Tasks |
|-----|-------|
| Mon | T1.1 — Project scaffold |
| Tue | T1.2 — Tooling, T1.3 — Start Design System |
| Wed | T1.3 — Complete Design System, T1.4 — Start UI Components |
| Thu | T1.4 — Complete UI Components |
| Fri | T1.5 — Main process + IPC |

### Week 2: Auth + Layout

| Day | Tasks |
|-----|-------|
| Mon | T1.6 — API Client |
| Tue | T1.7 — Stores |
| Wed | T1.8 — Login Screen |
| Thu | T1.9 — Secure Storage |
| Fri | T1.10 — Biometric Unlock |

### Week 3: Layout + Auth Completion

| Day | Tasks |
|-----|-------|
| Mon | T1.11 — Auto-Lock, T1.12 — Start TopBar |
| Tue | T1.12 — Complete TopBar, T1.13 — Sidebar |
| Wed | T1.14 — MainContent + Routing, T1.15 — RightPanel |
| Thu | T1.16 — Container Select, T1.17 — Directory Types |
| Fri | T1.18 — Start Contacts List |

### Week 4: Contacts + Organizations

| Day | Tasks |
|-----|-------|
| Mon | T1.18 — Complete Contacts List |
| Tue | T1.19 — Contact Detail, T1.20 — Start Contact CRUD |
| Wed | T1.20 — Complete Contact CRUD, T1.21 — Search + Filters |
| Thu | T1.22 — Organizations List, T1.23 — Start Org Detail |
| Fri | T1.23 — Complete Org Detail, T1.24 — Org CRUD, T1.25 — Keyboard Shortcuts |

---

## Risk Notes

1. **Biometric API availability** — macOS Touch ID and Windows Hello have different Electron APIs. T1.10 may need platform-specific implementations. Fallback to password is essential.

2. **Session cookie handling** — Electron's session management differs from browsers. The `POST /user/login` response's `Set-Cookie` header must be correctly extracted and stored via `Electron.session.cookies.set()`.

3. **API rate limiting** — Development against `fos.wembassy.com` should use test containers to avoid rate limits.

4. **Cross-platform testing** — T1.9 (Keychain) and T1.10 (Biometric) must be tested on all three platforms. CI should include macOS and Windows runners.

5. **Design System porting** — The web app uses a specific component structure. Direct CSS copy may need adjustments for Electron context (e.g., no Drupal admin CSS bleed-through).

---

*Document generated by Archer (PRD Architect) — July 6, 2026*  
*Based on PRD v1.0.0 and Design System V2 from fox_license/gateway-app*