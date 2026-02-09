## Question
 
 How do competitive Overwatch teams and coaches review scrims? What is the typical workflow after a scrim session — what do they look at first, what tools do they use (spreadsheets, VOD review,
 ScrimTime, manual notes), and what are the most common pain points in their review process? Look for discussions on r/OverwatchUniversity, r/Competitiveoverwatch, and coaching-focused Discord
 communities.

## Answer

Operationalizing Performance: A Comprehensive Analysis of Competitive Overwatch Scrimmage Review Workflows
1. Introduction: The Analytical Turn in Competitive Esports

In the high-stakes ecosystem of competitive Overwatch, the "scrim" (scrimmage) serves as the fundamental atomic unit of practice. However, the mere accumulation of gameplay hours is increasingly recognized as insufficient for development at the collegiate, semi-professional (Tier 3/Tier 2), and professional levels. The differentiator between amateur collectives and elite organizations lies not in the volume of play, but in the rigor, structure, and technological sophistication of the post-match analysis. This report provides an exhaustive examination of the workflows employed by competitive teams to transmute raw gameplay data into actionable strategic intelligence.

The transition from Overwatch 1 to Overwatch 2—specifically the shift from 6v6 to 5v5—has necessitated a paradigm shift in how teams review performance. The reduction in player count has amplified the impact of individual mistakes, making the "First Death" metric a critical key performance indicator (KPI). Consequently, the review process has evolved from a casual "post-game chat" into a disciplined, data-driven operation utilizing bespoke Workshop codes, external visualization platforms, and rigorous pedagogical frameworks.

This analysis dissects the entire lifecycle of the review process: from the pre-scrim logistical setup that ensures clean data capture, to the real-time observation techniques employed by coaches, and finally, the deep-dive VOD (Video on Demand) analysis and longitudinal statistical tracking. It also addresses the significant friction points that remain, particularly the technical volatility of replay data and the psychological challenge of managing player ego during critical feedback sessions.
2. The Pre-Scrim Phase: Establishing the Analytical Architecture

The review process begins long before the lobby is created. Effective analysis is predicated on the establishment of a controlled environment where variables can be isolated and tested. In the chaotic landscape of the Overwatch ladder, variables are uncontrolled; in a scrim, they are managed through strict logistical protocols.
2.1 The Logistics of the "LFS" and Opponent Vetting

The validity of data generated during a scrim is directly correlated with the quality of the opposition. If a team consistently plays against significantly weaker opponents, the resulting data—high win rates, high elimination counts, low deaths—is "noisy" and leads to false confidence. Conversely, playing against vastly superior teams can result in "spawn camping" scenarios that provide no usable data on macro-rotations or mid-fight strategy.  

Teams utilize a decentralized marketplace to arrange these matches, primarily hosted on Discord servers such as The O.W. (formerly the Open Division Discord), Elo Hell Esports, and Scrim Central. The "Looking For Scrim" (LFS) protocol involves posting standardized requests that detail the team’s region, platform (PC/Console), and, crucially, their average Skill Rating (SR) or Rank.  

    SR Verification: Managers often use tools like the Overwatch Team Tracker spreadsheet to log the performance of opposing teams. If an opponent advertised as "3.8k SR" (Masters/GM) plays at a "2.5k SR" (Platinum) level, they are noted in the tracker to avoid future scheduling. This vetting ensures that the "test data" for the evening's practice block is valid.   

The "Ringer" Economy: A significant pre-scrim logistical hurdle is roster stability. The sudden absence of a main support or tank can derail a scheduled block. Teams maintain a network of "ringers" (substitutes), often managed through specific Discord roles. The integration of a ringer introduces a new variable: the review must now account for a player who may not know the team's callouts or macro-strategy, requiring the coach to filter out errors caused by lack of synergy rather than structural failure.  

2.2 The "Seita" Standard: Automating the Laboratory

Once a match is arranged, the technical foundation of the session is almost universally built upon the Seita Scrim Code (or its derivatives like ScrimTime). The base Overwatch custom game settings are insufficient for competitive practice due to the inability to easily swap sides, pause for technical issues, or track granular statistics.

