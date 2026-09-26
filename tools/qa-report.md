# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T17:15:27.845Z | wall 100.9s | game time 396s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 105 milestones, 1 agent-side notes

## Progress

- Level 14, hearts 7/9, attack 12, gold 70, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @161.5s), Boomerang (50g @161.6s)
- Kills 55, pots/bushes 37, sword swings 98, ranged shots 54, math solved 54, revives 2, level-ups 13
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 42.9 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 57.3 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 53.5 |

## CRITICAL (0)

_none_

## WARNING (0)

_none_

## Milestone timeline (INFO)

- t=0s (wall 0s) QA agent v1.0.0 started (timeScale x4, step hook on)  [overworld @1600,1152]
- t=0s (wall 0s) Game started (difficulty ADVENTURER)  [overworld @1600,1152]
- t=0s (wall 0s) Phase start: calibrate  [overworld @1600,1152]
- t=7.9s (wall 2.2s) Movement calibration: cardinal 100.0px/s, diagonal 100.0px/s  [overworld @1181.2,1032.5]
- t=8.5s (wall 2.3s) Tap-to-move reached target (1 facing changes)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase end: calibrate (8.5s game)  [overworld @1234.9,1055.1]
- t=8.5s (wall 2.3s) Phase start: npc dialogue  [overworld @1234.9,1055.1]
- t=13.4s (wall 3.5s) Opened dialogue with Mustachioed Wanderer (3 lines)  [overworld @1526.6,1225.1]
- t=14.2s (wall 3.8s) Dialogue dismissed after 3 presses  [overworld @1526.6,1225.1]
- t=14.4s (wall 3.8s) Phase end: npc dialogue (5.9s game)  [overworld @1526.6,1241.8]
- t=14.4s (wall 3.8s) Phase start: farm gold/XP  [overworld @1526.6,1241.8]
- t=31.8s (wall 8.1s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1370.1,1305.9]
- t=44s (wall 11.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1163.5,792.6]
- t=62.4s (wall 15.8s) Level up -> Lv 4, chose +1 Attack  [overworld @1349.5,618.7]
- t=79.3s (wall 20s) Level up -> Lv 5, chose +1 Attack  [overworld @1806.5,877.7]
- t=98.5s (wall 24.8s) Level up -> Lv 6, chose +1 Attack  [overworld @1978.5,1128.6]
- t=120.8s (wall 30.4s) Level up -> Lv 7, chose +1 Attack  [overworld @1831,428.6]
- t=149.8s (wall 37.6s) Farming done: gold 0 -> 82, level 7, kills 28, pots 28  [overworld @900.4,834.1]
- t=149.8s (wall 37.6s) Phase end: farm gold/XP (135.4s game)  [overworld @900.4,834.1]
- t=149.8s (wall 37.7s) Phase start: shop  [overworld @900.4,834.1]
- t=160.9s (wall 40.4s) Entered Shop with 82 gold  [interior:Shop @120,140.8]
- t=161.2s (wall 40.5s) Shop opened  [interior:Shop @120,107.5]
- t=161.5s (wall 40.6s) Bought Sharp Sword for 30g (gold 82 -> 52)  [interior:Shop @120,107.5]
- t=161.6s (wall 40.6s) Bought Boomerang for 50g (gold 52 -> 2)  [interior:Shop @120,107.5]
- t=162.9s (wall 40.9s) Left shop (gold 2)  [overworld @1702,1071.7]
- t=162.9s (wall 40.9s) Phase end: shop (13.1s game)  [overworld @1702,1071.7]
- t=162.9s (wall 40.9s) Phase start: dungeon forest  [overworld @1702,1071.7]
- t=175.6s (wall 44.1s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=176.1s (wall 44.2s) Level up -> Lv 8, chose +1 Attack  [dungeon:forest:0 @64.1,81.3]
- t=185.7s (wall 46.6s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.8,48.8]
- t=187.3s (wall 47s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=189.8s (wall 47.6s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,80]
- t=191.1s (wall 48s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=191.1s (wall 48s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=192s (wall 48.2s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=192.4s (wall 48.3s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=192.4s (wall 48.3s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=193.4s (wall 48.6s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=195.2s (wall 49s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=196.2s (wall 49.3s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=205.8s (wall 51.7s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @728.7,862.7]
- t=206.6s (wall 51.9s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=207.5s (wall 52.1s) Exited Forest Dungeon to the overworld at (45,53)  [overworld @728.7,863.7]
- t=207.5s (wall 52.1s) Phase end: dungeon forest (44.6s game)  [overworld @728.7,863.7]
- t=207.5s (wall 52.1s) Phase start: restock after forest  [overworld @728.7,863.7]
- t=207.5s (wall 52.1s) Phase end: restock after forest (0.0s game)  [overworld @728.7,863.7]
- t=207.5s (wall 52.1s) Phase start: dungeon fire  [overworld @728.7,863.7]
- t=228.7s (wall 57.4s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=233.4s (wall 58.5s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180,47.2]
- t=235.2s (wall 59s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=253.4s (wall 63.5s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.2,57.4]
- t=254.7s (wall 63.9s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=254.7s (wall 63.9s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=255.5s (wall 64.1s) Level up -> Lv 10, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=256.2s (wall 64.3s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @62.1,68.2]
- t=256.2s (wall 64.3s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @62.1,68.2]
- t=256.7s (wall 64.4s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=258.8s (wall 64.9s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=259.7s (wall 65.1s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=269.5s (wall 67.6s) Exited Fire Dungeon to the overworld at (157,71)  [overworld @2512,1143.1]
- t=269.5s (wall 67.6s) Phase end: dungeon fire (62.0s game)  [overworld @2512,1143.1]
- t=269.6s (wall 67.6s) Phase start: restock after fire  [overworld @2512,1143.1]
- t=269.6s (wall 67.6s) Phase end: restock after fire (0.0s game)  [overworld @2512,1143.1]
- t=269.6s (wall 67.6s) Phase start: dungeon water  [overworld @2512,1143.1]
- t=289.6s (wall 72.6s) Level up -> Lv 11, chose +1 Attack  [overworld @1097.9,1671.7]
- t=293.1s (wall 73.5s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=302.4s (wall 75.8s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.2,46.9]
- t=304.2s (wall 76.3s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=311.7s (wall 78.1s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=312.9s (wall 78.4s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=312.9s (wall 78.4s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=313.8s (wall 78.7s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:2 @111.7,81.3]
- t=314.3s (wall 78.8s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @112.9,80.1]
- t=314.3s (wall 78.8s) Water Dungeon: got the Boss Key  [dungeon:water:2 @112.9,80.1]
- t=314.4s (wall 78.8s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @124.7,91.9]
- t=316.3s (wall 79.3s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=317.2s (wall 79.5s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=326.9s (wall 81.9s) Exited Water Dungeon to the overworld at (65,117)  [overworld @1055,1880.5]
- t=326.9s (wall 81.9s) Phase end: dungeon water (57.3s game)  [overworld @1055,1880.5]
- t=326.9s (wall 81.9s) Phase start: restock after water  [overworld @1055,1880.5]
- t=326.9s (wall 81.9s) Phase end: restock after water (0.0s game)  [overworld @1055,1880.5]
- t=326.9s (wall 81.9s) Phase start: dungeon shadow  [overworld @1055,1880.5]
- t=349.8s (wall 87.7s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=354s (wall 88.7s) Level up -> Lv 13, chose +1 Attack  [dungeon:shadow:0 @212.7,116.4]
- t=358.6s (wall 89.9s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.6,47]
- t=360.4s (wall 90.3s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=363.8s (wall 91.1s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @131.1,69.6]
- t=365.7s (wall 91.6s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=365.7s (wall 91.6s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=366.6s (wall 91.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:2 @32,80]
- t=367s (wall 92s) Shadow Dungeon: boss defeated in 1.3s (game)  [dungeon:shadow:2 @32,80]
- t=367s (wall 92s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=368s (wall 92.2s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=369.8s (wall 92.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=370.8s (wall 92.9s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=380.4s (wall 95.3s) Exited Shadow Dungeon to the overworld at (100,13)  [overworld @1606.7,223.2]
- t=380.4s (wall 95.3s) Phase end: dungeon shadow (53.5s game)  [overworld @1606.7,223.2]
- t=380.4s (wall 95.3s) Phase start: restock after shadow  [overworld @1606.7,223.2]
- t=380.4s (wall 95.3s) Phase end: restock after shadow (0.0s game)  [overworld @1606.7,223.2]
- t=380.5s (wall 95.3s) Phase start: castle  [overworld @1606.7,223.2]
- t=382.7s (wall 95.9s) Entered the castle  [castle:0 @32,80]
- t=386.8s (wall 96.9s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=390.8s (wall 97.9s) Final boss defeated in 4.0s (game)  [castle:1 @271,163.4]
- t=396s (wall 99.2s) VICTORY screen reached  [castle:1 @271,163.4]
- t=396s (wall 99.2s) QA agent finished: victory  [castle:1 @271,163.4]

## Agent-side notes (not game bugs)

- t=250.2s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
