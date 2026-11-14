# Hudl Login Automation

A cross-browser end-to-end test automation framework for the [Hudl](https://www.hudl.com/login) login experience, built with **Playwright and TypeScript**.

## Overview

This project validates the Hudl login workflow, including form validation, password visibility, authentication, password recovery navigation, and logout.

The framework uses the **Page Object Model (POM)** to separate page interactions from test assertions, improving readability and maintainability.

## Technology Stack

- **Playwright** — Browser automation and end-to-end testing
- **TypeScript** — Type-safe test development
- **Node.js / npm** — Dependency management and test execution
- **ESLint** — Static code-quality checks
- **GitHub Actions** — Manually triggered CI workflow

## Test Coverage

The suite contains 12 test scenarios:

1. Verify the login page displays the email field and Continue button.
2. Validate the error message for an empty email.
3. Validate the error message for an invalid email format.
4. Verify a valid email advances to the password screen.
5. Validate the error message for an empty password.
6. Verify the password is hidden by default.
7. Verify password visibility can be toggled.
8. Verify successful login using valid credentials.
9. Verify the error message for an incorrect password.
10. Verify users can edit their email address.
11. Verify navigation to the forgot-password page.
12. Verify successful logout.

Each scenario runs against **Chromium, Firefox, and WebKit**, resulting in 36 cross-browser test executions.

## Project Structure

```text
hudl-login-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── DashboardPage.ts
│   └── LoginPage.ts
├── tests/
│   └── login.spec.ts
├── eslint.config.mjs
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Hudl test account for authenticated scenarios

### Installation

Clone the repository and install dependencies:

```bash
npm ci
npx playwright install
```

### Credentials

Authenticated tests require two environment variables:

- `HUDL_EMAIL` — Email address associated with the test account
- `HUDL_PASSWORD` — Password for the test account

For example, in PowerShell:

```powershell
$env:HUDL_EMAIL = "your-test-email@example.com"
$env:HUDL_PASSWORD = Read-Host "Enter Hudl test password"
```

The example above prompts for a password without placing the actual password in the command itself. The password will be visible while typing; use a secure prompt or secret manager when appropriate.

**Never commit credentials to the repository.** Use a dedicated test account rather than a personal or production account.

### Running Tests

Run the complete suite:

```bash
npm test
```

Run Chromium tests only:

```bash
npm run test:chromium
```

List all tests without executing them:

```bash
npm run test:list
```

Tests requiring credentials will fail if the necessary environment variables are missing.

### Code Quality

Run TypeScript validation:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

## Framework Design

### Page Object Model

The framework separates page interactions into reusable classes:

**LoginPage.ts** encapsulates login page navigation, email entry, password entry, password visibility, email editing, and password recovery navigation.

**DashboardPage.ts** encapsulates interactions with the authenticated dashboard, including logout.

**login.spec.ts** contains the test scenarios and assertions.

This separation reduces duplicated interaction logic and makes tests easier to update when the application changes.

### Cross-Browser Testing

Playwright is configured to run against Chromium, Firefox, and WebKit to identify browser-specific issues.

### Debugging and Reporting

The framework includes:

- HTML test reports
- Screenshots on test failure
- Playwright traces on the first retry
- CI retries for transient failures

## Continuous Integration

GitHub Actions is configured with a **manual workflow trigger** to avoid unnecessary authentication attempts against Hudl.

Authenticated execution requires the following GitHub repository secrets:

- `HUDL_EMAIL`
- `HUDL_PASSWORD`

The workflow installs dependencies, installs Playwright browsers, executes the suite, and uploads the HTML test report as an artifact.

The workflow is not intended to run authenticated tests without a properly configured test account.

## Testing Considerations

- Real authentication workflows can be affected by network conditions, account restrictions, and rate limiting.
- Invalid-password testing should be performed sparingly to avoid account lockouts.
- Tests use Playwright's built-in waiting and locator capabilities rather than fixed delays.
- The framework is designed for maintainability and can be extended with additional test scenarios.

## Author

Jared Forsberg

*Developed as a QA Engineer take-home assessment.*