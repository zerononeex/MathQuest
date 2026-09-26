# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T16:16:11.974Z | wall 105.6s | game time 417.2s | timeScale x4
- Result: **no victory** - all phases complete (last phase: castle)
- Findings: **5 CRITICAL**, **4 WARNING**, 90 milestones, 0 agent-side notes

## Progress

- Level 12, hearts 8/8, attack 10, gold 45, medallions 0/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang
- Bought: Sharp Sword (30g @224.8s), Boomerang (50g @224.9s)
- Kills 46, pots/bushes 61, sword swings 63, ranged shots 18, math solved 27, revives 1, level-ups 11
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | no | yes | treasure chest will not open | 41.6 |
| Fire Dungeon | yes | yes | no | no | no | no | yes | torches puzzle | 36.3 |
| Water Dungeon | yes | yes | yes | yes | yes | no | yes | treasure chest will not open | 57.3 |
| Shadow Dungeon | yes | yes | yes | yes | yes | no | yes | treasure chest will not open | 52.1 |

## CRITICAL (5)

### QA-3 [progression] Forest Dungeon: treasure chest cannot be opened (hasBossKey=true): pressed E x5 within 14px and tapped it x2 - medallion unobtainable

- First seen: game t=257.83s, wall 64.6s (2026-09-26T16:17:16.579Z), during TREASURE / back beside chest
- Where: dungeon:forest:3 pos (122, 88) tile (7, 5), facing left, HP 6/6, AP 1, gold 10
- Manual repro: New Game -> clear the Forest Dungeon (Small Key, puzzle, boss -> Boss Key), walk into the treasure room, stand next to the chest at tile (8,5) and press E (or tap the chest): it never opens
- Suspected cause (static reading of the game code): handleDungeonDoors() reads Input.keys.e / Input.tapped, but updatePlaying() already consumed both earlier in the same step (talk-via-E block and tap-to-move block)
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=257.83s; last inputs before detection:

```
t=247.27s hold none   @106,102 dungeon:forest:1
t=247.27s hold Up   @106,102 dungeon:forest:1
t=247.38s hold none   @106,91 dungeon:forest:1
t=247.38s hold Left+Up   @106,91 dungeon:forest:1
t=247.40s hold Up   @104,90 dungeon:forest:1
t=247.48s hold none   @104,81 dungeon:forest:1
t=247.48s hold Right   @104,81 dungeon:forest:1
t=248.22s hold none   @178,81 dungeon:forest:1
t=248.23s hold Down   @178,81 dungeon:forest:1
t=248.30s hold Right   @178,88 dungeon:forest:1
t=248.83s hold none   @231,88 dungeon:forest:1
t=248.83s hold Right   @231,88 dungeon:forest:1
t=248.90s hold none   @238,88 dungeon:forest:1
t=249.57s press 2   @32,80 dungeon:forest:2
t=249.58s press Space   @32,80 dungeon:forest:2
t=249.97s press Space   @32,80 dungeon:forest:2
t=250.35s press Space   @32,80 dungeon:forest:2
t=250.37s hold Down   @32,80 dungeon:forest:2
t=250.45s hold none   @32,88 dungeon:forest:2
t=250.45s tap 440,235 (+1 Attack)   @32,88 dungeon:forest:2
t=250.87s hold Right+Down   @32,88 dungeon:forest:2
t=250.93s hold Right   @37,93 dungeon:forest:2
t=251.82s hold none   @125,93 dungeon:forest:2
t=251.82s hold Up   @125,93 dungeon:forest:2
t=251.85s hold Right   @125,90 dungeon:forest:2
t=252.90s hold none   @230,90 dungeon:forest:2
t=252.90s hold Right   @230,90 dungeon:forest:2
t=252.98s hold none   @238,90 dungeon:forest:2
t=253.65s hold Down   @32,80 dungeon:forest:3
t=253.73s hold Right   @32,88 dungeon:forest:3
t=254.60s hold none   @119,88 dungeon:forest:3
t=254.60s press e   @119,88 dungeon:forest:3
t=255.02s press e   @119,88 dungeon:forest:3
t=255.43s press e   @119,88 dungeon:forest:3
t=255.85s tap 328,188 (tap chest)   @119,88 dungeon:forest:3
t=256.37s tap 328,188 (tap chest)   @134,88 dungeon:forest:3
t=256.88s hold Left   @134,88 dungeon:forest:3
t=257.00s hold none   @122,88 dungeon:forest:3
t=257.00s press E   @122,88 dungeon:forest:3
t=257.42s press E   @122,88 dungeon:forest:3
```

Recent positions: 248s dungeon:forest:1 @156,81 -> 249s dungeon:forest:1 @238,88 -> 250s dungeon:forest:2 @32,80 -> 251s dungeon:forest:2 @43,93 -> 252s dungeon:forest:2 @140,90 -> 253s dungeon:forest:2 @238,90 -> 254s dungeon:forest:3 @59,88 -> 255s dungeon:forest:3 @119,88 -> 256s dungeon:forest:3 @134,88 -> 257s dungeon:forest:3 @122,88

### QA-4 [progression] Fire Dungeon: torch puzzle cannot be solved - pressing E while standing on torch 1 (tile 5,3) never lights it (puzzle.lit stays []); the way east never opens

