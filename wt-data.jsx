// Content data for the Dynamic Content Strategy walkthrough.
// PROBLEMS, SOLUTIONS, EXAMPLE_PRODUCTS, CAST.

const PROBLEMS = [
  {
    id: "P1", num: 1, system: "enrichment",
    title: "Budget Unknown Before Design",
    headline: "We design solutions before we know what they can cost.",
    blurb: "A 50-product local shop and a 10,000-product strategic partner get the same enrichment approach. Effort goes into options that were never viable.",
    hurts: ["Engineering — wasted effort on infeasible options", "Business — over-spend on low value, under-spend on high"],
  },
  {
    id: "P2", num: 2, system: "enrichment",
    title: "Uniform Investment per Product",
    headline: "Every product gets the same model, QA, and cost.",
    blurb: "A 10-view long-tail SKU gets identical treatment to a 100,000-view best-seller. Strategic partners' top SKUs are not differentiated from local-shop noise.",
    hurts: ["Business — no ROI differentiation", "Strategic partners — premium SKUs treated like long-tail"],
  },
  {
    id: "P3", num: 3, system: "enrichment",
    title: "High Title Correction Rate",
    headline: "Two of every three AI titles need a human fix.",
    metric: { value: "66.6%", label: "of AI-generated titles need human correction" },
    blurb: "Corrections follow predictable patterns — \"add 1 Piece\" alone is 19–34% of all corrections — but the model never learns from them. Agents fix the same mistakes day after day.",
    hurts: ["Content agents — most of the day fixing AI", "Customers — bad titles ship before correction"],
  },
  {
    id: "P4", num: 4, system: "both",
    title: "Slow Model Evaluation",
    headline: "Each new model is its own development project.",
    metric: { value: "months", label: "per evaluation cycle" },
    blurb: "No standard benchmark. No automated comparison. Adopting a new model is engineering work that competes with feature delivery — while better, cheaper models ship every week.",
    hurts: ["Engineering — repetitive eval work", "Business — paying for outdated models"],
  },
  {
    id: "P5", num: 5, system: "both",
    title: "No Production Observability",
    headline: "Quality problems are discovered weeks late, by accident.",
    metric: { value: "weeks", label: "from regression to detection" },
    blurb: "There is no live quality signal. A bad model update degrades the catalog silently until content agents complain about queue volume.",
    hurts: ["Agents — rising workload, no explanation", "Customers — silent quality decay"],
  },
  {
    id: "P6", num: 6, system: "enrichment",
    title: "Slow Reaction, Minor Fixes Ignored",
    headline: "Recurring small problems sit in a backlog for months.",
    blurb: "Once a problem is known, shipping a fix is another dev cycle. Small recurring issues — \"add 1 Piece\", unit spacing, ALL-CAPS normalization — never reach the top of any backlog. Agents develop workarounds instead.",
    hurts: ["Agents — permanent friction", "Customers — persistent low-quality patterns"],
  },
  {
    id: "P7", num: 7, system: "category",
    title: "Static Golden Dataset",
    headline: "The model's ground truth is a hand-edited JSON file.",
    metric: { value: "days", label: "to add one category, by hand" },
    blurb: "The category prediction model compares product embeddings against a \"golden dataset\" — a JSON in cloud storage, updated manually via Jupyter notebooks by one engineer.",
    hurts: ["Platform teams — wrong predictions for new categories", "Customers — products buried in wrong sections"],
  },
  {
    id: "P8", num: 8, system: "category",
    title: "Lost Corrections (Category)",
    headline: "Agents override 2,400 categories a week. Zero feedback.",
    metric: { value: "~2,400/wk", label: "overrides → 0 used to improve the model" },
    blurb: "When a content agent rejects a category and assigns the right one, the correction is applied to the product — but never flows back to the model. The same wrong prediction comes back next week.",
    hurts: ["Agents — same overrides repeatedly", "Customers — products miscategorized until manual fix"],
  },
  {
    id: "P9", num: 9, system: "category",
    title: "Unreliable Ground Truth",
    headline: "We can't say if the model is getting better.",
    metric: { value: "63.2% · 44", label: "GPT-4o ↔ data agreement · empty categories" },
    blurb: "Ground truth today is defined as \"GPT-4o agrees with the product data\" — only 63.2% agreement, and 44 categories have zero examples. We cannot reliably measure improvement.",
    hurts: ["Engineering — can't evaluate improvements", "Business — no confidence in accuracy claims"],
  },
  {
    id: "P10", num: 10, system: "category",
    title: "No Model Governance",
    headline: "Which model serves which region is an environment variable.",
    blurb: "Two category-prediction models coexist — AutoML (text-only) and embedding-based (text + image). Which region uses which is set in a config file. No A/B testing, no comparison, no data-driven selection.",
    hurts: ["Engineering — ad-hoc decisions", "Platform teams — inconsistent accuracy across regions"],
  },
];

