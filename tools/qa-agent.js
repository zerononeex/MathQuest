/* =========================================================================
 * Math Quest - autonomous QA agent
 *
 * Plays math-quest.html like a player would (synthetic keyboard / pointer
 * events only) and logs bugs. It READS game state for planning and for
 * verification, but never writes hp / ap / gold / inventory / boss / map
 * state. See tools/QA-AGENT.md for usage.
 *
 *   startQAAgent({ overlay, maxMinutes, timeScale, ... })
 *   stopQAAgent()
 *   toggleQAOverlay()
 *   exportQAReport()   -> Markdown string
 *   QA_REPORT_JSON()   -> plain object
 *
 * Instrumentation (runtime only, the game file is never modified):
 *  - window.update is wrapped so the agent observes / decides once per fixed
 *    60Hz simulation step (falls back to per-frame if that is impossible);
 *  - requestAnimationFrame is wrapped to (optionally) scale timestamps for
 *    faster headless runs and to scope a pass-through capture of the game's
 *    2D draw calls (text / rect geometry) for layout checks;
 *  - window error / unhandledrejection / console.error are observed.
 * ========================================================================= */
(function () {
  'use strict';
  if (window.__QA && window.__QA.installed) { try { console.warn('[QA] agent already loaded'); } catch (e) {} return; }

  const VERSION = '1.0.0';
  const now = () => performance.now();
  const GW = () => (typeof CONFIG !== 'undefined' ? CONFIG.GAME_W : 640);
  const GH = () => (typeof CONFIG !== 'undefined' ? CONFIG.GAME_H : 360);
  const TS = () => (typeof CONFIG !== 'undefined' ? CONFIG.TILE : 16);
  const gcanvas = () => document.getElementById('game') || document.querySelector('canvas');
  const gctx = () => { const c = gcanvas(); return c ? c.getContext('2d') : null; };
  const MOVE = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  const DIRKEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  const DIRVEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const SHORT = { ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right', ' ': 'Space' };

  // ---------------------------------------------------------------------
  // Bounded ring buffer (logs / inputs never grow without bound)
  // ---------------------------------------------------------------------
  class Ring {
    constructor(n) { this.n = n; this.a = new Array(n); this.i = 0; this.len = 0; }
    push(v) { this.a[this.i] = v; this.i = (this.i + 1) % this.n; if (this.len < this.n) this.len++; }
    toArray() { const out = []; for (let k = this.len; k > 0; k--) out.push(this.a[(this.i - k + this.n) % this.n]); return out; }
    clear() { this.i = 0; this.len = 0; this.a.fill(undefined); }
  }

  const QA = window.__QA = {
    installed: true, version: VERSION, running: false, done: false, doneReason: '',
    opts: {}, gameMs: 0, steps: 0, startWall: 0, startDate: '',
    state: 'IDLE', goal: '', target: null, pathForOverlay: null,
    inputs: new Ring(40), crumbs: new Ring(30), agentIssues: new Ring(120),
    bugs: new Map(), info: [], expects: [],
    stats: { swings: 0, rangedShots: 0, kills: 0, pots: 0, mathSolved: 0, mathMisses: 0, revives: 0, levelUps: 0,
      bought: [], frames: 0, frameMsAvg: 0, frameMsMax: 0, updates: 0 },
    dungeon: {}, layout: {}, metrics: { cardinal: { n: 0, sum: 0 }, diagonal: { n: 0, sum: 0 } },
    bossDeadAt: {}, bossReported: {}, lastUpdateWall: 0, stepHooked: false,
    overlayOn: false, ov: null, victory: false, mathOpens: 0,
  };

  // ---------------------------------------------------------------------
  // Read-only game accessors
  // ---------------------------------------------------------------------
  function gameReady() {
    try { return typeof hero !== 'undefined' && typeof player !== 'undefined' && typeof world !== 'undefined' && typeof currentMap === 'function'; }
    catch (e) { return false; }
  }
  function mapKey() {
    try {
      if (world.mode === 'dungeon' && world.dungeon) return 'dungeon:' + world.dungeon.def.id + ':' + world.dungeon.roomIndex;
      if (world.mode === 'castle') return 'castle:' + castle.roomIndex;
      if (world.mode === 'interior') return 'interior:' + (world.interior && world.interior.label);
      return world.mode;
    } catch (e) { return '?'; }
  }
  function anyModal() {
    return !!(player.levelUpChoicePending || shop.active || (typeof wardrobe !== 'undefined' && wardrobe.active) ||
      (typeof pauseMenu !== 'undefined' && pauseMenu.active) || dialogue.active || mathPopup.active);
  }
  function fading() { try { return fadeDir !== 0; } catch (e) { return false; } }
  function heroTile() { return { tx: Math.floor(hero.x / TS()), ty: Math.floor(hero.y / TS()) }; }
  function tileAt(map, tx, ty) { return (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) ? -1 : map.grid[ty][tx]; }
  function solidTile(map, tx, ty) { const t = tileAt(map, tx, ty); return t < 0 || SOLID_TILES.has(t); }
  function solidAt(map, px, py) {
    if (typeof tileSolidAt === 'function') return tileSolidAt(map, px, py);
    return solidTile(map, Math.floor(px / TS()), Math.floor(py / TS()));
  }
  function hitboxFree(map, x, y) {
    const hw = hero.w / 2, hh = hero.h / 2;
    return !solidAt(map, x - hw, y - hh) && !solidAt(map, x + hw, y - hh) && !solidAt(map, x - hw, y + hh - 1) && !solidAt(map, x + hw, y + hh - 1);
  }
  let TILE_NAMES = null;
  function tileName(t) {
    if (!TILE_NAMES) { TILE_NAMES = {}; try { for (const k in T) TILE_NAMES[T[k]] = k; } catch (e) {} }
    return TILE_NAMES[t] || String(t);
  }
  function where() {
    try {
      return { gameState, map: mapKey(), x: +hero.x.toFixed(1), y: +hero.y.toFixed(1), tx: Math.floor(hero.x / TS()), ty: Math.floor(hero.y / TS()),
        facing: hero.facing, hearts: player.hearts + '/' + player.maxHearts, ap: player.ap, gold: hud.gold, level: player.level };
    } catch (e) { return {}; }
  }
  function tierReward() { try { return tierAPReward(); } catch (e) { return 4; } }
  function swordReach() { try { return swordReachPx(); } catch (e) { return 28; } }
  function isSwordKind(w) { return w === 'sword' || w === 'sharpSword' || w === 'heroSword'; }
  function swordSlot() { for (let i = 0; i < 3; i++) if (isSwordKind(player.slots[i])) return i; return 0; }
  function rangedSlot() { for (let i = 0; i < 3; i++) { const w = player.slots[i]; if (w === 'boomerang' || w === 'galeBoomerang' || w === 'bow') return i; } return -1; }
  function medals() { try { return medallionCount(); } catch (e) { return 0; } }

  // ---------------------------------------------------------------------
  // QALogger
  // ---------------------------------------------------------------------
  function report(sev, cat, msg, extra, key) {
    key = key || (sev + '|' + cat + '|' + String(msg).replace(/-?\d+(\.\d+)?/g, '#'));
    let b = QA.bugs.get(key);
    const t = +(QA.gameMs / 1000).toFixed(2);
    if (b) { b.count++; b.lastGameT = t; return b; }
    if (QA.bugs.size >= 400) return null;
    b = { id: 'QA-' + (QA.bugs.size + 1), severity: sev, category: cat, message: msg, count: 1, gameT: t, lastGameT: t,
      wallT: +((now() - QA.startWall) / 1000).toFixed(1), wallISO: new Date().toISOString(),
      phase: QA.state + (QA.goal ? ' / ' + QA.goal : ''), where: where(), inputs: QA.inputs.toArray(), crumbs: QA.crumbs.toArray(), extra: extra || null };
    QA.bugs.set(key, b);
    try { console.log('[QA] ' + sev + ' [' + cat + '] ' + msg); } catch (e) {}
    return b;
  }
  function milestone(msg, extra) {
    if (QA.info.length < 500) QA.info.push({ gameT: +(QA.gameMs / 1000).toFixed(1), wallT: +((now() - QA.startWall) / 1000).toFixed(1), msg, where: where(), extra: extra || null });
    try { console.log('[QA] INFO ' + msg); } catch (e) {}
  }
  function agentIssue(msg) {
    QA.agentIssues.push({ gameT: +(QA.gameMs / 1000).toFixed(1), msg, where: where(), phase: QA.state + ' / ' + QA.goal });
    try { console.log('[QA] agent: ' + msg); } catch (e) {}
  }
  function logInput(a, d) {
    let at = '';
    try { at = Math.round(hero.x) + ',' + Math.round(hero.y) + ' ' + mapKey(); } catch (e) {}
    QA.inputs.push({ t: +(QA.gameMs / 1000).toFixed(2), a, d, at });
  }
  function expect(label, ms, pred, onFail, onOk) {
    if (QA.expects.length < 60) QA.expects.push({ label, until: QA.gameMs + ms, pred, onFail, onOk });
  }
  function evalExpectations() {
    for (let i = QA.expects.length - 1; i >= 0; i--) {
      const x = QA.expects[i];
      let ok = false;
      try { ok = !!x.pred(); } catch (e) { ok = false; }
      if (ok) { QA.expects.splice(i, 1); try { x.onOk && x.onOk(); } catch (e) {} }
      else if (QA.gameMs > x.until) { QA.expects.splice(i, 1); try { x.onFail && x.onFail(); } catch (e) { agentIssue('expectation handler error: ' + e.message); } }
    }
  }

  // ---------------------------------------------------------------------
  // InputDispatcher: real KeyboardEvent / MouseEvent / TouchEvent only
  // ---------------------------------------------------------------------
  function codeFor(k) {
    if (k === ' ') return 'Space';
    if (/^Arrow|^Enter$|^Escape$/.test(k)) return k;
    if (/^[a-z]$/i.test(k)) return 'Key' + k.toUpperCase();
    if (/^\d$/.test(k)) return 'Digit' + k;
    return k;
  }
  const Inp = {
    held: new Set(), pending: [],
    fire(type, k) { document.dispatchEvent(new KeyboardEvent(type, { key: k, code: codeFor(k), bubbles: true, cancelable: true })); },
    down(k) { if (this.held.has(k)) return; this.fire('keydown', k); this.held.add(k); },
    up(k) { if (!this.held.has(k)) return; this.fire('keyup', k); this.held.delete(k); },
    setMove(keys) {
      let changed = false;
      for (let i = 0; i < MOVE.length; i++) { const k = MOVE[i]; if (this.held.has(k) && keys.indexOf(k) < 0) { this.up(k); changed = true; } }
      for (let i = 0; i < keys.length; i++) { if (!this.held.has(keys[i])) { this.down(keys[i]); changed = true; } }
      if (changed) logInput('hold', keys.length ? keys.map(k => SHORT[k] || k).join('+') : 'none');
    },
    moveKeys() { return MOVE.filter(k => this.held.has(k)); },
    press(k) {
      if (this.held.has(k)) this.up(k);
      this.down(k); this.pending.push({ k, age: 0 });
      logInput('press', SHORT[k] || k);
    },
    // release one-shot keys once the game consumed them (Input.keys[k] reset)
    service() {
      for (let i = this.pending.length - 1; i >= 0; i--) {
        const p = this.pending[i]; p.age++;
        let consumed = false;
        try { consumed = Input.keys[p.k] === false; } catch (e) {}
        if (consumed || p.age >= 6) { this.up(p.k); this.pending.splice(i, 1); }
      }
    },
    releaseAll() { for (const k of Array.from(this.held)) this.up(k); this.pending.length = 0; },
    toClient(lx, ly) {
      const c = gcanvas(), r = c.getBoundingClientRect();
      return { x: r.left + lx * r.width / GW(), y: r.top + ly * r.height / GH() };
    },
    tap(lx, ly, label) {
      if (!(lx >= 0 && ly >= 0 && lx <= GW() && ly <= GH())) {
        report('WARNING', 'input', 'Agent needed to tap outside the visible canvas at (' + Math.round(lx) + ',' + Math.round(ly) + ')' +
          (label ? ' for ' + label : '') + ' - a real player cannot reach this target', null, 'offcanvas-tap|' + (label || ''));
        return false;
      }
      const c = gcanvas(), p = this.toClient(lx, ly);
      if (QA.opts.touch && typeof Touch === 'function' && typeof TouchEvent === 'function') {
        const t = new Touch({ identifier: (now() | 0), target: c, clientX: p.x, clientY: p.y });
        c.dispatchEvent(new TouchEvent('touchstart', { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }));
        c.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [t], bubbles: true, cancelable: true }));
      } else {
        const o = { clientX: p.x, clientY: p.y, screenX: p.x, screenY: p.y, bubbles: true, cancelable: true, button: 0, buttons: 1, view: window };
        c.dispatchEvent(new MouseEvent('mousedown', o));
        c.dispatchEvent(new MouseEvent('mouseup', Object.assign({}, o, { buttons: 0 })));
        c.dispatchEvent(new MouseEvent('click', Object.assign({}, o, { buttons: 0 })));
      }
      logInput('tap', Math.round(lx) + ',' + Math.round(ly) + (label ? ' (' + label + ')' : ''));
      return true;
    },
  };
  function keysToward(dx, dy, dead) {
    const k = [];
    if (dx > dead) k.push('ArrowRight'); else if (dx < -dead) k.push('ArrowLeft');
    if (dy > dead) k.push('ArrowDown'); else if (dy < -dead) k.push('ArrowUp');
    return k;
  }

  // ---------------------------------------------------------------------
  // Trigger zones (entering one changes map) + A* over the real tile grid
  // ---------------------------------------------------------------------
  function triggerZones(map) {
    const z = [], T0 = TS();
    try {
      if (map === overworld) {
        for (const b of buildings) if (b.activation) z.push({ r: b.activation, name: 'building:' + b.name });
        for (const d of dungeons) if (d.entranceZone) z.push({ r: d.entranceZone, name: 'dungeon:' + d.def.id });
        if (typeof castleGate !== 'undefined' && castleGate.zone) z.push({ r: castleGate.zone, name: 'castle' });
      } else if (world.mode === 'interior' && world.interior === map) {
        const ex = map.exit;
        z.push({ r: { minX: ex.x * T0 - T0, maxX: ex.x * T0 + T0, minY: ex.y * T0 - T0, maxY: ex.y * T0 + T0 }, name: 'exit' });
      } else {
        z.push({ r: { minX: -1e9, maxX: T0 * 1.2, minY: -1e9, maxY: 1e9 }, name: 'west' });
        z.push({ r: { minX: (map.w - 1.2) * T0, maxX: 1e9, minY: -1e9, maxY: 1e9 }, name: 'east' });
      }
    } catch (e) {}
    return z;
  }
  function inZone(x, y, r) { return x >= r.minX && x <= r.maxX && y >= r.minY && y <= r.maxY; }
  function zoneAtPoint(map, x, y) { for (const z of triggerZones(map)) if (inZone(x, y, z.r)) return z; return null; }
  // drop movement keys that would carry the hero into a trigger zone
  function zoneGuard(keys) {
    if (!keys.length) return keys;
    const map = currentMap(), out = [];
    for (const k of keys) { const v = DIRVEC[k === 'ArrowUp' ? 'up' : k === 'ArrowDown' ? 'down' : k === 'ArrowLeft' ? 'left' : 'right'];
      if (!zoneAtPoint(map, hero.x + v[0] * 3, hero.y + v[1] * 3)) out.push(k); }
    return out;
  }

  const AS = { N: 0, g: null, came: null, closed: null, mask: null, hi: null, hf: null, hn: 0 };
  function ensureBuf(N) {
    if (AS.N >= N) return;
    AS.N = N; AS.g = new Float32Array(N); AS.came = new Int32Array(N); AS.closed = new Uint8Array(N); AS.mask = new Uint8Array(N);
    AS.hi = new Int32Array(N * 4 + 16); AS.hf = new Float32Array(N * 4 + 16);
  }
  function hpush(i, f) {
    let k = AS.hn++;
    while (k > 0) { const p = (k - 1) >> 1; if (AS.hf[p] <= f) break; AS.hi[k] = AS.hi[p]; AS.hf[k] = AS.hf[p]; k = p; }
    AS.hi[k] = i; AS.hf[k] = f;
  }
  function hpop() {
    const top = AS.hi[0]; AS.hn--;
    if (AS.hn > 0) {
      const i = AS.hi[AS.hn], f = AS.hf[AS.hn]; let k = 0;
      for (;;) { let c = 2 * k + 1; if (c >= AS.hn) break; if (c + 1 < AS.hn && AS.hf[c + 1] < AS.hf[c]) c++; if (AS.hf[c] >= f) break; AS.hi[k] = AS.hi[c]; AS.hf[k] = AS.hf[c]; k = c; }
      AS.hi[k] = i; AS.hf[k] = f;
    }
    return top;
  }
  // 4-connected A*: a tile path is walkable by the 12x14 hero hitbox as long
  // as it is followed through tile centres (see segKeys). Blocks SOLID_TILES
  // and trigger zones (except the one containing the goal when allowZone).
  function astar(map, sx, sy, gx, gy, opts) {
    opts = opts || {};
    const w = map.w, h = map.h, N = w * h, T0 = TS();
    ensureBuf(N);
    const g = AS.g, came = AS.came, closed = AS.closed, mask = AS.mask;
    g.fill(Infinity, 0, N); came.fill(-1, 0, N); closed.fill(0, 0, N); mask.fill(0, 0, N);
    for (let y = 0; y < h; y++) { const row = map.grid[y]; for (let x = 0; x < w; x++) if (SOLID_TILES.has(row[x])) mask[y * w + x] = 1; }
    const gcx = (gx + 0.5) * T0, gcy = (gy + 0.5) * T0;
    for (const z of triggerZones(map)) {
      if (opts.allowZone && inZone(gcx, gcy, z.r)) continue;
      const r = z.r;
      const x0 = Math.max(0, Math.floor(r.minX / T0) - 1), x1 = Math.min(w - 1, Math.ceil(r.maxX / T0) + 1);
      const y0 = Math.max(0, Math.floor(r.minY / T0) - 1), y1 = Math.min(h - 1, Math.ceil(r.maxY / T0) + 1);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inZone((x + 0.5) * T0, (y + 0.5) * T0, r)) mask[y * w + x] = 2;
    }
    if (opts.avoid) for (const i of opts.avoid) if (i >= 0 && i < N) mask[i] = 3;
    if (sx < 0 || sy < 0 || sx >= w || sy >= h || gx < 0 || gy < 0 || gx >= w || gy >= h) return null;
    const start = sy * w + sx, goal = gy * w + gx;
    mask[start] = 0;
    if (mask[goal]) return null;
    AS.hn = 0; g[start] = 0; hpush(start, Math.abs(gx - sx) + Math.abs(gy - sy));
    let found = false, expanded = 0;
    while (AS.hn > 0) {
      const cur = hpop();
      if (closed[cur]) continue;
      if (cur === goal) { found = true; break; }
      closed[cur] = 1;
      if (++expanded > N) break;
      const cx = cur % w, cy = (cur / w) | 0, gc = g[cur] + 1;
      for (let k = 0; k < 4; k++) {
        const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : 0), ny = cy + (k === 2 ? 1 : k === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (mask[ni] || closed[ni] || gc >= g[ni]) continue;
        g[ni] = gc; came[ni] = cur;
        hpush(ni, gc + Math.abs(gx - nx) + Math.abs(gy - ny));
      }
    }
    if (!found) return null;
    const path = [];
    for (let c = goal; c !== -1; c = came[c]) { path.push({ tx: c % w, ty: (c / w) | 0 }); if (c === start) break; }
    path.reverse();
    return path;
  }
  function nearestFree(map, tx, ty, maxR) {
    maxR = maxR || 3;
    for (let r = 0; r <= maxR; r++) {
      let best = null, bd = Infinity;
      for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) {
        if (Math.max(Math.abs(ox), Math.abs(oy)) !== r) continue;
        const x = tx + ox, y = ty + oy;
        if (solidTile(map, x, y) || zoneAtPoint(map, (x + 0.5) * TS(), (y + 0.5) * TS())) continue;
        const d = Math.hypot(hero.x - (x + 0.5) * TS(), hero.y - (y + 0.5) * TS());
        if (d < bd) { bd = d; best = { tx: x, ty: y }; }
      }
      if (best) return best;
    }
    return null;
  }
  function losClear(map, x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(d / 3));
    for (let i = 1; i <= n; i++) { const t = i / n; if (!hitboxFree(map, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return false; }
    return true;
  }

  // Keys to follow a path segment: keep the perpendicular axis inside the
  // tile window where the hitbox fits (x offset [6,10), y offset [7,10)),
  // then walk along the segment axis.
  function segKeys(cur, nx) {
    const dx = nx.tx - cur.tx, dy = nx.ty - cur.ty, T0 = TS();
    const ox = hero.x - cur.tx * T0, oy = hero.y - cur.ty * T0;
    if (dx !== 0) { if (oy < 7) return ['ArrowDown']; if (oy >= 10) return ['ArrowUp']; return [dx > 0 ? 'ArrowRight' : 'ArrowLeft']; }
    if (ox < 6) return ['ArrowRight']; if (ox >= 10) return ['ArrowLeft']; return [dy > 0 ? 'ArrowDown' : 'ArrowUp'];
  }
  function alignKeys(t, loose) {
    const T0 = TS(), ox = hero.x - t.tx * T0, oy = hero.y - t.ty * T0, lo = loose ? 3 : 0, k = [];
    if (ox < 6 - lo) k.push('ArrowRight'); else if (ox >= 10 + lo) k.push('ArrowLeft');
    if (oy < 7 - lo) k.push('ArrowDown'); else if (oy >= 10 + lo) k.push('ArrowUp');
    return k;
  }
  const Mover = {
    path: null, idx: 0, key: '', mk: '', planT: -1e9,
    reset() { this.path = null; this.key = ''; },
    step(gx, gy, opts) {
      opts = opts || {};
      const key = gx + ',' + gy + (opts.allowZone ? 'z' : '');
      const ht = heroTile();
      if (ht.tx === gx && ht.ty === gy) { const k = alignKeys(ht, opts.loose); Inp.setMove(k); return k.length ? 'moving' : 'arrived'; }
      let need = !this.path || this.key !== key || this.mk !== mapKey() || (opts.replanMs && QA.gameMs - this.planT > opts.replanMs);
      if (!need) {
        let found = -1;
        for (let j = Math.max(0, this.idx - 1); j < Math.min(this.path.length, this.idx + 8); j++) {
          const n = this.path[j]; if (n.tx === ht.tx && n.ty === ht.ty) { found = j; break; }
        }
        if (found < 0) need = true; else this.idx = found;
      }
      if (need) {
        const p = astar(currentMap(), ht.tx, ht.ty, gx, gy, opts);
        this.path = p; this.idx = 0; this.key = key; this.mk = mapKey(); this.planT = QA.gameMs;
        QA.pathForOverlay = p;
        if (!p) { Inp.setMove([]); return 'nopath'; }
      }
      const cur = this.path[this.idx], nx = this.path[this.idx + 1];
      if (!nx) { const k = alignKeys(ht, opts.loose); Inp.setMove(k); return k.length ? 'moving' : 'arrived'; }
      Inp.setMove(segKeys(cur, nx));
      return 'moving';
    },
  };

  // ---------------------------------------------------------------------
  // Generator helpers (every phase is a generator stepped once per update)
  // ---------------------------------------------------------------------
  function* wait(ms) { const end = QA.gameMs + ms; while (QA.gameMs < end) yield; }
  function* waitUntil(pred, ms) {
    const end = QA.gameMs + ms;
    while (QA.gameMs < end) { if (pred()) return true; yield; }
    return !!pred();
  }
  const skipUntil = new WeakMap();
  function skipped(e) { const t = skipUntil.get(e); return t !== undefined && QA.gameMs < t; }
  function threat(r) {
    let best = null, bd = r;
    for (const e of currentEnemies()) {
      if (!e.alive || skipped(e)) continue;
      const d = Math.hypot(e.x - hero.x, e.y - hero.y);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  function* steerToPoint(x, y, tol, ms) {
    const end = QA.gameMs + ms;
    while (QA.gameMs < end) {
      const dx = x - hero.x, dy = y - hero.y;
      if (Math.abs(dx) <= tol && Math.abs(dy) <= tol) { Inp.setMove([]); return true; }
      Inp.setMove(zoneGuard(keysToward(dx, dy, tol * 0.5)));
      yield;
    }
    Inp.setMove([]);
    return false;
  }

  function* navTo(gx, gy, opts) {
    opts = opts || {};
    const startMap = mapKey();
    const deadline = QA.gameMs + (opts.timeoutMs || 120000);
    QA.goal = opts.label || ('go to tile ' + gx + ',' + gy);
    QA.target = { tx: gx, ty: gy };
    let anchor = { x: hero.x, y: hero.y, t: QA.gameMs }, recover = 0, arrivedAt = -1;
    Mover.reset();
    for (;;) {
      if (mapKey() !== startMap) { Inp.setMove([]); return 'transition'; }
      if (QA.gameMs > deadline) { Inp.setMove([]); agentIssue('navTo timeout: ' + QA.goal); return 'timeout'; }
      let fought = false;
      if (opts.fight !== false) {
        const e = threat(opts.threatR || 34);
        if (e) { yield* fight(e, { timeoutMs: 15000, chase: 70 }); Mover.reset(); anchor = { x: hero.x, y: hero.y, t: QA.gameMs }; fought = true; }
      }
      if (!fought) {
        const r = Mover.step(gx, gy, opts);
        if (r === 'nopath') { Inp.setMove([]); return 'nopath'; }
        if (r === 'arrived') {
          if (!opts.expectTransition) { Inp.setMove([]); return 'arrived'; }
          if (arrivedAt < 0) arrivedAt = QA.gameMs;
          if (QA.gameMs - arrivedAt > 2500) { Inp.setMove([]); return 'no-transition'; }
        }
        if (Math.hypot(hero.x - anchor.x, hero.y - anchor.y) > 4) anchor = { x: hero.x, y: hero.y, t: QA.gameMs };
        else if (QA.gameMs - anchor.t > 2500 && r === 'moving') {
          recover++;
          agentIssue('navigation made no progress for 2.5s toward (' + gx + ',' + gy + '), recovery #' + recover);
          if (recover > 5) { Inp.setMove([]); return 'stuck'; }
          const kk = [MOVE[(recover * 3) % 4]];
          for (let i = 0; i < 10; i++) { Inp.setMove(zoneGuard(kk)); yield; }
          Mover.reset(); anchor = { x: hero.x, y: hero.y, t: QA.gameMs };
        }
      }
      yield;
    }
  }

  function* goNear(o, r, ms) {
    const end = QA.gameMs + ms, T0 = TS();
    let anchor = { x: hero.x, y: hero.y, t: QA.gameMs };
    Mover.reset();
    while (QA.gameMs < end) {
      if (o.alive === false) { Inp.setMove([]); return false; }
      const d = Math.hypot(o.x - hero.x, o.y - hero.y);
      if (d <= r) { Inp.setMove([]); return true; }
      const map = currentMap();
      if (d < 48 && losClear(map, hero.x, hero.y, o.x, o.y)) {
        Inp.setMove(zoneGuard(keysToward(o.x - hero.x, o.y - hero.y, 1)));
      } else {
        let g = { tx: Math.floor(o.x / T0), ty: Math.floor(o.y / T0) };
        if (solidTile(map, g.tx, g.ty) || zoneAtPoint(map, (g.tx + 0.5) * T0, (g.ty + 0.5) * T0)) g = nearestFree(map, g.tx, g.ty, 2);
        if (!g) { Inp.setMove([]); return false; }
        const st = Mover.step(g.tx, g.ty, { replanMs: o.type ? 700 : 0, loose: true });
        if (st === 'nopath') { Inp.setMove([]); return false; }
        if (st === 'arrived') Inp.setMove(zoneGuard(keysToward(o.x - hero.x, o.y - hero.y, 1)));
      }
      const e = threat(30);
      if (e && e !== o) { yield* fight(e, { timeoutMs: 15000, chase: 60 }); Mover.reset(); }
      if (Math.hypot(hero.x - anchor.x, hero.y - anchor.y) > 4) anchor = { x: hero.x, y: hero.y, t: QA.gameMs };
      else if (QA.gameMs - anchor.t > 3000) { Inp.setMove([]); return false; }
      yield;
    }
    Inp.setMove([]);
    return false;
  }

  // ---------------------------------------------------------------------
  // SOLVING_MATH: parse the question text itself and tap the right button
  // ---------------------------------------------------------------------
  function evalMath(s) {
    const src = String(s).replace(/=.*$/, '').replace(/[x×✕]/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    const toks = src.match(/\d+(?:\.\d+)?|[+\-*/^()]/g);
    if (!toks) return NaN;
    const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }, out = [], ops = [];
    for (const t of toks) {
      if (/\d/.test(t)) out.push(parseFloat(t));
      else if (t === '(') ops.push(t);
      else if (t === ')') { while (ops.length && ops[ops.length - 1] !== '(') out.push(ops.pop()); ops.pop(); }
      else {
        while (ops.length) { const o = ops[ops.length - 1]; if (o !== '(' && (prec[o] > prec[t] || (prec[o] === prec[t] && t !== '^'))) out.push(ops.pop()); else break; }
        ops.push(t);
      }
    }
    while (ops.length) out.push(ops.pop());
    const st = [];
    for (const t of out) {
      if (typeof t === 'number') { st.push(t); continue; }
      const b = st.pop(), a = st.pop();
      if (a === undefined || b === undefined) return NaN;
      st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : t === '/' ? a / b : Math.pow(a, b));
    }
    return st.length === 1 ? st[0] : NaN;
  }
  const M = { sig: '', tries: [], lastTap: -1e9 };
  function solveMath() {
    QA.state = 'SOLVING_MATH';
    Inp.setMove([]);
    const q = mathPopup.question;
    if (!q) return;
    const sig = q.questionText + '|' + q.answers.join(',') + '|' + mathPopup.purpose;
    if (sig !== M.sig) {
      M.sig = sig; M.tries = []; M.lastTap = -1e9; M.openedAt = QA.gameMs; M.ap0 = player.ap; M.maxAp = player.maxAp;
      M.purpose = mathPopup.purpose; M.q = q.questionText; M.answers = q.answers.slice(); M.value = evalMath(q.questionText);
      M.qa0 = player.questionsAnswered;
      Cap.arm('math');
      checkRectSet('Math popup answer buttons', getMathButtons().map((r, i) => ({ name: 'answer ' + (i + 1), r })), { overlap: true });
      if (!isFinite(M.value)) report('WARNING', 'math', 'Could not parse question text "' + q.questionText + '"');
    }
    if (QA.gameMs - M.lastTap < 150) return;
    if (QA.gameMs - M.openedAt > 15000) report('CRITICAL', 'modal', 'Math popup stayed open for 15s despite ' + M.tries.length + ' answer attempts ("' + q.questionText + '")');
    if (M.tries.length === 1 && mathPopup.wrongIdx === M.tries[0] && isFinite(M.value) && Number(q.answers[M.tries[0]]) === M.value) {
      report('CRITICAL', 'math', 'Correct answer rejected: "' + q.questionText + '" -> tapped "' + q.answers[M.tries[0]] + '" (= ' + M.value + ') but the game marked it wrong', { answers: q.answers });
    }
    let idx = -1;
    if (M.tries.length === 0 && isFinite(M.value)) {
      idx = q.answers.findIndex(a => Number(a) === M.value);
      if (idx < 0) report('CRITICAL', 'math', 'No offered answer equals the correct result: "' + q.questionText + '" = ' + M.value + ', options ' + q.answers.join(' / '));
    }
    if (idx < 0) { idx = [0, 1, 2].find(i => M.tries.indexOf(i) < 0); if (idx === undefined) idx = M.tries.length % 3; QA.stats.mathMisses++; }
    M.tries.push(idx); M.lastTap = QA.gameMs;
    const btns = getMathButtons(), b = btns[idx];
    if (b && M.tries.length <= 3) Inp.tap(b.x + b.w / 2, b.y + b.h / 2, 'answer "' + q.answers[idx] + '" to ' + q.questionText);
    else Inp.press(String(idx + 1));
  }
  function mathClosedCheck() {
    if (!M.sig || mathPopup.active) return;
    const answered = player.questionsAnswered > M.qa0;
    if (answered) {
      QA.stats.mathSolved++;
      if (M.purpose === 'ap') {
        const want = Math.min(M.maxAp, M.ap0 + tierReward());
        if (player.ap !== want) report('CRITICAL', 'math', 'AP reward mismatch after correct answer: AP ' + M.ap0 + ' -> ' + player.ap + ', expected ' + want + ' (+' + tierReward() + ', cap ' + M.maxAp + ')');
      } else {
        QA.stats.revives++;
        if (player.downed) report('CRITICAL', 'math', 'Hero still downed after answering the revive question correctly');
      }
    }
    M.sig = '';
  }

  // ---------------------------------------------------------------------
  // Modal handling (runs before the current phase each step)
  // ---------------------------------------------------------------------
  const LU = { before: null, lastTap: -1e9, taps: 0, choice: 0 };
  const UI = { lastPress: -1e9, dlgPresses: 0 };
  function handleModals() {
    mathClosedCheck();
    if (LU.before && !player.levelUpChoicePending) {
      const b = LU.before;
      const ok = LU.choice === 0 ? player.maxHearts === b.mh + 1 : player.attack === b.atk + 1;
      if (!ok) report('WARNING', 'levelup', 'Level-up reward not applied as chosen (' + (LU.choice ? '+1 Attack' : '+1 Max Heart') + '): maxHearts ' + b.mh + '->' + player.maxHearts + ', attack ' + b.atk + '->' + player.attack);
      else milestone('Level up -> Lv ' + player.level + ', chose ' + (LU.choice ? '+1 Attack' : '+1 Max Heart'));
      QA.stats.levelUps++;
      LU.before = null;
    }
    if (player.levelUpChoicePending) {
      QA.state = 'LEVEL_UP'; Inp.setMove([]);
      if (!LU.before) {
        LU.before = { mh: player.maxHearts, atk: player.attack }; LU.taps = 0;
        Cap.arm('levelup');
        if (typeof getLevelUpButtons === 'function') checkRectSet('Level-up buttons', getLevelUpButtons().map((r, i) => ({ name: 'choice ' + (i + 1), r })), { overlap: true });
      }
      if (QA.gameMs - LU.lastTap < 200) return true;
      LU.choice = player.maxHearts >= 5 ? 1 : 0;
      LU.lastTap = QA.gameMs; LU.taps++;
      const btn = typeof getLevelUpButtons === 'function' ? getLevelUpButtons()[LU.choice] : null;
      if (btn && LU.taps <= 3) Inp.tap(btn.x + btn.w / 2, btn.y + btn.h / 2, LU.choice ? '+1 Attack' : '+1 Max Heart');
      else Inp.press(String(LU.choice + 1));
      if (LU.taps > 8) report('CRITICAL', 'modal', 'Level-up popup cannot be dismissed (8 taps/keys)');
      return true;
    }
    if (mathPopup.active) { solveMath(); return true; }
    if (shop.active) {
      if (QA.shopSession) return false;
      if (QA.gameMs - UI.lastPress > 300) { UI.lastPress = QA.gameMs; agentIssue('shop open outside a shopping session; closing'); Inp.tap(GW() - 25, 25, 'shop close X'); }
      return true;
    }
    if (typeof wardrobe !== 'undefined' && wardrobe.active) { if (QA.gameMs - UI.lastPress > 300) { UI.lastPress = QA.gameMs; Inp.press('Escape'); } return true; }
    if (typeof pauseMenu !== 'undefined' && pauseMenu.active) { if (QA.gameMs - UI.lastPress > 300) { UI.lastPress = QA.gameMs; Inp.press('Escape'); } return true; }
    if (dialogue.active) {
      if (QA.dialogTest) return false;
      Inp.setMove([]);
      if (QA.gameMs - UI.lastPress > 250) { UI.lastPress = QA.gameMs; Inp.press('e'); UI.dlgPresses++; if (UI.dlgPresses > 20) report('CRITICAL', 'dialog', 'Dialogue cannot be dismissed (20 E presses)'); }
      return true;
    }
    UI.dlgPresses = 0;
    return false;
  }

  // ---------------------------------------------------------------------
  // COMBAT
  // ---------------------------------------------------------------------
  function facingOk(dx, dy) {
    const fa = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 }[hero.facing];
    let diff = Math.abs(Math.atan2(dy, dx) - fa); if (diff > Math.PI) diff = Math.PI * 2 - diff;
    return diff < 1.55;
  }
  function wantFacing(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); }
  function* topUpAP() {
    const target = Math.max(1, player.maxAp - tierReward() + 1);
    let guard = 0;
    while (player.ap < target && guard++ < 5 && !player.downed) {
      const q0 = player.questionsAnswered;
      Inp.setMove([]);
      QA.mathOpens++;
      if (QA.mathOpens % 4 === 0 && typeof qButtonRect === 'function') { const r = qButtonRect(); Inp.tap(r.x + r.w / 2, r.y + r.h / 2, 'Q/AP button'); }
      else Inp.press('q');
      const ok = yield* waitUntil(() => player.questionsAnswered > q0, 5000);
      if (!ok) { report('CRITICAL', 'math', 'Math popup did not open (or could not be answered) after ' + (QA.mathOpens % 4 === 0 ? 'tapping the Q button' : 'pressing Q') + ' - AP cannot be earned'); return false; }
    }
    yield;
    return true;
  }
  function tryRanged(e, dx, dy, d) {
    const rs = rangedSlot(); if (rs < 0) return false;
    const w = player.slots[rs], cost = w === 'bow' ? 1 : CONFIG.BOOMERANG_AP_COST;
    const maxR = w === 'bow' ? 170 : (player.owned.galeBoomerang ? 150 : 105);
    if (d < 36 || d > maxR || player.ap < cost) return false;
    if (Math.min(Math.abs(dx), Math.abs(dy)) > 6) return false;
    if (!losClear(currentMap(), hero.x, hero.y, e.x, e.y)) return false;
    const want = wantFacing(dx, dy);
    if (player.activeSlot !== rs) { Inp.setMove([]); Inp.press(String(rs + 1)); return true; }
    // one-off check of tap-to-attack with a ranged weapon (should face the enemy)
    if ((QA.tapRangedTests || 0) < 2 && hero.facing !== want && d < 100 && player.attackCooldown <= 0) {
      const sx = e.x - world.camX, sy = e.y - world.camY;
      if (sx > 20 && sy > 70 && sx < GW() - 70 && sy < GH() - 70) {
        QA.tapRangedTests = (QA.tapRangedTests || 0) + 1;
        const f0 = hero.facing;
        Inp.setMove([]);
        Inp.tap(sx, sy, 'tap enemy with ' + w);
        expect('ranged tap faces enemy', 250, () => hero.facing === want, () => report('WARNING', 'combat',
          'Tap-to-attack with a ranged weapon (' + w + ') fires without turning the hero toward the tapped enemy: facing stayed "' + f0 + '" although the enemy was ' + want,
          { suspected: 'Two global function declarations named faceToward exist; the later faceToward(e, ux, uy) replaces faceToward(x, y), so faceToward(tappedEnemy.x, tappedEnemy.y) in the tap-attack branch is a no-op' }));
        return true;
      }
    }
    if (hero.facing !== want) { Inp.setMove([DIRKEY[want]]); return true; }
    Inp.setMove([]);
    if (player.attackCooldown <= 0) { Inp.press(' '); QA.stats.rangedShots++; }
    return true;
  }
  function approach(e, dx, dy, d, forcePath) {
    const map = currentMap(), T0 = TS();
    if (!forcePath && d < 80 && losClear(map, hero.x, hero.y, e.x, e.y)) { Inp.setMove(zoneGuard(keysToward(dx, dy, 2))); return; }
    let g = { tx: Math.floor(e.x / T0), ty: Math.floor(e.y / T0) };
    if (solidTile(map, g.tx, g.ty) || zoneAtPoint(map, (g.tx + 0.5) * T0, (g.ty + 0.5) * T0)) g = nearestFree(map, g.tx, g.ty, 2);
    if (!g) { Inp.setMove(zoneGuard(keysToward(dx, dy, 2))); return false; }
    const r = Mover.step(g.tx, g.ty, { replanMs: 600, loose: true });
    if (r !== 'moving') Inp.setMove(zoneGuard(keysToward(dx, dy, 2)));
    return r !== 'nopath';
  }
  function* fight(e, opts) {
    opts = opts || {};
    const mk = mapKey(), deadline = QA.gameMs + (opts.timeoutMs || 20000);
    const prevState = QA.state;
    QA.state = 'COMBAT'; QA.target = e;
    let retreatUntil = 0, lastRetreat = -1e9, pathUntil = 0, noProg = 0, lastHp = e.hp, lastHit = QA.gameMs;
    const px = { x: hero.x, y: hero.y };
    Mover.reset();
    while (e.alive && mapKey() === mk) {
      if (e.hp !== lastHp) { lastHp = e.hp; lastHit = QA.gameMs; }
      if (!opts.boss && !e.isMiniboss && !e.isBoss && QA.gameMs - lastHit > 14000) { agentIssue('no damage dealt to ' + e.type + ' for 14s; giving up'); skipUntil.set(e, QA.gameMs + 30000); break; }
      if (QA.gameMs > deadline) { agentIssue('fight timeout vs ' + (e.bossKind || e.type)); skipUntil.set(e, QA.gameMs + 30000); break; }
      const dx = e.x - hero.x, dy = e.y - hero.y, d = Math.hypot(dx, dy);
      if (opts.chase && d > opts.chase + 90) break;
      if (player.downed) { Inp.setMove([]); yield; continue; }
      if (player.ap < 1) { Inp.setMove([]); yield* topUpAP(); continue; }
      if (!e.isMiniboss && !e.isBoss && player.hearts <= 1 && player.maxHearts >= 3 && QA.gameMs - lastRetreat > 8000 && d < 40) {
        lastRetreat = QA.gameMs; retreatUntil = QA.gameMs + 700;
      }
      if (QA.gameMs < retreatUntil) { QA.state = 'RETREAT'; Inp.setMove(zoneGuard(keysToward(-dx, -dy, 1))); yield; continue; }
      QA.state = 'COMBAT';
      if (tryRanged(e, dx, dy, d)) { yield; continue; }
      if (d > swordReach() - 7 && !(noProg > 10 && d <= swordReach() - 1)) {
        // direct steering can wedge in concave corners: fall back to A* for a while
        if (Math.hypot(hero.x - px.x, hero.y - px.y) < 0.2) { if (++noProg > 25) { pathUntil = QA.gameMs + 1500; noProg = 0; Mover.reset(); } } else noProg = 0;
        px.x = hero.x; px.y = hero.y;
        if (approach(e, dx, dy, d, QA.gameMs < pathUntil) === false && QA.gameMs < pathUntil && !e.isMiniboss && !e.isBoss) {
          agentIssue(e.type + ' is not reachable on foot; skipping it'); skipUntil.set(e, QA.gameMs + 60000); break;
        }
        yield; continue;
      }
      if (!facingOk(dx, dy)) { Inp.setMove([DIRKEY[wantFacing(dx, dy)]]); yield; continue; }
      Inp.setMove([]);
      const ss = swordSlot();
      if (player.activeSlot !== ss) { Inp.press(String(ss + 1)); yield; continue; }
      if (player.attackCooldown <= 0 && !Inp.held.has(' ')) { Inp.press(' '); QA.stats.swings++; }
      yield;
    }
    Inp.setMove([]);
    QA.state = prevState;
    if (!e.alive) { QA.stats.kills++; yield* collectLoot(1500); }
    return !e.alive;
  }
  function* collectLoot(ms) {
    const end = QA.gameMs + ms;
    yield* wait(380);
    while (QA.gameMs < end) {
      let best = null, bd = 90;
      for (const c of coins) { const d = Math.hypot(c.x - hero.x, c.y - hero.y); if (d < bd) { bd = d; best = c; } }
      if (player.hearts < player.maxHearts && typeof heartPickups !== 'undefined') for (const h of heartPickups) { const d = Math.hypot(h.x - hero.x, h.y - hero.y); if (d < bd) { bd = d; best = h; } }
      if (!best) break;
      Inp.setMove(zoneGuard(keysToward(best.x - hero.x, best.y - hero.y, 2)));
      yield;
    }
    Inp.setMove([]);
  }

  // ---------------------------------------------------------------------
  // Watchdogs (run after every update step)
  // ---------------------------------------------------------------------
  const PRE = { x: 0, y: 0, mk: '', hearts: 0, inv: 0, swing: 0, fade: 0, downed: false, modal: false, gs: '', facing: '' };
  function preStep() {
    if (!gameReady()) return;
    PRE.x = hero.x; PRE.y = hero.y; PRE.mk = mapKey(); PRE.hearts = player.hearts; PRE.inv = player.invincibleT;
    PRE.swing = player.swordSwingT; PRE.fade = fadeDir; PRE.downed = player.downed; PRE.modal = anyModal(); PRE.gs = gameState; PRE.facing = hero.facing;
  }
  const ST = { x: 0, y: 0, t: 0, mk: '' };
  const AN = { dist: 0, frames: new Set(), flips: 0, win: 0, keys: '' };
  function watchdogs(dtMs) {
    if (gameState !== STATE.PLAYING || PRE.gs !== STATE.PLAYING) return;
    const dt = dtMs / 1000, mk = mapKey(), p = PRE;
    const fade = fading() || p.fade !== 0;
    const moved = Math.hypot(hero.x - p.x, hero.y - p.y);
    const sameMap = mk === p.mk;
    const modal = p.modal || anyModal();
    // teleport / impossible displacement
    if (sameMap && !fade) {
      const lim = CONFIG.HERO_SPEED * dt * 2 + 0.05;
      const excused = player.hearts < p.hearts || player.invincibleT > p.inv + 1e-3 || player.swordSwingT > p.swing + 1e-3 || player.downed !== p.downed;
      if (moved > lim && !excused) report('CRITICAL', 'movement', 'Hero jumped ' + moved.toFixed(1) + 'px in one ' + dtMs.toFixed(1) + 'ms step (max expected ' + lim.toFixed(1) + 'px)', { from: [+p.x.toFixed(1), +p.y.toFixed(1)], to: [+hero.x.toFixed(1), +hero.y.toFixed(1)] });
    }
    // hitbox inside a solid tile
    if (!fade) {
      const map = currentMap(), hw = hero.w / 2, hh = hero.h / 2;
      const cs = [[hero.x - hw, hero.y - hh], [hero.x + hw, hero.y - hh], [hero.x - hw, hero.y + hh - 1], [hero.x + hw, hero.y + hh - 1]];
      for (const c of cs) {
        if (solidAt(map, c[0], c[1])) {
          const tx = Math.floor(c[0] / TS()), ty = Math.floor(c[1] / TS());
          report('CRITICAL', 'collision', 'Hero hitbox overlaps solid tile ' + tileName(tileAt(map, tx, ty)) + ' at tile (' + tx + ',' + ty + ') on ' + mk + ', hero at (' + hero.x.toFixed(1) + ',' + hero.y.toFixed(1) + ')', null, 'solid|' + mk + '|' + tx + ',' + ty);
          break;
        }
      }
    }
    // stuck while holding a move key toward walkable space
    const keys = Inp.moveKeys();
    if (!keys.length || modal || fade || player.downed || mk !== ST.mk) { ST.x = hero.x; ST.y = hero.y; ST.t = QA.gameMs; ST.mk = mk; }
    else if (Math.hypot(hero.x - ST.x, hero.y - ST.y) > 1) { ST.x = hero.x; ST.y = hero.y; ST.t = QA.gameMs; }
    else if (QA.gameMs - ST.t > 2000) {
      const map = currentMap(), step = CONFIG.HERO_SPEED * CONFIG.STEP_MS / 1000;
      let dx = 0, dy = 0;
      for (const k of keys) { if (k === 'ArrowLeft') dx -= 1; if (k === 'ArrowRight') dx += 1; if (k === 'ArrowUp') dy -= 1; if (k === 'ArrowDown') dy += 1; }
      const free = (dx && hitboxFree(map, hero.x + dx * step, hero.y)) || (dy && hitboxFree(map, hero.x, hero.y + dy * step));
      if (free) report('CRITICAL', 'movement', 'Hero stuck: held ' + keys.map(k => SHORT[k]).join('+') + ' for ' + ((QA.gameMs - ST.t) / 1000).toFixed(1) + 's toward walkable space but did not move',
        { pos: [+hero.x.toFixed(1), +hero.y.toFixed(1)] }, 'stuck|' + mk + '|' + Math.floor(hero.x / TS()) + ',' + Math.floor(hero.y / TS()));
      else agentIssue('agent held ' + keys.join('+') + ' into a wall for 2s');
      ST.t = QA.gameMs;
    }
    // walk animation / facing flicker / speed metrics
    if (!modal && !fade && sameMap && typeof heroWalkFrame === 'function') {
      const wf = heroWalkFrame();
      if (!hero.moving) {
        if (wf >= 0) report('WARNING', 'animation', 'Walk-cycle frame (' + wf + ') shown while the hero is idle');
        AN.dist = 0; AN.frames.clear();
      } else if (moved > 0.3) {
        AN.dist += moved; AN.frames.add(wf);
        if (AN.dist > 45) {
          if (AN.frames.size < 2) report('WARNING', 'animation', 'Walk animation frame not advancing while moving (' + AN.dist.toFixed(0) + 'px walked, frame stuck at ' + wf + ')');
          AN.dist = 0; AN.frames.clear();
        }
      }
      const ks = keys.join('+');
      if (ks && ks === AN.keys && moved > 0.3) {
        if (hero.facing !== p.facing) AN.flips++;
        if (QA.gameMs - AN.win > 1000) {
          if (AN.flips > 3) report('WARNING', 'animation', 'Facing flickered ' + AN.flips + ' times in 1s while holding ' + keys.map(k => SHORT[k]).join('+'));
          AN.flips = 0; AN.win = QA.gameMs;
        }
      } else { AN.keys = ks; AN.flips = 0; AN.win = QA.gameMs; }
      if (QA.calib && ks && moved > 0.1 && player.invincibleT <= p.inv + 1e-3 && player.swordSwingT <= p.swing + 1e-3) {
        const ax = Math.abs(hero.x - p.x) > 0.01, ay = Math.abs(hero.y - p.y) > 0.01;
        if (keys.length === 1 && ax !== ay) { QA.metrics.cardinal.n++; QA.metrics.cardinal.sum += moved / dt; }
        if (keys.length === 2 && ax && ay) { QA.metrics.diagonal.n++; QA.metrics.diagonal.sum += moved / dt; }
      }
    }
    // boss dead but key/door never granted
    if (world.mode === 'dungeon' && world.dungeon) {
      const d = world.dungeon, id = d.def.id, boss = (d.enemies[2] || []).find(e => e.isMiniboss);
      if (boss && !boss.alive) {
        if (d.bossDefeated) QA.bossDeadAt[id] = 0;
        else if (!QA.bossDeadAt[id]) QA.bossDeadAt[id] = QA.gameMs;
        else if (QA.gameMs - QA.bossDeadAt[id] > 1500 && !QA.bossReported[id]) {
          QA.bossReported[id] = true;
          report('CRITICAL', 'progression', d.def.name + ': boss "' + (boss.bossKind || boss.type) + '" was killed (alive=false, hp=' + boss.hp + ') but the dungeon never registers it: bossDefeated=' + d.bossDefeated +
            ', hasBossKey=' + d.hasBossKey + ', no Boss Key / heart piece spawned, boss door tile stays ' + tileName(d.rooms[2].grid[Math.floor(d.rooms[2].h / 2)][d.rooms[2].w - 1]) + ' - dungeon cannot be completed',
            { dungeon: id, suspected: 'updateDungeonRoom() skips enemies with alive=false before its "e.hp <= 0 && !d.bossDefeated -> defeatMiniboss()" check, but damageEnemy() already set alive=false on the killing blow, so defeatMiniboss() never runs' },
            'bosskey|' + id);
        }
      }
    }
    // hint text changed -> measure it next frame
    if (hud.hintText !== QA.lastHint) { QA.lastHint = hud.hintText; if (hud.hintText && hud.hintTimer > 0) Cap.arm('hint'); }
  }

  // ---------------------------------------------------------------------
  // Layout checks (rect helpers from the game + a pass-through draw capture)
  // ---------------------------------------------------------------------
  function fmtR(r) { return Math.round(r.x) + ',' + Math.round(r.y) + ' ' + Math.round(r.w) + 'x' + Math.round(r.h); }
  function overlapArea(a, b) {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
  }
  function contains(a, b) { return b.x >= a.x - 0.5 && b.y >= a.y - 0.5 && b.x + b.w <= a.x + a.w + 0.5 && b.y + b.h <= a.y + a.h + 0.5; }
  function checkRectSet(group, items, o) {
    const W = GW(), H = GH();
    const off = [];
    for (const it of items) {
      const r = it.r;
      if (r.x < -0.5 || r.y < -0.5 || r.x + r.w > W + 0.5 || r.y + r.h > H + 0.5) off.push(it.name + ' (' + fmtR(r) + ')');
    }
    if (off.length) report('WARNING', 'layout', group + ': ' + off.length + ' of ' + items.length + ' rects extend outside the ' + W + 'x' + H + ' canvas and cannot be seen/tapped: ' + off.join('; '), null, 'off|' + group);
    if (o && o.overlap) {
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (overlapArea(a.r, b.r) > 0.5 && !contains(a.r, b.r) && !contains(b.r, a.r)) {
          report('WARNING', 'layout', group + ': "' + a.name + '" (' + fmtR(a.r) + ') overlaps "' + b.name + '" (' + fmtR(b.r) + ')', null, 'ov|' + group + '|' + a.name + '|' + b.name);
        }
      }
    }
  }
  function srcNums(fn, re) {
    try { const f = window[fn]; if (typeof f !== 'function') return null; const m = re.exec(Function.prototype.toString.call(f)); return m ? m.map(Number) : null; }
    catch (e) { return null; }
  }
  function hudItems() {
    const items = [], H = GH();
    for (const n of ['qButtonRect', 'speakerIconRect', 'wardrobeButtonRect', 'saveButtonRect']) {
      try { const f = window[n]; if (typeof f === 'function') { const r = f(); if (r && isFinite(r.x)) items.push({ name: n.replace(/Rect$/, ''), r }); } } catch (e) {}
    }
    const s = srcNums('tapWeaponSlot', /slotSize\s*=\s*(\d+)\s*,\s*gap\s*=\s*(\d+)\s*,\s*startX\s*=\s*(\d+)\s*,\s*y\s*=\s*CONFIG\.GAME_H\s*-\s*slotSize\s*-\s*(\d+)/);
    if (s) for (let i = 0; i < 3; i++) items.push({ name: 'weaponSlot' + (i + 1), r: { x: s[3] + i * (s[1] + s[2]), y: H - s[1] - s[4], w: s[1], h: s[1] } });
    const hp = srcNums('drawHUD', /panelX\s*=\s*(\d+)\s*,\s*panelY\s*=\s*(\d+)\s*,\s*panelW\s*=\s*(\d+)\s*,\s*panelH\s*=\s*(\d+)/);
    if (hp) items.push({ name: 'hudPanel', r: { x: hp[1], y: hp[2], w: hp[3], h: hp[4] } });
    const xp = srcNums('drawXPBar', /x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*,\s*w\s*=\s*(\d+)\s*,\s*h\s*=\s*(\d+)/);
    if (xp) items.push({ name: 'xpBar', r: { x: xp[1], y: xp[2], w: xp[3], h: xp[4] } });
    return items;
  }
  function checkHudLayout() {
    const items = hudItems();
    QA.layout.hud = items.map(i => ({ name: i.name, rect: fmtR(i.r) }));
    if (!items.length) agentIssue('no HUD rect helpers found; HUD overlap check skipped');
    checkRectSet('HUD', items, { overlap: true });
  }
  function shopViewport() {
    try { if (typeof shopView === 'function') return shopView(); } catch (e) {}
    return { x: 0, y: 0, w: GW(), h: GH() };
  }
  function rowFullyVisible(row) {
    const v = shopViewport(), r = row.rect;
    return r.y >= Math.max(0, v.y) - 0.5 && r.y + r.h <= Math.min(GH(), v.y + v.h) + 0.5;
  }
  function checkShopLayout() {
    try {
      const rows = getShopRows();
      if (rows.length && rows[0].visible !== undefined) {
        // scrollable list: the viewport must be on-canvas; rows are checked when the agent scrolls to them
        checkRectSet('Shop viewport', [{ name: 'list viewport', r: shopViewport() }], {});
        checkRectSet('Shop rows (visible)', rows.filter(r => r.visible && rowFullyVisible(r)).map(r => ({ name: r.item.name, r: r.rect })), { overlap: true });
      } else checkRectSet('Shop rows', rows.map(r => ({ name: r.item.name, r: r.rect })), { overlap: true });
      QA.layout.shopRows = rows.map(r => ({ item: r.item.name, rect: fmtR(r.rect) }));
    } catch (e) { agentIssue('shop layout check failed: ' + e.message); }
  }

  const Cap = {
    armed: false, reasons: [], patched: null, texts: [], rects: [], smooth: 0, lastPeriodic: 0, seq: 0, layer: 0,
    arm(r) { this.armed = true; if (this.reasons.length < 8 && this.reasons.indexOf(r) < 0) this.reasons.push(r); },
    begin() {
      if (!this.armed || this.patched || !QA.running) return;
      const c = gctx(); if (!c) return;
      const P = CanvasRenderingContext2D.prototype, self = this;
      this.texts.length = 0; this.rects.length = 0; this.smooth = 0; this.seq = 0; this.layer = 0;
      c.fillText = function (t, x, y, mw) { self.recText(this, t, x, y, mw); return P.fillText.apply(this, arguments); };
      c.strokeText = function (t, x, y, mw) { self.recText(this, t, x, y, mw, true); return P.strokeText.apply(this, arguments); };
      c.fillRect = function (x, y, w, h) { self.recRect(this, x, y, w, h); return P.fillRect.apply(this, arguments); };
      c.strokeRect = function (x, y, w, h) { self.recRect(this, x, y, w, h); return P.strokeRect.apply(this, arguments); };
      c.drawImage = function () { if (this.imageSmoothingEnabled) self.smooth++; return P.drawImage.apply(this, arguments); };
      // track rectangular clip regions (scrolling lists clip their rows)
      self.clip = null; self.clipStack = []; self.pathRect = null;
      c.save = function () { self.clipStack.push(self.clip); return P.save.apply(this, arguments); };
      c.restore = function () { self.clip = self.clipStack.length ? self.clipStack.pop() : null; return P.restore.apply(this, arguments); };
      c.beginPath = function () { self.pathRect = null; return P.beginPath.apply(this, arguments); };
      c.rect = function (x, y, w, h) { const f = self.xf(this); if (f) self.pathRect = { x: x * f.sx + f.tx, y: y * f.sy + f.ty, w: w * f.sx, h: h * f.sy }; return P.rect.apply(this, arguments); };
      c.clip = function () {
        if (self.pathRect) { const a = self.pathRect, b = self.clip; self.clip = !b ? a : (() => { const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y); return { x, y, w: Math.max(0, Math.min(a.x + a.w, b.x + b.w) - x), h: Math.max(0, Math.min(a.y + a.h, b.y + b.h) - y) }; })(); }
        return P.clip.apply(this, arguments);
      };
      this.patched = c;
    },
    end() {
      const c = this.patched; if (!c) return;
      delete c.fillText; delete c.strokeText; delete c.fillRect; delete c.strokeRect; delete c.drawImage;
      delete c.save; delete c.restore; delete c.beginPath; delete c.rect; delete c.clip;
      this.patched = null; this.armed = false;
      const reasons = this.reasons.slice(); this.reasons.length = 0;
      try { analyzeCapture(reasons); } catch (e) { agentIssue('capture analysis failed: ' + e.message); }
    },
    xf(c) {
      const m = c.getTransform(), s = c.canvas.width / GW();
      if (Math.abs(m.b) > 1e-6 || Math.abs(m.c) > 1e-6) return null;
      return { sx: m.a / s, sy: m.d / s, tx: m.e / s, ty: m.f / s };
    },
    recText(c, t, x, y, mw, stroke) {
      if (this.texts.length > 600) return;
      const f = this.xf(c); if (!f) return;
      const str = String(t), mt = c.measureText(str);
      let w = mt.width; if (mw !== undefined && mw < w) w = mw;
      const al = c.textAlign, left = al === 'center' ? x - w / 2 : (al === 'right' || al === 'end') ? x - w : x;
      const asc = mt.actualBoundingBoxAscent || 0, dsc = mt.actualBoundingBoxDescent || 0;
      const screen = Math.abs(f.tx) < 0.5 && Math.abs(f.ty) < 0.5 && Math.abs(f.sx - 1) < 1e-3 && Math.abs(f.sy - 1) < 1e-3;
      const t0 = { seq: ++this.seq, layer: this.layer, t: str, x: x * f.sx + f.tx, y: y * f.sy + f.ty, l: left * f.sx + f.tx, r: (left + w) * f.sx + f.tx,
        top: (y - asc) * f.sy + f.ty, bot: (y + dsc) * f.sy + f.ty, font: c.font, screen, alpha: c.globalAlpha, stroke: !!stroke };
      const cl = this.clip;
      if (cl) {
        t0.l = Math.max(t0.l, cl.x); t0.r = Math.min(t0.r, cl.x + cl.w); t0.top = Math.max(t0.top, cl.y); t0.bot = Math.min(t0.bot, cl.y + cl.h);
        if (t0.r <= t0.l || t0.bot <= t0.top) return; // fully clipped away: not visible
      }
      this.texts.push(t0);
    },
    recRect(c, x, y, w, h) {
      if (this.rects.length > 1500) return;
      const f = this.xf(c); if (!f) return;
      if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; }
      const screen = Math.abs(f.tx) < 0.5 && Math.abs(f.ty) < 0.5;
      const r = { seq: ++this.seq, x: x * f.sx + f.tx, y: y * f.sy + f.ty, w: w * f.sx, h: h * f.sy, screen };
      // a (near) full-screen fill starts a new visual layer: what was drawn before is covered
      if (screen && r.x <= 1 && r.y <= 1 && r.w >= GW() - 2 && r.h >= GH() - 2) this.layer = r.seq;
      this.rects.push(r);
    },
  };
  function measureWith(font, text) {
    if (!QA.mctx) QA.mctx = document.createElement('canvas').getContext('2d');
    QA.mctx.font = font; return QA.mctx.measureText(text).width;
  }
  function analyzeCapture(reasons) {
    const W = GW(), H = GH(), T = Cap.texts;
    const R = Cap.rects.filter(r => r.screen && r.w > 4 && r.h > 4 && r.w * r.h < W * H * 0.6);
    if (Cap.smooth) report('WARNING', 'render', 'drawImage called with imageSmoothingEnabled=true on the main game canvas (' + Cap.smooth + ' draws in one frame) - pixel art will blur');
    const scr = T.filter(t => t.screen && t.alpha >= 0.3 && t.t.trim());
    const hidden = [];
    for (const tx of scr) {
      const norm = tx.t.replace(/\d+/g, '#');
      if (tx.bot < 0 || tx.top > H || tx.r < 0 || tx.l > W) { hidden.push(tx.t); tx.bad = true; continue; }
      if (tx.l < -1 || tx.r > W + 1 || tx.top < -1 || tx.bot > H + 1) {
        tx.bad = true;
        report('WARNING', 'layout', 'Text clipped by the canvas edge: "' + tx.t + '" spans x ' + tx.l.toFixed(0) + '..' + tx.r.toFixed(0) + ', y ' + tx.top.toFixed(0) + '..' + tx.bot.toFixed(0) + ' (' + tx.font + ')', null, 'clip|' + norm);
      }
      // smallest rect of the same visual layer drawn before the text that contains its anchor
      let best = null, ba = Infinity; const ay = (tx.top + tx.bot) / 2;
      const cand = R.filter(r => r.seq > tx.layer && r.seq < tx.seq && tx.x >= r.x && tx.x <= r.x + r.w && ay >= r.y && ay <= r.y + r.h && r.h >= (tx.bot - tx.top) - 1);
      for (const r of cand) {
        // skip progress-bar fills drawn over a wider track with the same origin/height
        if (cand.some(o => o !== r && Math.abs(o.x - r.x) < 0.6 && Math.abs(o.y - r.y) < 0.6 && Math.abs(o.h - r.h) < 0.6 && o.w > r.w)) continue;
        const a = r.w * r.h; if (a < ba) { ba = a; best = r; }
      }
      tx.box = best;
      if (best && (tx.l < best.x - 1 || tx.r > best.x + best.w + 1)) {
        tx.bad = true;
        report('WARNING', 'layout', 'Text wider than its box: "' + tx.t + '" is ' + (tx.r - tx.l).toFixed(0) + 'px wide (' + tx.font + ') but its box is ' + best.w.toFixed(0) + 'px (box at ' + fmtR(best) + ')', { text: tx.t, box: fmtR(best) }, 'box|' + norm);
      }
    }
    if (hidden.length) {
      const ctxName = shop.active ? 'shop' : mathPopup.active ? 'math popup' : dialogue.active ? 'dialogue' : gameState;
      report('WARNING', 'layout', hidden.length + ' text item(s) drawn entirely outside the ' + W + 'x' + H + ' canvas (' + ctxName + '), invisible to the player: ' + hidden.slice(0, 12).map(t => '"' + t + '"').join(', '), null, 'hidden|' + ctxName);
    }
    // text drawn on top of other text (same visual layer only; skip texts already reported)
    for (let i = 0; i < scr.length; i++) for (let j = i + 1; j < scr.length; j++) {
      const a = scr[i], b = scr[j];
      if (a.t === b.t || a.alpha < 0.5 || b.alpha < 0.5 || a.bad || b.bad) continue;
      if (Math.max(a.layer, b.layer) > Math.min(a.seq, b.seq)) continue;
      const ar = { x: a.l, y: a.top, w: a.r - a.l, h: a.bot - a.top }, br = { x: b.l, y: b.top, w: b.r - b.l, h: b.bot - b.top };
      if (overlapArea(ar, br) > 6) report('WARNING', 'layout', 'Text "' + a.t + '" overlaps text "' + b.t + '"', null, 'tov|' + [a.t, b.t].map(s => s.replace(/\d+/g, '#')).sort().join('|'));
    }
    if (gameState !== STATE.PLAYING) return;
    // dialogue box: on-canvas + every NPC line fits
    if (dialogue.active && dialogue.npc) {
      const line = dialogue.npc.lines[dialogue.lineIndex];
      const tx = scr.find(t => t.t === line);
      if (tx && tx.box && !QA.layout.dialogChecked) {
        QA.layout.dialogChecked = true;
        const b = tx.box; QA.layout.dialogBox = fmtR(b);
        if (b.x < 0 || b.y < 0 || b.x + b.w > W || b.y + b.h > H) report('WARNING', 'dialog', 'NPC dialogue box (' + fmtR(b) + ') is partly outside the canvas');
        const all = [];
        try { for (const n of villagerNPCs.concat(cameoNPCs, houseNPCs, shopNPCs, desertShopNPCs)) for (const l of n.lines) all.push({ n: n.name, l }); } catch (e) {}
        for (const it of all) {
          const w = measureWith(tx.font, it.l);
          if (tx.l + w > b.x + b.w - 2) report('WARNING', 'dialog', 'Dialogue line by ' + it.n + ' overflows the dialogue box: "' + it.l + '" needs ' + w.toFixed(0) + 'px from x=' + tx.l.toFixed(0) + ', box ends at x=' + (b.x + b.w).toFixed(0), null, 'dlgline|' + it.l);
        }
      }
    }
    // math answers inside their buttons
    if (mathPopup.active && mathPopup.question && typeof getMathButtons === 'function') {
      const btns = getMathButtons();
      mathPopup.question.answers.forEach((a, i) => {
        const b = btns[i], tx = b && scr.find(t => t.t === String(a) && Math.abs(t.x - (b.x + b.w / 2)) < 3);
        if (tx && (tx.l < b.x || tx.r > b.x + b.w)) report('WARNING', 'layout', 'Math answer "' + a + '" (' + (tx.r - tx.l).toFixed(0) + 'px) is wider than its button (' + b.w.toFixed(0) + 'px)', null, 'mathans');
      });
    }
    // hint banner vs HUD elements
    if (hud.hintTimer > 0 && hud.hintText) {
      const tx = scr.find(t => t.t === hud.hintText);
      if (tx && tx.box) {
        for (const it of hudItems()) if (overlapArea(tx.box, it.r) > 0.5) report('WARNING', 'layout', 'Hint banner (' + fmtR(tx.box) + ') overlaps HUD element "' + it.name + '" (' + fmtR(it.r) + ')', null, 'hintov|' + it.name);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Phases
  // ---------------------------------------------------------------------
  function findOpenArea(w, h) {
    const map = currentMap(), ht = heroTile();
    for (let r = 0; r < 25; r++) {
      for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) {
        if (Math.max(Math.abs(ox), Math.abs(oy)) !== r) continue;
        const bx = ht.tx + ox, by = ht.ty + oy;
        let ok = true;
        for (let y = by - 1; y <= by + h && ok; y++) for (let x = bx - w - 1; x <= bx + 1 && ok; x++) {
          if (solidTile(map, x, y) || zoneAtPoint(map, (x + 0.5) * TS(), (y + 0.5) * TS())) ok = false;
        }
        if (ok) {
          try { for (const n of allNPCs()) if (Math.hypot(n.x - (bx - w / 2) * TS(), n.y - (by + h / 2) * TS()) < 120) ok = false; } catch (e) {}
          for (const e of currentEnemies()) if (e.alive && Math.hypot(e.x - (bx - w / 2) * TS(), e.y - (by + h / 2) * TS()) < 200) ok = false;
          for (const p of currentPots()) if (p.alive && Math.hypot(p.x - (bx - w / 2) * TS(), p.y - (by + h / 2) * TS()) < 90) ok = false;
        }
        if (ok) return { tx: bx - w, ty: by };
      }
    }
    return null;
  }
  // static world sanity: enemies / pots whose centre sits inside solid terrain can never be reached
  function checkSpawns() {
    const bad = [];
    const chk = (map, list, where, kind) => { for (const o of list) if (o && solidAt(map, o.x, o.y)) bad.push(kind + (o.type ? ' ' + o.type : o.isBush ? ' bush' : '') + ' @' + where + ' (' + Math.round(o.x) + ',' + Math.round(o.y) + ') on ' + tileName(tileAt(map, Math.floor(o.x / TS()), Math.floor(o.y / TS()))));
    };
    try {
      chk(overworld, currentEnemies(), 'overworld', 'enemy');
      chk(overworld, currentPots(), 'overworld', 'pot');
      for (const d of dungeons) d.rooms.forEach((r, i) => { chk(r, d.enemies[i] || [], d.def.id + ':' + i, 'enemy'); chk(r, d.pots[i] || [], d.def.id + ':' + i, 'pot'); });
    } catch (e) { agentIssue('spawn check failed: ' + e.message); }
    if (bad.length) report('WARNING', 'world', bad.length + ' enemies/pots are placed inside solid terrain and can never be reached: ' + bad.slice(0, 15).join('; '), null, 'spawns');
  }
  function* phaseCalibrate() {
    QA.state = 'CALIBRATE';
    checkSpawns();
    checkHudLayout();
    Cap.arm('hud');
    const spot = findOpenArea(6, 5);
    if (!spot) { agentIssue('no open calibration area found'); return; }
    const r = yield* navTo(spot.tx, spot.ty, { label: 'calibration spot' });
    if (r !== 'arrived') { agentIssue('could not reach calibration spot: ' + r); return; }
    QA.goal = 'movement calibration';
    QA.calib = true;
    for (let i = 0; i < 40; i++) { Inp.setMove(['ArrowRight']); yield; }
    Inp.setMove([]); yield* wait(150);
    for (let i = 0; i < 40; i++) { Inp.setMove(['ArrowDown', 'ArrowLeft']); yield; }
    Inp.setMove([]); QA.calib = false;
    yield* wait(150);
    const c = QA.metrics.cardinal, dg = QA.metrics.diagonal;
    const cs = c.n ? c.sum / c.n : 0, ds = dg.n ? dg.sum / dg.n : 0;
    QA.metrics.cardinalSpeed = +cs.toFixed(2); QA.metrics.diagonalSpeed = +ds.toFixed(2);
    if (c.n > 10 && Math.abs(cs - CONFIG.HERO_SPEED) / CONFIG.HERO_SPEED > 0.05) report('WARNING', 'movement', 'Cardinal walk speed ' + cs.toFixed(1) + 'px/s differs from CONFIG.HERO_SPEED ' + CONFIG.HERO_SPEED);
    if (c.n > 10 && dg.n > 10 && Math.abs(ds - cs) / cs > 0.08) report('WARNING', 'movement', 'Diagonal speed ' + ds.toFixed(1) + 'px/s differs from cardinal speed ' + cs.toFixed(1) + 'px/s');
    milestone('Movement calibration: cardinal ' + cs.toFixed(1) + 'px/s, diagonal ' + ds.toFixed(1) + 'px/s');
    // tap-to-move
    const map = currentMap();
    let tgt = null;
    for (const [ox, oy] of [[56, 24], [-56, 24], [56, -24], [-56, -24], [40, 0], [-40, 0]]) {
      const x = hero.x + ox, y = hero.y + oy;
      if (!hitboxFree(map, x, y) || !losClear(map, hero.x, hero.y, x, y) || zoneAtPoint(map, x, y)) continue;
      const sx = x - world.camX, sy = y - world.camY;
      if (sx < 20 || sy < 80 || sx > GW() - 70 || sy > GH() - 70) continue;
      if (currentEnemies().some(e => e.alive && Math.hypot(e.x - x, e.y - y) < 60)) continue;
      if (currentPots().some(p => p.alive && Math.hypot(p.x - x, p.y - y) < 20)) continue;
      if (allNPCs().some(n => Math.hypot(n.x - x, n.y - y) < 20)) continue;
      tgt = { x, y, sx, sy }; break;
    }
    if (!tgt) { agentIssue('no spot for tap-to-move test'); return; }
    QA.goal = 'tap-to-move test';
    let flips = 0, f = hero.facing;
    Inp.tap(tgt.sx, tgt.sy, 'tap-to-move');
    for (let i = 0; i < 120; i++) {
      yield;
      if (hero.facing !== f) { flips++; f = hero.facing; }
      if (Math.hypot(hero.x - tgt.x, hero.y - tgt.y) < 3.5 && !hero.moving) break;
    }
    const dist = Math.hypot(hero.x - tgt.x, hero.y - tgt.y);
    if (dist > 4) report('WARNING', 'input', 'Tap-to-move did not reach the tapped point (' + dist.toFixed(1) + 'px away after 2s)');
    else milestone('Tap-to-move reached target (' + flips + ' facing changes)');
    if (flips > 2) report('WARNING', 'animation', 'Facing flickered ' + flips + ' times during a single straight tap-to-move walk');
  }
  function* phaseNpcTest() {
    QA.state = 'NPC_TEST';
    let npcs = [];
    try { npcs = allNPCs().filter(n => !n.isShopkeeper); } catch (e) {}
    npcs.sort((a, b) => Math.hypot(a.x - hero.x, a.y - hero.y) - Math.hypot(b.x - hero.x, b.y - hero.y));
    const npc = npcs[0];
    if (!npc) { agentIssue('no NPC to talk to'); return; }
    QA.goal = 'talk to ' + npc.name; QA.target = npc;
    for (let attempt = 0; attempt < 4 && !dialogue.active; attempt++) {
      const end = QA.gameMs + 20000;
      Mover.reset();
      while (QA.gameMs < end && Math.hypot(npc.x - hero.x, npc.y - hero.y) > 26) {
        const map = currentMap(); let g = { tx: Math.floor(npc.x / TS()), ty: Math.floor(npc.y / TS()) };
        if (solidTile(map, g.tx, g.ty)) g = nearestFree(map, g.tx, g.ty, 2) || g;
        const r = Mover.step(g.tx, g.ty, { replanMs: 500, loose: true });
        if (r !== 'moving') Inp.setMove(zoneGuard(keysToward(npc.x - hero.x, npc.y - hero.y, 2)));
        yield;
      }
      Inp.setMove([]);
      QA.dialogTest = true;
      Inp.press('e');
      yield* waitUntil(() => dialogue.active, 300);
    }
    if (!dialogue.active) { agentIssue('could not open NPC dialogue'); QA.dialogTest = false; return; }
    milestone('Opened dialogue with ' + npc.name + ' (' + npc.lines.length + ' lines)');
    Cap.arm('dialog');
    let presses = 0;
    const n = npc.lines.length;
    while (dialogue.active && presses < n + 4) {
      yield* wait(200);
      Cap.arm('dialog');
      if (dialogue.active) { Inp.press(presses % 2 ? 'Enter' : 'e'); presses++; }
      yield* wait(60);
    }
    QA.dialogTest = false;
    if (dialogue.active) report('CRITICAL', 'dialog', 'NPC dialogue with ' + npc.name + ' did not close after ' + presses + ' advance presses (' + n + ' lines)');
    else if (presses !== n) report('WARNING', 'dialog', 'NPC dialogue with ' + n + ' lines closed after ' + presses + ' presses');
    else milestone('Dialogue dismissed after ' + presses + ' presses');
    const moved0 = { x: hero.x, y: hero.y };
    for (let i = 0; i < 10; i++) { Inp.setMove(zoneGuard(['ArrowDown'])); yield; }
    Inp.setMove([]);
    if (Math.hypot(hero.x - moved0.x, hero.y - moved0.y) < 0.5 && hitboxFree(currentMap(), moved0.x, moved0.y + 3) && !zoneAtPoint(currentMap(), moved0.x, moved0.y + 3)) {
      report('CRITICAL', 'input', 'Input locked after dismissing NPC dialogue: hero cannot move');
    }
  }

  function pickFarmTarget(skip) {
    const cx = overworld.w / 2 * TS(), cy = overworld.h / 2 * TS();
    let best = null, bd = Infinity;
    const map = currentMap();
    for (const e of currentEnemies()) {
      if (!e.alive || skip.has(e) || skipped(e) || solidAt(map, e.x, e.y)) continue;
      const d = Math.hypot(e.x - hero.x, e.y - hero.y) + Math.hypot(e.x - cx, e.y - cy) * 0.3;
      if (d < bd) { bd = d; best = { kind: 'enemy', o: e }; }
    }
    for (const p of currentPots()) {
      if (!p.alive || skip.has(p) || solidAt(map, p.x, p.y)) continue;
      const d = Math.hypot(p.x - hero.x, p.y - hero.y) + Math.hypot(p.x - cx, p.y - cy) * 0.3 + 40;
      if (d < bd) { bd = d; best = { kind: 'pot', o: p }; }
    }
    return best;
  }
  function* smashPotNear(p) {
    Inp.setMove([]);
    const inRange = currentPots().filter(q => q.alive && Math.hypot(q.x - hero.x, q.y - hero.y) < 26);
    Inp.press('e');
    let ok = yield* waitUntil(() => !p.alive, 300);
    if (!ok && inRange.some(q => !q.alive)) ok = yield* waitUntil(() => !p.alive, 50) || (Inp.press('e'), yield* waitUntil(() => !p.alive, 300));
    if (!ok) {
      const dx = p.x - hero.x, dy = p.y - hero.y;
      if (Math.hypot(dx, dy) < 26 && !inRange.some(q => !q.alive) && !anyModal()) report('WARNING', 'interaction', 'Pressing E ' + Math.hypot(dx, dy).toFixed(0) + 'px from a ' + (p.isBush ? 'bush' : 'pot') + ' did not smash it (no pot in range broke)');
      if (player.ap < 1) yield* topUpAP();
      for (let i = 0; i < 6 && !facingOk(dx, dy); i++) { Inp.setMove([DIRKEY[wantFacing(dx, dy)]]); yield; }
      Inp.setMove([]);
      if (player.activeSlot !== swordSlot()) { Inp.press(String(swordSlot() + 1)); yield; yield; }
      yield* waitUntil(() => player.attackCooldown <= 0, 600);
      Inp.press(' '); QA.stats.swings++;
      ok = yield* waitUntil(() => !p.alive, 300);
    }
    if (ok) { QA.stats.pots++; yield* collectLoot(1100); }
    return ok;
  }
  function* phaseFarm(goldTarget, budgetMs) {
    QA.state = 'FARMING';
    const end = QA.gameMs + budgetMs, skip = new WeakSet();
    const g0 = hud.gold;
    while (hud.gold < goldTarget && QA.gameMs < end) {
      yield* ensureOverworld();
      const t = pickFarmTarget(skip);
      if (!t) { agentIssue('no farm targets left'); break; }
      QA.state = 'FARMING';
      QA.goal = 'farm ' + (t.kind === 'enemy' ? t.o.type : t.o.isBush ? 'bush' : 'pot') + ' (gold ' + hud.gold + '/' + goldTarget + ')';
      QA.target = t.o;
      if (t.kind === 'enemy') {
        const ok = yield* goNear(t.o, 60, 40000);
        if (!ok) { skip.add(t.o); yield; continue; }
        const killed = yield* fight(t.o, { timeoutMs: 25000 });
        if (!killed) skip.add(t.o);
      } else {
        const ok = yield* goNear(t.o, 14, 30000);
        if (!ok) { skip.add(t.o); yield; continue; }
        const s = yield* smashPotNear(t.o);
        if (!s) skip.add(t.o);
      }
      yield;
    }
    milestone('Farming done: gold ' + g0 + ' -> ' + hud.gold + ', level ' + player.level + ', kills ' + QA.stats.kills + ', pots ' + QA.stats.pots);
  }

  function* ensureOverworld() {
    let guard = 0;
    while (world.mode !== 'overworld' && guard++ < 10) {
      if (world.mode === 'interior') {
        const ex = world.interior.exit;
        yield* navTo(Math.floor(ex.x), Math.floor(ex.y), { allowZone: true, expectTransition: true, label: 'leave building' });
      } else if (world.mode === 'dungeon') {
        const map = currentMap();
        yield* navTo(0, Math.floor(map.h / 2), { allowZone: true, expectTransition: true, label: 'walk west to leave dungeon' });
      } else break;
      yield* waitUntil(() => !fading(), 1500);
      yield;
    }
  }

  const WISHLIST = ['sharpSword', 'boomerang', 'heartContainer', 'bow', 'heroSword', 'galeBoomerang', 'fireArrow', 'iceArrow',
    'heartContainer', 'skinRed', 'skinBlue', 'skinPlumber', 'superMushroom', 'fireFlower', 'dkBarrel', 'inkBlaster'];
  function wantedAffordable() {
    try {
      for (const id of WISHLIST) {
        const it = SHOP_ITEMS.find(i => i.id === id);
        if (!it || (it.consumable && QA.stats.bought.some(b => b.id === id))) continue;
        if (canBuy(it) && hud.gold >= it.price && !(it.consumable || it.skin)) return it;
      }
    } catch (e) {}
    return null;
  }
  function ownSnap(item) {
    return { owned: player.owned[item.id], hcb: player.heartContainersBought, mh: player.maxHearts, skin: item.skin ? player.unlockedSkins[item.skin] : null };
  }
  function ownChangedOk(item, s) {
    if (item.skin) return player.unlockedSkins[item.skin] === true && s.skin !== true;
    if (item.consumable) return (player.owned[item.id] || 0) === (s.owned || 0) + 1;
    if (item.id === 'heartContainer') return player.heartContainersBought === s.hcb + 1 && player.maxHearts === s.mh + 1;
    return player.owned[item.id] === true && s.owned !== true;
  }
  function* phaseShop(bname) {
    QA.state = 'SHOPPING';
    yield* ensureOverworld();
    const b = buildings.find(x => x.name === (bname || 'shop'));
    if (!b) { agentIssue('shop building not found'); return; }
    let r = yield* navTo(b.doorTileX, b.doorTileY, { allowZone: true, expectTransition: true, label: 'walk to ' + b.name + ' door', timeoutMs: 180000 });
    yield* waitUntil(() => !fading(), 1500);
    if (world.mode !== 'interior') {
      if (r === 'no-transition') report('CRITICAL', 'transition', 'Walking onto the ' + b.name + ' door did not enter the building');
      else agentIssue('could not reach ' + b.name + ' door: ' + r);
      return;
    }
    if (world.interior !== b.interior) report('CRITICAL', 'transition', 'Entered the wrong interior via the ' + b.name + ' door: ' + (world.interior && world.interior.label));
    milestone('Entered ' + (world.interior && world.interior.label) + ' with ' + hud.gold + ' gold');
    // talk to the shopkeeper
    for (let tries = 0; tries < 6 && !shop.active; tries++) {
      const sk = allNPCs().find(n => n.isShopkeeper);
      if (!sk) { report('CRITICAL', 'shop', 'No shopkeeper inside ' + b.name); break; }
      QA.goal = 'talk to shopkeeper';
      const end = QA.gameMs + 4000;
      while (Math.hypot(sk.x - hero.x, sk.y - hero.y) > 36 && QA.gameMs < end) {
        Inp.setMove(zoneGuard(keysToward(sk.x - hero.x, sk.y + 14 - hero.y, 2))); yield;
      }
      Inp.setMove([]);
      QA.shopSession = true;
      Inp.press('e');
      yield* waitUntil(() => shop.active, 400);
    }
    if (!shop.active) { QA.shopSession = false; report('CRITICAL', 'shop', 'Could not open the shop by pressing E next to the shopkeeper'); yield* ensureOverworld(); return; }
    milestone('Shop opened');
    Cap.arm('shop'); checkShopLayout();
    yield* wait(120);
    const bought = new Set();
    for (const id of WISHLIST) {
      const rows = getShopRows(), row = rows.find(x => x.item.id === id);
      if (!row) continue;
      const item = row.item;
      if (item.consumable && bought.has(id)) continue;
      if (!canBuy(item) || hud.gold < item.price) continue;
      if (!rowFullyVisible(row)) {
        // scroll like a player would: mouse wheel over the list, then arrow keys
        let vis = false;
        for (let i = 0; i < 14 && !vis; i++) {
          const cur = getShopRows().find(x => x.item.id === id), v = shopViewport(), dir = cur.rect.y < Math.max(0, v.y) ? -1 : 1;
          if (i < 8) {
            const c = gcanvas(), p = Inp.toClient(GW() / 2, Math.min(GH() - 20, v.y + v.h / 2));
            c.dispatchEvent(new WheelEvent('wheel', { deltaY: 90 * dir, deltaMode: 0, clientX: p.x, clientY: p.y, bubbles: true, cancelable: true }));
            logInput('wheel', dir > 0 ? 'down' : 'up');
          } else Inp.press(dir > 0 ? 'ArrowDown' : 'ArrowUp');
          yield* wait(100);
          vis = rowFullyVisible(getShopRows().find(x => x.item.id === id));
        }
        if (!vis) {
          report('WARNING', 'shop', 'Cannot buy "' + item.name + '" (' + item.price + 'g, affordable): its row stays outside the visible list/canvas (y=' + Math.round(row.rect.y) + '..' + Math.round(row.rect.y + row.rect.h) + ') and mouse wheel / arrow keys do not scroll it into view', null, 'shopoff|' + id);
          continue;
        }
      }
      const r2 = getShopRows().find(x => x.item.id === id).rect;
      const s = ownSnap(item), g0 = hud.gold;
      QA.goal = 'buy ' + item.name;
      Inp.tap(r2.x + r2.w / 2, r2.y + r2.h / 2, 'buy ' + item.name);
      yield* wait(120);
      if (hud.gold === g0 - item.price && ownChangedOk(item, s)) {
        bought.add(id);
        QA.stats.bought.push({ id, name: item.name, price: item.price, gameT: +(QA.gameMs / 1000).toFixed(1) });
        milestone('Bought ' + item.name + ' for ' + item.price + 'g (gold ' + g0 + ' -> ' + hud.gold + ')');
        if ((id === 'boomerang' || id === 'bow') && player.slots.indexOf(id) < 0) report('WARNING', 'shop', 'Bought ' + item.name + ' but it was not placed in a weapon slot');
      } else {
        report('CRITICAL', 'shop', 'Purchase of "' + item.name + '" (' + item.price + 'g) did not apply exactly: gold ' + g0 + ' -> ' + hud.gold + ', ownership ' + JSON.stringify(s) + ' -> ' + JSON.stringify(ownSnap(item)));
      }
    }
    // negative test: an unaffordable visible item must not be granted
    const rows = getShopRows(), poor = rows.find(x => canBuy(x.item) && hud.gold < x.item.price && !x.item.consumable && rowFullyVisible(x));
    if (poor) {
      const s = ownSnap(poor.item), g0 = hud.gold;
      Inp.tap(poor.rect.x + poor.rect.w / 2, poor.rect.y + poor.rect.h / 2, 'try unaffordable ' + poor.item.name);
      yield* wait(120);
      if (hud.gold !== g0 || ownChangedOk(poor.item, s)) report('CRITICAL', 'shop', 'Unaffordable item "' + poor.item.name + '" was granted or gold changed (gold ' + g0 + ' -> ' + hud.gold + ')');
    }
    // close
    Inp.tap(GW() - 25, 25, 'shop close X');
    let closed = yield* waitUntil(() => !shop.active, 400);
    if (!closed) { Inp.press('e'); closed = yield* waitUntil(() => !shop.active, 400); if (closed) report('WARNING', 'shop', 'Shop close "X" tap did not close the shop (E did)'); }
    QA.shopSession = false;
    if (!closed) { report('CRITICAL', 'modal', 'Shop cannot be closed (X tap and E both failed)'); return; }
    yield* wait(100);
    const ex = world.interior.exit;
    r = yield* navTo(Math.floor(ex.x), Math.floor(ex.y), { allowZone: true, expectTransition: true, label: 'leave shop' });
    yield* waitUntil(() => !fading(), 1500);
    if (world.mode !== 'overworld') report('CRITICAL', 'transition', 'Cannot leave ' + b.name + ' through its exit rug (' + r + ')');
    else milestone('Left ' + b.name + ' (gold ' + hud.gold + ')');
  }

  // ---- dungeon crawl ----
  function* enterDungeonGen(d) {
    const z = d.entranceZone, sx = Math.round(z.minX / TS()) + 1, sy = Math.round(z.minY / TS());
    for (let attempt = 0; attempt < 3; attempt++) {
      yield* ensureOverworld();
      const r = yield* navTo(sx, sy, { allowZone: true, expectTransition: true, label: 'walk to ' + d.def.name + ' entrance', timeoutMs: 300000 });
      yield* waitUntil(() => !fading(), 1500);
      if (world.mode === 'dungeon' && world.dungeon === d) {
        if (d.roomIndex !== 0) report('CRITICAL', 'transition', 'Entered ' + d.def.name + ' in room ' + d.roomIndex + ' instead of the entrance room');
        return true;
      }
      if (r === 'no-transition') { report('CRITICAL', 'transition', d.def.name + ' entrance: standing on the stairs did not enter the dungeon'); return false; }
      if (r === 'nopath') { report('CRITICAL', 'progression', 'No walkable path from ' + mapKey() + ' (' + heroTile().tx + ',' + heroTile().ty + ') to the ' + d.def.name + ' entrance at (' + sx + ',' + sy + ')'); return false; }
      if (world.mode === 'dungeon' && world.dungeon !== d) report('CRITICAL', 'transition', 'Walking to ' + d.def.name + ' entered ' + world.dungeon.def.name + ' instead');
    }
    return false;
  }
  function* roomClear(maxMs) {
    const end = QA.gameMs + (maxMs || 120000), mk = mapKey();
    while (QA.gameMs < end && mapKey() === mk) {
      let best = null, bd = Infinity;
      for (const e of currentEnemies()) { if (!e.alive || e.isMiniboss || e.isBoss || skipped(e)) continue; const d = Math.hypot(e.x - hero.x, e.y - hero.y); if (d < bd) { bd = d; best = e; } }
      if (!best) break;
      QA.goal = 'clear room: ' + best.type;
      yield* fight(best, { timeoutMs: 30000 });
      yield;
    }
  }
  function* smashRoomPots() {
    for (const p of currentPots().slice()) {
      if (!p.alive) continue;
      QA.goal = 'smash pot' + (p.holdsSmallKey ? ' (key pot)' : '');
      const ok = yield* goNear(p, 14, 20000);
      if (ok) yield* smashPotNear(p);
      yield;
    }
  }
  function* passEastDoor(d, ri, label) {
    const room = d.rooms[ri], midY = Math.floor(room.h / 2);
    let r = yield* navTo(room.w - 2, midY, { label: 'approach ' + label, timeoutMs: 40000 });
    if (r === 'transition') { report('CRITICAL', 'transition', d.def.name + ': room changed unexpectedly while approaching the ' + label); return false; }
    const open = yield* waitUntil(() => room.grid[midY][room.w - 1] === T.FLOOR, 1500);
    if (!open) {
      report('CRITICAL', 'progression', d.def.name + ': ' + label + ' (room ' + ri + ', east wall) did not open when the hero stood next to it; tile is ' + tileName(room.grid[midY][room.w - 1]) +
        ' (hasSmallKey=' + d.hasSmallKey + ', puzzleSolved=' + (d.puzzle && d.puzzle.solved) + ', bossDefeated=' + d.bossDefeated + ')', null, 'door|' + d.def.id + '|' + ri);
      return false;
    }
    r = yield* navTo(room.w - 1, midY, { allowZone: true, expectTransition: true, label: 'go through ' + label, timeoutMs: 20000 });
    yield* waitUntil(() => !fading(), 1500);
    if (!(world.mode === 'dungeon' && d.roomIndex === ri + 1)) {
      report('CRITICAL', 'transition', d.def.name + ': walking through the open ' + label + ' did not reach room ' + (ri + 1) + ' (result ' + r + ', now ' + mapKey() + ')');
      return false;
    }
    milestone(d.def.name + ': entered room ' + (ri + 1) + ' via ' + label);
    return true;
  }
  // BFS over a 4px grid of hitbox-free points, avoiding a disk (used to walk
  // around the push block without touching it)
  function finePath(tx, ty, avoid) {
    const map = currentMap(), C = 4, W = Math.ceil(map.w * TS() / C), H = Math.ceil(map.h * TS() / C), N = W * H;
    const ok = (i) => { const x = (i % W) * C + C / 2, y = ((i / W) | 0) * C + C / 2;
      return hitboxFree(map, x, y) && !(avoid && Math.hypot(x - avoid.x, y - avoid.y) < avoid.r) && !zoneAtPoint(map, x, y); };
    const cell = (x, y) => Math.max(0, Math.min(H - 1, Math.floor(y / C))) * W + Math.max(0, Math.min(W - 1, Math.floor(x / C)));
    const s = cell(hero.x, hero.y), g = cell(tx, ty);
    const prev = new Int32Array(N).fill(-2), q = new Int32Array(N);
    let qh = 0, qt = 0; q[qt++] = s; prev[s] = -1;
    while (qh < qt) {
      const c = q[qh++]; if (c === g) break;
      const cx = c % W, cy = (c / W) | 0;
      for (let k = 0; k < 4; k++) {
        const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : 0), ny = cy + (k === 2 ? 1 : k === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (prev[ni] !== -2 || (!ok(ni) && ni !== g)) continue;
        prev[ni] = c; q[qt++] = ni;
      }
    }
    if (prev[g] === -2) return null;
    const pts = [];
    for (let c = g; c !== -1; c = prev[c]) pts.push({ x: (c % W) * C + C / 2, y: ((c / W) | 0) * C + C / 2 });
    pts.reverse();
    const out = [];
    for (let i = 3; i < pts.length; i += 3) out.push(pts[i]);
    out.push({ x: tx, y: ty });
    return out;
  }
  function* pushBlock(d) {
    const p = d.puzzle, sx = (p.switchX + 0.5) * TS(), sy = (p.switchY + 0.5) * TS();
    const end = QA.gameMs + 90000;
    while (!p.solved && QA.gameMs < end && world.dungeon === d && d.roomIndex === 1) {
      const b = p.block, ex = sx - b.x, ey = sy - b.y;
      const dir = Math.abs(ey) >= 8.5 ? (ey > 0 ? 'down' : 'up') : (ex > 0 ? 'right' : 'left');
      const v = DIRVEC[dir], ax = b.x - v[0] * 24, ay = b.y - v[1] * 24;
      QA.goal = 'push block ' + dir;
      // reach the push position without brushing the block (<16px pushes it)
      if (!hitboxFree(currentMap(), ax, ay)) { report('WARNING', 'puzzle', d.def.name + ': push block at (' + b.x.toFixed(0) + ',' + b.y.toFixed(0) + ') cannot be pushed ' + dir + ' (no room behind it) - puzzle may be unsolvable'); return false; }
      const route = finePath(ax, ay, { x: b.x, y: b.y, r: 19 });
      if (!route) { agentIssue('push block: no route to the push position'); return false; }
      for (const wp of route) { if (!(yield* steerToPoint(wp.x, wp.y, 1.5, 3000))) break; }
      const ok = yield* steerToPoint(ax, ay, 1.5, 3000);
      if (!ok) { agentIssue('push block: could not reach push position'); return false; }
      let last = { x: b.x, y: b.y }, stall = 0;
      for (let i = 0; i < 500 && !p.solved; i++) {
        const err = (dir === 'left' || dir === 'right') ? sx - b.x : sy - b.y;
        const sgn = v[0] + v[1];
        if (Math.sign(err) !== sgn || Math.abs(err) < 2.5) break;
        Inp.setMove([DIRKEY[dir]]);
        yield;
        if (Math.hypot(b.x - last.x, b.y - last.y) < 0.05) { if (++stall > 40) break; } else stall = 0;
        last = { x: b.x, y: b.y };
      }
      Inp.setMove([]);
      if (stall > 40) { report('WARNING', 'puzzle', d.def.name + ': push block stuck at (' + b.x.toFixed(0) + ',' + b.y.toFixed(0) + ') before reaching the switch'); return false; }
      yield;
    }
    return p.solved;
  }
  function* solvePuzzleGen(d) {
    const p = d.puzzle, room = d.rooms[1];
    if (!p || p.solved) return true;
    QA.state = 'PUZZLE';
    if (p.type === 'riddle') {
      yield* roomClear();
    } else if (p.type === 'switches') {
      for (let k = 0; k < p.order.length && !p.solved; k++) {
        const s = p.switches[p.order[k]];
        const avoid = new Set(p.switches.filter((_, i) => i !== p.order[k]).map(q => q.y * room.w + q.x));
        const n0 = p.stepped.length;
        yield* navTo(s.x, s.y, { avoid, label: 'step on switch ' + (k + 1) });
        const ok = yield* waitUntil(() => p.stepped.length > n0 || p.solved, 600);
        if (!ok) { report('CRITICAL', 'progression', d.def.name + ': floor switch ' + (k + 1) + ' at tile (' + s.x + ',' + s.y + ') did not register when the hero stood on it (stepped=' + JSON.stringify(p.stepped) + ')'); return false; }
        yield* navTo(s.x, s.y - 1 >= 1 ? s.y - 1 : s.y + 1, { avoid, label: 'step off switch' });
      }
    } else if (p.type === 'torches') {
      for (let k = 0; k < p.order.length && !p.solved; k++) {
        const t = p.torches[p.order[k]];
        let lit = false;
        for (let attempt = 0; attempt < 3 && !lit; attempt++) {
          yield* navTo(t.x, t.y, { label: 'walk to torch ' + (k + 1) });
          const n0 = p.lit.length;
          Inp.press(attempt === 2 ? 'E' : 'e');
          lit = yield* waitUntil(() => p.lit.length > n0 || p.solved, 400);
          if (!lit) yield* wait(250);
        }
        if (!lit) {
          report('CRITICAL', 'progression', d.def.name + ': torch puzzle cannot be solved - pressing E while standing on torch ' + (k + 1) + ' (tile ' + t.x + ',' + t.y + ') never lights it (puzzle.lit stays ' + JSON.stringify(p.lit) + '); the way east never opens',
            { suspected: 'updatePlaying() clears Input.keys.e in its "talk via E" block (after the pot check) on every step, before updateDungeonRoom() -> updateDungeonPuzzle() reads it, so the torch check never sees E' }, 'torch|' + d.def.id);
          return false;
        }
      }
    } else if (p.type === 'pushblock') {
      yield* pushBlock(d);
    }
    const solved = yield* waitUntil(() => p.solved, 1500);
    if (!solved) report('CRITICAL', 'progression', d.def.name + ': ' + p.type + ' puzzle not marked solved after the agent completed its steps');
    return solved;
  }
  function* openChestGen(d) {
    const room = d.rooms[3], cy = Math.floor(room.h / 2), cx = Math.floor(room.w / 2);
    if (d.chestOpened) return true;
    yield* navTo(cx - 1, cy, { label: 'walk to treasure chest' });
    const chX = (cx + 0.5) * TS(), chY = (cy + 0.5) * TS();
    for (let a = 0; a < 3 && !d.chestOpened; a++) { Inp.press('e'); yield* waitUntil(() => d.chestOpened, 400); }
    for (let a = 0; a < 2 && !d.chestOpened; a++) { Inp.tap(chX - world.camX, chY - world.camY, 'tap chest'); yield* waitUntil(() => d.chestOpened, 500); Inp.setMove([]); }
    if (!d.chestOpened) { yield* navTo(cx - 1, cy, { label: 'back beside chest' }); for (let a = 0; a < 2 && !d.chestOpened; a++) { Inp.press('E'); yield* waitUntil(() => d.chestOpened, 400); } }
    if (!d.chestOpened) {
      report('CRITICAL', 'progression', d.def.name + ': treasure chest cannot be opened (hasBossKey=' + d.hasBossKey + '): pressed E x5 within ' + Math.hypot(hero.x - chX, hero.y - chY).toFixed(0) + 'px and tapped it x2 - medallion unobtainable',
        { suspected: 'handleDungeonDoors() reads Input.keys.e / Input.tapped, but updatePlaying() already consumed both earlier in the same step (talk-via-E block and tap-to-move block)' }, 'chest|' + d.def.id);
      return false;
    }
    return true;
  }
  function* leaveDungeon(d, st) {
    let guard = 0;
    while (world.mode === 'dungeon' && guard++ < 8) {
      const ri = d.roomIndex, room = currentMap(), midY = Math.floor(room.h / 2);
      const r = yield* navTo(0, midY, { allowZone: true, expectTransition: true, label: 'exit ' + d.def.name + ': walk west out of room ' + ri, timeoutMs: 45000 });
      yield* waitUntil(() => !fading(), 1500);
      if (r !== 'transition') { report('CRITICAL', 'progression', "Can't exit " + d.def.name + ' from room ' + ri + ': walking into the west doorway did not transition (' + r + ')', null, 'noexit|' + d.def.id + '|' + ri); break; }
    }
    if (world.mode === 'overworld') { st.exited = true; milestone('Exited ' + d.def.name + ' to the overworld at (' + heroTile().tx + ',' + heroTile().ty + ')'); }
  }
  function* phaseDungeon(d) {
    const st = yield* crawlDungeon(d);
    if (st && st.exited && !QA.reentryTested) {
      QA.reentryTested = true;
      QA.goal = 're-entry test';
      if (yield* enterDungeonGen(d)) {
        milestone('Re-entered ' + d.def.name + ' (room ' + d.roomIndex + ') - entrance works both ways');
        yield* leaveDungeon(d, st);
      } else report('CRITICAL', 'transition', 'Could not re-enter ' + d.def.name + ' after exiting it');
    }
  }
  function* crawlDungeon(d) {
    const id = d.def.id;
    const st = QA.dungeon[id] = QA.dungeon[id] || { name: d.def.name, entered: false, smallKey: false, puzzle: false, bossKilled: false, bossKey: false, chest: false, exited: false, blockedBy: null, gameSeconds: 0 };
    const t0 = QA.gameMs;
    QA.state = 'DUNGEON_CRAWL';
    try {
      if (!(yield* enterDungeonGen(d))) { st.blockedBy = st.blockedBy || 'could not enter'; return st; }
      st.entered = true; milestone('Entered ' + d.def.name);
      QA.state = 'DUNGEON_CRAWL';
      // room 0: key pot + locked door
      yield* roomClear();
      yield* smashRoomPots();
      if (!d.hasSmallKey) yield* waitUntil(() => d.hasSmallKey, 1000);
      if (!d.hasSmallKey) { report('CRITICAL', 'progression', d.def.name + ': no Small Key after smashing every pot in the entrance room'); st.blockedBy = 'small key'; yield* leaveDungeon(d, st); return st; }
      st.smallKey = true; milestone(d.def.name + ': got the Small Key');
      if (!(yield* passEastDoor(d, 0, 'locked door'))) { st.blockedBy = 'locked door'; yield* leaveDungeon(d, st); return st; }
      // room 1: puzzle
      QA.state = 'DUNGEON_CRAWL';
      yield* roomClear();
      if (!(yield* solvePuzzleGen(d))) { st.blockedBy = d.puzzle.type + ' puzzle'; yield* leaveDungeon(d, st); return st; }
      st.puzzle = true; milestone(d.def.name + ': solved the ' + d.puzzle.type + ' puzzle');
      if (!(yield* passEastDoor(d, 1, 'puzzle door'))) { st.blockedBy = 'puzzle door'; yield* leaveDungeon(d, st); return st; }
      // room 2: boss
      QA.state = 'BOSS';
      const boss = d.enemies[2].find(e => e.isMiniboss);
      if (boss && boss.alive) {
        milestone(d.def.name + ': boss fight vs ' + (boss.bossKind || boss.type) + ' (hp ' + boss.hp + ')');
        const tb = QA.gameMs;
        while (boss.alive && world.dungeon === d && d.roomIndex === 2 && QA.gameMs - tb < 300000) { QA.goal = 'defeat ' + (boss.bossKind || boss.type) + ' hp ' + boss.hp; yield* fight(boss, { timeoutMs: 300000 }); yield; }
        if (boss.alive) { st.blockedBy = 'boss not defeated'; agentIssue('could not defeat ' + d.def.name + ' boss'); yield* leaveDungeon(d, st); return st; }
        milestone(d.def.name + ': boss defeated in ' + ((QA.gameMs - tb) / 1000).toFixed(1) + 's (game)');
      }
      st.bossKilled = true;
      const gotKey = yield* waitUntil(() => d.bossDefeated && d.hasBossKey, 2500);
      if (!gotKey) {
        QA.goal = 'check sealed boss door';
        yield* navTo(d.rooms[2].w - 2, Math.floor(d.rooms[2].h / 2), { label: 'try the sealed boss door', fight: false });
        yield* wait(1200);
        st.blockedBy = 'boss kill not registered (no Boss Key, door sealed)';
        milestone(d.def.name + ': boss door still ' + tileName(d.rooms[2].grid[Math.floor(d.rooms[2].h / 2)][d.rooms[2].w - 1]) + ' after the boss died');
        yield* leaveDungeon(d, st); return st;
      }
      st.bossKey = true; milestone(d.def.name + ': got the Boss Key');
      const hp = heartPieces.find(h => h.dungeonId === id);
      if (hp) {
        const mh = player.maxHearts;
        yield* steerToPoint(hp.x, hp.y, 4, 6000);
        if (yield* waitUntil(() => player.maxHearts > mh, 800)) milestone(d.def.name + ': collected Giant Heart Piece (max hearts ' + player.maxHearts + ')');
        else report('WARNING', 'pickup', d.def.name + ': could not collect the boss heart piece at (' + hp.x.toFixed(0) + ',' + hp.y.toFixed(0) + ')');
      }
      if (!(yield* passEastDoor(d, 2, 'boss door'))) { st.blockedBy = 'boss door'; yield* leaveDungeon(d, st); return st; }
      QA.state = 'TREASURE';
      if (!(yield* openChestGen(d))) { st.blockedBy = 'treasure chest will not open'; yield* leaveDungeon(d, st); return st; }
      st.chest = true;
      if (!player.medallions[id]) report('CRITICAL', 'progression', d.def.name + ': chest opened but the ' + id + ' medallion was not granted');
      milestone(d.def.name + ' cleared: ' + id + ' medallion (' + medals() + '/4)');
      yield* leaveDungeon(d, st);
    } finally {
      st.gameSeconds = +((QA.gameMs - t0) / 1000).toFixed(1);
    }
    return st;
  }
  function* phaseCastle() {
    QA.state = 'FINAL';
    yield* ensureOverworld();
    const z = castleGate.zone, gx = Math.round(z.minX / TS()) + 1, gy = Math.round(z.minY / TS());
    const n = medals();
    const r = yield* navTo(gx, gy, { allowZone: true, expectTransition: n >= 4, label: 'walk to castle gate', timeoutMs: 300000 });
    yield* waitUntil(() => !fading(), 1500);
    if (n < 4) {
      const hinted = /medallion/i.test(hud.hintText || '');
      milestone('Castle gate refused entry with ' + n + '/4 medallions' + (hinted ? ' (hint shown: "' + hud.hintText + '")' : ''));
      Cap.arm('hint');
      yield* wait(200);
      if (world.mode === 'castle') report('CRITICAL', 'progression', 'Castle opened with only ' + n + '/4 medallions');
      const blockers = Object.values(QA.dungeon).filter(s => !s.chest).map(s => s.name + ': ' + (s.blockedBy || 'not attempted'));
      report('CRITICAL', 'progression', 'Game cannot be completed legitimately: the castle needs 4 medallions but only ' + n + '/4 are obtainable in this build. Blockers - ' + (blockers.join('; ') || 'unknown'),
        { dungeons: QA.dungeon }, 'progression-impossible');
      for (let i = 0; i < 20; i++) { Inp.setMove(zoneGuard(['ArrowDown'])); yield; }
      Inp.setMove([]);
      return;
    }
    if (world.mode !== 'castle') { report('CRITICAL', 'transition', 'Castle gate did not open with 4/4 medallions (' + r + ')'); return; }
    milestone('Entered the castle');
    yield* roomClear();
    const map = currentMap();
    yield* navTo(map.w - 1, Math.floor(map.h / 2), { allowZone: true, expectTransition: true, label: 'castle hallway -> arena' });
    yield* waitUntil(() => !fading() && castle.roomIndex === 1 && castle.ganon, 3000);
    if (!castle.ganon) { report('CRITICAL', 'transition', 'Castle arena / final boss did not load'); return; }
    const g = castle.ganon, t0 = QA.gameMs;
    milestone('Final boss fight (hp ' + g.hp + ')');
    while (g.alive && QA.gameMs - t0 < 900000 && world.mode === 'castle') { QA.goal = 'final boss hp ' + g.hp + ' phase ' + g.phase; yield* fight(g, { timeoutMs: 900000 }); yield; }
    if (g.alive) { agentIssue('final boss not defeated in time'); return; }
    milestone('Final boss defeated in ' + ((QA.gameMs - t0) / 1000).toFixed(1) + 's (game)');
    // the game switches to the victory screen via a wall-clock setTimeout, so wait in wall time
    const end = now() + 6000;
    while (now() < end && gameState !== STATE.VICTORY) yield;
    if (gameState !== STATE.VICTORY) report('CRITICAL', 'progression', 'Final boss defeated but the victory screen never appeared (waited 6s wall time)');
  }

  function buildPhases() {
    const ph = [];
    ph.push({ name: 'calibrate', fn: phaseCalibrate });
    ph.push({ name: 'npc dialogue', fn: phaseNpcTest });
    ph.push({ name: 'farm gold/XP', fn: () => phaseFarm(QA.opts.farmGold, QA.opts.farmMinutes * 60000) });
    ph.push({ name: 'shop', fn: () => phaseShop('shop') });
    const order = (typeof dungeons !== 'undefined' ? dungeons : []).slice();
    for (const d of order) {
      ph.push({ name: 'dungeon ' + d.def.id, fn: () => phaseDungeon(d) });
      ph.push({ name: 'restock after ' + d.def.id, fn: function* () { if (wantedAffordable()) yield* phaseShop('shop'); } });
    }
    ph.push({ name: 'castle', fn: phaseCastle });
    return ph;
  }

  // ---------------------------------------------------------------------
  // Main tick (once per game update step)
  // ---------------------------------------------------------------------
  const PH = { list: [], i: 0, gen: null, name: '', t0: 0 };
  function titleStep() {
    QA.state = 'TITLE';
    if (QA.gameMs - (QA.titleLastTap || -1e9) < 350) return;
    QA.titleLastTap = QA.gameMs; QA.titleTaps = (QA.titleTaps || 0) + 1;
    if (QA.titleTaps === 1) {
      Cap.arm('title');
      try {
        checkRectSet('Title difficulty buttons', getDifficultyButtons().map(b => ({ name: b.name, r: b })), { overlap: true });
        checkRectSet('Title action buttons', getTitleActionButtons().map(b => ({ name: b.label, r: b })), { overlap: true });
      } catch (e) {}
      if (hasSaveGame && hasSaveGame()) {
        try { const raw = localStorage.getItem(SAVE_KEY); if (raw) localStorage.setItem(SAVE_KEY + '_qa_backup', raw); } catch (e) {}
        milestone('Existing save found; backed up to localStorage "' + SAVE_KEY + '_qa_backup" before New Game');
      }
      if (QA.opts.difficulty) {
        const b = getDifficultyButtons().find(x => x.name === QA.opts.difficulty);
        if (b) { Inp.tap(b.x + b.w / 2, b.y + b.h / 2, 'difficulty ' + b.name); return; }
      }
    }
    if (QA.titleTaps <= 5) {
      const b = getTitleActionButtons().find(x => x.key === 'new');
      if (b) Inp.tap(b.x + b.w / 2, b.y + b.h / 2, 'New Game');
    } else if (QA.titleTaps <= 7) Inp.press('Enter');
    else if (!QA.titleFail) { QA.titleFail = true; report('CRITICAL', 'title', 'Cannot start the game from the title screen'); finish('stuck on title'); }
  }
  function tick() {
    if (QA.opts.maxMinutes && now() - QA.startWall > QA.opts.maxMinutes * 60000) { finish('maxMinutes (' + QA.opts.maxMinutes + ') reached'); return; }
    if (gameState === STATE.TITLE) { titleStep(); return; }
    if (gameState === STATE.VICTORY) { if (!QA.victory) { QA.victory = true; milestone('VICTORY screen reached'); finish('victory'); } return; }
    if (gameState !== STATE.PLAYING) return;
    if (!QA.playStarted) { QA.playStarted = true; milestone('Game started (difficulty ' + CONFIG.DIFFICULTY + ')'); }
    if (handleModals()) return;
    if (fading()) { Inp.setMove([]); return; }
    if (!PH.gen) {
      const ph = PH.list[PH.i];
      if (!ph) { finish('all phases complete'); return; }
      PH.name = ph.name; PH.t0 = QA.gameMs; PH.gen = ph.fn();
      milestone('Phase start: ' + ph.name);
    }
    let r;
    try { r = PH.gen.next(); }
    catch (e) { agentIssue('phase "' + PH.name + '" threw: ' + e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 3).join(' | ')); r = { done: true }; }
    if (r.done) {
      Inp.setMove([]);
      milestone('Phase end: ' + PH.name + ' (' + ((QA.gameMs - PH.t0) / 1000).toFixed(1) + 's game)');
      PH.gen = null; PH.i++;
    }
  }
  function postStep(dtMs) {
    QA.gameMs += dtMs; QA.steps++; QA.stats.updates++; QA.lastUpdateWall = now();
    if (!QA.running || !gameReady()) return;
    watchdogs(dtMs);
    Inp.service();
    evalExpectations();
    tick();
    if (QA.steps % 60 === 0 && gameState === STATE.PLAYING) QA.crumbs.push({ t: +(QA.gameMs / 1000).toFixed(1), at: Math.round(hero.x) + ',' + Math.round(hero.y), map: mapKey(), s: QA.state, hp: player.hearts, ap: player.ap });
  }

  // ---------------------------------------------------------------------
  // Hooks: update() step hook, rAF (time scale + draw capture), errors
  // ---------------------------------------------------------------------
  const H = { origUpdate: null, origRAF: null, rafWrapped: false, tsWall: 0, tsBase: 0, scale: 1, scaled: false, monId: 0 };
  function scaleTs(ts) { return H.scaled ? H.tsBase + (ts - H.tsWall) * H.scale : ts; }
  function setTimeScale(k) {
    k = Math.max(0.1, Math.min(16, +k || 1));
    const t = now();
    H.tsBase = scaleTs(t); H.tsWall = t;
    if (k !== 1) H.scaled = true;
    H.scale = k; QA.timeScale = k;
  }
  function installHooks() {
    if (typeof window.update === 'function' && !window.update.__qa) {
      H.origUpdate = window.update;
      const wrapped = function () {
        if (QA.running) { try { preStep(); } catch (e) { agentIssue('preStep error: ' + e.message); } }
        let r;
        try { r = H.origUpdate.apply(this, arguments); }
        catch (e) { report('CRITICAL', 'exception', 'Uncaught exception in game update(): ' + e.message, { stack: String(e.stack || '').slice(0, 800) }); throw e; }
        if (QA.running) { try { postStep(arguments[0] || (1000 / 60)); } catch (e) { agentIssue('agent step error: ' + e.message + ' @ ' + String(e.stack || '').split('\n')[1]); } }
        return r;
      };
      wrapped.__qa = true;
      try { window.update = wrapped; QA.stepHooked = window.update === wrapped; } catch (e) { QA.stepHooked = false; }
    }
    if (!QA.stepHooked) agentIssue('could not hook update(); falling back to one agent step per animation frame');
    if (!H.rafWrapped) {
      H.origRAF = window.requestAnimationFrame;
      H.tsWall = H.tsBase = now();
      window.requestAnimationFrame = function (cb) {
        return H.origRAF.call(window, function (ts) {
          const sts = scaleTs(ts);
          Cap.begin();
          try { cb(sts); } finally { Cap.end(); }
        });
      };
      H.rafWrapped = true;
    }
    H.onErr = function (ev) {
      try { report('CRITICAL', 'exception', 'Uncaught error: ' + (ev.message || (ev.error && ev.error.message) || ev) + (ev.filename ? ' at ' + ev.filename.split('/').pop() + ':' + ev.lineno : ''), { stack: ev.error ? String(ev.error.stack || '').slice(0, 800) : null }); } catch (e) {}
    };
    H.onRej = function (ev) { try { report('CRITICAL', 'exception', 'Unhandled promise rejection: ' + String(ev.reason && (ev.reason.message || ev.reason)).slice(0, 300)); } catch (e) {} };
    window.addEventListener('error', H.onErr);
    window.addEventListener('unhandledrejection', H.onRej);
    H.origConsoleError = console.error;
    console.error = function () {
      try { report('CRITICAL', 'console', 'console.error: ' + Array.prototype.map.call(arguments, a => (a && a.message) ? a.message : String(a)).join(' ').slice(0, 300)); } catch (e) {}
      return H.origConsoleError.apply(console, arguments);
    };
    H.monId = H.origRAF.call(window, monitor);
  }
  function removeHooks() {
    if (H.origUpdate && window.update && window.update.__qa) { try { window.update = H.origUpdate; } catch (e) {} }
    H.origUpdate = null;
    if (H.rafWrapped) {
      if (!H.scaled) { window.requestAnimationFrame = H.origRAF; H.rafWrapped = false; }
      else {
        // keep the game's clock continuous: freeze the scaled offset instead of jumping back
        const off = scaleTs(now()) - now(), orig = H.origRAF;
        window.requestAnimationFrame = function (cb) { return orig.call(window, ts => cb(ts + off)); };
      }
    }
    if (H.onErr) window.removeEventListener('error', H.onErr);
    if (H.onRej) window.removeEventListener('unhandledrejection', H.onRej);
    if (H.origConsoleError) console.error = H.origConsoleError;
    H.onErr = H.onRej = H.origConsoleError = null;
    if (H.monId && H.origRAF) cancelAnimationFrame(H.monId);
    H.monId = 0;
    if (QA.ov) { QA.ov.remove(); QA.ov = null; }
  }
  function monitor(ts) {
    H.monId = H.origRAF.call(window, monitor);
    try {
      const dt = QA.lastMon ? ts - QA.lastMon : 16.7; QA.lastMon = ts;
      QA.stats.frames++; QA.stats.frameMsAvg = QA.stats.frameMsAvg * 0.95 + dt * 0.05; if (dt > QA.stats.frameMsMax && QA.stats.frames > 30) QA.stats.frameMsMax = dt;
      if (QA.running) {
        if (!QA.stepHooked && gameReady()) { preStep(); postStep(Math.min(100, dt) * H.scale); }
        if (ts - Cap.lastPeriodic > 5000) { Cap.lastPeriodic = ts; Cap.arm('periodic'); }
        if (!document.hidden && QA.stepHooked && QA.lastUpdateWall && now() - QA.lastUpdateWall > 3000 && !QA.stallReported) {
          QA.stallReported = true;
          report('CRITICAL', 'loop', 'Game loop stalled: update() not called for ' + ((now() - QA.lastUpdateWall) / 1000).toFixed(1) + 's while requestAnimationFrame keeps firing');
        }
        const c = gctx();
        if (c && c.imageSmoothingEnabled && gameState === STATE.PLAYING) report('WARNING', 'render', 'imageSmoothingEnabled is true on the main game context between frames (pixel art will blur when scaled)');
      }
      drawOverlay();
    } catch (e) { agentIssue('monitor error: ' + e.message); }
  }

  // ---------------------------------------------------------------------
  // Telemetry overlay (separate canvas over the game canvas)
  // ---------------------------------------------------------------------
  function overlayLines() {
    const own = [];
    try {
      const o = player.owned;
      for (const [k, s] of [['sharpSword', 'SS'], ['heroSword', 'HS'], ['boomerang', 'Bm'], ['galeBoomerang', 'GB'], ['bow', 'Bow'], ['fireArrow', 'FA'], ['iceArrow', 'IA']]) own.push((o[k] ? '+' : '-') + s);
    } catch (e) {}
    const md = []; try { for (const k in player.medallions) md.push((player.medallions[k] ? '+' : '-') + k[0].toUpperCase()); } catch (e) {}
    let crit = 0, warn = 0; for (const b of QA.bugs.values()) { if (b.severity === 'CRITICAL') crit++; else if (b.severity === 'WARNING') warn++; }
    const tgt = QA.target ? (QA.target.tx !== undefined ? 'tile ' + QA.target.tx + ',' + QA.target.ty : (QA.target.bossKind || QA.target.type || (QA.target.isBush ? 'bush' : QA.target.name || 'pot')) + ' @' + Math.round(QA.target.x) + ',' + Math.round(QA.target.y)) : '-';
    let w = {}; try { w = where(); } catch (e) {}
    return [
      'QA ' + (QA.running ? 'RUN' : QA.done ? 'DONE' : 'IDLE') + ' x' + QA.timeScale + '  ' + QA.state + '  [' + PH.name + ']',
      'goal: ' + String(QA.goal || '').slice(0, 44),
      'map ' + w.map + '  pos ' + w.x + ',' + w.y + ' t(' + w.tx + ',' + w.ty + ') ' + (w.facing || ''),
      'target: ' + tgt,
      'HP ' + w.hearts + '  AP ' + w.ap + '  Gold ' + w.gold + '  Lv ' + w.level,
      'gear ' + own.join(' '),
      'medallions ' + md.join(' ') + '  kills ' + QA.stats.kills + ' math ' + QA.stats.mathSolved,
      'frame ' + QA.stats.frameMsAvg.toFixed(1) + 'ms  game ' + (QA.gameMs / 1000).toFixed(0) + 's  wall ' + ((now() - QA.startWall) / 1000).toFixed(0) + 's',
      'bugs  CRIT ' + crit + '  WARN ' + warn + '  info ' + QA.info.length,
    ];
  }
  function drawOverlay() {
    const gc = gcanvas();
    if (!gc) return;
    if (!QA.overlayOn || !QA.running && !QA.done) { if (QA.ov) QA.ov.style.display = 'none'; return; }
    if (!QA.ov) {
      const o = document.createElement('canvas'); o.id = 'qa-overlay';
      o.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483646;left:0;top:0;';
      document.body.appendChild(o); QA.ov = o;
    }
    const o = QA.ov, r = gc.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    o.style.display = 'block';
    o.style.left = r.left + 'px'; o.style.top = r.top + 'px'; o.style.width = r.width + 'px'; o.style.height = r.height + 'px';
    const pw = Math.max(1, Math.round(r.width * dpr)), ph = Math.max(1, Math.round(r.height * dpr));
    if (o.width !== pw) o.width = pw; if (o.height !== ph) o.height = ph;
    const c = o.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, pw, ph);
    const k = pw / GW();
    try {
      if (gameState === STATE.PLAYING && QA.pathForOverlay && Mover.mk === mapKey()) {
        c.fillStyle = 'rgba(0,255,255,0.55)';
        for (const n of QA.pathForOverlay) {
          const sx = ((n.tx + 0.5) * TS() - world.camX) * k, sy = ((n.ty + 0.5) * TS() - world.camY) * k;
          if (sx > -5 && sy > -5 && sx < pw + 5 && sy < ph + 5) c.fillRect(sx - 1.5 * k, sy - 1.5 * k, 3 * k, 3 * k);
        }
      }
      if (gameState === STATE.PLAYING && QA.target && QA.target.x !== undefined) {
        c.strokeStyle = 'rgba(255,80,80,0.9)'; c.lineWidth = Math.max(1, k);
        c.strokeRect((QA.target.x - world.camX - 9) * k, (QA.target.y - world.camY - 9) * k, 18 * k, 18 * k);
      }
    } catch (e) {}
    const lines = overlayLines();
    const fs = Math.max(9, Math.round(7.5 * k));
    c.font = fs + 'px monospace';
    let mw = 0; for (const l of lines) mw = Math.max(mw, c.measureText(l).width);
    const lh = Math.round(fs * 1.2), bw = mw + fs, bh = lh * lines.length + fs * 0.6;
    const bx = pw - bw - 4 * k, by = ph - bh - 64 * k;
    c.fillStyle = 'rgba(0,0,0,0.72)'; c.fillRect(bx, by, bw, bh);
    c.strokeStyle = 'rgba(0,255,255,0.6)'; c.lineWidth = 1; c.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
    c.fillStyle = '#9ff'; c.textAlign = 'left'; c.textBaseline = 'top';
    lines.forEach((l, i) => { if (i === lines.length - 1) c.fillStyle = /CRIT [1-9]/.test(l) ? '#ff8080' : '#9f9'; c.fillText(l, bx + fs / 2, by + fs * 0.3 + i * lh); });
  }

  // ---------------------------------------------------------------------
  // Reports
  // ---------------------------------------------------------------------
  function bugList() {
    return Array.from(QA.bugs.values()).sort((a, b) => ({ CRITICAL: 0, WARNING: 1, INFO: 2 }[a.severity] - { CRITICAL: 0, WARNING: 1, INFO: 2 }[b.severity]) || a.gameT - b.gameT);
  }
  function buildJSON() {
    const bugs = bugList();
    let prog = {};
    try {
      prog = { level: player.level, gold: hud.gold, hearts: player.hearts + '/' + player.maxHearts, attack: player.attack, owned: Object.assign({}, player.owned),
        slots: player.slots.slice(), medallions: Object.assign({}, player.medallions), medallionCount: medals(), where: where() };
    } catch (e) {}
    return {
      tool: 'math-quest qa-agent', version: VERSION, url: location.href, userAgent: navigator.userAgent,
      startedAt: QA.startDate, wallSeconds: +((now() - QA.startWall) / 1000).toFixed(1), gameSeconds: +(QA.gameMs / 1000).toFixed(1),
      timeScale: QA.timeScale, running: QA.running, done: QA.done, doneReason: QA.doneReason, victory: QA.victory, phase: PH.name, phaseIndex: PH.i, phases: PH.list.map(p => p.name),
      summary: { critical: bugs.filter(b => b.severity === 'CRITICAL').length, warning: bugs.filter(b => b.severity === 'WARNING').length, milestones: QA.info.length, agentIssues: QA.agentIssues.len },
      progress: prog, dungeons: QA.dungeon, stats: QA.stats, metrics: QA.metrics, layout: QA.layout,
      bugs, milestones: QA.info, agentIssues: QA.agentIssues.toArray(),
    };
  }
  function fmtInputs(list) {
    return list.map(i => 't=' + i.t.toFixed(2) + 's ' + i.a + ' ' + i.d + (i.at ? '   @' + i.at : '')).join('\n');
  }
  function buildMarkdown() {
    const j = buildJSON(), L = [];
    L.push('# Math Quest - autonomous QA report', '');
    L.push('- Agent: qa-agent.js v' + j.version + ' (synthetic keyboard/pointer input only; game state read-only)');
    L.push('- Started: ' + j.startedAt + ' | wall ' + j.wallSeconds + 's | game time ' + j.gameSeconds + 's | timeScale x' + j.timeScale);
    L.push('- Result: ' + (j.victory ? '**VICTORY reached**' : '**no victory**') + ' - ' + (j.doneReason || (j.running ? 'still running' : 'stopped')) + ' (last phase: ' + j.phase + ')');
    L.push('- Findings: **' + j.summary.critical + ' CRITICAL**, **' + j.summary.warning + ' WARNING**, ' + j.summary.milestones + ' milestones, ' + j.summary.agentIssues + ' agent-side notes', '');
    L.push('## Progress', '');
    const p = j.progress;
    if (p.level !== undefined) {
      L.push('- Level ' + p.level + ', hearts ' + p.hearts + ', attack ' + p.attack + ', gold ' + p.gold + ', medallions ' + p.medallionCount + '/4');
      L.push('- Weapon slots: ' + p.slots.join(', ') + ' | owned gear: ' + Object.keys(p.owned).filter(k => p.owned[k] === true || p.owned[k] > 0).join(', '));
    }
    L.push('- Bought: ' + (j.stats.bought.length ? j.stats.bought.map(b => b.name + ' (' + b.price + 'g @' + b.gameT + 's)').join(', ') : 'nothing'));
    L.push('- Kills ' + j.stats.kills + ', pots/bushes ' + j.stats.pots + ', sword swings ' + j.stats.swings + ', ranged shots ' + j.stats.rangedShots + ', math solved ' + j.stats.mathSolved + ', revives ' + j.stats.revives + ', level-ups ' + j.stats.levelUps);
    if (j.metrics.cardinalSpeed !== undefined) L.push('- Walk speed: cardinal ' + j.metrics.cardinalSpeed + ' px/s, diagonal ' + j.metrics.diagonalSpeed + ' px/s');
    L.push('');
    const ds = Object.keys(j.dungeons);
    if (ds.length) {
      L.push('| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |', '|---|---|---|---|---|---|---|---|---|---|');
      const yn = v => v ? 'yes' : 'no';
      for (const id of ds) { const s = j.dungeons[id]; L.push('| ' + s.name + ' | ' + yn(s.entered) + ' | ' + yn(s.smallKey) + ' | ' + yn(s.puzzle) + ' | ' + yn(s.bossKilled) + ' | ' + yn(s.bossKey) + ' | ' + yn(s.chest) + ' | ' + yn(s.exited) + ' | ' + (s.blockedBy || '-') + ' | ' + s.gameSeconds + ' |'); }
      L.push('');
    }
    for (const sev of ['CRITICAL', 'WARNING']) {
      const list = j.bugs.filter(b => b.severity === sev);
      L.push('## ' + sev + ' (' + list.length + ')', '');
      if (!list.length) L.push('_none_', '');
      for (const b of list) {
        L.push('### ' + b.id + ' [' + b.category + '] ' + b.message + (b.count > 1 ? ' (x' + b.count + ', last at ' + b.lastGameT + 's)' : ''), '');
        L.push('- First seen: game t=' + b.gameT + 's, wall ' + b.wallT + 's (' + b.wallISO + '), during ' + b.phase);
        const w = b.where || {};
        L.push('- Where: ' + w.map + ' pos (' + w.x + ', ' + w.y + ') tile (' + w.tx + ', ' + w.ty + '), facing ' + w.facing + ', HP ' + w.hearts + ', AP ' + w.ap + ', gold ' + w.gold);
        if (b.extra) {
          const ex = Object.assign({}, b.extra);
          if (ex.suspected) { L.push('- Suspected cause (static reading of the game code): ' + ex.suspected); delete ex.suspected; }
          if (ex.stack) { L.push('- Stack:', '```', ex.stack, '```'); delete ex.stack; }
          if (Object.keys(ex).length) L.push('- Details: `' + JSON.stringify(ex).slice(0, 600) + '`');
        }
        if (sev === 'CRITICAL' || b.inputs.length) {
          L.push('- Repro: New Game (' + (QA.opts.difficulty || 'default difficulty') + '), then follow the milestone timeline below up to t=' + b.gameT + 's; last inputs before detection:', '', '```', fmtInputs(b.inputs.slice(-40)) || '(none)', '```');
          if (b.crumbs && b.crumbs.length) L.push('', 'Recent positions: ' + b.crumbs.slice(-10).map(c => c.t + 's ' + c.map + ' @' + c.at).join(' -> '));
        }
        L.push('');
      }
    }
    L.push('## Milestone timeline (INFO)', '');
    for (const m of j.milestones) L.push('- t=' + m.gameT + 's (wall ' + m.wallT + 's) ' + m.msg + '  [' + (m.where.map || '') + ' @' + m.where.x + ',' + m.where.y + ']');
    L.push('');
    L.push('## Agent-side notes (not game bugs)', '');
    if (!j.agentIssues.length) L.push('_none_');
    for (const a of j.agentIssues.slice(-60)) L.push('- t=' + a.gameT + 's ' + a.msg + ' (' + a.phase + ')');
    L.push('');
    L.push('## Layout data', '', '```', JSON.stringify(j.layout, null, 1).slice(0, 3000), '```', '');
    return L.join('\n');
  }

  // ---------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------
  function finish(reason) {
    if (QA.done) return;
    QA.done = true; QA.doneReason = reason; QA.running = false;
    try { Inp.releaseAll(); } catch (e) {}
    milestone('QA agent finished: ' + reason);
  }
  window.startQAAgent = function (opts) {
    if (QA.running) return 'already running';
    if (!gameReady()) throw new Error('Math Quest globals not found - load qa-agent.js into the game page');
    QA.opts = Object.assign({ autostart: true, overlay: true, maxMinutes: 30, timeScale: 1, farmGold: 80, farmMinutes: 6, difficulty: null, touch: false }, opts || {});
    if (QA.opts.autostart === false) { QA.overlayOn = !!QA.opts.overlay; return 'loaded (autostart=false)'; }
    QA.running = true; QA.done = false; QA.doneReason = ''; QA.victory = false;
    QA.startWall = now(); QA.startDate = new Date().toISOString(); QA.gameMs = 0; QA.steps = 0;
    QA.overlayOn = !!QA.opts.overlay;
    installHooks();
    setTimeScale(QA.opts.timeScale);
    PH.list = buildPhases(); PH.i = 0; PH.gen = null;
    milestone('QA agent v' + VERSION + ' started (timeScale x' + QA.timeScale + ', step hook ' + (QA.stepHooked ? 'on' : 'off') + ')');
    return 'started';
  };
  window.stopQAAgent = function (reason) {
    finish(reason || 'stopped by stopQAAgent()');
    removeHooks();
    return 'stopped';
  };
  window.toggleQAOverlay = function (on) { QA.overlayOn = on === undefined ? !QA.overlayOn : !!on; if (!QA.overlayOn && QA.ov) QA.ov.style.display = 'none'; return QA.overlayOn; };
  window.exportQAReport = function () { return buildMarkdown(); };
  window.QA_REPORT_JSON = function () { return buildJSON(); };
  window.setQATimeScale = function (k) { setTimeScale(k); return QA.timeScale; };
  window.__QA_STATUS = function () {
    let crit = 0, warn = 0; for (const b of QA.bugs.values()) { if (b.severity === 'CRITICAL') crit++; else if (b.severity === 'WARNING') warn++; }
    return { running: QA.running, done: QA.done, doneReason: QA.doneReason, victory: QA.victory, state: QA.state, phase: PH.name, goal: QA.goal,
      gameS: +(QA.gameMs / 1000).toFixed(1), wallS: +((now() - QA.startWall) / 1000).toFixed(1), crit, warn, where: where(), medallions: medals(), frameMs: +QA.stats.frameMsAvg.toFixed(1) };
  };
})();
