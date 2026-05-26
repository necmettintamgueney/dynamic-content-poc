// Demo scenes 1-5: Ingestion, Model Store, Product Analysis, Tier Assignment, Guidelines.

const { useState: aS, useEffect: aE, useRef: aR, useMemo: aM } = React;

const TOTAL_SCENES = 10;

// ============================================================
// SCENE 1 — Data Ingestion
// ============================================================
function SceneIngestion() {
  const ref = aR(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const sources = [
    { vendor: "Al-Maha Mini Market",  platform: "Talabat",     locale: "UAE",       rows: 47,    delay: 0 },
    { vendor: "Carrefour Hypermarket", platform: "Talabat",     locale: "MENA",      rows: 9842,  delay: 220 },
    { vendor: "Almacen Don Pedro",     platform: "PedidosYa",   locale: "AR",        rows: 312,   delay: 440 },
    { vendor: "Migros Sanal Market",   platform: "Yemeksepeti", locale: "TR",        rows: 1276,  delay: 660 },
    { vendor: "Quick Stop Lahore",     platform: "Talabat",     locale: "PK",        rows: 88,    delay: 880 },
  ];

  return (
    <Scene id="ingestion" num={1} total={TOTAL_SCENES}
      kicker="Data Ingestion" eyebrowTone="red"
      title="Many vendors. Many platforms. One pipeline."
      lede="Products enter from grocery vendors, retail chains, and strategic partners — across three platforms and 70+ countries. Every upload feeds the same system."
      message="The system normalizes shape and provenance before anything else happens. Every product is tagged with its source from the first millisecond."
    >
      <div ref={ref} style={{ position: "relative", padding: "20px 0", minHeight: 420 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px minmax(0, 1fr)", gap: 24, alignItems: "center" }}>
          {/* LEFT — incoming CSV files */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sources.map((s, i) => (
              <div key={i}
                style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
                  padding: "12px 14px",
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-1)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 500ms ease ${s.delay}ms, transform 500ms ease ${s.delay}ms`,
                }}>
                <CSVIcon/>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.vendor}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-mute)" }}>{s.platform} · {s.locale}</div>
                </div>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-mute)" }}>{s.rows.toLocaleString()} rows</span>
              </div>
            ))}
          </div>

          {/* CENTER — pipeline + animated flow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <FlowPipe inView={inView}/>
          </div>

          {/* RIGHT — intake hub */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <DCCard padded style={{
              padding: 26, textAlign: "center", minWidth: 220,
              background: "var(--ink)", color: "#fff", borderColor: "var(--ink)",
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.96)",
              transition: "opacity 600ms ease 900ms, transform 600ms ease 900ms",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#fff" }}>
                <DCMark size={42}/>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.015em" }}>Dynamic Content</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Intake</div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", gap: 4 }}>
                <Stat dark v="11,565" l="products this batch"/>
                <Stat dark v="3" l="platforms · 5 vendors"/>
              </div>
            </DCCard>
          </div>
        </div>
      </div>
    </Scene>
  );
}

function CSVIcon() {
  return (
    <div style={{
      width: 36, height: 44, position: "relative",
      background: "var(--surface-2)", border: "1px solid var(--border-strong)",
      borderRadius: 4,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3,
    }}>
      <div style={{ fontSize: 8.5, fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink-mute)" }}>CSV</div>
      <div style={{ width: 22, height: 2, background: "var(--border-strong)", borderRadius: 1 }}/>
      <div style={{ width: 18, height: 2, background: "var(--border-strong)", borderRadius: 1 }}/>
      <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "var(--bg)", borderLeft: "1px solid var(--border-strong)", borderBottom: "1px solid var(--border-strong)" }}/>
    </div>
  );
}

function FlowPipe({ inView }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 220 }}>
      <svg viewBox="0 0 220 220" width="100%" height="100%" preserveAspectRatio="none">
        {/* converging lines */}
        {[40, 80, 110, 140, 180].map((y, i) => (
          <path key={i} d={`M 0 ${y} Q 110 ${y}, 200 110`}
            stroke={inView ? "var(--dh-red)" : "var(--border)"}
            strokeWidth="1.4" fill="none" opacity={inView ? 0.7 : 0.3}
            strokeDasharray="3 4"
            style={{ transition: "stroke 500ms ease, opacity 500ms ease" }}/>
        ))}
        {/* flowing dots */}
        {inView && [40, 80, 110, 140, 180].map((y, i) => (
          <circle key={i} r="3.5" fill="var(--dh-red)">
            <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${i * 0.18}s`}>
              <mpath href={`#flowPath${i}`}/>
            </animateMotion>
          </circle>
        ))}
        {[40, 80, 110, 140, 180].map((y, i) => (
          <path key={`p${i}`} id={`flowPath${i}`} d={`M 0 ${y} Q 110 ${y}, 200 110`} fill="none" stroke="none"/>
        ))}
      </svg>
    </div>
  );
}

function Stat({ v, l, dark = false }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: dark ? "#fff" : "var(--ink)" }}>{v}</div>
      <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.55)" : "var(--ink-mute)" }}>{l}</div>
    </div>
  );
}

