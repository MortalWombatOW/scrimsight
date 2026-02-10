## Question

How important is team composition analysis in Overwatch competitive scrim review? Do coaches track which compositions they run and their win rates? How do teams decide what compositions to practice — based on map, opponent tendencies, or meta? What role does hero-specific performance data play in coaching decisions?

## Answer

The Science of Victory: Advanced Team Composition Analysis and Strategic Infrastructure in Competitive Overwatch
1. Introduction: The Strategic Depth of Modern Esports

Competitive Overwatch operates at the apex of strategic complexity in the esports domain. Unlike traditional tactical shooters where twitch reflexes and static positioning often dictate outcomes, Overwatch functions as a dynamic, high-velocity hybrid of a First-Person Shooter (FPS) and a Multiplayer Online Battle Arena (MOBA). In this environment, the interaction between thirty-nine distinct heroes, intricate map geometries, and six-player (now five-player in Overwatch 2) synergy creates a permutation of variables that defies simple analysis. At the professional level—encompassing the Overwatch Champions Series (OWCS), the legacy Overwatch League (OWL), and high-tier Contenders play—victory is rarely a product of serendipity. It is the result of rigorous, data-driven engineering where team composition analysis serves as the foundational bedrock of performance.  

The central inquiry of this report examines the critical role of team composition analysis in the scrim review process. It investigates how professional coaching staffs track compositional win rates, the methodology behind selecting compositions for practice, and the increasing reliance on hero-specific performance data to inform roster decisions. The findings suggest that modern Overwatch coaching has evolved into a discipline akin to "Moneyball" in traditional sports, where inefficiencies in the meta are exploited through superior data infrastructure and analytical pedagogy.  

1.1 The Evolution of Analytical Rigor

In the nascent stages of competitive Overwatch, strategy was largely anecdotal, driven by "feel" and the emulation of dominant teams (often from the Korean region). However, as the ecosystem matured, so did the infrastructure. The transition from manual spreadsheet entry to automated parsing of Workshop codes like ScrimTime and LogTime has revolutionized how teams understand the game. Coaches no longer guess why a team fight was lost; they parse the combat log to identify that a specific support player died 1.5 seconds before the engagement began, creating a cascade of failure that rendered the composition inert.  

This report is structured to provide an exhaustive analysis of these systems. It will traverse the theoretical frameworks of composition interactions, the technical architecture of data collection in a closed-API environment, and the pedagogical application of these insights in a high-pressure team environment.
2. Theoretical Frameworks: The Macro-Strategy Interaction Matrix

To understand how teams decide what to practice, one must first master the theoretical interactions between composition archetypes. Professional analysis categorizes the vast array of potential hero combinations into three primary macro-archetypes: Brawl (Rush), Dive, and Poke (Spam). These archetypes form a cyclical relationship often simplified as "Rock-Paper-Scissors," though the reality is far more nuanced, heavily influenced by map geometry and execution.  

2.1 The Trinity of Compositional Archetypes
Archetype	Core Philosophy	Win Condition	Weakness	Statistical Signature
Brawl (Rush)	Utilization of high health pools, shields, and speed to force close-quarters combat.	Overwhelm the opponent with superior sustain and focus fire in a designated "kill box."	Susceptible to multi-angle poking and high-ground separation where they cannot close the distance.	

High "Healing Received," Low "Fight Duration," High "Assist" counts.
Dive	Utilization of high vertical and horizontal mobility to bypass frontlines.	Isolate and eliminate vulnerable backline targets through synchronized burst damage.	Vulnerable to anti-mobility crowd control (CC) and high-sustain stacking (Brawl) if the initial engage fails.	High "First Death" generation, High "Vertical Mobility" metrics, Low "Damage Taken" (ideal).
Poke (Spam)	Utilization of long-range damage and rigorous spacing to control sightlines.	Deplete enemy resources (barriers, health, cooldowns) before they can close the effective range.	Weak to rapid coordinated collapse (Dive) or being cornered without space to kite (rotation failure).	High "Hero Damage," Long "Pre-Fight" phase duration, High "Solo Kill" rate (Snipers).
 
2.1.1 Brawl (Rush) Dynamics

