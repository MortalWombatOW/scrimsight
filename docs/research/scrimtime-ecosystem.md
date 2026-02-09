## Question

What is the ScrimTime tool for Overwatch, how widely is it used in the amateur/semi-pro competitive community, and what do users say about the data it provides? What limitations or gaps do ScrimTime
 users report — what data do they wish they could get from it that they can't? Are there other scrim tracking tools in the Overwatch ecosystem?

## Answer

The Analytical Engine of Competitive Overwatch: A Comprehensive Study of ScrimTime, Parsertime, and the Tier 2/3 Ecosystem
1. Introduction: The Data Vacuum in Post-League Overwatch

The transition from the centralized, franchise-based Overwatch League (OWL) to the open-circuit Overwatch Champions Series (OWCS) in 2024 precipitated a fundamental shift in the competitive infrastructure of the game. In the franchise era, teams were supported by proprietary data pipelines, salaried analysts, and direct API access provided by Blizzard Entertainment to a select few. The democratization of the scene, while opening doors for amateur and semi-professional talent, created a significant technological vacuum. Teams competing in the burgeoning collegiate circuit, the FaceIt-administered OWCS, and the amateur "Tier 3" ecosystem found themselves without the high-fidelity telemetry required to compete at a professional standard.

Into this void stepped the community development ecosystem. The standard for competitive practice—the "scrimmage" or "scrim"—evolved from a simple custom game lobby into a sophisticated data-generation event. At the heart of this evolution lies ScrimTime, a Workshop-based modification that has become the de facto operating system for organized Overwatch play.

This report provides an exhaustive analysis of the ScrimTime tool, its technical architecture, and the ecosystem of visualization platforms (such as Parsertime and Datastrike) that have been built upon its data outputs. Through a detailed examination of user feedback, technical documentation, and community discourse, this study illuminates how a volunteer-driven suite of tools has standardized the analytics of a global esport, while also highlighting the critical data gaps and technical fragilities that continue to plague the amateur analyst.
2. The Operational Standard: ScrimTime and the Workshop Revolution
2.1 The Evolution of Lobby Management

To understand the dominance of ScrimTime, one must first understand the logistical friction of high-level Overwatch 2 practice. The default "Custom Game" settings provided by the base game client are insufficient for the rigorous demands of tournament preparation. Competitive teams require specific rule sets that mirror tournament regulations, including forced role locks (2-2-1), pause functionality, map completion protocols (ensuring both teams attack and defend regardless of the score), and intricate lobby management tools.

Historically, the "Seita Scrim Lobby," developed by the coach Seita, served as the industry standard during the Overwatch 1 era. It introduced the concept of a standardized preset that could be loaded via a simple Workshop code, reducing the administrative burden on coaches. However, as the capabilities of the Overwatch Workshop expanded, so did the demands of the user base.  

ScrimTime, developed by the user Caldoran, emerged as the successor to the Seita lobby, expanding its functionality from simple game management to complex data generation. Accessible via the import code DKEEH, ScrimTime is described by its creator and users as the "ultimate tool" for competitive teams, designed explicitly to streamline the scrimming process and improve player performance through statistical analysis.  

2.2 Core Functionality and User Experience

ScrimTime provides a suite of features that address the specific pain points of scrim management. These features are not merely quality-of-life improvements; they are essential operational requirements for teams playing 4-6 hours of practice blocks daily.

    Ready-Up Systems: ScrimTime replaces the default "Start Game" mechanic with a "Ready" system, requiring players to toggle their status (often via Interact + Crouch). This prevents matches from starting prematurely while players are AFK or adjusting settings.   

Defender Teleport: To maximize practice efficiency, ScrimTime includes a "Defender Teleport" feature. During the setup phase of maps like Hybrid or Escort, defending players can teleport directly to their defensive positions rather than walking from spawn. Over the course of a two-hour scrim block, this saves minutes of downtime, allowing for more actual gameplay.  

