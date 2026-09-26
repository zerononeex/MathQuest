# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T16:26:50.966Z | wall 100.9s | game time 397.9s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 104 milestones, 0 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 11, gold 54, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @187.6s), Boomerang (50g @187.7s)
- Kills 49, pots/bushes 55, sword swings 65, ranged shots 31, math solved 33, revives 1, level-ups 12
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 38.4 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 51 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 52.5 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.8 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1600,1152]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1600,1152]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1600,1152]
- t=7.9s (wall 2.1s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1181.2,1032.5]
- t=8.5s (wall 2.3s) Tap-to-move reached target (1 facing changes)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase end: calibrate (8.5s game)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase start: npc dialogue  [overworld @1234.9,1055.1]
- t=11.3s (wall 3.1s) Opened dialogue with Mustachioed Wanderer (3 lines)  [overworld @1446.6,1111.8]
- t=12.2s (wall 3.3s) Dialogue dismissed after 3 presses  [overworld @1446.6,1111.8]
- t=12.3s (wall 3.4s) Phase end: npc dialogue (3.8s game)  [overworld @1446.6,1128.5]
- t=12.4s (wall 3.4s) Phase start: farm gold/XP  [overworld @1446.6,1128.5]
- t=25.1s (wall 6.5s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1489.8,1374.3]
- t=40.4s (wall 10.4s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1821.5,1216.1]
- t=56.8s (wall 14.5s) Level up -> Lv 4, chose +1 Attack  [overworld @1431.8,696.3]
- t=79s (wall 20s) Level up -> Lv 5, chose +1 Attack  [overworld @1790.7,1411.7]
- t=134.6s (wall 33.9s) Level up -> Lv 6, chose +1 Attack  [overworld @1326.7,1560]
- t=167.2s (wall 42.1s) Level up -> Lv 7, chose +1 Attack  [overworld @599.7,1759.5]
- t=168.4s (wall 42.4s) Farming done: gold 0 -> 84, level 7, kills 26, pots 44  [overworld @571.3,1730.4]
- t=168.4s (wall 42.4s) Phase end: farm gold/XP (156.1s game)  [overworld @571.3,1730.4]
- t=168.5s (wall 42.4s) Phase start: shop  [overworld @571.3,1730.4]
- t=187.3s (wall 47.1s) Entered Shop with 84 gold  [interior:Shop @72,76.8]
- t=187.3s (wall 47.1s) Shop opened  [interior:Shop @72,76.8]
- t=187.6s (wall 47.2s) Bought Sharp Sword for 30g (gold 84 -> 54)  [interior:Shop @72,76.8]
- t=187.7s (wall 47.2s) Bought Boomerang for 50g (gold 54 -> 4)  [interior:Shop @72,76.8]
- t=188.7s (wall 47.4s) Left shop (gold 4)  [overworld @1702.9,1071.4]
- t=188.7s (wall 47.4s) Phase end: shop (20.2s game)  [overworld @1702.9,1071.4]
- t=188.7s (wall 47.4s) Phase start: dungeon forest  [overworld @1702.9,1071.4]
- t=201.3s (wall 50.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=207s (wall 52s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @179.7,48.7]
- t=208.6s (wall 52.4s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=209.2s (wall 52.6s) Level up -> Lv 8, chose +1 Attack  [dungeon:forest:1 @67.6,110.6]
- t=211s (wall 53s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,80.4]
- t=212.4s (wall 53.4s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=212.4s (wall 53.4s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=213.3s (wall 53.6s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=213.7s (wall 53.7s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=213.7s (wall 53.7s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=214.7s (wall 53.9s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=216.5s (wall 54.4s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=217.5s (wall 54.6s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=227.1s (wall 57s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729.6,862.4]
- t=227.9s (wall 57.2s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=228.8s (wall 57.5s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @729.6,863.4]
- t=228.8s (wall 57.5s) Phase end: dungeon forest (40.1s game)  [overworld @729.6,863.4]
- t=228.8s (wall 57.5s) Phase start: restock after forest  [overworld @729.6,863.4]
- t=228.8s (wall 57.5s) Phase end: restock after forest (0.0s game)  [overworld @729.6,863.4]
- t=228.8s (wall 57.5s) Phase start: dungeon fire  [overworld @729.6,863.4]
- t=251.1s (wall 63s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=256.7s (wall 64.4s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179.4,47.7]
- t=258.5s (wall 64.9s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=262.6s (wall 65.9s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.3,57.6]
- t=264s (wall 66.3s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=264s (wall 66.3s) Fire Dungeon: boss fight vs malrek (hp 30)  [dungeon:fire:2 @32,80]
- t=265.9s (wall 66.8s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=266.7s (wall 67s) Fire Dungeon: boss defeated in 2.8s (game)  [dungeon:fire:2 @66.6,67]
- t=266.7s (wall 67s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @66.6,67]
- t=267.2s (wall 67.1s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @104.2,93]
- t=269.2s (wall 67.6s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=270.2s (wall 67.8s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=279.8s (wall 70.3s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2512.7,1144.7]
- t=279.8s (wall 70.3s) Phase end: dungeon fire (51.0s game)  [overworld @2512.7,1144.7]
- t=279.8s (wall 70.3s) Phase start: restock after fire  [overworld @2512.7,1144.7]
- t=279.8s (wall 70.3s) Phase end: restock after fire (0.0s game)  [overworld @2512.7,1144.7]
- t=279.9s (wall 70.3s) Phase start: dungeon water  [overworld @2512.7,1144.7]
- t=302.3s (wall 75.9s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=310.9s (wall 78s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.6,48.5]
- t=312.5s (wall 78.4s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=316.5s (wall 79.4s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.1,104.7]
- t=317.7s (wall 79.7s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=317.7s (wall 79.7s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=318.6s (wall 80s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=319s (wall 80.1s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=319s (wall 80.1s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=320s (wall 80.3s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=321.8s (wall 80.8s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=322.8s (wall 81s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=332.4s (wall 83.4s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1049.3,1872.3]
- t=332.4s (wall 83.4s) Phase end: dungeon water (52.5s game)  [overworld @1049.3,1872.3]
- t=332.4s (wall 83.4s) Phase start: restock after water  [overworld @1049.3,1872.3]
- t=332.4s (wall 83.4s) Phase end: restock after water (0.0s game)  [overworld @1049.3,1872.3]
- t=332.4s (wall 83.4s) Phase start: dungeon shadow  [overworld @1049.3,1872.3]
- t=356s (wall 89.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=360.8s (wall 90.5s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.5,46.8]
- t=362.5s (wall 90.9s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=363.8s (wall 91.3s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @81.6,56.4]
- t=365.6s (wall 91.7s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @137.2,66.1]
- t=367.5s (wall 92.2s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=367.5s (wall 92.2s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=369.3s (wall 92.6s) Shadow Dungeon: boss defeated in 1.8s (game)  [dungeon:shadow:2 @75,67]
- t=369.3s (wall 92.6s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @75,67]
- t=369.9s (wall 92.8s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @124.2,93]
- t=371.7s (wall 93.2s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=372.7s (wall 93.5s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=382.3s (wall 95.9s) Exited Shadow Dungeon to the overworld at (99,13)  [overworld @1584.5,216.5]
- t=382.3s (wall 95.9s) Phase end: dungeon shadow (49.8s game)  [overworld @1584.5,216.5]
- t=382.3s (wall 95.9s) Phase start: restock after shadow  [overworld @1584.5,216.5]
- t=382.3s (wall 95.9s) Phase end: restock after shadow (0.0s game)  [overworld @1584.5,216.5]
- t=382.3s (wall 95.9s) Phase start: castle  [overworld @1584.5,216.5]
- t=384.4s (wall 96.4s) Entered the castle  [castle:0 @32,80]
- t=386s (wall 96.8s) Level up -> Lv 15, chose +1 Attack  [castle:0 @103.3,77.7]
- t=388.6s (wall 97.5s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=392.7s (wall 98.5s) Final boss defeated in 4.1s (game)  [castle:1 @223.9,114.6]
- t=397.9s (wall 99.8s) VICTORY screen reached  [castle:1 @223.9,114.6]
- t=397.9s (wall 99.8s) QA agent finished: victory  [castle:1 @223.9,114.6]

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
- Wall time 100.9s, timeScale x4, 4 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
