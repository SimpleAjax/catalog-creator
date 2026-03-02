# Catalog Creator — UI/UX Design System

> **Version:** 1.0  
> **Date:** 2026-03-02  
> **Platform:** React Native (iOS & Android)  
> **Design Philosophy:** Clean, friendly, retail-focused

---

## 1. Design Principles

### 1.1 Core Philosophy

1. **Clarity Over Cleverness** — Every element should be immediately understood. No hidden gestures.
2. **Speed is a Feature** — Reduce taps. One-tap actions for common tasks.
3. **Visual First** — Products are the heroes. UI gets out of the way.
4. **Thumb-Optimized** — All primary actions within thumb reach (bottom half of screen).
5. **Friendly, Not Corporate** — Warm colors, rounded corners, approachable language.

### 1.2 User Context

- Used on smartphones (primarily Android, 5.5" - 6.7" screens)
- Often used while receiving products from wholesalers
- May have limited technical literacy
- Need to work fast (customers waiting)
- Indoor and outdoor lighting conditions

---

## 2. Color System

### 2.1 Primary Colors

```
Primary (Brand Red)
├── 50:  #FEF2F2   (Backgrounds, light fills)
├── 100: #FEE2E2   (Hover states, light accents)
├── 200: #FECACA   (Borders, subtle highlights)
├── 300: #FCA5A5   (Disabled states)
├── 400: #F87171   (Notifications, alerts)
├── 500: #EF4444   ← PRIMARY ACTION COLOR
├── 600: #DC2626   (Active states, pressed)
├── 700: #B91C1C   (Text on light backgrounds)
├── 800: #991B1B   (Emphasis text)
└── 900: #7F1D1D   (Headings, strong emphasis)
```

**Usage:**
- Primary buttons
- Active navigation items
- Selected states
- Price tags
- Success badges (in Indian context, red = auspicious)

### 2.2 Secondary Colors

```
Blue (Information & Trust)
├── 50:  #EFF6FF
├── 100: #DBEAFE
├── 500: #3B82F6   ← INFO ACTIONS
└── 600: #2563EB

Green (Success & WhatsApp)
├── 50:  #F0FDF4
├── 100: #DCFCE7
├── 500: #22C55E   ← SUCCESS STATES
└── 600: #16A34A   ← WHATSAPP SHARE

Amber (Warnings & Festive)
├── 50:  #FFFBEB
├── 100: #FEF3C7
├── 500: #F59E0B   ← WARNINGS, FESTIVE TAGS
└── 600: #D97706

Purple (Elegant/Premium)
├── 50:  #FAF5FF
├── 100: #F3E8FF
├── 500: #A855F7   ← PREMIUM TEMPLATES
└── 600: #9333EA
```

### 2.3 Neutral Colors

```
Gray (UI Foundation)
├── 50:  #F9FAFB   (Page backgrounds)
├── 100: #F3F4F6   (Card backgrounds, inputs)
├── 200: #E5E7EB   (Borders, dividers)
├── 300: #D1D5DB   (Disabled borders)
├── 400: #9CA3AF   (Placeholder text)
├── 500: #6B7280   (Secondary text)
├── 600: #4B5563   (Body text)
├── 700: #374151   (Strong text)
├── 800: #1F2937   (Headings)
└── 900: #111827   (Primary text)

True White: #FFFFFF
True Black: #000000
```

### 2.4 Semantic Color Usage

| Use Case | Color | Hex |
|----------|-------|-----|
| Primary Action | Red 500 | #EF4444 |
| Primary Action Pressed | Red 600 | #DC2626 |
| Secondary Action | Gray 100 | #F3F4F6 |
| Success | Green 500 | #22C55E |
| Error | Red 500 | #EF4444 |
| Warning | Amber 500 | #F59E0B |
| Info | Blue 500 | #3B82F6 |
| WhatsApp Share | Green 600 | #16A34A |
| Background | Gray 50 | #F9FAFB |
| Card Background | White | #FFFFFF |
| Text Primary | Gray 900 | #111827 |
| Text Secondary | Gray 500 | #6B7280 |
| Text Tertiary | Gray 400 | #9CA3AF |
| Border | Gray 200 | #E5E7EB |
| Divider | Gray 100 | #F3F4F6 |

### 2.5 Template Color Presets

Each catalog template has a primary/secondary pair:

| Template | Primary | Secondary |
|----------|---------|-----------|
| Minimal | #374151 | #F3F4F6 |
| Bold | #DC2626 | #FEE2E2 |
| Elegant | #7C3AED | #EDE9FE |
| Festive | #D97706 | #FEF3C7 |
| Modern | #0891B2 | #CFFAFE |

---

## 3. Typography System

### 3.1 Font Family

**Primary:** `Inter` (or system font on Android: `Roboto`)

```javascript
// React Native StyleSheet
fontFamily: Platform.select({
  ios: 'Inter',
  android: 'Roboto',
}),
```

**Fallback Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### 3.2 Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| H1 | 28px | Bold (700) | 36px | -0.5px | Screen titles |
| H2 | 22px | Bold (700) | 30px | -0.3px | Section headers |
| H3 | 18px | Semibold (600) | 26px | -0.2px | Card titles |
| H4 | 16px | Semibold (600) | 24px | 0 | Subsection titles |
| Body | 16px | Regular (400) | 24px | 0 | Body text |
| Body Small | 14px | Regular (400) | 22px | 0 | Descriptions |
| Caption | 12px | Medium (500) | 18px | 0.2px | Labels, badges |
| Overline | 11px | Semibold (600) | 16px | 0.5px | Tags, categories |
| Button | 16px | Semibold (600) | 24px | 0.3px | Button text |
| Button Small | 14px | Medium (500) | 20px | 0.2px | Small buttons |

### 3.3 Typography Patterns

**Screen Title:**
```
Size: 20px
Weight: 700 (Bold)
Color: Gray 900
Padding: 16px horizontal
```

**Section Header:**
```
Size: 18px
Weight: 700 (Bold)
Color: Gray 900
Margin Bottom: 12px
```

**Card Title:**
```
Size: 16px
Weight: 600 (Semibold)
Color: Gray 900
Max Lines: 1 (truncate with ellipsis)
```

**Price Display:**
```
Size: 14px
Weight: 700 (Bold)
Color: Gray 900
Currency: "₹" prefix, no space
Format: ₹499 (no decimals)
```

**Body Text:**
```
Size: 16px
Weight: 400
Color: Gray 600
Line Height: 1.5 (24px)
```

**Caption/Helper:**
```
Size: 13px
Weight: 400
Color: Gray 500
```

---

## 4. Spacing System

### 4.1 Base Unit

**Base Unit:** 4px

All spacing values are multiples of 4:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, icon gaps |
| `space-2` | 8px | Small gaps, compact layouts |
| `space-3` | 12px | Default element spacing |
| `space-4` | 16px | Card padding, section gaps |
| `space-5` | 20px | Large gaps, relaxed layouts |
| `space-6` | 24px | Screen padding, major sections |
| `space-8` | 32px | Section breaks |
| `space-10` | 40px | Large section margins |
| `space-12` | 48px | Major dividers |

### 4.2 Layout Spacing

**Screen Padding:**
- Horizontal: 16px (`space-4`)
- Top (below status bar): 16px
- Bottom (above nav): 80px (clears bottom nav)

**Card Padding:**
- Default: 16px
- Compact: 12px
- Loose: 20px

**Grid Gap:**
- Product grid: 8px
- Card list: 12px
- Button group: 12px

**Section Spacing:**
- Between sections: 24px
- Within section: 16px
- Between related items: 12px

### 4.3 Touch Targets

**Minimum Touch Target:** 44×44px

**Button Heights:**
- Large (Primary): 56px
- Default: 48px
- Small: 40px
- Icon only: 44px

**Input Heights:**
- Default: 52px
- Compact: 44px
- Text area: min 100px

---

## 5. Components

### 5.1 Buttons

#### Primary Button

```
Height: 52px
Padding: 0 24px
Background: Red 500 (#EF4444)
Text: White, 16px, Semibold
Border Radius: 12px
Shadow: 0 2px 8px rgba(239, 68, 68, 0.25)

States:
- Pressed: Red 600 (#DC2626), scale 0.98
- Disabled: Gray 300, no shadow
- Loading: Spinner + "Please wait..."
```

#### Secondary Button

```
Height: 48px
Padding: 0 20px
Background: Gray 100 (#F3F4F6)
Text: Gray 900, 16px, Semibold
Border Radius: 12px

States:
- Pressed: Gray 200
- Disabled: Gray 50, text Gray 400
```

#### Ghost Button

```
Height: 44px
Padding: 0 16px
Background: Transparent
Text: Red 500, 16px, Medium
Border Radius: 8px

States:
- Pressed: Red 50 background
```

