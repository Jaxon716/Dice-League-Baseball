"use strict";

/* =====================================================================
   DICE LEAGUE BASEBALL — engine rebuilt around John Stater's
   "Pen & Paper Baseball" rules, played with real MLB teams.
   ===================================================================== */

const GAME_VERSION = "33";

/* ================= MLB teams, markets, colors ================= */

const LEAGUES = {
  "American League": {
    "East": ["New York Yankees", "Baltimore Orioles", "Tampa Bay Rays", "Toronto Blue Jays", "Boston Red Sox"],
    "Central": ["Minnesota Twins", "Cleveland Guardians", "Detroit Tigers", "KC Royals", "Chicago White Sox"],
    "West": ["Houston Astros", "Texas Rangers", "Seattle Mariners", "LA Angels", "Oakland Athletics"]
  },
  "National League": {
    "East": ["Atlanta Braves", "Philadelphia Phillies", "NY Mets", "Miami Marlins", "Washington Nationals"],
    "Central": ["Milwaukee Brewers", "Chicago Cubs", "Cincinnati Reds", "St. Louis Cardinals", "Pittsburgh Pirates"],
    "West": ["LA Dodgers", "Arizona D-Backs", "SF Giants", "San Diego Padres", "Colorado Rockies"]
  }
};

const TEAM_COLORS = {
  "New York Yankees": ["#132448", "#c4c3c7"], "Baltimore Orioles": ["#df4601", "#000000"],
  "Tampa Bay Rays": ["#8fbcea", "#092c1e"], "Toronto Blue Jays": ["#134abc", "#1d2d37"],
  "Boston Red Sox": ["#bd3039", "#0c2c56"], "Minnesota Twins": ["#002b5c", "#d0001b"],
  "Cleveland Guardians": ["#0c2340", "#e5002b"], "Detroit Tigers": ["#0a1e3c", "#fa8c00"],
  "KC Royals": ["#0048cf", "#bdc9d6"], "Chicago White Sox": ["#000000", "#c4cdd8"],
  "Houston Astros": ["#002d59", "#eb6e1f"], "Texas Rangers": ["#003278", "#c01110"],
  "Seattle Mariners": ["#0c2c56", "#005c5c"], "LA Angels": ["#ba002c", "#003a70"],
  "Oakland Athletics": ["#003831", "#efbe00"], "Atlanta Braves": ["#132448", "#ce1141"],
  "Philadelphia Phillies": ["#e81828", "#002329"], "NY Mets": ["#002d72", "#ff5902"],
  "Miami Marlins": ["#003a70", "#ff611f"], "Washington Nationals": ["#ab0003", "#142912"],
  "Milwaukee Brewers": ["#12294b", "#ecc937"], "Chicago Cubs": ["#0e338c", "#cc3400"],
  "Cincinnati Reds": ["#c60111", "#000000"], "St. Louis Cardinals": ["#c4123c", "#012c6c"],
  "Pittsburgh Pirates": ["#fdb827", "#000000"], "LA Dodgers": ["#005a9c", "#ef3e42"],
  "Arizona D-Backs": ["#a71930", "#e3d4ad"], "SF Giants": ["#fd5a1c", "#000000"],
  "San Diego Padres": ["#2f241d", "#ffdc52"], "Colorado Rockies": ["#33066f", "#c4ced4"]
};

/* MLB cities as Stater media markets */
const MARKETS = {
  NY:  { name: "New York",      tier: "major", adj: ["BOS", "PHI", "WAS"] },
  LA:  { name: "Los Angeles",   tier: "major", adj: ["SD", "SF", "ARI"] },
  CHI: { name: "Chicago",       tier: "major", adj: ["MIL", "DET", "CIN", "STL", "MIN", "KC"] },
  BOS: { name: "Boston",        tier: "major", adj: ["NY", "BAL"] },
  SF:  { name: "San Francisco", tier: "major", adj: ["LA", "SD", "OAK", "SEA"] },
  PHI: { name: "Philadelphia",  tier: "major", adj: ["NY", "WAS", "BAL"] },
  ATL: { name: "Atlanta",       tier: "major", adj: ["MIA", "TB", "CIN"] },
  HOU: { name: "Houston",       tier: "major", adj: ["DAL", "TB"] },
  DAL: { name: "Dallas",        tier: "major", adj: ["HOU", "KC", "ARI"] },
  WAS: { name: "Washington",    tier: "major", adj: ["BAL", "PHI", "ATL"] },
  MIA: { name: "Miami",         tier: "major", adj: ["TB", "ATL"] },
  SEA: { name: "Seattle",       tier: "major", adj: ["OAK", "SF"] },
  ARI: { name: "Phoenix",       tier: "major", adj: ["LA", "SD", "COL", "DAL"] },
  TOR: { name: "Toronto",       tier: "major", adj: ["DET", "CLE", "BOS", "NY"] },
  MIL: { name: "Milwaukee",     tier: "minor", adj: ["CHI", "MIN"] },
  STL: { name: "St. Louis",     tier: "minor", adj: ["CHI", "KC", "CIN"] },
  CIN: { name: "Cincinnati",    tier: "minor", adj: ["CLE", "PIT", "STL", "ATL"] },
  BAL: { name: "Baltimore",     tier: "minor", adj: ["WAS", "PHI"] },
  SD:  { name: "San Diego",     tier: "minor", adj: ["LA", "ARI"] },
  DEN: { name: "Denver",        tier: "minor", adj: ["ARI", "KC"] },
  KC:  { name: "Kansas City",   tier: "minor", adj: ["STL", "MIN", "DAL", "DEN"] },
  DET: { name: "Detroit",       tier: "minor", adj: ["CLE", "CHI", "TOR"] },
  CLE: { name: "Cleveland",     tier: "minor", adj: ["DET", "CIN", "PIT"] },
  PIT: { name: "Pittsburgh",    tier: "minor", adj: ["CLE", "CIN"] },
  MIN: { name: "Minneapolis",   tier: "minor", adj: ["MIL", "KC", "CHI"] },
  TB:  { name: "Tampa",         tier: "minor", adj: ["MIA", "ATL", "HOU"] },
  OAK: { name: "Oakland",       tier: "minor", adj: ["SF", "SEA", "LA"] }
};

const TEAM_MARKET = {
  "New York Yankees": "NY", "NY Mets": "NY", "LA Dodgers": "LA", "LA Angels": "LA",
  "Chicago Cubs": "CHI", "Chicago White Sox": "CHI", "Boston Red Sox": "BOS",
  "SF Giants": "SF", "Philadelphia Phillies": "PHI", "Atlanta Braves": "ATL",
  "Houston Astros": "HOU", "Texas Rangers": "DAL", "Washington Nationals": "WAS",
  "Miami Marlins": "MIA", "Seattle Mariners": "SEA", "Arizona D-Backs": "ARI",
  "Toronto Blue Jays": "TOR", "Milwaukee Brewers": "MIL", "St. Louis Cardinals": "STL",
  "Cincinnati Reds": "CIN", "Baltimore Orioles": "BAL", "San Diego Padres": "SD",
  "Colorado Rockies": "DEN", "KC Royals": "KC", "Detroit Tigers": "DET",
  "Cleveland Guardians": "CLE", "Pittsburgh Pirates": "PIT", "Minnesota Twins": "MIN",
  "Tampa Bay Rays": "TB", "Oakland Athletics": "OAK"
};

const INCOME_TIERS = {
  "Best in Division": [120, 60], "Winning Record": [90, 45], "Even Record": [70, 35],
  "Losing Record": [50, 25], "Worst in Division": [40, 20]
};

const PITCH_TARGET = { "Fastball": 6, "Curve": 8, "Slider": 10 };
const PITCH_TYPES = ["Fastball", "Curve", "Slider"];

const POSITIONS = ["C", "P", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];

/* Stater charts */
const SWING_CHART = r => r <= 8 ? "Strike" : r <= 10 ? "Foul" : r <= 15 ? "Ground Ball" : r <= 18 ? "Fly Ball" : r === 19 ? "Line Drive" : "Home Run";
const GB_THROW = { P: 5, C: 8, "1B": 5, "2B": 8, "3B": 10, SS: 9 };
const GB_LOC_RH = ["3B", "3B", "SS", "SS", "2B", "1B"];
const GB_LOC_LH = ["1B", "1B", "2B", "2B", "SS", "3B"];
const OF_LOC_RH = ["LF", "LF", "LF", "CF", "CF", "RF"];
const OF_LOC_LH = ["RF", "RF", "RF", "CF", "CF", "LF"];
const FB_CATCH = 4;                       // fielder must beat 4
const LD_CATCH = 14;                      // fielder must beat 14
const LD_THROW = { RF: [14, 13, 17, 17], CF: [15, 12, 15, 18], LF: [17, 14, 13, 17] };
const FB_THROW = { RF: [9, 9, 13, 13], CF: [11, 8, 11, 11], LF: [12, 8, 8, 12] };
const STEAL_TARGET = 11;                  // catcher must beat 11
const THROW_COLS = ["First", "Second", "Third", "Home"];

/* ================= Helpers ================= */

/* dice engine: secure crypto entropy, well-mixed, with an anti-streak reroll
   so a die never lands on the same face twice in a row */
let rollSeq = 0;
function rngInt(max) { // uniform integer in [0, max)
  rollSeq++;
  if (max <= 0) return 0;
  let v;
  const lim = Math.floor(4294967296 / max) * max;
  do {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      v = buf[0];
    } else {
      v = Math.floor(Math.random() * 4294967296);
    }
    v = (v ^ (rollSeq * 2654435761) ^ Math.floor(performance.now() * 1000)) >>> 0;
  } while (v >= lim);
  return v % max;
}

