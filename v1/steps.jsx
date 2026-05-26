// All step renderers for the walkthrough. Each step gets the props {ctx}.
// ctx exposes: problemsIntroduced (Set), problemsResolved (Set), goTo(idx).

const { useState, useEffect, useRef } = React;

// ---------- Reusable bits ----------

function SectionLabel({ children, tone = "ink" }) {
  const color = tone === "red" ? "var(--red)" : tone === "green" ? "var(--green)" : "var(--ink-soft)";
  return (
    <div className="label" style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function StepTitle({ kicker, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {kicker && <SectionLabel>{kicker}</SectionLabel>}
      <h1 className="marker-bold" style={{ fontSize: 56, lineHeight: 1.05, margin: 0, color: "var(--ink)", fontWeight: 700, textWrap: "balance" }}>
        {children}
      </h1>
    </div>
  );
}

function StickyNote({ children, color = "amber", rotate = -1.5, style = {} }) {
  const bgMap = { amber: "#f5e29a", red: "#f1b8ad", green: "#c8e3b3", blue: "#bcd2ea", paper: "var(--paper-2)" };
  return (
    <div style={{
      background: bgMap[color] || bgMap.amber,
      padding: "16px 18px",
      border: "1.5px solid rgba(0,0,0,0.25)",
      boxShadow: "2px 3px 0 rgba(26,24,20,0.15)",
      transform: `rotate(${rotate}deg)`,
      fontFamily: "Kalam, sans-serif",
      ...style,
    }}>
      {children}
    </div>
  );
}

function HandArrow({ dir = "right", length = 60, style = {} }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir] || 0;
  return (
    <svg width={length} height={length} viewBox="0 0 60 60" style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <path d="M 5 30 Q 25 28, 50 30" className="arrow-svg" />
      <path d="M 42 22 L 52 30 L 42 38" className="arrow-svg" />
    </svg>
  );
}

function RawTitleCard({ raw, problems = [], style = {} }) {
  return (
    <div className="sketch-card problem" style={{ padding: "10px 14px", display: "inline-block", ...style }}>
      <div className="label" style={{ fontSize: 11, color: "var(--red)", marginBottom: 2 }}>VENDOR SUBMITTED</div>
      <div className="mono" style={{ fontSize: 16, color: "var(--ink)" }}>"{raw}"</div>
      {problems.length > 0 && (
        <div className="hand" style={{ fontSize: 13, color: "var(--red)", marginTop: 6 }}>
          {problems.map((p, i) => <div key={i}>✗ {p}</div>)}
        </div>
      )}
    </div>
  );
}

function CleanTitleCard({ title, label = "AI ENRICHED", style = {}, tone = "green" }) {
  const cls = tone === "green" ? "solved" : "";
  return (
    <div className={`sketch-card ${cls}`} style={{ padding: "10px 14px", display: "inline-block", ...style }}>
      <div className="label" style={{ fontSize: 11, color: "var(--green)", marginBottom: 2 }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, color: "var(--ink)" }}>"{title}"</div>
    </div>
  );
}

// ---------- Step 0: Cover ----------

function StepCover({ ctx }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center", padding: 40 }}>
      <div style={{ maxWidth: 880 }}>
        <SectionLabel>Executive walkthrough</SectionLabel>
        <h1 className="marker-bold" style={{ fontSize: 96, lineHeight: 1, margin: "0 0 8px", textWrap: "balance" }}>
          Dynamic Content<br/>Strategy
        </h1>
        <div className="hand" style={{ fontSize: 24, color: "var(--ink-soft)", marginTop: 18, marginBottom: 36 }}>
          Why our two AI systems keep falling short<br/>
          — and the single architecture that closes the loop.
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
          <StickyNote color="red" rotate={-3} style={{ width: 260, textAlign: "left" }}>
            <div className="label" style={{ fontSize: 12, letterSpacing: 2 }}>FIRST HALF</div>
            <div className="marker-bold" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4 }}>10 problems<br/>across 2 systems</div>
          </StickyNote>
          <StickyNote color="amber" rotate={2} style={{ width: 220, textAlign: "left" }}>
            <div className="label" style={{ fontSize: 12, letterSpacing: 2 }}>PIVOT</div>
            <div className="marker-bold" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4 }}>One shape.<br/>One fix.</div>
          </StickyNote>
          <StickyNote color="green" rotate={-2} style={{ width: 260, textAlign: "left" }}>
            <div className="label" style={{ fontSize: 12, letterSpacing: 2 }}>SECOND HALF</div>
            <div className="marker-bold" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4 }}>Every problem<br/>resolved on screen</div>
          </StickyNote>
        </div>

        <div className="hand" style={{ fontSize: 16, color: "var(--ink-faint)", marginTop: 48 }}>
          Press <span className="mono" style={{ background: "var(--paper-2)", padding: "2px 8px", borderRadius: 4 }}>→</span> or use the buttons below to walk through.
        </div>
      </div>
    </div>
  );
}

// ---------- Step 1: Two AI Systems ----------

