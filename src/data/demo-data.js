/*
 * SowCast demonstration dataset.
 *
 * EVERYTHING in this file is SYNTHETIC and ILLUSTRATIVE.
 * It is not measured, not retrieved from NASA, and not agronomic research.
 * Replace this module (via src/data/provider.js) with real, verified data later.
 *
 * Language-free on purpose: names/labels live in src/translations/.
 */
(function (SC) {
  'use strict';

  var META = {
    isDemo: true,
    dataStatus: 'synthetic',
    version: '0.1-demo',
    oldPeriod: { from: 1991, to: 2005 },
    recentPeriod: { from: 2010, to: 2024 }
  };

  /* Seasonal share of annual rainfall per month (Jan..Dec), each row sums to 1. */
  var RAIN_SHAPE_OLD = [0.01, 0.02, 0.03, 0.06, 0.11, 0.18, 0.2, 0.17, 0.14, 0.06, 0.015, 0.005];
  var RAIN_SHAPE_NEW = [0.01, 0.02, 0.03, 0.05, 0.1, 0.16, 0.21, 0.19, 0.15, 0.07, 0.015, 0.005];

  /*
   * Districts. Values are illustrative district-level numbers, NOT field measurements.
   * hotDays: days per year above a hot threshold (illustrative).
   * onset: day-of-year when heavy monsoon rain is estimated to begin.
   * soil / ndvi: [winter, pre-monsoon, monsoon, post-monsoon] indicators.
   *   soil = relative soil-moisture index 0-100, ndvi = vegetation index 0-1 (demo).
   * plantShift: days the recent planting window moved vs. the old one (+ later, - earlier).
   */
  var DISTRICTS = {
    dhaka: {
      id: 'dhaka',
      meanTemp: { old: 25.6, recent: 26.3 },
      hotDays: { old: 8, recent: 17 },
      rain: { old: 1950, recent: 1880 },
      onset: { old: 155, recent: 163 },
      soil: { old: [38, 30, 72, 55], recent: [35, 26, 70, 50] },
      ndvi: { old: [0.52, 0.44, 0.71, 0.62], recent: [0.5, 0.41, 0.69, 0.6] },
      plantShift: 7
    },
    rajshahi: {
      id: 'rajshahi',
      meanTemp: { old: 25.4, recent: 26.3 },
      hotDays: { old: 22, recent: 41 },
      rain: { old: 1450, recent: 1330 },
      onset: { old: 165, recent: 176 },
      soil: { old: [30, 22, 62, 44], recent: [26, 17, 57, 38] },
      ndvi: { old: [0.46, 0.36, 0.64, 0.55], recent: [0.43, 0.32, 0.6, 0.5] },
      plantShift: 12
    },
    khulna: {
      id: 'khulna',
      meanTemp: { old: 26.1, recent: 26.8 },
      hotDays: { old: 12, recent: 26 },
      rain: { old: 1850, recent: 1900 },
      onset: { old: 150, recent: 154 },
      soil: { old: [44, 34, 76, 60], recent: [42, 31, 76, 57] },
      ndvi: { old: [0.55, 0.45, 0.72, 0.64], recent: [0.53, 0.43, 0.71, 0.62] },
      plantShift: 4
    },
    rangpur: {
      id: 'rangpur',
      meanTemp: { old: 24.9, recent: 25.5 },
      hotDays: { old: 5, recent: 11 },
      rain: { old: 2300, recent: 2140 },
      onset: { old: 148, recent: 152 },
      soil: { old: [40, 32, 74, 58], recent: [37, 29, 71, 54] },
      ndvi: { old: [0.54, 0.46, 0.73, 0.64], recent: [0.52, 0.44, 0.71, 0.62] },
      plantShift: 5
    },
    barishal: {
      id: 'barishal',
      meanTemp: { old: 26.0, recent: 26.6 },
      hotDays: { old: 7, recent: 15 },
      rain: { old: 2100, recent: 2160 },
      onset: { old: 150, recent: 147 },
      soil: { old: [46, 36, 78, 62], recent: [45, 35, 79, 62] },
      ndvi: { old: [0.57, 0.47, 0.74, 0.66], recent: [0.56, 0.46, 0.74, 0.65] },
      plantShift: -3
    },
    sylhet: {
      id: 'sylhet',
      meanTemp: { old: 24.7, recent: 25.2 },
      hotDays: { old: 3, recent: 7 },
      rain: { old: 3600, recent: 3420 },
      onset: { old: 125, recent: 121 },
      soil: { old: [48, 40, 82, 66], recent: [46, 38, 81, 64] },
      ndvi: { old: [0.6, 0.52, 0.78, 0.7], recent: [0.58, 0.5, 0.77, 0.69] },
      plantShift: -4
    }
  };

  /* Seasons used for soil / vegetation comparisons. */
  var SEASONS = ['winter', 'preMonsoon', 'monsoon', 'postMonsoon'];

  /*
   * Crops. Characteristics are COARSE ILLUSTRATIVE categories, not agronomic thresholds.
   * water: 1 low .. 3 high   cover: ground cover 1 low .. 3 high
   * income: market/income potential 1 low .. 3 high (market-dependent, uncertain)
   * heat: tolerance to heat stress 1 low .. 3 high
   * legume: can fix nitrogen (illustrative)   family: for pest-cycle diversity
   * window: example sowing/transplanting window as [startDayOfYear, endDayOfYear] in the OLD period.
   * shiftFactor: how strongly the district planting shift applies to this crop.
   */
  var CROPS = {
    boro: { id: 'boro', water: 3, cover: 3, income: 3, heat: 1, legume: false, family: 'grass', season: 'rabi',
      window: [335, 365], shiftFactor: 1 },
    aman: { id: 'aman', water: 2, cover: 3, income: 2, heat: 2, legume: false, family: 'grass', season: 'kharif2',
      window: [182, 213], shiftFactor: 1 },
    wheat: { id: 'wheat', water: 2, cover: 2, income: 2, heat: 1, legume: false, family: 'grass', season: 'rabi',
      window: [305, 335], shiftFactor: 1 },
    mustard: { id: 'mustard', water: 1, cover: 2, income: 2, heat: 2, legume: false, family: 'brassica', season: 'rabi',
      window: [288, 318], shiftFactor: 0.8 },
    lentil: { id: 'lentil', water: 1, cover: 2, income: 2, heat: 2, legume: true, family: 'legume', season: 'rabi',
      window: [298, 328], shiftFactor: 0.8 },
    mung: { id: 'mung', water: 1, cover: 2, income: 2, heat: 3, legume: true, family: 'legume', season: 'kharif1',
      window: [60, 91], shiftFactor: 0.6 },
    fallow: { id: 'fallow', water: 0, cover: 1, income: 0, heat: 2, legume: false, family: 'none', season: 'none',
      window: null, shiftFactor: 0 }
  };

  /* The six crops a farmer can pick (fallow is only a step inside rotations). */
  var CROP_IDS = ['boro', 'aman', 'wheat', 'mustard', 'lentil', 'mung'];
  var DISTRICT_IDS = ['dhaka', 'rajshahi', 'khulna', 'rangpur', 'barishal', 'sylhet'];

  /*
   * Example rotation sequences per selected crop. ILLUSTRATIVE scenarios only,
   * not agronomic recommendations. Order is an example across seasons.
   */
  var ROTATIONS = {
    boro:    { existing: ['boro', 'fallow', 'aman'],     legume: ['boro', 'mung', 'aman'],       water: ['mustard', 'mung', 'aman'] },
    aman:    { existing: ['aman', 'fallow', 'boro'],     legume: ['aman', 'lentil', 'mung'],     water: ['aman', 'mustard', 'mung'] },
    wheat:   { existing: ['wheat', 'fallow', 'aman'],    legume: ['wheat', 'mung', 'aman'],      water: ['wheat', 'mung', 'fallow'] },
    mustard: { existing: ['mustard', 'fallow', 'aman'],  legume: ['mustard', 'mung', 'aman'],    water: ['mustard', 'mung', 'fallow'] },
    lentil:  { existing: ['lentil', 'fallow', 'aman'],   legume: ['lentil', 'aman', 'mustard'],  water: ['lentil', 'mustard', 'fallow'] },
    mung:    { existing: ['mung', 'fallow', 'aman'],     legume: ['mung', 'aman', 'lentil'],     water: ['mung', 'mustard', 'fallow'] }
  };

  var STRATEGY_IDS = ['existing', 'legume', 'water'];

  /*
   * Farmer priorities. Each priority maps to a scoring dimension.
   * Weights are DEMONSTRATION ASSUMPTIONS. They are not a validated model.
   */
  var PRIORITIES = [
    { id: 'water', dimension: 'waterSaving' },
    { id: 'soil', dimension: 'soilHealth' },
    { id: 'erosion', dimension: 'erosionControl' },
    { id: 'income', dimension: 'income' },
    { id: 'resilience', dimension: 'resilience' }
  ];

  /*
   * Data sources. `status` is one of: demo | planned | notConnected | verified.
   * Nothing is "verified" yet: no live NASA retrieval exists in this build.
   * `kind`: nasa | partner | future.
   */
  var SOURCES = [
    { id: 'smap', kind: 'nasa', status: 'demo', shows: ['soil', 'water'], url: 'https://smap.jpl.nasa.gov/' },
    { id: 'gpm', kind: 'nasa', status: 'demo', shows: ['rain'], url: 'https://gpm.nasa.gov/data/imerg' },
    { id: 'power', kind: 'nasa', status: 'demo', shows: ['temp'], url: 'https://power.larc.nasa.gov/' },
    { id: 'modis', kind: 'nasa', status: 'demo', shows: ['ndvi'], url: 'https://modis.gsfc.nasa.gov/' },
    { id: 'srtm', kind: 'nasa', status: 'planned', shows: [], url: 'https://www.earthdata.nasa.gov/data/instruments/srtm' },
    { id: 'ecostress', kind: 'nasa', status: 'planned', shows: [], url: 'https://ecostress.jpl.nasa.gov/' },
    { id: 'grace', kind: 'nasa', status: 'notConnected', shows: [], url: 'https://grace.jpl.nasa.gov/' },
    { id: 'sentinel2', kind: 'partner', status: 'notConnected', shows: [], url: 'https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2' },
    { id: 'era5', kind: 'partner', status: 'notConnected', shows: [], url: 'https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5' },
    { id: 'localSoil', kind: 'future', status: 'notConnected', shows: [], url: '' }
  ];

  SC.data = {
    META: META,
    DISTRICTS: DISTRICTS,
    DISTRICT_IDS: DISTRICT_IDS,
    CROPS: CROPS,
    CROP_IDS: CROP_IDS,
    SEASONS: SEASONS,
    RAIN_SHAPE: { old: RAIN_SHAPE_OLD, recent: RAIN_SHAPE_NEW },
    ROTATIONS: ROTATIONS,
    STRATEGY_IDS: STRATEGY_IDS,
    PRIORITIES: PRIORITIES,
    SOURCES: SOURCES
  };
})(window.SC = window.SC || {});