The Seita code (often accessed via codes like 5WNDF or similar variations depending on the patch) transforms the lobby into a managed competitive environment.

    Lobby Automation: The code allows teams to "Ready Up" using in-game interact keys (e.g., F + Crouch), minimizing downtime between maps. This efficiency is critical; a "scrim block" is typically two hours, and wasting 15 minutes on lobby management reduces the sample size of maps available for review.   

Rule Enforcement: The code automatically applies current competitive rulesets, such as completion criteria for Escort maps. In standard play, if Team A pushes the cart to the end, the round ends. In competitive play, both teams must attack. The Seita code manages this logic, ensuring that the "data" includes both attack and defense runs for every map.  

2.3 Setting the Hypothesis: Pre-Scrim Goal Setting

High-level coaching methodology, advocated by figures like Spilo and ioStux, treats each scrim block as a hypothesis-testing session rather than a tournament simulation. A team does not scrim to "win" the scrim; they scrim to validate a strategy.

    Macro-Goals: A coach might set a goal to "Minimize Ultimate Usage in Won Fights." The hypothesis is that the team is "over-ulting" (spending 3-4 ultimates to win a fight that could be won with 1-2). The review focus for that night will then be exclusively on the "Ult Economy" column of the tracker, ignoring other mistakes.   

Micro-Goals: Individual players may be tasked with specific technical foci, such as an Ana player focusing on "Anti-Nade" timing relative to the enemy tank's defensive cooldowns. This pre-set goal provides the lens through which the VOD will later be judged.  

3. Real-Time Data Capture: The Coach as Observer

During the execution of the scrim, the coach’s role shifts from instructor to silent observer. The primary objective during the match is to capture "terminal feedback"—observations that will be delivered after the action has concluded—rather than interrupting the flow of play with "concurrent feedback."
3.1 Spectator Mechanics and Discipline

The coach occupies the "Spectator" slot in the custom game lobby. To effectively capture data, the coach must master the Overwatch Spectator Client, which offers tools unavailable to players.

    Perspective Management: Coaches utilize the function keys (F1-F12) to cycle between player POVs to check for individual decision-making, but primarily rely on the Map Overlay (Ctrl+L) and Third-Person/Free Cam. The overhead view is essential for observing macro-positioning—the "negative space" between the two teams—which is often invisible to players focused on their first-person crosshairs.   

The "Muted Mic" Protocol: A critical best practice is the "muted coach." Interjecting during rounds (e.g., "Genji behind you!") creates a "crutch," where players rely on the coach's awareness rather than developing their own. The coach’s silence allows the team’s internal communication structure—the In-Game Leader (IGL) and target callers—to be tested under pressure. Breaks in communication are noted as data points for the review.  

3.2 Note-Taking Taxonomy and Timestamping

Since replay codes and video files are linear, locating a specific team fight within a two-hour block can be time-consuming without markers. Coaches employ a rigorous system of live timestamping.

    Live Logging: Coaches record the match time (e.g., "Map 2, 4:30") alongside a shorthand code for the event. This allows them to instantly navigate to the relevant moment during the post-game review.

    Shorthand Codes: While notation varies, a standardized taxonomy helps in categorizing errors. Common shorthand observed in coaching discussions includes:

        "Ult Econ" / "UE": Mismanagement of ultimate economy (e.g., using Sound Barrier when the fight was already lost).

        "Stagger": Late deaths preventing a team reset.

        "Pos": Poor positioning relative to cover or team support.

        "Target": Incorrect target prioritization (e.g., shooting the tank instead of a vulnerable support).   

3.3 The "ScrimTime" Log Generator

For quantitative data, teams rely on the ScrimTime Workshop mod to automate data capture. The game does not natively export match statistics to a usable file format. ScrimTime utilizes the Workshop Inspector to generate a "Log"—a massive string of text containing every event in the match (damage dealt, healing received, cooldowns used).

    Data Fields: The log captures granular data such as "Hero Damage Dealt," "Final Blows," "Deaths," "Healing Dealt," and "Ultimates Used."

    Extraction: At the end of a match, the coach or manager must open the Workshop Inspector, copy the log string, and paste it into an external parser (such as Parsertime or a custom spreadsheet). This manual "air gap" is a minor friction point but is necessary to bridge the closed ecosystem of the game with open analysis tools.   

