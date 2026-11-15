/* Climate overview cards + Then vs Now explorer. All numbers come from SC.provider (synthetic demo data). */
(function (SC) {
  'use strict';
  var esc = SC.charts.esc;

  function avg(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
  function argExtreme(a, max) {
    var idx = 0;
    a.forEach(function (v, i) { if (max ? v > a[idx] : v < a[idx]) idx = i; });
    return idx;
  }

  /* Text + arrow + class for a change. kind: 'bad' when an increase is harmful, 'good' when a decrease is harmful, 'neutral'. */
  function changeHtml(diff, unitKey, decimals, upIs) {
    var eps = decimals ? 0.5 / Math.pow(10, decimals) : 0.5;
    var text, cls;
    if (Math.abs(diff) < eps) { text = SC.t('change.same'); cls = 'change--neutral'; }
    else {
      var up = diff > 0;
      text = SC.t(up ? 'change.up' : 'change.down', { n: SC.num(Math.abs(diff), { decimals: decimals }), unit: SC.t(unitKey) }).replace('  ', ' ').trim();
      cls = upIs === 'neutral' ? 'change--neutral' : (up === (upIs === 'bad') ? 'change--bad' : 'change--good');
    }
    return '<p class="stat-card__change ' + cls + '">' + esc(text) + '<small>' + esc(SC.t('change.vs')) + '</small></p>';
  }

  /* "2010–2024" for the real NASA POWER averaging period. */
  function realRange() {
    var p = (SC.nasaPower && SC.nasaPower.period) || [];
    return SC.t('period.recentRange', { from: SC.num(p[0]), to: SC.num(p[1]) });
  }
  /* Replaces the change line on real-data cards: an average only, no then-vs-now claim. */
  function avgHtml() {
    return '<p class="stat-card__change change--neutral">' + esc(SC.t('card.avgReal', { range: realRange() })) + '</p>';
  }

  function card(o) {
    return '<article class="card stat-card" aria-labelledby="' + o.id + '-t">' +
      '<h3 class="stat-card__title" id="' + o.id + '-t">' + esc(SC.t(o.key + '.title')) + '</h3>' +
      '<div class="stat-card__value">' + esc(o.value) + '</div>' +
      '<p class="stat-card__label">' + esc(SC.t(o.key + '.label')) + '</p>' +
      o.change +
      '<p class="stat-card__extra">' + esc(o.extra) + '</p>' +
      '<div class="stat-card__meta">' +
        '<details class="help"><summary data-focus="help-' + o.id + '">' + esc(SC.t('card.help')) + '</summary><p>' + esc(SC.t(o.key + '.help')) + '</p></details>' +
        (o.real
          ? '<p><span class="badge badge--verified">' + esc(SC.t('status.verified')) + '</span></p>' +
            '<p class="muted">' + esc(SC.t('card.src.real', { param: o.param, date: SC.isoDate(SC.nasaPower.retrievedAt) })) + '</p>'
          : '<p><span class="badge badge--demo">' + esc(SC.t('status.demo')) + '</span></p>' +
            '<p class="muted">' + esc(SC.t(o.key + '.src')) + ' (' + esc(SC.t('status.notConnected')) + ')</p>') +
      '</div></article>';
  }

  function renderCards(c) {
    var soilAvgOld = avg(c.soil.old), soilAvgNew = avg(c.soil.recent);
    var vegAvgOld = avg(c.ndvi.old), vegAvgNew = avg(c.ndvi.recent);
    var html = '';
    var r = c.real;
    html += card(r
      ? { id: 'c-temp', key: 'card.temp', real: true, param: 'T2M',
          value: SC.t('card.temp.value', { n: SC.num(r.meanTemp, { decimals: 1 }) }),
          change: avgHtml(),
          extra: SC.t('card.temp.extra', { n: SC.num(r.hotDays) }) }
      : { id: 'c-temp', key: 'card.temp',
          value: SC.t('card.temp.value', { n: SC.num(c.meanTemp.recent, { decimals: 1 }) }),
          change: changeHtml(c.meanTemp.recent - c.meanTemp.old, 'unit.c', 1, 'bad'),
          extra: SC.t('card.temp.extra', { n: SC.num(c.hotDays.recent) }) });
    html += card(r
      ? { id: 'c-rain', key: 'card.rain', real: true, param: 'PRECTOTCORR',
          value: SC.t('card.rain.value', { n: SC.num(r.rain, { group: true }) }),
          change: avgHtml(),
          extra: SC.t('card.rain.extra', { date: SC.dayOfYear(r.onset) }) }
      : { id: 'c-rain', key: 'card.rain',
          value: SC.t('card.rain.value', { n: SC.num(c.rain.recent, { group: true }) }),
          change: changeHtml(c.rain.recent - c.rain.old, 'unit.mm', 0, 'neutral'),
          extra: SC.t('card.rain.extra', { date: SC.dayOfYear(c.onset.recent) }) });
    html += card({ id: 'c-soil', key: 'card.soil',
      value: SC.t('card.soil.value', { n: SC.num(soilAvgNew) }),
      change: changeHtml(soilAvgNew - soilAvgOld, 'unit.index', 0, 'good'),
      extra: SC.t('card.soil.extra', { season: SC.t('season.' + SC.data.SEASONS[argExtreme(c.soil.recent, false)]) }) });
    html += card({ id: 'c-veg', key: 'card.veg',
      value: SC.t('card.veg.value', { n: SC.num(vegAvgNew, { decimals: 2 }) }),
      change: changeHtml(vegAvgNew - vegAvgOld, 'unit.none', 2, 'good'),
      extra: SC.t('card.veg.extra', { season: SC.t('season.' + SC.data.SEASONS[argExtreme(c.ndvi.recent, true)]) }) });
    document.getElementById('climate-cards').innerHTML = html;
  }

  function renderShift(c) {
    var st = SC.state, meta = SC.provider.meta();
    var oldR = SC.t('period.oldRange', { from: SC.num(meta.oldPeriod.from), to: SC.num(meta.oldPeriod.to) });
    var newR = SC.t('period.recentRange', { from: SC.num(meta.recentPeriod.from), to: SC.num(meta.recentPeriod.to) });
    var base = { thenRange: oldR, nowRange: newR };
    var seasons = SC.data.SEASONS;
    var daysFmt = function (v) { return SC.num(v) + ' ' + SC.t('unit.daysShort'); };
    var mmFmt = function (v) { return SC.num(v, { group: true }) + ' ' + SC.t('unit.mmShort'); };

    var win = SC.provider.plantingWindow(st.district, st.crop);
    var cropName = SC.t('crop.' + st.crop);
    var winRange = function (w) { return SC.t('chart.window.range', { from: SC.dayOfYear(w[0]), to: SC.dayOfYear(w[1]) }); };
    var allDays = [win.old[0], win.old[1], win.recent[0], win.recent[1]];

    function mk(o) { o.thenRange = oldR; o.nowRange = newR; return SC.charts.barChart(o); }
    var r = c.real, defs = (SC.nasaPower && SC.nasaPower.definitions) || {};

    var summary = [];
    if (r) {
      var rr = realRange();
      summary.push(SC.t('shift.sum.hotReal', { range: rr, n: SC.num(r.hotDays) }));
      summary.push(SC.t('shift.sum.rainReal', { range: rr, n: SC.num(r.rain, { group: true }) }));
      summary.push(SC.t('shift.sum.onsetReal', { range: rr, date: SC.dayOfYear(r.onset) }));
    } else {
      var hd = c.hotDays.recent - c.hotDays.old;
      summary.push(SC.t('shift.sum.hot', { old: SC.num(c.hotDays.old), recent: SC.num(c.hotDays.recent), diff: SC.num(Math.abs(hd)), dir: SC.t(hd >= 0 ? 'dir.more' : 'dir.less') }));
      var rd = c.rain.recent - c.rain.old;
      summary.push(SC.t('shift.sum.rain', { old: SC.num(c.rain.old, { group: true }), recent: SC.num(c.rain.recent, { group: true }), diff: SC.num(Math.abs(rd), { group: true }), dir: SC.t(rd >= 0 ? 'dir.more' : 'dir.less') }));
      var od = c.onset.recent - c.onset.old;
      summary.push(SC.t('shift.sum.onset', { old: SC.dayOfYear(c.onset.old), recent: SC.dayOfYear(c.onset.recent), diff: SC.num(Math.abs(od)), dir: SC.t(od >= 0 ? 'dir.later' : 'dir.earlier') }));
    }
    summary.push(win.shiftDays === 0
      ? SC.t('shift.sum.windowSame', { crop: cropName })
      : SC.t('shift.sum.window', { crop: cropName, diff: SC.num(Math.abs(win.shiftDays)), dir: SC.t(win.shiftDays > 0 ? 'dir.later' : 'dir.earlier') }));

    var html = '';
    html += '<div class="card span-2"><h3>' + esc(SC.t('shift.summary')) + '</h3><ul class="summary-list">' +
      summary.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';

    /* Real data: one "average" bar per row, no earlier period. Demo data: then vs now. */
    function mkReal(o) { o.single = true; o.source = 'nasa'; o.nowRange = realRange(); return SC.charts.barChart(o); }
    var onsetFmt = function (v) { return SC.dayOfYear(v); };
    if (r) {
      html += '<div class="card">' + mkReal({ id: 'ch-hot', title: SC.t('chart.hot.title'), desc: SC.t('chart.hot.descReal', { t: SC.num(defs.hotC) }),
        rows: [{ label: SC.t('card.temp.title'), recent: r.hotDays }],
        min: 0, max: Math.max(1, r.hotDays) * 1.15, fmt: daysFmt }) + '</div>';
      html += '<div class="card">' + mkReal({ id: 'ch-onset', title: SC.t('chart.onset.title'), desc: SC.t('chart.onset.descReal', { mm: SC.num(defs.onsetMm) }),
        rows: [{ label: SC.t('card.rain.title'), recent: r.onset }], min: 90, max: 240, fmt: onsetFmt }) + '</div>';
      html += '<div class="card span-2">' + mkReal({ id: 'ch-rain', title: SC.t('chart.rain.title'), desc: SC.t('chart.rain.descReal'),
        rows: r.monthlyRain.map(function (v, i) { return { label: SC.month(i), recent: v }; }),
        min: 0, max: Math.max(1, Math.max.apply(null, r.monthlyRain)) * 1.1, fmt: mmFmt }) + '</div>';
    } else {
      html += '<div class="card">' + mk({ id: 'ch-hot', source: 'demo', title: SC.t('chart.hot.title'), desc: SC.t('chart.hot.desc'),
        rows: [{ label: SC.t('card.temp.title'), old: c.hotDays.old, recent: c.hotDays.recent }],
        min: 0, max: Math.max(c.hotDays.old, c.hotDays.recent) * 1.15, fmt: daysFmt }) + '</div>';
      html += '<div class="card">' + mk({ id: 'ch-onset', source: 'demo', title: SC.t('chart.onset.title'), desc: SC.t('chart.onset.desc'),
        rows: [{ label: SC.t('card.rain.title'), old: c.onset.old, recent: c.onset.recent }], min: 90, max: 240, fmt: onsetFmt }) + '</div>';
      html += '<div class="card span-2">' + mk({ id: 'ch-rain', source: 'demo', title: SC.t('chart.rain.title'), desc: SC.t('chart.rain.desc'),
        rows: c.monthlyRain.old.map(function (v, i) { return { label: SC.month(i), old: v, recent: c.monthlyRain.recent[i] }; }),
        min: 0, max: Math.max.apply(null, c.monthlyRain.old.concat(c.monthlyRain.recent)) * 1.1, fmt: mmFmt }) + '</div>';
    }

    html += '<div class="card">' + mk({ id: 'ch-soil', source: 'demo', title: SC.t('chart.soil.title'), desc: SC.t('chart.soil.desc'),
      rows: seasons.map(function (s, i) { return { label: SC.t('season.' + s), old: c.soil.old[i], recent: c.soil.recent[i] }; }),
      min: 0, max: 100, fmt: function (v) { return SC.num(v); } }) + '</div>';

    html += '<div class="card">' + mk({ id: 'ch-veg', source: 'demo', title: SC.t('chart.veg.title'), desc: SC.t('chart.veg.desc'),
      rows: seasons.map(function (s, i) { return { label: SC.t('season.' + s), old: c.ndvi.old[i], recent: c.ndvi.recent[i] }; }),
      min: 0, max: 1, fmt: function (v) { return SC.num(v, { decimals: 2 }); } }) + '</div>';

    html += '<div class="card span-2">' + SC.charts.rangeChart({ id: 'ch-win', source: 'demo', title: SC.t('chart.window.title', { crop: cropName }), desc: SC.t('chart.window.desc'),
      min: Math.min.apply(null, allDays) - 10, max: Math.max.apply(null, allDays) + 10,
      rows: [
        { label: SC.t('shift.thenFull', { range: oldR }), from: win.old[0], to: win.old[1], kind: 'then', text: winRange(win.old) },
        { label: SC.t('shift.nowFull', { range: newR }), from: win.recent[0], to: win.recent[1], kind: 'now', text: winRange(win.recent) }
      ] }) + '</div>';

    document.getElementById('climate-shift').innerHTML = html;
  }

  function render() {
    var c = SC.provider.climate(SC.state.district);
    document.getElementById('climate-lead').textContent = SC.t('climate.lead', { district: SC.t('district.' + SC.state.district) });
    var meta = SC.provider.meta();
    document.getElementById('shift-lead').textContent = SC.t('shift.lead', {
      old: SC.t('period.oldRange', { from: SC.num(meta.oldPeriod.from), to: SC.num(meta.oldPeriod.to) }),
      recent: SC.t('period.recentRange', { from: SC.num(meta.recentPeriod.from), to: SC.num(meta.recentPeriod.to) })
    });
    renderCards(c);
    renderShift(c);
  }

  SC.registerSection({ id: 'climate', render: render });
})(window.SC = window.SC || {});
