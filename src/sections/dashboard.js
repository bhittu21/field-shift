/* District + crop selectors. They own SC.state.district / SC.state.crop. */
(function (SC) {
  'use strict';

  function fill(select, ids, prefix, current) {
    select.innerHTML = ids.map(function (id) {
      return '<option value="' + id + '">' + SC.t(prefix + id) + '</option>';
    }).join('');
    select.value = current;
  }

  function render() {
    var s = SC.state;
    fill(document.getElementById('sel-district'), SC.provider.districtIds(), 'district.', s.district);
    fill(document.getElementById('sel-crop'), SC.provider.cropIds(), 'crop.', s.crop);
    document.getElementById('dash-summary').textContent = SC.t('dash.selected', {
      district: SC.t('district.' + s.district),
      crop: SC.t('crop.' + s.crop)
    });
  }

  function init() {
    document.getElementById('sel-district').addEventListener('change', function (e) {
      SC.setState({ district: e.target.value });
    });
    document.getElementById('sel-crop').addEventListener('change', function (e) {
      SC.setState({ crop: e.target.value });
    });
  }

  SC.registerSection({ id: 'dashboard', init: init, render: render });
})(window.SC = window.SC || {});
