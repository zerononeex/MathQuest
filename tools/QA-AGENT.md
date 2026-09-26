# Math Quest QA agent

`tools/qa-agent.js` plays `math-quest.html` the way a player does and writes a bug report. It
only sends real `KeyboardEvent`s and mouse/touch events to the page. It reads game state to plan
and to check results, but it never writes hp, AP, gold, inventory, boss or map state.

## Run it headless (puppeteer)

```sh
npm install puppeteer --prefix tools          # once
node tools/run-qa.js                          # timeScale x4, max 20 min
node tools/run-qa.js --time-scale 2 --max-minutes 10 --shot-every 20
node tools/run-qa.js --game some/other/math-quest.html --difficulty LITTLE_HERO --headful
```

The runner writes these files:

- `tools/qa-report.md` and `tools/qa-report.json`: the report.
- `tools/qa-screens/*.png`: a screenshot every `--shot-every` seconds and one on each new
  CRITICAL.

It exits with code 1 if any CRITICAL was logged. If the bundled Chromium can't be downloaded, it
falls back to `/opt/pw-browsers/chromium-*/chrome-linux/chrome` or `$PUPPETEER_EXECUTABLE_PATH`.

## Run it in a real browser

- **Console:** open the game, paste the whole of `qa-agent.js` into DevTools, then run
  `startQAAgent({ overlay: true })`.
- **Injected copy:** run `node tools/inject-qa.js` to write `tools/math-quest-qa.html`, which is
  the game with the agent appended. The original file is not changed. Open the copy with `?qa=1`
  to autostart the agent. You can add `&ts=4` for the time scale, `&min=30` for the time limit and
  `&diff=ADVENTURER` for the difficulty. Without `?qa=1` the copy is the normal game.
- **Bookmarklet:** serve the repo with `python3 -m http.server 8000` and use this bookmarklet:
  `javascript:(()=>{const s=document.createElement('script');s.src='http://localhost:8000/tools/qa-agent.js';s.onload=()=>startQAAgent({overlay:true});document.body.appendChild(s);})()`

The agent starts a **New Game**. If a save already exists, it is first copied to the
`localStorage` key `mathquest_save_v1_qa_backup`.

## API

| Call | Meaning |
|---|---|
| `startQAAgent(opts)` | `{ overlay:true, maxMinutes:30, timeScale:1, farmGold:80, farmMinutes:6, difficulty:null, touch:false, autostart:true }` |
| `stopQAAgent()` | Stops the agent, releases held keys and removes the hooks and the overlay |
| `toggleQAOverlay()` | Shows or hides the telemetry panel: state, goal, map, position, target, HP/AP/gold, gear, medallions, frame time, bug counts. The current path is drawn as cyan dots |
| `exportQAReport()` | Returns the report as Markdown |
| `QA_REPORT_JSON()` | Returns the same report as an object |
| `setQATimeScale(k)` | Changes the time scale while the agent runs |

`timeScale` works by scaling the timestamps that `requestAnimationFrame` passes to the game loop.
The game file itself is not modified. If the scale was ever set to something other than 1,
stopping the agent keeps the accumulated time offset so that the game clock does not jump back.

## How it works

- **Step hook:** `window.update` is wrapped, so the agent observes and decides once per fixed
  60 Hz simulation step. If that wrap fails, it falls back to one decision per animation frame.
  Only input events are dispatched from the hook.
- **Planner:** each phase is a generator: calibrate → NPC dialogue → farm gold/XP → shop →
  forest, fire, water and shadow dungeons (in `DUNGEON_DEFS` order, restocking at the shop when
  it can afford gear) → castle and final boss → victory.
- **Pathing:** A* runs over the real tile grid, using `SOLID_TILES` and `tileSolidAt`. Door,
  building and dungeon trigger zones are avoided unless they are the goal. The hero is steered
  through tile centres so its 12x14 hitbox always fits.
- **Modals:** the math popup is solved by parsing `questionText` itself, never `correctIndex`,
  and the matching button is tapped. The agent also handles the level-up choice, dialogue, the
  shop (tap to buy, scroll with the wheel or arrow keys, close with X), and the pause and
  wardrobe menus.
- **Combat:** the agent closes in, faces the enemy and swings, or uses the boomerang or bow when
  it is lined up. It earns AP from the math popup when needed and briefly retreats at 1 heart.

## Checks

- **CRITICAL:**
  - stuck while holding a key toward walkable space
  - hitbox inside a solid tile
  - teleport (more than 2 × speed × dt)
  - game loop stalled
  - uncaught errors, unhandled rejections and `console.error`
  - door, transition or exit that doesn't change the map
  - boss dead but no boss key or the door stays sealed
  - puzzle, chest or door that can't be completed
  - modal that can't be dismissed, or input locked after a dialogue
  - wrong math grading or AP reward
  - shop purchase that doesn't change gold or ownership exactly
  - "progression impossible", with the list of blockers
- **WARNING:**
  - HUD, button and shop-row rects outside the 640x360 canvas, or overlapping
  - text wider than its box, clipped by the canvas edge, drawn off-canvas or on top of other
    text. Text is measured with the game's own font and transform during a pass-through capture
    of one frame's draw calls
  - `imageSmoothingEnabled` set on the main context
  - walk frame frozen while moving, or animating while idle
  - diagonal speed different from cardinal speed
  - facing flicker
  - tap-to-move or tap-to-attack misbehaving
  - dialogue box or dialogue lines overflowing
  - enemies or pots placed inside solid terrain
- **INFO:** a timeline of milestones: purchases, keys, puzzles, bosses, medallions, dungeon
  entry, exit and re-entry, level-ups, phase timings.

Each finding records the game and wall time, the phase, the hero's map, position, HP, AP and gold,
the last 40 inputs and recent positions. Findings are deduplicated with a count. "Agent-side
notes" at the end of the report are problems with the agent itself, not game bugs.

## Limitations

- It follows one scripted route. It does not explore optional content such as the secret heart
  piece, the desert shop or cosmetics beyond what it can afford.
- A layout finding comes from a heuristic: text is compared with the smallest rect of the same
  layer drawn under it. Rects are known exactly only where the game exposes helpers such as
  `getMathButtons`, `getShopRows`, `qButtonRect` and `getLevelUpButtons`.
- Movement uses keyboard input. Taps are used for menus, buying, answers and a few tap-to-move
  and tap-to-attack probes. Set `touch: true` to send touch events instead of mouse events.
