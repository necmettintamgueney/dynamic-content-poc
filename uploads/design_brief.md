# Design Brief: Dynamic Content Strategy -- Interactive Walkthrough

## What This Is

A design brief for an interactive walkthrough that guides viewers through the problems in our content intelligence systems and the proposed solutions. By the end, every problem introduced should be clearly resolved. No loose threads.

The walkthrough includes a sample dataset (provided separately as `design_brief_dataset.json`) with real product examples showing broken vendor titles and how each tier of AI enrichment fixes them differently.

---

## The Business

**Company:** Delivery Hero -- one of the world's largest online food and grocery delivery platforms, operating in 70+ countries.

**Business model:** Quick Commerce (Q-Commerce). Dark-store grocery delivery. Customers order groceries, household goods, electronics, and pharmacy items through a mobile app and receive delivery in minutes from neighborhood dark stores (small fulfillment centers, not retail shops).

**This is NOT restaurant delivery.** The product catalog is structured goods (packaged food, beverages, cleaning supplies, electronics, fresh produce), not restaurant menus.

**Platforms** (each is a separate consumer-facing app):
- **Talabat** -- MENA region (UAE, Saudi Arabia, Egypt, Pakistan). Largest platform by volume. English interface.
- **PedidosYa** -- Latin America (Argentina, Chile, Colombia, etc.). Spanish interface.
- **Yemeksepeti** -- Turkey. Turkish interface.

Each platform has its own product catalog, vendors, and content rules. A product title that works in Talabat (English, brand-first) needs different formatting for PedidosYa (Spanish, generic-type-first) and Yemeksepeti (Turkish, locale-specific terms).

---

## The Users

### App customers (end users)

Millions of consumers ordering groceries through the app. They see:
- Product titles in search results and category browsing
- Product detail pages with attributes (size, flavor, fat %, ingredients)
- Variant pickers ("choose size: 500mL / 1L / 2L")

**How content quality affects them:**
- Bad titles cause wrong purchases ("Almarai Milk" -- is it full fat? low fat? what size?)
- Missing attributes mean they can't filter or compare (no fat %, no flavor, no pack size)
- Duplicate listings for the same product confuse search results
- Wrong categories mean the product doesn't appear where they're looking
- All of this erodes trust and drives customers to competitors

### Content agents (internal operations)

Operations teams in each market who manage the product catalog. They:
- Review AI-generated titles and correct mistakes
- Override category recommendations when the model is wrong
- Manually fill in missing attributes
- Work through daily queues of hundreds of products

**How problems affect them:**
- 66.6% of AI-generated titles need correction -- most of their day is spent fixing AI output
- The same mistakes repeat (e.g., "add 1 Piece" is 19-34% of all corrections) because corrections never feed back
- Category overrides are applied but never improve the model -- they override the same wrong predictions repeatedly
- No way to know if quality is improving or degrading -- they just process queues

### Vendors (external partners)

Grocery stores and brands that supply products. They range from:
- **Small local shops** (1 store, submitting products via spreadsheet with messy titles)
- **Regional chains** (50+ stores, semi-structured onboarding)
- **Strategic partners** (Carrefour, Lulu, Panda -- hundreds of stores, expecting premium listing quality)

**How they submit content:**
- Vendors upload product information: title, image, brand, basic attributes
- Quality varies wildly: typos, ALL CAPS, missing sizes, wrong units, no brand name
- Strategic partners expect their listings to match their own retail standards

---

## What We're Building (High Level)

Two AI systems that both need the same fix:

**System 1: Content Enrichment Pipeline**
Takes messy vendor-submitted product data and produces clean, structured listings: corrected titles, extracted attributes (size, flavor, fat %), variant grouping (500mL / 1L / 2L as one product family), and image analysis.

**System 2: Master Category Prediction**
Takes a product title and image and predicts where it belongs in the taxonomy (L1: Food & Beverages > L2: Dairy > L3: Fresh Milk). Platform teams review and can override.

Both systems are currently open-loop: corrections are lost, models are unmanaged, and quality is unmonitored. The strategy closes both loops with the same architecture.

---

# The Problems

Each problem should be introduced individually. The viewer should understand and feel the weight of each one before moving on.

---

## Problem: Budget Unknown Before Design

We design content solutions before we know what they are allowed to cost. A small local shop with 50 products and a strategic partner like Carrefour with 10,000 products get the same enrichment approach. Effort goes into options that were never viable for low-value vendors.

**Who it hurts:** Engineering (wasted effort), business (overspend on low-value, underspend on high-value)

**Applies to:** Content Enrichment

---

## Problem: Uniform Investment per Product

Every product gets the same AI model, same QA, same cost. A product with 10 views/month from a small local shop gets the same treatment as a top-seller with 100,000 views/month from Carrefour.

