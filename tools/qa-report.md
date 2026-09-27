# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T00:30:21.610Z | wall 120.7s | game time 481.9s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 108 milestones, 1 agent-side notes

## Progress

- Level 16, hearts 9/9, attack 14, gold 86, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @164.3s), Boomerang (50g @164.4s)
- Kills 70, pots/bushes 49, sword swings 121, ranged shots 66, math solved 35 (locks 9), revives 4, level-ups 15
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 48.9 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 96.5 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.8 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 53.4 |

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
- t=7.8s (wall 2s) Opened dialogue with Curious Kid (3 lines)  [overworld @1913.2,1343.3]
- t=8.6s (wall 2.2s) Dialogue dismissed after 3 presses  [overworld @1913.2,1343.3]
- t=8.8s (wall 2.2s) Phase end: npc dialogue (2.7s game)  [overworld @1913.2,1360]
- t=8.8s (wall 2.2s) Phase start: farm gold/XP  [overworld @1913.2,1360]
- t=18.6s (wall 4.7s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2203.7,1501.3]
- t=36.7s (wall 9.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1818.8,1664.3]
- t=70.8s (wall 17.8s) Level up -> Lv 4, chose +1 Attack  [overworld @1577.1,1903.8]
- t=82.1s (wall 20.6s) Level up -> Lv 5, chose +1 Attack  [overworld @1716.3,1929.4]
- t=109.4s (wall 27.4s) Level up -> Lv 6, chose +1 Attack  [overworld @2593.3,1368.8]
- t=118.5s (wall 29.7s) Level up -> Lv 7, chose +1 Attack  [overworld @2680.8,1806.7]
- t=144.2s (wall 36.1s) Level up -> Lv 8, chose +1 Attack  [overworld @2137.9,2282]
- t=150s (wall 37.5s) Farming done: gold 0 -> 82, level 8, kills 33, pots 40  [overworld @2241,2417.1]
- t=150s (wall 37.5s) Phase end: farm gold/XP (141.2s game)  [overworld @2241,2417.1]
- t=150s (wall 37.5s) Phase start: shop  [overworld @2241,2417.1]
- t=163.7s (wall 41s) Entered Shop with 82 gold  [interior:Shop @120,140.8]
- t=164s (wall 41s) Shop opened  [interior:Shop @120,107.5]
- t=164.3s (wall 41.1s) Bought Sharp Sword for 30g (gold 82 -> 52)  [interior:Shop @120,107.5]
- t=164.4s (wall 41.1s) Bought Boomerang for 50g (gold 52 -> 2)  [interior:Shop @120,107.5]
- t=165.7s (wall 41.5s) Left shop (gold 2)  [overworld @2024.4,1359.8]
- t=165.7s (wall 41.5s) Phase end: shop (15.7s game)  [overworld @2024.4,1359.8]
- t=165.7s (wall 41.5s) Phase start: dungeon forest  [overworld @2024.4,1359.8]
- t=186.4s (wall 46.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=186.9s (wall 46.8s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:0 @32,80]
- t=194.7s (wall 48.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @179.5,48.4]
- t=196.3s (wall 49.1s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=198.6s (wall 49.7s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.2,80.7]
- t=200s (wall 50s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=200s (wall 50s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=200.9s (wall 50.3s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=201.3s (wall 50.4s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=201.3s (wall 50.4s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=202.3s (wall 50.6s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=204.1s (wall 51.1s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=205.1s (wall 51.3s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=214.7s (wall 53.7s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @382.7,1017.4]
- t=215.7s (wall 54s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=216.6s (wall 54.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361,1023.4]
- t=216.6s (wall 54.2s) Phase end: dungeon forest (50.8s game)  [overworld @361,1023.4]
- t=216.6s (wall 54.2s) Phase start: restock after forest  [overworld @361,1023.4]
- t=216.6s (wall 54.2s) Phase end: restock after forest (0.0s game)  [overworld @361,1023.4]
- t=216.6s (wall 54.2s) Phase start: dungeon fire  [overworld @361,1023.4]
- t=272.3s (wall 68.1s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=272.8s (wall 68.2s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=277s (wall 69.3s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179.8,47.7]
- t=278.8s (wall 69.7s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=296.9s (wall 74.3s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=298.3s (wall 74.6s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=298.3s (wall 74.6s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=299s (wall 74.8s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=299.7s (wall 75s) Fire Dungeon: boss defeated in 1.4s (game)  [dungeon:fire:2 @53.8,68.2]
- t=299.7s (wall 75s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @53.8,68.2]
- t=300.2s (wall 75.1s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=302.3s (wall 75.6s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=303.3s (wall 75.9s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=313.1s (wall 78.3s) Exited Fire Dungeon to the overworld at (215,25)  [overworld @3455.5,408.6]
- t=313.1s (wall 78.3s) Phase end: dungeon fire (96.5s game)  [overworld @3455.5,408.6]
- t=313.1s (wall 78.3s) Phase start: restock after fire  [overworld @3455.5,408.6]
- t=313.1s (wall 78.3s) Phase end: restock after fire (0.0s game)  [overworld @3455.5,408.6]
- t=313.1s (wall 78.3s) Phase start: dungeon water  [overworld @3455.5,408.6]
- t=356.8s (wall 89.2s) Level up -> Lv 13, chose +1 Attack  [overworld @1015.9,1926]
- t=360.5s (wall 90.2s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.9,2087.7]
- t=364.6s (wall 91.2s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=374.5s (wall 93.7s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.5,46.9]
- t=376.3s (wall 94.1s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=384s (wall 96s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.1,105.9]
- t=385.3s (wall 96.3s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=385.3s (wall 96.3s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=386.2s (wall 96.6s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @32,80]
- t=386.6s (wall 96.7s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=386.6s (wall 96.7s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=387.5s (wall 96.9s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=389.4s (wall 97.4s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=390.4s (wall 97.6s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=400s (wall 100s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.6,2385.4]
- t=400s (wall 100s) Phase end: dungeon water (86.8s game)  [overworld @793.6,2385.4]
- t=400s (wall 100s) Phase start: restock after water  [overworld @793.6,2385.4]
- t=400s (wall 100s) Phase end: restock after water (0.0s game)  [overworld @793.6,2385.4]
- t=400s (wall 100s) Phase start: dungeon shadow  [overworld @793.6,2385.4]
- t=424.9s (wall 106.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=430.7s (wall 107.7s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.5,47.1]
- t=432.4s (wall 108.1s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=433.8s (wall 108.5s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:1 @65.6,54.8]
- t=437s (wall 109.3s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @122.5,67.7]
- t=439s (wall 109.8s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=439s (wall 109.8s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=439.9s (wall 110s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=439.9s (wall 110s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=440.9s (wall 110.3s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=442.8s (wall 110.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=443.7s (wall 111s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=453.4s (wall 113.4s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @872.7,319.8]
- t=453.4s (wall 113.4s) Phase end: dungeon shadow (53.4s game)  [overworld @872.7,319.8]
- t=453.4s (wall 113.4s) Phase start: restock after shadow  [overworld @872.7,319.8]
- t=453.4s (wall 113.4s) Phase end: restock after shadow (0.0s game)  [overworld @872.7,319.8]
- t=453.4s (wall 113.4s) Phase start: castle  [overworld @872.7,319.8]
- t=455.2s (wall 113.8s) Level up -> Lv 16, chose +1 Attack  [overworld @1041.9,321.4]
- t=469.4s (wall 117.4s) Entered the castle  [castle:0 @32,80]
- t=473.4s (wall 118.4s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=476.7s (wall 119.2s) Final boss defeated in 3.3s (game)  [castle:1 @165.5,119.2]
- t=481.9s (wall 120.5s) VICTORY screen reached  [castle:1 @165.5,119.2]
- t=481.9s (wall 120.5s) QA agent finished: victory  [castle:1 @165.5,119.2]

## Agent-side notes (not game bugs)

- t=293.7s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 120.7s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
