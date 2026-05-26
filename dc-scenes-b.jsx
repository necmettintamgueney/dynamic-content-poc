// Demo scenes 6-10: Generation, Category, QA, Locale, Cost.

const { useState: bbS, useEffect: bbE, useRef: bbR, useMemo: bbM } = React;

// ============================================================
// SCENE 6 — Content Generation (title morph through tiers)
// ============================================================
const GEN_TIERS = [
  { id: "raw",        label: "Vendor",     model: "—",                  title: "almarai full fat milk 1L",                                                  changes: "messy input · typos · no caps" },
  { id: "lite",       label: "Lite",       model: "DH-Title v3",        title: "Almarai Full Fat Milk 1L",                                                  changes: "Title case · unit normalized" },
  { id: "pro",        label: "Pro",        model: "GPT-4.1-mini",       title: "Almarai Full Fat Milk 1L — Fresh Dairy",                                    changes: "+ category descriptor" },
  { id: "plus",       label: "Plus",       model: "Claude 4 Sonnet",    title: "Almarai Full Fat Fresh Milk 1L — UHT Long Life",                            changes: "+ product type · processing" },
  { id: "enterprise", label: "Enterprise", model: "GPT-4.1",            title: "Almarai Full Fat Fresh Cow's Milk 1 Litre — UHT Long Life, No Preservatives", changes: "+ source · spelled unit · claims" },
];

const GEN_ATTRS = [
  { tier: "lite", name: "Brand",      value: "Almarai" },
  { tier: "lite", name: "Size",       value: "1L" },
  { tier: "pro",  name: "Fat",        value: "Full Fat" },
  { tier: "pro",  name: "Flavor",     value: "Plain" },
  { tier: "plus", name: "Processing", value: "UHT" },
  { tier: "plus", name: "Origin",     value: "Saudi Arabia" },
  { tier: "enterprise", name: "Storage",   value: "Ambient" },
  { tier: "enterprise", name: "Shelf-life", value: "6 months" },
];

