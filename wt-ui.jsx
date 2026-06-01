// Reusable UI primitives for the Dynamic Content Strategy walkthrough.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Brand chrome ----------

function DHLogo({ size = 28, color = "var(--dh-red)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-label="Delivery Hero">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M419.714 248.327c-.116.054-.179.107-.268.152l-46.63 19.034-1.431.653-11.357 51.964c-.76 1.772-3.032 2.193-4.561.707l-33.975-40.188-.161-.116-191.563 82.246c-.161.09-.349.126-.536.126a1.283 1.283 0 01-1.288-1.289c0-.412.205-.787.527-1.029l165.61-124.036-20.954-47.875c-1.046-2.175.885-4.501 3.443-3.857h.018l50.752 12.51 39.404-35.096v.009c1.699-1.333 4.015-.385 4.445 1.727l3.845 52.725 45.44 26.604c1.95 1.235 1.673 4.125-.76 5.029zM396.552 97.633C337.759 74.546 273.1 91.88 233.196 136.246l-155.7 166.9c-2.093 2.246-1.127 5.065 1.43 5.441l41.479 2.55c3.327.206 3.738 3.061 2.066 5.02L21.073 425.598c-1.77 1.897.358 4.877 2.781 4.126l144.772-45.772c3.059-1.056 5.42 1.673 4.123 4.071l-19.362 34.255c-1.002 1.951.877 4.627 3.309 4.448l208.715-46.515c49.876-7.901 94.404-41.208 114.196-91.642 29.807-75.687-7.432-161.164-83.055-190.936z"
        fill={color}/>
    </svg>
  );
}

// ---------- Chips & tags ----------

function Tag({ tone = "neutral", children, soft = true, style = {}, mono = false }) {
  const tones = {
    neutral: { bg: "var(--surface-2)",   fg: "var(--ink-soft)",  bd: "var(--border)" },
    red:     { bg: "var(--red-tint)",    fg: "var(--dh-red)",    bd: "var(--red-edge)" },
    green:   { bg: "var(--green-tint)",  fg: "var(--green-2)",   bd: "var(--green-edge)" },
    amber:   { bg: "var(--amber-tint)",  fg: "var(--amber)",     bd: "var(--amber-edge)" },
    blue:    { bg: "var(--blue-tint)",   fg: "var(--blue-2)",    bd: "var(--blue-edge)" },
    ink:     { bg: "var(--ink)",         fg: "#fff",             bd: "var(--ink)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 9px",
      fontFamily: mono ? "var(--mono)" : "var(--font)",
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: mono ? 0 : 0.02,
      color: t.fg,
      background: soft ? t.bg : t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: 999,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      ...style,
    }}>
      {children}
    </span>
  );
}

function Dot({ tone = "neutral", size = 8, pulse = false, style = {} }) {
  const colors = { neutral: "var(--ink-faint)", red: "var(--dh-red)", green: "var(--green)", amber: "var(--amber)", blue: "var(--blue)" };
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      background: colors[tone] || colors.neutral,
      animation: pulse ? "pulseDot 1.8s ease-in-out infinite" : undefined,
      flex: "0 0 auto",
      ...style,
    }}/>
  );
}

function Kbd({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 6px",
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
      color: "var(--ink-soft)", background: "var(--surface)",
      border: "1px solid var(--border)",
      borderBottom: "2px solid var(--border-strong)",
      borderRadius: 4,
    }}>{children}</span>
  );
}

// ---------- Surfaces ----------

