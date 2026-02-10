## Question

What statistics and metrics do competitive Overwatch coaches and players consider most important when evaluating scrim performance? How do they prioritize individual player stats vs. team-level stats vs. composition analysis vs. map-specific performance? Are there specific metrics that amateur/semi-pro coaches find most actionable compared to what OWL analysts track?

## Answer

Competitive Overwatch Performance Analytics: A Comprehensive Framework for Scrim Evaluation and Player Development
1. Introduction: The Data Paradox in Competitive Overwatch

The evaluation of performance in competitive Overwatch presents a unique analytical paradox within the esports landscape. Unlike traditional first-person shooters (FPS) such as Counter-Strike or Call of Duty, where discrete events like kills and deaths serve as definitive indicators of value, Overwatch operates as a complex, synergistic system. It functions as a hybrid between a high-mobility shooter and a Multiplayer Online Battle Arena (MOBA), where the value of any specific action—dealing damage, healing, or blocking—is entirely contingent upon the context of team composition, map geometry, and the immediate "win condition."

For competitive coaches and players, ranging from the amateur "Path to Pro" circuit to the elite Overwatch Champions Series (OWCS), the transition from public ranked play to organized scrimmages requires a fundamental shift in analytical philosophy. The in-game "Scoreboard," a tool designed to provide immediate feedback in public matches by tracking total damage, healing, and eliminations, is frequently cited by high-level analysts as actively misleading in a coordinated environment. The accumulation of non-impactful numbers—colloquially known as "stat padding"—can disguise critical strategic failures, such as poor positioning, feeding enemy support ultimates, or staggering deaths.  

This report establishes a rigorous, exhaustive framework for evaluating scrim performance. It prioritizes the "Teamfight" as the atomic unit of analysis, strictly subordinating individual volume metrics to team-level success rates. It delineates the hierarchy of needs for data analysis: moving from basic survivability and fundamental mechanics in Tier 3 and Collegiate play to granular "win expectancy" modeling and machine-learning-driven "fight win probability" in professional tiers. By integrating quantitative data—such as First Pick Win Rates (FK/FD) and Ultimate Economy Efficiency—with qualitative assessments of "Space Creation" and "Target Focus," this document provides a roadmap for coaches to transform raw, noisy data into actionable competitive intelligence.
2. The Philosophy of Overwatch Data: Context Over Volume

The primary error committed by amateur analysts and players transitioning to organized play is the over-reliance on volume metrics without establishing the necessary context. In a scrim environment, high volume statistics often indicate a failure of strategy rather than a success of execution. To understand this, one must dissect the limitations of the "Medal" or "Scoreboard" mentality.
2.1 The Fallacy of the Scoreboard

In the ecosystem of public matchmaking, a "Gold Medal" or top-tier ranking in damage done is often interpreted by the player as evidence of "carrying" the team. In competitive analysis, however, high damage numbers unaccompanied by final blows are viewed through a different lens: "trash damage."

Trash Damage vs. Effective Damage Coaches distinguish between damage that forces cooldowns or secures kills (Effective Damage) and damage that is simply healed by the opposing supports (Trash Damage).

    Mechanism: When a Damage (DPS) player pours damage into a high-health tank like Roadhog or Mauga who is being actively healed, the DPS player's damage stats inflate rapidly. However, this action generates ultimate charge for the opposing support players.

    Strategic Consequence: If that damage does not result in an elimination or force a critical defensive cooldown (e.g., Kiriko’s Protection Suzu or Baptiste’s Immortality Field), the DPS player has effectively lowered their team's win probability by accelerating the enemy's support ultimates, which are often the most powerful defensive tools in the game.   

Healing as a Lagging Indicator Similarly, excessively high healing numbers are not always indicative of superior support play. In many cases, high healing throughput correlates with a team that is taking too much unnecessary damage due to poor use of natural cover or improper positioning.

    The "Healbot" Problem: A support player focusing solely on maximizing healing output may miss opportunities to contribute offensive utility. High-level analysis suggests that a support player with lower raw healing but higher offensive utility—such as finding anti-nade opportunities as Ana or securing picks as Illari—often contributes more to the team's Win Probability than a passive healer.   

    Resource Drain: If a tank requires constant double-pocket healing to survive, they are draining the team's resources, preventing supports from enabling the DPS, and making the team composition rigid and reactive rather than proactive.

