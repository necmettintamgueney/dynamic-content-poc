// Main app — orchestrates steps, ledger, nav, tweaks.

const { useState: uS, useEffect: uE, useMemo: uM, useCallback: uCb, useRef: uR } = React;

function buildSteps() {
  const steps = [];
  steps.push({ kind: "cover", title: "Cover" });
  steps.push({ kind: "two-systems", title: "Two systems" });
  steps.push({ kind: "cast", title: "Who feels it" });
  PROBLEMS.forEach(p => steps.push({ kind: "problem", title: `P${p.num} · ${p.title}`, problem: p }));
  steps.push({ kind: "pivot", title: "One shape" });
  steps.push({ kind: "open-question", title: "Open question · guideline ownership" });
  SOLUTIONS.forEach(s => steps.push({ kind: "solution", title: `S${s.num} · ${s.title}`, solution: s }));
  steps.push({ kind: "map", title: "Resolution map" });
  steps.push({ kind: "closing", title: "Closed loop" });
  return steps;
}
const STEPS = buildSteps();

function computeState(idx) {
  const introduced = new Set();
  const resolved = new Set();
  for (let i = 0; i <= idx; i++) {
    const s = STEPS[i];
    if (!s) break;
    if (s.kind === "problem") introduced.add(s.problem.id);
    if (s.kind === "solution") s.solution.resolves.forEach(p => resolved.add(p));
    if (s.kind === "map" || s.kind === "closing") {
      PROBLEMS.forEach(p => { introduced.add(p.id); resolved.add(p.id); });
    }
  }
  return { introduced, resolved };
}

