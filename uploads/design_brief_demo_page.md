# Design Brief: Dynamic Content Pipeline Demo Page

## What This Is

A separate standalone page (its own URL) that demonstrates the Dynamic Content pipeline as an animated, scroll-driven journey. Think SaaS product demo page -- the viewer scrolls, animations trigger within each section and auto-play with comfortable reading pauses. This is NOT part of the strategy walkthrough. It lives alongside it.

## Site Structure

Three pages, linked from a shared home page:

1. **Home** (`index.html`) -- Minimal landing page. Hero section with the Dynamic Content branding (logo + wordmark), a one-liner value prop, and two clear CTAs: "View Strategy" (links to the strategy walkthrough) and "Watch Demo" (links to this demo page). Also includes an "Our Team" section at the bottom (see details below).
2. **Strategy Walkthrough** -- The interactive problem/solution walkthrough from the main design brief.
3. **Pipeline Demo** -- This page. The animated journey described below.

## Branding

Create a **logo + wordmark combo** for "Content Wizard powered by Dynamic Content" (or just "Dynamic Content" if cleaner). This is internal product branding -- it should feel modern, technical, and confident. Use the DH brand palette from `design_brief_branding.md` (Outfit font, DH Red as accent). The logo should work in a nav bar, a splash screen, and a favicon. It appears on all three pages.

## Home Page: Our Team Section

Below the hero and CTAs, include an "Our Team" section. Card-based layout, each card has:
- Photo (circular crop, placeholder silhouette for now)
- Name
- Role

Team members (use placeholder photos):

| Name | Role |
|---|---|
| Necmettin Tamgueney | Product Lead |
| Sarvesh Patil | Engineering Lead |
| Ameer Hamza | Senior ML Engineer |
| Bhavya Jain | Senior Data Scientist |
| Gabriel Straub | Senior Backend Engineer |
| Amit Sharma | Senior Backend Engineer |
| Nikhil Kulkarni | Backend Engineer |
| Prashanth M | Backend Engineer |

Keep it clean -- no bios, no social links. Just faces, names, and roles.

---

## Demo Page: The Journey

### Interaction Model

**Scroll-driven with auto-animate.** Scrolling triggers each section into view. Within each section, animations auto-play with timed pauses -- enough time for the viewer to read and understand each step before the next animation begins. Not too fast. The viewer controls pace by scrolling; the animations within a section handle themselves.

### Narrative Flow

The demo tells the story of products entering the system and getting enriched. The viewer sees the full pipeline end to end.

---

### Scene 1: Data Ingestion

**Animation:** Multiple CSV files slide/float into view from different angles. They carry labels like "Vendor Upload - Al-Maha Mini Market (UAE)", "Catalog Import - Carrefour (MENA)", "PedidosYa - Almacen Don Pedro (AR)". They funnel into a central intake point branded with the Dynamic Content logo.

**Key message:** Products enter from many sources, many vendors, many platforms. The system handles them all.

---

### Scene 2: Model Store -- The Brain

**Animation:** Before any product is processed, showcase the model selection system. A dashboard-like view appears showing the 5 content tasks (Title Generation, Attribute Extraction, Category Prediction, Variant Grouping, Image Analysis). For each task, models are listed with accuracy/cost/latency bars. The "best model" highlights automatically.

Then animate a weekly cadence indicator: "Every week, the Model Store benchmarks all available models and reassigns the best performer per task and tier." Show a model swap animation -- e.g., GPT-4.1-mini gets replaced by Claude 4 Haiku on attribute extraction because it's cheaper at the same quality.

**Key message:** The system continuously selects the best model. No manual switching. No development project to adopt a new model.

**Pause here for reading.**

---

### Scene 3: Product Arrives -- Image + Title Analysis

**Animation:** Zoom into ONE product from the batch. Show a product card forming: the raw vendor title appears (messy, broken -- e.g., "almarai full fat milk 1L"), the product image loads beside it. Animated scan lines or highlight effects analyze both the image and the title.

