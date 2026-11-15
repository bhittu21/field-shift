/* NASA / partner data source cards. Status comes from the dataset and is never "verified" without a real connection. */
(function (SC) {
  'use strict';
  var esc = SC.charts.esc;
  var GROUPS = [['nasa', 'src.group.nasa'], ['partner', 'src.group.partner'], ['future', 'src.group.future']];

  function card(s) {
    var id = s.id;
    var html = '<article class="card src-card" aria-labelledby="src-' + id + '">';
    html += '<header class="src-card__head"><h4 id="src-' + id + '">' + esc(SC.t('src.' + id + '.name')) + '</h4>' +
      '<span class="badge badge--' + s.status + '">' + esc(SC.t('status.' + s.status)) + '</span></header>';
    html += '<p><strong>' + esc(SC.t('src.purpose')) + ':</strong> ' + esc(SC.t('src.' + id + '.purpose')) + '</p>';
    html += '<p><strong>' + esc(SC.t('src.shows')) + ':</strong> ' + esc(SC.t('src.' + id + '.shows')) + '</p>';
    html += '<p><strong>' + esc(SC.t('src.usedIn')) + ':</strong> ' + esc(SC.t('src.' + id + '.used')) + '</p>';
    html += '<p class="src-card__note">' + esc(SC.t('src.note.' + s.status)) + '</p>';
    if (s.url) html += '<p class="src-card__link"><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(SC.t('src.link')) + '</a></p>';
    return html + '</article>';
  }

  function render() {
    var list = SC.provider.sources(), html = '';
    GROUPS.forEach(function (g) {
      var items = list.filter(function (s) { return s.kind === g[0]; });
      if (!items.length) return;
      html += '<h3 class="src-group">' + esc(SC.t(g[1])) + '</h3><div class="grid src-grid">' + items.map(card).join('') + '</div>';
    });
    document.getElementById('sources-list').innerHTML = html;
  }

  SC.registerSection({ id: 'sources', render: render });
})(window.SC = window.SC || {});
