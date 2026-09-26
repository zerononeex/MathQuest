# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T23:31:05.325Z | wall 120.7s | game time 478.1s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 8/9, attack 13, gold 71, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @154.7s), Boomerang (50g @154.9s)
- Kills 63, pots/bushes 48, sword swings 87, ranged shots 62, math solved 30 (locks 9), revives 3, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 50.7 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.2 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 86.1 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 64 |

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
- t=7.1s (wall 1.8s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1240]
- t=7.9s (wall 2s) Dialogue dismissed after 3 presses  [overworld @1991.5,1240]
- t=8.1s (wall 2.1s) Phase end: npc dialogue (2.0s game)  [overworld @1991.5,1256.7]
- t=8.1s (wall 2.1s) Phase start: farm gold/XP  [overworld @1991.5,1256.7]
- t=19.3s (wall 4.9s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2123.2,1565.5]
- t=28.4s (wall 7.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2095.4,1708.8]
- t=47.5s (wall 11.9s) Level up -> Lv 4, chose +1 Attack  [overworld @1682,1477.6]
- t=65.6s (wall 16.5s) Level up -> Lv 5, chose +1 Attack  [overworld @1927.4,1991.4]
- t=96.1s (wall 24.1s) Level up -> Lv 6, chose +1 Attack  [overworld @2214.2,986.8]
- t=114.3s (wall 28.6s) Level up -> Lv 7, chose +1 Attack  [overworld @2584.5,1657.7]
- t=135s (wall 33.8s) Level up -> Lv 8, chose +1 Attack  [overworld @2102.4,2083.4]
- t=141.7s (wall 35.5s) Farming done: gold 0 -> 80, level 8, kills 31, pots 39  [overworld @2107.1,2326]
- t=141.7s (wall 35.5s) Phase end: farm gold/XP (133.6s game)  [overworld @2107.1,2326]
- t=141.7s (wall 35.5s) Phase start: shop  [overworld @2107.1,2326]
- t=154.1s (wall 38.6s) Entered Shop with 83 gold  [interior:Shop @120,140.8]
- t=154.5s (wall 38.7s) Shop opened  [interior:Shop @120,107.5]
- t=154.7s (wall 38.7s) Bought Sharp Sword for 30g (gold 83 -> 53)  [interior:Shop @120,107.5]
- t=154.9s (wall 38.8s) Bought Boomerang for 50g (gold 53 -> 3)  [interior:Shop @120,107.5]
- t=156.2s (wall 39.1s) Left shop (gold 3)  [overworld @2025.5,1358.4]
- t=156.2s (wall 39.1s) Phase end: shop (14.4s game)  [overworld @2025.5,1358.4]
- t=156.2s (wall 39.1s) Phase start: dungeon forest  [overworld @2025.5,1358.4]
- t=178.6s (wall 44.7s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=181.3s (wall 45.4s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:0 @107.7,105.7]
- t=186.9s (wall 46.8s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.5,48.2]
- t=188.6s (wall 47.2s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=190.8s (wall 47.8s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.7,81.2]
- t=192.1s (wall 48.1s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=192.1s (wall 48.1s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=193s (wall 48.3s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=193.4s (wall 48.4s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=193.4s (wall 48.4s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=194.4s (wall 48.7s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=196.3s (wall 49.1s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=197.2s (wall 49.4s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=206.9s (wall 51.8s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.5,1023.7]
- t=207.7s (wall 52s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=208.6s (wall 52.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.5,1023.1]
- t=208.6s (wall 52.2s) Phase end: dungeon forest (52.4s game)  [overworld @360.5,1023.1]
- t=208.6s (wall 52.2s) Phase start: restock after forest  [overworld @360.5,1023.1]
- t=208.6s (wall 52.2s) Phase end: restock after forest (0.0s game)  [overworld @360.5,1023.1]
- t=208.6s (wall 52.2s) Phase start: dungeon fire  [overworld @360.5,1023.1]
- t=256s (wall 64s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=260.8s (wall 65.2s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179,48.2]
- t=262.4s (wall 65.6s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=280.5s (wall 70.2s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.7,56.8]
- t=281.9s (wall 70.5s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=281.9s (wall 70.5s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=282.7s (wall 70.7s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=283.4s (wall 70.9s) Fire Dungeon: boss defeated in 1.6s (game)  [dungeon:fire:2 @65,67]
- t=283.4s (wall 70.9s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @65,67]
- t=283.9s (wall 71s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @97.6,93]
- t=286s (wall 71.5s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=287s (wall 71.8s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=296.8s (wall 74.2s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3433.8,415.7]
- t=296.8s (wall 74.2s) Phase end: dungeon fire (88.2s game)  [overworld @3433.8,415.7]
- t=296.8s (wall 74.2s) Phase start: restock after fire  [overworld @3433.8,415.7]
- t=296.8s (wall 74.2s) Phase end: restock after fire (0.0s game)  [overworld @3433.8,415.7]
- t=296.8s (wall 74.2s) Phase start: dungeon water  [overworld @3433.8,415.7]
- t=338.8s (wall 84.7s) Level up -> Lv 12, chose +1 Attack  [overworld @1110.3,1951.9]
- t=343.3s (wall 85.9s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.8,2088.4]
- t=347.4s (wall 86.9s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=357.3s (wall 89.4s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.5,48.9]
- t=359s (wall 89.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=367s (wall 91.8s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.5,104.4]
- t=368.2s (wall 92.1s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=368.2s (wall 92.1s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=369.1s (wall 92.3s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=369.5s (wall 92.4s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=369.5s (wall 92.4s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=370.4s (wall 92.6s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=372.3s (wall 93.1s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=373.3s (wall 93.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=382.9s (wall 95.8s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.4,2384.4]
- t=382.9s (wall 95.8s) Phase end: dungeon water (86.1s game)  [overworld @793.4,2384.4]
- t=382.9s (wall 95.8s) Phase start: restock after water  [overworld @793.4,2384.4]
- t=382.9s (wall 95.8s) Phase end: restock after water (0.0s game)  [overworld @793.4,2384.4]
- t=382.9s (wall 95.8s) Phase start: dungeon shadow  [overworld @793.4,2384.4]
- t=417.3s (wall 104.4s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=425.2s (wall 106.3s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @178.1,48.5]
- t=426.9s (wall 106.8s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=427.9s (wall 107s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @47.1,82.4]
- t=430.7s (wall 107.7s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @128.5,68]
- t=432.6s (wall 108.2s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=432.6s (wall 108.2s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=433.5s (wall 108.4s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=433.5s (wall 108.4s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=434.5s (wall 108.7s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=436.3s (wall 109.1s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=437.3s (wall 109.4s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=446.9s (wall 111.8s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.9,319.8]
- t=446.9s (wall 111.8s) Phase end: dungeon shadow (64.0s game)  [overworld @873.9,319.8]
- t=446.9s (wall 111.8s) Phase start: restock after shadow  [overworld @873.9,319.8]
- t=446.9s (wall 111.8s) Phase end: restock after shadow (0.0s game)  [overworld @873.9,319.8]
- t=447s (wall 111.8s) Phase start: castle  [overworld @873.9,319.8]
- t=448.5s (wall 112.1s) Level up -> Lv 15, chose +1 Attack  [overworld @951.4,384.7]
- t=465s (wall 116.3s) Entered the castle  [castle:0 @32,80]
- t=469.1s (wall 117.3s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=472.9s (wall 118.3s) Final boss defeated in 3.8s (game)  [castle:1 @220.5,74.3]
- t=478.1s (wall 119.6s) VICTORY screen reached  [castle:1 @220.5,74.3]
- t=478.1s (wall 119.6s) QA agent finished: victory  [castle:1 @220.5,74.3]

## Agent-side notes (not game bugs)

- t=277.4s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
