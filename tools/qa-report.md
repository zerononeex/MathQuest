# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T23:26:50.948Z | wall 122.8s | game time 486.2s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 13, gold 56, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @165.8s), Boomerang (50g @166s)
- Kills 60, pots/bushes 53, sword swings 95, ranged shots 61, math solved 29 (locks 9), revives 2, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.5 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.3 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 85.9 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62.5 |

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
- t=7.5s (wall 1.9s) Opened dialogue with Curious Kid (3 lines)  [overworld @1881.5,1286.7]
- t=8.3s (wall 2.1s) Dialogue dismissed after 3 presses  [overworld @1881.5,1286.7]
- t=8.5s (wall 2.1s) Phase end: npc dialogue (2.4s game)  [overworld @1881.5,1303.3]
- t=8.5s (wall 2.2s) Phase start: farm gold/XP  [overworld @1881.5,1303.3]
- t=22.8s (wall 5.7s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1818.3,1653.9]
- t=32.9s (wall 8.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2103.9,1650.8]
- t=47.2s (wall 11.8s) Level up -> Lv 4, chose +1 Attack  [overworld @2423.1,1433]
- t=65.9s (wall 16.5s) Level up -> Lv 5, chose +1 Attack  [overworld @2073,713]
- t=86.7s (wall 21.7s) Level up -> Lv 6, chose +1 Attack  [overworld @1542.3,811]
- t=119.7s (wall 29.9s) Level up -> Lv 7, chose +1 Attack  [overworld @1096.7,1440.1]
- t=140.2s (wall 35.1s) Level up -> Lv 8, chose +1 Attack  [overworld @985.5,1851.9]
- t=154.5s (wall 38.7s) Farming done: gold 0 -> 82, level 8, kills 32, pots 44  [overworld @1579.7,1891.7]
- t=154.5s (wall 38.7s) Phase end: farm gold/XP (146.0s game)  [overworld @1579.7,1891.7]
- t=154.5s (wall 38.7s) Phase start: shop  [overworld @1579.7,1891.7]
- t=165.2s (wall 41.3s) Entered Shop with 82 gold  [interior:Shop @120,140.8]
- t=165.6s (wall 41.4s) Shop opened  [interior:Shop @120,107.5]
- t=165.8s (wall 41.5s) Bought Sharp Sword for 30g (gold 82 -> 52)  [interior:Shop @120,107.5]
- t=166s (wall 41.5s) Bought Boomerang for 50g (gold 52 -> 2)  [interior:Shop @120,107.5]
- t=167.3s (wall 41.8s) Left shop (gold 2)  [overworld @2023,1359.3]
- t=167.3s (wall 41.8s) Phase end: shop (12.7s game)  [overworld @2023,1359.3]
- t=167.3s (wall 41.9s) Phase start: dungeon forest  [overworld @2023,1359.3]
- t=188.7s (wall 47.2s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=191.4s (wall 47.9s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:0 @123.1,103.5]
- t=196.8s (wall 49.2s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.8,48.8]
- t=198.4s (wall 49.6s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=200.7s (wall 50.2s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.2,80.7]
- t=202s (wall 50.5s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=202s (wall 50.5s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=203s (wall 50.8s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=203.4s (wall 50.9s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=203.4s (wall 50.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=204.3s (wall 51.1s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=206.2s (wall 51.6s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=207.2s (wall 51.8s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=216.8s (wall 54.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1023.7]
- t=217.6s (wall 54.4s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=218.5s (wall 54.7s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1023]
- t=218.5s (wall 54.7s) Phase end: dungeon forest (51.2s game)  [overworld @361.4,1023]
- t=218.5s (wall 54.7s) Phase start: restock after forest  [overworld @361.4,1023]
- t=218.5s (wall 54.7s) Phase end: restock after forest (0.0s game)  [overworld @361.4,1023]
- t=218.5s (wall 54.7s) Phase start: dungeon fire  [overworld @361.4,1023]
- t=265.9s (wall 66.5s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=270.6s (wall 67.7s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.3,48.9]
- t=272.3s (wall 68.1s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=290.3s (wall 72.6s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=291.7s (wall 73s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=291.7s (wall 73s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=292.5s (wall 73.1s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=293.6s (wall 73.4s) Fire Dungeon: boss defeated in 1.9s (game)  [dungeon:fire:2 @88.2,106.6]
- t=293.6s (wall 73.4s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @88.2,106.6]
- t=293.8s (wall 73.5s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.6,97.2]
- t=296.1s (wall 74s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=297s (wall 74.3s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=306.8s (wall 76.7s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433,415.7]
- t=306.8s (wall 76.7s) Phase end: dungeon fire (88.3s game)  [overworld @3433,415.7]
- t=306.9s (wall 76.7s) Phase start: restock after fire  [overworld @3433,415.7]
- t=306.9s (wall 76.7s) Phase end: restock after fire (0.0s game)  [overworld @3433,415.7]
- t=306.9s (wall 76.8s) Phase start: dungeon water  [overworld @3433,415.7]
- t=352.8s (wall 88.2s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.8,2088.5]
- t=356.9s (wall 89.3s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=361.3s (wall 90.4s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:0 @112.4,76.4]
- t=367.4s (wall 91.9s) Water Dungeon: got the Small Key  [dungeon:water:0 @180,47.8]
- t=369.1s (wall 92.3s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=376.8s (wall 94.2s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198,105.5]
- t=378.1s (wall 94.5s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=378.1s (wall 94.5s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=379s (wall 94.8s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=379.4s (wall 94.9s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=379.4s (wall 94.9s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=380.3s (wall 95.1s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=382.2s (wall 95.6s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=383.2s (wall 95.8s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=392.8s (wall 98.2s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.8,2384.5]
- t=392.8s (wall 98.2s) Phase end: dungeon water (85.9s game)  [overworld @792.8,2384.5]
- t=392.8s (wall 98.2s) Phase start: restock after water  [overworld @792.8,2384.5]
- t=392.8s (wall 98.2s) Phase end: restock after water (0.0s game)  [overworld @792.8,2384.5]
- t=392.8s (wall 98.2s) Phase start: dungeon shadow  [overworld @792.8,2384.5]
- t=427s (wall 106.8s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=433.8s (wall 108.5s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.2,48]
- t=435.5s (wall 108.9s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=436.6s (wall 109.2s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @47.6,79.5]
- t=439s (wall 109.8s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @128.1,70.1]
- t=441s (wall 110.3s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=441s (wall 110.3s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=441.9s (wall 110.5s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=441.9s (wall 110.5s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=442.9s (wall 110.7s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=444.7s (wall 111.2s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=445.7s (wall 111.5s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=455.3s (wall 113.9s) Exited Shadow Dungeon to the overworld at (55,19)  [overworld @894.7,312.6]
- t=455.3s (wall 113.9s) Phase end: dungeon shadow (62.5s game)  [overworld @894.7,312.6]
- t=455.3s (wall 113.9s) Phase start: restock after shadow  [overworld @894.7,312.6]
- t=455.3s (wall 113.9s) Phase end: restock after shadow (0.0s game)  [overworld @894.7,312.6]
- t=455.3s (wall 113.9s) Phase start: castle  [overworld @894.7,312.6]
- t=472.8s (wall 118.2s) Entered the castle  [castle:0 @32,80]
- t=474.5s (wall 118.7s) Level up -> Lv 15, chose +1 Attack  [castle:0 @111,89.5]
- t=476.8s (wall 119.2s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=481s (wall 120.3s) Final boss defeated in 4.2s (game)  [castle:1 @230.8,160.8]
- t=486.2s (wall 121.6s) VICTORY screen reached  [castle:1 @230.8,160.8]
- t=486.2s (wall 121.6s) QA agent finished: victory  [castle:1 @230.8,160.8]

## Agent-side notes (not game bugs)

- t=287.2s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 122.8s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