// ============================================================
// SCENE 2 — Model Store
// ============================================================
function SceneModelStore() {
  const ref = aR(null);
  const { step } = useSceneSteps(3, 2400, ref, { threshold: 0.4 });
  // step 0: base table; step 1: highlight selection; step 2: swap animation

  const tasks = [
    { task: "Title Generation",     model: "Claude 4 Sonnet",  acc: 92, cost: 15, lat: 380, swapTo: null },
    { task: "Attribute Extraction", model: "GPT-4.1-mini",     acc: 88, cost: 3,  lat: 220, swapTo: { from: "GPT-4.1-mini", to: "Claude 4 Haiku", reason: "same quality, 40% cheaper" } },
    { task: "Category Prediction",  model: "Embed-v2",         acc: 86, cost: 5,  lat: 90,  swapTo: null },
    { task: "Variant Grouping",     model: "GPT-4.1-mini",     acc: 90, cost: 4,  lat: 240, swapTo: null },
    { task: "Image Analysis",       model: "GPT-4.1",          acc: 94, cost: 30, lat: 600, swapTo: null },
  ];

  return (
    <Scene id="model-store" num={2} total={TOTAL_SCENES}
      kicker="Model Store · the brain" eyebrowTone="blue"
      title="The model behind every task is chosen, not assigned."
      lede="Before a single product moves, the Model Store picks the most cost-effective model that clears each task's quality bar — per tier. The benchmark runs weekly."
      message="A new model arriving next Tuesday gets benchmarked, scored, and rotated in automatically. No development project. No engineering trade-off conversation."
    >
      <div ref={ref}>
        <DCCard padded>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="eyebrow">Weekly benchmark</span>
              <DCTag tone="green">Active</DCTag>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--ink-mute)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulseDot 1.6s ease-in-out infinite" }}/>
                Run · Mon 02:00 UTC
              </span>
              <StepIndicator step={step} total={3} tone="blue"/>
            </div>
          </div>

          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 90px 90px 80px", gap: 0, alignItems: "stretch", minWidth: 600 }}>
            {["Task", "Current model", "Accuracy", "¢ / 1k", "ms"].map((h, i) => (
              <div key={i} className="eyebrow" style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", textAlign: i >= 2 ? "right" : "left" }}>{h}</div>
            ))}
            {tasks.map((t, i) => {
              const isHighlighted = step >= 1 && t.swapTo;
              const swapped = step >= 2 && t.swapTo;
              const displayModel = swapped ? t.swapTo.to : t.model;
              return (
                <React.Fragment key={i}>
                  <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", fontSize: 14, color: "var(--ink)", fontWeight: 500, background: isHighlighted ? "var(--blue-tint)" : "transparent", transition: "background 400ms ease" }}>{t.task}</div>
                  <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", fontSize: 13.5, fontFamily: "var(--mono)", color: "var(--ink)", background: isHighlighted ? "var(--blue-tint)" : "transparent", transition: "background 400ms ease" }}>
                    {swapped ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ color: "var(--ink-faint)", textDecoration: "line-through" }}>{t.swapTo.from}</span>
                        <ArrowRightSm size={14}/>
                        <span style={{ color: "var(--green-2)", fontWeight: 600 }}>{t.swapTo.to}</span>
                      </span>
                    ) : displayModel}
                  </div>
                  <Bar value={t.acc} max={100} suffix="%" color="var(--green)" background={isHighlighted ? "var(--blue-tint)" : "transparent"}/>
                  <Bar value={t.cost} max={30} suffix="¢" color="var(--amber)" background={isHighlighted ? "var(--blue-tint)" : "transparent"}/>
                  <Bar value={t.lat} max={600} suffix="" color="var(--blue)" background={isHighlighted ? "var(--blue-tint)" : "transparent"}/>
                </React.Fragment>
              );
            })}
          </div>
          </div>

          {step >= 2 && (
            <div className="fade-up" style={{ marginTop: 16, padding: 14, background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckBig size={18}/>
              <div style={{ fontSize: 14, color: "var(--ink)" }}>
                <strong style={{ color: "var(--green-2)" }}>Selection Agent swapped Attribute Extraction →</strong> Claude 4 Haiku ships at the same quality for 40% less. The pipeline switches over on the next batch.
              </div>
            </div>
          )}
        </DCCard>
      </div>
    </Scene>
  );
}