const SOLUTIONS = [
  {
    id: "S1", num: 1,
    title: "Tiered Onboarding",
    resolves: ["P1", "P2"],
    blurb: "Vendor tier sets the investment envelope before any content work begins. The tier picks the model, the QA depth, and the enrichment level — Lite for local shops, Enterprise for strategic partners.",
  },
  {
    id: "S2", num: 2,
    title: "ROI Override",
    resolves: ["P2"],
    blurb: "Expected return refines the tier per product. A high-value brand at a Lite vendor gets promoted to Pro. A long-tail SKU at an Enterprise vendor stays cheap. Fine adjustment on top of coarse tiering.",
  },
  {
    id: "S3", num: 3,
    title: "Guidelines & Acceptance Criteria",
    resolves: ["P3", "P4"],
    blurb: "Define what \"good\" means per category before generation runs. Dairy must include fat % and processing type. Electronics must include voltage. Both the model and the QA layer share the same checklist.",
  },
  {
    id: "S4", num: 4,
    title: "Model Store & Selection Agent",
    resolves: ["P4", "P10"],
    blurb: "A model store that continuously benchmarks every available model across five content tasks. The Selection Agent picks the cheapest model that clears the quality bar — per task, per tier. New models enter the rotation automatically.",
  },
  {
    id: "S5", num: 5,
    title: "Continuous QA — Three Layers",
    resolves: ["P3", "P5", "P6"],
    blurb: "Inline QA validates every generation before publishing. Monitoring QA scans production output for drift and patterns. Herogen auto-fixes low-risk recurring issues and escalates high-risk ones with a diagnosis attached.",
  },
  {
    id: "S6", num: 6,
    title: "Close the Category Feedback Loop",
    resolves: ["P7", "P8"],
    blurb: "Every human category override is captured as a structured correction signal and queued for validation. No new human work — agents are already doing the overrides; we just stop discarding them.",
  },
  {
    id: "S7", num: 7,
    title: "Multi-Agent Validation Gate",
    resolves: ["P7", "P9"],
    blurb: "Before any correction enters the golden dataset, three independent AI agents vote: 3/3 auto-adds, 2/3 routes to expert review, 0–1/3 rejects. Builds reliable ground truth from real production signal.",
    impact: "~60% auto-validated · ~1,400 new examples/week · +8–12% accuracy in 3 months",
  },
  {
    id: "S8", num: 8,
    title: "Production Accuracy Monitoring",
    resolves: ["P5", "P10"],
    blurb: "Per-region, per-category-depth accuracy tracked live. Drift detection alerts when accuracy degrades. The monitoring signal feeds back into Model Store selection.",
  },
  {
    id: "S9", num: 9, proof: true,
    title: "Cold-Start Attribute Onboarding",
    resolves: [],
    blurb: "Adding a brand-new attribute (e.g. Calories, Skin Type) with zero labeled data, in graduated stages: Define → Seed → Assess → Improve → Go Live. The QA loop is the training loop. Proves the architecture handles even the hardest case.",
  },
];

// Tier metadata (in order of investment).
const TIERS = [
  { id: "lite",       label: "Lite",       vendor: "Small local shop",       customer: "1 store",              model: "DH-Title v3 (fine-tuned)", cost: "$0.001", desc: "Baseline hygiene. Typos, caps, units.", color: "var(--t-lite)", tint: "var(--t-lite-tint)" },
  { id: "pro",        label: "Pro",        vendor: "Regional chain",          customer: "50+ stores",           model: "GPT-4.1-mini",             cost: "$0.003", desc: "Category guidelines. Brand positioning.", color: "var(--t-pro)",  tint: "var(--t-pro-tint)" },
  { id: "plus",       label: "Plus",       vendor: "National retailer",       customer: "200+ stores",          model: "Claude 4 Sonnet",          cost: "$0.015", desc: "Granular guidelines. Full variant dedup.", color: "var(--t-plus)", tint: "var(--t-plus-tint)" },
  { id: "enterprise", label: "Enterprise", vendor: "Strategic partner",       customer: "Carrefour, Lulu, Panda", model: "GPT-4.1",                 cost: "$0.030", desc: "Best model. Image verification. Trust-class QA.", color: "var(--t-ent)",  tint: "var(--t-ent-tint)" },
];

