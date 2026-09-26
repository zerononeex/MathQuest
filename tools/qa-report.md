# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T23:53:01.426Z | wall 120.8s | game time 475.7s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 13, gold 65, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @153.5s), Boomerang (50g @153.6s)
- Kills 63, pots/bushes 39, sword swings 96, ranged shots 60, math solved 30 (locks 9), revives 3, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.7 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.1 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 85.6 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 64.5 |

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
- t=7.1s (wall 1.8s) Opened dialogue with Curious Kid (3 lines)  [overworld @1881.5,1248.3]
- t=7.9s (wall 2s) Dialogue dismissed after 3 presses  [overworld @1881.5,1248.3]
- t=8.1s (wall 2s) Phase end: npc dialogue (2.0s game)  [overworld @1881.5,1265]
- t=8.1s (wall 2s) Phase start: farm gold/XP  [overworld @1881.5,1265]
- t=21.2s (wall 5.3s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1818.2,1660.2]
- t=33.2s (wall 8.3s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2087.9,1666.2]
- t=47.1s (wall 11.8s) Level up -> Lv 4, chose +1 Attack  [overworld @2421.9,1394.1]
- t=60s (wall 15s) Level up -> Lv 5, chose +1 Attack  [overworld @2110.8,1080.1]
- t=87.3s (wall 21.8s) Level up -> Lv 6, chose +1 Attack  [overworld @2681.3,1801.7]
- t=103.9s (wall 26s) Level up -> Lv 7, chose +1 Attack  [overworld @2102.7,2085.8]
- t=115.5s (wall 28.9s) Level up -> Lv 8, chose +1 Attack  [overworld @1616,1946.2]
- t=135.3s (wall 33.8s) Level up -> Lv 9, chose +1 Attack  [overworld @1001.1,1870.1]
- t=135.8s (wall 34s) Farming done: gold 0 -> 80, level 9, kills 33, pots 30  [overworld @998.8,1865.4]
- t=135.8s (wall 34s) Phase end: farm gold/XP (127.6s game)  [overworld @998.8,1865.4]
- t=135.8s (wall 34s) Phase start: shop  [overworld @998.8,1865.4]
- t=152.9s (wall 38.2s) Entered Shop with 83 gold  [interior:Shop @120,140.8]
- t=153.2s (wall 38.3s) Shop opened  [interior:Shop @120,107.5]
- t=153.5s (wall 38.4s) Bought Sharp Sword for 30g (gold 83 -> 53)  [interior:Shop @120,107.5]
- t=153.6s (wall 38.4s) Bought Boomerang for 50g (gold 53 -> 3)  [interior:Shop @120,107.5]
- t=154.9s (wall 38.7s) Left shop (gold 3)  [overworld @2022.1,1358.4]
- t=154.9s (wall 38.7s) Phase end: shop (19.1s game)  [overworld @2022.1,1358.4]
- t=154.9s (wall 38.8s) Phase start: dungeon forest  [overworld @2022.1,1358.4]
- t=176.3s (wall 44.1s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=184.6s (wall 46.2s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.2,46.7]
- t=186.3s (wall 46.6s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=188.5s (wall 47.2s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=189.9s (wall 47.5s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=189.9s (wall 47.5s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=190.8s (wall 47.7s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=191.2s (wall 47.8s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=191.2s (wall 47.8s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=192.2s (wall 48.1s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=194s (wall 48.5s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=195s (wall 48.8s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=204.6s (wall 51.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.4,1022.8]
- t=205.4s (wall 51.4s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=206.3s (wall 51.6s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.4,1023.8]
- t=206.3s (wall 51.6s) Phase end: dungeon forest (51.4s game)  [overworld @360.4,1023.8]
- t=206.3s (wall 51.6s) Phase start: restock after forest  [overworld @360.4,1023.8]
- t=206.3s (wall 51.6s) Phase end: restock after forest (0.0s game)  [overworld @360.4,1023.8]
- t=206.3s (wall 51.6s) Phase start: dungeon fire  [overworld @360.4,1023.8]
- t=253.8s (wall 63.5s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=258.5s (wall 64.7s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179,48.2]
- t=260.2s (wall 65.1s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=260.7s (wall 65.2s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:1 @76.3,108.3]
- t=278.3s (wall 69.6s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=279.7s (wall 69.9s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=279.7s (wall 69.9s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=281.1s (wall 70.3s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @63.8,68.2]
- t=281.1s (wall 70.3s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @63.8,68.2]
- t=281.6s (wall 70.4s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=283.7s (wall 70.9s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=284.7s (wall 71.2s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=294.5s (wall 73.6s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.7,414.8]
- t=294.5s (wall 73.6s) Phase end: dungeon fire (88.1s game)  [overworld @3433.7,414.8]
- t=294.5s (wall 73.6s) Phase start: restock after fire  [overworld @3433.7,414.8]
- t=294.5s (wall 73.6s) Phase end: restock after fire (0.0s game)  [overworld @3433.7,414.8]
- t=294.5s (wall 73.6s) Phase start: dungeon water  [overworld @3433.7,414.8]
- t=300.7s (wall 75.2s) Level up -> Lv 12, chose +1 Attack  [overworld @3448.7,802.4]
- t=340.4s (wall 85.1s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.3,2087.7]
- t=344.5s (wall 86.1s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=354.5s (wall 88.6s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.8,47.2]
- t=356.2s (wall 89.1s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=364.2s (wall 91.1s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=365.4s (wall 91.4s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=365.4s (wall 91.4s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=366.3s (wall 91.6s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=366.7s (wall 91.7s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=366.7s (wall 91.7s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=367.7s (wall 91.9s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=369.5s (wall 92.4s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=370.5s (wall 92.7s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=380.1s (wall 95.1s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793,2385.4]
- t=380.1s (wall 95.1s) Phase end: dungeon water (85.6s game)  [overworld @793,2385.4]
- t=380.2s (wall 95.1s) Phase start: restock after water  [overworld @793,2385.4]
- t=380.2s (wall 95.1s) Phase end: restock after water (0.0s game)  [overworld @793,2385.4]
- t=380.2s (wall 95.1s) Phase start: dungeon shadow  [overworld @793,2385.4]
- t=414.7s (wall 103.7s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=415.8s (wall 104s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:0 @53.3,73.8]
- t=422s (wall 105.5s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.2,48.4]
- t=423.7s (wall 105.9s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=428.1s (wall 107.1s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @118.5,69.5]
- t=430.2s (wall 107.6s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=430.2s (wall 107.6s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=430.7s (wall 107.7s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=431.6s (wall 107.9s) Shadow Dungeon: boss defeated in 1.4s (game)  [dungeon:shadow:2 @76.6,67]
- t=431.6s (wall 107.9s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @76.6,67]
- t=432.2s (wall 108.1s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @124.2,93]
- t=434s (wall 108.5s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=435s (wall 108.8s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=444.6s (wall 111.2s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.9,319.6]
- t=444.6s (wall 111.2s) Phase end: dungeon shadow (64.5s game)  [overworld @873.9,319.6]
- t=444.6s (wall 111.2s) Phase start: restock after shadow  [overworld @873.9,319.6]
- t=444.6s (wall 111.2s) Phase end: restock after shadow (0.0s game)  [overworld @873.9,319.6]
- t=444.7s (wall 111.2s) Phase start: castle  [overworld @873.9,319.6]
- t=462.4s (wall 115.6s) Entered the castle  [castle:0 @32,80]
- t=466.5s (wall 116.6s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=470.5s (wall 117.6s) Final boss defeated in 4.0s (game)  [castle:1 @213.3,88.5]
- t=475.7s (wall 119s) VICTORY screen reached  [castle:1 @213.3,88.5]
- t=475.7s (wall 119s) QA agent finished: victory  [castle:1 @213.3,88.5]

## Agent-side notes (not game bugs)

- t=275.1s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
