// Demo app — orchestrates the page: top nav, intro, 10 scenes, side rail, outro.

const { useState: appS, useEffect: appE, useRef: appR } = React;

function Intro() {
  return (
    <section style={{
      minHeight: "84vh",
      padding: "100px 28px 64px",
      maxWidth: 1180, margin: "0 auto",
      display: "flex", flexDirection: "column", justifyContent: "center",
      overflow: "hidden",
    }}>
      <div className="fade-up" style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, padding: "5px 12px", border: "1px solid var(--border)", background: "var(--surface)", borderRadius: 999, marginBottom: 22 }}>
        <span style={{ width: 7, height: 7, background: "var(--dh-red)", borderRadius: "50%", animation: "pulseDot 1.8s ease-in-out infinite" }}/>
        <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 500 }}>Pipeline demo · scroll to begin</span>
      </div>

      <h1 className="fade-up" style={{
        margin: 0, fontFamily: "var(--font)", fontWeight: 800,
        fontSize: "clamp(48px, 7vw, 92px)", lineHeight: 1.02,
        letterSpacing: "-0.035em", color: "var(--ink)",
        maxWidth: 1050, overflowWrap: "anywhere",
        animationDelay: "60ms",
      }}>
        How a messy vendor upload becomes an enriched, categorized listing.
      </h1>

      <p className="fade-up" style={{
        marginTop: 22, fontSize: 22, lineHeight: 1.45, color: "var(--ink-soft)",
        maxWidth: 720, fontWeight: 400, textWrap: "pretty",
        animationDelay: "140ms",
      }}>
        Ten scenes, end to end. Scroll to advance — animations auto-play with comfortable reading pauses. No clicks required.
      </p>

      <div className="fade-up" style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 14, animationDelay: "220ms" }}>
        <div style={{
          width: 36, height: 56,
          border: "2px solid var(--ink-mute)", borderRadius: 20,
          display: "flex", justifyContent: "center", paddingTop: 8,
        }}>
          <div style={{ width: 3, height: 8, background: "var(--ink-mute)", borderRadius: 2, animation: "drift 1.6s ease-in-out infinite" }}/>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-mute)" }}>
          Scroll · or use the rail on the left to jump
        </div>
      </div>
    </section>
  );
}

function SideRail({ activeId }) {
  const [scenes, setScenes] = appS([]);

  appE(() => {
    const update = () => setScenes([...(window.__sceneRegistry || [])].sort((a, b) => a.num - b.num));
    update();
    window.addEventListener("__scenes-changed", update);
    return () => window.removeEventListener("__scenes-changed", update);
  }, []);

  if (scenes.length === 0) return null;
  return (
    <nav className="rail">
      {scenes.map(s => (
        <a key={s.id} href={`#${s.id}`} className={activeId === s.id ? "active" : ""}>
          <span className="dot"/>
          <span className="label">{String(s.num).padStart(2, "0")} · {s.title.split(".")[0]}</span>
        </a>
      ))}
    </nav>
  );
}

function Outro() {
  return (
    <section style={{
      padding: "80px 28px 100px",
      maxWidth: 1180, margin: "0 auto",
      textAlign: "center",
      overflow: "hidden",
    }}>
      <div className="eyebrow" style={{ color: "var(--green-2)", marginBottom: 14 }}>End of demo</div>
      <h2 style={{
        margin: 0, fontFamily: "var(--font)", fontWeight: 800,
        fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.03,
        letterSpacing: "-0.03em", color: "var(--ink)",
      }}>
        One pipeline. <span style={{ color: "var(--green-2)" }}>Every content task.</span>
      </h2>
      <p style={{ marginTop: 18, fontSize: 18, color: "var(--ink-soft)", maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
        Tiered onboarding, a continuous Model Store, locale-aware guidelines, three-agent validation, and a QA gate — applied to every title, attribute, and category we generate.
      </p>
      <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <a href="Walkthrough.html" style={ctaPrimary}>
          See the strategy walkthrough
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <a href="index.html" style={ctaSecondary}>
          Back to home
        </a>
      </div>
    </section>
  );
}

const ctaPrimary = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "12px 22px",
  background: "var(--ink)", color: "#fff",
  border: "1px solid var(--ink)",
  borderRadius: 999,
  fontFamily: "var(--font)", fontWeight: 600, fontSize: 14.5,
  textDecoration: "none",
  boxShadow: "var(--shadow-2)",
};
const ctaSecondary = {
  ...ctaPrimary,
  background: "var(--surface)", color: "var(--ink)",
  border: "1px solid var(--border-strong)",
  boxShadow: "var(--shadow-1)",
};

function App() {
  const [activeId, setActiveId] = appS(null);

  appE(() => {
    const onActive = (e) => setActiveId(e.detail.id);
    window.addEventListener("__scene-active", onActive);
    return () => window.removeEventListener("__scene-active", onActive);
  }, []);

  return (
    <div>
      <TopNav active="demo"/>
      <SideRail activeId={activeId}/>
      <Intro/>
      <SceneIngestion/>
      <SceneModelStore/>
      <SceneProductAnalysis/>
      <SceneTierAssignment/>
      <SceneGuidelines/>
      <SceneGeneration/>
      <SceneCategory/>
      <SceneQA/>
      <SceneLocale/>
      <SceneCost/>
      <Outro/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
