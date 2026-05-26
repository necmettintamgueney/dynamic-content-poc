// Step renderers for the Dynamic Content Strategy walkthrough.
// Each step is a React component receiving { ctx } where ctx exposes:
//   { introduced: Set, resolved: Set, goTo: (idx) => void, stepIdx: number }

const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM, useCallback: useCb } = React;

// ============================================================
// 0. COVER
// ============================================================

function StepCover({ ctx }) {
  return (
    <div style={{ minHeight: "72vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 980, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <DHLogo size={36} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", lineHeight: 1 }}>Delivery Hero</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>Q-Commerce · Content Intelligence</div>
          </div>
        </div>

        <Eyebrow tone="red" style={{ marginBottom: 14 }}>Executive walkthrough</Eyebrow>
        <h1 style={{
          margin: 0, fontFamily: "var(--font)", fontWeight: 800,
          fontSize: "clamp(48px, 7vw, 84px)", lineHeight: 1.02,
          letterSpacing: "-0.035em", color: "var(--ink)", textWrap: "balance"
        }}>
          Dynamic Content<br />
          <span style={{ color: "var(--dh-red)" }}>Strategy</span>
        </h1>

        <p style={{
          marginTop: 20, fontSize: 22, lineHeight: 1.4, color: "var(--ink-soft)",
          maxWidth: 720, fontWeight: 400, textWrap: "pretty"
        }}>Siloed AI solutions. Ten problems. One closed-loop architecture that fixes them all — applied to every content intelligence task we run.

        </p>

        {/* Three chapter cards */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
          { kicker: "Part 1", tone: "red", title: "10 problems", sub: "Across content enrichment and category prediction.", color: "var(--dh-red)" },
          { kicker: "Pivot", tone: "amber", title: "One shape", sub: "All ten share the same root cause.", color: "var(--amber)" },
          { kicker: "Part 2", tone: "green", title: "Closed loop", sub: "Every problem resolved on screen.", color: "var(--green-2)" }].
          map((c, i) =>
          <Card key={i} accent={c.color} padded={false} style={{ padding: 22 }}>
              <Eyebrow tone={c.tone} style={{ marginBottom: 10 }}>{c.kicker}</Eyebrow>
              <div style={{ fontWeight: 700, fontSize: 24, color: "var(--ink)", letterSpacing: "-0.01em" }}>{c.title}</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "var(--ink-mute)", lineHeight: 1.45 }}>{c.sub}</div>
            </Card>
          )}
        </div>

        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, color: "var(--ink-mute)", fontSize: 14 }}>
          Use <Kbd>→</Kbd> <Kbd>←</Kbd> or the controls below to walk through. <span style={{ opacity: 0.6 }}>·</span> {STEPS_TOTAL_PLACEHOLDER}
        </div>
      </div>
    </div>);

}

// Placeholder gets replaced at render time from app context.
const STEPS_TOTAL_PLACEHOLDER = "26 steps · ~6 minutes presented";

// ============================================================
// 1. TWO SYSTEMS
// ============================================================

function StepTwoSystems({ ctx }) {
  const [demo1, setDemo1] = useS(0);
  const [demo2, setDemo2] = useS(0);

  const enrichExamples = [
  { raw: "tide liquid 3l orignal", enriched: "Tide Original Liquid Laundry Detergent 3L" },
  { raw: "PEPSI CAN 330 ML", enriched: "Pepsi Regular Carbonated Soft Drink Can 330mL" },
  { raw: "nutella hazelnut spred 350g", enriched: "Nutella Hazelnut Chocolate Spread Jar 350g" }];

  const catExamples = [
  { product: "Galaxy Chocolate Bar 90g", correct: "Food › Snacks › Chocolate Bars" },
  { product: "Voltaren Emulgel 100g", correct: "Health › Pain Relief › Topical" },
  { product: "Nescafé Dolce Gusto 16ct", correct: "Hot Beverages › Coffee Capsules" }];


  useE(() => {
    const a = setInterval(() => setDemo1((x) => (x + 1) % enrichExamples.length), 4200);
    const b = setInterval(() => setDemo2((x) => (x + 1) % catExamples.length), 4200);
    return () => {clearInterval(a);clearInterval(b);};
  }, []);

  return (
    <StepFrame kicker="The setup" title="Two AI systems. Same broken pattern."
    lede={<>Both systems turn messy input into something the customer sees in the app. Both are <strong style={{ color: "var(--dh-red)", fontWeight: 600 }}>open-loop today</strong> — corrections never come back, models are unmanaged, quality is unmonitored.</>}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card padded style={{ minHeight: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Tag tone="red">System 1</Tag>
            <Eyebrow>Content Enrichment</Eyebrow>
          </div>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 10, color: "var(--ink)" }}>From messy input to clean listings</div>
          <div style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 18 }}>Titles · attributes (size, fat %, flavor) · variant grouping · image analysis</div>

          <div key={demo1} className="fade-up" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
            <div className="eyebrow" style={{ color: "var(--dh-red)", marginBottom: 6 }}>Vendor submitted</div>
            <div className="mono" style={{ fontSize: 14, color: "var(--ink)" }}>"{enrichExamples[demo1].raw}"</div>
            <div style={{ height: 16 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowDown size={16} color="var(--ink-faint)" />
              <div className="eyebrow" style={{ color: "var(--green-2)" }}>Enriched</div>
            </div>
            <div className="mono" style={{ fontSize: 14, marginTop: 8, color: "var(--ink)" }}>"{enrichExamples[demo1].enriched}"</div>
          </div>
        </Card>

        <Card padded style={{ minHeight: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Tag tone="red">System 2</Tag>
            <Eyebrow>Category Prediction</Eyebrow>
          </div>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 10, color: "var(--ink)" }}>Title + image → taxonomy</div>
          <div style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 18 }}>L1 → L2 → L3 taxonomy · platform teams review · agents override</div>

          <div key={demo2} className="fade-up" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Product</div>
            <div className="mono" style={{ fontSize: 14, color: "var(--ink)" }}>{catExamples[demo2].product}</div>
            <div style={{ height: 16 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowDown size={16} color="var(--ink-faint)" />
              <div className="eyebrow" style={{ color: "var(--green-2)" }}>Predicts</div>
            </div>
            <div className="mono" style={{ fontSize: 14, marginTop: 8, color: "var(--ink)" }}>{catExamples[demo2].correct}</div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 28, padding: 22, background: "var(--surface-2)", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-lg)" }}>
        <Eyebrow tone="amber" style={{ marginBottom: 8 }}>The thesis</Eyebrow>
        <div style={{ fontSize: 20, color: "var(--ink)", fontWeight: 500, letterSpacing: "-0.01em", maxWidth: 800 }}>
          Both systems break in the same shape. Both get fixed by the same architecture.
        </div>
      </div>
    </StepFrame>);

}

// ============================================================
// 2. CAST
// ============================================================

function StepCast({ ctx }) {
  return (
    <StepFrame kicker="Who feels it" title="Three groups. Every day. Different pain."
    lede="Every problem in the next ten pages hurts at least one of these groups — and most hurt all three.">

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {CAST.map((c) =>
        <Card key={c.id} padded style={{ minHeight: 260 }}>
            <div style={{ marginBottom: 16, height: 56 }}>
              <CastGlyph kind={c.icon} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.015em" }}>{c.role}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>{c.count}</div>
            <div style={{ marginTop: 14, fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5 }}>{c.snippet}</div>
          </Card>
        )}
      </div>
    </StepFrame>);

}

// ============================================================
// 3-12. PROBLEM STEPS
// ============================================================

