/*
 * Data-provider abstraction.
 * The UI only talks to SC.provider. Today it reads the local synthetic dataset.
 * To use a real backend later, implement the same methods and swap this object.
 */
(function (SC) {
  'use strict';
  var D = SC.data;

  function round(n) { return Math.round(n); }

  var provider = {
    id: 'local-demo',

    /* Truthful connection status. No database or live API is configured in this repository. */
    connection: {
      database: { configured: false, connected: false, type: 'none' },
      liveNasa: { configured: false, connected: false }
    },

    meta: function () { return D.META; },
    districtIds: function () { return D.DISTRICT_IDS; },
    cropIds: function () { return D.CROP_IDS; },
    crop: function (id) { return D.CROPS[id]; },
    sources: function () { return D.SOURCES; },
    priorities: function () { return D.PRIORITIES; },
    strategyIds: function () { return D.STRATEGY_IDS; },

    climate: function (districtId) {
      var d = D.DISTRICTS[districtId];
      var shapeOld = D.RAIN_SHAPE.old, shapeNew = D.RAIN_SHAPE.recent;
      return {
        id: d.id,
        meanTemp: d.meanTemp,
        hotDays: d.hotDays,
        rain: d.rain,
        onset: d.onset,
        soil: d.soil,
        ndvi: d.ndvi,
        monthlyRain: {
          old: shapeOld.map(function (s) { return round(d.rain.old * s); }),
          recent: shapeNew.map(function (s) { return round(d.rain.recent * s); })
        },
        isDemo: true,
        dataStatus: 'synthetic'
      };
    },

    /* Planting window for a crop in a district. Day-of-year ranges, old vs recent period. */
    plantingWindow: function (districtId, cropId) {
      var c = D.CROPS[cropId], d = D.DISTRICTS[districtId];
      var shift = round(d.plantShift * c.shiftFactor);
      return {
        old: c.window,
        recent: [c.window[0] + shift, c.window[1] + shift],
        shiftDays: shift
      };
    },

    rotationSequences: function (cropId) { return D.ROTATIONS[cropId]; },

    /* Preferences. localStorage only; failure is non-fatal. */
    prefs: {
      get: function (key) { try { return window.localStorage.getItem('sowcast.' + key); } catch (e) { return null; } },
      set: function (key, v) { try { window.localStorage.setItem('sowcast.' + key, v); } catch (e) { /* ignore */ } }
    }
  };

  SC.provider = provider;
})(window.SC = window.SC || {});
