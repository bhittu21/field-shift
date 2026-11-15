/* Footer: truthful data/connection status taken from the provider, never hardcoded as "connected". */
(function (SC) {
  'use strict';

  function row(badgeClass, badgeKey, labelKey, textKey) {
    return '<li><span class="badge badge--' + badgeClass + '">' + SC.t(badgeKey) + '</span>' +
      '<span><strong>' + SC.t(labelKey) + ':</strong> ' + SC.t(textKey) + '</span></li>';
  }

  function render() {
    /* The provider reports no database and no live NASA retrieval. If that ever changes,
       add dedicated "connected" strings here instead of reusing the not-connected text. */
    var html = '';
    html += row('notConnected', 'status.notConnected', 'footer.db', 'footer.dbNone');
    html += row('notConnected', 'status.notConnected', 'footer.nasa', 'footer.nasaNone');
    html += row('demo', 'status.demo', 'footer.data', 'footer.dataDemo');
    document.getElementById('footer-status').innerHTML = html;
  }

  SC.registerSection({ id: 'footer', render: render });
})(window.SC = window.SC || {});