function pick(arr) { return arr[rngInt(arr.length)]; }
function rint(a, b) { return a + rngInt(b - a + 1); }
const lastRoll = {};
function rollD(sides) { // rerolls once if the same face came up last on this die
  let v = rint(1, sides);
  if (v === lastRoll[sides] && sides > 2) v = rint(1, sides);
  lastRoll[sides] = v;
  return v;
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function abbr(name) { return name.slice(0, 3).trim().toUpperCase(); }
function lastName(n) { return String(n).split(" ").pop().toUpperCase(); }
function wait(ms) { return new Promise(res => setTimeout(res, ms)); }
function nextFrame() { // resolves on the next painted frame — or falls back to a
  // timer if that frame never fires (iOS can drop rAF when the app is
  // backgrounded mid-animation, which used to freeze the batter's walk-up)
  return new Promise(res => {
    let done = false;
    const go = () => { if (done) return; done = true; res(); };
    requestAnimationFrame(() => requestAnimationFrame(go));
    setTimeout(go, 150);
  });
}
function teamColors(t) { return TEAM_COLORS[t.name] || ["#5a6878", "#cfd8e0"]; }
function skillMod(score) { return score <= 3 ? -3 : score <= 5 ? -2 : score <= 8 ? -1 : score <= 12 ? 0 : score <= 15 ? 1 : score <= 17 ? 2 : 3; }
function baseOccupied(i) { return !!S.rotation[i + 1]; } // i = 0-based base (0 = 1st)

/* ================= Rosters (Stater team creation) ================= */

const FIRST_NAMES = ["Mike", "Jake", "Tyler", "Marcus", "Derek", "Chris", "Andre", "Luis", "Sam", "Kyle",
  "Omar", "Grant", "Devon", "Ray", "Trey", "Cole", "Blake", "Nate", "Zeke", "Milo", "Hank", "Pedro", "Ivan", "Rico"];
const LAST_NAMES = ["Medlen", "Nunez", "Carter", "Hayes", "Bishop", "Ortega", "Sloan", "Dooley", "Pratt", "Vance",
  "Whitlock", "Barrett", "Quinn", "Larkin", "Moss", "Delgado", "Fraser", "Holt", "Cobb", "Ruth", "Aaron", "Banks"];

/* Real MLB rosters: [name, bats, natural position] per club —
   the dice still roll every player's B/F/P/R per Stater's rules.
   The rookie draft pool stays fully generated (rollPlayer). */
const TEAM_ROSTERS = {
  "New York Yankees": [["Aaron Judge","R","OF"],["Giancarlo Stanton","R","DH"],["Trent Grisham","L","OF"],["Cody Bellinger","L","OF"],["Ben Rice","L","1B"],["Jazz Chisholm Jr.","L","2B"],["Anthony Volpe","R","SS"],["DJ LeMahieu","R","3B"],["Austin Wells","L","C"],["Max Fried","L","P"],["Carlos Rodón","L","P"],["Luke Weaver","R","P"]],
  "Boston Red Sox": [["Carlos Narváez","R","C"],["Triston Casas","L","1B"],["Kristian Campbell","R","2B"],["Trevor Story","R","SS"],["Alex Bregman","R","3B"],["Jarren Duran","L","OF"],["Roman Anthony","L","OF"],["Wilyer Abreu","L","OF"],["Masataka Yoshida","L","DH"],["Garrett Crochet","L","P"],["Brayan Bello","R","P"],["Aroldis Chapman","L","P"]],
  "Baltimore Orioles": [["Adley Rutschman","S","C"],["Ryan Mountcastle","R","1B"],["Jackson Holliday","L","2B"],["Gunnar Henderson","L","SS"],["Jordan Westburg","R","3B"],["Tyler O'Neill","L","OF"],["Colton Cowser","L","OF"],["Heston Kjerstad","L","OF"],["Ryan O'Hearn","L","DH"],["Zach Eflin","R","P"],["Dean Kremer","R","P"],["Félix Bautista","R","P"]],
  "Tampa Bay Rays": [["Danny Jansen","R","C"],["Jonathan Aranda","L","1B"],["Brandon Lowe","L","2B"],["Carson Williams","R","SS"],["Junior Caminero","R","3B"],["Yandy Díaz","R","DH"],["Josh Lowe","L","OF"],["Chandler Simpson","L","OF"],["Jake Mangum","L","OF"],["Christopher Morel","R","OF"],["Shane Baz","R","P"],["Ryan Pepiot","R","P"]],
  "Toronto Blue Jays": [["Alejandro Kirk","R","C"],["Vladimir Guerrero Jr.","R","1B"],["Andrés Giménez","L","2B"],["Bo Bichette","R","SS"],["Ernie Clement","R","3B"],["George Springer","R","OF"],["Daulton Varsho","L","OF"],["Anthony Santander","S","OF"],["Nathan Lukes","L","OF"],["Kevin Gausman","R","P"],["Trey Yesavage","R","P"],["Jeff Hoffman","R","P"]],
  "Detroit Tigers": [["Jake Rogers","R","C"],["Spencer Torkelson","R","1B"],["Gleyber Torres","R","2B"],["Colt Keith","L","DH"],["Javier Báez","R","SS"],["Zach McKinstry","L","3B"],["Riley Greene","L","OF"],["Parker Meadows","L","OF"],["Kerry Carpenter","L","OF"],["Tarik Skubal","L","P"],["Casey Mize","R","P"],["Tyler Holton","L","P"]],
  "Cleveland Guardians": [["Bo Naylor","L","C"],["Carlos Santana","S","1B"],["Daniel Schneemann","L","2B"],["Gabriel Arias","R","SS"],["José Ramírez","S","3B"],["Kyle Manzardo","L","DH"],["Steven Kwan","L","OF"],["Nolan Jones","R","OF"],["Chase DeLauter","L","OF"],["Tanner Bibee","R","P"],["Gavin Williams","R","P"],["Emmanuel Clase","R","P"]],
  "KC Royals": [["Salvador Perez","R","C"],["Vinnie Pasquantino","L","1B"],["Michael Massey","L","2B"],["Bobby Witt Jr.","R","SS"],["Maikel Garcia","R","3B"],["Jac Caglianone","L","DH"],["Kyle Isbel","R","OF"],["MJ Melendez","L","OF"],["Drew Waters","S","OF"],["Seth Lugo","R","P"],["Cole Ragans","L","P"],["Carlos Estévez","R","P"]],
  "Chicago White Sox": [["Edgar Quero","R","C"],["Miguel Vargas","R","1B"],["Lenyn Sosa","R","2B"],["Colson Montgomery","L","SS"],["Chase Meidroth","R","3B"],["Luis Robert Jr.","R","OF"],["Andrew Benintendi","L","OF"],["Brooks Baldwin","R","OF"],["Kyle Teel","R","DH"],["Shane Smith","R","P"],["Davis Martin","R","P"],["Grant Taylor","R","P"]],
  "Minnesota Twins": [["Ryan Jeffers","R","C"],["Kody Clemens","L","1B"],["Brooks Lee","S","2B"],["Royce Lewis","R","3B"],["Carlos Correa","R","SS"],["Byron Buxton","R","OF"],["Matt Wallner","L","OF"],["Trevor Larnach","L","OF"],["DaShawn Keirsey","L","OF"],["Joe Ryan","R","P"],["Pablo López","R","P"],["Cole Sands","R","P"]],
  "Houston Astros": [["Yainer Díaz","R","C"],["Christian Walker","R","1B"],["Jose Altuve","R","2B"],["Jeremy Peña","R","SS"],["Isaac Paredes","R","3B"],["Yordan Alvarez","L","DH"],["Jake Meyers","R","OF"],["Mauricio Dubón","R","OF"],["Cam Smith","R","OF"],["Framber Valdez","L","P"],["Hunter Brown","R","P"],["Josh Hader","L","P"]],
  "Texas Rangers": [["Jonah Heim","S","C"],["Jake Burger","R","1B"],["Marcus Semien","R","2B"],["Corey Seager","L","SS"],["Josh Jung","R","3B"],["Wyatt Langford","R","OF"],["Adolis García","R","OF"],["Evan Carter","L","OF"],["Joc Pederson","L","DH"],["Nathan Eovaldi","R","P"],["Jacob deGrom","R","P"],["Shawn Armstrong","R","P"]],
  "Seattle Mariners": [["Cal Raleigh","S","C"],["Josh Naylor","L","1B"],["Jorge Polanco","S","2B"],["J.P. Crawford","L","SS"],["Eugenio Suárez","R","3B"],["Randy Arozarena","R","OF"],["Julio Rodríguez","R","OF"],["Dominic Canzone","L","OF"],["Luke Raley","L","DH"],["Luis Castillo","R","P"],["Bryce Miller","R","P"],["Andrés Muñoz","R","P"]],
  "LA Angels": [["Logan O'Hoppe","R","C"],["Nolan Schanuel","L","1B"],["Christian Moore","R","2B"],["Zach Neto","R","SS"],["Yoán Moncada","S","3B"],["Mike Trout","R","OF"],["Jo Adell","R","OF"],["Gustavo Campero","L","OF"],["Jorge Soler","R","DH"],["Yusei Kikuchi","L","P"],["José Soriano","R","P"],["Kenley Jansen","R","P"]],
  "Oakland Athletics": [["Shea Langeliers","R","C"],["Tyler Soderstrom","L","1B"],["Zack Gelof","R","2B"],["Jacob Wilson","R","SS"],["Brett Harris","R","3B"],["Brent Rooker","R","DH"],["Lawrence Butler","L","OF"],["Colby Thomas","R","OF"],["Denzel Clarke","R","OF"],["Luis Severino","R","P"],["Jeffrey Springs","L","P"],["José Leclerc","R","P"]],
  "Atlanta Braves": [["Sean Murphy","R","C"],["Matt Olson","L","1B"],["Ozzie Albies","S","2B"],["Nick Allen","R","SS"],["Austin Riley","R","3B"],["Ronald Acuña Jr.","R","OF"],["Michael Harris II","R","OF"],["Jurickson Profar","S","OF"],["Drake Baldwin","L","DH"],["Spencer Strider","R","P"],["Chris Sale","L","P"],["Raisel Iglesias","R","P"]],
  "Miami Marlins": [["Agustín Ramírez","R","C"],["Eric Wagaman","R","1B"],["Xavier Edwards","L","2B"],["Otto López","R","SS"],["Connor Norby","R","3B"],["Kyle Stowers","L","OF"],["Dane Myers","R","OF"],["Griffin Conine","L","OF"],["Graham Pauley","R","DH"],["Cal Quantrill","R","P"],["Sandy Alcántara","R","P"],["Anthony Bender","R","P"]],
  "NY Mets": [["Francisco Alvarez","R","C"],["Pete Alonso","R","1B"],["Marcus Semien","R","2B"],["Francisco Lindor","S","SS"],["Mark Vientos","R","3B"],["Juan Soto","L","OF"],["Cedric Mullins","L","OF"],["Jeff McNeil","L","OF"],["Brett Baty","L","DH"],["Kodai Senga","R","P"],["David Peterson","L","P"],["Edwin Díaz","R","P"]],
  "Philadelphia Phillies": [["J.T. Realmuto","R","C"],["Bryce Harper","L","1B"],["Bryson Stott","L","2B"],["Trea Turner","R","SS"],["Alec Bohm","R","3B"],["Kyle Schwarber","L","DH"],["Nick Castellanos","R","OF"],["Brandon Marsh","L","OF"],["Harrison Bader","R","OF"],["Zack Wheeler","R","P"],["Jesús Luzardo","L","P"],["Jhoan Duran","R","P"]],
  "Washington Nationals": [["Keibert Ruiz","S","C"],["Nathaniel Lowe","L","1B"],["Luis García Jr.","R","2B"],["CJ Abrams","L","SS"],["Brady House","R","3B"],["James Wood","L","OF"],["Dylan Crews","R","OF"],["Jacob Young","R","OF"],["Josh Bell","S","DH"],["MacKenzie Gore","L","P"],["Mitchell Parker","L","P"],["Kyle Finnegan","R","P"]],
  "Milwaukee Brewers": [["William Contreras","R","C"],["Jake Bauers","L","1B"],["Brice Turang","L","2B"],["Joey Ortiz","R","SS"],["Caleb Durbin","R","3B"],["Christian Yelich","L","OF"],["Jackson Chourio","R","OF"],["Sal Frelick","L","OF"],["Isaac Collins","L","DH"],["Brandon Woodruff","R","P"],["Freddy Peralta","R","P"],["Trevor Megill","R","P"]],
  "Chicago Cubs": [["Carson Kelly","R","C"],["Michael Busch","L","1B"],["Nico Hoerner","R","2B"],["Dansby Swanson","R","SS"],["Matt Shaw","R","3B"],["Kyle Tucker","R","OF"],["Ian Happ","S","OF"],["Pete Crow-Armstrong","L","OF"],["Seiya Suzuki","L","DH"],["Justin Steele","L","P"],["Shota Imanaga","L","P"],["Daniel Palencia","R","P"]],
  "Cincinnati Reds": [["Tyler Stephenson","R","C"],["Spencer Steer","R","1B"],["Matt McLain","L","2B"],["Elly De La Cruz","S","SS"],["Ke'Bryan Hayes","R","3B"],["Austin Hays","R","OF"],["TJ Friedl","L","OF"],["Will Benson","L","OF"],["Noelvi Marte","R","DH"],["Hunter Greene","R","P"],["Andrew Abbott","L","P"],["Emilio Pagan","R","P"]],
  "St. Louis Cardinals": [["Pedro Pagés","R","C"],["Willson Contreras","R","1B"],["Brendan Donovan","L","2B"],["Masyn Winn","R","SS"],["Nolan Arenado","R","3B"],["Iván Herrera","R","DH"],["Lars Nootbaar","L","OF"],["Victor Scott II","L","OF"],["Jordan Walker","R","OF"],["Sonny Gray","R","P"],["Miles Mikolas","R","P"],["JoJo Romero","L","P"]],
  "Pittsburgh Pirates": [["Henry Davis","R","C"],["Spencer Horwitz","L","1B"],["Nick Gonzales","R","2B"],["Isiah Kiner-Falefa","S","SS"],["Jared Triolo","R","3B"],["Bryan Reynolds","S","OF"],["Oneil Cruz","R","OF"],["Jack Suwinski","L","OF"],["Andrew McCutchen","R","DH"],["Paul Skenes","R","P"],["Mitch Keller","R","P"],["Dennis Santana","R","P"]],
  "LA Dodgers": [["Will Smith","R","C"],["Freddie Freeman","L","1B"],["Hyeseong Kim","L","2B"],["Miguel Rojas","R","SS"],["Max Muncy","L","3B"],["Shohei Ohtani","R","DH"],["Teoscar Hernández","R","OF"],["Mookie Betts","R","OF"],["Andy Pages","R","OF"],["Yoshinobu Yamamoto","R","P"],["Blake Snell","L","P"],["Tyler Glasnow","R","P"]],
  "Arizona D-Backs": [["Gabriel Moreno","R","C"],["Pavin Smith","L","1B"],["Ketel Marte","S","2B"],["Geraldo Perdomo","S","SS"],["Blaze Alexander","R","3B"],["Corbin Carroll","L","OF"],["Lourdes Gurriel Jr.","R","OF"],["Alek Thomas","L","OF"],["Adrian Del Castillo","R","DH"],["Brandon Pfaadt","R","P"],["Eduardo Rodriguez","L","P"],["Kevin Ginkel","R","P"]],
  "SF Giants": [["Patrick Bailey","S","C"],["Rafael Devers","L","1B"],["Tyler Fitzgerald","R","2B"],["Willy Adames","R","SS"],["Matt Chapman","R","3B"],["Jung Hoo Lee","L","OF"],["Heliot Ramos","R","OF"],["Luis Matos","R","OF"],["Bryce Eldridge","L","DH"],["Logan Webb","R","P"],["Robbie Ray","L","P"],["Ryan Walker","R","P"]],
  "San Diego Padres": [["Freddy Fermín","R","C"],["Luis Arraez","L","1B"],["Jake Cronenworth","L","2B"],["Xander Bogaerts","R","SS"],["Manny Machado","R","3B"],["Fernando Tatis Jr.","R","OF"],["Jackson Merrill","L","OF"],["Ramón Laureano","R","OF"],["Elías Díaz","R","DH"],["Nick Pivetta","R","P"],["Michael King","R","P"],["Jason Adam","R","P"]],
  "Colorado Rockies": [["Hunter Goodman","R","C"],["Michael Toglia","L","1B"],["Thairo Estrada","R","2B"],["Ezequiel Tovar","R","SS"],["Tyler Freeman","R","3B"],["Brenton Doyle","R","OF"],["Mickey Moniak","L","OF"],["Jordan Beck","L","OF"],["Sam Hilliard","L","DH"],["German Marquez","R","P"],["Kyle Freeland","L","P"],["Jimmy Herget","R","P"]]
};

function rollPlayer() {
  const roll3d6 = () => rint(1, 6) + rint(1, 6) + rint(1, 6);
  const h = rollD(20);
  return {
    name: pick(FIRST_NAMES) + " " + pick(LAST_NAMES),
    B: roll3d6(), F: roll3d6(), P: roll3d6(), R: roll3d6(),
    hand: h <= 13 ? "R" : h <= 18 ? "L" : "S",
    seasons: 0, fatigue: 0, noMinor: false
  };
}
function totalSkill(p) { return p.B + p.F + p.P + p.R; }
function salaryOf(p) {
  const t = totalSkill(p);
  if (t >= 64) return 30; if (t >= 58) return 15; if (t >= 50) return 8;
  if (t >= 35) return 4; if (t >= 23) return 2; if (t >= 16) return 1;
  return 0.5;
}
function rollRoster(teamName) {
  const r = [];
  const real = TEAM_ROSTERS[teamName];
  if (real) { // real MLB club: real names, real hands; skills still come from the dice
    real.forEach(e => {
      const p = rollPlayer();
      p.name = e[0];
      p.hand = e[1];
      p.realPos = e[2];
      r.push(p);
    });
    return r;
  }
  for (let i = 0; i < 12; i++) r.push(rollPlayer());
  return r;
}

/* NPTs / quick teams: line up real positions where they exist, skill decides the rest; pitcher bats last */
function autoAssign(roster) {
  const taken = new Set();
  const choose = (want, skillKey) => {
    const cands = roster.filter(p => !taken.has(p));
    const got = cands.find(p => p.realPos === want) ||
      cands.slice().sort((a, b) => b[skillKey] - a[skillKey])[0];
    taken.add(got);
    return got;
  };
  const pitcher = choose("P", "P");
  const C = choose("C", "F");
  const SS = choose("SS", "F");
  const three = choose("3B", "F");
  const two = choose("2B", "F");
  const first = choose("1B", "F");
  const of1 = choose("OF", "F");
  const of2 = choose("OF", "F");
  const of3 = choose("OF", "F");
  const positions = { P: pitcher, C, SS, "3B": three, "2B": two, "1B": first, LF: of1, CF: of2, RF: of3 };
  const starters = [C, two, SS, three, first, of1, of2, of3].sort((a, b) => b.B - a.B);
  const lineup = starters.concat([pitcher]); // no DH: the pitcher bats last
  return { positions, lineup, roster };
}

/* ================= Field geometry ================= */

const P = {
  home: [200, 295],
  b: [[258, 240], [200, 182], [142, 240]],
  mound: [200, 244],
  catcher: [200, 314],
  def: { "P": [200, 244], "C": [200, 314], "1B": [270, 244], "2B": [244, 198], "SS": [158, 198], "3B": [136, 252], "LF": [93, 144], "CF": [200, 110], "RF": [307, 144] },
  land: { 1: [200, 125], 2: [300, 80], 3: [100, 68], 4: [200, 12] },
  foul: [[60, 252], [340, 252], [64, 328], [336, 328]],
  dugoutV: [110, 310], dugoutH: [290, 310]
};

const BENCH_OFFSETS = [[-20, 2], [-15, 6], [-10, 1], [-5, 5], [0, 0], [5, 5], [10, 1], [15, 6], [20, 2]]; // tight row inside the dugout box

function basePt(i) { return P.b[i]; }
function setXY(el, p, scale) {
  const t = "translate(" + p[0] + "px, " + p[1] + "px) scale(" + (scale || 1.15) + ")";
  if (el._t !== t) { el._t = t; el.style.transform = t; }
}

function jersey(id, cls, withBat) {
  const skin = pick(["#c8956c", "#8d5a2b", "#f1c27a", "#6b4226"]);
  return '<g id="' + id + '" class="player ' + cls + '" style="opacity:0">' +
    '<g class="body">' +
    '<rect class="leg1" x="-2.6" y="2" width="2" height="5" rx="0.8" fill="#e8e8e8" stroke="#999" stroke-width="0.5"/>' +
    '<rect class="leg2" x="0.6" y="2" width="2" height="5" rx="0.8" fill="#e8e8e8" stroke="#999" stroke-width="0.5"/>' +
    (withBat ?
      '<g class="bat">' +
      '<rect x="0.5" y="-1.6" width="3.2" height="1.7" rx="0.8" fill="#8a5a2b"/>' +
      '<rect x="1.1" y="-10.2" width="2.2" height="9.2" rx="1.1" fill="#c88540"/>' +
      '<rect x="1.5" y="-11.1" width="1.4" height="1.3" rx="0.65" fill="#e6b877"/>' +
      '</g>' +
      '<g transform="translate(4 -4)"><g class="spark" opacity="0">' +
      '<circle r="1.1" fill="#fff"/>' +
      '<circle cx="2.6" cy="-1" r="0.7" fill="#ffe066"/>' +
      '<circle cx="-2.2" cy="1" r="0.6" fill="#ffe066"/>' +
      '<circle cx="1.5" cy="2.4" r="0.55" fill="#fff"/>' +
      '<circle cx="-1.5" cy="-2.3" r="0.5" fill="#fff"/>' +
      '</g></g>' : "") +
    '<rect class="jersey" x="-4.5" y="-3.5" width="9" height="7.5" rx="1.5"/>' +
    '<circle cx="0" cy="-6" r="2.8" fill="' + skin + '"/>' +
    '<path class="cap" d="M-2.8 -6.6 A2.8 2.8 0 0 1 2.8 -6.6 Z"/>' +
    '<g class="glove">' +
      '<ellipse cx="4" cy="-3.4" rx="2" ry="2.4" fill="#7a4a1e" stroke="#3d2410" stroke-width="0.4"/>' +
      '<path d="M2.4 -4.6 Q4 -6 5.6 -4.6" fill="none" stroke="#3d2410" stroke-width="0.4"/>' +
    '</g>' +
    '</g></g>';
}

function pop(id, cls) {
  if (!id) return;
  const root = document.getElementById(id);
  if (!root) return;
  const body = root.querySelector(".body");
  if (!body) return;
  body.classList.remove("catchpop", "throwing");
  nextFrame().then(() => {
    body.classList.add(cls);
    setTimeout(() => body.classList.remove(cls), 620);
  });
}

/* ---- defense choreography: fielders field, chase drops, throw to each other ---- */
function getDefPt(pos) {
  return S.defPos && S.defPos[pos] ? S.defPos[pos] : (P.def[pos] || [200, 220]);
}
async function moveDef(pos, to, dur) { // a fielder moves to a spot (chasing a dropped ball)
  const el = document.getElementById("def" + pos);
  if (!el) return;
  await glide(el, getDefPt(pos), to, dur || 450);
  if (!S.defPos) S.defPos = {};
  S.defPos[pos] = to;
}
function returnDefs() { // fire-and-forget: displaced fielders jog back to their stations
  Object.keys(S.defPos || {}).forEach(pos => {
    const cur = S.defPos[pos], home = P.def[pos];
    if (home && (Math.abs(cur[0] - home[0]) > 1 || Math.abs(cur[1] - home[1]) > 1)) moveDef(pos, home, 600);
  });
}
function showBallAt(pt) { // leave the ball lying where it dropped while a fielder recovers it
  const b = document.getElementById("ball");
  if (b) { b.style.transition = "none"; setXY(b, pt); b.style.opacity = "1"; }
}
function hideBall() {
  const b = document.getElementById("ball");
  if (b) b.style.opacity = "0";
}

/* ---- the bat he leaves behind: a batter who puts the ball in play drops his bat at the plate ---- */
function dropBat(el) {
  if (el) el.classList.remove("atbat"); // it's out of his hands now
  const db = document.getElementById("droppedbat");
  if (!db) return;
  db.classList.remove("drop");
  db.getBoundingClientRect(); // restart the fall animation
  db.style.opacity = "1";
  db.classList.add("drop");
  clearTimeout(dropBat._t);
  dropBat._t = setTimeout(clearDropBat, 4000);
}

function clearDropBat() {
  clearTimeout(dropBat._t);
  const db = document.getElementById("droppedbat");
  if (!db) return;
  db.classList.remove("drop");
  db.style.opacity = "0";
}

function swingBatter(type) {
  const el = document.querySelector(".atbat");
  if (!el) { return await0(250); }
  const body = el.querySelector(".body");
  if (!body) { return await0(250); }
  const cls = type === "miss" ? "swingmiss" : type === "tip" ? "swingtip" : "swing";
  body.classList.remove("swing", "swingmiss", "swingtip");
  if (cls === "swing") { // bat meets ball — flash the impact rings at the plate
    const fx = document.getElementById("contactfx");
    if (fx) { fx.classList.remove("flash"); fx.getBoundingClientRect(); fx.classList.add("flash"); }
  }
  nextFrame().then(() => {
    body.classList.add(cls);
    setTimeout(() => body.classList.remove(cls), 620);
  });
  return wait(type === "miss" ? 560 : 420);
}
function await0(ms) { return wait(ms); }

function buildField() {
  const fw = document.getElementById("fieldwrap");
  if (!fw || fw.hasChildNodes()) return;

  const a = 0.82;
  const fan = (r) => "M200 295 L" + (200 - r * Math.sin(a)) + " " + (295 - r * Math.cos(a)) +
    " A" + r + " " + r + " 0 0 1 " + (200 + r * Math.sin(a)) + " " + (295 - r * Math.cos(a)) + " Z";
  const baseSq = (p) => '<rect x="-6" y="-6" width="12" height="12" fill="#e8e8e8" stroke="#777" stroke-width="1" transform="translate(' + p[0] + ' ' + p[1] + ') rotate(45)"/>';

  const CROWD_COLORS = ["#e8c98b", "#c96b4a", "#7d9bd6", "#c877b0", "#90b87d", "#d8d8d8", "#b857d6", "#d6a45e"];
  let crowd = "";
  for (let i = 0; i < 140; i++) {
    const ang = -a + (2 * a) * Math.random();
    const r = 214 + Math.random() * 30;
    crowd += '<circle cx="' + (200 + r * Math.sin(ang)).toFixed(1) + '" cy="' + (295 - r * Math.cos(ang)).toFixed(1) + '" r="1.6" fill="' + pick(CROWD_COLORS) + '" opacity="0.9"/>';
  }

  let stripes = "";
  for (let i = 0; i < 4; i++) {
    const d = (i + 0.5) * 52;
    stripes += '<rect x="-300" y="-13" width="600" height="26" fill="#ffffff" opacity="0.07"' +
      ' transform="translate(200 ' + (295 - d) + ') rotate(' + (i % 2 ? -38 : 38) + ')"/>';
  }

  const defs = Object.keys(P.def).map(k =>
    jersey("def" + k, "", true).replace('style="opacity:0"', 'style="transform:translate(' + P.def[k][0] + 'px,' + P.def[k][1] + 'px) scale(1.15)"')
  ).join("");

  fw.innerHTML =
    '<svg viewBox="0 0 400 340">' +
    '<defs><clipPath id="grassclip"><path d="' + fan(196) + '"/></clipPath></defs>' +
    '<path d="' + fan(248) + '" fill="#22262d" stroke="#0d0f12" stroke-width="4"/>' +
    crowd +
    '<path d="' + fan(210) + '" fill="#46403a"/>' +
    '<path d="' + fan(196) + '" fill="#307c38"/>' +
    '<g clip-path="url(#grassclip)">' + stripes + '</g>' +
    '<path d="M200 295 L' + (200 - 250 * Math.sin(a)) + ' ' + (295 - 250 * Math.cos(a)) +
      ' M200 295 L' + (200 + 250 * Math.sin(a)) + ' ' + (295 - 250 * Math.cos(a)) + '" stroke="#f2f2f2" stroke-width="3"/>' +
    '<circle cx="200" cy="226" r="60" fill="#c9a166"/>' +
    '<rect x="-34" y="-34" width="68" height="68" fill="#2e7d32" transform="translate(200 238) rotate(45)"/>' +
    '<circle cx="200" cy="246" r="12" fill="#cfae72"/>' +
    '<circle cx="200" cy="292" r="28" fill="#c9a166"/>' +
    '<rect x="-8" y="-11" width="7" height="22" fill="none" stroke="#f2f2f2" stroke-width="1.5" transform="translate(180 292) rotate(8)"/>' +
    '<rect x="1" y="-11" width="7" height="22" fill="none" stroke="#f2f2f2" stroke-width="1.5" transform="translate(220 292) rotate(-8)"/>' +
    '<rect x="-11" y="-7" width="22" height="14" fill="none" stroke="#f2f2f2" stroke-width="1.5" transform="translate(200 316)"/>' +
    '<circle cx="98" cy="302" r="11" fill="none" stroke="#e8e8e8" stroke-width="2"/>' +
    '<circle cx="302" cy="302" r="11" fill="none" stroke="#e8e8e8" stroke-width="2"/>' +
    '<g>' +
      '<rect x="-20" y="-11" width="40" height="22" rx="3" fill="#2a2f36" stroke="#555f66" stroke-width="1" transform="translate(110 310)"/>' +
      '<rect x="-22" y="-14" width="44" height="4" rx="2" fill="#3d444d" transform="translate(110 310)"/>' +
      '<rect x="-20" y="-11" width="40" height="22" rx="3" fill="#2a2f36" stroke="#555f66" stroke-width="1" transform="translate(290 310)"/>' +
      '<rect x="-22" y="-14" width="44" height="4" rx="2" fill="#3d444d" transform="translate(290 310)"/>' +
    '</g>' +
    '<path d="M200 295 L258 240 M258 240 L200 182 M200 182 L142 240 M142 240 L200 295" stroke="#e9dcc0" stroke-width="1.5"/>' +
    baseSq(P.b[0]) + baseSq(P.b[1]) + baseSq(P.b[2]) +
    '<g transform="translate(200 295)"><g id="contactfx" opacity="0">' +
      '<circle r="5" fill="none" stroke="#ffffff" stroke-width="1.5"/>' +
      '<circle r="9" fill="none" stroke="#ffe066" stroke-width="1.2"/>' +
      '<circle r="13" fill="none" stroke="#ffffff" stroke-width="0.8"/>' +
    '</g></g>' +
    '<path d="M195 292 L205 292 L205 298 L200 301 L195 298 Z" fill="#e8e8e8" stroke="#777"/>' +
    defs +
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => jersey("off" + i, "off", true)).join("") +
    '<g id="droppedbat" style="opacity:0" transform="translate(170 301) rotate(22)">' +
      '<g class="dropshape">' +
        '<rect x="-8" y="-1.5" width="2.4" height="3" rx="1" fill="#7a4a1e"/>' +
        '<rect x="-6" y="-0.9" width="6" height="1.8" rx="0.9" fill="#b07a3c"/>' +
        '<rect x="0" y="-1.6" width="8.5" height="3.2" rx="1.5" fill="#c88540"/>' +
      '</g>' +
    '</g>' +
    '<circle id="tr0" class="ptrail" r="2.6" style="opacity:0"></circle>' +
    '<circle id="tr1" class="ptrail" r="2" style="opacity:0"></circle>' +
    '<circle id="tr2" class="ptrail" r="1.5" style="opacity:0"></circle>' +
    '<circle id="ball" r="4" style="opacity:0"></circle>' +
    '</svg>';
}

