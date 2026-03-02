# UX Prototype Plan (Web — Pre-Development Validation)

> **Purpose:** Validate the full user flow in a browser before writing any React Native code. You interact with it yourself using dummy data to feel if the flow is right.

---

## Prototype Conclusions & Final Decisions

After building and testing the web prototype, we learned several key lessons that shaped the final app design:

### 1. "Import" → "Add Products"
**Original:** Complex import flow with wholesaler selection, batch naming, and grouping  
**Final:** Simple 2-step "Add Products" flow (select photos → review → done)  
**Why:** Users don't understand "import." They just want to add their product photos quickly. Technical details like "wholesaler" can be tracked automatically in the background.

### 2. Products & Catalogs Are First-Class
**Original:** Home had Import, Recent Imports, and secondary product access  
**Final:** Big visual cards for Products and Catalogs on the home screen  
**Why:** These are the only two things users care about. Everything else (tagging, organizing, templates) supports these two goals.

### 3. Search Is Primary Navigation
**Original:** Browse-based navigation  
**Final:** Prominent search bar, search-first architecture  
**Why:** When you have 500+ products, you don't browse—you search "red saree under 500."

### 4. Tag Presets Save Time
**Original:** Tag each product individually  
**Final:** Save common tag combinations as presets (e.g., "Festive Drop" = festive + premium + limited)  
**Why:** Retailers tag products the same way repeatedly. One-tap presets reduce 20 taps to 1 tap.

### 5. Templates Enable Reuse
**Original:** Build catalog from scratch every time  
**Final:** Save catalog designs as templates  
**Why:** A retailer creates similar catalogs monthly ("New Arrivals", "Festive Collection"). Templates let them swap products while keeping the same professional design.

---

## Goal

Answer one question: *"Does this flow feel fast, clear, and natural for a small retailer?"*

This is a **click-through prototype with real interactions** — not a static mockup. You should be able to import, tag, search, build a catalog, preview it, and simulate sharing.

---

## Tech Recommendation: Vite + React + shadcn/ui

| Choice | Why |
|---|---|
| **Vite + React** | Instant dev server, zero config, hot reload |
| **shadcn/ui** | Production-quality components out of the box, matches your preferred stack |
| **Zustand** | Simple in-memory state — no backend, no database needed |
| **TailwindCSS** | Required by shadcn/ui; utility classes for rapid layout |
| **No backend** | Everything in-memory JS with dummy JSON — reset on refresh |

> **Mobile simulation:** The app renders inside a fixed `390px × 844px` phone-shaped container in the browser. Feels like using the real app without needing a device.

---

## Dummy Data Strategy

Pre-load the app with realistic seed data so you can immediately start interacting:

```
Dummy Products: 40–60 product images
  - Use free Unsplash product photos (clothing, jewelry, fabric)
  - Pre-tagged (festive, red, cotton, under-500, etc.)
  - Pre-categorized (Sarees → Silk, Dupattas, etc.)
  - Mix of: priced, unpriced, archived, in-stock, limited

Dummy Catalogs: 3 pre-built
  - "Diwali Collection 2024" (20 products, Festive template)
  - "Daily Wear Basics" (15 products, Minimal template)
  - "Draft: New Arrivals" (draft state)

Dummy Tag Presets: 3 saved
  - "Festive Drop" = festive, premium, limited
  - "Cotton Basics" = cotton, daily-wear, under-500
  - "New Stock" = new-arrival, in-stock

Dummy Wholesaler Batches:
  - "Amit – Feb 28" (23 products)
  - "Surat Supplier – Feb 20" (18 products)
```

---

## Screens & Flows to Build

Build **only what's needed to validate the flow** — no edge cases, no error states.

### Screen 1 — Home / Dashboard

```
- Counts: Products (58), Catalogs (3), Recent imports
- Quick actions: [+ Import] [New Catalog] [Search]
- Recent catalogs strip (horizontal scroll)
- Recent import batch card ("Amit – Feb 28, 23 products →")
```

### Screen 2 — Add Products Flow (Previously "Import Flow")

```
Step 1: Photo picker (simulated — clicking button shows a dummy grid of 
        unassigned images from a pre-loaded pool)
Step 2: Review screen — "12 products ready to add" with preview thumbnails
Step 3: Tap "Add Products" → redirects to bulk tag screen
```

*Key question to validate: Is the simplified 2-step flow better than the original 4-step import with wholesaler selection?*

### Screen 3 — Product Library