function SceneGeneration() {
  const ref = bbR(null);
  // 0..4: each tier appears in sequence (raw included as 0). Pro = tier 2 → highlight at end.
  const { step } = useSceneSteps(5, 1700, ref, { threshold: 0.4 });
  const assignedIdx = 2; // Pro
  const assigned = GEN_TIERS[assignedIdx];

  return (
    <Scene id="generation" num={6} total={TOTAL_SCENES}
      kicker="Content generation" eyebrowTone="green"
      title="The title transforms — tier by tier."
      lede="The model picked in scene 2 runs against the tier picked in scene 4. Each tier adds more — better structure, deeper attributes, image verification at the top."
      message="Pro was the chosen tier for this product. The other tiers are shown so you can see what higher investment buys."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        {/* LEFT — tier ladder */}
        <DCCard padded>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Title transformation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GEN_TIERS.map((t, i) => {
              const visible = step >= i;
              const isAssigned = i === assignedIdx && step >= 4;
              const tierColor = t.id === "raw" ? "var(--dh-red)" : (TIER_INFO[t.id]?.color || "var(--ink)");
              const tierTint = t.id === "raw" ? "var(--red-tint)" : (TIER_INFO[t.id]?.tint || "var(--surface-2)");
              return (
                <div key={t.id} style={{
                  display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 14, alignItems: "start",
                  padding: 14,
                  background: isAssigned ? "var(--green-tint)" : tierTint,
                  border: `1px solid ${isAssigned ? "var(--green-edge)" : tierColor + "33"}`,
                  borderLeft: `3px solid ${isAssigned ? "var(--green-2)" : tierColor}`,
                  borderRadius: 8,
                  opacity: visible ? 1 : 0.15,
                  transform: visible ? "translateX(0)" : "translateX(-8px)",
                  transition: "all 380ms ease",
                }}>
                  <div style={{ minWidth: 92 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: tierColor }}/>
                      <span style={{ fontSize: 13, fontWeight: 700, color: tierColor }}>{t.label}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-mute)", marginTop: 3 }}>{t.model}</div>
                    {isAssigned && (
                      <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 7px", background: "var(--green-2)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, letterSpacing: 0.04 }}>
                        ASSIGNED
                      </div>
                    )}
                  </div>
                  <div>
                    {i === 0 ? (
                      <div className="mono" style={{ fontSize: 14, color: "var(--ink)" }}>"{t.title}"</div>
                    ) : (
                      <TokenTitle from={GEN_TIERS[i-1].title} to={t.title} fontSize={14}/>
                    )}
                    <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--ink-mute)", fontStyle: "italic" }}>{t.changes}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </DCCard>

        {/* RIGHT — attributes appearing */}
        <DCCard padded>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Attributes extracted</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {GEN_ATTRS.map((a, i) => {
              const tierIdx = GEN_TIERS.findIndex(t => t.id === a.tier);
              const visible = step >= tierIdx;
              const isPlus = a.tier === "plus" || a.tier === "enterprise";
              const wouldNeed = isPlus && step < tierIdx; // we still show as "would need"
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center",
                  padding: "8px 10px",
                  background: visible ? "var(--surface)" : "var(--surface-2)",
                  border: `1px solid ${visible ? "var(--green-edge)" : "var(--border)"}`,
                  borderRadius: 6,
                  opacity: visible ? 1 : 0.45,
                  transition: "all 400ms ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {visible ? <CheckBig size={14}/> : <span style={{ width: 14, height: 14, border: "1.5px dashed var(--border-strong)", borderRadius: "50%" }}/>}
                    <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{a.name}</span>
                  </div>
                  {visible ? (
                    <span className="mono" style={{ fontSize: 12, color: "var(--ink)" }}>{a.value}</span>
                  ) : (
                    <span style={{ fontSize: 10.5, color: "var(--ink-faint)", fontStyle: "italic" }}>needs {TIER_INFO[a.tier]?.label}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, padding: 10, background: "var(--blue-tint)", border: "1px solid var(--blue-edge)", borderRadius: 6, fontSize: 12, color: "var(--ink-soft)" }}>
            <strong style={{ color: "var(--blue-2)" }}>Tier controls depth.</strong> Pro stops at fat % and flavor; Plus adds processing and origin; Enterprise adds storage and shelf-life from image OCR.
          </div>
        </DCCard>
      </div>
    </Scene>
  );
}

// ============================================================
// SCENE 7 — Master Category Prediction
// ============================================================
function SceneCategory() {
  const ref = bbR(null);
  const { step } = useSceneSteps(6, 1900, ref, { threshold: 0.4 });
  // 0: query, 1: correct prediction, 2: wrong prediction, 3: agent corrects, 4: 3 agents validate, 5: golden updated

  return (
    <Scene id="category" num={7} total={TOTAL_SCENES}
      kicker="Master category prediction" eyebrowTone="red"
      title="The taxonomy decision — and the loop that improves it."
      lede="The product's embedding is compared against the golden dataset. If the model is uncertain or wrong, the agent's correction goes through a three-agent validation gate before it ever updates the truth set."
      message="The model improves itself. Every override that survives validation becomes the next batch's training signal. The golden dataset grows from real production work — not Jupyter notebooks."
    >
      <div ref={ref}>
        {/* Top — golden dataset query */}
        <DCCard padded style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <DCTag tone="red">Step 1</DCTag>
            <span className="eyebrow">Golden dataset · embedding query</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)", gap: 16, alignItems: "center" }}>
            <div className="mono" style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13 }}>
              "Almarai Full Fat Milk 1L"
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowRightSm size={16}/>
              <DCTag mono>cosine sim</DCTag>
              <ArrowRightSm size={16}/>
            </div>
            <div style={{ padding: "10px 12px", background: step >= 1 ? "var(--green-tint)" : "var(--surface-2)", border: `1px solid ${step >= 1 ? "var(--green-edge)" : "var(--border)"}`, borderRadius: 6, fontSize: 13, transition: "all 400ms ease" }}>
              <div className="mono" style={{ color: "var(--ink)" }}>Dairy › Fresh Milk</div>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                <ConfRow value={0.94} tone="green"/>
              </div>
            </div>
          </div>
        </DCCard>

        {/* Wrong example + correction */}
        {step >= 2 && (
          <DCCard padded className="fade-up" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <DCTag tone="red">Step 2</DCTag>
              <span className="eyebrow">A different product · low confidence</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)", gap: 16, alignItems: "center", marginBottom: 14 }}>
              <div className="mono" style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13 }}>
                "Nescafé Dolce Gusto Cappuccino 16 Capsules"
              </div>
              <ArrowRightSm size={16}/>
              <div style={{ padding: "10px 12px", background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: 6, fontSize: 13 }}>
                <div className="mono" style={{ color: "var(--ink)" }}>Beverages › Instant Coffee</div>
                <div style={{ marginTop: 4 }}><ConfRow value={0.62} tone="red"/></div>
              </div>
            </div>

            {step >= 3 && (
              <div className="fade-up" style={{ padding: 12, background: "var(--surface-2)", border: "1px dashed var(--border-strong)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Avatar2 initials="MS" color="var(--purple)"/>
                  <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>Content agent overrides</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--dh-red)", textDecoration: "line-through" }}>Instant Coffee</div>
                  <ArrowRightSm size={14}/>
                  <div className="mono" style={{ fontSize: 12, color: "var(--green-2)" }}>Hot Beverages › Coffee Capsules</div>
                </div>
              </div>
            )}
          </DCCard>
        )}

        {/* Validation gate */}
        {step >= 4 && (
          <DCCard padded className="fade-up" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <DCTag tone="blue">Step 3</DCTag>
              <span className="eyebrow">Multi-agent validation gate</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { name: "Category Expert LLM",  q: "Plausible given title + image?",                       v: "Yes" },
                { name: "Embedding Consistency", q: "Closer to proposed than original category?",         v: "Yes" },
                { name: "Cross-Reference",       q: "Confirmed in other regions?",                         v: "Yes" },
              ].map((a, i) => (
                <div key={i} style={{ padding: 12, background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 8 }}>
                  <div className="eyebrow" style={{ color: "var(--green-2)", marginBottom: 4 }}>Agent {i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{a.name}</div>
                  <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--ink-mute)", fontStyle: "italic", lineHeight: 1.45 }}>"{a.q}"</div>
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--green-2)", fontWeight: 600 }}>
                    <CheckBig size={12} animate/> {a.v}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, color: "var(--ink-soft)" }}>
              <DCTag tone="green" mono>3 / 3</DCTag>
              <span style={{ marginLeft: 8 }}>Auto-add to golden dataset</span>
            </div>
          </DCCard>
        )}

        {/* Loop closes */}
        {step >= 5 && (
          <DCCard padded className="fade-up" accent="var(--green-2)">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <DCTag tone="green">Step 4</DCTag>
              <span className="eyebrow" style={{ color: "var(--green-2)" }}>The loop closes</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Next time a Dolce Gusto product appears, the prediction lands at <strong style={{ color: "var(--green-2)" }}>0.88+ confidence</strong> — the agent doesn't have to override the same mistake. <strong style={{ color: "var(--ink)" }}>~1,400 new examples flow into the golden dataset every week</strong> from real corrections.
            </div>
          </DCCard>
        )}
      </div>
    </Scene>
  );
}