function StepTwoSystems({ ctx }) {
  return (
    <div>
      <StepTitle kicker="The setup">Two AI systems. Same broken pattern.</StepTitle>
      <div className="hand" style={{ fontSize: 20, color: "var(--ink-soft)", marginBottom: 32, maxWidth: 760 }}>
        Both systems take messy input and produce something the customer sees in the app.
        Both are <span className="hi-red hand-bold">open-loop today</span> — corrections never come back, models are unmanaged, quality is unmonitored.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1100 }}>
        <div className="sketch-card wobble-1" style={{ padding: 24 }}>
          <SectionLabel tone="red">System 1</SectionLabel>
          <div className="marker-bold" style={{ fontSize: 32, marginBottom: 8 }}>Content Enrichment</div>
          <div className="hand" style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 16 }}>
            Takes vendor-submitted product data → clean, structured listings.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div className="mono" style={{ background: "#fbe9e6", padding: "8px 12px", border: "1.5px dashed var(--red)", borderRadius: 6, fontSize: 14 }}>
              "tide liquid 3l orignal"
            </div>
            <HandArrow length={40} />
            <div className="mono" style={{ background: "#e6f1de", padding: "8px 12px", border: "1.5px dashed var(--green)", borderRadius: 6, fontSize: 14 }}>
              "Tide Original Liquid Laundry Detergent 3L"
            </div>
          </div>
          <div className="hand" style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 14 }}>
            Titles · attributes (size, fat%, flavor) · variant grouping · image analysis
          </div>
        </div>

        <div className="sketch-card wobble-2" style={{ padding: 24 }}>
          <SectionLabel tone="red">System 2</SectionLabel>
          <div className="marker-bold" style={{ fontSize: 32, marginBottom: 8 }}>Category Prediction</div>
          <div className="hand" style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 16 }}>
            Takes title + image → predicts where it belongs in the taxonomy.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div className="mono" style={{ background: "#fbe9e6", padding: "8px 12px", border: "1.5px dashed var(--red)", borderRadius: 6, fontSize: 14 }}>
              "Galaxy Chocolate 90g"
            </div>
            <HandArrow length={40} />
            <div className="mono" style={{ background: "#e6f1de", padding: "8px 12px", border: "1.5px dashed var(--green)", borderRadius: 6, fontSize: 14 }}>
              Food &gt; Snacks &gt; Chocolate Bars
            </div>
          </div>
          <div className="hand" style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 14 }}>
            L1 → L2 → L3 taxonomy · platform teams review · agents override
          </div>
        </div>
      </div>

      <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16 }}>
        <StickyNote color="amber" rotate={-1} style={{ maxWidth: 560 }}>
          <span className="hand-bold" style={{ fontSize: 20 }}>The thesis: </span>
          <span className="hand" style={{ fontSize: 18 }}>
            both systems break the same way. Both get fixed the same way.
          </span>
        </StickyNote>
      </div>
    </div>
  );
}

// ---------- Step 2: The Cast ----------

function StepCast({ ctx }) {
  return (
    <div>
      <StepTitle kicker="Who feels it">Three groups feel the pain — every day.</StepTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200 }}>
        {CAST.map((c, i) => (
          <div key={c.role} className={`sketch-card ${i === 0 ? "wobble-1" : i === 1 ? "wobble-2" : "wobble-3"}`} style={{ padding: 24, minHeight: 320 }}>
            <div style={{ height: 100, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CastSketch kind={c.sketch} />
            </div>
            <div className="marker-bold" style={{ fontSize: 30, lineHeight: 1, marginBottom: 4 }}>{c.role}</div>
            <div className="label" style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 14 }}>{c.count}</div>
            <div className="hand" style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.4 }}>
              {c.pain}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32 }} className="hand" >
        <span style={{ fontSize: 18, color: "var(--ink-soft)" }}>
          Keep these three faces in mind. Every problem on the next pages hurts at least one of them.
        </span>
      </div>
    </div>
  );
}

