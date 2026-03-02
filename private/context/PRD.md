# Catalog Creator — Product Requirements Document

> **Version:** 1.2  
> **Date:** 2026-03-02  
> **Author:** Product Team  
> **Status:** ✅ All Decisions Resolved — Ready for Development  

---

## Decisions Log

| # | Decision | Resolved |
|---|---|---|
| 1 | **Full local storage** — no cloud in Phase 1. Cloud backup in Phase 2+. | ✅ |
| 2 | **No auth** — skip authentication for Phase 1. Single-user local app. | ✅ |
| 3 | **React Native (Expo)** — Expo managed workflow. Mobile-only. | ✅ |
| 4 | **No web app** — skip web entirely for Phase 1. | ✅ |
| 5 | **No analytics** — move to Phase 2. | ✅ |
| 6 | **No smart suggestions / AI tagging** — move to Phase 2. | ✅ |
| 7 | **Custom flows** — users save their own templates + tagging workflows. | ✅ |
| 8 | **Per-customer tracking** — track what was sent to whom, versions sold — Phase 2. | ✅ |
| 9 | **SQLite (raw, `expo-sqlite`)** — no WatermelonDB. Keep it simple. | ✅ |
| 10 | **WhatsApp Business API** — Phase 2. Phase 1 uses Android share intent only. | ✅ |

---

## 1. Problem Statement

Small retailers receive product images from their wholesalers via WhatsApp, email, or file shares — often as unorganized dumps of photos with little to no metadata. They then need to forward these products to **their own customers** in a way that looks professional and drives sales.

**Today, they struggle with:**

| Pain Point | Impact |
|---|---|
| **No easy catalog tool** — they forward raw images or create clunky PDFs manually | Unprofessional brand image, lost sales |
| **No organization** — hundreds of product images with no categories, tags, or search | Time wasted finding products, duplicates everywhere |
| **No customization** — generic templates don't match their brand or niche | Catalogs look identical to competitors |
| **No sharing workflow** — exporting and sharing is cumbersome | Delayed distribution, missed seasonal windows |

**Catalog Creator** solves this by giving small retailers a dead-simple mobile app to **import, organize, customize, and share** beautiful product catalogs — in minutes, not hours.

---

## 2. Target User

### Primary Persona: "Riya — The Small Retailer"

- Runs a clothing/accessories/grocery reselling business
- Receives 50–500 product images per week from 2–5 wholesalers
- Sells via WhatsApp, Instagram, and local walk-in customers
- **Not tech-savvy** — uses a smartphone as primary device
- Needs catalogs that look premium but take **< 5 minutes** to create
- Shares catalogs as **PDFs, image grids, or direct WhatsApp forwards**

### Secondary Persona: "Amit — The Wholesaler"

- Sends bulk images to 50+ retailers
- Wants to provide a branded catalog template that retailers can reuse
- Could onboard retailers onto the platform (Phase 2+)

---

## 3. Product Vision

> **One sentence:** Turn a messy folder of product images into a beautiful, searchable, shareable catalog — in under 5 minutes, entirely on your phone.

### Core Principles

1. **Speed over features** — Every flow must be completable in ≤ 3 taps
2. **Search-first architecture** — Every product, tag, category, and catalog must be instantly findable
3. **Customization without complexity** — Beautiful defaults, deep control for those who want it
4. **Fully local** — All data stored on-device. No internet required. No account required.
5. **Save & reuse everything** — Templates, tag presets, and workflows are saveable and reusable

---

## 4. Core Features (Phase 1 — MVP)

### 4.1 📥 Image Import

**Goal:** Get images into the system with zero friction.

| Capability | Details |
|---|---|
| **Bulk image pick** | Select multiple images from gallery or file manager. Support JPEG, PNG, WebP, HEIC. |
| **Share-to-app import** | Share images directly from WhatsApp/Gallery to Catalog Creator (Android share intent). |
| **Auto-metadata extraction** | Read EXIF data, file names. Suggest product names from file names. |
| **Duplicate detection** | Detect and flag duplicate/near-duplicate images on import (hash-based). |
| **Import grouping** | Auto-group imports by date. "Imports from Feb 28" as a default collection. |

**User Flow:**
```
Open App → Tap "+" → Select images → Images grouped by import date → Done
```

---

### 4.2 🗂️ Organization & Tagging

**Goal:** Make every product findable in < 2 seconds.

