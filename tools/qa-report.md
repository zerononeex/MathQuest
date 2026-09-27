# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T01:04:50.635Z | wall 122.8s | game time 483.6s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 109 milestones, 1 agent-side notes

## Progress

- Level 17, hearts 9/9, attack 15, gold 72, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @168.9s), Boomerang (50g @169s)
- Kills 71, pots/bushes 39, sword swings 106, ranged shots 60, math solved 20 (locks 9), revives 2, level-ups 16
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 52.4 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.3 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 85.6 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 56.3 |

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
- t=8.6s (wall 2.2s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1390]
- t=9.4s (wall 2.4s) Dialogue dismissed after 3 presses  [overworld @1991.5,1390]
- t=9.6s (wall 2.4s) Phase end: npc dialogue (3.5s game)  [overworld @1991.5,1406.7]
- t=9.6s (wall 2.4s) Phase start: farm gold/XP  [overworld @1991.5,1406.7]
- t=28.2s (wall 7.1s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2091.4,1708.8]
- t=35.4s (wall 8.9s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2176.2,1522.9]
- t=56.9s (wall 14.3s) Level up -> Lv 4, chose +1 Attack  [overworld @2212.2,988.5]
- t=77.3s (wall 19.4s) Level up -> Lv 5, chose +1 Attack  [overworld @1642.1,838.8]
- t=98.9s (wall 24.8s) Level up -> Lv 6, chose +1 Attack  [overworld @1672,1606.8]
- t=113.6s (wall 28.4s) Level up -> Lv 7, chose +1 Attack  [overworld @1661.4,1893.1]
- t=138.2s (wall 34.6s) Level up -> Lv 8, chose +1 Attack  [overworld @1095.3,1451.2]
- t=151.7s (wall 38s) Level up -> Lv 9, chose +1 Attack  [overworld @1081.2,1941.4]
- t=152.2s (wall 38.1s) Farming done: gold 0 -> 80, level 9, kills 34, pots 30  [overworld @1082.4,1940.2]
- t=152.2s (wall 38.1s) Phase end: farm gold/XP (142.5s game)  [overworld @1082.4,1940.2]
- t=152.2s (wall 38.1s) Phase start: shop  [overworld @1082.4,1940.2]
- t=168.3s (wall 42.1s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=168.6s (wall 42.2s) Shop opened  [interior:Shop @120,107.5]
- t=168.9s (wall 42.3s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=169s (wall 42.3s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=170.3s (wall 42.6s) Left shop (gold 0)  [overworld @2022.4,1359.6]
- t=170.3s (wall 42.6s) Phase end: shop (18.1s game)  [overworld @2022.4,1359.6]
- t=170.3s (wall 42.6s) Phase start: dungeon forest  [overworld @2022.4,1359.6]
- t=194.1s (wall 48.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=202.8s (wall 50.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.2,49]
- t=204.4s (wall 51.2s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=206.6s (wall 51.7s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=208s (wall 52s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=208s (wall 52s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=208.9s (wall 52.3s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=209.3s (wall 52.4s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=209.3s (wall 52.4s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=210.3s (wall 52.6s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=212.1s (wall 53.1s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=213.1s (wall 53.3s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=222.7s (wall 55.7s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @376.8,1022.8]
- t=223.7s (wall 56s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=224.6s (wall 56.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.8,1023.8]
- t=224.6s (wall 56.2s) Phase end: dungeon forest (54.2s game)  [overworld @361.8,1023.8]
- t=224.6s (wall 56.2s) Phase start: restock after forest  [overworld @361.8,1023.8]
- t=224.6s (wall 56.2s) Phase end: restock after forest (0.0s game)  [overworld @361.8,1023.8]
- t=224.6s (wall 56.2s) Phase start: dungeon fire  [overworld @361.8,1023.8]
- t=270.9s (wall 67.8s) Level up -> Lv 11, chose +1 Attack  [overworld @3483.3,395.6]
- t=272.3s (wall 68.1s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=276.9s (wall 69.3s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.8,48.4]
- t=278.5s (wall 69.7s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=296.6s (wall 74.2s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.7,56.8]
- t=298s (wall 74.6s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=298s (wall 74.6s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=298.8s (wall 74.7s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=299.5s (wall 74.9s) Fire Dungeon: boss defeated in 1.4s (game)  [dungeon:fire:2 @57.6,69.4]
- t=299.5s (wall 74.9s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @57.6,69.4]
- t=300s (wall 75s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.8,93]
- t=302.1s (wall 75.6s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=303s (wall 75.8s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=312.8s (wall 78.3s) Exited Fire Dungeon to the overworld at (215,25)  [overworld @3455,408.3]
- t=312.8s (wall 78.3s) Phase end: dungeon fire (88.3s game)  [overworld @3455,408.3]
- t=312.9s (wall 78.3s) Phase start: restock after fire  [overworld @3455,408.3]
- t=312.9s (wall 78.3s) Phase end: restock after fire (0.0s game)  [overworld @3455,408.3]
- t=312.9s (wall 78.3s) Phase start: dungeon water  [overworld @3455,408.3]
- t=359.1s (wall 89.8s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.6,2088.6]
- t=363.2s (wall 90.8s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=367.1s (wall 91.8s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @80.3,75.1]
- t=373.1s (wall 93.3s) Water Dungeon: got the Small Key  [dungeon:water:0 @180.3,46.8]
- t=374.9s (wall 93.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=382.5s (wall 95.7s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199,104.8]
- t=383.7s (wall 96s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=383.7s (wall 96s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=384.6s (wall 96.2s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @32,80]
- t=385s (wall 96.3s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=385s (wall 96.3s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=386s (wall 96.5s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=387.8s (wall 97s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=388.8s (wall 97.2s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=398.4s (wall 99.7s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.6,2384.6]
- t=398.4s (wall 99.7s) Phase end: dungeon water (85.6s game)  [overworld @792.6,2384.6]
- t=398.5s (wall 99.7s) Phase start: restock after water  [overworld @792.6,2384.6]
- t=398.5s (wall 99.7s) Phase end: restock after water (0.0s game)  [overworld @792.6,2384.6]
- t=398.5s (wall 99.7s) Phase start: dungeon shadow  [overworld @792.6,2384.6]
- t=424.9s (wall 106.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=425.1s (wall 106.3s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:0 @48.6,69.4]
- t=432.5s (wall 108.2s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.8,48.9]
- t=434.1s (wall 108.6s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=438.3s (wall 109.6s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:1 @149.8,77.6]
- t=438.7s (wall 109.7s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @152.1,75.2]
- t=440.4s (wall 110.1s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=440.4s (wall 110.1s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=441.3s (wall 110.4s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=441.3s (wall 110.4s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=442.3s (wall 110.6s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=444.1s (wall 111.1s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=445.1s (wall 111.3s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=454.7s (wall 113.7s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873,318.8]
- t=454.7s (wall 113.7s) Phase end: dungeon shadow (56.3s game)  [overworld @873,318.8]
- t=454.7s (wall 113.7s) Phase start: restock after shadow  [overworld @873,318.8]
- t=454.7s (wall 113.7s) Phase end: restock after shadow (0.0s game)  [overworld @873,318.8]
- t=454.8s (wall 113.7s) Phase start: castle  [overworld @873,318.8]
- t=462.1s (wall 115.6s) Level up -> Lv 17, chose +1 Attack  [overworld @1415.6,281]
- t=470.6s (wall 117.7s) Entered the castle  [castle:0 @32,80]
- t=474.7s (wall 118.7s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=478.4s (wall 119.6s) Final boss defeated in 3.6s (game)  [castle:1 @167.9,123.2]
- t=483.6s (wall 120.9s) VICTORY screen reached  [castle:1 @167.9,123.2]
- t=483.6s (wall 120.9s) QA agent finished: victory  [castle:1 @167.9,123.2]

## Agent-side notes (not game bugs)

- t=293.5s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