2.2 The Atomic Unit: The Teamfight

To escape the volume trap, competitive analysis rejects the "match" or the "round" as the primary unit of measurement in favor of the "teamfight." A standard map of Overwatch is essentially a series of 10 to 20 discrete engagements. Evaluation focuses almost exclusively on how a team initiates, sustains, and resolves these specific interactions.

Definition: A teamfight is defined not by the game clock, but by the commitment of resources (cooldowns, ultimates, positioning) by both teams to contest an objective or map sector.

    Metric: Teamfight Win Rate is the single most important high-level Key Performance Indicator (KPI).

    Segmentation: This metric is meaningless if not segmented by "State." Analysts track win rates across three specific states:

        Dry Fights (Neutral): Neither team uses ultimates. This measures raw mechanical skill and coordination.

        Ult Advantage Fights: The team has more ultimates available than the opponent.

        Ult Disadvantage Fights: The team has fewer ultimates available.   

By analyzing these states separately, a coach can diagnose specific problems. For instance, a team that wins 60% of Ult Advantage fights but 0% of Dry Fights likely relies too heavily on pressing "Q" to win and lacks fundamental coordination in the neutral game.
3. Team-Level Metrics: The Macro Analysis

Before evaluating individual players, coaches must assess the team's macro performance. If the macro strategy is flawed—for example, engaging at the wrong time or mismanaging the ultimate economy—individual micro-performance is rendered irrelevant.
3.1 First Pick and First Death (FK/FD)

The most actionable metric for scrim analysis is the impact of the opening elimination, often referred to as "First Blood" or "First Pick."