```
- Grid view (3 columns) of all products
- Top bar: search input (instant filter on dummy data)
- Filter chips: [All] [Clothing] [Festive] [Under ₹500] [Untagged]
- Tap product → product detail drawer (name, price, tags, category)
- Long press / checkbox → bulk select → bulk tag / move / archive
- Saved filters shown as pinned chips
```

*Key question: Is the grid the right default? Or should list view be default?*

### Screen 4 — Tag & Organize (Bulk)

```
- Selected products shown as thumbs strip at top
- Tag input with autocomplete from existing tags
- Tag preset buttons: [Festive Drop] [Cotton Basics] [+ New Preset]
- Category picker (tree)
- "Apply to all selected" → done
```

*Key question: Does the preset system feel fast? Is 1 screen enough or does it need to be split?*

### Screen 5 — Search Screen

```
- Full-screen search
- Results as you type (filter over dummy JSON)
- Filter panel (slide-up): category, tags, price range, date
- Saved filter chips at top
- Results show: product image, name, tags, price
```

*Key question: Is search fast and obvious enough? Do users naturally reach for it?*

### Screen 6 — Catalog Builder

```
Step 1: Name + template picker (5 templates as visual cards with previews)
Step 2: Product selector (search/filter to add products)
Step 3: Customize panel (color picker, logo upload, store name, font)
Step 4: Preview — rendered catalog pages (2-3 pages)
Step 5: "Share" → simulated action sheet (PDF / Image / WhatsApp)
```

*Key question: Is the 5-step flow too many taps? Should product selection happen before template pick?*

### Screen 7 — Catalog Preview

```
- Rendered grid of product cards using selected template + customizations
- Swipe between pages
- Tap product card → quick edit (price, name)
- Bottom bar: [Edit] [Export PDF] [Share Image] [WhatsApp]
```

### Screen 8 — My Templates

```
- Saved catalog templates (from "Save as Template" action)
- Saved tag presets
- Tap → rename / delete / use
```

---

## What to Skip in the Prototype

| Feature | Why Skip |
|---|---|
| Actual PDF generation | Rendering catalog preview is enough to validate layout |
| Real file import | Simulated picker with pre-loaded dummy images is sufficient |
| Persistence | In-memory state only, resets on refresh |
| Error states / validation | Not needed for UX flow validation |
| Auth, settings, billing | Out of scope for flow validation |
| Animations / transitions | Add only enough to feel native (page slide, drawer open) |

---

## Prototype Success Criteria

After interacting with the prototype, you should be able to answer:

- [ ] Is the add → tag → library flow the right order?
- [ ] Does search feel fast and natural to reach for?
- [ ] Is the catalog builder the right number of steps?
- [ ] Does "save as template" feel valuable and obvious?
- [ ] Are there screens that feel redundant or missing?
- [ ] What's the first thing I reach for when I open the app?

---

## Build Order (Suggested)

| Priority | Screen | Estimated Time |
|---|---|---|
| 1 | Home + Product Library (with search) | ~2 hrs |
| 2 | Tag & Organize (bulk, presets) | ~1.5 hrs |
| 3 | Catalog Builder (step flow) | ~2 hrs |
| 4 | Catalog Preview | ~1 hr |
| 5 | Add Products Flow | ~1 hr |
| 6 | My Templates screen | ~30 min |
| **Total** | | **~8 hrs** |

---

## Final App UI Overview & Design Philosophy

After prototyping, here is the consolidated vision for the final app interface and user flows:

### Core Design Principles

1. **Two Things Matter: Products & Catalogs** — Everything else is secondary
2. **Add, Don't Import** — Users "add products" (not "import batches"). Technical concepts like "wholesaler" and "source" are tracked automatically in the background
3. **See It, Tap It** — No hidden gestures. Everything is visible and tappable
4. **One-Tap Actions** — Most common actions are accessible within one tap from the home screen

---

