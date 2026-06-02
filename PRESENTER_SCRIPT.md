# Presenter Script -- Dynamic Content Strategy

Two parts: the Strategy Walkthrough (~15 min) and the Pipeline Demo (~10 min). The Strategy explains what's broken and how we fix it. The Demo shows the fix in action, end to end.

---

## Part 1: Strategy Walkthrough

Open `Walkthrough.html`. Use arrow keys or click to advance.

---

### Cover

> We have two AI systems -- one that enriches product content, one that predicts product categories. Both are live in production across Talabat, PedidosYa, and Yemeksepeti. Both have the same structural problem. This walkthrough lays out ten specific issues, then shows how one architecture resolves all of them.

### Two AI Systems

> On the left, content enrichment -- the system that turns a messy vendor upload like "almarai full fat milk 1L" into a structured, complete product listing. On the right, category prediction -- the system that decides where that product lives in the taxonomy. These two systems were built separately, by different teams, at different times. They don't share models, QA, or feedback loops. That's the root of most of what follows.

### The Cast

> Three groups feel the pain. App customers see incomplete listings -- no fat percentage, no size variant, wrong category. They pick the wrong product or they leave. Content agents spend most of their day fixing the same AI mistakes -- same typos, same missing attributes, same wrong categories -- with no feedback to the model. And vendors submit messy spreadsheets expecting retail-grade output.

---

### P1: No Cost Signal Before Design

> Enrichment cost isn't part of the product decision. Whether a product is a top-seller driving significant GMV or a niche item in a single store, it enters the same pipeline at the same cost. The system has no way to match investment to expected return before work begins.

### P2: Uniform Investment per Product

> Every product gets the same model, the same QA depth, the same cost. A long-tail SKU with 10 views a month gets identical treatment to a best-seller with 100,000 views. There's no mechanism to invest more in high-return products or less in low-traffic ones.

### P3: High Title Correction Rate

> Two of every three AI-generated titles need a human fix. And the corrections follow predictable patterns -- "add 1 Piece" alone accounts for 19 to 34 percent of all corrections. But the model never learns from them. Agents fix the same mistakes day after day.

### P4: Slow Model Evaluation

> There's no infrastructure to benchmark or swap models. The system was built around a single model with no abstraction layer, so each evaluation requires custom engineering. This isn't a team gap -- it's missing infrastructure. Better, cheaper models ship every week, but there's no standard way to test them.

### P5: No Production Observability

> There's no live quality signal built into the pipeline. It was built to generate content, not to measure its quality over time. Observability wasn't scoped into the original design. A bad model update degrades the catalog silently until agents notice rising queue volumes.

### P6: Slow Reaction, Minor Fixes Ignored

> There's no lightweight path to fix known, recurring patterns. Every change -- even adding "1 Piece" or normalizing ALL-CAPS -- requires a dev cycle that competes with feature work. The prioritization framework treats these as low-severity, so they accumulate. Agents develop workarounds instead of getting real fixes.

### P7: Static Golden Dataset

> The category prediction model's ground truth is a hand-edited JSON file in cloud storage, maintained via Jupyter notebooks by a single engineer. Adding one new category takes days.

### P8: Lost Corrections (Category)

> Agents override about 2,400 category predictions every week. Every single one of those corrections is applied to the product, then thrown away. The model makes the same wrong prediction next week. Zero feedback.

### P9: Unreliable Ground Truth

> We define ground truth as "GPT-4o agrees with the product data" -- that's only 63.2 percent agreement. 44 categories have zero examples. We cannot reliably measure whether the model is getting better or worse.

### P10: No Model Governance

> Model selection across all content tasks -- title generation, attribute extraction, category prediction, variant grouping -- is a manual config choice. No A/B testing, no benchmark comparison. When a better model ships, someone has to notice, evaluate, and switch it by hand.

---

### Pivot

> Ten problems. They look different on the surface -- some are about content, some about categories, some about process. But they share three root causes: no feedback loop, no model governance, and no production observability. The architecture we're proposing addresses all three.

### Open Question: Who Writes the Guidelines?

> Before we get to solutions, there's a strategic question. Who owns the content guidelines? Option A: each platform writes their own. They know their market best, but it fragments quality standards. Option B: a central team writes everything. Consistent, but too far from the ground. The recommendation is a hybrid -- the central team owns the structural frame (title case, units, size at end), and platforms own the substance (word order in Turkish, variant naming in Arabic, pack format in Spanish). Each side does what it's best at.

---

### S1: Tiered Onboarding

> The first solution. Before any content work begins, a tier sets the investment envelope. Lite for baseline hygiene -- cheapest model, minimal QA. Enterprise for strategic products -- best model, image verification, trust-class QA. The tier picks the model, the QA depth, and the enrichment level upfront. Cost is known before design.

