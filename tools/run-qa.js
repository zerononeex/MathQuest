#!/usr/bin/env node
// Headless runner for tools/qa-agent.js.
//
//   node tools/run-qa.js [--game path/to/math-quest.html] [--time-scale 4]
//                        [--max-minutes 20] [--shot-every 30] [--headful]
//                        [--no-overlay] [--difficulty ADVENTURER] [--out tools]
//
// Loads the game, injects the agent after load, clicks once to unlock audio,
// starts the agent and waits for victory / agent finish / maxMinutes / a
// stalled page. Screenshots go to <out>/qa-screens/, the report to
// <out>/qa-report.md and <out>/qa-report.json. Exit code 1 if any CRITICAL.
const path = require('path');
const fs = require('fs');

let puppeteer;
try { puppeteer = require('puppeteer'); }
catch (e) { console.error('puppeteer missing: run  npm install puppeteer --prefix tools'); process.exit(2); }

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const key = k.slice(2), nxt = argv[i + 1];
    if (nxt === undefined || nxt.startsWith('--')) a[key] = true; else { a[key] = nxt; i++; }
  }
  return a;
}
const args = parseArgs(process.argv);
const GAME = path.resolve(args.game || path.join(__dirname, '..', 'math-quest.html'));
const OUT = path.resolve(args.out || __dirname);
const SCREENS = path.join(OUT, 'qa-screens');
const TIME_SCALE = +(args['time-scale'] || 4);
const MAX_MIN = +(args['max-minutes'] || 20);
const SHOT_EVERY = +(args['shot-every'] || 30);
const AGENT = path.join(__dirname, 'qa-agent.js');

function findChromium() {
  const c = [];
  if (process.env.PUPPETEER_EXECUTABLE_PATH) c.push(process.env.PUPPETEER_EXECUTABLE_PATH);
  try {
    for (const d of fs.readdirSync('/opt/pw-browsers')) {
      if (/^chromium-\d+$/.test(d)) c.push(path.join('/opt/pw-browsers', d, 'chrome-linux', 'chrome'));
    }
  } catch (e) { /* none */ }
  return c.find(p => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } }) || null;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function withTimeout(p, ms, what) {
  let t;
  return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(new Error('timeout: ' + what)), ms); })]).finally(() => clearTimeout(t));
}