### Home Screen — The Dashboard

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  9:41                           5G 100% │
│                                         │
│  Welcome back               [🔍]        │
│  My Store                               │
│                                         │
│  ┌─────────────────┐ ┌────────────────┐ │
│  │  📦             │ │  📖            │ │
│  │  58             │ │  3             │ │
│  │  Products       │ │  Catalogs      │ │
│  │  [+ Add New]    │ │  [+ Create]    │ │
│  └─────────────────┘ └────────────────┘ │
│                                         │
│  [      + Add Products      ]           │
│                                         │
│  Your Catalogs                    See All│
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ Diw │ │ Dai │ │ +   │  ← scroll →  │
│  │ ali │ │ ly  │ │ New │              │
│  └─────┘ └─────┘ └─────┘              │
│                                         │
│  Recent Products                  See All│
│  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐    │
│  └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘    │
│                                         │
│  💡 Tip: Tag products to find them fast │
│                                         │
│  [🏠]   [📦]   [📖]   [🎨]             │
└─────────────────────────────────────────┘
```

**Design Decisions:**
- **Big Cards for Products & Catalogs** — Visual hierarchy matches user priority. These are the two things users care about most
- **Prominent "Add Products" Button** — A single, clear call-to-action that replaces the confusing "Import" concept
- **Horizontal Catalog Scroll** — Users can see their catalogs immediately without navigating away
- **Recent Products Grid** — Visual reminder of what's in the library, also acts as quick access
- **Bottom Navigation** — Four core sections: Home, Products, Catalogs, Templates

---

### Add Products Flow

**Simplified from 3-step "Import" to 2-step "Add":**

| Step | Screen | What User Sees |
|------|--------|----------------|
| 1 | **Select** | Grid of recent photos + Camera/File options. Tap to select multiple. No wholesaler, no batch name, no complexity |
| 2 | **Review** | "12 products ready to add" with preview thumbnails. Tap "Add Products" → goes to Bulk Tag screen |

**Why This Works:**
- **No technical jargon** — "Add" is understood by everyone; "Import" sounds like computer-speak
- **No upfront categorization** — Users just select photos. Source is auto-set to "Gallery" and can be changed later if needed
- **Fast path to tagging** — After adding, users immediately land in bulk tag mode to organize their new products

---

### Products Screen — The Library

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  [←] Products (58)            [✓]       │
│  ┌──────────────────────────────────┐   │
│  │ 🔍 Search products, tags...      │   │
│  └──────────────────────────────────┘   │
│  [All] [Clothing] [Festive] [Under₹500] │
│                                         │
│  ┌──┐┌──┐┌──┐  ┌──┐┌──┐┌──┐  ┌──┐┌──┐ │
│  │📷││📷││📷│  │📷││📷││📷│  │📷││📷│ │
│  │₹499     │  │Festive  │  │      │  │
│  └──┘└──┘└──┘  └──┘└──┘└──┘  └──┘└──┘ │
│                                         │
│     3-column grid, scrollable          │
│                                         │
└─────────────────────────────────────────┘
```