- First seen: game t=301.37s, wall 75.5s (2026-09-26T16:17:27.462Z), during PUZZLE / walk to torch 1
- Where: dungeon:fire:1 pos (86.5, 57.1) tile (5, 3), facing up, HP 6/6, AP 7, gold 16
- Manual repro: New Game -> walk to the Fire Dungeon, smash the entrance-room pots for the Small Key, go through the east door; in the torch room stand on torch tile (5,3) and press E: it never lights
- Suspected cause (static reading of the game code): updatePlaying() clears Input.keys.e in its "talk via E" block (after the pot check) on every step, before updateDungeonRoom() -> updateDungeonPuzzle() reads it, so the torch check never sees E
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=301.37s; last inputs before detection:

```
t=293.75s hold Right   @48,105 dungeon:fire:0
t=294.13s hold Up   @87,105 dungeon:fire:0
t=294.28s hold Right   @87,90 dungeon:fire:0
t=294.45s hold Up   @103,90 dungeon:fire:0
t=294.77s hold Right   @103,58 dungeon:fire:0
t=295.20s hold Right+Up   @147,58 dungeon:fire:0
t=295.33s hold Right   @156,48 dungeon:fire:0
t=295.57s hold none   @179,48 dungeon:fire:0
t=295.57s press e   @179,48 dungeon:fire:0
t=295.97s hold Right+Up   @179,48 dungeon:fire:0
t=295.98s hold none   @181,47 dungeon:fire:0
t=296.00s hold Up   @181,47 dungeon:fire:0
t=296.07s hold Right   @181,41 dungeon:fire:0
t=296.42s hold Down   @216,41 dungeon:fire:0
t=296.57s hold Right   @216,56 dungeon:fire:0
t=296.72s hold Down   @231,56 dungeon:fire:0
t=297.03s hold none   @231,87 dungeon:fire:0
t=297.03s hold Right   @231,87 dungeon:fire:0
t=297.10s hold none   @237,87 dungeon:fire:0
t=297.77s press q   @32,80 dungeon:fire:1
t=297.78s tap 176,245 (answer "40" to 8 x 5 = ?)   @32,80 dungeon:fire:1
t=297.80s press q   @32,80 dungeon:fire:1
t=297.82s tap 464,245 (answer "27" to 69 - 42 = ?)   @32,80 dungeon:fire:1
t=297.85s hold Right+Down   @32,80 dungeon:fire:1
t=298.20s hold none   @57,105 dungeon:fire:1
t=298.20s press 2   @57,105 dungeon:fire:1
t=298.22s hold Right+Down   @57,105 dungeon:fire:1
t=298.28s hold Right   @61,109 dungeon:fire:1
t=298.37s hold none   @70,109 dungeon:fire:1
t=298.37s press 1   @70,109 dungeon:fire:1
t=298.38s press Space   @70,109 dungeon:fire:1
t=298.78s hold Right+Up   @76,109 dungeon:fire:1
t=298.82s hold none   @78,107 dungeon:fire:1
t=298.83s hold Up   @78,107 dungeon:fire:1
t=298.85s hold Right   @78,105 dungeon:fire:1
t=298.93s hold Up   @86,105 dungeon:fire:1
t=299.42s hold none   @86,57 dungeon:fire:1
t=299.42s press e   @86,57 dungeon:fire:1
t=300.07s press e   @86,57 dungeon:fire:1
t=300.72s press E   @86,57 dungeon:fire:1
```

Recent positions: 292s dungeon:fire:0 @80,67 -> 293s dungeon:fire:0 @51,72 -> 294s dungeon:fire:0 @73,105 -> 295s dungeon:fire:0 @127,58 -> 296s dungeon:fire:0 @181,47 -> 297s dungeon:fire:0 @231,84 -> 298s dungeon:fire:1 @43,91 -> 299s dungeon:fire:1 @86,99 -> 300s dungeon:fire:1 @86,57 -> 301s dungeon:fire:1 @86,57

### QA-5 [progression] Water Dungeon: treasure chest cannot be opened (hasBossKey=true): pressed E x5 within 14px and tapped it x2 - medallion unobtainable

- First seen: game t=353.15s, wall 88.4s (2026-09-26T16:17:40.411Z), during TREASURE / back beside chest
- Where: dungeon:water:3 pos (122, 88) tile (7, 5), facing left, HP 7/7, AP 4, gold 33
- Manual repro: New Game -> clear the Water Dungeon (Small Key, puzzle, boss -> Boss Key), walk into the treasure room, stand next to the chest at tile (8,5) and press E (or tap the chest): it never opens
- Suspected cause (static reading of the game code): handleDungeonDoors() reads Input.keys.e / Input.tapped, but updatePlaying() already consumed both earlier in the same step (talk-via-E block and tap-to-move block)
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=353.15s; last inputs before detection:

```
t=342.32s hold Down   @151,42 dungeon:water:1
t=342.62s hold Right   @151,72 dungeon:water:1
t=342.78s hold Down   @168,72 dungeon:water:1
t=343.27s hold Right   @168,120 dungeon:water:1
t=343.58s hold none   @199,120 dungeon:water:1
t=343.58s hold Up   @199,120 dungeon:water:1
t=343.73s hold none   @199,105 dungeon:water:1
t=343.73s hold Right   @199,105 dungeon:water:1
t=344.05s hold Up   @231,105 dungeon:water:1
t=344.22s hold none   @231,89 dungeon:water:1
t=344.22s hold Right   @231,89 dungeon:water:1
t=344.28s hold none   @238,89 dungeon:water:1
t=344.95s press Space   @32,80 dungeon:water:2
t=344.97s press q   @32,80 dungeon:water:2
t=344.98s tap 464,245 (answer "28" to 30 - 2 = ?)   @32,80 dungeon:water:2
t=345.00s press q   @32,80 dungeon:water:2
t=345.02s tap 176,245 (answer "15" to 62 - 47 = ?)   @32,80 dungeon:water:2
t=345.37s press Space   @32,80 dungeon:water:2
t=345.75s press Space   @32,80 dungeon:water:2
t=345.85s tap 440,235 (+1 Attack)   @32,80 dungeon:water:2
t=346.27s hold Right+Down   @32,80 dungeon:water:2
t=346.45s hold Right   @45,93 dungeon:water:2
t=347.25s hold none   @125,93 dungeon:water:2
t=347.25s hold Up   @125,93 dungeon:water:2
t=347.28s hold Right   @125,90 dungeon:water:2
t=348.35s hold none   @232,90 dungeon:water:2
t=348.35s hold Right   @232,90 dungeon:water:2
t=348.42s hold none   @238,90 dungeon:water:2
t=349.08s hold Down   @32,80 dungeon:water:3
t=349.17s hold Right   @32,88 dungeon:water:3
t=350.03s hold none   @119,88 dungeon:water:3
t=350.03s press e   @119,88 dungeon:water:3
t=350.43s press e   @119,88 dungeon:water:3
t=350.83s press e   @119,88 dungeon:water:3
t=351.23s tap 328,188 (tap chest)   @119,88 dungeon:water:3
t=351.73s tap 328,188 (tap chest)   @134,88 dungeon:water:3
t=352.23s hold Left   @134,88 dungeon:water:3
t=352.35s hold none   @122,88 dungeon:water:3
t=352.35s press E   @122,88 dungeon:water:3
t=352.75s press E   @122,88 dungeon:water:3
```

Recent positions: 344s dungeon:water:1 @226,105 -> 345s dungeon:water:2 @32,80 -> 346s dungeon:water:2 @32,80 -> 347s dungeon:water:2 @100,93 -> 348s dungeon:water:2 @197,90 -> 349s dungeon:water:3 @32,80 -> 350s dungeon:water:3 @115,88 -> 351s dungeon:water:3 @119,88 -> 352s dungeon:water:3 @134,88 -> 353s dungeon:water:3 @122,88

### QA-6 [progression] Shadow Dungeon: treasure chest cannot be opened (hasBossKey=true): pressed E x5 within 14px and tapped it x2 - medallion unobtainable

- First seen: game t=405.23s, wall 101.5s (2026-09-26T16:17:53.427Z), during TREASURE / back beside chest
- Where: dungeon:shadow:3 pos (122, 88) tile (7, 5), facing left, HP 8/8, AP 6, gold 45
- Manual repro: New Game -> clear the Shadow Dungeon (Small Key, puzzle, boss -> Boss Key), walk into the treasure room, stand next to the chest at tile (8,5) and press E (or tap the chest): it never opens
- Suspected cause (static reading of the game code): handleDungeonDoors() reads Input.keys.e / Input.tapped, but updatePlaying() already consumed both earlier in the same step (talk-via-E block and tap-to-move block)
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=405.23s; last inputs before detection:

```
t=394.30s hold none   @113,73 dungeon:shadow:1
t=394.30s press Space   @113,73 dungeon:shadow:1
t=394.90s hold Right+Up   @113,73 dungeon:shadow:1
t=394.95s hold Right   @117,69 dungeon:shadow:1
t=394.98s hold none   @120,69 dungeon:shadow:1
t=395.00s hold Down   @120,69 dungeon:shadow:1
t=395.02s hold Right   @120,71 dungeon:shadow:1
t=395.32s hold Down   @150,71 dungeon:shadow:1
t=395.48s hold Right   @150,88 dungeon:shadow:1
t=396.28s hold none   @230,88 dungeon:shadow:1
t=396.28s hold Right   @230,88 dungeon:shadow:1
t=396.37s hold none   @238,88 dungeon:shadow:1
t=397.03s press Space   @32,80 dungeon:shadow:2
t=397.42s press Space   @32,80 dungeon:shadow:2
t=397.43s press q   @32,80 dungeon:shadow:2
t=397.45s tap 320,245 (answer "5" to 71 - 66 = ?)   @32,80 dungeon:shadow:2
t=397.47s press q   @32,80 dungeon:shadow:2
t=397.48s tap 464,245 (answer "14" to 25 - 11 = ?)   @32,80 dungeon:shadow:2
t=397.83s press Space   @32,80 dungeon:shadow:2
t=397.93s tap 440,235 (+1 Attack)   @32,80 dungeon:shadow:2
t=398.35s hold Right+Down   @32,80 dungeon:shadow:2
t=398.53s hold Right   @45,93 dungeon:shadow:2
t=399.33s hold none   @125,93 dungeon:shadow:2
t=399.33s hold Up   @125,93 dungeon:shadow:2
t=399.37s hold Right   @125,90 dungeon:shadow:2
t=400.43s hold none   @232,90 dungeon:shadow:2
t=400.43s hold Right   @232,90 dungeon:shadow:2
t=400.50s hold none   @238,90 dungeon:shadow:2
t=401.17s hold Down   @32,80 dungeon:shadow:3
t=401.25s hold Right   @32,88 dungeon:shadow:3
t=402.12s hold none   @119,88 dungeon:shadow:3
t=402.12s press e   @119,88 dungeon:shadow:3
t=402.52s press e   @119,88 dungeon:shadow:3
t=402.92s press e   @119,88 dungeon:shadow:3
t=403.32s tap 328,188 (tap chest)   @119,88 dungeon:shadow:3
t=403.82s tap 328,188 (tap chest)   @134,88 dungeon:shadow:3
t=404.32s hold Left   @134,88 dungeon:shadow:3
t=404.43s hold none   @122,88 dungeon:shadow:3
t=404.43s press E   @122,88 dungeon:shadow:3
t=404.83s press E   @122,88 dungeon:shadow:3
```

