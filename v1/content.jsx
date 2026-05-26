// All narrative content + dataset references for the walkthrough.
// Problems are numbered P1..P10. Solutions S1..S9 reference which problems they resolve.

const PROBLEMS = [
  {
    id: "P1",
    system: "enrichment",
    title: "Budget Unknown Before Design",
    blurb: "We design content solutions before knowing what they can cost. A 50-product local shop gets the same approach as a 10,000-product Carrefour.",
    hurts: ["Engineering — wasted effort", "Business — over/underspend"],
    metric: null,
    example: {
      kind: "tier-mismatch",
      productA: { vendor: "Al-Maha Mini Market", products: "~50", title: "Almarai milk", treatment: "Same model" },
      productB: { vendor: "Carrefour Hypermarket", products: "~10,000", title: "Almarai milk", treatment: "Same model" },
    },
  },
  {
    id: "P2",
    system: "enrichment",
    title: "Uniform Investment per Product",
    blurb: "Every product gets the same model, QA, and cost — whether it gets 10 views/month or 100,000.",
    hurts: ["Business — no ROI differentiation", "Strategic partners — premium SKUs treated like long-tail"],
    metric: null,
    example: {
      kind: "uniform",
      sameProduct: "Coca-Cola Zero 330mL",
      views: ["10 views/mo", "100,000 views/mo"],
      cost: "$0.003 either way",
    },
  },
  {
    id: "P3",
    system: "enrichment",
    title: "High Title Correction Rate",
    blurb: "66.6% of AI-generated titles need a content agent to fix them. Corrections follow predictable patterns, but the model never learns.",
    hurts: ["Content agents — most of the day fixing AI", "Customers — bad titles ship before correction"],
    metric: { value: "66.6%", label: "of titles need correction" },
    example: {
      kind: "correction-loop",
      raw: "tide liquid 3l orignal",
      ai: "Tide liquid 3L original",
      fixed: "Tide Original Liquid Detergent 3L",
      pattern: 'Add "1 Piece" — 19–34% of all corrections',
    },
  },
  {
    id: "P4",
    system: "both",
    title: "Slow Model Evaluation",
    blurb: "Adopting a new AI model is its own development project. No standard benchmark. Cycles in months. Better, cheaper models ship weekly.",
    hurts: ["Engineering — repetitive work", "Business — paying for outdated models"],
    metric: { value: "months", label: "per eval cycle" },
    example: { kind: "eval-timeline" },
  },
  {
    id: "P5",
    system: "both",
    title: "No Production Observability",
    blurb: "We learn about quality problems weeks later, through correction data, if at all. No real-time monitoring. A bad model update goes unnoticed until agents complain.",
    hurts: ["Agents — growing workload, no explanation", "Customers — silent quality decay"],
    metric: { value: "weeks", label: "detection lag" },
    example: { kind: "blind-pipeline" },
  },
  {
    id: "P6",
    system: "enrichment",
    title: "Slow Reaction, Minor Fixes Ignored",
    blurb: 'Once a problem is known, shipping a fix is another dev cycle. Small recurring issues (like "add 1 Piece") never reach the top of any backlog.',
    hurts: ["Agents — permanent friction", "Customers — persistent low-quality patterns"],
    metric: null,
    example: {
      kind: "backlog",
      tickets: [
        { name: "Add '1 Piece' rule", age: "8 months", status: "queued" },
        { name: "Unit spacing fix", age: "5 months", status: "queued" },
        { name: "ALL CAPS normalize", age: "3 months", status: "queued" },
      ],
    },
  },
  {
    id: "P7",
    system: "category",
    title: "Static Golden Dataset",
    blurb: 'The category model compares product embeddings against a "golden dataset" — a JSON file in cloud storage, updated by hand in Jupyter notebooks.',
    hurts: ["Platform teams — wrong predictions for new categories", "Customers — products buried in wrong sections"],
    metric: { value: "days", label: "to add one category, manually" },
    example: { kind: "static-file" },
  },
  {
    id: "P8",
    system: "category",
    title: "Lost Corrections (Category)",
    blurb: "When an agent rejects a category and assigns the right one, the correction is applied locally — but never flows back to the model. Same wrong prediction next time.",
    hurts: ["Agents — same overrides repeatedly", "Customers — products miscategorized until manual fix"],
    metric: { value: "~2,400", label: "overrides/week → 0 fed back" },
    example: {
      kind: "category-loop",
      product: "Galaxy Chocolate Bar 90g",
      predicted: "Snacks > Biscuits & Cookies",
      correct: "Snacks > Chocolate Bars",
    },
  },
  {
    id: "P9",
    system: "category",
    title: "Unreliable Ground Truth",
    blurb: 'Ground truth is defined as "GPT-4o agrees with the product data." Only 63.2% agreement. 44 categories have zero examples.',
    hurts: ["Engineering — can't evaluate improvement", "Business — no confidence in accuracy claims"],
    metric: { value: "63.2% / 44", label: "agreement / empty categories" },
    example: { kind: "ground-truth" },
  },
  {
    id: "P10",
    system: "category",
    title: "No Model Governance (Category)",
    blurb: "Two model versions coexist (AutoML text-only and embedding-based text+image). Which one a region uses is controlled by an environment variable. No A/B testing.",
    hurts: ["Engineering — ad-hoc decisions", "Platform teams — inconsistent accuracy across regions"],
    metric: { value: "env var", label: "= region's model" },
    example: { kind: "env-var" },
  },
];