| Capability | Details |
|---|---|
| **Categories** | User-defined hierarchical categories (e.g., Clothing → Sarees → Silk Sarees). |
| **Tags** | Free-form tags per product (e.g., "red", "festive", "under-500", "new-arrival"). |
| **Tag presets** | Save reusable tag groups (e.g., "Festive Collection" = festive + new-arrival + premium). User creates their own tagging system. |
| **Bulk operations** | Select multiple → assign category, add tags, move, delete in one action. |
| **Favorites / Pinned** | Quick-access to frequently shared products. |
| **Archive** | Old/out-of-stock products hidden but not deleted. |

> [!IMPORTANT]  
> **Custom tagging workflow:** Users should be able to define and save their own tagging presets so they can consistently tag products the same way. E.g., "When I get images from Wholesaler X, I always tag them as: clothing, cotton, summer." This preset is saved and reusable in 1 tap.

---

### 4.3 🔍 Search & Filters (First-Class Feature)

**Goal:** No product or catalog should ever be "lost."

**Search targets:**
```
Global search bar → searches across:
  - Product name
  - Tags
  - Category name
  - Catalog name
  - Wholesaler/source name
  - Price range (if added)
  - Date added
```

**Capabilities:**

| Capability | Details |
|---|---|
| **Instant search** | Search-as-you-type, < 100ms response (SQLite FTS5). |
| **Cross-entity** | Single bar searches products, catalogs, tags, categories. |
| **Filters** | Category, tags, price range, date range, in-stock/archived. |
| **Sort** | Newest, oldest, price (low→high / high→low), name (A-Z). |
| **Saved filters** | Save frequent filter combos as quick-access buttons (e.g., "Red Sarees Under ₹500"). |
| **Search within catalog** | When editing a catalog, search/filter its products. |
| **Recent searches** | Show last 10 search queries for quick re-access. |

```
┌─────────────────────────────────────────────┐
│  🔍 Search products, catalogs, tags...       │
├─────────────────────────────────────────────┤
│                                             │
│  SAVED FILTERS:                             │
│  [Red Sarees] [Under ₹500] [New Arrivals]  │
│  [Wholesaler: Amit] [Festive]              │
│                                             │
│  RECENT SEARCHES:                           │
│  "silk saree"  "diwali collection"          │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 4.4 🎨 Catalog Builder

**Goal:** Create stunning catalogs with minimal effort and maximum customization.

#### Templates

| Aspect | Details |
|---|---|
| **Pre-built templates** | 5 curated templates: Minimal, Bold, Elegant, Festive, Modern. |
| **Template preview** | Live preview with user's own products before applying. |
| **Save as template** | Any customized catalog layout can be saved as a reusable template. |

#### Customization Layers

```
Level 1 — Quick (for everyone):
  ├── Pick a template
  ├── Choose brand colors (color picker or palette presets)
  ├── Add logo / store name
  ├── Select products to include
  └── Done → Share

Level 2 — Detailed (for power users):
  ├── Layout: Grid size (2x2, 3x3, 1x2), list view, lookbook style
  ├── Typography: Font family, size, weight for titles/prices/descriptions
  ├── Spacing & padding controls
  ├── Background: Solid color, gradient, pattern, or custom image
  ├── Product card style: Border, shadow, rounded corners, overlay text
  ├── Header/Footer: Custom text, contact info, social links
  └── Page numbering & watermark
