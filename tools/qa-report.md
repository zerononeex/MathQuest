# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T02:07:52.520Z | wall 153s | game time 606.4s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 127 milestones, 2 agent-side notes

## Progress

- Level 20, hearts 3/9, attack 18, gold 119, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @158.7s), Boomerang (50g @158.8s)
- Kills 84, pots/bushes 41, sword swings 203, ranged shots 160, math solved 37 (locks 10), revives 15, level-ups 19
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 60.3 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 98 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 95.2 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 80.2 |

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
- t=8.6s (wall 2.2s) Opened dialogue with Villager (3 lines)  [overworld @1958.2,1358.3]
- t=9.5s (wall 2.4s) Dialogue dismissed after 3 presses  [overworld @1958.2,1358.3]
- t=9.6s (wall 2.4s) Phase end: npc dialogue (3.5s game)  [overworld @1958.2,1375]
- t=9.6s (wall 2.5s) Phase start: farm gold/XP  [overworld @1958.2,1375]
- t=22.9s (wall 5.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1820.9,1624.7]
- t=34.5s (wall 8.7s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2121.1,1662.3]
- t=54.7s (wall 13.7s) Level up -> Lv 4, chose +1 Attack  [overworld @2422,1285.8]
- t=66.3s (wall 16.6s) Level up -> Lv 5, chose +1 Attack  [overworld @2585.8,1642.9]
- t=95.3s (wall 23.9s) Level up -> Lv 6, chose +1 Attack  [overworld @1877.5,1927.7]
- t=111.8s (wall 28s) Level up -> Lv 7, chose +1 Attack  [overworld @1645.9,1641.7]
- t=135.3s (wall 33.9s) Level up -> Lv 8, chose +1 Attack  [overworld @1065.1,1993.3]
- t=145.2s (wall 36.3s) Level up -> Lv 9, chose +1 Attack  [overworld @1017,1518.2]
- t=145.7s (wall 36.5s) Farming done: gold 0 -> 80, level 9, kills 33, pots 32  [overworld @1017,1513.2]
- t=145.7s (wall 36.5s) Phase end: farm gold/XP (136.0s game)  [overworld @1017,1513.2]
- t=145.7s (wall 36.5s) Phase start: shop  [overworld @1017,1513.2]
- t=158.1s (wall 39.6s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=158.4s (wall 39.7s) Shop opened  [interior:Shop @120,107.5]
- t=158.7s (wall 39.7s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=158.8s (wall 39.8s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=160.1s (wall 40.1s) Left shop (gold 0)  [overworld @2022,1359.2]
- t=160.1s (wall 40.1s) Phase end: shop (14.5s game)  [overworld @2022,1359.2]
- t=160.1s (wall 40.1s) Phase start: dungeon forest  [overworld @2022,1359.2]
- t=181.2s (wall 45.4s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=189.3s (wall 47.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180,47.6]
- t=191.1s (wall 47.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=193.3s (wall 48.4s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=194.7s (wall 48.7s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=194.7s (wall 48.7s) Forest Dungeon: boss fight vs grovak (hp 98)  [dungeon:forest:2 @32,80]
- t=206.7s (wall 51.7s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @40.3,80]
- t=207.1s (wall 51.8s) Forest Dungeon: boss defeated in 12.4s (game)  [dungeon:forest:2 @40.3,80]
- t=207.1s (wall 51.8s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @40.3,80]
- t=207.2s (wall 51.9s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @39.2,91.2]
- t=209.9s (wall 52.5s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=210.9s (wall 52.8s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=220.5s (wall 55.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1023.4]
- t=221.3s (wall 55.4s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=222.2s (wall 55.6s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1022.7]
- t=222.2s (wall 55.6s) Phase end: dungeon forest (62.1s game)  [overworld @360.9,1022.7]
- t=222.2s (wall 55.6s) Phase start: restock after forest  [overworld @360.9,1022.7]
- t=222.2s (wall 55.6s) Phase end: restock after forest (0.0s game)  [overworld @360.9,1022.7]
- t=222.2s (wall 55.6s) Phase start: dungeon fire  [overworld @360.9,1022.7]
- t=269.8s (wall 67.5s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=271.4s (wall 67.9s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:0 @107.8,85.9]
- t=274.8s (wall 68.7s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.7,48.9]
- t=276.4s (wall 69.2s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=294.5s (wall 73.7s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199,56.4]
- t=295.9s (wall 74s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=295.9s (wall 74s) Fire Dungeon: boss fight vs cindermaw (hp 144)  [dungeon:fire:2 @32,80]
- t=306.4s (wall 76.6s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @49.3,80]
- t=306.8s (wall 76.7s) Fire Dungeon: boss defeated in 10.9s (game)  [dungeon:fire:2 @49.3,80]
- t=306.8s (wall 76.7s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @49.3,80]
- t=306.9s (wall 76.8s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @54,91.4]
- t=309.4s (wall 77.4s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=310.4s (wall 77.7s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=320.2s (wall 80.1s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433,415.1]
- t=320.2s (wall 80.1s) Phase end: dungeon fire (98.0s game)  [overworld @3433,415.1]
- t=320.2s (wall 80.1s) Phase start: restock after fire  [overworld @3433,415.1]
- t=320.2s (wall 80.1s) Phase end: restock after fire (0.0s game)  [overworld @3433,415.1]
- t=320.3s (wall 80.1s) Phase start: dungeon water  [overworld @3433,415.1]
- t=368.6s (wall 92.2s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.4,2088.7]
- t=372.7s (wall 93.2s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=375.1s (wall 93.8s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @63.6,48]
- t=382.3s (wall 95.6s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.4,48.6]
- t=384s (wall 96s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=391.5s (wall 97.9s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=392.7s (wall 98.2s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=392.7s (wall 98.2s) Water Dungeon: boss fight vs voltuga (hp 198)  [dungeon:water:2 @32,80]
- t=400.9s (wall 100.3s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @111.6,128.1]
- t=401.5s (wall 100.4s) Water Dungeon: boss defeated in 8.8s (game)  [dungeon:water:2 @95.5,118.6]
- t=401.5s (wall 100.4s) Water Dungeon: got the Boss Key  [dungeon:water:2 @95.5,118.6]
- t=401.9s (wall 100.5s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @55.7,135.1]
- t=404.9s (wall 101.3s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=405.9s (wall 101.5s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=415.5s (wall 103.9s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.1,2384.7]
- t=415.5s (wall 103.9s) Phase end: dungeon water (95.2s game)  [overworld @793.1,2384.7]
- t=415.5s (wall 103.9s) Phase start: restock after water  [overworld @793.1,2384.7]
- t=415.5s (wall 103.9s) Phase end: restock after water (0.0s game)  [overworld @793.1,2384.7]
- t=415.5s (wall 103.9s) Phase start: dungeon shadow  [overworld @793.1,2384.7]
- t=439.4s (wall 109.9s) Level up -> Lv 15, chose +1 Attack  [overworld @886.2,466.6]
- t=443.2s (wall 110.8s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=451.2s (wall 112.8s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.4,47.4]
- t=452.9s (wall 113.3s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=454.2s (wall 113.6s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:1 @62.7,55.9]
- t=458.4s (wall 114.6s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @142.9,82.1]
- t=460.1s (wall 115.1s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=460.1s (wall 115.1s) Shadow Dungeon: boss fight vs puffling (hp 280)  [dungeon:shadow:2 @32,80]
- t=482s (wall 120.5s) Level up -> Lv 17, chose +1 Attack  [dungeon:shadow:2 @43.7,89.7]
- t=482.4s (wall 120.7s) Shadow Dungeon: boss defeated in 22.3s (game)  [dungeon:shadow:2 @42.5,84.5]
- t=482.4s (wall 120.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @42.5,84.5]
- t=485.1s (wall 121.3s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=486.1s (wall 121.6s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=495.7s (wall 124s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.6,319.5]
- t=495.7s (wall 124s) Phase end: dungeon shadow (80.2s game)  [overworld @873.6,319.5]
- t=495.7s (wall 124s) Phase start: restock after shadow  [overworld @873.6,319.5]
- t=495.7s (wall 124s) Phase end: restock after shadow (0.0s game)  [overworld @873.6,319.5]
- t=495.7s (wall 124s) Phase start: castle  [overworld @873.6,319.5]
- t=511.6s (wall 128s) Entered the castle  [castle:0 @32,80]
- t=517.7s (wall 129.5s) Level up -> Lv 18, chose +1 Attack  [castle:0 @128.2,87.4]
- t=519.1s (wall 129.8s) Castle Gate Hall: solved the guards puzzle  [castle:0 @189.9,69.7]
- t=520.7s (wall 130.2s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=530.3s (wall 132.6s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @208.5,42.2]
- t=532.1s (wall 133.1s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=557s (wall 139.3s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @215.1,135.7]
- t=558.2s (wall 139.6s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @146.8,89]
- t=560.3s (wall 140.1s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=561s (wall 140.3s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=562.7s (wall 140.7s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=564.1s (wall 141.1s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @183.1,41.7]
- t=566.1s (wall 141.6s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=568.8s (wall 142.3s) Level up -> Lv 19, chose +1 Attack  [castle:4 @76.6,46.1]
- t=577.1s (wall 144.3s) Level up -> Lv 20, chose +1 Attack  [castle:4 @159.9,109.9]
- t=577.9s (wall 144.5s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @162.3,107.5]
- t=578.2s (wall 144.6s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @145.6,89.2]
- t=580.1s (wall 145.1s) Castle: entered Antechamber  [castle:5 @32,80]
- t=587s (wall 146.8s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=588.6s (wall 147.2s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=588.6s (wall 147.2s) Final boss fight vs Malrek (hp 612, Lv 24, hits for 2)  [castle:6 @32,112]
- t=601.2s (wall 150.3s) Final boss defeated in 12.6s (game)  [castle:6 @108,118.5]
- t=606.4s (wall 151.7s) VICTORY screen reached  [castle:6 @108,118.5]
- t=606.4s (wall 151.7s) QA agent finished: victory  [castle:6 @108,118.5]

## Agent-side notes (not game bugs)

- t=291.3s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)
- t=550.6s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 153.1s, timeScale x4, 6 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
