import pathlib, base64, shutil
d = pathlib.Path(__file__).parent
r = lambda n: (d/n).read_text()
logo = 'data:image/png;base64,' + base64.b64encode((d/'logo-t.png').read_bytes()).decode()
logow = 'data:image/png;base64,' + base64.b64encode((d/'logo-w.png').read_bytes()).decode()
app = r('app.js').replace('%%TT_LOGO%%', logo).replace('%%TT_LOGO_W%%', logow)
def page(config_tag):
    return f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TapTell – Mobile Funnels</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231c2e3d'/%3E%3Ctext x='32' y='44' font-family='Arial' font-weight='800' font-size='30' fill='white' text-anchor='middle'%3ETT%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap">
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
html,body{{margin:0;min-height:100%}}#funnel{{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}}#funnel>.fp{{flex:1}}.tt-msg{{font:15px/1.5 system-ui,sans-serif;color:#6b7280;text-align:center;padding:90px 24px}}
{r('player.css')}
</style>
<script src="/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
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
print('built', (d/'funnel-studio.html').stat().st_size//1024, 'KB')