```

> [!IMPORTANT]  
> **Save & reuse custom flows:** Users should be able to save their entire catalog setup (template + colors + fonts + layout + header/footer) as a "My Template" for 1-tap reuse next time. This is the core customization-without-complexity promise.

#### Product Card

Each product in a catalog displays:

- **Image** (auto-cropped/fitted to card)
- **Product name** (editable)
- **Price** (optional, with strikethrough for discounts)
- **Description** (optional, short)
- **Tags/badges** ("New", "Best Seller", "Limited Stock" — customizable)
- **Product code / SKU** (optional)

---

### 4.5 💰 Pricing & Product Details

**Goal:** Add just enough detail to sell — no ERP-level complexity.

| Field | Type | Required |
|---|---|---|
| Product Name | Text | Yes |
| Price (Selling) | Number | No |
| Price (MRP / Strikethrough) | Number | No |
| Description | Short text (140 chars) | No |
| SKU / Product Code | Text | No |
| Stock Status | In Stock / Limited / Out of Stock | No |
| MOQ (Min Order Qty) | Number | No |

- **Bulk price edit** — Select multiple, set or adjust prices
- **Price visibility toggle** — Show/hide prices per catalog (some retailers share catalogs without prices)

---

### 4.6 📤 Export & Share

**Goal:** Get catalogs to customers in the format they actually use.

| Format | Details |
|---|---|
| **PDF** | High-quality PDF. Option for web-optimized (smaller) or print-ready (larger). |
| **Image grid** | Single long image or multi-page images for WhatsApp / Instagram Stories. |
| **WhatsApp share** | One-tap share via Android share intent to WhatsApp contacts/groups. |
| **Save to gallery** | Export catalog pages as images to device gallery. |

---

## 5. Information Architecture

```
Home (Dashboard)
├── 📥 Imports
│   ├── Recent imports (grouped by date)
│   └── Import history
├── 📦 Products (All)
│   ├── By Category (tree view)
│   ├── By Tag (tag list)
│   ├── By Source / Import batch
│   └── Archived
├── 📖 Catalogs
│   ├── Active catalogs
│   ├── Drafts
│   └── Archived
├── 🎨 My Templates
│   ├── Saved catalog templates
│   └── Saved tag presets
└── ⚙️ Settings
    ├── Store profile (name, logo, contact)
    ├── Default catalog settings
    └── Export preferences