#### Icon Button

```
Size: 44×44px
Background: Gray 100
Icon: 24px, Gray 700
Border Radius: 12px (or full circle)

States:
- Pressed: Gray 200, scale 0.95
```

#### Floating Action Button (FAB)

```
Size: 56×56px
Background: Red 500
Icon: 24px, White
Border Radius: 16px (or full circle)
Shadow: 0 4px 12px rgba(239, 68, 68, 0.3)
Position: Bottom right, 24px from edges
```

### 5.2 Cards

#### Standard Card

```
Background: White
Padding: 16px
Border Radius: 16px
Shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
Border: 1px solid Gray 100 (optional)
```

#### Product Card (Grid)

```
Aspect Ratio: 1:1 (square)
Border Radius: 12px
Overflow: Hidden
Background: Gray 200 (placeholder)

Overlay (bottom):
- Background: Linear gradient (transparent to black 60%)
- Padding: 8px
- Price text: White, 14px, Bold
```

#### Catalog Card

```
Thumbnail: 80×80px, Border radius 12px
Background: Template primary color
Title: 16px, Semibold, Gray 900
Meta: 13px, Regular, Gray 500
```

#### Selection Card

```
Same as Standard Card
Selected State:
- Border: 2px solid Red 500
- Checkmark: Top-right, 24px circle, Red 500 bg
```

### 5.3 Inputs

#### Text Input

```
Height: 52px
Padding: 0 16px
Background: Gray 100
Border: 1px solid transparent
Border Radius: 12px
Text: 16px, Gray 900
Placeholder: Gray 400

States:
- Focused: White bg, 2px Red 500 border
- Filled: Gray 50 bg
- Error: Red 200 bg, Red 500 border
- Disabled: Gray 100, Gray 400 text
```

#### Search Input

```
Same as Text Input
Left Icon: Search (20px, Gray 400)
Right Icon: Clear (when text entered)
Padding Left: 48px (for icon)
```

#### Text Area

```
Min Height: 100px
Padding: 16px
Background: Gray 100
Border Radius: 12px
Text: 16px, line-height 1.5
```

### 5.4 Chips & Tags

#### Filter Chip (Active)

```
Height: 36px
Padding: 0 16px
Background: Red 100
Text: Red 700, 14px, Medium
Border Radius: 18px (pill shape)
```

#### Filter Chip (Inactive)

```
Height: 36px
Padding: 0 16px
Background: Gray 100
Text: Gray 600, 14px, Medium
Border Radius: 18px
```

#### Tag Chip

```
Height: 28px
Padding: 0 12px
Background: Gray 100
Text: Gray 700, 12px, Medium
Border Radius: 8px
Close Icon: 14px, right padding 8px
```

### 5.5 Lists

#### List Item

```
Height: 72px (min)
Padding: 16px horizontal
Background: White
Border Bottom: 1px solid Gray 100

Left: Icon or Thumbnail (40px)
Center: Title + Subtitle
Right: Action or Chevron
```

#### Product List Item

```
Thumbnail: 64×64px, Border radius 8px
Title: 16px, Semibold
Price: 14px, Bold
Tags: Row of Tag Chips
```

### 5.6 Navigation

#### Bottom Navigation

```
Height: 64px + safe area
Background: White
Border Top: 1px solid Gray 200
Padding: 8px horizontal

Item:
- Icon: 24px
- Label: 12px, Medium
- Active: Red 500
- Inactive: Gray 400

Items (4):
1. Home (🏠)
2. Products (📦)
3. Catalogs (📖)
4. Templates (🎨)
```

#### Top Navigation Bar

```
Height: 56px
Padding: 0 16px
Background: White
Border Bottom: 1px solid Gray 100

Left: Back button (44px) or Menu
Center: Title (20px, Bold)
Right: Action icons (max 2)
```

### 5.7 Selection Controls

#### Checkbox

```
Size: 24×24px
Border Radius: 6px
Unchecked: 2px Gray 300 border
Checked: Red 500 bg, White checkmark

States:
- Pressed: Scale 0.9
```

#### Radio Button

```
Size: 24×24px
Border Radius: 12px (circle)
Unchecked: 2px Gray 300 border
Checked: Red 500 border (6px), Red 500 dot (10px)
```

#### Toggle/Switch

```
Width: 52px
Height: 32px
Border Radius: 16px
Off: Gray 300 bg
On: Red 500 bg
Thumb: 28px circle, White
Thumb Offset: 2px from edge
```