function updateField() {
  if (!S || S.screen !== "game") return;
  // self-heal: any retired figure whose walk home got interrupted snaps to his own seat
  S.retiring.slice().forEach(id => {
    const el = document.getElementById(id);
    if (!el) { // his figure is gone — he can't walk home; drop him and move on
      S.retiring = S.retiring.filter(x => x !== id);
      return;
    }
    if (!el._anim) {
      const i = parseInt(id.slice(3), 10);
      el.style.transition = "none";
      setXY(el, benchPos(i));
      el.dataset.base = "bench";
      S.retiring = S.retiring.filter(x => x !== id);
    }
  });
  // one guy at the plate area at a time — and only between plays: no one steps out mid-play
  if (S.phase === "windup" && !S.awaitNext && !S.retiring.length && !S.walkingOut.length) sendBatterOut();
  // repaint both squads whenever the teams change — never carry last game's colors over
  if (S._colKey !== String(S.isBottom)) {
    S._colKey = String(S.isBottom);
    const defC = fieldingTeam() ? teamColors(fieldingTeam()) : null;
    const offC = battingTeam() ? teamColors(battingTeam()) : null;
    for (let i = 0; i < 9; i++) {
      const el = document.getElementById("off" + i);
      if (el && offC) { el.style.setProperty("--p", offC[0]); el.style.setProperty("--s", offC[1]); }
    }
    Object.keys(P.def).forEach(k => {
      const el = document.getElementById("def" + k);
      if (el && defC) { el.style.setProperty("--p", defC[0]); el.style.setProperty("--s", defC[1]); }
    });
  }
  for (let i = 0; i < 9; i++) {
    const id = "off" + i;
    const el = document.getElementById(id);
    if (!el) continue;
    if (S.retiring.includes(id) || S.walkingOut.includes(id)) continue;
    if (el._anim) continue; // a run/walk animation owns this figure right now
    const slot = S.rotation.indexOf(id);
    el.classList.toggle("atbat", slot === 0);
    // on-base figures are positioned exclusively by their run animations — updateField never teleports them
    if (slot === -1) {
      el.dataset.base = "bench";
      el.style.transition = "none";
      el.style.opacity = "1";
      setXY(el, benchPos(i), 1.0); // idle bench figure back in his seat
    }
  }
  const b = document.getElementById("ball");
  if (b) b.style.opacity = "0";
}

/* ================= Figure movement helpers ================= */

function benchPos(i) { const d = dugoutPos(); return [d[0] + BENCH_OFFSETS[i][0], d[1] + BENCH_OFFSETS[i][1]]; }
function dugoutPos() { return battingTeam() === S.home ? P.dugoutH : P.dugoutV; }
function defDugoutPos() { return fieldingTeam() === S.home ? P.dugoutH : P.dugoutV; }

function ballTo(from, to, dur) {
  return new Promise(async res => {
    const b = document.getElementById("ball");
    if (!b) { await wait(dur); res(); return; }
    b.style.transition = "none";
    setXY(b, from);
    b.style.opacity = "1";
    await nextFrame();
    b.style.transition = "transform " + dur + "ms linear";
    setXY(b, to);
    await wait(dur + 40);
    b.style.opacity = "0";
    res();
  });
}

async function ballArc(from, to, dur, h) { // the ball sails through the air in a hump
  const b = document.getElementById("ball");
  if (!b) { await wait(dur); return; }
  const steps = 8;
  const cx = (from[0] + to[0]) / 2;
  const cy = (from[1] + to[1]) / 2 - (h || 70);
  const px = t => (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * cx + t * t * to[0];
  const py = t => (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * cy + t * t * to[1];
  b.style.opacity = "1";
  for (let i = 0; i < steps; i++) {
    await glide(b, i === 0 ? from : [px(i / steps), py(i / steps)], [px((i + 1) / steps), py((i + 1) / steps)], dur / steps);
  }
  b.style.opacity = "0";
}

/* ---- the pitch itself: each offering flies its own way to the plate ---- */
function quadPath(a, c, z, n) { // quadratic bezier: mound a, control c, plate z
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([
      u * u * a[0] + 2 * u * t * c[0] + t * t * z[0],
      u * u * a[1] + 2 * u * t * c[1] + t * t * z[1]
    ]);
  }
  return pts;
}

/* breaking-ball shape: the pitcher's hand sets the natural side (a RHP's
   breaker runs to screen right), with the odd backdoor/backup curve going
   the other way. Size and bite vary pitch to pitch. */
function breakShape(type) {
  const hand = S && S.pitcher && S.pitcher.hand === "L" ? -1 : 1;
  const backChance = type === "Curve" ? 22 : 16;
  const back = rint(1, 100) <= backChance;
  return {
    side: back ? -hand : hand,
    apex: rint(22, 40),
    bite: rint(12, 22)
  };
}

/* curve: a late bow — the sweep peaks past halfway and snaps back */
function curvePath(a, z, sh) {
  const c = [a[0] + sh.side * sh.apex * 2, a[1] + 34];
  const end = [z[0] + sh.side * sh.apex * 0.15, z[1]];
  return quadPath(a, c, end, 12);
}

/* slider: rides straight, then bites late at a sharp angle */
function sliderPath(a, z, sh) {
  const pts = [];
  const n = 10;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const late = Math.max(0, (t - 0.42) / 0.58);
    const lat = sh.side * sh.bite * late * late;
    pts.push([a[0] + (z[0] - a[0]) * t + lat, a[1] + (z[1] - a[1]) * t]);
  }
  return pts;
}

async function pitchFlight(type) {
  // fastball: no break, straight and quick, growing at the hitter
  // curve: a late bow — side and size change pitch to pitch
  // slider: rides straight, then bites late at a varying angle
  const a = P.mound, z = P.home;
  const OPS = [0.45, 0.3, 0.16];
  let pts, dur;
  if (type === "Curve") {
    pts = curvePath(a, z, breakShape(type));
    dur = rint(560, 700);
  } else if (type === "Slider") {
    pts = sliderPath(a, z, breakShape(type));
    dur = rint(380, 460);
  } else {
    pts = [a, [a[0], a[1] + 20], z];
    dur = rint(220, 270);
  }
  const b = document.getElementById("ball");
  const tris = ["tr0", "tr1", "tr2"].map(id => document.getElementById(id));
  if (!b) { await wait(dur); return; }
  b.style.transition = "none";
  setXY(b, pts[0]);
  b.style.opacity = "1";
  await nextFrame();
  const steps = pts.length - 1, per = dur / steps;
  for (let i = 0; i < steps; i++) {
    const grow = type === "Fastball" ? 1.15 + 0.35 * ((i + 1) / steps) : 1.15;
    b.style.transition = "transform " + per + "ms linear";
    setXY(b, pts[i + 1], grow);
    await wait(per);
    // lay a short trail behind the ball so the movement reads
    tris.forEach((tr, k) => {
      if (!tr || i < k) return; // the first steps have no trail yet
      tr.style.transition = "none";
      setXY(tr, pts[i - k], 1);
      tr.style.opacity = String(OPS[k]);
    });
  }
  b.style.opacity = "0";
  tris.forEach(tr => { if (tr) tr.style.opacity = "0"; });
}

function catchAt(pos, defId, dur) {
  return new Promise(res => {
    const b = document.getElementById("ball");
    if (b) {
      b.style.transition = "none";
      setXY(b, pos);
      b.style.opacity = "1";
      setTimeout(() => { b.style.opacity = "0"; res(); }, dur);
    } else setTimeout(res, dur);
    if (defId) pop(defId, "catchpop");
  });
}

function showBanner(text, type) {
  const stage = document.getElementById("fieldstage");
  if (!stage) return;
  const b = document.createElement("div");
  b.className = "banner b-" + type;
  b.textContent = text;
  stage.appendChild(b);
  setTimeout(() => b.remove(), 1400);
}

/* ---- hand-rolled dice: the player rolls every die themselves ---- */

async function rollDie(sides, label, manual) { // manual: waits for the player to tap ROLL; otherwise the CPU's die resolves itself
  if (!manual) {
    const v = rollD(sides);
    S.pendingRoll = { sides, label, done: true, value: v, auto: true };
    render();
    await wait(550);
    if (S.pendingRoll && S.pendingRoll.auto) S.pendingRoll = null;
    render();
    return v;
  }
  return new Promise(res => {
    S.pendingRoll = { sides, label, done: false, value: null, res };
    render();
  });
}

function onRollDie() {
  const pr = S.pendingRoll;
  if (!pr || pr.done || S.pauseOpen) return;
  pr.value = rollD(pr.sides);
  pr.done = true;
  render();
  setTimeout(() => {
    if (S.pendingRoll === pr) S.pendingRoll = null;
    render();
    pr.res(pr.value);
  }, 800);
}

/* missing geometry helpers (into the crowd / into the grass) */
function crowdPt() { return [200 + (Math.random() * 150 - 75), 20 + Math.random() * 55]; }
function grassGap(f, m) { const k = m || 1; return [f[0] + (Math.random() * 60 - 30) * k, f[1] + (Math.random() * 50 - 25) * k]; }

/* ================= State ================= */

let S = null;

function freshState() {
  return {
    screen: "title",
    visitor: null, home: null, userSide: null,
    score: { Visitor: 0, Home: 0 },
    bases: [0, 0, 0],
    rotation: [null, null, null, null],
    baseRunners: [null, null, null, null],     // player objects parallel to rotation slots
    inning: 1, isBottom: false,
    outs: 0, balls: 0, strikes: 0,
    log: ["--- Play Ball! ---"],
    phase: "windup",
    pitchType: null,
    stealTry: null,                            // base index (0-2) of a declared runner
    lineup: [], batIdx: 0,                     // batting team lineup
    fielders: {}, pitcher: null,               // fielding team
    pitchFatigue: 0,
    extraBase: null,                           // pending extra-base prompt {runnerSlot, fielderPos, chart}
    pendingRoll: null,                         // waiting on a hand-rolled die {label, sides, done, value, res}
    retiring: [], walkingOut: [],
    animating: false, pauseOpen: false,
    awaitNext: null, walkOff: false,
    season: null, seasonPending: false,
    quickSel: null,                            // quick game: which team slot we're picking ("Visitor"/"Home")
    paCount: 0, batterReady: false, // the pitch prompt waits until the batter has dug in
    coinFlipped: false, coinSide: null, coinResult: null, // matchup screen: coin toss / momentum
    teamSel: null, rosterSel: null
  };
}

function battingTeam() { return S.isBottom ? S.home : S.visitor; }
function fieldingTeam() { return S.isBottom ? S.visitor : S.home; }
function sideKey() { return S.isBottom ? "Home" : "Visitor"; }
function userTeam() { return S.userSide === "Home" ? S.home : S.visitor; }
function userIsPitcher() { return fieldingTeam() === userTeam(); }
function log(msg) { S.log.push(msg); if (S.log.length > 8) S.log.shift(); }
function batter() { return S.lineup[S.batIdx % 9]; }

