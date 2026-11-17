(function(){
  var C = window.FS_CONFIG || {}, el = document.getElementById('funnel');
  var qs = new URLSearchParams(location.search);
  var slug = qs.get('s') || (location.pathname.match(/\/f\/([^\/?#]+)/) || [])[1];
  var msg = function(t){ el.innerHTML = '<div class="tt-msg">' + t + '</div>'; };
  if(!slug || !C.supabaseUrl || !window.supabase){ msg('Dieser Funnel ist nicht verfügbar.'); return; }
  var sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, {auth:{persistSession:false, autoRefreshToken:false}});
  var Q = {}; qs.forEach(function(v, k){ if(/^(utm_|gclid|fbclid|ref)/.test(k)) Q[k] = v; });
  sb.rpc('get_public_funnel', {p_slug:slug}).then(function(r){
    if(r.error || !r.data){ msg('Dieser Funnel ist nicht verfügbar.'); return; }
    var F = r.data, t = F.theme || {}, S = F.settings || {};
    document.title = F.name; document.body.style.background = t.bg || '#fff';
    var mt = document.querySelector('meta[name=theme-color]'); if(mt) mt.content = t.bg || '#fff';
    FP.usedFonts(F).forEach(function(n){ var u = FP.fontLink(n); if(u && !(F.fonts || []).some(function(x){ return x.name === n; })){ var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); } });
    if((F.fonts || []).length){ var st = document.createElement('style'); st.textContent = F.fonts.map(function(x){ return "@font-face{font-family:'" + String(x.name).replace(/'/g,'') + "';src:url(" + x.data + ");font-display:swap}"; }).join('\n'); document.head.appendChild(st); }
    if(S.pixel){ !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', String(S.pixel).replace(/\D/g,'')); fbq('track','PageView'); }
    FP.mount(el, F, {live:true,
      onEvent:function(type, d){ if(type === 'complete') return; sb.rpc('track_event', {p_slug:slug, p_type:type, p_page:(d && d.pageId) || null}).then(function(){}); },
      onSubmit:function(lead){
        lead.utm = Q; lead.page = location.href; lead.userAgent = navigator.userAgent.slice(0, 160);
        sb.rpc('submit_lead', {p_slug:slug, p_lead:lead}).then(function(){});
        if(S.webhook){ try{ fetch(S.webhook, {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify({type:'lead', funnelId:F.id, funnel:F.name, ts:new Date().toISOString(), lead:lead})}).catch(function(){}); }catch(e){} }
        if(window.fbq) fbq('track', 'Lead', {value:lead.total || 0, currency:S.currency || 'EUR'});
        if(S.redirect) setTimeout(function(){ location.href = S.redirect; }, 1500);
      }});
  });
})();
