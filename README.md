# FamilyOfficeOS Desktop Application

> **A cross-platform Electron desktop application for Family Office OS**

[![Electron](https://img.shields.io/badge/Electron-28+-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## Overview

FamilyOfficeOS Desktop is an Electron-based cross-platform application that brings the full power of the Family Office OS wealth intelligence platform to native desktop environments. It provides family offices and high-net-worth individuals with secure, offline-capable access to their comprehensive wealth management, governance, CRM, and education systems.

### Key Features

- **Cross-Platform**: Native desktop apps for macOS, Windows, and Linux
- **Offline-First**: Local SQLite caching with background synchronization
- **Multi-Tenant**: Secure container isolation per family office
- **Real-Time**: WebSocket connectivity for live updates and course generation
- **Biometric Auth**: Face ID / Touch ID / Windows Hello integration
- **Native Notifications**: System-level alerts for decisions, meetings, and sync events
- **Auto-Update**: Silent background updates via electron-updater
- **Deep Links**: OS-level URL handling for shared resources

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Electron Main Process                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   Window    │  │    IPC       │  │    Native Services      │ │
│  │   Manager   │  │   Bridge     │  │  - Auto-updater         │ │
│  │             │  │              │  │  - System tray          │ │
│  │  ┌───────┐  │  │  ┌────────┐  │  │  - Notifications        │ │
│  │  │ Browser│  │  │  │Secure │  │  │  - Biometric auth       │ │
│  │  │Window │  │  │  │IPC     │  │  │  - Keychain/Keystore    │ │
│  │  └───────┘  │  │  └────────┘  │  │  - File system          │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                   Renderer Process (Chromium)                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      React 18 + TypeScript                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │ Directory│ │Governance│ │  Wealth  │ │Education │    │ │
│  │  │   /CRM   │ │  Voting  │ │Portfolio │ │  Courses │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │Watchlist │ │   Voice  │ │ Settings │ │  Chat    │    │ │
│  │  │   News   │ │STT/TTS   │ │  Sync    │ │ Gateway  │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Platform Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Local Cache │  │   API Client │  │   Sync Engine        │   │
│  │  (SQLite)    │  │   (Axios)    │  │   (Background)       │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Electron 28+ |
| **Frontend** | React 18 + TypeScript 5 |
| **Build Tool** | Vite + electron-vite |
| **State Management** | Zustand |
| **API Client** | Axios with interceptors |
| **Local DB** | better-sqlite3 |
| **Styling** | TailwindCSS + Design System V2 |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Testing** | Playwright (E2E), Vitest (Unit) |
| **Auto-Update** | electron-updater |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- macOS: Xcode Command Line Tools
- Windows: Visual Studio Build Tools
- Linux: build-essential

### Installation

```bash
# Clone the repository
git clone https://github.com/WembassyCo/familyofficeos-desktop.git
cd familyofficeos-desktop

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development mode
npm run dev
```

### Development Scripts

```bash
npm run dev          # Start Vite + Electron in dev mode
npm run build        # Build for production
npm run build:mac    # Build macOS app
npm run build:win    # Build Windows app
npm run build:linux  # Build Linux app
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

---

## Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # Entry point
│   ├── window.ts           # Window management
│   ├── ipc/                # IPC handlers
│   │   ├── auth.ts         # Authentication IPC
│   │   ├── filesystem.ts   # File system IPC
│   │   ├── notifications.ts # Notifications IPC
│   │   └── sync.ts         # Sync engine IPC
│   ├── services/           # Main process services
│   │   ├── auto-update.ts  # Auto-update service
│   │   ├── keychain.ts     # Secure storage
│   │   ├── notifications.ts # Native notifications
│   │   └── tray.ts         # System tray
│   └── preload/            # Preload scripts
│       └── index.ts        # Secure context bridge
├── renderer/               # React frontend
│   ├── components/         # UI components
│   │   ├── common/         # Shared components
│   │   ├── features/       # Feature modules
│   │   └── layout/         # Layout components
│   ├── hooks/              # React hooks
│   ├── stores/             # Zustand stores
│   ├── services/           # Renderer services
│   │   ├── api.ts          # API client
│   │   ├── cache.ts        # Local cache service
│   │   ├── sync.ts         # Sync queue
│   │   └── websocket.ts     # WebSocket client
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities
│   └── App.tsx             # Root component
├── shared/                 # Shared types/constants
└── assets/                 # Static assets
```

---

## Core Modules

### 1. Directory/CRM
Full-featured CRM with contacts, organizations, sales pipeline, quotes, orders, invoices, contracts, and project management.

**Features:**
- Contact & Organization management
- Sales pipeline (Leads → Opportunities)
- Quotes, Orders, Invoices lifecycle
- Contract management
- Project management with tasks, milestones, time tracking
- CSV import with fuzzy matching
- Multi-provider sync (Google, Microsoft)

### 2. Governance
Digital bylaws, voting, and meeting management for family office governance.

**Features:**
- Digital Charter/Bylaws management
- Decision creation and voting
- Parliamentary procedure support (motions, seconds)
- Real-time vote tallying
- Meeting scheduling and minutes
- Role-based permissions

### 3. Wealth Intelligence
Portfolio aggregation, analytics, and alternative investment tracking.

**Features:**
- Plaid integration (12,000+ institutions)
- Real-time account balances and transactions
- Asset management (RE, PE, public markets, illiquid)
- Performance analytics (TWR, IRR)
- Benchmark comparison
- Net worth tracking

### 4. Family Education
AI-powered course generation and family education platform.

**Features:**
- Course creation and management
- AI course generation (research-driven v2)
- HeyGen video integration
- User skills tracking
- Certifications
- SSE streaming for generation progress

### 5. Watchlist
News monitoring and story tracking.

**Features:**
- Watchlist entry management
- News story aggregation
- Automated scanning

### 6. Voice
Speech-to-text and text-to-speech capabilities.

**Features:**
- Whisper-based transcription
- Piper TTS with multiple voices
- Language selection

---

## Authentication

FamilyOfficeOS Desktop uses **Drupal session-based authentication** with secure credential storage.

### Login Flow

```
1. User enters credentials
2. POST https://fos.wembassy.com/user/login
3. Session cookie (SESSxxxxxx) received
4. Credentials stored in Keychain/Keystore
5. Subsequent requests include session cookie
6. Auto-refresh on 401 responses
```

### Security Features

- **Credential Storage**: macOS Keychain / Windows Credential Manager / Linux libsecret
- **Biometric Unlock**: Face ID / Touch ID / Windows Hello
- **Auto-Lock**: Configurable session timeout
- **Certificate Pinning**: For API endpoint security
- **Secure IPC**: All main/renderer communication via contextBridge

---

## Offline Support

### Local Cache

- **Database**: better-sqlite3 with encrypted SQLite
- **Sync Strategy**: Last-write-wins with conflict resolution
- **Queue**: Background sync queue for mutations
- **Storage**: Contact photos, documents, course videos

### Sync Engine

```
Online Changes → Local DB → API Request → Server
                                    ↓
Offline Changes → Local DB → Sync Queue → (wait for online)
                                              ↓
                                    API Request → Server
```

---

## API Integration

All API calls route through the Drupal backend which proxies to container daemons.

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://fos.wembassy.com` |
| Staging | `https://staging.fos.wembassy.com` |
| Local Dev | `http://localhost:8080` |

### Key Endpoints

- **JSON:API**: `/jsonapi/{entity_type}/{bundle}`
- **Directory**: `/fox-daemon/api/directory/{container_name}/`
- **Governance**: `/fox-daemon/api/governance/{container_name}/`
- **Education v1**: `/api/v1/fos/{container_name}/education/`
- **Education v2**: `/api/v2/fos/{container_name}/education/`
- **Wealth**: `/api/wealth/`

See [PRD.md](./PRD.md) for complete API documentation.

---

## Building and Releasing

### Local Development Build

```bash
# Development mode with hot reload
npm run dev

# Production build (all platforms)
npm run build

# Platform-specific builds
npm run build:mac     # macOS DMG (x64 + arm64)
npm run build:win     # Windows NSIS installer
npm run build:linux   # Linux AppImage
```

### Automated Releases (GitHub Actions)

**Automatic Release on Tag:**
```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The GitHub Actions workflow will:
1. Build for macOS (Intel + Apple Silicon)
2. Build for Windows (x64 + arm64)
3. Build for Linux (AppImage)
4. Create a GitHub Release with all artifacts
5. Auto-generate release notes

**Artifacts Created:**
| Platform | Format | Filename Pattern |
|----------|--------|------------------|
| macOS | DMG | `FamilyOfficeOS-1.0.0.dmg` |
| macOS | ZIP | `FamilyOfficeOS-1.0.0-mac.zip` |
| Windows | NSIS | `FamilyOfficeOS Setup 1.0.0.exe` |
| Linux | AppImage | `FamilyOfficeOS-1.0.0.AppImage` |

### Manual Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: bump version to 1.0.0"`
4. Tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
5. Push: `git push origin main --tags`
6. GitHub Actions builds and releases automatically

### Auto-Update

The app includes `electron-updater` for automatic updates. New releases published to GitHub will prompt users to update.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb + TypeScript configuration
- **Prettier**: Code formatting
- **Testing**: 80% coverage minimum
- **Conventional Commits**: Commit message format

---

## Security

See [SECURITY.md](./SECURITY.md) for security policies and vulnerability reporting.

---

## License

Proprietary - Wembassy LLC. All rights reserved.

---

## Support

- **Documentation**: [https://docs.familyofficeos.com](https://docs.familyofficeos.com)
- **Support Email**: support@wembassy.com
- **Status Page**: [https://status.familyofficeos.com](https://status.familyofficeos.com)

---

## Acknowledgments

Built with ❤️ by the Wembassy team for family offices worldwide.