Recent positions: 396s dungeon:shadow:1 @202,88 -> 397s dungeon:shadow:2 @32,80 -> 398s dungeon:shadow:2 @32,80 -> 399s dungeon:shadow:2 @92,93 -> 400s dungeon:shadow:2 @188,90 -> 401s dungeon:shadow:3 @32,80 -> 402s dungeon:shadow:3 @107,88 -> 403s dungeon:shadow:3 @119,88 -> 404s dungeon:shadow:3 @134,88 -> 405s dungeon:shadow:3 @122,88

### QA-9 [progression] Game cannot be completed legitimately: the castle needs 4 medallions but only 0/4 are obtainable in this build. Blockers - Forest Dungeon: treasure chest will not open; Fire Dungeon: torches puzzle; Water Dungeon: treasure chest will not open; Shadow Dungeon: treasure chest will not open

- First seen: game t=416.87s, wall 104.4s (2026-09-26T16:17:56.344Z), during FINAL / walk to castle gate
- Where: overworld pos (1606.2, 105.5) tile (100, 6), facing right, HP 8/8, AP 6, gold 45
- Details: `{"dungeons":{"forest":{"name":"Forest Dungeon","entered":true,"smallKey":true,"puzzle":true,"bossKilled":true,"bossKey":true,"chest":false,"exited":true,"blockedBy":"treasure chest will not open","gameSeconds":41.6},"fire":{"name":"Fire Dungeon","entered":true,"smallKey":true,"puzzle":false,"bossKilled":false,"bossKey":false,"chest":false,"exited":true,"blockedBy":"torches puzzle","gameSeconds":36.3},"water":{"name":"Water Dungeon","entered":true,"smallKey":true,"puzzle":true,"bossKilled":true,"bossKey":true,"chest":false,"exited":true,"blockedBy":"treasure chest will not open","gameSeconds":5`
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=416.87s; last inputs before detection:

```
t=397.83s press Space   @32,80 dungeon:shadow:2
t=397.93s tap 440,235 (+1 Attack)   @32,80 dungeon:shadow:2
t=398.35s hold Right+Down   @32,80 dungeon:shadow:2
t=398.53s hold Right   @45,93 dungeon:shadow:2
t=399.33s hold none   @125,93 dungeon:shadow:2
t=399.33s hold Up   @125,93 dungeon:shadow:2
t=399.37s hold Right   @125,90 dungeon:shadow:2
t=400.43s hold none   @232,90 dungeon:shadow:2
t=400.43s hold Right   @232,90 dungeon:shadow:2
t=400.50s hold none   @238,90 dungeon:shadow:2
t=401.17s hold Down   @32,80 dungeon:shadow:3
t=401.25s hold Right   @32,88 dungeon:shadow:3
t=402.12s hold none   @119,88 dungeon:shadow:3
t=402.12s press e   @119,88 dungeon:shadow:3
t=402.52s press e   @119,88 dungeon:shadow:3
t=402.92s press e   @119,88 dungeon:shadow:3
t=403.32s tap 328,188 (tap chest)   @119,88 dungeon:shadow:3
t=403.82s tap 328,188 (tap chest)   @134,88 dungeon:shadow:3
t=404.32s hold Left   @134,88 dungeon:shadow:3
t=404.43s hold none   @122,88 dungeon:shadow:3
t=404.43s press E   @122,88 dungeon:shadow:3
t=404.83s press E   @122,88 dungeon:shadow:3
t=405.23s hold Left   @122,88 dungeon:shadow:3
t=406.27s hold none   @19,88 dungeon:shadow:3
t=406.93s hold Down   @208,80 dungeon:shadow:2
t=407.02s hold Left   @208,88 dungeon:shadow:2
t=408.92s hold none   @18,88 dungeon:shadow:2
t=409.58s hold Down   @208,80 dungeon:shadow:1
t=409.67s hold Left   @208,88 dungeon:shadow:1
t=411.57s hold none   @18,88 dungeon:shadow:1
t=412.23s hold Down   @208,80 dungeon:shadow:0
t=412.32s hold Left   @208,88 dungeon:shadow:0
t=414.22s hold none   @18,88 dungeon:shadow:0
t=414.92s hold Up   @1606,224 overworld
t=414.98s hold Left   @1606,217 overworld
t=415.27s hold Up   @1578,217 overworld
t=415.90s hold Right   @1578,154 overworld
t=416.03s hold Up   @1591,154 overworld
t=416.52s hold Right   @1591,105 overworld
t=416.67s hold none   @1606,105 overworld
```

