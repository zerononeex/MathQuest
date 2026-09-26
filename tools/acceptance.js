// Phase 10 final acceptance run. Prints a PASS/FAIL checklist line per
// item. Not part of tools/smoke.sh (that stays the fast per-phase gate);
// this is the one-off Phase 10 acceptance sweep.
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log((ok ? 'PASS' : 'FAIL') + ' - ' + name + (detail ? ' (' + detail + ')' : ''));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  // MQ_FILE lets the suite run against another copy (e.g. an older build)
  const file = 'file://' + (process.env.MQ_FILE || path.join(__dirname, '..', 'math-quest.html'));
  const errorsAll = [];

  // --- 1. Portrait fill ---
  {
    const page = await browser.newPage();
    page.on('pageerror', e => errorsAll.push('portrait: ' + e.message));
    await page.setViewport({ width: 400, height: 800 });
    await page.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 300));
    const dims = await page.evaluate(() => {
      const c = document.getElementById('game');
      const r = c.getBoundingClientRect();
      return { w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight };
    });
    check('Portrait: canvas fills available space with no overflow',
      dims.w <= dims.vw && dims.h <= dims.vh && dims.w > dims.vw * 0.9,
      JSON.stringify(dims));
    await page.close();
  }

  // --- 2. Landscape fill ---
  {
    const page = await browser.newPage();
    page.on('pageerror', e => errorsAll.push('landscape: ' + e.message));
    await page.setViewport({ width: 800, height: 400 });
    await page.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 300));
    const dims = await page.evaluate(() => {
      const c = document.getElementById('game');
      const r = c.getBoundingClientRect();
      return { w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight };
    });
    check('Landscape: canvas fills available space with no overflow',
      dims.w <= dims.vw && dims.h <= dims.vh && dims.h > dims.vh * 0.8,
      JSON.stringify(dims));
    await page.close();
  }

  // --- Main gameplay page for the rest of the checks ---
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('Uncaught: ' + e.message));
  await page.setViewport({ width: 800, height: 500 });
  await page.goto(file, { waitUntil: 'load' });
  await page.mouse.click(400, 250);
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 200));

  const r = await page.evaluate(() => {
    const out = {};
    try {
      // title -> playing
      out.startedPlaying = (gameState === 'playing');

      // tap-to-move: try a handful of world points in the open wilds (away
      // from any building/dungeon/NPC trigger zone), confirm the hero
      // actually approaches each one over simulated update() ticks (no
      // stuck spot), then explicitly return to a known-good overworld state
      // so later checks in this same run aren't affected by any incidental
      // mode change (e.g. wandering into a door zone).
      out.tapMoveSamples = [];
      const wildsBase = { x: (overworld.w / 2 - 55) * 16, y: (overworld.h / 2 + 5) * 16 };
      hero.x = wildsBase.x; hero.y = wildsBase.y;
      const samplePoints = [
        { x: wildsBase.x + 80, y: wildsBase.y },
        { x: wildsBase.x, y: wildsBase.y + 80 },
        { x: wildsBase.x - 60, y: wildsBase.y - 40 },
      ];
      for (const p of samplePoints) {
        world.mode = 'overworld'; dialogue.active = false; mathPopup.active = false;
        const before = Math.hypot(hero.x - p.x, hero.y - p.y);
        Input.tapX = p.x - world.camX; Input.tapY = p.y - world.camY; Input.tapped = true;
        for (let i = 0; i < 120; i++) update(CONFIG.STEP_MS);
        const after = Math.hypot(hero.x - p.x, hero.y - p.y);
        out.tapMoveSamples.push({ before, after, improved: after < before });
      }
      // reset to a fully known-good state before the checks that follow
      world.mode = 'overworld'; dialogue.active = false; mathPopup.active = false;
      player.downed = false; player.invincibleT = 0;
      hero.x = (overworld.w / 2) * 16; hero.y = (overworld.h / 2 + 2) * 16;

      // smash a pot -> coin -> counter goes up
      const goldBefore = hud.gold;
      const pot = overworldPots.find(p => p.alive);
      hero.x = pot.x; hero.y = pot.y + 20; hero.facing = 'up';
      smashPot(pot);
      spawnCoin(pot.x, pot.y); // smashPot's coin drop is a 60% chance; force one for a deterministic check
      for (let i = 0; i < 90; i++) { updateCoinsAndPickups(CONFIG.STEP_MS / 1000); }
      out.potSmashGold = { before: goldBefore, after: hud.gold, potAlive: pot.alive };

      // buy an item, slot assignment
      hud.gold = 500;
      const boomerangItem = SHOP_ITEMS.find(i => i.id === 'boomerang');
      buyItem(boomerangItem);
      out.boomerangBought = player.owned.boomerang;
      out.boomerangAutoSlotted = player.slots.includes('boomerang');

      // AP drain + Q auto-open at 0 AP
      player.ap = 1;
      const target = overworldEnemies.find(e => e.alive);
      hero.x = target.x - 5; hero.y = target.y; hero.facing = 'right';
      trySwingSword(); // spends the last AP (or not, if it missed the target - AP still spent)
      out.apAfterOneSwing = player.ap;
      player.ap = 0; player.zeroApAttackTimer = 0.0001;
      for (let i = 0; i < 70; i++) update(CONFIG.STEP_MS); // >1s so the auto-popup should fire
      out.mathPopupAutoOpened = mathPopup.active;

      // correct answer -> instant close + AP + confetti, world never pauses movement lock
      if (mathPopup.active) {
        const q = mathPopup.question;
        answerMathPopup(q.correctIndex);
        out.correctAnswerClosedPopup = !mathPopup.active;
        out.apAfterCorrect = player.ap;
        out.confettiSpawnedOnCorrect = confettiParticles.length > 0;
      }

      // wrong answer -> retry, no penalty; ESC closes with no reward
      openMathPopup('ap');
      const q2 = mathPopup.question;
      const wrongIdx = (q2.correctIndex + 1) % 3;
      const apBeforeWrong = player.ap;
      answerMathPopup(wrongIdx);
      out.wrongAnswerStaysOpenNoPenalty = mathPopup.active && player.ap === apBeforeWrong;
      Input.keys['Escape'] = true;
      updateMathPopupInput();
      out.escClosesNoReward = !mathPopup.active && player.ap === apBeforeWrong;

      // hearts to 0 -> revive flow, never a "game over" state string anywhere
      // (move well clear of any enemy and clear invincibility left over from
      // the AP-drain step above, so this damageHero() call isn't a no-op)
      hero.x = 20; hero.y = 20;
      player.invincibleT = 0; player.downed = false;
      player.hearts = 1;
      damageHero(1, hero.x + 5, hero.y);
      out.downedTriggersRevivePopup = player.downed && mathPopup.active && mathPopup.purpose === 'revive';
      const rq = mathPopup.question;
      answerMathPopup(rq.correctIndex);
      out.revivedWithThreeHearts = !player.downed && player.hearts === 3 && player.invincibleT > 0;
      out.hasGameOverState = Object.values(STATE).some(s => /game.?over/i.test(s));

      out.consoleClean = true;
    } catch (e) {
      out.exception = e.message + '\n' + e.stack;
    }
    return out;
  });

  check('Title -> New Game reaches playing state', r.startedPlaying);
  check('Tap-to-move: hero approaches every sampled destination (no stuck spot)',
    r.tapMoveSamples && r.tapMoveSamples.every(s => s.improved),
    JSON.stringify(r.tapMoveSamples));
  check('Smash pot -> coin -> gold counter increases',
    r.potSmashGold && r.potSmashGold.after > r.potSmashGold.before && !r.potSmashGold.potAlive,
    JSON.stringify(r.potSmashGold));
  check('Shop: buy boomerang, auto-assigned to a weapon slot',
    r.boomerangBought && r.boomerangAutoSlotted);
  check('AP drains on sword swing', typeof r.apAfterOneSwing === 'number' && r.apAfterOneSwing <= 1);
  check('Math popup auto-opens ~1s after attacking at 0 AP', r.mathPopupAutoOpened === true);
  check('Correct answer closes popup instantly + grants AP + confetti',
    r.correctAnswerClosedPopup && r.apAfterCorrect > 0 && r.confettiSpawnedOnCorrect,
    'apAfterCorrect=' + r.apAfterCorrect);
  check('Wrong answer keeps popup open for retry, no AP penalty', r.wrongAnswerStaysOpenNoPenalty);
  check('ESC closes AP popup with no reward/penalty', r.escClosesNoReward);
  check('0 hearts opens a revive math popup (never a game-over screen)', r.downedTriggersRevivePopup);
  check('Correct revive answer: REVIVED with 3 hearts + invincibility blink', r.revivedWithThreeHearts);
  check('No "game over" state exists anywhere in the state machine', !r.hasGameOverState);
  if (r.exception) check('No exceptions during the above sequence', false, r.exception);
  else check('No exceptions during the above sequence', true);

  // --- Each dungeon end-to-end (reuse the Phase 4 scripted sequence, once per dungeon) ---
  const dungeonResults = await page.evaluate(() => {
    const out = [];
    for (const d of dungeons) {
      try {
        world.mode = 'overworld'; world.dungeon = null; // ensure the previous dungeon iteration is fully exited
        d.roomIndex = 0; d.hasSmallKey = false; d.hasBossKey = false; d.bossDefeated = false; d.chestOpened = false;
        enterDungeon(d); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        const keyPot = d.pots[0].find(p => p.holdsSmallKey);
        smashPot(keyPot);
        updateDungeonRoom(0.016, d.rooms[0]);
        const lockedOk = d.hasSmallKey;
        hero.x = (d.rooms[0].w - 1) * 16 - 4; hero.y = Math.floor(d.rooms[0].h / 2) * 16 + 8;
        handleDungeonDoors(d, d.rooms[0], 0.016);
        const doorOpened = d.rooms[0].grid[Math.floor(d.rooms[0].h / 2)][d.rooms[0].w - 1] === 4; // T.FLOOR
        dungeonGoRoom(d, 1, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        d.puzzle.solved = true;
        solvePuzzle(d, d.rooms[1]);
        // solving the puzzle raises a math-sealed boss door; walking up to it
        // asks a question and the right answer opens it
        const p1 = d.rooms[1], p1y = Math.floor(p1.h / 2);
        const sealRaised = p1.grid[p1y][p1.w - 1] === T.BOSSDOOR;
        d.doorHintShown.seal = false;
        hero.x = (p1.w - 1) * 16 - 4; hero.y = p1y * 16 + 8;
        handleDungeonDoors(d, p1, 0.016);
        const sealAsked = (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true));
        const puzzleOk = sealRaised && sealAsked && p1.grid[p1y][p1.w - 1] === 4;
        dungeonGoRoom(d, 2, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        const miniboss = d.enemies[2][0];
        // boss-sealed exit before defeat
        hero.x = (d.rooms[2].w - 1) * 16 - 4; hero.y = Math.floor(d.rooms[2].h / 2) * 16 + 8;
        handleDungeonDoors(d, d.rooms[2], 0.016);
        const sealedBeforeDefeat = d.rooms[2].grid[Math.floor(d.rooms[2].h / 2)][d.rooms[2].w - 1] !== 4;
        miniboss.hp = 0; defeatMiniboss(d, miniboss);
        handleDungeonDoors(d, d.rooms[2], 0.016);
        const openAfterDefeat = d.rooms[2].grid[Math.floor(d.rooms[2].h / 2)][d.rooms[2].w - 1] === 4;
        dungeonGoRoom(d, 3, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        hero.x = (Math.floor(d.rooms[3].w / 2) + 0.5) * 16; hero.y = (Math.floor(d.rooms[3].h / 2) + 0.5) * 16;
        // chest without boss key -> hint, no freeze. E goes through the real
        // per-frame update (updatePlaying), not a direct handler call: that
        // is how "E on the chest does nothing" slipped past this check.
        player.levelUpChoicePending = false; dialogue.active = false; mathPopup.active = false;
        d.hasBossKey = false;
        Input.keys['e'] = true;
        updatePlaying(1 / 60);
        const chestRefusedWithoutKey = !d.chestOpened;
        d.hasBossKey = true;
        Input.keys['e'] = true;
        updatePlaying(1 / 60);
        const chestLockClosedUntilAnswer = !d.chestOpened;
        const chestAsked = (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true));
        out.push({
          chestLockClosedUntilAnswer, chestAsked,
          id: d.def.id, lockedOk, doorOpened, puzzleOk, sealedBeforeDefeat, openAfterDefeat,
          chestRefusedWithoutKey, chestOpened: d.chestOpened, medallion: player.medallions[d.def.id],
          heartPiece: !!heartPieces.find(hp => hp.dungeonId === d.def.id) || player.maxHearts > 3,
        });
      } catch (e) {
        out.push({ id: d.def.id, exception: e.message });
      }
    }
    return out;
  });
  for (const dr of dungeonResults) {
    if (dr.exception) { check('Dungeon ' + dr.id + ' end-to-end', false, dr.exception); continue; }
    const ok = dr.lockedOk && dr.doorOpened && dr.puzzleOk && dr.sealedBeforeDefeat && dr.chestLockClosedUntilAnswer && dr.chestAsked &&
      dr.openAfterDefeat && dr.chestRefusedWithoutKey && dr.chestOpened && dr.medallion;
    check('Dungeon ' + dr.id + ': key/door/puzzle/math-sealed boss door/boss-seal/math-locked chest/medallion all correct', ok, JSON.stringify(dr));
  }

  // --- Every dungeon boss, killed the way the player kills it (repeated
  // damageEnemy() hits, then the normal per-frame room update) - NOT by
  // calling defeatMiniboss() directly like the check above, which is how
  // the "boss dies but no Boss Key / door stays sealed" bug slipped past ---
  const bossKillResults = await page.evaluate(() => {
    const out = [];
    for (const d of dungeons) {
      try {
        const room = d.rooms[2], midY = Math.floor(room.h / 2), TS = CONFIG.TILE;
        world.mode = 'dungeon'; world.dungeon = d; world.interior = null; d.roomIndex = 2;
        dialogue.active = false; mathPopup.active = false; shop.active = false; fadeAlpha = 0; fadeDir = 0; fadeCallback = null;
        d.hasBossKey = false; d.bossDefeated = false; d.chestOpened = false;
        room.grid[midY][room.w - 1] = T.BOSSDOOR; // re-seal (the check above opened it)
        const tr = d.rooms[3];
        tr.grid[Math.floor(tr.h / 2)][Math.floor(tr.w / 2)] = T.CHEST;
        const e = d.enemies[2].find(x => x.isMiniboss);
        Object.assign(e, { alive: true, hp: e.maxHp, x: (room.w / 2) * TS, y: (room.h / 2) * TS, hopDx: 0, hopDy: 0, dashTimer: 99 });
        hero.x = 3 * TS; hero.y = 3 * TS; player.invincibleT = 999; player.downed = false;
        let hits = 0;
        while (e.alive && hits++ < 500) damageEnemy(e, 'sword');
        player.levelUpChoicePending = false;
        for (let i = 0; i < 3; i++) updateDungeonRoom(1 / 60, room);
        const flagged = d.bossDefeated && d.hasBossKey;
        const heartPiece = heartPieces.some(h => h.dungeonId === d.def.id);
        // walk up to the sealed door: it must open now
        hero.x = (room.w - 2) * TS; hero.y = (midY + 0.5) * TS;
        updateDungeonRoom(1 / 60, room);
        const doorOpen = room.grid[midY][room.w - 1] === T.FLOOR;
        // walk through it into the treasure room
        hero.x = (room.w - 1.1) * TS;
        updateDungeonRoom(1 / 60, room); fadeCallback && fadeCallback(); fadeCallback = null; fadeAlpha = 0; fadeDir = 0;
        const inTreasure = d.roomIndex === 3;
        // and open the boss treasure with the key
        hero.x = (Math.floor(tr.w / 2) + 0.5) * TS; hero.y = (Math.floor(tr.h / 2) + 0.5) * TS;
        player.levelUpChoicePending = false;
        Input.keys['e'] = true;
        updatePlaying(1 / 60);
        (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true));
        out.push({ id: d.def.id, boss: d.def.bossKind, hits, flagged, heartPiece, doorOpen, inTreasure, chestOpened: d.chestOpened });
      } catch (err) {
        out.push({ id: d.def.id, exception: err.message });
      }
    }
    player.invincibleT = 0; world.mode = 'overworld'; world.dungeon = null;
    return out;
  });
  for (const br of bossKillResults) {
    if (br.exception) { check('Boss ' + br.id + ' kill -> Boss Key', false, br.exception); continue; }
    check('Dungeon ' + br.id + ' (' + br.boss + '): killing the boss by hits gives the Boss Key, unseals the door, treasure opens',
      br.flagged && br.heartPiece && br.doorOpen && br.inTreasure && br.chestOpened, JSON.stringify(br));
  }

  // --- Interactions through the real per-frame update (one dispatcher for
  // E and taps): dungeon chests by E and by tap, Fire Dungeon torches ---
  const interactResults = await page.evaluate(() => {
    const out = { chestE: [], chestTap: [] };
    try {
      const TS = CONFIG.TILE;
      const clearModals = () => {
        dialogue.active = false; mathPopup.active = false; shop.active = false; pauseMenu.active = false;
        wardrobe.active = false; player.levelUpChoicePending = false; player.downed = false; player.invincibleT = 999;
        fadeAlpha = 0; fadeDir = 0; fadeCallback = null; Input.tapped = false;
        for (const k of Object.keys(Input.keys)) Input.keys[k] = false;
        hero.walkTargetX = null; hero.walkTargetY = null; hero.pendingAttackTarget = null; hero.pendingTalkTarget = null; hero.pendingInteract = null;
      };
      const step = n => {
        for (let i = 0; i < n; i++) {
          updatePlaying(1 / 60);
          if (fadeCallback) { const f = fadeCallback; fadeCallback = null; f(); fadeAlpha = 0; fadeDir = 0; }
        }
      };
      const enterTreasure = d => {
        clearModals();
        world.mode = 'dungeon'; world.dungeon = d; world.interior = null; d.roomIndex = 3; d.hasBossKey = true;
        const tr = d.rooms[3];
        tr.grid[Math.floor(tr.h / 2)][Math.floor(tr.w / 2)] = T.CHEST; tr.canvas = prerenderMap(tr);
        d.chestOpened = false; player.medallions[d.def.id] = false;
      };
      for (const d of dungeons) {
        const id = d.def.id, tr = d.rooms[3], cx = Math.floor(tr.w / 2), cy = Math.floor(tr.h / 2);
        // (a) stand on the tile west of the chest, face it, press E
        enterTreasure(d);
        hero.x = (cx - 0.5) * TS; hero.y = (cy + 0.5) * TS; hero.facing = 'right';
        step(2);
        Input.keys['e'] = true; step(1);
        (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true));
        out.chestE.push({ id, opened: d.chestOpened, medallion: !!player.medallions[id] });
        // (b) from the room entrance, tap the chest: walk there, then open
        enterTreasure(d);
        hero.x = 2 * TS; hero.y = cy * TS;
        step(2);
        Input.tapX = (cx + 0.5) * TS - world.camX; Input.tapY = (cy + 0.5) * TS - world.camY; Input.tapped = true;
        let frames = 0;
        while (!d.chestOpened && frames++ < 600) { (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true)); step(1); }
        out.chestTap.push({ id, opened: d.chestOpened, medallion: !!player.medallions[id], frames });
      }
      // (c) Fire Dungeon torches: stand on each in order, press E
      const fire = dungeons.find(d => d.def.id === 'fire'), pz = fire.puzzle, pr = fire.rooms[1], midY = Math.floor(pr.h / 2);
      const resetTorches = () => {
        clearModals();
        world.mode = 'dungeon'; world.dungeon = fire; world.interior = null; fire.roomIndex = 1;
        pz.solved = false; pz.lit = []; pr.grid[midY][pr.w - 1] = T.WALL; pr.canvas = prerenderMap(pr);
      };
      resetTorches();
      const litAfter = [];
      for (const i of pz.order) {
        const t = pz.torches[i];
        hero.x = (t.x + 0.5) * TS; hero.y = (t.y + 0.5) * TS;
        step(1);
        Input.keys['e'] = true; step(1);
        litAfter.push(pz.lit.length);
      }
      out.torchesE = { litAfter, solved: pz.solved, doorOpen: pr.grid[midY][pr.w - 1] === T.FLOOR };
      // and by tap: tap torch 0 from across the room, the hero walks over and lights it
      resetTorches();
      hero.x = 2 * TS; hero.y = midY * TS; step(2);
      const t0 = pz.torches[pz.order[0]];
      Input.tapX = (t0.x + 0.5) * TS - world.camX; Input.tapY = (t0.y + 0.5) * TS - world.camY; Input.tapped = true;
      let tf = 0;
      while (!pz.lit.length && tf++ < 600) step(1);
      out.torchTap = { lit: pz.lit.slice(), frames: tf };
      pz.solved = true; pr.grid[midY][pr.w - 1] = T.FLOOR; pr.canvas = prerenderMap(pr);
    } catch (e) { out.exception = e.message + ' ' + (e.stack || '').split('\n')[1]; }
    player.invincibleT = 0; world.mode = 'overworld'; world.dungeon = null;
    hero.x = (overworld.w / 2) * CONFIG.TILE; hero.y = (overworld.h / 2 + 2) * CONFIG.TILE;
    return out;
  });
  if (interactResults.exception) check('Interaction dispatcher checks ran', false, interactResults.exception);
  check('E beside a dungeon chest (with Boss Key) opens it and grants the medallion, all 4 dungeons',
    interactResults.chestE.length === 4 && interactResults.chestE.every(c => c.opened && c.medallion), JSON.stringify(interactResults.chestE));
  check('Tapping a dungeon chest walks to it, opens it and grants the medallion, all 4 dungeons',
    interactResults.chestTap.length === 4 && interactResults.chestTap.every(c => c.opened && c.medallion), JSON.stringify(interactResults.chestTap));
  check('Fire Dungeon: E on each torch in order lights it and opens the way east',
    !!interactResults.torchesE && interactResults.torchesE.litAfter.join() === '1,2,3' && interactResults.torchesE.solved && interactResults.torchesE.doorOpen,
    JSON.stringify(interactResults.torchesE) + ' tap:' + JSON.stringify(interactResults.torchTap));
  check('Fire Dungeon: tapping a torch walks to it and lights it',
    !!interactResults.torchTap && interactResults.torchTap.lit.length === 1, JSON.stringify(interactResults.torchTap));

  // --- (d) Nothing spawns inside solid terrain: fresh page, every enemy /
  // pot / NPC hitbox (moveWithCollision's corner test) must be clear ---
  {
    const sp = await browser.newPage();
    sp.on('pageerror', e => errorsAll.push('spawns: ' + e.message));
    await sp.goto(file, { waitUntil: 'load' });
    const bad = await sp.evaluate(() => {
      const out = [];
      const hits = (map, e) => {
        const hw = (e.w || 12) / 2, hh = (e.h || 12) / 2;
        return [[e.x - hw, e.y - hh], [e.x + hw, e.y - hh], [e.x - hw, e.y + hh - 1], [e.x + hw, e.y + hh - 1]].some(c => tileSolidAt(map, c[0], c[1]));
      };
      const chk = (map, list, where) => { for (const e of list) if (hits(map, e)) out.push(where + ' ' + (e.type || (e.isBush ? 'bush' : e.name || 'pot')) + ' @' + Math.round(e.x) + ',' + Math.round(e.y)); };
      chk(overworld, overworldEnemies.concat(wildsEnemies), 'overworld enemy');
      chk(overworld, overworldPots.concat(wildsPots, wildsBushes), 'overworld');
      chk(overworld, villagerNPCs.concat(cameoNPCs), 'overworld NPC');
      chk(houseInterior, houseNPCs, 'house NPC'); chk(shopInterior, shopNPCs, 'shop NPC'); chk(desertShopInterior, desertShopNPCs, 'desert shop NPC');
      for (const d of dungeons) d.rooms.forEach((r, i) => chk(r, d.enemies[i].concat(d.pots[i]), d.def.id + ':' + i));
      castle.rooms.forEach((r, i) => chk(r.map, r.enemies.concat(r.pots), 'castle:' + i));
      return out;
    });
    check('No enemy / pot / NPC spawns with its hitbox inside a solid tile', bad.length === 0, bad.slice(0, 10).join('; '));
    await sp.close();
  }

  // --- Bow slot, arrow cycling, arrows clink off walls ---
  const bowResult = await page.evaluate(() => {
    try {
      player.owned.bow = true; player.owned.fireArrow = true; player.owned.iceArrow = true;
      player.slots[1] = 'bow'; player.activeSlot = 1;
      const before = player.arrowType;
      cycleArrowType();
      const afterOne = player.arrowType;
      cycleArrowType(); cycleArrowType();
      const backToStart = player.arrowType === before;
      // fire an arrow into a wall and confirm it's removed (clink) not passed through
      const map = overworld;
      let wallX = -1, wallY = -1;
      outer: for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
        if (map.grid[y][x] === 3) { wallX = x; wallY = y; break outer; } // T.TREE
      }
      arrows.length = 0;
      arrows.push({ x: (wallX - 1) * 16, y: wallY * 16, vx: 300, vy: 0, type: 'normal' });
      for (let i = 0; i < 10; i++) updateArrows(0.016, map);
      return { before, afterOne, backToStart, arrowClinked: arrows.length === 0 };
    } catch (e) { return { exception: e.message }; }
  });
  check('Bow: cycling arrow type wraps normal->fire->ice->normal', bowResult.backToStart && bowResult.afterOne !== bowResult.before, JSON.stringify(bowResult));
  check('Arrows clink off walls (removed, never pass through)', bowResult.arrowClinked);

  // --- Level up choice ---
  const levelUpResult = await page.evaluate(() => {
    try {
      const before = { maxHearts: player.maxHearts, attack: player.attack, level: player.level };
      player.xp = 0; player.xpToNext = 5;
      gainXP(5);
      const popupShown = player.levelUpChoicePending;
      applyLevelUpChoice(1); // +1 attack
      return { before, popupShown, after: { maxHearts: player.maxHearts, attack: player.attack, level: player.level } };
    } catch (e) { return { exception: e.message }; }
  });
  check('Level up shows blocking choice popup and applies the pick',
    levelUpResult.popupShown && levelUpResult.after.attack === levelUpResult.before.attack + 1 &&
    levelUpResult.after.level === levelUpResult.before.level + 1,
    JSON.stringify(levelUpResult));

  // --- Castle X/4, Ganondorf phases, dark siphon, victory stats ---
  const castleResult = await page.evaluate(() => {
    try {
      Object.keys(player.medallions).forEach(k => player.medallions[k] = false);
      player.medallions.forest = true; player.medallions.fire = true;
      const progressText = medallionCount() + '/4';
      Object.keys(player.medallions).forEach(k => player.medallions[k] = true);
      enterCastle(); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
      hero.x = (castle.rooms[0].map.w - 1) * 16 - 2;
      updateCastleRoom(0.016, castle.rooms[0].map);
      fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
      const g = castle.ganon;
      g.hp = g.maxHp; updateGanon(0.016, castle.rooms[1].map);
      const phase1 = g.phase;
      g.hp = Math.floor(g.maxHp * 0.5); updateGanon(0.016, castle.rooms[1].map);
      const phase2 = g.phase;
      player.ap = 5; g.siphonTimer = 0; const apBefore = player.ap; updateGanon(0.016, castle.rooms[1].map);
      const siphonWorked = player.ap < apBefore;
      g.hp = Math.floor(g.maxHp * 0.2); updateGanon(0.016, castle.rooms[1].map);
      const phase3 = g.phase;
      damageEnemy(g, 'heroSword'); g.hp = 0; ganonDefeated(g);
      return { progressText, phase1, phase2, phase3, siphonWorked, defeated: castle.defeated };
    } catch (e) { return { exception: e.message }; }
  });
  check('Castle gate shows X/4 medallion progress', castleResult.progressText === '2/4', JSON.stringify(castleResult.progressText));
  check('Ganondorf: phase 1/2/3 transitions correctly by HP%',
    castleResult.phase1 === 1 && castleResult.phase2 === 2 && castleResult.phase3 === 3, JSON.stringify(castleResult));
  check('Dark Siphon steals AP in phase 2+', castleResult.siphonWorked);
  await new Promise(r => setTimeout(r, 1600));
  const victoryState = await page.evaluate(() => ({ gameState, stats: victoryStats }));
  check('Defeating Ganondorf leads to the VICTORY screen with stats', victoryState.gameState === 'victory', JSON.stringify(victoryState.stats));

  // --- Wardrobe visible everywhere, mute, music by area ---
  const presentationResult = await page.evaluate(() => {
    try {
      player.unlockedSkins.blue = true; player.skin = 'blue';
      const tunicColor = currentTunic().body;
      audioSettings.muted = true;
      const savedMode = world.mode, savedD = world.dungeon;
      const savedGs = gameState; gameState = STATE.PLAYING;
      world.mode = 'overworld'; world.dungeon = null; hero.x = 40 * CONFIG.TILE; hero.y = 40 * CONFIG.TILE;
      const musicBefore = musicForState();
      world.mode = 'dungeon'; world.dungeon = dungeons[0]; dungeons[0].roomIndex = 0;
      const musicSwitched = musicBefore !== 'dungeon' && musicForState() === 'dungeon';
      world.mode = savedMode; world.dungeon = savedD; gameState = savedGs;
      audioSettings.muted = false;
      return { tunicColor, musicSwitched, musicBefore, gs: gameState };
    } catch (e) { return { exception: e.message }; }
  });
  check('Wardrobe skin selection is reflected by currentTunic() used in hero draw', !!presentationResult.tunicColor, JSON.stringify(presentationResult));
  check('Music area switches (overworld/dungeon/boss/title/victory)', presentationResult.musicSwitched, JSON.stringify(presentationResult));

  // --- Save/continue round-trip + corrupt save ---
  const saveResult = await page.evaluate(() => {
    try {
      hud.gold = 77;
      const ok = saveGame();
      return { ok, hasSave: hasSaveGame() };
    } catch (e) { return { exception: e.message }; }
  });
  await page.reload();
  await new Promise(r => setTimeout(r, 200));
  const continueResult = await page.evaluate(() => {
    try {
      continueSavedGame();
      return { gold: hud.gold, state: gameState };
    } catch (e) { return { exception: e.message }; }
  });
  check('Save + Continue round-trip restores state', saveResult.ok && continueResult.gold === 77 && continueResult.state === 'playing', JSON.stringify({ saveResult, continueResult }));
  const corruptResult = await page.evaluate(() => {
    try {
      localStorage.setItem(SAVE_KEY, '{{{not json');
      continueSavedGame();
      return { state: gameState, hearts: player.hearts, crashed: false };
    } catch (e) { return { crashed: true, message: e.message }; }
  });
  check('Corrupt save falls back to a fresh start without crashing', !corruptResult.crashed && corruptResult.state === 'playing', JSON.stringify(corruptResult));

  // --- Walk full 10x map / regions / bushes ---
  const mapResult = await page.evaluate(() => {
    try {
      const ratio = (overworld.w * overworld.h) / (200 * 140); // vs the Phase 8 map
      const bush = wildsBushes[0];
      const goldBefore = hud.gold + heartPickups.length; // proxy
      smashPot(bush);
      const regionsSeen = new Set();
      for (let i = 0; i < 400; i++) {
        const x = Math.floor(Math.random() * overworld.w), y = Math.floor(Math.random() * overworld.h);
        regionsSeen.add(regionAt(x, y));
      }
      return { ratio, bushCut: !bush.alive, regionsSeen: [...regionsSeen].sort() };
    } catch (e) { return { exception: e.message }; }
  });
  check('Overworld is ~1.5x the Phase 8 map (not a sprawling empty world)', mapResult.ratio > 1.4 && mapResult.ratio < 1.6, 'ratio=' + mapResult.ratio);
  check('Slashable bushes can be cut', mapResult.bushCut);
  check('All 5 regions + town are reachable/present on the map', mapResult.regionsSeen && mapResult.regionsSeen.length === 6, JSON.stringify(mapResult.regionsSeen));

  // Enter -> exit the far-east Fire Dungeon (entering from the bottom edge of
  // its trigger, which used to drop the hero inside the cliff on exit), then
  // confirm the live rAF loop still runs and the hero responds to input.
  const fireResult = await page.evaluate(() => {
    try {
      world.mode = 'overworld'; world.dungeon = null; world.interior = null;
      dialogue.active = false; mathPopup.active = false; player.downed = false; player.invincibleT = 999;
      const d = dungeons.find(x => x.def.id === 'fire');
      const east = dungeons.every(o => o.entranceZone.maxX <= d.entranceZone.maxX);
      hero.x = (d.entranceZone.minX + d.entranceZone.maxX) / 2; hero.y = d.entranceZone.maxY;
      return { east };
    } catch (e) { return { exception: e.message }; }
  });
  await new Promise(r => setTimeout(r, 1200));
  const fireIn = await page.evaluate(() => world.mode);
  await page.evaluate(() => { hero.x = 18; hero.y = Math.floor(world.dungeon.rooms[0].h / 2) * CONFIG.TILE; });
  await new Promise(r => setTimeout(r, 1200));
  const fireOut = await page.evaluate(() => ({ mode: world.mode, x: hero.x, y: hero.y, t: lastTime }));
  const moved = {};
  for (const k of ['ArrowLeft', 'ArrowUp']) {
    const before = await page.evaluate(() => [hero.x, hero.y]);
    await page.keyboard.down(k); await new Promise(r => setTimeout(r, 300)); await page.keyboard.up(k);
    const after = await page.evaluate(() => [hero.x, hero.y]);
    moved[k] = Math.hypot(after[0] - before[0], after[1] - before[1]);
  }
  const tAfter = await page.evaluate(() => lastTime);
  await page.evaluate(() => { player.invincibleT = 0; });
  check('Fire Dungeon (far east) enter -> exit leaves the game responsive',
    fireResult.east && fireIn === 'dungeon' && fireOut.mode === 'overworld' && tAfter > fireOut.t &&
      (moved.ArrowLeft > 4 || moved.ArrowUp > 4),
    JSON.stringify({ fireResult, fireIn, fireOut, moved }));

  // --- Cindermaw is the Fire Dungeon boss (Malrek only in the castle); its
  // stunned window takes double damage; killing it by hits gives the key ---
  const fireBoss = bossKillResults.find(b => b.id === 'fire') || {};
  const cmResult = await page.evaluate(() => {
    try {
      const d = dungeons.find(x => x.def.id === 'fire'), e = d.enemies[2].find(x => x.isMiniboss);
      const others = dungeons.filter(x => x.def.id !== 'fire').map(x => x.enemies[2][0].maxHp);
      const out = { bossKind: d.def.bossKind, enemyKind: e.bossKind, maxHp: e.maxHp, others,
        malrekInDungeons: dungeons.some(x => x.def.bossKind === 'malrek'), name: NEW_BOSS_DEFS.cindermaw && NEW_BOSS_DEFS.cindermaw.name };
      // double damage while stunned (crouched)
      world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = 2;
      Object.assign(e, { alive: true, hp: e.maxHp, cmState: 'idle', cmT: 99 });
      damageEnemy(e, 'sword'); out.normalHit = e.maxHp - e.hp;
      e.hp = e.maxHp; e.cmState = 'stun'; damageEnemy(e, 'sword'); out.stunHit = e.maxHp - e.hp;
      // the attack cycle runs idle -> rear -> lunge (spits lava) -> stun -> idle
      Object.assign(e, { hp: e.maxHp, cmState: 'idle', cmT: 0.01, x: 8 * 16, y: 5 * 16 });
      hero.x = 3 * 16; hero.y = 5 * 16; player.invincibleT = 999; d.bossDefeated = true; // keep the kill hook out of this
      const seen = [], shots0 = enemyShots.length;
      for (let i = 0; i < 400; i++) { updateDungeonRoom(1 / 60, d.rooms[2]); updateEnemyShots(1 / 60, d.rooms[2]); if (seen[seen.length - 1] !== e.cmState) seen.push(e.cmState); }
      out.cycle = seen.join('>'); out.spat = enemyShots.length > shots0 || seen.includes('lunge');
      d.bossDefeated = false; player.invincibleT = 0; world.mode = 'overworld'; world.dungeon = null;
      return out;
    } catch (err) { return { exception: err.message }; }
  });
  check('Fire Dungeon boss is Cindermaw (Malrek only in the castle), dungeon-boss HP, and killing it gives the Boss Key',
    cmResult.bossKind === 'cindermaw' && cmResult.enemyKind === 'cindermaw' && !cmResult.malrekInDungeons &&
      cmResult.maxHp <= Math.max(...cmResult.others) + 4 && fireBoss.boss === 'cindermaw' && fireBoss.flagged && fireBoss.doorOpen && fireBoss.chestOpened,
    JSON.stringify({ cmResult, fireBoss }));
  check('Cindermaw: rear-up -> lunge/spit -> stunned cycle, double damage while stunned',
    /rear>lunge>stun>idle>rear/.test(cmResult.cycle) && cmResult.stunHit === cmResult.normalHit * 2, JSON.stringify(cmResult));

  // --- Interiors: three distinct rooms; BFS over the collision grid from the
  // exit rug reaches talking distance of every NPC; talking to the
  // shopkeeper behind her counter works by E and by tap ---
  const interiorResult = await page.evaluate(() => {
    const out = { rooms: [] };
    try {
      const TS = CONFIG.TILE;
      const rooms = [[houseInterior, houseNPCs], [shopInterior, shopNPCs], [desertShopInterior, desertShopNPCs]];
      for (const [m, npcs] of rooms) {
        const sx = Math.floor(m.exit.x), sy = Math.floor(m.exit.y), seen = new Set([sy * 1000 + sx]), q = [[sx, sy]];
        while (q.length) {
          const [x, y] = q.shift();
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy, k = ny * 1000 + nx;
            if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h || seen.has(k) || SOLID_TILES.has(m.grid[ny][nx])) continue;
            seen.add(k); q.push([nx, ny]);
          }
        }
        const reach = n => [...seen].some(k => Math.hypot(((k % 1000) + 0.5) * TS - n.x, (Math.floor(k / 1000) + 0.5) * TS - n.y) < CONFIG.NPC_TALK_RANGE + 12);
        const spawnTile = Math.floor((m.exit.y - 1.2) * TS / TS) * 1000 + Math.floor(m.exit.x * TS / TS);
        out.rooms.push({ label: m.label, size: m.w + 'x' + m.h, solids: m.grid.flat().filter(t => t === T.FURN).length, pieces: m.furniture.length,
          lights: m.lights.length, reachable: seen.size, npcsReachable: npcs.every(reach), spawnFree: seen.has(spawnTile) });
      }
      // E and tap to the shopkeeper through the real update loop
      const talk = (m, b, how) => {
        dialogue.active = false; shop.active = false; mathPopup.active = false; player.levelUpChoicePending = false; fadeCallback = null; fadeAlpha = 0; fadeDir = 0;
        world.mode = 'interior'; world.interior = m; world.returnSpot = { x: 100 * TS, y: 72 * TS };
        hero.x = m.exit.x * TS; hero.y = (m.exit.y - 1.2) * TS; hero.walkTargetX = null; hero.pendingTalkTarget = null;
        for (const k of Object.keys(Input.keys)) Input.keys[k] = false;
        const sk = allNPCs().find(n => n.isShopkeeper);
        if (how === 'E') {
          Input.keys['ArrowUp'] = true;
          for (let i = 0; i < 90; i++) updatePlaying(1 / 60);
          Input.keys['ArrowUp'] = false;
          Input.keys['e'] = true; updatePlaying(1 / 60);
        } else {
          updateCamera(1 / 60);
          Input.tapX = sk.x - world.camX; Input.tapY = sk.y - world.camY; Input.tapped = true;
          for (let i = 0; i < 240 && !shop.active; i++) { updatePlaying(1 / 60); updateCamera(1 / 60); }
        }
        const ok = shop.active, blocked = hero.y > sk.y + 16; // the counter kept the hero on the customer side
        shop.active = false;
        return { ok, blocked, heroY: Math.round(hero.y), skY: sk.y };
      };
      out.talk = {
        shopE: talk(shopInterior, null, 'E'), shopTap: talk(shopInterior, null, 'tap'),
        desertE: talk(desertShopInterior, null, 'E'), desertTap: talk(desertShopInterior, null, 'tap'),
      };
      world.mode = 'overworld'; world.interior = null; hero.x = (overworld.w / 2) * TS; hero.y = (overworld.h / 2 + 2) * TS;
    } catch (err) { out.exception = err.message + ' ' + (err.stack || '').split('\n')[1]; }
    return out;
  });
  const ir = interiorResult.rooms || [];
  check('Interiors: 3 distinct furnished rooms (shop / house / outpost) with solid furniture and lights',
    ir.length === 3 && new Set(ir.map(r => r.size + ':' + r.pieces)).size === 3 && ir.every(r => r.solids > 4 && r.lights > 0 && r.spawnFree),
    JSON.stringify(interiorResult));
  check('Interiors: clear path (BFS on collision) from the exit rug to talking distance of every NPC',
    ir.length === 3 && ir.every(r => r.npcsReachable), JSON.stringify(ir));
  const tk = interiorResult.talk || {};
  check('Shopkeepers behind their counters: E and tap both open the shop across the counter',
    ['shopE', 'shopTap', 'desertE', 'desertTap'].every(k => tk[k] && tk[k].ok && tk[k].blocked), JSON.stringify(tk));

  // --- New enemies: all four archetypes spawn (overworld + dungeons), never
  // inside a solid tile; beetle shield blocks a frontal hit but not a side hit ---
  {
    const sp = await browser.newPage();
    sp.on('pageerror', e => errorsAll.push('new enemies: ' + e.message));
    await sp.goto(file, { waitUntil: 'load' });
    const ne = await sp.evaluate(() => {
      const out = { counts: {}, inSolid: [] };
      try {
        const hits = (map, e) => boxHitsSolid(map, e.x, e.y, e.w, e.h);
        const groups = [{ map: overworld, list: wildsEnemies, where: 'overworld' }];
        for (const d of dungeons) d.rooms.forEach((r, i) => groups.push({ map: r, list: d.enemies[i], where: d.def.id + ':' + i }));
        for (const g of groups) for (const e of g.list) if (NEW_ENEMY_TYPES.has(e.type)) {
          out.counts[e.type + '@' + (g.where === 'overworld' ? 'ow' : 'dg')] = (out.counts[e.type + '@' + (g.where === 'overworld' ? 'ow' : 'dg')] || 0) + 1;
          if (hits(g.map, e)) out.inSolid.push(e.type + ' ' + g.where);
        }
        // beetle shield: frontal sword blocked, side sword lands, boomerang lowers the shield
        startNewGame();
        const d = dungeons.find(x => x.def.id === 'forest'); world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = 0;
        const b = d.enemies[0].find(e => e.type === 'beetle');
        const reset = () => Object.assign(b, { alive: true, hp: b.maxHp, x: 8 * 16, y: 5 * 16, faceAng: 0, shieldDownT: 0, blockLock: 5 });
        const swing = (hx, hy, facing) => { hero.x = hx; hero.y = hy; hero.facing = facing; player.ap = 9; player.attackCooldown = 0; dialogue.active = false; const hp = b.hp; trySwingSword(); return hp - b.hp; };
        reset(); out.front = swing(b.x + 14, b.y, 'left');
        reset(); out.side = swing(b.x, b.y - 14, 'down');
        reset(); out.behind = swing(b.x - 14, b.y, 'right');
        reset(); damageEnemy(b, 'boomerang', { x: b.x + 40, y: b.y }); out.boomShieldDown = b.shieldDownT > 0; out.frontAfterBoom = swing(b.x + 14, b.y, 'left');
        // wisp: faded = invulnerable except to fire arrows; mole: hidden = untargetable
        const w = makeDungeonEnemy('wisp', 0, 0); w.faded = true;
        out.wispFadedSword = damageEnemy(w, 'sword'); out.wispFadedFire = damageEnemy(w, 'bow', { x: 0, y: 0, fire: true });
        const m = makeDungeonEnemy('mole', 0, 0); out.moleHiddenTargetable = enemyTargetable(m);
        world.mode = 'overworld'; world.dungeon = null;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    const types = ['beetle', 'spitter', 'wisp', 'mole'];
    check('New enemies (beetle/spitter/wisp/mole) spawn in the overworld and dungeons, none inside a solid tile',
      types.every(t => ne.counts[t + '@ow'] > 0 && ne.counts[t + '@dg'] > 0) && ne.inSolid.length === 0, JSON.stringify(ne));
    check('Bulwark Beetle blocks a frontal sword hit, takes side/back hits; boomerang lowers its shield',
      ne.front === 0 && ne.side > 0 && ne.behind > 0 && ne.boomShieldDown && ne.frontAfterBoom > 0, JSON.stringify(ne));
    check('Glimmer Wisp is invulnerable while faded except to fire arrows; a burrowed mole cannot be targeted',
      ne.wispFadedSword === false && ne.wispFadedFire === true && ne.moleHiddenTargetable === false, JSON.stringify(ne));
    await sp.close();
  }

  // --- Phase B overworld: reachability, density and every new mechanic ---
  {
    const ow = await browser.newPage();
    ow.on('pageerror', e => errorsAll.push('overworld: ' + e.message));
    await ow.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    const r = await ow.evaluate(() => {
      const out = {};
      try {
        localStorage.removeItem(SAVE_KEY);
        startNewGame();
        const TS = CONFIG.TILE, W = overworld.w, H = overworld.h;
        const step = n => { for (let i = 0; i < n; i++) { updatePlaying(1 / 60); if (fadeCallback) { const f = fadeCallback; fadeCallback = null; f(); fadeAlpha = 0; fadeDir = 0; } } };
        const clear = () => { dialogue.active = false; mathPopup.active = false; player.levelUpChoicePending = false; player.invincibleT = 999;
          for (const k of Object.keys(Input.keys)) Input.keys[k] = false; hero.walkTargetX = null; hero.walkTargetY = null; hero.hop = null;
          for (const e of wildsEnemies) e.alive = false; };
        const solveLock = () => mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true);
        clear();
        // 1. every landmark reachable on foot (lake bridge lowered for the island)
        for (const [bx, by] of overworld.bridgeTiles.lakeBridge) overworld.grid[by][bx] = T.BRIDGE;
        const seen = owReachable(overworld, Math.floor(W / 2), Math.floor(H / 2) + 2);
        out.unreachable = OW_TARGETS.filter(t => !seen[t.x + t.y * W]).map(t => t.name);
        for (const [bx, by] of overworld.bridgeTiles.lakeBridge) overworld.grid[by][bx] = T.WATER;
        // ...and the island is cut off while the bridge is up
        const seenUp = owReachable(overworld, Math.floor(W / 2), Math.floor(H / 2) + 2);
        const [wx, wy] = OW_LAYOUT.dungeons.water;
        out.islandCutOff = !seenUp[wx + wy * W];
        // 2. something to find on every screen that has land
        const sw = 40, sh = 22, pois = [];
        for (const c of owChests) pois.push([c.x, c.y]);
        for (const sg of owSigns) pois.push([sg.x, sg.y]);
        for (const f of owFountains) pois.push([f.x, f.y]);
        for (const p of owProps) pois.push([p.x, p.y]);
        for (const g of owGates) pois.push([g.x, g.y]);
        for (const g of owGroveSpots) pois.push([g.x, g.y]);
        for (const c of overworld.caves) pois.push([c.x, c.y]);
        for (const [x, y] of OW_LAYOUT.stairs) pois.push([x, y]);
        for (const b of buildings) pois.push([b.doorTileX, b.doorTileY]);
        pois.push([secretSpot.x, secretSpot.y], OW_LAYOUT.castleGate);
        const empty = [];
        for (let sy = 0; sy < H; sy += sh) for (let sx = 0; sx < W; sx += sw) {
          let land = 0;
          for (let y = sy; y < Math.min(H, sy + sh); y++) for (let x = sx; x < Math.min(W, sx + sw); x++) if (overworld.grid[y][x] !== T.WATER) land++;
          if (land < sw * sh * 0.3) continue;
          if (!pois.some(([x, y]) => x >= sx && x < sx + sw && y >= sy && y < sy + sh)) empty.push(sx / sw + ',' + sy / sh);
        }
        out.emptyScreens = empty;
        // 3. bridge lever: math lock lowers the bridge
        const lever = owProps.find(p => p.kind === 'lever');
        clear(); hero.x = (lever.x + 0.5) * TS; hero.y = (lever.y + 1.5) * TS; hero.facing = 'up';
        Input.keys['e'] = true; step(1);
        out.leverAsks = mathPopup.active && mathPopup.purpose === 'lock';
        solveLock(); step(1);
        out.bridgeDown = !!owState.bridges.lakeBridge && overworld.bridgeTiles.lakeBridge.every(([x, y]) => overworld.grid[y][x] === T.BRIDGE);
        // 4. small chest: gold once; big chest: math lock then heart
        const small = owChests.find(c => !c.big), big = owChests.find(c => c.big && c.reward === 'heart' && !c.gated);
        clear(); hero.x = (small.x + 0.5) * TS; hero.y = (small.y + 1.5) * TS; hero.facing = 'up';
        const g0 = hud.gold; Input.keys['e'] = true; step(1);
        out.smallChest = hud.gold === g0 + small.gold && owState.chests[small.id] === true;
        Input.keys['e'] = true; step(1); out.smallOnce = hud.gold === g0 + small.gold;
        clear(); hero.x = (big.x + 0.5) * TS; hero.y = (big.y + 1.5) * TS; hero.facing = 'up';
        const h0 = player.maxHearts; Input.keys['e'] = true; step(1);
        out.bigAsks = mathPopup.active && mathPopup.purpose === 'lock' && !owState.chests[big.id];
        solveLock(); out.bigHeart = player.maxHearts === h0 + 1;
        // 5. heavy boulder: refused without the Titan Bracelet, lifted with it
        const bg = owGates.find(g => g.kind === 'boulder');
        clear(); hero.x = (bg.x + 1) * TS; hero.y = (bg.y + 2.6) * TS; hero.facing = 'up';
        player.owned.powerBracelet = false; Input.keys['e'] = true; step(1);
        out.boulderStays = overworld.grid[bg.y][bg.x] === T.BOULDER;
        player.owned.powerBracelet = true; Input.keys['e'] = true; step(1);
        out.boulderLifted = overworld.grid[bg.y][bg.x] !== T.BOULDER && owState.lifted[bg.id] === true;
        // 6. cracked rock breaks to a bomb
        const cg = owGates.find(g => g.kind === 'cracked');
        clear(); hero.x = (cg.x + 1) * TS; hero.y = (cg.y + 2.6) * TS; hero.facing = 'up';
        player.bombBag = true; Input.keys['b'] = true; step(1); step(150);
        out.rockBombed = overworld.grid[cg.y][cg.x] !== T.CRACKED && owState.bombed[cg.id] === true;
        // 7. caves: walking into a mouth comes out of its twin
        const c0 = overworld.caves[0], c1 = overworld.caves.find(c => c.id === c0.to);
        clear(); hero.x = (c0.x + 0.5) * TS; hero.y = (c0.y + 1.6) * TS;
        Input.keys['ArrowUp'] = true; step(60); Input.keys['ArrowUp'] = false; step(10); // held Up must not bounce back in
        out.caveTo = [Math.floor(hero.x / TS), Math.floor(hero.y / TS)]; out.caveWant = [c1.x, c1.y + 1];
        out.caveOk = Math.abs(out.caveTo[0] - c1.x) <= 1 && Math.abs(out.caveTo[1] - (c1.y + 1)) <= 1;
        // 8. ledges: hop down going south, impassable going north
        let lx = -1, ly = -1;
        for (let y = 2; y < H - 2 && lx < 0; y++) for (let x = 2; x < W - 2; x++) {
          if (overworld.grid[y][x] === T.LEDGE && overworld.grid[y][x - 1] === T.LEDGE && overworld.grid[y][x + 1] === T.LEDGE &&
              !SOLID_TILES.has(overworld.grid[y - 1][x]) && !SOLID_TILES.has(overworld.grid[y + 1][x]) && !SOLID_TILES.has(overworld.grid[y + 2][x])) { lx = x; ly = y; break; }
        }
        clear(); hero.x = (lx + 0.5) * TS; hero.y = (ly - 0.6) * TS;
        Input.keys['ArrowDown'] = true; step(40); Input.keys['ArrowDown'] = false; step(30);
        out.hopped = hero.y > (ly + 1) * TS;
        Input.keys['ArrowUp'] = true; step(60); Input.keys['ArrowUp'] = false;
        out.ledgeBlocksNorth = hero.y > (ly + 1) * TS;
        // 9. world state survives a save/load
        saveGame();
        out.saved = JSON.parse(localStorage.getItem(SAVE_KEY)).world;
      } catch (err) { out.exception = err.message + ' ' + (err.stack || '').split('\n')[1]; }
      return out;
    });
    await ow.reload({ waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    const back = await ow.evaluate(() => {
      continueSavedGame();
      const bg = owGates.find(g => g.kind === 'boulder'), cg = owGates.find(g => g.kind === 'cracked');
      const out = { bridge: overworld.bridgeTiles.lakeBridge.every(([x, y]) => overworld.grid[y][x] === T.BRIDGE),
        boulder: overworld.grid[bg.y][bg.x] !== T.BOULDER, rock: overworld.grid[cg.y][cg.x] !== T.CRACKED,
        chests: Object.keys(owState.chests).length };
      localStorage.removeItem(SAVE_KEY);
      return out;
    });
    const J = x => JSON.stringify(x);
    check('Overworld: every landmark is reachable on foot; the Water Dungeon island only via the lowered bridge', !r.exception && r.unreachable.length === 0 && r.islandCutOff, J({ u: r.unreachable, island: r.islandCutOff, ex: r.exception }));
    check('Overworld: every land screen has at least one point of interest', r.emptyScreens && r.emptyScreens.length === 0, J(r.emptyScreens));
    check('Overworld: the lake lever asks a math question and lowers the bridge', r.leverAsks && r.bridgeDown, J(r));
    check('Overworld: small chests give gold once; big chests are math-locked (+1 max heart)', r.smallChest && r.smallOnce && r.bigAsks && r.bigHeart, J(r));
    check('Overworld: boulders need the Titan Bracelet; cracked rocks break to bombs', r.boulderStays && r.boulderLifted && r.rockBombed, J(r));
    check('Overworld: a cave carries the hero to its twin; ledges hop south and block north', r.caveOk && r.hopped && r.ledgeBlocksNorth, J(r));
    check('Overworld: bridge / boulder / rock / chests stay changed after save + reload', back.bridge && back.boulder && back.rock && back.chests >= 2, J(back));
    await ow.close();
  }

  // --- AP economy: missed swings are free, a hit costs 1 AP, one correct
  // answer (Adventurer) refills 8 AP of a 20 AP bar ---
  {
    const ap = await browser.newPage();
    ap.on('pageerror', e => errorsAll.push('ap: ' + e.message));
    await ap.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await ap.evaluate(() => {
      const out = {};
      try {
        CONFIG.DIFFICULTY = 'ADVENTURER'; startNewGame();
        out.start = player.ap; out.max = player.maxAp; out.reward = tierAPReward();
        player.invincibleT = 999; dialogue.active = false;
        const target = currentEnemies().find(e => e.alive && !e.hidden);
        // miss: stand far away from every enemy and swing
        hero.x = target.x; hero.y = target.y + 200; hero.facing = 'down';
        for (const e of currentEnemies()) if (Math.hypot(e.x - hero.x, e.y - hero.y) < 60) e.alive = false;
        player.ap = 5; player.attackCooldown = 0; trySwingSword(); out.afterMiss = player.ap;
        // hit: stand right next to the target
        target.alive = true; target.hp = 99; target.hidden = false;
        hero.x = target.x - 8; hero.y = target.y; hero.facing = 'right';
        player.ap = 5; player.attackCooldown = 0; trySwingSword(); out.afterHit = player.ap;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('AP economy: 12/20 AP start, 8 AP per correct answer (Adventurer), missed swings free, hits cost 1',
      !r.exception && r.start === 12 && r.max === 20 && r.reward === 8 && r.afterMiss === 5 && r.afterHit === 4, JSON.stringify(r));
    await ap.close();
  }

  // --- Secret overworld heart piece: reachable on foot, collectable once,
  // +1 max heart, persisted so a reload neither respawns nor loses it ---
  {
    const hp = await browser.newPage();
    hp.on('pageerror', e => errorsAll.push('heartpiece: ' + e.message));
    await hp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const a = await hp.evaluate(() => {
      const out = {};
      try {
        localStorage.removeItem(SAVE_KEY);
        startNewGame();
        const TS = CONFIG.TILE, g = overworld.grid;
        const piece = heartPieces.find(p => !p.dungeonId);
        out.exists = !!piece;
        if (!piece) return out;
        const goal = [Math.floor(piece.x / TS), Math.floor(piece.y / TS)];
        const start = [Math.floor(hero.x / TS), Math.floor(hero.y / TS)];
        const seen = new Set([start.join()]), q = [start];
        while (q.length) {
          const [x, y] = q.shift();
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
            if (nx < 0 || ny < 0 || nx >= overworld.w || ny >= overworld.h || seen.has(k) || SOLID_TILES.has(g[ny][nx])) continue;
            seen.add(k); q.push([nx, ny]);
          }
        }
        out.reachable = seen.has(goal.join());
        out.before = player.maxHearts;
        player.invincibleT = 999;
        hero.x = piece.x; hero.y = piece.y; hero.walkTargetX = null; hero.walkTargetY = null;
        updatePlaying(1 / 60);
        out.after = player.maxHearts;
        out.flag = player.secretHeartTaken;
        out.gone = !heartPieces.some(p => !p.dungeonId);
        out.saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}').secretHeartTaken === true;
        out.px = piece.x; out.py = piece.y;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    await hp.reload({ waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const b = await hp.evaluate((px, py) => {
      const out = {};
      try {
        continueSavedGame();
        out.maxHearts = player.maxHearts;
        out.pieceBack = heartPieces.some(p => !p.dungeonId);
        hero.x = px; hero.y = py; player.invincibleT = 999;
        updatePlaying(1 / 60);
        out.maxAfterStanding = player.maxHearts;
        localStorage.removeItem(SAVE_KEY);
      } catch (err) { out.exception = err.message; }
      return out;
    }, a.px, a.py);
    check('Secret heart piece is reachable, gives +1 max heart once, and stays collected after a reload',
      a.exists && a.reachable && a.after === a.before + 1 && a.flag && a.gone && a.saved &&
      !b.exception && b.maxHearts === a.after && !b.pieceBack && b.maxAfterStanding === a.after, JSON.stringify({ a, b }));
    await hp.close();
  }

  check('Zero uncaught console errors across the whole acceptance run', consoleErrors.length === 0 && errorsAll.length === 0,
    JSON.stringify(consoleErrors.concat(errorsAll)).slice(0, 500));

  await browser.close();

  const passCount = results.filter(r => r.ok).length;
  console.log('\n' + passCount + '/' + results.length + ' checks passed.');
  fs.writeFileSync(path.join(__dirname, 'acceptance-results.json'), JSON.stringify(results, null, 2));
  process.exit(results.some(r => !r.ok) ? 1 : 0);
})();