function CastSketch({ kind }) {
  const stroke = "var(--rule)";
  if (kind === "phone") {
    return (
      <svg width="80" height="100" viewBox="0 0 80 100">
        <rect x="18" y="6" width="44" height="88" rx="6" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <rect x="24" y="18" width="32" height="44" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <circle cx="40" cy="84" r="3" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <line x1="28" y1="68" x2="52" y2="68" stroke={stroke} strokeWidth="1.5"/>
        <line x1="28" y1="74" x2="46" y2="74" stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  }
  if (kind === "desk") {
    return (
      <svg width="120" height="100" viewBox="0 0 120 100">
        <rect x="20" y="36" width="80" height="48" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <rect x="28" y="44" width="64" height="32" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <line x1="20" y1="84" x2="100" y2="84" stroke={stroke} strokeWidth="2.5"/>
        <line x1="60" y1="84" x2="60" y2="94" stroke={stroke} strokeWidth="2.5"/>
        <circle cx="60" cy="22" r="9" fill="none" stroke={stroke} strokeWidth="2"/>
        <path d="M 50 35 Q 60 30 70 35" fill="none" stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  }
  return (
    <svg width="120" height="100" viewBox="0 0 120 100">
      <path d="M 12 36 L 60 12 L 108 36 L 108 88 L 12 88 Z" fill="none" stroke={stroke} strokeWidth="2.5"/>
      <rect x="40" y="50" width="20" height="38" fill="none" stroke={stroke} strokeWidth="2"/>
      <rect x="70" y="50" width="26" height="18" fill="none" stroke={stroke} strokeWidth="1.5"/>
      <line x1="20" y1="42" x2="100" y2="42" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>
  );
}

// ---------- Problem step ----------

function StepProblem({ ctx, problem }) {
  const num = parseInt(problem.id.slice(1));
  const systemLabel = problem.system === "enrichment" ? "Content Enrichment" : problem.system === "category" ? "Category Prediction" : "Both Systems";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 36 }}>
      {/* LEFT */}
      <div>
        <SectionLabel tone="red">Problem {num} of 10 · {systemLabel}</SectionLabel>
        <h1 className="marker-bold" style={{ fontSize: 52, lineHeight: 1.05, margin: "0 0 18px", textWrap: "balance" }}>
          {problem.title}
        </h1>
        <div className="hand" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.45, maxWidth: 560, marginBottom: 22 }}>
          {problem.blurb}
        </div>

        {problem.metric && (
          <div style={{ display: "inline-block", marginBottom: 22 }}>
            <div className="sketch-card problem" style={{ padding: "12px 20px", display: "inline-block" }}>
              <div className="label" style={{ fontSize: 11, color: "var(--red)", letterSpacing: 1.5 }}>WHAT IT LOOKS LIKE</div>
              <div className="marker-bold" style={{ fontSize: 36, color: "var(--red)", lineHeight: 1 }}>{problem.metric.value}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>{problem.metric.label}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <SectionLabel tone="red">Who it hurts</SectionLabel>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {problem.hurts.map((h, i) => (
              <li key={i} className="hand" style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 4 }}>
                <span style={{ color: "var(--red)", marginRight: 8 }}>✗</span>{h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT — concrete illustration */}
      <div>
        <ProblemIllustration problem={problem} />
      </div>
    </div>
  );
}

function ProblemIllustration({ problem }) {
  const ex = problem.example;
  if (ex.kind === "tier-mismatch") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Today: same approach, regardless of value</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
          {[ex.productA, ex.productB].map((v, i) => (
            <div key={i} className="sketch" style={{ padding: 14, borderStyle: "dashed" }}>
              <div className="hand-bold" style={{ fontSize: 18 }}>{v.vendor}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 8 }}>{v.products} products</div>
              <div className="mono" style={{ background: "var(--paper-2)", padding: "6px 8px", fontSize: 13, marginBottom: 8 }}>{v.title}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--red)" }}>{v.treatment}</div>
            </div>
          ))}
        </div>
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          Effort spent on options that were never viable for the small shop. Premium not delivered for the strategic partner.
        </div>
      </div>
    );
  }
  if (ex.kind === "uniform") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Same product · two stores · same cost</SectionLabel>
        <div className="mono" style={{ background: "var(--paper-2)", padding: "10px 12px", marginBottom: 16, marginTop: 8 }}>"{ex.sameProduct}"</div>
        {ex.views.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i === 0 ? "1.5px dashed var(--ink-faint)" : "1.5px dashed var(--ink-faint)", borderBottom: i === ex.views.length - 1 ? "1.5px dashed var(--ink-faint)" : "none" }}>
            <span className="hand" style={{ fontSize: 18 }}>{v}</span>
            <span className="mono" style={{ background: "#fbe9e6", padding: "4px 10px", fontSize: 13, color: "var(--red)" }}>{ex.cost}</span>
          </div>
        ))}
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          A top-seller for a strategic partner deserves more investment than a long-tail SKU at a local shop. Today, they get the same.
        </div>
      </div>
    );
  }
  if (ex.kind === "correction-loop") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>What an agent sees, all day</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <div>
            <div className="label" style={{ fontSize: 10, color: "var(--ink-faint)" }}>VENDOR INPUT</div>
            <div className="mono" style={{ fontSize: 14, background: "var(--paper-2)", padding: "6px 10px" }}>{ex.raw}</div>
          </div>
          <HandArrow dir="down" length={28} style={{ margin: "0 auto" }}/>
          <div>
            <div className="label" style={{ fontSize: 10, color: "var(--red)" }}>AI OUTPUT (needs correction)</div>
            <div className="mono" style={{ fontSize: 14, background: "#fbe9e6", padding: "6px 10px", border: "1.5px dashed var(--red)" }}>
              {ex.ai}
            </div>
          </div>
          <HandArrow dir="down" length={28} style={{ margin: "0 auto" }}/>
          <div>
            <div className="label" style={{ fontSize: 10, color: "var(--green)" }}>AGENT FIXES (and the model never learns)</div>
            <div className="mono" style={{ fontSize: 14, background: "#e6f1de", padding: "6px 10px", border: "1.5px dashed var(--green)" }}>
              {ex.fixed}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <StickyNote color="red" rotate={-2}>
            <span className="hand-bold" style={{ fontSize: 16 }}>The same pattern, again and again. </span>
            <span className="hand" style={{ fontSize: 15 }}>{ex.pattern}</span>
          </StickyNote>
        </div>
      </div>
    );
  }
  if (ex.kind === "eval-timeline") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>The market vs. our cycle</SectionLabel>
        <div style={{ marginTop: 12 }}>
          <div className="hand-bold" style={{ fontSize: 16, marginBottom: 6, color: "var(--green)" }}>Models released per month</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: 18, height: 24, background: "var(--green-soft)", border: "1px solid var(--green)" }}></div>
            ))}
          </div>
          <div className="hand-bold" style={{ fontSize: 16, marginBottom: 6, color: "var(--red)" }}>Months between our eval cycles</div>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ width: 80, height: 24, background: "#fbe9e6", border: "1.5px dashed var(--red)" }}></div>
          </div>
        </div>
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 18, fontStyle: "italic" }}>
          Each evaluation is a separate development project. Meanwhile better and cheaper models ship weekly.
        </div>
      </div>
    );
  }
  if (ex.kind === "blind-pipeline") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>How a quality regression is "detected"</SectionLabel>
        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          {[
            { d: "Day 1", e: "Model update ships. Titles get worse." },
            { d: "Week 1", e: "Customers click wrong products. Returns rise. No one notices." },
            { d: "Week 2", e: "Agents complain about correction queue volume." },
            { d: "Week 3", e: "Engineering investigates. Confirms regression." },
            { d: "Week 4+", e: "Fix prioritized." },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12, alignItems: "start" }}>
              <div className="label" style={{ fontSize: 12, color: i < 4 ? "var(--red)" : "var(--ink-soft)" }}>{row.d}</div>
              <div className="hand" style={{ fontSize: 15 }}>{row.e}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (ex.kind === "backlog") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>The "small recurring fix" backlog</SectionLabel>
        <div className="mono" style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 10, marginTop: 6 }}>JIRA-ish</div>
        {ex.tickets.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 10, padding: "10px 0", borderTop: "1.5px dashed var(--ink-faint)", alignItems: "center" }}>
            <div className="hand" style={{ fontSize: 15 }}>{t.name}</div>
            <div className="label" style={{ fontSize: 11, color: "var(--red)" }}>{t.age}</div>
            <div className="mono" style={{ fontSize: 11, background: "var(--paper-2)", padding: "2px 6px", textAlign: "center" }}>{t.status}</div>
          </div>
        ))}
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          Agents develop workarounds. The model keeps making the same mistake.
        </div>
      </div>
    );
  }
  if (ex.kind === "static-file") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>How a new category gets added today</SectionLabel>
        <div className="hand" style={{ marginTop: 6, fontSize: 16, lineHeight: 1.6 }}>
          <div>1. One engineer opens a Jupyter notebook.</div>
          <div>2. Edits a JSON file in cloud storage.</div>
          <div>3. Manually adds the category's golden examples.</div>
          <div>4. Hopes nothing else broke.</div>
        </div>
        <div className="mono" style={{ marginTop: 16, background: "var(--paper-2)", padding: 12, fontSize: 12 }}>
          {`golden_dataset.json`}<br/>
          <span style={{ color: "var(--ink-faint)" }}>{`  ├─ Fresh Milk: [12 examples]`}</span><br/>
          <span style={{ color: "var(--ink-faint)" }}>{`  ├─ Carbonated Drinks: [8 examples]`}</span><br/>
          <span style={{ color: "var(--red)" }}>{`  ├─ Coffee Capsules: [0 examples] ← new`}</span><br/>
          <span style={{ color: "var(--ink-faint)" }}>{`  └─ ...`}</span>
        </div>
      </div>
    );
  }
  if (ex.kind === "category-loop") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>One override · weekly · never learned</SectionLabel>
        <div className="hand-bold" style={{ fontSize: 20, marginTop: 10, marginBottom: 12 }}>{ex.product}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="sketch-card problem" style={{ padding: "8px 12px" }}>
            <div className="label" style={{ fontSize: 10, color: "var(--red)" }}>MODEL PREDICTED</div>
            <div className="mono" style={{ fontSize: 14 }}>{ex.predicted}</div>
          </div>
          <HandArrow dir="down" length={28} style={{ margin: "0 auto" }}/>
          <div className="sketch-card solved" style={{ padding: "8px 12px" }}>
            <div className="label" style={{ fontSize: 10, color: "var(--green)" }}>AGENT CORRECTS TO</div>
            <div className="mono" style={{ fontSize: 14 }}>{ex.correct}</div>
          </div>
          <HandArrow dir="down" length={28} style={{ margin: "0 auto" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 32 }}>🗑️</div>
            <div className="hand" style={{ fontSize: 15, color: "var(--red)" }}>
              Correction applied locally. Then discarded.<br/>
              Same wrong prediction next week.
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (ex.kind === "ground-truth") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>"Ground truth" is a circular argument</SectionLabel>
        <div className="hand" style={{ fontSize: 16, marginTop: 10, lineHeight: 1.5 }}>
          Q: Is the prediction correct?<br/>
          A: It's correct if <span className="hi-red">GPT-4o agrees with the data we already have</span>.
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="sketch-card problem" style={{ padding: "12px 14px", textAlign: "center" }}>
            <div className="marker-bold" style={{ fontSize: 34, color: "var(--red)", lineHeight: 1 }}>63.2%</div>
            <div className="hand" style={{ fontSize: 13, color: "var(--ink-soft)" }}>GPT-4o ↔ data agreement</div>
          </div>
          <div className="sketch-card problem" style={{ padding: "12px 14px", textAlign: "center" }}>
            <div className="marker-bold" style={{ fontSize: 34, color: "var(--red)", lineHeight: 1 }}>44</div>
            <div className="hand" style={{ fontSize: 13, color: "var(--ink-soft)" }}>categories with zero examples</div>
          </div>
        </div>
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          Voltaren ends up in "Body Lotion" because Topical Pain Relief has no examples to learn from.
        </div>
      </div>
    );
  }
  if (ex.kind === "env-var") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>How model selection actually works today</SectionLabel>
        <div className="mono" style={{ background: "#1a1814", color: "#c8e3b3", padding: 16, fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
          <div style={{ color: "#8a857a" }}># config/talabat-uae.env</div>
          <div>CATEGORY_MODEL=automl_text_v1</div>
          <div style={{ color: "#8a857a", marginTop: 8 }}># config/pedidosya-ar.env</div>
          <div>CATEGORY_MODEL=embedding_v2</div>
          <div style={{ color: "#8a857a", marginTop: 8 }}># config/yemeksepeti-tr.env</div>
          <div>CATEGORY_MODEL=automl_text_v1</div>
        </div>
        <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          Two model versions coexist. Which region uses which is decided by environment variable. No A/B test, no data, no comparison.
        </div>
      </div>
    );
  }
  return null;
}