*[Interactive: toggle between products and tiers to show the title morphing at each level]*

> You can see the difference live. Pick any product, toggle between tiers. Watch how the title evolves -- Lite fixes typos and capitalization. Pro adds category context. Plus adds specifics like processing type. Enterprise adds everything including allergens and storage instructions. The investment scales with the return.

### S2: ROI Override

> The tier from S1 is the floor, not the ceiling. ROI Override refines it per product. A high-value dairy brand at a Lite vendor gets promoted to Pro because the catalog tells us similar products drive significant volume. A long-tail SKU at an Enterprise vendor stays cheap. It's a fine adjustment on top of coarse tiering.

### S3: Guidelines and Acceptance Criteria

> Define what "good" means per category before the model runs. Dairy titles must include fat percentage and processing type. Electronics must include voltage. These aren't suggestions -- both the model and the QA layer evaluate against the same checklist.

*[Interactive: toggle between Talabat EN, PedidosYa ES, Yemeksepeti TR to see locale differences]*

> And the rules are locale-aware. Same product, different structure. Talabat puts the brand first. PedidosYa follows Spanish naming conventions. Yemeksepeti uses Turkish word order. The platform team writes these rules because they know what their customers expect.

### S4: Model Store and Selection Agent

> A model store that continuously benchmarks every available model across five content tasks. The Selection Agent picks the cheapest model that clears the quality bar -- per task, per tier. When a new model ships next Tuesday, it enters the benchmark automatically. No engineering project. No trade-off conversation.

### S5: Continuous QA -- Three Layers

> Three QA layers working together. Inline QA validates every generation before publishing -- pass means auto-publish, fail means an agent gets a task with a human-readable reason. Monitoring QA scans production output for drift and patterns. And Herogen auto-fixes low-risk recurring issues and escalates high-risk ones with a diagnosis. Those "add 1 Piece" corrections that sit in a backlog for months? Herogen handles them in days.

### S6: Close the Category Feedback Loop

> This is the simplest solution with the biggest impact. Agents are already overriding 2,400 categories a week. We just stop throwing those corrections away. Every override is captured as a structured signal and queued for validation. No new human work -- we're just using what agents are already doing.

### S7: Multi-Agent Validation Gate

> But we don't blindly trust every correction. Before anything enters the golden dataset, three independent AI agents vote. The Category Expert LLM checks plausibility. The Embedding Consistency agent checks whether the product is actually closer to the proposed category. The Cross-Reference agent checks other regions. Three out of three? Auto-add. Two out of three? Expert review. Zero or one? Reject. This builds reliable ground truth from real production signal -- roughly 60 percent auto-validated, about 1,400 new examples per week.

### S8: Production Accuracy Monitoring

> Per-region, per-category accuracy tracked live. Drift detection alerts when accuracy degrades. The monitoring signal feeds back into Model Store selection -- if a model starts underperforming in a region, the system knows before anyone complains.

### S9: Cold-Start Attribute Onboarding

> This is the proof that the architecture works even in the hardest case. Adding a brand-new attribute -- say Calories or Skin Type -- with zero labeled data. Five graduated stages: Define, Seed, Assess, Improve, Go Live. The QA loop becomes the training loop. If we can cold-start a new attribute through this system, we can do anything through it.

---

### Resolution Map

> Every problem introduced in part one is now visually resolved. Hover over any problem to see which solutions address it. Hover over any solution to see which problems it closes. No loose threads.

### Closing

> One pipeline. One closed loop. Tiered onboarding, a continuous Model Store, locale-aware guidelines, three-agent validation, and a QA gate -- applied to every title, every attribute, and every category we generate.

---
---

## Part 2: Pipeline Demo

Open `Demo.html`. Scroll to advance. Animations auto-play.

---

### Intro

> Now let's see this in action. This demo walks through the actual pipeline -- from a messy vendor CSV upload all the way to an enriched, categorized, QA-checked listing. Ten scenes, end to end. Just scroll.

---

### Scene 1: Data Ingestion

> Products enter from five vendors here -- a small Emirati corner store with 47 products, Carrefour with nearly 10,000, a neighborhood shop in Argentina, a Turkish online grocer, and a small Pakistani store. Different platforms, different languages, different scales. They all feed the same pipeline. The system normalizes format and tags provenance from the first moment.

### Scene 2: Model Store

> Before anything runs, the Model Store picks the right model for each task. You can see the weekly benchmark table -- title generation uses Claude 4 Sonnet, attribute extraction uses GPT-4.1-mini, category prediction uses embeddings, and so on. Watch the second row -- the Selection Agent just swapped Attribute Extraction from GPT-4.1-mini to Claude 4 Haiku. Same quality, 40 percent cheaper. That happened automatically. No ticket, no discussion.

