// Main walkthrough app — step orchestration, ledger sidebar, navigation.

const { useState, useEffect, useMemo, useCallback } = React;

// Build the step list.
// Order: cover, two-systems, cast, [10 problems], pivot, [9 solutions], resolution map, closing
function buildSteps() {
  const steps = [];
  steps.push({ kind: "cover", title: "Cover" });
  steps.push({ kind: "two-systems", title: "Two systems" });
  steps.push({ kind: "cast", title: "The cast" });
  PROBLEMS.forEach((p, i) => {
    steps.push({ kind: "problem", title: `P${i+1} · ${p.title}`, problem: p });
  });
  steps.push({ kind: "pivot", title: "Pivot — one shape" });
  SOLUTIONS.forEach((s, i) => {
    steps.push({ kind: "solution", title: `S${i+1} · ${s.title}`, solution: s });
  });
  steps.push({ kind: "map", title: "Resolution map" });
  steps.push({ kind: "closing", title: "One closed loop" });
  return steps;
}

const STEPS = buildSteps();

// Compute, for any step index, which problems have been introduced and which have been resolved so far.
function computeState(idx) {
  const introduced = new Set();
  const resolved = new Set();
  for (let i = 0; i <= idx; i++) {
    const s = STEPS[i];
    if (!s) break;
    if (s.kind === "problem") introduced.add(s.problem.id);
    if (s.kind === "solution") {
      s.solution.resolves.forEach((p) => resolved.add(p));
    }
    if (s.kind === "map" || s.kind === "closing") {
      PROBLEMS.forEach(p => introduced.add(p.id));
      PROBLEMS.forEach(p => resolved.add(p.id));
    }
  }
  return { introduced, resolved };
}

// ---------- Ledger sidebar ----------

