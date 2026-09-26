# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T19:37:19.088Z | wall 98.6s | game time 386.1s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 105 milestones, 0 agent-side notes

## Progress

- Level 14, hearts 8/9, attack 12, gold 72, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @165.8s), Boomerang (50g @166s)
- Kills 58, pots/bushes 45, sword swings 89, ranged shots 21, math solved 36, revives 2, level-ups 13
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 40.3 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.3 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 58.8 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 52.7 |

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
- t=13.1s (wall 3.4s) Opened dialogue with Villager (3 lines)  [overworld @1511.6,1220.1]
- t=14s (wall 3.6s) Dialogue dismissed after 3 presses  [overworld @1511.6,1220.1]
- t=14.1s (wall 3.6s) Phase end: npc dialogue (5.6s game)  [overworld @1511.6,1236.8]
- t=14.2s (wall 3.6s) Phase start: farm gold/XP  [overworld @1511.6,1236.8]
- t=30.9s (wall 7.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1367.2,1305.4]
- t=43.7s (wall 11s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1166.8,784.3]
- t=56.8s (wall 14.3s) Level up -> Lv 4, chose +1 Attack  [overworld @1346.7,535.8]
- t=70.3s (wall 17.7s) Level up -> Lv 5, chose +1 Attack  [overworld @1808.1,886.3]
- t=87s (wall 21.8s) Level up -> Lv 6, chose +1 Attack  [overworld @1750.1,1669]
- t=128.1s (wall 32.1s) Level up -> Lv 7, chose +1 Attack  [overworld @2228.3,856.8]
- t=156.8s (wall 39.3s) Farming done: gold 0 -> 80, level 7, kills 29, pots 36  [overworld @1650.5,351.2]
- t=156.8s (wall 39.3s) Phase end: farm gold/XP (142.6s game)  [overworld @1650.5,351.2]
- t=156.8s (wall 39.3s) Phase start: shop  [overworld @1650.5,351.2]
- t=165.2s (wall 41.4s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=165.6s (wall 41.5s) Shop opened  [interior:Shop @120,107.5]
- t=165.8s (wall 41.6s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=166s (wall 41.6s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=167.3s (wall 41.9s) Left shop (gold 0)  [overworld @1702.2,1070.5]
- t=167.3s (wall 41.9s) Phase end: shop (10.5s game)  [overworld @1702.2,1070.5]
- t=167.3s (wall 41.9s) Phase start: dungeon forest  [overworld @1702.2,1070.5]
- t=179.9s (wall 45.1s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=180.5s (wall 45.2s) Level up -> Lv 8, chose +1 Attack  [dungeon:forest:0 @32,80]
- t=188.3s (wall 47.2s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.2,46.7]
- t=190.1s (wall 47.6s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=192.3s (wall 48.2s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=193.6s (wall 48.5s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=193.6s (wall 48.5s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=194.6s (wall 48.7s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @111.7,81.3]
- t=195s (wall 48.8s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @112.9,80.1]
- t=195s (wall 48.8s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @112.9,80.1]
- t=195.2s (wall 48.9s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @124.7,91.9]
- t=197s (wall 49.3s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=198s (wall 49.6s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=207.6s (wall 52s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @728.8,863.2]
- t=208.4s (wall 52.2s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=209.3s (wall 52.4s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @728.8,862.5]
- t=209.3s (wall 52.4s) Phase end: dungeon forest (42.0s game)  [overworld @728.8,862.5]
- t=209.3s (wall 52.4s) Phase start: restock after forest  [overworld @728.8,862.5]
- t=209.3s (wall 52.4s) Phase end: restock after forest (0.0s game)  [overworld @728.8,862.5]
- t=209.3s (wall 52.4s) Phase start: dungeon fire  [overworld @728.8,862.5]
- t=230.5s (wall 57.7s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=235.2s (wall 58.9s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180,47.2]
- t=237s (wall 59.3s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=239s (wall 59.8s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:1 @137,105.9]
- t=242.9s (wall 60.8s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.4,57.9]
- t=244.3s (wall 61.2s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=244.3s (wall 61.2s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=245.8s (wall 61.5s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @86.6,80.7]
- t=245.8s (wall 61.5s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @86.6,80.7]
- t=245.9s (wall 61.6s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @91.3,92.1]
- t=248.1s (wall 62.1s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=249s (wall 62.4s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=258.7s (wall 64.8s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2512.2,1143.5]
- t=258.7s (wall 64.8s) Phase end: dungeon fire (49.3s game)  [overworld @2512.2,1143.5]
- t=258.7s (wall 64.8s) Phase start: restock after fire  [overworld @2512.2,1143.5]
- t=258.7s (wall 64.8s) Phase end: restock after fire (0.0s game)  [overworld @2512.2,1143.5]
- t=258.7s (wall 64.8s) Phase start: dungeon water  [overworld @2512.2,1143.5]
- t=274.7s (wall 68.8s) Level up -> Lv 11, chose +1 Attack  [overworld @1357.9,1583.6]
- t=282.4s (wall 70.7s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=292.3s (wall 73.2s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.4,48.2]
- t=294s (wall 73.6s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=296.7s (wall 74.3s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:1 @171.9,46]
- t=301.4s (wall 75.5s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=302.7s (wall 75.8s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=302.7s (wall 75.8s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=304.5s (wall 76.2s) Water Dungeon: boss defeated in 1.9s (game)  [dungeon:water:2 @81.6,67]
- t=304.5s (wall 76.2s) Water Dungeon: got the Boss Key  [dungeon:water:2 @81.6,67]
- t=305s (wall 76.4s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @124.2,93]
- t=306.9s (wall 76.8s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=307.8s (wall 77.1s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=317.5s (wall 79.5s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1055.8,1880.3]
- t=317.5s (wall 79.5s) Phase end: dungeon water (58.8s game)  [overworld @1055.8,1880.3]
- t=317.5s (wall 79.5s) Phase start: restock after water  [overworld @1055.8,1880.3]
- t=317.5s (wall 79.5s) Phase end: restock after water (0.0s game)  [overworld @1055.8,1880.3]
- t=317.5s (wall 79.5s) Phase start: dungeon shadow  [overworld @1055.8,1880.3]
- t=340.4s (wall 85.2s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=341.5s (wall 85.5s) Level up -> Lv 13, chose +1 Attack  [dungeon:shadow:0 @55.7,74.1]
- t=348.5s (wall 87.2s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.6,47.1]
- t=350.3s (wall 87.7s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=353.9s (wall 88.6s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @157.6,81]
- t=355.5s (wall 89s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=355.5s (wall 89s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=356.4s (wall 89.2s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=356.8s (wall 89.3s) Shadow Dungeon: boss defeated in 1.3s (game)  [dungeon:shadow:2 @32,80]
- t=356.8s (wall 89.3s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=357.8s (wall 89.5s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=359.6s (wall 90s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=360.6s (wall 90.2s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=370.2s (wall 92.6s) Exited Shadow Dungeon to the overworld at (100,13)  [overworld @1607.5,223]
- t=370.2s (wall 92.6s) Phase end: dungeon shadow (52.7s game)  [overworld @1607.5,223]
- t=370.2s (wall 92.6s) Phase start: restock after shadow  [overworld @1607.5,223]
- t=370.2s (wall 92.6s) Phase end: restock after shadow (0.0s game)  [overworld @1607.5,223]
- t=370.2s (wall 92.7s) Phase start: castle  [overworld @1607.5,223]
- t=372.4s (wall 93.2s) Entered the castle  [castle:0 @32,80]
- t=376.7s (wall 94.3s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=380.9s (wall 95.3s) Final boss defeated in 4.2s (game)  [castle:1 @165.1,51]
- t=386.1s (wall 96.6s) VICTORY screen reached  [castle:1 @165.1,51]
- t=386.1s (wall 96.6s) QA agent finished: victory  [castle:1 @165.1,51]

## Agent-side notes (not game bugs)

_none_

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