### Scene 3: Product Analysis

> Now we zoom into one product: Almarai Full Fat Milk 1L. The pipeline reads both the product image and the vendor title together. It's not processing text in isolation -- it cross-checks what it sees in the image against what the vendor wrote. By the end of analysis, it knows brand, category, language, and what's actually in the picture.

### Scene 4: Tier Assignment

> This product was uploaded by Al-Maha Mini Market -- a single-store vendor. That sets the floor at Lite tier. But the system then checks the catalog: 847 similar dairy products, Almarai is a top-seller across MENA. The ROI signal says this product deserves better enrichment. Override: Lite gets promoted to Pro. Meanwhile, an unassigned product from an unknown vendor stays at Lite until someone catalogs the vendor.

### Scene 5: Guidelines

> Before the model generates anything, the system loads the relevant guidelines. Here's the dairy rule: title must include fat percentage and processing type. But it goes deeper -- the central team owns the structural rules (title case, size at end, standard units), and each platform owns its locale rules. Talabat puts brand first. PedidosYa follows Spanish conventions. Yemeksepeti uses Turkish word order. Same product, different structure, by design.

### Scene 6: Content Generation

> Now the model runs. Watch the title transform tier by tier. The raw vendor input is "almarai full fat milk 1L" -- lowercase, no context. Lite fixes capitalization and formatting. Pro adds "Fresh Dairy" because the guidelines say so. Plus adds UHT Long Life and processing type. Enterprise goes all the way -- cow's milk, no preservatives, storage instructions. This product was assigned Pro tier, so that's what ships. The other tiers are shown so you can see what higher investment would buy.

### Scene 7: Master Category Prediction

> The product's embedding is compared against the golden dataset. For Almarai milk, the model is confident -- 94 percent match to Food and Beverages, Dairy, Fresh Milk. Correct. But what about the Galaxy chocolate bar? The model predicted Biscuits and Cookies instead of Chocolate Bars -- 58 percent confidence, below threshold. An agent corrects it. That correction enters the three-agent validation gate. All three agents agree. The correction is auto-added to the golden dataset. Next time, the model gets it right. The loop closes.

### Scene 8: QA Gate

> Five automated checks before anything ships. Language consistency -- is the title in the expected locale? Length and format -- does it meet the structural rules? Required fields -- fat percentage for dairy, voltage for electronics. Confidence threshold -- is the model confident enough for this tier? Image-title match -- does what the model wrote match what the image shows? All five pass? Auto-publish. If the Turkish title contains English words? Fail -- with a human-readable reason routed to the right agent.

### Scene 9: Locale Showcase

> Same milk product, three markets. Talabat in English: "Almarai Full Fat Fresh Cow's Milk 1 Litre." PedidosYa in Spanish: completely different word order and naming. Yemeksepeti in Turkish: Turkish characters, Turkish structure. This isn't translation. It's locale-aware enrichment. The same pipeline, the same model, the same QA -- but the platform-owned rules from scene 5 reshape every output for its market.

### Scene 10: Cost Projection

> Scale this to one million products. With tiered investment, 45 percent of products are Lite at a tenth of a cent each. 30 percent are Pro. 15 percent are Plus. Only 7 percent -- the strategic-partner SKUs that actually need it -- get Enterprise treatment. Total cost: $6,150. If everything ran Enterprise? $30,000. That's a 79.5 percent reduction. But the argument isn't just the dollar amount. 450,000 long-tail SKUs don't need Enterprise enrichment. 70,000 strategic-partner SKUs deserve every bit of it. Tiered investment puts money where it returns.

---

### Outro

> One pipeline. Every content task. From a messy vendor upload to an enriched, categorized, quality-checked listing -- across three platforms, three languages, and a million products. The strategy walkthrough explained why. This demo showed how.

---

## Delivery tips

- **Strategy Walkthrough**: Spend more time on P3 (correction rate) and P8 (lost corrections) -- these resonate most with operational leadership. The interactive tier toggle in S1 is a good moment to pause and let the audience explore.
- **Pipeline Demo**: Let the scroll animations breathe. Don't narrate over them -- pause, let the animation play, then explain what just happened. Scene 4 (tier override) and Scene 7 (category loop closing) are the two "aha" moments.
- **If short on time**: Do the Demo only. It's self-contained and tells the story in 10 minutes without requiring the problem/solution framework.
- **If the audience asks "what's different from what we have today?"**: Point to the ledger in the Walkthrough. Every red dot is a problem that exists today. Every green check is something the proposed architecture resolves.
