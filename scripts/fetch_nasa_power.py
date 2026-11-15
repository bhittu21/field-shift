#!/usr/bin/env python3
"""
Fetch real NASA POWER daily data for six district points and write src/data/nasa-power.js.

No API key, no account, standard library only. Needs an internet connection (about 2-5 minutes).

    python scripts/fetch_nasa_power.py

What it produces (per district), for two periods (1991-2005 and 2010-2024):
  - mean temperature        (T2M, daily mean air temperature at 2 m, deg C)
  - very hot days per year  (days with T2M_MAX >= 35 deg C)
  - rain per year and per month (PRECTOTCORR, corrected precipitation, mm/day summed)
  - estimated heavy-rain onset (first day on/after 1 April whose trailing 7-day rain sum >= 60 mm;
    this is this project's own simple definition, not an official NASA product)

Points are approximate district-centre coordinates, not farm locations.
Source: https://power.larc.nasa.gov/  (community AG, daily point API)
"""
import datetime
import json
import os
import statistics
import sys
import time
import urllib.parse
import urllib.request

API = "https://power.larc.nasa.gov/api/temporal/daily/point"
POINTS = {  # approximate district-centre points (lat, lon)
    "dhaka": (23.81, 90.41),
    "rajshahi": (24.37, 88.60),
    "khulna": (22.82, 89.55),
    "rangpur": (25.75, 89.25),
    "barishal": (22.70, 90.37),
    "sylhet": (24.89, 91.87),
}
START_YEAR, END_YEAR = 1991, 2024
OLD = (1991, 2005)
RECENT = (2010, 2024)
HOT_C = 35.0          # deg C, applied to T2M_MAX
ONSET_MM = 60.0       # mm in a trailing window
ONSET_WINDOW = 7      # days
ONSET_FROM_DOY = 91   # 1 April in a non-leap year
FILL = -999.0         # POWER fill value for missing data
MAX_MISSING = 0.05    # skip a year with more than 5% missing days


def fetch_daily(lat, lon, retries=4):
    query = urllib.parse.urlencode({
        "parameters": "T2M,T2M_MAX,PRECTOTCORR",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "start": "%d0101" % START_YEAR,
        "end": "%d1231" % END_YEAR,
        "format": "JSON",
    })
    last = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(API + "?" + query, timeout=120) as resp:
                return json.load(resp)
        except Exception as err:  # network or API hiccup: back off and retry
            last = err
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("NASA POWER request failed for %s,%s: %s" % (lat, lon, last))


def _val(series, key):
    v = series.get(key)
    return None if v is None or v <= FILL + 1 else float(v)


def compute(params):
    """params: {'T2M': {YYYYMMDD: v}, 'T2M_MAX': {...}, 'PRECTOTCORR': {...}} -> per-period summary."""
    t2m, tmax, rain = params["T2M"], params["T2M_MAX"], params["PRECTOTCORR"]

    def days_of(year):
        d = datetime.date(year, 1, 1)
        while d.year == year:
            yield d
            d += datetime.timedelta(days=1)

    def summarise(y0, y1):
        temps, hot_counts, annual, monthly, onsets = [], [], [], [[] for _ in range(12)], []
        for year in range(y0, y1 + 1):
            ds = list(days_of(year))
            keys = [d.strftime("%Y%m%d") for d in ds]
            r = [_val(rain, k) for k in keys]
            tm = [_val(tmax, k) for k in keys]
            tt = [_val(t2m, k) for k in keys]
            temps += [v for v in tt if v is not None]
            if sum(v is None for v in tm) <= MAX_MISSING * len(ds):
                hot_counts.append(sum(1 for v in tm if v is not None and v >= HOT_C))
            if sum(v is None for v in r) <= MAX_MISSING * len(ds):
                annual.append(sum(v for v in r if v is not None))
                for m in range(12):
                    monthly[m].append(sum(v for d, v in zip(ds, r) if d.month == m + 1 and v is not None))
                # heavy-rain onset: first day >= ONSET_FROM_DOY with trailing-window sum >= ONSET_MM
                for i in range(ONSET_FROM_DOY - 1, len(ds)):
                    window = [v for v in r[max(0, i - ONSET_WINDOW + 1):i + 1] if v is not None]
                    if len(window) == ONSET_WINDOW and sum(window) >= ONSET_MM:
                        onsets.append(i + 1)
                        break
        return {
            "meanTemp": round(statistics.fmean(temps), 2),
            "hotDays": round(statistics.fmean(hot_counts)),
            "rain": round(statistics.fmean(annual)),
            "monthlyRain": [round(statistics.fmean(m)) for m in monthly],
            "onset": round(statistics.median(onsets)),
        }

    old, recent = summarise(*OLD), summarise(*RECENT)
    return {
        "meanTemp": {"old": old["meanTemp"], "recent": recent["meanTemp"]},
        "hotDays": {"old": old["hotDays"], "recent": recent["hotDays"]},
        "rain": {"old": old["rain"], "recent": recent["rain"]},
        "onset": {"old": old["onset"], "recent": recent["onset"]},
        "monthlyRain": {"old": old["monthlyRain"], "recent": recent["monthlyRain"]},
    }


def main():
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data", "nasa-power.js")
    districts, api_info = {}, None
    for name, (lat, lon) in POINTS.items():
        print("Fetching %s (%.2f, %.2f) ..." % (name, lat, lon), flush=True)
        payload = fetch_daily(lat, lon)
        api_info = api_info or payload.get("header", {}).get("api")
        districts[name] = compute(payload["properties"]["parameter"])
        districts[name]["point"] = {"lat": lat, "lon": lon}
    doc = {
        "source": "NASA POWER",
        "url": "https://power.larc.nasa.gov/",
        "endpoint": API,
        "community": "AG",
        "parameters": {"T2M": "mean air temperature at 2 m", "T2M_MAX": "maximum air temperature at 2 m",
                       "PRECTOTCORR": "corrected precipitation"},
        "api": api_info,
        "retrievedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d"),
        "periods": {"old": list(OLD), "recent": list(RECENT)},
        "definitions": {"hotC": HOT_C, "onsetMm": ONSET_MM, "onsetWindowDays": ONSET_WINDOW,
                        "onsetFromDayOfYear": ONSET_FROM_DOY},
        "districts": districts,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("/* Generated by scripts/fetch_nasa_power.py from NASA POWER. Do not edit by hand. */\n")
        f.write("window.SC = window.SC || {};\nSC.nasaPower = ")
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print("Wrote", os.path.normpath(out_path))
    print("Next: reload the site. Temperature, hot days and rain now show as NASA POWER data.")


if __name__ == "__main__":
    sys.exit(main())
