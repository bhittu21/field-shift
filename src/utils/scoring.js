/*
 * Illustrative rotation analysis.
 * Everything here is a DEMONSTRATION heuristic built from coarse, made-up crop categories in demo-data.js.
 * It is NOT a validated agronomic or predictive model. Weights are equal and shown to the user.
 */
(function (SC) {
  'use strict';

  function mean(a) { return a.reduce(function (s, v) { return s + v; }, 0) / (a.length || 1); }
  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  /* Level from a 0-100 score. Cut-offs are illustrative. */
  function level(score) { return score >= 67 ? 'good' : score >= 40 ? 'medium' : 'poor'; }

  /* Analyse one crop sequence in one district. */
  function analyse(sequence, districtId) {
    var crops = sequence.map(function (id) { return SC.provider.crop(id); });
    var avgWater = mean(crops.map(function (c) { return c.water; }));
    var avgCover = mean(crops.map(function (c) { return c.cover; }));
    var avgIncome = mean(crops.map(function (c) { return c.income; }));
    var avgHeat = mean(crops.map(function (c) { return c.heat; }));
    var families = {};
    crops.forEach(function (c) { if (c.family !== 'none') families[c.family] = true; });
    var familyCount = Object.keys(families).length;
    var legumes = sequence.filter(function (id) { return SC.provider.crop(id).legume; });
    var fallows = sequence.filter(function (id) { return id === 'fallow'; }).length;

    var c = SC.provider.climate(districtId);
    var allHot = SC.data.DISTRICT_IDS.map(function (d) { return SC.data.DISTRICTS[d].hotDays.recent; });
    var heatStress = c.hotDays.recent / Math.max.apply(null, allHot); /* 0..1 within the six demo districts */
    var heatWeight = 0.3 + 0.4 * heatStress;
    var diversity = Math.min(1, familyCount / 3);

    var scores = {
      waterSaving: clamp(100 * (1 - avgWater / 3)),
      soilHealth: clamp((legumes.length ? 35 : 0) + 35 * diversity + 30 * (avgCover / 3)),
      erosionControl: clamp(100 * (avgCover / 3)),
      income: clamp(100 * (avgIncome / 3)),
      resilience: clamp(100 * ((1 - heatWeight) * diversity + heatWeight * (avgHeat / 3)))
    };

    return {
      sequence: sequence,
      scores: scores,
      levels: Object.keys(scores).reduce(function (o, k) { o[k] = level(scores[k]); return o; }, {}),
      avgWater: avgWater,
      waterCategory: avgWater <= 1.1 ? 'low' : avgWater <= 1.8 ? 'medium' : 'high',
      coverCategory: avgCover >= 2.5 ? 'high' : avgCover >= 1.8 ? 'medium' : 'low',
      familyCount: familyCount,
      legumes: legumes,
      fallows: fallows
    };
  }

  /* Illustrative fit for selected priorities: plain average of the matching dimension scores (equal weights). */
  function fit(analysis, priorityIds) {
    if (!priorityIds.length) return null;
    var dims = SC.provider.priorities().filter(function (p) { return priorityIds.indexOf(p.id) > -1; });
    var parts = dims.map(function (p) { return { id: p.id, score: analysis.scores[p.dimension], level: level(analysis.scores[p.dimension]) }; });
    var total = mean(parts.map(function (x) { return x.score; }));
    return { total: total, level: level(total), parts: parts };
  }

  SC.scoring = { analyse: analyse, fit: fit, level: level };
})(window.SC = window.SC || {});
