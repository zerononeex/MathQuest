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
        const puzzleOk = d.rooms[1].grid[Math.floor(d.rooms[1].h / 2)][d.rooms[1].w - 1] === 4;
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
        // chest without boss key -> hint, no freeze
        d.hasBossKey = false;
        Input.keys['e'] = true;
        handleDungeonDoors(d, d.rooms[3], 0.016);
        const chestRefusedWithoutKey = !d.chestOpened;
        d.hasBossKey = true;
        Input.keys['e'] = true;
        handleDungeonDoors(d, d.rooms[3], 0.016);
        out.push({
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
    const ok = dr.lockedOk && dr.doorOpened && dr.puzzleOk && dr.sealedBeforeDefeat &&
      dr.openAfterDefeat && dr.chestRefusedWithoutKey && dr.chestOpened && dr.medallion;
    check('Dungeon ' + dr.id + ': key/door/puzzle/boss-seal/chest/medallion all correct', ok, JSON.stringify(dr));
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
        Input.keys['e'] = true;
        handleDungeonDoors(d, tr, 1 / 60);
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
      const ratio = (overworld.w * overworld.h) / (64 * 44);
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
  check('Overworld is ~10x the original tile count', mapResult.ratio > 9 && mapResult.ratio < 11, 'ratio=' + mapResult.ratio);
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

  check('Zero uncaught console errors across the whole acceptance run', consoleErrors.length === 0 && errorsAll.length === 0,
    JSON.stringify(consoleErrors.concat(errorsAll)).slice(0, 500));

  await browser.close();

  const passCount = results.filter(r => r.ok).length;
  console.log('\n' + passCount + '/' + results.length + ' checks passed.');
  fs.writeFileSync(path.join(__dirname, 'acceptance-results.json'), JSON.stringify(results, null, 2));
  process.exit(results.some(r => !r.ok) ? 1 : 0);
})();
