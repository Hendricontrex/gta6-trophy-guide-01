# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Hendricontrex/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Hendricontrex/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all **55 PlayStation 5 trophies** of
Grand Theft Auto VI: the official list with saved progress, filters and a
spoiler setting, a roadmap to the platinum, and a guide to each trophy in our
own words that cites its sources.

**Entry for the make.fun bounty:** https://make.fun/bounty/gta6-trophy-guide-01

## What it does

- **Checklist** of all 55 trophies with official name, description and grade,
  saved in the browser (localStorage), with export to a file and import back.
- **Filters** by kind (story, missable, collectibles, activities, side strands,
  robberies & crime, money, exploration, miscellaneous, online), by grade,
  by earned state, and full-text search.
- **Spoiler-free mode** hides the names and descriptions of story trophies
  until they are earned.
- **Roadmap to the platinum** in three steps (story, 100% checklist, cleanup),
  built from the official descriptions, with per-step earned counts.
- **Missables page**: the one possibly-missable trophy (Positive Mental
  Attitude) with its Chapter 1 warning, plus everything that looks missable
  but is not.
- **A guide to every trophy** in our own words, each naming its sources
  (PowerPyx, Exophase, PSNProfiles, Sixshore, KeenGamer). Anything not yet
  confirmed by guide writers says so plainly instead of inventing a method.
- **Progress counters** for trophies with a tracked target (stunts, races,
  vehicles, and more).

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Everything is static files under `app/` — no build step, no network at run
time. Serve `app/` with any static server.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output and writes
`dossier.json` with the vendored make.fun library.

## Sources

- Official trophy list: [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
  and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- Roadmap and how-tos: [PowerPyx](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/),
  [Sixshore](https://sixshore.com/gta-6/guides/trophies-and-achievements/),
  [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)

No Rockstar Games logo or official artwork is used anywhere. MIT licensed.
