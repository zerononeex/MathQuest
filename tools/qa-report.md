# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T00:43:29.825Z | wall 128.9s | game time 510.3s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 108 milestones, 2 agent-side notes

## Progress

- Level 16, hearts 8/9, attack 14, gold 76, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @203s), Boomerang (50g @203.2s)
- Kills 67, pots/bushes 61, sword swings 140, ranged shots 58, math solved 21 (locks 9), revives 2, level-ups 15
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 85.9 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 52.3 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1920,1440]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1920,1440]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1920,1440]
- t=5.5s (wall 1.4s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1884.5,1177.1]
- t=6.1s (wall 1.5s) Tap-to-move reached target (1 facing changes)  [overworld @1938.2,1200]
- t=6.1s (wall 1.5s) Phase end: calibrate (6.0s game)  [overworld @1938.2,1200]
- t=6.1s (wall 1.5s) Phase start: npc dialogue  [overworld @1938.2,1200]
- t=7.2s (wall 1.8s) Opened dialogue with Curious Kid (3 lines)  [overworld @1958.2,1295]
- t=8s (wall 2s) Dialogue dismissed after 3 presses  [overworld @1958.2,1295]
- t=8.2s (wall 2.1s) Phase end: npc dialogue (2.1s game)  [overworld @1958.2,1311.7]
- t=8.2s (wall 2.1s) Phase start: farm gold/XP  [overworld @1958.2,1311.7]
- t=21.2s (wall 5.3s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1819.5,1662.9]
- t=35.5s (wall 8.9s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2160.9,1522.5]
- t=57.8s (wall 14.5s) Level up -> Lv 4, chose +1 Attack  [overworld @2592.4,1388.9]
- t=63.6s (wall 15.9s) Level up -> Lv 5, chose +1 Attack  [overworld @2585.5,1656.1]
- t=91.6s (wall 22.9s) Level up -> Lv 6, chose +1 Attack  [overworld @1746.6,1928.4]
- t=115.8s (wall 29s) Level up -> Lv 7, chose +1 Attack  [overworld @1673.5,1488.4]
- t=161s (wall 40.3s) Level up -> Lv 8, chose +1 Attack  [overworld @2451.9,2126.4]
- t=174.5s (wall 43.7s) Level up -> Lv 9, chose +1 Attack  [overworld @2240.2,2419]
- t=186.7s (wall 46.7s) Farming done: gold 0 -> 80, level 9, kills 34, pots 52  [overworld @2679.7,2186.5]
- t=186.7s (wall 46.7s) Phase end: farm gold/XP (178.5s game)  [overworld @2679.7,2186.5]
- t=186.8s (wall 46.7s) Phase start: shop  [overworld @2679.7,2186.5]
- t=202.4s (wall 50.6s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=202.8s (wall 50.7s) Shop opened  [interior:Shop @120,107.5]
- t=203s (wall 50.8s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=203.2s (wall 50.8s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=204.5s (wall 51.1s) Left shop (gold 0)  [overworld @2024.7,1359.2]
- t=204.5s (wall 51.1s) Phase end: shop (17.7s game)  [overworld @2024.7,1359.2]
- t=204.5s (wall 51.2s) Phase start: dungeon forest  [overworld @2024.7,1359.2]
- t=225.1s (wall 56.3s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=233.3s (wall 58.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.3,47]
- t=235s (wall 58.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=237.3s (wall 59.3s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.9,80]
- t=238.6s (wall 59.7s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=238.6s (wall 59.7s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=239.5s (wall 59.9s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=240.4s (wall 60.1s) Forest Dungeon: boss defeated in 1.8s (game)  [dungeon:forest:2 @76.6,67]
- t=240.4s (wall 60.1s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @76.6,67]
- t=241s (wall 60.3s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @124.2,93]
- t=242.8s (wall 60.7s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=243.8s (wall 61s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=253.4s (wall 63.4s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @383.1,1016.8]
- t=254.4s (wall 63.6s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=255.3s (wall 63.9s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1022.8]
- t=255.3s (wall 63.9s) Phase end: dungeon forest (50.8s game)  [overworld @361.4,1022.8]
- t=255.3s (wall 63.9s) Phase start: restock after forest  [overworld @361.4,1022.8]
- t=255.3s (wall 63.9s) Phase end: restock after forest (0.0s game)  [overworld @361.4,1022.8]
- t=255.3s (wall 63.9s) Phase start: dungeon fire  [overworld @361.4,1022.8]
- t=302.5s (wall 75.7s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=303.9s (wall 76s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:0 @105.3,84.7]
- t=307.3s (wall 76.8s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179.5,47.7]
- t=309s (wall 77.3s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=327.1s (wall 81.8s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199,56.4]
- t=328.5s (wall 82.2s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=328.5s (wall 82.2s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=329.9s (wall 82.5s) Fire Dungeon: boss defeated in 1.4s (game)  [dungeon:fire:2 @55.5,68.2]
- t=329.9s (wall 82.5s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @55.5,68.2]
- t=330.4s (wall 82.6s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=332.5s (wall 83.2s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=333.5s (wall 83.4s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=343.3s (wall 85.9s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.6,414.3]
- t=343.3s (wall 85.9s) Phase end: dungeon fire (88.0s game)  [overworld @3433.6,414.3]
- t=343.3s (wall 85.9s) Phase start: restock after fire  [overworld @3433.6,414.3]
- t=343.3s (wall 85.9s) Phase end: restock after fire (0.0s game)  [overworld @3433.6,414.3]
- t=343.3s (wall 85.9s) Phase start: dungeon water  [overworld @3433.6,414.3]
- t=349.5s (wall 87.4s) Level up -> Lv 12, chose +1 Attack  [overworld @3451,800.9]
- t=390.1s (wall 97.6s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.5,2087.8]
- t=394.2s (wall 98.6s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=404s (wall 101s) Water Dungeon: got the Small Key  [dungeon:water:0 @180.1,47.2]
- t=405.8s (wall 101.5s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=408.6s (wall 102.2s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:1 @171.9,46]
- t=413.3s (wall 103.3s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199,105.6]
- t=414.5s (wall 103.7s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=414.5s (wall 103.7s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=415.8s (wall 104s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=415.8s (wall 104s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=416.8s (wall 104.2s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=418.6s (wall 104.7s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=419.6s (wall 104.9s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=429.2s (wall 107.3s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.2,2385.4]
- t=429.2s (wall 107.3s) Phase end: dungeon water (85.9s game)  [overworld @793.2,2385.4]
- t=429.2s (wall 107.3s) Phase start: restock after water  [overworld @793.2,2385.4]
- t=429.2s (wall 107.3s) Phase end: restock after water (0.0s game)  [overworld @793.2,2385.4]
- t=429.3s (wall 107.3s) Phase start: dungeon shadow  [overworld @793.2,2385.4]
- t=444.4s (wall 111.1s) Level up -> Lv 14, chose +1 Attack  [overworld @727.3,1000.5]
- t=454.2s (wall 113.6s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=460.6s (wall 115.2s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.5,48.1]
- t=462.3s (wall 115.6s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=465.5s (wall 116.4s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @155.2,78.8]
- t=467.2s (wall 116.8s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=467.2s (wall 116.8s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=467.7s (wall 116.9s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=468.1s (wall 117s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=468.1s (wall 117s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=469.1s (wall 117.3s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=470.9s (wall 117.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=471.9s (wall 118s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=481.5s (wall 120.4s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @872.8,318.7]
- t=481.5s (wall 120.4s) Phase end: dungeon shadow (52.3s game)  [overworld @872.8,318.7]
- t=481.5s (wall 120.4s) Phase start: restock after shadow  [overworld @872.8,318.7]
- t=481.5s (wall 120.4s) Phase end: restock after shadow (0.0s game)  [overworld @872.8,318.7]
- t=481.5s (wall 120.4s) Phase start: castle  [overworld @872.8,318.7]
- t=497.4s (wall 124.4s) Entered the castle  [castle:0 @32,80]
- t=498.2s (wall 124.6s) Level up -> Lv 16, chose +1 Attack  [castle:0 @64.7,70.7]
- t=501.6s (wall 125.4s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=505.1s (wall 126.3s) Final boss defeated in 3.5s (game)  [castle:1 @204.4,150]
- t=510.3s (wall 127.6s) VICTORY screen reached  [castle:1 @204.4,150]
- t=510.3s (wall 127.6s) QA agent finished: victory  [castle:1 @204.4,150]

## Agent-side notes (not game bugs)

- t=134.3s no damage dealt to beetle for 14s; giving up (COMBAT / farm beetle (gold 59/80))
- t=324s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 128.9s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