// Featured products for tier morphing & enrichment demos.
const PRODUCTS = [
  {
    id: "MPC-100001", brand: "Almarai", platform: "Talabat", locale: "EN", region: "UAE",
    raw: "almarai full fat milk 1L",
    problems: ["no capitalization", "no product type descriptor"],
    tiers: {
      lite:       "Almarai Full Fat Milk 1L",
      pro:        "Almarai Full Fat Milk 1L — Fresh Dairy",
      plus:       "Almarai Full Fat Fresh Milk 1L — UHT Long Life",
      enterprise: "Almarai Full Fat Fresh Cow's Milk 1 Litre — UHT Long Life, No Preservatives",
    },
    attrs: {
      lite:       { Brand: "Almarai", Size: "1L" },
      pro:        { Brand: "Almarai", Size: "1L", Fat: "Full Fat", Flavor: "Plain" },
      plus:       { Brand: "Almarai", Size: "1L", Fat: "Full Fat (3.1%)", Flavor: "Plain", Origin: "Saudi Arabia" },
      enterprise: { Brand: "Almarai", Size: "1L", Fat: "Full Fat (3.1%)", Flavor: "Plain", Origin: "Saudi Arabia", Storage: "Ambient", "Shelf-life": "6 months" },
    },
    category: "Food & Beverages › Dairy › Fresh Milk",
  },
  {
    id: "MPC-100002", brand: "Pepsi", platform: "Talabat", locale: "EN", region: "Saudi Arabia",
    raw: "PEPSI CAN 330 ML",
    problems: ["ALL CAPS", "space in unit", "missing variant"],
    tiers: {
      lite:       "Pepsi Can 330mL",
      pro:        "Pepsi Regular Carbonated Drink Can 330mL",
      plus:       "Pepsi Regular Carbonated Soft Drink Can 330mL",
      enterprise: "Pepsi Regular Carbonated Soft Drink Can 330mL — Contains Caffeine",
    },
    attrs: {
      lite:       { Brand: "Pepsi", Size: "330mL" },
      pro:        { Brand: "Pepsi", Size: "330mL", Flavor: "Regular", Packaging: "Can" },
      plus:       { Brand: "Pepsi", Size: "330mL", Flavor: "Regular", Packaging: "Can", Category: "Carbonated", Dietary: "Caffeine" },
      enterprise: { Brand: "Pepsi", Size: "330mL", Flavor: "Regular", Packaging: "Can", Category: "Carbonated", Dietary: "Caffeine", Origin: "Saudi Arabia", Servings: "1" },
    },
    category: "Food & Beverages › Beverages › Carbonated Drinks",
  },
  {
    id: "MPC-100003", brand: "Tide", platform: "Talabat", locale: "EN", region: "Pakistan",
    raw: "tide liquid 3l orignal",
    problems: ["no capitalization", "typo: orignal", "missing product type"],
    tiers: {
      lite:       "Tide Liquid 3L Original",
      pro:        "Tide Original Liquid Detergent 3L",
      plus:       "Tide Original Liquid Laundry Detergent 3L",
      enterprise: "Tide Original Liquid Laundry Detergent 3L — Concentrated Formula",
    },
    attrs: {
      lite:       { Brand: "Tide", Size: "3L" },
      pro:        { Brand: "Tide", Size: "3L", Variant: "Original", Type: "Liquid Detergent" },
      plus:       { Brand: "Tide", Size: "3L", Variant: "Original", Type: "Liquid Laundry Detergent", Scent: "Original" },
      enterprise: { Brand: "Tide", Size: "3L", Variant: "Original", Type: "Liquid Laundry Detergent", Scent: "Original", Formula: "Concentrated" },
    },
    category: "Non-Food › Cleaning › Laundry Detergent",
  },
  {
    id: "MPC-500001", brand: "Coca-Cola", platform: "PedidosYa", locale: "ES", region: "Argentina",
    raw: "coca cola lata 354ml",
    problems: ["no capitalization", "brand not hyphenated", "missing variant"],
    tiers: {
      lite:       "Coca Cola Lata 354mL",
      pro:        "Gaseosa Coca-Cola Regular Lata 354mL",
      plus:       "Gaseosa Coca-Cola Regular Sabor Original Lata 354mL",
      enterprise: "Gaseosa Coca-Cola Regular Sabor Original Lata 354mL — Con Cafeína",
    },
    attrs: {
      lite:       { Marca: "Coca-Cola", Tamaño: "354mL" },
      pro:        { Marca: "Coca-Cola", Tamaño: "354mL", Sabor: "Regular", Envase: "Lata" },
      plus:       { Marca: "Coca-Cola", Tamaño: "354mL", Sabor: "Regular / Original", Envase: "Lata", Tipo: "Gaseosa" },
      enterprise: { Marca: "Coca-Cola", Tamaño: "354mL", Sabor: "Regular", Envase: "Lata", Tipo: "Gaseosa", Cafeína: "Sí", Origen: "Argentina" },
    },
    category: "Alimentos y Bebidas › Bebidas › Gaseosas",
  },
  {
    id: "MPC-600002", brand: "Pınar", platform: "Yemeksepeti", locale: "TR", region: "Turkey",
    raw: "pinar tam yagli sut 1l",
    problems: ["no capitalization", "missing processing type"],
    tiers: {
      lite:       "Pinar Tam Yagli Sut 1L",
      pro:        "Pınar Tam Yağlı Günlük Süt 1L",
      plus:       "Pınar Tam Yağlı Günlük Pastörize Süt 1L",
      enterprise: "Pınar Tam Yağlı Günlük Pastörize İnek Sütü 1L — Buzdolabında Saklayın",
    },
    attrs: {
      lite:       { Marka: "Pınar", Boyut: "1L" },
      pro:        { Marka: "Pınar", Boyut: "1L", Yağ: "Tam Yağlı", Tip: "Süt" },
      plus:       { Marka: "Pınar", Boyut: "1L", Yağ: "Tam Yağlı", Tip: "Günlük Pastörize Süt" },
      enterprise: { Marka: "Pınar", Boyut: "1L", Yağ: "Tam Yağlı", Tip: "Günlük Pastörize İnek Sütü", Saklama: "Buzdolabı", Kaynak: "İnek" },
    },
    category: "Gıda ve İçecek › Süt Ürünleri › Günlük Süt",
  },
  {
    id: "MPC-300001", brand: "Galaxy", platform: "Talabat", locale: "EN", region: "UAE",
    raw: "galaxy smooth milk choclate bar 90g",
    problems: ["no capitalization", "typo: choclate"],
    tiers: {
      lite:       "Galaxy Smooth Milk Chocolate Bar 90g",
      pro:        "Galaxy Smooth Milk Chocolate Bar 90g",
      plus:       "Galaxy Smooth Milk Chocolate Bar 90g",
      enterprise: "Galaxy Smooth Milk Chocolate Bar 90g — Single Serve, Contains Milk & Soy",
    },
    attrs: {
      lite: { Brand: "Galaxy" },
      pro: { Brand: "Galaxy", Size: "90g" },
      plus: { Brand: "Galaxy", Size: "90g", Flavor: "Milk Chocolate", Type: "Bar" },
      enterprise: { Brand: "Galaxy", Size: "90g", Flavor: "Milk Chocolate", Type: "Bar", Allergens: "Milk, Soy", Servings: "1" },
    },
    category: "Food & Beverages › Snacks & Confectionery › Chocolate Bars",
  },
];