The system extracts initial signals: brand detected (Almarai), category guessed (Dairy), image verified (matches a milk product), language detected (English).

**Key message:** The system reads both the title and the image before making any decisions.

---

### Scene 4: Tier Assignment -- Investment Decision

This is a multi-step decision process. Animate each step with a pause between:

**Step 4a: Vendor Tier Check**
The system checks the source of the CSV. "This product was uploaded by Al-Maha Mini Market." A vendor profile card appears: 1 store, Lite tier. The product gets a preliminary "Lite" badge.

Then show the alternative: a product from Carrefour Hypermarket gets "Enterprise" immediately.

**Step 4b: ROI Assessment**
The system checks inventory for similar products. "Found 847 similar dairy products. Almarai Full Fat Milk is a top-seller in MENA (top 5% by volume)." A similarity search animation shows matching products appearing.

Similar vendors and similar products are checked. The ROI signal suggests this product deserves higher investment than its vendor tier implies.

**Step 4c: Final Tier Decision**
The preliminary Lite tier gets overridden by the ROI signal. "ROI Override: Lite -> Pro. High-value brand at a low-tier vendor." The badge animates from gray (Lite) to blue (Pro).

**Step 4d: Unassigned Products**
Show a secondary callout: "Products not yet assigned to a vendor stay at Lite. Once assigned in the Catalog tool, the tier updates automatically."

**Key message:** Tier is not random. It's a calculated investment decision combining vendor quality and product value.

---

### Scene 5: Guidelines -- The Quality Target

**Animation:** A human figure (or avatar) appears, writing a detailed guideline document. Zoom into the guideline being written:

"Dairy > Milk: Title must include brand, fat percentage (Full Fat / Low Fat / Skimmed), processing type (UHT / Pasteurized / Fresh), and size. Format: `[Brand] [Fat%] [Processing] Milk [Size]`"

The guideline is detailed, specific, with examples.

Then zoom out. The single guideline document multiplies -- dozens of guideline cards appear for other categories: Beverages, Cleaning, Electronics, Pharma, Baby Care, Fresh Produce. Some are detailed (Dairy, Beverages -- high customer impact), others are lighter/placeholder (Tobacco, Stationery -- lower priority).

Show the ownership model briefly: "Platform teams fill in locale-specific rules. Central team defines the structure."

Then show the locale dimension: the same dairy guideline appears in 3 versions:
- EN (Talabat): `Almarai Full Fat UHT Milk 1L`
- ES (PedidosYa): `Leche Entera UHT Almarai 1L`
- TR (Yemeksepeti): `Pinar Tam Yagli UHT Sut 1L`

**Key message:** Quality is a defined target, not discovered after the fact. Guidelines are detailed where it matters and locale-aware.

---

### Scene 6: Content Generation -- The Transformation

**Animation:** The product from Scene 3 enters the generation pipeline. The model selected in Scene 2 processes it.

Show the title transformation as a typing/morphing animation:

```
Raw:        almarai full fat milk 1L
             ↓ fixing typos, capitalizing...
Lite:       Almarai Full Fat Milk 1L
             ↓ applying brand positioning, category descriptor...
Pro:        Almarai Full Fat Milk 1L - Fresh Dairy
             ↓ inferring product type, processing...
Plus:       Almarai Full Fat Fresh Milk 1L - UHT Long Life
             ↓ full enrichment, image verification...
Enterprise: Almarai Full Fat Fresh Cow's Milk 1 Litre - UHT Long Life, No Preservatives
```

Since this product was assigned Pro tier (from Scene 4), highlight the Pro output as the final result. But briefly show all four tiers so the viewer understands what higher investment buys.

Then show attributes appearing one by one alongside the title:
- Brand: Almarai ✓
- Size: 1L ✓
- Fat: Full Fat ✓ (Pro extracts this)
- Flavor: Plain ✓ (Pro extracts this)
- Processing: ? (skipped at Pro, would need Plus)
- Allergens: ? (skipped at Pro, would need Enterprise)

