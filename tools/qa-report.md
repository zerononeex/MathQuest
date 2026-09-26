# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-26T20:47:31.891Z | wall 124.8s | game time 492.8s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 107 milestones, 1 agent-side notes

## Progress

- Level 15, hearts 9/9, attack 13, gold 76, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @167.6s), Boomerang (50g @167.7s)
- Kills 63, pots/bushes 51, sword swings 90, ranged shots 68, math solved 30 (locks 9), revives 1, level-ups 14
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 49.8 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 88.1 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 85.9 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 66.5 |

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
- t=6.1s (wall 1.6s) Phase start: npc dialogue  [overworld @1938.2,1200]
- t=6.9s (wall 1.7s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1223.3]
- t=7.7s (wall 1.9s) Dialogue dismissed after 3 presses  [overworld @1991.5,1223.3]
- t=7.8s (wall 2s) Phase end: npc dialogue (1.8s game)  [overworld @1991.5,1240]
- t=7.8s (wall 2s) Phase start: farm gold/XP  [overworld @1991.5,1240]
- t=16.4s (wall 4.2s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2112.3,1568.1]
- t=26.8s (wall 6.7s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2100.2,1684]
- t=58.7s (wall 14.7s) Level up -> Lv 4, chose +1 Attack  [overworld @1398,1737.9]
- t=70.4s (wall 17.6s) Level up -> Lv 5, chose +1 Attack  [overworld @1733.8,1928.7]
- t=85.8s (wall 21.5s) Level up -> Lv 6, chose +1 Attack  [overworld @2154.5,1714.7]
- t=126.9s (wall 31.8s) Level up -> Lv 7, chose +1 Attack  [overworld @2598.3,1446.5]
- t=137.5s (wall 34.4s) Level up -> Lv 8, chose +1 Attack  [overworld @2617.8,1939.5]
- t=156.5s (wall 39.2s) Farming done: gold 0 -> 82, level 8, kills 33, pots 42  [overworld @2050.9,2298.9]
- t=156.5s (wall 39.2s) Phase end: farm gold/XP (148.7s game)  [overworld @2050.9,2298.9]
- t=156.5s (wall 39.2s) Phase start: shop  [overworld @2050.9,2298.9]
- t=167s (wall 41.8s) Entered Shop with 82 gold  [interior:Shop @120,140.8]
- t=167.3s (wall 41.9s) Shop opened  [interior:Shop @120,107.5]
- t=167.6s (wall 41.9s) Bought Sharp Sword for 30g (gold 82 -> 52)  [interior:Shop @120,107.5]
- t=167.7s (wall 42s) Bought Boomerang for 50g (gold 52 -> 2)  [interior:Shop @120,107.5]
- t=169s (wall 42.3s) Left shop (gold 2)  [overworld @2025.9,1359.9]
- t=169s (wall 42.3s) Phase end: shop (12.5s game)  [overworld @2025.9,1359.9]
- t=169.1s (wall 42.3s) Phase start: dungeon forest  [overworld @2025.9,1359.9]
- t=190.5s (wall 47.7s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=193.2s (wall 48.3s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:0 @122,102.4]
- t=198.7s (wall 49.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @180.7,47.4]
- t=200.4s (wall 50.1s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=202.8s (wall 50.7s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,81]
- t=204.1s (wall 51.1s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=204.1s (wall 51.1s) Forest Dungeon: boss fight vs grovak (hp 12)  [dungeon:forest:2 @32,80]
- t=205s (wall 51.3s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @32,80]
- t=205.4s (wall 51.4s) Forest Dungeon: boss defeated in 1.3s (game)  [dungeon:forest:2 @32,80]
- t=205.4s (wall 51.4s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @32,80]
- t=206.4s (wall 51.6s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @125,93]
- t=208.2s (wall 52.1s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=209.2s (wall 52.3s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=218.8s (wall 54.7s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1022.6]
- t=219.7s (wall 55s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=220.5s (wall 55.2s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.9,1023.6]
- t=220.5s (wall 55.2s) Phase end: dungeon forest (51.5s game)  [overworld @360.9,1023.6]
- t=220.6s (wall 55.2s) Phase start: restock after forest  [overworld @360.9,1023.6]
- t=220.6s (wall 55.2s) Phase end: restock after forest (0.0s game)  [overworld @360.9,1023.6]
- t=220.6s (wall 55.2s) Phase start: dungeon fire  [overworld @360.9,1023.6]
- t=268s (wall 67s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=272.7s (wall 68.2s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @178.3,48.9]
- t=274.4s (wall 68.6s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=292.5s (wall 73.2s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @198.5,56.8]
- t=293.9s (wall 73.5s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=293.9s (wall 73.5s) Fire Dungeon: boss fight vs cindermaw (hp 14)  [dungeon:fire:2 @32,80]
- t=294.6s (wall 73.7s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:2 @32,80]
- t=295.3s (wall 73.9s) Fire Dungeon: boss defeated in 1.5s (game)  [dungeon:fire:2 @62.1,68.2]
- t=295.3s (wall 73.9s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @62.1,68.2]
- t=295.8s (wall 74s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @96.9,93]
- t=297.9s (wall 74.5s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=298.9s (wall 74.8s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=308.7s (wall 77.2s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.5,414.6]
- t=308.7s (wall 77.2s) Phase end: dungeon fire (88.1s game)  [overworld @3432.5,414.6]
- t=308.7s (wall 77.2s) Phase start: restock after fire  [overworld @3432.5,414.6]
- t=308.7s (wall 77.2s) Phase end: restock after fire (0.0s game)  [overworld @3432.5,414.6]
- t=308.7s (wall 77.2s) Phase start: dungeon water  [overworld @3432.5,414.6]
- t=355.2s (wall 88.8s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.1,2087.1]
- t=359.3s (wall 89.9s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=362.9s (wall 90.8s) Level up -> Lv 12, chose +1 Attack  [dungeon:water:0 @82.8,54.5]
- t=369.3s (wall 92.4s) Water Dungeon: got the Small Key  [dungeon:water:0 @179.6,48.4]
- t=370.9s (wall 92.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=378.7s (wall 94.7s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @198.8,105.2]
- t=379.9s (wall 95s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=379.9s (wall 95s) Water Dungeon: boss fight vs voltuga (hp 12)  [dungeon:water:2 @32,80]
- t=380.8s (wall 95.2s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:2 @32,80]
- t=381.2s (wall 95.3s) Water Dungeon: boss defeated in 1.3s (game)  [dungeon:water:2 @32,80]
- t=381.2s (wall 95.3s) Water Dungeon: got the Boss Key  [dungeon:water:2 @32,80]
- t=382.2s (wall 95.6s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @125,93]
- t=384s (wall 96s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=385s (wall 96.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=394.6s (wall 98.7s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.7,2384.8]
- t=394.6s (wall 98.7s) Phase end: dungeon water (85.9s game)  [overworld @793.7,2384.8]
- t=394.6s (wall 98.7s) Phase start: restock after water  [overworld @793.7,2384.8]
- t=394.6s (wall 98.7s) Phase end: restock after water (0.0s game)  [overworld @793.7,2384.8]
- t=394.6s (wall 98.7s) Phase start: dungeon shadow  [overworld @793.7,2384.8]
- t=429s (wall 107.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=438s (wall 109.5s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.1,47.4]
- t=439.8s (wall 110s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=441.1s (wall 110.3s) Level up -> Lv 14, chose +1 Attack  [dungeon:shadow:1 @64.4,55.9]
- t=445.2s (wall 111.3s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @143.7,83.9]
- t=446.8s (wall 111.7s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=446.8s (wall 111.7s) Shadow Dungeon: boss fight vs puffling (hp 12)  [dungeon:shadow:2 @32,80]
- t=447.7s (wall 112s) Shadow Dungeon: boss defeated in 0.9s (game)  [dungeon:shadow:2 @32,80]
- t=447.7s (wall 112s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @32,80]
- t=448.7s (wall 112.2s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @125,93]
- t=450.6s (wall 112.7s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=451.5s (wall 112.9s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=461.2s (wall 115.3s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.5,319.5]
- t=461.2s (wall 115.3s) Phase end: dungeon shadow (66.5s game)  [overworld @873.5,319.5]
- t=461.2s (wall 115.3s) Phase start: restock after shadow  [overworld @873.5,319.5]
- t=461.2s (wall 115.3s) Phase end: restock after shadow (0.0s game)  [overworld @873.5,319.5]
- t=461.2s (wall 115.3s) Phase start: castle  [overworld @873.5,319.5]
- t=477.2s (wall 119.3s) Level up -> Lv 15, chose +1 Attack  [overworld @1926.8,276.9]
- t=479.3s (wall 119.9s) Entered the castle  [castle:0 @32,80]
- t=483.4s (wall 120.9s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=488s (wall 122s) Final boss defeated in 4.5s (game)  [castle:1 @115.6,117.3]
- t=492.8s (wall 123.2s) VICTORY screen reached  [castle:1 @115.6,117.3]
- t=492.8s (wall 123.2s) QA agent finished: victory  [castle:1 @115.6,117.3]

## Agent-side notes (not game bugs)

- t=289.3s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 124.8s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
