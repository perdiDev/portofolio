---
name: pptx-portfolio
description: Build or update the PowerPoint version of the portfolio (portfolio-deck/Perdi-Portfolio.pptx) from the site's own content, excluding the diary. Use when asked for a PPT, slides, deck or presentation of the portfolio, or when site content changed and the deck must be regenerated.
---

# Portfolio deck (.pptx)

The deck is generated, never edited by hand. Content comes from the site so the two never drift.

## Run

```
pnpm deck
```

This runs `scripts/pptx/dump-data.mjs` (writes `.tools/pptx-data.json` from `src/config`: author, education, socials, experience, achievements) and then `scripts/pptx/build-deck.py` (reads that JSON plus `src/content/projects/*.md` and `src/assets`). Output: `portfolio-deck/Perdi-Portfolio.pptx`.

## One-time setup

```
python3 -m venv .tools/pptx-venv
.tools/pptx-venv/bin/pip install python-pptx pyyaml
```

`.tools/` is git-ignored. Do not install LibreOffice or other large packages; the owner has a metered connection.

## Check without Office

`.tools/pptx-venv/bin/python scripts/pptx/preview.py portfolio-deck/Perdi-Portfolio.pptx .tools/pptx-build/prev [slide numbers]` writes rough PNGs. Fonts are stand-ins and text anchored to the middle of a box is drawn at the top, so judge spacing and overflow, not exact type. The builder also asserts that experience and case-study text fits.

## Design rules (same as DESIGN.md)

- Colours are the site tokens (`LIGHT`, `DARK` at the top of the builder). Light paper slides for reading, dark slides for the cover, case studies, Foundations and Connect.
- Georgia, Arial and Consolas stand in for Lora, Inter and JetBrains Mono because they exist on every machine. If the owner installs the site fonts, change `SERIF`, `SANS`, `MONO`.
- One italic accent word per heading. Hairline rules, no cards, mono uppercase for metadata.
- Equal outer margin `M` on both sides. Chrome (top rule, section name, page number) comes from `new_slide`.
- Project colour is one hue in `HUES`; the stage tint is `mix(hue, bg, 0.13)`.

## Content rules

- Exclude the diary and blog. Show the same projects as the home page Work grid (those listed in `HUES`).
- Copy follows `.kiro/steering/content-voice.md`: no filler, dates as "Mar 2024", ranges with an en dash.
- Add a project: add it to `HUES` and `SHOTS` in the builder, and to `CASE_STUDIES` if it has a strong challenges list.
- Keep slide count near 22. A new slide must earn its place.