function ConfRow({ value, tone }) {
  const pct = Math.round(value * 100);
  const color = tone === "green" ? "var(--green)" : tone === "red" ? "var(--dh-red)" : "var(--amber)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 64, height: 4, background: "var(--surface)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
        <span style={{ display: "block", height: "100%", width: `${pct}%`, background: color, transition: "width 400ms ease" }}/>
      </span>
      <span className="mono" style={{ color, fontWeight: 600 }}>{pct}%</span>
    </span>
  );
}

function Avatar2({ initials, color }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: "50%",
      background: color, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, letterSpacing: 0.02,
    }}>{initials}</span>
  );
}

// ============================================================
// SCENE 8 — QA Gate
// ============================================================
const QA_CHECKS_PASS = [
  { name: "Language consistency", detail: "English title, English locale",                       ok: true },
  { name: "Title length",          detail: "42 characters · under 120 cap",                       ok: true },
  { name: "Required fields",       detail: "brand · size · fat % present",                        ok: true },
  { name: "Confidence threshold",  detail: "0.87 ≥ 0.70 (Pro tier bar)",                          ok: true },
  { name: "Image-title match",     detail: "Almarai logo detected in image",                      ok: true },
];

function SceneQA() {
  const ref = bbR(null);
  const { step } = useSceneSteps(QA_CHECKS_PASS.length + 2, 1100, ref, { threshold: 0.4 });
  // step 0..4: each check passes; step 5: published; step 6: failed example

  return (
    <Scene id="qa" num={8} total={TOTAL_SCENES}
      kicker="QA gate" eyebrowTone="green"
      title="Five checkpoints before anything ships."
      lede="Every enriched product passes through the same automated gate. Pass = auto-publish. Fail = a human-readable reason and a routed task for the agent."
      message="The QA layer and the model share the same checklist. The model isn't asked to be perfect — just to clear the bar that QA will check anyway."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24 }}>
        {/* LEFT — passing product */}
        <DCCard padded>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="eyebrow">Product · MPC-100001</div>
            <DCTag tone="green">Pro tier</DCTag>
          </div>

          <div className="mono" style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, marginBottom: 16, wordBreak: "break-word" }}>
            "Almarai Full Fat Milk 1L — Fresh Dairy"
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {QA_CHECKS_PASS.map((c, i) => {
              const checked = step >= i;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
                  padding: "10px 12px",
                  background: checked ? "var(--green-tint)" : "var(--surface-2)",
                  border: `1px solid ${checked ? "var(--green-edge)" : "var(--border)"}`,
                  borderRadius: 6,
                  opacity: checked ? 1 : 0.5,
                  transition: "all 320ms ease",
                }}>
                  {checked ? <CheckBig size={16} animate/> : <span style={{ width: 16, height: 16, border: "1.5px solid var(--border-strong)", borderRadius: "50%" }}/>}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-mute)", marginTop: 1 }}>{c.detail}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11.5, color: checked ? "var(--green-2)" : "var(--ink-faint)", fontWeight: 600 }}>
                    {checked ? "PASS" : "..."}
                  </span>
                </div>
              );
            })}
          </div>

          {step >= QA_CHECKS_PASS.length && (
            <div className="fade-up" style={{
              marginTop: 16, padding: "14px 16px",
              background: "var(--green-2)", color: "#fff", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <CheckBig size={20} color="#fff"/>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Auto-published</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>Live in Talabat catalog · 38 ms after generation</div>
              </div>
            </div>
          )}
        </DCCard>

        {/* RIGHT — failing example */}
        <DCCard padded>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="eyebrow">Different product · auto-rejected</div>
            <DCTag tone="red">Routed to agent</DCTag>
          </div>

          <div className="mono" style={{
            padding: "10px 12px", background: "var(--red-tint)",
            border: "1px solid var(--red-edge)", borderRadius: 6, fontSize: 13, marginBottom: 16, wordBreak: "break-word",
          }}>
            "Eti Strawberry Browni Intense Kek 160g"
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { name: "Language consistency", detail: 'Found "Strawberry" (EN) in Turkish title', ok: false },
              { name: "Title length",          detail: "32 characters",                            ok: true },
              { name: "Required fields",       detail: "brand · size present",                     ok: true },
            ].map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
                padding: "10px 12px",
                background: c.ok ? "var(--green-tint)" : "var(--red-tint)",
                border: `1px solid ${c.ok ? "var(--green-edge)" : "var(--red-edge)"}`,
                borderRadius: 6,
                opacity: step >= 6 ? 1 : 0.3,
                transition: "all 320ms ease",
              }}>
                {c.ok ? <CheckBig size={16}/> : <XBig size={16}/>}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: c.ok ? "var(--ink-mute)" : "var(--dh-red)", marginTop: 1 }}>{c.detail}</div>
                </div>
                <span className="mono" style={{ fontSize: 11.5, color: c.ok ? "var(--green-2)" : "var(--dh-red)", fontWeight: 600 }}>
                  {c.ok ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>

          {step >= 6 && (
            <div className="fade-up" style={{
              marginTop: 16, padding: "14px 16px",
              background: "var(--surface-2)", border: "1px dashed var(--border-strong)", borderRadius: 10,
            }}>
              <div className="eyebrow" style={{ marginBottom: 6, color: "var(--dh-red)" }}>Reason for the agent</div>
              <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>
                Foreign-language word detected in Turkish title. Replace <span className="mono" style={{ color: "var(--dh-red)" }}>"Strawberry"</span> with <span className="mono" style={{ color: "var(--green-2)" }}>"Çilekli"</span> — and add the Strawberry → Çilekli mapping to the locale dictionary so this doesn't repeat.
              </div>
            </div>
          )}
        </DCCard>
      </div>
    </Scene>
  );
}

