/* =========================================================
   TapTell – Einbetten auf Kunden-Websites
   Einbinden:
     <div data-taptell="funnel-slug"></div>
     <script src="https://taptell.de/embed.js" async></script>
   Varianten (data-mode):
     inline (Standard) – Funnel direkt im Seiteninhalt, natürliche Höhe, kein iFrame
     popup             – Button öffnet den Funnel als Fenster (auf dem Handy als Vollbild)
     iframe            – klassischer iFrame mit automatischer Höhe
   Optionen: data-max-width="640"  data-label="Jetzt anfragen"  data-offset="80" (fixe Kopfzeile der Website)
   Der Funnel läuft im Shadow DOM: Die Website-Gestaltung wirkt nicht hinein und umgekehrt.
   ========================================================= */
(function(){
  'use strict';
  if(window.__taptellEmbed) return; window.__taptellEmbed = true;
  var me = document.currentScript || [].slice.call(document.scripts).filter(function(s){ return /\/embed\.js(\?|$)/.test(s.src); })[0];
  var BASE = me ? new URL('.', me.src).href : location.origin + '/';
  var CSS = window.__TT_PLAYER_CSS || '';
  var Q = {}; try{ new URLSearchParams(location.search).forEach(function(v, k){ if(/^(utm_|gclid|fbclid|ref)/.test(k)) Q[k] = v; }); }catch(e){}

  /* Konfiguration (Supabase-URL und öffentlicher Schlüssel) von TapTell laden */
  function config(){
    return new Promise(function(res){
      if(window.FS_CONFIG && window.FS_CONFIG.supabaseUrl) return res(window.FS_CONFIG);
      var s = document.createElement('script'); s.src = BASE + 'config.js'; s.async = true;
      s.onload = function(){ res(window.FS_CONFIG || {}); }; s.onerror = function(){ res({}); };
      document.head.appendChild(s);
    });
  }
  function rpc(C, fn, args){
    if(!C.supabaseUrl) return Promise.resolve(null);
    /* Publishable keys (sb_publishable_…) sind keine JWTs: nur im apikey-Header senden. Alte anon-Keys (JWT) zusätzlich als Bearer. */
    var h = {'Content-Type':'application/json', apikey:C.supabaseAnonKey};
    if(/^eyJ/.test(C.supabaseAnonKey || '')) h.Authorization = 'Bearer ' + C.supabaseAnonKey;
    return fetch(C.supabaseUrl.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {method:'POST', headers:h, body:JSON.stringify(args)})
      .then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; });
  }
  var fontsDone = {};
  function fonts(F){
    FP.usedFonts(F).forEach(function(n){ if(fontsDone[n] || (F.fonts||[]).some(function(x){ return x.name === n; })) return; fontsDone[n] = 1; var u = FP.fontLink(n); if(!u) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); });
    if((F.fonts||[]).length){ var st = document.createElement('style'); st.textContent = F.fonts.map(function(x){ return "@font-face{font-family:'" + String(x.name).replace(/'/g,'') + "';src:url(" + x.data + ");font-display:swap}"; }).join('\n'); document.head.appendChild(st); }
  }
  /* Funnel in einen abgeschirmten Bereich (Shadow DOM) setzen */
  function mountInto(target, F, slug, C, extra){
    var root = target.attachShadow ? target.attachShadow({mode:'open'}) : target;
    var bg = (F.theme && F.theme.bg) || '#fff';
    root.innerHTML = '<style>:host{all:initial;display:block}' + CSS + '.tt-wrap{background:' + bg + ';border-radius:' + (extra.radius || 0) + 'px;overflow:hidden}</style><div class="tt-wrap"><div class="tt-fp"></div></div>';
    var el = root.querySelector('.tt-fp');
    var S = F.settings || {};
    FP.mount(el, F, {live:true, inline:!extra.scrollEl, scrollEl:extra.scrollEl, scrollOffset:extra.offset,
      onEvent:function(type, d){ if(type === 'complete') return; rpc(C, 'track_event', {p_slug:slug, p_type:type, p_page:(d && d.pageId) || null}); },
      onSubmit:function(lead){
        lead.utm = Q; lead.page = location.href; lead.embed = true; lead.userAgent = navigator.userAgent.slice(0, 160);
        rpc(C, 'submit_lead', {p_slug:slug, p_lead:lead});
        if(lead.onepage) lead.onepage.data.source.page.slug = '/' + slug;
        if(S.webhook){ try{ fetch(S.webhook, {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify(lead.onepage || {type:'lead', funnelId:F.id, funnel:F.name, ts:new Date().toISOString(), lead:lead})}).catch(function(){}); }catch(e){} }
        if(FP.consentOn(F)) lead.consent = FP.getConsent(F);
        /* Tracking der Website nur mit Einwilligung (wenn das Cookie-Banner des Funnels aktiv ist) */
        if(window.fbq && FP.allowed(F, 'mkt')) window.fbq('track', 'Lead', {value:lead.total || 0, currency:S.currency || 'EUR'});
        if(window.dataLayer && FP.allowed(F, 'perf')) window.dataLayer.push({event:'taptell_lead', funnel:F.name, value:lead.total || 0});
        if(S.redirect) setTimeout(function(){ location.href = S.redirect; }, 1500);
      }});
  }
  /* Popup: Button auf der Seite, Funnel im Fenster bzw. Vollbild auf dem Handy */
  function popup(box, F, slug, C){
    var t = F.theme || {}, label = box.getAttribute('data-label') || 'Jetzt starten';
    var host = box.attachShadow ? box.attachShadow({mode:'open'}) : box;
    host.innerHTML = '<style>:host{all:initial;display:inline-block}button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:' + (t.btnRadius != null ? t.btnRadius : 12) + 'px;background:' + (t.primary || '#111') + ';color:' + (t.primaryText || '#fff') + ';font:600 16px/1.2 system-ui,sans-serif;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:transform 160ms cubic-bezier(.23,1,.32,1)}button:active{transform:scale(.97)}button:focus-visible{outline:2px solid ' + (t.primary || '#111') + ';outline-offset:3px}</style><button type="button"></button>';
    var b = host.querySelector('button'); b.textContent = label;
    b.addEventListener('click', function(){
      var ov = document.createElement('div'); ov.setAttribute('data-taptell-overlay', '');
      document.body.appendChild(ov);
      var sh = ov.attachShadow({mode:'open'}), prevOverflow = document.documentElement.style.overflow;
      sh.innerHTML = '<style>:host{all:initial}.bg{position:fixed;inset:0;z-index:2147483646;background:rgba(9,9,11,.5);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity 200ms ease}.bg.on{opacity:1}'
        + '.sheet{position:relative;width:min(560px,100%);height:min(860px,100%);border-radius:20px;overflow:hidden;background:' + (t.bg || '#fff') + ';box-shadow:0 30px 80px -20px rgba(0,0,0,.5);transform:translateY(16px) scale(.98);transition:transform 260ms cubic-bezier(.23,1,.32,1)}.bg.on .sheet{transform:none}'
        + '.scr{position:absolute;inset:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.x{all:unset;position:absolute;top:12px;right:12px;z-index:5;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.06);color:#111;cursor:pointer;font:500 20px/1 system-ui}'
        + '@media (max-width:640px){.bg{padding:0}.sheet{width:100%;height:100%;border-radius:0}}@media (prefers-reduced-motion:reduce){.sheet{transition:none;transform:none}}</style>'
        + '<div class="bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + String(F.name).replace(/"/g,'') + '"><button class="x" aria-label="Schließen">×</button><div class="scr"><div class="slot"></div></div></div></div>';
      var bgEl = sh.querySelector('.bg'), scr = sh.querySelector('.scr'), slot = sh.querySelector('.slot');
      var close = function(){ bgEl.classList.remove('on'); document.documentElement.style.overflow = prevOverflow; document.removeEventListener('keydown', onk); setTimeout(function(){ ov.remove(); }, 200); };
      var onk = function(e){ if(e.key === 'Escape') close(); };
      sh.querySelector('.x').onclick = close;
      bgEl.addEventListener('click', function(e){ if(e.target === bgEl) close(); });
      document.addEventListener('keydown', onk);
      document.documentElement.style.overflow = 'hidden';
      mountInto(slot, F, slug, C, {scrollEl:scr});
      requestAnimationFrame(function(){ bgEl.classList.add('on'); });
    });
  }
  /* iFrame mit automatischer Höhe (der Funnel meldet seine Höhe per postMessage) */
  function iframe(box, slug){
    var f = document.createElement('iframe');
    f.src = BASE + encodeURIComponent(slug) + '?embed=1' + (location.search ? '&' + location.search.slice(1) : '');
    f.title = 'Funnel'; f.loading = 'lazy'; f.allow = 'clipboard-write';
    f.style.cssText = 'display:block;width:100%;height:640px;border:0;background:transparent;transition:height 200ms ease';
    box.appendChild(f);
    window.addEventListener('message', function(e){ if(e.source === f.contentWindow && e.data && e.data.taptell === 'height') f.style.height = Math.ceil(e.data.h) + 'px'; });
  }

  function init(C){
    [].slice.call(document.querySelectorAll('[data-taptell]:not([data-tt-ready])')).forEach(function(box){
      box.setAttribute('data-tt-ready', '');
      var slug = box.getAttribute('data-taptell'), mode = box.getAttribute('data-mode') || 'inline', mw = +box.getAttribute('data-max-width') || 0;
      if(mw){ box.style.maxWidth = mw + 'px'; box.style.marginLeft = 'auto'; box.style.marginRight = 'auto'; }
      if(mode === 'iframe') return iframe(box, slug);
      /* window.TapTellData[slug]: Funnel-Daten direkt von der Seite (Tests, Vorschau) */
      var local = window.TapTellData && window.TapTellData[slug];
      if(!local && !C.supabaseUrl) return;
      (local ? Promise.resolve(local) : rpc(C, 'get_public_funnel', {p_slug:slug})).then(function(F){
        if(!F){ return; }
        fonts(F);
        if(mode === 'popup') popup(box, F, slug, C);
        else mountInto(box, F, slug, C, {offset:+box.getAttribute('data-offset') || 16, radius:+box.getAttribute('data-radius') || 0});
      });
    });
  }
  var go = function(){ config().then(init); };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  window.TapTell = {refresh:go};
})();