/* ================= Stater at-bat engine ================= */

function startGame() {
  S.score = { Visitor: 0, Home: 0 };
  S.bases = [0, 0, 0];
  S.rotation = [null, null, null, null];
  S.baseRunners = [null, null, null, null];
  S.retiring = []; S.walkingOut = [];
  S.inning = 1; S.isBottom = false;
  S.outs = 0; S.balls = 0; S.strikes = 0;
  S.phase = "windup"; S.pitchType = null; S.stealTry = null; S.extraBase = null; S.pendingRoll = null; S.paCount = 0; S.defPos = {}; S.batterReady = false;
  S._colKey = null; // force a full repaint — never carry the previous game's colors over
  S.walkOff = false;
  S.lastSwing = null; S.lastCombo = null;
  S.stealPending = null; S.animating = false; S.pauseOpen = false; S.awaitNext = null;
  S.log = ["--- Play Ball! ---"];
  S.screen = "game";
  setupHalf();
  // snap the defense back to their stations (a rematch must not reuse last game's spots)
  Object.keys(P.def).forEach(k => {
    const el = document.getElementById("def" + k);
    if (!el) return;
    el.style.transition = "none";
    el._t = null;
    setXY(el, P.def[k]);
    el.classList.remove("running");
    el.style.opacity = "1";
  });
  const ball = document.getElementById("ball");
  if (ball) ball.style.opacity = "0";
  clearDropBat();
  if (S.visitor && S.visitor.fatigueReset) [S.visitor, S.home].forEach(t => t.roster && t.roster.forEach(p => p.fatigue = 0));
  render();
}

/* build lineup/fielders for the current half from the two teams */
function setupHalf() {
  const bat = battingTeam(), fld = fieldingTeam();
  S.lineup = bat.lineup;
  S.batIdx = bat.batIdx || 0;
  S.fielders = fld.positions;
  S.pitcher = fld.positions.P;
  S.pitchFatigue = S.pitcher.fatigue || 0;
}

function moveSlot(from, to) { // rotate figure + runner from slot to slot (to may be 0 = scored)
  if (from === 0 && !S.rotation[0]) claimPlateFigure();
  const fig = S.rotation[from];
  let run = S.baseRunners[from];
  if (from === 0 && !run) run = batter(); // the batter becomes a baserunner on the bases
  S.rotation[from] = null; S.baseRunners[from] = null;
  if (to === 0) { // crossed the plate — the caller runs him home, THEN he walks to his seat
    if (run) { S.score[sideKey()]++; log("RUN SCORES: " + run.name); }
    if (fig) S.retiring.push(fig);
  } else {
    S.rotation[to] = fig; S.baseRunners[to] = run;
  }
}

async function advanceSlots(fb, x) { // batter takes fb bases; runners take x if given (default fb) — nobody runs past home
  const rF = x === undefined ? fb : x;
  if (!S.rotation[0]) claimPlateFigure(); // the batter must exist before he can advance — never spawn a figureless runner
  const pre = { rot: S.rotation.slice() }; // pre-advance figure slots, for the run animation
  const rot = pre.rot, run = S.baseRunners.slice();
  if (rot[0]) run[0] = batter(); // the batter at the plate becomes a runner
  S.rotation = [null, null, null, null]; S.baseRunners = [null, null, null, null];
  for (let i = 0; i < 4; i++) {
    if (!rot[i] && !run[i]) continue;
    const land = i + (i === 0 ? fb : rF);
    // an advance that reaches home plate scores — runners never wrap back around
    if (land >= 4) {
      if (run[i]) { S.score[sideKey()]++; log("RUN SCORES: " + run[i].name); }
      if (rot[i]) S.retiring.push(rot[i]); // he'll run home first, then walk to his seat (see runRunners)
    } else {
      S.rotation[land] = rot[i]; S.baseRunners[land] = run[i];
    }
  }
  return pre;
}

async function runRunners(fb, x, pre) { // animates every figure from its PRE-advance base to its new one
  const rF = x === undefined ? fb : x;
  const d = 450;
  const oR = (pre && pre.rot) || S.rotation.slice();
  const jobs = [];
  for (let i = 0; i < 4; i++) {
    const fig = oR[i];
    if (!fig) continue;
    const el = document.getElementById(fig);
    if (!el) continue;
    const land = i + (i === 0 ? fb : rF);
    const scored = land >= 4; // an advance that reaches home is a run — nobody wraps past it
    const tgt = scored ? -1 : land - 1;
    jobs.push(runRunner(el, runLegs(orderOf(i) - 1, tgt === -1 ? -1 : tgt), d).then(() => {
      if (scored) walkToDugout(fig, P.home); // finished his run home — now to his own seat
    }));
  }
  await Promise.all(jobs);
  updateField();
}

async function adv
(fb, x
) { // state: advance, then animated runs
  const pre = await advanceSlots(fb, x);
  await runRunners(fb, x, pre);
}

function endPA(kind) { // kind: 'out' | 'walk' | 'hit'
  S.batterReady = false; // the plate just changed hands — the next batter has to walk up first
  if (kind !== "hit") {
    const fig = S.rotation[0];
    if (fig) { S.retiring.push(fig); walkToDugout(fig, batBoxPt()); }
    S.rotation[0] = null; S.baseRunners[0] = null;
  }
  S.batIdx = (S.batIdx + 1) % 9;
  S.paCount++;
  S.balls = 0; S.strikes = 0;
}

async function resolveCount() {
  if (S.walkOff) return;
  let guard = 0;
  while (guard++ < 10) {
    if (S.outs >= 3) { await endHalf(); return; }
    if (S.strikes >= 3) {
      S.outs++; showBanner("STRIKEOUT!", "out"); log("OUT: Struck Out!");
      endPA("out");
      if (S.outs >= 3) { await endHalf(); return; }
      continue;
    }
    if (S.balls >= 4) { // Stater walk: batter to 1st, only forced runners advance
      showBanner("WALK", "walk"); log("WALK");
      if (!S.rotation[0]) claimPlateFigure(); // the walked batter needs his figure before he can take first
      // deepest first: 3rd scores only if 1st & 2nd were occupied (force chain)
      const movers = [];
      if (S.rotation[1] && S.rotation[2] && S.rotation[3]) movers.push([3, 0]);
      if (S.rotation[1] && S.rotation[2]) movers.push([2, 3]);
      if (S.rotation[1]) movers.push([1, 2]);
      movers.push([0, 1]);
      // everyone forced forward jogs one base, around the diamond — no shortcuts
      await Promise.all(movers.map(([from, to]) => {
        const fig = S.rotation[from];
        const el = fig && document.getElementById(fig);
        if (!el) return Promise.resolve();
        if (from === 0) dropBat(el); // the walked batter drops his bat too
        return runRunner(el, from === 0
          ? [[batBoxPt(), basePt(0)]] // the batter jogs out of the box to first
          : runLegs(from === 0 ? 3 : from - 1, to === 0 ? 3 : to - 1), 450);
      }));
      const scoredFig = movers.some(([, to]) => to === 0) ? S.rotation[3] : null;
      movers.forEach(([from, to]) => moveSlot(from, to));
      if (scoredFig) walkToDugout(scoredFig, P.home);
      endPA("walk");
      continue;
    }
    break;
  }
}

async function endHalf() {
  S.awaitNext = "Side Retired \u2014 end of " + (S.isBottom ? "BOT" : "TOP") + " " + S.inning;
  // Stater fatigue: after each inning from the 4th on, 1-in-6 the pitcher tires
  if (S.inning >= 4) {
    const fr = await rollDie(6, "PITCHER FATIGUE (d6) \u2014 " + lastName(S.pitcher.name), fieldingTeam() === userTeam());
    if (fr === 1) {
      S.pitcher.fatigue = (S.pitcher.fatigue || 0) + 1;
      log("FATIGUE: " + S.pitcher.name + " loses 1 Pitching (now " + (S.pitcher.P - S.pitcher.fatigue) + ")");
    }
  }
}

/* ================= Pitch / swing resolution ================= */

function pitchMod() { return skillMod(Math.max(3, S.pitcher.P - (S.pitcher.fatigue || 0))); }
function batterHandBonus(batter) {
  const p = S.pitcher.hand, b = batter.hand;
  if (b === "S") return p === "S" ? 0 : 1;
  if (p === "S") return 0;
  return (b !== p) ? 1 : 0;
}

async function resolvePitch(type) {
  S.pitchType = type;
  const pit = S.pitcher;
  const pm = pitchMod();
  const target = PITCH_TARGET[type];
  const pRoll = await rollDie(20, "PITCH \u2014 " + lastName(pit.name) + " (d20)", userIsPitcher());
  S.lastSwing = { pRoll, pitch: type, pitchMod: pm, bRoll: null };
  log("PITCH: " + type + " \u2014 " + pit.name + " rolls " + pRoll + (pm ? (pm > 0 ? "+" : "") + pm : "") + " vs " + target);
  await pitchFlight(type); // each offering has its own flight to the plate

  if (pRoll + pm <= target) { // BALL
    await catchAt(P.home, "defC", 200);
    S.balls++;
    showBanner("BALL", "ball");
    log("BALL (" + type + ")");
    await resolveSteals();
    if (S.stealPending) { render(); return; } // waiting on the user's steal choice
    await resolveCount();
    S.phase = "windup";
    S.animating = false;
    render();
    return;
  }

  // SWING
  const bat = batter();
  const bPen = type === "Curve" ? -1 : type === "Slider" ? -2 : 0;
  const bRoll = await rollDie(20, "SWING \u2014 " + lastName(bat.name) + " (d20)", battingTeam() === userTeam());
  let momentum = 0;
  if (S.coinSide) { // coin-toss winner gets +1 on their team's first swing of the game
    const winner = S.coinSide === "user" ? userTeam() : (userTeam() === S.visitor ? S.home : S.visitor);
    if (battingTeam() === winner) {
      momentum = 1;
      S.coinSide = null;
      log("MOMENTUM: " + lastName(bat.name) + " carries the coin-toss boost (+1 swing)");
    } else if (S.paCount >= 3) {
      S.coinSide = null;
    }
  }
  const total = bRoll + skillMod(bat.B) + batterHandBonus(bat) + bPen + momentum - pm;
  S.lastSwing.bRoll = bRoll;
  S.lastSwing.total = total;
  let result;
  if (bRoll === 1) result = "Strike";
  else if (bRoll === 20) result = SWING_CHART(20);
  else result = SWING_CHART(total);
  log("SWING: " + bat.name + " rolls " + bRoll + " \u2192 " + result + " (" + total + " after mods)");
  await swingBatter(result === "Strike" ? "miss" : "swing");

  if (result === "Strike") {
    S.strikes++;
    showBanner("STRIKE!", "strike");
    await resolveSteals();
    if (S.stealPending) { render(); return; }
    await resolveCount();
    S.phase = "windup";
    S.animating = false;
    render();
    return;
  }
  if (result === "Foul") {
    if (S.strikes < 2) S.strikes++; // a foul is a strike but never the third
    showBanner("FOUL", "foul");
    await resolveSteals();
    if (S.stealPending) { render(); return; }
    await resolveCount();
    S.phase = "windup";
    S.animating = false;
    render();
    return;
  }
  if (result === "Home Run") {
    showBanner("HOMERUN!", "hr");
    S.stealTry = null;
    await ballArc(P.home, crowdPt(), 900, 130); // it sails high into the crowd
    log("HOME RUN! " + bat.name);
    await adv(4);
    endPA("hit");
    await resolveCount();
    S.phase = "windup";
    S.animating = false;
    render();
    return;
  }

  // batted ball: direction + fielding. A declared steal is off with the bat —
  // that runner runs on the hit, and put-out attempts against him are at −2.
  const stealRunner = S.stealTry !== null ? S.baseRunners[S.stealTry + 1] : null;
  S.stealTry = null;
  const dirRoll = await rollDie(6, "HIT ANGLE (d6)", battingTeam() === userTeam());
  const lhb = bat.hand === "L" || (bat.hand === "S" && S.pitcher.hand === "R");
  const gbPos = (lhb ? GB_LOC_LH : GB_LOC_RH)[dirRoll - 1];
  const ofPos = (lhb ? OF_LOC_LH : OF_LOC_RH)[dirRoll - 1];
  if (result === "Ground Ball") await resolveGroundBall(bat, gbPos);
  else if (result === "Fly Ball") await resolveFlyBall(bat, ofPos, stealRunner);
  else await resolveLineDrive(bat, ofPos, stealRunner);

  if (S.extraBase) { render(); return; } // waiting on the user's extra-base call
  await resolveCount();
  S.phase = "windup";
  S.animating = false;
  render();
}

/* ---- fielding the batted ball ---- */

async function resolveGroundBall(bat, pos) {
  const fielder = S.fielders[pos];
  const target = GB_THROW[pos] !== undefined ? GB_THROW[pos] : 8;
  const fRoll = await rollDie(20, "GROUND BALL \u2014 " + lastName(fielder.name) + " (" + pos + ") (d20)", fieldingTeam() === userTeam());
  const fm = skillMod(fielder.F);
  const rm = skillMod(bat.R);
  const roll = fRoll + fm - rm;
  const err = fRoll === 1;
  log("GROUND BALL to " + pos + " \u2014 " + fielder.name + " rolls " + fRoll + (fm ? (fm > 0 ? "+" : "") + fm : "") + " vs " + target + (err ? " \u2014 ERROR!" : ""));
  const spot = getDefPt(pos);
  // the grounder skips along the grass while the fielder charges in to meet it
  const meet = [spot[0] + (P.home[0] - spot[0]) * 0.12, spot[1] + (P.home[1] - spot[1]) * 0.12];
  await Promise.all([moveDef(pos, meet, 450), ballTo(P.home, meet, 450)]);
  pop("def" + pos, "catchpop"); // glove up — he fields it cleanly

  if (err) {
    showBanner("ERROR!", "foul");
    log("ERROR by " + pos + " \u2014 he bobbles it and has to chase it down; the batter takes first and every runner moves up one base safely");
    const drop = grassGap(meet);
    await ballTo(meet, drop, 300); // the ball squirts away from him
    showBallAt(drop);
    await moveDef(pos, drop, 450); // and he goes after it
    hideBall();
    await adv(1, 1); // error: batter first, runners up one base only
    endPA("hit");
    returnDefs();
    return;
  }
  if (roll > target) {
    showBanner("OUT!", "out");
    log("GROUND OUT: " + pos + " throws out " + bat.name);
    if (pos === "1B" || pos === "P") {
      pop("def" + pos, "catchpop"); // he just steps on his own bag with the ball
    } else {
      moveDef("1B", basePt(0), 350); // the first baseman breaks for the bag as the throw travels
      await ballTo(meet, basePt(0), 350); // fires to first
      pop("def1B", "catchpop"); // and he takes it there
    }
    S.outs++;
    endPA("out"); // only the batter is out on a grounder — runners hold their bases
    returnDefs();
    return;
  }
  // safe: batter reaches first, runners advance one base — he just holds the ball
  showBanner("SINGLE", "hit");
  log("INFIELD SINGLE: " + bat.name + " reaches first");
  await adv(1);
  endPA("hit");
  returnDefs();
}

async function resolveFlyBall(bat, pos, stealRunner) {
  const fielder = S.fielders[pos];
  const fm = skillMod(fielder.F);
  const fRoll = await rollDie(20, "FLY BALL \u2014 " + lastName(fielder.name) + " (" + pos + ") (d20)", fieldingTeam() === userTeam());
  const caught = fRoll !== 1 && (fRoll + fm) > FB_CATCH;
  log("FLY BALL to " + pos + " \u2014 " + fielder.name + " rolls " + fRoll + (caught ? " \u2014 CAUGHT!" : " \u2014 dropped in!"));
  const land = caught ? getDefPt(pos) : grassGap(getDefPt(pos), 0.6);
  await ballArc(P.home, land, 720, 95); // the fly ball sails through the air
  if (caught) {
    pop("def" + pos, "catchpop");
    showBanner("OUT!", "out");
    log("FLY OUT: " + fielder.name + " robs " + bat.name);
    S.outs++;
    endPA("out");
    await ballTo(getDefPt(pos), P.def["2B"], 300); // and he fires it back to the infield
    pop("def2B", "catchpop");
    returnDefs();
    return;
  }
  // he can't come up with it — it drops, and he trots over to recover it
  showBallAt(land);
  await moveDef(pos, land, 500);
  hideBall();
  if (fRoll === 1) {
    showBanner("ERROR!", "foul");
    log("ERROR in the outfield \u2014 he boots it and chases it down; the batter takes first and every runner moves up one base safely");
    await adv(1, 1); // error: batter first, runners up one base only
    endPA("hit");
    returnDefs();
    return;
  }
  showBanner("FLY BALL", "hit");
  log("Fly ball drops \u2014 everyone advances one base");
  await adv(1);
  await offerExtraBase(pos, FB_THROW[pos], bat, stealRunner);
  endPA("hit");
  if (!S.extraBase) returnDefs(); // prompt pending? he holds the ball until you decide
}

