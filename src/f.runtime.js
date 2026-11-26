(function(){
  var C = window.FS_CONFIG || {}, el = document.getElementById('funnel');
  var qs = new URLSearchParams(location.search);
  /* Link-Formen: taptell.de/funnelname · taptell.de/f/funnelname · f.html?s=funnelname */
  var slug = qs.get('s') || (location.pathname.match(/\/f\/([^\/?#]+)/) || [])[1] || (location.pathname.match(/^\/([a-z0-9][a-z0-9-]*)\/?$/) || [])[1];
  /* Eingebettet als iFrame: Höhe an die Website melden, damit kein innerer Scrollbalken entsteht */
  if(qs.get('embed') === '1' || window.parent !== window){
    document.documentElement.classList.add('tt-embed');
    var post = function(){ try{ window.parent.postMessage({taptell:'height', h:document.documentElement.scrollHeight}, '*'); }catch(e){} };
    if(window.ResizeObserver) new ResizeObserver(post).observe(document.documentElement); window.addEventListener('load', post);
  }
  var msg = function(t){ el.innerHTML = '<div class="tt-msg">' + t + '</div>'; };
  if(!C.supabaseUrl || !window.supabase){ msg('Dieser Funnel ist nicht verfügbar.'); return; }
  var sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, {auth:{persistSession:false, autoRefreshToken:false}});
  /* Eigene Domain (z. B. konfigurator.firma.de): Funnel über den Hostnamen finden */
  if(!slug){
    sb.rpc('resolve_domain', {p_host:location.hostname}).then(function(r){ if(r.data){ slug = r.data; start(); } else msg('Dieser Funnel ist nicht verfügbar.'); });
    return start;
  }
  start();
  function start(){
  var Q = {}; qs.forEach(function(v, k){ if(/^(utm_|gclid|fbclid|ref)/.test(k)) Q[k] = v; });
  sb.rpc('get_public_funnel', {p_slug:slug}).then(function(r){
    if(r.error || !r.data){ msg('Dieser Funnel ist nicht verfügbar.'); return; }
    var F = r.data, t = F.theme || {}, S = F.settings || {};
    document.title = F.name; document.body.style.background = t.bg || '#fff';
    var mt = document.querySelector('meta[name=theme-color]'); if(mt) mt.content = t.bg || '#fff';
    FP.usedFonts(F).forEach(function(n){ var u = FP.fontLink(n); if(u && !(F.fonts || []).some(function(x){ return x.name === n; })){ var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); } });
    if((F.fonts || []).length){ var st = document.createElement('style'); st.textContent = FP.fontFaceCss(F.fonts); document.head.appendChild(st); }
    /* Meta-Pixel erst nach Einwilligung in Marketing (wenn das Cookie-Banner aktiv ist) */
    var initPixel = function(){ if(!S.pixel || window.fbq) return; !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', String(S.pixel).replace(/\D/g,'')); fbq('track','PageView'); };
    if(!FP.consentOn(F)) initPixel();
    /* Auswertung: zufällige Besuchs-ID nur für diesen Seitenaufruf (kein Cookie, nichts gespeichert),
       damit Absprünge und Verweildauer pro Seite messbar sind. Ohne tracking.sql fällt es auf die alte Zählung zurück. */
    var SID = Math.random().toString(36).slice(2, 12), V2 = true;
    var dev = /iPad|Tablet/i.test(navigator.userAgent) ? 'Tablet' : /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Handy' : 'Desktop';
    var src = Q.utm_source || (Q.fbclid ? 'facebook' : Q.gclid ? 'google' : '') || (document.referrer ? (function(){ try{ return new URL(document.referrer).hostname.replace(/^www\./, ''); }catch(e){ return ''; } })() : '') || 'direkt';
    var oldTrack = function(type, d){ if(type === 'view' || type === 'start' || type === 'page') sb.rpc('track_event', {p_slug:slug, p_type:type, p_page:d.pageId || null}).then(function(){}); };
    var track = function(type, d){
      var meta = type === 'click' ? JSON.stringify({l:d.label || '', u:d.url || ''}) : type === 'view' ? dev + '|' + String(src).slice(0, 60) : null;
      if(!V2) return oldTrack(type, d);
      sb.rpc('track_event', {p_slug:slug, p_type:type, p_page:d.pageId || null, p_meta:meta, p_sid:SID}).then(function(r){ if(r.error){ V2 = false; oldTrack(type, d); } });
    };
    FP.mount(el, F, {live:true, history:true,
      onConsent:function(v){ if(v && v.mkt) initPixel(); },
      onEvent:function(type, d){
        d = d || {};
        /* Meta Pixel: Start, jeder Schritt und Klicks als eigene Events (Lead kommt beim Absenden) */
        if(window.fbq){ var pg = (F.pages || []).filter(function(p){ return p.id === d.pageId; })[0];
          if(type === 'start') fbq('trackCustom', 'FunnelStart', {funnel:F.name});
          else if(type === 'page' && d.index > 0) fbq('trackCustom', 'FunnelStep', {funnel:F.name, step:d.index + 1, page:pg ? pg.name : ''});
          else if(type === 'click') fbq('trackCustom', 'FunnelClick', {funnel:F.name, label:d.label || '', url:d.url || ''}); }
        track(type === 'complete' ? 'lead' : type, d);
      },
      onSubmit:function(lead){
        lead.utm = Q; lead.page = location.href; lead.userAgent = navigator.userAgent.slice(0, 160);
        if(FP.consentOn(F)) lead.consent = FP.getConsent(F);
        sb.rpc('submit_lead', {p_slug:slug, p_lead:lead}).then(function(){});
        if(lead.onepage) lead.onepage.data.source.page.slug = '/' + slug;
        /* text/plain: einfacher Request ohne CORS-Vorabprüfung, der Inhalt ist trotzdem JSON */
        if(S.webhook){ try{ fetch(S.webhook, {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify(lead.onepage || {type:'lead', funnelId:F.id, funnel:F.name, ts:new Date().toISOString(), lead:lead})}).catch(function(){}); }catch(e){} }
        if(window.fbq) fbq('track', 'Lead', {value:lead.total || 0, currency:S.currency || 'EUR'});
        if(S.redirect) setTimeout(function(){ location.href = S.redirect; }, 1500);
      }});
  });
  }
})();
