/* Crop Rotation Explorer: priorities, three strategy cards, comparison table, explanation. Illustrative only. */
(function (SC) {
  'use strict';
  var esc = SC.charts.esc;
  var MARK = { good: '●', medium: '▲', poor: '■' };

  function lvl(level, labelKey) {
    return '<span class="lvl lvl--' + level + '"><span aria-hidden="true">' + MARK[level] + '</span> ' + esc(SC.t(labelKey || ('level.' + level))) + '</span>';
  }
  function cat(c) { return SC.t('cat.' + c); }
  function heatCat(h) { return SC.t('cat.' + (h >= 3 ? 'high' : h === 2 ? 'medium' : 'low')); }
  function waterCatOfCrop(w) { return SC.t('cat.' + (w >= 3 ? 'high' : w === 2 ? 'medium' : 'low')); }

  function analyseAll() {
    var seqs = SC.provider.rotationSequences(SC.state.crop);
    var out = {};
    SC.provider.strategyIds().forEach(function (id) { out[id] = SC.scoring.analyse(seqs[id], SC.state.district); });
    return out;
  }

  function incomeCat(score) { return score >= 67 ? 'high' : score >= 40 ? 'medium' : 'low'; }
  function pestLevel(a) { return a.familyCount >= 3 ? 'good' : a.familyCount === 2 ? 'medium' : 'poor'; }

  function risksFor(id, a) {
    var list = [];
    list.push(SC.t('risk.general.' + id + '1'));
    list.push(SC.t('risk.general.' + id + '2'));
    var seen = {};
    a.sequence.forEach(function (c) {
      if (seen[c]) return; seen[c] = true;
      if (c === 'boro' || c === 'aman' || c === 'fallow' || c === 'mung') list.push(SC.t('risk.' + c));
    });
    return list;
  }

  function sequenceHtml(a) {
    return '<ol class="seq">' + a.sequence.map(function (c, i) {
      var crop = SC.provider.crop(c);
      return '<li class="seq__step' + (c === 'fallow' ? ' seq__step--fallow' : '') + '"><span class="seq__n">' + esc(SC.t('card.step', { n: SC.num(i + 1) })) + '</span>' +
        '<span class="seq__crop">' + esc(SC.t('crop.' + c)) + '</span><span class="seq__season">' + esc(SC.t('season.' + crop.season)) + '</span></li>';
    }).join('') + '</ol>';
  }

  function cropChars(a) {
    var seen = {}, html = '';
    a.sequence.forEach(function (c) {
      if (seen[c]) return; seen[c] = true;
      var crop = SC.provider.crop(c);
      html += '<li>' + esc(c === 'fallow' ? SC.t('crop.fallow') + ': ' + SC.t('crops.none')
        : SC.t('crops.line', { crop: SC.t('crop.' + c), water: waterCatOfCrop(crop.water), heat: heatCat(crop.heat) })) + '</li>';
    });
    return '<ul class="plain">' + html + '</ul>';
  }

  function cardHtml(id, a) {
    var names = a.legumes.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).map(function (c) { return SC.t('crop.' + c); }).join(', ');
    var risks = risksFor(id, a);
    var missing = ['soil', 'variety', 'market', 'water', 'slope'].map(function (k) { return '<li>' + esc(SC.t('miss.' + k)) + '</li>'; }).join('');
    var html = '<article class="card rot-card" aria-labelledby="rc-' + id + '">';
    html += '<header class="rot-card__head"><h3 id="rc-' + id + '">' + esc(SC.t('strat.' + id + '.name')) + '</h3><span class="badge badge--neutral">' + esc(SC.t('strat.' + id + '.tag')) + '</span></header>';
    html += '<section><h4>' + esc(SC.t('card.seq')) + '</h4>' + sequenceHtml(a) + '<p class="small muted">' + esc(SC.t('card.seqNote')) + '</p></section>';
    html += '<section><h4>' + esc(SC.t('card.water')) + '</h4><p>' + lvl(a.levels.waterSaving) + '</p><p>' + esc(SC.t('txt.water', { cat: cat(a.waterCategory) })) + '</p></section>';
    html += '<section><h4>' + esc(SC.t('card.soil')) + '</h4><p>' + esc(a.legumes.length ? SC.t('txt.nitro.yes', { names: names }) : SC.t('txt.nitro.no')) + '</p>' +
      '<p>' + esc(SC.t('txt.cover', { cat: cat(a.coverCategory) })) + '</p>' +
      '<p>' + esc(a.familyCount >= 3 ? SC.t('txt.pest.good', { n: SC.num(a.familyCount) }) : SC.t('txt.pest.poor', { n: SC.num(a.familyCount) })) + '</p>' +
      '<p>' + esc(SC.t('txt.income', { cat: cat(incomeCat(a.scores.income)) })) + '</p></section>';
    html += '<section><h4>' + esc(SC.t('card.crops')) + '</h4>' + cropChars(a) + '</section>';
    html += '<section><h4>' + esc(SC.t('card.risks')) + '</h4><ul class="plain">' + risks.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></section>';
    html += '<section><h4>' + esc(SC.t('card.suit')) + '</h4><p>' + esc(SC.t('suit.' + id)) + '</p></section>';
    html += '<section><h4>' + esc(SC.t('card.missing')) + '</h4><ul class="plain">' + missing + '</ul></section>';
    html += '<footer class="rot-card__foot"><h4>' + esc(SC.t('card.evidence')) + '</h4>' +
      '<p><span class="badge badge--demo">' + esc(SC.t(id === 'existing' ? 'ev.existing' : 'ev.assumption')) + '</span></p>' +
      '<p><span class="badge badge--notConnected">' + esc(SC.t('ev.verified')) + '</span></p></footer>';
    return html + '</article>';
  }

  function renderPriorities() {
    var sel = SC.state.priorities;
    var html = '<div class="chips" role="group" aria-labelledby="prio-title">' +
      SC.provider.priorities().map(function (p) {
        var on = sel.indexOf(p.id) > -1;
        return '<button type="button" class="chip" data-prio="' + p.id + '" data-focus="prio-' + p.id + '" aria-pressed="' + on + '"><span class="chip__mark" aria-hidden="true">✓</span>' + esc(SC.t('prio.' + p.id)) + '</button>';
      }).join('') + '</div>';
    document.getElementById('rot-priorities').innerHTML = html;
  }

  function renderFit(all) {
    var sel = SC.state.priorities, host = document.getElementById('rot-fit');
    if (!sel.length) { host.innerHTML = '<p class="empty">' + esc(SC.t('prio.none')) + '</p>'; return; }
    var rows = SC.provider.strategyIds().map(function (id) { return { id: id, fit: SC.scoring.fit(all[id], sel) }; });
    var top = Math.max.apply(null, rows.map(function (r) { return r.fit.total; }));
    var html = '<h3>' + esc(SC.t('fit.title')) + '</h3><div class="fit-list">';
    rows.forEach(function (r) {
      var best = Math.abs(r.fit.total - top) < 0.5;
      html += '<div class="fit' + (best ? ' fit--best' : '') + '"><div class="fit__head"><strong>' + esc(SC.t('strat.' + r.id + '.name')) + '</strong> ' + lvl(r.fit.level, 'fit.level.' + r.fit.level) +
        (best ? ' <span class="badge badge--verified">' + esc(SC.t('fit.best')) + '</span>' : '') + '</div>' +
        '<div class="meter" aria-hidden="true"><span style="width:' + r.fit.total.toFixed(0) + '%"></span></div>' +
        '<p class="small">' + esc(SC.t('fit.score', { n: SC.num(r.fit.total) })) + '</p>' +
        '<ul class="fit__parts">' + r.fit.parts.map(function (p) { return '<li>' + esc(SC.t('prio.' + p.id)) + ': ' + lvl(p.level) + '</li>'; }).join('') + '</ul></div>';
    });
    html += '</div><p class="small muted">' + esc(SC.t('fit.note')) + '</p>';
    host.innerHTML = html;
  }

  function renderTable(all) {
    var ids = SC.provider.strategyIds();
    function cell(id, html) { return '<td data-label="' + esc(SC.t('strat.' + id + '.name')) + '">' + html + '</td>'; }
    var rows = [
      ['tbl.water', function (id) { var a = all[id]; return '<p>' + lvl(a.levels.waterSaving) + '</p><p>' + esc(cat(a.waterCategory)) + '</p>'; }],
      ['tbl.nitro', function (id) { var a = all[id]; return '<p>' + lvl(a.legumes.length ? 'good' : 'poor') + '</p><p>' + esc(SC.t(a.legumes.length ? 'tbl.nitro.yes' : 'tbl.nitro.no')) + '</p>'; }],
      ['tbl.cover', function (id) { var a = all[id]; return '<p>' + lvl(a.levels.erosionControl) + '</p><p>' + esc(cat(a.coverCategory)) + '</p>'; }],
      ['tbl.pest', function (id) { var a = all[id]; return '<p>' + lvl(pestLevel(a)) + '</p><p>' + esc(SC.num(a.familyCount)) + '</p>'; }],
      ['tbl.income', function (id) { var a = all[id]; return '<p>' + lvl(a.levels.income) + '</p><p>' + esc(cat(incomeCat(a.scores.income))) + '</p>'; }],
      ['tbl.risk', function (id) { return '<p>' + esc(SC.t('tbl.risk.' + id)) + '</p>'; }],
      ['tbl.evidence', function (id) { return '<p><span class="badge badge--demo">' + esc(SC.t(id === 'existing' ? 'ev.existing' : 'ev.assumption')) + '</span></p>'; }]
    ];
    var html = '<table class="cmp"><caption class="sr-only">' + esc(SC.t('tbl.title')) + '</caption><thead><tr><th scope="col">' + esc(SC.t('tbl.criterion')) + '</th>' +
      ids.map(function (id) { return '<th scope="col">' + esc(SC.t('strat.' + id + '.name')) + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><th scope="row">' + esc(SC.t(r[0])) + '</th>' + ids.map(function (id) { return cell(id, r[1](id)); }).join('') + '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('rot-table').innerHTML = html;
  }

  function renderWhy(all) {
    var id = SC.state.explain, a = all[id], c = SC.provider.climate(SC.state.district);
    var rd = c.rain.recent - c.rain.old;
    var picker = '<div class="chips" role="group" aria-label="' + esc(SC.t('why.pick')) + '">' + SC.provider.strategyIds().map(function (s) {
      return '<button type="button" class="chip" data-why="' + s + '" data-focus="why-' + s + '" aria-pressed="' + (s === id) + '"><span class="chip__mark" aria-hidden="true">✓</span>' + esc(SC.t('strat.' + s + '.name')) + '</button>';
    }).join('') + '</div>';
    var risks = risksFor(id, a).slice(0, 3);
    var html = '<p class="muted">' + esc(SC.t('why.pick')) + '</p>' + picker + '<div class="why-grid">';
    html += '<section class="why"><h4>' + esc(SC.t('why.relevant')) + '</h4><p>' + esc(SC.t('why.rel.climate', { district: SC.t('district.' + SC.state.district), old: SC.num(c.hotDays.old), recent: SC.num(c.hotDays.recent), diff: SC.num(Math.abs(rd), { group: true }), dir: SC.t(rd >= 0 ? 'dir.more' : 'dir.less') })) + '</p><p>' + esc(SC.t('why.rel.' + id)) + '</p></section>';
    html += '<section class="why"><h4>' + esc(SC.t('why.benefit')) + '</h4><p>' + esc(SC.t('why.ben.' + id)) + '</p></section>';
    html += '<section class="why"><h4>' + esc(SC.t('why.risk')) + '</h4><ul class="plain">' + risks.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></section>';
    html += '<section class="why"><h4>' + esc(SC.t('why.missing')) + '</h4><ul class="plain">' + ['soil', 'variety', 'market', 'water', 'slope'].map(function (k) { return '<li>' + esc(SC.t('miss.' + k)) + '</li>'; }).join('') + '</ul></section>';
    html += '<section class="why why--expert"><h4>' + esc(SC.t('why.expert')) + '</h4><p>' + esc(SC.t('why.expert.text')) + '</p></section></div>';
    document.getElementById('rot-why').innerHTML = html;
  }

  function render() {
    var all = analyseAll();
    document.getElementById('rot-lead').textContent = SC.t('rot.lead', { district: SC.t('district.' + SC.state.district), crop: SC.t('crop.' + SC.state.crop) });
    renderPriorities();
    renderFit(all);
    document.getElementById('rot-cards').innerHTML = SC.provider.strategyIds().map(function (id) { return cardHtml(id, all[id]); }).join('');
    renderTable(all);
    renderWhy(all);
  }

  function init() {
    if (!SC.state.explain) SC.state.explain = 'legume';
    document.getElementById('rot-priorities').addEventListener('click', function (e) {
      var b = e.target.closest('[data-prio]'); if (!b) return;
      var id = b.getAttribute('data-prio'), cur = SC.state.priorities.slice(), i = cur.indexOf(id);
      if (i > -1) cur.splice(i, 1); else cur.push(id);
      SC.setState({ priorities: cur });
    });
    document.getElementById('rot-why').addEventListener('click', function (e) {
      var b = e.target.closest('[data-why]'); if (!b) return;
      SC.setState({ explain: b.getAttribute('data-why') });
    });
  }

  SC.registerSection({ id: 'rotation', init: init, render: render });
})(window.SC = window.SC || {});