### 5.8 Feedback

#### Toast/Snackbar

```
Min Height: 48px
Padding: 12px 24px
Background: Gray 900 (dark)
Text: White, 14px
Border Radius: 8px
Position: Bottom, 80px from bottom (above nav)
Duration: 3 seconds
Animation: Slide up + fade
```

#### Badge

```
Min Width: 20px
Height: 20px
Padding: 0 6px
Background: Red 500
Text: White, 11px, Bold
Border Radius: 10px
Position: Top-right of parent, -4px offset
```

---

## 6. Layout Patterns

### 6.1 Screen Structure

```
┌─────────────────────────────┐ ← Status Bar (safe area)
│                             │
│  [Back]  Title      [Action]│ ← Top Nav (56px)
│                             │
├─────────────────────────────┤
│                             │
│                             │
│       CONTENT AREA          │ ← Scrollable
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  [🏠] [📦] [📖] [🎨]       │ ← Bottom Nav (64px + safe area)
└─────────────────────────────┘
```

### 6.2 Grid System

**Product Grid:**
- Columns: 3
- Gap: 8px
- Padding: 16px horizontal
- Cell: Square aspect ratio

**Catalog Preview Grid:**
- Columns: 2
- Gap: 12px
- Padding: 16px

**Action Buttons:**
- 2-column: Equal width, 12px gap
- Stacked: Full width, 8px gap

### 6.3 Scroll Behavior

- **Default:** Vertical scroll, momentum enabled
- **Horizontal Lists:** Snap to nearest item, show peek of next item
- **Pull to Refresh:** Standard iOS/Android pattern
- **Infinite Scroll:** Load more when 2 items from bottom

---

## 7. Iconography

### 7.1 Icon System

**Library:** `lucide-react-native` (or `react-native-vector-icons/MaterialCommunityIcons`)

**Size Scale:**
- Small: 16px (inline, compact)
- Default: 24px (buttons, nav)
- Large: 32px (empty states, features)
- XL: 48px (hero icons)

**Color Usage:**
- Default: Gray 600
- Active/Primary: Red 500
- Disabled: Gray 400
- Inverse (on dark): White

### 7.2 Standard Icons

| Use Case | Icon Name | Size |
|----------|-----------|------|
| Home | `Home` | 24px |
| Products | `Package` | 24px |
| Catalogs | `BookOpen` | 24px |
| Templates | `Palette` | 24px |
| Search | `Search` | 24px |
| Add | `Plus` | 24px |
| Back | `ArrowLeft` | 24px |
| Close | `X` | 24px |
| Edit | `Edit2` | 20px |
| Delete | `Trash2` | 20px |
| Share | `Share2` | 24px |
| More | `MoreVertical` | 24px |
| Check | `Check` | 20px |
| Filter | `SlidersHorizontal` | 20px |
| Camera | `Camera` | 24px |
| Gallery | `Image` | 24px |
| Price Tag | `Tag` | 20px |
| Category | `Folder` | 20px |
| WhatsApp | Custom / `MessageCircle` | 24px |
| PDF | `FileText` | 24px |
| Download | `Download` | 24px |
| Star/Favorite | `Heart` | 24px |
| Settings | `Settings` | 24px |

---

## 8. Motion & Animation

### 8.1 Animation Principles

1. **Purposeful** — Every animation guides attention or provides feedback
2. **Fast** — Most animations < 300ms. The app feels snappy.
3. **Subtle** — Enhance, don't distract. No bouncing, spinning, or flashing.
4. **Consistent** — Same pattern for same action across the app.

### 8.2 Standard Durations

| Type | Duration | Easing |
|------|----------|--------|
| Micro (button press) | 100ms | ease-out |
| Standard (transitions) | 200ms | ease-in-out |
| Emphasis (modals) | 300ms | spring |
| Page transitions | 250ms | ease-in-out |

### 8.3 Animation Patterns

#### Button Press
```
Scale: 1.0 → 0.96
Duration: 100ms
Easing: ease-out
Background: Darken 10%
```

#### Page Transition
```
Slide: Right to left (push)
Fade: Opacity 0 → 1
Duration: 250ms
Gesture: Swipe right to go back
```

#### Modal/Sheet
```
Backdrop: Fade in (opacity 0 → 0.5)
Sheet: Slide up from bottom
Duration: 300ms
Spring: Slight bounce on arrival
```

