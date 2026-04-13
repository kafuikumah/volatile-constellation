# Afri Health — African Health Systems Dashboard

> **Full Project Blueprint & Reproduction Prompt**
> Use this document as a self-contained specification to build the entire application from scratch.

---

## 1. Project Overview

**Afri Health** is an interactive, desktop-first analytics dashboard for tracking, comparing, and benchmarking health system performance across **54 African nations**. It is built on the **WHO 6 Building Blocks Framework** (Service Delivery, Health Workforce, Health Information, Health Financing, Medical Products & Technologies, Leadership & Governance).

The application is **purely front-end** — all data is static/hardcoded (no backend, no database, no API calls for data). The only external fetches are:

1. Country flag images from `https://flagcdn.com/w160/{code}.png` and `https://flagcdn.com/w20/{code}.png`
2. Africa GeoJSON map data from `https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json`

---

## 2. Tech Stack & Dependencies

### Framework & Runtime
- **Next.js 16.1.6** (App Router, React Server Components enabled)
- **React 19.2.3** / **React DOM 19.2.3**
- **TypeScript 5+**
- **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`)

### Styling
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **tw-animate-css** for animation utilities
- **shadcn/ui** (New York style, Slate base color, CSS variables, Lucide icons)
- **class-variance-authority** + **clsx** + **tailwind-merge** for class composition

### Charting
- **Apache ECharts v6** (`echarts` + `echarts-for-react`)
- All charts use SVG renderer, dynamically imported with `next/dynamic` (SSR disabled)

### UI Icons
- **Lucide React** (`lucide-react`)

### Fonts
- **Inter** via `next/font/google` (variable `--font-sans`)
- `@fontsource/inter` and `@fontsource/open-sans` are also installed as dependencies

### Animation
- **Framer Motion** (used in `MobileNotice` component for `AnimatePresence` / `motion.div`)

### Path Alias
- `@/*` maps to `./src/*`

---

## 3. Package.json

```json
{
  "name": "african-health-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@fontsource/inter": "^5.2.8",
    "@fontsource/open-sans": "^5.2.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "echarts": "^6.0.0",
    "echarts-for-react": "^3.0.6",
    "lucide-react": "^0.575.0",
    "next": "16.1.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "shadcn": "^3.8.5",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
```

---

## 4. Configuration Files

### `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
    ],
  },
};

export default nextConfig;
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

### `postcss.config.mjs`
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### `components.json` (shadcn/ui)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

---

## 5. Project Structure

```
src/
├── app/
│   ├── globals.css                   # Global styles, design tokens, Tailwind theme
│   ├── layout.tsx                    # Root layout (Inter font, AppShell wrapper)
│   ├── page.tsx                      # Home — Interactive Africa Map View
│   ├── about/page.tsx                # About page
│   ├── benchmarking/page.tsx         # Benchmarking & Analytics page
│   ├── comparison/page.tsx           # Comparison Matrix page
│   ├── country-profiles/
│   │   ├── page.tsx                  # Country Profiles listing (grid/list)
│   │   └── [id]/page.tsx             # Individual Country Profile detail
│   ├── methodology/page.tsx          # Methodology documentation
│   └── policies/page.tsx             # Policy Library page
├── components/
│   ├── charts/
│   │   ├── AfricaMap.tsx             # ECharts SVG map of Africa
│   │   ├── BarChart.tsx              # Reusable bar chart
│   │   ├── LineChart.tsx             # Reusable line chart
│   │   └── RadarChart.tsx            # Reusable radar chart
│   ├── country-profile/
│   │   ├── BuildingBlockCard.tsx     # Card for each WHO building block
│   │   ├── CountryProfileHeader.tsx  # Header with flag, stats, score
│   │   ├── FiscalAlert.tsx           # Warning when debt > health budget
│   │   ├── IndicatorProgressBar.tsx  # Progress bar for indicators
│   │   ├── PolicyAccordion.tsx       # Expandable policy list
│   │   └── ProfileModals.tsx         # Score Breakdown & Building Block modals
│   ├── layout/
│   │   ├── AppHeader.tsx             # Top navigation bar with tabs
│   │   ├── AppShell.tsx              # Root shell (provider + header + content)
│   │   ├── BottomBar.tsx             # Status bar showing selected country stats
│   │   ├── CountrySidebar.tsx        # Left sidebar with country search/list
│   │   ├── MobileNotice.tsx          # Mobile device blocking overlay
│   │   └── PageLayout.tsx            # Sidebar + main + optional BottomBar layout
│   ├── map/
│   │   ├── CountryInfoPanel.tsx      # Left floating panel on map click
│   │   ├── CountryTooltip.tsx        # Hover tooltip (stats card)
│   │   ├── MapLegend.tsx             # Color-coded map legend
│   │   ├── MiniCountryProfile.tsx    # Top-right floating mini profile card
│   │   └── WelcomePrompt.tsx         # Initial welcome overlay modal
│   └── shared/
│       ├── CountryFlag.tsx           # Flag image component (sm/md/lg)
│       ├── ImpactBadge.tsx           # Low/Medium/High colored text badge
│       └── ScoreBadge.tsx            # Circular score badge (green/orange/red)
├── data/
│   ├── countries.ts                  # 54 African countries with full data
│   ├── indicators.ts                 # WHO 6 Building Blocks definitions
│   └── policies.ts                   # ~30 health policies across countries
├── hooks/
│   ├── useComparison.ts              # Multi-country selection for comparison
│   ├── useCountryFilter.ts           # Search + region + income filters
│   ├── useCountryProfile.ts          # Single country profile data
│   └── useSelectedCountry.tsx        # Context provider for map selection
├── lib/
│   ├── constants.ts                  # Score thresholds, colors, regions, RECs
│   └── utils.ts                      # Utility functions (formatting, scoring)
└── types/
    ├── country.ts                    # Country & BuildingBlockData interfaces
    ├── indicator.ts                  # IndicatorDef & BuildingBlock interfaces
    └── policy.ts                     # Policy interface
```

---

## 6. Design System & Visual Language

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-app-accent` | `#F29D38` | Primary brand accent (orange/amber) |
| `--color-app-accent-light` | `#FFF7ED` | Light accent background |
| `--color-score-high` | `#22C55E` | Scores ≥ 70 (green) |
| `--color-score-mid` | `#F29D38` | Scores 50-69 (amber) |
| `--color-score-low` | `#EF4444` | Scores < 50 (red) |
| Background | `#F1F5F9` | App-wide background (slate-100) |
| Surface | `#FFFFFF` | Cards, panels |
| Text Primary | `#0F172A` | Headings, primary text (slate-900) |
| Text Secondary | `#64748B` | Body text (slate-500) |
| Text Muted | `#94A3B8` | Labels, captions (slate-400) |
| Border | `#E2E8F0` | Card borders (slate-200) |
| Map Background | `#F1F5F9` | Map canvas background |
| Map Border | `#CBD5E1` | Country borders on map |

### Building Block Colors
| Block | Color |
|-------|-------|
| Service Delivery | `#3B82F6` (blue-500) / `bg-blue-500` |
| Health Workforce | `#8B5CF6` (violet-500) / `bg-violet-500` |
| Health Information | `#06B6D4` (cyan-500) / `bg-cyan-500` |
| Health Financing | `#F59E0B` (amber-500) / `bg-emerald-500` (card) |
| Medical Products | `#10B981` (emerald-500) / `bg-amber-500` (card) |
| Leadership & Governance | `#EF4444` (red-500) / `bg-red-500` |

### Score Color Scale (5-tier for map legend)
| Range | Color | Label |
|-------|-------|-------|
| ≥ 70 | `#22C55E` | Strong |
| 60-69 | `#84CC16` | Good |
| 50-59 | `#F97316` | Moderate |
| 40-49 | `#EF4444` | Weak |
| < 40 | `#991B1B` | Critical |

### Typography
- **Font Family**: Inter (Google Fonts, variable `--font-sans`)
- **Font Weights**: 500 (medium/semibold), 600 (bold) — weights are intentionally reduced from defaults
- **Labels**: `text-[10px] font-semibold uppercase tracking-widest text-slate-400` — used extensively for section labels
- **Data Values**: `.font-mono-data` class (uses Inter, not an actual monospace font)
- **Headings**: `font-heading` (Inter)

### Layout Dimensions
| Element | Size |
|---------|------|
| App Header Height | `60px` (with `mx-4 mt-4 mb-2` margins) |
| Sidebar Width | `280px` |
| Bottom Bar Height | `60px` |
| Info Panel Width | `320px` |
| Border Radius | `10px` (cards, panels) / `rounded-xl` / `rounded-2xl` |

### Card Pattern
All cards follow this pattern:
```
bg-white rounded-[10px] shadow-sm border border-slate-200
```
Or:
```
bg-white rounded-xl shadow-sm border border-slate-100
```

---

## 7. Application Layout Architecture

The app uses a **fixed full-viewport layout** (no scrolling on the outer shell):

```
┌────────────────────────────────────────────────────┐
│  AppHeader (Logo Block + Navigation Tabs)          │  60px + margins
├──────────┬─────────────────────────────────────────┤
│          │                                         │
│ Sidebar  │  Main Content Area                      │
│ (280px)  │  (flex-1, varies per page)              │
│          │                                         │
│          ├─────────────────────────────────────────┤
│          │  BottomBar (map view only)               │  60px
└──────────┴─────────────────────────────────────────┘
```

### AppShell
Wraps the entire app with:
- `SelectedCountryProvider` (React Context)
- Full-height flex column (`h-screen flex flex-col overflow-hidden`)
- `AppHeader` at top
- `MobileNotice` overlay (shown below 1024px width)
- Children (page content) fills remaining space

### AppHeader
Two white rounded cards side-by-side:
1. **Logo Block** (280px): Gray circle + "Afri Health" text
2. **Navigation Block** (flex-1): Horizontal tabs with `border-b-[3px]` active indicator

Navigation tabs:
- Map View → `/`
- Comparison Matrix → `/comparison`
- Policies → `/policies`
- Benchmarking → `/benchmarking`
- Country Profiles → `/country-profiles`
- Methodology → `/methodology`
- About → `/about`

Active tab: `text-[#606060] border-[#606060]`
Inactive tab: `text-[#A2A2A2] border-transparent`

### PageLayout
Accepts optional `sidebar` and `isMapView` prop:
- Renders sidebar + main content in a flex row with `gap-4 px-4 pb-4`
- When `isMapView=true`, renders `BottomBar` below main content
- Main content has `rounded-[10px]` and overflow handling

### MobileNotice
Full-screen blocking overlay using Framer Motion (`AnimatePresence`):
- Shows when `window.innerWidth < 1024`
- White card with Monitor icon, title "Desktop Experience Recommended"
- Two info boxes about mobile limitations
- Branded footer text

---

## 8. Pages — Detailed Specification

### 8.1 Map View (Home) — `/`

**Purpose**: Interactive choropleth map of Africa as the primary entry point.

**Layout**: `PageLayout` with `CountrySidebar` and `isMapView={true}`

**Three Interaction States**:
1. **No selection**: WelcomePrompt overlay appears (dismissible, stored in `sessionStorage`)
2. **Hover**: MiniCountryProfile appears in top-right with stats
3. **Click**: CountryInfoPanel slides in from left with policies

**Components**:
- `AfricaMap`: Full-size ECharts SVG map
  - Fetches world GeoJSON, filters to African countries
  - All countries render as **white** (`#FFFFFF`) with slate borders
  - Selected country renders as **orange** (`#F29D38`)
  - Hover: light orange background (`#FFF7ED`) with orange border
  - Tooltip shows only country name
  - Supports zoom (1x-5x) and pan (`roam: true`)
  - Maps internal IDs (3-letter lowercase) to GeoJSON names
  - Special handling: Somalia + Somaliland share `som` ID

- `WelcomePrompt`: Centered modal overlay
  - Title: "Explore African Health Financing"
  - Two instruction items (Select on Map, Search Sidebar)
  - Orange "Get Started" button
  - Semi-transparent backdrop with blur
  - Auto-dismisses if a country is selected

- `MiniCountryProfile`: Floating card (top-right, 280px wide)
  - Shows on hover OR selection (hover takes priority)
  - Flag + Name + ScoreBadge header
  - 2x2 grid: Population, Health/GDP, Per Capita, Debt Service
  - Links to `/country-profiles/{id}` on click
  - Orange border on hover

- `CountryInfoPanel`: Floating panel (left side, 320px wide, full height)
  - Shows only when a country is clicked/selected
  - Sections: Country header with flag, Africa Health Index Ranking (large orange number), Health Policies list (up to 5)
  - Each policy shows FileText icon + title + impact badge
  - Footer: "View All {Country}'s Health Policies" button (black bg)
  - Slide-in animation from left

- `BottomBar`: Status strip at bottom
  - Shows selected country flag + name (orange underline)
  - Total Cases (orange)
  - 6 building block indicators with semantic labels:
    - Service: Low Risk / Moderate / High Risk
    - Workforce: Good / Medium / Critical
    - Info: 70-100% / 41-69% / 0-40%
    - Financing: Top/Middle/Lower Percentile
    - Medicines/Governance: Stable / At Risk / Critical
  - "All Indicators →" link at far right

### 8.2 Comparison Matrix — `/comparison`

**Purpose**: Side-by-side comparison of multiple countries with charts and auto-generated insights.

**Layout**: `PageLayout` with custom sidebar (280px)

**Sidebar**:
1. **Select Countries**: Custom dropdown with search, checkbox selection, selected country chips
2. **Select Indicator**: Dropdown with "All Building Blocks", "Overall Health Score", and individual building blocks
3. **Generate Comparison** button (amber/orange, full-width)

**Main Content**:
- Header with title + chart type toggle (Radar/Bar/Line — radar only for all blocks)
- Selected countries shown as orange pill bubbles (removable)
- Chart area (400px height):
  - Empty state: dashed border box with BarChart2 icon + "No Countries Generated" message
  - Charts use `defaultColors = ['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#06B6D4', '#EF4444']`
- **Detailed Breakdown Table**: Full comparison table with columns for Country, Overall, Pop (M), Exp/Capita, Health/GDP %, Debt Service %, and all 6 building blocks. Score cells are color-coded.
- **Auto-Generated Insights**: Bullet list with orange dots, programmatically generated based on score comparisons

### 8.3 Policies — `/policies`

**Purpose**: Browse, search, and analyze health policies across countries.

**Layout**: `PageLayout` with filter sidebar

**Sidebar Filters**: Country, Focus Areas (disabled), Building Block, Status

**Three Sub-Views** (tab bar):
1. **Policy List**: Search bar + scrollable cards (icon + title + status badge + description + country flag + year + impact)
2. **Coverage Analysis**: Table showing country, policy count, blocks covered (out of 6), coverage bar
3. **Timeline**: Vertical timeline grouped by year with calendar icons and connecting lines

### 8.4 Benchmarking — `/benchmarking`

**Purpose**: Benchmark a single country against peer groups.

**Layout**: `PageLayout` with config sidebar

**Sidebar**: Focus Country dropdown + Peer Group By (Region/Income Level/REC toggle buttons — orange when active)

**Main Content** (2x2 grid + regional bar chart):
1. **Scorecard**: Large flag, name, region, ScoreBadge, Africa Rank + Peer Rank
2. **Radar Chart**: Selected country vs Peer Average
3. **Peer Rankings Table**: Sorted list with position numbers, flags, scores — selected country highlighted in orange
4. **Gap Analysis**: Building block comparison bars showing delta from peer average (green = above, red = below)
5. **Regional Averages** (full width): Horizontal bar chart of all 5 African regions

### 8.5 Country Profiles Listing — `/country-profiles`

**Purpose**: Browse all 54 countries with filtering and view modes.

**Layout**: `PageLayout` with filter sidebar

**Sidebar**: Country dropdown, Region dropdown, Income Level dropdown (all with `Globe`/`Building2` icons)

**Main Content**:
- Header: Title + "Showing X countries" + Grid/List toggle
- Empty state: AlertCircle icon + reset filters button

**Grid View** (responsive 1-4 columns):
- Cards with: Flag + Name + Region/REC tag + ScoreBadge
- Per Capita + Health/GDP stats in 2-col grid
- Top 3 building blocks as mini progress bars
- Hover: shadow increase, slight upward shift, orange border

**List View**:
- Table-like rows: Country (flag + name), Region + REC, Income level badge, Key Metrics, Score + chevron
- Hover: orange-tinted background

Both link to `/country-profiles/{id}`

### 8.6 Country Profile Detail — `/country-profiles/[id]`

**Purpose**: Deep-dive into a single country's health system.

**Layout**: `PageLayout` with `CountrySidebar` (clicking a country in sidebar navigates to that profile)

**Sections**:
1. **Back Navigation**: "← Back to Map" link
2. **CountryProfileHeader**: Large flag, country name, region/REC badges, 4-stat strip (Population, Health Budget, Per Capita, Debt Service Ratio), clickable Overall Score circle
3. **FiscalAlert** (conditional): Amber warning when `debtServiceRatio > healthBudgetPercent`
4. **Building Blocks Grid** (3-column): 6 `BuildingBlockCard` components with icon, name, score badge, top-3 indicator progress bars. Each card is clickable.
5. **PolicyAccordion**: Expandable policy list with status badges, year, description, category, agency, impact badge, source link

**Modals**:
- **ScoreBreakdownModal**: Shows overall score in large circle + bar chart of all 6 block scores
- **BuildingBlockModal**: Detailed view with all indicators (progress bars + current/target values) + auto-generated regional analysis text

### 8.7 Methodology — `/methodology`

**Purpose**: Documentation of the assessment framework.

**Layout**: `PageLayout` with table-of-contents sidebar (intersection observer highlights active section)

**Sections**:
1. **WHO 6 Building Blocks Framework**: 2-column grid of 6 blocks with icons and descriptions
2. **Scoring Methodology**: 0-100 scale explanation with 3 color-coded tiers
3. **Data Sources**: WHO, World Bank, African Union, UNICEF, IHME
4. **Limitations & Caveats**: Bullet list

### 8.8 About — `/about`

**Purpose**: Mission, vision, and partnership information.

**Layout**: `PageLayout` with table-of-contents sidebar

**Sections**:
1. **Mission**: Orange gradient card with heart icon
2. **Vision & Goals**: 3-column cards (Globe, Target, Users icons)
3. **Key Partners**: 2-column grid (AU Commission, WHO Africa, Africa CDC, World Bank)
4. **Supporting Organizations**: Pill badges (UNICEF, GAVI, Global Fund, etc.)
5. **Contact**: Email + website links
6. **Footer**: "Afri Health Dashboard V0.0.01 — Built with ❤️ for African health systems"

---

## 9. Data Model

### Country Interface
```ts
interface BuildingBlockData {
  score: number;              // 0-100
  trend: 'up' | 'down' | 'stable';
  indicators: Record<string, number | string>;
}

interface Country {
  id: string;                  // 3-letter ISO code lowercase (e.g., 'nga')
  name: string;
  code: string;                // 2-letter ISO code lowercase for flags (e.g., 'ng')
  region: string;              // North/West/Central/East/Southern Africa
  rec: string;                 // ECOWAS/SADC/EAC/ECCAS/COMESA/IGAD/UMA
  incomeLevel: string;         // Low/Lower-middle/Upper-middle/High
  population: number;          // In millions (e.g., 224.0)
  healthBudgetPercent: number;
  healthGdpPercent: number;
  debtServiceRatio: number;
  healthExpPerCapita: number;  // In USD
  afriHealthRank: number;      // 1-54
  totalCases: number;
  buildingBlocks: {
    service: BuildingBlockData;
    workforce: BuildingBlockData;
    info: BuildingBlockData;
    financing: BuildingBlockData;
    medicines: BuildingBlockData;
    governance: BuildingBlockData;
  };
}
```

### Building Block / Indicator Definitions
```ts
interface IndicatorDef {
  key: string;
  label: string;
  unit: string;
  target: number;
}

interface BuildingBlock {
  id: string;        // 'service' | 'workforce' | 'info' | 'financing' | 'medicines' | 'governance'
  name: string;
  color: string;     // Hex color
  icon: string;      // Lucide icon name
  description: string;
  indicators: IndicatorDef[];
}
```

### Policy Interface
```ts
interface Policy {
  id: string;
  title: string;
  country: string;         // Country ID
  category: string;
  buildingBlocks: string[];
  yearEnacted: number;
  status: 'Active' | 'Draft' | 'Archived';
  impact: 'Low' | 'Medium' | 'High';
  agency: string;
  description: string;
  sourceUrl: string;
}
```

---

## 10. Country Data

The application contains data for **54 African countries**. Each country has:
- Metadata (name, code, region, REC, income level)
- Economic/health indicators (population, health budget %, health/GDP %, debt service ratio, per capita expenditure, rank, total cases)
- 6 building block scores (0-100) with trend and one key indicator each

Countries are created using a helper function:
```ts
function bb(score: number, trend: 'up' | 'down' | 'stable', extra: Record<string, number | string> = {}) {
    return { score, trend, indicators: extra };
}
```

The full list of 54 countries with their 3-letter IDs:
`dza` (Algeria), `ago` (Angola), `ben` (Benin), `bwa` (Botswana), `bfa` (Burkina Faso), `bdi` (Burundi), `cmr` (Cameroon), `cpv` (Cabo Verde), `caf` (Central African Republic), `tcd` (Chad), `com` (Comoros), `cod` (DR Congo), `cog` (Republic of Congo), `civ` (Côte d'Ivoire), `dji` (Djibouti), `egy` (Egypt), `gnq` (Equatorial Guinea), `eri` (Eritrea), `swz` (Eswatini), `eth` (Ethiopia), `gab` (Gabon), `gmb` (Gambia), `gha` (Ghana), `gin` (Guinea), `gnb` (Guinea-Bissau), `ken` (Kenya), `lso` (Lesotho), `lbr` (Liberia), `lby` (Libya), `mdg` (Madagascar), `mwi` (Malawi), `mli` (Mali), `mrt` (Mauritania), `mus` (Mauritius), `mar` (Morocco), `moz` (Mozambique), `nam` (Namibia), `ner` (Niger), `nga` (Nigeria), `rwa` (Rwanda), `stp` (São Tomé and Príncipe), `sen` (Senegal), `syc` (Seychelles), `sle` (Sierra Leone), `som` (Somalia), `zaf` (South Africa), `ssd` (South Sudan), `sdn` (Sudan), `tza` (Tanzania), `tgo` (Togo), `tun` (Tunisia), `uga` (Uganda), `zmb` (Zambia), `zwe` (Zimbabwe)

**Score Distribution**: Ranges from Seychelles (rank 1, scores ~84-90) down to Somalia (rank 54, scores ~14-22). Higher-income and smaller countries generally score higher. Scores are realistic approximations of WHO health system assessments.

Data helper functions exported:
- `getCountryById(id)` — find by ID
- `getCountriesByRegion(region)` — filter by region
- `getCountriesByRec(rec)` — filter by REC
- `searchCountries(query)` — text search on name
- `getAllCountriesAlphabetical()` — sorted copy

---

## 11. Policy Data

~30 policies covering major health legislation across key countries (Nigeria 4, South Africa 3, Kenya 3, Rwanda 2, Ghana 2, Egypt 2, Ethiopia 2, and 1 each for Morocco, Tunisia, Tanzania, Senegal, Botswana, Algeria, Uganda, Mauritius, Seychelles, Namibia, Zambia, Cameroon, Angola).

Each policy references which building block(s) it addresses and has status (all Active in current dataset), impact rating, and a responsible agency.

Helper functions: `getPoliciesByCountry`, `getPoliciesByBuildingBlock`, `getPoliciesByStatus`, `searchPolicies`

---

## 12. Custom Hooks

### `useSelectedCountry` (Context Provider)
- Provides global state for map interaction: `selectedId`, `hoveredId`, `country`, `hoveredCountry`
- Wraps the entire app via `SelectedCountryProvider` in `AppShell`
- `setSelectedId(null)` deselects

### `useCountryFilter`
- Local state for search query, region filter, income level filter
- Returns `filtered` array of countries matching all criteria
- Used by CountrySidebar and Country Profiles page

### `useComparison`
- Manages multi-select country IDs for comparison
- `toggleCountry`, `addCountry`, `removeCountry`
- Returns resolved `selectedCountries` array

### `useCountryProfile(id)`
- Returns `country`, `policies`, `overallScore`, `rank`, `hasFiscalAlert`, `openModal` state
- Used on the individual country profile page

---

## 13. Utility Functions (`src/lib/utils.ts`)

- `cn(...inputs)` — Tailwind class merge (clsx + tailwind-merge)
- `getScoreColor(score)` — Returns `text-green-500`, `text-orange-500`, or `text-red-500`
- `getScoreBg(score)` — Returns `bg-green/orange/red-500`
- `getScoreHex(score)` — Returns 5-tier hex colors for map
- `getImpactColor(impact)` — Low=red, Medium=orange, High=green text classes
- `formatNumber(n, decimals)` — Locale-formatted number
- `formatPercent(n)` — `{n.toFixed(1)}%`
- `formatCurrency(n)` — `$${n.toLocaleString()}`
- `formatRank(n)` — Ordinal suffix (1st, 2nd, 3rd, etc.)
- `formatPopulation(millions)` — `{n}M` or `{n*1000}K`
- `getFlagUrl(code)` — `https://flagcdn.com/w160/{code}.png`
- `calculateOverallScore(buildingBlocks)` — Average of all 6 block scores, rounded
- `average(arr)` — Simple arithmetic mean
- `groupBy(array, key)` — Groups array by key into Record
- `sortBy(array, key, order)` — Sorted copy
- `debounce(fn, wait)` — Debounce function
- `getScoreLabel(score)` — Strong/Good/Moderate/Weak/Critical

---

## 14. Constants (`src/lib/constants.ts`)

```ts
// Score thresholds
SCORE_HIGH_THRESHOLD = 70;
SCORE_MID_THRESHOLD = 50;

// Score colors (hex)
SCORE_COLORS = { high: '#22C55E', mid: '#F97316', low: '#EF4444' };

// Impact colors (Tailwind classes)
IMPACT_COLORS = { High: 'text-green-500', Medium: 'text-orange-500', Low: 'text-red-500' };

// Building block colors (hex)
BUILDING_BLOCK_COLORS = {
  service: '#3B82F6', workforce: '#8B5CF6', info: '#06B6D4',
  financing: '#F59E0B', medicines: '#10B981', governance: '#EF4444'
};

// Regions
REGIONS = ['North Africa', 'West Africa', 'Central Africa', 'East Africa', 'Southern Africa'];

// RECs
RECS = ['ECOWAS', 'SADC', 'EAC', 'ECCAS', 'COMESA', 'IGAD', 'UMA'];

// Income levels
INCOME_LEVELS = ['Low', 'Lower-middle', 'Upper-middle', 'High'];

// Map legend (5-tier)
MAP_LEGEND_ITEMS = [
  { color: '#22C55E', label: 'Strong (≥70)' },
  { color: '#84CC16', label: 'Good (60–69)' },
  { color: '#F97316', label: 'Moderate (50–59)' },
  { color: '#EF4444', label: 'Weak (40–49)' },
  { color: '#991B1B', label: 'Critical (<40)' },
];

// Bottom bar indicators
BOTTOM_BAR_INDICATORS = [
  { key: 'service', label: 'SERVICE DELIVERY' },
  { key: 'workforce', label: 'WORKFORCE' },
  { key: 'info', label: 'HEALTH INFO' },
  { key: 'financing', label: 'FINANCING' },
  { key: 'medicines', label: 'MEDICINES' },
  { key: 'governance', label: 'GOVERNANCE' },
];
```

---

## 15. Global CSS & Design Tokens

The `globals.css` file imports Tailwind CSS v4, tw-animate-css, and shadcn's Tailwind CSS. Key custom tokens:

```css
@theme inline {
  --font-sans: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;
  --font-weight-medium: 500;
  --font-weight-semibold: 500;  /* Note: reduced from typical 600 */
  --font-weight-bold: 600;       /* Note: reduced from typical 700 */
}
```

Root CSS variables define the complete shadcn/ui theme using OKLCH color space. Key app-specific tokens are in `:root`:
```css
--color-app-accent: #F29D38;
--color-app-accent-light: #FFF7ED;
--color-score-high: #22C55E;
--color-score-mid: #F29D38;
--color-score-low: #EF4444;
--sidebar-width: 280px;
--top-nav-height: 56px;
--app-header-height: 64px;
--bottom-bar-height: 52px;
--info-panel-width: 320px;
```

Custom utility class:
```css
.font-mono-data {
  font-family: var(--font-sans);
}
```

---

## 16. Map Component — Technical Details

The `AfricaMap` component:

1. **GeoJSON**: Fetches world GeoJSON from GitHub, filters to 54 African country names
2. **Name Mapping**: Maintains a `countryNameMap` from internal 3-letter IDs to GeoJSON-format names (e.g., `swz` → `'Swaziland'`, `cod` → `'Democratic Republic of the Congo'`, `civ` → `'Ivory Coast'`, `cog` → `'Republic of the Congo'`)
3. **Rendering**: All countries are white fill, slate borders. Selected country is orange (`#F29D38`)
4. **Interaction**: Click toggles selection (click same country deselects). Hover tracks `hoveredId`
5. **Display**: Labels off by default, shown on emphasis. Tooltip shows only bold country name
6. **Special**: Somaliland is handled by duplicating Somalia's data entry for the Somaliland GeoJSON feature