function Card({ children, padded = true, style = {}, accent, hover = false, className }) {
  const accentBorderTop = accent ? { borderTop: `3px solid ${accent}` } : {};
  return (
    <div className={className} style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: padded ? 22 : 0,
      boxShadow: "var(--shadow-1)",
      transition: hover ? "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease" : undefined,
      ...accentBorderTop,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ value, label, tone = "ink", size = "md", style = {} }) {
  const valColor = { ink: "var(--ink)", red: "var(--dh-red)", green: "var(--green-2)", amber: "var(--amber)", blue: "var(--blue-2)" }[tone] || "var(--ink)";
  const sizes = { sm: 28, md: 40, lg: 56, xl: 72 };
  return (
    <div style={style}>
      <div style={{
        fontFamily: "var(--font)", fontWeight: 700,
        fontSize: sizes[size], lineHeight: 1,
        color: valColor, letterSpacing: "-0.02em",
      }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-mute)", lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function Eyebrow({ children, tone, style = {} }) {
  const colors = { red: "var(--dh-red)", green: "var(--green-2)", amber: "var(--amber)", blue: "var(--blue-2)" };
  return (
    <div className="eyebrow" style={{ color: tone ? colors[tone] : "var(--ink-mute)", ...style }}>{children}</div>
  );
}

// ---------- Title morphing animation ----------
// Word-by-word diff between two strings; words that change crossfade individually.

function diffWords(a, b) {
  // Simple LCS-based word diff. Returns segments tagged with op: keep|del|ins|swap.
  const A = a.split(/(\s+|—|·)/).filter(s => s.length);
  const B = b.split(/(\s+|—|·)/).filter(s => s.length);
  // Build LCS table.
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
    }
  }
  const ops = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) { ops.push({ op: "keep", text: A[i] }); i++; j++; }
    else if (dp[i+1][j] >= dp[i][j+1]) { ops.push({ op: "del", text: A[i] }); i++; }
    else { ops.push({ op: "ins", text: B[j] }); j++; }
  }
  while (i < m) { ops.push({ op: "del", text: A[i++] }); }
  while (j < n) { ops.push({ op: "ins", text: B[j++] }); }
  return ops;
}

function MorphTitle({ from, to, mode = "to", style = {}, fontSize = 22, weight = 600, mono = true, diffMode = "highlight" }) {
  // mode: "from" (show raw), "to" (show enriched), "both" (cross fade)
  const ops = useMemo(() => diffWords(from, to), [from, to]);
  const useMono = mono;
  const fontFam = useMono ? "var(--mono)" : "var(--font)";

  const renderText = (mode) => (
    ops.map((seg, idx) => {
      const isSpace = /^\s+$/.test(seg.text);
      let bg = "transparent", color = "var(--ink)", textDecoration = "none";
      if (mode === "from") {
        if (seg.op === "ins") return null; // not yet present
        if (seg.op === "del") { bg = diffMode === "highlight" ? "var(--red-tint)" : "transparent"; color = "var(--dh-red)"; }
      } else {
        if (seg.op === "del") return null; // removed
        if (seg.op === "ins") { bg = diffMode === "highlight" ? "var(--green-tint)" : "transparent"; color = "var(--green-2)"; }
      }
      return (
        <span key={idx} style={{
          background: isSpace ? "transparent" : bg,
          color: isSpace ? "inherit" : color,
          padding: isSpace ? 0 : "1px 3px",
          borderRadius: 4,
          transition: "background 240ms ease, color 240ms ease",
          whiteSpace: "pre-wrap",
        }}>{seg.text}</span>
      );
    })
  );

  return (
    <div style={{
      fontFamily: fontFam, fontSize, fontWeight: weight,
      lineHeight: 1.45,
      color: "var(--ink)",
      letterSpacing: useMono ? 0 : "-0.005em",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      ...style,
    }}>
      {renderText(mode)}
    </div>
  );
}

// ---------- Tier toggle ----------

