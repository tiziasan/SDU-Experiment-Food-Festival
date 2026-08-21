/* ------------------------------------------------------------------
   Nudge2Green - deployment settings
   Paste your Google Apps Script Web App URL below (the .../exec one).
   See apps-script/README-SETUP.md for the 5-minute setup.
------------------------------------------------------------------- */
const CONFIG = {
  ENDPOINT: 'https://script.google.com/macros/s/AKfycbwck9vPk71es5I3asfGkHll1_XM9tPnioBbKUrkLbX4aDj9msOykTdDihytsoqayzC7ng/exec',                       // <-- e.g. 'https://script.google.com/macros/s/AKfy.../exec'
  STUDY_ID: 'nudge2green_cph_2026',
  BUDGET_DKK: 250,
  N_DINNERS: 3,
  N_PEOPLE: 2,
  DEFAULT_LANG: 'da',                 // 'da' or 'en'
  SHUFFLE_CATALOGUE: false,           // keep false: every participant sees the same order
  MAX_QTY_PER_PRODUCT: 9,
  USE_PHOTOS: false                   // true once img/<id>.jpg files exist; false = emoji tiles
};
