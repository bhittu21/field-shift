# Amar Foshol (আমার ফসল)

**Bilingual (Bangla / English) crop-rotation and climate-shift decision-support demo for farmers in Bangladesh.**
Built for the NASA Space Apps Challenge 2026 (challenge theme: adapting farms with NASA data).

> **Demo mode.** Every number in this app is synthetic and illustrative. Nothing is retrieved from NASA or any other source,
> there are no research citations, and the rotation scoring is a demonstration heuristic, not a validated model.
> Amar Foshol supports farmer judgment. It does not replace local agricultural experts.

## What it does

- **Crop Rotation Explorer (primary):** compares three illustrative strategies (existing practice, legume-inclusive, water-conscious)
  for the selected crop: example sequence, water demand, soil benefits, nitrogen-fixing potential, ground cover and erosion,
  pest-cycle diversity, income uncertainty, risks, missing information, evidence status, a comparison table and a "why is this shown" explanation.
- **Farmer priorities:** multi-select (water, soil, erosion, income, vulnerability). Equal-weight demo scores update the comparison. No winner is declared.
- **Climate Shift Explorer:** Then vs Now (1991-2005 vs 2010-2024) for six districts: temperature, hot days, rainfall (monthly), heavy-rain onset,
  soil moisture, vegetation index, and planting-window shift for the chosen crop.
- **Data Sources:** SMAP, GPM/IMERG, POWER, MODIS/VIIRS/Landsat, SRTM, ECOSTRESS, GRACE/GRACE-FO, plus ESA Sentinel-2 and ECMWF ERA5 as partner resources.
  Each card carries a status (Demo Data, Planned Integration, Not Connected, Verified Source). None is currently *Verified*.
  U.S.-only datasets (Web Soil Survey, SSURGO, Cropland Data Layer, PRISM, NAIP, CoCoRaHS) are deliberately **not** used.
- **WhatsApp / SMS mock-ups:** visual only. No message is sent, no service is connected.
- **Bangla (default) and English**, switchable without reload, persisted in `localStorage`. Bangla numerals and month names in Bangla mode.
  No speech synthesis, microphone, or voice features.

## Run it

No build step and no dependencies.

```bash
# any static server, e.g.
python3 -m http.server 8080
# then open http://localhost:8080
```

`index.html` also works when opened directly from disk.

## Structure

```
index.html
assets/fonts/           Noto Sans + Noto Sans Bengali (OFL), bundled so it works offline
src/data/demo-data.js   synthetic dataset (isDemo, dataStatus: "synthetic")
src/data/provider.js    data-provider abstraction (swap for a real backend later)
src/translations/*.js   central bn/en dictionaries
src/utils/              i18n + numerals/months, illustrative scoring
src/components/charts.js  accessible HTML/CSS bar and range charts
src/sections/*.js       one module per page section
src/styles/*.css        design tokens + component styles
tests/                  Playwright checks (see below)
```

## Data and database status

No database or API credentials exist in this repository, so none is used. The footer shows this truthfully ("Not connected").
Preferences (language, district, crop, priorities) live only in the browser's `localStorage`.

## Tests

Requires Python with Playwright and a Chromium/Chrome binary (set the path in the scripts if needed).

```bash
python3 tests/screenshot.py /tmp/shots   # 6 widths x 2 languages: horizontal overflow, clipped text, console errors
python3 tests/interactions.py            # language, selectors, charts, priorities, sources, mock-ups, a11y basics
```

## Known limitations

- All values are synthetic; rotation sequences and categories are unverified assumptions.
- District-level only; no field-level data; no local Bangladeshi soil data.
- Verified on Chrome (headless) only; not tested on real devices or screen readers.
- Bangla copy has not been reviewed by a native-speaking agronomist.

---

# Space Apps (original repository README)

## SOLVE REAL-WORLD CHALLENGES ON EARTH & IN SPACE
The NASA Space Apps Challenge is a hackathon for coders, scientists, designers, storytellers, makers, technologists, and innovators around the world to come together and use open data from NASA and its Space Agency Partners to create solutions to challenges we face on Earth and in space.

## TERMS & CONDITIONS
By participating in [Discussions](https://github.com/nasa/spaceapps/discussions) within this repository, you are confirming that you have [registered](https://www.spaceappschallenge.org/) for the 2026 NASA Space Apps Hackathon and have agreed to and signed the [Terms & Conditions](https://www.spaceappschallenge.org/legal/).

## IF YOU SEE SOMETHING, SAY SOMETHING
If you experience or witness discrimination, harassment, or any form of bullying during the Space Apps Challenge, or have any other concerns, please contact your Local Lead and/or the Space Apps Global Organizing (GO) Team at [conduct@spaceappschallenge.org](mailto:conduct@spaceappschallenge.org)
