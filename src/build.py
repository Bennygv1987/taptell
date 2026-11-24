import pathlib, base64, shutil
d = pathlib.Path(__file__).parent
r = lambda n: (d/n).read_text()
logo = 'data:image/png;base64,' + base64.b64encode((d/'logo-t.png').read_bytes()).decode()
logow = 'data:image/png;base64,' + base64.b64encode((d/'logo-w.png').read_bytes()).decode()
import re as _re
# supabase-js fest gepinnt – dieselben Werte wie in app.js (SUPABASE_JS / SUPABASE_JS_SRI)
_m = _re.search(r"var SUPABASE_JS = '([^']+)', SUPABASE_JS_SRI = '([^']+)'", r('app.js'))
SUPABASE_JS, SUPABASE_JS_SRI = _m.group(1), _m.group(2)
app = r('app.js').replace('%%TT_LOGO%%', logo).replace('%%TT_LOGO_W%%', logow)
mail_module = (d.parent/'supabase/functions/_shared/automation-mail.mjs').read_text()
mail_script = 'var TTMail = (function(){\n' + mail_module.replace('export function ', 'function ') + '\nreturn {renderAutomationEmail, sampleLead, varsFor, renderText};})();'
def page(config_tag):
    return f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TapTell – Mobile Funnels</title>
<script>try{{var t=localStorage.getItem('tt-theme');document.documentElement.setAttribute('data-theme',t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))}}catch(e){{}}</script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231c2e3d'/%3E%3Ctext x='32' y='44' font-family='Arial' font-weight='800' font-size='30' fill='white' text-anchor='middle'%3ETT%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<style id="player-css">
{r('player.css')}
</style>
<style>
{r('app.css')}
</style>
{config_tag}
</head>
<body>
<div id="app"></div>
<script id="player-js">
{r('player.js')}
</script>
<script>
{r('templates.js')}
</script>
<script>
{r('media.js')}
{mail_script}
{app}
</script>
</body>
</html>
"""
(d/'funnel-studio.html').write_text(page(''))
dep = d/'deploy'; dep.mkdir(exist_ok=True)
(dep/'index.html').write_text(page('<script src="config.js"></script>'))
(dep/'f.html').write_text(f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<title>Funnel</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>
html,body{{margin:0;min-height:100%}}html{{-webkit-text-size-adjust:100%;overscroll-behavior-y:none}}.tt-embed #funnel{{min-height:0!important}}#funnel{{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}}#funnel>.fp{{flex:1}}.tt-msg{{font:15px/1.5 system-ui,sans-serif;color:#6b7280;text-align:center;padding:90px 24px}}
{r('player.css')}
</style>
<script src="/config.js"></script>
<script src="{SUPABASE_JS}" integrity="{SUPABASE_JS_SRI}" crossorigin="anonymous"></script>
</head>
<body>
<div id="funnel"><div class="tt-msg">Lädt …</div></div>
<script>
{r('player.js')}
</script>
<script>
{r('f.runtime.js')}
</script>
</body>
</html>
""")
# fertige Dateien ins Projekt-Root kopieren (dort liegt die deploybare App)
# app.html = Dashboard für das Hosting. index.html = dasselbe nur für die lokale Entwicklung
# (gitignored und in .vercelignore): Auf Vercel hat eine vorhandene index.html Vorrang vor den Rewrites,
# dann könnte taptell.de unter / nie die Landingpage zeigen.
shutil.copyfile(dep/'index.html', d.parent/'app.html')
for n in ('index.html', 'f.html'): shutil.copyfile(dep/n, d.parent/n)

# ---- vercel.json: reservierte Adressen aus app.js (RESERVED_SLUGS) in den Kurzlink-Rewrite übernehmen ----
import json as _json
_res = _re.findall(r"'([a-z0-9-]+)'", _re.search(r"var RESERVED_SLUGS = \[([^\]]+)\]", r('app.js')).group(1))
_vp = d.parent/'vercel.json'; _old = _vp.read_text()
_src = '/:slug((?!(?:' + '|'.join(_res) + ')$)[a-z0-9][a-z0-9-]*)'
_new = _re.sub(r'"/:slug\((?:[^"\\]|\\.)*"', lambda m: _json.dumps(_src), _old, count=1)
_json.loads(_new)  # bleibt gültiges JSON
if _new != _old: _vp.write_text(_new); print('vercel.json: reservierte Adressen aktualisiert')
print('built', (d/'funnel-studio.html').stat().st_size//1024, 'KB')

# ---- embed.js: Einbetten auf Kunden-Websites (Player + CSS + Laufzeit in einer Datei) ----
(d.parent/'embed.js').write_text('/* TapTell Embed – automatisch erzeugt aus src/embed.runtime.js, src/player.js, src/player.css */\n'
  + 'window.__TT_PLAYER_CSS=' + _json.dumps(r('player.css')) + ';\n'
  + r('player.js') + '\n' + r('embed.runtime.js'))