// ============================================================
// SCENE 9 — Locale Showcase
// ============================================================
function SceneLocale() {
  const ref = bbR(null);
  const { step } = useSceneSteps(3, 1800, ref, { threshold: 0.4 });

  const cols = [
    { plat: "Talabat",    loc: "EN", region: "MENA",       raw: "almarai full fat milk 1L",            enriched: "Almarai Full Fat Milk 1L — Fresh Dairy",   format: "Brand-first",     accent: "var(--dh-red)" },
    { plat: "PedidosYa",   loc: "ES", region: "LATAM",     raw: "la serenisima leche entera 1lt sachet", enriched: "Leche Entera La Serenísima Sachet 1L",      format: "Generic-first",   accent: "var(--green-2)" },
    { plat: "Yemeksepeti", loc: "TR", region: "Turkey",    raw: "pinar tam yagli sut 1l",              enriched: "Pınar Tam Yağlı Günlük Süt 1L",               format: "Brand-first",     accent: "var(--amber)" },
  ];

  return (
    <Scene id="locale" num={9} total={TOTAL_SCENES}
      kicker="Locale showcase" eyebrowTone="amber"
      title="One pipeline. Three languages. Three structures."
      lede="The same milk product, processed by the same system, lands differently in each market — because the platform-owned rules in scene 5 say so."
      message="This isn't translation. It's locale-aware enrichment. Word order, unit formatting, and variant naming all change with the platform."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {cols.map((c, i) => (
          <DCCard key={i} padded accent={c.accent} style={{
            opacity: step >= 0 ? 1 : 0,
            transform: step >= 0 ? "translateY(0)" : "translateY(8px)",
            transition: `all 500ms ease ${i * 150}ms`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{c.plat}</div>
                <div className="eyebrow" style={{ marginTop: 2, color: c.accent }}>{c.region}</div>
              </div>
              <DCTag mono>{c.loc}</DCTag>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="eyebrow" style={{ color: "var(--dh-red)", marginBottom: 6 }}>Raw</div>
              <div className="mono" style={{ padding: "8px 10px", background: "var(--red-tint)", border: "1px solid var(--red-edge)", borderRadius: 6, fontSize: 12, wordBreak: "break-word" }}>"{c.raw}"</div>
            </div>

            <div style={{ opacity: step >= 1 ? 1 : 0.2, transition: "opacity 500ms ease" }}>
              <div className="eyebrow" style={{ color: "var(--green-2)", marginBottom: 6 }}>Enriched</div>
              <div className="mono" style={{ padding: "8px 10px", background: "var(--green-tint)", border: "1px solid var(--green-edge)", borderRadius: 6, fontSize: 12.5, wordBreak: "break-word", color: "var(--ink)" }}>{c.enriched}</div>
            </div>

            {step >= 2 && (
              <div className="fade-up" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--border)" }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Word order</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>{c.format}</div>
              </div>
            )}
          </DCCard>
        ))}
      </div>
    </Scene>
  );
}

// ============================================================
// SCENE 10 — Cost Projection
// ============================================================
function useAnimatedNumber(target, ms = 1400, active = false) {
  const [val, setVal] = bbS(0);
  bbE(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, active]);
  return val;
}

