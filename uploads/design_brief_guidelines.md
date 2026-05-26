# Supplementary: Content Guidelines by Locale

## Guideline Ownership: The Open Question

Who writes and maintains the content guidelines is an unresolved strategic decision. There are two models, each with real tradeoffs:

### Option A: Platform-Owned Guidelines

Each platform (Talabat, PedidosYa, Yemeksepeti) owns and maintains its own guidelines. Platform teams write the title structure, attribute rules, and QA acceptance criteria for their region.

**Pros:**
- Platform teams have deep regional expertise (local brands, consumer expectations, regulatory requirements)
- Faster iteration -- a platform can update guidelines without waiting for central approval
- Guidelines reflect actual local market needs (e.g., halal certification prominence in MENA, nutritional labeling rules in LATAM)
- Platform teams are closer to content agents and can respond to their feedback directly

**Cons:**
- Inconsistency across platforms -- the same brand/product might get different treatment in each market
- Duplication of effort -- each platform writes similar rules independently
- Quality variance -- some platforms may have stronger guidelines than others
- Harder to enforce a global quality standard
- New platforms have to start from scratch

### Option B: Centrally-Owned Guidelines

A central team defines and maintains all guidelines. Platforms consume them but don't modify them.

**Pros:**
- Consistency across all platforms -- one standard, one quality bar
- No duplication -- guidelines are written once and applied everywhere
- Easier to enforce and audit compliance
- New platforms get a ready-made guideline set from day one

**Cons:**
- No suitable central role exists today to write detailed guidelines at the level of "title structure per language per category per product type" -- this is deep domain work
- Central team lacks regional expertise -- they don't know that Turkish dairy titles should emphasize the source animal, or that Argentine bread has specific size descriptors (Chico/Familiar)
- Slower to update -- platform-specific needs go through a central queue
- Sacrifices regional nuance for global consistency

### The Likely Middle Ground

A hybrid model where the central team defines the framework and structural rules (title format, attribute tiers, QA thresholds), and platform teams fill in the locale-specific content (category-level rules, translations, regional product knowledge). This keeps consistency on structure while preserving regional expertise on substance. The walkthrough should present both options and the tradeoff, then show the hybrid as the recommended path.

---

## Title Guidelines (per locale)

| Rule | Talabat (EN) | PedidosYa (ES) | Yemeksepeti (TR) |
|---|---|---|---|
| Word order | Brand first: `Almarai Full Fat Milk 1L` | Generic first: `Leche Entera Almarai 1L` | Brand first: `Pinar Tam Yagli Sut 1L` |
| Capitalization | Title Case | Title Case | Title Case |
| Size placement | End of title | End of title | End of title |
| Unit format | `330mL`, `1L`, `500g`, `1.5kg` | `330mL`, `1L`, `500g`, `1.5kg` | `330mL`, `1L`, `500g`, `1.5kg` |
| Connector | USB-C (hyphenated) | USB-C | USB-C |
| Variant naming | English: "Zero Sugar", "Original", "Unsalted" | Spanish: "Sin Azucar", "Original", "Sin Sal" | Turkish: "Sekersiz", "Original", "Tuzsuz" |
| Pack format | `5 Pack 75g Each` or `5x75g` | `Pack 5 Unidades 75g` or `5x75g` | `5'li Paket 75g` or `5x75g` |

---

## Title Guidelines by Category

