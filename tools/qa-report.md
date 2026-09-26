# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T19:43:12.478Z | wall 100.6s | game time 401.7s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 105 milestones, 1 agent-side notes

## Progress

- Level 14, hearts 10/10, attack 12, gold 61, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @167.8s), Boomerang (50g @168s)
- Kills 58, pots/bushes 50, sword swings 88, ranged shots 64, math solved 19, revives 1, level-ups 13
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 40.6 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62.1 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 58 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 54.4 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1600,1152]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1600,1152]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1600,1152]
- t=7.9s (wall 2s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1181.2,1032.5]
- t=8.5s (wall 2.2s) Tap-to-move reached target (1 facing changes)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.2s) Phase end: calibrate (8.5s game)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.2s) Phase start: npc dialogue  [overworld @1234.9,1055.1]
- t=12.3s (wall 3.2s) Opened dialogue with Mustachioed Wanderer (3 lines)  [overworld @1478.3,1178.5]
- t=13.2s (wall 3.4s) Dialogue dismissed after 3 presses  [overworld @1478.3,1178.5]
- t=13.3s (wall 3.4s) Phase end: npc dialogue (4.8s game)  [overworld @1478.3,1195.1]
- t=13.3s (wall 3.4s) Phase start: farm gold/XP  [overworld @1478.3,1195.1]
- t=22.8s (wall 5.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1490.7,1388.3]
- t=41.6s (wall 10.5s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1796.5,1384.1]
- t=54.4s (wall 13.7s) Level up -> Lv 4, chose +1 Attack  [overworld @2063.1,1124.5]
- t=76.1s (wall 19.1s) Level up -> Lv 5, chose +1 Attack  [overworld @1334.9,712.5]
- t=97.6s (wall 24.5s) Level up -> Lv 6, chose +1 Attack  [overworld @916.5,1141.7]
- t=110.3s (wall 27.6s) Level up -> Lv 7, chose +1 Attack  [overworld @1082.1,1686.6]
- t=143.5s (wall 35.9s) Level up -> Lv 8, chose +1 Attack  [overworld @829.3,1416.4]
- t=154.4s (wall 38.7s) Farming done: gold 0 -> 80, level 8, kills 30, pots 41  [overworld @591.4,1022.7]
- t=154.4s (wall 38.7s) Phase end: farm gold/XP (141.0s game)  [overworld @591.4,1022.7]
- t=154.4s (wall 38.7s) Phase start: shop  [overworld @591.4,1022.7]
- t=167.2s (wall 41.9s) Entered Shop with 83 gold  [interior:Shop @120,140.8]
- t=167.6s (wall 42s) Shop opened  [interior:Shop @120,107.5]
- t=167.8s (wall 42s) Bought Sharp Sword for 30g (gold 83 -> 53)  [interior:Shop @120,107.5]
- t=168s (wall 42.1s) Bought Boomerang for 50g (gold 53 -> 3)  [interior:Shop @120,107.5]
- t=169.3s (wall 42.4s) Left shop (gold 3)  [overworld @1702.8,1071.6]
- t=169.3s (wall 42.4s) Phase end: shop (14.9s game)  [overworld @1702.8,1071.6]
- t=169.3s (wall 42.4s) Phase start: dungeon forest  [overworld @1702.8,1071.6]
- t=181.9s (wall 45.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=189.9s (wall 47.6s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.8,48.8]
- t=191.6s (wall 48s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=192.1s (wall 48.1s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:1 @75.8,109.5]
- t=193.9s (wall 48.5s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.2,80.7]
- t=195.2s (wall 48.9s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=195.2s (wall 48.9s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=196.1s (wall 49.1s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=196.5s (wall 49.2s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=196.5s (wall 49.2s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=197.5s (wall 49.4s) Forest Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:forest:2 @125,93]
- t=199.3s (wall 49.9s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=200.3s (wall 50.1s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=209.9s (wall 52.5s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729.4,862.6]
- t=210.7s (wall 52.7s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=211.6s (wall 53s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729.4,863.6]
- t=211.6s (wall 53s) Phase end: dungeon forest (42.3s game)  [overworld @729.4,863.6]
- t=211.6s (wall 53s) Phase start: restock after forest  [overworld @729.4,863.6]
- t=211.6s (wall 53s) Phase end: restock after forest (0.0s game)  [overworld @729.4,863.6]
- t=211.6s (wall 53s) Phase start: dungeon fire  [overworld @729.4,863.6]
- t=232.8s (wall 58.3s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=237.4s (wall 59.4s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.8,48.4]
- t=239.1s (wall 59.8s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=257.3s (wall 64.4s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.1,57.6]
- t=258.6s (wall 64.7s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=258.6s (wall 64.7s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=259.3s (wall 64.9s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=260.5s (wall 65.2s) Fire Dungeon: boss defeated in 1.9s (game)  [dungeon:fire:2 @86.2,108.3]
- t=260.5s (wall 65.2s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @86.2,108.3]
- t=260.7s (wall 65.2s) Fire Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:fire:2 @96.8,97.7]
- t=262.9s (wall 65.8s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=263.9s (wall 66s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=273.7s (wall 68.5s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2512.8,1144.6]
- t=273.7s (wall 68.5s) Phase end: dungeon fire (62.1s game)  [overworld @2512.8,1144.6]
- t=273.7s (wall 68.5s) Phase start: restock after fire  [overworld @2512.8,1144.6]
- t=273.7s (wall 68.5s) Phase end: restock after fire (0.0s game)  [overworld @2512.8,1144.6]
- t=273.7s (wall 68.5s) Phase start: dungeon water  [overworld @2512.8,1144.6]
- t=296.2s (wall 74.1s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=306.4s (wall 76.7s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.7,46.8]
- t=308.2s (wall 77.1s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=315.9s (wall 79s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.3,104.7]
- t=317.1s (wall 79.3s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=317.1s (wall 79.3s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=318s (wall 79.6s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:2 @32,80]
- t=318.4s (wall 79.7s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=318.4s (wall 79.7s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=319.4s (wall 79.9s) Water Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:water:2 @125,93]
- t=321.2s (wall 80.4s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=322.2s (wall 80.6s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=331.8s (wall 83s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1049.4,1872.2]
- t=331.8s (wall 83s) Phase end: dungeon water (58.0s game)  [overworld @1049.4,1872.2]
- t=331.8s (wall 83s) Phase start: restock after water  [overworld @1049.4,1872.2]
- t=331.8s (wall 83s) Phase end: restock after water (0.0s game)  [overworld @1049.4,1872.2]
- t=331.8s (wall 83s) Phase start: dungeon shadow  [overworld @1049.4,1872.2]
- t=348.2s (wall 87.1s) Level up -> Lv 13, chose +1 Attack  [overworld @1335.7,568]
- t=356s (wall 89.1s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=364.2s (wall 91.1s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.5,47]
- t=366s (wall 91.6s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=369.8s (wall 92.5s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @149.2,84.6]
- t=371.4s (wall 92.9s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=371.4s (wall 92.9s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=372.4s (wall 93.2s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=372.8s (wall 93.3s) Shadow Dungeon: boss defeated in 1.4s (game)  [dungeon:shadow:2 @32,80]
- t=372.8s (wall 93.3s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=373.8s (wall 93.5s) Shadow Dungeon: collected Giant Heart Piece (max hearts 10)  [dungeon:shadow:2 @125,93]
- t=375.6s (wall 94s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=376.6s (wall 94.2s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=386.2s (wall 96.6s) Exited Shadow Dungeon to the overworld at (99,13)  [overworld @1591.4,223.4]
- t=386.2s (wall 96.6s) Phase end: dungeon shadow (54.4s game)  [overworld @1591.4,223.4]
- t=386.2s (wall 96.6s) Phase start: restock after shadow  [overworld @1591.4,223.4]
- t=386.2s (wall 96.6s) Phase end: restock after shadow (0.0s game)  [overworld @1591.4,223.4]
- t=386.2s (wall 96.6s) Phase start: castle  [overworld @1591.4,223.4]
- t=388.5s (wall 97.2s) Entered the castle  [castle:0 @32,80]
- t=392.5s (wall 98.2s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=396.4s (wall 99.2s) Final boss defeated in 3.9s (game)  [castle:1 @143.1,96.8]
- t=401.7s (wall 100.5s) VICTORY screen reached  [castle:1 @143.1,96.8]
- t=401.7s (wall 100.5s) QA agent finished: victory  [castle:1 @143.1,96.8]

## Agent-side notes (not game bugs)

- t=254.1s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 100.6s, timeScale x4, 4 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