function Bar({ value, max, suffix, color, background }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", background, transition: "background 400ms ease" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 600ms ease" }}/>
      </div>
    </div>
  );
}

// ============================================================
// SCENE 3 — Product Analysis
// ============================================================
function SceneProductAnalysis() {
  const ref = aR(null);
  const { step } = useSceneSteps(5, 1800, ref, { threshold: 0.4 });
  // 0: raw arrives, 1: image loads, 2: scan, 3: signals extracted, 4: done

  const signals = [
    { label: "Brand",    value: "Almarai",      tone: "green" },
    { label: "Category", value: "Dairy",        tone: "green" },
    { label: "Image",    value: "Milk verified", tone: "green" },
    { label: "Language", value: "English",      tone: "blue"  },
  ];

  return (
    <Scene id="analysis" num={3} total={TOTAL_SCENES}
      kicker="Product analysis" eyebrowTone="purple"
      title="One product. Image and title read together."
      lede="The pipeline doesn't process titles in isolation. The image is OCR'd and visually parsed alongside; the two signals cross-check each other."
      message="By the end of analysis the system knows brand, category, language, and what's in the image — before any enrichment runs."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24, alignItems: "stretch" }}>
        {/* LEFT — product card with scan animation */}
        <DCCard padded style={{ padding: 24, minHeight: 360 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>MPC-100001 · from Carrefour batch</div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "start" }}>
            {/* Product image placeholder */}
            <div style={{
              width: 120, height: 160, borderRadius: 8,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
              opacity: step >= 1 ? 1 : 0.3, transition: "opacity 500ms ease",
            }}>
              {/* Stylized milk carton */}
              <svg viewBox="0 0 80 110" width="64" height="92">
                <path d="M 10 28 L 70 28 L 70 100 Q 70 105 65 105 L 15 105 Q 10 105 10 100 Z" fill="#FFF" stroke="var(--border-strong)" strokeWidth="1.5"/>
                <path d="M 10 28 L 25 8 L 55 8 L 70 28" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.5"/>
                <rect x="22" y="44" width="36" height="6" fill="var(--blue)"/>
                <text x="40" y="68" textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="9" fill="var(--ink)">ALMARAI</text>
                <text x="40" y="80" textAnchor="middle" fontFamily="Outfit" fontWeight="500" fontSize="7" fill="var(--ink-mute)">Full Fat</text>
                <text x="40" y="92" textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="8" fill="var(--ink)">1L</text>
              </svg>
              {step >= 2 && step < 4 && (
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 30,
                  background: "linear-gradient(180deg, transparent, var(--green) 50%, transparent)",
                  opacity: 0.4,
                  animation: "scanLine 1.6s ease-in-out infinite",
                }}/>
              )}
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: 6, color: "var(--dh-red)" }}>Vendor submitted</div>
              <div className="mono" style={{
                fontSize: 14, padding: "8px 12px",
                background: "var(--red-tint)", border: "1px solid var(--red-edge)",
                borderRadius: 8, color: "var(--ink)",
              }}>"almarai full fat milk 1L"</div>

              <div style={{ marginTop: 16 }} className="eyebrow">Extracted signals</div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {signals.map((s, i) => {
                  const visible = step >= 3 || (step >= 2 && i === 0);
                  return (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "80px 16px 1fr", gap: 8, alignItems: "center",
                      padding: "6px 10px", borderRadius: 6,
                      background: visible ? "var(--green-tint)" : "var(--surface-2)",
                      border: `1px solid ${visible ? "var(--green-edge)" : "var(--border)"}`,
                      opacity: visible ? 1 : 0.35,
                      transition: "all 400ms ease",
                    }}>
                      <span className="eyebrow" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{s.label}</span>
                      {visible ? <CheckBig size={14}/> : <span style={{ width: 14 }}/>}
                      <span className="mono" style={{ fontSize: 12.5, color: "var(--ink)" }}>{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DCCard>

        {/* RIGHT — pipeline state */}
        <DCCard padded style={{ padding: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Pipeline state · live</div>
          {[
            { name: "OCR — pack reading",   sub: "Read text from carton",          done: step >= 1 },
            { name: "Visual category",       sub: "Match shape against known SKUs", done: step >= 2 },
            { name: "Brand recognition",      sub: "Title + image cross-check",     done: step >= 3 },
            { name: "Language detection",     sub: "Locale → enrichment locale",    done: step >= 3 },
            { name: "Confidence scoring",     sub: "Each signal weighted",          done: step >= 4 },
          ].map((s, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 12, alignItems: "center",
              padding: "10px 0",
              borderBottom: i < 4 ? "1px dashed var(--border)" : "none",
            }}>
              <div>
                {s.done ? <CheckBig size={20} animate/> :
                  <div style={{ width: 20, height: 20, border: "1.5px solid var(--border-strong)", borderRadius: "50%", animation: "spinSlow 1.4s linear infinite", borderTopColor: "var(--ink-mute)", borderRightColor: "transparent" }}/>
                }
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: s.done ? 600 : 500, color: "var(--ink)" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 1 }}>{s.sub}</div>
              </div>
              <span className="mono" style={{ fontSize: 11.5, color: s.done ? "var(--green-2)" : "var(--ink-faint)" }}>
                {s.done ? "✓" : "..."}
              </span>
            </div>
          ))}
        </DCCard>
      </div>
    </Scene>
  );
}

