# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T00:59:37.134Z | wall 140.9s | game time 560.8s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 108 milestones, 1 agent-side notes

## Progress

- Level 16, hearts 9/9, attack 14, gold 79, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @231.8s), Boomerang (50g @231.9s)
- Kills 69, pots/bushes 71, sword swings 138, ranged shots 64, math solved 23 (locks 9), revives 4, level-ups 15
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 60 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 87.6 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.5 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 62.6 |

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
- t=6.5s (wall 1.7s) Opened dialogue with Curious Kid (3 lines)  [overworld @1969.9,1208.3]
- t=7.3s (wall 1.9s) Dialogue dismissed after 3 presses  [overworld @1969.9,1208.3]
- t=7.5s (wall 1.9s) Phase end: npc dialogue (1.4s game)  [overworld @1969.9,1225]
- t=7.5s (wall 1.9s) Phase start: farm gold/XP  [overworld @1969.9,1225]
- t=19.5s (wall 4.9s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2112,1560.1]
- t=36.8s (wall 9.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1822.3,1678.2]
- t=63.1s (wall 15.8s) Level up -> Lv 4, chose +1 Attack  [overworld @1354.6,1672]
- t=74.4s (wall 18.7s) Level up -> Lv 5, chose +1 Attack  [overworld @1609,1944.2]
- t=100.3s (wall 25.1s) Level up -> Lv 6, chose +1 Attack  [overworld @2421.3,1397.8]
- t=121.4s (wall 30.4s) Level up -> Lv 7, chose +1 Attack  [overworld @2370.9,499.5]
- t=149.6s (wall 37.5s) Level up -> Lv 8, chose +1 Attack  [overworld @2993.8,1202.1]
- t=208.8s (wall 52.3s) Farming done: gold 0 -> 80, level 8, kills 32, pots 62  [overworld @3077.9,279.9]
- t=208.8s (wall 52.3s) Phase end: farm gold/XP (201.3s game)  [overworld @3077.9,279.9]
- t=208.8s (wall 52.3s) Phase start: shop  [overworld @3077.9,279.9]
- t=231.1s (wall 57.9s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=231.5s (wall 58s) Shop opened  [interior:Shop @120,107.5]
- t=231.8s (wall 58s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=231.9s (wall 58.1s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=233.2s (wall 58.4s) Left shop (gold 0)  [overworld @2024.6,1359.3]
- t=233.2s (wall 58.4s) Phase end: shop (24.4s game)  [overworld @2024.6,1359.3]
- t=233.2s (wall 58.4s) Phase start: dungeon forest  [overworld @2024.6,1359.3]
- t=254.5s (wall 63.7s) Level up -> Lv 9, chose +1 Attack  [overworld @514.2,1119.8]
- t=258.1s (wall 64.6s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=273.2s (wall 68.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.5,48.3]
- t=274.9s (wall 68.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=277.2s (wall 69.4s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.4,81.2]
- t=278.5s (wall 69.7s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=278.5s (wall 69.7s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=279.4s (wall 69.9s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=279.8s (wall 70s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=279.8s (wall 70s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=280.8s (wall 70.3s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=282.6s (wall 70.7s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=283.6s (wall 71s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=293.2s (wall 73.4s) Exited Forest Dungeon to the overworld at (23,63)  [overworld @376.8,1023.5]
- t=294.2s (wall 73.6s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=295.1s (wall 73.9s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.8,1022.8]
- t=295.1s (wall 73.9s) Phase end: dungeon forest (61.9s game)  [overworld @361.8,1022.8]
- t=295.1s (wall 73.9s) Phase start: restock after forest  [overworld @361.8,1022.8]
- t=295.1s (wall 73.9s) Phase end: restock after forest (0.0s game)  [overworld @361.8,1022.8]
- t=295.1s (wall 73.9s) Phase start: dungeon fire  [overworld @361.8,1022.8]
- t=341.9s (wall 85.6s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=346.6s (wall 86.7s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180,47.2]
- t=348.4s (wall 87.2s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=366.5s (wall 91.7s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.1,57.6]
- t=367.9s (wall 92.1s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=367.9s (wall 92.1s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=368.6s (wall 92.2s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=369.4s (wall 92.4s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @65.5,68.2]
- t=369.4s (wall 92.4s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @65.5,68.2]
- t=369.8s (wall 92.5s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=371.9s (wall 93.1s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=372.9s (wall 93.3s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=382.7s (wall 95.8s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.5,415.5]
- t=382.7s (wall 95.8s) Phase end: dungeon fire (87.6s game)  [overworld @3433.5,415.5]
- t=382.7s (wall 95.8s) Phase start: restock after fire  [overworld @3433.5,415.5]
- t=382.7s (wall 95.8s) Phase end: restock after fire (0.0s game)  [overworld @3433.5,415.5]
- t=382.8s (wall 95.8s) Phase start: dungeon water  [overworld @3433.5,415.5]
- t=388.9s (wall 97.3s) Level up -> Lv 12, chose +1 Attack  [overworld @3452.1,800.9]
- t=430.3s (wall 107.7s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.2,2088.4]
- t=434.4s (wall 108.7s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=439.9s (wall 110s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @174.4,110.1]
- t=444.3s (wall 111.1s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.9,48.4]
- t=445.9s (wall 111.6s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=453.3s (wall 113.4s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.5,105.1]
- t=454.6s (wall 113.7s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=454.6s (wall 113.7s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=455.8s (wall 114s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=455.8s (wall 114s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=456.8s (wall 114.3s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=458.7s (wall 114.7s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=459.6s (wall 115s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=469.3s (wall 117.4s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.9,2384.4]
- t=469.3s (wall 117.4s) Phase end: dungeon water (86.5s game)  [overworld @793.9,2384.4]
- t=469.3s (wall 117.4s) Phase start: restock after water  [overworld @793.9,2384.4]
- t=469.3s (wall 117.4s) Phase end: restock after water (0.0s game)  [overworld @793.9,2384.4]
- t=469.3s (wall 117.4s) Phase start: dungeon shadow  [overworld @793.9,2384.4]
- t=484.4s (wall 121.2s) Level up -> Lv 14, chose +1 Attack  [overworld @728,1002.8]
- t=501.9s (wall 125.6s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=510.3s (wall 127.7s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.8,48.5]
- t=511.9s (wall 128.1s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=513.2s (wall 128.4s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:1 @64.4,55.9]
- t=515.7s (wall 129s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @145.4,79.1]
- t=517.6s (wall 129.5s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=517.6s (wall 129.5s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=518.4s (wall 129.7s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=518.4s (wall 129.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=519.4s (wall 129.9s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=521.3s (wall 130.4s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=522.2s (wall 130.6s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=531.9s (wall 133s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873,319.9]
- t=531.9s (wall 133s) Phase end: dungeon shadow (62.6s game)  [overworld @873,319.9]
- t=531.9s (wall 133.1s) Phase start: restock after shadow  [overworld @873,319.9]
- t=531.9s (wall 133.1s) Phase end: restock after shadow (0.0s game)  [overworld @873,319.9]
- t=531.9s (wall 133.1s) Phase start: castle  [overworld @873,319.9]
- t=533.8s (wall 133.5s) Level up -> Lv 16, chose +1 Attack  [overworld @1050.1,322.6]
- t=547.9s (wall 137s) Entered the castle  [castle:0 @32,80]
- t=552s (wall 138.1s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=555.6s (wall 139s) Final boss defeated in 3.6s (game)  [castle:1 @182,98.6]
- t=560.8s (wall 140.3s) VICTORY screen reached  [castle:1 @182,98.6]
- t=560.8s (wall 140.3s) QA agent finished: victory  [castle:1 @182,98.6]

## Agent-side notes (not game bugs)

- t=363.4s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 140.9s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