(async () => {
  fs.mkdirSync(SCREENS, { recursive: true });
  for (const f of fs.readdirSync(SCREENS)) if (f.endsWith('.png')) fs.unlinkSync(path.join(SCREENS, f));

  const launch = {
    headless: args.headful ? false : true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--mute-audio',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
    protocolTimeout: 180000,
  };
  let browser;
  try { browser = await puppeteer.launch(launch); }
  catch (e) {
    const exe = findChromium();
    if (!exe) throw e;
    console.log('[run-qa] bundled Chromium unavailable, using ' + exe);
    browser = await puppeteer.launch(Object.assign({}, launch, { executablePath: exe }));
  }
  const page = await browser.newPage();
  const runner = { pageErrors: [], notes: [], stall: false };
  page.on('pageerror', e => runner.pageErrors.push(String(e && e.message || e)));
  page.on('console', m => { const t = m.text(); if (t.startsWith('[QA]') && !t.startsWith('[QA] agent:')) console.log(t); });
  await page.setViewport({ width: 1280, height: 720 });
  console.log('[run-qa] loading ' + GAME);
  await page.goto('file://' + GAME, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction('typeof atlasReady !== "undefined" && atlasReady === true', { timeout: 180000, polling: 250 });
  if (args['postgame-from']) { // skip the main game: start from a save a victory left (see qa-victory-save.json)
    const sv = JSON.parse(fs.readFileSync(args['postgame-from'], 'utf8'));
    await page.evaluate(sv => { localStorage.setItem(sv.SAVE_KEY, sv.save); if (sv.records) localStorage.setItem(sv.RECORDS_KEY, sv.records); }, sv);
    await page.reload({ waitUntil: 'load', timeout: 180000 });
    await page.waitForFunction('typeof atlasReady !== "undefined" && atlasReady === true', { timeout: 180000, polling: 250 });
  }
  await page.addScriptTag({ path: AGENT });
  // one real click to unlock WebAudio (top-right corner of the title screen: no button there)
  const box = await (await page.$('#game')).boundingBox();
  await page.mouse.click(box.x + box.width * 0.985, box.y + box.height * 0.02);
  const startRes = await page.evaluate(o => window.startQAAgent(o), {
    timeScale: TIME_SCALE, overlay: !args['no-overlay'], maxMinutes: MAX_MIN, difficulty: args.difficulty || null, postgame: !!args['postgame-from'],
  });
  console.log('[run-qa] agent: ' + startRes + ' (timeScale x' + TIME_SCALE + ', max ' + MAX_MIN + ' min)');
  // Post-game (default on, --no-postgame skips it): after the victory screen
  // press Enter like a player (the game reloads), inject the agent again and
  // let it Continue the save: dungeon re-walks, the shop, items, the Aurora
  // Sword sidequest and Mirage Keep. Its report is appended to the main one.
  const POSTGAME = !args['no-postgame'];
  const PG_MIN = +(args['postgame-minutes'] || 40);
  let run1 = null;
  const restartForPostgame = async () => {
    run1 = {
      md: await withTimeout(page.evaluate(() => window.exportQAReport()), 60000, 'md1'),
      json: await withTimeout(page.evaluate(() => window.QA_REPORT_JSON()), 60000, 'json1'),
    };
    await withTimeout(page.evaluate(() => window.stopQAAgent('victory: on to the post-game')), 30000, 'stop1');
    try { // the real save the victory left (lets --postgame-from rerun just the post-game)
      const sv = await page.evaluate(() => ({ save: localStorage.getItem(SAVE_KEY), records: localStorage.getItem(RECORDS_KEY), SAVE_KEY, RECORDS_KEY }));
      fs.writeFileSync(path.join(OUT, 'qa-victory-save.json'), JSON.stringify(sv));
    } catch (e) { runner.notes.push('could not store the victory save: ' + e.message); }
    await sleep(800);
    console.log('[run-qa] victory - pressing Enter to reload into the post-game');
    const nav = page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).then(() => true, () => false);
    await page.keyboard.press('Enter');
    if (!(await nav)) { // (after the agent's hooks the game's own location.reload() can stall headless; do the same reload from here)
      runner.notes.push('victory Enter did not navigate within 30s; reloaded the page instead');
      await page.reload({ waitUntil: 'load', timeout: 180000 });
    }
    await page.waitForFunction('typeof atlasReady !== "undefined" && atlasReady === true', { timeout: 180000, polling: 250 });
    await page.addScriptTag({ path: AGENT });
    const bx = await (await page.$('#game')).boundingBox();
    await page.mouse.click(bx.x + bx.width * 0.985, bx.y + bx.height * 0.02);
    const r = await page.evaluate(o => window.startQAAgent(o), { timeScale: TIME_SCALE, overlay: !args['no-overlay'], maxMinutes: PG_MIN, postgame: true });
    console.log('[run-qa] post-game agent: ' + r + ' (max ' + PG_MIN + ' min)');
  };

  const t0 = Date.now();
  let lastShot = 0, shotN = 0, lastCrit = 0, lastJson = null, lastJsonAt = 0, fails = 0, lastLog = 0;
  const shoot = async (tag) => {
    if (shotN >= 250) return;
    const name = String(++shotN).padStart(4, '0') + '-' + tag.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 40) + '.png';
    try { await withTimeout(page.screenshot({ path: path.join(SCREENS, name) }), 30000, 'screenshot'); } catch (e) { runner.notes.push('screenshot failed: ' + e.message); }
  };
  for (;;) {
    await sleep(2000);
    let st;
    try { st = await withTimeout(page.evaluate(() => window.__QA_STATUS()), 20000, 'status'); fails = 0; }
    catch (e) {
      fails++;
      runner.notes.push('status poll failed: ' + e.message);
      if (fails >= 3) { runner.stall = true; console.log('[run-qa] page unresponsive - fatal stall'); break; }
      continue;
    }
    const el = (Date.now() - t0) / 1000;
    if (el - lastLog >= 20) {
      lastLog = el;
      console.log(`[run-qa] wall ${el.toFixed(0)}s game ${st.gameS}s ${st.state} [${st.phase}] ${st.goal || ''} | ${st.where.map} gold ${st.where.gold} lv ${st.where.level} medals ${st.medallions} | C${st.crit} W${st.warn} | frame ${st.frameMs}ms`);
    }
    if (el - lastShot >= SHOT_EVERY) { lastShot = el; await shoot(`t${Math.round(st.gameS)}s-${st.state}`); }
    if (st.crit > lastCrit) { lastCrit = st.crit; await shoot(`crit${st.crit}-${st.state}`); }
    if (el - lastJsonAt > 30) { try { lastJson = await withTimeout(page.evaluate(() => window.QA_REPORT_JSON()), 30000, 'json'); lastJsonAt = el; } catch (e) { /* keep last */ } }
    if (st.done && st.victory && POSTGAME && !run1) {
      await shoot('victory');
      try { await restartForPostgame(); lastCrit = 0; continue; }
      catch (e) { runner.notes.push('post-game restart failed: ' + e.message); console.log('[run-qa] post-game restart failed: ' + e.message); break; }
    }
    if (st.done) { console.log('[run-qa] agent done: ' + st.doneReason); break; }
    if (el > (MAX_MIN + (run1 ? PG_MIN : 0)) * 60 + 30) { console.log('[run-qa] wall-clock limit reached'); break; }
  }
  let md = null, json = null;
  if (!runner.stall) {
    try {
      await shoot('final');
      await withTimeout(page.evaluate(() => window.stopQAAgent('runner finished')), 30000, 'stop');
      md = await withTimeout(page.evaluate(() => window.exportQAReport()), 60000, 'md');
      json = await withTimeout(page.evaluate(() => window.QA_REPORT_JSON()), 60000, 'json');
    } catch (e) { runner.notes.push('final report fetch failed: ' + e.message); }
  }
  if (!json) json = lastJson || { bugs: [], summary: { critical: 0 } };
  if (run1) {
    // one more reload: everything the post-game did must still be in the save (read only)
    let persist = null;
    try {
      await page.reload({ waitUntil: 'load', timeout: 180000 });
      await page.waitForFunction('typeof atlasReady !== "undefined" && atlasReady === true', { timeout: 180000, polling: 250 });
      persist = await page.evaluate(() => {
        const d = loadSaveData(); applySaveData(d);
        return { parts: sqPartCount(), fairyDone: sq.fairyDone, sword: equippedSwordKind(), attack: player.attack, maxHearts: player.maxHearts,
          secretHeart: player.secretHeartTaken, heartPiecesLeft: heartPieces.filter(h => !h.dungeonId).length, records: mirageRecords(),
          chests: dungeons.every(x => x.chestOpened), bosses: dungeons.every(x => x.bossDefeated), castle: castle.defeated, mirageOpen: mirageGate.open,
          owned: Object.assign({}, player.owned), tunic: player.skin, hcb: player.heartContainersBought };
      });
    } catch (e) { runner.notes.push('persistence check failed: ' + e.message); }
    const pgBugs = (json.bugs || []).map(b => Object.assign({}, b, { id: 'PG-' + b.id, message: '[post-game] ' + b.message }));
    const pj = json;
    json = run1.json;
    json.bugs = (json.bugs || []).concat(pgBugs);
    json.postgame = { summary: pj.summary, milestones: pj.milestones, persist };
    const bad = [];
    if (!persist) bad.push('no persistence snapshot');
    else {
      if (!/all phases complete/.test(pj.doneReason || '')) bad.push('the post-game run did not finish (' + (pj.doneReason || 'still running') + ', last phase: ' + pj.phase + ')');
      if (persist.fairyDone && persist.sword !== 'auroraSword') bad.push('Aurora Sword not equipped after reload');
      if (persist.secretHeart && persist.heartPiecesLeft) bad.push('secret heart piece respawned after reload');
      if (!persist.chests || !persist.bosses || !persist.castle || !persist.mirageOpen) bad.push('dungeon/castle progress lost after reload');
    }
    // bestiary across both runs
    const kb = Object.assign({}, (run1.json.stats || {}).killsByType);
    for (const [k, n] of Object.entries((pj.stats || {}).killsByType || {})) kb[k] = (kb[k] || 0) + n;
    const ROSTER = ['slime', 'bat', 'wolf', 'fireImp', 'octorok', 'wraith', 'thornling', 'grimshade', 'ironclamp', 'beetle', 'spitter', 'wisp', 'mole',
      'grovak', 'cindermaw', 'voltuga', 'puffling', 'malrek', 'rubblejaw', 'flarewing', 'squallback', 'astral'];
    const missing = ROSTER.filter(k => !kb[k]);
    json.bestiary = { killsByType: kb, missing };
    if (missing.length) json.bugs.push({ id: 'BESTIARY-1', severity: 'WARNING', category: 'coverage', message: 'Enemy types never defeated in the playthrough: ' + missing.join(', '), count: 1 });
    if (bad.length) json.bugs.push({ id: 'PERSIST-1', severity: 'CRITICAL', category: 'save', message: 'After the post-game reload: ' + bad.join('; '), count: 1 });
    md = run1.md + '\n\n---\n\n# Post-game run (Continue after the victory)\n\n' + (md || '(no post-game report)') +
      '\n\n## Bestiary (both runs)\n\n' + ROSTER.map(k => '- ' + k + ': ' + (kb[k] || '**0**')).join('\n') +
      '\n\n## Persistence after a final reload\n\n```\n' + JSON.stringify(persist, null, 1) + '\n```\n' + (bad.length ? '\n**CRITICAL:** ' + bad.join('; ') + '\n' : '');
  }
  if (runner.stall) {
    json.bugs = json.bugs || [];
    json.bugs.unshift({ id: 'RUNNER-1', severity: 'CRITICAL', category: 'loop', message: 'Page became unresponsive (3 consecutive status polls timed out) - main thread hung', count: 1 });
    json.summary.critical = (json.summary.critical || 0) + 1;
  }
  json.runner = { game: GAME, timeScale: TIME_SCALE, maxMinutes: MAX_MIN, wallSeconds: +((Date.now() - t0) / 1000).toFixed(1), screenshots: shotN, pageErrors: runner.pageErrors.slice(0, 50), notes: runner.notes.slice(-50) };
  if (!md) md = '# Math Quest - autonomous QA report\n\n(report generated by the runner from the last snapshot; the page stopped responding)\n\n```\n' + JSON.stringify(json.bugs, null, 1).slice(0, 20000) + '\n```\n';
  md += '\n## Runner\n\n- Game file: `' + path.relative(process.cwd(), GAME) + '`\n- Wall time ' + json.runner.wallSeconds + 's, timeScale x' + TIME_SCALE + ', ' + shotN + ' screenshots in `' + path.relative(process.cwd(), SCREENS) + '/`\n' +
    '- Page errors seen by puppeteer: ' + (runner.pageErrors.length ? '\n' + runner.pageErrors.slice(0, 20).map(e => '  - ' + e).join('\n') : 'none') + '\n' +
    (runner.notes.length ? '- Runner notes:\n' + runner.notes.slice(-20).map(n => '  - ' + n).join('\n') + '\n' : '');
  fs.writeFileSync(path.join(OUT, 'qa-report.md'), md);
  fs.writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify(json, null, 1));
  const crit = (json.bugs || []).filter(b => b.severity === 'CRITICAL').length;
  const warn = (json.bugs || []).filter(b => b.severity === 'WARNING').length;
  console.log(`[run-qa] wrote ${path.join(OUT, 'qa-report.md')} - ${crit} CRITICAL, ${warn} WARNING, victory=${!!json.victory}`);
  await browser.close();
  process.exit(crit > 0 ? 1 : 0);
})().catch(e => { console.error('[run-qa] fatal:', e); process.exit(3); });
