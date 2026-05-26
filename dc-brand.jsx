// Dynamic Content shared brand: logo mark, wordmark, and top-nav.

const { useState: bS, useEffect: bE, useRef: bR } = React;

// ---------- Brand mark ----------
// Abstract "tier stack" — four rounded bars at growing widths, the second highlighted
// in DH Red. Reads as: tiered content flowing through stages.
function DCMark({ size = 32, accent = "var(--dh-red)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Dynamic Content">
      <rect x="6"  y="6"  width="14" height="3" rx="1.5" fill="currentColor" opacity="0.32"/>
      <rect x="6"  y="11" width="20" height="3" rx="1.5" fill={accent}/>
      <rect x="6"  y="16" width="17" height="3" rx="1.5" fill="currentColor" opacity="0.72"/>
      <rect x="6"  y="21" width="22" height="3" rx="1.5" fill="currentColor"/>
    </svg>
  );
}

// ---------- Wordmark ----------
function DCWordmark({ size = 16, color = "var(--ink)", subdued = false, monogramOnly = false }) {
  if (monogramOnly) {
    return (
      <span style={{
        fontFamily: "var(--font)", fontWeight: 800, fontSize: size,
        letterSpacing: "-0.025em", color, lineHeight: 1,
      }}>DC</span>
    );
  }
  return (
    <div style={{
      fontFamily: "var(--font)", fontWeight: 700, fontSize: size,
      letterSpacing: "-0.025em", color, lineHeight: 1,
      display: "inline-flex", alignItems: "baseline", gap: 0,
    }}>
      <span>Dynamic</span>
      <span style={{ marginLeft: 6, color: subdued ? "var(--ink-mute)" : "var(--ink)" }}>Content</span>
    </div>
  );
}

// ---------- Lockup (mark + wordmark) ----------
function DCLockup({ size = 32, fontSize = 18, color = "var(--ink)", style = {} }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color, ...style }}>
      <DCMark size={size}/>
      <DCWordmark size={fontSize} color={color}/>
    </div>
  );
}

// ---------- DH co-brand badge ----------
function DHBadge({ size = 18 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-mute)", fontWeight: 500 }}>
      by
      <svg width={size} height={size} viewBox="0 0 512 512" aria-label="Delivery Hero">
        <path fillRule="evenodd" clipRule="evenodd"
          d="M419.714 248.327c-.116.054-.179.107-.268.152l-46.63 19.034-1.431.653-11.357 51.964c-.76 1.772-3.032 2.193-4.561.707l-33.975-40.188-.161-.116-191.563 82.246c-.161.09-.349.126-.536.126a1.283 1.283 0 01-1.288-1.289c0-.412.205-.787.527-1.029l165.61-124.036-20.954-47.875c-1.046-2.175.885-4.501 3.443-3.857h.018l50.752 12.51 39.404-35.096v.009c1.699-1.333 4.015-.385 4.445 1.727l3.845 52.725 45.44 26.604c1.95 1.235 1.673 4.125-.76 5.029zM396.552 97.633C337.759 74.546 273.1 91.88 233.196 136.246l-155.7 166.9c-2.093 2.246-1.127 5.065 1.43 5.441l41.479 2.55c3.327.206 3.738 3.061 2.066 5.02L21.073 425.598c-1.77 1.897.358 4.877 2.781 4.126l144.772-45.772c3.059-1.056 5.42 1.673 4.123 4.071l-19.362 34.255c-1.002 1.951.877 4.627 3.309 4.448l208.715-46.515c49.876-7.901 94.404-41.208 114.196-91.642 29.807-75.687-7.432-161.164-83.055-190.936z"
          fill="var(--dh-red)"/>
      </svg>
      <span style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Delivery Hero</span>
    </span>
  );
}

// ---------- Top nav (shared across pages) ----------
function TopNav({ active = "home" }) {
  const links = [
    { id: "home", label: "Home",     href: "index.html" },
    { id: "strategy", label: "Strategy", href: "Walkthrough.html" },
    { id: "demo", label: "Demo",     href: "Demo.html" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "color-mix(in oklab, var(--bg) 88%, transparent)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <a href="index.html" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
          <DCLockup size={26} fontSize={15} color="var(--ink)"/>
          <span style={{ width: 1, height: 18, background: "var(--border)" }}/>
          <DHBadge/>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(l => (
            <a key={l.id} href={l.href} style={{
              padding: "7px 14px",
              fontFamily: "var(--font)", fontWeight: l.id === active ? 600 : 500,
              fontSize: 13.5,
              color: l.id === active ? "var(--ink)" : "var(--ink-mute)",
              background: l.id === active ? "var(--surface-2)" : "transparent",
              border: l.id === active ? "1px solid var(--border)" : "1px solid transparent",
              borderRadius: 999,
              textDecoration: "none",
              transition: "all 140ms ease",
            }}>{l.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ---------- useInView — IntersectionObserver hook ----------
function useInView(ref, opts = { threshold: 0.35 }) {
  const [inView, setInView] = bS(false);
  bE(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= (opts.threshold ?? 0.35)), {
      threshold: opts.threshold ?? 0.35,
      rootMargin: opts.rootMargin || "0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return inView;
}

// ---------- useSceneSteps — auto-step when section is in view ----------
function useSceneSteps(total, intervalMs, ref, opts = {}) {
  const [step, setStep] = bS(0);
  const [playing, setPlaying] = bS(false);
  const inView = useInView(ref, { threshold: opts.threshold ?? 0.4 });

  bE(() => {
    if (!inView) { setPlaying(false); return; }
    setPlaying(true);
    // Optional: reset to 0 on re-entry
    if (opts.resetOnEnter) setStep(0);
  }, [inView]);

  bE(() => {
    if (!playing) return;
    if (step >= total - 1) return;
    const t = setTimeout(() => setStep(s => s + 1), intervalMs);
    return () => clearTimeout(t);
  }, [playing, step, total, intervalMs]);

  return { step, total, inView, playing, setStep };
}

Object.assign(window, {
  DCMark, DCWordmark, DCLockup, DHBadge, TopNav,
  useInView, useSceneSteps,
});