async function resolveLineDrive(bat, pos, stealRunner) {
  const fielder = S.fielders[pos];
  const fm = skillMod(fielder.F);
  const fRoll = await rollDie(20, "LINE DRIVE \u2014 " + lastName(fielder.name) + " (" + pos + ") (d20)", fieldingTeam() === userTeam());
  const caught = fRoll !== 1 && (fRoll + fm) > LD_CATCH;
  log("LINE DRIVE to " + pos + " \u2014 " + fielder.name + " rolls " + fRoll + (caught ? " \u2014 SNAGGED!" : " \u2014 through the gap!"));
  const land = caught ? getDefPt(pos) : grassGap(getDefPt(pos), 0.6);
  await ballArc(P.home, land, 560, 26); // the liner zips on a flat arc
  if (caught) {
    pop("def" + pos, "catchpop");
    showBanner("OUT!", "out");
    log("LINE OUT: " + fielder.name + " snares it");
    S.outs++;
    endPA("out");
    await ballTo(getDefPt(pos), P.def["2B"], 300); // and he fires it back to the infield
    pop("def2B", "catchpop");
    returnDefs();
    return;
  }
  // he can't come up with it — it drops, and he trots over to recover it
  showBallAt(land);
  await moveDef(pos, land, 500);
  hideBall();
  if (fRoll === 1) {
    showBanner("ERROR!", "foul");
    log("ERROR \u2014 he boots it and chases it down; the batter takes second and every runner takes two bases safely");
    await adv(2, 2); // error: batter second, runners two bases
    endPA("hit");
    returnDefs();
    return;
  }
  showBanner("LINE DRIVE", "hit");
  log("Line drive \u2014 batter and runners advance two bases");
  await adv(2);
  await offerExtraBase(pos, LD_THROW[pos], bat, stealRunner);
  endPA("hit");
  if (!S.extraBase) returnDefs(); // prompt pending? he holds the ball until you decide
}

/* one extra-base attempt for the lead runner; fielder gets one throw.
   Unforced runners are tagged out (−1); a runner who declared steal and runs
   on the hit was leading off, so put-out attempts against him are −2. */
async function offerExtraBase(pos, chart, bat, stealRunner) {
  const leadSlot = [3, 2, 1].find(s => S.baseRunners[s]);
  if (leadSlot === undefined) return;
  const runner = S.baseRunners[leadSlot];
  const isUserRunner = battingTeam() === userTeam();
  if (isUserRunner) {
    S.extraBase = { slot: leadSlot, pos, chart, stealRunner, runnerName: runner.name };
    S.phase = "extrabase";
    log(runner.name + " can try for an extra base \u2014 send him?");
    return;
  }
  if (rint(1, 100) <= 60) await attemptExtraBase(leadSlot, pos, chart, stealRunner);
}

async function attemptExtraBase(slot, pos, chart, stealRunner) {
  const runner = S.baseRunners[slot];
  const fig = S.rotation[slot];
  const fielder = S.fielders[pos];
  const dest = slot + 1; // slot 1..3 = 1st..3rd base; the runner tries for the next base (4 = home)
  const target = (chart[dest - 1] || 12) + (runner === stealRunner ? 2 : 1);
  const tRoll = await rollDie(20, "THE THROW \u2014 " + lastName(fielder.name) + " (" + pos + ") (d20)", fieldingTeam() === userTeam());
  const roll = tRoll + skillMod(fielder.F) - skillMod(runner.R);
  log(runner.name + " tries for an extra base \u2014 " + fielder.name + " throws (" + roll + " vs " + target + ")");
  const from = basePt(slot - 1);
  const destPt = dest === 4 ? P.home : basePt(dest - 1);
  const cover = dest === 4 ? "C" : dest === 3 ? "3B" : "2B";
  if (roll > target) moveDef(cover, destPt, 350); // the covering fielder breaks for the bag only to record the out
  await ballTo(getDefPt(pos), destPt, 350); // the throw comes from where he recovered the ball
  pop("def" + pos, "throwing");
  pop("def" + cover, "catchpop"); // and he takes it there
  if (roll > target) {
    log("THROWN OUT at " + ["", "first", "second", "third", "home"][dest] + "!");
    showBanner("OUT!", "out");
    if (fig) { S.retiring.push(fig); walkToDugout(fig, from); }
    S.baseRunners[slot] = null; S.rotation[slot] = null;
    S.outs++;
  } else {
    log("SAFE! " + runner.name + " takes the extra base");
    showBanner("SAFE!", "safe");
    moveSlot(slot, dest === 4 ? 0 : dest);
    if (dest <= 3) {
      await runRunnerLeg(dest);
    } else if (fig) {
      // he was standing on 3rd — run him the last 90 feet, then to his own seat
      const el = document.getElementById(fig);
      if (el) await runRunner(el, runLegs(2, 3), 450);
      walkToDugout(fig, P.home);
    }
  }
}

/* animate a single figure one leg forward after a successful extra base */
async function runRunnerLeg(slot) {
  const fig = S.rotation[slot];
  const el = fig && document.getElementById(fig);
  if (!el) return;
  el.classList.add("running");
  await glide(el, basePt(slot - 2 >= 0 ? slot - 2 : 0), basePt(slot - 1), 450);
  el.classList.remove("running");
}

/* ---- steals (declared at the windup, resolved on a ball or strike) ---- */

async function resolveSteals() {
  if (S.stealTry === null) return;
  const baseIdx = S.stealTry;           // 0 = runner on 1st, 1 = 2nd, 2 = 3rd
  S.stealTry = null;
  const slot = baseIdx + 1;
  const runner = S.baseRunners[slot];
  const fig = S.rotation[slot];
  if (!runner || !fig) return;
  const catcher = S.fielders.C;
  const target = STEAL_TARGET;
  const cRoll = await rollDie(20, "STEAL THROW \u2014 " + lastName(catcher.name) + " (C) (d20)", fieldingTeam() === userTeam());
  const roll = cRoll + skillMod(catcher.F) - skillMod(runner.R);
  log("STEAL ATTEMPT: " + runner.name + " \u2014 " + catcher.name + " throws (" + roll + " vs " + target + ")");
  const cover = baseIdx === 0 ? "2B" : "3B";
  if (roll > target) moveDef(cover, basePt(baseIdx), 350); // fielder breaks for the bag only on the tag out
  await ballTo(P.catcher, basePt(baseIdx), 350);
  pop("defC", "throwing");
  pop("def" + cover, "catchpop"); // and takes the throw there
  if (roll > target) {
    log("THROWN OUT stealing!");
    showBanner("CAUGHT STEALING!", "caught");
    S.retiring.push(fig);
    const rel = document.getElementById(fig);
    if (rel) { // he takes off for the bag, then gets tagged out there
      rel.classList.add("running");
      await glide(rel, basePt(slot - 1), slot < 4 ? basePt(slot) : P.home, 350);
      rel.classList.remove("running");
    }
    walkToDugout(fig, slot < 4 ? basePt(slot) : P.home);
    S.baseRunners[slot] = null; S.rotation[slot] = null;
    S.outs++;
  } else {
    const toSlot = baseIdx === 2 ? 0 : slot + 1;
    log("STOLEN BASE! " + runner.name);
    showBanner("SAFE!", "safe");
    moveSlot(slot, toSlot);
    await runRunnerLeg(baseIdx + 2 <= 3 ? baseIdx + 2 : 0);
  }
  returnDefs();
}

/* ================= base running animation ================= */

function orderOf(b) { return b === -1 ? 3 : b; }
function pointByOrder(v) { return v === 3 ? P.home : P.b[v]; }
function runLegs(cur, tgt) {
  const legs = [];
  let c = orderOf(cur), t = orderOf(tgt), guard = 0;
  while (c !== t && guard++ < 4) {
    const n = (c + 1) % 4;
    legs.push([pointByOrder(c), pointByOrder(n)]);
    c = n;
  }
  return legs;
}
function glide(el, from, to, dur) {
  return new Promise(async res => {
    el._anim = true; // updateField must not snap this figure mid-run
    el.style.transition = "none";
    setXY(el, from);
    await nextFrame();
    el.style.transition = "transform " + dur + "ms linear";
    setXY(el, to);
    await wait(dur);
    el.style.transition = "";
    el._anim = false;
    res();
  });
}
async function runRunner(el, path, legDur) {
  if (!el || !path.length) return;
  el._anim = true; // hold the figure through every leg — no snap windows between bases
  el.classList.add("running");
  for (const [from, to] of path) {
    await glide(el, from, to, legDur);
    el._anim = true; // re-assert immediately after each leg lands
  }
  el.classList.remove("running");
  el._anim = false;
}

async function runRunners(fb, x, pre) { // animates every figure from its PRE-advance base to its new one
  const rF = x === undefined ? fb : x;
  const d = 450;
  const oR = (pre && pre.rot) || S.rotation.slice();
  const jobs = [];
  for (let i = 0; i < 4; i++) {
    const fig = oR[i];
    if (!fig) continue;
    const el = document.getElementById(fig);
    if (!el) continue;
    const land = i + (i === 0 ? fb : rF);
    if (i === 0) dropBat(el); // he leaves his bat lying at the plate as he takes off
    const scored = land >= 4; // an advance that reaches home is a run — nobody wraps past it
    const tgt = scored ? -1 : land - 1;
    // a scoring batter (a home run) trots the whole diamond: plate → 1st → 2nd → 3rd → home
    const path = (i === 0 && scored)
      ? [[batBoxPt(), P.b[0]], [P.b[0], P.b[1]], [P.b[1], P.b[2]], [P.b[2], P.home]]
      : runLegs(orderOf(i) - 1, tgt === -1 ? -1 : tgt);
    jobs.push(runRunner(el, path, d).then(() => {
      if (scored) walkToDugout(fig, P.home); // finished his run home — now to his own seat
    }));
  }
  await Promise.all(jobs);
  updateField();
}

/* ================= dugout pool ================= */

function benchPos(i) { const d = dugoutPos(); return [d[0] + BENCH_OFFSETS[i][0], d[1] + BENCH_OFFSETS[i][1]]; }
function dugoutPos() { return battingTeam() === S.home ? P.dugoutH : P.dugoutV; }
function defDugoutPos() { return fieldingTeam() === S.home ? P.dugoutH : P.dugoutV; }
function batBoxPt() { // batters stand in the batter's box beside the plate, not on top of the catcher
  const bat = batter();
  const lefty = bat && (bat.hand === "L" || (bat.hand === "S" && S.pitcher.hand === "R"));
  return lefty ? [214, 290] : [186, 290];
}

async function walkToDugout(elId, fromPt) {
  const el = document.getElementById(elId);
  if (!el) { // figure gone — clear him out or the plate traffic jams forever
    if (S) S.retiring = S.retiring.filter(x => x !== elId);
    return;
  }
  el.classList.add("running");
  await glide(el, fromPt, benchPos(parseInt(elId.slice(3), 10)), 800);
  el.dataset.base = "bench";
  el.style.transition = "none";
  setXY(el, benchPos(parseInt(elId.slice(3), 10)), 1.0); // settles into his dugout seat, tucked in
  S.retiring = S.retiring.filter(x => x !== elId);
  // the plate traffic just cleared — this render releases the next batter from the dugout
  if (S && S.screen === "game" && !S.animating && !S.awaitNext) render();
}

function claimPlateFigure() { // guarantees the current batter HAS a figure before he can advance
  if (S.rotation[0]) return S.rotation[0];
  let id = "off" + (S.batIdx % 9);
  if (S.rotation.includes(id) || S.retiring.includes(id) || S.walkingOut.includes(id)) {
    for (let i = 0; i < 9; i++) {
      const cid = "off" + i;
      if (!S.rotation.includes(cid) && !S.retiring.includes(cid) && !S.walkingOut.includes(cid)) { id = cid; break; }
    }
  }
  const el = document.getElementById(id);
  if (el) {
    el.style.transition = "none";
    setXY(el, benchPos(parseInt(id.slice(3), 10)), 1.0);
    el.dataset.base = "bench";
    el.style.opacity = "1";
  }
  S.rotation[0] = id;
  S.baseRunners[0] = null;
  return id;
}

function sendBatterOut() {
  if (S.rotation[0]) return;
  let id = "off" + (S.batIdx % 9); // each lineup slot owns its own dugout seat
  if (S.rotation.includes(id) || S.retiring.includes(id) || S.walkingOut.includes(id)) {
    // his figure is stranded on the bases — send the first available teammate
    for (let i = 0; i < 9; i++) {
      const cid = "off" + i;
      if (!S.rotation.includes(cid) && !S.retiring.includes(cid) && !S.walkingOut.includes(cid)) { id = cid; break; }
    }
  }
  const el = document.getElementById(id);
  if (!el) return;
  const seat = parseInt(id.slice(3), 10);
  S.rotation[0] = id;
  S.baseRunners[0] = null;
  S.walkingOut.push(id);
  el.style.transition = "none";
  setXY(el, benchPos(seat));
  el.classList.add("running");
  el.style.opacity = "1";
  glide(el, benchPos(seat), batBoxPt(), 700).then(() => {
    el.dataset.base = "-1";
    S.walkingOut = S.walkingOut.filter(x => x !== id);
    el.style.transition = "";
    el.classList.remove("running");
    clearDropBat(); // the bat boy clears the last hitter's bat
    S.batterReady = true; // he's dug in — now the pitch prompt appears
    if (S.screen === "game" && !S.animating && !S.awaitNext) render();
  });
}

/* ================= half-inning ceremony ================= */

async function halfInningSwitch() {
  const oldFldDug = defDugoutPos(); // the fielding team's own dugout (they exit here)
  const oldBatDug = dugoutPos();    // the batting team's own dugout (the new defense emerges here)
  const defKeys = Object.keys(P.def);
  const legDur = 900;

  // 1. the defense walks into its own dugout and disappears
  await Promise.all(defKeys.map((k, idx) => {
    const el = document.getElementById("def" + k);
    if (!el) return Promise.resolve();
    return wait(idx * 60).then(() => {
      el.classList.add("running");
      const spot = [oldFldDug[0] + (idx % 3) * 16 - 16, oldFldDug[1] + Math.floor(idx / 3) * 9 - 4];
      return glide(el, getDefPt(k), spot, legDur).then(() => {
        el.classList.remove("running");
        el.style.opacity = "0";
      });
    });
  }));

  // 2. the batters head back into their own dugout (snap there, vanish)
  for (let i = 0; i < 9; i++) {
    const el = document.getElementById("off" + i);
    if (!el) continue;
    el.style.transition = "none";
    setXY(el, benchPos(i), 1.0);
    el.style.opacity = "0";
    el.dataset.base = "bench";
  }
  S.retiring = []; S.walkingOut = [];

  // 3. flip the half, recolor both squads, clear the bases and the count
  if (S.isBottom) { S.inning++; S.isBottom = false; }
  else { S.isBottom = true; }
  S.bases = [0, 0, 0]; // Stater extra innings: full innings, no ghost runner
  S.outs = 0; S.balls = 0; S.strikes = 0;
  S.rotation = [null, null, null, null];
  S.baseRunners = [null, null, null, null];
  S.retiring = []; S.walkingOut = [];
  clearDropBat(); // nothing left lying at the plate between halves
  S.batterReady = false;
  S._colKey = String(S.isBottom);
  const offC = teamColors(battingTeam()), defC = teamColors(fieldingTeam());
  for (let i = 0; i < 9; i++) {
    const el = document.getElementById("off" + i);
    if (el) { el.style.setProperty("--p", offC[0]); el.style.setProperty("--s", offC[1]); }
    const d = document.getElementById("def" + defKeys[i]);
    if (d) { d.style.setProperty("--p", defC[0]); d.style.setProperty("--s", defC[1]); }
  }

  // 4. the new batters take their seats in their own dugout
  for (let i = 0; i < 9; i++) {
    const el = document.getElementById("off" + i);
    if (!el) continue;
    el.style.transition = "none";
    setXY(el, benchPos(i), 1.0);
    el.style.opacity = "1";
  }

  // 5. the new defense walks OUT of its own dugout to the field
  await Promise.all(defKeys.map((k, idx) => {
    const d = document.getElementById("def" + defKeys[idx]);
    if (!d) return Promise.resolve();
    const start = [oldBatDug[0] + (idx % 3) * 16 - 16, oldBatDug[1] + Math.floor(idx / 3) * 9 - 4];
    d.style.transition = "none";
    setXY(d, start);
    d.style.opacity = "1";
    return wait(idx * 60).then(() => {
      d.classList.add("running");
      return glide(d, start, P.def[k], legDur).then(() => d.classList.remove("running"));
    });
  }));
  S.defPos = {};
}

async function onContinue() {
  if (S.walkOff) { S.screen = seasonResultScreen(); S.awaitNext = null; render(); return; }
  if (S.isBottom && S.inning >= 9 && S.score.Visitor !== S.score.Home) {
    finishGame(); return;
  }
  if (!S.isBottom && S.inning >= 9 && S.score.Home > S.score.Visitor) {
    finishGame(); return; // MLB: home team skips the bottom of the 9th when leading
  }

  S.awaitNext = null;
  S.animating = true;
  render();
  await halfInningSwitch();
  if (S.isBottom) { S.inning++; S.isBottom = false; }
  else { S.isBottom = true; }
  S.bases = [0, 0, 0]; // Stater: extra innings are full innings, no ghost runner
  S.outs = 0; S.balls = 0; S.strikes = 0;
  setupHalf();
  S.animating = false;
  render();
}

function finishGame() {
  S.awaitNext = null;
  const userWon = S.score[userTeam() ? "Home" : "Visitor"] !== undefined &&
    (S.userSide === "Home" ? S.score.Home > S.score.Visitor : S.score.Visitor > S.score.Home);
  if (S.season) recordSeasonResult(userWon);
  S.screen = "final";
  render();
}

/* ================= rendering ================= */

