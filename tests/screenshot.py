"""Render the page at the required widths in both languages; report horizontal overflow, console errors,
and elements whose text overflows their box. Usage: python3 tests/screenshot.py [outdir]"""
import sys, json, subprocess, time, os
from playwright.sync_api import sync_playwright

OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/shots'
os.makedirs(OUT, exist_ok=True)
WIDTHS = [320, 360, 390, 768, 1024, 1440]
CHECK = """() => {
  const res = {scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, overflow: []};
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.right > vw + 1 && !el.closest('.sr-only')) res.overflow.push(el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + ' right=' + Math.round(r.right));
    if (!el.closest('.sr-only') && el.children.length === 0 && el.textContent.trim() && (el.scrollWidth > el.clientWidth + 1) && cs.overflow !== 'visible') res.overflow.push('clip:' + el.tagName + '.' + el.className);
  });
  res.overflow = res.overflow.slice(0, 12);
  return res;
}"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
    problems = 0
    for lang in ['bn', 'en']:
        for w in WIDTHS:
            ctx = b.new_context(viewport={'width': w, 'height': 900})
            page = ctx.new_page()
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)))
            page.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') else None)
            page.add_init_script("localStorage.setItem('amarfoshol.lang','%s')" % lang)
            page.goto('file://' + os.path.abspath('index.html'))
            page.wait_for_timeout(400)
            r = page.evaluate(CHECK)
            ok = r['scrollW'] <= r['clientW'] and not r['overflow'] and not errs
            problems += 0 if ok else 1
            print(('OK  ' if ok else 'FAIL'), lang, w, 'scrollW=%s clientW=%s' % (r['scrollW'], r['clientW']), r['overflow'], errs[:3])
            page.screenshot(path='%s/%s-%d.png' % (OUT, lang, w), full_page=True)
            ctx.close()
    b.close()
    sys.exit(1 if problems else 0)
