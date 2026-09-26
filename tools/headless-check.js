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

  const file = 'file://' + path.join(__dirname, '..', 'math-quest.html');
  await page.goto(file, { waitUntil: 'load', timeout: 30000 });
  await sleep(700);
  await page.screenshot({ path: path.join(shotDir, '01-title.png') });
  await canvasShot('01-title');

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