**Key Interactions:**
- **3-Column Grid** — Maximum visual density while remaining tappable. Photos are the hero
- **Long-Press to Select** — Enter bulk selection mode for tagging multiple products
- **Filter Chips** — One-tap filtering by common categories (auto-generated from user's tags)
- **Price Badges** — Prices shown on thumbnails when available. Festive/sale tags shown as small colored badges

---

### Bulk Tag Screen — Organize Fast

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  [←] Tag & Organize       12 selected   │
│  ┌──┐┌──┐┌──┐┌──┐...+8 more            │
│  └──┘└──┘└──┘└──┘                      │
│                                         │
│  Quick Apply:                           │
│  [Festive Drop] [Cotton Basics] [New]   │
│                                         │
│  Category                               │
│  [Sarees ▼]                             │
│                                         │
│  Tags                                   │
│  [festive] [red] [+]                    │
│  ─────────────────────────────         │
│  cotton  silk  under-500  premium...    │
│                                         │
│  [    Apply to 12 Products    ]         │
└─────────────────────────────────────────┘
```

**Design Decisions:**
- **Thumbnail Strip at Top** — Constant reminder of what's being tagged
- **Tag Presets as Buttons** — One-tap to apply common tag combinations (e.g., "Festive Drop" = festive + premium + limited)
- **Category Picker** — Simple dropdown, not a complex tree
- **New Tag Input** — Type and press enter to create custom tags on the fly
- **Apply Button** — Clear action with count ("Apply to 12 Products")

---

### Catalog Builder — 4 Simple Steps

**Flow Overview:**
```
Step 1: Pick Template    →  Step 2: Select Products
      ↓                           ↓
Step 4: Preview          ←  Step 3: Customize Look
      ↓
   [Share]
```

**Step 1 — Template Picker:**
- 5 visual template cards with preview images
- Tap to select, see template name + description
- Shows color palette preview

**Step 2 — Product Selector:**
- Search bar at top
- 3-column grid of all products
- Tap to select/unselect (checkmark appears)
- Counter shows "23 selected"

**Step 3 — Customize:**
- Color pickers (Primary & Secondary)
- Store name input
- Font style selector (simple list)
- No overwhelming options — just the essentials

**Step 4 — Preview:**
- Rendered catalog page showing actual products
- Page counter ("Page 1 of 3")
- Swipe to see different pages
- Products displayed in selected template style

---

### Catalog Preview — Share Ready

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  [←] Diwali Collection     [✏️]        │
│       Page 1 of 3                       │
│  [←]                      [→]          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      Riya's Fashion             │    │
│  │      Diwali Collection 2024     │    │
│  │  ┌────┐ ┌────┐                  │    │
│  │  │ 🟥 │ │ 🟥 │  products...     │    │
│  │  │₹499│ │₹799│                  │    │
│  │  └────┘ └────┘                  │    │
│  │  ┌────┐ ┌────┐                  │    │
│  │  │ 🟥 │ │ 🟥 │                  │    │
│  │  └────┘ └────┘                  │    │
│  │      WhatsApp: +91 98765...     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌────────┬────────┬────────┐          │
│  │  PDF   │ Image  │WhatsApp│          │
│  └────────┴────────┴────────┘          │
└─────────────────────────────────────────┘
```

**Share Options:**
- **PDF** — High quality, printable
- **Image** — For Instagram, Stories, WhatsApp status
- **WhatsApp** — Direct share to contacts

---

### Search Screen — Find Anything

**Design:**
- Full-screen search with large input field
- Recent searches shown below (tap to re-run)
- Results grouped by: Products | Catalogs | Tags
- Filter slide-up panel for advanced filtering (price range, date, stock status)

**Why This Works:**
- Search is the **primary navigation method** for large libraries
- Users don't browse 500 products — they search "red saree under 500"
- Auto-complete from existing tags and product names

---

### Catalogs List Screen — Manage All Catalogs

**When to Access:** Bottom nav "Catalogs" tab

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  My Catalogs              [+]           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🟥  Diwali Collection           │⋯│  │
│  │     20 products • Published     │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ ⬜  Daily Wear Basics           │⋯│  │
│  │     15 products • Draft         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [      + Create New Catalog      ]     │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- List view (not grid) — better for scanning catalog names
- Status badges (Published/Draft)
- Quick actions menu (⋯) for: View, Duplicate, Delete
- Tap catalog → Preview screen

---

### Templates Screen — Reuse & Save Time

**Two Tabs:**
1. **Catalog Templates** — Saved layouts from "Save as Template" action
2. **Tag Presets** — Saved tag combinations

**Use Case:**
- User creates a "Festive Collection" catalog with red/gold theme
- Saves it as template
- Next month: Tap template → New catalog ready with same styling → Just swap products

---

## User Flow Summary

### Flow 1: Add Products & Create Catalog (Happy Path)
```
Home → Add Products → Select Photos → Review → Bulk Tag 
→ Home → Create Catalog → Template → Products → Customize → Preview → Share
```
**Time:** < 5 minutes for 20 products

### Flow 2: Find & Share Existing Product
```
Home → Search "red saree" → Tap Product → Share via WhatsApp
```
**Time:** < 30 seconds

### Flow 3: Create Catalog from Tagged Products
```
Home → Catalogs → Create New → Template → Search "festive" 
→ Select All → Customize → Preview → Export PDF
```
**Time:** < 3 minutes

---

## Why This UI Works for Small Retailers

| User Characteristic | UI Adaptation |
|---------------------|---------------|
| **Not tech-savvy** | No jargon ("Add" not "Import"), visible buttons, no hidden gestures |
| **Uses smartphone primarily** | Everything designed for thumb reach, large tap targets |
| **Time-constrained** | One-tap actions, presets, templates for reuse |
| **Visual thinker** | Photos are hero, grid layouts, color previews |
| **Organizes by occasion** | Tag presets for "Festive", "Daily Wear", etc. |
| **Shares via WhatsApp** | WhatsApp share is first-class, not buried in menus |

---

## What's Hidden (Advanced/Background)

These features exist but aren't in the main flow:

| Feature | Where It Lives |
|---------|----------------|
| Wholesaler/Source tracking | Auto-set to "Gallery", editable in product detail |
| Archive | Long-press product → Archive |
| Price editing | Tap product → Edit price |
| Batch operations | Select multiple → Action bar appears |
| Settings | Bottom of Templates screen |

---

*This prototype document captures our UX experiments and learnings. The actual app implementation should follow the main PRD and Design System.*