const SOLUTIONS = [
  {
    id: "S1",
    title: "Tiered Onboarding",
    resolves: ["P1", "P2"],
    blurb: "Vendor tier sets the investment envelope before any content work begins. The tier picks the model, the QA depth, and the enrichment level.",
    example: {
      kind: "tier-ladder",
      productId: "MPC-100001", // Almarai milk — has full 4-tier ladder
    },
  },
  {
    id: "S2",
    title: "ROI Override",
    resolves: ["P2"],
    blurb: "Expected return refines the tier per product. A high-value brand at a Lite vendor gets promoted. A long-tail SKU at an Enterprise vendor stays cheap.",
    example: {
      kind: "roi-override",
      cases: [
        { brand: "Coca-Cola", vendor: "Small shop (Lite)", outcome: "→ promoted to Pro", reason: "Top-seller. Worth the investment." },
        { brand: "Niche import", vendor: "Carrefour (Enterprise)", outcome: "→ stays at Lite", reason: "10 views/mo. Not worth premium model." },
      ],
    },
  },
  {
    id: "S3",
    title: "Guidelines & Acceptance Criteria",
    resolves: ["P3", "P4"],
    blurb: "Define what good content looks like per category before generation runs. Dairy must include fat % and processing type. Electronics must include voltage. Both model and QA have a concrete bar.",
    example: {
      kind: "guidelines",
      category: "Dairy > Fresh Milk",
      rules: ["Brand first", "Include fat %", "Include processing (UHT / Pasteurized)", "Unit spelled or 'L'/'mL'"],
      sampleRaw: "almarai full fat milk 1L",
      sampleGood: "Almarai Full Fat Fresh Milk 1 Litre — UHT Long Life",
    },
  },
  {
    id: "S4",
    title: "Model Store & Selection Agent",
    resolves: ["P4", "P10"],
    blurb: "Continuously benchmarks every available model across 5 content tasks. The Selection Agent picks the most cost-effective one that clears the quality bar — per task, per tier. New model? Auto-benchmarked, auto-rotated. No project required.",
    example: {
      kind: "model-store",
      tasks: ["Title Generation", "Attribute Extraction", "Category Prediction", "Variant Grouping", "Image Analysis"],
    },
  },
  {
    id: "S5",
    title: "Continuous QA — 3 Layers",
    resolves: ["P3", "P5", "P6"],
    blurb: "Inline QA validates every generation before publishing. Monitoring QA scans production output and correction signals continuously. Herogen auto-fixes low-risk recurring issues; high-risk ones get escalated with a diagnosis. Months → days.",
    example: {
      kind: "qa-layers",
      layers: [
        { name: "Inline QA", does: "Validate against acceptance criteria before publish", outcome: "Pass = auto-publish | Fail = agent review" },
        { name: "Monitoring QA", does: "Scan production output, corrections, downstream metrics", outcome: "Detect patterns, regressions, drift" },
        { name: "Herogen", does: "Auto-fix low-risk patterns; diagnose & escalate high-risk", outcome: "Detection → resolution in days" },
      ],
    },
  },
  {
    id: "S6",
    title: "Close the Category Feedback Loop",
    resolves: ["P7", "P8"],
    blurb: "Every human category override is captured as a structured correction signal and queued for validation. No new human work — agents are already doing the overrides.",
    example: {
      kind: "feedback-loop",
      product: "Galaxy Chocolate Bar 90g",
      override: "Snacks > Biscuits & Cookies  →  Snacks > Chocolate Bars",
      flow: ["Agent corrects", "Signal queued", "Validation gate", "Golden dataset updated"],
    },
  },
  {
    id: "S7",
    title: "Multi-Agent Validation Gate",
    resolves: ["P7", "P9"],
    blurb: "Before any correction enters the golden dataset, three independent AI agents vote.",
    example: {
      kind: "validation-gate",
      agents: [
        { name: "Category Expert LLM", q: "Is this category plausible given the title and image?" },
        { name: "Embedding Consistency", q: "Is the product embedding closer to the proposed category than the original?" },
        { name: "Cross-Reference", q: "Do similar products in other regions confirm this category?" },
      ],
      verdicts: [
        { vote: "3/3", outcome: "Auto-add to golden dataset" },
        { vote: "2/3", outcome: "Queue for expert review" },
        { vote: "0–1/3", outcome: "Reject (likely human error)" },
      ],
      impact: "~60% auto-validated · ~1,400 new examples/week · +8–12% accuracy in 3 months",
    },
  },
  {
    id: "S8",
    title: "Production Accuracy Monitoring",
    resolves: ["P5", "P10"],
    blurb: "Per-region, per-category-depth accuracy tracked live. Drift detection alerts on degradation. Signal feeds back into Model Store selection.",
    example: { kind: "monitoring" },
  },
  {
    id: "S9",
    title: "Cold-Start Attribute Onboarding",
    resolves: [],
    proof: true,
    blurb: "Adding a brand-new attribute (e.g. Calories, Skin Type) with zero labeled data. Proves the closed loop handles the hardest case.",
    example: {
      kind: "cold-start",
      steps: [
        { name: "Define", does: "Attribute definition, type, sources" },
        { name: "Seed", does: "Few-shot from existing catalog" },
        { name: "Assess", does: "Bootstrap accuracy + active learning" },
        { name: "Improve", does: "Every correction trains the next batch" },
        { name: "Go Live", does: "Enterprise-first; expand as accuracy grows" },
      ],
    },
  },
];