```

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | App launch < 2s. Search results < 100ms. Catalog generation < 5s for 50 products. |
| **Storage** | Fully local (device storage). Efficient image compression. Support up to 10,000 products. |
| **Image handling** | Lazy loading. Thumbnail generation on import. Original image preserved. |
| **Platform** | Android first (React Native). iOS next. |
| **Offline** | 100% offline — no internet required for any Phase 1 feature. |
| **No auth** | Single-user, no login. App opens directly to dashboard. |
| **Localization** | Hindi + English in Phase 1. Regional languages in Phase 2. |
| **Accessibility** | Minimum touch targets 44x44px. Good contrast ratios. |

---

## 7. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Mobile App** | React Native (Expo) | Cross-platform, JS ecosystem, fast iteration |
| **Local Database** | SQLite (via `expo-sqlite` or WatermelonDB) | Fast, offline, relational. FTS5 for search. |
| **Image Storage** | Device filesystem (`expo-file-system`) | Local-only. Thumbnails generated via image manipulation library. |
| **Search** | SQLite FTS5 | No external service needed. Fast full-text search locally. |
| **PDF Generation** | `react-native-pdf-lib` or HTML→PDF via WebView | Generate catalogs as PDF on-device. |
| **Image Processing** | `expo-image-manipulator` / `react-native-image-resizer` | Resize, crop, thumbnail generation. |
| **State Management** | Zustand or Jotai | Lightweight, simple, React-native friendly. |
| **UI Components** | React Native Paper / NativeBase + custom design system | Material Design base with custom theming. |

> [!NOTE]  
> No backend, no cloud, no auth in Phase 1. Everything runs on-device.

---

## 8. Monetization Model

> Deferred to Phase 2+. Phase 1 is a free, fully local app. Future model:

| Tier | Price | Includes |
|---|---|---|
| **Free** | ₹0 | Full local functionality, 5 templates |
| **Pro** | ₹299/mo | Cloud backup, analytics, AI auto-tagging, 15+ templates, no watermark on shared links |
| **Business** | ₹799/mo | Custom domain catalog links, team support, wholesaler portal, API |

---

## 9. Success Metrics (Phase 1)

| Metric | Target |
|---|---|
| **Activation** | 60% of installs create first catalog within 24 hours |
| **Catalog creation time** | Median < 5 minutes for a 20-product catalog |
| **Retention (D7)** | 40% weekly active users |
| **Catalogs shared** | Avg 3 catalogs shared per user per week |
| **Search usage** | 70% of sessions include a search action |
| **App store rating** | > 4.2 stars |

---

## 10. Phasing

### Phase 1 — MVP (Weeks 1–6) 🎯 *Current Focus*

- [ ] Image import (bulk pick from gallery, share-to-app, duplicate detection)
- [ ] Product management (name, price, category, tags, bulk edit)
- [ ] Custom tag presets (save & reuse tagging workflows)
- [ ] Global search & filters (SQLite FTS5)
- [ ] Saved filters (quick-access buttons)
- [ ] Catalog builder with 5 pre-built templates
- [ ] Level 1 + Level 2 customization
- [ ] Save-as-template (save any customized layout for reuse)
- [ ] PDF export (on-device generation)
- [ ] Image grid export (for WhatsApp/Instagram)
- [ ] WhatsApp share (Android share intent)
- [ ] Fully local storage (SQLite + device filesystem)
- [ ] No auth — direct app launch

### Phase 2 — Growth (Weeks 7–14)

- [ ] Cloud storage / backup (opt-in)
- [ ] Authentication & user accounts
- [ ] Analytics dashboard (catalog views, shares, top products)
- [ ] Smart suggestions (untagged products, missing prices, actionable items)
- [ ] AI auto-tagging (color, pattern, product type detection)
- [ ] Per-customer tracking (what was sent to whom, version history, sales tracking)
- [ ] Shareable web links (hosted catalogs)
- [ ] QR codes for catalog links
- [ ] More templates (15+, industry-specific)
- [ ] WhatsApp Business API integration
- [ ] Hindi + regional language UI
- [ ] iOS release

### Phase 3 — Scale (Weeks 15–22)

- [ ] Catalog link expiry (seasonal/limited offers)
- [ ] Community templates (marketplace)
- [ ] Wholesaler portal (send products directly to retailers)
- [ ] Team/multi-user support
- [ ] API for integrations
- [ ] Web app (desktop companion)

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Users find setup too complex | Medium | High | Zero-config first run. Import → Auto-catalog in 3 taps. |
| Device storage fills up fast | High | Medium | Aggressive thumbnail compression. "Storage used" indicator. Bulk archive/delete tools. |
| Low adoption in target segment | Medium | High | Partner with wholesalers to pre-load catalogs. WhatsApp-native sharing. |
| Template fatigue — users want more | Medium | Low | Save-as-template in Phase 1. Community marketplace in Phase 3. |
| React Native performance with large image grids | Medium | Medium | Virtualized lists. Lazy loading. Thumbnail-first rendering. |

---

## 12. Competitive Landscape

| Competitor | Strength | Weakness vs. Us |
|---|---|---|
| **Canva** | Powerful design tool | Not built for catalogs. No product management. No search. Overkill for retailers. |
| **WooCommerce / Shopify** | Full e-commerce | Too complex. Requires store setup. Not catalog-focused. |
| **CatalogMachine** | Catalog-specific | Dated UI. No WhatsApp integration. Not India-focused. |
| **QuickSell** | B2B catalog sharing | Limited customization. Locked ecosystem. Requires cloud. |
| **Manual (PDF/WhatsApp forwards)** | Zero cost | Unprofessional, unorganized, unsearchable. |

**Our edge:** Purpose-built for the **import → organize → beautify → share** workflow that small retailers actually use, with **search as a superpower**, **WhatsApp as a first-class channel**, and **zero internet dependency**.

---

## 13. Resolved Decisions Summary

| Decision | Choice |
|---|---|
| Runtime | **Expo** (managed workflow) |
| Database | **Raw SQLite** via `expo-sqlite` + FTS5 for search |
| WhatsApp | **Android share intent** in Phase 1; **WhatsApp Business API** in Phase 2 |

---

## 14. UX Prototype & Design References

> **UX Prototype:** A web-based click-through prototype was built to validate flows before React Native development.  
> **Location:** See `@prototypes/UX_PROTOTYPE.md` for detailed prototype specs, learnings, and conclusions.

### Key Prototype Learnings

The prototype phase taught us several critical lessons that shaped the final app:

1. **"Import" → "Add Products"** — Users don't understand "import." Simple "Add Products" flow (select → review → done) is much clearer.
2. **Products & Catalogs First** — These are the only two things users care about. Everything else supports these goals.
3. **Search-First Navigation** — With 500+ products, users search "red saree under 500" rather than browse.
4. **Tag Presets Save Time** — Common combinations ("Festive Drop" = festive + premium + limited) reduce 20 taps to 1.
5. **Templates Enable Reuse** — Save catalog designs for monthly reuse (New Arrivals, Festive Collection, etc.).

### Design System

> **Location:** See `DESIGN_SYSTEM.md` for complete UI specifications.

**Quick Reference:**
- **Colors:** Red 500 (#EF4444) primary, Gray 50-900 neutrals
- **Typography:** Inter/Roboto, 11px–28px scale
- **Spacing:** 4px base unit (4, 8, 12, 16, 20, 24, 32)
- **Components:** 52px primary buttons, 16px radius cards, 44px touch targets
- **Layout:** 3-column product grid, 390px mobile frame

---

*This document is a living artifact. Update as decisions are made and user research evolves.*