Force Map Completion: In a standard competitive match, the game ends immediately once a victory condition is met. In a scrim, teams need to play out the full duration of the map to practice all scenarios (e.g., holding third point even if the offense technically won at second point). ScrimTime automates the logic required to keep the lobby active until the map is fully played.  

Spectator Scoreboard: A critical feature for coaches and managers is the "Spectator Scoreboard." The default Overwatch scoreboard is often opaque to spectators or lacks real-time granularity. ScrimTime overlays a custom UI for spectators, providing real-time player statistics and a thoughtfully designed layout that mirrors broadcast standards.  

2.3 Scrimmie!: The Professional Fork

The open nature of the Overwatch Workshop allows for "forking"—where one developer modifies another's code to suit specific needs. Scrimmie!, developed by CBF (Code: Y2TXE for standard, A8XVJ for Professional), represents the most significant evolution of the ScrimTime codebase.  

Scrimmie! is explicitly marketed as a "stress-free" version of the tool, optimized for the Overwatch Champions Series (OWCS) rule set. It retains the core logging logic of ScrimTime (often crediting Caldoran directly) but wraps it in a user interface designed for international accessibility.  

    Multi-Language Support: A key differentiator for Scrimmie! is its robust localization. The tool supports English, Spanish, Korean, French, Japanese, and Chinese, allowing international rosters (common in EMEA and APAC regions) to interact with the tool in their native language.   

Role in the Ecosystem: While ScrimTime is the "engine" (providing the LogTime data structure), Scrimmie! is often the "chassis" preferred by tournament organizers and teams who prioritize ease of use and localization. The collaboration between CBF and Caldoran is a defining characteristic of this ecosystem, with both developers coordinating on bug fixes and feature parity.  

3. The Data Pipeline: Technical Architecture and "LogTime"

The true value proposition of ScrimTime lies not in its lobby management, but in its ability to generate data. In an environment where Blizzard provides no public API for live match telemetry, ScrimTime essentially "hacks" the Workshop's debugging tools to create a data pipeline.
3.1 The Workshop Inspector Mechanism

The Overwatch Workshop includes a feature called the "Workshop Inspector," designed to help script creators debug their modes by logging variable values to a text file. ScrimTime repurposes this feature for analytics.

    Event Scripting: The ScrimTime code contains rules that listen for specific game events (e.g., Player Dealt Final Blow, Ultimate Ability Activated, Payload Checkpoint Reached).

    String Formatting: When an event is detected, the script constructs a formatted string containing the timestamp, the actor (player), the action, and relevant values.

    Log Dump: This string is pushed to the Inspector Log.

    Local Storage: If the user has enabled "Enable Workshop Inspector Log File" in their gameplay settings, these strings are saved to a .txt or .csv file in the user's local documents folder (Documents/Overwatch/Workshop).   

This mechanism allows ScrimTime to export thousands of data points per match, creating a high-resolution "black box" recording of the game state that far exceeds the summary statistics available in the game client.
3.2 The LogTime Schema

Caldoran formalized this data output into a standalone module called LogTime (Import Code: F6WTA), which is integrated into ScrimTime and Scrimmie!. The standardization of this schema was a watershed moment for the community, as it allowed third-party developers to build visualization tools (Parsers) that could reliably interpret data from any scrim lobby using the code.  

Table 1: The LogTime Data Schema (Typical Fields)
Event Category	Data Points Logged	Contextual Value
Eliminations	Timestamp, Killer, Victim, Ability Used, Damage Type	Allows for "First Death" analysis and kill feed reconstruction.
Resurrections	Timestamp, Mercy Player, Target Player	Critical for tracking "Undos" in the fight economy.
Ultimates	Charge %, Activation Time, End Time	Enables "Ult Economy" analysis (e.g., did we invest 3 ults to win a dry fight?).
Objectives	Payload Progress (Meters), Control Point %	Correlates fight wins with actual map progress.
Hero Swaps	Timestamp, Player, Old Hero, New Hero	Tracks team composition fluidity and counter-picking efficiency.
Aggregate Stats	Total Dmg, Healing, Mitigation (End of Round)	Provides the "Box Score" summary.
3.3 The Server Load Limitation: A Critical Trade-Off