Statistical Impact Data from years of professional play (including Winston's Lab and OWL Stats Lab) consistently demonstrates the decisive nature of the first kill.

    First Kill (FK) Win Rate: The team that secures the first kill in a standard 5v5 (or historically 6v6) engagement wins the teamfight approximately 75% to 78% of the time.   

    First Death (FD) Win Rate: Conversely, sustaining the first death drops a team's win probability to roughly 20-25%.

Actionable Insight for Coaches Coaches use this metric to diagnose "feeding" and "entry efficiency."

    Feeding Diagnosis: If a specific player or role (e.g., the Tank or a Flanker) consistently suffers the First Death (FD), they are the primary point of failure for the team's macro structure. Even if this player finishes the map with "Gold Damage," their tendency to die first consistently puts the team in a 4v5 disadvantage, making victory statistically improbable.

    Entry Efficiency: For Dive compositions, the speed at which the team secures the First Kill (FK) is a critical metric of coordination. If a Winston/Tracer/Sombra dive takes longer than 10 seconds to secure a kill, the probability of the dive succeeding drops as enemy defensive cooldowns recharge.   

3.2 Ultimate Economy Efficiency

Ultimate economy is the resource management system of Overwatch. Unlike cooldowns which regenerate in seconds, ultimates regenerate over minutes and represent the "pacing" of the match. Scrim analysis tracks not just how many ults were used, but the efficiency of their exchange.

The Exchange Ratio A key metric is the Ultimate Exchange Ratio. A positive ratio implies the team used fewer ultimates than the opponent to win a fight.

    Example: If Team A uses a Graviton Surge (Zarya) and a Nano Boost (Ana) to wipe Team B, who uses Sound Barrier (Lucio), Coalescence (Moira), and Visor (Soldier: 76) in a losing effort, Team A has won the fight and generated a massive resource advantage for the next engagement.

    The "Ult Vomit" (Over-Ult): A common error in amateur teams is "Ult Vomit"—using 4 or 5 ultimates to win a fight that was already won after the first two eliminations. This is a "resource loss," even if it registers as a "fight win" on the scoreboard. It frequently leads to a loss in the subsequent fight due to a "resource drought".   

Ult Generation Rate Coaches also track the speed of ultimate generation, particularly for "Main Supports" (Lucio, Brigitte).

    Tempo Setting: In mirror matchups (e.g., Lucio vs. Lucio), the player who builds Sound Barrier first dictates the tempo of the next engagement. If Player A consistently builds Beat 15% slower than Player B, Team A is constantly forced to play reactively, ceding map control while waiting for their defensive ultimate to come online.   

3.3 Objective Efficiency and Map Control

Control of the objective is the literal win condition, but the in-game "Objective Time" stat is a misleading metric that often encourages bad positioning (e.g., three players sitting on the payload when they should be taking space forward). Instead, teams track efficiency metrics.

Cap Speed and Cleanup

    Cap Speed: This measures how quickly the team transitions from winning a fight to maximizing the payload movement or point capture. This involves "cleaning up" staggered enemies efficiently.

    Stagger Kills: Killing enemies long after a fight has ended is a strategic necessity. A "Stagger Kill" delays the enemy's next push by an additional 10-15 seconds. Coaches evaluate whether their team is recognizing stagger opportunities or letting low-health enemies escape to reset.   

Regroup Efficiency A critical KPI for amateur teams is Regroup Time—the time elapsed between a lost fight and the next full team engagement.

    The "Trickle" Effect: Amateur teams often "stagger," trickling in one by one and dying.

    The Metric: Coaches measure the theoretical minimum regroup time (Respawn Time + Travel Time) against the actual regroup time. A variance of >15 seconds indicates poor discipline and communication.   

Metric	Definition	Ideal State	Coaching Signal
FK Win %	Win rate after getting 1st kill.	> 75%	High execution; strong target focus.
FD Win %	Win rate after losing 1st player.	> 25%	Strong "clutch" ability; good stabilization.
Ult Exchange	Net ults used vs. opponent in wins.	Positive (+1/2)	Efficient economy; sustainable winning.
Regroup Time	Time between lost fight & next engage.	< 25s (map dependent)	High discipline; no staggering.
4. Compositional Analysis: The Strategic Layer

Data in Overwatch is context-dependent. A player's statistics must be normalized against the team composition they are playing. A "Dive" composition and a "Poke" composition have fundamentally different statistical profiles and win conditions.
4.1 The 11 Assets Framework

To analyze whether a composition is viable against an opponent, modern coaching utilizes a qualitative scoring system (often on a 0-5 scale) to analyze the functional assets of a team composition. This framework moves beyond hero names to the mechanics of interaction.  

The Core Assets:

    Explosivity: The capacity for burst damage to delete targets instantly (e.g., Widowmaker, Tracer bomb, Echo beam). Metric: Time-to-Kill (TTK).

    Verticality: The ability to contest and hold high ground (e.g., Winston, D.Va, Genji, Mercy). Metric: High Ground Control Time.

    Pressure: The capacity to break shields and push a frontline (e.g., Bastion, Junkrat, Hanzo). Metric: Barrier Damage/Sec.

    Sustain: The ability to survive prolonged engagements through health pools and healing (e.g., Reinhardt, Mei, Moira). Metric: Team Deaths/10 in prolonged fights.

    Control: The capacity to deny enemy movement via crowd control (e.g., Mei Wall, Sigma Rock, Orisa Javelin). Metric: Enemies displaced/stunned per fight.

    Range: Effective damage distance (e.g., Ashe, Widowmaker, Sigma). Metric: Damage efficiency at >30m.

    Mobility: Horizontal movement speed (e.g., Lucio Speed, Tracer Blink). Metric: Rotation speed.

    Peel: Capacity to protect vulnerable teammates (e.g., D.Va Matrix, Brigitte Pack). Metric: Support survivability.

    Tankiness: Raw damage absorption capacity (e.g., Roadhog, Mauga). Metric: Damage Taken/Death.

    Eruption: Burst healing capacity (e.g., Baptiste Regen Burst, Ana Nade). Metric: Saves per 10.

    Deterrence: Area denial (e.g., Wrecking Ball mines, Torbjorn Turret). Metric: Space denied.

Strategic Application: Consider a team playing a "Brawl" composition (High Sustain, Low Verticality, Low Range) on the map Watchpoint: Gibraltar, which features extreme verticality. If they face a "Poke" team (High Range, High Verticality), a loss is likely a compositional failure rather than a skill failure. Even if the Brawl players have high accuracy and healing stats, they cannot access the enemy. Coaches use this framework to identify when to swap strategies rather than simply telling players to "play better."
4.2 Win Rates by Composition Archetype

Sophisticated trackers (like OverStat or custom spreadsheets) allow coaches to tag scrim blocks by composition type.

    Data Point: "We have a 60% win rate playing Dive, but only 35% playing Poke."

    Actionable Decision: This directs the practice schedule. If a tournament is imminent, the team might abandon Poke entirely to focus on their strength (Dive). If the goal is long-term development, the coach dedicates specific scrim blocks to fixing Poke fundamentals, accepting short-term losses for long-term flexibility.

5. Individual Player Metrics: The Micro Analysis

Once the team-level context is established, coaches drill down into individual performance. The goal is to identify players who are "statistically efficient"—contributing to win conditions without draining team resources.
5.1 The Universal Metric: Deaths Per 10 Minutes

Across all roles and skill tiers, Deaths per 10 Minutes (D/10) is the strongest individual correlate with win rate.

    The Logic: You cannot deal damage, heal, or capture objectives while waiting to respawn. Furthermore, every death provides ultimate charge to the enemy.

    Benchmarks:

        < 5.0: Excellent. The player is highly survivable and creates constant pressure.

        5.0 - 6.0: Good. Standard for aggressive play.

        6.0 - 7.5: Average/Mediocre.

        > 8.0: Poor. Indicates "feeding," poor positioning, or a lack of peel.   

    Contextual Exceptions: A Tank may have slightly higher deaths if they are consistently trading their life for a team wipe (a "good death"), but generally, staying alive is the prerequisite for all other value.

5.2 Role-Specific Metrics
5.2.1 Tank Metrics: Quantifying Space

Tanks are the hardest role to quantify because their primary job—Space Creation—does not appear on the scoreboard. "Space" is defined as the area of the map the team can occupy safely.

    Proxy Metrics for Space:

        Damage Mitigated vs. Damage Taken: A high "Mitigated" (shields/matrix) count is good. A high "Taken" (face-tanking) count is bad because it feeds enemy ults. A high ratio of Mitigated-to-Taken suggests efficient space holding.   

Engagement Success Rate: The percentage of teamfights won when the Tank initiates. This measures the timing and quality of the engage (e.g., Winston jumping in when his team is ready vs. jumping in alone).

Positioning Data: Advanced tools (like Winston's Lab or IBM Watson analysis) track "Average Kill Position" and "Average Death Position." A tank dying deep in enemy territory without trade kills is "over-extending." A tank dying on the objective is "holding".  

5.2.2 DPS Metrics: Lethality and Precision

For Damage players, volume is secondary to lethality.

    Final Blows (FB) vs. Eliminations (E): An "Elimination" is credited for doing any damage to a target that dies. A "Final Blow" is the killing shot. A high FB/E ratio indicates the player is securing kills, confirming value. A low FB/E ratio (e.g., high elims, low final blows) suggests the player is spamming but not finishing targets.   

    First Blood %: The percentage of teamfights where the player secures the opening kill. This is the single highest "carry" stat in the game for a DPS player.

    Solo Kills: Indicates the ability to win duels (1v1s) without resource investment from teammates.

5.2.3 Support Metrics: Utility and Survivability

Support analysis has shifted furthest from "Healing Done." The modern philosophy is that "Utility is King".  

    Assists (Defensive vs. Offensive):

        Defensive Assists: Indicates saving teammates (e.g., Immortality Field, Lifeweaver Pull).

        Offensive Assists: Indicates enabling kills (e.g., Mercy damage boost, Lucio speed boost, Zenyatta Discord). A high ratio of Offensive Assists correlates with aggressive, winning teams.

    Utility Effectiveness:

        Ana: Sleep Darts landed / Anti-Nades hitting multiple targets.

        Baptiste: Window amplification damage.

        Zenyatta: Discord Orb uptime on focus targets.

    Survivability (The "Mercy Rule"): Support deaths are weighted more heavily than other roles because their death usually signals the end of the team's sustain. A support dying first is often a guaranteed lost fight.   

6. Map-Specific Performance and Evaluation

Overwatch is defined by its maps. A player's performance must be contextualized by the terrain.
6.1 Map Type Analytics

Teams track win rates across the five game modes: Control, Hybrid, Escort, Push, and Flashpoint.

    Symmetry Variance:

        Control/Flashpoint: Symmetrical maps. Win rates here reflect pure mechanical skill and teamfight coordination.

        Escort/Hybrid: Asymmetrical (Attack/Defend). Win rates here involve strategy, "setup" positioning, and ult economy management over long durations.

    Analysis Example: A team struggling on Attack (Escort/Hybrid) but winning Control maps often lacks coordination and planning (required to break entrenched defenses) but possesses strong brawl mechanics (fighting on point).   

6.2 The "Attacker's Advantage" Analysis

Statistical analysis of historical OWL data suggests that the order of attack (attacking first vs. second) does not inherently determine the winner (win rates are near 50/50). However, knowing the "Time Bank" math is critical.  

    Metric: Time per Point: On Hybrid/Escort, completing the map with > 1:00 time bank is a strong indicator of offensive efficiency.

    Hold Locations: Data visualizes where teamfights occur. "Are we losing Streets phase on King's Row because we take the fight too early at the archway instead of holding the corner?"

    Geography Win Rate: Identifying "cursed" map sections where the team consistently loses fights allows for targeted strategy adjustments. For example, "We lose 80% of fights on Dorado Second Point High Ground; we need to change our rotation to clear top first".   

7. Actionable Metrics: Amateur vs. Professional Approaches

The analytical capacity of a team changes drastically as they move from the Open Division (Amateur) to Contenders/OWCS (Professional). The definition of "actionable" shifts from fundamental error reduction to micro-optimization.
7.1 Amateur/Semi-Pro (Tier 3/Collegiate) Focus

Goal: Fundamentals, Error Reduction, Cohesion. At this level, complex data often distracts players. Coaches focus on qualitative metrics supported by simple quantitative data.

Most Actionable Metrics:

    Deaths per 10: The easiest way to fix "feeding." If a player is > 7, this is the primary focus.

    Regroup Time: Measuring the seconds wasted between fights. Lowering this from 30s to 15s can grant an extra 1-2 fights per map, which effectively gives the team "free" chances to win.

    Ult Economy (Basic): "Did we use 4 ults to win a fight we could have won with 2?" (Yes/No binary check).

    Fight Win %: "Did we win more fights than we lost?"

    Target Focus: A qualitative check during VOD review. "Did we all shoot the same target?"

Tools:

    Google Spreadsheets: Manual entry of Map W/L, Comp used, and basic notes.   

Scrimmie (Workshop Code): Standardizes competitive rules and provides a basic scoreboard for verification.  

VOD Review: Manual qualitative analysis using simple drawing tools (Epic Pen).  

7.2 Professional (OWL/OWCS) Focus

Goal: Optimization, Efficiency, Predictive Modeling. Professional teams use automated data pipelines (parsing log files) to find marginal gains.

Most Actionable Metrics:

    Win Probability Modeling (oWE): "Given our comp vs. their comp on this map point, what is our expected win rate?".   

Damage Efficiency: "Damage per Ult Charge point."

Cooldown Exchange Rates: "For every Ana Nade used, how often do we force a Kiriko Suzu?"

Player Impact Rating (PIR/IBM Watson): Weighted algorithms that combine 360+ metrics (e.g., healing per second, weapon accuracy, ult generation rate) to rank player performance objectively. IBM Watson’s machine learning identified ~30 specific stats that most heavily influence win probability.  

Tools:

    LogTime: A workshop tool that generates CSV files of every event in the game (kills, damage, cooldowns), which can be parsed for deep analysis.   

Custom Python Scripts: To parse logs into visualizations (e.g., heatmaps of death locations).

Tableau/PowerBI: Dashboards for visualizing season-long trends.  

8. Collegiate Scouting and Recruitment Metrics

In the collegiate ecosystem, recruitment is a dual-variable equation. Unlike professional teams that optimize solely for skill, collegiate scouts optimize for eligibility and skill.

The Scholar-Gamer Model

    Skill Benchmark: Scouts look for SR/Rank consistency (e.g., consistently GM1/Champion) rather than peak SR. They analyze "Hero Pool Depth" to ensure a player isn't a "one-trick" who will be banned out in a tournament draft.

    Academic Metric: GPA is a hard constraint. A player with 4.6k SR but a 1.5 GPA is a liability because they may become academically ineligible mid-season. Scholarships are awarded based on a matrix of Gaming Ability + Academic Stability.   

Behavioral Metrics: "Tilt Factor." Scouts review VODs not just for aim, but to see how a player reacts to losing a round. Do they communicate? do they go silent? Collegiate teams live in dorms together; toxic players destroy team culture faster than bad players.  

9. Tools of the Trade: Implementing the Framework

To make these statistics useful, they must be integrated into a consistent coaching workflow.
9.1 The Scrim Block Routine

    Pre-Scrim (Preparation):

        Set specific SMART Goals (e.g., "Today we focus on reducing deaths on Push maps to < 5").

        Review "Leading Indicators" (e.g., warm-up routine, communication checks).   

In-Scrim (Data Collection):

    Use Workshop Codes (e.g., 91X3S for Collegiate presets or Scrimmie) to ensure standard competitive rules and generate logs.

    Coach/Manager tracks Map W/L and Comp used in a live spreadsheet.

Post-Scrim (Review):

    The VOD Review: The primary tool. Coaches do not review every minute. They look for the "Cornerstones": Regroup, Poke, Fight, Cleanup.   

        Data Validation: Use the stats to confirm the "eye test." (e.g., "It felt like we got no kills." -> Data confirms DPS Final Blows were low -> VOD shows Tank was not creating space for DPS).

9.2 The Report Card

A weekly player report card should not just list stats. It should benchmark them against peers (Rank/Tier average) and the player's own history.

    Quantitative: "Your deaths/10 dropped from 6.5 to 5.8 this week. Great job."

    Qualitative: "Your target focus improved, but your communication during Regroup phases is still too quiet."

10. The Human Element: Soft Skills Quantification

Finally, advanced coaching attempts to quantify the "soft skills" that data misses.

    Communication Density: Recording scrim audio and analyzing "Callouts per Minute."

        Quality check: Are the calls "Informational" ("Reaper behind"), "Actionable" ("Focus Reaper"), or "Clutter" ("I'm dead, this game sucks")?

    Tilt/Mental State: Tracking performance degradation after a loss. Does a player's accuracy or APM (Actions Per Minute) drop in the map following a loss? This identifies players who need psychological support or "mental reset" protocols.   

11. Conclusion

The "Scoreboard" is a lie. Or at least, it is a partial truth, obscured by the noise of a chaotic, high-speed game. For the competitive Overwatch coach and player, the path to improvement lies in looking beyond the Gold Medals. It requires a disciplined focus on the Teamfight as the core unit of the game, a ruthless dedication to Minimizing Deaths, and a nuanced understanding of how Composition and Map dictate the statistical profile of a "good" performance.

By adopting this structured, team-first analytical framework—moving from the "what" of volume stats to the "why" of context stats—teams can transform raw noise into the clear signal of victory. Whether in a Tier 3 discord scrim or on the OWCS main stage, the team that controls the data controls the map.

Report compiled for: Competitive Overwatch Coaching Staff & Performance Analysts Domain: Esports Performance Analytics Date: February 2026 Subject: Scrim Evaluation Frameworks and Metrics Analysis