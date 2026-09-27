# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T00:55:08.490Z | wall 124.8s | game time 495.6s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 2 agent-side notes

## Progress

- Level 16, hearts 9/9, attack 14, gold 82, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @169.4s), Boomerang (50g @169.5s)
- Kills 71, pots/bushes 41, sword swings 159, ranged shots 68, math solved 22 (locks 9), revives 1, level-ups 15
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 54.1 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.9 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.8 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 64.4 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1920,1440]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1920,1440]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1920,1440]
- t=5.5s (wall 1.4s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1884.5,1177.1]
- t=6.1s (wall 1.6s) Tap-to-move reached target (1 facing changes)  [overworld @1938.2,1200]
- t=6.1s (wall 1.6s) Phase end: calibrate (6.0s game)  [overworld @1938.2,1200]
- t=6.1s (wall 1.6s) Phase start: npc dialogue  [overworld @1938.2,1200]
- t=7.5s (wall 1.9s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1283.3]
- t=8.3s (wall 2.1s) Dialogue dismissed after 3 presses  [overworld @1991.5,1283.3]
- t=8.4s (wall 2.1s) Phase end: npc dialogue (2.4s game)  [overworld @1991.5,1300]
- t=8.4s (wall 2.1s) Phase start: farm gold/XP  [overworld @1991.5,1300]
- t=18.1s (wall 4.6s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2122.7,1562.6]
- t=33.4s (wall 8.4s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1819.2,1649.9]
- t=50.4s (wall 12.6s) Level up -> Lv 4, chose +1 Attack  [overworld @1604.5,1220.7]
- t=63.4s (wall 15.9s) Level up -> Lv 5, chose +1 Attack  [overworld @1481.6,856]
- t=87.1s (wall 21.8s) Level up -> Lv 6, chose +1 Attack  [overworld @1049.1,374.4]
- t=136s (wall 34s) Level up -> Lv 7, chose +1 Attack  [overworld @1097.4,1447.7]
- t=152.9s (wall 38.3s) Level up -> Lv 8, chose +1 Attack  [overworld @1580.3,1892.2]
- t=161.8s (wall 40.5s) Level up -> Lv 9, chose +1 Attack  [overworld @1939.2,1848.6]
- t=162.2s (wall 40.6s) Farming done: gold 0 -> 81, level 9, kills 33, pots 33  [overworld @1940.4,1845.8]
- t=162.2s (wall 40.6s) Phase end: farm gold/XP (153.8s game)  [overworld @1940.4,1845.8]
- t=162.2s (wall 40.6s) Phase start: shop  [overworld @1940.4,1845.8]
- t=168.7s (wall 42.2s) Entered Shop with 81 gold  [interior:Shop @120,140.8]
- t=169.1s (wall 42.3s) Shop opened  [interior:Shop @120,107.5]
- t=169.4s (wall 42.4s) Bought Sharp Sword for 30g (gold 81 -> 51)  [interior:Shop @120,107.5]
- t=169.5s (wall 42.4s) Bought Boomerang for 50g (gold 51 -> 1)  [interior:Shop @120,107.5]
- t=170.8s (wall 42.7s) Left shop (gold 1)  [overworld @2022.1,1358.4]
- t=170.8s (wall 42.7s) Phase end: shop (8.6s game)  [overworld @2022.1,1358.4]
- t=170.8s (wall 42.7s) Phase start: dungeon forest  [overworld @2022.1,1358.4]
- t=196.4s (wall 49.2s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=204.8s (wall 51.3s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @179.5,48.4]
- t=206.5s (wall 51.7s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=208.9s (wall 52.3s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,81]
- t=210.2s (wall 52.6s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=210.2s (wall 52.6s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=211.1s (wall 52.8s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=211.5s (wall 52.9s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=211.5s (wall 52.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=212.5s (wall 53.2s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=214.3s (wall 53.6s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=215.3s (wall 53.9s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=224.9s (wall 56.3s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @376.4,1023.5]
- t=225.9s (wall 56.5s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=226.8s (wall 56.7s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1022.8]
- t=226.8s (wall 56.7s) Phase end: dungeon forest (56.0s game)  [overworld @361.4,1022.8]
- t=226.8s (wall 56.7s) Phase start: restock after forest  [overworld @361.4,1022.8]
- t=226.8s (wall 56.7s) Phase end: restock after forest (0.0s game)  [overworld @361.4,1022.8]
- t=226.8s (wall 56.7s) Phase start: dungeon fire  [overworld @361.4,1022.8]
- t=260.9s (wall 65.3s) Level up -> Lv 11, chose +1 Attack  [overworld @3161.4,1138]
- t=274.6s (wall 68.7s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=279.5s (wall 69.9s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180.7,47.5]
- t=281.2s (wall 70.4s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=299.3s (wall 74.9s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=300.7s (wall 75.2s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=300.7s (wall 75.2s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=301.4s (wall 75.4s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=302.6s (wall 75.7s) Fire Dungeon: boss defeated in 1.9s (game)  [dungeon:fire:2 @87.1,96.5]
- t=302.6s (wall 75.7s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @87.1,96.5]
- t=304.9s (wall 76.3s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=305.9s (wall 76.5s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=315.7s (wall 79s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.5,414.5]
- t=315.7s (wall 79s) Phase end: dungeon fire (88.9s game)  [overworld @3432.5,414.5]
- t=315.7s (wall 79s) Phase start: restock after fire  [overworld @3432.5,414.5]
- t=315.7s (wall 79s) Phase end: restock after fire (0.0s game)  [overworld @3432.5,414.5]
- t=315.8s (wall 79s) Phase start: dungeon water  [overworld @3432.5,414.5]
- t=359.6s (wall 89.9s) Level up -> Lv 13, chose +1 Attack  [overworld @1078.9,2013.6]
- t=363s (wall 90.8s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.5,2087.9]
- t=367.2s (wall 91.8s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=377.5s (wall 94.4s) Water Dungeon: got the Small Key  [dungeon:water:0 @179,48.9]
- t=379.1s (wall 94.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=386.6s (wall 96.7s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.7,104.9]
- t=387.8s (wall 97s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=387.8s (wall 97s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=388.7s (wall 97.2s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @32,80]
- t=389.1s (wall 97.3s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=389.1s (wall 97.3s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=390.1s (wall 97.6s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=391.9s (wall 98s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=392.9s (wall 98.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=402.5s (wall 100.7s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.2,2385.6]
- t=402.5s (wall 100.7s) Phase end: dungeon water (86.8s game)  [overworld @793.2,2385.6]
- t=402.5s (wall 100.7s) Phase start: restock after water  [overworld @793.2,2385.6]
- t=402.5s (wall 100.7s) Phase end: restock after water (0.0s game)  [overworld @793.2,2385.6]
- t=402.5s (wall 100.7s) Phase start: dungeon shadow  [overworld @793.2,2385.6]
- t=437.4s (wall 109.4s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=441.7s (wall 110.5s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:0 @180.7,49.8]
- t=444.4s (wall 111.1s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @60.5,111.8]
- t=447s (wall 111.8s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=450.9s (wall 112.8s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @150.9,74.8]
- t=452.6s (wall 113.2s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=452.6s (wall 113.2s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=453.1s (wall 113.3s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=453.5s (wall 113.4s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=453.5s (wall 113.4s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=454.5s (wall 113.7s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=456.4s (wall 114.1s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=457.3s (wall 114.4s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=467s (wall 116.8s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @872.9,319.2]
- t=467s (wall 116.8s) Phase end: dungeon shadow (64.4s game)  [overworld @872.9,319.2]
- t=467s (wall 116.8s) Phase start: restock after shadow  [overworld @872.9,319.2]
- t=467s (wall 116.8s) Phase end: restock after shadow (0.0s game)  [overworld @872.9,319.2]
- t=467s (wall 116.8s) Phase start: castle  [overworld @872.9,319.2]
- t=482.6s (wall 120.7s) Entered the castle  [castle:0 @32,80]
- t=486.7s (wall 121.7s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=490.4s (wall 122.6s) Final boss defeated in 3.7s (game)  [castle:1 @154.9,106.9]
- t=495.6s (wall 124s) VICTORY screen reached  [castle:1 @154.9,106.9]
- t=495.6s (wall 124s) QA agent finished: victory  [castle:1 @154.9,106.9]

## Agent-side notes (not game bugs)

- t=111s no damage dealt to beetle for 14s; giving up (SOLVING_MATH / farm beetle (gold 55/80))
- t=296.2s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
   "item": "Crimson Knight",
   "rect": "40,478 540x26"
  }
 ]
}
```

## Runner

- Game file: `math-quest.html`
- Wall time 124.8s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
