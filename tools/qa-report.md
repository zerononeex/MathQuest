# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T20:40:59.763Z | wall 118.7s | game time 468.9s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 13, gold 67, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @143.3s), Boomerang (50g @143.4s)
- Kills 62, pots/bushes 36, sword swings 99, ranged shots 60, math solved 30 (locks 9), revives 1, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 52.7 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.2 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.6 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62 |

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
- t=9.8s (wall 2.5s) Opened dialogue with Curious Kid (3 lines)  [overworld @1816.5,1451.7]
- t=10.7s (wall 2.7s) Dialogue dismissed after 3 presses  [overworld @1816.5,1451.7]
- t=10.8s (wall 2.8s) Phase end: npc dialogue (4.8s game)  [overworld @1816.5,1468.3]
- t=10.8s (wall 2.8s) Phase start: farm gold/XP  [overworld @1816.5,1468.3]
- t=29.1s (wall 7.3s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1699,1487.7]
- t=52.3s (wall 13.1s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1579.4,1905.1]
- t=61s (wall 15.3s) Level up -> Lv 4, chose +1 Attack  [overworld @1734.8,1917.9]
- t=76.5s (wall 19.2s) Level up -> Lv 5, chose +1 Attack  [overworld @2079.6,1723.1]
- t=89s (wall 22.3s) Level up -> Lv 6, chose +1 Attack  [overworld @2416.4,1400.4]
- t=104.6s (wall 26.2s) Level up -> Lv 7, chose +1 Attack  [overworld @2213.6,990.2]
- t=129.6s (wall 32.4s) Level up -> Lv 8, chose +1 Attack  [overworld @2617.7,1939.6]
- t=130s (wall 32.5s) Farming done: gold 0 -> 80, level 8, kills 30, pots 27  [overworld @2617.7,1939.6]
- t=130s (wall 32.5s) Phase end: farm gold/XP (119.1s game)  [overworld @2617.7,1939.6]
- t=130s (wall 32.5s) Phase start: shop  [overworld @2617.7,1939.6]
- t=142.7s (wall 35.7s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=143s (wall 35.8s) Shop opened  [interior:Shop @120,107.5]
- t=143.3s (wall 35.9s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=143.4s (wall 35.9s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=144.7s (wall 36.2s) Left shop (gold 0)  [overworld @2024.4,1358.9]
- t=144.7s (wall 36.2s) Phase end: shop (14.7s game)  [overworld @2024.4,1358.9]
- t=144.7s (wall 36.2s) Phase start: dungeon forest  [overworld @2024.4,1358.9]
- t=166.1s (wall 41.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=177.3s (wall 44.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.4,48.2]
- t=179s (wall 44.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=181.4s (wall 45.4s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,81]
- t=182.7s (wall 45.7s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=182.7s (wall 45.7s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=183.6s (wall 45.9s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=184s (wall 46s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=184s (wall 46s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=185s (wall 46.3s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=186.8s (wall 46.7s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=187.8s (wall 47s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=197.4s (wall 49.4s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.1,1023.3]
- t=198.2s (wall 49.6s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=199.1s (wall 49.8s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.1,1022.6]
- t=199.1s (wall 49.8s) Phase end: dungeon forest (54.4s game)  [overworld @361.1,1022.6]
- t=199.1s (wall 49.8s) Phase start: restock after forest  [overworld @361.1,1022.6]
- t=199.1s (wall 49.8s) Phase end: restock after forest (0.0s game)  [overworld @361.1,1022.6]
- t=199.2s (wall 49.8s) Phase start: dungeon fire  [overworld @361.1,1022.6]
- t=246.5s (wall 61.7s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=251.3s (wall 62.9s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179.5,47.7]
- t=253s (wall 63.3s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=253.6s (wall 63.4s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:1 @76.3,108.3]
- t=271.1s (wall 67.8s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.7,56.8]
- t=272.5s (wall 68.2s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=272.5s (wall 68.2s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=274s (wall 68.5s) Fire Dungeon: boss defeated in 1.4s (game)  [dungeon:fire:2 @58.3,67]
- t=274s (wall 68.5s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @58.3,67]
- t=274.5s (wall 68.7s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.6,93]
- t=276.6s (wall 69.2s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=277.5s (wall 69.4s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=287.3s (wall 71.9s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.7,415.3]
- t=287.3s (wall 71.9s) Phase end: dungeon fire (88.2s game)  [overworld @3432.7,415.3]
- t=287.4s (wall 71.9s) Phase start: restock after fire  [overworld @3432.7,415.3]
- t=287.4s (wall 71.9s) Phase end: restock after fire (0.0s game)  [overworld @3432.7,415.3]
- t=287.4s (wall 71.9s) Phase start: dungeon water  [overworld @3432.7,415.3]
- t=293.6s (wall 73.4s) Level up -> Lv 11, chose +1 Attack  [overworld @3449.4,802.9]
- t=334.3s (wall 83.6s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.9,2088.1]
- t=338.4s (wall 84.7s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=344s (wall 86s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:0 @176.1,110.1]
- t=348.5s (wall 87.2s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.3,48.1]
- t=350.1s (wall 87.6s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=358.1s (wall 89.6s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.2,104.6]
- t=359.3s (wall 89.9s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=359.3s (wall 89.9s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=360.2s (wall 90.1s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=360.6s (wall 90.2s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=360.6s (wall 90.2s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=361.6s (wall 90.4s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=363.4s (wall 90.9s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=364.4s (wall 91.1s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=374s (wall 93.5s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.6,2384.1]
- t=374s (wall 93.5s) Phase end: dungeon water (86.6s game)  [overworld @793.6,2384.1]
- t=374s (wall 93.5s) Phase start: restock after water  [overworld @793.6,2384.1]
- t=374s (wall 93.5s) Phase end: restock after water (0.0s game)  [overworld @793.6,2384.1]
- t=374s (wall 93.6s) Phase start: dungeon shadow  [overworld @793.6,2384.1]
- t=408.6s (wall 102.2s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=414.2s (wall 103.6s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.6,48.7]
- t=415.9s (wall 104s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=418.7s (wall 104.7s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @149.2,75.5]
- t=419.9s (wall 105s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @147.2,74.8]
- t=421.7s (wall 105.5s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=421.7s (wall 105.5s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=422.6s (wall 105.7s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=422.6s (wall 105.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=423.6s (wall 105.9s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=425.4s (wall 106.4s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=426.4s (wall 106.6s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=436s (wall 109s) Exited Shadow Dungeon to the overworld at (55,19)  [overworld @895.8,313.7]
- t=436s (wall 109s) Phase end: dungeon shadow (62.0s game)  [overworld @895.8,313.7]
- t=436s (wall 109s) Phase start: restock after shadow  [overworld @895.8,313.7]
- t=436s (wall 109s) Phase end: restock after shadow (0.0s game)  [overworld @895.8,313.7]
- t=436s (wall 109.1s) Phase start: castle  [overworld @895.8,313.7]
- t=455.3s (wall 113.9s) Entered the castle  [castle:0 @32,80]
- t=456.1s (wall 114.1s) Level up -> Lv 15, chose +1 Attack  [castle:0 @63.5,104.8]
- t=459.6s (wall 114.9s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=463.6s (wall 116s) Final boss defeated in 4.1s (game)  [castle:1 @149,101]
- t=468.9s (wall 117.3s) VICTORY screen reached  [castle:1 @149,101]
- t=468.9s (wall 117.3s) QA agent finished: victory  [castle:1 @149,101]

## Agent-side notes (not game bugs)

- t=268s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 118.7s, timeScale x4, 4 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