**Who it hurts:** Business (no ROI differentiation), strategic partners (their products don't get premium treatment)

**Applies to:** Content Enrichment

---

## Problem: High Title Correction Rate

66.6% of AI-generated titles require human correction by content agents. The corrections follow predictable patterns (e.g., "add 1 Piece" accounts for 19-34% of all corrections), but the model never learns from them. Content agents fix the same mistakes day after day.

**Who it hurts:** Content agents (wasted effort), app customers (bad titles reach the app before correction)

**Key number:** 66.6% correction rate

**Applies to:** Content Enrichment

---

## Problem: Slow Model Evaluation

Evaluating and adopting a new AI model is a separate development project every time. There is no standardized benchmarking. Model evaluation cycles are measured in months. Meanwhile, better and cheaper models are released weekly.

**Who it hurts:** Engineering (repetitive work), business (paying for outdated models)

**Key number:** Months per evaluation cycle

**Applies to:** Content Enrichment, Category Prediction

---

## Problem: No Production Observability

We learn about quality problems weeks later through correction data, if at all. There is no real-time monitoring. If a model starts producing worse titles after an update, no one knows until content agents start complaining.

**Who it hurts:** Content agents (increasing workload with no explanation), app customers (degraded experience)

**Key number:** Weeks of detection lag

**Applies to:** Content Enrichment, Category Prediction

---

## Problem: Slow Reaction, Minor Fixes Ignored

Even once a problem is known, shipping a fix is another development cycle. Small recurring issues (like the "add 1 Piece" pattern affecting 19-34% of corrections) never reach the top of a backlog and persist for months. Content agents develop workarounds instead.

**Who it hurts:** Content agents (permanent friction), app customers (persistent low-quality patterns)

**Applies to:** Content Enrichment

---

## Problem: Static Golden Dataset

The category prediction model compares product embeddings against a "golden dataset" of known-good categories. This is a JSON file in cloud storage, updated manually via Jupyter notebooks. Adding a new category takes days of manual work by a single person.

**Who it hurts:** Platform teams (wrong predictions for new categories), app customers (products in wrong categories)

**Key detail:** Manual notebook-driven updates only

**Applies to:** Category Prediction

---

## Problem: Lost Corrections (Category)

When a content agent rejects a category recommendation and assigns the correct one, that correction is applied in the product system but never flows back to improve the model. The model makes the same wrong prediction next time. ~2,400 overrides happen every week, and zero are used for improvement.

**Who it hurts:** Content agents (same overrides repeatedly), app customers (products miscategorized until manually fixed)

**Key number:** ~2,400 overrides/week, zero fed back

**Applies to:** Category Prediction

---

## Problem: Unreliable Ground Truth

Ground truth is defined as "GPT-4o agrees with the product data." Only 63.2% agreement. 44 categories have zero ground truth examples. We cannot reliably measure whether the model is getting better or worse.

**Who it hurts:** Engineering (can't evaluate improvements), business (no confidence in accuracy claims)

**Key numbers:** 63.2% agreement | 44 empty categories

**Applies to:** Category Prediction

---

## Problem: No Model Governance (Category)

Two model versions coexist: AutoML (text-only) and embedding-based (text + image). Which one serves which region is controlled by an environment variable. No A/B testing, no comparison, no data-driven selection. Switching a region's model is a manual config change.

**Who it hurts:** Engineering (ad-hoc decisions), platform teams (inconsistent accuracy across regions)

**Key detail:** Model selection via env var toggle

**Applies to:** Category Prediction

---

# The Solutions

Each solution should explicitly reference which problems it resolves. The viewer should feel the earlier problems being closed out one by one.

---

## Solution: Tiered Onboarding

Vendor tier sets the investment envelope before any content work begins. The tier determines which AI model runs, how much QA the output gets, and what level of enrichment is applied.

- **Lite:** Baseline hygiene only. Fix typos, normalize caps and units. Cheapest model. Auto-published. For small local shops.
- **Pro:** Category-level guidelines. Brand positioning. Light variant grouping. Mid-tier model. For regional chains.
- **Plus:** Granular guidelines. Full variant dedup. Deep attribute extraction. Premium model. For national retailers.
- **Enterprise:** Best-available model. Trust-class validation. Product type inference. Image verification. For strategic partners (Carrefour, Lulu, Panda).

The dataset includes examples showing the same product processed at each tier -- the difference in output quality is the argument for differentiation.

**Resolves:** Budget Unknown, Uniform Investment

---

## Solution: ROI Override

Expected return refines the tier per product. A high-value brand (e.g., Almarai, Coca-Cola) at a Lite vendor gets promoted to Pro. A low-value niche product at an Enterprise vendor stays at lower investment. The fine adjustment on top of coarse tiering.

**Resolves:** Uniform Investment

---

## Solution: Guidelines and Acceptance Criteria

Define what good content looks like per category before generation runs. Dairy titles must include fat percentage and processing type. Electronics must include voltage. Beverages must include volume. The quality target is defined, not discovered after the fact. Both models and QA have a concrete bar to clear.

**Resolves:** High Correction Rate, Slow Model Evaluation

---

## Solution: Model Store and Selection Agent

A model store that continuously benchmarks available models across five content tasks:

1. Title Generation
2. Attribute Extraction
3. Category Prediction
4. Variant Grouping
5. Image Analysis

The Selection Agent automatically assigns the most cost-effective model that clears the quality bar, per task, per tier. When a cheaper model achieves the same quality, it switches. When a new model appears, it is benchmarked and enters the rotation without a development project.

**Resolves:** Slow Model Evaluation, No Model Governance (Category)

---

## Solution: Continuous QA -- Three Layers

1. **Inline QA:** Every generation is validated against acceptance criteria before publishing. Pass = auto-publish. Fail = flagged for content agent review. Includes confidence scoring, language consistency, and guideline compliance.
2. **Monitoring QA:** Agents scan production output, correction signals, and downstream metrics continuously. Detects patterns, regressions, and drift.
3. **Herogen (auto-fix):** Low-risk issues are fixed automatically (e.g., the "add 1 Piece" rule). High-risk issues are escalated with a diagnosis attached. Detection to resolution shrinks from months to days.

**Resolves:** High Correction Rate, No Observability, Slow Reaction, Minor Fixes Ignored

---

## Solution: Close the Category Feedback Loop

Capture every human category override as a structured correction signal. The override is queued for validation instead of being discarded. No new human effort; the signal already exists -- content agents are already doing the overrides.

**Resolves:** Lost Corrections (Category), Static Golden Dataset

---

## Solution: Multi-Agent Validation Gate

Before any correction enters the golden dataset, it passes three independent AI agents:

- **Agent 1 -- Category Expert LLM:** "Is this category plausible given the product title and image?"
- **Agent 2 -- Embedding Consistency:** "Is the product embedding closer to the proposed category than the original?"
- **Agent 3 -- Cross-Reference:** "Do similar products in other regions confirm this category?"

Verdict:
- 3/3 agree: auto-add to golden dataset
- 2/3 agree: queue for expert review
- 0-1/3 agree: reject (likely human error)

**Projected impact:** ~60% auto-validated, ~1,400 new examples/week, +8-12% accuracy within 3 months

**Resolves:** Static Golden Dataset, Unreliable Ground Truth

---

## Solution: Production Accuracy Monitoring

Per-region, per-category-depth accuracy tracking. Drift detection alerts when accuracy degrades. The monitoring signal feeds back into Model Store selection.

**Resolves:** No Observability (Category), No Model Governance (Category)

---

## Solution: Cold-Start Attribute Onboarding

Adding a new attribute (e.g., Calories, Skin Type) when there is no labeled data. A graduated pipeline:

1. **Define** -- Attribute definition, data type, extraction sources
2. **Seed** -- Few-shot training data from the existing catalog (no separate dataset needed)
3. **Assess** -- Bootstrap accuracy from few-shot examples, active learning suggestions
4. **Improve** -- The QA loop IS the training loop: every correction improves the next batch
5. **Go Live** -- Enterprise-first rollout, expand as accuracy grows

**Resolves:** Demonstrates that the closed-loop architecture handles even the hardest case (zero training data)

---

# The Closing Moment

By this point, every problem from the first half should be accounted for. The final screen should make this explicit -- a visual confirmation that all problems map to solutions and that the system improves continuously.

The unifying insight: both content enrichment and category prediction are solved by the same architecture. One closed loop. One Model Store. One QA framework. Applied to every content intelligence task.

## Resolution Map

| Problem | Resolved By |
|---|---|
| Budget Unknown | Tiered Onboarding |
| Uniform Investment | Tiered Onboarding + ROI Override |
| High Correction Rate | Guidelines + Continuous QA |
| Slow Model Evaluation | Model Store |
| No Observability | Continuous QA (Monitoring) + Production Accuracy Monitoring |
| Slow Reaction / Ignored Fixes | Continuous QA (Herogen) |
| Static Golden Dataset | Feedback Loop + Multi-Agent Validation |
| Lost Corrections | Feedback Loop |
| Unreliable Ground Truth | Multi-Agent Validation |
| No Model Governance | Model Store |

---

## Attached Dataset

The file `design_brief_dataset.json` contains sample product data for the walkthrough. It includes:

- 30 products across 3 platforms (Talabat, PedidosYa, Yemeksepeti)
- Vendor-submitted raw titles with realistic problems (typos, ALL CAPS, missing info, wrong units)
- Enriched titles at each tier (Lite, Pro, Plus, Enterprise) showing progressive improvement
- Extracted attributes per tier
- Category predictions with confidence scores
- Before/after comparisons that make the value of tiered enrichment tangible

Use this data to populate the interactive walkthrough with real examples. The viewer should see concrete product titles transforming, not abstract descriptions of what the system does.

---

## What This Brief Is NOT

- Not a UI/UX specification -- the designer decides layout, navigation, transitions, and visual language
- Not a product spec or PRD
- Not a timeline or roadmap
- Not a technical architecture document

This brief describes the content, narrative arc, and resolution structure. The dataset provides concrete examples. The designer's job is to find the most compelling interactive format to walk someone through this story so they leave with full clarity.