// Category prediction explorer dataset.
const PREDICTIONS = [
  {
    id: "pred-1", correct: true,
    product: "Almarai Full Fat Milk 1L",
    predicted: "Food & Beverages › Dairy › Fresh Milk",
    truth:     "Food & Beverages › Dairy › Fresh Milk",
    confidence: 0.94,
    why: "High-confidence prediction. Strong signal from \"milk\" + dairy brand embedding match.",
  },
  {
    id: "pred-2", correct: true,
    product: "Pepsi Can 330mL",
    predicted: "Food & Beverages › Beverages › Carbonated Drinks",
    truth:     "Food & Beverages › Beverages › Carbonated Drinks",
    confidence: 0.97,
    why: "Brand recognition + packaging cue + category embedding distance under threshold.",
  },
  {
    id: "pred-3", correct: false,
    product: "Nescafé Dolce Gusto Cappuccino 16 Capsules",
    predicted: "Food & Beverages › Beverages › Instant Coffee",
    truth:     "Food & Beverages › Hot Beverages › Coffee Capsules",
    confidence: 0.62,
    why: "Model sees \"Nescafé\" and defaults to instant coffee. Misses that Dolce Gusto capsules are a separate L3 category. Agent overrides — that signal is currently discarded.",
    fix: "Feedback loop captures the override → multi-agent gate validates → Coffee Capsules gains golden-dataset examples → next prediction lands at 0.88+.",
  },
  {
    id: "pred-4", correct: false,
    product: "Galaxy Smooth Milk Chocolate Bar 90g",
    predicted: "Food & Beverages › Snacks › Biscuits & Cookies",
    truth:     "Food & Beverages › Snacks › Chocolate Bars",
    confidence: 0.58,
    why: "AutoML v1 (text-only) cannot distinguish chocolate bars from biscuits without image signal. Region is on AutoML by env-var config.",
    fix: "Model Store selects embedding-based model (text + image) for this tier. Production Accuracy Monitoring would have caught the regional gap.",
  },
  {
    id: "pred-5", correct: false,
    product: "Voltaren Emulgel 100g",
    predicted: "Non-Food › Personal Care › Body Lotion",
    truth:     "Health & Pharmacy › Pain Relief › Topical Pain Relief",
    confidence: 0.44,
    why: "Gel format confuses the model. \"Topical Pain Relief\" has zero ground-truth examples — there is nothing for the model to compare against.",
    fix: "Feedback loop seeds Topical Pain Relief from agent corrections. Multi-agent gate validates plausibility (LLM + embedding + cross-region). Empty category fills from real signal.",
  },
];