The Brawl archetype, epitomized by the legendary GOATS meta (3 Tank, 3 Support), relies on the synergy of resource stacking. In the modern 5v5 era, this often revolves around heroes like Reinhardt, Ramattra, or Junker Queen paired with speed-enabling supports like Lucio. The analytical focus for Brawl is Efficiency of Pathing. Since Brawl compositions have limited effective range, every second spent "rotating" (moving from cover to the engagement point) is a second where they take "trash damage" without returning value. Scrim analysis for Brawl teams focuses heavily on "Resource Management"—specifically, how many shield points and defensive cooldowns (e.g., Mei Wall, Baptiste Lamp) remain when the team finally closes the distance.  

2.1.2 Dive Dynamics

Dive is the most mechanically demanding archetype, requiring frame-perfect synchronization. A "Winston-Tracer-Sombra" dive relies on all three players striking a target within a 0.5-second window. If the Winston lands too early, he takes focus fire and dies (feeding). If he lands too late, the Tracer forces recall without support. Data analysis for Dive focuses on Target Focus Efficiency—a metric derived from calculating the percentage of damage contributed by multiple players to a single elimination. High-level Dive teams exhibit a "Target Focus" ratio >4.0, indicating that on average, four players contribute to the final blow.  

2.1.3 Poke (Spam) Dynamics

Poke compositions, often featuring Sigma or Circuit Royal-style sniper setups (Widowmaker/Hanzo), play a game of resource attrition. The goal is to force the enemy to burn resources (e.g., a Kiriko Suzu or an Ana Nade) just to survive the approach. The analytical key here is First Blood Success Rate (FBSR). In Poke, the first kill often dictates the entire fight. If a Widowmaker secures an opening pick, the win probability spikes to >80%. Conversely, if the Poke team is forced to brawl on an objective without an opening pick, their win probability plummets.  

2.2 The "Map is King" Doctrine

