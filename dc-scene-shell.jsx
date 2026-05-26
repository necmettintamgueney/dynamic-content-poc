// Demo page scene shell + shared bits.
// Each scene is full-viewport (min-height: 100vh). When it scrolls into view,
// the inner content gets .is-active, animations begin, and step counter advances.

const { useState: sS, useEffect: sE, useRef: sR, useMemo: sM } = React;

// ---------- Scene wrapper ----------
function Scene({ id, num, total, kicker, title, lede, message, children, eyebrowTone = "red", bg }) {
  const ref = sR(null);
  const inView = useInView(ref, { threshold: 0.35 });

  // Register section for the rail nav
  sE(() => {
    if (!window.__sceneRegistry) window.__sceneRegistry = [];
    if (!window.__sceneRegistry.find(s => s.id === id)) {
      window.__sceneRegistry.push({ id, num, title });
      window.dispatchEvent(new CustomEvent("__scenes-changed"));
    }
  }, [id, num, title]);

  sE(() => {
    if (inView) {
      window.dispatchEvent(new CustomEvent("__scene-active", { detail: { id } }));
    }
  }, [inView, id]);

  return (
    <section ref={ref} id={id}
      className={`scene ${inView ? "is-active" : ""}`}
      style={{
        minHeight: "100vh",
        padding: "100px 28px 80px",
        background: bg || "transparent",
        display: "flex", flexDirection: "column", justifyContent: "center",
        scrollMarginTop: 64,
        overflow: "hidden",
      }}>
      <div className="scene-inner" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <SceneBadge num={num} tone={eyebrowTone}/>
          <div className="eyebrow" style={{ color: toneColor(eyebrowTone) }}>{kicker}</div>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
          <div style={{ fontSize: 11.5, color: "var(--ink-faint)", fontFamily: "var(--mono)", fontWeight: 500 }}>
            {String(num).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>
        <h2 style={{
          margin: 0, fontFamily: "var(--font)", fontWeight: 700,
          fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05,
          letterSpacing: "-0.025em", color: "var(--ink)",
          maxWidth: 900, overflowWrap: "anywhere",
        }}>{title}</h2>
        {lede && (
          <p style={{
            margin: "18px 0 0", fontSize: 19, lineHeight: 1.5,
            color: "var(--ink-soft)", maxWidth: 760, fontWeight: 400,
          }}>{lede}</p>
        )}

        <div style={{ marginTop: 40 }}>
          {typeof children === "function" ? children({ inView }) : children}
        </div>

        {message && (
          <div style={{
            marginTop: 40, padding: "18px 22px",
            background: "var(--surface-2)", border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            display: "flex", gap: 14, alignItems: "flex-start",
            maxWidth: 920,
          }}>
            <div style={{ width: 3, alignSelf: "stretch", background: toneColor(eyebrowTone), borderRadius: 2 }}/>
            <div>
              <div className="eyebrow" style={{ color: toneColor(eyebrowTone), marginBottom: 4 }}>Key message</div>
              <div style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.45, fontWeight: 500 }}>{message}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function toneColor(tone) {
  return { red: "var(--dh-red)", green: "var(--green-2)", amber: "var(--amber)", blue: "var(--blue-2)", purple: "var(--purple)", neutral: "var(--ink-mute)" }[tone] || "var(--dh-red)";
}

function SceneBadge({ num, tone }) {
  const c = toneColor(tone);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: "var(--surface)", border: `1.5px solid ${c}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--mono)", fontWeight: 700, fontSize: 13, color: c,
    }}>{String(num).padStart(2, "0")}</div>
  );
}

// ---------- Step indicator (1..N pills) ----------
function StepIndicator({ step, total, tone = "red" }) {
  const c = toneColor(tone);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 22 : 6, height: 6,
          background: i <= step ? c : "var(--border-strong)",
          borderRadius: 999,
          transition: "all 280ms ease",
        }}/>
      ))}
    </div>
  );
}

// ---------- Tag + Card (reused from walkthrough) ----------
function DCTag({ tone = "neutral", children, mono = false, style = {} }) {
  const tones = {
    neutral: { bg: "var(--surface-2)",   fg: "var(--ink-soft)",  bd: "var(--border)" },
    red:     { bg: "var(--red-tint)",    fg: "var(--dh-red)",    bd: "var(--red-edge)" },
    green:   { bg: "var(--green-tint)",  fg: "var(--green-2)",   bd: "var(--green-edge)" },
    amber:   { bg: "var(--amber-tint)",  fg: "var(--amber)",     bd: "var(--amber-edge)" },
    blue:    { bg: "var(--blue-tint)",   fg: "var(--blue-2)",    bd: "var(--blue-edge)" },
    purple:  { bg: "var(--purple-tint)", fg: "var(--purple)",    bd: "#D9C2E8" },
    ink:     { bg: "var(--ink)",         fg: "#fff",             bd: "var(--ink)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 9px",
      fontFamily: mono ? "var(--mono)" : "var(--font)",
      fontSize: 11.5, fontWeight: 600,
      color: t.fg, background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 999, lineHeight: 1.4, whiteSpace: "nowrap",
      ...style,
    }}>{children}</span>
  );
}

function DCCard({ children, padded = true, style = {}, accent, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderTop: accent ? `3px solid ${accent}` : undefined,
      borderRadius: "var(--radius-lg)",
      padding: padded ? 22 : 0,
      boxShadow: "var(--shadow-1)",
      overflow: "hidden",
      ...style,
    }}>{children}</div>
  );
}

// ---------- Tier pill ----------
const TIER_INFO = {
  lite:       { label: "Lite",       color: "var(--t-lite)", tint: "var(--t-lite-tint)", cost: "$0.001" },
  pro:        { label: "Pro",        color: "var(--t-pro)",  tint: "var(--t-pro-tint)",  cost: "$0.003" },
  plus:       { label: "Plus",       color: "var(--t-plus)", tint: "var(--t-plus-tint)", cost: "$0.015" },
  enterprise: { label: "Enterprise", color: "var(--t-ent)",  tint: "var(--t-ent-tint)",  cost: "$0.030" },
};

function TierBadge({ tier, size = "md" }) {
  const t = TIER_INFO[tier];
  if (!t) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: size === "sm" ? "3px 9px" : "4px 12px",
      background: t.tint, color: t.color,
      border: `1px solid ${t.color}40`,
      borderRadius: 999,
      fontFamily: "var(--font)", fontWeight: 600,
      fontSize: size === "sm" ? 11 : 12.5,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.color }}/>
      {t.label}
    </span>
  );
}

// ---------- Check / X icons ----------
function CheckBig({ size = 18, color = "var(--green-2)", animate = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4"/>
      <path d="M7.5 12.5l3 3 6-6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="24" strokeDashoffset={animate ? "24" : "0"}
        style={animate ? { animation: "drawTick 380ms ease-out 80ms forwards" } : undefined}/>
    </svg>
  );
}
function XBig({ size = 18, color = "var(--dh-red)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4"/>
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ArrowRightSm({ size = 16, color = "var(--ink-mute)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowDownSm({ size = 16, color = "var(--ink-mute)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M6 13l6 6 6-6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ---------- Tokenized title — render diff between two titles (kept simple here) ----------
function diffTokens(a, b) {
  const A = a.split(/(\s+|—|·)/).filter(Boolean);
  const B = b.split(/(\s+|—|·)/).filter(Boolean);
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = A[i] === B[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
  const ops = []; let i = 0, j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) { ops.push({ op: "keep", text: A[i] }); i++; j++; }
    else if (dp[i+1][j] >= dp[i][j+1]) { ops.push({ op: "del", text: A[i] }); i++; }
    else { ops.push({ op: "ins", text: B[j] }); j++; }
  }
  while (i < m) ops.push({ op: "del", text: A[i++] });
  while (j < n) ops.push({ op: "ins", text: B[j++] });
  return ops;
}

function TokenTitle({ from, to, fontSize = 17, style = {} }) {
  const ops = sM(() => diffTokens(from, to), [from, to]);
  return (
    <div className="mono" style={{
      fontSize, lineHeight: 1.45, color: "var(--ink)",
      wordBreak: "break-word", overflowWrap: "anywhere",
      ...style,
    }}>
      {ops.map((seg, i) => {
        if (seg.op === "del") return null;
        const isSpace = /^\s+$/.test(seg.text);
        if (seg.op === "ins") {
          return <span key={i} style={{
            background: isSpace ? "transparent" : "var(--green-tint)",
            color: isSpace ? "inherit" : "var(--green-2)",
            padding: isSpace ? 0 : "1px 3px",
            borderRadius: 4, whiteSpace: "pre-wrap",
          }}>{seg.text}</span>;
        }
        return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{seg.text}</span>;
      })}
    </div>
  );
}

Object.assign(window, {
  Scene, SceneBadge, StepIndicator, DCTag, DCCard, TierBadge, TIER_INFO,
  CheckBig, XBig, ArrowRightSm, ArrowDownSm, toneColor, diffTokens, TokenTitle,
});
