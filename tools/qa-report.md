# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T01:22:26.929Z | wall 130.9s | game time 517.2s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 109 milestones, 1 agent-side notes

## Progress

- Level 17, hearts 9/9, attack 15, gold 94, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @174.1s), Boomerang (50g @174.2s)
- Kills 71, pots/bushes 59, sword swings 134, ranged shots 94, math solved 25 (locks 9), revives 6, level-ups 16
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 54.1 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 96 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 95.3 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 65.1 |

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
- t=6.2s (wall 1.6s) Opened dialogue with Curious Kid (3 lines)  [overworld @1938.2,1208.3]
- t=7s (wall 1.8s) Dialogue dismissed after 3 presses  [overworld @1938.2,1208.3]
- t=7.1s (wall 1.8s) Phase end: npc dialogue (1.1s game)  [overworld @1938.2,1225]
- t=7.2s (wall 1.8s) Phase start: farm gold/XP  [overworld @1938.2,1225]
- t=19.1s (wall 4.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2126.8,1534]
- t=36.5s (wall 9.2s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1822,1654.6]
- t=63.5s (wall 15.9s) Level up -> Lv 4, chose +1 Attack  [overworld @1355.9,1673.4]
- t=74.8s (wall 18.8s) Level up -> Lv 5, chose +1 Attack  [overworld @1607.1,1945]
- t=101.2s (wall 25.3s) Level up -> Lv 6, chose +1 Attack  [overworld @2422.5,1396.7]
- t=110.4s (wall 27.6s) Level up -> Lv 7, chose +1 Attack  [overworld @2585.4,1657.4]
- t=127.6s (wall 31.9s) Level up -> Lv 8, chose +1 Attack  [overworld @2112,2081.5]
- t=157.6s (wall 39.5s) Farming done: gold 0 -> 83, level 8, kills 32, pots 50  [overworld @2952.9,1931.2]
- t=157.6s (wall 39.5s) Phase end: farm gold/XP (150.5s game)  [overworld @2952.9,1931.2]
- t=157.7s (wall 39.5s) Phase start: shop  [overworld @2952.9,1931.2]
- t=173.5s (wall 43.4s) Entered Shop with 83 gold  [interior:Shop @120,140.8]
- t=173.8s (wall 43.5s) Shop opened  [interior:Shop @120,107.5]
- t=174.1s (wall 43.6s) Bought Sharp Sword for 30g (gold 83 -> 53)  [interior:Shop @120,107.5]
- t=174.2s (wall 43.6s) Bought Boomerang for 50g (gold 53 -> 3)  [interior:Shop @120,107.5]
- t=175.5s (wall 43.9s) Left shop (gold 3)  [overworld @2024.6,1358.9]
- t=175.5s (wall 43.9s) Phase end: shop (17.9s game)  [overworld @2024.6,1358.9]
- t=175.6s (wall 43.9s) Phase start: dungeon forest  [overworld @2024.6,1358.9]
- t=193.8s (wall 48.5s) Level up -> Lv 9, chose +1 Attack  [overworld @521.3,1099]
- t=197.4s (wall 49.4s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=205.5s (wall 51.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.1,48.1]
- t=207.2s (wall 51.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=209.6s (wall 52.4s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:1 @177.8,80.4]
- t=210.9s (wall 52.8s) Forest Dungeon: entered room 2 via puzzle door  [dungeon:forest:2 @32,80]
- t=210.9s (wall 52.8s) Forest Dungeon: boss fight vs grovak (hp 98)  [dungeon:forest:2 @32,80]
- t=216.1s (wall 54.1s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:2 @51,80]
- t=216.5s (wall 54.2s) Forest Dungeon: boss defeated in 5.6s (game)  [dungeon:forest:2 @53.4,77.6]
- t=216.5s (wall 54.2s) Forest Dungeon: got the Boss Key  [dungeon:forest:2 @53.4,77.6]
- t=216.7s (wall 54.2s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:2 @65.1,91.1]
- t=219.1s (wall 54.8s) Forest Dungeon: entered room 3 via boss door  [dungeon:forest:3 @32,80]
- t=220.1s (wall 55.1s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:3 @118.7,88.3]
- t=229.7s (wall 57.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.6,1022.6]
- t=230.5s (wall 57.7s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=231.4s (wall 57.9s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.6,1023.6]
- t=231.4s (wall 57.9s) Phase end: dungeon forest (55.8s game)  [overworld @360.6,1023.6]
- t=231.4s (wall 57.9s) Phase start: restock after forest  [overworld @360.6,1023.6]
- t=231.4s (wall 57.9s) Phase end: restock after forest (0.0s game)  [overworld @360.6,1023.6]
- t=231.4s (wall 57.9s) Phase start: dungeon fire  [overworld @360.6,1023.6]
- t=279s (wall 69.8s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=279.6s (wall 69.9s) Level up -> Lv 11, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=284s (wall 71s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @180,47.2]
- t=285.7s (wall 71.5s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=303.8s (wall 76s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:1 @199.7,56.8]
- t=305.2s (wall 76.4s) Fire Dungeon: entered room 2 via puzzle door  [dungeon:fire:2 @32,80]
- t=305.2s (wall 76.4s) Fire Dungeon: boss fight vs cindermaw (hp 144)  [dungeon:fire:2 @32,80]
- t=312.7s (wall 78.2s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:2 @47.7,80]
- t=313.5s (wall 78.4s) Fire Dungeon: boss defeated in 8.3s (game)  [dungeon:fire:2 @79.5,111.8]
- t=313.5s (wall 78.4s) Fire Dungeon: got the Boss Key  [dungeon:fire:2 @79.5,111.8]
- t=313.9s (wall 78.5s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:2 @44.7,95.3]
- t=316.6s (wall 79.2s) Fire Dungeon: entered room 3 via boss door  [dungeon:fire:3 @32,80]
- t=317.6s (wall 79.4s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:3 @118.7,88.3]
- t=327.4s (wall 81.9s) Exited Fire Dungeon to the overworld at (215,25)  [overworld @3456,408.6]
- t=327.4s (wall 81.9s) Phase end: dungeon fire (96.0s game)  [overworld @3456,408.6]
- t=327.4s (wall 81.9s) Phase start: restock after fire  [overworld @3456,408.6]
- t=327.4s (wall 81.9s) Phase end: restock after fire (0.0s game)  [overworld @3456,408.6]
- t=327.4s (wall 81.9s) Phase start: dungeon water  [overworld @3456,408.6]
- t=376s (wall 94s) Lowered the lakeBridge with its lever (math lock)  [overworld @857.7,2087.8]
- t=380.1s (wall 95.1s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=383.3s (wall 95.9s) Level up -> Lv 13, chose +1 Attack  [dungeon:water:0 @85,74.4]
- t=389.2s (wall 97.3s) Water Dungeon: got the Small Key  [dungeon:water:0 @180,47.4]
- t=391s (wall 97.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=398.6s (wall 99.7s) Water Dungeon: solved the switches puzzle  [dungeon:water:1 @199.6,105.9]
- t=399.8s (wall 100s) Water Dungeon: entered room 2 via puzzle door  [dungeon:water:2 @32,80]
- t=399.8s (wall 100s) Water Dungeon: boss fight vs voltuga (hp 198)  [dungeon:water:2 @32,80]
- t=407.8s (wall 102s) Level up -> Lv 14, chose +1 Attack  [dungeon:water:2 @130.1,131.4]
- t=408.7s (wall 102.2s) Water Dungeon: boss defeated in 8.9s (game)  [dungeon:water:2 @93.6,114.9]
- t=408.7s (wall 102.2s) Water Dungeon: got the Boss Key  [dungeon:water:2 @93.6,114.9]
- t=409.1s (wall 102.3s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:2 @56.9,134.9]
- t=412.1s (wall 103.1s) Water Dungeon: entered room 3 via boss door  [dungeon:water:3 @32,80]
- t=413.1s (wall 103.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:3 @118.7,88.3]
- t=422.7s (wall 105.7s) Exited Water Dungeon to the overworld at (49,149)  [overworld @792.7,2385.5]
- t=422.7s (wall 105.7s) Phase end: dungeon water (95.3s game)  [overworld @792.7,2385.5]
- t=422.7s (wall 105.7s) Phase start: restock after water  [overworld @792.7,2385.5]
- t=422.7s (wall 105.7s) Phase end: restock after water (0.0s game)  [overworld @792.7,2385.5]
- t=422.7s (wall 105.7s) Phase start: dungeon shadow  [overworld @792.7,2385.5]
- t=449.6s (wall 112.4s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=449.7s (wall 112.5s) Level up -> Lv 15, chose +1 Attack  [dungeon:shadow:0 @46.2,71.8]
- t=458.2s (wall 114.6s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @180.3,46.8]
- t=460s (wall 115s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=462.9s (wall 115.8s) Level up -> Lv 16, chose +1 Attack  [dungeon:shadow:1 @120.5,74.2]
- t=463.4s (wall 115.9s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:1 @130.7,70.7]
- t=465.3s (wall 116.4s) Shadow Dungeon: entered room 2 via puzzle door  [dungeon:shadow:2 @32,80]
- t=465.3s (wall 116.4s) Shadow Dungeon: boss fight vs puffling (hp 280)  [dungeon:shadow:2 @32,80]
- t=474.6s (wall 118.7s) Shadow Dungeon: boss defeated in 9.3s (game)  [dungeon:shadow:2 @61.1,83.1]
- t=474.6s (wall 118.7s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:2 @61.1,83.1]
- t=474.7s (wall 118.7s) Shadow Dungeon: collected Giant Heart Piece (max hearts 9)  [dungeon:shadow:2 @61.1,93.1]
- t=477.2s (wall 119.3s) Shadow Dungeon: entered room 3 via boss door  [dungeon:shadow:3 @32,80]
- t=478.1s (wall 119.6s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:3 @118.7,88.3]
- t=487.8s (wall 122s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @870.2,318.9]
- t=487.8s (wall 122s) Phase end: dungeon shadow (65.1s game)  [overworld @870.2,318.9]
- t=487.8s (wall 122s) Phase start: restock after shadow  [overworld @870.2,318.9]
- t=487.8s (wall 122s) Phase end: restock after shadow (0.0s game)  [overworld @870.2,318.9]
- t=487.8s (wall 122s) Phase start: castle  [overworld @870.2,318.9]
- t=495.2s (wall 123.8s) Level up -> Lv 17, chose +1 Attack  [overworld @1414.5,280.5]
- t=504.2s (wall 126.1s) Entered the castle  [castle:0 @32,80]
- t=508.3s (wall 127.1s) Final boss fight (hp 60)  [castle:1 @32,112]
- t=512s (wall 128s) Final boss defeated in 3.7s (game)  [castle:1 @162,114]
- t=517.2s (wall 129.4s) VICTORY screen reached  [castle:1 @162,114]
- t=517.2s (wall 129.4s) QA agent finished: victory  [castle:1 @162,114]

## Agent-side notes (not game bugs)

- t=300.7s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 130.9s, timeScale x4, 5 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