// =====================================================
// Ledger sidebar
// =====================================================
function Ledger({ idx, onGoto }) {
  const { introduced, resolved } = computeState(idx);
  const introCount = introduced.size;
  const resolvedCount = resolved.size;
  const current = STEPS[idx];

  return (
    <aside style={{
      position: "sticky", top: 24, alignSelf: "start",
      width: 290,
      maxHeight: "calc(100vh - 48px)",
      overflowY: "auto",
      padding: 18,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-1)",
    }} className="scroll-hide">
      <Eyebrow style={{ marginBottom: 8 }}>Problem ledger</Eyebrow>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>{resolvedCount}<span style={{ color: "var(--ink-faint)", fontWeight: 500 }}>/{PROBLEMS.length}</span></div>
        <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>resolved</div>
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-mute)" }}>{introCount} introduced</div>

      {/* Progress bar */}
      <div style={{ marginTop: 12, height: 4, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          width: `${(resolvedCount / PROBLEMS.length) * 100}%`,
          height: "100%",
          background: "var(--green)",
          transition: "width 400ms ease",
        }}/>
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
        {PROBLEMS.map((p, i) => {
          const intro = introduced.has(p.id);
          const res = resolved.has(p.id);
          const isCur = current.kind === "problem" && current.problem.id === p.id;
          const isResolvingNow = current.kind === "solution" && current.solution.resolves.includes(p.id);

          let bg = "transparent", fg = "var(--ink-faint)";
          if (intro) { bg = "var(--red-tint)"; fg = "var(--dh-red)"; }
          if (res)   { bg = "var(--green-tint)"; fg = "var(--green-2)"; }
          if (isCur)        { bg = "var(--red-tint)"; }
          if (isResolvingNow) { bg = "var(--green-tint)"; }

          return (
            <button key={p.id}
              onClick={() => {
                const probIdx = STEPS.findIndex(s => s.kind === "problem" && s.problem.id === p.id);
                if (probIdx >= 0) onGoto(probIdx);
              }}
              style={{
                display: "grid", gridTemplateColumns: "18px 24px 1fr", gap: 6, alignItems: "center",
                padding: "6px 8px",
                background: bg,
                border: `1px solid ${(isCur || isResolvingNow) ? (isResolvingNow ? "var(--green-edge)" : "var(--red-edge)") : "transparent"}`,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "var(--font)",
                textAlign: "left",
                transition: "background 280ms ease, border-color 200ms ease",
              }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {res ? <CheckIcon size={14}/> : intro ? <Dot tone="red" size={6} pulse={isCur}/> : <Dot tone="neutral" size={6}/>}
              </span>
              <span className="mono" style={{ fontSize: 10.5, color: fg, fontWeight: 600 }}>{p.id}</span>
              <span style={{ fontSize: 12, color: intro || res ? "var(--ink)" : "var(--ink-faint)", lineHeight: 1.35, fontWeight: 500 }}>
                {res ? <ResolvedText resolved animate={isResolvingNow}>{p.title}</ResolvedText> : p.title}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <Eyebrow style={{ marginBottom: 4 }}>Step</Eyebrow>
        <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{idx + 1} <span style={{ color: "var(--ink-faint)" }}>/ {STEPS.length}</span></div>
      </div>
    </aside>
  );
}

// =====================================================
// Top header
// =====================================================
function Header({ idx, totalSteps, step }) {
  const stepLabel =
    step.kind === "cover" ? "Cover"
    : step.kind === "two-systems" ? "Setup"
    : step.kind === "cast" ? "Setup"
    : step.kind === "problem" ? `Problem ${step.problem.num} of 10`
    : step.kind === "pivot" ? "Pivot"
    : step.kind === "open-question" ? "Open question"
    : step.kind === "solution" ? `Solution ${step.solution.num} of ${SOLUTIONS.length}`
    : step.kind === "map" ? "Resolution"
    : "Closing";

  return (
    <header className="no-print" style={{
      position: "sticky", top: 0, zIndex: 20,
      background: "color-mix(in oklab, var(--bg) 90%, transparent)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <a href="index.html" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <DHLogo size={28}/>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Dynamic Content Strategy</div>
            <div className="eyebrow" style={{ marginTop: 2 }}>Executive walkthrough · v2</div>
          </div>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { id: "home", label: "Home", href: "index.html" },
            { id: "strategy", label: "Strategy", href: "Walkthrough.html" },
            { id: "demo", label: "Demo", href: "Demo.html" },
          ].map(l => (
            <a key={l.id} href={l.href} style={{
              padding: "6px 12px",
              fontFamily: "var(--font)", fontWeight: l.id === "strategy" ? 600 : 500, fontSize: 13,
              color: l.id === "strategy" ? "var(--ink)" : "var(--ink-mute)",
              background: l.id === "strategy" ? "var(--surface-2)" : "transparent",
              border: l.id === "strategy" ? "1px solid var(--border)" : "1px solid transparent",
              borderRadius: 999, textDecoration: "none",
            }}>{l.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Tag>{stepLabel}</Tag>
          <div style={{ fontSize: 12.5, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{idx + 1}</span> / {totalSteps}
          </div>
        </div>
      </div>
    </header>
  );
}

// =====================================================
// Nav bar
// =====================================================
function NavBar({ idx, total, onPrev, onNext, onGoto }) {
  const isCover = idx === 0;
  const isLast = idx === total - 1;
  return (
    <div className="no-print" style={{
      position: "sticky", bottom: 0, zIndex: 15,
      marginTop: 40,
      padding: "16px 0 24px",
      background: "linear-gradient(0deg, var(--bg) 70%, color-mix(in oklab, var(--bg) 0%, transparent))",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    }}>
      <button onClick={onPrev} disabled={isCover} style={navBtn(false, isCover)}>← Back</button>

      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: "60%" }}>
        {STEPS.map((s, i) => {
          const isCur = i === idx;
          let color = "var(--ink-faint)";
          if (s.kind === "problem") color = "var(--dh-red)";
          if (s.kind === "solution") color = "var(--green)";
          if (s.kind === "open-question") color = "var(--amber)";
          if (s.kind === "map" || s.kind === "closing") color = "var(--ink)";
          return (
            <button key={i} onClick={() => onGoto(i)} title={s.title}
              aria-label={s.title}
              style={{
                width: isCur ? 22 : 8, height: 8,
                padding: 0,
                background: isCur ? color : "var(--border-strong)",
                border: "none", borderRadius: 999,
                cursor: "pointer",
                transition: "all 180ms ease",
              }}/>
          );
        })}
      </div>

      <button onClick={onNext} disabled={isLast} style={navBtn(true, isLast)}>
        {isLast ? "End" : "Next →"}
      </button>
    </div>
  );
}

function navBtn(primary, disabled) {
  return {
    padding: "10px 18px",
    fontFamily: "var(--font)", fontWeight: 600, fontSize: 14,
    background: primary ? (disabled ? "var(--ink-mute)" : "var(--ink)") : "var(--surface)",
    color: primary ? "#fff" : "var(--ink)",
    border: `1px solid ${primary ? (disabled ? "var(--ink-mute)" : "var(--ink)") : "var(--border)"}`,
    borderRadius: 999,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 160ms ease",
    boxShadow: primary && !disabled ? "var(--shadow-1)" : "none",
  };
}

// =====================================================
// App
// =====================================================
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "light",
    "showLedger": true,
    "compactNav": false
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Initial index from hash
  const initial = (() => {
    const h = parseInt((window.location.hash || "").replace("#", ""), 10);
    return isNaN(h) ? 0 : Math.max(0, Math.min(STEPS.length - 1, h));
  })();
  const [idx, setIdx] = uS(initial);

  uE(() => {
    window.location.hash = String(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  // Theme switch
  uE(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme === "dark" ? "dark" : "light");
  }, [tweaks.theme]);

  const goTo = uCb((n) => setIdx(Math.max(0, Math.min(STEPS.length - 1, n))), []);
  const next = uCb(() => goTo(idx + 1), [idx, goTo]);
  const prev = uCb(() => goTo(idx - 1), [idx, goTo]);

  uE(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End") { e.preventDefault(); goTo(STEPS.length - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const step = STEPS[idx];
  const ctx = uM(() => ({ ...computeState(idx), goTo, stepIdx: idx }), [idx, goTo]);

  const ledgerVisible = tweaks.showLedger && !["cover", "closing"].includes(step.kind);

  const stepEl = (() => {
    switch (step.kind) {
      case "cover": return <StepCover ctx={ctx}/>;
      case "two-systems": return <StepTwoSystems ctx={ctx}/>;
      case "cast": return <StepCast ctx={ctx}/>;
      case "problem": return <StepProblem ctx={ctx} problem={step.problem}/>;
      case "pivot": return <StepPivot ctx={ctx}/>;
      case "open-question": return <StepOpenQuestion ctx={ctx}/>;
      case "solution": return <StepSolution ctx={ctx} solution={step.solution}/>;
      case "map": return <StepResolutionMap ctx={ctx}/>;
      case "closing": return <StepClosing ctx={ctx}/>;
      default: return null;
    }
  })();

  // Find common jump targets
  const findIdx = (pred) => STEPS.findIndex(pred);
  const firstProb = findIdx(s => s.kind === "problem");
  const pivotIdx = findIdx(s => s.kind === "pivot");
  const firstSol = findIdx(s => s.kind === "solution");
  const mapIdx = findIdx(s => s.kind === "map");
  const closingIdx = findIdx(s => s.kind === "closing");

  return (
    <div>
      <Header idx={idx} totalSteps={STEPS.length} step={step}/>

      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "28px 32px 0",
        display: "grid",
        gridTemplateColumns: ledgerVisible ? "minmax(0, 1fr) 310px" : "minmax(0, 1fr)",
        gap: 32,
        alignItems: "start",
      }}>
        <main style={{ minWidth: 0 }}>
          <div key={idx} className="fade-up" style={{ minHeight: "60vh" }}>
            {stepEl}
          </div>
          <NavBar idx={idx} total={STEPS.length} onPrev={prev} onNext={next} onGoto={goTo}/>
        </main>

        {ledgerVisible && (
          <div className="no-print">
            <Ledger idx={idx} onGoto={goTo}/>
          </div>
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio label="Mode" value={tweaks.theme}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
            onChange={(v) => setTweak("theme", v)}
          />
          <TweakToggle label="Show ledger" value={tweaks.showLedger} onChange={(v) => setTweak("showLedger", v)}/>
        </TweakSection>
        <TweakSection label="Jump to">
          <TweakButton label="↶ Cover"             onClick={() => goTo(0)}/>
          <TweakButton label="Two systems"         onClick={() => goTo(1)}/>
          <TweakButton label="P1 · First problem"   onClick={() => goTo(firstProb)}/>
          <TweakButton label="Pivot · one shape"    onClick={() => goTo(pivotIdx)}/>
          <TweakButton label="Open question · ownership" onClick={() => goTo(findIdx(s => s.kind === "open-question"))}/>
          <TweakButton label="S1 · Tiered onboarding" onClick={() => goTo(firstSol)}/>
          <TweakButton label="Resolution map"       onClick={() => goTo(mapIdx)}/>
          <TweakButton label="↷ Closing"            onClick={() => goTo(closingIdx)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
