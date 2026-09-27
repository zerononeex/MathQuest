# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T01:47:28.339Z | wall 144.9s | game time 578.5s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 126 milestones, 1 agent-side notes

## Progress

- Level 19, hearts 3/9, attack 17, gold 124, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @152.2s), Boomerang (50g @152.3s)
- Kills 82, pots/bushes 41, sword swings 185, ranged shots 126, math solved 33 (locks 10), revives 11, level-ups 18
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 54.5 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 94.2 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 93.2 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 77.3 |

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
- t=6.7s (wall 1.7s) Opened dialogue with Curious Kid (3 lines)  [overworld @1958.2,1238.3]
- t=7.5s (wall 1.9s) Dialogue dismissed after 3 presses  [overworld @1958.2,1238.3]
- t=7.6s (wall 2s) Phase end: npc dialogue (1.6s game)  [overworld @1958.2,1255]
- t=7.7s (wall 2s) Phase start: farm gold/XP  [overworld @1958.2,1255]
- t=26.8s (wall 6.7s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2069.8,1631.3]
- t=34.9s (wall 8.8s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2199,1537.6]
- t=54.1s (wall 13.6s) Level up -> Lv 4, chose +1 Attack  [overworld @2592.1,1367.5]
- t=60.4s (wall 15.2s) Level up -> Lv 5, chose +1 Attack  [overworld @2587.5,1640]
- t=89.7s (wall 22.5s) Level up -> Lv 6, chose +1 Attack  [overworld @1764.8,1929.1]
- t=110.6s (wall 27.7s) Level up -> Lv 7, chose +1 Attack  [overworld @1678.8,1474.1]
- t=128.5s (wall 32.2s) Level up -> Lv 8, chose +1 Attack  [overworld @1065,1994.4]
- t=136.6s (wall 34.2s) Farming done: gold 0 -> 80, level 8, kills 31, pots 32  [overworld @1039.8,1640]
- t=136.6s (wall 34.2s) Phase end: farm gold/XP (129.0s game)  [overworld @1039.8,1640]
- t=136.6s (wall 34.2s) Phase start: shop  [overworld @1039.8,1640]
- t=139.5s (wall 34.9s) Level up -> Lv 9, chose +1 Attack  [overworld @1097.5,1481.1]
- t=151.6s (wall 37.9s) Entered Shop with 86 gold  [interior:Shop @120,140.8]
- t=151.9s (wall 38s) Shop opened  [interior:Shop @120,107.5]
- t=152.2s (wall 38.1s) Bought Sharp Sword for 30g (gold 86 -> 56)  [interior:Shop @120,107.5]
- t=152.3s (wall 38.1s) Bought Boomerang for 50g (gold 56 -> 6)  [interior:Shop @120,107.5]
- t=153.6s (wall 38.5s) Left shop (gold 6)  [overworld @2022.5,1359.7]
- t=153.6s (wall 38.5s) Phase end: shop (17.0s game)  [overworld @2022.5,1359.7]
- t=153.6s (wall 38.5s) Phase start: dungeon forest  [overworld @2022.5,1359.7]
- t=175.5s (wall 43.9s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=183.8s (wall 46s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.2,46.7]
- t=185.5s (wall 46.4s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=187.9s (wall 47s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,80]
- t=189.3s (wall 47.4s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=189.3s (wall 47.4s) Forest Dungeon: boss fight vs grovak (hp 98)  [dungeon:forest:2 @32,80]
- t=194.5s (wall 48.7s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @51,80]
- t=194.9s (wall 48.8s) Forest Dungeon: boss defeated in 5.6s (game)  [dungeon:forest:2 @53.4,77.6]
- t=194.9s (wall 48.8s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @53.4,77.6]
- t=195.1s (wall 48.8s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @65.1,91.1]
- t=197.5s (wall 49.4s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=198.5s (wall 49.7s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=208.1s (wall 52.1s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @383.1,1016.7]
- t=209.1s (wall 52.3s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=210s (wall 52.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1022.7]
- t=210s (wall 52.5s) Phase end: dungeon forest (56.3s game)  [overworld @361.4,1022.7]
- t=210s (wall 52.5s) Phase start: restock after forest  [overworld @361.4,1022.7]
- t=210s (wall 52.5s) Phase end: restock after forest (0.0s game)  [overworld @361.4,1022.7]
- t=210s (wall 52.5s) Phase start: dungeon fire  [overworld @361.4,1022.7]
- t=256.2s (wall 64.1s) Level up -> Lv 11, chose +1 Attack  [overworld @3482.9,396.2]
- t=257.6s (wall 64.5s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=262.4s (wall 65.7s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.6,48.9]
- t=264s (wall 66s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=282.1s (wall 70.6s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=283.5s (wall 70.9s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=283.5s (wall 70.9s) Fire Dungeon: boss fight vs cindermaw (hp 144)  [dungeon:fire:2 @32,80]
- t=290.3s (wall 72.6s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @47.3,80]
- t=290.7s (wall 72.7s) Fire Dungeon: boss defeated in 7.2s (game)  [dungeon:fire:2 @48.5,81.2]
- t=290.7s (wall 72.7s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @48.5,81.2]
- t=293.4s (wall 73.4s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=294.3s (wall 73.6s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=304.1s (wall 76.1s) Exited Fire Dungeon to the overworld at (215,25)  [overworld @3454.6,407.2]
- t=304.1s (wall 76.1s) Phase end: dungeon fire (94.2s game)  [overworld @3454.6,407.2]
- t=304.2s (wall 76.1s) Phase start: restock after fire  [overworld @3454.6,407.2]
- t=304.2s (wall 76.1s) Phase end: restock after fire (0.0s game)  [overworld @3454.6,407.2]
- t=304.2s (wall 76.1s) Phase start: dungeon water  [overworld @3454.6,407.2]
- t=350s (wall 87.6s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.9,2087.6]
- t=354.2s (wall 88.6s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=359.4s (wall 89.9s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @141.2,106.8]
- t=363.7s (wall 91s) Water Dungeon: got the Small Key  [dungeon:water:0 @178,48.4]
- t=365.3s (wall 91.4s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=373s (wall 93.3s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.3,104.7]
- t=374.2s (wall 93.6s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=374.2s (wall 93.6s) Water Dungeon: boss fight vs voltuga (hp 198)  [dungeon:water:2 @32,80]
- t=382.6s (wall 95.7s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @112.8,121]
- t=383.3s (wall 95.9s) Water Dungeon: boss defeated in 9.1s (game)  [dungeon:water:2 @80.7,113.9]
- t=383.3s (wall 95.9s) Water Dungeon: got the Boss Key  [dungeon:water:2 @80.7,113.9]
- t=383.7s (wall 96s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @49.5,135.1]
- t=386.7s (wall 96.7s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=387.7s (wall 97s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=397.3s (wall 99.4s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.6,2385.3]
- t=397.3s (wall 99.4s) Phase end: dungeon water (93.2s game)  [overworld @793.6,2385.3]
- t=397.4s (wall 99.4s) Phase start: restock after water  [overworld @793.6,2385.3]
- t=397.4s (wall 99.4s) Phase end: restock after water (0.0s game)  [overworld @793.6,2385.3]
- t=397.4s (wall 99.4s) Phase start: dungeon shadow  [overworld @793.6,2385.3]
- t=424.5s (wall 106.2s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=425.5s (wall 106.4s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:0 @54.5,75]
- t=430.7s (wall 107.7s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.1,48.9]
- t=432.3s (wall 108.1s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=436.9s (wall 109.3s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @108.9,108.5]
- t=439s (wall 109.8s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=439s (wall 109.8s) Shadow Dungeon: boss fight vs puffling (hp 260)  [dungeon:shadow:2 @32,80]
- t=452.4s (wall 113.1s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:2 @43.7,82]
- t=461.4s (wall 115.4s) Shadow Dungeon: boss defeated in 22.4s (game)  [dungeon:shadow:2 @43.7,84]
- t=461.4s (wall 115.4s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @43.7,84]
- t=464.1s (wall 116s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=465s (wall 116.3s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=474.7s (wall 118.7s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @874,319.6]
- t=474.7s (wall 118.7s) Phase end: dungeon shadow (77.3s game)  [overworld @874,319.6]
- t=474.7s (wall 118.7s) Phase start: restock after shadow  [overworld @874,319.6]
- t=474.7s (wall 118.7s) Phase end: restock after shadow (0.0s game)  [overworld @874,319.6]
- t=474.7s (wall 118.7s) Phase start: castle  [overworld @874,319.6]
- t=482.8s (wall 120.7s) Level up -> Lv 17, chose +1 Attack  [overworld @1430.8,258.3]
- t=490.6s (wall 122.7s) Entered the castle  [castle:0 @32,80]
- t=498.1s (wall 124.6s) Castle Gate Hall: solved the guards puzzle  [castle:0 @215.2,87.1]
- t=498.8s (wall 124.7s) Castle Gate Hall: got a Small Key (1 held)  [castle:0 @146.8,87.1]
- t=500.7s (wall 125.2s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=504.8s (wall 126.2s) Level up -> Lv 18, chose +1 Attack  [castle:1 @143.7,136]
- t=510.4s (wall 127.6s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @208.2,42.7]
- t=512.2s (wall 128.1s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=525.8s (wall 131.5s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @215.5,136.5]
- t=526.9s (wall 131.8s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @146,88.7]
- t=528.8s (wall 132.2s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=529.5s (wall 132.4s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=531.2s (wall 132.8s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=532.6s (wall 133.2s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @183,41.2]
- t=534.6s (wall 133.7s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=540.1s (wall 135.1s) Level up -> Lv 19, chose +1 Attack  [castle:4 @167.9,111.4]
- t=548s (wall 137s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @176.7,83.7]
- t=548.4s (wall 137.1s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @146.7,87]
- t=550.3s (wall 137.6s) Castle: entered Antechamber  [castle:5 @32,80]
- t=557.2s (wall 139.3s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=558.7s (wall 139.7s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=558.7s (wall 139.7s) Final boss fight vs Malrek (hp 612, Lv 24, hits for 2)  [castle:6 @32,112]
- t=573.3s (wall 143.3s) Final boss defeated in 14.5s (game)  [castle:6 @47.2,96.6]
- t=578.5s (wall 144.7s) VICTORY screen reached  [castle:6 @47.2,96.6]
- t=578.5s (wall 144.7s) QA agent finished: victory  [castle:6 @47.2,96.6]

## Agent-side notes (not game bugs)

- t=279s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 144.9s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
