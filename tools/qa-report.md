# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T23:10:01.818Z | wall 120.8s | game time 476.1s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 106 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 9/9, attack 13, gold 66, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @151.4s), Boomerang (50g @151.5s)
- Kills 64, pots/bushes 42, sword swings 86, ranged shots 64, math solved 29 (locks 9), revives 2, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.8 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.1 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.6 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 65.8 |

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
- t=8s (wall 2s) Opened dialogue with Curious Kid (3 lines)  [overworld @1974.9,1336.7]
- t=8.8s (wall 2.2s) Dialogue dismissed after 3 presses  [overworld @1974.9,1336.7]
- t=9s (wall 2.3s) Phase end: npc dialogue (2.9s game)  [overworld @1974.9,1353.3]
- t=9s (wall 2.3s) Phase start: farm gold/XP  [overworld @1974.9,1353.3]
- t=21.4s (wall 5.4s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1852.1,1679.3]
- t=40.3s (wall 10.1s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1738.6,1898.9]
- t=64s (wall 16s) Level up -> Lv 4, chose +1 Attack  [overworld @2087.9,1728.7]
- t=69.8s (wall 17.5s) Level up -> Lv 5, chose +1 Attack  [overworld @2161.3,1517.5]
- t=84.9s (wall 21.2s) Level up -> Lv 6, chose +1 Attack  [overworld @2214.9,992.6]
- t=110s (wall 27.5s) Level up -> Lv 7, chose +1 Attack  [overworld @2617.4,1936.6]
- t=128.9s (wall 32.2s) Level up -> Lv 8, chose +1 Attack  [overworld @2053,2301.5]
- t=139.3s (wall 34.9s) Farming done: gold 0 -> 80, level 8, kills 32, pots 33  [overworld @2271.4,2175.3]
- t=139.3s (wall 34.9s) Phase end: farm gold/XP (130.3s game)  [overworld @2271.4,2175.3]
- t=139.3s (wall 34.9s) Phase start: shop  [overworld @2271.4,2175.3]
- t=150.8s (wall 37.7s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=151.1s (wall 37.8s) Shop opened  [interior:Shop @120,107.5]
- t=151.4s (wall 37.9s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=151.5s (wall 37.9s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=152.8s (wall 38.2s) Left shop (gold 0)  [overworld @2024.7,1359.6]
- t=152.8s (wall 38.2s) Phase end: shop (13.5s game)  [overworld @2024.7,1359.6]
- t=152.9s (wall 38.2s) Phase start: dungeon forest  [overworld @2024.7,1359.6]
- t=174.3s (wall 43.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=182.6s (wall 45.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @179.5,48.4]
- t=184.3s (wall 46.1s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=184.8s (wall 46.2s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:1 @75.8,109.5]
- t=186.6s (wall 46.7s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.2,80.7]
- t=187.9s (wall 47s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=187.9s (wall 47s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=188.8s (wall 47.2s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=189.2s (wall 47.3s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=189.2s (wall 47.3s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=190.2s (wall 47.6s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=192s (wall 48s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=193s (wall 48.3s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=202.6s (wall 50.7s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1024]
- t=203.5s (wall 50.9s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=204.3s (wall 51.1s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.4,1023.3]
- t=204.3s (wall 51.1s) Phase end: dungeon forest (51.5s game)  [overworld @361.4,1023.3]
- t=204.4s (wall 51.1s) Phase start: restock after forest  [overworld @361.4,1023.3]
- t=204.4s (wall 51.1s) Phase end: restock after forest (0.0s game)  [overworld @361.4,1023.3]
- t=204.4s (wall 51.1s) Phase start: dungeon fire  [overworld @361.4,1023.3]
- t=251.8s (wall 63s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=256.4s (wall 64.1s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.8,48.4]
- t=258.1s (wall 64.5s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=276.1s (wall 69.1s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.7,57.4]
- t=277.5s (wall 69.4s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=277.5s (wall 69.4s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=278.2s (wall 69.6s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=279.4s (wall 69.9s) Fire Dungeon: boss defeated in 1.9s (game)  [dungeon:fire:2 @87.1,96.5]
- t=279.4s (wall 69.9s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @87.1,96.5]
- t=281.7s (wall 70.5s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=282.7s (wall 70.7s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=292.5s (wall 73.2s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.1,416]
- t=292.5s (wall 73.2s) Phase end: dungeon fire (88.1s game)  [overworld @3433.1,416]
- t=292.5s (wall 73.2s) Phase start: restock after fire  [overworld @3433.1,416]
- t=292.5s (wall 73.2s) Phase end: restock after fire (0.0s game)  [overworld @3433.1,416]
- t=292.5s (wall 73.2s) Phase start: dungeon water  [overworld @3433.1,416]
- t=335.2s (wall 83.8s) Level up -> Lv 12, chose +1 Attack  [overworld @1111.2,1951.1]
- t=339.6s (wall 84.9s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.6,2087.5]
- t=343.8s (wall 86s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=354s (wall 88.5s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.5,48.1]
- t=355.6s (wall 88.9s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=363.2s (wall 90.8s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.9,105]
- t=364.4s (wall 91.1s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=364.4s (wall 91.1s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=365.4s (wall 91.4s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=365.8s (wall 91.5s) Water Dungeon: boss defeated in 1.4s (game)  [dungeon:water:2 @32,80]
- t=365.8s (wall 91.5s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=366.8s (wall 91.7s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=368.6s (wall 92.2s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=369.6s (wall 92.4s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=379.2s (wall 94.8s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.6,2385.2]
- t=379.2s (wall 94.8s) Phase end: dungeon water (86.6s game)  [overworld @792.6,2385.2]
- t=379.2s (wall 94.8s) Phase start: restock after water  [overworld @792.6,2385.2]
- t=379.2s (wall 94.8s) Phase end: restock after water (0.0s game)  [overworld @792.6,2385.2]
- t=379.2s (wall 94.8s) Phase start: dungeon shadow  [overworld @792.6,2385.2]
- t=415.4s (wall 103.9s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=415.6s (wall 103.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:0 @47.4,70.6]
- t=423.3s (wall 105.9s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.5,49]
- t=425s (wall 106.3s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=429s (wall 107.3s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @153.5,75.8]
- t=430.7s (wall 107.7s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=430.7s (wall 107.7s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=431.2s (wall 107.8s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=431.6s (wall 107.9s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=431.6s (wall 107.9s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=432.6s (wall 108.2s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=434.4s (wall 108.6s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=435.4s (wall 108.9s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=445s (wall 111.3s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @872.9,319.1]
- t=445s (wall 111.3s) Phase end: dungeon shadow (65.8s game)  [overworld @872.9,319.1]
- t=445s (wall 111.3s) Phase start: restock after shadow  [overworld @872.9,319.1]
- t=445s (wall 111.3s) Phase end: restock after shadow (0.0s game)  [overworld @872.9,319.1]
- t=445.1s (wall 111.3s) Phase start: castle  [overworld @872.9,319.1]
- t=462.8s (wall 115.7s) Entered the castle  [castle:0 @32,80]
- t=466.9s (wall 116.7s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=470.9s (wall 117.7s) Final boss defeated in 4.0s (game)  [castle:1 @143.1,139.2]
- t=476.1s (wall 119.1s) VICTORY screen reached  [castle:1 @143.1,139.2]
- t=476.1s (wall 119.1s) QA agent finished: victory  [castle:1 @143.1,139.2]

## Agent-side notes (not game bugs)

- t=273s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