// ============================================================
// SCENE 4 — Tier Assignment
// ============================================================
function SceneTierAssignment() {
  const ref = aR(null);
  const { step } = useSceneSteps(5, 2000, ref, { threshold: 0.4 });
  // 0: vendor tier check, 1: alternative shown, 2: ROI assessment, 3: override applied, 4: unassigned callout

  return (
    <Scene id="tier" num={4} total={TOTAL_SCENES}
      kicker="Tier assignment" eyebrowTone="amber"
      title="Investment is decided per product, not per vendor."
      lede="The vendor sets a tier floor. Then expected return — based on the product's value signal across the catalog — moves it up or down."
      message="Tier isn't an attribute. It's a continuous decision that combines who sent us the product with how much it's worth enriching."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
        {/* Step 1: Vendor tier check */}
        <DCCard padded>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <DCTag tone="amber" mono>Step 1</DCTag>
              <span className="eyebrow">Vendor tier check</span>
            </div>
            <StepIndicator step={Math.min(step, 4)} total={4} tone="amber"/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <VendorPanel name="Al-Maha Mini Market" sub="1 store · UAE" tier="lite" highlight={step >= 0}/>
            <VendorPanel name="Carrefour Hypermarket" sub="220 stores · UAE" tier="enterprise" highlight={step >= 1}/>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-mute)", lineHeight: 1.5 }}>
            Our product — <strong style={{ color: "var(--ink)" }}>Almarai Full Fat Milk 1L</strong> — was uploaded by Al-Maha. Preliminary tier: <TierBadge tier="lite" size="sm"/>
          </div>
        </DCCard>

        {/* Step 2: ROI Assessment */}
        {step >= 2 && (
          <DCCard padded className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <DCTag tone="amber" mono>Step 2</DCTag>
              <span className="eyebrow">ROI assessment · similar product lookup</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
                  Found <strong style={{ color: "var(--ink)" }}>847 similar dairy products</strong> in the catalog. Almarai Full Fat is a top-seller across MENA.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    "Almarai Skim Milk 1L",
                    "Almarai Lactose Free 1L",
                    "Almarai Long Life Milk 1L",
                    "Almarai Fresh Milk 1.5L",
                    "Almarai UHT Milk 2L",
                  ].map((p, i) => (
                    <span key={i} className="mono" style={{ fontSize: 11.5, padding: "4px 9px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 999, color: "var(--ink-soft)" }}>{p}</span>
                  ))}
                </div>
              </div>
              <div style={{
                padding: 14, background: "var(--amber-tint)", border: "1px solid var(--amber-edge)",
                borderRadius: 10,
              }}>
                <div className="eyebrow" style={{ color: "var(--amber)" }}>Value signal</div>
                <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Top 5%</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>by volume · MENA dairy</div>
              </div>
            </div>
          </DCCard>
        )}

        {/* Step 3: Final tier */}
        {step >= 3 && (
          <DCCard padded className="fade-up" accent="var(--green-2)" style={{ background: "var(--green-tint)", borderColor: "var(--green-edge)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <DCTag tone="green" mono>Step 3</DCTag>
              <span className="eyebrow" style={{ color: "var(--green-2)" }}>ROI override applied</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <TierBadge tier="lite"/>
              <ArrowRightSm size={18} color="var(--green-2)"/>
              <TierBadge tier="pro"/>
              <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>
                High-value brand at a Lite vendor. Worth the investment.
              </span>
            </div>
          </DCCard>
        )}

        {/* Step 4: Unassigned products */}
        {step >= 4 && (
          <DCCard padded className="fade-up" style={{ borderStyle: "dashed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <DCTag mono>Edge case</DCTag>
              <span className="eyebrow">Products not yet assigned</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Products without a vendor assignment stay at <TierBadge tier="lite" size="sm"/> by default. The moment a vendor is set in the catalog tool, the tier re-evaluates automatically.
            </div>
          </DCCard>
        )}
      </div>
    </Scene>
  );
}

function VendorPanel({ name, sub, tier, highlight }) {
  return (
    <div style={{
      padding: 14,
      background: highlight ? "var(--surface)" : "var(--surface-2)",
      border: `1px solid ${highlight ? TIER_INFO[tier].color + "60" : "var(--border)"}`,
      borderLeft: `3px solid ${TIER_INFO[tier].color}`,
      borderRadius: 8,
      opacity: highlight ? 1 : 0.5,
      transition: "all 400ms ease",
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{name}</div>
      <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{sub}</div>
      <div style={{ marginTop: 10 }}>
        <TierBadge tier={tier} size="sm"/>
      </div>
    </div>
  );
}

// ============================================================
// SCENE 5 — Guidelines
// ============================================================
function SceneGuidelines() {
  const ref = aR(null);
  const { step } = useSceneSteps(4, 2400, ref, { threshold: 0.4 });
  // 0: single guideline written, 1: zoom out / category grid, 2: locale variants, 3: ownership model

  return (
    <Scene id="guidelines" num={5} total={TOTAL_SCENES}
      kicker="Guidelines · the quality target" eyebrowTone="blue"
      title="Quality is defined upfront — not discovered."
      lede="Per category, per locale, what 'good' looks like is written before the model runs. The same checklist applies to generation and QA."
      message="Hybrid ownership: a central team owns the structure, platforms own locale and category substance. Each side does what it's best at."
    >
      <div ref={ref}>
        {/* Step 0 — single guideline being written */}
        <div style={{
          display: "grid", gridTemplateColumns: step >= 1 ? "minmax(0, 320px) minmax(0, 1fr)" : "1fr",
          gap: 18, transition: "all 600ms ease", alignItems: "start",
        }}>
          <DCCard padded style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <DCTag tone="blue">Dairy › Milk</DCTag>
              <span className="eyebrow">Guideline · v3.2</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 14 }}>
              Title must include brand, fat percentage, processing type, and size.
            </div>
            <div className="mono" style={{
              padding: "10px 12px", background: "var(--surface-2)",
              border: "1px solid var(--border)", borderRadius: 8,
              fontSize: 12.5, lineHeight: 1.6, color: "var(--ink)",
            }}>
              [Brand]&nbsp;[Fat]&nbsp;[Processing]&nbsp;Milk&nbsp;[Size]
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {["Fat: Full Fat / Low Fat / Skimmed", "Processing: UHT / Pasteurized / Fresh", "Size: standard units (L / mL)"].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-soft)" }}>
                  <CheckBig size={13}/> {r}
                </div>
              ))}
            </div>
          </DCCard>

          {/* Step 1 — Category grid */}
          {step >= 1 && (
            <div className="fade-up">
              <span className="eyebrow" style={{ display: "block", marginBottom: 10 }}>… and dozens more like it</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                {[
                  { cat: "Beverages",     depth: "full",    tone: "blue" },
                  { cat: "Cleaning",      depth: "full",    tone: "blue" },
                  { cat: "Electronics",   depth: "full",    tone: "blue" },
                  { cat: "Pharma",        depth: "full",    tone: "blue" },
                  { cat: "Baby Care",     depth: "full",    tone: "blue" },
                  { cat: "Fresh Produce", depth: "partial", tone: "amber" },
                  { cat: "Personal Care", depth: "full",    tone: "blue" },
                  { cat: "Snacks",        depth: "partial", tone: "amber" },
                  { cat: "Frozen",        depth: "partial", tone: "amber" },
                  { cat: "Tobacco",       depth: "stub",    tone: "neutral" },
                  { cat: "Stationery",    depth: "stub",    tone: "neutral" },
                  { cat: "Pet",           depth: "partial", tone: "amber" },
                ].map((c, i) => (
                  <div key={i} style={{
                    padding: "10px 12px",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderLeft: `3px solid ${toneColor(c.tone)}`,
                    borderRadius: 6,
                    fontSize: 13, color: "var(--ink)", fontWeight: 500,
                  }}>
                    {c.cat}
                    <div style={{ fontSize: 10.5, color: "var(--ink-mute)", marginTop: 2 }}>{c.depth === "full" ? "Detailed" : c.depth === "partial" ? "Partial" : "Stub"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Locale variants */}
        {step >= 2 && (
          <div className="fade-up" style={{ marginTop: 22 }}>
            <span className="eyebrow" style={{ display: "block", marginBottom: 10 }}>Same rule · three locales</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { plat: "Talabat", loc: "EN", title: "Almarai Full Fat UHT Milk 1L",  wo: "Brand-first",   tone: "red" },
                { plat: "PedidosYa", loc: "ES", title: "Leche Entera UHT Almarai 1L", wo: "Generic-first", tone: "green" },
                { plat: "Yemeksepeti", loc: "TR", title: "Pınar Tam Yağlı UHT Süt 1L",   wo: "Brand-first",   tone: "amber" },
              ].map((l, i) => (
                <div key={i} style={{
                  padding: 14,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderTop: `3px solid ${toneColor(l.tone)}`,
                  borderRadius: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{l.plat}</span>
                    <DCTag mono>{l.loc}</DCTag>
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink)", padding: "8px 10px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6 }}>{l.title}</div>
                  <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--ink-mute)" }}>{l.wo}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Ownership model */}
        {step >= 3 && (
          <div className="fade-up" style={{ marginTop: 22 }}>
            <span className="eyebrow" style={{ display: "block", marginBottom: 10, color: "var(--green-2)" }}>Hybrid ownership · recommended</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 14, background: "var(--blue-tint)", border: "1px solid var(--blue-edge)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <DCTag tone="blue">Central</DCTag>
                  <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>structure · framework</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55 }}>
                  Title format · attribute tiers · QA thresholds · auto-reject rules
                </div>
              </div>
              <div style={{ padding: 14, background: "var(--amber-tint)", border: "1px solid var(--amber-edge)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <DCTag tone="amber">Platform</DCTag>
                  <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>substance · locale</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55 }}>
                  Category rules · translations · regional product knowledge · local certifications
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}

Object.assign(window, {
  TOTAL_SCENES, SceneIngestion, SceneModelStore, SceneProductAnalysis, SceneTierAssignment, SceneGuidelines,
});
