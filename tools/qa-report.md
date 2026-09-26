# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T19:51:17.105Z | wall 98.6s | game time 392.8s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 105 milestones, 1 agent-side notes

## Progress

- Level 14, hearts 8/9, attack 12, gold 65, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @155.8s), Boomerang (50g @156s)
- Kills 59, pots/bushes 47, sword swings 96, ranged shots 60, math solved 27 (locks 8), revives 1, level-ups 13
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 43.8 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62.4 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 57.6 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 54.2 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1600,1152]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1600,1152]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1600,1152]
- t=7.9s (wall 2.1s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1181.2,1032.5]
- t=8.5s (wall 2.2s) Tap-to-move reached target (1 facing changes)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.2s) Phase end: calibrate (8.5s game)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.2s) Phase start: npc dialogue  [overworld @1234.9,1055.1]
- t=12.4s (wall 3.2s) Opened dialogue with Mustachioed Wanderer (3 lines)  [overworld @1509.9,1160.1]
- t=13.3s (wall 3.4s) Dialogue dismissed after 3 presses  [overworld @1509.9,1160.1]
- t=13.5s (wall 3.5s) Phase end: npc dialogue (5.0s game)  [overworld @1509.9,1176.8]
- t=13.5s (wall 3.5s) Phase start: farm gold/XP  [overworld @1509.9,1176.8]
- t=27.5s (wall 7s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1581.3,1373.6]
- t=44s (wall 11.1s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1322.3,1554.6]
- t=55.6s (wall 14s) Level up -> Lv 4, chose +1 Attack  [overworld @977.8,1560]
- t=62s (wall 15.6s) Level up -> Lv 5, chose +1 Attack  [overworld @751.7,1400.7]
- t=97.2s (wall 24.4s) Level up -> Lv 6, chose +1 Attack  [overworld @1718.5,1471.8]
- t=109.6s (wall 27.5s) Level up -> Lv 7, chose +1 Attack  [overworld @2042.7,1111.6]
- t=133s (wall 33.3s) Level up -> Lv 8, chose +1 Attack  [overworld @1315.8,1016.9]
- t=144.5s (wall 36.2s) Farming done: gold 0 -> 81, level 8, kills 30, pots 38  [overworld @902.3,866.4]
- t=144.5s (wall 36.2s) Phase end: farm gold/XP (131.0s game)  [overworld @902.3,866.4]
- t=144.5s (wall 36.2s) Phase start: shop  [overworld @902.3,866.4]
- t=155.2s (wall 38.9s) Entered Shop with 81 gold  [interior:Shop @120,140.8]
- t=155.6s (wall 39s) Shop opened  [interior:Shop @120,107.5]
- t=155.8s (wall 39.1s) Bought Sharp Sword for 30g (gold 81 -> 51)  [interior:Shop @120,107.5]
- t=156s (wall 39.1s) Bought Boomerang for 50g (gold 51 -> 1)  [interior:Shop @120,107.5]
- t=157.3s (wall 39.4s) Left shop (gold 1)  [overworld @1702.3,1070.7]
- t=157.3s (wall 39.4s) Phase end: shop (12.8s game)  [overworld @1702.3,1070.7]
- t=157.3s (wall 39.4s) Phase start: dungeon forest  [overworld @1702.3,1070.7]
- t=169.9s (wall 42.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=181.1s (wall 45.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.4,48.2]
- t=182.7s (wall 45.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=185s (wall 46.4s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.4,80.5]
- t=186.4s (wall 46.7s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=186.4s (wall 46.7s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=187.3s (wall 46.9s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=187.7s (wall 47s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=187.7s (wall 47s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=188.6s (wall 47.3s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=190.5s (wall 47.7s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=191.5s (wall 48s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=201.1s (wall 50.4s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729,863.4]
- t=201.9s (wall 50.6s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=202.8s (wall 50.8s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729,862.7]
- t=202.8s (wall 50.8s) Phase end: dungeon forest (45.5s game)  [overworld @729,862.7]
- t=202.8s (wall 50.8s) Phase start: restock after forest  [overworld @729,862.7]
- t=202.8s (wall 50.8s) Phase end: restock after forest (0.0s game)  [overworld @729,862.7]
- t=202.8s (wall 50.8s) Phase start: dungeon fire  [overworld @729,862.7]
- t=211.2s (wall 52.9s) Level up -> Lv 10, chose +1 Attack  [overworld @1455.9,944.3]
- t=224.6s (wall 56.3s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=229.3s (wall 57.4s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.8,48.4]
- t=231s (wall 57.8s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=249.1s (wall 62.4s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=250.5s (wall 62.7s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=250.5s (wall 62.7s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=251.2s (wall 62.9s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=251.9s (wall 63.1s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @62.6,69.4]
- t=251.9s (wall 63.1s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @62.6,69.4]
- t=252.4s (wall 63.2s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.8,93]
- t=254.5s (wall 63.7s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=255.5s (wall 64s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=265.3s (wall 66.4s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2519.2,1137]
- t=265.3s (wall 66.4s) Phase end: dungeon fire (62.4s game)  [overworld @2519.2,1137]
- t=265.3s (wall 66.4s) Phase start: restock after fire  [overworld @2519.2,1137]
- t=265.3s (wall 66.4s) Phase end: restock after fire (0.0s game)  [overworld @2519.2,1137]
- t=265.3s (wall 66.4s) Phase start: dungeon water  [overworld @2519.2,1137]
- t=287.9s (wall 72.1s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=297.7s (wall 74.5s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.1,47.9]
- t=299.5s (wall 75s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=302.3s (wall 75.7s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:1 @171.9,46]
- t=307s (wall 76.9s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199,105.6]
- t=308.2s (wall 77.2s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=308.2s (wall 77.2s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=309.5s (wall 77.5s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=309.5s (wall 77.5s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=310.5s (wall 77.7s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=312.3s (wall 78.2s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=313.3s (wall 78.4s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=322.9s (wall 80.8s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1049.2,1873]
- t=322.9s (wall 80.8s) Phase end: dungeon water (57.6s game)  [overworld @1049.2,1873]
- t=323s (wall 80.8s) Phase start: restock after water  [overworld @1049.2,1873]
- t=323s (wall 80.8s) Phase end: restock after water (0.0s game)  [overworld @1049.2,1873]
- t=323s (wall 80.8s) Phase start: dungeon shadow  [overworld @1049.2,1873]
- t=339.3s (wall 84.9s) Level up -> Lv 13, chose +1 Attack  [overworld @1332.5,569]
- t=347.2s (wall 86.9s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=354.8s (wall 88.8s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.8,46.9]
- t=356.6s (wall 89.2s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=360.8s (wall 90.3s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @154.3,83.3]
- t=362.4s (wall 90.7s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=362.4s (wall 90.7s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=363.3s (wall 90.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=363.7s (wall 91s) Shadow Dungeon: boss defeated in 1.3s (game)  [dungeon:shadow:2 @32,80]
- t=363.7s (wall 91s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=364.7s (wall 91.3s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=366.5s (wall 91.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=367.5s (wall 92s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=377.1s (wall 94.4s) Exited Shadow Dungeon to the overworld at (99,13)  [overworld @1591.3,223.7]
- t=377.1s (wall 94.4s) Phase end: dungeon shadow (54.2s game)  [overworld @1591.3,223.7]
- t=377.1s (wall 94.4s) Phase start: restock after shadow  [overworld @1591.3,223.7]
- t=377.1s (wall 94.4s) Phase end: restock after shadow (0.0s game)  [overworld @1591.3,223.7]
- t=377.2s (wall 94.4s) Phase start: castle  [overworld @1591.3,223.7]
- t=379.4s (wall 94.9s) Entered the castle  [castle:0 @32,80]
- t=383.4s (wall 95.9s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=387.5s (wall 97s) Final boss defeated in 4.1s (game)  [castle:1 @108.3,154.5]
- t=392.8s (wall 98.3s) VICTORY screen reached  [castle:1 @108.3,154.5]
- t=392.8s (wall 98.3s) QA agent finished: victory  [castle:1 @108.3,154.5]

## Agent-side notes (not game bugs)

- t=245.9s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
   "item": "Red Overalls",
   "rect": "40,478 540x26"
  }
 ]
}
```

## Runner

- Game file: `math-quest.html`
- Wall time 98.6s, timeScale x4, 4 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
