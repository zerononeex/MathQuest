# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T01:42:19.582Z | wall 151s | game time 598.8s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 129 milestones, 1 agent-side notes

## Progress

- Level 20, hearts 3/9, attack 18, gold 123, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @166.7s), Boomerang (50g @166.8s)
- Kills 84, pots/bushes 55, sword swings 212, ranged shots 131, math solved 34 (locks 10), revives 12, level-ups 19
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 68.1 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 98.1 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 92.9 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 66.2 |

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
- t=7.6s (wall 1.9s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1286.7]
- t=8.4s (wall 2.1s) Dialogue dismissed after 3 presses  [overworld @1991.5,1286.7]
- t=8.6s (wall 2.2s) Phase end: npc dialogue (2.5s game)  [overworld @1991.5,1303.3]
- t=8.6s (wall 2.2s) Phase start: farm gold/XP  [overworld @1991.5,1303.3]
- t=18s (wall 4.6s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2117,1562.4]
- t=35.9s (wall 9s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1817.2,1621.8]
- t=60.1s (wall 15.1s) Level up -> Lv 4, chose +1 Attack  [overworld @1373.8,1672.6]
- t=69s (wall 17.3s) Level up -> Lv 5, chose +1 Attack  [overworld @1608.9,1944.5]
- t=97.9s (wall 24.5s) Level up -> Lv 6, chose +1 Attack  [overworld @2425.8,1396.7]
- t=107s (wall 26.8s) Level up -> Lv 7, chose +1 Attack  [overworld @2585.9,1651.6]
- t=124.5s (wall 31.2s) Level up -> Lv 8, chose +1 Attack  [overworld @2111.1,2082]
- t=146.9s (wall 36.8s) Farming done: gold 0 -> 80, level 8, kills 31, pots 46  [overworld @2727.1,2212.9]
- t=146.9s (wall 36.8s) Phase end: farm gold/XP (138.3s game)  [overworld @2727.1,2212.9]
- t=146.9s (wall 36.8s) Phase start: shop  [overworld @2727.1,2212.9]
- t=162.4s (wall 40.6s) Level up -> Lv 9, chose +1 Attack  [overworld @2146.5,1480.5]
- t=166.1s (wall 41.6s) Entered Shop with 86 gold  [interior:Shop @120,140.8]
- t=166.4s (wall 41.7s) Shop opened  [interior:Shop @120,107.5]
- t=166.7s (wall 41.7s) Bought Sharp Sword for 30g (gold 86 -> 56)  [interior:Shop @120,107.5]
- t=166.8s (wall 41.8s) Bought Boomerang for 50g (gold 56 -> 6)  [interior:Shop @120,107.5]
- t=168.1s (wall 42.1s) Left shop (gold 6)  [overworld @2025.5,1359.1]
- t=168.1s (wall 42.1s) Phase end: shop (21.3s game)  [overworld @2025.5,1359.1]
- t=168.1s (wall 42.1s) Phase start: dungeon forest  [overworld @2025.5,1359.1]
- t=189.3s (wall 47.4s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=198s (wall 49.5s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @179.4,48.5]
- t=199.6s (wall 50s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=202.1s (wall 50.6s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,81.1]
- t=203.4s (wall 50.9s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=203.4s (wall 50.9s) Forest Dungeon: boss fight vs grovak (hp 98)  [dungeon:forest:2 @32,80]
- t=222.8s (wall 55.8s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @72,80]
- t=223.2s (wall 55.9s) Forest Dungeon: boss defeated in 19.8s (game)  [dungeon:forest:2 @72,80]
- t=223.2s (wall 55.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @72,80]
- t=223.4s (wall 55.9s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @76.7,91.4]
- t=225.7s (wall 56.5s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=226.7s (wall 56.7s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=236.3s (wall 59.1s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.1,1023.4]
- t=237.1s (wall 59.3s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=238s (wall 59.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.1,1022.7]
- t=238s (wall 59.5s) Phase end: dungeon forest (69.8s game)  [overworld @361.1,1022.7]
- t=238s (wall 59.6s) Phase start: restock after forest  [overworld @361.1,1022.7]
- t=238s (wall 59.6s) Phase end: restock after forest (0.0s game)  [overworld @361.1,1022.7]
- t=238s (wall 59.6s) Phase start: dungeon fire  [overworld @361.1,1022.7]
- t=286.2s (wall 71.6s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=286.8s (wall 71.7s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=291s (wall 72.8s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179,48.2]
- t=292.7s (wall 73.2s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=310.8s (wall 77.7s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.6,58]
- t=312.1s (wall 78.1s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=312.1s (wall 78.1s) Fire Dungeon: boss fight vs cindermaw (hp 144)  [dungeon:fire:2 @32,80]
- t=322.3s (wall 80.6s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @49.3,80]
- t=322.7s (wall 80.7s) Fire Dungeon: boss defeated in 10.6s (game)  [dungeon:fire:2 @49.3,80]
- t=322.7s (wall 80.7s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @49.3,80]
- t=322.8s (wall 80.8s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @54,91.4]
- t=325.4s (wall 81.4s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=326.3s (wall 81.6s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=336.1s (wall 84.1s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.8,415.7]
- t=336.1s (wall 84.1s) Phase end: dungeon fire (98.1s game)  [overworld @3433.8,415.7]
- t=336.2s (wall 84.1s) Phase start: restock after fire  [overworld @3433.8,415.7]
- t=336.2s (wall 84.1s) Phase end: restock after fire (0.0s game)  [overworld @3433.8,415.7]
- t=336.2s (wall 84.1s) Phase start: dungeon water  [overworld @3433.8,415.7]
- t=383.3s (wall 95.9s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.7,2088.2]
- t=387.4s (wall 96.9s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=391.3s (wall 97.9s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @80.6,74.4]
- t=397.1s (wall 99.3s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.3,48.5]
- t=398.7s (wall 99.7s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=406.2s (wall 101.6s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.5,104.4]
- t=407.4s (wall 101.9s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=407.4s (wall 101.9s) Water Dungeon: boss fight vs voltuga (hp 198)  [dungeon:water:2 @32,80]
- t=415.6s (wall 103.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @65.3,80]
- t=416s (wall 104s) Water Dungeon: boss defeated in 8.6s (game)  [dungeon:water:2 @65.3,80]
- t=416s (wall 104s) Water Dungeon: got the Boss Key  [dungeon:water:2 @65.3,80]
- t=416.1s (wall 104.1s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @65.3,90]
- t=418.5s (wall 104.7s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=419.5s (wall 104.9s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=429.1s (wall 107.3s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.7,2384.2]
- t=429.1s (wall 107.3s) Phase end: dungeon water (92.9s game)  [overworld @792.7,2384.2]
- t=429.1s (wall 107.3s) Phase start: restock after water  [overworld @792.7,2384.2]
- t=429.1s (wall 107.3s) Phase end: restock after water (0.0s game)  [overworld @792.7,2384.2]
- t=429.1s (wall 107.3s) Phase start: dungeon shadow  [overworld @792.7,2384.2]
- t=453.3s (wall 113.4s) Level up -> Lv 15, chose +1 Attack  [overworld @887.1,464.6]
- t=456.1s (wall 114.1s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=464.4s (wall 116.2s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.1,48.2]
- t=466.1s (wall 116.6s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=468.9s (wall 117.3s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:1 @133,72.6]
- t=470.7s (wall 117.7s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @121.1,123.8]
- t=472.9s (wall 118.3s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=472.9s (wall 118.3s) Shadow Dungeon: boss fight vs puffling (hp 280)  [dungeon:shadow:2 @32,80]
- t=481.8s (wall 120.5s) Shadow Dungeon: boss defeated in 8.9s (game)  [dungeon:shadow:2 @61.6,89.1]
- t=481.8s (wall 120.5s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @61.6,89.1]
- t=482s (wall 120.5s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @54.5,99.5]
- t=484.7s (wall 121.2s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=485.7s (wall 121.5s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=495.3s (wall 123.9s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.8,318.9]
- t=495.3s (wall 123.9s) Phase end: dungeon shadow (66.2s game)  [overworld @873.8,318.9]
- t=495.3s (wall 123.9s) Phase start: restock after shadow  [overworld @873.8,318.9]
- t=495.3s (wall 123.9s) Phase end: restock after shadow (0.0s game)  [overworld @873.8,318.9]
- t=495.3s (wall 123.9s) Phase start: castle  [overworld @873.8,318.9]
- t=497s (wall 124.3s) Level up -> Lv 17, chose +1 Attack  [overworld @1039.7,322.2]
- t=511.2s (wall 127.9s) Entered the castle  [castle:0 @32,80]
- t=517.8s (wall 129.5s) Castle Gate Hall: solved the guards puzzle  [castle:0 @128.1,89.2]
- t=518.1s (wall 129.6s) Castle Gate Hall: got a Small Key (1 held)  [castle:0 @146.4,89.2]
- t=520s (wall 130s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=521.2s (wall 130.3s) Level up -> Lv 18, chose +1 Attack  [castle:1 @51.3,116.7]
- t=530.3s (wall 132.6s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @208,42.4]
- t=532.1s (wall 133.1s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=545.2s (wall 136.3s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @214.4,135.4]
- t=546.3s (wall 136.6s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @146.1,88.8]
- t=548.2s (wall 137.1s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=548.9s (wall 137.3s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=550.6s (wall 137.7s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=552s (wall 138s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @183.1,41.4]
- t=554s (wall 138.5s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=557s (wall 139.3s) Level up -> Lv 19, chose +1 Attack  [castle:4 @67,54.5]
- t=569.1s (wall 142.3s) Level up -> Lv 20, chose +1 Attack  [castle:4 @149.9,40.3]
- t=569.9s (wall 142.5s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @147.5,37.9]
- t=570.5s (wall 142.7s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @145.9,87.9]
- t=572.4s (wall 143.1s) Castle: entered Antechamber  [castle:5 @32,80]
- t=579.3s (wall 144.9s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=580.8s (wall 145.2s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=580.8s (wall 145.3s) Final boss fight vs Malrek (hp 612, Lv 24, hits for 2)  [castle:6 @32,112]
- t=593.6s (wall 148.4s) Final boss defeated in 12.7s (game)  [castle:6 @161.7,125.7]
- t=598.8s (wall 149.7s) VICTORY screen reached  [castle:6 @161.7,125.7]
- t=598.8s (wall 149.8s) QA agent finished: victory  [castle:6 @161.7,125.7]

## Agent-side notes (not game bugs)

- t=307.6s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 151s, timeScale x4, 6 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
