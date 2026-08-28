/* flow.js — prototype state machine: wizard steps, fake async verification,
   invites, i18n on auth screens. No dependencies; state in localStorage. */

const Weel = (() => {
  const KEY = 'weel-proto';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (patch) => { const s = { ...load(), ...patch }; localStorage.setItem(KEY, JSON.stringify(s)); return s; };
  const state = () => load();

  /* ---------- toast ---------- */
  function toast(msg) {
    let t = $('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = '<span class="ok"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><span class="msg"></span>';
      document.body.appendChild(t);
    }
    $('.msg', t).textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- i18n (auth screens) ---------- */
  const dict = {
    en: {
      welcome: 'Welcome to <span class="brand">Weel</span>',
      welcomeBack: 'Welcome back to <span class="brand">Weel</span>',
      sub: 'One account for every order, route, and delivery — in real time.',
      subBack: 'Log in and take control of every order, route, and delivery in real time.',
      ssoGoogle: 'Continue with Google',
      ssoMs: 'Continue with Microsoft',
      or: 'or',
      emailLabel: 'Work email',
      emailPh: 'you@yourpharmacy.ca',
      continue: 'Continue',
      pwLabel: 'Password',
      pwPh: 'Enter password',
      nameLabel: 'Full name',
      namePh: 'Alex Tremblay',
      createPwPh: 'Create a password (8+ characters)',
      login: 'Log in',
      createAccount: 'Create account',
      newHere: 'Looks like you’re new here. Let’s set up your account.',
      knownUser: 'Good to see you again.',
      forgot: 'Forgot your password?',
      legal: 'By continuing you agree to Weel’s Terms of Service and acknowledge the Privacy Policy. Consent to marketing is separate and optional.',
      brandHead: 'Better logistics for your business',
      brandTag: 'The last mile logistics platform for pharmacies — reshaping them from a point on a map to a prescription fulfillment hub.',
      forgotHead: 'Reset your password',
      forgotSub: 'Enter your work email and we’ll send a reset link.',
      sendReset: 'Send reset link',
      backToLogin: 'Back to log in',
      resetSent: 'If an account exists for that email, a reset link is on its way.',
      verifyHead: 'Check your inbox',
      verifySub: 'We sent a 6-character code to',
      verifyBtn: 'Verify email',
      resend: 'Resend code',
      demoHint: 'Prototype: any email works. Codes and passwords aren’t checked.'
    },
    fr: {
      welcome: 'Bienvenue chez <span class="brand">Weel</span>',
      welcomeBack: 'Bon retour chez <span class="brand">Weel</span>',
      sub: 'Un seul compte pour chaque commande, itinéraire et livraison — en temps réel.',
      subBack: 'Connectez-vous et prenez le contrôle de chaque commande, itinéraire et livraison en temps réel.',
      ssoGoogle: 'Continuer avec Google',
      ssoMs: 'Continuer avec Microsoft',
      or: 'ou',
      emailLabel: 'Courriel professionnel',
      emailPh: 'vous@votrepharmacie.ca',
      continue: 'Continuer',
      pwLabel: 'Mot de passe',
      pwPh: 'Entrez le mot de passe',
      nameLabel: 'Nom complet',
      namePh: 'Alex Tremblay',
      createPwPh: 'Créez un mot de passe (8+ caractères)',
      login: 'Se connecter',
      createAccount: 'Créer le compte',
      newHere: 'Vous semblez nouveau ici. Configurons votre compte.',
      knownUser: 'Ravi de vous revoir.',
      forgot: 'Mot de passe oublié ?',
      legal: 'En continuant, vous acceptez les Conditions d’utilisation de Weel et reconnaissez la Politique de confidentialité. Le consentement marketing est distinct et facultatif.',
      brandHead: 'Une meilleure logistique pour votre entreprise',
      brandTag: 'La plateforme logistique du dernier kilomètre pour les pharmacies — de simple point sur la carte à véritable centre d’exécution d’ordonnances.',
      forgotHead: 'Réinitialiser votre mot de passe',
      forgotSub: 'Entrez votre courriel professionnel et nous vous enverrons un lien.',
      sendReset: 'Envoyer le lien',
      backToLogin: 'Retour à la connexion',
      resetSent: 'Si un compte existe pour ce courriel, un lien de réinitialisation est en route.',
      verifyHead: 'Vérifiez votre boîte de réception',
      verifySub: 'Nous avons envoyé un code de 6 caractères à',
      verifyBtn: 'Vérifier le courriel',
      resend: 'Renvoyer le code',
      demoHint: 'Prototype : n’importe quel courriel fonctionne. Codes et mots de passe non vérifiés.'
    }
  };

  function lang() { return localStorage.getItem('weel-lang') || 'en'; }
  function applyLang() {
    const L = dict[lang()];
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (L[k] !== undefined) el.innerHTML = L[k];
    });
    $$('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (L[k] !== undefined) el.placeholder = L[k];
    });
    const t = $('.lang-toggle .lbl');
    if (t) t.textContent = lang() === 'en' ? 'Français' : 'English';
    document.documentElement.lang = lang() === 'en' ? 'en' : 'fr';
  }
  function initLang() {
    const t = $('.lang-toggle');
    if (t) t.addEventListener('click', () => {
      localStorage.setItem('weel-lang', lang() === 'en' ? 'fr' : 'en');
      applyLang();
    });
    applyLang();
  }

  /* ---------- adaptive auth (index.html) ---------- */
  function initLogin() {
    initLang();
    const email = $('#email');
    const stepEmail = $('#step-email');
    const stepPw = $('#step-pw');
    const stepNew = $('#step-new');
    const heading = $('#auth-heading');
    const sub = $('#auth-sub');

    $('#continue').addEventListener('click', (e) => {
      e.preventDefault();
      const v = email.value.trim();
      const f = email.closest('.field');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { f.classList.add('invalid'); email.focus(); return; }
      f.classList.remove('invalid');
      const known = (state().accounts || []).includes(v.toLowerCase());
      save({ email: v });
      stepEmail.hidden = true;
      email.readOnly = true;
      $('#email-echo').textContent = v;
      $('#email-echo-row').hidden = false;
      if (known) {
        stepPw.hidden = false;
        heading.innerHTML = dict[lang()].welcomeBack;
        sub.innerHTML = dict[lang()].knownUser;
        $('#pw').focus();
      } else {
        stepNew.hidden = false;
        heading.innerHTML = dict[lang()].welcome;
        sub.innerHTML = dict[lang()].newHere;
        $('#name').focus();
      }
    });

    $('#edit-email')?.addEventListener('click', (e) => {
      e.preventDefault();
      stepPw.hidden = true; stepNew.hidden = true; stepEmail.hidden = false;
      $('#email-echo-row').hidden = true;
      email.readOnly = false; email.focus();
      heading.innerHTML = dict[lang()].welcome;
      sub.innerHTML = dict[lang()].sub;
    });

    $('#login-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = state().persona ? destFor(state().persona) : '/fork.html';
      location.href = dest;
    });

    $('#create-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const pw = $('#new-pw').value;
      let ok = true;
      const nf = $('#name').closest('.field'), pf = $('#new-pw').closest('.field');
      if (!name) { nf.classList.add('invalid'); ok = false; } else nf.classList.remove('invalid');
      if (pw.length < 8) { pf.classList.add('invalid'); ok = false; } else pf.classList.remove('invalid');
      if (!ok) return;
      const accounts = state().accounts || [];
      accounts.push((state().email || '').toLowerCase());
      save({ accounts, name });
      location.href = '/auth/verify.html';
    });

    $$('.sso .btn').forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      save({ email: 'alex@sso.weel.io', name: 'Alex Tremblay', accounts: [...(state().accounts || []), 'alex@sso.weel.io'] });
      location.href = state().persona ? destFor(state().persona) : '/fork.html';
    }));

    // pw eye toggles
    $$('.trail-btn[data-eye]').forEach(btn => btn.addEventListener('click', () => {
      const inp = $('#' + btn.dataset.eye);
      inp.type = inp.type === 'password' ? 'text' : 'password';
    }));
  }

  function destFor(p) {
    return { pharmacy: '/pharmacy/dashboard.html', courier: '/courier/activation.html', dispatcher: '/dispatcher/join.html' }[p] || '/fork.html';
  }

  /* ---------- verify code interstitial ---------- */
  function initVerify() {
    initLang();
    $('#email-echo').textContent = state().email || 'you@yourpharmacy.ca';
    const boxes = $$('.code input');
    boxes.forEach((b, i) => {
      b.addEventListener('input', () => {
        b.value = b.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 1);
        if (b.value && boxes[i + 1]) boxes[i + 1].focus();
        $('#verify-btn').disabled = !boxes.every(x => x.value);
      });
      b.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus(); });
    });
    $('#verify-btn').addEventListener('click', () => location.href = '/fork.html');
    $('#resend').addEventListener('click', (e) => { e.preventDefault(); toast('Code resent'); });
  }

  /* ---------- forgot ---------- */
  function initForgot() {
    initLang();
    $('#send').addEventListener('click', (e) => {
      e.preventDefault();
      $('#form-zone').hidden = true;
      $('#sent-zone').hidden = false;
    });
  }

  /* ---------- persona fork ---------- */
  function initFork() {
    $$('.persona-card').forEach(c => c.addEventListener('click', () => {
      const p = c.dataset.persona;
      save({ persona: p });
      location.href = { pharmacy: '/pharmacy/step-1.html', courier: '/courier/step-1.html', dispatcher: '/dispatcher/cold-start.html' }[p];
    }));
  }

  /* ---------- pharmacy wizard ---------- */
  function initPharmacyStep1() {
    const s = state().pharmacy || {};
    if (s.name) $('#ph-name').value = s.name;
    if (s.province) $('#ph-prov').value = s.province;
    if (s.address) $('#ph-addr').value = s.address;
    $('#next').addEventListener('click', (e) => {
      e.preventDefault();
      let ok = true;
      const req = [['#ph-name', v => v.trim()], ['#ph-prov', v => v], ['#ph-addr', v => v.trim()]];
      req.forEach(([sel, test]) => {
        const el = $(sel), f = el.closest('.field');
        if (!test(el.value)) { f.classList.add('invalid'); ok = false; } else f.classList.remove('invalid');
      });
      if (!ok) return;
      save({ pharmacy: { ...(state().pharmacy || {}), name: $('#ph-name').value.trim(), province: $('#ph-prov').value, address: $('#ph-addr').value.trim() } });
      location.href = '/pharmacy/step-2.html';
    });
    // fake address autocomplete
    const addr = $('#ph-addr'), ac = $('#addr-ac');
    if (addr && ac) {
      const opts = ['1284 Rue Sainte-Catherine O, Montréal, QC H3G 1P4', '128 Queen St W, Toronto, ON M5H 2N2', '1240 Robson St, Vancouver, BC V6E 1C1'];
      addr.addEventListener('input', () => {
        if (addr.value.trim().length > 2) {
          ac.innerHTML = opts.map(o => `<button type="button" class="ac-opt">${o}</button>`).join('');
          ac.hidden = false;
          $$('.ac-opt', ac).forEach(b => b.addEventListener('click', () => { addr.value = b.textContent; ac.hidden = true; toast('Hours & phone imported from your Google listing'); }));
        } else ac.hidden = true;
      });
      document.addEventListener('click', (e) => { if (!ac.contains(e.target) && e.target !== addr) ac.hidden = true; });
    }
  }

  function initPharmacyStep2() {
    const tiles = $$('.tile');
    const s = state().pharmacy || {};
    tiles.forEach(t => {
      const input = $('input', t);
      if (s.model === input.value) { input.checked = true; t.classList.add('on'); }
      t.addEventListener('click', () => {
        tiles.forEach(x => x.classList.remove('on'));
        input.checked = true; t.classList.add('on');
      });
    });
    $('#next').addEventListener('click', (e) => {
      e.preventDefault();
      const sel = $('.tile input:checked');
      if (!sel) { toast('Pick how you want to deliver'); return; }
      save({ pharmacy: { ...(state().pharmacy || {}), model: sel.value } });
      location.href = '/pharmacy/step-3.html';
    });
  }

  /* JS-driven courier ride — no SMIL/offset-path dependence, works everywhere */
  function rideCourier() {
    const path = $('#route-path'), dot = $('#courier'), trail = $('#route-trail'), badge = $('#sim-badge');
    if (!path || !dot || dot.dataset.riding) return;
    dot.dataset.riding = '1';
    const len = path.getTotalLength();
    const END = len - 16;               // stop just short of the destination pin
    const RIDE = 6500, HOLD = 1800;     // ms travel, ms pause at door
    const setBadge = (cls, label) => { if (badge) { badge.className = 'badge ' + cls; badge.innerHTML = '<span class="dot"></span>' + label; } };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const p = path.getPointAtLength(END * .6);
      dot.setAttribute('transform', `translate(${p.x},${p.y})`);
      if (trail) trail.setAttribute('stroke-dashoffset', 100 - 60 * (END / len));
      return;
    }
    let start = null, delivered = false;
    function frame(ts) {
      if (start === null) start = ts;
      const el = ts - start;
      let t;
      if (el < RIDE) {
        t = el / RIDE;
        if (delivered) { delivered = false; setBadge('badge-warn', 'Out for delivery'); }
      } else if (el < RIDE + HOLD) {
        t = 1;
        if (!delivered) { delivered = true; setBadge('badge-good', 'Delivered · signed'); }
      } else {
        start = ts; t = 0;
      }
      const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;  // easeInOutQuad
      const p = path.getPointAtLength(e * END);
      dot.setAttribute('transform', `translate(${p.x},${p.y})`);
      if (trail) trail.setAttribute('stroke-dashoffset', 100 - e * 100 * (END / len));
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initPharmacyStep3() {
    $('#quote-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const el = $('#dest'), f = el.closest('.field');
      if (!el.value.trim()) { f.classList.add('invalid'); return; }
      f.classList.remove('invalid');
      const km = (2.4 + Math.random() * 7).toFixed(1);
      const price = (7.49 + km * 0.4).toFixed(2);
      const eta = Math.round(18 + km * 2.2);
      $('#q-price').textContent = '$' + price;
      $('#q-km').textContent = km + ' km';
      $('#q-eta').textContent = eta + ' min';
      $('#quote-zone').hidden = false;
      $('#quote-zone').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      rideCourier();
    });
    $('#finish').addEventListener('click', (e) => {
      e.preventDefault();
      save({ pharmacyActivated: false });
      location.href = '/pharmacy/dashboard.html';
    });
  }

  /* ---------- pharmacy dashboard + checklist ---------- */
  function initPharmacyDashboard() {
    const s = state();
    $('#who') && ($('#who').textContent = (s.pharmacy && s.pharmacy.name) || 'Lakeshore Pharmacy');
    $('#foot-name') && ($('#foot-name').textContent = s.name || 'Alex Tremblay');
    $('#foot-email') && ($('#foot-email').textContent = s.email || 'alex@lakeshorerx.ca');

    const done = new Set(s.checklist || []);
    if (s.licenseStatus === 'approved') done.add('license');
    $$('.check-item').forEach(item => {
      const k = item.dataset.check;
      if (done.has(k)) item.classList.add('done');
      const btn = $('.btn', item);
      if (btn && !done.has(k)) btn.addEventListener('click', () => {
        if (k === 'license') { location.href = '/pharmacy/verification.html'; return; }
        if (k === 'delivery') { toast('Nice — that unlocks live dispatch once your licence clears'); }
        item.classList.add('done');
        done.add(k);
        save({ checklist: [...done] });
        progress();
      });
    });
    function progress() {
      const total = $$('.check-item').length;
      const n = $$('.check-item.done').length;
      $('#cl-progress').style.width = (n / total * 100) + '%';
      $('#cl-count').textContent = `${n} of ${total} complete`;
    }
    progress();

    if (s.licenseStatus === 'approved' && !s.congratsShown) {
      save({ congratsShown: true });
      toast('Licence verified — live dispatch unlocked 🎉');
    }
    const lb = $('#license-badge');
    if (lb) {
      const st = s.licenseStatus;
      if (st === 'approved') { lb.className = 'badge badge-good'; lb.innerHTML = '<span class="dot"></span>Verified'; }
      else if (st === 'review') { lb.className = 'badge badge-warn'; lb.innerHTML = '<span class="dot"></span>In review'; }
      else { lb.className = 'badge badge-info'; lb.innerHTML = '<span class="dot"></span>Test mode'; }
    }
  }

  /* ---------- verification tracker ---------- */
  function initVerification() {
    const rows = {
      license: $('[data-doc="license"]'),
      manager: $('[data-doc="manager"]'),
      insurance: $('[data-doc="insurance"]')
    };
    const setBadge = (row, kind, label) => {
      const b = $('.badge', row);
      b.className = 'badge badge-' + kind;
      b.innerHTML = '<span class="dot"></span>' + label;
    };
    $('#submit-docs').addEventListener('click', (e) => {
      e.preventDefault();
      const lic = $('#lic-num');
      if (!lic.value.trim()) { lic.closest('.field').classList.add('invalid'); return; }
      lic.closest('.field').classList.remove('invalid');
      $('#doc-form').hidden = true;
      $('#tracker-zone').hidden = false;
      save({ licenseStatus: 'review' });
      setBadge(rows.license, 'muted', 'Submitted');
      setBadge(rows.manager, 'muted', 'Submitted');
      setBadge(rows.insurance, 'muted', 'Submitted');
      setTimeout(() => { setBadge(rows.license, 'warn', 'In review'); }, 1200);
      setTimeout(() => { setBadge(rows.manager, 'warn', 'In review'); }, 2000);
      setTimeout(() => { setBadge(rows.insurance, 'bad', 'Needs a fix'); $('#fix-zone').hidden = false; }, 3400);
      setTimeout(() => { setBadge(rows.manager, 'good', 'Approved'); }, 4400);
      setTimeout(() => { setBadge(rows.license, 'good', 'Approved'); }, 6200);
    });
    $('#reupload')?.addEventListener('click', (e) => {
      e.preventDefault();
      $('#fix-zone').hidden = true;
      setBadge(rows.insurance, 'warn', 'In review');
      setTimeout(() => {
        setBadge(rows.insurance, 'good', 'Approved');
        save({ licenseStatus: 'approved' });
        $('#all-clear').hidden = false;
      }, 2600);
    });
  }

  /* ---------- courier wizard ---------- */
  function initCourierStep1() {
    const s = state().courier || {};
    if (s.name) $('#co-name').value = s.name;
    $('#next').addEventListener('click', (e) => {
      e.preventDefault();
      let ok = true;
      [['#co-name'], ['#co-city'], ['#co-fleet']].forEach(([sel]) => {
        const el = $(sel), f = el.closest('.field');
        if (!el.value.trim()) { f.classList.add('invalid'); ok = false; } else f.classList.remove('invalid');
      });
      if (!ok) return;
      save({ courier: { name: $('#co-name').value.trim(), city: $('#co-city').value, fleet: $('#co-fleet').value } });
      location.href = '/courier/fleet.html';
    });
  }

  function initFleet() {
    const roster = () => state().roster || [];
    const table = $('#roster-body');
    function render() {
      const r = roster();
      $('#empty-roster').hidden = r.length > 0;
      $('#roster-table').hidden = r.length === 0;
      table.innerHTML = r.map(d => `
        <tr>
          <td><b>${d.name}</b></td>
          <td class="mono">${d.phone}</td>
          <td>${d.vehicle}</td>
          <td><span class="badge ${d.status === 'Active' ? 'badge-good' : 'badge-muted'}"><span class="dot"></span>${d.status}</span></td>
        </tr>`).join('');
      $('#drv-count').textContent = r.length;
    }
    $('#add-driver').addEventListener('click', (e) => {
      e.preventDefault();
      const name = $('#d-name').value.trim(), phone = $('#d-phone').value.trim();
      let ok = true;
      if (!name) { $('#d-name').closest('.field').classList.add('invalid'); ok = false; } else $('#d-name').closest('.field').classList.remove('invalid');
      if (!phone) { $('#d-phone').closest('.field').classList.add('invalid'); ok = false; } else $('#d-phone').closest('.field').classList.remove('invalid');
      if (!ok) return;
      save({ roster: [...roster(), { name, phone, vehicle: $('#d-vehicle').value, status: 'Invited by SMS' }] });
      $('#d-name').value = ''; $('#d-phone').value = '';
      toast(`SMS invite sent to ${name} with a temporary password`);
      render();
    });
    $('#csv-import').addEventListener('click', (e) => {
      e.preventDefault();
      const extra = [
        { name: 'Marcus Chen', phone: '(514) 555-0182', vehicle: 'Car', status: 'Invited by SMS' },
        { name: 'Priya Sharma', phone: '(514) 555-0126', vehicle: 'Car', status: 'Invited by SMS' },
        { name: 'Jean-Luc Fortin', phone: '(438) 555-0074', vehicle: 'Bike', status: 'Invited by SMS' }
      ];
      save({ roster: [...roster(), ...extra] });
      toast('3 drivers imported from roster.csv');
      render();
    });
    $('#invite-dispatcher').addEventListener('click', (e) => {
      e.preventDefault();
      const em = $('#disp-email').value.trim();
      if (!em) { $('#disp-email').closest('.field').classList.add('invalid'); return; }
      $('#disp-email').closest('.field').classList.remove('invalid');
      $('#disp-email').value = '';
      save({ dispatcherInvited: em });
      toast(`Invite sent to ${em} — scoped to ${$('#disp-team').value}`);
    });
    render();
  }

  function initCompliance() {
    const s = () => state().compliance || {};
    function refresh() {
      const c = s();
      // flag chips
      const acct = $('#flag-account'), op = $('#flag-operate');
      acct.className = 'badge badge-good'; acct.innerHTML = '<span class="dot"></span>Account active';
      const opOK = c.coi && c.agreement;
      op.className = 'badge ' + (opOK ? 'badge-good' : 'badge-warn');
      op.innerHTML = '<span class="dot"></span>' + (opOK ? 'Cleared to operate' : 'Not yet cleared to operate');
      $('#go-live').disabled = !opOK;
      // tiers
      $('#tier-ambient').className = 'badge ' + (opOK ? 'badge-good' : 'badge-muted');
      $('#tier-ambient').innerHTML = '<span class="dot"></span>' + (opOK ? 'Unlocked' : 'Locked');
      $('#tier-cold').className = 'badge ' + (c.cold ? 'badge-good' : 'badge-muted');
      $('#tier-cold').innerHTML = '<span class="dot"></span>' + (c.cold ? 'Unlocked' : 'Locked');
      $('#tier-narc').className = 'badge ' + (c.narc ? 'badge-good' : 'badge-muted');
      $('#tier-narc').innerHTML = '<span class="dot"></span>' + (c.narc ? 'Unlocked' : 'Locked');
    }
    $('#upload-coi').addEventListener('click', (e) => {
      e.preventDefault();
      const exp = $('#coi-exp');
      if (!exp.value) { exp.closest('.field').classList.add('invalid'); return; }
      exp.closest('.field').classList.remove('invalid');
      save({ compliance: { ...s(), coi: true } });
      $('#coi-row .badge').className = 'badge badge-good';
      $('#coi-row .badge').innerHTML = '<span class="dot"></span>On file · expires ' + exp.value;
      toast('COI received — we’ll remind you 30 days before expiry');
      refresh();
    });
    $('#sign-agreement').addEventListener('click', (e) => {
      e.preventDefault();
      const nm = $('#sign-name');
      if (!nm.value.trim()) { nm.closest('.field').classList.add('invalid'); return; }
      nm.closest('.field').classList.remove('invalid');
      save({ compliance: { ...s(), agreement: true } });
      $('#agr-row .badge').className = 'badge badge-good';
      $('#agr-row .badge').innerHTML = '<span class="dot"></span>Signed by ' + nm.value.trim();
      toast('PHIPA agent agreement signed');
      refresh();
    });
    $('#unlock-cold').addEventListener('click', (e) => { e.preventDefault(); save({ compliance: { ...s(), cold: true } }); toast('Cold-chain capability declared'); refresh(); });
    $('#unlock-narc').addEventListener('click', (e) => { e.preventDefault(); save({ compliance: { ...s(), narc: true } }); toast('Chain-of-custody attestation recorded'); refresh(); });
    $('#go-live').addEventListener('click', () => location.href = '/courier/activation.html');
    refresh();
  }

  function initActivation() {
    const s = state();
    $('#co-echo') && ($('#co-echo').textContent = (s.courier && s.courier.name) || 'Rapide Livraison Inc.');
  }

  /* ---------- dispatcher ---------- */
  function initJoin() {
    const s = state();
    $('#inv-email').textContent = s.dispatcherInvited || 'jordan@rapidelivraison.ca';
    $('#co-echo').textContent = (s.courier && s.courier.name) || 'Rapide Livraison Inc.';
    $('#join-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const nm = $('#j-name'), pw = $('#j-pw');
      let ok = true;
      if (!nm.value.trim()) { nm.closest('.field').classList.add('invalid'); ok = false; } else nm.closest('.field').classList.remove('invalid');
      if (pw.value.length < 8) { pw.closest('.field').classList.add('invalid'); ok = false; } else pw.closest('.field').classList.remove('invalid');
      if (!ok) return;
      $('#join-zone').hidden = true;
      $('#board-zone').hidden = false;
      window.scrollTo({ top: 0 });
    });
  }

  function initColdStart() {
    const q = $('#company-q');
    const list = $('#company-list');
    const companies = () => {
      const base = ['Rapide Livraison Inc. — Montréal', 'Velocity Couriers — Toronto', 'Pacific Med Express — Vancouver'];
      const own = state().courier && state().courier.name;
      return own ? [own + ' — ' + (state().courier.city || 'Montréal'), ...base] : base;
    };
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase();
      if (!v) { list.hidden = true; return; }
      const hits = companies().filter(c => c.toLowerCase().includes(v));
      list.innerHTML = hits.length
        ? hits.map(c => `<button type="button" class="ac-opt">${c}</button>`).join('')
        : '<div class="ac-none">No match — <a href="/courier/step-1.html">create a new courier company</a></div>';
      list.hidden = false;
      $$('.ac-opt', list).forEach(b => b.addEventListener('click', () => {
        $('#pick-echo').textContent = b.textContent;
        $('#search-zone').hidden = true;
        $('#requested-zone').hidden = false;
      }));
    });
  }

  /* ---------- shared: reset ---------- */
  function initReset() {
    $$('[data-reset]').forEach(b => b.addEventListener('click', () => {
      localStorage.removeItem(KEY);
      location.href = '/index.html';
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReset();
    const init = document.body.dataset.init;
    const map = {
      login: initLogin, verify: initVerify, forgot: initForgot, fork: initFork,
      ph1: initPharmacyStep1, ph2: initPharmacyStep2, ph3: initPharmacyStep3,
      phdash: initPharmacyDashboard, phverify: initVerification,
      co1: initCourierStep1, fleet: initFleet, compliance: initCompliance, activation: initActivation,
      join: initJoin, coldstart: initColdStart
    };
    if (init && map[init]) map[init]();
  });

  return { toast, state, save };
})();
