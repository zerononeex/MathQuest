# Math Quest - QA/QC audit checks

**8/8 checks pass**

- PASS - Math gates only on major progression locks (bridge levers, big chests, boss seals) (7 call sites)
- PASS - Little Hero: softer boss wind-ups (longer telegraphs) than Adventurer (0.88s vs 0.6s)
- PASS - Little Hero: Cindermaw rears up longer (1.1s vs 0.7s)
- PASS - Little Hero: shield blocks only dead-front hits (a 40deg blow lands); Adventurer blocks it ({"LH":false,"AD":true})
- PASS - Little Hero: bosses hit for 1, Malrek slower and weaker ({"LH":[1,1,1.04,32],"AD":[2,1,1.3,54]})
- PASS - Harder tiers unchanged by the Little Hero rules (Legend = Adventurer telegraphs) (0.6s vs 0.6s)
- PASS - Dungeon doors: no full-height black seam at any door (20 doors across 4 dungeons)
- PASS - AP economy: at least 2 attacks per math question, under 3 questions per game minute ({"gameMinutes":15.2,"mathSolved":40,"mathPerMinute":2.63,"swings":330,"ranged":290,"kills":195,"swingsPerQuestion":15.5})

## 1. Math gates

| line | function | title | guards |
|---|---|---|---|
| 3763 | `owInteractables` | Lower the Bridge! | bridge lever |
| 3793 | `openOverworldChest` | Unlock the Treasure! | big treasure chest |
| 4131 | `handleDungeonDoors` | Break the Seal! | dungeon boss door seal |
| 4182 | `worldInteractables` | Unlock the Treasure! | big treasure chest |
| 4189 | `worldInteractables` | Break the Seal! | dungeon boss door seal |
| 5117 | `castleDoors` | Break Malrek's Seal! | castle boss door seal |
| 5287 | `castleInteractables` | Break Malrek's Seal! | castle boss door seal |

## 2. Difficulty scaling (measured with the game's own functions)

```
{
 "LITTLE_HERO": {
  "bossWindAvg": 0.88,
  "bossHitDamage": 1,
  "cindermawRear": 1.1,
  "beetleBlocks40deg": false,
  "beetleBlocksFront": true,
  "malrekHp": 32,
  "malrekHit": 1,
  "malrekTempo": 1.04,
  "apPerCorrect": 8
 },
 "ADVENTURER": {
  "bossWindAvg": 0.6,
  "bossHitDamage": 2,
  "cindermawRear": 0.7,
  "beetleBlocks40deg": true,
  "beetleBlocksFront": true,
  "malrekHp": 54,
  "malrekHit": 1,
  "malrekTempo": 1.3,
  "apPerCorrect": 8
 },
 "LEGEND": {
  "bossWindAvg": 0.6,
  "bossHitDamage": 2,
  "cindermawRear": 0.7,
  "beetleBlocks40deg": true,
  "beetleBlocksFront": true,
  "malrekHp": 54,
  "malrekHit": 1,
  "malrekTempo": 1.3,
  "apPerCorrect": 12
 }
}
```

## 3. Door geometry

Close-ups in `tools/audit-screens/`. "seam" is the largest share of fully black pixels in any single pixel column across the door tile (1.0 would be a black line the full door height).

| dungeon | room | side | tile | seam | file |
|---|---|---|---|---|---|
| forest | 0 | west | FLOOR | 0 | forest-room0-west-floor.png |
| forest | 0 | east | LOCKDOOR | 0 | forest-room0-east-lockdoor.png |
| forest | 1 | west | FLOOR | 0 | forest-room1-west-floor.png |
| forest | 5 | west | FLOOR | 0 | forest-room5-west-floor.png |
| forest | 5 | east | BOSSDOOR | 0.02 | forest-room5-east-bossdoor.png |
| fire | 0 | west | FLOOR | 0 | fire-room0-west-floor.png |
| fire | 0 | east | LOCKDOOR | 0 | fire-room0-east-lockdoor.png |
| fire | 1 | west | FLOOR | 0 | fire-room1-west-floor.png |
| fire | 5 | west | FLOOR | 0 | fire-room5-west-floor.png |
| fire | 5 | east | BOSSDOOR | 0.02 | fire-room5-east-bossdoor.png |
| water | 0 | west | FLOOR | 0 | water-room0-west-floor.png |
| water | 0 | east | LOCKDOOR | 0 | water-room0-east-lockdoor.png |
| water | 1 | west | FLOOR | 0 | water-room1-west-floor.png |
| water | 6 | west | FLOOR | 0 | water-room6-west-floor.png |
| water | 6 | east | BOSSDOOR | 0.02 | water-room6-east-bossdoor.png |
| shadow | 0 | west | FLOOR | 0 | shadow-room0-west-floor.png |
| shadow | 0 | east | LOCKDOOR | 0 | shadow-room0-east-lockdoor.png |
| shadow | 1 | west | FLOOR | 0 | shadow-room1-west-floor.png |
| shadow | 6 | west | FLOOR | 0 | shadow-room6-west-floor.png |
| shadow | 6 | east | BOSSDOOR | 0.02 | shadow-room6-east-bossdoor.png |

## 4. AP economy (last playthrough)

```
{
 "gameMinutes": 15.2,
 "mathSolved": 40,
 "mathPerMinute": 2.63,
 "swings": 330,
 "ranged": 290,
 "kills": 195,
 "swingsPerQuestion": 15.5
}
```

