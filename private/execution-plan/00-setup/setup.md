# Phase 0: Project Setup

## Overview
Initialize the React Native (Expo) project with all necessary dependencies, testing framework, and folder structure.

## Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally
- Android Studio or Xcode for simulators
- Git configured

---

## Execution Steps

### Step 1: Initialize Expo Project

**Task:** Create new Expo managed workflow project

```bash
# Command to run (executor decides exact flags)
npx create-expo-app catalog-creator --template blank-typescript
```

**Acceptance Criteria:**
- [ ] Project initializes without errors
- [ ] TypeScript configured
- [ ] Runs on both iOS and Android simulators
- [ ] Metro bundler starts successfully

**Implementation Notes (for executor):**
- Use `--template blank-typescript` for clean start
- Consider `--template tabs` if you want pre-configured navigation, but blank gives more control
- Document any Expo SDK version issues encountered

---

### Step 2: Install Core Dependencies

**Task:** Install required packages

**Categories to install:**

1. **Navigation**
   - `@react-navigation/native`
   - `@react-navigation/bottom-tabs`
   - `@react-navigation/native-stack`
   - `react-native-screens`
   - `react-native-safe-area-context`

2. **State Management**
   - `zustand`
   - `immer` (for immutable updates in Zustand)

3. **Database**
   - `expo-sqlite`

4. **UI/UX**
   - `react-native-reanimated` (for smooth animations)
   - `react-native-gesture-handler` (for gestures)
   - `lucide-react-native` (icons)

5. **Utilities**
   - `date-fns` (date formatting)
   - `uuid` (ID generation)

**Acceptance Criteria:**
- [ ] All packages install without conflicts
- [ ] `expo doctor` passes with no critical issues
- [ ] App still runs after package installation

**Implementation Notes:**
- Check Expo SDK compatibility matrix before installing
- Use `expo install` for Expo-specific packages
- Pin versions if necessary to avoid breaking changes

---

### Step 3: Install Testing Framework

**Task:** Set up testing infrastructure

**Packages to install:**
- `jest` (included with Expo, but verify version)
- `@testing-library/react-native`
- `@testing-library/jest-native`
- `jest-expo`
- `detox` (for E2E) OR `maestro` (alternative)

**Acceptance Criteria:**
- [ ] `npm test` runs successfully
- [ ] Jest configuration works with TypeScript
- [ ] Sample test passes
- [ ] E2E framework initializes (Detox/Maestro)

**Implementation Notes:**
- Detox requires additional setup for iOS/Android build configs
- Maestro is simpler but less powerful
- Executor should choose based on familiarity

---

### Step 4: Project Folder Structure

**Task:** Create organized folder structure

**Required structure:**
```
src/
├── api/                    # Database operations
├── components/             # Reusable UI components
│   ├── buttons/
│   ├── cards/
│   ├── inputs/
│   └── navigation/
├── constants/              # App constants
├── hooks/                  # Custom React hooks
├── navigation/             # Navigation configuration
├── screens/                # Screen components
├── store/                  # Zustand store
├── theme/                  # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── types/                  # TypeScript types
└── utils/                  # Utility functions
```

**Acceptance Criteria:**
- [ ] All folders created
- [ ] Empty `.gitkeep` or `index.ts` files where needed
- [ ] Import paths work (no broken references)

---

### Step 5: Configure TypeScript

**Task:** Set up strict TypeScript configuration

**Requirements:**
- Strict mode enabled
- Path aliases configured (e.g., `@/components` → `src/components`)
- Type definitions for all packages

**Acceptance Criteria:**
- [ ] `npx tsc --noEmit` passes
- [ ] No TypeScript errors in IDE
- [ ] Path imports resolve correctly

---

### Step 6: Configure ESLint & Prettier

**Task:** Set up code formatting and linting

**Requirements:**
- ESLint with React Native rules
- Prettier for formatting
- Pre-commit hooks (optional but recommended)

**Acceptance Criteria:**
- [ ] `npm run lint` passes
- [ ] `npm run format` works
- [ ] No linting errors in sample files

---

### Step 7: Git Repository Setup

**Task:** Initialize and configure Git

**Requirements:**
- `.gitignore` configured for React Native
- Initial commit with setup
- Branch protection rules (if using GitHub/GitLab)

**Acceptance Criteria:**
- [ ] Repository initialized
- [ ] `.gitignore` includes: node_modules, .expo, *.log, etc.
- [ ] First commit successful

---

## Verification

Run this checklist before moving to Phase 1:

- [ ] App launches on iOS simulator
- [ ] App launches on Android emulator
- [ ] Hot reload works
- [ ] `npm test` runs without errors
- [ ] TypeScript compilation passes
- [ ] Linting passes
- [ ] No console warnings about missing dependencies

---

## Progress Tracking

| Date | Step | Status | Blockers | Notes |
|------|------|--------|----------|-------|
| | 1. Initialize | ⬜ Not Started | | |
| | 2. Dependencies | ⬜ Not Started | | |
| | 3. Testing | ⬜ Not Started | | |
| | 4. Structure | ⬜ Not Started | | |
| | 5. TypeScript | ⬜ Not Started | | |
| | 6. ESLint | ⬜ Not Started | | |
| | 7. Git | ⬜ Not Started | | |

---

## Insights & Decisions

*Document any decisions made during setup:*

- Expo SDK version chosen: ___
- Testing framework chosen: ___
- Any package version conflicts and resolutions: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*Once complete, move to 01-core-infrastructure/database.md*
