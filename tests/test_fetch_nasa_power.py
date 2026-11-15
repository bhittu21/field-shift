"""Checks the aggregation logic of scripts/fetch_nasa_power.py on SYNTHETIC input (no network).
Run: python3 tests/test_fetch_nasa_power.py"""
import datetime, importlib.util, os, sys
spec = importlib.util.spec_from_file_location('fetch', os.path.join(os.path.dirname(__file__), '..', 'scripts', 'fetch_nasa_power.py'))
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

t2m, tmax, rain = {}, {}, {}
d = datetime.date(1991, 1, 1)
while d.year <= 2024:
    k = d.strftime('%Y%m%d')
    t2m[k] = 25.0
    tmax[k] = 36.0 if d.month == 5 and d.day <= 10 else 30.0    # 10 hot days every year
    rain[k] = 10.0 if (d.month == 6 and 1 <= d.day <= 7) else 1.0  # 10 mm/day on 1-7 June: trailing 7-day sum first reaches 60 mm on 6 June (6x10 + 1x1 = 61)
    d += datetime.timedelta(days=1)
rain['19910101'] = -999.0   # one missing day must be ignored, not summed
r = m.compute({'T2M': t2m, 'T2M_MAX': tmax, 'PRECTOTCORR': rain})
ok = True
def check(name, cond):
    global ok
    print(('PASS ' if cond else 'FAIL ') + name); ok &= bool(cond)
check('mean temp', r['meanTemp']['old'] == 25.0)
check('hot days per year', r['hotDays']['old'] == 10 and r['hotDays']['recent'] == 10)
check('annual rain plausible (365 days of 1 mm + June boost)', 400 < r['rain']['recent'] < 500)
check('missing-fill ignored', r['rain']['old'] > 0)
check('monthly series has 12 values', len(r['monthlyRain']['old']) == 12 and r['monthlyRain']['old'][5] > r['monthlyRain']['old'][0])
check('onset detected on 6 June (day-of-year 157)', r['onset']['old'] == 157)
sys.exit(0 if ok else 1)