#### List Item Appear
```
Fade: Opacity 0 → 1
Slide: 20px up
Duration: 200ms
Stagger: 50ms between items
```

#### Loading/Skeleton
```
Shimmer: Left to right gradient
Duration: 1.5s
Loop: Infinite
```

#### Selection Toggle
```
Scale: 1.0 → 1.1 → 1.0
Checkmark: Draw in (stroke animation)
Duration: 200ms
```

### 8.4 Empty States

**Animation:**
- Icon: Gentle pulse (scale 1.0 → 1.05, 2s loop)
- Text: Fade in (delay 200ms after icon)
- Button: Fade in (delay 400ms)

---

## 9. Accessibility

### 9.1 Touch Targets

- **Minimum:** 44×44px (Apple HIG & Android guidelines)
- **Preferred:** 48×48px for primary actions
- **Spacing:** 8px minimum between touch targets

### 9.2 Color Contrast

- **Normal text (14px+):** 4.5:1 minimum
- **Large text (18px+ bold):** 3:1 minimum
- **UI components:** 3:1 minimum

All color combinations in this system meet WCAG AA standards.

### 9.3 Screen Reader Support

**Labels:**
- Every interactive element has `accessibilityLabel`
- Icons have descriptive labels (not "button", but "Create new catalog")

**States:**
- Selected items: "Selected, Red saree, ₹499"
- Toggle buttons: "Notifications, on" / "Notifications, off"

**Navigation:**
- Screen titles announced on navigation
- Focus management for modals

### 9.4 Text Scaling

- Support system font size up to 200%
- Use relative units (no fixed heights that clip text)
- Test with largest accessibility font size

### 9.5 Visual Indicators

- Focus rings on all interactive elements
- Selected states use both color AND icon/checkmark
- Error states use color, icon, AND text description

---

## 10. Platform Adaptations

### 10.1 iOS Specific

- Status bar: Respect safe area insets
- Navigation: Use iOS-style back swipe gesture
- Typography: Use San Francisco (system font)
- Buttons: Slightly more rounded (14px vs 12px)

### 10.2 Android Specific

- Status bar: Translucent or match app background
- Navigation: Respect system back button
- Typography: Use Roboto (system font)
- Ripple effect: Add ripple to all touchable elements
- Elevation: Use elevation instead of shadows where appropriate

### 10.3 Common (Both Platforms)

- Bottom navigation: Persistent (not tab-based)
- Gestures: Swipe right to go back (both platforms)
- Modals: Bottom sheets preferred over center alerts

---

## 11. Responsive Considerations

### 11.1 Screen Sizes

**Primary Target:** 360-414px width (phones)
**Secondary:** 600px+ (tablets - future consideration)

### 11.2 Layout Adaptations

**Small screens (< 360px):**
- Reduce grid columns: 3 → 2
- Smaller padding: 16px → 12px
- Compact text where needed

**Large screens (> 414px):**
- Maintain 3-column grid (larger cells)
- Center content with max-width
- More breathing room

---

## 12. Asset Guidelines

### 12.1 Image Handling

**Product Images:**
- Format: JPEG (compressed) or WebP
- Grid thumbnail: 300×300px minimum
- Detail view: 800×800px minimum
- Aspect ratio: 1:1 (square crop)

**Catalog Preview:**
- Generate on-device (HTML → Canvas → Image)
- Resolution: 1080×1920px (vertical share)
- Format: PNG for text clarity

### 12.2 Icons

- Format: SVG (web) / Vector drawable (Android) / PDF (iOS)
- Size: Designed at 24×24px, scales to all sizes
- Color: Single color, tintable

---

## 13. File Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   └── index.ts
│   ├── Card/
│   ├── Input/
│   ├── Chip/
│   └── ...
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── index.ts
├── utils/
│   └── styling.ts
└── App.tsx
```

---

## 14. Quick Reference

### 14.1 Color Cheat Sheet

```typescript
const colors = {
  primary: '#EF4444',
  primaryDark: '#DC2626',
  secondary: '#F3F4F6',
  success: '#22C55E',
  whatsapp: '#16A34A',
  warning: '#F59E0B',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};
```

### 14.2 Spacing Cheat Sheet

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
```

### 14.3 Border Radius Cheat Sheet

```typescript
const radius = {
  sm: 8,    // Tags, chips
  md: 12,   // Buttons, inputs
  lg: 16,   // Cards
  xl: 20,   // Modals
  full: 9999, // Pills, circles
};
```

---

*This design system is a living document. Update as the product evolves.*