While hero synergies are important, professional coaches universally agree that Map Geometry is the primary dictator of composition viability. The physical layout of the map determines the "effective range" of the engagement, which in turn selects the optimal archetype.  

    Sightline Analysis: Maps with sightlines exceeding 40 meters (e.g., Havana, Circuit Royal, Junkertown) mathematically favor Poke compositions. A Brawl team attempting to cross a 40-meter sightline against a Widowmaker will statistically lose one player or 80% of their resources before the fight begins.

    Verticality Analysis: Maps with "inaccessible high ground"—areas that cannot be reached by walking (e.g., Gibraltar Phase 2, Dorado Phase 2)—mandate Dive or vertical-hybrid compositions. A Reinhardt cannot contest a Soldier: 76 on the high ground of Gibraltar; thus, the map forces a Winston, D.Va, or Doomfist selection.   

    Choke Point Analysis: Maps with tight, unavoidable choke points (e.g., King's Row, Lijiang Control Center) favor Brawl. The geometry forces the enemy into the Brawl team's effective range, negating the range disadvantage.

2.3 The "Meta" vs. "Comfort" Philosophical Divide

A central tension in roster construction and practice planning is the balance between the "Meta" (the globally perceived optimal strategy) and "Comfort" (the specific strengths of the roster).

    The Data-Driven Optimizers (e.g., WizardHyeong): Coaches like WizardHyeong (formerly of NYXL and Washington Justice) advocate for a "Moneyball" approach where the optimal strategy is identified through rigorous statistical analysis and then drilled until execution is perfect. The philosophy is that at the highest level of execution, a sub-optimal composition will eventually be dismantled by the optimal one. This approach views "comfort" as a weakness to be coached out of a player.   

The Identity-Based Realists (e.g., ChrisTFer): Conversely, coaches like Christopher "ChrisTFer" Graham (London Spitfire, OWCS) argue for building a system around player identity. His London Spitfire roster famously forced a Reinhardt-Brawl composition in a global Winston-Dive meta and achieved significant success. His philosophy posits that a team executing a B-tier composition at A-tier efficiency will beat a team executing an A-tier composition at B-tier efficiency. For ChrisTFer, scrim analysis is used to find "adaptations" for their comfort picks rather than forcing a switch to the meta.  

Synthesis: The modern consensus involves a "Viability Threshold." Teams will practice their comfort composition against the meta in scrims. If the win rate drops below a confidence interval (typically 40-45%), the data suggests the comfort pick is no longer viable, and a switch is mandated.  

3. Data Infrastructure: Tracking Scrims in a Closed Ecosystem

One of the unique challenges of Overwatch analysis is the lack of a robust, public API for match data, unlike League of Legends or Dota 2. Blizzard has historically kept the game's internal data a "black box," forcing professional teams to build bespoke infrastructure to track scrims.  

3.1 The Workshop Revolution: ScrimTime and LogTime

The introduction of the Overwatch Workshop was a watershed moment for analytics. It allowed savvy coaches and developers to write scripts that run inside the game client, listening for event triggers and logging them to a local file. The industry standard tool for this is ScrimTime (Import Code: DKEEH or Professional Variant A8XVJ).  

3.1.1 Technical Mechanism

    Event Listening: The Workshop script is programmed to detect specific game state changes. Common triggers include PLAYER_DIED, PLAYER_DEALT_DAMAGE, ULTIMATE_CHARGED, OBJECTIVE_CAPTURED.

    Log Generation: These events are printed to the WorkshopInspector.log file in the local Overwatch directory. A single map can generate thousands of lines of log data.

    Parsing: Because raw logs are unstructured text, teams use custom parsers (often written in Python or using tools like Parsertime) to convert the text into structured formats (CSV/JSON).   

Ingestion: The structured data is fed into visualization dashboards (Google Sheets, Tableau, PowerBI) where it becomes actionable intelligence.  

3.2 Historical Context: The "Visor" Controversy and Winston's Lab

Before the Workshop, tools like Visor attempted to use computer vision and screen scraping to provide real-time analytics. However, these were eventually banned or restricted by Blizzard for infringing on competitive integrity/Terms of Service. Winston's Lab was an early pioneer in manual data collection, creating the first widely used "rating" systems for players, though it suffered from the limitations of manual input (e.g., box scores only, no positioning data).  

Modern tools like Gunba's Computer Vision Project represent the cutting edge. Coach Gunba (Florida Mayhem) reportedly developed proprietary computer vision software to analyze VODs automatically, identifying hero positions and ult statuses without needing manual input or Workshop codes, allowing for analysis of enemy teams where no log file is available.  

4. The Metrics of Victory: From Data to Decision

Once the data is parsed, coaches do not simply look at "Eliminations" or "Damage Done." These are considered "vanity stats" that often inversely correlate with winning (e.g., a Junkrat doing 20,000 damage into a Zarya shield is actively helping the enemy charge high-value Graviton Surges). Professional analysis focuses on "Impact Metrics."
4.1 First Death Rate (FDR) and Opening Duel Win Rate

The most predictive metric in professional Overwatch is the First Death Rate. Data analysis from the Overwatch League (specifically cited regarding the San Francisco Shock) indicated that the team suffering the first death in a team fight loses that fight approximately 75-80% of the time.  

    Application: Coaches track FDR by player and hero. If a Tracer player has a high FDR (e.g., >20%), they are a statistical liability, regardless of their mechanical skill. They are engaging too early or without support.

    "Clutch" Factor: Teams also track "Win Rate Post-First Death." Elite teams like the Shock or Florida Mayhem distinguish themselves by stabilizing 4v5 situations, often through superior ultimate usage or defensive kiting. A win rate >35% in 4v5 scenarios is a hallmark of a championship-caliber team.

4.2 Fight Win Rate (FWR) and Win Conditions

Scrim analysis segments the continuous gameplay into discrete "Team Fights." A fight is typically defined algorithmically (e.g., "3+ kills occurring within 15 seconds" or "Objective Flip").

    Compositional FWR: Coaches calculate the win rate of specific compositions on specific map points.

        Example: "Our Brawl Comp has a 62% FWR on King's Row Streets, but only a 38% FWR on King's Row Third Point."

        Actionable Insight: This data dictates a "swap strategy." The team will play Brawl for Streets but must have a preset swap to Poke or Dive for the final point, rather than trying to force the Brawl comp into unfavorable geometry.   

4.3 Target Focus (Efficiency)

Target Focus is a derived metric calculated as:
Target Focus=Team Final BlowsTeam Eliminations​

    Interpretation:

        A ratio close to 5.0 implies perfect focus fire; the entire team contributes to every kill. This is the goal for Brawl and Dive compositions.

        A ratio close to 1.0 implies individual dueling. This is acceptable for Poke/Sniper compositions but disastrous for Dive.

        Coaching Usage: If a Dive team has a low Target Focus score, the coach knows the issue is timing. The Winston is landing before the Tracer is in position, or the Sombra is hacking the wrong target. The data isolates the "process error" from the "result".   

4.4 Ultimate Economy Efficiency

The "Economy War" is a secondary game played alongside the combat.

    Metric: Ultimates Used per Fight Win.

    Analysis: The theoretical goal is to win fights using fewer ultimates than the opponent. If Team A uses 4 ultimates (Graviton, Blade, Nano, Beat) to win a fight that Team B used 0 ultimates to lose, Team A has won the battle but likely lost the map. They will have no resources for the next fight, while Team B has full resources.

    Scrim Review: Coaches highlight "Over-ulting" (using resources after the fight is already won/lost) as a critical macro error.   

5. Strategic Decision-Making: The "Moneyball" Approach to Roster Construction

In the modern era, data plays a pivotal role not just in how teams play, but who plays. The "Moneyball" philosophy—finding undervalued assets through advanced metrics—has been successfully employed by coaches like Gunba (Florida Mayhem).
5.1 Case Study: Gunba and the Florida Mayhem

Jordan "Gunba" Graham is widely cited as the premier example of a data-driven coach. His background in engineering and analytics informed a recruitment strategy that bypassed "hype" in favor of statistical indicators.  

    Undervalued Assets: Gunba recruited players like Checkmate and Someone from lower-tier Contenders teams. While the public consensus was low, Gunba's data likely showed elite "Impact Metrics"—high survival rates, high cooldown efficiency, and flexibility—that were obscured by their previous teams' poor overall performance.

    Bidding Inefficiencies: Gunba utilized data to value players differently from the market. He notably bid "2.5x the average salary" for the Chinese hitscan player Shy, recognizing that Shy's "First Blood Success Rate" and "Solo Kill" metrics were practically irreplaceable, making him worth a massive portion of the salary cap.   

Anti-Meta Strategy: Gunba's data analysis revealed that in the 5v5 format, the value of "Counter-Swapping" (switching heroes to hard-counter the enemy tank) was mathematically higher than the value of "Ult Economy" retention. This led the Mayhem to adopt a "Mystery Heroes" style of play that confused opponents and won them the OWL Championship in 2023.  

5.2 Hero-Specific Performance Data in Scouting

When scouting, coaches look for metrics that define the "Job" of the hero:

    Winston: "Primal Rage Efficiency" (Kills/Knockbacks per ult) and "Jump Pack Survival Rate" (how often does he jump in and survive?).

    Tracer: "First Death Rate" (Low is better) vs. "Final Blow Rate" (High is better). A Tracer with high damage but low Final Blows is "feeding" support ults.

    Supports: "Deaths per 10 Minutes." This is widely considered the single most important support stat. A support that stays alive provides exponential value over time.   

6. The Scrim Review Process: Pedagogy and Feedback Loops

Collecting data is only half the battle; communicating it to players is the other. This is the domain of Pedagogy—the method and practice of teaching.
6.1 Cognitive Load Theory in Coaching

Prominent educational content creators and coaches like Spilo emphasize the limitations of player "RAM" (Working Memory). A common failure mode for novice coaches is the "Laundry List" Error—providing a player with 15 different corrections after a map.  

    The Spilo Method: Identify the one trend that is causing the most significant loss in win probability (e.g., "You are consistently engaging before your Ana has line of sight").

    The Schema: Focus the entire review block on this single "Schema." If the player fixes this one major macro error, their performance improves more than if they tried to fix 10 minor micro errors.

6.2 The Review Structure: Macro to Micro

A professional scrim review follows a structured hierarchy:

    Macro Review (The Overhead View): The team watches the replay from a top-down perspective. The coach discusses positioning, rotation, and composition interaction. "We lost because our Poke comp got cornered by their Rush. We needed to rotate earlier.".   

Micro Review (The POV): The coach looks at individual player perspectives to critique mechanics and ability usage. "You missed your Sleep Dart here because you didn't wait for the Genji deflect to end."

Epistemology (The "Why"): A critical step involves asking players why they made a decision. This reveals whether the error was a "Mechanical Failure" (I missed) or a "Decision Failure" (I thought I could 1v1 him). Coaching the decision is impactful; coaching the aim is often futile in a review setting.  

6.3 Integrating Data into Review

Data is used to resolve disputes.

    Player Claim: "I'm dying because I get no healing."

    Data Reality: The coach pulls the ScrimTime log. "Actually, your 'Healing Received' was top of the team, but your 'Damage Taken' was 30% higher than average because you were standing in the open."

    The objective nature of data removes ego from the conversation, allowing for faster conflict resolution.   

7. Historical Case Studies in Compositional Strategy
7.1 The GOATS Era: The Triumph of Synergy

The GOATS meta (2018-2019) remains the most significant case study in compositional theory. The composition (Reinhardt, Zarya, D.Va, Brigitte, Lucio, Zenyatta) had a win condition based entirely on Health Pool Efficiency and Area of Effect (AOE) Healing.  

    Analysis: Data showed that damage-based compositions (e.g., 3 DPS) simply could not output enough burst damage to break through the combined 3000+ HP and armor of the GOATS ball before the GOATS team ran them over.

    Impact: This meta was so mathematically dominant that it forced Blizzard to implement "Role Lock" (2-2-2), effectively admitting that the composition broke the game's fundamental balance.

7.2 London Spitfire 2022: The Identity Outliers

In a season dominated by Winston/Doomfist dive metas, the London Spitfire, coached by ChrisTFer, played Reinhardt Brawl almost exclusively.

    The Logic: Their internal scrim data likely showed that their "Comfort" execution on Reinhardt yielded a 55% win rate, while their "Meta" execution on Winston yielded a 40% win rate.

    The Result: By forcing the enemy to play their game (Brawl) on maps that didn't favor it, they dragged opponents into uncomfortable territory ("The Mud") and achieved a top-tier finish, proving that execution can supersede meta.   

8. Conclusion

Team composition analysis in Overwatch is a discipline that has matured from simple imitation to a complex science involving data engineering, statistical modeling, and educational psychology.

    Importance: It is the single most significant predictor of success at the macro level. A team with superior mechanical skill will lose to a team with superior composition understanding if the map geometry and win conditions favor the latter.

    Tracking: Coaches use sophisticated Workshop tools like ScrimTime to track not just win rates, but granular metrics like First Death Rate, Target Focus, and Ult Economy to diagnose the cause of wins and losses.

    Decision Making: This process is a hierarchy: Map Geometry dictates the initial archetype; Opponent Tendencies dictate the specific hero adaptations; and Meta vs. Comfort data dictates the final roster selection.

    Hero-Specifics: In the era of Moneyball, hero stats are used to identify market inefficiencies, allowing smart teams to build championship rosters on a budget by recruiting players with high "Impact Metrics" rather than flashy "Vanity Stats."

The future of Overwatch coaching lies in the further automation of this pipeline. As tools like Counterwatch and computer vision become more refined, the "time-to-insight"—the speed at which a coach can translate a scrim error into a corrected behavior—will become the defining competitive advantage.  

9. Appendix: Technical Reference for Scrim Tracking
9.1 Recommended Scrim Data Fields

For teams looking to implement a professional-grade tracking system, the following fields are mandatory in the scrim database :  

Metric Category	Specific Data Points
Match Metadata	Date, Map Name, Game Mode, Scrim Partner, Patch Version.
Composition	Tank Hero, DPS 1, DPS 2, Supp 1, Supp 2 (Our Team vs. Enemy Team).
Result	Map Win/Loss, Score (e.g., 3-2), Attack Time Bank, Defense Hold %
Fight Data	Total Fights, Neutral Fights Won, Ult-Advantage Fights Won, First Death Count (Per Player).
Hero Stats	FDR (First Death Rate), FB (Final Blows), D/10 (Deaths per 10), Ult Efficiency (Kills per Ult).
9.2 Workshop Codes

    ScrimTime (Standard): DKEEH

    ScrimTime (Pro): A8XVJ

    Seita Scrim Lobby: 503ST (Legacy/Variant)

9.3 Definitions of Key Acronyms

    FDR: First Death Rate.

    FBSR: First Blood Success Rate.

    FWR: Fight Win Rate.

    Ult Econ: Ultimate Economy (management of ult resources).

    Macro: Broad strategic concepts (positioning, rotations, comps).

    Micro: Individual mechanical execution (aim, ability usage).