// People who feel the pain.
const CAST = [
  {
    id: "customers",
    role: "App Customers",
    count: "Millions",
    snippet: "Sees \"Almarai Milk\" with no fat %, no size variant. Picks the wrong product or leaves.",
    icon: "phone",
  },
  {
    id: "agents",
    role: "Content Agents",
    count: "Hundreds (internal ops)",
    snippet: "Spends most of the day fixing the same AI mistakes. Same overrides, same typos, no feedback to the model.",
    icon: "desk",
  },
  {
    id: "vendors",
    role: "Vendors",
    count: "1 store → thousands",
    snippet: "Submits \"tide liquid 3l orignal\" via spreadsheet. Strategic partners expect retail-grade listings.",
    icon: "store",
  },
];

// QA layers for S5.
const QA_LAYERS = [
  { name: "Inline QA",     does: "Validates every generation against acceptance criteria before publish.",         outcome: "Pass → auto-publish · Fail → agent review" },
  { name: "Monitoring QA", does: "Scans production output, correction signals, and downstream metrics in real time.", outcome: "Detects patterns, regressions, drift" },
  { name: "Herogen",       does: "Auto-fixes low-risk recurring issues. Escalates high-risk ones with a diagnosis.",   outcome: "Months → days to resolution" },
];

// Model store benchmark data for S4.
const MODEL_STORE_TASKS = [
  { task: "Title Generation",      lite: "DH-v3",   pro: "4.1-mini", plus: "Sonnet",  ent: "GPT-4.1" },
  { task: "Attribute Extraction",  lite: "DH-v3",   pro: "4.1-mini", plus: "Sonnet",  ent: "GPT-4.1" },
  { task: "Category Prediction",   lite: "AutoML",  pro: "Embed-v2", plus: "Embed-v2", ent: "Embed-v2" },
  { task: "Variant Grouping",      lite: "—",       pro: "4.1-mini", plus: "Sonnet",  ent: "GPT-4.1" },
  { task: "Image Analysis",        lite: "—",       pro: "—",        plus: "Sonnet",  ent: "GPT-4.1" },
];

// Validation gate for S7.
const VALIDATION_AGENTS = [
  { name: "Category Expert LLM",   q: "Is this category plausible given the title and image?" },
  { name: "Embedding Consistency", q: "Is the embedding closer to the proposed category than the original?" },
  { name: "Cross-Reference",       q: "Do similar products in other regions confirm this category?" },
];

const VALIDATION_VERDICTS = [
  { vote: "3 / 3", outcome: "Auto-add to golden dataset",  tone: "green" },
  { vote: "2 / 3", outcome: "Queue for expert review",      tone: "amber" },
  { vote: "0–1 / 3", outcome: "Reject (likely human error)", tone: "red" },
];

// Cold-start steps for S9.
const COLD_START_STEPS = [
  { name: "Define",  does: "Attribute definition, data type, extraction sources." },
  { name: "Seed",    does: "Few-shot training data from the existing catalog." },
  { name: "Assess",  does: "Bootstrap accuracy from few-shot. Active-learning suggestions." },
  { name: "Improve", does: "Every correction trains the next batch. QA loop = training loop." },
  { name: "Go Live", does: "Enterprise-first rollout. Expand as accuracy grows." },
];

Object.assign(window, {
  PROBLEMS, SOLUTIONS, TIERS, PRODUCTS, PREDICTIONS, CAST,
  QA_LAYERS, MODEL_STORE_TASKS, VALIDATION_AGENTS, VALIDATION_VERDICTS, COLD_START_STEPS,
});
