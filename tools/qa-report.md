# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T00:49:19.902Z | wall 114.6s | game time 451.1s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 9/9, attack 13, gold 67, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @136.8s), Boomerang (50g @137s)
- Kills 59, pots/bushes 48, sword swings 92, ranged shots 61, math solved 19 (locks 9), revives 1, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 53.9 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 87.9 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 84.7 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 55.3 |

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
- t=7.5s (wall 1.9s) Opened dialogue with Curious Kid (3 lines)  [overworld @1958.2,1321.7]
- t=8.3s (wall 2.1s) Dialogue dismissed after 3 presses  [overworld @1958.2,1321.7]
- t=8.5s (wall 2.2s) Phase end: npc dialogue (2.4s game)  [overworld @1958.2,1338.3]
- t=8.5s (wall 2.2s) Phase start: farm gold/XP  [overworld @1958.2,1338.3]
- t=21.2s (wall 5.3s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1851.8,1681.7]
- t=39.4s (wall 9.9s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1580.3,1905.6]
- t=47.9s (wall 12s) Level up -> Lv 4, chose +1 Attack  [overworld @1725.2,1927.2]
- t=62.5s (wall 15.7s) Level up -> Lv 5, chose +1 Attack  [overworld @2183.1,1503.8]
- t=76.7s (wall 19.2s) Level up -> Lv 6, chose +1 Attack  [overworld @2581.4,1377]
- t=88.1s (wall 22.1s) Level up -> Lv 7, chose +1 Attack  [overworld @2618,1940.9]
- t=121.9s (wall 30.5s) Level up -> Lv 8, chose +1 Attack  [overworld @2421.3,2261.2]
- t=122.3s (wall 30.6s) Farming done: gold 0 -> 80, level 8, kills 28, pots 39  [overworld @2421.3,2261.2]
- t=122.3s (wall 30.6s) Phase end: farm gold/XP (113.8s game)  [overworld @2421.3,2261.2]
- t=122.3s (wall 30.6s) Phase start: shop  [overworld @2421.3,2261.2]
- t=136.2s (wall 34.1s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=136.6s (wall 34.2s) Shop opened  [interior:Shop @120,107.5]
- t=136.8s (wall 34.2s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=137s (wall 34.3s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=138.3s (wall 34.6s) Left shop (gold 0)  [overworld @2024.6,1358.9]
- t=138.3s (wall 34.6s) Phase end: shop (15.9s game)  [overworld @2024.6,1358.9]
- t=138.3s (wall 34.6s) Phase start: dungeon forest  [overworld @2024.6,1358.9]
- t=158.9s (wall 39.8s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=172.2s (wall 43.1s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.3,48.3]
- t=173.9s (wall 43.5s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=176.1s (wall 44.1s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=177.4s (wall 44.4s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=177.4s (wall 44.4s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=178.3s (wall 44.6s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=178.7s (wall 44.7s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=178.7s (wall 44.7s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=179.7s (wall 45s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=181.5s (wall 45.4s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=182.5s (wall 45.7s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=192.1s (wall 48.1s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @383,1016.5]
- t=193.1s (wall 48.3s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=194s (wall 48.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.3,1022.5]
- t=194s (wall 48.5s) Phase end: dungeon forest (55.7s game)  [overworld @361.3,1022.5]
- t=194s (wall 48.5s) Phase start: restock after forest  [overworld @361.3,1022.5]
- t=194s (wall 48.5s) Phase end: restock after forest (0.0s game)  [overworld @361.3,1022.5]
- t=194s (wall 48.6s) Phase start: dungeon fire  [overworld @361.3,1022.5]
- t=241.3s (wall 60.4s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=245.9s (wall 61.5s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180,47.2]
- t=247.7s (wall 62s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=248.2s (wall 62.1s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:1 @76.3,108.3]
- t=265.8s (wall 66.5s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199,56.4]
- t=267.2s (wall 66.8s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=267.2s (wall 66.8s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=267.9s (wall 67s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=268.6s (wall 67.2s) Fire Dungeon: boss defeated in 1.4s (game)  [dungeon:fire:2 @55.5,68.2]
- t=268.6s (wall 67.2s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @55.5,68.2]
- t=269.1s (wall 67.3s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=271.2s (wall 67.8s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=272.2s (wall 68.1s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=282s (wall 70.5s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433,414.5]
- t=282s (wall 70.5s) Phase end: dungeon fire (87.9s game)  [overworld @3433,414.5]
- t=282s (wall 70.5s) Phase start: restock after fire  [overworld @3433,414.5]
- t=282s (wall 70.5s) Phase end: restock after fire (0.0s game)  [overworld @3433,414.5]
- t=282s (wall 70.5s) Phase start: dungeon water  [overworld @3433,414.5]
- t=327.4s (wall 81.9s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.1,2087.7]
- t=331.5s (wall 82.9s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=341.3s (wall 85.4s) Water Dungeon: got the Small Key  [dungeon:water:0 @180.6,47]
- t=343.1s (wall 85.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=350.7s (wall 87.7s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.8,105.9]
- t=351.9s (wall 88s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=351.9s (wall 88s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=352.8s (wall 88.2s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:2 @32,80]
- t=353.7s (wall 88.5s) Water Dungeon: boss defeated in 1.8s (game)  [dungeon:water:2 @76.6,67]
- t=353.7s (wall 88.5s) Water Dungeon: got the Boss Key  [dungeon:water:2 @76.6,67]
- t=354.3s (wall 88.6s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @124.2,93]
- t=356.1s (wall 89.1s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=357.1s (wall 89.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=366.7s (wall 91.7s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.7,2385.4]
- t=366.7s (wall 91.7s) Phase end: dungeon water (84.7s game)  [overworld @793.7,2385.4]
- t=366.8s (wall 91.7s) Phase start: restock after water  [overworld @793.7,2385.4]
- t=366.8s (wall 91.7s) Phase end: restock after water (0.0s game)  [overworld @793.7,2385.4]
- t=366.8s (wall 91.7s) Phase start: dungeon shadow  [overworld @793.7,2385.4]
- t=391.7s (wall 98s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=391.8s (wall 98s) Level up -> Lv 13, chose +1 Attack  [dungeon:shadow:0 @45.1,72.9]
- t=400.4s (wall 100.1s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.1,47.9]
- t=402.1s (wall 100.6s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=405.4s (wall 101.4s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @125.9,71.5]
- t=407.4s (wall 101.9s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=407.4s (wall 101.9s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=408.3s (wall 102.1s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=408.7s (wall 102.2s) Shadow Dungeon: boss defeated in 1.3s (game)  [dungeon:shadow:2 @32,80]
- t=408.7s (wall 102.2s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=409.6s (wall 102.5s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=411.5s (wall 102.9s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=412.5s (wall 103.2s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=422.1s (wall 105.6s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @872.6,319.6]
- t=422.1s (wall 105.6s) Phase end: dungeon shadow (55.3s game)  [overworld @872.6,319.6]
- t=422.1s (wall 105.6s) Phase start: restock after shadow  [overworld @872.6,319.6]
- t=422.1s (wall 105.6s) Phase end: restock after shadow (0.0s game)  [overworld @872.6,319.6]
- t=422.1s (wall 105.6s) Phase start: castle  [overworld @872.6,319.6]
- t=438s (wall 109.5s) Entered the castle  [castle:0 @32,80]
- t=439.8s (wall 110s) Level up -> Lv 15, chose +1 Attack  [castle:0 @115.1,84.8]
- t=442.2s (wall 110.6s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=445.8s (wall 111.5s) Final boss defeated in 3.7s (game)  [castle:1 @169.1,122.7]
- t=451.1s (wall 112.8s) VICTORY screen reached  [castle:1 @169.1,122.7]
- t=451.1s (wall 112.8s) QA agent finished: victory  [castle:1 @169.1,122.7]

## Agent-side notes (not game bugs)

- t=262.6s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 114.6s, timeScale x4, 4 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
