# Dynamic Content Strategy POC

Interactive demo for the Dynamic Content Strategy vision. Built to articulate the end-to-end content enrichment pipeline to leadership and engineering teams.

## Live Demo

- [Strategy Overview](https://necmettintamgueney.github.io/dynamic-content-poc/index.html)
- [Interactive Pipeline Wizard](https://necmettintamgueney.github.io/dynamic-content-poc/demo.html)

## How to Run Locally

Both pages are standalone HTML files with no dependencies, no build step, and no server required.

**Open directly in your browser:**

```
open index.html    # Strategy overview
open demo.html     # Interactive pipeline wizard
```

Or double-click either file in Finder. Works in Chrome, Safari, Edge, and Firefox.

> **Note:** All data and logic is client-side. No API calls, no backend. Safe to demo on any machine without setup.

## Pages

### `index.html` — Strategy Overview

Narrative presentation of the Dynamic Content Strategy with five tabs:

- **Overview** — Problem statement, closed-loop architecture diagram, six pillars
- **Pipeline Simulator** — Visual flow of the tiered enrichment pipeline
- **Model Store** — Model selection matrix with cost/quality/latency tradeoffs
- **QA Monitor** — Quality assurance dashboard mockup
- **Roadmap** — Phased rollout plan with milestones

### `demo.html` — Interactive Pipeline Wizard

End-to-end pipeline simulation. Walks through content enrichment for a realistic product catalog.

**Flow:**
1. **Platform Selection** — Choose Talabat (MENA, English), PedidosYa (LATAM, Spanish), or Yemeksepeti (Turkey, Turkish)
2. **Upload / Load Sample** — Upload a CSV or load the embedded sample dataset (20-98 products depending on platform)
3. **Tier & ROI** — Each product is assigned a vendor tier (Lite/Pro/Plus/Enterprise) with ROI-based overrides. Products without a vendor assignment stay at Lite with no ROI override.
4. **Model Selection** — 5-task model matrix (Title Generation, Attribute Extraction, Category Prediction, Variant Grouping, Image Analysis) with per-tier model assignment and reasoning
5. **Content Generation** — Side-by-side before/after title transformation with tier-differentiated enrichment. Includes:
   - Typo correction (all tiers)
   - Brand positioning and size normalization (Pro+)
   - Product type inference (Plus+)
   - Full guideline compliance and image verification (Enterprise)
   - Dairy-specific title guidelines with locale-aware translations
   - Image Intelligence simulation (category prediction, brand logo, OCR)
6. **QA Gate** — Automated quality checks including confidence scoring, language consistency, image-title matching, and dairy guideline compliance. Human-readable rejection/review reasons.
7. **Results Dashboard** — Variant grouping, cost/quality breakdown by tier, savings analysis

**Key features:**
- Locale-aware content: titles, flavors, product types, and fat/processing terms are translated per platform language
- QA detects untranslated foreign terms (e.g., English "Strawberry" in a Turkish title)
- Tier impact preview shows the same product processed at all four tiers side-by-side
- Product modal with full enrichment detail, Image Intelligence card, and tier capabilities checklist

## Sample Data

### `sample_products.csv`

98 products across the Talabat (MENA) dataset. Covers:
- 4 vendor tiers (Lite / Pro / Plus / Enterprise)
- 6 regions (AE, SA, PK, ID, EG, AE)
- 6 categories (packaged food, non-food, electronics, pharma, ultrafresh, tobacco)
- Realistic messy titles with typos, ALL CAPS, missing info

PedidosYa and Yemeksepeti datasets are embedded directly in `demo.html` with platform-appropriate products and locale-native raw titles.

## Data Model

Mirrors real DataForge schemas:

| Field | Description |
|-------|-------------|
| `master_product_code` | Unique product identifier |
| `product_title` | Raw vendor-submitted title |
| `image_url` | Product image URL |
| `brand` | Brand name |
| `vendor_name` | Vendor/store name |
| `vendor_tier` | Vendor quality tier (lite/pro/plus/enterprise) |
| `region` | Country code |
| `category` | Product category |

Enriched attributes include: `generic_name`, `content_value`, `content_unit`, `flavor`, `fat`, `color`, `country_of_origin`, `halal`, `gluten_free`, `organic`, `product_type`, `scent`, `type_of_pack`.

## Design Decisions

- **Client-side only** — No server, no API keys, no auth. Opens from `file://` or any static host.
- **Deterministic simulation** — All enrichment, QA scoring, and model assignment is computed from product attributes. Reproducible across demos.
- **Locale-aware** — Flavor translations, product type inference, fat/processing terms, and QA language checks are all driven by the selected platform's locale.
- **Tier controls what gets added, never what gets removed** — Information present in the raw title is always preserved regardless of tier. Tiers only control whether missing values are inferred.
- **Unassigned vendor = Lite baseline** — Products without a vendor assignment are locked to Lite tier. ROI overrides are skipped (even for high-value brands), but locale-based cost/confidence multipliers still apply since those reflect input complexity, not vendor quality.