---

## 17. Chart Components — Technical Details

All 3 chart components use the same pattern:
- Dynamic import of `echarts-for-react` with `ssr: false`
- Loading skeleton: `animate-pulse bg-slate-100 rounded-lg`
- SVG renderer
- `notMerge={true}` for clean re-renders

**BarChart**: Supports horizontal mode, auto-rotating labels for >8 categories, grouped/multi-series bars with rounded top corners.

**LineChart**: Smooth curves with subtle area fill (opacity 0.05).

**RadarChart**: Polygon shape, 5 split rings, word-wrap for long axis names, centered at 50%/45% with 65% radius.

Default chart color palette: `['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#06B6D4', '#EF4444']`

---

## 18. CountrySidebar — Technical Details

The `CountrySidebar` component:
- Fixed 280px width, white card with rounded corners
- Search input with Search + ChevronDown icons
- Scrollable country list with flag thumbnails (20px from flagcdn)
- Selected country: `bg-[#F29D38]/10 text-[#F29D38]`
- Footer: "Afri Health V0.0.01" version text
- Supports both context-connected mode (for map) and prop-controlled mode (for country profile detail via `selectedCountry` and `onCountrySelect` props)

---

## 19. Shared Components

### `CountryFlag`
- Uses `<img>` tag (not Next.js `<Image>`) with `eslint-disable-next-line @next/next/no-img-element`
- Three sizes: sm (20x15), md (32x24), lg (48x32)
- Source: `https://flagcdn.com/w160/{code.toLowerCase()}.png`

