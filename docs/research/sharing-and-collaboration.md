## Question

How do amateur competitive Overwatch teams share performance data and insights with each other? Do coaches distribute stats to players, and if so in what format? Is there demand for collaborative analytics tools, or do most teams rely on a single person (coach/analyst) interpreting data for everyone?

## Answer

The Sociotechnical Infrastructure of Performance Data in Amateur Competitive Overwatch
1. Executive Summary

The amateur competitive Overwatch 2 ecosystem—spanning collegiate programs, semi-professional "Tier 3/4" tournaments, and organized Open Division teams—operates within a unique technological paradox. While the game itself generates immense quantities of complex telemetry data during every match, the developer, Blizzard Entertainment, provides no public-facing Application Programming Interface (API) for accessing this data in real-time. Unlike peer esports titles such as League of Legends or Dota 2, which offer granular match history and server-side data access, Overwatch teams are forced to operate in an information-scarce environment where the official client is a "black box."

This report provides an exhaustive analysis of the shadow infrastructure that has emerged to fill this void. Through a detailed examination of community-developed tools, coaching workflows, and communication platforms, we identify a decisive shift in how amateur teams share performance insights. The ecosystem is transitioning from a "Gatekeeper Model," where a single head coach manually interprets subjective video footage and static spreadsheets, to a "Collaborative Intelligence Model," driven by cloud-based SaaS (Software as a Service) platforms like Parsertime and Insights.gg.

Despite this technological maturation, the report finds that significant friction remains. The distribution of stats is heavily bottlenecked by the technical literacy of volunteer staff, the fragility of Workshop-based data scraping, and the persistent "Medal Fallacy"—a cultural reliance on misleading in-game scoreboards that often contradicts objective performance metrics. Furthermore, the analysis reveals a stark divide between the "haves" (collegiate teams with formalized reporting structures and paid staff) and the "have-nots" (community stacks relying on ephemeral verbal feedback).
2. The Technological Landscape: Manufacturing Telemetry in a Closed System

To understand how data is shared, one must first understand how it is acquired. In the absence of an official API, the amateur Overwatch community has weaponized the game's "Workshop" (a scripting interface intended for custom game modes) to function as a makeshift telemetry emitter. This technical workaround forms the bedrock of modern amateur analytics.
2.1 The Workshop as a Shadow API

The primary mechanism for data extraction in the amateur scene is the ScrimTime mod and its lightweight derivative, LogTime. These are not third-party external programs, but rather scripts written inside the game's Workshop mode. When a team hosts a practice match (scrim), they load a specific "Lobby Code" (e.g., Y2TXE or F6WTA) that runs in the background.  

2.1.1 The Mechanics of Extraction

The ScrimTime script functions by listening for specific event triggers within the game engine—such as a player firing a weapon, a hero dying, or an ultimate ability reaching 100% charge. When these events occur, the script writes a text string to the "Workshop Inspector Log," a debugging tool intended for mod developers.  

The granularity of this data is immense and far exceeds what is available on the standard scoreboard. It captures:

    Damage Taken (DT): Crucial for evaluating Tank performance and resource drain on Support players.

    Time to Ultimate: A metric for efficiency, measuring how quickly a player generates their ultimate ability compared to the server average.

    Cooldown Usage: Tracking specific ability deployments, such as Ana's Biotic Grenade or Kiriko's Protection Suzu.   

2.1.2 The "Human-in-the-Loop" Fragility

While this system provides professional-grade data, the workflow for acquiring it is fragile and labor-intensive. It requires a "human-in-the-loop" intervention for every single match:

    Activation: The lobby host must manually enable "Enable Workshop Inspector Log File" in their local game settings. If they forget, no data is recorded.   

Extraction: The data is saved locally to the host's hard drive as a .txt or .csv file. It does not automatically upload to a cloud server.  

Ingestion: The host must physically locate this file and upload it to a parsing tool (like Parsertime) to make it readable.  

This manual pipeline creates a significant bottleneck. If the designated "Analyst" or lobby host disconnects, crashes, or simply forgets to save the log, the statistical record of the practice block is lost forever. This fragility heavily influences who holds the power in a team: it is often not the best player, but the person with the technical discipline to manage this extraction workflow.  

2.2 Optical Character Recognition (OCR) and Legacy Tools

Before the maturation of Workshop codes, teams relied on OCR tools (such as the now-defunct Visor or early versions of Insights.gg) that used computer vision to "watch" the screen and read numbers from the scoreboard or kill feed.  

