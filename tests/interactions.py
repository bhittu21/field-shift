"""Interaction checks. Usage: python3 tests/interactions.py"""
import os, sys
from playwright.sync_api import sync_playwright
URL = 'file://' + os.path.abspath('index.html')
fails = []
def check(name, cond):
    print(('PASS ' if cond else 'FAIL ') + name)
    if not cond: fails.append(name)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    ctx = b.new_context(viewport={'width': 390, 'height': 800})
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    check('default language is Bangla', pg.evaluate("document.documentElement.lang") == 'bn')
    check('hero Bangla headline', 'আবহাওয়া বদলাচ্ছে' in pg.inner_text('h1'))
    pg.click('#lang-en')
    check('switch to English without reload', 'weather is changing' in pg.inner_text('h1'))
    pg.reload()
    check('language persists after reload', pg.evaluate("document.documentElement.lang") == 'en')
    pg.click('#lang-bn')
    pg.select_option('#sel-district', 'rajshahi'); pg.select_option('#sel-crop', 'mustard')
    check('summary updates (bn)', 'রাজশাহী' in pg.inner_text('#dash-summary') and 'সরিষা' in pg.inner_text('#dash-summary'))
    pg.reload()
    check('selection persists', pg.input_value('#sel-district') == 'rajshahi')
    check('menu closed initially', not pg.is_visible('#site-nav'))
    pg.click('#menu-btn'); check('menu opens on mobile', pg.is_visible('#site-nav'))
    pg.keyboard.press('Escape'); check('Escape closes menu', not pg.is_visible('#site-nav'))
    check('no speech synthesis in code', pg.evaluate("!document.documentElement.innerHTML.includes('speechSynthesis')"))
    check('no JS errors', not errs)
    b.close()
sys.exit(1 if fails else 0)
