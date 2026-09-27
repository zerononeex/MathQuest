# Math Quest - autonomous QA report

- Agent: qa-agent.js v1.0.0 (synthetic keyboard/pointer input only; game state read-only)
- Started: 2026-09-27T04:11:16.010Z | wall 231.4s | game time 923.5s | timeScale x4
- Result: **VICTORY reached** - victory (last phase: castle)
- Findings: **0 CRITICAL**, **0 WARNING**, 180 milestones, 1 agent-side notes

## Progress

- Level 32, hearts 9/11, attack 30, gold 61, medallions 4/4
- Weapon slots: sword, boomerang, (empty) | owned gear: sharpSword, boomerang, superMushroom, powerBracelet, fireSwordAbility, pegasusBoots
- Bought: Sharp Sword (30g @165.5s), Boomerang (50g @165.6s), Heart Vessel (100g @607.9s), Red Tunic (20g @608.3s), Blue Tunic (35g @608.6s), Giant's Berry (40g @608.7s), Heart Vessel (100g @777.2s), Giant's Berry (40g @777.3s)
- Kills 193, pots/bushes 42, sword swings 360, ranged shots 196, math solved 40 (locks 10), revives 11, level-ups 31
- Walk speed: cardinal 100 px/s, diagonal 100 px/s