### `ScoreBadge`
- Circular badge with score number
- Background: green (≥70), orange (50-69), red (<50)
- Three sizes: sm (32px), md (40px), lg (56px)

### `ImpactBadge`
- Simple text span with color: green (High), orange (Medium), red (Low)

---

## 20. Key Interaction Patterns

1. **Map Country Selection**: Click map → sets `selectedId` in context → CountryInfoPanel slides in from left, BottomBar populates, MiniCountryProfile updates. Click same country deselects.

2. **Comparison Flow**: Select countries in sidebar checkbox dropdown → choose indicator → click "Generate Comparison" → charts and table populate. Applied state is separate from selection state (must click generate).

3. **Country Profile Navigation**: Click country flag/name on any page → navigates to `/country-profiles/{id}`. Click building block card → opens BuildingBlockModal. Click overall score → opens ScoreBreakdownModal.

4. **Welcome Flow**: First visit shows WelcomePrompt. Dismissing or selecting a country stores flag in `sessionStorage('hasSeenWelcomePrompt')`.

5. **Methodology/About Scrollspy**: `IntersectionObserver` with `rootMargin: '-10% 0px -80% 0px'` tracks visible sections and highlights corresponding sidebar links.

---

## 21. Additional Notes

- The application is **desktop-only by design**. Below 1024px, a full-screen blocking overlay (`MobileNotice`) instructs the user to switch to a desktop.
- All `<img>` elements for flags use native HTML img tags (not Next.js Image) due to the large number of flag images.
- The `body` element has `suppressHydrationWarning` to handle potential hydration mismatches.
- The application uses `font-sans antialiased text-slate-800 bg-[#F1F5F9]` as base body styles.
- Building block scores in the raw data range from roughly 14 to 90 on a 0-100 scale.
- The `calculateOverallScore` function averages all 6 building block scores (simple arithmetic mean, rounded).
- No dark mode is implemented; the app is light-mode only.
- No authentication, user accounts, or persistence beyond `sessionStorage` for the welcome prompt.
- ESLint uses Next.js core-web-vitals and TypeScript configs.

---

*This document is a complete specification of the Afri Health Dashboard as of version 0.0.01. Every file, component, color, spacing value, interaction pattern, and data structure has been documented to enable full reproduction.*