function StepProblem({ ctx, problem }) {
  const systemLabel = problem.system === "enrichment" ? "Content Enrichment" :
  problem.system === "category" ? "Category Prediction" :
  "Both systems";
  return (
    <StepFrame
      kicker={<>Problem <span style={{ color: "var(--ink)", fontWeight: 700 }}>{problem.num} of 10</span> · {systemLabel}</>}
      eyebrowTone="red"
      title={problem.title}
      lede={problem.headline}>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)", gap: 32, alignItems: "start" }}>
        {/* LEFT: text + metric */}
        <div>
          {problem.metric &&
          <Card padded style={{ marginBottom: 22, borderColor: "var(--red-edge)", background: "var(--red-tint)" }}>
              <Eyebrow tone="red" style={{ marginBottom: 4 }}>Today</Eyebrow>
              <Stat value={problem.metric.value} label={problem.metric.label} tone="red" size="xl" />
            </Card>
          }
          <div style={{ fontSize: 17, lineHeight: 1.55, color: "var(--ink-soft)", marginBottom: 22 }}>
            {problem.blurb}
          </div>
          <Eyebrow tone="red" style={{ marginBottom: 10 }}>Who it hurts</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {problem.hurts.map((h, i) =>
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                <XIcon size={16} />
                <span>{h}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: concrete demo */}
        <div>
          <ProblemDemo problem={problem} />
        </div>
      </div>
    </StepFrame>);

}

function ProblemDemo({ problem }) {
  switch (problem.id) {
    case "P1":return <DemoTierMismatch />;
    case "P2":return <DemoUniformInvestment />;
    case "P3":return <DemoCorrectionLoop />;
    case "P4":return <DemoEvalTimeline />;
    case "P5":return <DemoBlindPipeline />;
    case "P6":return <DemoBacklog />;
    case "P7":return <DemoStaticFile />;
    case "P8":return <DemoCategoryExplorer />;
    case "P9":return <DemoGroundTruth />;
    case "P10":return <DemoEnvVar />;
    default:return null;
  }
}

// ---- P1 Tier mismatch ----
function DemoTierMismatch() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Today · same approach, regardless of value</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
        { vendor: "Al-Maha Mini Market", count: "~50 products", chip: "Small local shop", tone: "neutral" },
        { vendor: "Carrefour Hypermarket", count: "~10,000 products", chip: "Strategic partner", tone: "amber" }].
        map((v, i) =>
        <div key={i} style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)" }}>
            <Tag tone={v.tone}>{v.chip}</Tag>
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 10 }}>{v.vendor}</div>
            <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 2 }}>{v.count}</div>
            <div className="mono" style={{ marginTop: 12, padding: "6px 8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, color: "var(--ink-soft)" }}>
              "Almarai Milk"
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--dh-red)", fontWeight: 600 }}>Same model · same QA · same cost</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-mute)", lineHeight: 1.55, fontStyle: "italic" }}>
        Effort spent on options that were never viable for the small shop — and premium not delivered to the partner who expects it.
      </div>
    </Card>);

}

// ---- P2 Uniform investment ----
function DemoUniformInvestment() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Same product · same cost · 10,000× the value gap</Eyebrow>
      <div className="mono" style={{ background: "var(--surface-2)", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 18, border: "1px solid var(--border)" }}>
        "Coca-Cola Zero Sugar 330mL"
      </div>
      {[
      { views: "10 views / month", desc: "Long-tail SKU at a local shop", cost: "$0.003" },
      { views: "100,000 views / month", desc: "Top-seller at a strategic partner", cost: "$0.003" }].
      map((row, i) =>
      <div key={i} style={{
        display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 16,
        padding: "16px 0", borderTop: "1px solid var(--border)"
      }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{row.views}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-mute)", marginTop: 2 }}>{row.desc}</div>
          </div>
          <Tag tone="red" mono>{row.cost}</Tag>
        </div>
      )}
      <div style={{ marginTop: 14, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.55 }}>
        No ROI signal in the pipeline. Top-sellers can't get premium treatment; long-tail SKUs can't be cheaper.
      </div>
    </Card>);

}

// ---- P3 Correction loop ----
function DemoCorrectionLoop() {
  const [step, setStep] = useS(0);
  useE(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2400);
    return () => clearInterval(t);
  }, []);
  const rows = [
  { label: "Vendor submits", tone: "neutral", text: "tide liquid 3l orignal" },
  { label: "AI generates", tone: "red", text: "Tide liquid 3L original" },
  { label: "Agent corrects to", tone: "green", text: "Tide Original Liquid Laundry Detergent 3L" }];

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>What an agent sees, all day</Eyebrow>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => {
          const active = i === step;
          const toneCol = r.tone === "red" ? "var(--dh-red)" : r.tone === "green" ? "var(--green-2)" : "var(--ink-mute)";
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "140px 1fr", gap: 14, alignItems: "center",
              padding: 12,
              background: active ? r.tone === "red" ? "var(--red-tint)" : r.tone === "green" ? "var(--green-tint)" : "var(--surface-2)" : "var(--surface)",
              border: "1px solid var(--border)", borderRadius: "var(--radius)",
              transition: "background 280ms ease, border-color 280ms ease"
            }}>
              <div className="eyebrow" style={{ color: toneCol }}>{r.label}</div>
              <div className="mono" style={{ fontSize: 13.5, color: "var(--ink)" }}>"{r.text}"</div>
            </div>);

        })}
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: "var(--radius)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Dot tone="red" pulse />
          <span className="eyebrow" style={{ color: "var(--dh-red)" }}>The same pattern, every day</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          "Add 1 Piece" alone accounts for 19–34% of all corrections. The model never sees them. Agents keep typing the same fix.
        </div>
      </div>
    </Card>);

}

// ---- P4 Eval timeline ----
function DemoEvalTimeline() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Market velocity vs. our cadence</Eyebrow>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-2)" }}>New models released · last 6 months</div>
          <Tag tone="green" mono>~28</Tag>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 28 }).map((_, i) =>
          <div key={i} style={{ flex: "0 0 auto", width: 12, height: 28, background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 2 }} />
          )}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dh-red)" }}>Our eval cycles · same period</div>
          <Tag tone="red" mono>2</Tag>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 2 }).map((_, i) =>
          <div key={i} style={{ width: 12 * 14 + 13 * 3, height: 28, background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: 2 }} />
          )}
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.55 }}>
        Each evaluation is a development project. Meanwhile better and cheaper models ship every week.
      </div>
    </Card>);

}

