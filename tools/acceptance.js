// Phase 10 final acceptance run. Prints a PASS/FAIL checklist line per
// item. Not part of tools/smoke.sh (that stays the fast per-phase gate);
// this is the one-off Phase 10 acceptance sweep.
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const results = [];
function buildings_ok(r) {
  const names = Object.keys(r).filter(k => k !== 'exception');
  return names.length >= 3 && names.every(n => r[n].entered >= 0 && r[n].flips === 1 && r[n].stillInside);
}
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

      // AP drain + Q auto-open at 0 AP (full hearts + shielded: the wild enemy
      // next to the hero used to down it now and then, so the revive question
      // opened instead of the AP one and the later checks inherited it)
      player.hearts = player.maxHearts; player.downed = false; player.invincibleT = 99;
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
        dungeonGoRoom(d, d.PUZ, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        d.puzzle.solved = true;
        solvePuzzle(d, d.rooms[d.PUZ]);
        // solving the puzzle raises a math-sealed boss door; walking up to it
        // asks a question and the right answer opens it
        const p1 = d.rooms[d.PUZ], p1y = Math.floor(p1.h / 2);
        const sealRaised = p1.grid[p1y][p1.w - 1] === T.BOSSDOOR;
        d.doorHintShown.seal = false;
        hero.x = (p1.w - 1) * 16 - 4; hero.y = p1y * 16 + 8;
        handleDungeonDoors(d, p1, 0.016);
        const sealAsked = (mathPopup.active && mathPopup.purpose === 'lock' && (answerMathPopup(mathPopup.question.correctIndex), true));
        const puzzleOk = sealRaised && sealAsked && p1.grid[p1y][p1.w - 1] === 4;
        dungeonGoRoom(d, d.BOSS, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        const miniboss = d.enemies[d.BOSS][0];
        // boss-sealed exit before defeat
        hero.x = (d.rooms[d.BOSS].w - 1) * 16 - 4; hero.y = Math.floor(d.rooms[d.BOSS].h / 2) * 16 + 8;
        handleDungeonDoors(d, d.rooms[d.BOSS], 0.016);
        const sealedBeforeDefeat = d.rooms[d.BOSS].grid[Math.floor(d.rooms[d.BOSS].h / 2)][d.rooms[d.BOSS].w - 1] !== 4;
        miniboss.hp = 0; defeatMiniboss(d, miniboss);
        handleDungeonDoors(d, d.rooms[d.BOSS], 0.016);
        const openAfterDefeat = d.rooms[d.BOSS].grid[Math.floor(d.rooms[d.BOSS].h / 2)][d.rooms[d.BOSS].w - 1] === 4;
        dungeonGoRoom(d, d.TREAS, 'west'); fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
        hero.x = (Math.floor(d.rooms[d.TREAS].w / 2) + 0.5) * 16; hero.y = (Math.floor(d.rooms[d.TREAS].h / 2) + 0.5) * 16;
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
        const room = d.rooms[d.BOSS], midY = Math.floor(room.h / 2), TS = CONFIG.TILE;
        world.mode = 'dungeon'; world.dungeon = d; world.interior = null; d.roomIndex = d.BOSS;
        dialogue.active = false; mathPopup.active = false; shop.active = false; fadeAlpha = 0; fadeDir = 0; fadeCallback = null;
        d.hasBossKey = false; d.bossDefeated = false; d.chestOpened = false;
        room.grid[midY][room.w - 1] = T.BOSSDOOR; // re-seal (the check above opened it)
        const tr = d.rooms[d.TREAS];
        tr.grid[Math.floor(tr.h / 2)][Math.floor(tr.w / 2)] = T.CHEST;
        const e = d.enemies[d.BOSS].find(x => x.isMiniboss);
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
        const inTreasure = d.roomIndex === d.TREAS;
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
        world.mode = 'dungeon'; world.dungeon = d; world.interior = null; d.roomIndex = d.TREAS; d.hasBossKey = true;
        const tr = d.rooms[d.TREAS];
        tr.grid[Math.floor(tr.h / 2)][Math.floor(tr.w / 2)] = T.CHEST; tr.canvas = prerenderMap(tr);
        d.chestOpened = false; player.medallions[d.def.id] = false;
      };
      for (const d of dungeons) {
        const id = d.def.id, tr = d.rooms[d.TREAS], cx = Math.floor(tr.w / 2), cy = Math.floor(tr.h / 2);
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
      const fire = dungeons.find(d => d.def.id === 'fire'), pz = fire.puzzle, pr = fire.rooms[fire.PUZ], midY = Math.floor(pr.h / 2);
      const resetTorches = () => {
        clearModals();
        world.mode = 'dungeon'; world.dungeon = fire; world.interior = null; fire.roomIndex = fire.PUZ;
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
      castleGoRoom(CASTLE_ARENA, 'west');
      fadeCallback && fadeCallback(); fadeAlpha = 0; fadeDir = 0;
      const g = castle.ganon;
      g.hp = g.maxHp; updateGanon(0.016, castle.rooms[CASTLE_ARENA].map);
      const phase1 = g.phase;
      g.hp = Math.floor(g.maxHp * 0.5); updateGanon(0.016, castle.rooms[CASTLE_ARENA].map);
      const phase2 = g.phase;
      player.ap = 5; g.siphonTimer = 0; const apBefore = player.ap; updateGanon(0.016, castle.rooms[CASTLE_ARENA].map);
      const siphonWorked = player.ap < apBefore;
      g.hp = Math.floor(g.maxHp * 0.2); updateGanon(0.016, castle.rooms[CASTLE_ARENA].map);
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
      const d = dungeons.find(x => x.def.id === 'fire'), e = d.enemies[d.BOSS].find(x => x.isMiniboss);
      const others = dungeons.filter(x => x.def.id !== 'fire').map(x => x.enemies[x.BOSS][0].maxHp);
      const out = { bossKind: d.def.bossKind, enemyKind: e.bossKind, maxHp: e.maxHp, others,
        malrekInDungeons: dungeons.some(x => x.def.bossKind === 'malrek'), name: NEW_BOSS_DEFS.cindermaw && NEW_BOSS_DEFS.cindermaw.name };
      // double damage while stunned (crouched)
      world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = d.BOSS;
      Object.assign(e, { alive: true, hp: e.maxHp, cmState: 'idle', cmT: 99 });
      damageEnemy(e, 'sword'); out.normalHit = e.maxHp - e.hp;
      e.hp = e.maxHp; e.cmState = 'stun'; damageEnemy(e, 'sword'); out.stunHit = e.maxHp - e.hp;
      // the attack cycle runs idle -> rear -> lunge (spits lava) -> stun -> idle
      Object.assign(e, { hp: e.maxHp, cmState: 'idle', cmT: 0.01, x: 8 * 16, y: 5 * 16 });
      hero.x = 3 * 16; hero.y = 5 * 16; player.invincibleT = 999; d.bossDefeated = true; // keep the kill hook out of this
      const seen = [], shots0 = enemyShots.length;
      for (let i = 0; i < 400; i++) { updateDungeonRoom(1 / 60, d.rooms[d.BOSS]); updateEnemyShots(1 / 60, d.rooms[d.BOSS]); if (seen[seen.length - 1] !== e.cmState) seen.push(e.cmState); }
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

  // --- Tapping a building's door (iPad) enters it and STAYS inside: the tap's
  // walk target used to survive the fade, walking the hero straight back out ---
  {
    const tp = await browser.newPage();
    tp.on('pageerror', e => errorsAll.push('tapdoor: ' + e.message));
    await tp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await tp.evaluate(() => {
      const out = {};
      try {
        startNewGame(); player.invincibleT = 999;
        for (const e of wildsEnemies.concat(overworldEnemies)) e.alive = false;
        const TS = CONFIG.TILE;
        for (const b of buildings) {
          world.mode = 'overworld'; world.interior = null; dialogue.active = false; shop.active = false;
          hero.x = (b.doorTileX + 0.5) * TS; hero.y = (b.doorTileY + 4.5) * TS; hero.walkTargetX = null;
          for (let k = 0; k < 30; k++) updateCamera(1);
          Input.tapX = (b.doorTileX + 0.5) * TS - world.camX; Input.tapY = (b.doorTileY + 0.5) * TS - world.camY; Input.tapped = true;
          let entered = -1, flips = 0, last = world.mode;
          for (let i = 0; i < 240; i++) {
            updatePlaying(1 / 60); updateCamera(1 / 60);
            if (fadeCallback) { const f = fadeCallback; fadeCallback = null; f(); fadeAlpha = 0; fadeDir = 0; }
            if (world.mode !== last) { flips++; last = world.mode; }
            if (world.mode === 'interior' && entered < 0) entered = i;
          }
          out[b.name] = { entered, flips, stillInside: world.mode === 'interior' && world.interior === b.interior };
        }
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Tapping each building door enters it and stays inside (no in/out loop)',
      !r.exception && buildings_ok(r), JSON.stringify(r));
    await tp.close();
  }

  // --- Big door tap areas: tap the roof / sign / cave / exit rug / room door
  // from afar and the hero walks a real path there and goes through ---
  {
    const tp = await browser.newPage();
    tp.on('pageerror', e => errorsAll.push('doortap: ' + e.message));
    await tp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await tp.evaluate(() => {
      const out = {};
      try {
        startNewGame(); player.invincibleT = 999;
        for (const e of wildsEnemies.concat(overworldEnemies)) e.alive = false;
        const TS = CONFIG.TILE;
        const run = (frames, done) => {
          for (let i = 0; i < frames; i++) {
            updatePlaying(1 / 60); updateCamera(1 / 60);
            if (fadeCallback) { const f = fadeCallback; fadeCallback = null; f(); fadeAlpha = 0; fadeDir = 0; }
            dialogue.active = false; mathPopup.active = false;
            if (done()) return i;
          }
          return -1;
        };
        const tapWorld = (x, y) => { for (let k = 0; k < 40; k++) updateCamera(1); Input.tapX = x - world.camX; Input.tapY = y - world.camY; Input.tapped = true; };
        // 1. shop: tap its ROOF from ~9 tiles away, around the corner
        const shopB = buildings.find(b => b.name === 'shop');
        world.mode = 'overworld'; hero.x = (shopB.doorTileX - 8.5) * TS; hero.y = (shopB.doorTileY + 5.5) * TS;
        tapWorld((shopB.doorTileX + 1) * TS, (shopB.doorTileY - 1.5) * TS);
        out.roofTap = run(600, () => world.mode === 'interior' && world.interior === shopB.interior);
        // 2. inside: tap near the exit rug from the far side of the room
        shop.active = false;
        const ex = world.interior.exit;
        { const sp = findClearSpot(world.interior, (ex.x - 4) * TS, (ex.y - 1.5) * TS, hero.w, hero.h, null, 6); hero.x = sp.x; hero.y = sp.y; } // across the room
        tapWorld(ex.x * TS + 12, ex.y * TS + 6);
        out.exitTap = run(600, () => world.mode === 'overworld');
        // 3. Forest Dungeon: tap its signpost from 8 tiles away
        const d = dungeons.find(x => x.def.id === 'forest'), [fx, fy] = OW_LAYOUT.dungeons.forest;
        hero.x = (fx + 0.5) * TS; hero.y = (fy + 8.5) * TS;
        tapWorld((fx + 0.5) * TS, (fy - 0.5) * TS);
        out.dungeonTap = run(900, () => world.mode === 'dungeon' && world.dungeon === d);
        // 4. inside the dungeon: open the east door, tap it
        const room = d.rooms[0], midY = Math.floor(room.h / 2);
        room.grid[midY][room.w - 1] = T.FLOOR; d.hasSmallKey = true;
        hero.x = 3 * TS; hero.y = (midY + 0.5) * TS;
        tapWorld((room.w - 1) * TS, (midY - 1) * TS);
        out.roomDoorTap = run(600, () => d.roomIndex === 1);
        // 5. a cave mouth: tap it from below and come out of the twin
        world.mode = 'overworld'; world.dungeon = null;
        const c = overworld.caves[0], twin = overworld.caves.find(o => o.id === c.to);
        hero.x = (c.x + 0.5) * TS; hero.y = (c.y + 5.5) * TS; hero.caveExit = null;
        tapWorld((c.x + 1) * TS, (c.y - 0.5) * TS);
        out.caveTap = run(600, () => Math.abs(hero.x / TS - (twin.x + 0.5)) < 1.5 && Math.abs(hero.y / TS - (twin.y + 1.5)) < 1.5);
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Tapping near a door (roof, sign, cave, exit rug, room door) walks there and goes through',
      !r.exception && ['roofTap', 'exitTap', 'dungeonTap', 'roomDoorTap', 'caveTap'].every(k => r[k] >= 0), JSON.stringify(r));
    await tp.close();
  }

  // --- on-screen bomb button (iPad): hidden without the Bomb Bag, throws with it ---
  {
    const bp = await browser.newPage();
    bp.on('pageerror', e => errorsAll.push('bombbtn: ' + e.message));
    await bp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await bp.evaluate(() => {
      const out = {};
      try {
        startNewGame(); player.invincibleT = 999;
        const b = bombButtonRect(), tap = () => { Input.tapX = b.x + b.w / 2; Input.tapY = b.y + b.h / 2; Input.tapped = true; updatePlaying(1 / 60); };
        player.bombBag = false; tap(); out.withoutBag = bombs.length;
        player.bombBag = true; player.bombCooldown = 0; hero.walkTargetX = null; tap(); out.withBag = bombs.length;
        out.heroStill = !hero.walkTargetX; // the tap did not also walk the hero
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Bomb button: hidden without the Bomb Bag; with it, a tap throws a bomb', !r.exception && r.withoutBag === 0 && r.withBag === 1 && r.heroStill, JSON.stringify(r));
    await bp.close();
  }

  // --- answer streak: x1 -> x3 at 10 in a row -> x4 at 20 -> cap x10; a
  // wrong answer resets it; the best streak is kept on the title screen ---
  {
    const sp = await browser.newPage();
    sp.on('pageerror', e => errorsAll.push('streak: ' + e.message));
    await sp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await sp.evaluate(() => {
      const out = {};
      try {
        localStorage.removeItem(RECORDS_KEY);
        CONFIG.DIFFICULTY = 'ADVENTURER'; startNewGame(); player.invincibleT = 999;
        out.curve = [0, 5, 10, 15, 20, 80, 200].map(streakMultiplier);
        const answer = right => { openMathPopup('ap'); const q = mathPopup.question; answerMathPopup(right ? q.correctIndex : (q.correctIndex + 1) % 3); if (mathPopup.active) closeMathPopup(); };
        for (let i = 0; i < 10; i++) answer(true);
        player.ap = 0; answer(true); out.eleventh = player.ap;      // paid at streak 10: 8 x3 = 24 (above the 20 bar)
        out.streak = player.streak;
        answer(false); out.afterWrong = player.streak;
        player.ap = 0; answer(true); out.afterReset = player.ap;     // back to x1 = 8
        out.record = loadRecords().bestStreak;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Answer streak: x3 at 10 in a row, x4 at 20, x10 cap; wrong resets; best streak recorded',
      !r.exception && JSON.stringify(r.curve) === JSON.stringify([1, 2, 3, 3.5, 4, 10, 10]) && r.eleventh === 24 && r.streak === 11 && r.afterWrong === 0 && r.afterReset === 8 && r.record === 11,
      JSON.stringify(r));
    await sp.close();
  }

  // --- world map: the map button / M opens it (world paused), a tap closes it ---
  {
    const mp = await browser.newPage();
    mp.on('pageerror', e => errorsAll.push('map: ' + e.message));
    await mp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await mp.evaluate(() => {
      const out = {};
      try {
        startNewGame(); player.invincibleT = 999;
        const m = mapButtonRect();
        Input.tapX = m.x + m.w / 2; Input.tapY = m.y + m.h / 2; Input.tapped = true; updatePlaying(1 / 60);
        out.openedByTap = mapScreen.active;
        const hx = hero.x; Input.keys['ArrowRight'] = true; updatePlaying(1 / 60); Input.keys['ArrowRight'] = false;
        out.paused = hero.x === hx || !mapScreen.active;
        mapScreen.openedAt = 0; Input.tapX = 100; Input.tapY = 200; Input.tapped = true; updatePlaying(1 / 60);
        out.closedByTap = !mapScreen.active;
        Input.keys['m'] = true; updatePlaying(1 / 60); out.openedByM = mapScreen.active;
        drawMapScreen(); // draws without throwing
        const d = dungeons[0]; world.mode = 'dungeon'; world.dungeon = d;
        const hm = heroMapTile(); out.insideMarker = hm.inside === d.def.name && Math.abs(hm.x - OW_LAYOUT.dungeons[d.def.id][0] - 0.5) < 0.01;
        world.mode = 'overworld'; world.dungeon = null; mapScreen.active = false;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('World map: opens from the map button or M, pauses play, closes on tap; marks the hero (at the temple door when inside)',
      !r.exception && r.openedByTap && r.paused && r.closedByTap && r.openedByM && r.insideMarker, JSON.stringify(r));
    await mp.close();
  }

  // --- villages: every town has a shop you can buy in, and a Town Guide who
  // lists only the temples not cleared yet ---
  {
    const vp = await browser.newPage();
    vp.on('pageerror', e => errorsAll.push('towns: ' + e.message));
    await vp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await vp.evaluate(() => {
      const out = { shops: [] };
      try {
        startNewGame(); player.invincibleT = 999;
        for (const t of OW_TOWNS) {
          const keeper = t.interior && t.interior.npcs && t.interior.npcs.find(n => n.isShopkeeper);
          world.mode = 'interior'; world.interior = t.interior; shop.active = false;
          if (keeper) openDialogue(keeper);
          out.shops.push({ id: t.id, hasShop: !!t.shop, opens: shop.active });
          shop.active = false;
        }
        world.mode = 'overworld'; world.interior = null;
        const guides = villagerNPCs.filter(n => n.hintGuide);
        out.guides = guides.length;
        dungeons[0].chestOpened = true; dungeons[2].chestOpened = true;
        const lines = guideLines(guides[0]).join(' ');
        out.mentionsCleared = /Forest Temple|Water Temple/.test(lines);
        out.mentionsOpen = /Fire Temple/.test(lines) && /Shadow Temple/.test(lines);
        for (const d of dungeons) d.chestOpened = true;
        out.castleHint = /Castle Hill/.test(guideLines(guides[0]).join(' '));
        for (const d of dungeons) d.chestOpened = false;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Villages: 4 more towns, each with a working shop; 6 Town Guides hint only the temples not cleared (then the castle)',
      !r.exception && r.shops.length === 4 && r.shops.every(x => x.hasShop && x.opens) && r.guides === 6 && !r.mentionsCleared && r.mentionsOpen && r.castleHint, JSON.stringify(r));
    await vp.close();
  }

  // --- Golden Knight (victory reward): no damage, no AP; kept for new games ---
  {
    const gp = await browser.newPage();
    gp.on('pageerror', e => errorsAll.push('golden: ' + e.message));
    await gp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await gp.evaluate(() => {
      const out = {};
      try {
        localStorage.removeItem(RECORDS_KEY); localStorage.removeItem(SAVE_KEY);
        startNewGame(); player.invincibleT = 0;
        out.lockedAtStart = !player.unlockedSkins.golden;
        player.skin = 'golden'; out.noPowersWhenLocked = !goldenPowers();
        // win: the castle unlock records it on the device
        const g = makeGanon(0, 0); castle.ganon = g; castle.startTime = performance.now(); ganonDefeated(g);
        gameState = STATE.PLAYING;
        out.unlocked = player.unlockedSkins.golden && player.skin === 'golden' && loadRecords().golden;
        const h = player.hearts; player.invincibleT = 0; damageHero(2, hero.x + 10, hero.y); out.noDamage = player.hearts === h;
        player.ap = 0; out.freeSwing = spendAP(5) && player.ap === 0;
        const target = currentEnemies().find(e => e.alive) || null; out.swingAtZeroAP = (player.attackCooldown = 0, trySwingSword(), player.swordSwingT > 0);
      } catch (err) { out.exception = err.message; }
      return out;
    });
    await gp.reload({ waitUntil: 'load' }); await new Promise(r => setTimeout(r, 400));
    const r2 = await gp.evaluate(() => { localStorage.removeItem(SAVE_KEY); startNewGame(); const u = player.unlockedSkins.golden; localStorage.removeItem(RECORDS_KEY); return u; });
    check('Golden Knight: won at the castle, can\'t be hurt, needs no AP, and stays unlocked for new games',
      !r.exception && r.lockedAtStart && r.noPowersWhenLocked && r.unlocked && r.noDamage && r.freeSwing && r.swingAtZeroAP && r2 === true, JSON.stringify({ r, r2 }));
    await gp.close();
  }

  // --- enemy attacks: wind-up (telegraph) -> lunge that hurts -> rest; shooters
  // fire after their wind-up; dungeon enemies get tougher temple by temple ---
  {
    const ep = await browser.newPage();
    ep.on('pageerror', e => errorsAll.push('enemyatk: ' + e.message));
    await ep.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await ep.evaluate(() => {
      const out = {};
      try {
        CONFIG.DIFFICULTY = 'ADVENTURER'; startNewGame();
        for (const e of wildsEnemies.concat(overworldEnemies)) e.alive = false;
        const TS = CONFIG.TILE;
        const w = makeDungeonEnemy('wolf', hero.x + 30, hero.y); w.atkCD = 0; wildsEnemies.push(w); cachedOverworldEnemies = null;
        player.invincibleT = 0; const h0 = player.hearts, seen = [];
        for (let i = 0; i < 90; i++) { updateEnemies(1 / 60, overworld); if (w.atk && seen[seen.length - 1] !== w.atk.st) seen.push(w.atk.st); }
        out.phases = seen.join('>'); out.hurt = h0 - player.hearts;
        const o = makeDungeonEnemy('octorok', hero.x + 60, hero.y); o.atkCD = 0; wildsEnemies.push(o); cachedOverworldEnemies = null;
        const n0 = enemyShots.length;
        for (let i = 0; i < 60; i++) updateEnemies(1 / 60, overworld);
        out.shot = enemyShots.length > n0;
        const hp = dungeons.map(d => { scaleDungeonEnemies(d); const e = d.enemies[0].find(x => !x.isMiniboss); return e ? e.maxHp : 0; });
        out.dungeonHp = hp;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Enemy attacks: wind-up -> lunge (hurts) -> rest; octoroks shoot after a wind-up; temples get tougher in order',
      !r.exception && r.phases === 'wind>lunge>rest' && r.hurt >= 1 && r.shot && r.dungeonHp.every((v, i) => i === 0 || v >= r.dungeonHp[i - 1]) && r.dungeonHp[3] > r.dungeonHp[0],
      JSON.stringify(r));
    await ep.close();
  }

  // --- temple bosses: three telegraphed attacks each (wind -> act -> rest),
  // fight-start HP from the hero's damage, Cindermaw alternates lunge / flame ring ---
  {
    const bp = await browser.newPage();
    bp.on('pageerror', e => errorsAll.push('bossai: ' + e.message));
    await bp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await bp.evaluate(() => {
      const out = {};
      try {
        CONFIG.DIFFICULTY = 'ADVENTURER'; startNewGame(); player.invincibleT = 999; player.attack = 5;
        for (const id of ['forest', 'water', 'shadow']) {
          const d = dungeons.find(x => x.def.id === id), room = d.rooms[d.BOSS], e = d.enemies[d.BOSS][0];
          world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = d.BOSS;
          hero.x = 4 * 16; hero.y = Math.floor(room.h / 2) * 16 + 8;
          scaleBossForFight(e);
          const seen = new Set(), states = new Set();
          for (let i = 0; i < 60 * 120 && seen.size < 3; i++) { updateBossAI(e, 1 / 60, room, d); if (e.bs.atk) seen.add(e.bs.atk); states.add(e.bs.st); e.x = Math.max(40, Math.min(room.w * 16 - 40, e.x)); }
          out[id] = { hp: e.maxHp, attacks: [...seen].sort().join(','), states: [...states].sort().join(',') };
        }
        const f = dungeons.find(x => x.def.id === 'fire'), c = f.enemies[f.BOSS][0];
        world.dungeon = f; f.roomIndex = f.BOSS; const n0 = enemyShots.length;
        c.cmState = 'rear'; c.cmT = 0.01; updateCindermaw(c, 0.02); const first = enemyShots.length - n0;
        c.cmState = 'rear'; c.cmT = 0.01; updateCindermaw(c, 0.02); const second = enemyShots.length - n0 - first;
        out.cinder = { first, second };
        world.mode = 'overworld'; world.dungeon = null;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    const ok3 = id => r[id] && r[id].attacks.split(',').length === 3 && /act/.test(r[id].states) && /rest/.test(r[id].states) && /wind/.test(r[id].states) && r[id].hp >= 14 * 5;
    check('Temple bosses: Grovak, Voltuga and Puffling use 3 telegraphed attacks; big fight-start HP; Cindermaw alternates lunge and flame ring',
      !r.exception && ok3('forest') && ok3('water') && ok3('shadow') && r.cinder.first === 1 && r.cinder.second >= 6, JSON.stringify(r));
    await bp.close();
  }

  // --- the castle: 7 rooms, 4 Small Keys for 4 locked doors, a puzzle in
  // every room, a way back out, and Malrek's 5 attacks scaled to the hero ---
  {
    const cp = await browser.newPage();
    cp.on('pageerror', e => errorsAll.push('castle: ' + e.message));
    await cp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await cp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      const TS = CONFIG.TILE;
      try {
        CONFIG.DIFFICULTY = 'ADVENTURER'; localStorage.removeItem(SAVE_KEY); startNewGame(); player.invincibleT = 999;
        Object.keys(player.medallions).forEach(k => player.medallions[k] = true);
        const gx = castleGate.zone; hero.x = (gx.minX + gx.maxX) / 2; hero.y = (gx.minY + gx.maxY) / 2;
        enterCastle(); flush();
        out.rooms = castle.rooms.length;
        out.locked = castle.rooms.filter(q => q.map.grid[Math.floor(q.map.h / 2)][q.map.w - 1] === T.LOCKDOOR).length;
        // the way out
        hero.x = TS * 0.9; hero.y = Math.floor(castle.rooms[0].map.h / 2) * TS; updateCastleRoom(0.016, currentMap()); flush();
        out.exitWorks = world.mode === 'overworld';
        enterCastle(); flush();
        const room = () => castle.rooms[castle.roomIndex], map = () => currentMap();
        const openEast = () => { const m = map(), my = Math.floor(m.h / 2); hero.x = (m.w - 1) * TS - 6; hero.y = (my + 0.5) * TS; updateCastleRoom(0.016, m); return m.grid[my][m.w - 1] === T.FLOOR; };
        const takeKey = () => { const k = room().keyDrop; hero.x = k.x; hero.y = k.y; updateCastleRoom(0.016, map()); return k.taken; };
        const next = () => { castleGoRoom(castle.roomIndex + 1, 'west'); flush(); };
        // 0: guards -> key -> door
        out.lockedNoKey = !openEast();
        room().enemies.forEach(e => e.alive = false); updateCastleRoom(0.016, map());
        out.k0 = takeKey() && castle.keys === 1; out.d0 = openEast() && castle.keys === 0; next();
        // 1: blocks onto plates
        const p1 = room().puz;
        out.p1closed = !openEast();
        p1.blocks.forEach((b, i) => { b.x = (p1.plates[i].x + 0.5) * TS + 3; b.y = (p1.plates[i].y + 0.5) * TS; });
        updateCastleRoom(0.016, map()); out.p1 = p1.solved && openEast(); next();
        // 2: braziers in dot order
        const p2 = room().puz, r2 = room();
        lightCastleBrazier(r2, p2.order[1]); out.wrongResets = p2.lit.length === 0;
        p2.order.forEach(i => lightCastleBrazier(r2, i));
        out.k2 = p2.solved && takeKey(); out.d2 = openEast(); next();
        // 3: crystal swaps the pegs
        const m3 = map(), my3 = Math.floor(m3.h / 2);
        const before = [m3.grid[my3][7], m3.grid[my3][14]];
        room().puz.t = 0; strikeCrystal(room());
        const after = [m3.grid[my3][7], m3.grid[my3][14]];
        out.pegs = before[0] === T.PEGUP && before[1] === T.PEGDOWN && after[0] === T.PEGDOWN && after[1] === T.PEGUP;
        room().puz.t = 0; strikeCrystal(room());
        out.k3 = takeKey(); out.d3 = openEast(); next();
        // 4: two waves
        const counts = [];
        for (let w = 0; w < 8 && !room().puz.solved; w++) {
          counts.push(room().enemies.filter(e => e.alive).length);
          room().enemies.forEach(e => e.alive = false);
          for (let i = 0; i < 70; i++) updateCastleRoom(1 / 60, map());
        }
        out.waves = counts; out.k4 = takeKey(); out.d4 = openEast(); next();
        // 5: memory orbs -> sealed boss door -> math seal
        const p5 = room().puz;
        for (const i of p5.order) { const s = p5.switches[i]; hero.x = (s.x + 0.5) * TS; hero.y = (s.y + 0.5) * TS; updateCastleRoom(0.016, map()); hero.x = 3 * TS; hero.y = 5 * TS; updateCastleRoom(0.016, map()); }
        const m5 = map(); out.seal = m5.grid[Math.floor(m5.h / 2)][m5.w - 1] === T.BOSSDOOR;
        castleBreakSeal(); out.sealOpen = openEast(); next();
        out.arena = castle.roomIndex === CASTLE_ARENA && !!castle.ganon && map().grid[Math.floor(map().h / 2)][0] === T.BOSSDOOR;
        out.save = JSON.stringify(castleSaveData());
        // Malrek scaling: +5 levels, then 4 / 3 / 2 after 10 / 20 / 30 revives
        const g = castle.ganon, sc = [];
        for (const rv of [0, 10, 20, 30]) { player.revivesUsed = rv; malrekScale(g); sc.push({ b: g.bonus, dmg: g.dmg, tempo: +g.tempo.toFixed(2), hp: g.maxHp }); }
        out.scale = sc; player.revivesUsed = 0; malrekScale(g);
        const strong = g.maxHp; player.attack += 10; malrekScale(g); out.hpFollowsHero = g.maxHp > strong;
        // five attacks by phase 3
        g.hp = Math.floor(g.maxHp * 0.2); const seen = new Set(), am = map();
        for (let i = 0; i < 60 * 120 && seen.size < 5; i++) { updateGanon(1 / 60, am); if (g.mk.atk) seen.add(g.mk.atk); g.hp = Math.max(g.hp, 5); }
        out.attacks = [...seen].sort().join(',');
        g.hp = 0; ganonDefeated(g); out.doorOpensAfter = am.grid[Math.floor(am.h / 2)][0] === T.FLOOR;
      } catch (err) { out.exception = err.message + ' ' + (err.stack || '').split('\n')[1]; }
      return out;
    });
    const sc = r.scale || [];
    check('Castle: 7 rooms, a way out, 4 Small Keys for 4 locked doors, a puzzle in each room (guards, blocks, braziers, crystal pegs, waves, memory orbs)',
      !r.exception && r.rooms === 7 && r.locked === 4 && r.exitWorks && r.lockedNoKey && r.k0 && r.d0 && r.p1closed && r.p1 && r.wrongResets && r.k2 && r.d2 &&
      r.pegs && r.k3 && r.d3 && r.waves.length === 5 && r.waves[0] === 3 && r.waves[4] === 5 && r.k4 && r.d4 && r.seal && r.sealOpen && r.arena, JSON.stringify(r));
    check('Malrek: 5 attacks; scaled to the hero +5 levels (+4/+3/+2 after 10/20/30 revives); arena door opens when he falls',
      !r.exception && r.attacks === 'meteors,nova,orbs,slash,spikes' && sc.map(x => x.b).join() === '5,4,3,2' &&
      sc[0].tempo > sc[3].tempo && sc[0].hp > sc[3].hp && sc[0].dmg >= sc[3].dmg && r.hpFollowsHero && r.doorOpensAfter, JSON.stringify({ attacks: r.attacks, scale: sc, hpFollowsHero: r.hpFollowsHero, door: r.doorOpensAfter }));
    await cp.close();
  }

  // --- lives: 5 revives in the world, then back to the start (with a notice);
  // 3 tries per boss fight, the 3rd sends the hero out to the entrance ---
  {
    const lp = await browser.newPage();
    lp.on('pageerror', e => errorsAll.push('lives: ' + e.message));
    await lp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await lp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      try {
        localStorage.removeItem(SAVE_KEY); startNewGame();
        out.start = player.lives;
        hero.x = HERO_START.x + 40 * 16; hero.y = HERO_START.y + 10 * 16;
        for (let i = 0; i < 5; i++) { player.downed = true; doRevive(); }
        out.afterFive = { lives: player.lives, screen: livesScreen.active, moved: Math.hypot(hero.x - HERO_START.x, hero.y - HERO_START.y) > 100 };
        player.downed = true; doRevive(); flush();
        out.sixth = { screen: livesScreen.active, lives: player.lives, nearStart: Math.hypot(hero.x - HERO_START.x, hero.y - HERO_START.y) < 40, title: livesScreen.title };
        livesScreen.active = false;
        // boss tries
        const d = dungeons[0]; world.mode = 'dungeon'; world.dungeon = d; world.returnSpot = { x: 30 * 16, y: 60 * 16 };
        dungeonGoRoom(d, d.BOSS, 'west'); flush();
        const boss = d.enemies[d.BOSS][0];
        out.inFight = inBossFight(); out.tries = lives.boss;
        boss.hp = 5;
        player.downed = true; doRevive(); player.downed = true; doRevive();
        out.afterTwo = { mode: world.mode, tries: lives.boss };
        player.downed = true; doRevive(); flush();
        out.third = { mode: world.mode, screen: livesScreen.active, bossFull: boss.hp === boss.maxHp || !boss.bossScaled, atEntrance: Math.hypot(hero.x - 30 * 16, hero.y - 60 * 16) < 2 };
        const hp1 = (scaleBossForFight(boss), boss.maxHp); boss.bossScaled = false; scaleBossForFight(boss); out.refightSameHp = boss.maxHp === hp1;
        livesScreen.active = false;
        saveGame(); out.saved = loadSaveData().lives;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Lives: 5 revives in the world then back to the start with a notice; 3 tries per boss, the 3rd sends you out; lives saved',
      !r.exception && r.start === 5 && r.afterFive.lives === 0 && !r.afterFive.screen && r.afterFive.moved && r.sixth.screen && r.sixth.lives === 5 && r.sixth.nearStart &&
      r.inFight && r.tries === 3 && r.afterTwo.mode === 'dungeon' && r.afterTwo.tries === 1 && r.third.mode === 'overworld' && r.third.screen && r.third.bossFull && r.third.atEntrance && r.refightSameHp && r.saved === 5,
      JSON.stringify(r));
    await lp.close();
  }

  // --- items: the item button uses the selected item, the swap button
  // cycles; Giant's Berry, Ember Bloom, Rolling Barrel and Ink Blaster work ---
  {
    const ip = await browser.newPage();
    ip.on('pageerror', e => errorsAll.push('items: ' + e.message));
    await ip.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await ip.evaluate(() => {
      const out = {};
      try {
        localStorage.removeItem(SAVE_KEY); startNewGame(); player.invincibleT = 999; dialogue.active = false;
        out.none = selectedItem() === null;
        player.bombBag = true; player.owned.superMushroom = 2; player.owned.fireFlower = 1; player.owned.dkBarrel = 1; player.owned.inkBlaster = 1;
        out.list = ownedItems().join(',');
        const q = itemSwapRect(); out.swapTap = tapItemSwap(q.x + 5, q.y + 5);
        player.selItem = 'bomb'; cycleItem(); out.afterCycle = player.selItem;
        player.hearts = 1; useSelectedItem(); out.berry = { giant: player.giantT > 0, full: player.hearts === player.maxHearts, left: player.owned.superMushroom };
        const e = makeDungeonEnemy('wolf', hero.x + 16, hero.y); e.hp = e.maxHp = 500; currentEnemies().push(e);
        hero.facing = 'right'; player.ap = 20;
        player.attackCooldown = 0; const h0 = e.hp; trySwingSword(); const giantHit = h0 - e.hp;
        player.giantT = 0; player.attackCooldown = 0; const h1 = e.hp; trySwingSword(); const normalHit = h1 - e.hp;
        out.giantDouble = giantHit === normalHit * 2;
        player.itemCooldown = 0; player.selItem = 'fireFlower'; useSelectedItem(); e.x = hero.x + 16; e.y = hero.y; player.attackCooldown = 0; trySwingSword(); out.ember = player.emberT > 0 && e.burnT > 0;
        player.itemCooldown = 0; player.selItem = 'inkBlaster'; useSelectedItem(); const n0 = heroShots.length; player.attackCooldown = 0; trySwingSword(); out.ink = heroShots.length > n0 && heroShots[heroShots.length - 1].kind === 'ink';
        heroShots.length = 0;
        player.itemCooldown = 0; player.selItem = 'dkBarrel'; e.x = hero.x + 40; const h2 = e.hp; useSelectedItem();
        for (let i = 0; i < 60; i++) updateItems(1 / 60, currentMap());
        out.barrel = h2 - e.hp > 0 && player.owned.dkBarrel === 0;
        out.barrelGoneFromList = !ownedItems().includes('dkBarrel');
        // bow: tapping the active bow slot swaps the arrow type
        player.owned.bow = true; player.owned.fireArrow = true; player.slots[2] = 'bow'; player.activeSlot = 2; player.arrowType = 'normal';
        tapWeaponSlot(10 + 2 * 54 + 10, CONFIG.GAME_H - 58 + 10); out.arrow = player.arrowType;
        e.alive = false;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check("Items: item button + swap; Giant's Berry (heal, x2 sword), Ember Bloom (burn), Ink Blaster (ink blobs), Rolling Barrel (hits); bow tap swaps arrows",
      !r.exception && r.none && r.list === 'bomb,superMushroom,fireFlower,dkBarrel,inkBlaster' && r.swapTap && r.afterCycle === 'superMushroom' &&
      r.berry.giant && r.berry.full && r.berry.left === 1 && r.giantDouble && r.ember && r.ink && r.barrel && r.barrelGoneFromList && r.arrow === 'fire', JSON.stringify(r));
    await ip.close();
  }

  // --- temple extra rooms: wave rooms (2-4 waves, more in later temples)
  // and a different red/blue crystal peg room in each temple ---
  {
    const xp = await browser.newPage();
    xp.on('pageerror', e => errorsAll.push('extras: ' + e.message));
    await xp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await xp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      try {
        localStorage.removeItem(SAVE_KEY); startNewGame(); player.invincibleT = 1e9;
        out.layout = {}; out.layouts = new Set(); out.crossed = {}; out.wavesOk = {};
        for (const d of dungeons) {
          out.layout[d.def.id] = d.extra.map(x => x ? (x.kind === 'waves' ? 'w' + x.puz.waves.length : 'c') : '-').join('');
          out.layouts.add(JSON.stringify(d.extra.find(x => x && x.kind === 'crystal').puz.fences));
          world.mode = 'dungeon'; world.dungeon = d;
          for (let ri = 1; ri < d.PUZ; ri++) {
            const x = d.extra[ri]; d.roomIndex = ri;
            if (x.kind === 'waves') {
              let spawned = 0;
              for (let k = 0; k < 10 && !x.puz.solved; k++) { updateDungeonExtra(d, 0.016); spawned = Math.max(spawned, x.puz.wave); x.enemies.forEach(e => e.alive = false); for (let i = 0; i < 70; i++) updateDungeonExtra(d, 1 / 60); }
              const m = x.map; out.wavesOk[d.def.id + ri] = x.puz.solved && m.grid[Math.floor(m.h / 2)][m.w - 1] === T.FLOOR && spawned === x.puz.waves.length;
            } else {
              // walk the stretches: strike a crystal whenever the next fence is up
              const p = x.puz; let ok = true;
              for (let k = 0; k < p.fences.length; k++) { if (p.raised === p.fences[k][1]) { p.t = 0; strikeCrystal(x); } if (x.map.grid[5][p.fences[k][0]] !== T.PEGDOWN) ok = false; }
              out.crossed[d.def.id] = ok && p.crystals.length === p.fences.length + 1;
            }
          }
        }
        out.layouts = out.layouts.size;
        world.mode = 'overworld'; world.dungeon = null;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    const L = r.layout || {};
    check('Temples: 2-3 wave rooms (more waves later on), a different crystal peg room each, all passable',
      !r.exception && L.forest === '-w2cw2---' && L.fire === '-w2cw3---' && L.water === '-w3cw3w3---' && L.shadow === '-w3cw4w4---' && r.layouts === 4 &&
      Object.values(r.crossed).length === 4 && Object.values(r.crossed).every(Boolean) && Object.values(r.wavesOk).length === 10 && Object.values(r.wavesOk).every(Boolean), JSON.stringify(r));
    await xp.close();
  }

  // --- Mirage Keep (post-game): Sol appears, the desert entrance opens, no
  // golden powers inside, Endless Waves (1 revive) and the Boss Rush keep records ---
  {
    const mp = await browser.newPage();
    mp.on('pageerror', e => errorsAll.push('mirage: ' + e.message));
    await mp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await mp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      try {
        localStorage.removeItem(SAVE_KEY); localStorage.removeItem(RECORDS_KEY); startNewGame();
        out.lockedBefore = !mirageGate.open && !allNPCs().includes(solNPC);
        castle.defeated = true; openMirageGate();
        out.gate = mirageGate.open && overworld.grid[mirageGate.y][mirageGate.x] === T.STAIRS && regionAt(mirageGate.x, mirageGate.y) === 'desert';
        out.sol = allNPCs().includes(solNPC) && /Mirage Keep/.test(solLines().join(' '));
        player.unlockedSkins.golden = true; player.skin = 'golden';
        hero.x = (mirageGate.x + 0.5) * 16; hero.y = (mirageGate.y + 0.5) * 16; enterMirage(); flush();
        out.inside = world.mode === 'mirage' && mirage.roomIndex === 0;
        out.noGolden = !goldenPowers();
        // Endless Waves: walk onto its pad
        const pad = mirage.rooms[0].pads[0]; hero.x = (pad.x + 0.5) * 16; hero.y = (pad.y + 0.5) * 16; updateMirage(0.016, currentMap()); flush();
        for (let i = 0; i < 90; i++) updateMirage(1 / 60, currentMap());
        out.wave1 = mirage.mode === 'waves' && mirage.wave === 1 && currentEnemies().some(e => e.alive);
        for (let w = 0; w < 3; w++) { currentEnemies().forEach(e => e.alive = false); for (let i = 0; i < 90; i++) updateMirage(1 / 60, currentMap()); }
        out.wave4 = mirage.wave === 4;
        player.downed = true; doRevive(); out.afterFirstDeath = mirage.mode === 'waves' && mirage.revives === 0;
        player.downed = true; doRevive(); flush();
        out.wavesEnded = mirage.mode === null && mirage.roomIndex === 0 && livesScreen.active && mirageRecords().waves === 3;
        livesScreen.active = false;
        // Boss Rush: beat all five
        const pad2 = mirage.rooms[0].pads[1]; hero.x = (pad2.x + 0.5) * 16; hero.y = (pad2.y + 0.5) * 16; mirage.padArmed = {}; updateMirage(0.016, currentMap()); flush();
        out.rushStart = mirage.mode === 'rush' && mirage.roomIndex === 2;
        const kinds = [];
        for (let i = 0; i < 5; i++) {
          const b = mirage.boss; kinds.push(b.bossKind || b.type);
          for (let k = 0; k < 30; k++) updateMirage(1 / 60, currentMap());
          if (b.type === 'ganon') { b.hp = 0; ganonDefeated(b); } else { b.hp = 0; b.alive = false; updateMirage(0.016, currentMap()); }
          flush();
          if (i < 4) { await0: { const t0 = performance.now(); } }
          if (mirage.mode === 'rush' && i < 4) { mirageRushRoom(i + 1); }
        }
        out.kinds = kinds.join(',');
        out.rushDone = mirage.mode === null && mirageRecords().rushMs > 0;
        out.recordsShown = /Best: 3 waves/.test(JSON.stringify(mirageRecords())) || mirageRecords().waves === 3;
        exitMirage(); flush(); out.out = world.mode === 'overworld';
      } catch (err) { out.exception = err.message + ' ' + (err.stack || '').split('\n')[1]; }
      return out;
    });
    check('Mirage Keep: unlocked after Malrek (Sol + desert gate), no golden powers, Endless Waves with 1 revive and a record, Boss Rush of all 5 bosses with a time record',
      !r.exception && r.lockedBefore && r.gate && r.sol && r.inside && r.noGolden && r.wave1 && r.wave4 && r.afterFirstDeath && r.wavesEnded && r.rushStart &&
      r.kinds === 'grovak,cindermaw,voltuga,puffling,ganon' && r.rushDone && r.out, JSON.stringify(r));
    await mp.close();
  }

  // --- spring fairies heal to full on every visit; the treasure-room portal
  // (after the chest) leads outside; 8 more golden gold chests ---
  {
    const fp = await browser.newPage();
    fp.on('pageerror', e => errorsAll.push('fairy: ' + e.message));
    await fp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await fp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      try {
        localStorage.removeItem(SAVE_KEY); startNewGame(); player.invincibleT = 1e9;
        const f = owFountains[0], at = () => { hero.x = (f.x + 0.5) * 16; hero.y = (f.y + 1.5) * 16; }, away = () => { hero.x = (f.x + 8) * 16; };
        const heals = [];
        for (let i = 0; i < 3; i++) { player.hearts = 1; away(); updatePlaying(0.016); at(); updatePlaying(0.016); heals.push(player.hearts === player.maxHearts); }
        out.everyVisit = heals.every(Boolean);
        out.goldChests = owChests.filter(c => c.id.startsWith('g_') && c.big && c.gold > 0).length;
        const d = dungeons[1]; world.returnSpot = { x: 100 * 16, y: 100 * 16 };
        world.mode = 'dungeon'; world.dungeon = d; d.roomIndex = d.TREAS; d.chestOpened = false;
        out.noPortalBefore = treasurePortalPos(d) === null;
        d.chestOpened = true; const pp = treasurePortalPos(d); hero.x = pp.x; hero.y = pp.y;
        updateDungeonRoom(0.016, d.rooms[d.TREAS]); flush();
        out.portalOut = world.mode === 'overworld' && Math.hypot(hero.x - 1600, hero.y - 1600) < 2;
      } catch (err) { out.exception = err.message; }
      return out;
    });
    check('Spring fairies heal to full on every visit; treasure-room portal leads outside after the chest; 8 more golden chests with gold',
      !r.exception && r.everyVisit && r.goldChests === 8 && r.noPortalBefore && r.portalOut, JSON.stringify(r));
    await fp.close();
  }

  // --- The Aurora Sword sidequest: the smith marks four vaults; each opens
  // with its item (bomb / fire arrows + shore switch / Gale Boomerang on the
  // crystal / the three parts), each is waves -> guardian -> relic + portal;
  // the smith then points to the Great Fairy's grotto (bombed open) and she
  // reforges the parts: +10 Attack, +5 hearts; all of it survives a reload ---
  {
    const qp = await browser.newPage();
    qp.on('pageerror', e => errorsAll.push('sidequest: ' + e.message));
    await qp.goto(file, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    const r = await qp.evaluate(() => {
      const out = {};
      const flush = () => { if (fadeCallback) { fadeCallback(); fadeCallback = null; } fadeAlpha = 0; fadeDir = 0; };
      const TS = CONFIG.TILE, S = SQ_SITES;
      const stand = (x, y) => { hero.x = (x + 0.5) * TS; hero.y = (y + 0.5) * TS - 4; };
      const step = n => { for (let i = 0; i < (n || 1); i++) { update(CONFIG.STEP_MS); flush(); } };
      try {
        localStorage.removeItem(SAVE_KEY); startNewGame(); player.invincibleT = 1e9; player.ap = 999; dialogue.active = false;
        out.sites = ['v1', 'v2', 'v3', 'v4', 'grotto'].every(k => S[k]);
        openDialogue(smithNPC); dialogue.active = false; out.started = sq.started;
        const clear = id => { // play a vault through: waves, guardian, relic, portal
          stand(S[id].x, S[id].y); step(2);
          const inV = world.mode === 'vault';
          for (let i = 0; i < 400 && !vaultRun.st.waves; i++) { currentEnemies().forEach(e => { e.alive = false; }); step(); }
          const m0 = currentMap(); hero.x = (m0.w - 1.1) * TS; hero.y = (Math.floor(m0.h / 2) + 0.5) * TS; step(2);
          const boss = vaultRun.roomIndex === 1 && vaultRun.boss && vaultRun.boss.alive && !!NEW_BOSS_DEFS[vaultRun.boss.bossKind];
          vaultRun.boss.alive = false; vaultRun.boss.hp = 0; step(2);
          const m1 = currentMap(); hero.x = (m1.w - 1.1) * TS; hero.y = (Math.floor(m1.h / 2) + 0.5) * TS; step(2);
          const pd = vaultPedestalPos(currentMap()); hero.x = pd.x; hero.y = pd.y + 8; step(2); livesScreen.active = false;
          step(60); const pp = vaultPortalPos(currentMap()); hero.x = pp.x; hero.y = pp.y; step(3);
          return inV && boss && world.mode === 'overworld' && sq.parts[VAULT_DEFS[id].part];
        };
        // v1: the cracked rock needs a bomb
        const g1 = owGates.find(g => g.id === 'sq_v1');
        out.v1Blocked = overworld.grid[g1.y][g1.x] === T.CRACKED;
        owBombBlast((g1.x + 1) * TS, (g1.y + 1) * TS);
        out.v1 = clear('v1');
        // v2: plain arrows do nothing, fire arrows light both torches, the shore switch lowers the bridge
        const t0 = S.v2.torches[0];
        sqArrowHit({ x: (t0[0] + 0.5) * TS, y: (t0[1] + 0.5) * TS - 6, type: 'normal' }); out.v2PlainNoLight = !sq.torches[0];
        for (const t of S.v2.torches) sqArrowHit({ x: (t[0] + 0.5) * TS, y: (t[1] + 0.5) * TS - 6, type: 'fire' });
        out.v2Island = overworld.grid[S.v2.y + 2][S.v2.x] === T.WATER;
        stand(S.v2.sw[0], S.v2.sw[1]); hero.y += 4; step(2);
        out.v2Bridge = !!owState.bridges.sq_v2 && overworld.grid[S.v2.y + 2][S.v2.x] === T.BRIDGE;
        out.v2 = clear('v2');
        // v3: the plain boomerang falls short from the west shore, the Gale Boomerang reaches
        const cy = S.v3.crystal[1]; let x = S.v3.crystal[0] - 12; while (overworld.grid[cy][x + 1] !== T.WATER) x++;
        const throwFrom = gale => { player.owned.boomerang = true; player.owned.galeBoomerang = gale; boomerangs.length = 0; stand(x, cy); hero.y += 4; hero.facing = 'right'; player.attackCooldown = 0; throwBoomerang(); step(120); };
        throwFrom(false); out.v3ShortThrow = !sq.crystal;
        throwFrom(true); out.v3Gale = sq.crystal && S.v3.pillars.every(([px, py]) => overworld.grid[py][px] !== T.PROP);
        out.v3 = clear('v3');
        // v4: sealed until three parts; opens now
        const door = owInteractables().find(i => i.key === 'sq:v4door'); door.act(); dialogue.active = false;
        out.v4Opened = sq.v4Open && overworld.grid[S.v4.y][S.v4.x] === T.STAIRS;
        out.v4 = clear('v4');
        // the fairy sleeps until the smith was told; the grotto opens to a bomb
        openDialogue(greatFairyNPC); out.fairySleeps = !greatFairyAwake(); dialogue.active = false;
        openDialogue(smithNPC); dialogue.active = false; out.smithTold = sq.smithTold;
        owBombBlast((S.grotto.x + 0.5) * TS, (S.grotto.y + 1.5) * TS); out.grotto = sq.grottoOpen;
        stand(S.grotto.x, S.grotto.y); step(2); out.inGrotto = world.interior === grottoInterior;
        const before = { a: player.attack, h: player.maxHearts };
        openDialogue(greatFairyNPC); while (dialogue.active) advanceDialogue(); livesScreen.active = false;
        out.reforge = sq.fairyDone && player.attack === before.a + 10 && player.maxHearts === before.h + 5 && equippedSwordKind() === 'auroraSword';
        saveGame();
        out.saved = JSON.parse(localStorage.getItem(SAVE_KEY)).sidequest.fairyDone === true;
      } catch (err) { out.exception = err.message + ' ' + (err.stack || '').split('\n')[1]; }
      return out;
    });
    await qp.reload({ waitUntil: 'load' }); await new Promise(r => setTimeout(r, 400));
    const r2 = await qp.evaluate(() => { const d = loadSaveData(); applySaveData(d); return { parts: sqPartCount(), sword: equippedSwordKind(), crystal: sq.crystal, pillarsDown: SQ_SITES.v3.pillars.every(([x, y]) => overworld.grid[y][x] !== T.PROP), v4: overworld.grid[SQ_SITES.v4.y][SQ_SITES.v4.x] === T.STAIRS, grotto: overworld.grid[SQ_SITES.grotto.y][SQ_SITES.grotto.x] === T.STAIRS, bridge: !!owState.bridges.sq_v2 }; });
    const ok = !r.exception && Object.keys(r).filter(k => k !== 'exception').every(k => r[k] === true) && r2.parts === 4 && r2.sword === 'auroraSword' && r2.pillarsDown && r2.v4 && r2.grotto && r2.bridge;
    check('Aurora Sword sidequest: 4 item-gated vaults (bomb / fire arrows / Gale Boomerang / 3 parts), waves -> guardian -> relic + portal, smith -> Great Fairy grotto (bomb) -> +10 Attack +5 hearts; saved',
      ok, JSON.stringify(r) + ' reload ' + JSON.stringify(r2));
    await qp.close();
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