4. The Immediate Post-Scrim Workflow

The moments immediately following the conclusion of a scrim block are critical for both emotional regulation and data preservation. This phase is characterized by a race against technical volatility and human psychology.
4.1 The "Cool Down" and Emotional Regulation

The immediate post-scrim meeting is a high-risk environment. Adrenaline is high, and players may be defensive about mistakes or frustrated by losses.

    The "One Minute" Rule: Effective coaches often limit the immediate summary to under one minute. This prevents the team from getting bogged down in arguments about specific plays when they lack the objective evidence of the replay. "We struggled with rotations on defense; we will review the tape tomorrow."

    Decompression: Coaches often mandate a short break away from the PC to reset mental states before any analysis begins. This "emotional reset" is vital to ensure that the subsequent feedback is received with a growth mindset rather than defensiveness.   

4.2 Data Preservation: The "Replay Code" Anxiety

A unique and significant pain point in the Overwatch review workflow is the volatility of Replay Codes. Overwatch 2 utilizes a deterministic engine to generate replays, meaning the game stores the inputs of players and re-simulates the match.

    The Patch Wipe: When Blizzard releases a patch or hotfix, the game's underlying logic changes (e.g., a hero's damage value changes). This renders all previous replay codes invalid, as the simulation would desynchronize. If a team scrims on Tuesday and a patch drops on Wednesday, all replay codes from the previous night are irretrievably lost.

    Archival Strategies: To mitigate this, disciplined teams immediately record essential POVs or the overhead map view to video files (MP4) using software like OBS (Open Broadcaster Software). These video files are then uploaded to private YouTube channels or Google Drive folders. This converts "soft," volatile data into "hard," persistent video, ensuring the institutional knowledge survives the patch cycle.   

5. Analytical Tooling: The Digital Stack

The modern review workflow is supported by a stack of tools that range from simple spreadsheets to complex data visualization platforms.
5.1 The Spreadsheet Backbone

Despite the availability of apps, Google Sheets remains the flexible backbone of team management. Templates created by community members (such as ExplodingCashew) are widely adopted and modified.
5.1.1 Structural Components of the Tracker

A competitive team tracker is typically a multi-tabbed document acting as the team's central database.

    Roster Grid: Tracks player availability for upcoming weeks, ensuring 5 players are confirmed for every block.

    Scrim Log: A historical record of every map played. Columns typically include:

        Date & Time

        Opponent Name & SR

        Map Name

        Result (W/L/Draw)

        Team Composition (e.g., "Winston Dive", "Rein Brawl")

        Replay Code

    Win Rate Analysis: Formulas calculate win rates by Map Type (Control, Push, Escort) and by Composition. This reveals trends, such as "We have a 60% win rate on King's Row but only 20% on Esperanza," guiding future map picks in tournaments.   

5.2 Parsertime and Visualization

Parsertime represents the visualization layer of the stack. It ingests the raw text logs from ScrimTime and renders them into comprehensible dashboards.

    Utility: It allows coaches to move beyond "feeling" to "knowing." Instead of feeling like the team is dying too early, Parsertime provides a "First Death %" metric. Instead of feeling like an ultimate is ineffective, it shows the "Team Fight Win Rate" when that ultimate is used.

    Visuals: Heatmaps show where deaths occur on the map, helping to identify dangerous choke points or poorly managed sightlines. This visual data is often more convincing to players than verbal critique.   

5.3 Insights.gg and Asynchronous Review

For teams that cannot align schedules for live reviews (common in collegiate and amateur settings), Insights.gg serves as a collaborative video analysis platform.

    Workflow: The coach uploads the MP4 of the scrim. They then watch the video and place timestamped comments and drawings directly on the timeline.

    Player Engagement: Players can log in at their convenience, watch the specific clips where they were tagged, and reply to the coach's notes. This asynchronous workflow respects the players' time while ensuring that feedback is delivered and acknowledged.   

