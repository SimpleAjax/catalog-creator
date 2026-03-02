# Feature: Templates (Catalog Templates & Tag Presets)

## Overview
Template system for reusing catalog designs and tag combinations. Speeds up repetitive catalog creation.

## Acceptance Criteria
- [ ] User can save catalog as template
- [ ] User can create new catalog from template
- [ ] User can create tag presets
- [ ] User can apply tag presets to products
- [ ] User can delete templates/presets
- [ ] User can rename templates/presets

---

## Phase 1: E2E Integration Tests

**Test File:** `e2e/templates-flow.test.ts`

### Test 1: Save Catalog Template
```
Scenario: Save and reuse catalog design
Given I have a published catalog
With "Festive" template, red/gold colors
When I tap "Save as Template"
And I name it "My Festive Style"
Then template is saved
When I create new catalog
Then I see "My Festive Style" in template list
When I select it
Then new catalog has same colors and layout
```

### Test 2: Tag Preset Flow
```
Scenario: Create and apply tag preset
Given I'm tagging products
And I've selected "festive", "premium", "limited"
When I tap "Save as Preset"
And I name it "Festive Drop"
Then preset is saved
When I go to tag other products
Then I see "Festive Drop" button
When I tap it
Then all three tags are applied at once
```

### Test 3: Template Management
```
Scenario: Manage saved templates
Given I have 5 catalog templates
When I go to Templates screen
Then I see all 5 templates
When I tap menu on one
And I tap "Rename"
And I enter new name
Then template is renamed
When I tap "Delete"
And I confirm
Then template is removed
```

**Acceptance Criteria:**
- [ ] All 3 E2E tests pass
- [ ] Template creation works correctly
- [ ] Preset application works correctly

---

## Phase 2: Unit Tests

### Component Tests

**File:** `src/components/TemplateCard.test.tsx`
- `renders template preview`
- `shows template name and metadata`
- `calls onSelect when tapped`
- `shows menu button when provided`

**File:** `src/components/PresetButton.test.tsx`
- `renders preset name`
- `shows tag count`
- `calls onPress when tapped`
- `applies correct styling`

### Store Tests

**File:** `src/store/useTemplateStore.test.ts`
- `saves catalog as template`
- `lists all templates`
- `deletes template`
- `renames template`
- `applies template to new catalog`

**File:** `src/store/useTagPresetStore.test.ts`
- `creates tag preset`
- `lists all presets`
- `applies preset to products`
- `deletes preset`

---

## Phase 3: Implementation

### Step 1: Template Data Model

**File:** `src/types/template.ts`

```typescript
export interface CatalogTemplate {
  id: string;
  name: string;
  description?: string;
  // Template configuration
  templateType: 'minimal' | 'bold' | 'elegant' | 'festive' | 'modern';
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  headerEnabled: boolean;
  footerEnabled: boolean;
  // Metadata
  createdAt: string;
  lastUsed?: string;
}
```

**Database:**
```sql
CREATE TABLE catalog_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  templateType TEXT NOT NULL,
  primaryColor TEXT NOT NULL,
  secondaryColor TEXT NOT NULL,
  fontFamily TEXT,
  headerEnabled INTEGER DEFAULT 1,
  footerEnabled INTEGER DEFAULT 1,
  createdAt TEXT NOT NULL,
  lastUsed TEXT
);
```

---

### Step 2: Tag Preset Data Model

**File:** `src/types/tagPreset.ts`

```typescript
export interface TagPreset {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  useCount: number;
}
```

**Database:**
```sql
CREATE TABLE tag_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON array
  createdAt TEXT NOT NULL,
  useCount INTEGER DEFAULT 0
);
```

---

### Step 3: Templates Store

**File:** `src/store/useTemplateStore.ts`

**State:**
```typescript
interface TemplateState {
  templates: CatalogTemplate[];
  loadTemplates: () => Promise<void>;
  saveAsTemplate: (catalog: Catalog, name: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  renameTemplate: (id: string, name: string) => Promise<void>;
  applyTemplate: (id: string) => Catalog;
}
```

---

### Step 4: Templates Screen

**File:** `src/screens/TemplatesScreen.tsx`

**Two Tabs:**

**Tab 1: Catalog Templates**
```
┌─────────────────────────────┐
│ My Templates                │
│ [Catalog Templates] [Tags]  │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🟥 My Festive Style    ⋯│ │
│ │    Used 5 times         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ⬜ Daily Basics        ⋯│ │
│ │    Used 12 times        │ │
│ └─────────────────────────┘ │
│                             │
│ [  + Create from Scratch  ] │
└─────────────────────────────┘
```

**Tab 2: Tag Presets**
```
│                             │
│ Quick Tag Presets:          │
│                             │
│ [Festive Drop]         [⋯]  │
│ festive • premium • limited │
│                             │
│ [Cotton Basics]        [⋯]  │
│ cotton • daily-wear       │
│                             │
│ [   + Create Preset   ]     │
```

**Features:**
- Tab switching
- Template/preset cards
- Menu actions (Rename, Delete)
- Create new buttons
- Usage count display

---

### Step 5: Save Template UI

**Update:** `src/screens/CatalogPreviewScreen.tsx`

Add "Save as Template" button in menu/actions.

**Flow:**
1. User taps "Save as Template"
2. Show modal with name input
3. Save current catalog configuration
4. Show success toast

---

### Step 6: Preset Integration

**Update:** `src/screens/BulkTagScreen.tsx`

Already implemented in Products feature. Verify:
- Preset buttons appear
- Tapping applies tags
- "Save as Preset" button works

---

## Verification

### Manual Testing Checklist

**Catalog Templates:**
- [ ] Can save catalog as template
- [ ] Template appears in list
- [ ] Template shows preview
- [ ] Can create catalog from template
- [ ] New catalog inherits template settings
- [ ] Can rename template
- [ ] Can delete template

**Tag Presets:**
- [ ] Can create preset from selected tags
- [ ] Preset appears in list
- [ ] Tapping preset applies all tags
- [ ] Can delete preset
- [ ] Usage count increments

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Template Model | ⬜ Not Started | | |
| | Preset Model | ⬜ Not Started | | |
| | TemplatesScreen | ⬜ Not Started | | |
| | Integration | ⬜ Not Started | | |

---

## Insights & Decisions

- Max templates limit: ___
- Template storage strategy: ___
- Preset quick-apply location: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to 06-export-share-feature/export-share.md*
