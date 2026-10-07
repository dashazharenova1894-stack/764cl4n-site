/* Смоук-тест критичных путей сайта.
   Запуск: node smoke.mjs             — только HTTP-проверки (без зависимостей)
           node smoke.mjs --browser   — плюс клики через playwright (если установлен)
   Переменные окружения: SMOKE_URL (по умолчанию http://127.0.0.1:8123/),
   DISCORD_WEBHOOK (если задан и есть падения — улетит алерт в Discord). */
const BASE = (process.env.SMOKE_URL || process.argv[2] || 'http://127.0.0.1:8123/').replace(/\/?$/, '/');
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); console.log((c ? 'OK   ' : 'FAIL ') + m); };
const txt = async u => { const r = await fetch(BASE + u, { cache: 'no-store' }); if (!r.ok) throw new Error(u + ' -> ' + r.status); return r.text(); };

async function httpChecks() {
  const idx = await txt('index.html');
  for (const m of ['id="gear"', 'id="setp"', 'id="qa"', 'id="af"', 'id="ld"', 'id="mir"', 'community.js?v']) ok(idx.includes(m), 'index содержит ' + m);
  for (const u of ['sw.js', 'community.js', 'community.css', 'more.js', 'mnav.js', 'live.js', 'i18n.js', 'i18n-x.js', 'manifest.webmanifest', 'offline.html', '404.html', 'data.json', 'calendar.ics', 'robots.txt', 'sitemap.xml']) {
    try { await txt(u); ok(true, 'ассет ' + u); } catch (e) { ok(false, 'ассет ' + u + ' (' + e.message + ')'); }
  }
  const d = JSON.parse(await txt('data.json'));
  ok(Array.isArray(d.members) && d.members.length > 0, 'data.json: состав непустой');
  ok(typeof d.next === 'string', 'data.json: есть дата созвона');
  for (const u of ['share/roster.html', 'share/media.html', 'share/results.html', 'share/hof.html', 'share/bounty.html', 'share/act.html', 'share/achievements.html', 'p/3b4rtb0eymamb.html', 'p/wassupxyilo.html', 'p/xx444.z_83520.html']) {
    try { await txt(u); ok(true, 'страница ' + u); } catch (e) { ok(false, 'страница ' + u + ' (' + e.message + ')'); }
  }
}

async function browserChecks() {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { console.log('playwright не установлен — пропускаю клики'); return; }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(2500);
  /* гейт «Откуда ты заходишь?» (ПК/телефон) на первом заходе: выбираем ПК */
  if (await pg.$('#hxdev')) { await pg.click('#hxdev button[data-d="pc"]'); await pg.waitForTimeout(600); }
  await pg.mouse.click(400, 300); /* первый жест: разблокировка звука */
  for (const s of ['news', 'poll', 'qa']) {
    await pg.click('#mre'); /* панель закрывается после выбора пункта — открываем заново */
    await pg.waitForTimeout(250);
    await pg.click('#mrp button[data-s="' + s + '"]');
    await pg.waitForTimeout(300);
    ok(await pg.$eval('#' + s, el => getComputedStyle(el).display !== 'none'), 'раздел «' + s + '» открывается');
  }
  await pg.click('#gear');
  ok(await pg.$eval('#setp', el => el.classList.contains('o')), 'настройки открываются');
  ok((await pg.$$('#mtrks .mtr')).length > 0, 'список треков в настройках есть');
  await pg.click('.setc .tb[data-t="auto"]');
  ok(await pg.$eval('.setc .tb[data-t="auto"]', el => el.classList.contains('on')), 'авто-тема выбирается');
  const before = await pg.$eval('.faq details', d => d.open);
  await pg.click('.faq details summary');
  await pg.waitForTimeout(450);
  ok((await pg.$eval('.faq details', d => d.open)) !== before, 'FAQ раскрывается');
  ok(errs.length === 0, 'нет ошибок страницы' + (errs.length ? ': ' + errs.join('; ') : ''));
  await b.close();
}

async function alertDiscord() {
  if (!process.env.DISCORD_WEBHOOK || !fails.length) return;
  await fetch(process.env.DISCORD_WEBHOOK, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: '🚨 Смоук-тест сайта упал на ' + BASE + '\n' + fails.map(f => '• ' + f).join('\n') })
  }).catch(() => {});
}

(async () => {
  try { await httpChecks(); } catch (e) { fails.push('http: ' + e.message); }
  if (process.argv.includes('--browser')) { try { await browserChecks(); } catch (e) { fails.push('browser: ' + e.message); } }
  await alertDiscord();
  if (fails.length) { console.error('SMOKE FAILED:\n' + fails.join('\n')); process.exit(1); }
  console.log('SMOKE OK');
})();