function TierToggle({ value, onChange, tiers = TIERS, compact = false }) {
  return (
    <div role="tablist" style={{
      display: "inline-flex",
      padding: 3,
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 999,
      gap: 2,
    }}>
      {tiers.map(t => {
        const active = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={active}
            onClick={() => onChange(t.id)}
            style={{
              padding: compact ? "6px 12px" : "7px 16px",
              border: "none",
              background: active ? "var(--surface)" : "transparent",
              color: active ? t.color : "var(--ink-mute)",
              fontFamily: "var(--font)",
              fontWeight: active ? 600 : 500,
              fontSize: compact ? 12.5 : 13,
              borderRadius: 999,
              cursor: "pointer",
              boxShadow: active ? "var(--shadow-1)" : "none",
              transition: "all 160ms ease",
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Product picker (dropdown-style) ----------

function ProductPicker({ value, onChange, products }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-mute)", fontWeight: 500 }}>Product</span>
      <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 6 }}>
        {products.map(p => {
          const active = p.id === value;
          return (
            <button key={p.id} onClick={() => onChange(p.id)}
              style={{
                padding: "6px 12px",
                fontFamily: "var(--font)", fontWeight: active ? 600 : 500, fontSize: 12.5,
                color: active ? "var(--surface)" : "var(--ink-soft)",
                background: active ? "var(--ink)" : "var(--surface)",
                border: `1px solid ${active ? "var(--ink)" : "var(--border)"}`,
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 120ms ease",
              }}>
              {p.brand} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 4 }}>· {p.platform}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- StepFrame ----------

function StepFrame({ kicker, eyebrowTone, title, lede, children, padding = "0", maxWidth = 1180 }) {
  return (
    <div style={{ maxWidth, margin: "0 auto", padding }}>
      {kicker && <Eyebrow tone={eyebrowTone} style={{ marginBottom: 12 }}>{kicker}</Eyebrow>}
      {title && (
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font)", fontWeight: 700,
          fontSize: 48, lineHeight: 1.08,
          letterSpacing: "-0.025em",
          color: "var(--ink)",
          textWrap: "balance",
          maxWidth: 900,
        }}>{title}</h1>
      )}
      {lede && (
        <p style={{
          margin: "16px 0 0",
          fontSize: 18, lineHeight: 1.5,
          color: "var(--ink-soft)",
          maxWidth: 760,
          fontWeight: 400,
          textWrap: "pretty",
        }}>{lede}</p>
      )}
      {children && <div style={{ marginTop: title || lede ? 36 : 0 }}>{children}</div>}
    </div>
  );
}

// ---------- Connector arrow (simple svg) ----------

function ArrowRight({ size = 18, color = "var(--ink-mute)", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowDown({ size = 18, color = "var(--ink-mute)", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 5v14M6 13l6 6 6-6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ size = 16, color = "var(--green-2)", animate = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={color} fillOpacity={animate ? "0.12" : "0.10"} stroke={color} strokeWidth="1.4"/>
      <path d="M7.5 12.5l3 3 6-6.5"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="24" strokeDashoffset={animate ? "24" : "0"}
        style={animate ? { animation: "drawTick 380ms ease-out 80ms forwards" } : undefined}
      />
    </svg>
  );
}

function XIcon({ size = 16, color = "var(--dh-red)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4"/>
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ---------- Closed-loop diagram with animated flow ----------
// Six nodes around an ellipse; an SVG path connects them; a dot rides the path.

function ClosedLoopDiagram({ width = 720, height = 360, autoPlay = true, highlight = null }) {
  // Nodes laid out along an ellipse.
  const nodes = [
    { id: "vendor",   label: "Vendor input",      sub: "raw titles", x: 0.10, y: 0.50, tone: "neutral" },
    { id: "tier",     label: "Tier + ROI",        sub: "budget set", x: 0.30, y: 0.18, tone: "blue" },
    { id: "store",    label: "Model Store",       sub: "best model picked", x: 0.62, y: 0.18, tone: "blue" },
    { id: "customer", label: "Customer",          sub: "app listing", x: 0.90, y: 0.50, tone: "green" },
    { id: "qa",       label: "QA + Feedback",     sub: "every signal kept", x: 0.62, y: 0.82, tone: "amber" },
    { id: "golden",   label: "Golden dataset",    sub: "growing", x: 0.30, y: 0.82, tone: "amber" },
  ];

  const xy = (n) => ({ cx: n.x * width, cy: n.y * height });

  // Build closed path through the nodes in order, curved.
  const path = useMemo(() => {
    let d = "";
    nodes.forEach((n, i) => {
      const { cx, cy } = xy(n);
      if (i === 0) d += `M ${cx} ${cy} `;
      else {
        const prev = xy(nodes[i-1]);
        const mid = { x: (prev.x + cx) / 2, y: (prev.y + cy) / 2 };
        // Bulge outward
        d += `Q ${mid.x} ${mid.y} ${cx} ${cy} `;
      }
    });
    // close to first
    const first = xy(nodes[0]);
    const last = xy(nodes[nodes.length - 1]);
    const mid = { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2 + 30 };
    d += `Q ${mid.x} ${mid.y} ${first.x} ${first.y} `;
    return d;
  }, [width, height]);

  const toneColors = {
    neutral: "var(--ink-faint)",
    blue:    "var(--blue)",
    green:   "var(--green)",
    amber:   "var(--amber)",
    red:     "var(--dh-red)",
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width, overflow: "visible" }}>
      <defs>
        <marker id="loopArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--green)"/>
        </marker>
      </defs>

      {/* Loop path */}
      <path d={path} fill="none" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.5"/>

      {/* Three flowing dots staggered along the path */}
      {autoPlay && [0, 1, 2].map((i) => (
        <circle key={i} r="6" fill="var(--green)">
          <animateMotion dur="6s" repeatCount="indefinite" begin={`${-i * 2}s`}>
            <mpath href="#loopMotion"/>
          </animateMotion>
        </circle>
      ))}
      {/* Hidden motion path with id */}
      <path id="loopMotion" d={path} fill="none" stroke="none"/>

      {/* Nodes */}
      {nodes.map((n, i) => {
        const { cx, cy } = xy(n);
        const w = 132, h = 50;
        const isHl = highlight === n.id;
        return (
          <g key={n.id} transform={`translate(${cx - w/2}, ${cy - h/2})`}>
            <rect width={w} height={h} rx={10}
              fill="var(--surface)"
              stroke={isHl ? toneColors[n.tone] : "var(--border)"}
              strokeWidth={isHl ? 2 : 1.2}
              style={{ filter: "drop-shadow(0 2px 6px rgba(20,22,30,0.08))" }}/>
            <text x={w/2} y={20} textAnchor="middle" fontFamily="Outfit" fontSize="13" fontWeight="600" fill="var(--ink)">{n.label}</text>
            <text x={w/2} y={37} textAnchor="middle" fontFamily="Outfit" fontSize="10.5" fill="var(--ink-mute)">{n.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Strikethrough fade text (for resolved problems) ----------

function ResolvedText({ children, resolved, animate = true }) {
  return (
    <span style={{
      color: resolved ? "var(--ink-mute)" : "var(--ink)",
      opacity: resolved ? 0.7 : 1,
      textDecoration: resolved ? "line-through" : "none",
      textDecorationColor: "var(--green-2)",
      textDecorationThickness: 1.5,
      transition: "color 320ms ease, opacity 320ms ease",
    }}>{children}</span>
  );
}

// ---------- Cast icons (clean line illustrations) ----------

function CastGlyph({ kind, color = "var(--ink-soft)", size = 56 }) {
  const stroke = color;
  if (kind === "phone") {
    return (
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
        <rect x="17" y="6" width="22" height="44" rx="4" stroke={stroke} strokeWidth="1.5"/>
        <rect x="20" y="11" width="16" height="28" rx="1.5" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 2"/>
        <circle cx="28" cy="45" r="1.5" fill={stroke}/>
      </svg>
    );
  }
  if (kind === "desk") {
    return (
      <svg width={size + 8} height={size} viewBox="0 0 64 56" fill="none">
        <rect x="10" y="18" width="44" height="26" rx="2" stroke={stroke} strokeWidth="1.5"/>
        <rect x="14" y="22" width="36" height="18" rx="1" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 2"/>
        <line x1="8" y1="46" x2="56" y2="46" stroke={stroke} strokeWidth="1.5"/>
        <line x1="32" y1="46" x2="32" y2="52" stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  }
  // store
  return (
    <svg width={size + 8} height={size} viewBox="0 0 64 56" fill="none">
      <path d="M8 18 L32 7 L56 18 L56 48 L8 48 Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="26" y="28" width="12" height="20" stroke={stroke} strokeWidth="1.5"/>
      <line x1="14" y1="22" x2="50" y2="22" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 2"/>
      <rect x="42" y="28" width="10" height="10" stroke={stroke} strokeWidth="1.2"/>
    </svg>
  );
}

// ---------- Color-coded tier dot ----------

function TierDot({ tierId, size = 8 }) {
  const t = TIERS.find(x => x.id === tierId);
  return <span style={{ width: size, height: size, borderRadius: "50%", background: t?.color || "var(--ink-faint)", display: "inline-block", flex: "0 0 auto" }}/>;
}

Object.assign(window, {
  DHLogo, Tag, Dot, Kbd,
  Card, Stat, Eyebrow,
  diffWords, MorphTitle,
  TierToggle, ProductPicker, TierDot,
  StepFrame, ArrowRight, ArrowDown, CheckIcon, XIcon,
  ClosedLoopDiagram, ResolvedText, CastGlyph,
});