The reliability of this data pipeline is heavily constrained by the technical limits of the Overwatch server instances. The Workshop places strict limits on "Server Load"—a metric of how much processing power a custom script is consuming.

High-frequency events, specifically Damage Dealt, Healing Dealt, and Abilities Used, generate an immense volume of data. In a 5v5 team fight, ten players are constantly outputting damage and healing ticks. Logging every single instance of a Moira grasp or a Zarya beam would require the script to write to the log file dozens of times per second.

    The Crash Threshold: If the script exceeds the Server Load limit, the game instance will crash, terminating the scrim immediately.

    Default Settings: To prevent this, ScrimTime disables the logging of Damage, Healing, and Ability usage by default. The developer, Caldoran, explicitly warns that enabling these features can be "intensive on the server load" and impact the host's computer performance.   

Insight: This creates a fundamental data gap. While teams have perfect visibility into binary events (Kills, Deaths, Ults), they have very poor visibility into throughput events (Damage pressure, Healing output) during the flow of a fight. Most analysis is therefore derived from the "Kill Feed" rather than the "Combat Log."
4. The Visualization Ecosystem: Turning Logs into Insights

Raw CSV files generated by ScrimTime are practically useless to a coach in the middle of a review. A secondary market of tools has emerged to ingest, parse, and visualize this data. This ecosystem is dominated by two primary platforms: Parsertime and Datastrike.
4.1 Parsertime: The Collegiate Standard

Parsertime, developed by the user luxdotdev, represents the most sophisticated application of ScrimTime data currently available. Built using a modern web stack (Next.js, Tailwind CSS, Postgres), it is explicitly designed to serve the needs of the Collegiate Overwatch community.  

4.1.1 Roster Management and Longitudinal Tracking

Unlike professional teams which may have a static roster of 5-6 players, collegiate programs often manage multiple tiers of competition (Varsity, Junior Varsity, Academy) with dozens of student-athletes. Parsertime distinguishes itself by offering robust Team Management features.

    Persistent Rosters: Directors can create teams and assign specific player accounts to them. This allows for longitudinal tracking of a specific roster's performance over a semester.   

Performance Dashboard: The tool aggregates data not just from a single match, but across a season, allowing coaches to see trends in "First Death Rate" or "Ult Efficiency" over weeks of play.  

4.1.2 The Collegiate Context

The adoption of Parsertime is fueled by the formalization of the collegiate scene. Programs like Illinois State University, Maryville University, and Northwood University—who compete for thousands of dollars in scholarships and prize pools in the Overwatch Collegiate Championship —require administrative tools that justify their budgets. Parsertime provides the "paper trail" of performance that university administrators and directors need.  

4.2 Datastrike: The Analytics Competitor

Datastrike, developed by the Datastrike team (ZaT), offers a similar proposition but with a slightly different focus. While Parsertime leans into roster management, Datastrike emphasizes scouting and broad analytics.  

    Scouting Integration: Datastrike integrates with external APIs (like OverFast) to pull public profile data. This allows teams to potentially merge scrim data with public ranked data, offering a more holistic view of a player's hero pool and performance.   

Visualizations: Like Parsertime, Datastrike converts the raw ScrimTime logs into interactive timelines, allowing users to scrub through a match and see exactly when kills occurred relative to objective progress.  

4.3 The Symbiotic Relationship

The relationship between the generator (ScrimTime) and the visualizers (Parsertime/Datastrike) is symbiotic. The visualizers rely entirely on the DKEEH log schema. If Caldoran were to change the format of the CSV output, Parsertime and Datastrike would break immediately. This dependency has created a standardized "protocol" for Overwatch analytics that is entirely community-managed, without any official oversight from Blizzard.
5. User Feedback: The Value and the Void