// ---- P5 Blind pipeline ----
function DemoBlindPipeline() {
  // Pipeline today: vendor upload → models generate → agents review/edit → app customers see.
  // Regressions creep in at the generation step, leak past agent review, and erode the customer
  // experience (MAU / repeat purchase) — never returns, since we're not a fashion platform.
  const rows = [
  { when: "Day 0", tone: "red", text: "Model update ships. Generated titles & taxonomy. Vendor uploads now produce worse content." },
  { when: "Week 1", tone: "red", text: "Agent review catches the obvious ones, but is calibrated for fluency, not accuracy. Subtle errors leak into the app." },
  { when: "Week 2", tone: "amber", text: "No alert — there is no live quality signal to fire one." },
  { when: "Week 3", tone: "amber", text: "Agents flag a rising correction queue. Engineering opens an investigation from the human complaint." },
  { when: "Week 4+", tone: "neutral", text: "Regression confirmed by hand. Fix is prioritized. Backlog reshuffled." }];

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>How a regression is "detected"</Eyebrow>

      {/* Pipeline strip — shows where the regression enters and why it goes unnoticed */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
        gap: 6, alignItems: "stretch", marginBottom: 8
      }}>
        {[
        { label: "Vendor upload", sub: "raw titles", tone: "neutral" },
        { label: "AI generation", sub: "title + taxonomy", tone: "red", marker: true },
        { label: "Agent review", sub: "edit / approve", tone: "amber" },
        { label: "Customer in app", sub: "shopping", tone: "neutral" }].
        map((s, i, arr) =>
        <React.Fragment key={i}>
            <div style={{
            padding: "10px 8px", textAlign: "center",
            background: s.marker ? "var(--red-tint)" : "var(--surface-2)",
            border: `1px solid ${s.marker ? "var(--red-edge)" : "var(--border)"}`,
            borderRadius: 8, minWidth: 0
          }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: s.marker ? "var(--dh-red)" : "var(--ink)" }}>{s.label}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-mute)", marginTop: 2 }}>{s.sub}</div>
            </div>
            {i < arr.length - 1 &&
          <div style={{ display: "flex", alignItems: "center" }}>
                <ArrowRight size={14} color="var(--ink-faint)" />
              </div>
          }
          </React.Fragment>
        )}
      </div>

      {/* Caption pointing to the AI generation cell */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
        gap: 6, marginBottom: 18
      }}>
        <div />
        <div />
        <div style={{ textAlign: "center" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" style={{ display: "block", margin: "0 auto" }} aria-hidden="true">
            <path d="M9 14 L9 4 M4 9 L9 4 L14 9" stroke="var(--dh-red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div style={{
            marginTop: 4, display: "inline-block",
            padding: "2px 8px", background: "var(--dh-red)", color: "#fff",
            fontSize: 10, fontWeight: 700, borderRadius: 999, letterSpacing: 0.04,
            whiteSpace: "nowrap"
          }}>
            REGRESSION ENTERS HERE
          </div>
        </div>
        <div /><div /><div /><div />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) =>
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "70px 1fr", gap: 14, alignItems: "flex-start",
          padding: "12px 0",
          borderTop: i === 0 ? "1px solid var(--border)" : "1px solid var(--border)"
        }}>
            <Tag tone={r.tone} mono style={{ alignSelf: "flex-start" }}>{r.when}</Tag>
            <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.5 }}>{r.text}</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.55 }}>
        Detection lag isn't a model problem — it's a missing production signal. The cost is paid in monthly active users who shop somewhere else next week.
      </div>
    </Card>);

}

// ---- P6 Backlog ----
function DemoBacklog() {
  const tickets = [
  { id: "ENR-118", name: "Add '1 Piece' normalization rule", age: "8 mo", pri: "P3", coverage: "19–34%" },
  { id: "ENR-204", name: "Unit-spacing cleanup (330 ML → 330mL)", age: "5 mo", pri: "P3", coverage: "~12%" },
  { id: "ENR-247", name: "ALL CAPS auto-normalize", age: "3 mo", pri: "P4", coverage: "~6%" },
  { id: "ENR-302", name: "Brand-name canonicalization", age: "2 mo", pri: "P4", coverage: "~6%" }];

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>The "small recurring fix" backlog</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 60px 70px 80px", gap: 12, alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">ID</div>
        <div className="eyebrow">Ticket</div>
        <div className="eyebrow">Pri</div>
        <div className="eyebrow">Age</div>
        <div className="eyebrow">Covers</div>
      </div>
      {tickets.map((t, i) =>
      <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr 60px 70px 80px", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>{t.id}</div>
          <div style={{ fontSize: 14, color: "var(--ink)" }}>{t.name}</div>
          <Tag tone="amber" mono style={{ justifySelf: "start" }}>{t.pri}</Tag>
          <div className="mono" style={{ fontSize: 12, color: "var(--dh-red)", fontWeight: 600 }}>{t.age}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-mute)" }}>{t.coverage}</div>
        </div>
      )}
      <div style={{ marginTop: 14, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic" }}>
        Coverage column shows the share of corrections each rule would eliminate. None ship.
      </div>
    </Card>);

}

// ---- P7 Static golden dataset ----
function DemoStaticFile() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Adding a new category today</Eyebrow>
      <ol style={{ paddingLeft: 18, margin: "0 0 18px", color: "var(--ink-soft)", lineHeight: 1.7, fontSize: 14.5 }}>
        <li>One engineer opens a Jupyter notebook.</li>
        <li>Edits a JSON file in cloud storage.</li>
        <li>Manually curates golden examples.</li>
        <li>Hopes nothing else broke.</li>
      </ol>
      <div className="mono" style={{
        background: "var(--ink)", color: "#E2E8F0",
        padding: 16, fontSize: 12.5, lineHeight: 1.7, borderRadius: "var(--radius)"
      }}>
        <div style={{ color: "#94A3B8" }}># golden_dataset.json</div>
        <div><span style={{ color: "#86EFAC" }}>"Fresh Milk"</span>: <span style={{ color: "#9BA0AB" }}>[12 examples]</span></div>
        <div><span style={{ color: "#86EFAC" }}>"Carbonated Drinks"</span>: <span style={{ color: "#9BA0AB" }}>[8 examples]</span></div>
        <div><span style={{ color: "#FCA5A5" }}>"Coffee Capsules"</span>: <span style={{ color: "#FCA5A5" }}>[0 examples]</span>  <span style={{ color: "#94A3B8" }}>// new</span></div>
        <div style={{ color: "#9BA0AB" }}>... 44 categories with zero examples</div>
      </div>
    </Card>);

}