// ---------- Pivot step ----------

function StepPivot({ ctx }) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <SectionLabel>The pivot</SectionLabel>
      <h1 className="marker-bold" style={{ fontSize: 80, lineHeight: 1.0, margin: "0 0 24px", maxWidth: 1100, textWrap: "balance" }}>
        Ten problems.<br/>One shape.
      </h1>
      <div className="hand" style={{ fontSize: 22, color: "var(--ink-soft)", maxWidth: 880, lineHeight: 1.4, marginBottom: 36 }}>
        Look across the ten cards on the left. They are not ten independent issues.
        They are the same gap — <span className="hi hand-bold">no feedback, no governance, no observability</span> — showing up in two places.
      </div>

      <div className="sketch-card" style={{ padding: 28, maxWidth: 1000 }}>
        <SectionLabel tone="green">The unifying architecture</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 16, alignItems: "center", marginTop: 12 }}>
          <div className="sketch-card" style={{ padding: 14, textAlign: "center" }}>
            <div className="marker-bold" style={{ fontSize: 22 }}>Tier &amp; ROI</div>
            <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>Set the budget upfront</div>
          </div>
          <HandArrow length={36} />
          <div className="sketch-card" style={{ padding: 14, textAlign: "center" }}>
            <div className="marker-bold" style={{ fontSize: 22 }}>Model Store</div>
            <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>Pick the best model per task</div>
          </div>
          <HandArrow length={36} />
          <div className="sketch-card" style={{ padding: 14, textAlign: "center" }}>
            <div className="marker-bold" style={{ fontSize: 22 }}>Continuous QA</div>
            <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>Catch, fix, feed back</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <div className="hand-bold" style={{ fontSize: 20 }}>↑ Applied to both Enrichment <em>and</em> Category ↑</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Solution step ----------