How widely is ScrimTime used? In the Tier 2 (Contenders/FaceIt League), Tier 3 (Collegiate/Amateur), and semi-pro circuits, it is ubiquitous. "LFS" (Looking For Scrim) posts in discord communities routinely assume the use of the DKEEH or A8XVJ codes. However, ubiquitous adoption does not imply universal satisfaction.  

5.1 What Users Value

The feedback from coaches and analysts indicates that ScrimTime provides indispensable "Macro" data.

    The "First Death" Metric: In Overwatch 2, the first elimination in a 5v5 team fight is statistically decisive. Users consistently cite the ability to track "First Death Rates" (FD%) as the single most valuable insight provided by the ecosystem. Parsertime's ability to visualize who dies first, and to what ability, allows coaches to identify "feeders" or structural weaknesses in their formation.   

Ult Economy: By tracking when ultimates are used vs. when fights are won, tools like Datastrike allow teams to analyze their "Ult Economy." Coaches use this to teach "Dry Pushes" (fighting without using ults to force enemy ults) and to identify "Over-ulting" (using 3-4 ults to win a fight that was already won).

Objectivity: "Stats usually give you helpful information," but memory is flawed. ScrimTime provides an objective timeline of events, settling disputes between players about "who messed up" or "whether we had time to touch point."  

5.2 The "Missing" Data: What Users Wish They Had

Despite its utility, the community reports significant gaps in the data—limitations that are largely due to the technical constraints of the Workshop rather than developer oversight.
5.2.1 The Positioning Black Hole

The most requested, yet most elusive, metric is Positioning Data.

    The Requirement: Coaches desperately want 2D heatmaps or replay overlays that show where players were standing when they died. They want to measure "space created" or "distance from supports."

    The Limitation: While the Workshop can access player coordinates (X, Y, Z), logging them is feasible only at very low frequencies. Writing the position of 10 players, 60 times a second, to a text file would instantly crash the server due to the Load Limit. Consequently, ScrimTime logs contain what happened, but rarely where it happened. This forces coaches to rely on VOD review for spatial analysis, separating the "what" (stats) from the "where" (video).   

5.2.2 Cooldown Tracking

Users express a strong desire to track high-impact abilities like Kiriko's Protection Suzu, Baptiste's Immortality Field, or Ana's Biotic Grenade.  

    The Gap: While ScrimTime can theoretically track these, it is often disabled to save server load. Coaches want to know "Suzu Efficiency" (e.g., did the Suzu negate a Junker Queen Ultimate, or did it heal 10hp?). The current logs struggle to provide the context of the ability usage, only the count.

5.2.3 "Contextual" Damage

The community frequently repeats the mantra that "Stats lie". A Sojourn might have high damage output, but if that damage was all healed up by the enemy supports (feeding their support ultimates), it was "trash damage."  

    The Wish: Users wish for "Effective Damage" metrics—damage that directly contributed to an elimination within a 3-second window. The current ScrimTime logs, which often disable damage tracking entirely for stability, cannot support this level of derived analysis.

5.3 The "Missing Button" Incident: A Case Study in Fragility

The fragility of this user experience was starkly illustrated in mid-2024. Blizzard released a UI update that inadvertently removed the "Enable Workshop Inspector Log File" button from the gameplay settings menu.  

    The Crisis: For weeks, new users could not enable logging. Existing users kept the setting if it was already on, but the influx of new collegiate talent was effectively cut off from the analytics ecosystem.

    Community Response: This sparked panic and frustration. Developers like CBF (Scrimmie) and Lux (Parsertime) had to create workaround tutorials and plead with Blizzard on the forums to restore the button.

    Implication: This event highlighted that the entire global infrastructure of Tier 2/3 Overwatch analytics rests on a feature that Blizzard considers a low-priority debug tool. The ecosystem is one UI patch away from total obsolescence.

