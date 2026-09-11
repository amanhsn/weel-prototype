/* tour.js — Weel education layer: welcome modal, spotlight tour, help menu.
   Dependency-free. Requires flow.js (Weel) plus a per-role config file that sets
   window.WEEL_TOUR = { role, org(state), welcome:{…}, steps:[{target, placement, title:{en,fr}, body:{en,fr}}] }
   Script order on a page: flow.js → tour.<role>.js → tour.js */

const WeelTour = (() => {
  const cfg = window.WEEL_TOUR;
  if (!cfg) return { start() {}, replay() {} };

  const $ = (s, r = document) => r.querySelector(s);
  const lang = () => localStorage.getItem('weel-lang') || 'en';
  const T = (o) => (o && (o[lang()] !== undefined ? o[lang()] : o.en)) || '';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // flow.js declares `const Weel` at script scope (a global binding, but NOT window.Weel)
  const weel = () => (typeof Weel !== 'undefined' ? Weel : null);

  const CHROME = {
    en: {
      back: 'Back', next: 'Next', done: 'Done', skip: 'Skip tour', of: 'of',
      explore: 'I’ll explore on my own',
      helpReplay: 'Replay tour',
      helpResume: (n, t) => `Resume tour · step ${n} of ${t}`,
      helpGuide: 'Getting started guide',
      helpPhil: '✨ Ask Phil',
      philPreview: 'Phil is a preview in this prototype',
      doneToast: 'You’re set — the checklist takes it from here'
    },
    fr: {
      back: 'Retour', next: 'Suivant', done: 'Terminé', skip: 'Passer la visite', of: 'sur',
      explore: 'Je préfère explorer seul',
      helpReplay: 'Revoir la visite',
      helpResume: (n, t) => `Reprendre la visite · étape ${n} sur ${t}`,
      helpGuide: 'Guide de démarrage',
      helpPhil: '✨ Demander à Phil',
      philPreview: 'Phil est un aperçu dans ce prototype',
      doneToast: 'Vous êtes prêt — la liste s’occupe du reste'
    }
  };
  const C = () => CHROME[lang()] || CHROME.en;

  const tourKey = 'weel-tour-' + cfg.role;
  const welcomeKey = 'weel-welcome-' + cfg.role;

  /* ---------- welcome modal ---------- */
  function showWelcome(force) {
    if (!cfg.welcome) return;
    if (!force && localStorage.getItem(welcomeKey)) return;
    if ($('.modal-scrim')) return;
    const w = cfg.welcome;
    const org = cfg.org ? cfg.org(weel() ? weel().state() : {}) : '';
    const scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.innerHTML = `
      <div class="card welcome-card" role="dialog" aria-modal="true" aria-labelledby="wm-title" tabindex="-1">
        <h2 id="wm-title">${T(w.title)}${org ? ', ' + org : ''}</h2>
        <div class="rows">
          ${w.bullets.map(b => `<div class="welcome-row"><span class="ic">${b.icon || ''}</span><p>${T(b.text)}</p></div>`).join('')}
        </div>
        <p class="welcome-note">${T(w.note)}</p>
        <div class="welcome-foot">
          <button class="btn btn-ghost" data-wm="skip">${C().explore}</button>
          <button class="btn btn-primary" data-wm="tour">${T(w.primary)}</button>
        </div>
      </div>`;
    document.body.appendChild(scrim);
    const card = $('.welcome-card', scrim);
    const close = (startTour) => {
      localStorage.setItem(welcomeKey, 'seen');
      document.removeEventListener('keydown', onKey, true);
      scrim.remove();
      if (startTour) start(0);
    };
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(false); }
      if (e.key === 'Tab') {
        const f = [...card.querySelectorAll('button')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || !card.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    scrim.addEventListener('click', (e) => {
      if (e.target === scrim) return close(false);
      const b = e.target.closest('[data-wm]');
      if (b) close(b.dataset.wm === 'tour');
    });
    $('[data-wm="tour"]', scrim).focus();
  }

  /* ---------- spotlight tour engine ---------- */
  let idx = 0, dom = null, active = false, rafPending = false, showTimer = null;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

  function buildDom() {
    dom = {
      scrim: document.createElement('div'),
      hl: document.createElement('div'),
      card: document.createElement('div')
    };
    dom.scrim.className = 'tour-scrim';
    dom.hl.className = 'tour-hl';
    dom.card.className = 'tour-card';
    dom.card.setAttribute('role', 'dialog');
    dom.card.setAttribute('aria-modal', 'true');
    dom.card.setAttribute('aria-labelledby', 'tour-title');
    dom.card.setAttribute('aria-describedby', 'tour-body');
    dom.card.tabIndex = -1;
    dom.card.innerHTML = `
      <div class="tour-arrow"></div>
      <h4 id="tour-title"></h4>
      <p class="body" id="tour-body"></p>
      <div class="tour-foot">
        <button class="btn btn-link" data-t="skip"></button>
        <span class="count"></span>
        <button class="btn btn-ghost btn-sm" data-t="back"></button>
        <button class="btn btn-primary btn-sm" data-t="next"></button>
      </div>`;
    document.body.append(dom.scrim, dom.hl, dom.card);
    dom.card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-t]');
      if (!b) return;
      if (b.dataset.t === 'next') next();
      if (b.dataset.t === 'back') show(idx - 1);
      if (b.dataset.t === 'skip') end('skipped');
    });
  }

  function show(i) {
    if (i < 0) i = 0;
    while (i < cfg.steps.length && !document.querySelector(cfg.steps[i].target)) i++;
    if (i >= cfg.steps.length) return end('done');
    idx = i;
    localStorage.setItem(tourKey, String(i));
    const target = document.querySelector(cfg.steps[i].target);
    const pinned = !!target.closest('.topbar, .sidebar');
    if (!pinned) target.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
    clearTimeout(showTimer);
    showTimer = setTimeout(place, (RM || pinned) ? 0 : 350);
  }

  function place() {
    if (!active || !dom) return;
    const step = cfg.steps[idx];
    const t = document.querySelector(step.target);
    if (!t) return next();
    const r = t.getBoundingClientRect();
    const PAD = 8, GAP = 12, M = 12;
    const hl = { top: r.top - PAD, left: r.left - PAD, right: r.right + PAD, bottom: r.bottom + PAD, w: r.width + 2 * PAD, h: r.height + 2 * PAD };
    Object.assign(dom.hl.style, { top: hl.top + 'px', left: hl.left + 'px', width: hl.w + 'px', height: hl.h + 'px' });

    // content first, then measure
    $('#tour-title', dom.card).textContent = T(step.title);
    $('#tour-body', dom.card).textContent = T(step.body);
    $('.count', dom.card).textContent = `${idx + 1} ${C().of} ${cfg.steps.length}`;
    const last = idx === cfg.steps.length - 1;
    $('[data-t="skip"]', dom.card).textContent = C().skip;
    $('[data-t="back"]', dom.card).textContent = C().back;
    $('[data-t="back"]', dom.card).hidden = idx === 0;
    $('[data-t="next"]', dom.card).textContent = last ? C().done : C().next;

    dom.card.style.visibility = 'hidden';
    dom.card.style.top = '0px';
    dom.card.style.left = '0px';
    const cw = dom.card.offsetWidth, ch = dom.card.offsetHeight;
    const vw = innerWidth, vh = innerHeight;
    const fits = {
      right: hl.right + GAP + cw <= vw - M,
      left: hl.left - GAP - cw >= M,
      bottom: hl.bottom + GAP + ch <= vh - M,
      top: hl.top - GAP - ch >= M
    };
    const opposite = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' };
    let side = step.placement || 'bottom';
    if (!fits[side]) side = fits[opposite[side]] ? opposite[side] : (['bottom', 'right', 'top', 'left'].find(s => fits[s]) || side);

    const cx = hl.left + hl.w / 2, cy = hl.top + hl.h / 2;
    let top, left;
    if (side === 'right') { left = hl.right + GAP; top = cy - ch / 2; }
    if (side === 'left') { left = hl.left - GAP - cw; top = cy - ch / 2; }
    if (side === 'bottom') { top = hl.bottom + GAP; left = cx - cw / 2; }
    if (side === 'top') { top = hl.top - GAP - ch; left = cx - cw / 2; }
    top = clamp(top, M, vh - ch - M);
    left = clamp(left, M, vw - cw - M);
    Object.assign(dom.card.style, { top: top + 'px', left: left + 'px', visibility: 'visible' });

    const a = $('.tour-arrow', dom.card);
    const pos = {
      right: { left: -7, top: clamp(cy - top - 6, 10, ch - 22) },
      left: { left: cw - 7, top: clamp(cy - top - 6, 10, ch - 22) },
      bottom: { top: -7, left: clamp(cx - left - 6, 10, cw - 22) },
      top: { top: ch - 7, left: clamp(cx - left - 6, 10, cw - 22) }
    }[side];
    a.style.top = pos.top + 'px';
    a.style.left = pos.left + 'px';
    dom.card.focus({ preventScroll: true });
  }

  function next() {
    if (idx >= cfg.steps.length - 1) return end('done');
    show(idx + 1);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); return end('skipped'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); return next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); return show(idx - 1); }
    if (e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); return next(); }
    if (e.key === 'Tab' && dom) {
      const f = [...dom.card.querySelectorAll('button:not([hidden])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dom.card)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!dom.card.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  }

  function onMove() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; if (active) place(); });
  }

  function start(from) {
    if (active || !cfg.steps || !cfg.steps.length) return;
    active = true;
    if (!dom) buildDom();
    document.addEventListener('keydown', onKey, true);
    addEventListener('resize', onMove);
    document.addEventListener('scroll', onMove, true);
    show(typeof from === 'number' ? from : 0);
  }

  function end(status) {
    localStorage.setItem(tourKey, status);
    active = false;
    clearTimeout(showTimer);
    document.removeEventListener('keydown', onKey, true);
    removeEventListener('resize', onMove);
    document.removeEventListener('scroll', onMove, true);
    if (dom) { dom.scrim.remove(); dom.hl.remove(); dom.card.remove(); dom = null; }
    if (status === 'done' && weel()) weel().toast(C().doneToast);
  }

  function replay() {
    localStorage.removeItem(tourKey);
    start(0);
  }

  /* ---------- help menu ---------- */
  function initHelp() {
    const btn = $('#help-btn');
    if (!btn) return;
    let pop = null;
    const close = () => { if (pop) { pop.remove(); pop = null; btn.setAttribute('aria-expanded', 'false'); } };
    btn.addEventListener('click', () => {
      if (pop) return close();
      const v = localStorage.getItem(tourKey);
      const resumable = v !== null && /^\d+$/.test(v);
      pop = document.createElement('div');
      pop.className = 'help-pop';
      pop.innerHTML = `
        <button data-h="tour">${resumable ? C().helpResume(+v + 1, cfg.steps.length) : C().helpReplay}</button>
        <button data-h="guide">${C().helpGuide}</button>
        <button data-h="phil">${C().helpPhil}</button>`;
      document.body.appendChild(pop);
      const r = btn.getBoundingClientRect();
      pop.style.top = r.bottom + 8 + 'px';
      pop.style.left = Math.max(12, r.right - pop.offsetWidth) + 'px';
      btn.setAttribute('aria-expanded', 'true');
      pop.addEventListener('click', (e) => {
        const h = e.target.closest('[data-h]');
        if (!h) return;
        const act = h.dataset.h;
        close();
        if (act === 'tour') resumable ? start(+v) : replay();
        if (act === 'guide') showWelcome(true);
        if (act === 'phil' && weel()) weel().toast(C().philPreview);
      });
      $('[data-h]', pop).focus();
    });
    document.addEventListener('click', (e) => { if (pop && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pop) close(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHelp();
    document.querySelectorAll('[data-phil]').forEach(b =>
      b.addEventListener('click', () => weel() && weel().toast(C().philPreview)));
    showWelcome(false);
  });

  return { start, replay };
})();