function StepSolution({ ctx, solution }) {
  const num = parseInt(solution.id.slice(1));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", gap: 36 }}>
      <div>
        <SectionLabel tone="green">Solution {num} of {SOLUTIONS.length}</SectionLabel>
        <h1 className="marker-bold" style={{ fontSize: 52, lineHeight: 1.05, margin: "0 0 18px", textWrap: "balance" }}>
          {solution.title}
        </h1>
        <div className="hand" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.45, marginBottom: 24 }}>
          {solution.blurb}
        </div>

        {solution.resolves.length > 0 && (
          <div>
            <SectionLabel tone="green">Resolves</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {solution.resolves.map((pid) => {
                const p = PROBLEMS.find(x => x.id === pid);
                return (
                  <div key={pid} className="sketch-card solution" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="marker-bold" style={{ fontSize: 22, color: "var(--green)" }}>✓</span>
                    <div>
                      <div className="label" style={{ fontSize: 11, color: "var(--green)" }}>{pid}</div>
                      <div className="hand-bold" style={{ fontSize: 17 }}>{p.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {solution.proof && (
          <div className="sketch-card solution" style={{ padding: "12px 16px", marginTop: 10 }}>
            <div className="hand-bold" style={{ fontSize: 16, color: "var(--green)" }}>Proof of the architecture</div>
            <div className="hand" style={{ fontSize: 15, color: "var(--ink-soft)" }}>
              Demonstrates that the closed loop handles even the hardest case — zero training data.
            </div>
          </div>
        )}
      </div>
      <div>
        <SolutionIllustration solution={solution} />
      </div>
    </div>
  );
}

function SolutionIllustration({ solution }) {
  const ex = solution.example;
  if (ex.kind === "tier-ladder") {
    const p = EXAMPLE_PRODUCTS.almaraiMilk;
    const tiers = ["lite", "pro", "plus", "enterprise"];
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Same product · four investment levels</SectionLabel>
        <div className="hand-bold" style={{ fontSize: 18, marginTop: 4 }}>{p.brand} · {p.platform}</div>
        <RawTitleCard raw={p.raw} style={{ marginTop: 10, marginBottom: 16 }}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tiers.map((t, i) => {
            const labels = { lite: "Lite · local shop · $0.001", pro: "Pro · regional chain · $0.003", plus: "Plus · national retailer · $0.015", enterprise: "Enterprise · strategic partner · $0.030" };
            const colors = ["#f5e29a", "#c8e3b3", "#bcd2ea", "#e9c4f0"];
            return (
              <div key={t}>
                <div className="label" style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 2 }}>{labels[t].toUpperCase()}</div>
                <div className="mono" style={{ background: colors[i], padding: "6px 10px", fontSize: 13, border: "1.5px solid rgba(0,0,0,0.2)" }}>
                  "{p.tiers[t]}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (ex.kind === "roi-override") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Tier is the floor. ROI moves things up or down.</SectionLabel>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 16 }}>
          {ex.cases.map((c, i) => (
            <div key={i} className="sketch" style={{ padding: 14, borderStyle: "dashed" }}>
              <div className="hand-bold" style={{ fontSize: 18 }}>{c.brand}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>at {c.vendor}</div>
              <div className="marker-bold" style={{ fontSize: 22, color: "var(--green)", marginTop: 6 }}>{c.outcome}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)", fontStyle: "italic", marginTop: 4 }}>{c.reason}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (ex.kind === "guidelines") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Acceptance criteria · {ex.category}</SectionLabel>
        <div className="hand" style={{ fontSize: 16, marginTop: 10, marginBottom: 14 }}>
          The model and the QA layer share <span className="hi hand-bold">the same checklist</span> — defined before generation runs.
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
          {ex.rules.map((r, i) => (
            <li key={i} className="hand" style={{ fontSize: 16, marginBottom: 4 }}>
              <span className="check"></span>{r}
            </li>
          ))}
        </ul>
        <div className="label" style={{ fontSize: 10, color: "var(--ink-faint)" }}>VENDOR INPUT</div>
        <div className="mono" style={{ background: "var(--paper-2)", padding: "6px 10px", fontSize: 13, marginBottom: 8 }}>{ex.sampleRaw}</div>
        <div className="label" style={{ fontSize: 10, color: "var(--green)" }}>MEETS THE BAR</div>
        <div className="mono" style={{ background: "#e6f1de", padding: "6px 10px", fontSize: 13, border: "1.5px dashed var(--green)" }}>{ex.sampleGood}</div>
      </div>
    );
  }
  if (ex.kind === "model-store") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Model Store · benchmarked continuously</SectionLabel>
        <div className="hand" style={{ fontSize: 16, marginTop: 10, marginBottom: 14 }}>
          5 content tasks × N candidate models. The Selection Agent picks the cheapest model that clears each task's quality bar — per tier.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr", gap: 6, fontSize: 12 }}>
          <div></div>
          <div className="label" style={{ textAlign: "center", color: "var(--ink-faint)" }}>Lite</div>
          <div className="label" style={{ textAlign: "center", color: "var(--ink-faint)" }}>Pro</div>
          <div className="label" style={{ textAlign: "center", color: "var(--ink-faint)" }}>Plus</div>
          <div className="label" style={{ textAlign: "center", color: "var(--ink-faint)" }}>Enterprise</div>
          {ex.tasks.map((t, i) => (
            <React.Fragment key={t}>
              <div className="hand" style={{ fontSize: 14 }}>{t}</div>
              {["DH-v3", "4.1-mini", "Sonnet", "GPT-4.1"].map((m, j) => (
                <div key={j} className="mono" style={{ textAlign: "center", background: ["#f5e29a","#c8e3b3","#bcd2ea","#e9c4f0"][j], padding: "4px 2px", fontSize: 11, border: "1px solid rgba(0,0,0,0.2)" }}>{m}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="hand" style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 14, fontStyle: "italic" }}>
          New model ships next week? It's benchmarked overnight and enters the rotation. No project required.
        </div>
      </div>
    );
  }
  if (ex.kind === "qa-layers") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Three layers · always on</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
          {ex.layers.map((l, i) => (
            <div key={i} className="sketch" style={{ padding: 14, borderStyle: "dashed" }}>
              <div className="marker-bold" style={{ fontSize: 22 }}>{i+1}. {l.name}</div>
              <div className="hand" style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 2 }}>{l.does}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--green)", marginTop: 4 }}>→ {l.outcome}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (ex.kind === "feedback-loop") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>The signal already exists. We just need to keep it.</SectionLabel>
        <div className="hand-bold" style={{ fontSize: 18, marginTop: 4 }}>{ex.product}</div>
        <div className="mono" style={{ background: "var(--paper-2)", padding: "6px 10px", fontSize: 13, margin: "8px 0 18px" }}>{ex.override}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ex.flow.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center", gap: 10 }}>
              <div className="marker-bold" style={{ fontSize: 26, color: "var(--green)", textAlign: "center" }}>{i+1}</div>
              <div className="hand" style={{ fontSize: 17 }}>{f}</div>
            </div>
          ))}
        </div>
        <StickyNote color="green" rotate={-1.5} style={{ marginTop: 18 }}>
          <span className="hand" style={{ fontSize: 16 }}>~2,400 overrides/week → no new human work, full feedback.</span>
        </StickyNote>
      </div>
    );
  }
  if (ex.kind === "validation-gate") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Three agents vote before anything enters the golden dataset</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          {ex.agents.map((a, i) => (
            <div key={i} className="sketch" style={{ padding: 12, borderStyle: "dashed", textAlign: "center" }}>
              <div className="marker-bold" style={{ fontSize: 18 }}>Agent {i+1}</div>
              <div className="hand-bold" style={{ fontSize: 13, marginTop: 2 }}>{a.name}</div>
              <div className="hand" style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6, fontStyle: "italic" }}>"{a.q}"</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          {ex.verdicts.map((v, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", padding: "6px 0", borderTop: "1.5px dashed var(--ink-faint)" }}>
              <div className="label" style={{ fontSize: 12, color: i === 0 ? "var(--green)" : i === 1 ? "var(--amber)" : "var(--red)" }}>{v.vote}</div>
              <div className="hand" style={{ fontSize: 15 }}>{v.outcome}</div>
            </div>
          ))}
        </div>
        <StickyNote color="green" rotate={1} style={{ marginTop: 16 }}>
          <span className="hand-bold" style={{ fontSize: 14 }}>Projected impact: </span>
          <span className="hand" style={{ fontSize: 14 }}>{ex.impact}</span>
        </StickyNote>
      </div>
    );
  }
  if (ex.kind === "monitoring") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Live accuracy · per region · per category depth</SectionLabel>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "100px repeat(6, 1fr)", gap: 4, alignItems: "end" }}>
          <div className="label" style={{ fontSize: 11, color: "var(--ink-faint)" }}>Talabat</div>
          {[78, 82, 84, 81, 76, 79].map((v, i) => (
            <div key={i} style={{ height: v * 0.9, background: v < 78 ? "#fbe9e6" : "#e6f1de", border: `1.5px solid ${v < 78 ? "var(--red)" : "var(--green)"}` }}></div>
          ))}
          <div className="label" style={{ fontSize: 11, color: "var(--ink-faint)" }}>PedidosYa</div>
          {[81, 80, 83, 85, 84, 85].map((v, i) => (
            <div key={i} style={{ height: v * 0.9, background: "#e6f1de", border: "1.5px solid var(--green)" }}></div>
          ))}
          <div className="label" style={{ fontSize: 11, color: "var(--ink-faint)" }}>Yemeksepeti</div>
          {[74, 73, 71, 68, 65, 62].map((v, i) => (
            <div key={i} style={{ height: v * 0.9, background: v < 70 ? "#fbe9e6" : "#fff4e0", border: `1.5px solid ${v < 70 ? "var(--red)" : "var(--amber)"}` }}></div>
          ))}
        </div>
        <StickyNote color="red" rotate={-2} style={{ marginTop: 22 }}>
          <span className="hand-bold" style={{ fontSize: 15 }}>⚠ Drift alert: </span>
          <span className="hand" style={{ fontSize: 15 }}>Yemeksepeti accuracy down 12pp over 6 weeks. Selection Agent triggered to re-pick model.</span>
        </StickyNote>
      </div>
    );
  }
  if (ex.kind === "cold-start") {
    return (
      <div className="sketch-card" style={{ padding: 22 }}>
        <SectionLabel>Adding "Calories" from zero labeled data</SectionLabel>
        <div className="hand" style={{ fontSize: 15, marginTop: 6, marginBottom: 14 }}>
          The same closed loop, in graduated stages. The QA loop <em>is</em> the training loop.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ex.steps.map((s, i) => (
            <div key={i} className="sketch" style={{ padding: 10, borderStyle: "dashed", display: "grid", gridTemplateColumns: "40px 110px 1fr", alignItems: "center", gap: 10 }}>
              <div className="marker-bold" style={{ fontSize: 22, color: "var(--green)" }}>{i+1}</div>
              <div className="hand-bold" style={{ fontSize: 16 }}>{s.name}</div>
              <div className="hand" style={{ fontSize: 14, color: "var(--ink-soft)" }}>{s.does}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// ---------- Resolution Map ----------

function StepResolutionMap({ ctx }) {
  // Build a wire from each problem to its resolving solutions.
  const probRefs = useRef({});
  const solRefs = useRef({});
  const wrapRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const computeLines = () => {
      if (!wrapRef.current) return;
      const wrapRect = wrapRef.current.getBoundingClientRect();
      const newLines = [];
      PROBLEMS.forEach((p) => {
        const resolvers = SOLUTIONS.filter(s => s.resolves.includes(p.id));
        resolvers.forEach((s) => {
          const pe = probRefs.current[p.id];
          const se = solRefs.current[s.id];
          if (pe && se) {
            const pr = pe.getBoundingClientRect();
            const sr = se.getBoundingClientRect();
            newLines.push({
              x1: pr.right - wrapRect.left,
              y1: pr.top + pr.height / 2 - wrapRect.top,
              x2: sr.left - wrapRect.left,
              y2: sr.top + sr.height / 2 - wrapRect.top,
              key: `${p.id}-${s.id}`,
            });
          }
        });
      });
      setLines(newLines);
    };
    computeLines();
    window.addEventListener("resize", computeLines);
    const t = setTimeout(computeLines, 100);
    return () => { window.removeEventListener("resize", computeLines); clearTimeout(t); };
  }, []);

  return (
    <div>
      <SectionLabel tone="green">The closing moment</SectionLabel>
      <h1 className="marker-bold" style={{ fontSize: 56, lineHeight: 1.05, margin: "0 0 12px", textWrap: "balance" }}>
        Every problem on the left. Every solution on the right. No loose threads.
      </h1>
      <div className="hand" style={{ fontSize: 18, color: "var(--ink-soft)", marginBottom: 30, maxWidth: 880 }}>
        Notice how the lines bunch in the middle — most solutions resolve more than one problem, because the problems share the same root cause.
      </div>

      <div ref={wrapRef} style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px minmax(0, 1fr)", gap: 0 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
          {lines.map((l) => (
            <path key={l.key}
              d={`M ${l.x1} ${l.y1} C ${l.x1 + 80} ${l.y1}, ${l.x2 - 80} ${l.y2}, ${l.x2} ${l.y2}`}
              stroke="var(--green)" strokeWidth="1.5" fill="none" opacity="0.7" />
          ))}
        </svg>

        {/* PROBLEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
          <div className="label" style={{ fontSize: 12, color: "var(--red)", letterSpacing: 2 }}>PROBLEMS</div>
          {PROBLEMS.map((p) => (
            <div key={p.id} ref={el => probRefs.current[p.id] = el}
              className="sketch-card solved" style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <span className="marker-bold" style={{ fontSize: 18, color: "var(--green)" }}>✓</span>
              <span className="label" style={{ fontSize: 10, color: "var(--ink-faint)", minWidth: 22 }}>{p.id}</span>
              <span className="hand crossed" style={{ fontSize: 14 }}>{p.title}</span>
            </div>
          ))}
        </div>

        <div style={{ zIndex: 0 }}></div>

        {/* SOLUTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
          <div className="label" style={{ fontSize: 12, color: "var(--green)", letterSpacing: 2, textAlign: "right" }}>SOLUTIONS</div>
          {SOLUTIONS.filter(s => s.resolves.length > 0).map((s) => (
            <div key={s.id} ref={el => solRefs.current[s.id] = el}
              className="sketch-card solution" style={{ padding: "6px 12px", textAlign: "right" }}>
              <span className="label" style={{ fontSize: 10, color: "var(--green)", marginRight: 6 }}>{s.id}</span>
              <span className="hand-bold" style={{ fontSize: 14 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Closing step ----------

function StepClosing({ ctx }) {
  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ maxWidth: 1000 }}>
        <SectionLabel>And so</SectionLabel>
        <h1 className="marker-bold" style={{ fontSize: 88, lineHeight: 1.0, margin: "0 0 24px", textWrap: "balance" }}>
          One closed loop.<br/>Applied to both systems.
        </h1>
        <div className="hand" style={{ fontSize: 22, color: "var(--ink-soft)", lineHeight: 1.4, marginBottom: 40, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          One Model Store. One QA framework. One feedback signal.
          Whether the task is a title, an attribute, a category, or an attribute we haven't even defined yet — the architecture is the same.
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <ClosedLoopDiagram />
        </div>

        <div style={{ marginTop: 48 }} className="hand">
          <span style={{ fontSize: 18, color: "var(--ink-faint)" }}>End of walkthrough · use ← to revisit any step</span>
        </div>
      </div>
    </div>
  );
}

function ClosedLoopDiagram() {
  return (
    <svg width="560" height="240" viewBox="0 0 560 240" style={{ maxWidth: "100%" }}>
      {/* nodes */}
      {[
        { x: 60, y: 120, label: "Vendor input", sub: "raw titles" },
        { x: 220, y: 60, label: "Tier + ROI", sub: "budget set" },
        { x: 380, y: 60, label: "Model Store", sub: "pick best" },
        { x: 500, y: 120, label: "Customer", sub: "app" },
        { x: 380, y: 200, label: "QA + Feedback", sub: "every signal kept" },
        { x: 220, y: 200, label: "Golden dataset", sub: "always growing" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 50} y={n.y - 22} width="100" height="44" rx="6"
            fill="var(--paper)" stroke="var(--rule)" strokeWidth="2"
            style={{ transform: `rotate(${(i%2?1:-1)*0.5}deg)`, transformOrigin: `${n.x}px ${n.y}px` }}/>
          <text x={n.x} y={n.y - 4} textAnchor="middle" fontFamily="Kalam" fontSize="13" fontWeight="700" fill="var(--ink)">{n.label}</text>
          <text x={n.x} y={n.y + 11} textAnchor="middle" fontFamily="Kalam" fontSize="10" fill="var(--ink-faint)">{n.sub}</text>
        </g>
      ))}
      {/* arrows around the loop */}
      <g fill="none" stroke="var(--green)" strokeWidth="2">
        <path d="M 110 110 Q 160 60, 170 60" markerEnd="url(#arrow)"/>
        <path d="M 270 60 L 330 60" markerEnd="url(#arrow)"/>
        <path d="M 430 70 Q 480 80, 490 110" markerEnd="url(#arrow)"/>
        <path d="M 490 130 Q 470 200, 430 200" markerEnd="url(#arrow)"/>
        <path d="M 330 200 L 270 200" markerEnd="url(#arrow)"/>
        <path d="M 170 200 Q 110 200, 90 140" markerEnd="url(#arrow)"/>
      </g>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--green)"/>
        </marker>
      </defs>
    </svg>
  );
}

Object.assign(window, {
  StepCover, StepTwoSystems, StepCast, StepProblem,
  StepPivot, StepSolution, StepResolutionMap, StepClosing,
});
