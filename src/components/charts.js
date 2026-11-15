/*
 * Chart helpers. Plain HTML/CSS bars (no canvas, no SVG text) so labels wrap instead of colliding,
 * for any width and for Bangla text. Each chart also ships a visually hidden data table.
 * Titles live OUTSIDE the plotting area (figcaption).
 */
(function (SC) {
  'use strict';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pct(v, min, max) { return Math.max(2, Math.min(100, ((v - min) / (max - min)) * 100)); }

  /*
   * opts: { id, title, desc, rows:[{label, old, recent}], min, max, fmt(v), thenLabel, nowLabel, legendNote, compact }
   * Draws one group per row, two bars each (then = striped, now = solid).
   */
  function barChart(o) {
    var min = o.min || 0, max = o.max;
    var thenTxt = SC.t('shift.thenFull', { range: o.thenRange });
    var nowTxt = SC.t('shift.nowFull', { range: o.nowRange });
    var html = '<figure class="chart" aria-labelledby="' + o.id + '-cap">';
    html += '<figcaption id="' + o.id + '-cap"><h4 class="chart__title">' + esc(o.title) + '</h4><p class="chart__desc">' + esc(o.desc) + '</p></figcaption>';
    html += '<ul class="chart__legend" aria-hidden="true"><li><span class="swatch swatch--then"></span>' + esc(thenTxt) + '</li><li><span class="swatch swatch--now"></span>' + esc(nowTxt) + '</li></ul>';
    html += '<div class="chart__plot" aria-hidden="true">';
    o.rows.forEach(function (r) {
      html += '<div class="cgroup"><div class="cgroup__label">' + esc(r.label) + '</div><div class="cgroup__bars">' +
        bar('then', r.old, min, max, o.fmt) + bar('now', r.recent, min, max, o.fmt) + '</div></div>';
    });
    html += '</div>';
    html += '<div class="sr-only"><table><caption>' + esc(o.title) + '</caption><thead><tr><th scope="col">' + SC.t('chart.table.group') + '</th><th scope="col">' + esc(thenTxt) + '</th><th scope="col">' + esc(nowTxt) + '</th></tr></thead><tbody>';
    o.rows.forEach(function (r) {
      html += '<tr><th scope="row">' + esc(r.label) + '</th><td>' + esc(o.fmt(r.old)) + '</td><td>' + esc(o.fmt(r.recent)) + '</td></tr>';
    });
    html += '</tbody></table></div></figure>';
    return html;
  }

  function bar(kind, v, min, max, fmt) {
    return '<div class="cbar"><div class="cbar__track"><span class="cbar__fill cbar__fill--' + kind + '" style="width:' + pct(v, min, max).toFixed(1) + '%"></span></div>' +
      '<span class="cbar__val">' + esc(fmt(v)) + '</span></div>';
  }

  /* Range chart: bars positioned on a shared axis. rows: [{label, from, to, kind, text}] */
  function rangeChart(o) {
    var html = '<figure class="chart" aria-labelledby="' + o.id + '-cap">';
    html += '<figcaption id="' + o.id + '-cap"><h4 class="chart__title">' + esc(o.title) + '</h4><p class="chart__desc">' + esc(o.desc) + '</p></figcaption>';
    html += '<div class="chart__plot">';
    o.rows.forEach(function (r) {
      var left = ((r.from - o.min) / (o.max - o.min)) * 100;
      var width = Math.max(3, ((r.to - r.from) / (o.max - o.min)) * 100);
      html += '<div class="rgroup"><div class="cgroup__label">' + esc(r.label) + '</div>' +
        '<div class="rtrack" aria-hidden="true"><span class="rfill cbar__fill--' + r.kind + '" style="left:' + left.toFixed(1) + '%;width:' + width.toFixed(1) + '%"></span></div>' +
        '<div class="rtext">' + esc(r.text) + '</div></div>';
    });
    html += '</div></figure>';
    return html;
  }

  SC.charts = { barChart: barChart, rangeChart: rangeChart, esc: esc };
})(window.SC = window.SC || {});
