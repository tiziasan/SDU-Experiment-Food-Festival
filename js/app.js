/* ==================================================================
   Nudge2Green - questionnaire + constrained grocery task
   Screens: welcome -> survey -> task brief -> shop -> done
================================================================== */
(function () {
'use strict';

/* ---------------- helpers ---------------- */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const now = () => Date.now();
const kr  = n => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',').replace(',00', '');
const params = new URLSearchParams(location.search);

/* ---------------- questionnaire definition ----------------
   `key` is the column name written to the Google Sheet.
   `codes` are the numeric values stored alongside the English label. */
const QUESTIONS = [
  { key:'age',                  type:'number', label:'q_age',      min:15, max:99 },
  { key:'gender',               type:'single', label:'q_gender',   opts:'a_gender',
    codes:['woman','man','other','no_answer'] },
  { key:'household_size',       type:'single', label:'q_house',    opts:'a_house',
    codes:[1,2,3,4,5] },
  { key:'who_cooks',            type:'single', label:'q_cooks',    opts:'a_cooks',
    codes:['self','partner','shared','other_member','rarely_cook'] },
  { key:'price_importance',     type:'scale',  label:'q_price',    opts:'a_scale', codes:[1,2,3,4,5] },
  { key:'health_importance',    type:'scale',  label:'q_health',   opts:'a_scale', codes:[1,2,3,4,5] },
  { key:'env_importance',       type:'scale',  label:'q_env',      opts:'a_scale', codes:[1,2,3,4,5] },
  { key:'physical_activity',    type:'single', label:'q_activity', opts:'a_activity',
    codes:['none','light','moderate','high'] },
  { key:'meat_frequency',       type:'single', label:'q_meat',     opts:'a_meat',
    codes:['never','rarely','1_2_week','3_5_week','daily'] },
  { key:'dietary_restrictions', type:'multi',  label:'q_diet',     opts:'a_diet',
    codes:['none','vegetarian','vegan','pescatarian','gluten_free','lactose_free','halal','allergy_other'],
    exclusive:0 }
];

/* ---------------- state ---------------- */
const S = {
  lang: (params.get('lang') === 'en' || params.get('lang') === 'da')
        ? params.get('lang')
        : (localStorage.getItem('n2g_lang') || CONFIG.DEFAULT_LANG),
  pid: null,
  station: params.get('station') || '',
  qi: 0,
  answers: {},
  basket: {},                 // {productId: qty}
  order: [],                  // catalogue display order (product ids)
  cat: 'all',
  query: '',
  t: { start: now(), surveyDone: null, shopStart: null, submitted: null },
  ev: { adds: 0, removes: 0, searches: 0, budget_blocks: 0, cat_switches: 0 },
  submitted: false
};

const T = k => (I18N[S.lang] && I18N[S.lang][k]) !== undefined ? I18N[S.lang][k] : (I18N.da[k] || k);

/* ---------------- participant id ---------------- */
function makePid () {
  const ab = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';   // no 0/O/1/I
  const rnd = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(rnd, b => ab[b % ab.length]).join('');
}

/* ---------------- i18n rendering ---------------- */
function applyLang () {
  document.documentElement.lang = S.lang;
  $$('[data-i18n]').forEach(el => { el.innerHTML = T(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
  $('#langFlag').textContent = S.lang === 'da' ? '🇬🇧' : '🇩🇰';
  document.title = S.lang === 'da' ? 'Dagligvarer · Nudge2Green' : 'Groceries · Nudge2Green';
  if (isActive('scr-survey')) renderQuestion();
  if (isActive('scr-shop'))   { renderCats(); refreshShop(); }
}
const isActive = id => $('#' + id).classList.contains('active');

/* Pending survey auto-advance, cancelled on any manual navigation. */
let advanceT = null;
function cancelAdvance () { clearTimeout(advanceT); advanceT = null; }

/* ---------------- screen routing ---------------- */
function show (id) {
  cancelAdvance();
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  const shop = id === 'scr-shop';
  $('#budgetbar').hidden = !shop;
  $('#basketBtn').hidden = !shop;
  $('#checkoutFab').classList.toggle('show', shop && count() > 0);
  window.scrollTo(0, 0);
}

/* ---------------- toast ---------------- */
let toastT;
function toast (msg) {
  const el = $('#toast');
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { el.hidden = true; }, 2400);
}

/* ==================================================================
   SURVEY
================================================================== */
function renderQuestion () {
  const q = QUESTIONS[S.qi];
  const host = $('#qHost');
  $('#qErr').hidden = true;
  $('#progNow').textContent = S.qi + 1;
  $('#progTot').textContent = QUESTIONS.length;
  $('#progFill').style.width = ((S.qi + 1) / QUESTIONS.length * 100) + '%';
  $('#qBack').hidden = S.qi === 0;
  $('#qNext').innerHTML = S.qi === QUESTIONS.length - 1 ? T('s_toShop') : T('s_next');

  let html = '<div class="qtitle">' + T(q.label) + '</div>';
  if (q.type === 'multi') html += '<p class="qhint">' + (S.lang === 'da' ? 'Vælg gerne flere' : 'Select all that apply') + '</p>';
  else html += '<div style="height:14px"></div>';

  if (q.type === 'number') {
    const v = S.answers.age != null ? S.answers.age : '';
    html += '<div class="agebox"><input id="ageInput" type="number" inputmode="numeric" pattern="[0-9]*" ' +
            'min="' + q.min + '" max="' + q.max + '" value="' + v + '" placeholder="' + (S.lang === 'da' ? 'Din alder' : 'Your age') + '">' +
            '<span>' + (S.lang === 'da' ? 'år' : 'years') + '</span></div>';
  } else {
    const labels = T(q.opts);
    const cur = S.answers[q.key];
    html += '<div class="opts">';
    labels.forEach((lab, i) => {
      const sel = q.type === 'multi'
        ? (Array.isArray(cur) && cur.indexOf(i) > -1)
        : cur === i;
      const mark = q.type === 'multi' ? '<span class="box"></span>' : '<span class="dot"></span>';
      html += '<button type="button" class="opt' + (sel ? ' sel' : '') + '" data-i="' + i + '">' +
              mark + '<span>' + lab + '</span></button>';
    });
    html += '</div>';
  }
  host.innerHTML = html;

  if (q.type === 'number') {
    const inp = $('#ageInput');
    inp.addEventListener('input', () => {
      const n = parseInt(inp.value, 10);
      S.answers.age = isNaN(n) ? null : n;
      $('#qErr').hidden = true;
    });
    setTimeout(() => inp.focus(), 120);
  } else {
    $$('.opt', host).forEach(btn => btn.addEventListener('click', () => pick(q, +btn.dataset.i)));
  }
}

function pick (q, i) {
  cancelAdvance();
  if (q.type === 'multi') {
    let cur = Array.isArray(S.answers[q.key]) ? S.answers[q.key].slice() : [];
    if (i === q.exclusive) cur = cur.indexOf(i) > -1 ? [] : [i];
    else {
      cur = cur.filter(x => x !== q.exclusive);
      cur = cur.indexOf(i) > -1 ? cur.filter(x => x !== i) : cur.concat(i);
    }
    S.answers[q.key] = cur.sort((a, b) => a - b);
    renderQuestion();
  } else {
    S.answers[q.key] = i;
    renderQuestion();
    advanceT = setTimeout(nextQuestion, 190);   // auto-advance keeps the queue moving
  }
}

function answered (q) {
  const v = S.answers[q.key];
  if (q.type === 'number') return typeof v === 'number' && v >= q.min && v <= q.max;
  if (q.type === 'multi')  return Array.isArray(v) && v.length > 0;
  return typeof v === 'number';
}

function nextQuestion () {
  cancelAdvance();
  if (!isActive('scr-survey')) return;      // a queued auto-advance must not
  const q = QUESTIONS[S.qi];                // pull anyone out of the shop
  if (!answered(q)) {
    $('#qErr').innerHTML = q.type === 'number'
      ? (S.lang === 'da' ? 'Indtast en alder mellem 15 og 99.' : 'Enter an age between 15 and 99.')
      : T('s_required');
    $('#qErr').hidden = false;
    return;
  }
  if (S.qi === QUESTIONS.length - 1) {
    S.t.surveyDone = now();
    show('scr-task');
    return;
  }
  S.qi++;
  renderQuestion();
}

function prevQuestion () { cancelAdvance(); if (S.qi > 0) { S.qi--; renderQuestion(); } }

/* ==================================================================
   SHOP
================================================================== */
const byId = {};
PRODUCTS.forEach(p => { byId[p.id] = p; });

function buildOrder () {
  const ids = PRODUCTS.map(p => p.id);
  if (CONFIG.SHUFFLE_CATALOGUE || params.get('shuffle') === '1') {
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    S.orderMode = 'shuffled';
  } else {
    S.orderMode = 'fixed';
  }
  S.order = ids;
}

const count = () => Object.values(S.basket).reduce((a, b) => a + b, 0);
const total = () => Object.entries(S.basket).reduce((a, [id, q]) => a + byId[id].price * q, 0);
const lines = () => Object.keys(S.basket).length;

function renderCats () {
  const host = $('#cats');
  let html = '<button type="button" class="chip' + (S.cat === 'all' ? ' on' : '') + '" data-c="all">' +
             T('sh_all') + '</button>';
  CATEGORIES.forEach(c => {
    html += '<button type="button" class="chip' + (S.cat === c.id ? ' on' : '') + '" data-c="' + c.id + '">' +
            c.emoji + ' ' + c[S.lang] + '</button>';
  });
  host.innerHTML = html;
  $$('.chip', host).forEach(b => b.addEventListener('click', () => {
    if (S.cat !== b.dataset.c) S.ev.cat_switches++;
    S.cat = b.dataset.c;
    renderCats(); renderGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

function visible () {
  const q = S.query.trim().toLowerCase();
  return S.order.map(id => byId[id]).filter(p => {
    if (S.cat !== 'all' && p.cat !== S.cat) return false;
    if (!q) return true;
    return (p.da + ' ' + p.en + ' ' + p.sda + ' ' + p.sen).toLowerCase().indexOf(q) > -1;
  });
}

function renderGrid () {
  const list = visible();
  $('#noRes').hidden = list.length > 0;
  $('#grid').innerHTML = list.map(cardHTML).join('');
  wireCards();
}

/* Photos are opt-in: with USE_PHOTOS off we render the emoji tile directly
   instead of firing 81 image requests that would 404 on festival wifi. */
function thumb (p) {
  return CONFIG.USE_PHOTOS
    ? '<img src="img/' + p.id + '.jpg" alt="" loading="lazy" ' +
      'onerror="this.parentNode.textContent=\'' + p.emoji + '\'">'
    : p.emoji;
}

function cardHTML (p) {
  const qty = S.basket[p.id] || 0;
  const name = p[S.lang], size = S.lang === 'da' ? p.sda : p.sen;
  const fits = total() + p.price <= CONFIG.BUDGET_DKK;
  const ctrl = qty > 0
    ? '<div class="stepper" data-id="' + p.id + '">' +
        '<button type="button" data-act="dec" aria-label="-">−</button>' +
        '<span class="qty">' + qty + '</span>' +
        '<button type="button" data-act="inc" aria-label="+"' +
          (total() + p.price > CONFIG.BUDGET_DKK || qty >= CONFIG.MAX_QTY_PER_PRODUCT ? ' disabled' : '') + '>+</button>' +
      '</div>'
    : '<button type="button" class="cadd" data-id="' + p.id + '"' + (fits ? '' : ' disabled') + '>' +
        (fits ? T('sh_add') : T('sh_over')) + '</button>';
  return '<article class="card' + (qty ? ' in' : '') + '">' +
      '<div class="thumb">' + thumb(p) + '</div>' +
      '<div class="cbody"><div class="cname">' + name + '</div>' +
        '<div class="csize">' + size + '</div>' +
        '<div class="cprice">' + kr(p.price) + ' kr.</div></div>' + ctrl + '</article>';
}

function wireCards () {
  $$('#grid .cadd').forEach(b => b.addEventListener('click', () => add(b.dataset.id)));
  $$('#grid .stepper').forEach(st => {
    $$('button', st).forEach(b => b.addEventListener('click', () => {
      b.dataset.act === 'inc' ? add(st.dataset.id) : remove(st.dataset.id);
    }));
  });
}

function add (id) {
  const p = byId[id];
  if (total() + p.price > CONFIG.BUDGET_DKK) {
    S.ev.budget_blocks++;
    toast(T('sh_overMsg'));
    return;
  }
  const q = S.basket[id] || 0;
  if (q >= CONFIG.MAX_QTY_PER_PRODUCT) return;
  S.basket[id] = q + 1;
  S.ev.adds++;
  refreshShop();
}

function remove (id) {
  if (!S.basket[id]) return;
  S.basket[id]--;
  if (S.basket[id] <= 0) delete S.basket[id];
  S.ev.removes++;
  refreshShop();
}

function refreshShop () {
  renderGrid();
  renderBasket();
  const t = total(), n = count(), pct = Math.min(100, t / CONFIG.BUDGET_DKK * 100);
  $('#bbSpent').textContent = kr(t);
  const fill = $('#bbFill');
  fill.style.width = pct + '%';
  fill.className = 'bb-fill' + (pct >= 99 ? ' full' : pct >= 80 ? ' warn' : '');
  $('#basketBadge').textContent = n;
  $('#cfCount').textContent = n;
  $('#cfCountWord').textContent = n === 1 ? T('sh_item') : T('sh_items');
  $('#cfTotal').textContent = kr(t);
  $('#checkoutFab').classList.toggle('show', isActive('scr-shop') && n > 0);
}

function renderBasket () {
  const host = $('#sheetBody');
  const ids = Object.keys(S.basket);
  if (!ids.length) {
    host.innerHTML = '<div class="sheet-empty"><span class="e">🧺</span>' +
      '<b>' + T('sh_empty') + '</b><br><span style="font-size:.88rem">' + T('sh_emptyHint') + '</span></div>';
  } else {
    host.innerHTML = S.order.filter(id => S.basket[id]).map(id => {
      const p = byId[id], q = S.basket[id];
      return '<div class="brow">' +
        '<div class="bth">' + thumb(p) + '</div>' +
        '<div class="bmeta"><div class="bname">' + p[S.lang] + '</div>' +
          '<div class="bprice">' + q + ' × ' + kr(p.price) + ' = ' + kr(p.price * q) + ' kr.</div></div>' +
        '<div class="stepper" data-id="' + p.id + '">' +
          '<button type="button" data-act="dec">−</button><span class="qty">' + q + '</span>' +
          '<button type="button" data-act="inc"' +
            (total() + p.price > CONFIG.BUDGET_DKK || q >= CONFIG.MAX_QTY_PER_PRODUCT ? ' disabled' : '') + '>+</button>' +
        '</div></div>';
    }).join('');
    $$('.stepper', host).forEach(st => {
      $$('button', st).forEach(b => b.addEventListener('click', () => {
        b.dataset.act === 'inc' ? add(st.dataset.id) : remove(st.dataset.id);
      }));
    });
  }
  $('#sheetTotal').textContent = kr(total());
}

function openSheet () { $('#sheetBack').hidden = false; $('#sheet').hidden = false; renderBasket(); }
function closeSheet () { $('#sheetBack').hidden = true;  $('#sheet').hidden = true; }

/* ==================================================================
   PAYLOAD + SUBMISSION
================================================================== */
function surveyOut () {
  const o = {};
  QUESTIONS.forEach(q => {
    const v = S.answers[q.key];
    if (q.type === 'number') { o.age = v; return; }
    const en = I18N.en[q.opts];
    if (q.type === 'multi') {
      const arr = Array.isArray(v) ? v : [];
      o[q.key]            = arr.map(i => q.codes[i]).join('|');
      o[q.key + '_label'] = arr.map(i => en[i]).join('|');
    } else {
      o[q.key]            = q.codes[v];
      o[q.key + '_label'] = en[v];
    }
  });
  return o;
}

function basketOut () {
  return S.order.filter(id => S.basket[id]).map(id => {
    const p = byId[id], q = S.basket[id];
    return { product_id: id, name_en: p.en, name_da: p.da, category: p.cat,
             size_en: p.sen, unit_price_dkk: p.price, qty: q,
             line_total_dkk: Math.round(p.price * q * 100) / 100 };
  });
}

function summaryOut () {
  const items = basketOut(), byCat = {};
  CATEGORIES.forEach(c => { byCat['spend_' + c.id] = 0; });
  items.forEach(it => { byCat['spend_' + it.category] += it.line_total_dkk; });
  const t = Math.round(total() * 100) / 100;
  Object.keys(byCat).forEach(k => {
    byCat[k] = Math.round(byCat[k] * 100) / 100;
    byCat[k.replace('spend_', 'share_')] = t ? Math.round(byCat[k] / t * 1000) / 1000 : 0;
  });
  return Object.assign({
    n_lines: items.length, n_units: count(), total_dkk: t,
    budget_dkk: CONFIG.BUDGET_DKK, budget_left_dkk: Math.round((CONFIG.BUDGET_DKK - t) * 100) / 100,
    budget_used_pct: Math.round(t / CONFIG.BUDGET_DKK * 1000) / 10
  }, byCat);
}

function buildPayload () {
  const end = now();
  return {
    schema: 1,
    study_id: CONFIG.STUDY_ID,
    participant_id: S.pid,
    station: S.station,
    language: S.lang,
    consent: true,
    task: { dinners: CONFIG.N_DINNERS, people: CONFIG.N_PEOPLE, budget_dkk: CONFIG.BUDGET_DKK },
    catalogue: { n_products: PRODUCTS.length, order_mode: S.orderMode, order: S.order.join(',') },
    timing: {
      started_at:      new Date(S.t.start).toISOString(),
      survey_done_at:  S.t.surveyDone ? new Date(S.t.surveyDone).toISOString() : '',
      shop_started_at: S.t.shopStart  ? new Date(S.t.shopStart).toISOString()  : '',
      submitted_at:    new Date(end).toISOString(),
      survey_seconds: S.t.surveyDone ? Math.round((S.t.surveyDone - S.t.start) / 1000) : null,
      shop_seconds:   S.t.shopStart  ? Math.round((end - S.t.shopStart) / 1000)        : null,
      total_seconds:  Math.round((end - S.t.start) / 1000)
    },
    device: {
      type: matchMedia('(pointer:coarse)').matches ? 'touch' : 'desktop',
      viewport: innerWidth + 'x' + innerHeight,
      ua: navigator.userAgent
    },
    interactions: S.ev,
    survey: surveyOut(),
    basket_summary: summaryOut(),
    basket: basketOut()
  };
}

/* --- offline-tolerant queue: nothing is lost if the festival wifi drops --- */
const QKEY = 'n2g_queue';
const readQ  = () => { try { return JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch (e) { return []; } };
const writeQ = q  => { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch (e) {} };
function enqueue (p) { const q = readQ(); q.push(p); writeQ(q); }
function dequeue (pid) { writeQ(readQ().filter(p => p.participant_id !== pid)); }

function post (payload) {
  if (!CONFIG.ENDPOINT) return Promise.reject(new Error('no-endpoint'));
  // text/plain keeps this a CORS "simple request" - no preflight, which
  // Apps Script web apps do not answer.
  return fetch(CONFIG.ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow'
  }).then(r => {
    if (!r.ok) throw new Error('http-' + r.status);
    return r.text();
  });
}

function flushQueue () {
  const q = readQ();
  if (!q.length || !CONFIG.ENDPOINT) return;
  q.forEach(p => post(p).then(() => dequeue(p.participant_id)).catch(() => {}));
}

function submit () {
  const payload = buildPayload();
  S.t.submitted = now();
  enqueue(payload);                                   // saved first, sent second
  $('#pidCode').textContent = S.pid;
  $('#codeCard').hidden = false;
  show('scr-done');
  $('#checkoutFab').classList.remove('show');

  const box = $('#sendStatus');
  box.className = 'statusbox';
  box.innerHTML = '<span class="spinner"></span><span>' + T('dn_sending') + '</span>';

  post(payload).then(() => {
    dequeue(payload.participant_id);
    box.className = 'statusbox';
    box.innerHTML = '<span>✅</span><span>' +
      (S.lang === 'da' ? 'Sendt' : 'Sent') + '</span>';
  }).catch(err => {
    box.className = 'statusbox bad';
    box.innerHTML = '<div>⚠️ ' + T('dn_offline') + '</div>' +
      '<button class="btn ghost retry" id="retryBtn" type="button">' + T('dn_retry') + '</button>' +
      (CONFIG.ENDPOINT ? '' : '<div style="margin-top:8px;font-size:.75rem;opacity:.8">CONFIG.ENDPOINT is empty — see apps-script/README-SETUP.md</div>');
    $('#retryBtn').addEventListener('click', () => {
      box.innerHTML = '<span class="spinner"></span><span>' + T('dn_sending') + '</span>';
      box.className = 'statusbox';
      post(payload).then(() => {
        dequeue(payload.participant_id);
        box.innerHTML = '<span>✅</span><span>' + (S.lang === 'da' ? 'Sendt' : 'Sent') + '</span>';
      }).catch(() => {
        box.className = 'statusbox bad';
        box.innerHTML = '<div>⚠️ ' + T('dn_offline') + '</div>' +
          '<button class="btn ghost retry" id="retryBtn2" type="button">' + T('dn_retry') + '</button>';
        $('#retryBtn2').addEventListener('click', () => location.reload());
      });
    });
  });
}

/* ==================================================================
   WIRING
================================================================== */
function startNew () {
  S.pid = makePid();
  S.qi = 0; S.answers = {}; S.basket = {};
  S.t = { start: now(), surveyDone: null, shopStart: null, submitted: null };
  S.ev = { adds: 0, removes: 0, searches: 0, budget_blocks: 0, cat_switches: 0 };
  S.cat = 'all'; S.query = ''; S.submitted = false;
  buildOrder();
  $('#search').value = '';
  $('#consent').checked = false;
  $('#codeCard').hidden = true;
}

function init () {
  startNew();
  applyLang();
  refreshShop();

  $('#langBtn').addEventListener('click', () => {
    S.lang = S.lang === 'da' ? 'en' : 'da';
    localStorage.setItem('n2g_lang', S.lang);
    applyLang();
  });

  $('#startBtn').addEventListener('click', () => {
    if (!$('#consent').checked) { $('#consentErr').hidden = false; return; }
    $('#consentErr').hidden = true;
    S.t.start = now();
    show('scr-survey');
    renderQuestion();
  });
  $('#consent').addEventListener('change', () => { if ($('#consent').checked) $('#consentErr').hidden = true; });

  $('#qNext').addEventListener('click', nextQuestion);
  $('#qBack').addEventListener('click', prevQuestion);

  $('#toShopBtn').addEventListener('click', () => {
    S.t.shopStart = now();
    show('scr-shop');
    renderCats(); refreshShop();
  });

  let searchT;
  $('#search').addEventListener('input', e => {
    S.query = e.target.value;
    clearTimeout(searchT);
    searchT = setTimeout(() => { if (S.query.trim()) S.ev.searches++; renderGrid(); }, 140);
  });

  $('#basketBtn').addEventListener('click', openSheet);
  $('#sheetClose').addEventListener('click', closeSheet);
  $('#sheetBack').addEventListener('click', closeSheet);
  $('#checkoutFab').addEventListener('click', askCheckout);
  $('#sheetCheckout').addEventListener('click', () => { closeSheet(); askCheckout(); });

  $('#confirmNo').addEventListener('click', () => { $('#confirmBack').hidden = true; });
  $('#confirmYes').addEventListener('click', () => {
    $('#confirmBack').hidden = true;
    if (S.submitted) return;
    S.submitted = true;
    submit();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSheet(); $('#confirmBack').hidden = true; }
  });

  window.addEventListener('online', flushQueue);
  flushQueue();
}

function askCheckout () {
  if (count() === 0) { toast(T('sh_confirmEmpty')); return; }
  $('#confirmBack').hidden = false;
}

document.addEventListener('DOMContentLoaded', init);
})();
