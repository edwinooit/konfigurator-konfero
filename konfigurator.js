// ═══ KONFERO KONFIGURATOR v2.1 ═══
// Samoładujący się skrypt.
//
// W Webflow Code Embed wklej:
//   <div id="konfero-konfigurator"></div>
//   <script src="https://cdn.jsdelivr.net/gh/edwinooit/konfigurator-konfero@main/konfigurator.js"></script>
//
// Edytujesz TYLKO ten plik na GitHubie → push → strona się aktualizuje.

(function() {
  'use strict';

  // ─── Konfiguracja wysyłki emailem ───
  // Test:  'https://flow.rocksoft.co/webhook-test/konfero-kalkulacja'
  // Prod:  'https://flow.rocksoft.co/webhook/konfero-kalkulacja'
  var WEBHOOK_URL   = 'https://flow.rocksoft.co/webhook/konfero-kalkulacja';
  var TURNSTILE_KEY = 'WKLEJ_TUTAJ_SITE_KEY'; // z dash.cloudflare.com → Turnstile

  // ─── Inject CSS ───
  var style = document.createElement('style');
  style.textContent = `.kk * { margin: 0; padding: 0; box-sizing: border-box; }
.kk {
  --blue: #1c52a4;
  --blue-hover: #163f80;
  --orange: #fb5607;
  --pastel: #a8c1f7;
  --pastel-20: rgba(168,193,247,0.2);
  --cool: #e8eef7;
  --bg: #f5f6fa;
  --dark: #000;
  --white: #fff;
  --gray: #efefef;
  --gray-border: #ecebea;
  --text: #333;
  --text-light: #666;
  --shadow: 4px 4px 20px rgba(0,0,0,0.1);
  --shadow-lg: 8px 8px 30px rgba(0,0,0,0.12);
  --radius: 10px;
  --radius-pill: 20rem;
  --transition: all 0.32s ease;
  font-family: 'Open Sans', sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

/* ─── PROGRESS BAR ─── */
.kk-progress {
  position: sticky; top: 0; z-index: 100;
  background: var(--white);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.kk-progress-inner {
  max-width: 960px; margin: 0 auto;
  display: flex; align-items: stretch;
}
.kk-pstep {
  flex: 1; text-align: center;
  padding: 16px 8px 14px;
  font-size: 13px; font-weight: 600;
  color: #aaa; cursor: default;
  border-bottom: 3px solid transparent;
  transition: var(--transition);
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.kk-pstep.active { color: var(--blue); border-bottom-color: var(--blue); }
.kk-pstep.done { color: var(--blue); border-bottom-color: var(--pastel); cursor: pointer; }
.kk-pstep .sn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: #e0e0e0; color: var(--white);
  font-size: 12px; font-weight: 700;
  flex-shrink: 0;
  transition: var(--transition);
}
.kk-pstep.active .sn, .kk-pstep.done .sn { background: var(--blue); }
.kk-pstep.done .sn::after { content: '✓'; }
.kk-pstep .sl { line-height: 1.2; }

/* ─── MAIN ─── */
.kk-main { max-width: 960px; margin: 0 auto; padding: 40px 24px 100px; }
.kk-step { display: none; animation: kkFadeUp 0.4s ease; }
.kk-step.visible { display: block; }
@keyframes kkFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ─── STEP HEADER ─── */
.kk-header { text-align: center; margin-bottom: 40px; }
.kk-badge {
  display: inline-block; background: var(--cool); color: var(--blue);
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; padding: 6px 16px; border-radius: var(--radius-pill);
  margin-bottom: 16px;
}
.kk-header h2 {
  font-size: 36px; font-weight: 700; color: var(--dark);
  line-height: 1.2; margin-bottom: 12px; letter-spacing: -0.02em;
}
.kk-header p {
  font-size: 16px; color: var(--text-light);
  max-width: 560px; margin: 0 auto; line-height: 1.6;
}

/* ─── PACKAGE CARDS ─── */
.kk-pkgs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.kk-pkg {
  background: var(--white); border: 2px solid var(--gray-border);
  border-radius: var(--radius); padding: 32px 28px;
  cursor: pointer; transition: var(--transition);
  position: relative; overflow: hidden;
}
.kk-pkg:hover { border-color: var(--pastel); box-shadow: var(--shadow); transform: translateY(-3px); }
.kk-pkg.sel { border-color: var(--blue); box-shadow: var(--shadow-lg); background: linear-gradient(135deg, var(--white) 85%, var(--cool) 100%); }
.kk-pkg-icon {
  width: 56px; height: 56px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 20px;
}
.kk-pkg-icon.ic-conf { background: #e8eef7; }
.kk-pkg-icon.ic-bank { background: #fef3e2; }
.kk-pkg-icon.ic-event { background: #f3e8fe; }
.kk-pkg-icon.ic-plen { background: #e2f7ed; }
.kk-pkg h3 { font-size: 22px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
.kk-pkg .sub { font-size: 13px; color: var(--text-light); margin-bottom: 16px; line-height: 1.5; }
.kk-pkg .inc { font-size: 13px; color: var(--text); line-height: 1.7; }
.kk-pkg .inc span { display: block; padding-left: 20px; position: relative; }
.kk-pkg .inc span::before { content: '✓'; position: absolute; left: 0; color: var(--blue); font-weight: 700; }
.kk-pkg .pr { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--gray-border); display: flex; align-items: baseline; gap: 6px; }
.kk-pkg .pr .f { font-size: 12px; color: var(--text-light); font-weight: 600; }
.kk-pkg .pr .a { font-size: 28px; font-weight: 800; color: var(--blue); }
.kk-pkg .pr .u { font-size: 13px; color: var(--text-light); font-weight: 500; }
.kk-pkg .pr .old { font-size: 16px; font-weight: 600; color: #bbb; text-decoration: line-through; margin-right: 8px; }
.kk-pkg .comp { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--gray-border); }
.kk-pkg .comp span { display: block; font-size: 12px; color: var(--text-light); line-height: 1.8; padding-left: 0; position: relative; }
.kk-pkg .comp span b { color: var(--text); font-weight: 600; float: right; }
.kk-pkg .sb {
  position: absolute; top: 16px; right: 16px;
  background: var(--blue); color: var(--white);
  font-size: 11px; font-weight: 700;
  padding: 4px 12px; border-radius: var(--radius-pill);
  opacity: 0; transform: scale(0.8); transition: var(--transition);
}
.kk-pkg.sel .sb { opacity: 1; transform: scale(1); }

/* ─── DAYS ─── */
.kk-days {
  margin-top: 32px; background: var(--white);
  border-radius: var(--radius); padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.kk-days h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.kk-days .hint { font-size: 13px; color: var(--text-light); margin-bottom: 16px; }
.kk-days-row { display: flex; gap: 10px; flex-wrap: wrap; }
.kk-dbtn {
  padding: 10px 24px; border: 2px solid var(--gray-border);
  border-radius: var(--radius-pill); background: var(--white);
  font-family: 'Open Sans', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: var(--transition); color: var(--text);
}
.kk-dbtn:hover { border-color: var(--pastel); }
.kk-dbtn.active { border-color: var(--blue); background: var(--blue); color: var(--white); }
.kk-dbtn .dt { font-size: 11px; font-weight: 700; color: var(--orange); margin-left: 4px; }
.kk-dbtn.active .dt { color: #ffd6b3; }

/* ─── ADDON CARDS ─── */
.kk-addons { display: grid; grid-template-columns: 1fr; gap: 12px; }
.kk-addon {
  background: var(--white); border: 2px solid var(--gray-border);
  border-radius: var(--radius); padding: 24px 28px;
  display: flex; align-items: center; gap: 20px;
  cursor: pointer; transition: var(--transition);
}
.kk-addon:hover { border-color: var(--pastel); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.kk-addon.sel { border-color: var(--blue); background: linear-gradient(135deg, var(--white) 90%, var(--cool) 100%); }
.kk-chk {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px;
  border: 2px solid #d0d0d0; display: flex; align-items: center; justify-content: center;
  transition: var(--transition); font-size: 14px; color: transparent;
}
.kk-addon.sel .kk-chk { border-color: var(--blue); background: var(--blue); color: var(--white); }
.kk-ainfo { flex: 1; }
.kk-ainfo h4 { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 4px; }
.kk-ainfo p { font-size: 13px; color: var(--text-light); line-height: 1.5; }
.kk-aprice { flex-shrink: 0; text-align: right; }
.kk-aprice .a { font-size: 20px; font-weight: 800; color: var(--blue); white-space: nowrap; }
.kk-aprice .u { font-size: 11px; color: var(--text-light); font-weight: 500; }

/* Quantity */
.kk-qty { display: none; align-items: center; gap: 8px; margin-top: 10px; }
.kk-addon.sel .kk-qty.has-qty { display: flex; }
.kk-qbtn {
  width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--blue);
  background: var(--white); color: var(--blue); font-size: 16px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: var(--transition); font-family: 'Open Sans', sans-serif;
}
.kk-qbtn:hover { background: var(--blue); color: var(--white); }
.kk-qval { font-size: 16px; font-weight: 700; min-width: 40px; text-align: center; }
.kk-qlbl { font-size: 12px; color: var(--text-light); margin-left: 4px; }

/* Section label */
.kk-slabel {
  font-size: 13px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--blue);
  margin: 32px 0 16px; padding-bottom: 8px;
  border-bottom: 2px solid var(--cool);
}
.kk-slabel.green { color: #2d8a56; border-color: #c8e6d4; }

/* ─── SUMMARY ─── */
.kk-sumcard { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
.kk-sumhead { background: linear-gradient(135deg, var(--blue) 0%, #2a6fd6 100%); color: var(--white); padding: 32px; }
.kk-sumhead h3 { font-size: 24px; font-weight: 700; margin-bottom: 4px; color: var(--white); }
.kk-sumhead p { font-size: 14px; color: var(--white); opacity: 1; }
.kk-sumbody { padding: 32px; }
.kk-sumline {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: 1px solid var(--gray); font-size: 15px;
}
.kk-sumline:last-child { border: none; }
.kk-sumline .l { color: var(--text); }
.kk-sumline .l small { color: var(--text-light); font-weight: 400; }
.kk-sumline .v { font-weight: 700; color: var(--dark); white-space: nowrap; }
.kk-sumline.disc .v { color: var(--orange); }
.kk-stitle {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--blue);
  margin-top: 20px; margin-bottom: 4px;
}
.kk-stitle.green { color: #2d8a56; }
.kk-sumtotal {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 24px 32px; background: var(--cool); border-top: 2px solid var(--pastel);
}
.kk-sumtotal .l { font-size: 18px; font-weight: 700; color: var(--dark); }
.kk-sumtotal .v { font-size: 32px; font-weight: 800; color: var(--blue); }
.kk-sumtotal .v small { font-size: 14px; font-weight: 500; color: var(--text-light); }
.kk-sumnote {
  padding: 20px 32px 28px; text-align: center;
  font-size: 13px; color: var(--text-light); line-height: 1.6;
}

/* ─── BUTTONS ─── */
.kk-nav { display: flex; justify-content: space-between; margin-top: 40px; gap: 16px; }
.kk-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 36px; border-radius: var(--radius-pill);
  font-family: 'Open Sans', sans-serif; font-size: 15px; font-weight: 700;
  cursor: pointer; transition: var(--transition); border: 2px solid transparent;
  text-decoration: none;
}
.kk-btn-p { background: var(--blue); color: var(--white); border-color: var(--blue); box-shadow: 4px 4px 20px rgba(0,0,0,0.1); }
.kk-btn-p:hover { background: var(--white); color: var(--blue); }
.kk-btn-g { background: transparent; color: var(--text-light); border: none; padding: 14px 20px; }
.kk-btn-g:hover { color: var(--dark); }
.kk-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

/* CTA */
.kk-cta {
  text-align: center; margin-top: 40px; padding: 40px;
  background: linear-gradient(135deg, var(--blue) 0%, #2a6fd6 100%);
  border-radius: var(--radius); color: var(--white);
}
.kk-cta h3 { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--white); }
.kk-cta p { font-size: 15px; color: var(--white); margin-bottom: 24px; max-width: 440px; margin-left: auto; margin-right: auto; }
.kk-btn-cta { background: var(--white); color: var(--blue); border-color: var(--white); font-size: 16px; padding: 16px 48px; }
.kk-btn-cta:hover { background: transparent; color: var(--white); }

/* ─── FLOATING BAR ─── */
.kk-float {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--white); box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  padding: 16px 24px; z-index: 999;
  transform: translateY(100%); transition: transform 0.3s ease;
}
.kk-float.vis { transform: translateY(0); }
.kk-float-in {
  max-width: 960px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
}
.kk-float-info { font-size: 14px; color: var(--text-light); }
.kk-float-info .t { font-size: 24px; font-weight: 800; color: var(--blue); margin-left: 8px; }

/* ─── RESPONSIVE ─── */
@media (max-width: 700px) {
  .kk-pkgs { grid-template-columns: 1fr; }
  .kk-header h2 { font-size: 26px; }
  .kk-addon { flex-wrap: wrap; padding: 20px; }
  .kk-aprice { width: 100%; text-align: left; margin-top: 8px; }
  .kk-pstep {
    flex-direction: column; gap: 4px;
    font-size: 11px; padding: 10px 4px 8px;
  }
  .kk-pstep .sn { width: 28px; height: 28px; font-size: 12px; }
  .kk-pstep .sl { font-size: 10px; line-height: 1.2; }
  .kk-sumtotal .v { font-size: 26px; }
  .kk-nav { flex-direction: column; }
  .kk-nav .kk-btn { justify-content: center; }
  .kk-float-in { flex-direction: column; gap: 8px; text-align: center; }
}

/* ─── FORMULARZ EMAIL ─── */
.kk-emailform {
  margin-top: 32px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 36px 32px;
}
.kk-form-header { margin-bottom: 28px; }
.kk-form-header h3 {
  font-size: 22px; font-weight: 700; color: var(--dark); margin-bottom: 8px;
}
.kk-form-header p { font-size: 14px; color: var(--text-light); line-height: 1.6; }
.kk-form-fields {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;
}
.kk-field { display: flex; flex-direction: column; gap: 6px; }
.kk-field-full { grid-column: 1 / -1; }
.kk-label { font-size: 13px; font-weight: 700; color: var(--text); }
.kk-opt { font-weight: 400; color: var(--text-light); }
.kk-input {
  padding: 12px 16px;
  border: 2px solid var(--gray-border);
  border-radius: var(--radius);
  font-family: 'Open Sans', sans-serif;
  font-size: 14px; color: var(--text);
  transition: border-color .2s;
  outline: none; background: var(--white);
  width: 100%; box-sizing: border-box;
}
.kk-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(28,82,164,.08);
}
.kk-input.kk-err { border-color: #e53e3e; }
.kk-textarea { resize: vertical; min-height: 80px; }
.kk-form-actions { margin-bottom: 12px; }
.kk-form-status {
  margin-top: 16px; padding: 14px 20px;
  border-radius: var(--radius);
  font-size: 14px; font-weight: 600; line-height: 1.5;
}
.kk-form-status.ok {
  background: #e6f7ee; color: #2d8a56; border: 1px solid #b7e4c7;
}
.kk-form-status.err {
  background: #fff5f5; color: #c53030; border: 1px solid #feb2b2;
}
.kk-form-note { font-size: 12px; color: var(--text-light); margin-top: 12px; line-height: 1.5; }
@media (max-width: 700px) {
  .kk-form-fields { grid-template-columns: 1fr; }
  .kk-emailform { padding: 24px 20px; }
}`;
  document.head.appendChild(style);

  // ─── Załaduj Cloudflare Turnstile SDK ───
  (function() {
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js?render=explicit';
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  })();

  // ─── Inject HTML ───
  var target = document.getElementById('konfero-konfigurator');
  if (!target) {
    var scripts = document.getElementsByTagName('script');
    var thisScript = scripts[scripts.length - 1];
    target = document.createElement('div');
    target.id = 'konfero-konfigurator';
    thisScript.parentNode.insertBefore(target, thisScript);
  }
  target.innerHTML = `<div class="kk">

  
  <div class="kk-progress">
    <div class="kk-progress-inner">
      <div class="kk-pstep active" data-s="0" onclick="kkGoIf(0)"><span class="sn">1</span><span class="sl">Typ eventu</span></div>
      <div class="kk-pstep" data-s="1" onclick="kkGoIf(1)"><span class="sn">2</span><span class="sl">Upgrade'y</span></div>
      <div class="kk-pstep" data-s="2" onclick="kkGoIf(2)"><span class="sn">3</span><span class="sl">Moduły</span></div>
      <div class="kk-pstep" data-s="3" onclick="kkGoIf(3)"><span class="sn">4</span><span class="sl">Podsumowanie</span></div>
    </div>
  </div>

  <div class="kk-main">

    
    <div class="kk-step visible" id="kk-s0">
      <div class="kk-header">
        <div class="kk-badge">Krok 1 z 4</div>
        <h2>Jaki event planujesz?</h2>
        <p>Wybierz pakiet, który najlepiej pasuje do Twojego wydarzenia. Każdy zawiera pełną bazę – sale, przestrzenie wspólne, foyer i parking.</p>
      </div>
      <div class="kk-pkgs" id="kk-pkgs"></div>
      <div class="kk-days" id="kk-days" style="display:none">
        <h4>Na ile dni potrzebujesz Konfero?</h4>
        <div class="hint">Dodatkowe dni to lepsze stawki – im dłużej, tym korzystniej.</div>
        <div class="kk-days-row" id="kk-drow"></div>
      </div>
      <div class="kk-nav">
        <div></div>
        <button class="kk-btn kk-btn-p" id="kk-next0" disabled onclick="kkGo(1)">Dalej – wybierz dodatki →</button>
      </div>
    </div>

    
    <div class="kk-step" id="kk-s1">
      <div class="kk-header">
        <div class="kk-badge">Krok 2 z 4</div>
        <h2>Dopasuj obiekt do potrzeb</h2>
        <p>Dodatki to opcje, które rozszerzają Twój pakiet – obsługa techniczna, dodatkowe sale, dekoracja. Wybierz, co pasuje.</p>
      </div>
      <div class="kk-addons" id="kk-upg"></div>
      <div class="kk-nav">
        <button class="kk-btn kk-btn-g" onclick="kkGo(0)">← Wróć</button>
        <button class="kk-btn kk-btn-p" onclick="kkGo(2)">Dalej – dodaj moduły →</button>
      </div>
    </div>

    
    <div class="kk-step" id="kk-s2">
      <div class="kk-header">
        <div class="kk-badge">Krok 3 z 4</div>
        <h2>Dopasuj detale</h2>
        <p>Catering, barista, tłumaczenia, strefa rodzinna – każdy moduł możesz dodać niezależnie od pakietu. Twój event, Twoje zasady.</p>
      </div>
      <div class="kk-slabel green">🍽️ Catering</div>
      <div class="kk-addons" id="kk-cat"></div>
      <div class="kk-slabel green" style="margin-top:36px">🎯 Usługi dodatkowe</div>
      <div class="kk-addons" id="kk-srv"></div>
      <div class="kk-nav">
        <button class="kk-btn kk-btn-g" onclick="kkGo(1)">← Wróć</button>
        <button class="kk-btn kk-btn-p" onclick="kkGo(3)">Zobacz podsumowanie →</button>
      </div>
    </div>

    
    <div class="kk-step" id="kk-s3">
      <div class="kk-header">
        <div class="kk-badge">Krok 4 z 4</div>
        <h2>Twój event w Konfero</h2>
        <p>Sprawdź wszystko. Jeśli chcesz coś zmienić – wracaj śmiało do poprzednich kroków.</p>
      </div>
      <div class="kk-sumcard">
        <div class="kk-sumhead">
          <h3 id="kk-sname">–</h3>
          <p id="kk-sdesc">–</p>
        </div>
        <div class="kk-sumbody" id="kk-sbody"></div>
        <div class="kk-sumtotal">
          <div class="l">Razem (netto)</div>
          <div class="v" id="kk-stotal">– zł</div>
        </div>
        <div class="kk-sumnote">
          Podane ceny są orientacyjne i stanowią punkt wyjścia do rozmowy.<br>
          Kwoty netto – do ceny należy doliczyć podatek VAT 23%.
        </div>
      </div>
      <div class="kk-emailform" id="kk-emailform">
        <div class="kk-form-header">
          <h3>Wyślij kalkulację i pobierz Rider techniczny</h3>
          <p>Otrzymasz zestawienie kosztów na email wraz z <strong>Riderem technicznym Konfero</strong> – specyfikacją AV, sceny i zasilania, gotową do przekazania ekipie realizacyjnej.</p>
        </div>
        <div class="kk-form-fields">
          <div class="kk-field">
            <label class="kk-label" for="kk-f-name">Imię i nazwisko *</label>
            <input class="kk-input" id="kk-f-name" type="text" placeholder="np. Anna Kowalska" autocomplete="name">
          </div>
          <div class="kk-field">
            <label class="kk-label" for="kk-f-email">Adres email *</label>
            <input class="kk-input" id="kk-f-email" type="email" placeholder="np. anna@firma.pl" autocomplete="email">
          </div>
          <div class="kk-field kk-field-full">
            <label class="kk-label" for="kk-f-phone">Telefon <span class="kk-opt">(opcjonalnie)</span></label>
            <input class="kk-input" id="kk-f-phone" type="tel" placeholder="np. 600 123 456" autocomplete="tel">
          </div>
          <div class="kk-field kk-field-full">
            <label class="kk-label" for="kk-f-comment">Komentarz <span class="kk-opt">(opcjonalnie)</span></label>
            <textarea class="kk-input kk-textarea" id="kk-f-comment" placeholder="Planowana data, liczba uczestników, pytania…" rows="3"></textarea>
          </div>
        </div>
        <div id="kk-turnstile" style="margin-bottom:16px"></div>
        <div class="kk-form-actions">
          <button class="kk-btn kk-btn-p" id="kk-f-submit" onclick="kkSubmitEmail()">Wyślij kalkulację i pobierz Rider →</button>
        </div>
        <div class="kk-form-status" id="kk-form-status" style="display:none"></div>
        <p class="kk-form-note">Twoje dane służą wyłącznie do przesłania kalkulacji i kontaktu w sprawie eventu. Nie trafiają do żadnych list mailingowych.</p>
      </div>
      <div class="kk-cta">
        <h3>Podoba Ci się ten setup?</h3>
        <p>Skontaktuj się z nami – omówimy szczegóły, dopasujemy ofertę i zarezerwujemy termin dla Ciebie.</p>
        <a href="/kontakt" class="kk-btn kk-btn-cta">Skontaktuj się →</a>
      </div>
      <div class="kk-nav" style="justify-content:center">
        <button class="kk-btn kk-btn-g" onclick="kkGo(2)">← Wróć do konfiguracji</button>
      </div>
    </div>

  </div>
</div>


<div class="kk-float kk" id="kk-float">
  <div class="kk-float-in">
    <div class="kk-float-info">
      Szacowana kwota: <span class="t" id="kk-ftotal">0 zł</span>
      <span style="font-size:12px"> netto</span>
    </div>
    <button class="kk-btn kk-btn-p" style="padding:10px 28px;font-size:14px" id="kk-fbtn" onclick="kkFloatNext()">Dalej →</button>
  </div>
</div>`;

  // ─── Logic ───
  // ══════════════════════════════════════════
  // DATA — ceny wg cennika Konfero v2.0
  // ══════════════════════════════════════════
  var PKGS = [
    {
      id:'konferencja', icon:'🎤', ic:'ic-conf',
      name:'Konferencyjna',
      sub:'Konferencje, szkolenia, zjazdy, panele – główny produkt Konfero.',
      inc:['Sala Diament (560 m², do 450 osób)','Ekran LED 4×8 m + nagłośnienie','Oświetlenie LED + regulacja','Strefa wypoczynku 150 m²','Hol główny, parking (110 miejsc), Wi-Fi'],
      comp:[{n:'Sala Diament 560 m²',v:4500},{n:'Ekran LED 4×8 m',v:2500},{n:'Nagłośnienie konferencyjne',v:1500},{n:'Oświetlenie LED sceny',v:1000}],
      base:7000,
      upg:[
        {id:'u-tech',name:'Obsługa techniczna',desc:'Technik na miejscu przez cały dzień wydarzenia – zero stresu ze sprzętem.',price:1500,unit:'zł / dzień'},
        {id:'u-scene',name:'Niestandardowa konfiguracja sceny',desc:'Ustawienie sceny według Twojego briefu – dedykowane podesty, układ, backstage.',price:1000,unit:'zł'},
        {id:'u-sala120',name:'Dodatkowa sala (120 osób)',desc:'Sala Silver – warsztaty, breakout sessions, networking w kameralnej przestrzeni.',price:1000,unit:'zł / dzień'},
        {id:'u-sala20',name:'Dodatkowa salka (20 osób)',desc:'Kameralna przestrzeń na spotkanie VIP, prelegentów lub zarządu.',price:400,unit:'zł / dzień'}
      ]
    },
    {
      id:'bankiet', icon:'🥂', ic:'ic-bank',
      name:'Bankietowa',
      sub:'Bankiety firmowe, studniówki, gale – wieczory, które zapamiętasz.',
      inc:['Sala Diament (bankietowo, do 300 os.)','Stoły i obrusy','Nagłośnienie + oświetlenie standard','Kawiarnia Gold (120 miejsc, balkon)','Strefa wypoczynku 150 m², Hol główny'],
      comp:[{n:'Sala Diament (bankiet)',v:4500},{n:'Stoły i obrusy',v:1500},{n:'Nagłośnienie + oświetlenie',v:2000},{n:'Kawiarnia Gold',v:1500}],
      base:8000,
      upg:[
        {id:'u-guest100',name:'Liczba uczestników 100–200 – dopłata',desc:'Dopłata za większą grupę gości – dodatkowe ustawienie sali i obsługa.',price:1000,unit:'zł'},
        {id:'u-guest200',name:'Liczba uczestników 200–300 – dopłata',desc:'Dopłata za ponad 200 gości – pełna konfiguracja sali na dużą imprezę.',price:2000,unit:'zł'},
        {id:'u-kitchen',name:'Kuchnia z zapleczem',desc:'Pełen dostęp do kuchni – przygotowanie posiłków na miejscu przez Waszego cateringu.',price:2000,unit:'zł / dzień'},
        {id:'u-decor',name:'Dekoracja sali',desc:'Wykorzystanie elementów dekoracyjnych dostępnych na obiekcie – aranżacja bez dodatkowego zakupu materiałów.',price:1800,unit:'zł'},
        {id:'u-led-b',name:'Ekran LED 4×8 m',desc:'Wyświetlanie prezentacji, spotów, wizualizacji – efektowne tło dla Twojego wydarzenia.',price:1000,unit:'zł / dzień'}
      ]
    },
    {
      id:'event', icon:'🎸', ic:'ic-event',
      name:'Eventowa',
      sub:'Eventy firmowe, gale, wigilijki, imprezy integracyjne – energia i emocje.',
      inc:['Sala Diament (560 m², do 450 osób)','Ekran LED 4×8 m + nagłośnienie','Oświetlenie LED + regulacja','Strefa wypoczynku 150 m²','Hol główny, parking (110 miejsc), Wi-Fi'],
      comp:[{n:'Sala Diament 560 m²',v:4500},{n:'Ekran LED 4×8 m',v:2500},{n:'Nagłośnienie konferencyjne',v:1500},{n:'Oświetlenie LED sceny',v:1000}],
      base:7000,
      upg:[
        {id:'u-tech-e',name:'Obsługa techniczna',desc:'Technik na miejscu przez cały dzień – nagłośnienie, oświetlenie, ekran LED pod kontrolą.',price:1500,unit:'zł / dzień'},
        {id:'u-scene-e',name:'Niestandardowa konfiguracja sceny',desc:'Ustawienie sceny według Twojego briefu – dedykowane podesty, układ, backstage.',price:1000,unit:'zł'},
        {id:'u-backstage',name:'Pomieszczenia dla prelegentów / zespołów',desc:'Garderoba, backstage, przygotowanie – komfort i prywatność przed wejściem na scenę.',price:400,unit:'zł / dzień'}
      ]
    },
    {
      id:'plener', icon:'🌿', ic:'ic-plen',
      name:'Plenerowa',
      sub:'Pikniki firmowe, festiwale na świeżym powietrzu – Twoje wydarzenie pod chmurką.',
      inc:['Tereny trawiaste, lasek, boiska','Podłączenie do prądu (food trucki)','Strefa wypoczynku wewnątrz','Hol główny wewnątrz','Toalety wewnątrz'],
      comp:[{n:'Tereny zewnętrzne + boiska',v:3000},{n:'Podłączenie do prądu',v:1000},{n:'Strefa wypoczynku wewnątrz',v:1500},{n:'Hol główny + toalety',v:1000}],
      base:6000,
      upg:[
        {id:'u-diament',name:'Sala Diament na prelekcje / wystawy',desc:'Dodatkowa przestrzeń wewnątrz – na panele, prezentacje, wystawy.',price:3000,unit:'zł / dzień'},
        {id:'u-kino',name:'Kino letnie na świeżym powietrzu',desc:'Projekcja outdoorowa – filmy, prezentacje, transmisje pod gwiazdami.',price:2500,unit:'zł'},
        {id:'u-tent',name:'Namiot na boisku (~100 osób)',desc:'Zadaszenie terenu zewnętrznego 6×12 m – plan B na niepogodę lub strefa VIP.',price:6000,unit:'zł'},
        {id:'u-sauna',name:'Sauna – 2 godziny (do 12 osób)',desc:'Relaks po wydarzeniu – idealna na eventy integracyjne.',price:600,unit:'zł'}
      ]
    }
  ];

  var CAT = [
    {id:'m-lunch',name:'Obiad / lunch / kolacja – bufet',desc:'Forma bufetowa, porcelana, szkło, sztućce – pełna obsługa dla Twoich gości.',price:35,unit:'zł / osoba',hq:1,ql:'osób',qd:100,qm:20,qs:10},
    {id:'m-coffee',name:'Kawa przelewowa – bez limitu',desc:'Nieograniczony dostęp do kawy na 1 uczestnika. Przerwa kawowa, która nigdy się nie kończy.',price:10,unit:'zł / osoba',hq:1,ql:'osób',qd:100,qm:20,qs:10},
    {id:'m-coffee-l',name:'Kawa przelewowa – termos 10 l',desc:'Ok. 60 porcji kawy w termosie. Sprawdzony format na duże grupy i szybkie przerwy.',price:150,unit:'zł / termos',hq:1,ql:'termosów',qd:2,qm:1,qs:1},
    {id:'m-tea',name:'Herbata – termos 10 l',desc:'Wrzątek + herbata do wyboru. Ciepło w każdej przerwie.',price:40,unit:'zł / termos',hq:1,ql:'termosów',qd:2,qm:1,qs:1},
    {id:'m-cake',name:'Ciasto deserowe',desc:'Domowe ciasta w Kawiarni Gold – idealne na słodki akcent przerwy.',price:15,unit:'zł / osoba',hq:1,ql:'osób',qd:100,qm:20,qs:10}
  ];

  var SRV = [
    {id:'m-barista',name:'Obsługa kawiarni',desc:'Profesjonalny barista w Kawiarni Gold. Flat white z widokiem na Beskidy.',price:800,unit:'zł / dzień'},
    {id:'m-waiter',name:'Obsługa kelnerska',desc:'Profesjonalna obsługa przy stołach – kelnerzy na cały dzień wydarzenia.',price:2000,unit:'zł / dzień'},
    {id:'m-trans50',name:'Tłumaczenia symultaniczne – do 50 osób',desc:'Kabina + sprzęt przenośny (komplet). Twój event bez barier językowych.',price:1500,unit:'zł / dzień'},
    {id:'m-trans50p',name:'Tłumaczenia symultaniczne – powyżej 50 osób',desc:'Kabina + zewnętrzny sprzęt: 1 500 zł bazowo + 15 zł za każdą osobę. Skontaktuj się po wycenę.',price:1500,unit:'zł + 15 zł/os.',hq:1,ql:'osób',qd:100,qm:51,qs:10},
    {id:'m-family',name:'Pokój zabaw + pokój matki karmiącej',desc:'Przestrzeń familyjna – Twoi goście mogą przyjechać z dziećmi.',price:400,unit:'zł / dzień'}
  ];

  var ALL_MOD = CAT.concat(SRV);

  // ══════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════
  var S = { step:0, pkg:null, days:1, upg:{}, mod:{}, qty:{} };

  function fp(n){ return Math.round(n).toLocaleString('pl-PL'); }
  function getPkg(){ return PKGS.find(function(p){return p.id===S.pkg}); }
  function getMod(id){ return ALL_MOD.find(function(m){return m.id===id}); }

  // ══════════════════════════════════════════
  // RENDER PACKAGES
  // ══════════════════════════════════════════
  function rPkgs(){
    var g=document.getElementById('kk-pkgs');
    g.innerHTML=PKGS.map(function(p){
      var cv=0; p.comp.forEach(function(c){cv+=c.v;});
      var compHtml=p.comp.map(function(c){return '<span>'+c.n+'<b>'+fp(c.v)+' zł</b></span>'}).join('');
      return '<div class="kk-pkg'+(S.pkg===p.id?' sel':'')+'" onclick="kkSelPkg(\''+p.id+'\')">'
        +'<div class="sb">Wybrano ✓</div>'
        +'<div class="kk-pkg-icon '+p.ic+'">'+p.icon+'</div>'
        +'<h3>'+p.name+'</h3>'
        +'<div class="sub">'+p.sub+'</div>'
        +'<div class="inc">'+p.inc.map(function(i){return '<span>'+i+'</span>'}).join('')+'</div>'
        +'<div class="comp">'+compHtml+'</div>'
        +'<div class="pr"><span class="old">'+fp(cv)+' zł</span><span class="a">'+fp(p.base)+'</span><span class="u">zł netto / dzień</span></div>'
        +'</div>';
    }).join('');
  }

  window.kkSelPkg=function(id){
    S.pkg=id; S.upg={};
    rPkgs(); rDays();
    document.getElementById('kk-days').style.display='block';
    document.getElementById('kk-next0').disabled=false;
    uTotal();
  };

  // ══════════════════════════════════════════
  // RENDER DAYS
  // ══════════════════════════════════════════
  function rDays(){
    var ds=[{n:1,l:'1 dzień',d:''},{n:2,l:'2 dni',d:'–20% za 2. dzień'},{n:3,l:'3 dni',d:'–25% za 3. dzień'},{n:4,l:'4 dni',d:'–25% za 3.+ dzień'},{n:5,l:'5 dni',d:'–25% za 3.+ dzień'}];
    document.getElementById('kk-drow').innerHTML=ds.map(function(d){
      return '<button class="kk-dbtn'+(S.days===d.n?' active':'')+'" onclick="kkSelDay('+d.n+')">'
        +d.l+(d.d?'<span class="dt">'+d.d+'</span>':'')+'</button>';
    }).join('');
  }
  window.kkSelDay=function(n){ S.days=n; rDays(); uTotal(); };

  // ══════════════════════════════════════════
  // RENDER UPGRADES
  // ══════════════════════════════════════════
  function rUpg(){
    var p=getPkg(); if(!p) return;
    document.getElementById('kk-upg').innerHTML=p.upg.map(function(u){
      var sel=!!S.upg[u.id];
      return '<div class="kk-addon'+(sel?' sel':'')+'" onclick="kkTogUpg(\''+u.id+'\')">'
        +'<div class="kk-chk">✓</div>'
        +'<div class="kk-ainfo"><h4>'+u.name+'</h4><p>'+u.desc+'</p></div>'
        +'<div class="kk-aprice"><div class="a">'+fp(u.price)+'</div><div class="u">'+u.unit+'</div></div>'
        +'</div>';
    }).join('');
  }
  window.kkTogUpg=function(id){ S.upg[id]=!S.upg[id]; if(!S.upg[id]) delete S.upg[id]; rUpg(); uTotal(); };

  // ══════════════════════════════════════════
  // RENDER MODULES
  // ══════════════════════════════════════════
  function rMod(){
    rModGrid(CAT,'kk-cat');
    rModGrid(SRV,'kk-srv');
  }
  function rModGrid(items,gid){
    document.getElementById(gid).innerHTML=items.map(function(m){
      var sel=!!S.mod[m.id];
      var q=S.qty[m.id]||m.qd||1;
      return '<div class="kk-addon'+(sel?' sel':'')+'" onclick="kkTogMod(\''+m.id+'\',event)">'
        +'<div class="kk-chk">✓</div>'
        +'<div class="kk-ainfo"><h4>'+m.name+'</h4><p>'+m.desc+'</p>'
        +(m.hq?'<div class="kk-qty has-qty" onclick="event.stopPropagation()">'
          +'<button class="kk-qbtn" onclick="kkChgQ(\''+m.id+'\','+ -m.qs+')">−</button>'
          +'<span class="kk-qval">'+q+'</span>'
          +'<button class="kk-qbtn" onclick="kkChgQ(\''+m.id+'\','+m.qs+')">+</button>'
          +'<span class="kk-qlbl">'+m.ql+'</span></div>':'')
        +'</div>'
        +'<div class="kk-aprice"><div class="a">'+(sel&&m.hq?fp(m.price*q):fp(m.price))+'</div>'
        +'<div class="u">'+m.unit+(sel&&m.hq?' × '+q:'')+'</div></div>'
        +'</div>';
    }).join('');
  }
  window.kkTogMod=function(id,e){
    if(e&&e.target.closest&&e.target.closest('.kk-qty')) return;
    var m=getMod(id);
    if(S.mod[id]){ delete S.mod[id]; delete S.qty[id]; }
    else{ S.mod[id]=true; if(m&&m.hq) S.qty[id]=m.qd; }
    rMod(); uTotal();
  };
  window.kkChgQ=function(id,d){
    var m=getMod(id); if(!m) return;
    var c=S.qty[id]||m.qd;
    S.qty[id]=Math.max(m.qm,c+d);
    rMod(); uTotal();
  };

  // ══════════════════════════════════════════
  // CALC TOTAL
  // ══════════════════════════════════════════
  function calc(){
    var p=getPkg(); if(!p) return {base:0,upg:0,mod:0,total:0};
    var b=p.base;
    if(S.days>=2) b+=p.base*0.8;
    for(var i=3;i<=S.days;i++) b+=p.base*0.75;
    var ut=0;
    Object.keys(S.upg).forEach(function(uid){
      var u=p.upg.find(function(x){return x.id===uid});
      if(u) ut+= u.unit.indexOf('dzień')>-1 ? u.price*S.days : u.price;
    });
    var mt=0;
    Object.keys(S.mod).forEach(function(mid){
      var m=getMod(mid); if(!m) return;
      var q=S.qty[mid]||1;
      if(mid==='m-trans50p'){ mt+=1500*S.days+15*q; }
      else if(m.hq) mt+=m.price*q;
      else if(m.unit.indexOf('dzień')>-1) mt+=m.price*S.days;
      else mt+=m.price;
    });
    return {base:b,upg:ut,mod:mt,total:b+ut+mt};
  }
  function uTotal(){
    var t=calc();
    document.getElementById('kk-ftotal').textContent=fp(t.total)+' zł';
    var fl=document.getElementById('kk-float');
    if(S.pkg&&S.step<3) fl.classList.add('vis'); else fl.classList.remove('vis');
  }

  // ══════════════════════════════════════════
  // RENDER SUMMARY
  // ══════════════════════════════════════════
  function rSum(){
    var p=getPkg(); if(!p) return;
    document.getElementById('kk-sname').textContent='Pakiet '+p.name+' '+p.icon;
    document.getElementById('kk-sdesc').textContent=p.sub;
    var t=calc(); var h='';
    var cv=0; p.comp.forEach(function(c){cv+=c.v;});
    h+='<div class="kk-stitle">Baza – wynajem obiektu</div>';
    if(S.days===1){
      h+=sLine(p.name+' – 1 dzień <small>(wartość osobno: '+fp(cv)+' zł)</small>',fp(p.base)+' zł');
    } else {
      h+=sLine('Dzień 1 (stawka podstawowa)',fp(p.base)+' zł');
      if(S.days>=2) h+=sLine('Dzień 2 <small>(–20%)</small>',fp(p.base*0.8)+' zł','disc');
      for(var i=3;i<=S.days;i++) h+=sLine('Dzień '+i+' <small>(–25%)</small>',fp(p.base*0.75)+' zł','disc');
    }
    var uKeys=Object.keys(S.upg);
    if(uKeys.length){
      h+='<div class="kk-stitle" style="margin-top:20px">Dodatki do pakietu</div>';
      uKeys.forEach(function(uid){
        var u=p.upg.find(function(x){return x.id===uid});
        if(u){
          var tot=u.unit.indexOf('dzień')>-1?u.price*S.days:u.price;
          var ds=u.unit.indexOf('dzień')>-1?' <small>(× '+S.days+' dni)</small>':'';
          h+=sLine(u.name+ds,fp(tot)+' zł');
        }
      });
    }
    var mKeys=Object.keys(S.mod);
    if(mKeys.length){
      h+='<div class="kk-stitle green" style="margin-top:20px">Moduły</div>';
      mKeys.forEach(function(mid){
        var m=getMod(mid); if(!m) return;
        var q=S.qty[mid]||1; var tot,det;
        if(mid==='m-trans50p'){ tot=1500*S.days+15*q; det=' <small>(1 500 zł × '+S.days+' dni + '+q+' os. × 15 zł)</small>'; }
        else if(m.hq){ tot=m.price*q; det=' <small>('+q+' × '+fp(m.price)+' zł)</small>'; }
        else if(m.unit.indexOf('dzień')>-1){ tot=m.price*S.days; det=' <small>(× '+S.days+' dni)</small>'; }
        else{ tot=m.price; det=''; }
        h+=sLine(m.name+det,fp(tot)+' zł');
      });
    }
    document.getElementById('kk-sbody').innerHTML=h;
    document.getElementById('kk-stotal').innerHTML=fp(t.total)+' zł <small>netto</small>';
  }
  function sLine(l,v,c){ return '<div class="kk-sumline'+(c?' '+c:'')+'"><span class="l">'+l+'</span><span class="v">'+v+'</span></div>'; }

  // ══════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════
  window.kkGo=function(n){
    if(n>0&&!S.pkg) return;
    S.step=n;
    document.querySelectorAll('.kk-step').forEach(function(el,i){ el.classList.toggle('visible',i===n); });
    document.querySelectorAll('.kk-pstep').forEach(function(el,i){
      el.classList.remove('active','done');
      if(i===n) el.classList.add('active');
      else if(i<n) el.classList.add('done');
    });
    if(n===1) rUpg();
    if(n===2) rMod();
    if(n===3){ rSum(); resetEmailForm(); setTimeout(initTurnstile, 300); document.getElementById('kk-float').classList.remove('vis'); }
    uTotal();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  window.kkGoIf=function(n){ if(n<S.step) kkGo(n); };
  window.kkFloatNext=function(){ if(S.step<3) kkGo(S.step+1); };

  // ══════════════════════════════════════════
  // EMAIL FORM
  // ══════════════════════════════════════════
  var _turnstileWidgetId = null;

  function initTurnstile() {
    if (typeof turnstile === 'undefined') return;
    if (_turnstileWidgetId !== null) return;
    _turnstileWidgetId = turnstile.render('#kk-turnstile', {
      sitekey: TURNSTILE_KEY,
      theme: 'light',
      size: 'normal'
    });
  }

  function resetEmailForm() {
    ['kk-f-name','kk-f-email','kk-f-phone','kk-f-comment'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('kk-err'); }
    });
    if (_turnstileWidgetId !== null && typeof turnstile !== 'undefined') {
      turnstile.reset(_turnstileWidgetId);
    }
    kkHideStatus();
    var btn = document.getElementById('kk-f-submit');
    if (btn) { btn.disabled = false; btn.textContent = 'Wyślij kalkulację i pobierz Rider →'; }
  }

  function kkShowStatus(type, msg) {
    var el = document.getElementById('kk-form-status');
    if (!el) return;
    el.className = 'kk-form-status ' + type;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function kkHideStatus() {
    var el = document.getElementById('kk-form-status');
    if (el) { el.style.display = 'none'; el.className = 'kk-form-status'; }
  }

  window.kkSubmitEmail = function() {
    var name    = document.getElementById('kk-f-name').value.trim();
    var email   = document.getElementById('kk-f-email').value.trim();
    var phone   = document.getElementById('kk-f-phone').value.trim();
    var comment = document.getElementById('kk-f-comment').value.trim();

    // Walidacja wymaganych pól
    var valid = true;
    ['kk-f-name','kk-f-email'].forEach(function(id) {
      var el = document.getElementById(id);
      var empty = !el.value.trim();
      el.classList.toggle('kk-err', empty);
      if (empty) valid = false;
    });
    if (!valid) { kkShowStatus('err', 'Wypełnij wymagane pola.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      document.getElementById('kk-f-email').classList.add('kk-err');
      kkShowStatus('err', 'Podaj prawidłowy adres email.');
      return;
    }

    // Turnstile token
    var token = (typeof turnstile !== 'undefined' && _turnstileWidgetId !== null)
      ? turnstile.getResponse(_turnstileWidgetId) : '';
    if (!token) {
      kkShowStatus('err', 'Poczekaj chwilę na weryfikację anty-bot i spróbuj ponownie.');
      return;
    }

    // Buduj payload z aktualną kalkulacją
    var t = calc();
    var p = getPkg();
    var upgNames = Object.keys(S.upg).map(function(uid) {
      var u = p.upg.find(function(x) { return x.id === uid; });
      return u ? u.name : uid;
    });
    var modNames = Object.keys(S.mod).map(function(mid) {
      var m = getMod(mid); return m ? m.name : mid;
    });

    var payload = {
      turnstile_token: token,
      name:        name,
      email:       email,
      phone:       phone,
      comment:     comment,
      package:     p ? p.name : '',
      days:        S.days,
      upgrades:    upgNames,
      modules:     modNames,
      total_netto: t.total
    };

    // Wyślij i obsłuż odpowiedź
    var btn = document.getElementById('kk-f-submit');
    btn.disabled = true;
    btn.textContent = 'Wysyłanie…';
    kkHideStatus();

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) return res.json().then(function(e) { throw e; });
      return res.json();
    })
    .then(function() {
      kkShowStatus('ok',
        '✓ Wysłano! Sprawdź skrzynkę – kalkulacja i Rider techniczny już są u Ciebie. Odezwiemy się wkrótce.');
      btn.textContent = 'Wysłano ✓';
    })
    .catch(function(err) {
      var msg = (err && err.error) ? err.error
        : 'Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na kontakt@konfero.pl';
      kkShowStatus('err', msg);
      btn.disabled = false;
      btn.textContent = 'Wyślij kalkulację i pobierz Rider →';
      if (typeof turnstile !== 'undefined' && _turnstileWidgetId !== null) {
        turnstile.reset(_turnstileWidgetId);
      }
    });
  };

  // INIT
  rPkgs(); rDays();
})();
