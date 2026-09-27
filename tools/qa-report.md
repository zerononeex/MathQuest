# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T02:20:26.973Z | wall 163s | game time 648.5s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 126 milestones, 1 agent-side notes

## Progress

- Level 19, hearts 3/9, attack 17, gold 133, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @159.6s), Boomerang (50g @159.7s)
- Kills 79, pots/bushes 48, sword swings 327, ranged shots 134, math solved 50 (locks 10), revives 26, level-ups 18
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 67.6 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 112.3 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 102.1 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 87 |

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
- t=6.9s (wall 1.8s) Opened dialogue with Curious Kid (3 lines)  [overworld @1958.2,1265]
- t=7.7s (wall 2s) Dialogue dismissed after 3 presses  [overworld @1958.2,1265]
- t=7.9s (wall 2s) Phase end: npc dialogue (1.8s game)  [overworld @1958.2,1281.7]
- t=7.9s (wall 2s) Phase start: farm gold/XP  [overworld @1958.2,1281.7]
- t=18.6s (wall 4.7s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2118.3,1528.8]
- t=36s (wall 9.1s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2133.8,1683.4]
- t=53.4s (wall 13.4s) Level up -> Lv 4, chose +1 Attack  [overworld @1654.1,1934.7]
- t=66.6s (wall 16.7s) Level up -> Lv 5, chose +1 Attack  [overworld @1674.4,1487.1]
- t=118.5s (wall 29.7s) Level up -> Lv 6, chose +1 Attack  [overworld @2378.6,1369.5]
- t=125.7s (wall 31.5s) Level up -> Lv 7, chose +1 Attack  [overworld @2635.3,1465.1]
- t=139.8s (wall 35s) Level up -> Lv 8, chose +1 Attack  [overworld @2425,2026.3]
- t=146.3s (wall 36.6s) Farming done: gold 0 -> 80, level 8, kills 28, pots 39  [overworld @2379.6,2184.6]
- t=146.3s (wall 36.6s) Phase end: farm gold/XP (138.4s game)  [overworld @2379.6,2184.6]
- t=146.4s (wall 36.6s) Phase start: shop  [overworld @2379.6,2184.6]
- t=159s (wall 39.8s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=159.3s (wall 39.9s) Shop opened  [interior:Shop @120,107.5]
- t=159.6s (wall 40s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=159.7s (wall 40s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=161s (wall 40.3s) Left shop (gold 0)  [overworld @2024.6,1359]
- t=161s (wall 40.3s) Phase end: shop (14.7s game)  [overworld @2024.6,1359]
- t=161s (wall 40.3s) Phase start: dungeon forest  [overworld @2024.6,1359]
- t=182.1s (wall 45.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=190.4s (wall 47.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.7,47.2]
- t=192.2s (wall 48.1s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=194.4s (wall 48.7s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @178.2,81.4]
- t=195.8s (wall 49s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=195.8s (wall 49s) Forest Dungeon: boss fight vs grovak (hp 168)  [dungeon:forest:2 @32,80]
- t=215.2s (wall 53.9s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @66.7,80]
- t=215.6s (wall 54s) Forest Dungeon: boss defeated in 19.8s (game)  [dungeon:forest:2 @67.8,78.8]
- t=215.6s (wall 54s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @67.8,78.8]
- t=215.7s (wall 54s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @71.4,90.7]
- t=218.1s (wall 54.6s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=219s (wall 54.8s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=228.7s (wall 57.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.8,1023.2]
- t=229.5s (wall 57.4s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=230.4s (wall 57.7s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.8,1022.5]
- t=230.4s (wall 57.7s) Phase end: dungeon forest (69.3s game)  [overworld @361.8,1022.5]
- t=230.4s (wall 57.7s) Phase start: restock after forest  [overworld @361.8,1022.5]
- t=230.4s (wall 57.7s) Phase end: restock after forest (0.0s game)  [overworld @361.8,1022.5]
- t=230.4s (wall 57.7s) Phase start: dungeon fire  [overworld @361.8,1022.5]
- t=249.8s (wall 62.5s) Level up -> Lv 10, chose +1 Attack  [overworld @1799.4,1315.4]
- t=278.9s (wall 69.8s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=285.1s (wall 71.3s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180.2,46.8]
- t=286.8s (wall 71.8s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=304.9s (wall 76.3s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199,56.4]
- t=306.3s (wall 76.6s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=306.3s (wall 76.6s) Fire Dungeon: boss fight vs cindermaw (hp 256)  [dungeon:fire:2 @32,80]
- t=329s (wall 82.3s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @92,80]
- t=329.4s (wall 82.4s) Fire Dungeon: boss defeated in 23.1s (game)  [dungeon:fire:2 @92,80]
- t=329.4s (wall 82.4s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @92,80]
- t=329.5s (wall 82.4s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @94.4,90.7]
- t=331.6s (wall 83s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=332.6s (wall 83.2s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=342.7s (wall 85.7s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.2,415.3]
- t=342.7s (wall 85.7s) Phase end: dungeon fire (112.3s game)  [overworld @3433.2,415.3]
- t=342.8s (wall 85.8s) Phase start: restock after fire  [overworld @3433.2,415.3]
- t=342.8s (wall 85.8s) Phase end: restock after fire (0.0s game)  [overworld @3433.2,415.3]
- t=342.8s (wall 85.8s) Phase start: dungeon water  [overworld @3433.2,415.3]
- t=358.9s (wall 89.8s) Level up -> Lv 12, chose +1 Attack  [overworld @2967.1,1203.3]
- t=389.7s (wall 97.5s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.1,2087.6]
- t=393.8s (wall 98.5s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=403.3s (wall 100.9s) Water Dungeon: got the Small Key  [dungeon:water:0 @180.8,47.3]
- t=405s (wall 101.3s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=405.6s (wall 101.5s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:1 @59.1,107.1]
- t=412.5s (wall 103.2s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=413.8s (wall 103.5s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=413.8s (wall 103.5s) Water Dungeon: boss fight vs voltuga (hp 396)  [dungeon:water:2 @32,80]
- t=431.5s (wall 107.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @220.1,87.9]
- t=432.3s (wall 108.1s) Water Dungeon: boss defeated in 18.6s (game)  [dungeon:water:2 @217.8,50.5]
- t=432.3s (wall 108.1s) Water Dungeon: got the Boss Key  [dungeon:water:2 @217.8,50.5]
- t=433s (wall 108.3s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @216.6,120.1]
- t=434.2s (wall 108.6s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=435.2s (wall 108.9s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=444.8s (wall 111.3s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.8,2385.3]
- t=444.8s (wall 111.3s) Phase end: dungeon water (102.1s game)  [overworld @793.8,2385.3]
- t=444.8s (wall 111.3s) Phase start: restock after water  [overworld @793.8,2385.3]
- t=444.8s (wall 111.3s) Phase end: restock after water (0.0s game)  [overworld @793.8,2385.3]
- t=444.9s (wall 111.3s) Phase start: dungeon shadow  [overworld @793.8,2385.3]
- t=471.8s (wall 118s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=473.7s (wall 118.5s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:0 @97.9,75.5]
- t=477.4s (wall 119.4s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.1,48.7]
- t=479s (wall 119.8s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=483.1s (wall 120.8s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @114.9,68.9]
- t=485.2s (wall 121.4s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=485.2s (wall 121.4s) Shadow Dungeon: boss fight vs puffling (hp 520)  [dungeon:shadow:2 @32,80]
- t=503.7s (wall 126s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:2 @59.3,77.2]
- t=518.6s (wall 129.7s) Shadow Dungeon: boss defeated in 33.4s (game)  [dungeon:shadow:2 @53.6,79.2]
- t=518.6s (wall 129.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @53.6,79.2]
- t=521.3s (wall 130.4s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=522.3s (wall 130.6s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=531.9s (wall 133s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.4,318.4]
- t=531.9s (wall 133s) Phase end: dungeon shadow (87.0s game)  [overworld @873.4,318.4]
- t=531.9s (wall 133s) Phase start: restock after shadow  [overworld @873.4,318.4]
- t=531.9s (wall 133s) Phase end: restock after shadow (0.0s game)  [overworld @873.4,318.4]
- t=531.9s (wall 133s) Phase start: castle  [overworld @873.4,318.4]
- t=540s (wall 135.1s) Level up -> Lv 17, chose +1 Attack  [overworld @1430.7,260.4]
- t=547.9s (wall 137s) Entered the castle  [castle:0 @32,80]
- t=555.9s (wall 139s) Castle Gate Hall: solved the guards puzzle  [castle:0 @183.7,75]
- t=557.6s (wall 139.5s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=561.6s (wall 140.5s) Level up -> Lv 18, chose +1 Attack  [castle:1 @144,135.2]
- t=567.2s (wall 141.9s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @208.2,42.6]
- t=568.9s (wall 142.3s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=581.9s (wall 145.5s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @215.5,135.9]
- t=583.1s (wall 145.8s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @145.5,89.2]
- t=585s (wall 146.3s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=585.6s (wall 146.5s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=587.3s (wall 146.9s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=588.7s (wall 147.2s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @183.1,41.7]
- t=590.7s (wall 147.7s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=596.1s (wall 149.1s) Level up -> Lv 19, chose +1 Attack  [castle:4 @163.2,108.9]
- t=605.5s (wall 151.4s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @160.1,96.5]
- t=605.8s (wall 151.5s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @145.6,88.6]
- t=607.7s (wall 152s) Castle: entered Antechamber  [castle:5 @32,80]
- t=614.6s (wall 153.7s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=616.2s (wall 154.1s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=616.2s (wall 154.1s) Final boss fight vs Malrek (hp 1088, Lv 22, hits for 2)  [castle:6 @32,112]
- t=643.2s (wall 160.9s) Final boss defeated in 27.0s (game)  [castle:6 @101.1,180.6]
- t=648.5s (wall 162.2s) VICTORY screen reached  [castle:6 @101.1,180.6]
- t=648.5s (wall 162.2s) QA agent finished: victory  [castle:6 @101.1,180.6]

## Agent-side notes (not game bugs)

- t=301.8s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 163s, timeScale x4, 6 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
