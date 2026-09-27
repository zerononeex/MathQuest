#!/usr/bin/env node
// QA/QC audit checks that a playthrough can't show on its own. The playthrough
// itself (tools/run-qa.js + tools/qa-agent.js, main game + post-game) is the
// cheat-free part; this script only reads the game or measures it in
// throwaway pages:
//   1. math-gate inventory: every openMathLock() call site, by what it guards
//   2. difficulty scaling: Little Hero vs Adventurer vs Legend, measured
//      through the engine's own boss AI / shield / damage functions
//   3. door geometry: close-ups of every dungeon door kind + a seam check
//   4. AP economy: from the last qa-report.json (math per minute, hits per AP)
// Writes tools/audit-report.md and tools/audit-screens/*.png.
// Exit code 1 if any check FAILs.
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const GAME = path.join(__dirname, '..', 'math-quest.html');
const OUT = path.join(__dirname, 'audit-screens');
const results = [];
const md = ['# Math Quest - QA/QC audit checks', ''];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log((ok ? 'PASS' : 'FAIL') + ' - ' + name + (detail ? ' (' + detail + ')' : ''));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f));
  const src = fs.readFileSync(GAME, 'utf8');

  // --- 1. math gates: only major progression locks ---
  {
    const lines = src.split('\n'), sites = [];
    lines.forEach((l, i) => {
      if (!/openMathLock\(/.test(l) || /function openMathLock/.test(l)) return;
      const t = (l.match(/openMathLock\((['"])(.*?)\1/) || [])[2] || '?';
      let fn = '?';
      for (let j = i; j >= 0; j--) { const m = lines[j].match(/^function (\w+)/); if (m) { fn = m[1]; break; } }
      sites.push({ line: i + 1, title: t, fn });
    });
    const ALLOWED = { 'Lower the Bridge!': 'bridge lever', 'Unlock the Treasure!': 'big treasure chest', 'Break the Seal!': 'dungeon boss door seal', "Break Malrek's Seal!": 'castle boss door seal' };
    const bad = sites.filter(s => !ALLOWED[s.title]);
    md.push('## 1. Math gates', '', '| line | function | title | guards |', '|---|---|---|---|');
    for (const s of sites) md.push('| ' + s.line + ' | `' + s.fn + '` | ' + s.title + ' | ' + (ALLOWED[s.title] || '**NOT A MAJOR LOCK**') + ' |');
    md.push('');
    check('Math gates only on major progression locks (bridge levers, big chests, boss seals)', !bad.length && sites.length > 0,
      sites.length + ' call sites' + (bad.length ? '; unexpected: ' + bad.map(b => b.title + '@' + b.line).join(', ') : ''));
  }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const newPage = async (w, h) => {
    const p = await browser.newPage();
    p.on('pageerror', e => console.log('pageerror: ' + e.message));
    await p.setViewport({ width: w || 1280, height: h || 720 });
    await p.goto('file://' + GAME, { waitUntil: 'load' });
    await p.waitForFunction('typeof atlasReady !== "undefined" && atlasReady === true', { timeout: 120000, polling: 200 });
    return p;
  };

  // --- 2. difficulty scaling (measured) ---
  {
    const p = await newPage();
    const m = await p.evaluate(() => {
      const out = {};
      localStorage.removeItem(SAVE_KEY); startNewGame(); dialogue.active = false;
      const TS = CONFIG.TILE;
      for (const diff of ['LITTLE_HERO', 'ADVENTURER', 'LEGEND']) {
        CONFIG.DIFFICULTY = diff;
        const r = {};
        // boss wind-ups: run the real boss AI for 40s of game time with the hero standing off
        const winds = [];
        for (const kind of ['grovak', 'voltuga', 'puffling']) {
          const b = makeRushBoss(kind, 12 * TS, 6 * TS), room = mirage.rooms[2].map;
          let st = null, t0 = 0, t = 0;
          for (let i = 0; i < 2400; i++) {
            hero.x = b.x - 70; hero.y = b.y; player.hearts = player.maxHearts; player.downed = false;
            updateBossAI(b, 1 / 60, room, { roomIndex: 0, enemies: [[b]] });
            t += 1 / 60;
            if (b.bs.st !== st) { if (st === 'wind') winds.push(t - t0); st = b.bs.st; t0 = t; }
          }
        }
        r.bossWindAvg = +(winds.reduce((a, b) => a + b, 0) / Math.max(1, winds.length)).toFixed(2);
        r.bossHitDamage = bossDmg({ bossKind: 'voltuga' });
        // Cindermaw's rear-up telegraph
        const c = makeRushBoss('cindermaw', 10 * TS, 6 * TS);
        c.cmT = 0; updateCindermaw(c, 1 / 60); r.cindermawRear = +c.cmT.toFixed(2);
        // the Bulwark Beetle's shield: a blow 40 degrees off its front
        const e = { x: 100, y: 100, faceAng: 0 };
        r.beetleBlocks40deg = beetleFrontal(e, 100 + Math.cos(0.7) * 20, 100 + Math.sin(0.7) * 20);
        r.beetleBlocksFront = beetleFrontal(e, 120, 100);
        // Malrek
        const g = makeGanon(10 * TS, 6 * TS); malrekScale(g);
        r.malrekHp = g.maxHp; r.malrekHit = g.dmg; r.malrekTempo = +g.tempo.toFixed(2);
        r.apPerCorrect = tierAPReward();
        out[diff] = r;
      }
      return out;
    });
    const LH = m.LITTLE_HERO, AD = m.ADVENTURER, LG = m.LEGEND;
    md.push('## 2. Difficulty scaling (measured with the game\'s own functions)', '', '```', JSON.stringify(m, null, 1), '```', '');
    check('Little Hero: softer boss wind-ups (longer telegraphs) than Adventurer', LH.bossWindAvg >= AD.bossWindAvg * 1.3, LH.bossWindAvg + 's vs ' + AD.bossWindAvg + 's');
    check('Little Hero: Cindermaw rears up longer', LH.cindermawRear > AD.cindermawRear, LH.cindermawRear + 's vs ' + AD.cindermawRear + 's');
    check('Little Hero: shield blocks only dead-front hits (a 40deg blow lands); Adventurer blocks it', !LH.beetleBlocks40deg && AD.beetleBlocks40deg && LH.beetleBlocksFront, JSON.stringify({ LH: LH.beetleBlocks40deg, AD: AD.beetleBlocks40deg }));
    check('Little Hero: bosses hit for 1, Malrek slower and weaker', LH.bossHitDamage <= AD.bossHitDamage && LH.malrekHit <= AD.malrekHit && LH.malrekTempo < AD.malrekTempo && LH.malrekHp < AD.malrekHp, JSON.stringify({ LH: [LH.bossHitDamage, LH.malrekHit, LH.malrekTempo, LH.malrekHp], AD: [AD.bossHitDamage, AD.malrekHit, AD.malrekTempo, AD.malrekHp] }));
    check('Harder tiers unchanged by the Little Hero rules (Legend = Adventurer telegraphs)', Math.abs(LG.bossWindAvg - AD.bossWindAvg) < 0.15 && LG.beetleBlocks40deg, LG.bossWindAvg + 's vs ' + AD.bossWindAvg + 's');
    await p.close();
  }

  // --- 3. door geometry: every door kind in every dungeon ---
  {
    const p = await newPage(1280, 720);
    await p.evaluate(() => { localStorage.removeItem(SAVE_KEY); startNewGame(); dialogue.active = false; player.invincibleT = 1e9; });
    const shots = [];
    const ids = await p.evaluate(() => dungeons.map(d => d.def.id));
    for (let di = 0; di < ids.length; di++) {
      // room 0 (west arch in, locked east door), a plain arch, the boss room (boss door)
      const rooms = await p.evaluate(i => { const d = dungeons[i]; return [0, 1, d.BOSS]; }, di);
      for (const ri of rooms) {
        const info = await p.evaluate((i, ri) => {
          const d = dungeons[i], TS = CONFIG.TILE;
          world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = ri;
          const m = d.rooms[ri], midY = Math.floor(m.h / 2);
          for (const e of d.enemies[ri] || []) e.alive = false; // (a still picture: no one walking in front of the doors)
          hero.x = m.w / 2 * TS; hero.y = (m.h - 2) * TS;
          const tn = t => Object.keys(T).find(k => T[k] === t);
          return { w: m.w, h: m.h, midY, west: tn(m.grid[midY][0]), east: tn(m.grid[midY][m.w - 1]), eastAbove: tn(m.grid[midY - 1][m.w - 1]) };
        }, di, ri);
        await new Promise(r => setTimeout(r, 250));
        const geo = await p.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { x: c.left, y: c.top, w: c.width, h: c.height, camX: world.camX, camY: world.camY, GW: CONFIG.GAME_W, GH: CONFIG.GAME_H, TS: CONFIG.TILE }; });
        const k = geo.w / geo.GW;
        for (const side of ['west', 'east']) {
          const kind = info[side];
          if (!/FLOOR|LOCKDOOR|BOSSDOOR/.test(kind)) continue;
          const tx = side === 'west' ? 0 : info.w - 1;
          const x0 = geo.x + ((tx - 1.5) * geo.TS - geo.camX) * k, y0 = geo.y + ((info.midY - 2.5) * geo.TS - geo.camY) * k;
          const clip = { x: Math.max(geo.x, x0), y: Math.max(geo.y, y0), width: 4 * geo.TS * k, height: 5 * geo.TS * k };
          const name = ids[di] + '-room' + ri + '-' + side + '-' + kind.toLowerCase() + '.png';
          await p.screenshot({ path: path.join(OUT, name), clip });
          // seam check: in the door's own tile column, look for a 1px fully black column
          // running the door's height (a gap between the door art and the wall)
          const seam = await p.evaluate((tx, midY) => {
            const c = document.getElementById('game'), g = c.getContext('2d'), s = c.width / CONFIG.GAME_W, TS = CONFIG.TILE;
            const sx = Math.round((tx * TS - world.camX) * s), sy = Math.round(((midY - 1) * TS - world.camY) * s), w = Math.round(TS * s), h = Math.round(2 * TS * s);
            const px = g.getImageData(Math.max(0, sx - 2), Math.max(0, sy), w + 4, h).data, W = w + 4;
            let worst = 0;
            for (let x = 0; x < W; x++) {
              let blk = 0;
              for (let y = 0; y < h; y++) { const i = (y * W + x) * 4; if (px[i] + px[i + 1] + px[i + 2] < 24) blk++; }
              worst = Math.max(worst, blk / h);
            }
            return +worst.toFixed(2);
          }, tx, info.midY);
          shots.push({ dungeon: ids[di], room: ri, side, kind, seam, file: name });
        }
      }
    }
    md.push('## 3. Door geometry', '', 'Close-ups in `tools/audit-screens/`. "seam" is the largest share of fully black pixels in any single pixel column across the door tile (1.0 would be a black line the full door height).', '', '| dungeon | room | side | tile | seam | file |', '|---|---|---|---|---|---|');
    for (const s of shots) md.push('| ' + [s.dungeon, s.room, s.side, s.kind, s.seam, s.file].join(' | ') + ' |');
    md.push('');
    const seams = shots.filter(s => s.seam >= 0.9);
    check('Dungeon doors: no full-height black seam at any door (' + shots.length + ' doors across ' + ids.length + ' dungeons)', !seams.length, seams.map(s => s.file + ' ' + s.seam).join(', '));
    await p.close();
  }

  // --- 4. AP economy from the last playthrough ---
  {
    let j = null;
    try { j = JSON.parse(fs.readFileSync(path.join(__dirname, 'qa-report.json'), 'utf8')); } catch (e) {}
    if (j && j.stats) {
      const st = j.stats, mins = (j.gameSeconds || 0) / 60;
      const r = { gameMinutes: +mins.toFixed(1), mathSolved: st.mathSolved, mathPerMinute: +(st.mathSolved / Math.max(1, mins)).toFixed(2), swings: st.swings, ranged: st.rangedShots, kills: st.kills, swingsPerQuestion: +((st.swings + st.rangedShots) / Math.max(1, st.mathSolved)).toFixed(2) };
      md.push('## 4. AP economy (last playthrough)', '', '```', JSON.stringify(r, null, 1), '```', '');
      check('AP economy: at least 2 attacks per math question, under 3 questions per game minute', r.swingsPerQuestion >= 2 && r.mathPerMinute < 3, JSON.stringify(r));
    } else md.push('## 4. AP economy', '', '(no qa-report.json with stats yet)', '');
  }

  await browser.close();
  const fails = results.filter(r => !r.ok);
  md.splice(2, 0, '**' + (results.length - fails.length) + '/' + results.length + ' checks pass**', '', ...results.map(r => '- ' + (r.ok ? 'PASS' : '**FAIL**') + ' - ' + r.name + (r.detail ? ' (' + r.detail + ')' : '')), '');
  fs.writeFileSync(path.join(__dirname, 'audit-report.md'), md.join('\n') + '\n');
  console.log('\n' + (results.length - fails.length) + '/' + results.length + ' audit checks pass; wrote tools/audit-report.md');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('audit fatal:', e); process.exit(3); });