| Dungeon | Entered | Small key | Puzzle | Boss killed | Boss key | Chest/medallion | Exited | Blocked by | Game s |
|---|---|---|---|---|---|---|---|---|---|
| Forest Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 100.9 |
| Fire Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 141.7 |
| Water Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 172 |
| Shadow Dungeon | yes | yes | yes | yes | yes | yes | yes | - | 142.5 |

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
- t=6.9s (wall 1.8s) Opened dialogue with Curious Kid (3 lines)  [overworld @1991.5,1215]
- t=7.7s (wall 2s) Dialogue dismissed after 3 presses  [overworld @1991.5,1215]
- t=7.8s (wall 2s) Phase end: npc dialogue (1.8s game)  [overworld @1991.5,1231.7]
- t=7.9s (wall 2s) Phase start: farm gold/XP  [overworld @1991.5,1231.7]
- t=19s (wall 4.8s) Level up -> Lv 2, chose +1 Max Heart  [overworld @2116.2,1536.7]
- t=37.7s (wall 9.5s) Level up -> Lv 3, chose +1 Max Heart  [overworld @2124.3,1708.1]
- t=55.2s (wall 13.8s) Level up -> Lv 4, chose +1 Attack  [overworld @1638.9,1920.8]
- t=76.9s (wall 19.3s) Level up -> Lv 5, chose +1 Attack  [overworld @1688.6,1536.1]
- t=100.5s (wall 25.2s) Level up -> Lv 6, chose +1 Attack  [overworld @1104.7,1944.9]
- t=115.5s (wall 28.9s) Level up -> Lv 7, chose +1 Attack  [overworld @1006.7,1665.6]
- t=151.9s (wall 38s) Level up -> Lv 8, chose +1 Attack  [overworld @1533.8,904.6]
- t=155.5s (wall 38.9s) Farming done: gold 0 -> 80, level 8, kills 29, pots 33  [overworld @1620.4,887.9]
- t=155.5s (wall 38.9s) Phase end: farm gold/XP (147.6s game)  [overworld @1620.4,887.9]
- t=155.5s (wall 38.9s) Phase start: shop  [overworld @1620.4,887.9]
- t=164.9s (wall 41.3s) Entered Shop with 80 gold  [interior:Shop @120,140.8]
- t=165.2s (wall 41.4s) Shop opened  [interior:Shop @120,107.5]
- t=165.5s (wall 41.4s) Bought Sharp Sword for 30g (gold 80 -> 50)  [interior:Shop @120,107.5]
- t=165.6s (wall 41.5s) Bought Boomerang for 50g (gold 50 -> 0)  [interior:Shop @120,107.5]
- t=166.9s (wall 41.8s) Left shop (gold 0)  [overworld @2022.1,1358.9]
- t=166.9s (wall 41.8s) Phase end: shop (11.4s game)  [overworld @2022.1,1358.9]
- t=167s (wall 41.8s) Phase start: dungeon forest  [overworld @2022.1,1358.9]
- t=190s (wall 47.5s) Entered Forest Dungeon  [dungeon:forest:0 @32,80]
- t=198.7s (wall 49.7s) Forest Dungeon: got the Small Key  [dungeon:forest:0 @178.2,48.3]
- t=200.3s (wall 50.1s) Forest Dungeon: entered room 1 via locked door  [dungeon:forest:1 @32,80]
- t=203.5s (wall 50.9s) Level up -> Lv 9, chose +1 Attack  [dungeon:forest:1 @197.8,60.5]
- t=207s (wall 51.8s) Forest Dungeon: beat 2 waves in room 1  [dungeon:forest:1 @163,27.3]
- t=209.1s (wall 52.3s) Forest Dungeon: entered room 2 via waves room door  [dungeon:forest:2 @32,80]
- t=211.8s (wall 53s) Forest Dungeon: crossed the crystal peg room  [dungeon:forest:2 @198.7,88.3]
- t=213.2s (wall 53.3s) Forest Dungeon: entered room 3 via crystal room door  [dungeon:forest:3 @32,80]
- t=216.1s (wall 54.1s) Level up -> Lv 10, chose +1 Attack  [dungeon:forest:3 @115.6,53.4]
- t=218.2s (wall 54.6s) Forest Dungeon: beat 2 waves in room 3  [dungeon:forest:3 @173.4,77.5]
- t=219.7s (wall 55s) Forest Dungeon: entered room 4 via waves room door  [dungeon:forest:4 @32,80]
- t=222.1s (wall 55.6s) Forest Dungeon: solved the pushblock puzzle  [dungeon:forest:4 @177.8,80]
- t=223.5s (wall 55.9s) Forest Dungeon: entered room 5 via puzzle door  [dungeon:forest:5 @32,80]
- t=223.5s (wall 55.9s) Forest Dungeon: boss fight vs grovak (hp 224)  [dungeon:forest:5 @32,80]
- t=244.5s (wall 61.2s) Level up -> Lv 11, chose +1 Attack  [dungeon:forest:5 @33.4,91.7]
- t=244.9s (wall 61.3s) Forest Dungeon: boss defeated in 21.4s (game)  [dungeon:forest:5 @33.4,91.7]
- t=244.9s (wall 61.3s) Forest Dungeon: got the Boss Key  [dungeon:forest:5 @33.4,91.7]
- t=245.2s (wall 61.4s) Forest Dungeon: collected Giant Heart Piece (max hearts 6)  [dungeon:forest:5 @34.6,124.6]
- t=248.3s (wall 62.1s) Forest Dungeon: entered room 6 via boss door  [dungeon:forest:6 @32,80]
- t=249.3s (wall 62.4s) Forest Dungeon cleared: forest medallion (1/4)  [dungeon:forest:6 @118.7,88.3]
- t=267.9s (wall 67s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.5,1022.8]
- t=268.7s (wall 67.2s) Re-entered Forest Dungeon (room 0) - entrance works both ways  [dungeon:forest:0 @32,80]
- t=269.6s (wall 67.5s) Exited Forest Dungeon to the overworld at (22,63)  [overworld @361.5,1023.8]
- t=269.6s (wall 67.5s) Phase end: dungeon forest (102.6s game)  [overworld @361.5,1023.8]
- t=269.6s (wall 67.5s) Phase start: restock after forest  [overworld @361.5,1023.8]
- t=269.6s (wall 67.5s) Phase end: restock after forest (0.0s game)  [overworld @361.5,1023.8]
- t=269.6s (wall 67.5s) Phase start: dungeon fire  [overworld @361.5,1023.8]
- t=318.3s (wall 79.6s) Entered Fire Dungeon  [dungeon:fire:0 @32,80]
- t=318.8s (wall 79.7s) Level up -> Lv 12, chose +1 Attack  [dungeon:fire:0 @72.2,114.2]
- t=323.1s (wall 80.8s) Fire Dungeon: got the Small Key  [dungeon:fire:0 @179.3,48.2]
- t=324.8s (wall 81.2s) Fire Dungeon: entered room 1 via locked door  [dungeon:fire:1 @32,80]
- t=330.2s (wall 82.6s) Fire Dungeon: beat 2 waves in room 1  [dungeon:fire:1 @155.8,52.2]
- t=332s (wall 83.1s) Fire Dungeon: entered room 2 via waves room door  [dungeon:fire:2 @32,80]
- t=335.6s (wall 83.9s) Fire Dungeon: crossed the crystal peg room  [dungeon:fire:2 @230.3,88.3]
- t=336.6s (wall 84.2s) Fire Dungeon: entered room 3 via crystal room door  [dungeon:fire:3 @32,80]
- t=337.8s (wall 84.5s) Level up -> Lv 13, chose +1 Attack  [dungeon:fire:3 @72.7,65.9]
- t=347.4s (wall 86.9s) Level up -> Lv 14, chose +1 Attack  [dungeon:fire:3 @150.3,58.3]
- t=348.9s (wall 87.3s) Fire Dungeon: beat 3 waves in room 3  [dungeon:fire:3 @135,68.2]
- t=350.8s (wall 87.7s) Fire Dungeon: entered room 4 via waves room door  [dungeon:fire:4 @32,80]
- t=369s (wall 92.3s) Fire Dungeon: solved the torches puzzle  [dungeon:fire:4 @199.6,58]
- t=370.4s (wall 92.6s) Fire Dungeon: entered room 5 via puzzle door  [dungeon:fire:5 @32,80]
- t=370.4s (wall 92.6s) Fire Dungeon: boss fight vs cindermaw (hp 384)  [dungeon:fire:5 @32,80]
- t=388s (wall 97s) Level up -> Lv 15, chose +1 Attack  [dungeon:fire:5 @145.5,80.7]
- t=388.8s (wall 97.2s) Fire Dungeon: boss defeated in 18.5s (game)  [dungeon:fire:5 @185.9,73.6]
- t=388.8s (wall 97.2s) Fire Dungeon: got the Boss Key  [dungeon:fire:5 @185.9,73.6]
- t=389s (wall 97.3s) Fire Dungeon: collected Giant Heart Piece (max hearts 7)  [dungeon:fire:5 @195.3,86.4]
- t=390.1s (wall 97.5s) Fire Dungeon: entered room 6 via boss door  [dungeon:fire:6 @32,80]
- t=391.1s (wall 97.8s) Fire Dungeon cleared: fire medallion (2/4)  [dungeon:fire:6 @118.7,88.3]
- t=411.3s (wall 102.9s) Exited Fire Dungeon to the overworld at (214,25)  [overworld @3432.4,415.3]
- t=411.3s (wall 102.9s) Phase end: dungeon fire (141.7s game)  [overworld @3432.4,415.3]
- t=411.3s (wall 102.9s) Phase start: restock after fire  [overworld @3432.4,415.3]
- t=411.3s (wall 102.9s) Phase end: restock after fire (0.0s game)  [overworld @3432.4,415.3]
- t=411.3s (wall 102.9s) Phase start: dungeon water  [overworld @3432.4,415.3]
- t=458.9s (wall 114.8s) Lowered the lakeBridge with its lever (math lock)  [overworld @856.6,2087.8]
- t=463s (wall 115.8s) Entered Water Dungeon  [dungeon:water:0 @32,80]
- t=464.7s (wall 116.2s) Level up -> Lv 16, chose +1 Attack  [dungeon:water:0 @59.3,47.3]
- t=471.6s (wall 117.9s) Water Dungeon: got the Small Key  [dungeon:water:0 @178.5,48.6]
- t=473.3s (wall 118.4s) Water Dungeon: entered room 1 via locked door  [dungeon:water:1 @32,80]
- t=479.1s (wall 119.8s) Level up -> Lv 17, chose +1 Attack  [dungeon:water:1 @201.4,49.4]
- t=484.7s (wall 121.2s) Level up -> Lv 18, chose +1 Attack  [dungeon:water:1 @158.2,47.7]
- t=486.1s (wall 121.6s) Water Dungeon: beat 3 waves in room 1  [dungeon:water:1 @149,37.8]
- t=488.2s (wall 122.1s) Water Dungeon: entered room 2 via waves room door  [dungeon:water:2 @32,80]
- t=491.5s (wall 122.9s) Water Dungeon: crossed the crystal peg room  [dungeon:water:2 @247,88.3]
- t=492.4s (wall 123.1s) Water Dungeon: entered room 3 via crystal room door  [dungeon:water:3 @32,80]
- t=497.4s (wall 124.4s) Level up -> Lv 19, chose +1 Attack  [dungeon:water:3 @144.8,40.7]
- t=504.3s (wall 126.1s) Water Dungeon: beat 3 waves in room 3  [dungeon:water:3 @109.2,61.4]
- t=506.6s (wall 126.7s) Water Dungeon: entered room 4 via waves room door  [dungeon:water:4 @32,80]
- t=507.3s (wall 126.9s) Level up -> Lv 20, chose +1 Attack  [dungeon:water:4 @60.3,115]
- t=515.4s (wall 128.9s) Level up -> Lv 21, chose +1 Attack  [dungeon:water:4 @107.5,99.7]
- t=519.8s (wall 130s) Water Dungeon: beat 3 waves in room 4  [dungeon:water:4 @186.2,39.8]
- t=521.5s (wall 130.4s) Water Dungeon: entered room 5 via waves room door  [dungeon:water:5 @32,80]
- t=529.2s (wall 132.3s) Water Dungeon: solved the switches puzzle  [dungeon:water:5 @198.1,105.7]
- t=530.4s (wall 132.6s) Water Dungeon: entered room 6 via puzzle door  [dungeon:water:6 @32,80]
- t=530.4s (wall 132.6s) Water Dungeon: boss fight vs voltuga (hp 684)  [dungeon:water:6 @32,80]
- t=557.8s (wall 139.5s) Level up -> Lv 22, chose +1 Attack  [dungeon:water:6 @128.1,79]
- t=558.2s (wall 139.6s) Water Dungeon: boss defeated in 27.8s (game)  [dungeon:water:6 @125.7,76.7]
- t=558.2s (wall 139.6s) Water Dungeon: got the Boss Key  [dungeon:water:6 @125.7,76.7]
- t=558.4s (wall 139.6s) Water Dungeon: collected Giant Heart Piece (max hearts 8)  [dungeon:water:6 @116.3,86.1]
- t=560.3s (wall 140.1s) Water Dungeon: entered room 7 via boss door  [dungeon:water:7 @32,80]
- t=561.3s (wall 140.3s) Water Dungeon cleared: water medallion (3/4)  [dungeon:water:7 @118.7,88.3]
- t=583.4s (wall 145.9s) Exited Water Dungeon to the overworld at (49,149)  [overworld @793.2,2385.5]
- t=583.4s (wall 145.9s) Phase end: dungeon water (172.0s game)  [overworld @793.2,2385.5]
- t=583.4s (wall 145.9s) Phase start: restock after water  [overworld @793.2,2385.5]
- t=607.2s (wall 151.8s) Entered Shop with 195 gold  [interior:Shop @120,140.8]
- t=607.6s (wall 151.9s) Shop opened  [interior:Shop @120,107.5]
- t=607.9s (wall 152s) Bought Heart Vessel for 100g (gold 195 -> 95)  [interior:Shop @120,107.5]
- t=608.3s (wall 152.1s) Bought Red Tunic for 20g (gold 95 -> 75)  [interior:Shop @120,107.5]
- t=608.6s (wall 152.2s) Bought Blue Tunic for 35g (gold 75 -> 40)  [interior:Shop @120,107.5]
- t=608.7s (wall 152.2s) Bought Giant's Berry for 40g (gold 40 -> 0)  [interior:Shop @120,107.5]
- t=610s (wall 152.5s) Left shop (gold 0)  [overworld @2023.2,1359.8]
- t=610s (wall 152.5s) Phase end: restock after water (26.6s game)  [overworld @2023.2,1359.8]
- t=610s (wall 152.5s) Phase start: dungeon shadow  [overworld @2023.2,1359.8]
- t=634.1s (wall 158.6s) Entered Shadow Dungeon  [dungeon:shadow:0 @32,80]
- t=641.2s (wall 160.3s) Shadow Dungeon: got the Small Key  [dungeon:shadow:0 @179.2,48.6]
- t=642.8s (wall 160.7s) Shadow Dungeon: entered room 1 via locked door  [dungeon:shadow:1 @32,80]
- t=643.4s (wall 160.9s) Level up -> Lv 23, chose +1 Attack  [dungeon:shadow:1 @74.5,116.5]
- t=649.2s (wall 162.3s) Level up -> Lv 24, chose +1 Attack  [dungeon:shadow:1 @172.7,59.3]
- t=654.2s (wall 163.6s) Shadow Dungeon: beat 3 waves in room 1  [dungeon:shadow:1 @158.3,69.2]
- t=655.8s (wall 164s) Shadow Dungeon: entered room 2 via waves room door  [dungeon:shadow:2 @32,80]
- t=659.6s (wall 164.9s) Shadow Dungeon: crossed the crystal peg room  [dungeon:shadow:2 @230.3,88.3]
- t=660.7s (wall 165.2s) Shadow Dungeon: entered room 3 via crystal room door  [dungeon:shadow:3 @32,80]
- t=664.2s (wall 166.1s) Level up -> Lv 25, chose +1 Attack  [dungeon:shadow:3 @130.5,31.7]
- t=672s (wall 168s) Level up -> Lv 26, chose +1 Attack  [dungeon:shadow:3 @149.4,84.6]
- t=675.9s (wall 169s) Shadow Dungeon: beat 4 waves in room 3  [dungeon:shadow:3 @199.9,76.9]
- t=677.2s (wall 169.3s) Shadow Dungeon: entered room 4 via waves room door  [dungeon:shadow:4 @32,80]
- t=681s (wall 170.3s) Level up -> Lv 27, chose +1 Attack  [dungeon:shadow:4 @151.7,82.4]
- t=685.8s (wall 171.5s) Level up -> Lv 28, chose +1 Attack  [dungeon:shadow:4 @144.2,72.2]
- t=689.5s (wall 172.4s) Shadow Dungeon: beat 4 waves in room 4  [dungeon:shadow:4 @152.6,32.5]
- t=691.5s (wall 172.9s) Shadow Dungeon: entered room 5 via waves room door  [dungeon:shadow:5 @32,80]
- t=695.7s (wall 174s) Shadow Dungeon: solved the riddle puzzle  [dungeon:shadow:5 @123.9,71.8]
- t=697.7s (wall 174.5s) Shadow Dungeon: entered room 6 via puzzle door  [dungeon:shadow:6 @32,80]
- t=697.7s (wall 174.5s) Shadow Dungeon: boss fight vs puffling (hp 1040)  [dungeon:shadow:6 @32,80]
- t=726.7s (wall 181.7s) Level up -> Lv 29, chose +1 Attack  [dungeon:shadow:6 @168.1,99.9]
- t=727.9s (wall 182s) Shadow Dungeon: boss defeated in 30.2s (game)  [dungeon:shadow:6 @170,91]
- t=727.9s (wall 182s) Shadow Dungeon: got the Boss Key  [dungeon:shadow:6 @170,91]
- t=728.1s (wall 182.1s) Shadow Dungeon: collected Giant Heart Piece (max hearts 10)  [dungeon:shadow:6 @178.3,99.2]
- t=729.5s (wall 182.4s) Shadow Dungeon: entered room 7 via boss door  [dungeon:shadow:7 @32,80]
- t=730.5s (wall 182.7s) Shadow Dungeon cleared: shadow medallion (4/4)  [dungeon:shadow:7 @118.7,88.3]
- t=752.5s (wall 188.2s) Exited Shadow Dungeon to the overworld at (55,19)  [overworld @894.4,312.5]
- t=752.5s (wall 188.2s) Phase end: dungeon shadow (142.5s game)  [overworld @894.4,312.5]
- t=752.5s (wall 188.2s) Phase start: restock after shadow  [overworld @894.4,312.5]
- t=776.6s (wall 194.2s) Entered Shop with 141 gold  [interior:Shop @120,140.8]
- t=776.9s (wall 194.3s) Shop opened  [interior:Shop @120,107.5]
- t=777.2s (wall 194.3s) Bought Heart Vessel for 100g (gold 141 -> 41)  [interior:Shop @120,107.5]
- t=777.3s (wall 194.4s) Bought Giant's Berry for 40g (gold 41 -> 1)  [interior:Shop @120,107.5]
- t=778.6s (wall 194.7s) Left shop (gold 1)  [overworld @2022.1,1359]
- t=778.6s (wall 194.7s) Phase end: restock after shadow (26.1s game)  [overworld @2022.1,1359]
- t=778.6s (wall 194.7s) Phase start: castle  [overworld @2022.1,1359]
- t=792.8s (wall 198.2s) Entered the castle  [castle:0 @32,80]
- t=799s (wall 199.8s) Level up -> Lv 30, chose +1 Attack  [castle:0 @127.5,87.4]
- t=800.7s (wall 200.2s) Castle Gate Hall: solved the guards puzzle  [castle:0 @220.9,86.2]
- t=801.9s (wall 200.5s) Castle: entered Hall of Weights  [castle:1 @32,80]
- t=812.5s (wall 203.2s) Castle Hall of Weights: solved the weights puzzle  [castle:1 @210.7,42.9]
- t=814.3s (wall 203.6s) Castle: entered Brazier Gallery  [castle:2 @32,80]
- t=826.8s (wall 206.7s) Castle Brazier Gallery: solved the braziers puzzle  [castle:2 @214.1,136.1]
- t=827.9s (wall 207s) Castle Brazier Gallery: got a Small Key (1 held)  [castle:2 @145.7,89.4]
- t=829.8s (wall 207.5s) Castle: entered Crystal Hall  [castle:3 @32,80]
- t=830.5s (wall 207.7s) Castle: struck crystal 1 - red pegs up  [castle:3 @70.3,73.3]
- t=832.2s (wall 208.1s) Castle: struck crystal 2 - blue pegs up  [castle:3 @150.3,135]
- t=834.7s (wall 208.7s) Castle Crystal Hall: solved the crystal puzzle  [castle:3 @246.4,88.3]
- t=835.6s (wall 208.9s) Castle: entered Guard Gauntlet  [castle:4 @32,80]
- t=842.8s (wall 210.7s) Level up -> Lv 31, chose +1 Attack  [castle:4 @156.9,113.9]
- t=862.1s (wall 215.6s) Level up -> Lv 32, chose +1 Attack  [castle:4 @117.5,71.1]
- t=877.9s (wall 219.5s) Castle Guard Gauntlet: solved the waves puzzle  [castle:4 @170,85.2]
- t=878.2s (wall 219.6s) Castle Guard Gauntlet: got a Small Key (1 held)  [castle:4 @146.7,88.5]
- t=880.1s (wall 220.1s) Castle: entered Antechamber  [castle:5 @32,80]
- t=887s (wall 221.8s) Castle Antechamber: solved the memory puzzle  [castle:5 @198.7,71.7]
- t=888.6s (wall 222.2s) Castle: entered Malrek's Throne  [castle:6 @32,112]
- t=888.6s (wall 222.2s) Final boss fight vs Malrek (hp 1620, Lv 37, hits for 2)  [castle:6 @32,112]
- t=918.3s (wall 229.6s) Final boss defeated in 29.7s (game)  [castle:6 @174.5,77.5]
- t=923.5s (wall 230.9s) VICTORY screen reached  [castle:6 @174.5,77.5]
- t=923.5s (wall 230.9s) QA agent finished: victory  [castle:6 @174.5,77.5]

## Agent-side notes (not game bugs)

- t=365.8s no damage dealt to mole for 14s; giving up (COMBAT / clear room: mole)

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
- Wall time 231.4s, timeScale x4, 8 screenshots in `tools/qa-screens/`
- Page errors seen by puppeteer: none
