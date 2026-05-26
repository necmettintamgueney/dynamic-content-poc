# Dynamic Content Strategy

Interactive walkthrough and pipeline demo for Delivery Hero's Dynamic Content enrichment platform. Built for executive leadership to explore how vendor product data gets ingested, enriched, categorized, and quality-checked across Q-Commerce markets.

## Live Pages

- **[Home](https://necmettintamgueney.github.io/dynamic-content-poc/)** -- Landing page with Dynamic Content branding, CTAs, and team overview
- **[Strategy Walkthrough](https://necmettintamgueney.github.io/dynamic-content-poc/Walkthrough.html)** -- 26-step interactive walkthrough: 10 problems across content enrichment and category prediction, followed by 9 solutions that resolve each one. Persistent problem ledger tracks resolution in real time.
- **[Pipeline Demo](https://necmettintamgueney.github.io/dynamic-content-poc/Demo.html)** -- Scroll-driven, animated journey through 10 pipeline scenes: data ingestion, model store, product analysis, tier assignment, guidelines, content generation, master category prediction, QA gate, locale showcase, and cost projection.

## Tech Stack

- React 18 with Babel standalone (no build step)
- Scroll-driven animations via IntersectionObserver
- Delivery Hero brand: Outfit font, DH Red (#D61F26)
- Hosted on GitHub Pages

## Local Development

```
python3 -m http.server 8899
```

Open http://localhost:8899 in a browser.
