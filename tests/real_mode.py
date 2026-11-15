"""Checks the UI wiring when real NASA POWER data is present. Uses a FAKE fixture (obvious numbers, e.g. 99 hot days):
this verifies labelling and plumbing only, never real values. Run: python3 tests/real_mode.py"""
import os, re, sys, json
from playwright.sync_api import sync_playwright
URL = 'file://' + os.path.abspath('index.html')
months = [10,10,20,50,150,300,350,320,250,120,20,5]
def dist(base):
    return {'meanTemp': {'old': base, 'recent': base + 1}, 'hotDays': {'old': 11, 'recent': 99}, 'rain': {'old': 2000, 'recent': 1900},
            'onset': {'old': 150, 'recent': 160}, 'monthlyRain': {'old': months, 'recent': months}}
FIXTURE = {'source': 'NASA POWER', 'retrievedAt': '2026-11-15', 'periods': {'old': [1991, 2005], 'recent': [2010, 2024]},
           'definitions': {'hotC': 35, 'onsetMm': 60, 'onsetWindowDays': 7, 'onsetFromDayOfYear': 91},
           'districts': {d: dist(24) for d in ['dhaka','rajshahi','khulna','rangpur','barishal','sylhet']}}
fails = []
def check(name, cond):
    print(('PASS ' if cond else 'FAIL ') + name)
    if not cond: fails.append(name)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1200, 'height': 900}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    check('placeholder file means demo mode', pg.evaluate("SC.hasRealData()") is False)
    check('demo mode: hero says Demo Mode', 'ডেমো মোড' in pg.inner_text('#home .badge'))
    check('demo mode: no verified badge anywhere', pg.locator('#climate .badge--verified, #sources .badge--verified').count() == 0)
    pg.evaluate("f => { SC.nasaPower = f; SC.update(); }", FIXTURE)
    check('real mode detected', pg.evaluate("SC.hasRealData()") is True)
    check('hero badge no longer says Demo Mode', 'আংশিক নাসা POWER' in pg.inner_text('#home .badge'))
    cards = pg.inner_text('#climate-cards')
    check('values come from the data file (99 hot days -> ৯৯)', '৯৯' in cards)
    temp_card, rain_card = pg.locator('#climate-cards article').nth(0), pg.locator('#climate-cards article').nth(1)
    soil_card, veg_card = pg.locator('#climate-cards article').nth(2), pg.locator('#climate-cards article').nth(3)
    check('temperature card verified + T2M', temp_card.locator('.badge--verified').count() == 1 and 'T2M' in temp_card.inner_text())
    check('rain card verified + PRECTOTCORR', rain_card.locator('.badge--verified').count() == 1 and 'PRECTOTCORR' in rain_card.inner_text())
    check('soil moisture card STILL demo', soil_card.locator('.badge--demo').count() == 1 and soil_card.locator('.badge--verified').count() == 0)
    check('vegetation card STILL demo', veg_card.locator('.badge--demo').count() == 1 and veg_card.locator('.badge--verified').count() == 0)
    badges = pg.evaluate("[...document.querySelectorAll('#climate-shift figure')].map(f => [f.querySelector('figcaption').id.replace('-cap',''), f.querySelector('.chart__badge .badge').className.includes('verified')])")
    expect = {'ch-hot': True, 'ch-onset': True, 'ch-rain': True, 'ch-soil': False, 'ch-veg': False, 'ch-win': False}
    check('chart provenance: hot/onset/rain real, soil/veg/window demo', dict((k, v) for k, v in badges) == expect)
    check('climate notice states what is still synthetic', 'কৃত্রিম' in pg.inner_text('#climate .notice'))
    check('power source card is verified, gpm is planned', pg.evaluate("""() => { const t = id => document.querySelector('#src-' + id).closest('article').querySelector('.badge').className; return t('power').includes('verified') && t('gpm').includes('planned') && t('smap').includes('demo'); }"""))
    check('footer shows verified NASA POWER file, not live', 'লাইভ সংযোগ নয়' in pg.inner_text('#footer-status') and pg.locator('#footer-status .badge--verified').count() == 1)
    check('database still reported not connected', 'ডেটাবেস' in pg.inner_text('#footer-status') and 'সংযুক্ত নেই' in pg.inner_text('#footer-status'))
    check('meta description updated', 'POWER' in pg.get_attribute('meta[name=description]', 'content'))
    check('rotation notice unchanged (still unverified)', 'যাচাইকৃত ফল নয়' in pg.inner_text('#rotation .notice'))
    pg.click('#lang-en')
    en = pg.inner_text('#climate') + pg.inner_text('#sources') + pg.inner_text('#about')
    check('English real mode has no Bengali characters', not re.search('[ঀ-৿]', en))
    check('English hero badge', 'Partly real NASA POWER data' in pg.inner_text('#home .badge'))
    pg.click('#lang-bn')
    check('Bangla real mode has no Latin digits in climate cards (data-field name T2M excluded)', not re.search('[0-9]', pg.inner_text('#climate-cards').replace('T2M', '')))
    keys = pg.evaluate("[Object.keys(SC._strings.bn).filter(k=>!(k in SC._strings.en)), Object.keys(SC._strings.en).filter(k=>!(k in SC._strings.bn))]")
    check('bn/en key parity incl. real-mode strings', keys == [[], []])
    for w in (320, 390, 1440):
        for lang in ('bn', 'en'):
            pg.set_viewport_size({'width': w, 'height': 900}); pg.click('#lang-' + lang)
            over = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            check('no horizontal overflow in real mode at %d (%s)' % (w, lang), over <= 0)
    check('no JS errors', not errs)
    b.close()
sys.exit(1 if fails else 0)
