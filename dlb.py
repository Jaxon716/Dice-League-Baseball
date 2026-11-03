import random
import os
import sys

class DLB_Engine:
    def __init__(self):
        self.leagues = {
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
        }

        self.attributes = {
            "New York Yankees": ("Green Light!", "Hit and Run"), "Baltimore Orioles": ("Sour Patch (+1)", "Hit and Run"),
            "Tampa Bay Rays": ("Sour Patch (+1)", "Hey Batter Batter (+1)"), "Toronto Blue Jays": ("Sour Patch (+1)", "Hey Batter Batter (+1)"),
            "Boston Red Sox": ("Sour Patch (+1)", "Ain't That a Pitch?"), "Minnesota Twins": ("Green Light!", "Hey Batter Batter (+1)"),
            "Cleveland Guardians": ("Scalpel! (-1)", "Hey Batter Batter (+1)"), "Detroit Tigers": ("Sour Patch (+1)", "Hey Batter Batter (+1)"),
            "KC Royals": ("Green Light!", "Hey Batter Batter (+1)"), "Chicago White Sox": ("Standard", "Ain't That a Pitch?"),
            "Houston Astros": ("Green Light!", "Hey Batter Batter (+1)"), "Texas Rangers": ("Sour Patch (+1)", "Hit and Run"),
            "Seattle Mariners": ("Scalpel! (-1)", "Standard"), "LA Angels": ("Sour Patch (+1)", "Ain't That a Pitch?"),
            "Oakland Athletics": ("Standard", "Hit and Run"), "Atlanta Braves": ("Green Light!", "Hit and Run"),
            "Philadelphia Phillies": ("Sour Patch (+1)", "Hit and Run"), "NY Mets": ("Scalpel! (-1)", "Hey Batter Batter (+1)"),
            "Miami Marlins": ("Green Light!", "Standard"), "Washington Nationals": ("Standard", "Ain't That a Pitch?"),
            "Milwaukee Brewers": ("Green Light!", "Hey Batter Batter (+1)"), "Chicago Cubs": ("Scalpel! (-1)", "Hey Batter Batter (+1)"),
            "Cincinnati Reds": ("Sour Patch (+1)", "Hit and Run"), "St. Louis Cardinals": ("Standard", "Hey Batter Batter (+1)"),
            "Pittsburgh Pirates": ("Sour Patch (+1)", "Ain't That a Pitch?"), "LA Dodgers": ("Sour Patch (+1)", "Hey Batter Batter (+1)"),
            "Arizona D-Backs": ("Green Light!", "Hey Batter Batter (+1)"), "SF Giants": ("Scalpel! (-1)", "Hit and Run"),
            "San Diego Padres": ("Standard", "Hey Batter Batter (+1)"), "Colorado Rockies": ("Standard", "Hit and Run"),
        }

        self.hit_chart = {
            "1-1": ("Single Base Run", 1), "1-2": ("Bunt, Single Base Run", 1),
            "1-3": ("Pop Fly Out (1 lead advances)", 0), "1-4": ("Single Out", 0),
            "1-5": ("Foul Ball Catch", 0), "1-6": ("Single Base Run", 1),
            "2-2": ("Double Base Run", 2), "2-3": ("Pop Fly Out (2 lead advance)", 0),
            "2-4": ("Double Out", 0), "2-5": ("Foul Ball Catch", 0), "2-6": ("Single Base Run", 1),
            "3-3": ("Triple Base Run", 3), "3-4": ("Triple Out", 0), "3-5": ("Foul Ball Catch", 0),
            "3-6": ("Foul Ball", -1), "4-4": ("Single Base Run", 1),
            "4-5": ("Pop Fly Out (1 lead advances)", 0), "4-6": ("Foul Ball", -1),
            "5-5": ("Double Base Run", 2), "5-6": ("Foul Ball", -1), "6-6": ("HOMERUN!!!", 4)
        }
        self.reset_game_state()

    def reset_game_state(self, keep_teams=False):
        if not keep_teams:
            self.visitor, self.home = None, None
        self.score = {"Visitor": 0, "Home": 0}
        self.bases = [0, 0, 0]
        self.inning = 1
        self.is_bottom = False
        self.action_log = ["--- New Game Ready ---"]

    def clear(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    def log_event(self, msg):
        self.action_log.append(msg)
        if len(self.action_log) > 8: self.action_log.pop(0)

    def pause_menu(self):
        while True:
            self.clear()
            print("=== DLB PAUSE MENU ===")
            print("  1. Resume Game")
            print("  2. Restart Current Game")
            print("  3. Quit to Main Menu")
            choice = input("\nSelect: ").strip()
            if choice == '1': return "RESUME"
            if choice == '2': return "RESTART"
            if choice == '3': return "QUIT_TO_MENU"

    def main_menu_display(self, options, title):
        while True:
            self.clear()
            print(f"=== {title} ===")
            for i, opt in enumerate(options, 1): print(f"  {i}. {opt}")
            print("  B. [Back]")
            choice = input("\nSelect: ").strip().upper()
            if choice == 'B': return "BACK"
            if choice.isdigit() and 1 <= int(choice) <= len(options): return options[int(choice)-1]

    def team_selection_flow(self, label):
        while True:
            league_opts = ["Random (Global)"] + list(self.leagues.keys())
            league = self.main_menu_display(league_opts, f"League Selection ({label})")
            if league == "BACK": return "BACK"

            if league == "Random (Global)":
                l_key = random.choice(list(self.leagues.keys()))
                d_key = random.choice(list(self.leagues[l_key].keys()))
                t_name = random.choice(self.leagues[l_key][d_key])
            else:
                div_opts = ["Random from League"] + list(self.leagues[league].keys())
                div = self.main_menu_display(div_opts, f"{league} Divisions")
                if div == "BACK": continue

                if div == "Random from League":
                    d_key = random.choice(list(self.leagues[league].keys()))
                    t_name = random.choice(self.leagues[league][d_key])
                else:
                    t_opts = ["Random from Division"] + self.leagues[league][div]
                    t_name = self.main_menu_display(t_opts, f"{div} Teams")
                    if t_name == "BACK": continue
                    if t_name == "Random from Division":
                        t_name = random.choice(self.leagues[league][div])

            p_attr, b_attr = self.attributes.get(t_name, ("Standard", "Standard"))
            config_opt = self.main_menu_display(["Activate Attributes", "Deactivate (Standard)"], f"Set Up {t_name}")
            if config_opt == "BACK": continue

            return {"name": t_name, "p": p_attr if config_opt == "Activate Attributes" else "Standard",
                    "b": b_attr if config_opt == "Activate Attributes" else "Standard"}

    def draw_ui(self, outs, balls, strikes, bat, pitch):
        self.clear()
        inn_str = f"BOT {self.inning}" if self.is_bottom else f"TOP {self.inning}"
        b_map = lambda i: "●" if self.bases[i] else "○"
        print(f" {self.visitor['name'][:3]} {self.score['Visitor']} | {self.home['name'][:3]} {self.score['Home']}  [{inn_str}]  OUTS: {outs}/3")
        print(f" COUNT: {balls}B - {strikes}S   Bases: {b_map(2)} {b_map(1)} {b_map(0)}")
        print("-" * 65 + f"\nPITCHER: {pitch['name']} ({pitch['p']})\nBATTER:  {bat['name']} ({bat['b']})\n" + "-" * 65)
        for log in self.action_log: print(f" > {log}")
        print("-" * 65 + "\n[Enter to Pitch | 'P' to Pause]")

    def play_half(self, bat_team, pit_team, side_key):
        outs, balls, strikes = 0, 0, 0
        self.bases = [0, 0, 0]

        while outs < 3:
            if strikes >= 3:
                outs += 1; strikes, balls = 0, 0
                self.log_event("OUT: Struck Out!")
                if outs >= 3: break
            if balls >= 4:
                self.log_event("WALK!")
                self.advance(1, side_key); strikes, balls = 0, 0

            self.draw_ui(outs, balls, strikes, bat_team, pit_team)
            cmd = input("\nAction: ").strip().upper()
            if cmd == 'P':
                p_choice = self.pause_menu()
                if p_choice in ["RESTART", "QUIT_TO_MENU"]: return p_choice
                continue

            p_roll = random.randint(1, 6)

            # Ball / Steal Check
            if p_roll == 1 or p_roll == 6:
                if pit_team['p'] == "Green Light!" and p_roll == 6:
                    strikes += 1; self.log_event(f"AUTO-STRIKE! (P: 6)")
                else:
                    balls += 1; self.log_event(f"BALL (P: {p_roll})")
                    if any(self.bases): self.handle_steal(p_roll, side_key)
                continue

            # Modifiers
            p_val, b_penalty = p_roll, 0
            if pit_team['p'] == "Sour Patch (+1)" and p_roll <= 4: p_val += 1
            elif pit_team['p'] == "Sour Patch (+1)" and p_roll == 5: b_penalty = -1
            elif pit_team['p'] == "Scalpel! (-1)" and 2 <= p_roll <= 4: p_val -= 1

            b_roll = random.randint(1, 6)
            b_val = b_roll + b_penalty + (1 if bat_team['b'] == "Hey Batter Batter (+1)" else 0)
            roll_msg = f"P: {p_roll}->{p_val} | B: {b_roll}->{b_val}"

            if b_val > p_val: # Contact
                r1, r2 = random.randint(1, 6), random.randint(1, 6)
                combo = f"{min(r1, r2)}-{max(r1, r2)}"
                name, base_count = self.hit_chart.get(combo, ("Out", 0))

                if base_count == 0:
                    outs += 1; self.log_event(f"OUT: {name} [{combo}] | {roll_msg}")
                    if "lead" in name: self.advance_pop(name, side_key)
                    balls, strikes = 0, 0
                elif name == "Foul Ball":
                    if strikes < 2: strikes += 1
                    self.log_event(f"FOUL [{combo}] | {roll_msg}")
                else:
                    final_bases = base_count
                    if bat_team['b'] == "Hit and Run" and 1 <= base_count <= 2: final_bases += 1
                    self.log_event(f"HIT: {name}! [{combo}] | {roll_msg}")
                    self.advance(final_bases, side_key); balls, strikes = 0, 0
            elif b_val == p_val: # Tie
                if bat_team['b'] == "Ain't That a Pitch?":
                    strikes += 1; self.log_event(f"STRIKE! (Tie) | {roll_msg}")
                else:
                    if strikes < 2: strikes += 1
                    self.log_event(f"FOUL TIP (Tie) | {roll_msg}")
            else: # Strike
                strikes += 1; self.log_event(f"STRIKE! | {roll_msg}")

        self.draw_ui(outs, balls, strikes, bat_team, pit_team)
        input("\nSide Retired. Press Enter...")
        return "CONTINUE"

    def handle_steal(self, p_roll, side):
        runners = [i+1 for i, b in enumerate(self.bases) if b == 1]
        print(f"\nSteal Chance! Runners: {runners}")
        choice = input("Base (1-3) or [Enter] to skip: ").strip()
        if choice.isdigit() and int(choice) in runners:
            idx = int(choice)-1; win = 3 if p_roll == 1 else 5
            s_roll = random.randint(1, 6)
            if s_roll >= win:
                self.log_event(f"STEAL SAFE! (Roll: {s_roll} vs {win}+)")
                if idx == 2: self.score[side] += 1
                else: self.bases[idx+1], self.bases[idx] = 1, 0
            else:
                self.log_event(f"OUT: Caught Stealing! (Roll: {s_roll})")
                self.bases[idx] = 0

    def advance(self, num, side):
        if num == 4:
            self.score[side] += (sum(self.bases)+1); self.bases = [0,0,0]; return
        for _ in range(num):
            if self.bases[2]: self.score[side] += 1
            self.bases[2], self.bases[1], self.bases[0] = self.bases[1], self.bases[0], 0
        self.bases[num-1] = 1

    def advance_pop(self, name, side):
        indices = [2, 1] if "2 lead" in name else [2, 1, 0]
        for i in indices:
            if self.bases[i]:
                if i == 2: self.score[side] += 1
                else: self.bases[i+1] = 1
                self.bases[i] = 0
                if "1 lead" in name: break

    def run(self):
        while True:
            self.reset_game_state()
            self.clear()
            print("="*65 + "\n      DICE LEAGUE BASEBALL (DLB)      \n" + "="*65)
            input("\nPress [ENTER] to Start...")
            self.visitor = self.team_selection_flow("Visitor")
            if self.visitor == "BACK": continue
            self.home = self.team_selection_flow("Home")
            if self.home == "BACK": continue

            while True:
                q_menu, r_match = False, False
                for i in range(1, 10):
                    self.inning = i
                    for side in ["Visitor", "Home"]:
                        self.is_bottom = (side == "Home")
                        bat, pit = (self.visitor, self.home) if side == "Visitor" else (self.home, self.visitor)
                        result = self.play_half(bat, pit, side)
                        if result == "QUIT_TO_MENU": q_menu = True; break
                        if result == "RESTART": self.reset_game_state(keep_teams=True); r_match = True; break
                    if q_menu or r_match: break
                if q_menu: break
                if r_match: continue

                print(f"\nFINAL: {self.visitor['name']} {self.score['Visitor']} - {self.home['name']} {self.score['Home']}")
                c = input("\n[1] Main Menu | [2] Rematch | [3] Exit: ").strip()
                if c == '2': self.reset_game_state(keep_teams=True); continue
                elif c == '3': sys.exit()
                else: break

if __name__ == "__main__":
    DLB_Engine().run()
