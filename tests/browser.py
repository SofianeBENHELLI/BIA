"""Test navigateur : pages sans erreur console, sans débordement, ateliers et QCU utilisables, mode hors ligne.
Usage : python3 tests/browser.py"""
import sys, subprocess, time, os
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
PORT = 8797
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '-d', ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
fails = 0
def check(c, m):
    global fails
    if not c: fails += 1; print('ECHEC', m)
URL = f'http://localhost:{PORT}'
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for label, vp in (('desktop', {'width': 1280, 'height': 900}), ('mobile', {'width': 390, 'height': 844})):
            for page_name in ('', 'aerodynamique/', 'meteo/', 'avions/', 'aeronefs/', 'navigation/', 'histoire/', 'anglais/', 'pilote/', 'entrainement/', 'mythiques/', 'architectures/', 'identification/', 'credits/'):
                ctx = b.new_context(viewport=vp, has_touch=(label == 'mobile')); pg = ctx.new_page()
                errs = []
                pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
                pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.goto(f'{URL}/{page_name}'); pg.wait_for_timeout(800)
                check(not errs, f'/{page_name} {label} erreurs console: {errs}')
                ow = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
                check(ow <= 2, f'/{page_name} {label}: débordement horizontal {ow}px')
                name = page_name.strip('/') or 'accueil'
                pg.screenshot(path=f'/tmp/bia-{name}-{label}.png', full_page=False)
                check(pg.locator('.btn-install').count() >= 1, f'/{page_name} {label}: pas de bouton Installer')
                if page_name == 'pilote/':
                    a = pg.locator('#lab-age'); a.locator('input[type=range]').fill('17')
                    check(a.locator('.step.locked').count() >= 3, f'pilote {label}: étapes futures')
                    pg.locator('#lab-aides button', has_text='ULM').click()
                    check('550' in pg.locator('#lab-aides').inner_text(), f'pilote {label}: aide ULM avec BIA')
                    for lid in ('lab-age', 'lab-aides', 'voies'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                if page_name == 'entrainement/':
                    pg.locator('#go-mini').click(); pg.wait_for_timeout(200)
                    for k in range(25):
                        pg.locator('#qbox .choice').nth(k % 4).click()
                        pg.locator('#next').click()
                    pg.screenshot(path=f'/tmp/bia-exam-confirm-{label}.png')
                    pg.locator('#ok').click(); pg.wait_for_timeout(300)
                    check('/ 20' in pg.locator('#app').inner_text(), f'entrainement {label}: pas de note')
                    pg.screenshot(path=f'/tmp/bia-exam-result-{label}.png', full_page=False)
                    check(len(pg.evaluate("JSON.parse(localStorage.getItem('bia-saleem:exam-hist'))")) == 1, f'entrainement {label}: historique')
                if page_name == 'histoire/':
                    check(pg.locator('.ev').count() >= 45, f'histoire {label}: frise incomplète')
                    pg.locator('.ev button').first.click(); check(pg.locator('.ev.open').count() == 1, f'histoire {label}: événement non dépliable')
                    o = pg.locator('#game-order'); o.scroll_into_view_if_needed(); o.locator('button', has_text='Vérifier').click()
                    for lid in ('tl', 'game-order', 'game-who'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                if page_name == 'anglais/':
                    f = pg.locator('#lab-flash'); f.scroll_into_view_if_needed(); f.locator('.flash .in').click(); pg.wait_for_timeout(500)
                    check(f.locator('.flash.flip').count() == 1, f'anglais {label}: carte non retournée')
                    a = pg.locator('#lab-alpha'); check('Foxtrot Golf Tango Mike Papa' in a.locator('#al-out').inner_text(), f'anglais {label}: épellation')
                    d = pg.locator('#lab-dialog'); d.locator('.choice').first.click(); check(d.locator('.choice.right').count() == 1, f'anglais {label}: dialogue')
                    for lid in ('lab-flash', 'lab-alpha', 'lab-dialog'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                if page_name == 'navigation/':
                    check(pg.locator('.lab').count() == 6, f'navigation {label}: {pg.locator(".lab").count()} ateliers')
                    for lid in ('lab-triangle', 'lab-piste', 'lab-niveaux', 'lab-espaces', 'lab-feux', 'lab-calcul'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                    c = pg.locator('#lab-calcul'); c.locator('input').fill('9999'); c.locator('button[type=submit]').click()
                    check('Non' in c.locator('.verdict').inner_text(), f'navigation {label}: calcul mental')
                    n3 = pg.locator('#lab-niveaux'); n3.locator('.seg button', has_text='FL75').click()
                    check('Correct' in n3.locator('.verdict').inner_text(), f'navigation {label}: FL75 route 093 refusé')
                if page_name == 'aeronefs/':
                    check(pg.locator('.lab').count() == 6, f'aeronefs {label}: {pg.locator(".lab").count()} ateliers')
                    p = pg.locator('#lab-pitot'); p.scroll_into_view_if_needed(); pg.wait_for_timeout(400)
                    p.locator('button', has_text='Boucher le Pitot').click(); p.locator('button', has_text='Boucher le drain').click()
                    p.locator('input[type=range]').first.fill('7000'); pg.wait_for_timeout(2500)
                    check('altimètre' in p.locator('.verdict').inner_text(), f'aeronefs {label}: panne Pitot+drain')
                    for lid in ('lab-moteur', 'lab-pitot', 'lab-longeron', 'lab-turbo', 'lab-orbite', 'lab-config'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(300); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                    m = pg.locator('#lab-moteur'); m.locator('button', has_text='Temps suivant').click(); m.locator('button', has_text='Temps suivant').click()
                    check('Combustion' in m.locator('.verdict').inner_text() or 'étincelle' in m.locator('.verdict').inner_text(), f'aeronefs {label}: moteur 3e temps')
                if page_name == 'avions/':
                    check(pg.locator('.lab').count() == 4, f'avions {label}: {pg.locator(".lab").count()} ateliers')
                    for lid in ('lab-anemo', 'lab-tableau', 'lab-check', 'lab-fuel', 'compare', 'traps'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                    a = pg.locator('#lab-anemo'); a.locator('button', has_text='VNE').click()
                    check('VNE' in a.locator('.verdict').inner_text(), f'avions {label}: anémomètre VNE')
                    t = pg.locator('#lab-tableau'); t.locator('[aria-label="Altimètre"]').click()
                    check('QNH' in t.locator('.verdict').inner_text(), f'avions {label}: tableau de bord')
                    f = pg.locator('#lab-fuel'); f.locator('input[type=range]').first.fill('20')
                    check('Pas assez' in f.locator('.verdict').inner_text(), f'avions {label}: carburant insuffisant non signalé')
                    broken = pg.evaluate("[...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').length")
                    check(broken == 0, f'avions {label}: images cassées')
                if page_name == 'mythiques/':
                    pg.wait_for_timeout(500)
                    check(pg.locator('.mcard').count() == 64, f'mythiques {label}: {pg.locator(".mcard").count()} fiches')
                    broken = pg.evaluate("[...document.querySelectorAll('.mcard img')].filter(i => i.complete && i.naturalWidth === 0).length")
                    check(broken == 0, f'mythiques {label}: {broken} photos cassées')
                    pg.locator('.mcard').nth(27).click(); pg.wait_for_timeout(300)
                    check(pg.locator('dialog.fiche[open]').count() == 1, f'mythiques {label}: fiche non ouverte')
                    pg.screenshot(path=f'/tmp/bia-fiche-{label}.png')
                    pg.locator('dialog.fiche [data-go="1"]').click(); pg.wait_for_timeout(200)
                    pg.locator('.close-x').click()
                    check(pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('bia-saleem:myth-seen')||'{}')).length") == 2, f'mythiques {label}: fiches vues non enregistrées')
                    g = pg.locator('#game-photo'); g.scroll_into_view_if_needed(); g.locator('.choice').first.click()
                    check(g.locator('.choice.right').count() == 1, f'mythiques {label}: jeu photo sans correction')
                    g.screenshot(path=f'/tmp/bia-gamephoto-{label}.png')
                    o = pg.locator('#game-order'); o.scroll_into_view_if_needed(); o.locator('button', has_text='Vérifier').click()
                    o.screenshot(path=f'/tmp/bia-gameorder-{label}.png')
                    pg.locator('#galerie').scroll_into_view_if_needed(); pg.wait_for_timeout(300); pg.screenshot(path=f'/tmp/bia-galerie-{label}.png')
                if page_name == 'architectures/':
                    pg.select_option('#preset', '15'); pg.wait_for_timeout(150)
                    check('Delta' in pg.locator('#lab-config').inner_text() or 'delta' in pg.locator('#lab-config').inner_text(), f'archi {label}: préréglage')
                    pg.locator('#lab-config button[data-v="v"]').click(); pg.wait_for_timeout(100)
                    check('papillon' in pg.locator('#archi-info').inner_text(), f'archi {label}: fiche empennage V')
                    check(pg.locator('.fam-opt').count() >= 40, f'archi {label}: familles')
                    q = pg.locator('#lab-quiz'); q.scroll_into_view_if_needed(); q.locator('.choice').first.click()
                    check(q.locator('.choice.ok').count() == 1, f'archi {label}: quiz sans correction')
                    for lid in ('lab-config', 'archi-info', 'lab-quiz'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                if page_name == 'identification/':
                    pg.wait_for_timeout(300)
                    n = pg.locator('.gcard').count(); check(n >= 100, f'ident {label}: {n} avions')
                    broken = pg.evaluate("[...document.querySelectorAll('.gcard img')].filter(i => i.complete && i.naturalWidth === 0).length")
                    check(broken == 0, f'ident {label}: {broken} photos cassées')
                    q = pg.locator('#lab-ident'); q.locator('.choice').first.click()
                    check(q.locator('.choice.ok').count() == 1, f'ident {label}: pas de correction')
                    q.screenshot(path=f'/tmp/bia-ident-{label}.png')
                if page_name == 'meteo/':
                    n = pg.locator('.lab').count(); check(n == 8, f'meteo {label}: {n} ateliers au lieu de 8')
                    for lid in ('lab-isa', 'lab-altimetre', 'lab-vent', 'lab-foehn', 'lab-nuages', 'lab-front', 'lab-heure', 'lab-metar'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(150); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                    lab = pg.locator('#lab-metar'); lab.locator('button', has_text='Brouillard').click()
                    check('impossible' in lab.locator('.verdict').inner_text(), f'meteo {label}: METAR brouillard accepté en VFR')
                    lab = pg.locator('#lab-altimetre'); lab.locator('button', has_text='dépression').click()
                    check('Méfiance' in lab.locator('.verdict').inner_text(), f'meteo {label}: piège altimétrique absent')
                    # mode sombre persistant
                    pg.locator('.btn-theme').click(); pg.wait_for_timeout(100)
                    th = pg.evaluate("document.documentElement.getAttribute('data-theme')")
                    pg.reload(); pg.wait_for_timeout(500)
                    check(pg.evaluate("document.documentElement.getAttribute('data-theme')") == th, f'{label}: thème non conservé')
                    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')")
                    pg.screenshot(path=f'/tmp/bia-meteo-dark-{label}.png')
                    pg.locator('#lab-front').scroll_into_view_if_needed(); pg.wait_for_timeout(150)
                    pg.locator('#lab-front').screenshot(path=f'/tmp/bia-front-dark-{label}.png')
                if page_name == 'aerodynamique/':
                    n = pg.locator('.lab').count(); check(n == 8, f'{label}: {n} ateliers au lieu de 8')
                    # Soufflerie : on tire le bord de fuite vers le bas pour dépasser l'incidence critique
                    lab = pg.locator('#lab-soufflerie'); lab.scroll_into_view_if_needed()
                    h = lab.locator('.handle').first; bb = h.bounding_box()
                    pg.mouse.move(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.mouse.down()
                    pg.mouse.move(bb['x'] + bb['width'] / 2 - 30, bb['y'] + bb['height'] / 2 + 90, steps=8); pg.mouse.up()
                    v = lab.locator('.verdict').inner_text()
                    check('Décrochage' in v, f'{label}: soufflerie non décrochée ({v})')
                    lab.screenshot(path=f'/tmp/bia-soufflerie-{label}.png')
                    # Tangage : CG reculé derrière le foyer → instable
                    lab = pg.locator('#lab-tangage'); lab.scroll_into_view_if_needed()
                    h = lab.locator('.handle').first; bb = h.bounding_box()
                    pg.mouse.move(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.mouse.down()
                    pg.mouse.move(bb['x'] + bb['width'] / 2 + 120, bb['y'] + bb['height'] / 2, steps=8); pg.mouse.up()
                    check('instable' in lab.locator('.verdict').inner_text(), f'{label}: CG arrière non détecté instable')
                    lab.locator('button', has_text='Rafale').click(); pg.wait_for_timeout(2500)
                    check('Perte de contrôle' in lab.locator('.verdict').inner_text(), f'{label}: avion instable sans divergence')
                    lab.screenshot(path=f'/tmp/bia-tangage-{label}.png')
                    for lid in ('lab-polaire', 'lab-virage', 'lab-gouvernes', 'lab-centrage', 'lab-diedre', 'lab-montgolfiere'):
                        l = pg.locator('#' + lid); l.scroll_into_view_if_needed(); pg.wait_for_timeout(200); l.screenshot(path=f'/tmp/bia-{lid}-{label}.png')
                    # Centrage : surcharge arrière → hors enveloppe
                    lab = pg.locator('#lab-centrage'); sl = lab.locator('input[type=range]')
                    sl.nth(1).fill('200'); sl.nth(2).fill('60')
                    check('Trop lourd' in lab.locator('.verdict').inner_text() or 'arrière' in lab.locator('.verdict').inner_text(), f'{label}: centrage surchargé accepté')
                    # QCU : répondre à une question
                    q = pg.locator('#quiz'); q.scroll_into_view_if_needed()
                    q.locator('.choice').first.click()
                    check(q.locator('.expl').count() == 1, f'{label}: pas d’explication après réponse')
                    q.screenshot(path=f'/tmp/bia-quiz-{label}.png')
                    st = pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('bia-saleem:q')||'{}')).length")
                    check(st == 1, f'{label}: statistique non enregistrée ({st})')
                ctx.close()
        # Hors ligne : après une première visite, le service worker sert les pages sans réseau
        ctx = b.new_context(); pg = ctx.new_page()
        pg.goto(URL + '/'); pg.wait_for_timeout(500)
        pg.evaluate('navigator.serviceWorker.ready'); pg.wait_for_timeout(1500)
        ctx.set_offline(True)
        pg.goto(URL + '/aerodynamique/'); pg.wait_for_timeout(800)
        check(pg.locator('.lab').count() == 8, 'hors ligne : la page Aérodynamique ne se charge pas')
        ctx.close()
        b.close()
finally:
    srv.terminate()
print('OK' if not fails else f'{fails} échec(s)')
sys.exit(1 if fails else 0)