Recent positions: 407s dungeon:shadow:2 @208,87 -> 408s dungeon:shadow:2 @110,88 -> 409s dungeon:shadow:2 @18,88 -> 410s dungeon:shadow:1 @175,88 -> 411s dungeon:shadow:1 @75,88 -> 412s dungeon:shadow:0 @208,80 -> 413s dungeon:shadow:0 @140,88 -> 414s dungeon:shadow:0 @40,88 -> 415s overworld @1605,217 -> 416s overworld @1588,154

## WARNING (4)

### QA-1 [world] 2 enemies/pots are placed inside solid terrain and can never be reached: enemy slime @overworld (1856,1376) on CLIFF; enemy bat @overworld (1888,1216) on CLIFF

- First seen: game t=0.03s, wall 0s (2026-09-26T16:16:12.011Z), during CALIBRATE
- Where: overworld pos (1600, 1152) tile (100, 72), facing down, HP 3/3, AP 5, gold 0
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=0.03s; last inputs before detection:

```
t=0.02s tap 470,176 (New Game)   @1600,1152 overworld
```

### QA-2 [layout] Text "Throw it at foes far away!" overlaps text "That's okay! Come back with more gold."

- First seen: game t=225.07s, wall 56.4s (2026-09-26T16:17:08.381Z), during SHOPPING / buy Boomerang
- Where: interior:Shop pos (72, 76.8) tile (4, 4), facing up, HP 5/5, AP 6, gold 0
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=225.07s; last inputs before detection:

```
t=209.20s hold Left   @2506,407 overworld
t=209.52s hold Down   @2474,407 overworld
t=209.68s hold Left   @2474,424 overworld
t=212.57s hold Down   @2186,424 overworld
t=212.73s hold Left   @2186,440 overworld
t=213.22s hold Down   @2137,440 overworld
t=213.68s hold Left   @2137,487 overworld
t=213.85s hold Down   @2121,487 overworld
t=214.02s hold Left   @2121,504 overworld
t=214.33s hold Down   @2089,504 overworld
t=214.50s hold Left   @2089,520 overworld
t=215.13s hold Down   @2026,520 overworld
t=215.28s hold Left   @2026,535 overworld
t=215.60s hold Down   @1994,535 overworld
t=216.08s hold Left   @1994,584 overworld
t=216.42s hold Down   @1961,584 overworld
t=217.38s hold Left   @1961,680 overworld
t=217.53s hold Down   @1946,680 overworld
t=218.17s hold Left   @1946,744 overworld
t=218.33s hold Down   @1929,744 overworld
t=219.13s hold Left   @1929,824 overworld
t=219.77s hold Down   @1866,824 overworld
t=220.73s hold Left   @1866,920 overworld
t=221.22s hold Down   @1817,920 overworld
t=221.53s hold Left   @1817,952 overworld
t=221.70s hold Down   @1801,952 overworld
t=221.85s hold Left   @1801,967 overworld
t=222.00s hold Down   @1786,967 overworld
t=222.17s hold Left   @1786,984 overworld
t=222.33s hold Down   @1769,984 overworld
t=222.50s hold Left   @1769,1000 overworld
t=222.65s hold Down   @1754,1000 overworld
t=223.28s hold Left   @1754,1064 overworld
t=223.77s hold Up   @1706,1064 overworld
t=223.85s hold none   @1706,1055 overworld
t=224.52s press e   @72,77 interior:Shop
t=224.67s tap 310,71 (buy Sharp Sword)   @72,77 interior:Shop
t=224.80s tap 310,101 (buy Boomerang)   @72,77 interior:Shop
t=224.93s tap 310,131 (try unaffordable Hero Sword)   @72,77 interior:Shop
t=225.07s tap 615,25 (shop close X)   @72,77 interior:Shop
```

Recent positions: 216s overworld @1994,575 -> 217s overworld @1961,642 -> 218s overworld @1946,727 -> 219s overworld @1929,810 -> 220s overworld @1866,847 -> 221s overworld @1839,920 -> 222s overworld @1786,967 -> 223s overworld @1754,1035 -> 224s overworld @1706,1055 -> 225s interior:Shop @72,77

### QA-7 [layout] Text clipped by the canvas edge: "The castle door needs all 4 medallions (0/4). Missing: Forest Medallion, Fire Medallion, Water Medallion, Shadow Medallion" spans x -157..797, y 99..113 (bold 13px monospace) (x2, last at 416.78s)

- First seen: game t=416.58s, wall 104.3s (2026-09-26T16:17:56.266Z), during FINAL / walk to castle gate
- Where: overworld pos (1597.8, 105.5) tile (99, 6), facing right, HP 8/8, AP 6, gold 45
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=416.58s; last inputs before detection:

```
t=397.48s tap 464,245 (answer "14" to 25 - 11 = ?)   @32,80 dungeon:shadow:2
t=397.83s press Space   @32,80 dungeon:shadow:2
t=397.93s tap 440,235 (+1 Attack)   @32,80 dungeon:shadow:2
t=398.35s hold Right+Down   @32,80 dungeon:shadow:2
t=398.53s hold Right   @45,93 dungeon:shadow:2
t=399.33s hold none   @125,93 dungeon:shadow:2
t=399.33s hold Up   @125,93 dungeon:shadow:2
t=399.37s hold Right   @125,90 dungeon:shadow:2
t=400.43s hold none   @232,90 dungeon:shadow:2
t=400.43s hold Right   @232,90 dungeon:shadow:2
t=400.50s hold none   @238,90 dungeon:shadow:2
t=401.17s hold Down   @32,80 dungeon:shadow:3
t=401.25s hold Right   @32,88 dungeon:shadow:3
t=402.12s hold none   @119,88 dungeon:shadow:3
t=402.12s press e   @119,88 dungeon:shadow:3
t=402.52s press e   @119,88 dungeon:shadow:3
t=402.92s press e   @119,88 dungeon:shadow:3
t=403.32s tap 328,188 (tap chest)   @119,88 dungeon:shadow:3
t=403.82s tap 328,188 (tap chest)   @134,88 dungeon:shadow:3
t=404.32s hold Left   @134,88 dungeon:shadow:3
t=404.43s hold none   @122,88 dungeon:shadow:3
t=404.43s press E   @122,88 dungeon:shadow:3
t=404.83s press E   @122,88 dungeon:shadow:3
t=405.23s hold Left   @122,88 dungeon:shadow:3
t=406.27s hold none   @19,88 dungeon:shadow:3
t=406.93s hold Down   @208,80 dungeon:shadow:2
t=407.02s hold Left   @208,88 dungeon:shadow:2
t=408.92s hold none   @18,88 dungeon:shadow:2
t=409.58s hold Down   @208,80 dungeon:shadow:1
t=409.67s hold Left   @208,88 dungeon:shadow:1
t=411.57s hold none   @18,88 dungeon:shadow:1
t=412.23s hold Down   @208,80 dungeon:shadow:0
t=412.32s hold Left   @208,88 dungeon:shadow:0
t=414.22s hold none   @18,88 dungeon:shadow:0
t=414.92s hold Up   @1606,224 overworld
t=414.98s hold Left   @1606,217 overworld
t=415.27s hold Up   @1578,217 overworld
t=415.90s hold Right   @1578,154 overworld
t=416.03s hold Up   @1591,154 overworld
t=416.52s hold Right   @1591,105 overworld
```

Recent positions: 407s dungeon:shadow:2 @208,87 -> 408s dungeon:shadow:2 @110,88 -> 409s dungeon:shadow:2 @18,88 -> 410s dungeon:shadow:1 @175,88 -> 411s dungeon:shadow:1 @75,88 -> 412s dungeon:shadow:0 @208,80 -> 413s dungeon:shadow:0 @140,88 -> 414s dungeon:shadow:0 @40,88 -> 415s overworld @1605,217 -> 416s overworld @1588,154

### QA-8 [layout] Text wider than its box: "The castle door needs all 4 medallions (0/4). Missing: Forest Medallion, Fire Medallion, Water Medallion, Shadow Medallion" is 955px wide (bold 13px monospace) but its box is 624px (box at 8,92 624x26) (x2, last at 416.78s)

- First seen: game t=416.58s, wall 104.3s (2026-09-26T16:17:56.266Z), during FINAL / walk to castle gate
- Where: overworld pos (1597.8, 105.5) tile (99, 6), facing right, HP 8/8, AP 6, gold 45
- Details: `{"text":"The castle door needs all 4 medallions (0/4). Missing: Forest Medallion, Fire Medallion, Water Medallion, Shadow Medallion","box":"8,92 624x26"}`
- Repro: New Game (default difficulty), then follow the milestone timeline below up to t=416.58s; last inputs before detection:

```
t=397.48s tap 464,245 (answer "14" to 25 - 11 = ?)   @32,80 dungeon:shadow:2
t=397.83s press Space   @32,80 dungeon:shadow:2
t=397.93s tap 440,235 (+1 Attack)   @32,80 dungeon:shadow:2
t=398.35s hold Right+Down   @32,80 dungeon:shadow:2
t=398.53s hold Right   @45,93 dungeon:shadow:2
t=399.33s hold none   @125,93 dungeon:shadow:2
t=399.33s hold Up   @125,93 dungeon:shadow:2
t=399.37s hold Right   @125,90 dungeon:shadow:2
t=400.43s hold none   @232,90 dungeon:shadow:2
t=400.43s hold Right   @232,90 dungeon:shadow:2
t=400.50s hold none   @238,90 dungeon:shadow:2
t=401.17s hold Down   @32,80 dungeon:shadow:3
t=401.25s hold Right   @32,88 dungeon:shadow:3
t=402.12s hold none   @119,88 dungeon:shadow:3
t=402.12s press e   @119,88 dungeon:shadow:3
t=402.52s press e   @119,88 dungeon:shadow:3
t=402.92s press e   @119,88 dungeon:shadow:3
t=403.32s tap 328,188 (tap chest)   @119,88 dungeon:shadow:3
t=403.82s tap 328,188 (tap chest)   @134,88 dungeon:shadow:3
t=404.32s hold Left   @134,88 dungeon:shadow:3
t=404.43s hold none   @122,88 dungeon:shadow:3
t=404.43s press E   @122,88 dungeon:shadow:3
t=404.83s press E   @122,88 dungeon:shadow:3
t=405.23s hold Left   @122,88 dungeon:shadow:3
t=406.27s hold none   @19,88 dungeon:shadow:3
t=406.93s hold Down   @208,80 dungeon:shadow:2
t=407.02s hold Left   @208,88 dungeon:shadow:2
t=408.92s hold none   @18,88 dungeon:shadow:2
t=409.58s hold Down   @208,80 dungeon:shadow:1
t=409.67s hold Left   @208,88 dungeon:shadow:1
t=411.57s hold none   @18,88 dungeon:shadow:1
t=412.23s hold Down   @208,80 dungeon:shadow:0
t=412.32s hold Left   @208,88 dungeon:shadow:0
t=414.22s hold none   @18,88 dungeon:shadow:0
t=414.92s hold Up   @1606,224 overworld
t=414.98s hold Left   @1606,217 overworld
t=415.27s hold Up   @1578,217 overworld
t=415.90s hold Right   @1578,154 overworld
t=416.03s hold Up   @1591,154 overworld
t=416.52s hold Right   @1591,105 overworld
```