**Key message:** The tier controls how deep the enrichment goes. Better models produce better titles. Each tier adds more.

---

### Scene 7: Master Category Prediction

**Animation:** The product enters the category prediction system. Show the golden dataset being queried -- embedding vectors compared via cosine similarity.

Show the prediction: "Dairy > Fresh Milk" with 94% confidence. Green checkmark.

Then show a wrong prediction for a different product: "Nescafe Dolce Gusto Capsules" predicted as "Instant Coffee" with 62% confidence. Red flag.

Animate the correction flow: a content agent overrides to "Coffee Capsules". The override enters the multi-agent validation gate (3 agents check it). All 3 agree. The correction is added to the golden dataset.

Next time a similar product appears, the prediction is correct. The loop closes.

**Key message:** The golden dataset grows from every correction. The model improves continuously.

---

### Scene 8: QA Gate

**Animation:** The enriched product passes through QA checks. Show each check as a checkpoint:

- ✅ Language consistency: English title, English locale -- pass
- ✅ Title length: 42 characters -- pass
- ✅ Required fields: brand, size, fat% present -- pass
- ✅ Confidence: 0.87 (threshold for Pro: 0.7) -- pass
- ✅ Image-title match: Almarai logo detected in image -- pass

The product gets a green "Auto-Published" stamp.

Then show a failing product: a Turkish title with "Strawberry" (English) instead of "Cilek" (Turkish). Red rejection with a human-readable reason: "Foreign language detected in title. Expected Turkish."

**Key message:** QA is automated, rule-based, and catches real problems before they reach the app.

---

### Scene 9: Locale Showcase

**Animation:** The same product concept shown in 3 locales side by side:

| | Talabat (EN) | PedidosYa (ES) | Yemeksepeti (TR) |
|---|---|---|---|
| Raw | `almarai full fat milk 1L` | `la serenisima leche entera 1lt sachet` | `pinar tam yagli sut 1l` |
| Enriched | `Almarai Full Fat Milk 1L - Fresh Dairy` | `Leche Entera La Serenisima Sachet 1L` | `Pinar Tam Yagli Gunluk Sut 1L` |
| Format | Brand-first | Generic-first | Brand-first |

Highlight the structural differences: word order, unit formatting, variant naming in each language.

**Key message:** One system, three locales, locale-aware rules. Not a one-size-fits-all translation.

---

### Scene 10: Cost Projection -- Scaled to 1 Million Products

**Animation:** The single product zooms out. The view expands to show the full batch, then multiplies to represent 1 million products. A counter ticks up.

Show a cost comparison table or animated counter:

| Tier | Cost per product | Mix (%) | Products | Total cost |
|---|---|---|---|---|
| Lite | $0.001 | 45% | 450,000 | $450 |
| Pro | $0.003 | 30% | 300,000 | $900 |
| Plus | $0.015 | 18% | 180,000 | $2,700 |
| Enterprise | $0.030 | 7% | 70,000 | $2,100 |
| **Total** | | | **1,000,000** | **$6,150** |

Then show the "without tiering" alternative: all 1M products at Enterprise cost = $30,000. 

Savings animated: **$23,850 saved (79.5% cost reduction)** with no quality loss for Lite/Pro products (they don't need Enterprise enrichment).

Then show the quality side: "Without tiering, 450,000 Lite products get expensive enrichment they don't need. With tiering, 70,000 Enterprise products get the premium treatment they deserve."

**Key message:** Tiered investment isn't just cheaper. It's smarter. The right investment for the right product.

---

## Design Notes

- Every section should have enough reading time. Animations should enhance understanding, not rush past it.
- Use the product data from `design_brief_dataset.json` for realistic examples throughout.
- The nav should show the Dynamic Content logo/wordmark and link back to the home page.
- The page should feel like a premium SaaS product demo -- polished, confident, not scrappy.
- Apply the DH branding from `design_brief_branding.md` (Outfit font, DH Red accent, clean layout).
- The locale section (Scene 9) is important -- it shows this isn't a simple English-only system.
