# All In One Desktop App

[![CI/CD Status](https://github.com/kumarsundeep/AllInOneDesktopApp/workflows/Build%20and%20Release/badge.svg)](https://github.com/kumarsundeep/AllInOneDesktopApp/actions)

Generates production ready .exe, .dmg, .deb, etc. from a single codebase.

## Overview of Features

### Security

- Content Security Policy (CSP) implemented
- Replaced deprecated Electron APIs
- Enabled context isolation and disabled nodeIntegration
- Sanitized user input in `webContents.executeJavaScript` calls
- Certificate pinning for auto-updates

### Core Functionality

- Preferences window
- Auto-update functionality
- Multi-platform packaging (Windows, macOS, Linux)
- Support for multiple Linux formats (AppImage, deb, rpm, snap)

### Performance Optimizations

- Build caching using Vite
- Code splitting for node_modules
- Lazy loading for non-critical components
- Minification for production builds
- Source maps for development

### User Experience

- Responsive window dimensions
- Accessible controls (keyboard navigation, screen reader compatibility)
- Dark/light theme switching
- Memory usage monitoring

### CI/CD Capabilities

- Automated release workflow
- Build matrix for multi-platform testing
- Weekly dependency audits
- GitHub Releases publishing

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/kumarsundeep/AllInOneDesktopApp.git
   ```
2. Install dependencies:
   ```bash
   cd AllInOneDesktopApp
   npm install
   ```
3. Configure environment variables (if needed) by creating a `.env` file.

## Usage Guide

### Development

```bash
npm start
```

### Production Build

```bash
npm run build
```

### Packaging for Distribution

- macOS:
  ```bash
  npm run dist:mac
  ```
- Windows:
  ```bash
  npm run dist:win
  ```
- Linux:
  ```bash
  npm run dist:linux
  ```

### Preferences

Access the Preferences window via the application menu to configure settings.

### Auto-updates

The application automatically checks for updates on startup. Manual checks can be performed via the application menu.

## Build and Test

### Build Commands

- `npm run build`: Builds the production version of the app
- `npm run dist`: Builds and packages the app for all platforms
- Platform-specific builds: `dist:mac`, `dist:win`, `dist:linux`

### Testing

```bash
npm test
```

This command runs:

- Linting with ESLint
- Code formatting with Prettier

## Contribution Guidelines

We welcome contributions! Please follow these guidelines:

### Code Standards

- Follow the existing code style (ESLint and Prettier configured)
- Use ES Modules
- Write docstrings for functions (Google style)

### Testing

- Unit tests are required for new features
- Tests should cover:
  - Expected use
  - Edge cases
  - Failure cases
- Place tests in the `/tests` directory mirroring the app structure

### Pull Request Process

1. Create a new branch for your feature or fix
2. Ensure all tests pass (`npm test`)
3. Update TASK.md if your contribution completes a task or adds a new one
4. Submit a pull request with a clear description

## Security and Compliance

### Security Measures

- Regular dependency audits (weekly via GitHub Actions)
- Certificate pinning for update server
- Sandboxing and context isolation

### Vulnerability Reporting

Please report any security vulnerabilities to security@example.com

### Compliance

This project adheres to the following compliance standards:

- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