Recent positions: 407s dungeon:shadow:2 @208,87 -> 408s dungeon:shadow:2 @110,88 -> 409s dungeon:shadow:2 @18,88 -> 410s dungeon:shadow:1 @175,88 -> 411s dungeon:shadow:1 @75,88 -> 412s dungeon:shadow:0 @208,80 -> 413s dungeon:shadow:0 @140,88 -> 414s dungeon:shadow:0 @40,88 -> 415s overworld @1605,217 -> 416s overworld @1588,154

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1600,1152]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1600,1152]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1600,1152]
- t=7.9s (wall 2.1s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1181.2,1032.5]
- t=8.5s (wall 2.3s) Tap-to-move reached target (1 facing changes)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase end: calibrate (8.5s game)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase start: npc dialogue  [overworld @1234.9,1055.1]
- t=13s (wall 3.4s) Opened dialogue with Mustachioed Wanderer (3 lines)  [overworld @1478.3,1248.5]
- t=13.9s (wall 3.6s) Dialogue dismissed after 3 presses  [overworld @1478.3,1248.5]
- t=14.1s (wall 3.7s) Phase end: npc dialogue (5.6s game)  [overworld @1478.3,1265.1]
- t=14.1s (wall 3.7s) Phase start: farm gold/XP  [overworld @1478.3,1265.1]
- t=30.5s (wall 7.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1365.9,1308.4]
- t=42.1s (wall 10.7s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1157.5,793.1]
- t=53.6s (wall 13.6s) Level up -> Lv 4, chose +1 Attack  [overworld @1342.2,548.9]
- t=69.7s (wall 17.6s) Level up -> Lv 5, chose +1 Attack  [overworld @1859.9,940.6]
- t=131.8s (wall 33.1s) Level up -> Lv 6, chose +1 Attack  [overworld @1736.7,609.1]
- t=156.7s (wall 39.3s) Level up -> Lv 7, chose +1 Attack  [overworld @2373,780.2]
- t=207s (wall 51.9s) Farming done: gold 0 -> 80, level 7, kills 28, pots 50  [overworld @2647.3,330.5]
- t=207s (wall 51.9s) Phase end: farm gold/XP (192.9s game)  [overworld @2647.3,330.5]
- t=207s (wall 51.9s) Phase start: shop  [overworld @2647.3,330.5]
- t=224.5s (wall 56.3s) Entered Shop with 80 gold  [interior:Shop @72,76.8]
- t=224.5s (wall 56.3s) Shop opened  [interior:Shop @72,76.8]
- t=224.8s (wall 56.3s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @72,76.8]
- t=224.9s (wall 56.4s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @72,76.8]
- t=225.9s (wall 56.6s) Left shop (gold 0)  [overworld @1705.7,1071.5]
- t=225.9s (wall 56.6s) Phase end: shop (18.9s game)  [overworld @1705.7,1071.5]
- t=225.9s (wall 56.6s) Phase start: dungeon forest  [overworld @1705.7,1071.5]
- t=238.6s (wall 59.8s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=239.5s (wall 60s) Level up -> Lv 8, chose +1 Attack  [dungeon:forest:0 @33.7,80]
- t=244.2s (wall 61.2s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.8,47.2]
- t=246s (wall 61.7s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=248.2s (wall 62.2s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=249.6s (wall 62.5s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=249.6s (wall 62.5s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=250.5s (wall 62.8s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,88.3]
- t=250.9s (wall 62.9s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,88.3]
- t=250.9s (wall 62.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,88.3]
- t=251.8s (wall 63.1s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=253.6s (wall 63.6s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=267.5s (wall 67s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729,862.5]
- t=268.3s (wall 67.2s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=269.2s (wall 67.4s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729,863.5]
- t=269.2s (wall 67.4s) Phase end: dungeon forest (43.3s game)  [overworld @729,863.5]
- t=269.2s (wall 67.4s) Phase start: restock after forest  [overworld @729,863.5]
- t=269.2s (wall 67.4s) Phase end: restock after forest (0.0s game)  [overworld @729,863.5]
- t=269.2s (wall 67.5s) Phase start: dungeon fire  [overworld @729,863.5]
- t=290.4s (wall 72.7s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=296s (wall 74.1s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180.5,47.3]
- t=297.8s (wall 74.6s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=305.5s (wall 76.5s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2512.3,1144.5]
- t=305.5s (wall 76.5s) Phase end: dungeon fire (36.3s game)  [overworld @2512.3,1144.5]
- t=305.5s (wall 76.5s) Phase start: restock after fire  [overworld @2512.3,1144.5]
- t=305.5s (wall 76.5s) Phase end: restock after fire (0.0s game)  [overworld @2512.3,1144.5]
- t=305.5s (wall 76.5s) Phase start: dungeon water  [overworld @2512.3,1144.5]
- t=329.3s (wall 82.5s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=330.2s (wall 82.7s) Level up -> Lv 10, chose +1 Attack  [dungeon:water:0 @33.7,80]
- t=338s (wall 84.7s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.8,47.7]
- t=339.8s (wall 85.1s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=343.7s (wall 86.1s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.3,105.2]
- t=345s (wall 86.4s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=345s (wall 86.4s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=345.9s (wall 86.6s) Level up -> Lv 11, chose +1 Attack  [dungeon:water:2 @32,80]
- t=346.3s (wall 86.7s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=346.3s (wall 86.7s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=347.3s (wall 87s) Water Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:water:2 @125,93]
- t=349.1s (wall 87.4s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=362.8s (wall 90.8s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1054.5,1879.5]
- t=362.8s (wall 90.8s) Phase end: dungeon water (57.3s game)  [overworld @1054.5,1879.5]
- t=362.8s (wall 90.9s) Phase start: restock after water  [overworld @1054.5,1879.5]
- t=362.8s (wall 90.9s) Phase end: restock after water (0.0s game)  [overworld @1054.5,1879.5]
- t=362.8s (wall 90.9s) Phase start: dungeon shadow  [overworld @1054.5,1879.5]
- t=385.7s (wall 96.6s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=390.5s (wall 97.8s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.3,47]
- t=392.2s (wall 98.2s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=395s (wall 98.9s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @120.1,69.4]
- t=397s (wall 99.4s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=397s (wall 99.4s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=398s (wall 99.6s) Level up -> Lv 12, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=398.4s (wall 99.7s) Shadow Dungeon: boss defeated in 1.3s (game)  [dungeon:shadow:2 @32,80]
- t=398.4s (wall 99.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=399.3s (wall 100s) Shadow Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:shadow:2 @125,93]
- t=401.2s (wall 100.4s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=414.9s (wall 103.9s) Exited Shadow Dungeon to the overworld at (100,13)  [overworld @1606.2,223.8]
- t=414.9s (wall 103.9s) Phase end: dungeon shadow (52.1s game)  [overworld @1606.2,223.8]
- t=414.9s (wall 103.9s) Phase start: restock after shadow  [overworld @1606.2,223.8]
- t=414.9s (wall 103.9s) Phase end: restock after shadow (0.0s game)  [overworld @1606.2,223.8]
- t=414.9s (wall 103.9s) Phase start: castle  [overworld @1606.2,223.8]
- t=416.7s (wall 104.3s) Castle gate refused entry with 0/4 medallions (hint shown: "The castle door needs all 4 medallions (0/4). Missing: Forest Medallion, Fire Medallion, Water Medallion, Shadow Medallion")  [overworld @1606.2,105.5]
- t=417.2s (wall 104.5s) Phase end: castle (2.3s game)  [overworld @1606.2,105.5]
- t=417.2s (wall 104.5s) QA agent finished: all phases complete  [overworld @1606.2,105.5]

## Agent-side notes (not game bugs)

_none_

## Layout data

```
{
 "hud": [
  {
   "name": "qButton",
   "rect": "584,8 48x48"
  },
  {
   "name": "speakerIcon",
   "rect": "176,312 28x28"
  },
  {
   "name": "wardrobeButton",
   "rect": "210,312 28x28"
  },
  {
   "name": "saveButton",
   "rect": "244,312 28x28"
  },
  {
   "name": "weaponSlot1",
   "rect": "10,302 48x48"
  },
  {
   "name": "weaponSlot2",
   "rect": "64,302 48x48"
  },
  {
   "name": "weaponSlot3",
   "rect": "118,302 48x48"
  }
 ],
 "dialogChecked": true,
 "dialogBox": "20,254 600x90",
 "shopRows": [
  {
   "item": "Sharp Sword",
   "rect": "40,58 540x26"
  },
  {
   "item": "Boomerang",
   "rect": "40,88 540x26"
  },
  {
   "item": "Hero Sword",
   "rect": "40,118 540x26"
  },
  {
   "item": "Bow & Arrows",
   "rect": "40,148 540x26"
  },
  {
   "item": "Fire Arrows",
   "rect": "40,178 540x26"
  },
  {
   "item": "Ice Arrows",
   "rect": "40,208 540x26"
  },
  {
   "item": "Gust Boomerang",
   "rect": "40,238 540x26"
  },
  {
   "item": "Heart Vessel",
   "rect": "40,268 540x26"
  },
  {
   "item": "Giant's Berry",
   "rect": "40,298 540x26"
  },
  {
   "item": "Ember Bloom",
   "rect": "40,328 540x26"
  },
  {
   "item": "Rolling Barrel",
   "rect": "40,358 540x26"
  },
  {
   "item": "Ink Blaster",
   "rect": "40,388 540x26"
  },
  {
   "item": "Red Tunic",
   "rect": "40,418 540x26"
  },
  {
   "item": "Blue Tunic",
   "rect": "40,448 540x26"
  },
  {
   "item": "Red Overalls",
   "rect": "40,478 540x26"
  }
 ]
}
```

## Runner

- Game file: `math-quest.html`
- Wall time 105.6s, timeScale x4, 9 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