| Category | Required in title | Example |
|---|---|---|
| Dairy (Milk) | Fat % + processing type (UHT/Pasteurized/Fresh) | `Almarai Full Fat UHT Milk 1L` |
| Dairy (Cheese) | Type (cream/white/cheddar) + processing | `Philadelphia Original Pasteurized Cream Cheese 200g` |
| Dairy (Butter) | Salted/Unsalted + origin style if applicable | `Lurpak Unsalted Danish Butter 200g` |
| Beverages (Carbonated) | Variant (Regular/Zero/Diet) + packaging (Can/Bottle/PET) | `Coca-Cola Zero Sugar Can 330mL` |
| Beverages (Juice) | Flavor + type (Fresh/Concentrate/Nectar) | `Almarai Fresh Orange Juice 1.5L` |
| Cleaning (Detergent) | Form (Liquid/Powder/Gel/Tabs) + scent if applicable | `Tide Original Liquid Laundry Detergent 3L` |
| Personal Care | Variant/benefit + form (Shampoo/Soap/Lotion) | `Head & Shoulders Anti-Dandruff Shampoo 400mL` |
| Electronics | Key spec (wattage/voltage/connectivity) | `Samsung 25W USB-C Fast Charging Adapter` |
| Pharma | Concentration/strength + form (Tablet/Gel/Syrup) | `Voltaren Emulgel 1% Topical Pain Relief Gel 100g` |
| Baby Care | Size name + weight range + count | `Pampers Baby-Dry Size 4 Maxi (9-14kg) 44 Count` |
| Fresh Produce | Variety if known + unit (per kg / per pack) | `Fresh Roma Tomatoes 1kg` |

---

## Attribute Extraction Rules (by tier)

| Attribute | Lite | Pro | Plus | Enterprise |
|---|---|---|---|---|
| Brand | Extract from title | Extract from title | Extract + verify vs image | Extract + verify + normalize |
| Size/Volume | Extract if present | Extract + standardize unit | Extract + add total weight for multipacks | Extract + verify vs image OCR |
| Flavor/Variant | Skip | Extract from title | Extract + translate to locale | Extract + verify vs image label |
| Fat % (Dairy) | Skip | Extract if in title (e.g. "full fat") | Infer from brand/product if missing (e.g., Almarai Full Fat = 3.1%) | Infer + verify vs nutritional image |
| Processing Type | Skip | Skip | Infer (UHT, Pasteurized, Fresh) from brand knowledge | Infer + verify |
| Dietary (Halal, Gluten-Free, Organic) | Skip | Skip | Extract if in title | Extract from title + image certification logos |
| Allergens | Skip | Skip | Skip | Extract from image (ingredient list OCR) |
| Country of Origin | Skip | Skip | Infer from brand knowledge | Infer + verify vs image label |
| Storage Instructions | Skip | Skip | Skip | Infer from category (dairy = refrigerated) + image |
| Active Ingredient (Pharma) | Skip | Skip | Extract if in title | Extract from title + image |

---

## Variant Grouping Rules

| Grouping Attribute | Rule | Example |
|---|---|---|
| Size variants | Same brand + same product + different size = one group | Almarai Full Fat Milk: 500mL, 1L, 2L, 3L |
| Flavor variants | Same brand + same product + same size + different flavor = one group | Pepsi 330mL: Regular, Zero Sugar, Max, Diet |
| Pack variants | Same brand + same product + single vs multipack = one group | Red Bull 250mL: Single, 4-Pack, 6-Pack |
| Scent variants (Non-Food) | Same brand + same product type + different scent = one group | Downy 1L: Valley Dew, Sunrise Fresh, Lavender |
| Color variants (Non-Food) | Same brand + same product + different color = one group | Samsung Galaxy A15 Case: Black, Clear, Blue |

Variant grouping is only available at Plus and Enterprise tiers. Lite and Pro show each variant as a separate listing.

---

## QA Acceptance Criteria (auto-reject rules)

| Check | Reject if | Example |
|---|---|---|
| Language consistency | Title contains untranslated foreign words | Turkish title with English "Strawberry" instead of "Cilek" |
| Title length | Title exceeds 120 characters | Overly verbose Enterprise enrichment |
| Required fields missing | Category-required attributes are empty | Dairy product with no fat % at Plus/Enterprise |
| Confidence too low | Model confidence below tier threshold (Lite: 0.6, Pro: 0.7, Plus: 0.8, Enterprise: 0.9) | Category prediction at 0.55 confidence |
| Image-title mismatch | Brand in title doesn't match brand logo in image | Title says "Pepsi" but image shows Coca-Cola |
| Duplicate detection | Same enriched title already exists for another product | Two different MPCs with identical enriched titles |
