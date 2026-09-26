// Loads math-quest.html in headless Chromium, captures console errors,
// simulates title->difficulty->gameplay, and saves screenshots.
//
// Besides full-page shots, it saves exact 640x360 canvas captures
// (canvas-*.png) for art/animation review: overworld town with buildings,
// forest trees, hero walking in all 4 directions (two frames apart each),
// a sword swing mid-animation, enemies up close and a dungeon room.
const path = require('path');
const fs = require('fs');
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (e) {
  console.error('SKIP: puppeteer not installed, cannot run headless check');
  process.exit(0);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const shotDir = path.join(__dirname, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push('Uncaught: ' + err.message));

  // exact canvas pixels (no CSS scaling) for close inspection
  async function canvasShot(name) {
    const url = await page.evaluate(() => document.getElementById('game').toDataURL('image/png'));
    fs.writeFileSync(path.join(shotDir, 'canvas-' + name + '.png'), Buffer.from(url.split(',')[1], 'base64'));
  }
  // crop of the canvas in GAME coordinates (the backing store is
  // RENDER_SCALE x larger, so the crop keeps the full hi-res detail)
  async function canvasCrop(name, x, y, w, h) {
    const url = await page.evaluate((x, y, w, h) => {
      const src = document.getElementById('game'), s = src.width / CONFIG.GAME_W;
      const c = document.createElement('canvas'); c.width = w * s; c.height = h * s;
      c.getContext('2d').drawImage(src, x * s, y * s, w * s, h * s, 0, 0, w * s, h * s);
      return c.toDataURL('image/png');
    }, x, y, w, h);
    fs.writeFileSync(path.join(shotDir, 'canvas-' + name + '.png'), Buffer.from(url.split(',')[1], 'base64'));
  }
  const SHOP_ITEMS_COUNT_GUESS = 20; // more presses than items; selection clamps at the last row

  const file = 'file://' + path.join(__dirname, '..', 'math-quest.html');
  await page.goto(file, { waitUntil: 'load', timeout: 30000 });
  await sleep(700);
  await page.screenshot({ path: path.join(shotDir, '01-title.png') });
  await canvasShot('01-title');
  // title layout: the 4 difficulty buttons + frame must end above the help
  // text, and tapping each drawn button selects it (tap rects == drawn rects)
  {
    const lay = await page.evaluate(() => {
      const P = getDifficultyPanel(), btns = getDifficultyButtons();
      const r = document.getElementById('game').getBoundingClientRect();
      return { panelBottom: P.y + P.h, lastBtnBottom: btns[3].y + btns[3].h, helpTop: CONFIG.GAME_H - 38,
        pts: btns.map(b => ({ name: b.name, x: r.left + (b.x + b.w / 2) * r.width / CONFIG.GAME_W, y: r.top + (b.y + b.h / 2) * r.height / CONFIG.GAME_H })) };
    });
    const picked = [];
    for (const p of lay.pts) { await page.mouse.click(p.x, p.y); await sleep(60); picked.push(await page.evaluate(() => CONFIG.DIFFICULTY)); }
    await page.mouse.click(lay.pts[1].x, lay.pts[1].y); await sleep(60); // back to Adventurer
    const ok = lay.panelBottom <= lay.helpTop && lay.lastBtnBottom < lay.panelBottom && picked.join() === lay.pts.map(p => p.name).join();
    console.log((ok ? 'OK' : 'FAIL') + ': title layout ' + JSON.stringify({ panelBottom: lay.panelBottom, helpTop: lay.helpTop, picked }));
    if (!ok) errors.push('title layout check failed');
  }

  // Click start / difficulty pick via a tap in the middle-ish (Adventurer button area)
  // Try keyboard path first: Enter to start with default difficulty.
  await page.keyboard.press('Enter');
  await sleep(300);
  await page.screenshot({ path: path.join(shotDir, '02-after-start.png') });

  // Move hero with arrow keys for a few frames to exercise gameplay loop.
  await page.keyboard.down('ArrowRight');
  await sleep(600);
  await page.keyboard.up('ArrowRight');
  await sleep(500);
  await page.screenshot({ path: path.join(shotDir, '03-gameplay-3s.png') });
  await canvasShot('03-gameplay');

  await sleep(2500);
  await page.screenshot({ path: path.join(shotDir, '04-gameplay-later.png') });

  // Open the quiz/question modal directly so we can verify its layout.
  await page.evaluate(() => { if (typeof openMathPopup === 'function') openMathPopup('ap'); });
  await sleep(300);
  await page.screenshot({ path: path.join(shotDir, '05-quiz-modal.png') });
  await page.evaluate(() => { if (typeof closeMathPopup === 'function') closeMathPopup(); });
  await sleep(100);

  // --- art/animation review captures (test harness only: teleports hero) ---
  const hasGame = await page.evaluate(() => typeof hero === 'object' && typeof buildings === 'object');
  if (hasGame) {
    // town: stand just south of the house/shop row so both buildings show
    await page.evaluate(() => {
      const b = buildings[0];
      hero.x = (b.doorTileX + 6) * CONFIG.TILE; hero.y = (b.doorTileY + 3) * CONFIG.TILE;
      player.invincibleT = 0;
    });
    await sleep(900);
    await canvasShot('06-town-buildings');

    // hero walking in each direction: two captures a few frames apart
    for (const [key, name] of [['ArrowDown', 'down'], ['ArrowUp', 'up'], ['ArrowLeft', 'left'], ['ArrowRight', 'right']]) {
      await page.evaluate(() => {
        hero.x = (overworld.w / 2 + 4) * CONFIG.TILE; hero.y = (overworld.h / 2 + 4) * CONFIG.TILE;
        hero.walkTargetX = null; hero.walkTargetY = null;
      });
      await sleep(250);
      await page.evaluate(() => { player.invincibleT = 0; });
      await page.keyboard.down(key);
      await sleep(200);
      const frames = [];
      for (const tag of ['a', 'b', 'c', 'd']) {
        frames.push(await page.evaluate(() => heroWalkFrame()));
        await canvasShot('07-walk-' + name + '-' + tag);
        await sleep(55);
      }
      await page.keyboard.up(key);
      await sleep(60);
      const fi = await page.evaluate(() => heroWalkFrame());
      console.log('walk ' + name + ': frames a-d=' + frames.join(',') + ' after release=' + fi);
      await sleep(80);
    }

    // sword swing mid-animation (Space swings the active slot's sword)
    await page.evaluate(() => { player.ap = Math.max(player.ap, 3); player.attackCooldown = 0; hero.facing = 'right'; });
    await page.keyboard.down(' ');
    await sleep(70);
    await canvasShot('08-sword-swing-mid');
    await page.keyboard.up(' ');
    await sleep(120);
    await canvasShot('08-sword-swing-late');

    // enemies up close: stand near the town-edge slime/bat spawns
    await page.evaluate(() => {
      const e = overworldEnemies.find(q => q.type === 'slime' && q.alive);
      if (e) { hero.x = e.x - 40; hero.y = e.y; }
      player.invincibleT = 5;
    });
    await sleep(700);
    await canvasShot('09-enemies');

    // enemy idle/hop animation: 4 frames ~70ms apart (slime squash/stretch, bat flap)
    for (const tag of ['a', 'b', 'c', 'd']) { await canvasShot('18-enemy-anim-' + tag); await sleep(70); }

    // boomerang spin, then a fire arrow (charge -> projectile)
    await page.evaluate(() => { player.ap = 9; player.attackCooldown = 0; hero.facing = 'right'; throwBoomerang(); });
    await sleep(120);
    await canvasShot('19-boomerang');
    await sleep(900);
    await page.evaluate(() => { player.ap = 9; player.attackCooldown = 0; player.owned.bow = true; player.arrowType = 'fire'; hero.facing = 'right'; fireArrow(); });
    await sleep(40);
    await canvasShot('20-fire-arrow-charge');
    await sleep(120);
    await canvasShot('20-fire-arrow-flight');
    await page.evaluate(() => { player.arrowType = 'normal'; });

    // hit feedback: white flash + knockback, then the death poof
    await page.evaluate(() => {
      const e = overworldEnemies.find(q => q.type === 'slime' && q.alive);
      if (e) { e.hp = 2; damageEnemy(e, 'sword'); window.__testSlime = e; }
    });
    await sleep(20);
    await canvasShot('13-hit-flash');
    await page.evaluate(() => { const e = window.__testSlime; if (e && e.alive) { e.hp = 0.5; damageEnemy(e, 'sword'); } });
    await sleep(90);
    await canvasShot('14-death-poof');
    // pot smash shards
    await page.evaluate(() => {
      const p = overworldPots.find(q => q.alive);
      if (p) { hero.x = p.x - 30; hero.y = p.y; smashPot(p); }
    });
    await sleep(120);
    await canvasShot('14b-pot-shards');

    // forest: stand directly north of (behind) a tree so its canopy should
    // be drawn over the hero (y-sorting)
    const spot = await page.evaluate(() => {
      const cx = overworld.w / 2, cy = overworld.h / 2;
      let best = null;
      for (let ty = 4; ty < overworld.h - 4; ty++) for (let tx = 4; tx < overworld.w - 4; tx++) {
        if (regionAt(tx, ty) !== 'forest' || overworld.grid[ty][tx] !== T.TREE) continue;
        if (overworld.grid[ty - 1][tx] !== T.GRASS) continue;
        const d = Math.hypot(tx - cx, ty - cy);
        if (!best || d < best.d) best = { tx, ty, d };
      }
      if (best) { hero.x = (best.tx + 0.5) * CONFIG.TILE; hero.y = (best.ty - 0.5) * CONFIG.TILE; hero.facing = 'down'; }
      player.invincibleT = 0;
      return best;
    });
    console.log('forest capture spot:', JSON.stringify(spot));
    await sleep(900);
    await canvasShot('10-forest-behind-tree');

    // one capture per outer region (terrain tiles/edges/props)
    for (const r of ['lakes', 'desert', 'mountain', 'darkness']) {
      await page.evaluate((rn) => {
        const a = regionAnchor(rn, Math.min(overworld.w, overworld.h) / 2 - 14);
        hero.x = (a.x + 0.5) * CONFIG.TILE; hero.y = (a.y + 0.5) * CONFIG.TILE; player.invincibleT = 0;
      }, r);
      await sleep(700);
      await canvasShot('12-region-' + r);
    }

    // dungeon room (entrance of the forest dungeon)
    await page.evaluate(() => { enterDungeon(dungeons[0]); });
    await sleep(1400);
    await page.evaluate(() => { player.invincibleT = 0; });
    await sleep(50);
    await canvasShot('11-dungeon-room');
    await page.screenshot({ path: path.join(shotDir, '11-dungeon-room.png') });

    // boss room (Grovak) and the castle final boss (Malrek art)
    await page.evaluate(() => {
      const d = world.dungeon; d.roomIndex = 2;
      hero.x = 4 * CONFIG.TILE; hero.y = 5 * CONFIG.TILE; player.invincibleT = 0;
    });
    await sleep(600);
    await canvasShot('15-boss-room');
    await page.evaluate(() => {
      world.mode = 'castle'; world.dungeon = null; castle.roomIndex = 1;
      if (!castle.ganon) { castle.ganon = makeGanon((castle.rooms[1].map.w - 5) * CONFIG.TILE, Math.floor(castle.rooms[1].map.h / 2) * CONFIG.TILE); castle.rooms[1].enemies = [castle.ganon]; }
      hero.x = 4 * CONFIG.TILE; hero.y = 7 * CONFIG.TILE; player.invincibleT = 0;
    });
    await sleep(500);
    await canvasShot('16-castle-final-boss');
    // house interior
    await page.evaluate(() => {
      world.mode = 'interior'; world.interior = buildings[0].interior;
      hero.x = 5 * CONFIG.TILE; hero.y = 4 * CONFIG.TILE; player.invincibleT = 0;
    });
    await sleep(500);
    await canvasShot('17-interior');

    // HUD close-up (top-left panel), cropped from the hi-res canvas
    await canvasCrop('24-hud-closeup', 0, 0, 232, 96);

    // shop: open, then scroll to the bottom three ways (wheel, drag, keys)
    // and check a tap after scrolling buys the row under the finger
    await page.evaluate(() => {
      world.mode = 'interior'; world.interior = buildings[1].interior;
      hero.x = 5 * CONFIG.TILE; hero.y = 5 * CONFIG.TILE; hud.gold = 45;
      openShop();
    });
    await sleep(150);
    await canvasShot('21-shop-top');
    const toClient = async (gx, gy) => page.evaluate((x, y) => {
      const r = document.getElementById('game').getBoundingClientRect();
      return { x: r.left + x * r.width / CONFIG.GAME_W, y: r.top + y * r.height / CONFIG.GAME_H };
    }, gx, gy);
    const mid = await toClient(300, 200);
    await page.mouse.move(mid.x, mid.y);
    await page.mouse.wheel({ deltaY: 120 });
    await sleep(100);
    const afterWheel = await page.evaluate(() => shop.scroll);
    // drag the list up by ~100 game px: should scroll, and must NOT buy
    const goldBeforeDrag = await page.evaluate(() => hud.gold);
    await page.evaluate(() => { shop.scroll = 0; });
    const a = await toClient(300, 280), b = await toClient(300, 180);
    await page.mouse.move(a.x, a.y); await page.mouse.down(); await sleep(50);
    for (let i = 1; i <= 5; i++) { await page.mouse.move(a.x, a.y + (b.y - a.y) * i / 5); await sleep(30); }
    await page.mouse.up(); await sleep(80);
    const drag = await page.evaluate(() => ({ scroll: shop.scroll, gold: hud.gold }));
    // keyboard: ArrowDown to the last item auto-scrolls to the bottom
    for (let i = 0; i < SHOP_ITEMS_COUNT_GUESS; i++) { await page.keyboard.press('ArrowDown', { delay: 40 }); await sleep(20); }
    await sleep(100);
    const bottom = await page.evaluate(() => ({ scroll: shop.scroll, max: shopMaxScroll(), sel: shop.sel, n: SHOP_ITEMS.length }));
    await canvasShot('22-shop-scrolled-bottom');
    // tap the "Red Tunic" row where it now sits on screen (scrolled) -> buys it
    const tapInfo = await page.evaluate(() => {
      const row = getShopRows().find(r => r.item.id === 'skinRed');
      return { y: row.rect.y + row.rect.h / 2, visible: row.visible };
    });
    const tp = await toClient(200, tapInfo.y);
    await page.mouse.click(tp.x, tp.y); await sleep(80);
    const bought = await page.evaluate(() => ({ red: !!player.unlockedSkins.red, gold: hud.gold, allReachable: getShopRows().every(r => r.rect.y + r.rect.h <= SHOP_LAYOUT.y + SHOP_LAYOUT.h + shopMaxScroll() + 1) }));
    const shopOk = afterWheel > 0 && drag.scroll > 60 && drag.gold === goldBeforeDrag &&
      bottom.scroll === bottom.max && bottom.sel === bottom.n - 1 && tapInfo.visible && bought.red && bought.gold === 25;
    console.log((shopOk ? 'OK' : 'FAIL') + ': shop scroll ' + JSON.stringify({ afterWheel, drag, bottom, tapInfo, bought }));
    if (!shopOk) errors.push('shop scroll check failed');
    await page.evaluate(() => { closeShop(); player.skin = 'classic'; });

    // boss key: kill the Shadow Dungeon boss (Puffling) through the normal
    // damage path, let the room update run, then show the opened boss door
    // and the Boss Key in the HUD
    const boss = await page.evaluate(() => {
      const d = dungeons.find(x => x.def.id === 'shadow');
      world.mode = 'dungeon'; world.dungeon = d; world.interior = null; d.roomIndex = 2;
      d.hasSmallKey = true;
      const e = d.enemies[2][0];
      hero.x = 3 * CONFIG.TILE; hero.y = 3 * CONFIG.TILE; player.invincibleT = 999;
      let guard = 0;
      while (e.alive && guard++ < 200) damageEnemy(e, 'heroSword');
      // the boss XP may trigger the (blocking) level-up choice; pick one
      if (player.levelUpChoicePending) applyLevelUpChoice(0);
      return { kind: e.bossKind };
    });
    await sleep(300);
    await page.evaluate(() => { // walk up to the boss door so it opens
      const d = world.dungeon, r = d.rooms[2];
      hero.x = (r.w - 2) * CONFIG.TILE; hero.y = (Math.floor(r.h / 2) + 0.5) * CONFIG.TILE;
    });
    await sleep(400);
    const bossState = await page.evaluate(() => {
      const d = world.dungeon, r = d.rooms[2];
      return { bossDefeated: d.bossDefeated, hasBossKey: d.hasBossKey, roomIndex: d.roomIndex,
        doorOpen: r.grid[Math.floor(r.h / 2)][r.w - 1] === T.FLOOR };
    });
    await canvasShot('23-post-boss-key');
    const bossOk = bossState.bossDefeated && bossState.hasBossKey && (bossState.doorOpen || bossState.roomIndex === 3);
    console.log((bossOk ? 'OK' : 'FAIL') + ': boss key after killing ' + boss.kind + ' ' + JSON.stringify(bossState));
    if (!bossOk) errors.push('boss key check failed');
    await page.evaluate(() => { player.invincibleT = 0; world.mode = 'overworld'; world.dungeon = null; });
  }

  // ---- soundtrack: decode all 8 buffers after a gesture, verify state->track mapping ----
  {
    await page.mouse.click(5, 5);
    const t0 = Date.now();
    let dec = null;
    while (Date.now() - t0 < 30000) {
      dec = await page.evaluate(() => ({ n: Music.decoded, f: Music.failed, keys: Object.keys(Music.buffers) }));
      if (dec.n + dec.f >= 8) break;
      await sleep(250);
    }
    const map = await page.evaluate(() => {
      const T = CONFIG.TILE, out = {};
      const saved = { gs: gameState, mode: world.mode, x: hero.x, y: hero.y };
      dialogue.active = false; mathPopup.active = false; player.downed = false; player.invincibleT = 999;
      gameState = STATE.TITLE; out.title = musicForState(); gameState = STATE.PLAYING;
      world.mode = 'overworld'; world.dungeon = null; world.interior = null;
      hero.x = (overworld.w / 2) * T; hero.y = (overworld.h / 2) * T; out.town = musicForState();
      hero.x = (overworld.w / 2 + 40) * T; out.overworld = musicForState();
      world.mode = 'interior'; world.interior = buildings[0].interior; out.house = musicForState();
      world.interior = null; world.mode = 'dungeon'; world.dungeon = dungeons[0];
      dungeons[0].roomIndex = 0; out.dungeonRoom = musicForState();
      dungeons[0].roomIndex = 2; out.bossRoom = musicForState(); dungeons[0].roomIndex = 0;
      world.dungeon = null; world.mode = 'castle'; castle.roomIndex = 1; out.finalBoss = musicForState();
      castle.roomIndex = 0;
      world.mode = 'overworld'; hero.x = (overworld.w / 2 + 40) * T; hero.y = (overworld.h / 2) * T;
      return out;
    });
    await sleep(400);
    const a = await page.evaluate(() => ({ key: Music.cur && Music.cur.key, sw: Music.switches }));
    await page.evaluate(() => { hero.x = (overworld.w / 2) * CONFIG.TILE; hero.y = (overworld.h / 2) * CONFIG.TILE; });
    await sleep(400);
    const b = await page.evaluate(() => ({ key: Music.cur && Music.cur.key, sw: Music.switches }));
    const want = { title: 'title', town: 'village', overworld: 'overworld', house: 'village', dungeonRoom: 'dungeon', bossRoom: 'boss', finalBoss: 'final_boss' };
    const bad = Object.keys(want).filter(k => map[k] !== want[k]);
    const ok = dec.n === 8 && bad.length === 0 && a.key === 'overworld' && b.key === 'village' && b.sw > a.sw;
    console.log((ok ? 'OK' : 'FAIL') + ': music ' + JSON.stringify({ decoded: dec, map, before: a, after: b }));
    if (!ok) errors.push('music check failed');
  }

  await browser.close();

  if (errors.length) {
    console.error('FAIL: console errors detected:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  }
  console.log('OK: no uncaught console errors; screenshots saved to tools/screenshots/');
  process.exit(0);
})().catch(e => {
  console.error('FAIL: headless check threw:', e);
  process.exit(1);
});