function renderTitle() {
  return '<div class="bigscreen">' +
    '<div class="title-main">PEN &amp; PAPER<br>BASEBALL</div>' +
    '<div class="title-sub">STATER RULES &middot; MLB TEAMS</div>' +
    '<div class="title-sub" style="font-size:10px;opacity:0.5">BUILD ' + GAME_VERSION + '</div>' +
    '<button class="btn" data-action="start" style="flex:none;min-width:200px">QUICK GAME</button>' +
    '<button class="btn ghost" data-action="profiles" style="flex:none;min-width:200px">SEASON MODE</button>' +
    '</div>';
}

function renderSelect() {
  const t = S.teamSel;
  let title, options;
  if (t.stage === "league") {
    title = "League Selection (" + t.label + ")";
    options = Object.keys(LEAGUES);
  } else if (t.stage === "division") {
    title = t.league + " Divisions";
    options = Object.keys(LEAGUES[t.league]);
  } else {
    title = t.division + " Teams";
    options = LEAGUES[t.league][t.division];
  }
  let html = '<div class="menu"><div class="menu-title">' + esc(title) + '</div>';
  options.forEach((opt, i) => {
    html += '<button class="btn" data-action="ts-pick" data-idx="' + i + '">' + (i + 1) + '. ' + esc(opt) + '</button>';
  });
  html += '<button class="btn center" data-action="ts-random">RANDOM TEAM</button>' +
    '<button class="btn ghost center" data-action="ts-back">B. [Back]</button></div>';
  return html;
}

function renderPickSide() {
  return '<div class="bigscreen">' +
    '<div class="menu-title">WHO ARE YOU PLAYING AS?</div>' +
    '<div class="vsrow">' +
      '<button class="vsteam" data-action="pick-side" data-side="Visitor">' + esc(S.visitor.name) +
        '<small>VISITOR &middot; YOU ROLL FOR THIS TEAM</small></button>' +
      '<button class="vsteam" data-action="pick-side" data-side="Home">' + esc(S.home.name) +
        '<small>HOME &middot; YOU ROLL FOR THIS TEAM</small></button>' +
    '</div></div>';
}

/* ================= season mode ================= */

function findDivision(teamName) {
  for (const l of Object.keys(LEAGUES)) {
    for (const d of Object.keys(LEAGUES[l])) {
      if (LEAGUES[l][d].includes(teamName)) return LEAGUES[l][d];
    }
  }
  return [teamName];
}

function buildSchedule(teamName) {
  const div = findDivision(teamName);
  const rivals = div.filter(t => t !== teamName);
  let leagueName = null, divisionName = null;
  for (const l of Object.keys(LEAGUES)) {
    for (const d of Object.keys(LEAGUES[l])) {
      if (LEAGUES[l][d].includes(teamName)) { leagueName = l; divisionName = d; }
    }
  }
  const sameLeague = [];
  for (const d of Object.keys(LEAGUES[leagueName])) {
    if (d === divisionName) continue;
    LEAGUES[leagueName][d].forEach(t => sameLeague.push(t));
  }
  const otherLeague = Object.keys(LEAGUES).find(l => l !== leagueName);
  const interPool = [];
  Object.keys(LEAGUES[otherLeague]).forEach(d => LEAGUES[otherLeague][d].forEach(t => interPool.push(t)));
  const sched = [];
  rivals.forEach(t => { for (let g = 0; g < 4; g++) sched.push({ opp: t, home: g % 2 === 0 }); });
  sameLeague.forEach((t, i) => sched.push({ opp: t, home: i % 2 === 0 }));
  for (let g = 0; g < 4 && interPool.length; g++) {
    const t = interPool.splice(Math.floor(Math.random() * interPool.length), 1)[0];
    sched.push({ opp: t, home: g % 2 === 0 });
  }
  for (let i = sched.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sched[i], sched[j]] = [sched[j], sched[i]];
  }
  return sched;
}

function makeNPTs(except) {
  const npts = {};
  Object.keys(TEAM_MARKET).forEach(t => {
    if (t === except) return;
    const aa = autoAssign(rollRoster(t));
    npts[t] = aa;
  });
  return npts;
}

function renderSeasonRoll() {
  const s = S.season;
  const roster = s.roster;
  const rows = roster.map((p, i) =>
    '<div class="mrow"><span class="pname">' + esc(p.name) + ' (' + p.hand + ')</span>' +
    '<span class="attr">B' + p.B + ' F' + p.F + ' P' + p.P + ' R' + p.R + '</span></div>'
  ).join("");
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">SEASON MODE &middot; ROLL YOUR ROSTER</div>' +
    '<div class="menu-title">' + esc(s.team) + '</div>' +
    '<div class="menu">' + rows + '</div>' +
    '<button class="btn" data-action="go-roster-cut" style="flex:none;min-width:220px">MANAGE ROSTER (CUT 3)</button>' +
    '</div>';
}

function renderRosterCut() {
  const s = S.season;
  const rows = s.roster.map((p, i) => {
    const sel = s.cutSel.includes(i);
    return '<div class="mrow rrow' + (sel ? ' cutsel' : '') + '" data-action="cut-toggle" data-idx="' + i + '">' +
      '<span class="pname">' + esc(p.name) + ' (' + p.hand + ')</span>' +
      '<span class="attr">' + (sel ? '\u2713 CUT \u2014 ' : 'B' + p.B + ' F' + p.F + ' P' + p.P + ' R' + p.R + ' \u2014 T' + totalSkill(p)) + '</span></div>';
  }).join("");
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">STEP 1 &middot; CUT 3 PLAYERS</div>' +
    '<div class="menu-title">' + esc(s.team) + '</div>' +
    '<div class="menu">' + rows + '</div>' +
    '<button class="btn" data-action="cuts-done" ' + (s.cutSel.length === 3 ? '' : 'disabled') + ' style="flex:none;min-width:220px">CONFIRM CUTS (' + s.cutSel.length + '/3)</button>' +
    '</div>';
}

function renderRosterPos() {
  const s = S.season;
  const slots = POSITIONS.map(p => {
    const occ = s.positions[p];
    return '<div class="mrow rrow" data-action="pos-slot" data-pos="' + p + '"' + (occ ? ' style="background:#1c2415"' : '') + '>' +
      '<span class="pname">' + p + ' \u2014 ' + (occ ? esc(occ.name) + ' <small style="color:#8fa3b8">(tap to release)</small>' : 'empty') + '</span>' +
      (occ ? '<span class="attr" style="color:#7dd87d">\u2713</span>' : '') +
      '</div>';
  }).join("");
  const un = s.roster.filter(p => !Object.values(s.positions).includes(p)).map((p, i) =>
    '<div class="mrow rrow' + (s.posSel === p ? ' cutsel' : '') + '" data-action="pos-pick" data-pi="' + s.roster.indexOf(p) + '">' +
      '<span class="pname">' + esc(p.name) + ' (' + p.hand + ')</span>' +
      '<span class="attr">' + (s.posSel === p ? '\u2713 PICKED \u2014 tap a position' : 'B' + p.B + ' F' + p.F + ' P' + p.P + ' R' + p.R) + '</span></div>'
  ).join("");
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">STEP 2 &middot; ASSIGN POSITIONS</div>' +
    '<div class="menu"><div class="menu-title">POSITIONS</div>' +
      '<div class="mrow"><span class="pname" style="color:#8fa3b8;font-weight:400">Tap a player, then a slot. Tap an occupied slot to release him.</span></div>' +
      slots + '</div>' +
    '<div class="menu"><div class="menu-title">UNASSIGNED</div>' + (un || '<div class="mrow"><span class="pname">All assigned</span></div>') + '</div>' +
    (s.savedRoster ? '<button class="btn ghost" data-action="back-to-cuts" style="flex:none;min-width:220px">\u25c2 REDO CUTS</button>' : '') +
    '<button class="btn" data-action="pos-done" ' + (Object.keys(s.positions).length === 9 ? '' : 'disabled') + ' style="flex:none;min-width:220px">CONTINUE</button>' +
    '</div>';
}

function renderRosterOrder() {
  const s = S.season;
  const rows = s.lineup.map((p, i) =>
    '<div class="mrow"><span class="pname">' + (i + 1) + '. ' + esc(p.name) + '</span>' +
    '<span class="rrow" style="display:flex;gap:4px">' +
      '<span class="attr rrow" data-action="order-up" data-idx="' + i + '">\u25b2</span>' +
      '<span class="attr rrow" data-action="order-dn" data-idx="' + i + '">\u25bc</span>' +
    '</span></div>'
  ).join("");
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">STEP 3 &middot; BATTING ORDER</div>' +
    '<div class="menu">' + rows + '</div>' +
    '<button class="btn ghost" data-action="back-to-pos" style="flex:none;min-width:220px">\u25c2 POSITIONS</button>' +
    '<button class="btn" data-action="order-done" style="flex:none;min-width:220px">START SEASON</button>' +
    '</div>';
}

function renderSeasonHub() {
  const s = S.season;
  const game = s.schedule[s.gameIdx];
  const week = Math.min(5, Math.floor(s.gameIdx / 6) + 1);
  const latest = (s.news && s.news[0]) || null;
  const newsHtml = latest
    ? '<div class="menu"><div class="menu-title">THIS WEEK IN MLB \u2014 WEEK ' + latest.week + '</div>' +
      latest.items.slice(0, 4).map(i => '<div class="mrow"><span class="pname">' + esc(i) + '</span></div>').join("") +
      '<div class="mrow rrow" data-action="news-view"><span class="pname" style="color:#ffd54a">FULL MLB WIRE \u2192</span></div>' +
      '</div>'
    : '<div class="menu"><div class="menu-title">THIS WEEK IN MLB</div>' +
      '<div class="mrow"><span class="pname">The league is quiet \u2014 results land here after game day.</span></div></div>';
  const mrow = s.markets.map(m => '<span class="attr">' + esc(MARKETS[m].name) + (MARKETS[m].tier === "major" ? ' (M)' : '') + '</span>').join(" ");
  const oppR = s.records[game.opp];
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">YEAR ' + s.year + ' OF 5 \u2014 WEEK ' + week + ' \u2014 GAME ' + (s.gameIdx + 1) + ' OF ' + s.schedule.length + '</div>' +
    '<div class="menu">' +
      '<div class="menu-title">' + esc(s.team) + ' \u2014 ' + s.wins + '-' + s.losses + '</div>' +
      '<div class="mrow"><span class="label">NEXT UP</span><span class="pname">' + (game.home ? 'vs' : '@') + ' ' + esc(game.opp) + ' (' + (oppR ? oppR.w + '-' + oppR.l : '') + ')</span></div>' +
      '<div class="mrow"><span class="label">YOU PLAY</span><span class="pname">' + (game.home ? 'HOME' : 'AWAY') + '</span></div>' +
      '<div class="mrow"><span class="label">TREASURY</span><span class="attr">$' + s.money.toFixed(1) + 'M</span></div>' +
      '<div class="mrow"><span class="label">MARKETS</span><span>' + mrow + '</span></div>' +
    '</div>' +
    newsHtml +
    '<button class="btn" data-action="season-play" style="flex:none;min-width:220px">PLAY GAME ' + (s.gameIdx + 1) + '</button>' +
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:6px 0">' +
      '<button class="btn ghost" data-action="schedule-view" style="flex:0 0 auto">SCHEDULE</button>' +
      '<button class="btn ghost" data-action="standings-view" style="flex:0 0 auto">STANDINGS</button>' +
      '<button class="btn ghost" data-action="news-view" style="flex:0 0 auto">MLB WIRE</button>' +
    '</div>' +
    '<button class="btn ghost center" data-action="quit-season" style="flex:none;min-width:200px">SAVE &amp; PROFILES</button>' +
    '</div>';
}

function renderOffseason() {
  const s = S.season;
  const o = s.off;
  const rows = o.lines.map(l => '<div class="mrow"><span class="pname">' + esc(l) + '</span></div>').join("");
  const draft = o.draft.map((p, i) =>
    '<div class="mrow rrow" data-action="draft-pick" data-idx="' + i + '"><span class="pname">' + esc(p.name) + ' (' + p.hand + ')</span>' +
    '<span class="attr">B' + p.B + ' F' + p.F + ' P' + p.P + ' R' + p.R + '</span></div>'
  ).join("");
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">THE OFF-SEASON &middot; YEAR ' + s.year + '</div>' +
    '<div class="menu">' + rows + '</div>' +
    '<div class="menu"><div class="menu-title">DRAFT \u2014 PICK A ROOKIE</div>' + (o.draftDone ? '<div class="mrow"><span class="pname">Draft complete</span></div>' : draft) + '</div>' +
    '<button class="btn" data-action="new-season" ' + (o.draftDone ? '' : 'disabled') + ' style="flex:none;min-width:220px">' + (s.year >= MAX_SEASONS ? "SEASON COMPLETE \u2014 PROFILES" : "BEGIN SEASON " + (s.year + 1)) + '</button>' +
    '</div>';
}

/* ================= profiles, matchup, schedule, standings, news ================= */

const MAX_PROFILES = 2;
const MAX_SEASONS = 5;

function loadProfiles() {
  try { return JSON.parse(localStorage.getItem("dlb-profiles")) || []; }
  catch (e) { return []; }
}

function saveProfiles(list) {
  try { localStorage.setItem("dlb-profiles", JSON.stringify(list.slice(0, MAX_PROFILES))); }
  catch (e) {} // storage unavailable — the game still plays, just won't persist
}

function saveSeason() { // upsert the active season into the profile shelf
  if (!S.season || !S.season.ready) return;
  const list = loadProfiles();
  const i = list.findIndex(p => p.id === S.season.id);
  if (i >= 0) list[i] = S.season;
  else list.push(S.season);
  saveProfiles(list);
}

function renderProfiles() {
  const list = loadProfiles();
  const rows = list.map((p, i) =>
    '<div class="menu"><div class="menu-title">' + esc(p.team) + (p.complete ? ' \u2014 COMPLETE' : '') + '</div>' +
      '<div class="mrow"><span class="label">SEASON</span><span class="attr">YEAR ' + p.year + ' OF 5</span></div>' +
      '<div class="mrow"><span class="label">RECORD</span><span class="attr">' + p.wins + '-' + p.losses + '</span></div>' +
      '<div class="mrow"><span class="label">TREASURY</span><span class="attr">$' + p.money.toFixed(1) + 'M</span></div>' +
      '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
        (p.ready ? '<button class="btn" data-action="load-profile" data-idx="' + i + '" style="flex:none">CONTINUE</button>' : '') +
        '<button class="btn warn" data-action="del-profile" data-idx="' + i + '" style="flex:none">DELETE</button>' +
      '</div></div>'
  ).join("") || '<div class="menu"><div class="mrow"><span class="pname">No saved seasons yet \u2014 start one!</span></div></div>';
  const full = list.length >= MAX_PROFILES;
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">SEASON PROFILES (' + list.length + ' OF 2)</div>' +
    rows +
    (full ? '<div class="menu"><div class="mrow"><span class="pname">Profiles are full \u2014 delete one to start fresh.</span></div></div>'
          : '<button class="btn" data-action="new-profile" style="flex:none;min-width:220px">NEW SEASON</button>') +
    '<button class="btn ghost center" data-action="title" style="flex:none;min-width:200px">BACK TO TITLE</button>' +
    '</div>';
}

function teamRating(t) {
  const avg = arr => arr.length ? arr.reduce((a, c) => a + c, 0) / arr.length : 0;
  return {
    bat: avg(t.lineup.map(p => skillMod(p.B))),
    fld: avg(Object.values(t.positions).map(p => skillMod(p.F))),
    run: avg(t.lineup.map(p => skillMod(p.R))),
    pit: skillMod(t.positions.P.P) - (t.positions.P.fatigue || 0)
  };
}

function fmtMod(v) { return (v >= 0 ? "+" : "") + v.toFixed(1); }

function renderMatchup() {
  const s = S.season;
  const game = s.schedule[s.gameIdx];
  const oppName = game.opp;
  const oppObj = S.userSide === "Home" ? S.visitor : S.home;
  const meR = s.records[s.team], oR = s.records[oppName];
  const u = teamRating(userTeam());
  const o = teamRating(oppObj);
  const formStr = t => {
    const f = s.formAll[t] || [];
    return f.length ? f.join("-") : "\u2014";
  };
  const cmp = (label, a, b) =>
    '<div class="mrow"><span class="label">' + label + '</span>' +
    '<span class="attr">' + a + '</span><span class="attr">' + b + '</span></div>';
  let coin;
  if (!S.coinFlipped) {
    coin = '<div class="menu"><div class="menu-title">COIN TOSS</div>' +
      '<div class="mrow"><span class="pname">The winner carries momentum: +1 to their first swing of the game.</span></div>' +
      '<button class="btn" data-action="coin-flip" style="flex:none;min-width:220px">FLIP THE COIN</button></div>';
  } else {
    coin = '<div class="menu"><div class="menu-title">COIN TOSS</div>' +
      '<div class="mrow"><span class="pname">' + esc(S.coinResult) + ' wins the toss' +
      (S.coinSide === "user" ? ' \u2014 YOUR momentum!' : ' \u2014 their momentum.') + '</span></div></div>';
  }
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">GAME ' + (s.gameIdx + 1) + ' \u2014 ' + (game.home ? "HOME" : "AWAY") + '</div>' +
    '<div class="menu"><div class="menu-title">' + esc(s.team) + ' vs ' + esc(oppName) + '</div>' +
      cmp("RECORD", meR.w + "-" + meR.l, oR.w + "-" + oR.l) +
      cmp("LAST 5", formStr(s.team), formStr(oppName)) +
      cmp("RUNS F-A", s.runsFor + "-" + s.runsAgainst, "\u2014") +
      cmp("TEAM BATTING", fmtMod(u.bat), fmtMod(o.bat)) +
      cmp("TEAM FIELDING", fmtMod(u.fld), fmtMod(o.fld)) +
      cmp("ACE PITCHING", fmtMod(u.pit), fmtMod(o.pit)) +
      cmp("TEAM SPEED", fmtMod(u.run), fmtMod(o.run)) +
    '</div>' +
    coin +
    '<button class="btn" data-action="play-ball" style="flex:none;min-width:220px">PLAY BALL</button>' +
    '<button class="btn ghost center" data-action="matchup-back" style="flex:none;min-width:200px">BACK</button>' +
    '</div>';
}