// Pull a few specific products from the dataset to reference inline.
const EXAMPLE_PRODUCTS = {
  almaraiMilk: {
    id: "MPC-100001",
    brand: "Almarai", platform: "Talabat (EN)",
    raw: "almarai full fat milk 1L",
    problems: ["no capitalization", "no product type descriptor"],
    tiers: {
      lite:       "Almarai Full Fat Milk 1L",
      pro:        "Almarai Full Fat Milk 1L — Fresh Dairy",
      plus:       "Almarai Full Fat Fresh Milk 1L — UHT Long Life",
      enterprise: "Almarai Full Fat Fresh Cow's Milk 1 Litre — UHT Long Life, No Preservatives",
    },
  },
  pepsi: {
    id: "MPC-100002",
    brand: "Pepsi", platform: "Talabat (EN)",
    raw: "PEPSI CAN 330 ML",
    problems: ["ALL CAPS", "space in unit", "missing variant"],
    tiers: {
      lite: "Pepsi Can 330mL",
      pro: "Pepsi Regular Carbonated Drink Can 330mL",
      plus: "Pepsi Regular Carbonated Soft Drink Can 330mL",
      enterprise: "Pepsi Regular Carbonated Soft Drink Can 330mL — Caffeine, No Sugar-Free",
    },
  },
  tide: {
    id: "MPC-100003",
    brand: "Tide", platform: "Talabat (EN)",
    raw: "tide liquid 3l orignal",
    problems: ["no caps", "typo: orignal", "missing product type"],
    tiers: {
      lite: "Tide Liquid 3L Original",
      pro: "Tide Original Liquid Detergent 3L",
      plus: "Tide Original Liquid Laundry Detergent 3L",
      enterprise: "Tide Original Liquid Laundry Detergent 3L — Concentrated Formula",
    },
  },
  cocaPY: {
    id: "MPC-500001",
    brand: "Coca-Cola", platform: "PedidosYa (ES)",
    raw: "coca cola lata 354ml",
    problems: ["no caps", "brand not hyphenated", "missing variant"],
    tiers: {
      lite: "Coca Cola Lata 354mL",
      pro: "Gaseosa Coca-Cola Regular Lata 354mL",
      plus: "Gaseosa Coca-Cola Regular Sabor Original Lata 354mL",
      enterprise: "Gaseosa Coca-Cola Regular Sabor Original Lata 354mL — Con Cafeína",
    },
  },
  pinarMilk: {
    id: "MPC-600002",
    brand: "Pinar", platform: "Yemeksepeti (TR)",
    raw: "pinar tam yagli sut 1l",
    problems: ["no caps", "unit not standardized"],
    tiers: {
      lite: "Pinar Tam Yagli Sut 1L",
      pro: "Pinar Tam Yagli Gunluk Sut 1L",
      plus: "Pinar Tam Yagli Gunluk Pastorize Sut 1L",
      enterprise: "Pinar Tam Yagli Gunluk Pastorize İnek Sütü 1L — Buzdolabında Saklayın",
    },
  },
  galaxy: {
    id: "MPC-300001",
    brand: "Galaxy", platform: "Talabat (EN)",
    raw: "galaxy smooth milk choclate bar 90g",
    predicted: "Snacks > Biscuits & Cookies",
    correct: "Snacks > Chocolate Bars",
    confidence: 0.58,
    reason: "AutoML text-only can't tell chocolate bars from biscuits without image signal.",
  },
  voltaren: {
    id: "MPC-700004",
    brand: "Voltaren", platform: "Talabat (EN)",
    raw: "voltaren emulgel 100g anti inflammatory",
    predicted: "Personal Care > Body Lotion",
    correct: "Health & Pharmacy > Topical Pain Relief",
    confidence: 0.44,
    reason: "Gel format confuses the model. Topical Pain Relief has zero ground truth examples.",
  },
  nescafe: {
    id: "MPC-700003",
    brand: "Nescafé", platform: "Talabat (EN)",
    raw: "nescafe dolce gusto cappuccino 16 caps",
    predicted: "Beverages > Instant Coffee",
    correct: "Hot Beverages > Coffee Capsules",
    confidence: 0.62,
    reason: "Model sees 'Nescafé' and defaults to instant coffee.",
  },
};

const CAST = [
  {
    role: "App Customers",
    count: "Millions",
    sketch: "phone",
    pain: 'Sees "Almarai Milk" with no fat %, no size variant, no clear category. Picks the wrong product or leaves.',
  },
  {
    role: "Content Agents",
    count: "Hundreds (internal ops)",
    sketch: "desk",
    pain: "Spends most of the day fixing the same AI mistakes. Same overrides. Same typos. No feedback to the model.",
  },
  {
    role: "Vendors",
    count: "From 1 store → 1,000s",
    sketch: "store",
    pain: 'Submits "tide liquid 3l orignal" via spreadsheet. Strategic partners expect retail-grade listings; small shops just upload what they have.',
  },
];

Object.assign(window, { PROBLEMS, SOLUTIONS, EXAMPLE_PRODUCTS, CAST });