function Ledger({ idx, onGoto, tweaks }) {
  const { introduced, resolved } = computeState(idx);
  const introCount = introduced.size;
  const resolvedCount = resolved.size;
  const currentStep = STEPS[idx];

  return (
    <aside style={{
      position: "sticky",
      top: 20,
      alignSelf: "start",
      width: 280,
      maxHeight: "calc(100vh - 40px)",
      overflowY: "auto",
      padding: "16px 14px",
      background: "var(--paper-2)",
      border: "2px solid var(--rule)",
      borderRadius: "8px 18px 6px 14px / 14px 6px 18px 8px",
      boxShadow: "2px 3px 0 rgba(26,24,20,0.15)",
      fontFamily: "Kalam, sans-serif",
    }} className="scroll-hide">
      <div className="label" style={{ fontSize: 11, letterSpacing: 2, color: "var(--ink-faint)" }}>PROBLEM LEDGER</div>
      <div className="marker-bold" style={{ fontSize: 22, lineHeight: 1, marginTop: 4, marginBottom: 6 }}>
        {introCount}/10 introduced
      </div>
      <div className="hand" style={{ fontSize: 14, color: "var(--green)", marginBottom: 14 }}>
        {resolvedCount}/10 resolved ✓
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: "var(--paper)", border: "1.5px solid var(--rule)", marginBottom: 16, position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${(resolvedCount/10) * 100}%`,
          background: "var(--green-soft)",
          borderRight: resolvedCount > 0 ? "1.5px solid var(--green)" : "none",
        }}></div>
      </div>

      {PROBLEMS.map((p) => {
        const isIntro = introduced.has(p.id);
        const isResolved = resolved.has(p.id);
        const isCurrent = currentStep.kind === "problem" && currentStep.problem.id === p.id;
        const isResolvingNow = currentStep.kind === "solution" && currentStep.solution.resolves.includes(p.id);

        let bg = "transparent";
        let textColor = "var(--ink-faint)";
        let textCls = "";
        if (isIntro) {
          bg = "var(--paper)";
          textColor = "var(--red)";
        }
        if (isResolved) {
          bg = "#e6f1de";
          textColor = "var(--green)";
          textCls = "strike strike-green";
        }
        if (isCurrent) {
          bg = "#fbe9e6";
          textColor = "var(--red)";
        }
        if (isResolvingNow) {
          bg = "#d6ecc8";
          textColor = "var(--green)";
        }

        return (
          <button
            key={p.id}
            onClick={() => {
              const probIdx = STEPS.findIndex(s => s.kind === "problem" && s.problem.id === p.id);
              if (probIdx >= 0) onGoto(probIdx);
            }}
            style={{
              display: "block", width: "100%",
              textAlign: "left",
              background: bg,
              border: "1.5px dashed " + (isIntro || isResolved ? "var(--rule)" : "transparent"),
              padding: "5px 8px",
              marginBottom: 4,
              cursor: "pointer",
              borderRadius: 3,
              fontFamily: "Kalam, sans-serif",
            }}
          >
            <span className="label" style={{ fontSize: 10, marginRight: 6, color: textColor, opacity: isIntro ? 1 : 0.5 }}>
              {p.id}
            </span>
            <span style={{ fontSize: 13, color: textColor, opacity: isIntro ? 1 : 0.5 }} className={textCls}>
              {p.title}
            </span>
          </button>
        );
      })}

      <div style={{ marginTop: 18 }}>
        <div className="label" style={{ fontSize: 10, letterSpacing: 2, color: "var(--ink-faint)", marginBottom: 4 }}>STEP</div>
        <div className="hand" style={{ fontSize: 14 }}>
          {idx + 1} <span style={{ color: "var(--ink-faint)" }}>/ {STEPS.length}</span>
        </div>
      </div>
    </aside>
  );
}

// ---------- Main step view ----------

function StepView({ step, ctx }) {
  if (step.kind === "cover") return <StepCover ctx={ctx}/>;
  if (step.kind === "two-systems") return <StepTwoSystems ctx={ctx}/>;
  if (step.kind === "cast") return <StepCast ctx={ctx}/>;
  if (step.kind === "problem") return <StepProblem ctx={ctx} problem={step.problem}/>;
  if (step.kind === "pivot") return <StepPivot ctx={ctx}/>;
  if (step.kind === "solution") return <StepSolution ctx={ctx} solution={step.solution}/>;
  if (step.kind === "map") return <StepResolutionMap ctx={ctx}/>;
  if (step.kind === "closing") return <StepClosing ctx={ctx}/>;
  return null;
}

// ---------- Nav controls ----------

function NavBar({ idx, total, onPrev, onNext, onGoto, tweaks }) {
  const isCover = idx === 0;
  const isLast = idx === total - 1;
  return (
    <div className="no-print" style={{
      position: "sticky", bottom: 0, zIndex: 10,
      padding: "14px 0 18px",
      background: "linear-gradient(0deg, var(--paper) 70%, rgba(246,241,230,0))",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16,
    }}>
      <button className="nav" onClick={onPrev} disabled={isCover}>← Back</button>
      <div className="hand" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {STEPS.map((s, i) => {
          const isCurrent = i === idx;
          let color = "var(--ink-faint)";
          if (s.kind === "problem") color = "var(--red)";
          if (s.kind === "solution") color = "var(--green)";
          if (s.kind === "map" || s.kind === "closing") color = "var(--ink)";
          return (
            <button key={i} onClick={() => onGoto(i)}
              title={s.title}
              style={{
                width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10,
                border: `2px solid ${color}`,
                background: isCurrent ? color : "transparent",
                borderRadius: "50% 30% 50% 40%",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.15s ease",
              }}
            />
          );
        })}
      </div>
      <button className="nav primary" onClick={onNext} disabled={isLast}>{isLast ? "End" : "Next →"}</button>
    </div>
  );
}

// ---------- App ----------

function App() {
  // Tweaks
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "indigo",
    "showLedger": true,
    "denseMode": false
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Step state with hash sync.
  const initial = (() => {
    const h = parseInt((window.location.hash || "").replace("#", ""), 10);
    return isNaN(h) ? 0 : Math.max(0, Math.min(STEPS.length - 1, h));
  })();
  const [idx, setIdx] = useState(initial);

  useEffect(() => {
    window.location.hash = String(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const goTo = useCallback((n) => setIdx(Math.max(0, Math.min(STEPS.length - 1, n))), []);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(STEPS.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const step = STEPS[idx];
  const ctx = useMemo(() => ({ ...computeState(idx), goTo }), [idx, goTo]);

  // Apply accent variable
  useEffect(() => {
    const accents = {
      indigo: { red: "#c5392b", green: "#2f7a4a" },
      red:    { red: "#c5392b", green: "#2f7a4a" },
      blue:   { red: "#205a8a", green: "#2f7a4a" },
      mono:   { red: "#3a3631", green: "#5a564f" },
    };
    const a = accents[tweaks.accent] || accents.indigo;
    document.documentElement.style.setProperty("--red", a.red);
    document.documentElement.style.setProperty("--green", a.green);
  }, [tweaks.accent]);

  const showLedger = tweaks.showLedger;
  // Hide ledger on cover/closing for breathing room
  const ledgerVisible = showLedger && !["cover", "closing"].includes(step.kind);

  return (
    <div style={{
      maxWidth: 1500, margin: "0 auto",
      padding: tweaks.denseMode ? "16px 24px 0" : "32px 40px 0",
      display: "grid",
      gridTemplateColumns: ledgerVisible ? "1fr 300px" : "1fr",
      gap: 32,
      alignItems: "start",
    }}>
      <main style={{ minWidth: 0 }}>
        {/* Header strip */}
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
          <div className="hand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "30% 70% 50% 50% / 60% 40% 60% 40%",
              background: "var(--ink)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Caveat, sans-serif", fontWeight: 700, fontSize: 22,
            }}>D</div>
            <div>
              <div className="marker-bold" style={{ fontSize: 22, lineHeight: 1 }}>Dynamic Content Strategy</div>
              <div className="label" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: 1.5 }}>EXECUTIVE WALKTHROUGH · WIREFRAME</div>
            </div>
          </div>
          <div className="hand" style={{ fontSize: 14, color: "var(--ink-faint)" }}>
            Step {idx + 1} <span style={{ margin: "0 6px" }}>/</span> {STEPS.length}
          </div>
        </div>

        {/* Content */}
        <div key={idx} style={{ minHeight: "60vh" }}>
          <StepView step={step} ctx={ctx} />
        </div>

        {/* Nav */}
        <NavBar idx={idx} total={STEPS.length} onPrev={prev} onNext={next} onGoto={goTo} tweaks={tweaks}/>
      </main>

      {ledgerVisible && (
        <div className="no-print">
          <Ledger idx={idx} onGoto={goTo} tweaks={tweaks}/>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Look & feel">
          <TweakRadio label="Accent set" value={tweaks.accent}
            options={[
              { value: "indigo", label: "Default" },
              { value: "blue", label: "Cool" },
              { value: "mono", label: "Mono" },
            ]}
            onChange={(v) => setTweak("accent", v)}
          />
          <TweakToggle label="Show ledger sidebar" value={tweaks.showLedger} onChange={(v) => setTweak("showLedger", v)}/>
          <TweakToggle label="Dense layout" value={tweaks.denseMode} onChange={(v) => setTweak("denseMode", v)}/>
        </TweakSection>
        <TweakSection label="Jump to">
          <TweakButton label="↶ Cover" onClick={() => goTo(0)}/>
          <TweakButton label="P1 — First problem" onClick={() => goTo(3)}/>
          <TweakButton label="The pivot" onClick={() => goTo(13)}/>
          <TweakButton label="S1 — First solution" onClick={() => goTo(14)}/>
          <TweakButton label="Resolution map" onClick={() => goTo(STEPS.length - 2)}/>
          <TweakButton label="↷ Closing" onClick={() => goTo(STEPS.length - 1)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
