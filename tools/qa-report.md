# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T03:36:19.195Z | wall 159s | game time 633.3s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 127 milestones, 2 agent-side notes

## Progress

- Level 19, hearts 3/9, attack 17, gold 130, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @133.1s), Boomerang (50g @133.2s)
- Kills 78, pots/bushes 42, sword swings 210, ranged shots 177, math solved 33 (locks 10), revives 8, level-ups 18
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 65.1 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 101.8 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 109.2 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 76.8 |

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
- t=6.3s (wall 1.6s) Opened dialogue with Curious Kid (3 lines)  [overworld @1946.5,1208.3]
- t=7.1s (wall 1.8s) Dialogue dismissed after 3 presses  [overworld @1946.5,1208.3]
- t=7.2s (wall 1.9s) Phase end: npc dialogue (1.2s game)  [overworld @1946.5,1225]
- t=7.2s (wall 1.9s) Phase start: farm gold/XP  [overworld @1946.5,1225]
- t=19.8s (wall 5s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2114.1,1555.7]
- t=38.2s (wall 9.6s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1821.7,1659.8]
- t=61.7s (wall 15.5s) Level up -> Lv 4, chose +1 Attack  [overworld @1374.3,1671.4]
- t=71.5s (wall 17.9s) Level up -> Lv 5, chose +1 Attack  [overworld @1606.8,1944.2]
- t=99.6s (wall 24.9s) Level up -> Lv 6, chose +1 Attack  [overworld @2425.7,1435.2]
- t=109.6s (wall 27.4s) Level up -> Lv 7, chose +1 Attack  [overworld @2642,1457.7]
- t=119.8s (wall 30s) Farming done: gold 0 -> 80, level 7, kills 26, pots 33  [overworld @2617.7,1939.5]
- t=119.8s (wall 30s) Phase end: farm gold/XP (112.6s game)  [overworld @2617.7,1939.5]
- t=119.8s (wall 30s) Phase start: shop  [overworld @2617.7,1939.5]
- t=132.5s (wall 33.2s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=132.8s (wall 33.3s) Shop opened  [interior:Shop @120,107.5]
- t=133.1s (wall 33.3s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=133.2s (wall 33.4s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=134.5s (wall 33.7s) Left shop (gold 0)  [overworld @2024.4,1358.9]
- t=134.5s (wall 33.7s) Phase end: shop (14.7s game)  [overworld @2024.4,1358.9]
- t=134.5s (wall 33.7s) Phase start: dungeon forest  [overworld @2024.4,1358.9]
- t=156.1s (wall 39.1s) Level up -> Lv 8, chose +1 Attack  [overworld @503.7,1136]
- t=159.7s (wall 40s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=167.8s (wall 42s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180,47.6]
- t=169.6s (wall 42.4s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=171.9s (wall 43s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.2,80.7]
- t=173.2s (wall 43.4s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=173.2s (wall 43.4s) Forest Dungeon: boss fight vs grovak (hp 168)  [dungeon:forest:2 @32,80]
- t=187.1s (wall 46.8s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @172.8,113.4]
- t=187.5s (wall 46.9s) Forest Dungeon: boss defeated in 14.3s (game)  [dungeon:forest:2 @171.6,108.9]
- t=187.5s (wall 46.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @171.6,108.9]
- t=189.1s (wall 47.3s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=190s (wall 47.6s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=199.7s (wall 50s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @383.7,1017]
- t=200.7s (wall 50.2s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=201.5s (wall 50.4s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.4,1023]
- t=201.5s (wall 50.4s) Phase end: dungeon forest (67.0s game)  [overworld @360.4,1023]
- t=201.6s (wall 50.4s) Phase start: restock after forest  [overworld @360.4,1023]
- t=201.6s (wall 50.4s) Phase end: restock after forest (0.0s game)  [overworld @360.4,1023]
- t=201.6s (wall 50.4s) Phase start: dungeon fire  [overworld @360.4,1023]
- t=248.9s (wall 62.3s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=249.4s (wall 62.4s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=253.7s (wall 63.5s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180.2,47]
- t=255.4s (wall 63.9s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=273.5s (wall 68.4s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=274.9s (wall 68.8s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=274.9s (wall 68.8s) Fire Dungeon: boss fight vs cindermaw (hp 256)  [dungeon:fire:2 @32,80]
- t=289.5s (wall 72.4s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @62.1,68.9]
- t=289.9s (wall 72.5s) Fire Dungeon: boss defeated in 15.1s (game)  [dungeon:fire:2 @65.6,65.4]
- t=289.9s (wall 72.5s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @65.6,65.4]
- t=290.1s (wall 72.6s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @78.6,78.3]
- t=292.6s (wall 73.2s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=293.6s (wall 73.4s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=303.4s (wall 75.9s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.4,414.4]
- t=303.4s (wall 75.9s) Phase end: dungeon fire (101.8s game)  [overworld @3433.4,414.4]
- t=303.4s (wall 75.9s) Phase start: restock after fire  [overworld @3433.4,414.4]
- t=303.4s (wall 75.9s) Phase end: restock after fire (0.0s game)  [overworld @3433.4,414.4]
- t=303.4s (wall 75.9s) Phase start: dungeon water  [overworld @3433.4,414.4]
- t=347.2s (wall 86.8s) Level up -> Lv 12, chose +1 Attack  [overworld @1066,1993]
- t=350.7s (wall 87.7s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.7,2088]
- t=354.8s (wall 88.7s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=364s (wall 91s) Water Dungeon: got the Small Key  [dungeon:water:0 @179,48.1]
- t=365.6s (wall 91.4s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=368.4s (wall 92.1s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:1 @171.9,46]
- t=373.1s (wall 93.3s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199,105.6]
- t=374.3s (wall 93.6s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=374.3s (wall 93.6s) Water Dungeon: boss fight vs voltuga (hp 396)  [dungeon:water:2 @32,80]
- t=399.3s (wall 99.9s) Water Dungeon: boss defeated in 25.0s (game)  [dungeon:water:2 @130,85.9]
- t=399.3s (wall 99.9s) Water Dungeon: got the Boss Key  [dungeon:water:2 @130,85.9]
- t=399.7s (wall 100s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @98.3,105.9]
- t=402s (wall 100.5s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=402.9s (wall 100.8s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=412.6s (wall 103.2s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.7,2385.7]
- t=412.6s (wall 103.2s) Phase end: dungeon water (109.2s game)  [overworld @792.7,2385.7]
- t=412.6s (wall 103.2s) Phase start: restock after water  [overworld @792.7,2385.7]
- t=412.6s (wall 103.2s) Phase end: restock after water (0.0s game)  [overworld @792.7,2385.7]
- t=412.6s (wall 103.2s) Phase start: dungeon shadow  [overworld @792.7,2385.7]
- t=427.7s (wall 107s) Level up -> Lv 14, chose +1 Attack  [overworld @727.2,996.2]
- t=439.7s (wall 110s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=446.6s (wall 111.7s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.7,48.6]
- t=448.3s (wall 112.1s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=448.5s (wall 112.2s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:1 @32,80]
- t=451.6s (wall 112.9s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @131.6,70.1]
- t=453.5s (wall 113.4s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=453.5s (wall 113.4s) Shadow Dungeon: boss fight vs puffling (hp 520)  [dungeon:shadow:2 @32,80]
- t=476.6s (wall 119.2s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:2 @203.4,105.5]
- t=477s (wall 119.3s) Shadow Dungeon: boss defeated in 23.5s (game)  [dungeon:shadow:2 @203.4,105.5]
- t=477s (wall 119.3s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @203.4,105.5]
- t=477.3s (wall 119.4s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @211.7,130.5]
- t=478.7s (wall 119.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=479.7s (wall 120s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=489.3s (wall 122.4s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.5,318.8]
- t=489.3s (wall 122.4s) Phase end: dungeon shadow (76.8s game)  [overworld @873.5,318.8]
- t=489.4s (wall 122.4s) Phase start: restock after shadow  [overworld @873.5,318.8]
- t=489.4s (wall 122.4s) Phase end: restock after shadow (0.0s game)  [overworld @873.5,318.8]
- t=489.4s (wall 122.4s) Phase start: castle  [overworld @873.5,318.8]
- t=505.9s (wall 126.5s) Entered the castle  [castle:0 @32,80]
- t=507.3s (wall 126.9s) Level up -> Lv 17, chose +1 Attack  [castle:0 @92.3,106]
- t=512.1s (wall 128.1s) Castle Gate Hall: solved the guards puzzle  [castle:0 @127.6,87.4]
- t=512.4s (wall 128.1s) Castle Gate Hall: got a Small Key (1 held)  [castle:0 @145.9,87.4]
- t=514.3s (wall 128.6s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=524.9s (wall 131.3s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @210.7,42.2]
- t=526.7s (wall 131.7s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=528.6s (wall 132.2s) Level up -> Lv 18, chose +1 Attack  [castle:2 @84.3,62.7]
- t=551.6s (wall 137.9s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @214.5,136.1]
- t=552.7s (wall 138.2s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @146.2,89.4]
- t=554.9s (wall 138.8s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=555.6s (wall 138.9s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=557.3s (wall 139.3s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=559.8s (wall 140s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @246.4,88.3]
- t=560.7s (wall 140.2s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=572.5s (wall 143.2s) Level up -> Lv 19, chose +1 Attack  [castle:4 @196.1,152.1]
- t=577.5s (wall 144.4s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @198.8,101.8]
- t=578.2s (wall 144.6s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @145.4,88.5]
- t=580.1s (wall 145.1s) Castle: entered Antechamber  [castle:5 @32,80]
- t=587s (wall 146.8s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=588.6s (wall 147.2s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=588.6s (wall 147.2s) Final boss fight vs Malrek (hp 918, Lv 24, hits for 2)  [castle:6 @32,112]
- t=628.1s (wall 157.1s) Final boss defeated in 39.5s (game)  [castle:6 @238.6,131.7]
- t=633.3s (wall 158.4s) VICTORY screen reached  [castle:6 @238.6,131.7]
- t=633.3s (wall 158.4s) QA agent finished: victory  [castle:6 @238.6,131.7]

## Agent-side notes (not game bugs)

- t=270.4s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)
- t=545.1s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 159s, timeScale x4, 6 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