Table 1: Comparative Analysis of Review Tools
Tool	Primary Function	Data Type	Key Feature	Pain Point
Replay Viewer	Visual Analysis	Simulation	Free Cam, POV Switching	Data lost on patch; no stats
ScrimTime	Data Logging	Text Log	Granular Event Tracking	Requires manual export/parsing
Parsertime	Visualization	Dashboard	Win Rate/Fight Analysis	Dependent on ScrimTime logs
Google Sheets	Management	Database	Roster & Map Tracking	Manual data entry (heavy)
Insights.gg	Async Review	Video	Timeline Annotation	Upload times for large video files
Epic Pen	Live Annotation	Overlay	Drawing on Screen	None (simple overlay tool)
6. The VOD Review Session: Pedagogy and Practice

The VOD review is the central pillar of competitive improvement. It is the forum where the subjective experience of the player is reconciled with the objective reality of the game state.
6.1 The Socratic Method: From Lecture to Dialogue

High-level coaching has moved away from didactic "lecturing" toward a Socratic approach. This pedagogical shift is driven by the understanding that Overwatch is a game of decision-making, not just execution.

    The Technique: Instead of stating, "You were out of position here," the coach pauses the replay and asks, "What was your intention with this position?" or "Where did you think the enemy Widowmaker was?"

    The Outcome: This forces the player to articulate their cognitive process. It reveals whether the error was a mechanical failure (execution) or a cognitive failure (lack of awareness). If the player answers, "I didn't know the Widow was there," the coach knows the issue is scouting. If they say, "I thought I could duel her," the issue is risk assessment.   

6.2 Macro vs. Micro: The Hierarchy of Analysis

A common pitfall in lower-tier reviews is an obsession with "Micro" (aim and mechanics). Professional workflows prioritize "Macro" (strategy and resources).
6.2.1 Macro-Analysis: The Invisible Game

Macro-reviews focus on team-wide concepts.

    Ultimate Economy: Analyzing the "trade" of ultimates. A team might win a fight but use 4 ultimates while the enemy used 0. This is a "pyrrhic victory" that sets up a loss in the next fight. The review highlights this negative trade-off.

    Space and Rotations: Using the overhead map view to show how the team moved as a unit. Did the Tank take space that the DPS failed to occupy? Did the Supports rotate early enough to avoid the enemy dive?.   

6.2.2 The "First Death" Principle

A standard analytical technique in the 5v5 era is the "First Death" Analysis.

    The Method: The team pauses the replay at the exact moment the 5v5 becomes a 4v5.

    The Backward Trace: The coach rewinds 15 seconds to identify the root cause. Was it a positioning error? A lack of peel? A resource mismanagement?

    Relevance: In 5v5, the first death is statistically highly correlated with losing the team fight. Diagnosing the cause of the first death is often the highest-value activity in a review session.   

6.3 Technical Setup for Live Reviews

For live reviews, the coach typically streams the Replay Viewer via Discord.

    Quality: Coaches often require Discord Nitro to stream at 1080p/60fps, ensuring that fast-moving projectiles and text are legible to the team.

    Annotation: Tools like Epic Pen allow the coach to draw directly over the game client. They draw "lines of sight," circle overextended players, or sketch out ideal rotation paths on the screen. This visual aid is critical for players who are visual learners.   

7. Psychology and "Soft Skills" in Review

The review process is not just a technical exercise; it is a social one. Managing the egos and emotions of a team is a primary challenge for coaches.
7.1 Managing "Tilt" and Ego

"Tilt" (emotional destabilization) is the enemy of analysis. A tilted player cannot absorb information.

    Objective Arbitration: When disputes arise (e.g., "I died because I got no healing!"), the coach uses the Replay Viewer as a neutral arbitrator. By switching to the Support's POV, the coach can show that the Support was actually being attacked by a Genji and could not heal. This resolves the conflict with objective fact rather than subjective feeling.

    Separating Identity from Performance: Coaches emphasize that the critique is of the play, not the player. This psychological safety allows players to admit mistakes without fear of being ostracized.   

