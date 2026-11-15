# Amar Foshol (আমার ফসল)

**Bilingual (Bangla / English) crop-rotation and climate-shift decision-support demo for farmers in Bangladesh.**
Built for the NASA Space Apps Challenge 2026 (challenge theme: adapting farms with NASA data).

> **Partly real data.** Temperature, very hot days, rainfall and heavy-rain onset are 2010-2024 averages from a NASA POWER
> file fetched once (see below); everything else is synthetic and illustrative. There are no research citations, and the
> rotation scoring is a demonstration heuristic, not a validated model.
> Amar Foshol supports farmer judgment. It does not replace local agricultural experts.

## Real data: NASA POWER (optional, run once)

The temperature and rainfall figures can come from the real NASA POWER daily point API (parameters T2M, T2M_MAX, PRECTOTCORR; community AG). No key is needed.

```
python scripts/fetch_nasa_power.py
```

This overwrites `src/data/nasa-power.js` with **2010-2024 averages only** for the six district points. Reload the page: the temperature, rain, hot-day and rain-onset cards and charts then carry a "Verified" badge and the retrieval date, and show a single average instead of a then-vs-now comparison.

Why no comparison: when checked on 2026-11-15, the POWER daily series at these points was not consistent over time. 1991-1996 rain was roughly a third of later years (Rajshahi 324-600 mm/yr) with far more hot days, and rain stepped up again around 2016. These look like changes in the underlying data sources rather than climate, so a "then vs now" built on them would mislead. The 2010-2024 average still spans the ~2016 step: treat values as rough estimates for one grid cell, not station measurements. The synthetic demo comparison (soil moisture, vegetation, planting window) is unchanged and labelled Demo.

What stays synthetic (and is labelled so): soil moisture, vegetation (NDVI), planting windows and all crop-rotation scenarios. The site is a "partly real" prototype, not a live NASA feed: the data is a file fetched once, not a live connection. "Heavy-rain onset" and "hot day" (>= 35 C) are this project's own definitions, shown in the chart text.

Tests: `python3 tests/test_fetch_nasa_power.py` (offline), `python3 tests/real_mode.py` (UI wiring using an obviously fake fixture).


## What it does

- **Crop Rotation Explorer (primary):** compares three illustrative strategies (existing practice, legume-inclusive, water-conscious)
  for the selected crop: example sequence, water demand, soil benefits, nitrogen-fixing potential, ground cover and erosion,
  pest-cycle diversity, income uncertainty, risks, missing information, evidence status, a comparison table and a "why is this shown" explanation.
- **Farmer priorities:** multi-select (water, soil, erosion, income, vulnerability). Equal-weight demo scores update the comparison. No winner is declared.
- **Climate Shift Explorer:** for six districts: NASA POWER 2010-2024 averages for temperature, hot days, rainfall (monthly) and heavy-rain onset;
  synthetic Then vs Now (1991-2005 vs 2010-2024) demo for soil moisture, vegetation index, and planting-window shift for the chosen crop.
- **Data Sources:** SMAP, GPM/IMERG, POWER, MODIS/VIIRS/Landsat, SRTM, ECOSTRESS, GRACE/GRACE-FO, plus ESA Sentinel-2 and ECMWF ERA5 as partner resources.
  Each card carries a status (Demo Data, Planned Integration, Not Connected, Verified Source). Only POWER is *Verified*, and only because its data file is present; it is not a live connection.
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