While OCR is less invasive than Workshop codes (it works on video files and doesn't require lobby permissions), it suffers from reliability issues. It cannot track off-screen events (e.g., a Flanker dying behind the camera's view) and struggles with UI scaling or resolution changes. Consequently, OCR has largely been relegated to a secondary role—used primarily for indexing "highlight" moments in video reviews rather than generating raw statistical databases.  

2.3 The "Counterwatch" Overlay

A subset of the amateur community utilizes real-time overlay tools like Counterwatch. Unlike post-hoc analysis tools, these run during the game, reading screen data to provide immediate information on enemy team compositions and hero swap tendencies.  

    Utility: It provides live hero swap notifications and win-rate insights based on the current map.   

    Data Sharing: The sharing mechanism here is often verbal. The player running the overlay (usually a Support or Tank player with less mechanical aim intensity) acts as the "Info Caller," relaying the data to the team via voice chat: "They swapped to Pharah; their win rate on this map with Pharah is high."

This represents a distinct form of data sharing: synchronous, verbal distribution of real-time telemetry, contrasting with the asynchronous, visual distribution of post-match logs.
3. Data Management Workflows: The "Analyst" Persona

In the amateur scene, the title of "Analyst" is often fluid. In well-funded collegiate programs, this may be a paid staff member or a student intern receiving course credit. In Tier 3/4 grassroots teams, it is typically a volunteer, a substitute player, or the Head Coach pulling double duty.  

The workflow of these individuals defines the team's data culture. We have identified three distinct "maturity levels" of data management in the ecosystem.
3.1 Maturity Level 1: The Spreadsheet Administrator

At the foundational level, teams rely on the "Team Tracker"—a massive, multi-tabbed Google Sheet. This is the most ubiquitous tool in amateur Overwatch.  

Data Points Tracked:

    Roster Management: BattleTags, discord IDs, and role assignments (Tank, DPS, Support).   

Scrim Schedule: Dates, times, and opponent SR (Skill Rating) to ensure balanced practice.

Map Logs: A manual entry of every map played.

    Input: "Kings Row - Win - 3-2".

    Output: Basic win-rate percentages by map type (Control, Escort, Hybrid, Push).   