function renderSchedule() {
  const s = S.season;
  let html = '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">SCHEDULE \u2014 YEAR ' + s.year + '</div>';
  s.schedule.forEach((g, i) => {
    if (i % 6 === 0) html += '<div class="menu"><div class="menu-title">WEEK ' + (i / 6 + 1) + '</div>';
    const played = i < s.gameIdx;
    const res = played ? (s.form[i] === "W" ? "W" : "L") : (i === s.gameIdx ? "NEXT" : "");
    const col = res === "W" ? "#7dd87d" : res === "L" ? "#e08a8a" : res === "NEXT" ? "#ffd54a" : "";
    html += '<div class="mrow' + (i === s.gameIdx ? ' cutsel' : '') + '"><span class="pname">' + (i + 1) + '. ' + (g.home ? 'vs ' : '@ ') + esc(g.opp) + '</span>' +
      '<span class="attr"' + (col ? ' style="color:' + col + '"' : '') + '>' + res + '</span></div>';
    if (i % 6 === 5) html += '</div>';
  });
  if (s.schedule.length % 6 !== 0) html += '</div>';
  html += '<button class="btn ghost center" data-action="hub" style="flex:none;min-width:200px">BACK TO CLUBHOUSE</button></div>';
  return html;
}

function renderStandings() {
  const s = S.season;
  let html = '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">MLB STANDINGS \u2014 YEAR ' + s.year + '</div>';
  Object.keys(LEAGUES).forEach(l => {
    Object.keys(LEAGUES[l]).forEach(d => {
      html += '<div class="menu"><div class="menu-title">' + esc(l + " \u2014 " + d) + '</div>';
      html += LEAGUES[l][d].slice().sort((a, b) =>
        (s.records[b].w / ((s.records[b].w + s.records[b].l) || 1)) - (s.records[a].w / ((s.records[a].w + s.records[a].l) || 1))
      ).map(t => {
        const r = s.records[t];
        const me = t === s.team;
        return '<div class="mrow"><span class="pname"' + (me ? ' style="color:#ffd54a"' : '') + '>' + esc(t) + '</span>' +
          '<span class="attr' + (me ? '' : ' standard') + '">' + r.w + '-' + r.l + '</span></div>';
      }).join("");
      html += '</div>';
    });
  });
  html += '<button class="btn ghost center" data-action="hub" style="flex:none;min-width:200px">BACK TO CLUBHOUSE</button></div>';
  return html;
}

function renderNews() {
  const s = S.season;
  const weeks = (s.news || []).map(n =>
    '<div class="menu"><div class="menu-title">WEEK ' + n.week + '</div>' +
    n.items.map(i => '<div class="mrow"><span class="pname">' + esc(i) + '</span></div>').join("") +
    '</div>'
  ).join("") || '<div class="menu"><div class="mrow"><span class="pname">No wire yet \u2014 play a game and the league talks.</span></div></div>';
  return '<div class="bigscreen" style="min-height:0;padding:6px 0">' +
    '<div class="title-sub">MLB WIRE \u2014 YEAR ' + s.year + '</div>' +
    weeks +
    '<button class="btn ghost center" data-action="hub" style="flex:none;min-width:200px">BACK TO CLUBHOUSE</button></div>';
}

function renderFinal() {
  if (S.season) {
    const oppSide = S.userSide === "Home" ? "Visitor" : "Home";
    const won = S.score[S.userSide] > S.score[oppSide];
    return '<div class="bigscreen">' +
      '<div class="title-sub">FINAL</div>' +
      '<div class="title-main" style="font-size:24px">' + (won ? 'YOU WIN!' : 'YOU LOSE') + '</div>' +
      '<div class="finalscore">' + esc(S.visitor.name) + ' ' + S.score.Visitor + ' &mdash; ' + S.score.Home + ' ' + esc(S.home.name) + '</div>' +
      '<button class="btn" data-action="season-next" style="flex:none;min-width:220px">CONTINUE SEASON</button>' +
      '</div>';
  }
  return '<div class="bigscreen">' +
    '<div class="title-sub">FINAL</div>' +
    '<div class="finalscore">' + esc(S.visitor.name) + ' ' + S.score.Visitor + ' &mdash; ' + S.score.Home + ' ' + esc(S.home.name) + '</div>' +
    '<button class="btn" data-action="quit" style="flex:none;min-width:200px">MAIN MENU</button>' +
    '<button class="btn ghost" data-action="rematch" style="flex:none;min-width:200px">REMATCH</button>' +
    '</div>';
}

/* ================= game UI ================= */

function renderTVBar() {
  const pit = S.pitcher, bat = batter();
  const inn = (S.isBottom ? "BOT" : "TOP") + " " + S.inning;
  const outDots = [0, 1, 2].map(i => '<span class="dot' + (S.outs > i ? " on" : "") + '"></span>').join("");
  const baseDots = [2, 1, 0].map(i => '<span class="dot' + (baseOccupied(i) ? " on" : "") + '"></span>').join("");
  return '<div class="tvbar">' +
    '<div class="tvrow"><span class="tvname">' + esc(lastName(S.pitcher.name)) + '</span><span class="tvstat">' + (S.pitcher.pitches || 0) + ' PITCHES</span></div>' +
    '<div class="tvrow"><span class="tvname">' + esc(lastName(bat.name)) + '</span><span class="tvstat">' + (bat.h || 0) + ' FOR ' + (bat.ab || 0) + '</span></div>' +
    '<div class="tvscore">' +
      '<div class="tvteam"><span class="abbr visitor">' + esc(abbr(S.visitor.name)) + '</span><span class="scorenum">' + S.score.Visitor + '</span></div>' +
      '<div><div class="tvcount">' + S.balls + '-' + S.strikes + '</div><div class="tvinn">' + esc(inn) + '</div></div>' +
      '<div class="tvteam" style="justify-content:flex-end"><span class="scorenum">' + S.score.Home + '</span><span class="abbr home">' + esc(abbr(S.home.name)) + '</span></div>' +
    '</div>' +
    '<div class="tvsmall">' +
      '<span class="tvdots">OUTS ' + outDots + '</span>' +
      '<span class="tvdots">BASES ' + baseDots + '</span>' +
    '</div>' +
    '<div class="tvsmall tvmeta">P: ' + esc(S.pitcher.name) + ' (' + S.pitcher.hand + ') &middot; B: ' + esc(bat.name) + ' (' + bat.hand + ') &middot; YOU: ' + esc(abbr(userTeam().name)) + '</div>' +
    '</div>';
}

function renderCountRow() {
  return '<div class="countrow">' +
    '<div class="countbox">' +
      '<div class="countline">COUNT <span>' + S.balls + 'B &middot; ' + S.strikes + 'S</span> &middot; OUTS <span>' + S.outs + '/3</span></div>' +
      '<div class="countline">PITCH: <span>' + (S.pitchType || "\u2014") + '</span></div>' +
    '</div></div>';
}

function dieHtml(val, blank) {
  const shown = (val === null || val === undefined) ? "?" : val;
  const isBlank = blank || shown === "\u2013";
  return '<div class="die' + (isBlank ? " blank" : "") + '">' + shown + '</div>';
}
function dieBox(sideLabel, roleLabel, val, cls) {
  return '<div class="diebox ' + cls + '">' +
    '<div class="dielabel">' + sideLabel + ' &middot; ' + roleLabel + '</div>' +
    dieHtml(val) + '</div>';
}

function renderDiceStrip() {
  const sw = S.lastSwing || {};
  let html = '<div class="dicerow">' +
    dieBox(userIsPitcher() ? "YOU" : "CPU", "PITCHER (d20)", sw.pRoll !== undefined ? sw.pRoll : null, userIsPitcher() ? "user" : "cpu") +
    dieBox(userIsPitcher() ? "CPU" : "YOU", "BATTER (d20)", sw.bRoll !== undefined ? sw.bRoll : null, userIsPitcher() ? "cpu" : "user") +
    '</div>';
  return html;
}

function renderLog() {
  return '<div class="log">' + S.log.slice(-3).map(l => '<div class="logline">&gt; ' + esc(l) + '</div>').join("") + '</div>';
}

function renderFieldUI() {
  const up = userIsPitcher();
  let rollHtml = "";
  if (S.pendingRoll) {
    const pr = S.pendingRoll;
    rollHtml = '<div class="diebox ' + (pr.auto ? "cpu" : "user") + '"><div class="dielabel">' + esc(pr.label) + '</div>' +
      dieHtml(pr.done ? pr.value : null) + '</div>' +
      (pr.done ? "" : '<button class="btn rollbtn" data-action="roll-die" style="flex:0 0 auto">ROLL</button>');
  } else if (S.phase === "windup" && !S.batterReady) {
    rollHtml = '<div class="dielabel" style="padding:8px">NEW BATTER STEPPING UP TO THE PLATE\u2026</div>';
  } else if (S.phase === "windup") {
    if (up) {
      rollHtml = PITCH_TYPES.map(t => '<button class="btn rollbtn" data-action="pitch" data-type="' + t + '" ' + (S.animating ? "disabled" : "") + '>' + t.toUpperCase() + '</button>').join("");
    } else {
      rollHtml = '<button class="btn rollbtn" data-action="pitch" ' + (S.animating ? "disabled" : "") + '>PITCH</button>';
    }
    // steal declarations for your runners (Stater: declared at the windup)
    if (!up) {
      [0, 1].forEach(b => {
        if (!baseOccupied(b) || baseOccupied(b + 1)) return; // base must be occupied and the one ahead open
        const sel = S.stealTry === b;
        rollHtml += '<button class="btn ' + (sel ? '' : 'ghost') + ' pausebtn" data-action="steal-declare" data-base="' + b + '" style="flex:0 0 auto">' + (sel ? '\u2713 ' : '') + (b === 0 ? 'STEAL 2ND' : 'STEAL 3RD') + '</button>';
      });
    }
  } else if (S.phase === "extrabase") {
    rollHtml = '<button class="btn rollbtn" data-action="extrabase-yes">SEND THE RUNNER</button>' +
      '<button class="btn ghost pausebtn" data-action="extrabase-no">HOLD</button>';
  }
  return '<div class="rollwrap" style="display:flex;gap:8px;padding:10px">' + rollHtml +
    '<button class="btn ghost pausebtn" data-action="pause" style="flex:0 0 52px">II</button></div>';
}

function render() {
  const top = document.getElementById("toppanels");
  const bot = document.getElementById("botpanels");
  const fstage = document.getElementById("fieldstage");
  if (!top || !bot || !fstage) return;

  if (S.screen === "game") {
    fstage.style.display = "block";
    top.innerHTML = renderTVBar() + renderCountRow();
    bot.innerHTML = renderFieldUI() + renderDiceStrip() + renderLog();
    if (S.awaitNext) {
      bot.innerHTML += '<div class="overlay"><div class="panel">' +
        '<div class="panel-title">SIDE RETIRED</div>' +
        '<div class="msg">' + esc(S.awaitNext) + '</div>' +
        '<button class="btn center" data-action="continue">CONTINUE</button>' +
        '</div></div>';
    }
    if (S.pauseOpen) {
      bot.innerHTML += '<div class="overlay"><div class="panel">' +
        '<div class="panel-title">PAUSE MENU</div>' +
        '<button class="btn" data-action="resume">1. Resume Game</button>' +
        '<button class="btn ghost" data-action="restart">2. Restart Current Game</button>' +
        '<button class="btn warn" data-action="quit">3. Quit to Main Menu</button>' +
        '</div></div>';
    }
    updateField();
  } else {
    fstage.style.display = "none";
    top.innerHTML = "";
    bot.innerHTML =
      S.screen === "title" ? renderTitle() :
      S.screen === "select" ? renderSelect() :
      S.screen === "pickSide" ? renderPickSide() :
      S.screen === "seasonRoll" ? renderSeasonRoll() :
      S.screen === "rosterCut" ? renderRosterCut() :
      S.screen === "rosterPos" ? renderRosterPos() :
      S.screen === "rosterOrder" ? renderRosterOrder() :
      S.screen === "seasonHub" ? renderSeasonHub() :
      S.screen === "offseason" ? renderOffseason() :
      S.screen === "profiles" ? renderProfiles() :
      S.screen === "matchup" ? renderMatchup() :
      S.screen === "schedule" ? renderSchedule() :
      S.screen === "standings" ? renderStandings() :
      S.screen === "news" ? renderNews() :
      renderFinal();
  }
}

/* ================= season flow ================= */

function startSeasonSetup(teamName) {
  const roster = rollRoster(teamName);
  S.season = {
    id: String(Date.now()) + String(Math.floor(Math.random() * 1000)),
    team: teamName, year: 1, money: 40,
    markets: [TEAM_MARKET[teamName]],
    roster, minors: [],
    positions: {}, lineup: [],
    schedule: buildSchedule(teamName),
    gameIdx: 0, wins: 0, losses: 0,
    form: [], formAll: {},
    runsFor: 0, runsAgainst: 0,
    news: [], newsWeek: 0,
    records: {}, npts: makeNPTs(teamName),
    cutSel: [], posSel: null,
    off: null, seasons: 1, ready: false, complete: false
  };
  Object.keys(TEAM_MARKET).forEach(t => { S.season.records[t] = { w: 0, l: 0 }; });
  S.screen = "seasonRoll";
  render();
}

function prepSeasonGame() { // set up the matchup screen for the next game on the schedule
  const s = S.season;
  const game = s.schedule[s.gameIdx];
  const userTeamObj = buildGameTeam(s.team, s.lineup, s.positions);
  const oppAA = s.npts[game.opp];
  const oppTeamObj = buildGameTeam(game.opp, oppAA.lineup, oppAA.positions);
  if (game.home) { S.home = userTeamObj; S.visitor = oppTeamObj; S.userSide = "Home"; }
  else { S.visitor = userTeamObj; S.home = oppTeamObj; S.userSide = "Visitor"; }
  S.coinFlipped = false; S.coinSide = null; S.coinResult = null;
  S.screen = "matchup";
  render();
}

function playSeasonGame() {
  prepSeasonGame();
  startGame();
}

function buildGameTeam(name, lineup, positions) {
  return {
    name, lineup: lineup.slice(), positions,
    batIdx: 0, roster: null, fatigueReset: true,
    pAttr: null, bAttr: null
  };
}

function recordSeasonResult(userWon) {
  const s = S.season;
  if (userWon) { s.wins++; s.records[s.team].w++; }
  else { s.losses++; s.records[s.team].l++; }
  s.form.push(userWon ? "W" : "L");
  const opp = s.schedule[s.gameIdx].opp;
  pushForm(s.team, userWon);
  pushForm(opp, !userWon);
  const userSideScore = S.userSide === "Home" ? "Home" : "Visitor";
  s.runsFor += S.score[userSideScore];
  s.runsAgainst += S.score[userSideScore === "Home" ? "Visitor" : "Home"];
  simLeagueWeek(s, opp); // the rest of the league plays on, in matched pairs
  s.gameIdx++;
  maybeWeekNews();
  saveSeason();
}

function pushForm(t, won) { // rolling last-5 form for every club
  const s = S.season;
  (s.formAll[t] = s.formAll[t] || []).push(won ? "W" : "L");
  s.formAll[t] = s.formAll[t].slice(-5);
}

function simLeagueWeek(s, opp) {
  const ids = Object.keys(TEAM_MARKET).filter(t => t !== s.team && t !== opp);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  for (let i = 0; i + 1 < ids.length; i += 2) {
    const a = ids[i], b = ids[i + 1];
    const aWins = rint(1, 2) === 1;
    s.records[a][aWins ? "w" : "l"]++;
    s.records[b][aWins ? "l" : "w"]++;
    pushForm(a, aWins);
    pushForm(b, !aWins);
  }
}

/* weekly MLB wire: results, injuries and hot streaks from around the simmed league */
function maybeWeekNews() {
  const s = S.season;
  if (s.gameIdx === 0 || s.gameIdx % 6 !== 0) return;
  const week = s.gameIdx / 6;
  if (s.news && s.news[0] && s.news[0].week >= week) return;
  const items = [];
  const others = Object.keys(TEAM_MARKET).filter(t => t !== s.team);
  for (let g = 0, n = rint(2, 4); g < n; g++) {
    const a = pick(others);
    let b = pick(others);
    while (b === a) b = pick(others);
    const winner = rint(1, 2) === 1 ? a : b;
    const w = rint(2, 9), l = rint(0, w - 1);
    items.push("FINAL: " + winner + " " + w + ", " + (winner === a ? b : a) + " " + l);
  }
  if (rint(1, 3) > 1) {
    const t = pick(others);
    const roster = s.npts[t] && s.npts[t].lineup;
    if (roster && roster.length) {
      const p = pick(roster);
      items.push("INJURY: " + p.name + " (" + t + ") \u2014 " + pick(["sore shoulder", "tight hamstring", "sprained ankle", "back stiffness"]) + ", out " + rint(1, 3) + " games");
    }
  }
  const hot = pick(others);
  const hp = s.npts[hot] && s.npts[hot].lineup && pick(s.npts[hot].lineup);
  if (hp) items.push("HOT BAT: " + hp.name + " (" + hot + ") launched " + rint(2, 4) + " homers this week");
  const arm = pick(others);
  const ap = s.npts[arm] && s.npts[arm].positions && s.npts[arm].positions.P;
  if (ap) items.push("HOT ARM: " + ap.name + " (" + arm + ") fired a " + pick(["two-hit shutout", "one-hitter", "12-strikeout complete game"]));
  s.news = s.news || [];
  s.news.unshift({ week, items });
  s.news = s.news.slice(0, 8);
}

