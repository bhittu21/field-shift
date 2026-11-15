/*
 * Central translation + number/date formatting.
 * All UI text lives in src/translations/*.js (SC.addStrings). No scattered language checks.
 */
(function (SC) {
  'use strict';

  var DEFAULT_LANG = 'bn';
  var STORAGE_KEY = 'amarfoshol.lang';
  var strings = { bn: {}, en: {} };
  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  var MONTHS = {
    bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var lang = DEFAULT_LANG;

  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return v === 'bn' || v === 'en' ? v : null;
    } catch (e) { return null; }
  }

  function addStrings(pack) {
    ['bn', 'en'].forEach(function (l) {
      Object.keys(pack[l] || {}).forEach(function (k) { strings[l][k] = pack[l][k]; });
    });
  }

  function t(key, params) {
    var s = strings[lang][key];
    if (s === undefined) {
      if (window.console) console.warn('[i18n] missing key', key, lang);
      return key;
    }
    if (params) {
      Object.keys(params).forEach(function (p) { s = s.split('{' + p + '}').join(String(params[p])); });
    }
    return s;
  }

  /* Localised number. Bangla digits in bn mode, Latin digits in en mode. */
  function num(n, opts) {
    opts = opts || {};
    var d = opts.decimals || 0;
    var fixed = Number(n).toFixed(d);
    var parts = fixed.split('.');
    if (opts.group) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var out = parts.join('.');
    if (lang === 'bn') out = out.replace(/\d/g, function (c) { return BN_DIGITS[+c]; });
    return out;
  }

  function month(i) { return MONTHS[lang][i]; }

  /* Day-of-year (1..365) -> "15 June" / "১৫ জুন". */
  function dayOfYear(doy) {
    var d = ((Math.round(doy) - 1) % 365 + 365) % 365 + 1;
    var m = 0;
    while (d > MONTH_DAYS[m]) { d -= MONTH_DAYS[m]; m++; }
    return num(d) + ' ' + month(m);
  }

  function getLang() { return lang; }
  function setLang(l) {
    if (l !== 'bn' && l !== 'en') return;
    lang = l;
    try { window.localStorage.setItem(STORAGE_KEY, l); } catch (e) { /* storage unavailable: keep in memory */ }
    document.documentElement.lang = l;
    document.documentElement.setAttribute('data-lang', l);
  }
  function initLang() { setLang(readStored() || DEFAULT_LANG); }

  SC.addStrings = addStrings;
  SC.t = t;
  SC.num = num;
  SC.month = month;
  SC.dayOfYear = dayOfYear;
  SC.getLang = getLang;
  SC.setLang = setLang;
  SC.initLang = initLang;
  SC._strings = strings;
})(window.SC = window.SC || {});