Distribution Format: The distribution is passive. The link to the Google Sheet is pinned in a specific Discord channel (e.g., #resources or #schedule). Players are expected to check it, but rarely do so for insights. They check it primarily to know when to show up. The "insight" here is purely logistical: "We are bad at Push maps," derived from seeing a row of red "LOSS" cells in the tracker.  

3.2 Maturity Level 2: The Discord Bot Integrator

As teams organize, they introduce automation to reduce the friction of manual entry. This level utilizes Discord bots like ScrimBot, OverwatchBot, or custom webhooks.  

Workflow:

    Scheduling: Instead of a spreadsheet, players use bot commands (e.g., !scrim) to sign up for slots.

    Profile Stats: Bots like OverwatchBot scrape public profiles (from Blizzard's web profile, not the game client) to post a player's rank and top heroes directly into the chat.   

Scrim Finding: Teams use bots and specific Discord servers (e.g., The O.W., Elo Hell) to post "Looking for Scrim" (LFS) advertisements.  

Distribution Format: The format here is ephemeral. Data appears as a chat message stream.

    Example: "Scrim confirmed vs Team X, 8 PM EST, Avg SR 3.5k."

    This reduces the "Spreadsheet Fatigue" but creates a history problem: it is difficult to look back 3 months and see trends in a Discord chat log compared to a structured spreadsheet.

3.3 Maturity Level 3: The SaaS Power User (Parsertime & Insights.gg)

The highest level of amateur operations—seen in top collegiate and semi-pro teams—utilizes dedicated SaaS platforms to host their data. This represents the shift to Collaborative Analytics.  

Workflow:

    Ingestion: The Analyst uploads the .csv from ScrimTime to Parsertime.

    Processing: The platform processes the raw logs into visual dashboards.

    Distribution: The Analyst posts a dynamic link to the match report in Discord.

The "Player Portal" Concept: Unlike a spreadsheet, Parsertime offers individualized views. A player logs in and sees their own "Player Profile," which tracks their stats across weeks or months.  

    Trend Analysis: "My damage per 10 has gone up, but my deaths have also gone up."

    Comparative Analysis: "How does my healing efficiency compare to the team average?"

This workflow satisfies the user query regarding "collaborative tools." The demand for these tools is driven by the desire to democratize data—taking it out of the coach's private Excel file and putting it into an interface that players actually want to interact with.  

4. The Collaborative VOD Review: The "Whiteboard" as a Shared Brain

While statistical data provides the what (e.g., "We lost the fight"), video analysis provides the why (e.g., "Our Reinhardt was out of position"). The sharing of video insights is the single most important activity for team improvement.
4.1 The Legacy Model: Synchronous "Lecture"

Historically, VOD review was a synchronous event. The coach would stream their screen via Discord to the team, pause the video, and talk.  

    Format: Screen Share + Voice Chat.

    Social Dynamic: Hierarchical. The coach speaks; players listen.

    Friction: Scheduling 6-7 people for a 2-hour block is difficult, leading to attendance issues.

    Data Retention: Low. Once the stream ends, the insights vanish unless someone took notes.

4.2 The Modern Model: Asynchronous Collaboration (Insights.gg)

The introduction of Insights.gg has fundamentally altered this dynamic, fulfilling the demand for "collaborative analytics tools" mentioned in the query.  

Key Features Driving Adoption:

    The "Whiteboard" Overlay: Coaches can draw directly on the video frame—arrows for rotations, circles for positioning, X's for targets. This visual language helps bridge the gap for visual learners who struggle with abstract verbal instructions.   

Timestamped Comments: Players can watch the VOD on their own time (e.g., between classes) and leave comments at specific timestamps.  

    Example: Player A comments at 12:05: "I didn't see the Tracer here." Coach replies: "Check your sound settings, footsteps were audible."

The "Library" Approach: VODs are stored in folders (e.g., "Scrims > October > Map 1"), creating a searchable archive of the team's history.  

4.3 Micro vs. Macro Reviews

The format of distribution changes based on the scope of analysis.  

Review Type	Audience	Format	Tooling
Macro Review	Full Team (6+ Staff)	Live Discord Session or Annotated VOD	Insights.gg (Group Session)
Micro Review	1-on-1 (Coach + Player)	Private Discord Call or POV Recording	Discord Screen Share, YouTube Unlisted
Self-Review	Individual Player	Written Notes + Mental Replay	

Notepad, "Diagnosis" Method
 

The "Diagnosis" Method: Advanced players engage in "Self-VOD Review" using structured methodologies. One such method involves identifying a specific "Theme" (e.g., Target Priority, Cooldown Management) and watching the VOD exclusively through that lens. They then document their "Diagnosis" in a personal document, often shared with the coach for verification.  

5. Formalized Reporting Structures: The Collegiate Model

In the collegiate ecosystem, the "amateur" label belies a highly bureaucratic structure. Coaches often report to Athletic Directors or Esports Program Managers, necessitating formal reporting workflows.  

5.1 The "Weekly Report"

Unlike the ephemeral Discord chats of community teams, collegiate coaches often produce a formal Weekly Summary Report.  

    Format: PDF or Word Document.

    Audience: Players, Program Director, Assistant Coaches.

    Content:

        Match Results: W/L record for the week.

        Attendance: Who showed up to practice.

        Key Performance Indicators (KPIs): Statistical trends derived from Parsertime.

        Academic Standing: Ensuring players are meeting GPA requirements for scholarships.   

5.2 Esports Tower Templates

To support this formalization, organizations like Esports Tower provide standardized templates. These documents represent the "administrative layer" of data sharing.  

Key Templates Used:

    S.M.A.R.T. Goals Worksheet: Used to set Specific, Measurable, Achievable, Relevant, and Time-bound goals for the season.

        Example: "Improve Teamfight Win Rate on Control Maps by 5% within 4 weeks."

    Esports Player Goal Summary: A "Report Card" for individual players, tracking their short-term and long-term development.

    Hydration and Health Trackers: Reflecting the "holistic" approach of collegiate athletics, tracking physical wellness alongside in-game stats.   

This formalization creates a distinct data culture: one where data is not just for winning the next match, but for justifying the program's existence and funding to university administration.
6. The "Medal Fallacy" and the Sociology of Stats

A recurring theme in the research is the tension between "Data" and "Truth." Overwatch is notorious for the "Medal Fallacy," where the in-game scoreboard awards Gold, Silver, and Bronze medals for raw stats like Damage Done or Healing Done.  

6.1 The "Trash Damage" Problem

Players often use the in-game scoreboard to defend their performance: "I have Gold Damage, I'm carrying." However, high-level analysis reveals that "trash damage" (damage that doesn't result in a kill and only feeds enemy support ultimates) is actually detrimental.  

Coach's Role as "De-programmer": A major part of the coach's data distribution workflow is contextualization.

    Action: The coach takes the raw stat (High Damage) and pairs it with the VOD context (Enemy Supports had Ults every fight).

    Insight: "Your high damage was actually the reason we lost, because you fed their Zenyatta Transcendence." This dynamic creates friction. Players feel validated by the game client (Medals), but criticized by the external tools (ScrimTime/Parsertime). Bridging this gap is the primary social challenge of amateur analytics.   

6.2 The "Blame Game" vs. Objective Truth

In the absence of objective data, post-match discussions often devolve into "blame games" based on feelings.

    Scenario: The Tank feels they received no healing. The Support feels they healed non-stop.

    Resolution via Data: The Analyst pulls the ScrimTime Log.

        Data Point: "Healing Received" on the Tank was 12,000 (High).

        Derived Insight: The Tank was receiving healing, but taking unmanageable damage (e.g., standing in the open).

        Outcome: The data shifts the blame from "Support isn't healing" to "Tank has bad positioning." This objective conflict resolution is a key driver for the adoption of analytics tools.   

7. Demand for Collaborative Tools vs. The "Single Interpreter"

The user asks: Is there demand for collaborative tools, or do most teams rely on a single person?
7.1 The Bottleneck Reality

Currently, most teams rely on a single person (the "One Guy" model).  

    Why: Technical barriers. Setting up Workshop codes, parsing CSVs, and managing databases is a specialized skill set. Most players just want to play.

    Consequence: If the Analyst/Coach is unavailable, the feedback loop breaks. The team plays, but learns nothing.

7.2 The Explicit Demand for Collaboration

However, the demand for collaboration is high, evidenced by:

    Adoption of "Self-Serve" Platforms: The rapid growth of platforms like Parsertime and Insights.gg shows that when the barrier to entry is lowered (web-based, no coding required), players will engage with data.   

"Wish Lists" for Features: Players and coaches actively request features like "Shared & Synced Replay Watching" and "Real-time collaborative whiteboards". They want the "Google Docs experience" for Overwatch—where multiple people can edit and comment simultaneously.  

Community Sharing: The existence of active subreddits (r/OverwatchUniversity) where players post their own VOD codes for peer review indicates that when internal team structures fail, players seek external collaboration.  

8. Conclusion and Future Outlook

The amateur Overwatch data ecosystem is defined by its resilience. Denied an official API by the developers, the community built its own telemetry infrastructure using the Workshop. Denied professional-grade analysis tools, they repurposed business intelligence concepts (SaaS dashboards, collaborative whiteboards) for esports.

Summary of Findings:

    Workflow: The workflow has matured from "Spreadsheet Administration" to "SaaS-based Collaboration." The standard pipeline is ScrimTime (Extraction) -> Parsertime (Analysis) -> Insights.gg (Review) -> Discord (Communication).

    Coach's Role: The Coach is no longer just a strategist but a Data Curator. Their primary value is filtering the noise of raw logs into actionable "Themes" and de-programming players from the misleading "Medal" system.

    Format: Stats are distributed in three primary tiers: Ephemeral (Discord bots/messages), Administrative (Google Sheets), and Analytical (Interactive Web Dashboards and Annotated Video).

    Collaboration: There is a strong, verified demand for collaborative tools. The industry is moving away from the "Coach as Bottleneck" model toward a model where players are empowered to diagnose their own play through shared, persistent digital workspaces.

As Overwatch 2 continues to evolve, the gap between the "Haves" (teams with automated data pipelines) and "Have-Nots" (manual trackers) will likely widen, unless Blizzard introduces official tools to democratize access to the data that currently exists only in the shadows of the Workshop.
Table 1: Comparative Analysis of Amateur Analytics Tools
Tool	Primary Function	Data Source	Collaborative Features	user Skill Required

ScrimTime
	Data Extraction	Workshop Script	None (Raw Data Generation)	High (Host setup)

Parsertime
	Statistical Analysis	CSV Ingestion (from ScrimTime)	Player Profiles, Team Aggregates, Trend Tracking	Medium (Upload & Interpret)

Insights.gg
	VOD Review	Video File / Replay Recording	Whiteboarding, Timestamped Comments, Library	Low (Web Interface)

Google Sheets
	Logistics & Administration	Manual Entry	Shared Editing, Historic Logging	Low to High (Formulas)

Counterwatch
	Real-time Overlay	Screen Reading (OCR/Hook)	Verbal Communication of Data	Low (Install & Run)

Discord Bots
	Notifications & Public Stats	Blizzard Web Profile / Manual Commands	Public Chat, Role Pings	Medium (Server Admin)
 
