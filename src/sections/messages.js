/* WhatsApp-style and SMS visual mock-ups. Display only: no message is sent, no service is connected. */
(function (SC) {
  'use strict';
  var esc = SC.charts.esc;

  function render() {
    var st = SC.state;
    var c = SC.provider.climate(st.district);
    var seqs = SC.provider.rotationSequences(st.crop);
    var seq = seqs.legume.map(function (id) { return SC.t('crop.' + id); }).join(SC.t('msg.sep'));
    var p = {
      district: SC.t('district.' + st.district), crop: SC.t('crop.' + st.crop),
      old: SC.num(c.hotDays.old), recent: SC.num(c.hotDays.recent),
      name: SC.t('strat.legume.name'), seq: seq
    };
    var smsText = SC.t('msg.sms.text', p);
    var time = SC.t('msg.time');

    var wa = '<div class="phone phone--wa" role="group" aria-label="' + esc(SC.t('msg.wa.title')) + '">' +
      '<div class="phone__bar"><span class="phone__avatar" aria-hidden="true">S</span><span class="phone__name">' + esc(SC.t('msg.wa.name')) + '</span></div>' +
      '<div class="phone__body">' +
        '<div class="bubble bubble--out"><p>' + esc(SC.t('msg.wa.q', p)) + '</p><span class="bubble__time">' + esc(time) + '</span></div>' +
        '<div class="bubble bubble--in"><p>' + esc(SC.t('msg.wa.a1', p)) + '</p><span class="bubble__time">' + esc(time) + '</span></div>' +
        '<div class="bubble bubble--in"><p>' + esc(SC.t('msg.wa.a2', p)) + '</p><span class="bubble__time">' + esc(time) + '</span></div>' +
        '<div class="bubble bubble--in"><p>' + esc(SC.t('msg.wa.a3', p)) + '</p><span class="bubble__time">' + esc(time) + '</span></div>' +
      '</div>' +
      '<div class="phone__input" aria-hidden="true">' + esc(SC.t('msg.wa.input')) + '</div></div>';

    var sms = '<div class="phone phone--sms" role="group" aria-label="' + esc(SC.t('msg.sms.title')) + '">' +
      '<div class="phone__bar phone__bar--sms"><span class="phone__name">' + esc(SC.t('msg.sms.from')) + '</span></div>' +
      '<div class="phone__body phone__body--sms">' +
        '<div class="sms"><p>' + esc(smsText) + '</p><span class="bubble__time">' + esc(time) + '</span></div>' +
        '<p class="small muted">' + esc(SC.t('msg.sms.chars', { n: SC.num(Array.from(smsText).length) })) + '</p>' +
      '</div></div>';

    document.getElementById('msg-grid').innerHTML =
      '<div class="msg-col"><h3>' + esc(SC.t('msg.wa.title')) + '</h3>' + wa + '</div>' +
      '<div class="msg-col"><h3>' + esc(SC.t('msg.sms.title')) + '</h3>' + sms + '</div>';
  }

  SC.registerSection({ id: 'messages', render: render });
})(window.SC = window.SC || {});
