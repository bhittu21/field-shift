/*
 * Amar Foshol (আমার ফসল) app shell: state, translation of static markup, navigation, section registry.
 * No framework, no build step. Open index.html directly or serve the folder.
 */
(function (SC) {
  'use strict';

  var sections = [];
  SC.state = { district: 'dhaka', crop: 'boro', priorities: [] };

  SC.registerSection = function (s) { sections.push(s); };

  function loadState() {
    var p = SC.provider.prefs;
    var d = p.get('district'), c = p.get('crop'), pr = p.get('priorities');
    if (d && SC.provider.districtIds().indexOf(d) > -1) SC.state.district = d;
    if (c && SC.provider.cropIds().indexOf(c) > -1) SC.state.crop = c;
    if (pr) {
      try {
        var ids = SC.provider.priorities().map(function (x) { return x.id; });
        SC.state.priorities = JSON.parse(pr).filter(function (x) { return ids.indexOf(x) > -1; });
      } catch (e) { SC.state.priorities = []; }
    }
  }

  SC.setState = function (patch) {
    Object.keys(patch).forEach(function (k) { SC.state[k] = patch[k]; });
    var p = SC.provider.prefs;
    p.set('district', SC.state.district);
    p.set('crop', SC.state.crop);
    p.set('priorities', JSON.stringify(SC.state.priorities));
    SC.update();
  };

  /* Translate static markup: data-i18n (text) and data-i18n-attr="attr:key;attr2:key2". */
  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = SC.t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        el.setAttribute(pair.slice(0, i).trim(), SC.t(pair.slice(i + 1).trim()));
      });
    });
    document.title = SC.t('brand.name') + ': ' + SC.t('brand.tagline');
    document.getElementById('lang-bn').setAttribute('aria-pressed', String(SC.getLang() === 'bn'));
    document.getElementById('lang-en').setAttribute('aria-pressed', String(SC.getLang() === 'en'));
    [1, 2, 3].forEach(function (n) {
      var el = document.getElementById('step-num-' + n);
      if (el) el.setAttribute('data-n', SC.num(n));
    });
    var btn = document.getElementById('menu-btn');
    var open = document.getElementById('site-nav').classList.contains('is-open');
    btn.setAttribute('aria-label', SC.t(open ? 'nav.menuClose' : 'nav.menuOpen'));
  }

  /* Build the nav only from sections that exist on the page. */
  function buildNav() {
    var html = '';
    document.querySelectorAll('[data-nav]').forEach(function (sec) {
      html += '<li><a href="#' + sec.id + '" data-target="' + sec.id + '">' + SC.t(sec.getAttribute('data-nav')) + '</a></li>';
    });
    document.getElementById('nav-list').innerHTML = html;
  }

  function setupMenu() {
    var btn = document.getElementById('menu-btn');
    var nav = document.getElementById('site-nav');
    function setOpen(o) {
      nav.classList.toggle('is-open', o);
      btn.setAttribute('aria-expanded', String(o));
      btn.setAttribute('aria-label', SC.t(o ? 'nav.menuClose' : 'nav.menuOpen'));
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); }
    });
  }

  function setupActiveLink() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        document.querySelectorAll('#nav-list a').forEach(function (a) {
          if (a.getAttribute('data-target') === en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('[data-nav]').forEach(function (s) { io.observe(s); });
  }

  /* Re-render everything, keeping keyboard focus on the same control. */
  SC.update = function () {
    var active = document.activeElement;
    var focusId = active && active.id ? active.id : null;
    var focusKey = active && active.getAttribute ? active.getAttribute('data-focus') : null;
    translateStatic();
    buildNav();
    sections.forEach(function (s) {
      try { s.render(); } catch (err) {
        if (window.console) console.error('[section ' + s.id + ']', err);
        var host = document.querySelector('[data-section-host="' + s.id + '"]');
        if (host) host.innerHTML = '<p class="empty" role="alert">' + SC.t('common.error') + '</p>';
      }
    });
    var target = focusId ? document.getElementById(focusId)
      : focusKey ? document.querySelector('[data-focus="' + focusKey + '"]') : null;
    if (target && target !== document.activeElement) target.focus({ preventScroll: true });
    var current = document.querySelector('#nav-list a[aria-current]');
    if (!current) { /* IntersectionObserver restores it on next scroll */ }
  };

  function init() {
    SC.initLang();
    loadState();
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { SC.setLang(b.getAttribute('data-set-lang')); SC.update(); });
    });
    setupMenu();
    sections.forEach(function (s) { if (s.init) s.init(); });
    SC.update();
    setupActiveLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.SC = window.SC || {});