6. Comparative Analysis: Alternatives to ScrimTime

Are there other tools? Yes, but they occupy different niches.
6.1 Omnic.ai: The Computer Vision Approach

Omnic.ai represents a technological divergence. Instead of reading internal game logs, it uses Computer Vision and AI to watch video footage of gameplay.  

    Pros: It can track data that ScrimTime cannot, such as Aim Mechanics (tracking smoothness, micro-flicks) and Visual Awareness (checking corners). It provides individual coaching insights ("You are over-flicking on Cassidy").

    Cons: It is player-centric, not team-centric. It requires video processing power and does not easily generate a "Lobby-wide" view of the match. It cannot tell you if the enemy support used an ult unless it was visible on your screen.

    Use Case: Omnic.ai is used for individual skill improvement, whereas ScrimTime is used for team strategy and macro analysis.

6.2 Discord Bots and Scheduling Tools

Tools like Scrimbot and BlizzTrack exist within the ecosystem but serve administrative functions.  

    Function: Scrimbot manages the scheduling of scrims (finding opponents, setting times), but it does not track gameplay data.

    Integration Gap: A persistent "wish" from the community is a unified platform where a team schedules a scrim via a bot, plays the match in ScrimTime, and the bot automatically posts the Parsertime link to the Discord channel. Currently, these steps remain disjointed.

7. Key People in the Ecosystem

The Overwatch analytics community is defined by a small cadre of volunteer developers who wield outsized influence over the competitive scene.

Table 2: Key Figures in the Overwatch Analytics Ecosystem
Name/Handle	Role	Primary Contribution	Impact
Caldoran	Developer	Creator of ScrimTime and LogTime	

The "Architect." Defined the data schema used by the entire world. Effectively the CTO of amateur Overwatch.
CBF	Developer	Creator of Scrimmie!	

The "Product Manager." Refined the user experience for professional play (OWCS) and manages localization/bug reporting.
luxdotdev (Lux)	Developer	Creator of Parsertime	

The "Data Scientist." Built the visualization layer that powers the collegiate scene. Open-source advocate.
ZaT	Developer	Creator of Datastrike	

Developer of the alternative frontend, focusing on scouting and competitive data integration.
Seita	Coach/Dev	Creator of Seita Scrim Lobby	

The "Pioneer." Established the original logic for scrim lobbies in OW1, upon which Caldoran built.
Spilo	Coach	Analyst / Educator	

The "User Voice." A professional coach whose content teaches the community how to interpret the data (and when to ignore it).
 
8. Future Outlook and Recommendations

As of 2026, the ScrimTime ecosystem faces a crossroads. The "Esports in a Box" concept suggests a future where collegiate programs purchase turnkey solutions that include analytics. Parsertime is well-positioned to become the enterprise software for this niche.  

However, the technical limitations are becoming acute. The community's desire for Positioning Data and Cooldown Tracking cannot be met by the current Workshop Inspector. Unless Blizzard releases a true Game Data API (similar to what exists for League of Legends or Dota 2), the scene will remain capped at its current level of analytical depth.

For the Amateur/Semi-Pro Team Manager:

    Adoption: Usage of ScrimTime (specifically the Scrimmie! Professional preset) is mandatory for serious practice.

    Workflow: Do not attempt to read raw logs. Integration with Parsertime is essential for longitudinal tracking of roster performance.

    Data Strategy: Focus on "First Death" and "Ult Economy" metrics. Treat damage/healing numbers with skepticism due to sampling rate issues.

    Stability: Ensure the lobby host has a high-end PC and stable connection if enabling "Log Generator" features, as the risk of server crashes remains the primary operational hazard.

Conclusion: ScrimTime is a triumph of community engineering. In the absence of official support, the players built their own infrastructure. It is imperfect, fragile, and constrained by hacky workarounds, but it remains the single most important tool in the competitive Overwatch ecosystem, processing the data of thousands of aspiring professionals every day.