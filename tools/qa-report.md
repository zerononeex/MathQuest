# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T07:53:16.101Z | wall 243.5s | game time 969.3s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 179 milestones, 2 agent-side notes

## Progress

- Level 32, hearts 4/11, attack 30, gold 68, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, superMushroom, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @186.6s), Boomerang (50g @186.7s), Heart Vessel (100g @628.3s), Red Tunic (20g @628.8s), Blue Tunic (35g @629.1s), Heart Vessel (100g @796.7s), Giant's Berry (40g @796.8s)
- Kills 197, pots/bushes 45, sword swings 346, ranged shots 229, math solved 42 (locks 10), revives 11, level-ups 31
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 93.9 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 144 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 175.2 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 143 |

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
- t=7.4s (wall 1.9s) Opened dialogue with Curious Kid (3 lines)  [overworld @1929.9,1286.7]
- t=8.2s (wall 2.1s) Dialogue dismissed after 3 presses  [overworld @1929.9,1286.7]
- t=8.3s (wall 2.1s) Phase end: npc dialogue (2.3s game)  [overworld @1929.9,1303.3]
- t=8.4s (wall 2.2s) Phase start: farm gold/XP  [overworld @1929.9,1303.3]
- t=21.5s (wall 5.4s) Level up -> Lv 2, chose +1 Max Heart  [overworld @1874,1652.2]
- t=40.9s (wall 10.3s) Level up -> Lv 3, chose +1 Max Heart  [overworld @1394.3,1734.6]
- t=60.4s (wall 15.2s) Level up -> Lv 4, chose +1 Attack  [overworld @1609.6,944.2]
- t=65.5s (wall 16.4s) Level up -> Lv 5, chose +1 Attack  [overworld @1719.3,820.5]
- t=94.4s (wall 23.7s) Level up -> Lv 6, chose +1 Attack  [overworld @1049.4,372.9]
- t=119.2s (wall 29.9s) Level up -> Lv 7, chose +1 Attack  [overworld @897.3,922.7]
- t=151.3s (wall 37.9s) Level up -> Lv 8, chose +1 Attack  [overworld @1027.6,1470]
- t=163.5s (wall 40.9s) Level up -> Lv 9, chose +1 Attack  [overworld @1064.9,1993.2]
- t=181.2s (wall 45.4s) Farming done: gold 0 -> 80, level 9, kills 36, pots 36  [overworld @2036.6,1728.5]
- t=181.2s (wall 45.4s) Phase end: farm gold/XP (172.8s game)  [overworld @2036.6,1728.5]
- t=181.2s (wall 45.4s) Phase start: shop  [overworld @2036.6,1728.5]
- t=186s (wall 46.5s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=186.3s (wall 46.6s) Shop opened  [interior:Shop @120,107.5]
- t=186.6s (wall 46.7s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=186.7s (wall 46.7s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=188s (wall 47.1s) Left shop (gold 0)  [overworld @2025,1359.5]
- t=188s (wall 47.1s) Phase end: shop (6.8s game)  [overworld @2025,1359.5]
- t=188s (wall 47.1s) Phase start: dungeon forest  [overworld @2025,1359.5]
- t=206.2s (wall 51.6s) Level up -> Lv 10, chose +1 Attack  [overworld @395.7,1162.9]
- t=209.2s (wall 52.3s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=217.3s (wall 54.4s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.1,48.1]
- t=219s (wall 54.8s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=224s (wall 56.1s) Level up -> Lv 11, chose +1 Attack  [dungeon:forest:1 @174.9,35.9]
- t=224.8s (wall 56.3s) Forest Dungeon: beat 2 waves in room 1  [dungeon:forest:1 @164.1,30]
- t=226.9s (wall 56.8s) Forest Dungeon: entered room 2 via waves room door  [dungeon:forest:2 @32,80]
- t=229.6s (wall 57.5s) Forest Dungeon: crossed the crystal peg room  [dungeon:forest:2 @198.7,88.3]
- t=231s (wall 57.8s) Forest Dungeon: entered room 3 via crystal room door  [dungeon:forest:3 @32,80]
- t=236s (wall 59.1s) Forest Dungeon: beat 2 waves in room 3  [dungeon:forest:3 @194.9,80.7]
- t=237.2s (wall 59.3s) Forest Dungeon: entered room 4 via waves room door  [dungeon:forest:4 @32,80]
- t=239.6s (wall 60s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:4 @177.8,81]
- t=240.9s (wall 60.3s) Forest Dungeon: entered room 5 via puzzle door  [dungeon:forest:5 @32,80]
- t=240.9s (wall 60.3s) Forest Dungeon: boss fight vs grovak (hp 252)  [dungeon:forest:5 @32,80]
- t=258.8s (wall 64.8s) Level up -> Lv 12, chose +1 Attack  [dungeon:forest:5 @41.7,35.5]
- t=259.3s (wall 64.9s) Forest Dungeon: boss defeated in 18.3s (game)  [dungeon:forest:5 @39.3,33.2]
- t=259.3s (wall 64.9s) Forest Dungeon: got the Boss Key  [dungeon:forest:5 @39.3,33.2]
- t=259.4s (wall 64.9s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:5 @31.1,41.4]
- t=262.6s (wall 65.7s) Forest Dungeon: entered room 6 via boss door  [dungeon:forest:6 @32,80]
- t=263.6s (wall 66s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:6 @118.7,88.3]
- t=282s (wall 70.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.5,1023.7]
- t=282.8s (wall 70.8s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=283.7s (wall 71s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @360.5,1023]
- t=283.7s (wall 71s) Phase end: dungeon forest (95.6s game)  [overworld @360.5,1023]
- t=283.7s (wall 71s) Phase start: restock after forest  [overworld @360.5,1023]
- t=283.7s (wall 71s) Phase end: restock after forest (0.0s game)  [overworld @360.5,1023]
- t=283.7s (wall 71s) Phase start: dungeon fire  [overworld @360.5,1023]
- t=311.1s (wall 77.8s) Level up -> Lv 13, chose +1 Attack  [overworld @2585.9,1376]
- t=334.3s (wall 83.6s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=339.1s (wall 84.8s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @181.1,46]
- t=340.8s (wall 85.3s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=345.8s (wall 86.5s) Level up -> Lv 14, chose +1 Attack  [dungeon:fire:1 @178.8,37.9]
- t=347.1s (wall 86.8s) Fire Dungeon: beat 2 waves in room 1  [dungeon:fire:1 @161.7,47.4]
- t=349s (wall 87.3s) Fire Dungeon: entered room 2 via waves room door  [dungeon:fire:2 @32,80]
- t=352.6s (wall 88.2s) Fire Dungeon: crossed the crystal peg room  [dungeon:fire:2 @230.3,88.3]
- t=353.6s (wall 88.5s) Fire Dungeon: entered room 3 via crystal room door  [dungeon:fire:3 @32,80]
- t=362.4s (wall 90.7s) Level up -> Lv 15, chose +1 Attack  [dungeon:fire:3 @112.3,64.1]
- t=365.8s (wall 91.5s) Fire Dungeon: beat 3 waves in room 3  [dungeon:fire:3 @161.5,85]
- t=367.2s (wall 91.9s) Fire Dungeon: entered room 4 via waves room door  [dungeon:fire:4 @32,80]
- t=385.4s (wall 96.4s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:4 @198.7,58]
- t=386.8s (wall 96.7s) Fire Dungeon: entered room 5 via puzzle door  [dungeon:fire:5 @32,80]
- t=386.8s (wall 96.7s) Fire Dungeon: boss fight vs cindermaw (hp 416)  [dungeon:fire:5 @32,80]
- t=405.1s (wall 101.3s) Level up -> Lv 16, chose +1 Attack  [dungeon:fire:5 @192.3,75.3]
- t=405.5s (wall 101.4s) Fire Dungeon: boss defeated in 18.8s (game)  [dungeon:fire:5 @195.8,71.8]
- t=405.5s (wall 101.4s) Fire Dungeon: got the Boss Key  [dungeon:fire:5 @195.8,71.8]
- t=405.7s (wall 101.5s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:5 @207.6,83.6]
- t=406.7s (wall 101.7s) Fire Dungeon: entered room 6 via boss door  [dungeon:fire:6 @32,80]
- t=407.7s (wall 102s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:6 @118.7,88.3]
- t=427.7s (wall 107s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.7,414.3]
- t=427.7s (wall 107s) Phase end: dungeon fire (144.0s game)  [overworld @3432.7,414.3]
- t=427.7s (wall 107s) Phase start: restock after fire  [overworld @3432.7,414.3]
- t=427.7s (wall 107s) Phase end: restock after fire (0.0s game)  [overworld @3432.7,414.3]
- t=427.7s (wall 107s) Phase start: dungeon water  [overworld @3432.7,414.3]
- t=474.6s (wall 118.7s) Lowered the lakeBridge with its lever (math lock)  [overworld @857,2087.3]
- t=480.3s (wall 120.1s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=483.4s (wall 120.9s) Level up -> Lv 17, chose +1 Attack  [dungeon:water:0 @85,74.4]
- t=489.2s (wall 122.3s) Water Dungeon: got the Small Key  [dungeon:water:0 @179,48.1]
- t=490.8s (wall 122.8s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=496.7s (wall 124.2s) Level up -> Lv 18, chose +1 Attack  [dungeon:water:1 @172.4,34.5]
- t=502.9s (wall 125.8s) Level up -> Lv 19, chose +1 Attack  [dungeon:water:1 @175.1,34]
- t=504.1s (wall 126.1s) Water Dungeon: beat 3 waves in room 1  [dungeon:water:1 @131.2,38.7]
- t=506.3s (wall 126.6s) Water Dungeon: entered room 2 via waves room door  [dungeon:water:2 @32,80]
- t=509.7s (wall 127.5s) Water Dungeon: crossed the crystal peg room  [dungeon:water:2 @247,88.3]
- t=510.6s (wall 127.7s) Water Dungeon: entered room 3 via crystal room door  [dungeon:water:3 @32,80]
- t=516.7s (wall 129.2s) Level up -> Lv 20, chose +1 Attack  [dungeon:water:3 @201.6,82]
- t=522.5s (wall 130.7s) Water Dungeon: beat 3 waves in room 3  [dungeon:water:3 @109.4,67.2]
- t=524.7s (wall 131.2s) Water Dungeon: entered room 4 via waves room door  [dungeon:water:4 @32,80]
- t=528.1s (wall 132.1s) Level up -> Lv 21, chose +1 Attack  [dungeon:water:4 @186.5,105.4]
- t=534.6s (wall 133.7s) Level up -> Lv 22, chose +1 Attack  [dungeon:water:4 @174.9,38.9]
- t=536.5s (wall 134.2s) Water Dungeon: beat 3 waves in room 4  [dungeon:water:4 @150.1,59.3]
- t=538.4s (wall 134.6s) Water Dungeon: entered room 5 via waves room door  [dungeon:water:5 @32,80]
- t=545.9s (wall 136.5s) Water Dungeon: solved the switches puzzle  [dungeon:water:5 @198.9,105]
- t=547.1s (wall 136.8s) Water Dungeon: entered room 6 via puzzle door  [dungeon:water:6 @32,80]
- t=547.1s (wall 136.8s) Water Dungeon: boss fight vs voltuga (hp 720)  [dungeon:water:6 @32,80]
- t=578.2s (wall 144.6s) Water Dungeon: boss defeated in 31.1s (game)  [dungeon:water:6 @202.1,56.3]
- t=578.2s (wall 144.6s) Water Dungeon: got the Boss Key  [dungeon:water:6 @202.1,56.3]
- t=578.6s (wall 144.7s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:6 @173.7,76.3]
- t=580.1s (wall 145.1s) Water Dungeon: entered room 7 via boss door  [dungeon:water:7 @32,80]
- t=581s (wall 145.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:7 @118.7,88.3]
- t=596.3s (wall 149.1s) Level up -> Lv 23, chose +1 Attack  [dungeon:water:2 @46.9,91.1]
- t=602.9s (wall 150.8s) Exited Water Dungeon to the overworld at (50,152)  [overworld @807,2446.7]
- t=602.9s (wall 150.8s) Phase end: dungeon water (175.2s game)  [overworld @807,2446.7]
- t=602.9s (wall 150.8s) Phase start: restock after water  [overworld @807,2446.7]
- t=627.7s (wall 157s) Entered Shop with 179 gold  [interior:Shop @120,140.8]
- t=628.1s (wall 157.1s) Shop opened  [interior:Shop @120,107.5]
- t=628.3s (wall 157.1s) Bought Heart Vessel for 100g (gold 179 -> 79)  [interior:Shop @120,107.5]
- t=628.8s (wall 157.3s) Bought Red Tunic for 20g (gold 79 -> 59)  [interior:Shop @120,107.5]
- t=629.1s (wall 157.3s) Bought Blue Tunic for 35g (gold 59 -> 24)  [interior:Shop @120,107.5]
- t=630.4s (wall 157.6s) Left shop (gold 24)  [overworld @2022,1359.3]
- t=630.4s (wall 157.6s) Phase end: restock after water (27.4s game)  [overworld @2022,1359.3]
- t=630.4s (wall 157.6s) Phase start: dungeon shadow  [overworld @2022,1359.3]
- t=653.1s (wall 163.3s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=659.7s (wall 165s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.5,48.1]
- t=661.4s (wall 165.4s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=665.6s (wall 166.5s) Level up -> Lv 24, chose +1 Attack  [dungeon:shadow:1 @174.4,37.3]
- t=669.6s (wall 167.4s) Shadow Dungeon: beat 3 waves in room 1  [dungeon:shadow:1 @179.3,41.9]
- t=671.3s (wall 167.9s) Shadow Dungeon: entered room 2 via waves room door  [dungeon:shadow:2 @32,80]
- t=675.1s (wall 168.8s) Shadow Dungeon: crossed the crystal peg room  [dungeon:shadow:2 @230.3,88.3]
- t=676.2s (wall 169.1s) Shadow Dungeon: entered room 3 via crystal room door  [dungeon:shadow:3 @32,80]
- t=678.8s (wall 169.7s) Level up -> Lv 25, chose +1 Attack  [dungeon:shadow:3 @113.5,28.5]
- t=684.7s (wall 171.2s) Level up -> Lv 26, chose +1 Attack  [dungeon:shadow:3 @201.7,81.9]
- t=693.3s (wall 173.4s) Shadow Dungeon: beat 4 waves in room 3  [dungeon:shadow:3 @153.8,49.7]
- t=695.1s (wall 173.8s) Shadow Dungeon: entered room 4 via waves room door  [dungeon:shadow:4 @32,80]
- t=695.6s (wall 174s) Level up -> Lv 27, chose +1 Attack  [dungeon:shadow:4 @67.5,109.5]
- t=704.4s (wall 176.2s) Level up -> Lv 28, chose +1 Attack  [dungeon:shadow:4 @207.5,47.4]
- t=711.1s (wall 177.8s) Shadow Dungeon: beat 4 waves in room 4  [dungeon:shadow:4 @194.4,90]
- t=712.2s (wall 178.1s) Shadow Dungeon: entered room 5 via waves room door  [dungeon:shadow:5 @32,80]
- t=713.2s (wall 178.4s) Level up -> Lv 29, chose +1 Attack  [dungeon:shadow:5 @50,83.5]
- t=715.7s (wall 179s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:5 @130.2,69.4]
- t=717.6s (wall 179.5s) Shadow Dungeon: entered room 6 via puzzle door  [dungeon:shadow:6 @32,80]
- t=717.6s (wall 179.5s) Shadow Dungeon: boss fight vs puffling (hp 1080)  [dungeon:shadow:6 @32,80]
- t=747.7s (wall 187s) Shadow Dungeon: boss defeated in 30.1s (game)  [dungeon:shadow:6 @92.2,96.4]
- t=747.7s (wall 187s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:6 @92.2,96.4]
- t=750.5s (wall 187.7s) Shadow Dungeon: entered room 7 via boss door  [dungeon:shadow:7 @32,80]
- t=751.5s (wall 187.9s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:7 @118.7,88.3]
- t=773.4s (wall 193.4s) Exited Shadow Dungeon to the overworld at (54,19)  [overworld @873.7,318.7]
- t=773.4s (wall 193.4s) Phase end: dungeon shadow (143.0s game)  [overworld @873.7,318.7]
- t=773.4s (wall 193.4s) Phase start: restock after shadow  [overworld @873.7,318.7]
- t=796.1s (wall 199.1s) Entered Shop with 158 gold  [interior:Shop @120,140.8]
- t=796.4s (wall 199.2s) Shop opened  [interior:Shop @120,107.5]
- t=796.7s (wall 199.2s) Bought Heart Vessel for 100g (gold 158 -> 58)  [interior:Shop @120,107.5]
- t=796.8s (wall 199.3s) Bought Giant's Berry for 40g (gold 58 -> 18)  [interior:Shop @120,107.5]
- t=798.1s (wall 199.6s) Left shop (gold 18)  [overworld @2022,1359.7]
- t=798.1s (wall 199.6s) Phase end: restock after shadow (24.7s game)  [overworld @2022,1359.7]
- t=798.2s (wall 199.6s) Phase start: castle  [overworld @2022,1359.7]
- t=811.9s (wall 203s) Entered the castle  [castle:0 @32,80]
- t=815.2s (wall 203.9s) Level up -> Lv 30, chose +1 Attack  [castle:0 @118.9,106.2]
- t=818.6s (wall 204.7s) Castle Gate Hall: solved the guards puzzle  [castle:0 @127.3,87.9]
- t=818.9s (wall 204.8s) Castle Gate Hall: got a Small Key (1 held)  [castle:0 @145.6,87.9]
- t=820.8s (wall 205.3s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=831.4s (wall 207.9s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @210.7,42.9]
- t=833.1s (wall 208.3s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=858s (wall 214.6s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @215.5,135.1]
- t=859.2s (wall 214.9s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @145.5,88.4]
- t=861.1s (wall 215.3s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=861.7s (wall 215.5s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=863.4s (wall 215.9s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=865.9s (wall 216.5s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @246.4,88.3]
- t=866.8s (wall 216.8s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=874.2s (wall 218.6s) Level up -> Lv 31, chose +1 Attack  [castle:4 @148.2,110]
- t=901.3s (wall 225.4s) Level up -> Lv 32, chose +1 Attack  [castle:4 @94.9,42.7]
- t=915.3s (wall 228.9s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @151.2,125.3]
- t=915.8s (wall 229s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @146.2,88.6]
- t=917.7s (wall 229.5s) Castle: entered Antechamber  [castle:5 @32,80]
- t=924.6s (wall 231.2s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=926.1s (wall 231.6s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=926.1s (wall 231.6s) Final boss fight vs Malrek (hp 1620, Lv 37, hits for 2)  [castle:6 @32,112]
- t=964.1s (wall 241.1s) Final boss defeated in 37.9s (game)  [castle:6 @325.1,84.1]
- t=969.3s (wall 242.4s) VICTORY screen reached  [castle:6 @325.1,84.1]
- t=969.3s (wall 242.4s) QA agent finished: victory  [castle:6 @325.1,84.1]

## Agent-side notes (not game bugs)

- t=382.3s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)
- t=851.7s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 243.5s, timeScale x4, 9 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