7.2 The "Sandwich" Method of Feedback

To maintain morale, coaches often employ the "Sandwich" method:

    Positive Reinforcement: Highlight a play where the player executed the strategy correctly. "Great rotation here, you cleared the high ground perfectly."

    Constructive Critique: Address the error. "However, you dropped too early and got isolated."

    Positive Action Item: End with a solution. "Next time, wait for the Tank to call the engage before dropping.".   

8. Pain Points and Friction in the Workflow

Despite the sophisticated tools, the workflow is fraught with friction that teams must constantly navigate.
8.1 The Volatility of Data

As previously discussed, the loss of replay codes due to patches is a constant frustration. It forces a "just-in-time" analysis model that can lead to burnout, as coaches feel pressured to review every scrim immediately rather than spacing them out.  

8.2 The "Console Gap"

Teams playing on console (PlayStation/Xbox) face significant disadvantages in the review workflow.

    No Log Export: The Workshop Inspector text cannot be easily copied from a console to a PC parser. This locks console teams out of advanced analytics tools like Parsertime unless they manually transcribe data.

    Tool Incompatibility: Overlay tools like Epic Pen do not work on console streams unless the stream is captured via a PC capture card.   

8.3 Analysis Paralysis

The availability of granular data (damage per 10, healing per 10) can lead to "Analysis Paralysis" or "Stat Farming." Players may focus on padding their stats (e.g., shooting a Roadhog to get high damage numbers) rather than making winning plays (e.g., killing a low-HP support). Coaches must constantly contextualize data to prevent players from optimizing for the wrong metrics.  

9. Conclusion: The Professionalization of Play

The workflow of reviewing competitive Overwatch scrims has matured from casual post-game chats into a semi-professional discipline powered by data analytics and educational psychology. The modern competitive team operates as a data-processing unit: capturing logs via ScrimTime, visualizing trends via Parsertime, managing logistics via Google Sheets, and refining strategy via Socratic VOD Review.

While tools like the Replay Viewer and Seita Scrim Code provide the means to analyze, the value is derived from the human element: the coach’s ability to foster a culture of accountability, the team's discipline in data preservation, and the collective willingness to prioritize macro-strategic growth over micro-mechanical ego. As the game continues to evolve with 5v5 dynamics and new game modes like Flashpoint, the teams that best streamline this friction-filled process—turning raw replays into refined strategy—will hold the competitive edge.
10. Detailed Tables & Metrics
Table 2: The Scrim "Cycle" Checklist and Owner
Phase	Action Item	Owner	Tool/Platform
Pre-Scrim	Confirm Roster (5 Players + Sub) & Vet Opponent SR	Manager	Discord / Google Sheets
Pre-Scrim	Set Scrim Goal (e.g., "Ult Usage")	Coach	Voice Chat
Lobby	Load Seita Code & Map Pool	Captain	Overwatch Client
In-Game	Record Timestamps & Live Notes	Coach	Notepad / Tablet
Post-Game	60-Second Debrief (Emotional Reset)	Coach	Voice Chat
Post-Game	Save Replay Codes & Export Logs (Pre-Patch)	Manager	Overwatch / Notepad
Review	VOD Analysis (Next Day / Async)	Team	Discord Screen Share
Table 3: Key Metrics for Analysis in 5v5
Metric	Definition	Strategic Implication in 5v5
First Death %	Frequency of being the first to die in a team fight.	Critical: In 5v5, losing a player (especially Tank) drops win probability significantly (>70% loss rate).
First Pick %	Frequency of securing the opening kill.	High Value: Indicates effective aggression and target prioritization.
Ult Charge Rate	Time required to build ultimate.	Economy: Slower charge indicates low engagement uptime or poor mechanics.
Team Fight Win Rate	Percentage of team fights won.	Macro: If high, strategy is working. If low, examine macro-positioning and resource trading.
Deaths per 10	Average deaths per 10 minutes.	Survival: High deaths (>6.0) usually indicate "feeding" or poor positioning relative to supports.