function fmtUSD(n) { return "$" + Math.round(n).toLocaleString(); }
function fmtInt(n) { return Math.round(n).toLocaleString(); }

function SceneCost() {
  const ref = bbR(null);
  const { step } = useSceneSteps(4, 1800, ref, { threshold: 0.35 });
  const active = step >= 1;
  const compare = step >= 2;
  const savingsShown = step >= 3;

  const tieredTotal = useAnimatedNumber(6150, 1400, active);
  const uniformTotal = useAnimatedNumber(30000, 1400, compare);
  const savings = useAnimatedNumber(23850, 1600, savingsShown);
  const savingsPct = useAnimatedNumber(79.5, 1600, savingsShown);

  const rows = [
    { tier: "lite",       pct: 45, count: 450000, cost: 0.001, total:   450 },
    { tier: "pro",        pct: 30, count: 300000, cost: 0.003, total:   900 },
    { tier: "plus",       pct: 18, count: 180000, cost: 0.015, total:  2700 },
    { tier: "enterprise", pct: 7,  count: 70000,  cost: 0.030, total:  2100 },
  ];

  return (
    <Scene id="cost" num={10} total={TOTAL_SCENES}
      kicker="Cost projection · 1M products" eyebrowTone="red"
      title="Tiered investment isn't just cheaper. It's smarter."
      lede="Scaled to one million products, the tier mix maps spend to where it actually returns. Most products get baseline hygiene; a few get the full treatment."
      message="The argument isn't only the dollar amount. 450,000 long-tail SKUs don't need Enterprise enrichment. 70,000 strategic-partner SKUs deserve every bit of it."
    >
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        {/* LEFT — tier mix table */}
        <DCCard padded>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Tiered mix · 1,000,000 products</div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 100px 90px 90px", gap: 0, minWidth: 460 }}>
            {["Tier", "Mix", "Products", "Per product", "Total"].map((h, i) => (
              <div key={i} className="eyebrow" style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", textAlign: i >= 1 ? "right" : "left" }}>{h}</div>
            ))}
            {rows.map((r, i) => {
              const T = TIER_INFO[r.tier];
              return (
                <React.Fragment key={i}>
                  <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.color }}/>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{T.label}</span>
                  </div>
                  <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontSize: 13.5, color: "var(--ink-soft)" }}>{r.pct}%</div>
                  <div className="mono" style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontSize: 13, color: "var(--ink)" }}>{fmtInt(r.count)}</div>
                  <div className="mono" style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontSize: 13, color: "var(--ink-soft)" }}>{T.cost}</div>
                  <div className="mono" style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{fmtUSD(r.total)}</div>
                </React.Fragment>
              );
            })}
            <div style={{ padding: "14px 10px", fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Total</div>
            <div></div>
            <div className="mono" style={{ padding: "14px 10px", textAlign: "right", fontSize: 13, color: "var(--ink-soft)" }}>1,000,000</div>
            <div></div>
            <div className="mono" style={{ padding: "14px 10px", textAlign: "right", fontSize: 18, fontWeight: 700, color: "var(--green-2)" }}>{fmtUSD(tieredTotal)}</div>
          </div>
          </div>
        </DCCard>

        {/* RIGHT — comparison + savings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {compare && (
            <DCCard padded className="fade-up" style={{ background: "var(--red-tint)", borderColor: "var(--red-edge)" }}>
              <div className="eyebrow" style={{ color: "var(--dh-red)" }}>If everything ran Enterprise</div>
              <div className="mono" style={{ marginTop: 8, fontSize: 32, fontWeight: 700, color: "var(--dh-red)", letterSpacing: "-0.01em" }}>{fmtUSD(uniformTotal)}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-mute)" }}>1M × $0.030 · same model for every product</div>
            </DCCard>
          )}

          {savingsShown && (
            <DCCard padded className="fade-up" style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Savings</div>
              <div className="mono" style={{ marginTop: 8, fontSize: 48, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1 }}>
                {fmtUSD(savings)}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  padding: "4px 10px",
                  background: "var(--green)", color: "#fff",
                  borderRadius: 999, fontSize: 13, fontWeight: 700,
                }}>
                  −{savingsPct.toFixed(1)}%
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>per million products</div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>
                No quality loss for Lite/Pro products — they don't need Enterprise depth.
              </div>
            </DCCard>
          )}

          {!compare && active && (
            <DCCard padded className="fade-up" style={{ background: "var(--surface-2)" }}>
              <div className="eyebrow">Comparing to…</div>
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                Scroll a moment longer to see what the same million products would cost without tiering.
              </div>
            </DCCard>
          )}
        </div>
      </div>
    </Scene>
  );
}

Object.assign(window, {
  SceneGeneration, SceneCategory, SceneQA, SceneLocale, SceneCost,
});
