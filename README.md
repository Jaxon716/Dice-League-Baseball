# Pen & Paper Baseball — Stater Rules, MLB Teams

A browser dice-baseball game built around John Stater's **Pen & Paper Baseball** rules, played with all 30 real MLB teams. `dlb.py` is the earlier legacy terminal game, kept for reference.

## Run

Press **Run** in the app — it opens in your browser. Files: `index.html`, `styles.css`, `game.js`.

## Add to your iPhone Home Screen

Open the game in Safari, tap **Share**, then **Add to Home Screen**. It launches full-screen like an app, with a baseball icon (`icon-250.png` / `icon-960.png`, from Wikimedia Commons' Baseball.svg) and the scoreboard kept clear of the notch and home indicator.

**Offline**: a service worker (`sw.js`) caches the entire game on first load, so once it's open it keeps working with no connection.

## Stater's Rules (implemented)

- **Teams**: each club's 12-man roster uses the real 2026 MLB names (and batting hands), but the dice still roll every player's B/F/P/R — 3d6 per skill mapped to modifiers (3→−3 … 18→+3). You cut 3 players, assign all 9 positions, and set the batting order. CPU clubs are auto-managed, lining up real positions first. The rookie draft pool stays fully generated.
- **At-bat**: pitcher picks fastball/curve/slider and rolls 1d20 + Pitching vs targets 6/8/10 (fail = ball). Pitcher fatigue: from the 4th inning on, 1-in-6 per inning to lose a Pitching point.
- **Swing**: batter rolls 1d20 + Batting − Pitching (curve −1, slider −2, platoon +1). Natural 1 = strike, natural 20 = batted ball. Chart: 1–8 strike, 9–10 foul (never strike three), 11–15 ground ball, 16–18 fly ball, 19 line drive, 20 home run.
- **Pitch movement**: every offering flies differently — the fastball comes in dead straight and fast (it grows at the hitter), the curveball sweeps in a late bow, and the slider rides straight before biting hard late. Break direction follows the pitcher's hand (a right-hander's breaker runs to the screen-right side of the plate, a left-hander's to the left), the size of the break varies pitch to pitch, and every so often a curve backs up the other way like a real backdoor breaker. A short trail follows the ball so the break reads.
- **Bat drop**: a batter who puts the ball in play (or draws a walk) drops his bat — it tumbles onto the dirt beside the plate and lies there while he runs, then the bat boy clears it for the next hitter.
- **Batted balls**: 1d6 direction charts for righty/lefty hitters; fielders roll to catch (FB > 4, LD > 14) and to throw using Stater's throw charts; forced outs and −1 on tag plays; on an error (natural 1) the batter takes his normal hit advance and every runner moves up one base safely with no chance of being put out (two bases on a line drive).
- **Steals**: declared at the windup, resolved on a ball or strike — catcher rolls 1d20 + Fielding − Running vs 11.
- **You roll your team's dice**: every roll made by one of your players (pitch, swing, fielding, throws, fatigue) waits for you to tap ROLL; rolls by CPU players resolve on their own.
- **Dice engine**: every roll draws secure crypto entropy (uniform, well-mixed) and an anti-streak reroll, so a die never lands on the same face twice in a row.
- **MLB flow**: away bats first, home skips the 9th when leading, extra innings are full innings (no ghost runner).

## Season Mode

- **Profiles**: up to 2 saved season profiles (kept in your browser), each running up to 5 years/seasons — start, continue, delete, and they survive closing the app.
- Pick your MLB team, roll its 12-man roster, cut 3, assign positions, set the order — the CPU's 29 teams get their own rolled rosters.
- A compressed 30-game MLB-style schedule (heavy on division rivals, plus the rest of the league and interleague play), home and away, split into 5 weeks.
- **Matchup window** before every game: team-vs-team stat comparison, records and last-5 form, plus a coin toss — the winner's first swing of the game gets a momentum bump.
- **Clubhouse**: schedule view (week by week, results filled in), full 30-team standings by division, and the **MLB Wire** — a weekly news digest of simmed scores, injuries and hot streaks from around the league.
- Standings update after each game: the rest of the league plays on around you.
- **The off-season**: fan-base markets grow/shrink by finish (MLB cities, with adjacency), income by record tier and market type, player salaries by skill totals, off-season events for last-place teams, a rookie draft, minor-league development, and aging rolls after a player's 5th season. Treasury is tracked across years — all saved into your profile.