function finishSeason() {
  const s = S.season;
  // fan base roll by finish
  const div = findDivision(s.team).slice().sort((a, b) => {
    const ra = s.records[a], rb = s.records[b];
    return (rb.w / ((rb.w + rb.l) || 1)) - (ra.w / ((ra.w + ra.l) || 1));
  });
  const place = div.indexOf(s.team);
  const winPct = s.wins / Math.max(1, s.wins + s.losses);
  let tier;
  if (place === 0) tier = "Best in Division";
  else if (place === div.length - 1) tier = "Worst in Division";
  else tier = winPct > 0.5 ? "Winning Record" : winPct === 0.5 ? "Even Record" : "Losing Record";

  const lines = [];
  lines.push("Finish: " + tier + " (" + s.wins + "-" + s.losses + ")");

  // fan base roll
  const table = {
    "Best in Division": [3, 6], "Winning Record": [2, 6], "Even Record": [1, 5], "Losing Record": [5, 6], "Worst in Division": [4, 6]
  };
  const r = rollD(6);
  const [growMax, shrinkMin] = table[tier];
  if (r <= growMax) {
    const owned = s.markets;
    const options = [];
    owned.forEach(m => MARKETS[m].adj.forEach(a => { if (!owned.includes(a) && !options.includes(a)) options.push(a); }));
    if (options.length) {
      const nm = pick(options);
      s.markets.push(nm);
      lines.push("Fan base grows: added " + MARKETS[nm].name + " market (rolled " + r + ")");
    } else lines.push("Fan base roll: " + r + " \u2014 no adjacent markets available");
  } else if (r >= shrinkMin) {
    if (s.markets.length > 1) {
      const drop = s.markets.filter(m => m !== TEAM_MARKET[s.team])[0];
      if (drop) { s.markets = s.markets.filter(m => m !== drop); lines.push("Fan base shrinks: lost " + MARKETS[drop].name + " market (rolled " + r + ")"); }
      else lines.push("Fan base roll: " + r + " \u2014 home market is safe");
    } else lines.push("Fan base roll: " + r + " \u2014 home market is safe");
  } else {
    lines.push("Fan base unchanged (rolled " + r + ")");
  }

  // income by tier and markets
  const [maj, min] = INCOME_TIERS[tier];
  let income = 0;
  s.markets.forEach(m => { income += MARKETS[m].tier === "major" ? maj : min; });
  s.money += income;
  lines.push("Income: $" + income + "M from " + s.markets.length + " market(s)");

  // salaries
  let bill = 0;
  s.roster.forEach(p => { bill += salaryOf(p); });
  s.minors.forEach(() => { bill += 0.25; });
  s.money -= bill;
  lines.push("Salaries: -$" + bill.toFixed(1) + "M \u2014 treasury $" + s.money.toFixed(1) + "M");

  // release unaffordable players
  while (s.money < 0 && s.roster.length > 9) {
    let low = 0;
    s.roster.forEach((p, i) => { if (totalSkill(p) < totalSkill(s.roster[low])) low = i; });
    const rel = s.roster.splice(low, 1)[0];
    bill = s.roster.reduce((a, p) => a + salaryOf(p), 0);
    s.money -= 0; // salaries already counted; recompute next loop
    lines.push("RELEASED: " + rel.name + " (couldn't meet payroll)");
    s.money += salaryOf(rel); // refund the already-deducted salary
  }

  // off-season events for the worst team in the division
  if (place === div.length - 1) {
    const e = rint(2, 12);
    if (e === 2) lines.push("OFF-SEASON EVENT: fan revolt! The owner considers selling (rolled 2)");
    else if (e === 3) lines.push("OFF-SEASON EVENT: relocation rumors swirl (rolled 3)");
    else lines.push("OFF-SEASON EVENT: fans are patient (rolled " + e + ")");
  }

  // development: minor leaguers improve one skill
  s.minors.forEach(p => {
    const skills = ["B", "F", "P", "R"];
    const sk = pick(skills);
    const r2 = rint(1, 6) + rint(1, 6) + rint(1, 6);
    if (r2 > p[sk] && !p.noMinor) { p[sk]++; lines.push("DEVELOPMENT: " + p.name + " improved " + sk + " to " + p[sk]); }
    else lines.push("DEVELOPMENT: " + p.name + " stays the same");
  });

  // aging: seasons >= 5
  s.roster.forEach(p => {
    p.seasons++;
    if (p.seasons >= 5) {
      ["B", "F", "P", "R"].forEach(sk => {
        const r2 = rint(1, 6) + rint(1, 6) + rint(1, 6);
        if (r2 < p[sk]) { p[sk] = Math.max(3, p[sk] - 1); p.noMinor = true; }
      });
      lines.push("AGING: " + p.name + " (season " + p.seasons + ") loses a step");
    }
  });

  // draft crop
  const crop = [];
  for (let i = 0; i < 6; i++) crop.push(rollPlayer());
  crop.sort((a, b) => totalSkill(b) - totalSkill(a));
  s.off = { lines, draft: crop.slice(0, 5), draftDone: false, tier };
  saveSeason();
  S.screen = "offseason";
  render();
}

function newSeason() {
  const s = S.season;
  if (s.year >= MAX_SEASONS) { // profiles hold five seasons; completed ones stay on the shelf
    s.complete = true;
    saveSeason();
    S.screen = "profiles";
    S.season = null;
    render();
    return;
  }
  s.year++;
  s.schedule = buildSchedule(s.team);
  s.gameIdx = 0; s.wins = 0; s.losses = 0;
  s.form = []; s.formAll = {};
  s.runsFor = 0; s.runsAgainst = 0;
  Object.keys(TEAM_MARKET).forEach(t => { s.records[t] = { w: 0, l: 0 }; });
  s.off = null;
  // promote the best minor leaguer if roster is short
  if (s.roster.length < 12 && s.minors.length) {
    s.minors.sort((a, b) => totalSkill(b) - totalSkill(a));
    s.roster.push(s.minors.shift());
  }
  saveSeason();
  S.screen = "seasonHub";
  render();
}

/* ================= roll handlers ================= */

function onRoll(type) {
  if (!S || S.screen !== "game" || S.pauseOpen || S.awaitNext || S.animating || S.pendingRoll || !S.batterReady) return;
  if (S.phase !== "windup") return;
  S.animating = true;
  render();
  resolvePitch(type);
}

function onStealDeclare(baseIdx) {
  if (S.animating || S.phase !== "windup") return; // only between pitches — never mid-play
  S.stealTry = S.stealTry === baseIdx ? null : baseIdx;
  render();
}

async function onExtraBase(send) {
  if (!S.extraBase) return;
  const eb = S.extraBase;
  S.extraBase = null;
  S.animating = true;
  render();
  if (send) await attemptExtraBase(eb.slot, eb.pos, eb.chart, eb.stealRunner);
  returnDefs();
  await resolveCount();
  S.phase = "windup";
  S.animating = false;
  render();
}

/* ================= roll / flow ================= */

async function onContinue() {
  if (S.walkOff) { finishGame(); return; }
  if (S.isBottom && S.inning >= 9 && S.score.Visitor !== S.score.Home) { finishGame(); return; }
  if (!S.isBottom && S.inning >= 9 && S.score.Home > S.score.Visitor) { finishGame(); return; }

  S.awaitNext = null;
  S.animating = true;
  render();
  await halfInningSwitch(); // flips the half, recolors, and walks both squads from their own dugouts
  setupHalf();
  S.animating = false;
  render();
}

function finishGame() {
  S.awaitNext = null;
  const userWon = S.userSide === "Home" ? S.score.Home > S.score.Visitor : S.score.Visitor > S.score.Home;
  if (S.season) recordSeasonResult(userWon);
  S.screen = "final";
  render();
}

/* ================= events ================= */

document.getElementById("app").addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const a = el.dataset.action;

  if (a === "start") { // quick game: pick the two MLB teams, then who you manage
    S.season = null;
    S.seasonPending = false;
    S.quickSel = { pass: "Visitor", picked: null };
    S.teamSel = { label: "VISITOR TEAM", stage: "league", league: null, division: null, team: null };
    S.screen = "select";
    render();
  }
  else if (a === "profiles") { S.season = null; S.seasonPending = false; S.screen = "profiles"; render(); }
  else if (a === "new-profile") { S.seasonPending = true; S.screen = "select"; S.teamSel = { label: "Your Team", stage: "league", league: null, division: null, team: null }; render(); }
  else if (a === "load-profile") {
    const p = loadProfiles()[parseInt(el.dataset.idx, 10)];
    if (p) { S.season = p; S.screen = "seasonHub"; render(); }
  }
  else if (a === "del-profile") {
    const list = loadProfiles();
    list.splice(parseInt(el.dataset.idx, 10), 1);
    saveProfiles(list);
    render();
  }
  else if (a === "title") { S = freshState(); render(); }
  else if (a === "hub") { S.screen = "seasonHub"; render(); }
  else if (a === "schedule-view") { S.screen = "schedule"; render(); }
  else if (a === "standings-view") { S.screen = "standings"; render(); }
  else if (a === "news-view") { S.screen = "news"; render(); }
  else if (a === "quit-season") { saveSeason(); S.season = null; S.screen = "profiles"; render(); }
  else if (a === "season-play") prepSeasonGame();
  else if (a === "coin-flip") {
    const s = S.season;
    if (!s || S.coinFlipped) return;
    const opp = s.schedule[s.gameIdx].opp;
    S.coinResult = pick([s.team, opp]);
    S.coinSide = S.coinResult === s.team ? "user" : "cpu";
    S.coinFlipped = true;
    render();
  }
  else if (a === "play-ball") startGame();
  else if (a === "matchup-back") { S.screen = "seasonHub"; render(); }
  else if (a === "ts-pick") tsPick(parseInt(el.dataset.idx, 10));
  else if (a === "ts-random") tsRandom();
  else if (a === "ts-back") tsBack();
  else if (a === "pick-side") { S.userSide = el.dataset.side; startGame(); }
  else if (a === "pitch") { if (!S.animating) onRoll(el.dataset.type || pick(PITCH_TYPES)); }
  else if (a === "roll-die") onRollDie();
  else if (a === "steal-declare") onStealDeclare(parseInt(el.dataset.base, 10));
  else if (a === "extrabase-yes") onExtraBase(true);
  else if (a === "extrabase-no") onExtraBase(false);
  else if (a === "pause") { if (!S.animating) { S.pauseOpen = true; render(); } }
  else if (a === "resume") { S.pauseOpen = false; render(); }
  else if (a === "restart") { S.pauseOpen = false; rematch(); }
  else if (a === "quit") {
    if (S.season && S.season.off === null && S.gameIdx !== undefined) {
      if (S.screen === "game") { S.screen = "seasonHub"; render(); }
      else { S = freshState(); render(); }
    } else { S = freshState(); render(); }
  }
  else if (a === "continue") onContinue();
  else if (a === "rematch") rematch();
  else if (a === "go-roster-cut") { S.screen = "rosterCut"; render(); }
  else if (a === "cut-toggle") {
    const i = parseInt(el.dataset.idx, 10);
    const sel = S.season.cutSel;
    const at = sel.indexOf(i);
    if (at >= 0) sel.splice(at, 1);
    else if (sel.length < 3) sel.push(i);
    render();
  }
  else if (a === "cuts-done") {
    const s = S.season;
    s.savedRoster = s.roster.slice(); // kept so the cuts can be redone
    s.savedCutSel = s.cutSel.slice();
    s.cutSel.sort((x, y) => y - x).forEach(i => s.roster.splice(i, 1));
    s.cutSel = [];
    S.screen = "rosterPos";
    render();
  }
  else if (a === "pos-pick") { S.season.posSel = S.season.roster[parseInt(el.dataset.pi, 10)]; render(); }
  else if (a === "pos-slot") {
    const pos = el.dataset.pos;
    if (S.season.posSel) { S.season.positions[pos] = S.season.posSel; S.season.posSel = null; }
    else delete S.season.positions[pos];
    render();
  }
  else if (a === "back-to-cuts") { // rewind to the cut stage, players restored
    const s = S.season;
    if (s.savedRoster) {
      s.roster = s.savedRoster.slice();
      s.cutSel = s.savedCutSel.slice();
      s.savedRoster = null;
      s.savedCutSel = null;
    }
    s.positions = {};
    s.posSel = null;
    S.screen = "rosterCut";
    render();
  }
  else if (a === "back-to-pos") { S.screen = "rosterPos"; render(); }
  else if (a === "pos-done") {
    const s = S.season;
    s.lineup = POSITIONS.map(p => s.positions[p]).sort((a, b) => b.B - a.B);
    S.screen = "rosterOrder";
    render();
  }
  else if (a === "order-up" || a === "order-dn") {
    const i = parseInt(el.dataset.idx, 10);
    const j = a === "order-up" ? i - 1 : i + 1;
    if (j >= 0 && j < 9) { const t = S.season.lineup[i]; S.season.lineup[i] = S.season.lineup[j]; S.season.lineup[j] = t; }
    render();
  }
  else if (a === "order-done") {
    S.season.savedRoster = null;
    S.season.savedCutSel = null;
    S.season.ready = true;
    saveSeason();
    S.screen = "seasonHub";
    render();
  }
  else if (a === "season-next") {
    const s = S.season;
    if (s.gameIdx >= s.schedule.length) finishSeason();
    else { S.screen = "seasonHub"; render(); }
  }
  else if (a === "draft-pick") {
    const s = S.season;
    const p = s.off.draft.splice(parseInt(el.dataset.idx, 10), 1)[0];
    if (p) {
      s.roster.push(p);
      s.off.draftDone = true;
      if (s.roster.length > 12) {
        let low = 0;
        s.roster.forEach((q, i) => { if (totalSkill(q) < totalSkill(s.roster[low])) low = i; });
        s.minors.push(s.roster.splice(low, 1)[0]);
      }
    }
    saveSeason();
    render();
  }
  else if (a === "new-season") newSeason();
});

document.addEventListener("keydown", e => {
  if (!S || S.screen !== "game" || S.pauseOpen || S.awaitNext) return;
  if (e.key === "Enter") {
    e.preventDefault();
    if (S.pendingRoll) onRollDie();
    else if (!S.animating && S.phase === "windup" && S.batterReady && !userIsPitcher()) onRoll(pick(PITCH_TYPES));
  }
});

function rematch() {
  if (S.season) { playSeasonGame(); return; }
  startGame();
}

function tsPick(idx) {
  const t = S.teamSel;
  let options;
  if (t.stage === "league") options = Object.keys(LEAGUES);
  else if (t.stage === "division") options = Object.keys(LEAGUES[t.league]);
  else options = LEAGUES[t.league][t.division];
  const opt = options[idx];
  if (t.stage === "league") { t.league = opt; t.stage = "division"; }
  else if (t.stage === "division") { t.division = opt; t.stage = "team"; }
  else chooseTeam(opt);
  render();
}

/* a team has been chosen — by tapping through the lists or by the RANDOM TEAM button */
function chooseTeam(opt) {
  if (S.seasonPending) { startSeasonSetup(opt); return; }
  if (S.quickSel) {
    if (S.quickSel.pass === "Visitor") {
      S.quickSel.picked = opt;
      S.quickSel.pass = "Home";
      S.teamSel = { label: "HOME TEAM", stage: "league", league: null, division: null, team: null };
      return;
    }
    if (opt === S.quickSel.picked) return; // can't play a team against itself
    const v = autoAssign(rollRoster(S.quickSel.picked));
    const h = autoAssign(rollRoster(opt));
    S.visitor = buildGameTeam(S.quickSel.picked, v.lineup, v.positions);
    S.home = buildGameTeam(opt, h.lineup, h.positions);
    S.userSide = null;
    S.quickSel = null;
    S.screen = "pickSide";
    return;
  }
  const v = autoAssign(rollRoster(opt));
  const h = autoAssign(rollRoster(pick(Object.keys(TEAM_MARKET).filter(x => x !== opt))));
  S.visitor = buildGameTeam(opt, v.lineup, v.positions);
  S.home = buildGameTeam(pick(Object.keys(TEAM_MARKET).filter(x => x !== opt)), h.lineup, h.positions);
  S.userSide = null;
  S.screen = "pickSide";
}

function tsRandom() { // jump straight to a random MLB club
  let pool = Object.keys(TEAM_MARKET);
  if (S.quickSel && S.quickSel.pass === "Home") pool = pool.filter(t => t !== S.quickSel.picked);
  chooseTeam(pick(pool));
  render();
}

function tsBack() {
  const t = S.teamSel;
  if (t.stage === "league") { S.screen = "title"; S.seasonPending = false; S.quickSel = null; }
  else if (t.stage === "division") t.stage = "league";
  else t.stage = "division";
  render();
}

S = freshState();
buildField();
render();