// ---- P8 Category explorer (INTERACTIVE) ----
function DemoCategoryExplorer() {
  const wrong = PREDICTIONS.filter((p) => !p.correct);
  const correct = PREDICTIONS.filter((p) => p.correct);
  const [selectedId, setSelectedId] = useS(wrong[0].id);
  const all = [...wrong, ...correct];
  const sel = all.find((p) => p.id === selectedId);

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Explore real predictions · pick one</Eyebrow>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {all.map((p) => {
          const active = p.id === selectedId;
          const tone = p.correct ? "green" : "red";
          const bg = active ? p.correct ? "var(--green-tint)" : "var(--red-tint)" : "var(--surface)";
          const bd = active ? p.correct ? "var(--green-edge)" : "var(--red-edge)" : "var(--border)";
          const fg = active ? p.correct ? "var(--green-2)" : "var(--dh-red)" : "var(--ink-soft)";
          return (
            <button key={p.id} onClick={() => setSelectedId(p.id)} style={{
              padding: "7px 12px",
              border: `1px solid ${bd}`, background: bg, color: fg,
              fontFamily: "var(--font)", fontWeight: active ? 600 : 500, fontSize: 12.5,
              borderRadius: 999, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "all 120ms ease"
            }}>
              <Dot tone={tone} size={6} />
              {p.product.split(" ").slice(0, 3).join(" ")}
            </button>);

        })}
      </div>

      <div key={sel.id} className="fade-up" style={{
        padding: 18, background: sel.correct ? "var(--green-tint)" : "var(--red-tint)",
        border: `1px solid ${sel.correct ? "var(--green-edge)" : "var(--red-edge)"}`,
        borderRadius: "var(--radius)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {sel.correct ? <CheckIcon size={20} /> : <XIcon size={20} />}
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{sel.product}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 14, alignItems: "center", marginBottom: 12 }}>
          <div className="eyebrow">Model predicted</div>
          <div className="mono" style={{ fontSize: 13, color: sel.correct ? "var(--green-2)" : "var(--dh-red)" }}>{sel.predicted}</div>
          {!sel.correct &&
          <React.Fragment>
              <div className="eyebrow" style={{ color: "var(--green-2)" }}>Truth</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--green-2)" }}>{sel.truth}</div>
            </React.Fragment>
          }
          <div className="eyebrow">Confidence</div>
          <div className="mono" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <ConfBar value={sel.confidence} />
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${sel.correct ? "var(--green-edge)" : "var(--red-edge)"}`, paddingTop: 12, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
          <strong style={{ color: "var(--ink)" }}>Why:</strong> {sel.why}
        </div>
        {sel.fix &&
        <div style={{ marginTop: 10, padding: 10, background: "var(--surface)", border: "1px dashed var(--border-strong)", borderRadius: 8, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--ink-mute)" }}>How the closed loop would fix it:</strong> {sel.fix}
          </div>
        }
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <Tag tone="red" mono>~2,400 / wk</Tag>
        <div style={{ fontSize: 13, color: "var(--ink-mute)" }}>agent overrides happen weekly · zero feed back to the model</div>
      </div>
    </Card>);

}

function ConfBar({ value }) {
  const pct = Math.round(value * 100);
  const tone = pct >= 80 ? "green" : pct >= 60 ? "amber" : "red";
  const color = tone === "green" ? "var(--green)" : tone === "amber" ? "var(--amber)" : "var(--dh-red)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 80, height: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, overflow: "hidden", display: "inline-block" }}>
        <span style={{ display: "block", height: "100%", width: `${pct}%`, background: color, transition: "width 320ms ease" }} />
      </span>
      <span style={{ color, fontWeight: 600 }}>{pct}%</span>
    </span>);

}

// ---- P9 Ground truth ----
function DemoGroundTruth() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>"Ground truth" is a circular argument</Eyebrow>
      <div style={{ background: "var(--surface-2)", padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>Q:</strong> Is the prediction correct?<br />
          <strong style={{ color: "var(--ink)" }}>A:</strong> It's correct <em>if GPT-4o agrees with the data we already have</em>.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card padded style={{ background: "var(--red-tint)", borderColor: "var(--red-edge)" }}>
          <Stat value="63.2%" label="GPT-4o ↔ data agreement" tone="red" size="lg" />
        </Card>
        <Card padded style={{ background: "var(--red-tint)", borderColor: "var(--red-edge)" }}>
          <Stat value="44" label="categories with zero examples" tone="red" size="lg" />
        </Card>
      </div>
      <div style={{ marginTop: 14, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.55 }}>
        Voltaren ends up in "Body Lotion" because Topical Pain Relief has nothing to compare against.
      </div>
    </Card>);

}

// ---- P10 Env var governance ----
function DemoEnvVar() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>How model selection actually works</Eyebrow>
      <div className="mono" style={{ background: "var(--ink)", color: "#E2E8F0", padding: 16, borderRadius: "var(--radius)", fontSize: 12.5, lineHeight: 1.8 }}>
        <div style={{ color: "#94A3B8" }}># config/talabat-uae.env</div>
        <div>CATEGORY_MODEL=<span style={{ color: "#FCA5A5" }}>automl_text_v1</span></div>
        <div style={{ marginTop: 10, color: "#94A3B8" }}># config/pedidosya-ar.env</div>
        <div>CATEGORY_MODEL=<span style={{ color: "#86EFAC" }}>embedding_v2</span></div>
        <div style={{ marginTop: 10, color: "#94A3B8" }}># config/yemeksepeti-tr.env</div>
        <div>CATEGORY_MODEL=<span style={{ color: "#FCA5A5" }}>automl_text_v1</span></div>
      </div>
      <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.55 }}>
        Two model versions coexist. Region assignment is a config commit. No A/B test, no comparison, no rollback.
      </div>
    </Card>);

}

// ============================================================
// 13. PIVOT
// ============================================================

function StepPivot({ ctx }) {
  return (
    <StepFrame
      kicker="The pivot"
      title={<>Ten problems. <span style={{ color: "var(--dh-red)" }}>One shape.</span></>}
      lede="Look across the ten cards. They aren't ten independent issues — they're the same gap (no feedback, no governance, no observability) showing up in two places.">
      
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 22 }}>
        <Card padded>
          <Eyebrow tone="green" style={{ marginBottom: 16 }}>The unifying architecture</Eyebrow>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 12, alignItems: "stretch"
          }}>
            {[
            { label: "Tier + ROI", sub: "Set the budget upfront", tone: "blue" },
            { label: "Model Store", sub: "Pick the best model per task", tone: "blue" },
            { label: "Continuous QA", sub: "Catch · fix · feed back", tone: "green" }].
            map((b, i, arr) =>
            <React.Fragment key={i}>
                <div style={{
                padding: 18, borderRadius: "var(--radius)",
                background: b.tone === "blue" ? "var(--blue-tint)" : "var(--green-tint)",
                border: `1px solid ${b.tone === "blue" ? "var(--blue-edge)" : "var(--green-edge)"}`,
                textAlign: "center"
              }}>
                  <div style={{ fontWeight: 700, fontSize: 20, color: "var(--ink)", letterSpacing: "-0.01em" }}>{b.label}</div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-mute)" }}>{b.sub}</div>
                </div>
                {i < arr.length - 1 &&
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={20} color="var(--ink-faint)" />
                  </div>
              }
              </React.Fragment>
            )}
          </div>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 15, color: "var(--ink-soft)" }}>
            Applied to <strong style={{ color: "var(--ink)" }}>both</strong> Content Enrichment <em>and</em> Category Prediction.
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
          { kicker: "Root cause #1", title: "No feedback", desc: "Corrections are applied but discarded. The model never improves on what it gets wrong." },
          { kicker: "Root cause #2", title: "No governance", desc: "Model selection is ad-hoc — env vars, gut feel, separate projects per region." },
          { kicker: "Root cause #3", title: "No observability", desc: "Quality regressions surface only when humans complain. No live signal." }].
          map((b, i) =>
          <Card key={i} padded>
              <Eyebrow tone="red" style={{ marginBottom: 8 }}>{b.kicker}</Eyebrow>
              <div style={{ fontWeight: 700, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.015em" }}>{b.title}</div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>{b.desc}</div>
            </Card>
          )}
        </div>
      </div>
    </StepFrame>);

}

// ============================================================
// 13b. OPEN QUESTION — Guideline ownership
// ============================================================

const OWNERSHIP_OPTIONS = [
{
  id: "platform",
  label: "Option A · Platform-owned",
  sub: "Talabat, PedidosYa, Yemeksepeti each own their own guidelines.",
  pros: [
  "Deep regional expertise (local brands, regulatory rules, consumer expectations)",
  "Faster iteration — no central approval queue",
  "Guidelines reflect actual market needs (halal claims in MENA, nutrition labels in LATAM)",
  "Platform teams sit close to content agents — direct feedback loop"],

  cons: [
  "Inconsistency across platforms — same product, different treatment",
  "Duplication of effort — every platform writes the same rules",
  "Quality variance — strong platforms drag weak ones",
  "New platforms start from scratch"]

},
{
  id: "central",
  label: "Option B · Centrally-owned",
  sub: "One central team defines all guidelines; platforms consume them.",
  pros: [
  "One standard, one quality bar everywhere",
  "Guidelines written once, applied everywhere",
  "Easy to enforce and audit compliance",
  "New platforms ship with a ready-made guideline set"],

  cons: [
  "No suitable central role exists today for this depth of locale work",
  "Central team lacks regional expertise (Turkish dairy phrasing, Argentine bread descriptors)",
  "Slower to update — platform needs queue behind global priorities",
  "Sacrifices regional nuance for global consistency"]

}];


function StepOpenQuestion({ ctx }) {
  const [selected, setSelected] = useS("platform");
  const opt = OWNERSHIP_OPTIONS.find((o) => o.id === selected);

  return (
    <StepFrame
      kicker="Open question · before the solutions"
      eyebrowTone="amber"
      title={<>Who writes the <span style={{ color: "var(--amber)" }}>guidelines?</span></>}
      lede="The closed-loop architecture decides everything except this. Where do the rules that define 'good content' live — in the platforms, or at the center? Tap an option to compare.">

      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {OWNERSHIP_OPTIONS.map((o) => {
          const active = o.id === selected;
          return (
            <button key={o.id} onClick={() => setSelected(o.id)}
            style={{
              padding: "10px 16px",
              fontFamily: "var(--font)", fontWeight: active ? 700 : 500, fontSize: 14,
              color: active ? "var(--ink)" : "var(--ink-mute)",
              background: active ? "var(--surface)" : "var(--surface-2)",
              border: `1px solid ${active ? "var(--border-strong)" : "var(--border)"}`,
              borderRadius: 999,
              cursor: "pointer",
              boxShadow: active ? "var(--shadow-1)" : "none",
              transition: "all 160ms ease",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              <Dot tone={active ? "amber" : "neutral"} size={8} />
              {o.label}
            </button>);

        })}
      </div>

      {/* Selected option detail */}
      <div key={opt.id} className="fade-up">
        <Card padded style={{ marginBottom: 22 }}>
          <Eyebrow tone="amber" style={{ marginBottom: 8 }}>{opt.label}</Eyebrow>
          <div style={{ fontSize: 18, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em", marginBottom: 18, lineHeight: 1.45 }}>
            {opt.sub}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <Eyebrow tone="green" style={{ marginBottom: 10 }}>Pros</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {opt.pros.map((p, i) =>
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
                    <CheckIcon size={16} />
                    <span>{p}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Eyebrow tone="red" style={{ marginBottom: 10 }}>Cons</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {opt.cons.map((c, i) =>
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                    <XIcon size={16} />
                    <span>{c}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended hybrid */}
      <Card padded accent="var(--green-2)" style={{ background: "var(--green-tint)", borderColor: "var(--green-edge)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Eyebrow tone="green">Recommended path</Eyebrow>
          <Tag tone="green">Hybrid</Tag>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.015em", marginBottom: 14 }}>
          Center owns the frame. Platforms own the substance.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--green-edge)", borderRadius: "var(--radius)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Tag tone="blue">Central</Tag>
              <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>structure & quality bar</span>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px", color: "var(--ink-soft)", fontSize: 13.5, lineHeight: 1.7 }}>
              <li>Title format framework</li>
              <li>Attribute extraction tiers</li>
              <li>QA acceptance thresholds</li>
              <li>Auto-reject rules</li>
            </ul>
          </div>
          <div style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--green-edge)", borderRadius: "var(--radius)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Tag tone="amber">Platform</Tag>
              <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>locale & domain</span>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px", color: "var(--ink-soft)", fontSize: 13.5, lineHeight: 1.7 }}>
              <li>Category-level rules (Dairy needs fat %, etc.)</li>
              <li>Translations & locale phrasing</li>
              <li>Regional product knowledge</li>
              <li>Local certifications (halal, organic)</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
          Consistency where it matters globally · expertise where it lives locally. The next solutions all assume this split.
        </div>
      </Card>
    </StepFrame>);

}

// ============================================================
// 14-22. SOLUTION STEPS
// ============================================================

function StepSolution({ ctx, solution }) {
  return (
    <StepFrame
      kicker={<>Solution <span style={{ color: "var(--ink)", fontWeight: 700 }}>{solution.num} of {SOLUTIONS.length}</span></>}
      eyebrowTone="green"
      title={solution.title}
      lede={solution.blurb}>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.3fr)", gap: 32, alignItems: "start" }}>
        {/* LEFT: resolves + impact */}
        <div>
          {solution.resolves.length > 0 &&
          <div style={{ marginBottom: 22 }}>
              <Eyebrow tone="green" style={{ marginBottom: 10 }}>Resolves</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {solution.resolves.map((pid) => {
                const p = PROBLEMS.find((x) => x.id === pid);
                return (
                  <div key={pid} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    background: "var(--green-tint)",
                    border: "1px solid var(--green-edge)",
                    borderRadius: "var(--radius)"
                  }}>
                      <CheckIcon size={18} animate />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green-2)", letterSpacing: "0.06em" }}>{pid}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{p.title}</div>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }
          {solution.proof &&
          <div style={{
            padding: 14, background: "var(--blue-tint)",
            border: "1px solid var(--blue-edge)",
            borderRadius: "var(--radius)", marginBottom: 22
          }}>
              <Eyebrow tone="blue" style={{ marginBottom: 6 }}>Proof of architecture</Eyebrow>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                Demonstrates that the closed loop handles even the hardest case — zero training data.
              </div>
            </div>
          }
          {solution.impact &&
          <div style={{
            padding: 14, background: "var(--surface-2)",
            border: "1px solid var(--border)", borderRadius: "var(--radius)"
          }}>
              <Eyebrow style={{ marginBottom: 6 }}>Projected impact</Eyebrow>
              <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>{solution.impact}</div>
            </div>
          }
        </div>

        {/* RIGHT: demo */}
        <div>
          <SolutionDemo solution={solution} />
        </div>
      </div>
    </StepFrame>);

}

function SolutionDemo({ solution }) {
  switch (solution.id) {
    case "S1":return <DemoTierLadder />;
    case "S2":return <DemoROIOverride />;
    case "S3":return <DemoGuidelines />;
    case "S4":return <DemoModelStore />;
    case "S5":return <DemoQALayers />;
    case "S6":return <DemoFeedbackLoop />;
    case "S7":return <DemoValidationGate />;
    case "S8":return <DemoMonitoring />;
    case "S9":return <DemoColdStart />;
    default:return null;
  }
}

// ---- S1 Tier ladder (INTERACTIVE — central interaction) ----
function DemoTierLadder() {
  const [tier, setTier] = useS("lite");
  const [productId, setProductId] = useS(PRODUCTS[0].id);
  const p = PRODUCTS.find((x) => x.id === productId);
  const t = TIERS.find((x) => x.id === tier);
  const enrichedTitle = p.tiers[tier];

  return (
    <Card padded>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <Eyebrow>Same product · four investment levels</Eyebrow>
        <TierToggle value={tier} onChange={setTier} compact />
      </div>

      <ProductPicker value={productId} onChange={setProductId} products={PRODUCTS.slice(0, 5)} />

      <div style={{ marginTop: 18, padding: 16, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="eyebrow" style={{ marginBottom: 6, color: "var(--dh-red)" }}>Vendor submitted</div>
        <div className="mono" style={{ fontSize: 14, color: "var(--ink)" }}>"{p.raw}"</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {p.problems.map((pr, i) =>
          <span key={i} style={{ fontSize: 11.5, color: "var(--dh-red)", fontWeight: 500 }}>✗ {pr}</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
        <ArrowDown size={20} color="var(--ink-faint)" />
      </div>

      <div style={{
        padding: 18,
        background: t.tint,
        border: `1px solid ${t.color}33`,
        borderTop: `3px solid ${t.color}`,
        borderRadius: "var(--radius)"
      }} data-comment-anchor="4c4146e663-div-822-7">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TierDot tierId={t.id} size={10} />
            <div style={{ fontWeight: 700, fontSize: 16, color: t.color }}>{t.label} tier</div>
            <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>· {t.vendor}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Tag mono>{t.model}</Tag>
            <Tag mono>{t.cost}</Tag>
          </div>
        </div>

        <div key={`${tier}-${productId}`} className="fade-up">
          <MorphTitle from={p.raw} to={enrichedTitle} mode="to" fontSize={17} weight={500} />
        </div>

        {p.attrs[tier] &&
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--border-strong)" }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Extracted attributes</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(p.attrs[tier]).map(([k, v]) =>
            <span key={k} style={{
              display: "inline-flex", gap: 6, padding: "4px 10px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 6, fontSize: 12, fontFamily: "var(--mono)"
            }}>
                  <span style={{ color: "var(--ink-mute)" }}>{k}:</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
                </span>
            )}
            </div>
          </div>
        }
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: "var(--ink-mute)", lineHeight: 1.55 }}>
        <strong style={{ color: "var(--ink-soft)" }}>Try it:</strong> toggle tier above and switch product. Every tier on every product. The dataset has all 30.
      </div>
    </Card>);

}

// ---- S2 ROI override ----
function DemoROIOverride() {
  const cases = [
  { brand: "Coca-Cola", at: "Small local shop (Lite vendor)", from: "lite", to: "pro", reason: "Top-seller. Worth the investment." },
  { brand: "Niche import sauce", at: "Carrefour (Enterprise vendor)", from: "enterprise", to: "lite", reason: "10 views/month. Premium model wasted." }];

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Tier is the floor · ROI moves things up or down</Eyebrow>
      {cases.map((c, i) => {
        const fromT = TIERS.find((x) => x.id === c.from);
        const toT = TIERS.find((x) => x.id === c.to);
        const up = TIERS.findIndex((x) => x.id === c.to) > TIERS.findIndex((x) => x.id === c.from);
        return (
          <div key={i} style={{ padding: "16px 0", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{c.brand}</div>
            <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 2 }}>at {c.at}</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Tag style={{ background: fromT.tint, borderColor: `${fromT.color}40`, color: fromT.color }}>
                <TierDot tierId={fromT.id} /> {fromT.label}
              </Tag>
              <ArrowRight size={16} color={up ? "var(--green-2)" : "var(--ink-mute)"} />
              <Tag style={{ background: toT.tint, borderColor: `${toT.color}40`, color: toT.color }}>
                <TierDot tierId={toT.id} /> {toT.label}
              </Tag>
              <span style={{ fontSize: 12.5, color: up ? "var(--green-2)" : "var(--ink-mute)", fontWeight: 600 }}>
                {up ? "promoted" : "demoted"}
              </span>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: "var(--ink-soft)", fontStyle: "italic" }}>{c.reason}</div>
          </div>);

      })}
    </Card>);

}

// ---- S3 Guidelines ----
// Hybrid model: central frame (title structure, attribute tiers, QA thresholds)
//   + platform locale (word order, variant naming, certifications)
function DemoGuidelines() {
  const [locale, setLocale] = useS("EN");
  const locales = [
  { id: "EN", label: "Talabat · EN", platform: "MENA" },
  { id: "ES", label: "PedidosYa · ES", platform: "LATAM" },
  { id: "TR", label: "Yemeksepeti · TR", platform: "Turkey" }];

  const rules = {
    EN: {
      wordOrder: { value: "Brand first", example: "Almarai Full Fat Milk 1L" },
      variant: { value: 'English variants', example: '"Zero Sugar", "Original", "Unsalted"' },
      pack: { value: "5 Pack 75g Each", example: "5x75g" }
    },
    ES: {
      wordOrder: { value: "Generic first", example: "Leche Entera Almarai 1L" },
      variant: { value: "Spanish variants", example: '"Sin Azúcar", "Original", "Sin Sal"' },
      pack: { value: "Pack 5 Unidades 75g", example: "5x75g" }
    },
    TR: {
      wordOrder: { value: "Brand first", example: "Pınar Tam Yağlı Süt 1L" },
      variant: { value: "Turkish variants", example: '"Şekersiz", "Original", "Tuzsuz"' },
      pack: { value: "5'li Paket 75g", example: "5x75g" }
    }
  };
  const sel = rules[locale];

  // Central rules — always the same
  const centralRules = [
  "Title Case",
  "Size at end of title",
  'Standard units: "L" / "mL" / "g" / "kg"',
  "Connector hyphenated (USB-C, Anti-Dandruff)"];


  // Category rules — these come from the central + category guide
  const categoryRules = [
  { cat: "Dairy (Milk)", need: "Fat % + processing (UHT/Pasteurized)" },
  { cat: "Beverages (Soft)", need: "Variant + packaging (Can/Bottle)" },
  { cat: "Detergent", need: "Form (Liquid/Powder/Gel)" },
  { cat: "Pharma", need: "Concentration + form" }];


  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>The same checklist · for the model and for QA</Eyebrow>

      {/* Central frame */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Tag tone="blue">Central</Tag>
        <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Structural rules · apply to every platform</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 18 }}>
        {centralRules.map((r, i) =>
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--blue-tint)", border: "1px solid var(--blue-edge)", borderRadius: 8, fontSize: 13 }}>
            <CheckIcon size={14} /> {r}
          </div>
        )}
      </div>

      {/* Platform locale */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tag tone="amber">Platform</Tag>
          <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Locale rules · written by the platform team</span>
        </div>
        <div style={{ display: "inline-flex", padding: 3, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 999, gap: 2 }}>
          {locales.map((l) => {
            const active = l.id === locale;
            return (
              <button key={l.id} onClick={() => setLocale(l.id)} style={{
                padding: "5px 12px", border: "none",
                background: active ? "var(--surface)" : "transparent",
                color: active ? "var(--amber)" : "var(--ink-mute)",
                fontFamily: "var(--font)", fontWeight: active ? 600 : 500, fontSize: 12,
                borderRadius: 999, cursor: "pointer",
                boxShadow: active ? "var(--shadow-1)" : "none",
                transition: "all 140ms ease"
              }}>{l.label}</button>);

          })}
        </div>
      </div>
      <div key={locale} className="fade-up" style={{ background: "var(--amber-tint)", border: "1px solid var(--amber-edge)", borderRadius: 8, padding: 14, marginBottom: 18 }}>
        {[
        { k: "Word order", v: sel.wordOrder },
        { k: "Variant naming", v: sel.variant },
        { k: "Pack format", v: sel.pack }].
        map((row, i) =>
        <div key={i} style={{
          display: "flex", flexDirection: "column", gap: 4,
          padding: "10px 0", borderTop: i === 0 ? "none" : "1px dashed var(--amber-edge)"
        }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div className="eyebrow" style={{ color: "var(--amber)", flex: "0 0 auto" }}>{row.k}</div>
              <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{row.v.value}</div>
            </div>
            <div className="mono" style={{ fontSize: 12.5, color: "var(--ink-soft)", wordBreak: "break-word" }}>"{row.v.example}"</div>
          </div>
        )}
      </div>

      {/* Category rules */}
      <Eyebrow style={{ marginBottom: 8 }}>Plus: per-category requirements</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 18 }}>
        {categoryRules.map((r, i) =>
        <div key={i} style={{ padding: 10, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{r.cat}</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: "var(--ink-mute)" }}>{r.need}</div>
          </div>
        )}
      </div>

      {/* Before / after the rules */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--dh-red)", marginBottom: 6 }}>Vendor input</div>
          <div className="mono" style={{ fontSize: 13, padding: "10px 12px", background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: 8 }}>
            almarai full fat milk 1L
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ color: "var(--green-2)", marginBottom: 6 }}>Meets the bar</div>
          <div className="mono" style={{ fontSize: 13, padding: "10px 12px", background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 8 }}>
            Almarai Full Fat UHT Milk 1L
          </div>
        </div>
      </div>
    </Card>);

}

// ---- S4 Model store ----
function DemoModelStore() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>Model Store · benchmarked continuously</Eyebrow>
      <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 16, lineHeight: 1.5 }}>
        5 tasks × N candidate models. The Selection Agent picks the cheapest model that clears each task's bar — per tier.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 6, alignItems: "stretch" }}>
        <div></div>
        {TIERS.map((t) =>
        <div key={t.id} style={{ textAlign: "center", padding: "8px 4px", background: t.tint, borderRadius: 6, border: `1px solid ${t.color}33` }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: t.color }}>{t.label}</div>
          </div>
        )}

        {MODEL_STORE_TASKS.map((row, i) =>
        <React.Fragment key={i}>
            <div style={{ padding: "10px 8px", fontSize: 13, color: "var(--ink)", fontWeight: 500, alignSelf: "center" }}>{row.task}</div>
            {["lite", "pro", "plus", "ent"].map((k) => {
            const tier = k === "ent" ? TIERS[3] : TIERS.find((t) => t.id === k);
            const val = row[k];
            const empty = val === "—";
            return (
              <div key={k} className="mono" style={{
                padding: "10px 4px", textAlign: "center", fontSize: 11.5,
                background: empty ? "var(--surface-2)" : "var(--surface)",
                border: `1px solid ${empty ? "var(--border)" : tier.color + "33"}`,
                borderRadius: 6,
                color: empty ? "var(--ink-faint)" : "var(--ink)",
                fontWeight: empty ? 400 : 500
              }}>
                  {val}
                </div>);

          })}
          </React.Fragment>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "var(--blue-tint)", border: "1px solid var(--blue-edge)", borderRadius: 8, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
        <strong style={{ color: "var(--blue-2)" }}>Continuous:</strong> New model ships next week? It's benchmarked overnight and enters the rotation. No project required.
      </div>
    </Card>);

}

// ---- S5 QA layers ----
function DemoQALayers() {
  const thresholds = [
  { tier: "lite", t: 0.60 },
  { tier: "pro", t: 0.70 },
  { tier: "plus", t: 0.80 },
  { tier: "enterprise", t: 0.90 }];

  const autoReject = [
  { rule: "Language consistency", trigger: "Untranslated foreign words" },
  { rule: "Required fields", trigger: "Category-required attributes missing" },
  { rule: "Confidence threshold", trigger: "Below tier threshold" },
  { rule: "Image-title mismatch", trigger: "Brand in title ≠ brand in image" },
  { rule: "Duplicate detection", trigger: "Same enriched title already exists" }];

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 14 }}>Three layers · always on</Eyebrow>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
        {QA_LAYERS.map((l, i) =>
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 14,
          padding: 14,
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)"
        }}>
            <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "var(--surface)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, color: "var(--ink)"
          }}>{i + 1}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)" }}>{l.name}</div>
              <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{l.does}</div>
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 999 }}>
                <Dot tone="green" size={6} />
                <span style={{ fontSize: 12, color: "var(--green-2)", fontWeight: 600 }}>{l.outcome}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confidence thresholds */}
      <Eyebrow style={{ marginBottom: 8 }}>Confidence thresholds · per tier</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 18 }}>
        {thresholds.map(({ tier, t }) => {
          const T = TIERS.find((x) => x.id === tier);
          return (
            <div key={tier} style={{
              padding: "10px 8px", background: T.tint,
              border: `1px solid ${T.color}33`, borderRadius: 8, textAlign: "center"
            }}>
              <div style={{ fontSize: 11.5, color: T.color, fontWeight: 600 }}>{T.label}</div>
              <div className="mono" style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>≥ {t.toFixed(2)}</div>
            </div>);

        })}
      </div>

      {/* Auto-reject rules */}
      <Eyebrow style={{ marginBottom: 8 }}>Auto-reject rules</Eyebrow>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {autoReject.map((r, i) =>
        <div key={i} style={{
          display: "flex", flexDirection: "column", gap: 2,
          padding: "8px 10px", borderRadius: 6,
          background: i % 2 ? "var(--surface-2)" : "transparent",
          fontSize: 12.5
        }}>
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>{r.rule}</span>
            <span style={{ color: "var(--ink-mute)" }}>{r.trigger}</span>
          </div>
        )}
      </div>
    </Card>);

}

// ---- S6 Feedback loop ----
function DemoFeedbackLoop() {
  const [step, setStep] = useS(0);
  const steps = ["Agent corrects", "Signal queued", "Validation gate", "Golden dataset updated"];
  useE(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>The signal already exists. We just stop discarding it.</Eyebrow>
      <div style={{ fontWeight: 600, fontSize: 17, color: "var(--ink)", marginTop: 6 }}>Galaxy Smooth Milk Chocolate Bar 90g</div>
      <div style={{ marginTop: 10, marginBottom: 18, padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--dh-red)", textDecoration: "line-through", textDecorationColor: "var(--dh-red)" }}>Snacks › Biscuits & Cookies</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}>
          <ArrowDown size={14} color="var(--ink-faint)" />
        </div>
        <div className="mono" style={{ fontSize: 13, color: "var(--green-2)" }}>Snacks › Chocolate Bars</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => {
          const reached = i < step;
          const isCurrent = i === step;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, alignItems: "center",
              padding: 12,
              background: reached || isCurrent ? "var(--green-tint)" : "var(--surface-2)",
              border: `1px solid ${reached || isCurrent ? "var(--green-edge)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              transition: "all 280ms ease"
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: reached ? "var(--green-2)" : isCurrent ? "var(--green)" : "var(--surface)",
                color: reached || isCurrent ? "#fff" : "var(--ink-mute)",
                border: `1.5px solid ${reached || isCurrent ? "var(--green-2)" : "var(--border-strong)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 12,
                animation: isCurrent ? "pulseDot 1.4s ease-in-out infinite" : undefined
              }}>
                {reached ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: reached || isCurrent ? 600 : 500 }}>{s}</div>
            </div>);

        })}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "var(--blue-tint)", border: "1px solid var(--blue-edge)", borderRadius: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
        <strong style={{ color: "var(--blue-2)" }}>~2,400 overrides/week</strong> · no new human work · full feedback restored
      </div>
    </Card>);

}

// ---- S7 Validation gate ----
function DemoValidationGate() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>Three agents vote before anything enters the golden dataset</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
        {VALIDATION_AGENTS.map((a, i) =>
        <div key={i} style={{ padding: 14, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <div className="eyebrow" tone="blue" style={{ marginBottom: 6 }}>Agent {i + 1}</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{a.name}</div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.5 }}>"{a.q}"</div>
          </div>
        )}
      </div>

      <div className="eyebrow" style={{ marginBottom: 8 }}>Verdict</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {VALIDATION_VERDICTS.map((v, i) =>
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "80px 1fr", gap: 14,
          padding: "10px 14px",
          background: v.tone === "green" ? "var(--green-tint)" : v.tone === "amber" ? "var(--amber-tint)" : "var(--red-tint)",
          border: `1px solid ${v.tone === "green" ? "var(--green-edge)" : v.tone === "amber" ? "var(--amber-edge)" : "var(--red-edge)"}`,
          borderRadius: 8, alignItems: "center"
        }}>
            <Tag tone={v.tone} mono>{v.vote}</Tag>
            <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{v.outcome}</div>
          </div>
        )}
      </div>
    </Card>);

}

// ---- S8 Monitoring ----
function DemoMonitoring() {
  const series = [
  { region: "Talabat", points: [82, 84, 83, 81, 79, 81], color: "var(--green)", tone: "green" },
  { region: "PedidosYa", points: [81, 80, 83, 85, 84, 85], color: "var(--green)", tone: "green" },
  { region: "Yemeksepeti", points: [74, 73, 71, 68, 65, 62], color: "var(--dh-red)", tone: "red" }];

  const max = 90;
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>Live accuracy · per region · per category depth</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        {series.map((s, i) =>
        <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{s.region}</div>
              <div className="mono" style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>
                {s.points[s.points.length - 1]}% <span style={{ color: "var(--ink-faint)" }}>(6w trend)</span>
              </div>
            </div>
            <Sparkline points={s.points} color={s.color} max={max} height={56} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Dot tone="red" pulse style={{ marginTop: 6 }} />
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
          <strong style={{ color: "var(--dh-red)" }}>Drift alert ·</strong> Yemeksepeti accuracy down 12pp over 6 weeks. Selection Agent triggered to re-pick model for this region.
        </div>
      </div>
    </Card>);

}

function Sparkline({ points, color, max = 100, height = 56, width = 360 }) {
  const w = width,h = height;
  const stepX = w / (points.length - 1);
  const scaleY = (v) => h - v / max * (h - 8) - 4;
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${scaleY(v)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: "block" }}>
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((v, i) =>
      <circle key={i} cx={i * stepX} cy={scaleY(v)} r={i === points.length - 1 ? 4 : 2.5} fill={color} />
      )}
    </svg>);

}

// ---- S9 Cold start ----
function DemoColdStart() {
  return (
    <Card padded>
      <Eyebrow style={{ marginBottom: 12 }}>Adding "Calories" — from zero labeled data</Eyebrow>
      <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 18, lineHeight: 1.55 }}>
        The same closed loop, in graduated stages. The QA loop <em>is</em> the training loop.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {COLD_START_STEPS.map((s, i) =>
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "32px 110px 1fr", gap: 14, alignItems: "center",
          padding: 12,
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)"
        }}>
            <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "var(--blue)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13
          }}>{i + 1}</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{s.name}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{s.does}</div>
          </div>
        )}
      </div>
    </Card>);

}

// ============================================================
// 23. RESOLUTION MAP
// ============================================================

function StepResolutionMap({ ctx }) {
  const probRefs = useR({});
  const solRefs = useR({});
  const wrapRef = useR(null);
  const [lines, setLines] = useS([]);
  const [hovered, setHovered] = useS(null);

  useE(() => {
    const compute = () => {
      if (!wrapRef.current) return;
      const wr = wrapRef.current.getBoundingClientRect();
      const ls = [];
      PROBLEMS.forEach((p) => {
        SOLUTIONS.filter((s) => s.resolves.includes(p.id)).forEach((s) => {
          const pe = probRefs.current[p.id];
          const se = solRefs.current[s.id];
          if (!pe || !se) return;
          const pr = pe.getBoundingClientRect();
          const sr = se.getBoundingClientRect();
          ls.push({
            x1: pr.right - wr.left,
            y1: pr.top + pr.height / 2 - wr.top,
            x2: sr.left - wr.left,
            y2: sr.top + sr.height / 2 - wr.top,
            pid: p.id, sid: s.id
          });
        });
      });
      setLines(ls);
    };
    compute();
    const t = setTimeout(compute, 80);
    const t2 = setTimeout(compute, 300);
    window.addEventListener("resize", compute);
    return () => {clearTimeout(t);clearTimeout(t2);window.removeEventListener("resize", compute);};
  }, []);

  const isActive = (l) => !hovered || hovered.kind === "p" && hovered.id === l.pid || hovered.kind === "s" && hovered.id === l.sid;

  return (
    <StepFrame
      kicker="The closing moment"
      eyebrowTone="green"
      title={<>No loose threads.</>}
      lede="Every problem on the left is resolved by at least one solution on the right. Most solutions resolve more than one problem — because the problems share a root cause.">
      
      <div ref={wrapRef} style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 240px minmax(0, 1fr)", gap: 0 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
          {lines.map((l, i) =>
          <path key={i}
          d={`M ${l.x1} ${l.y1} C ${l.x1 + 80} ${l.y1}, ${l.x2 - 80} ${l.y2}, ${l.x2} ${l.y2}`}
          stroke={isActive(l) ? "var(--green)" : "var(--border)"}
          strokeWidth={isActive(l) ? 1.6 : 1}
          fill="none"
          opacity={isActive(l) ? 0.9 : 0.3}
          style={{ transition: "all 200ms ease" }} />
          )}
        </svg>

        {/* PROBLEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
          <Eyebrow tone="red" style={{ marginBottom: 6 }}>Problems</Eyebrow>
          {PROBLEMS.map((p, i) =>
          <div key={p.id}
          ref={(el) => probRefs.current[p.id] = el}
          onMouseEnter={() => setHovered({ kind: "p", id: p.id })}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "grid", gridTemplateColumns: "24px 30px 1fr", gap: 10, alignItems: "center",
            padding: "8px 12px",
            background: "var(--green-tint)",
            border: "1px solid var(--green-edge)",
            borderRadius: "var(--radius-sm)",
            animation: `fadeUp 360ms ease-out ${i * 40}ms both`
          }}>
              <CheckIcon size={16} animate />
              <span className="mono" style={{ fontSize: 11, color: "var(--green-2)", fontWeight: 600 }}>{p.id}</span>
              <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500, position: "relative" }}>
                <ResolvedText resolved animate>{p.title}</ResolvedText>
              </span>
            </div>
          )}
        </div>

        <div style={{ zIndex: 0 }}></div>

        {/* SOLUTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
          <Eyebrow tone="green" style={{ marginBottom: 6, textAlign: "right" }}>Solutions</Eyebrow>
          {SOLUTIONS.filter((s) => s.resolves.length > 0).map((s, i) =>
          <div key={s.id}
          ref={(el) => solRefs.current[s.id] = el}
          onMouseEnter={() => setHovered({ kind: "s", id: s.id })}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "grid", gridTemplateColumns: "1fr 30px", gap: 10, alignItems: "center",
            padding: "10px 14px",
            background: "var(--surface)",
            border: "1px solid var(--green-edge)",
            borderRadius: "var(--radius-sm)",
            textAlign: "right",
            animation: `fadeUp 360ms ease-out ${i * 40}ms both`
          }}>
              <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{s.title}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--green-2)", fontWeight: 600 }}>{s.id}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 13, color: "var(--ink-mute)", textAlign: "center" }}>
        Hover a problem or solution to focus its connections.
      </div>
    </StepFrame>);

}

// ============================================================
// 24. CLOSING
// ============================================================

function StepClosing({ ctx }) {
  return (
    <div style={{ minHeight: "72vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1000, width: "100%", textAlign: "center" }}>
        <Eyebrow tone="green" style={{ marginBottom: 14, justifyContent: "center" }}>And so</Eyebrow>
        <h1 style={{
          margin: 0, fontFamily: "var(--font)", fontWeight: 800,
          fontSize: "clamp(48px, 6.5vw, 80px)", lineHeight: 1.03,
          letterSpacing: "-0.035em", color: "var(--ink)", textWrap: "balance"
        }}>
          One closed loop.<br />
          <span style={{ color: "var(--green-2)" }}>Applied to every content task.</span>
        </h1>
        <p style={{
          marginTop: 22, fontSize: 20, lineHeight: 1.5, color: "var(--ink-soft)",
          maxWidth: 760, marginLeft: "auto", marginRight: "auto"
        }}>
          One Model Store. One QA framework. One feedback signal. Whether the task is a title, an attribute, a category, or an attribute we haven't even defined yet — the architecture is the same.
        </p>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <Card padded={false} style={{ padding: "32px 28px", maxWidth: 760, width: "100%" }}>
            <ClosedLoopDiagram width={680} height={320} autoPlay />
          </Card>
        </div>

        <div style={{ marginTop: 36, fontSize: 14, color: "var(--ink-mute)" }}>
          End of walkthrough · use <Kbd>←</Kbd> to revisit any step.
        </div>
      </div>
    </div>);

}

Object.assign(window, {
  StepCover, StepTwoSystems, StepCast,
  StepProblem, StepPivot, StepOpenQuestion, StepSolution,
  StepResolutionMap, StepClosing
});