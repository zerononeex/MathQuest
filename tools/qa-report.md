# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T23:45:37.203Z | wall 120.8s | game time 475.2s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 13, gold 66, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @150.7s), Boomerang (50g @150.8s)
- Kills 62, pots/bushes 50, sword swings 107, ranged shots 61, math solved 32 (locks 9), revives 3, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.7 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.7 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 87.1 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 63.4 |

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
- t=8.9s (wall 2.3s) Opened dialogue with Curious Kid (3 lines)  [overworld @2023.2,1378.3]
- t=9.8s (wall 2.5s) Dialogue dismissed after 3 presses  [overworld @2023.2,1378.3]
- t=9.9s (wall 2.5s) Phase end: npc dialogue (3.9s game)  [overworld @2023.2,1395]
- t=9.9s (wall 2.5s) Phase start: farm gold/XP  [overworld @2023.2,1395]
- t=28.9s (wall 7.3s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2074.4,1716.4]
- t=36.5s (wall 9.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2199.8,1508.9]
- t=48.1s (wall 12.1s) Level up -> Lv 4, chose +1 Attack  [overworld @2426.2,1279.8]
- t=68s (wall 17s) Level up -> Lv 5, chose +1 Attack  [overworld @1961.5,537.1]
- t=82.4s (wall 20.6s) Level up -> Lv 6, chose +1 Attack  [overworld @1575.3,838]
- t=119.1s (wall 29.8s) Level up -> Lv 7, chose +1 Attack  [overworld @1096.4,1439.9]
- t=134.9s (wall 33.8s) Level up -> Lv 8, chose +1 Attack  [overworld @1579.6,1891.2]
- t=138.5s (wall 34.7s) Farming done: gold 0 -> 80, level 8, kills 30, pots 41  [overworld @1643.1,1971.8]
- t=138.5s (wall 34.7s) Phase end: farm gold/XP (128.6s game)  [overworld @1643.1,1971.8]
- t=138.5s (wall 34.7s) Phase start: shop  [overworld @1643.1,1971.8]
- t=150.1s (wall 37.6s) Entered Shop with 81 gold  [interior:Shop @120,140.8]
- t=150.4s (wall 37.6s) Shop opened  [interior:Shop @120,107.5]
- t=150.7s (wall 37.7s) Bought Sharp Sword for 30g (gold 81 -> 51)  [interior:Shop @120,107.5]
- t=150.8s (wall 37.7s) Bought Boomerang for 50g (gold 51 -> 1)  [interior:Shop @120,107.5]
- t=152.1s (wall 38.1s) Left shop (gold 1)  [overworld @2022.6,1360]
- t=152.1s (wall 38.1s) Phase end: shop (13.6s game)  [overworld @2022.6,1360]
- t=152.1s (wall 38.1s) Phase start: dungeon forest  [overworld @2022.6,1360]
- t=173.5s (wall 43.4s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=181.5s (wall 45.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.4,46.8]
- t=183.3s (wall 45.9s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=183.9s (wall 46s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:1 @59.1,107.1]
- t=185.8s (wall 46.5s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,80]
- t=187.1s (wall 46.8s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=187.1s (wall 46.8s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=188.4s (wall 47.1s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=188.4s (wall 47.1s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=189.4s (wall 47.4s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=191.2s (wall 47.8s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=192.2s (wall 48.1s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=201.8s (wall 50.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1022.6]
- t=202.6s (wall 50.7s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=203.5s (wall 50.9s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1023.6]
- t=203.5s (wall 50.9s) Phase end: dungeon forest (51.4s game)  [overworld @360.9,1023.6]
- t=203.5s (wall 50.9s) Phase start: restock after forest  [overworld @360.9,1023.6]
- t=203.5s (wall 50.9s) Phase end: restock after forest (0.0s game)  [overworld @360.9,1023.6]
- t=203.5s (wall 50.9s) Phase start: dungeon fire  [overworld @360.9,1023.6]
- t=251s (wall 62.8s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=251.5s (wall 62.9s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=255.8s (wall 64s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180.9,46.5]
- t=257.6s (wall 64.4s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=275.7s (wall 69s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=277.1s (wall 69.3s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=277.1s (wall 69.3s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=277.8s (wall 69.5s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=279s (wall 69.8s) Fire Dungeon: boss defeated in 2.0s (game)  [dungeon:fire:2 @86.1,108.9]
- t=279s (wall 69.8s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @86.1,108.9]
- t=279.2s (wall 69.8s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.9,97.1]
- t=281.5s (wall 70.4s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=282.4s (wall 70.7s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=292.2s (wall 73.1s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.6,414.6]
- t=292.2s (wall 73.1s) Phase end: dungeon fire (88.7s game)  [overworld @3432.6,414.6]
- t=292.3s (wall 73.1s) Phase start: restock after fire  [overworld @3432.6,414.6]
- t=292.3s (wall 73.1s) Phase end: restock after fire (0.0s game)  [overworld @3432.6,414.6]
- t=292.3s (wall 73.1s) Phase start: dungeon water  [overworld @3432.6,414.6]
- t=335.4s (wall 83.9s) Level up -> Lv 12, chose +1 Attack  [overworld @1111.2,1950.8]
- t=339.8s (wall 85s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.6,2087.2]
- t=344s (wall 86s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=354.3s (wall 88.6s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.9,48.9]
- t=355.9s (wall 89s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=363.4s (wall 90.9s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199,105.6]
- t=364.6s (wall 91.2s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=364.6s (wall 91.2s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=365.5s (wall 91.4s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=365.9s (wall 91.5s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=365.9s (wall 91.5s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=366.9s (wall 91.8s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=368.8s (wall 92.2s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=369.7s (wall 92.5s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=379.4s (wall 94.9s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.6,2384.9]
- t=379.4s (wall 94.9s) Phase end: dungeon water (87.1s game)  [overworld @792.6,2384.9]
- t=379.4s (wall 94.9s) Phase start: restock after water  [overworld @792.6,2384.9]
- t=379.4s (wall 94.9s) Phase end: restock after water (0.0s game)  [overworld @792.6,2384.9]
- t=379.4s (wall 94.9s) Phase start: dungeon shadow  [overworld @792.6,2384.9]
- t=413.1s (wall 103.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=421.5s (wall 105.4s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.7,47.9]
- t=423.2s (wall 105.9s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=425.1s (wall 106.3s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @99.7,64.7]
- t=426.5s (wall 106.7s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @125.4,70.6]
- t=428.5s (wall 107.2s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=428.5s (wall 107.2s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=429.3s (wall 107.4s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=429.3s (wall 107.4s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=430.3s (wall 107.6s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=432.2s (wall 108.1s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=433.1s (wall 108.3s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=442.8s (wall 110.7s) Exited Shadow Dungeon to the overworld at (55,19)  [overworld @889.3,319.2]
- t=442.8s (wall 110.7s) Phase end: dungeon shadow (63.4s game)  [overworld @889.3,319.2]
- t=442.8s (wall 110.7s) Phase start: restock after shadow  [overworld @889.3,319.2]
- t=442.8s (wall 110.7s) Phase end: restock after shadow (0.0s game)  [overworld @889.3,319.2]
- t=442.8s (wall 110.7s) Phase start: castle  [overworld @889.3,319.2]
- t=444.1s (wall 111.1s) Level up -> Lv 15, chose +1 Attack  [overworld @890.4,326.8]
- t=461.8s (wall 115.5s) Entered the castle  [castle:0 @32,80]
- t=466s (wall 116.6s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=469.9s (wall 117.5s) Final boss defeated in 3.9s (game)  [castle:1 @214.9,87.7]
- t=475.2s (wall 118.8s) VICTORY screen reached  [castle:1 @214.9,87.7]
- t=475.2s (wall 118.8s) QA agent finished: victory  [castle:1 @214.9,87.7]

## Agent-side notes (not game bugs)

- t=272.5s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 120.8s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
