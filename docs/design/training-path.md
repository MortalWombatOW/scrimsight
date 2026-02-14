# ScrimSight Training Path: Progressive Performance System

**Status:** Design (pre-implementation)
**Last updated:** February 2026

---

## 1. Vision

ScrimSight Training Path is an opinionated, progressive performance understanding system for competitive Overwatch teams and players. It guides users through measurable concepts one at a time, starting with fundamentals and building toward advanced strategy. Each concept is explained, benchmarked, and tracked — so players always know what to focus on, what excellence looks like, and how they measure up.

The system monitors all previously learned concepts via a traffic light system. If fundamentals slip, the system highlights the regression before unlocking advanced analysis. This creates a natural learning journey that prevents players from chasing advanced optimizations while their basics are broken.

### Design Principles

1. **One thing at a time.** The Spilo method: focused feedback on a single theme outperforms a laundry list of corrections. The active concept gets full attention; everything else is a glanceable status indicator.

2. **Measurable and actionable.** Every concept maps to a metric we can compute from ScrimTime data. No hand-wavy advice — concrete numbers, concrete benchmarks, concrete trends.

3. **Calming and educational, not punitive.** The system is a guide, not a judge. Red doesn't mean "you're bad" — it means "this needs attention." The framing is always "here's what to focus on next" rather than "here's what you're failing at."

4. **Respect user agency.** Players can customize which concepts they're actively focusing on within unlocked tiers. They can't skip prerequisites (the system is opinionated about ordering), but they can choose to deep-dive into any unlocked concept.

5. **Team and player perspectives coexist.** The same data, two lenses. Players see their individual metrics first with team context. Coaches see team metrics first with player drill-down.

---

## 2. Scope Model: Team vs. Player

The training path supports two scopes, selectable in the UI:

### Player Scope (default for individual users)
- **Primary metrics:** Individual performance (Deaths/10, First Death Rate, Entry Pick Rate, FB/Elim Ratio, Ult Charge Time, etc.)
- **Secondary context:** Team-level metrics shown as context cards ("Your team's fight win rate", "Your team's first pick conversion")
- **Advancement:** Based on the player's own metrics meeting thresholds
- **Portability:** Player-scoped metrics carry over if they join a new team

### Team Scope (default for coaches)
- **Primary metrics:** Team-level aggregates (Teamfight Win Rate, First Pick Conversion, Resilience, Ult Efficiency, Dry Fight Win Rate, Comp Win Rates)
- **Secondary context:** Player-level breakdowns shown as drill-downs ("Who's dying first?", "Who's charging ult slowest?")
- **Advancement:** Based on team-level metrics across the last N scrims
- **Note:** Team metrics are NOT simply averages of individual metrics. Fight win rate, first pick conversion, and resilience are inherently team-level — they describe the team's ability to function as a unit.

### Metrics That Are Inherently Team-Level
These exist only in team scope (not meaningful per-player):
- Teamfight Win Rate
- First Pick Conversion Rate (Snowball %)
- Resilience (FD Win %)
- Dry Fight Win Rate
- Ult Efficiency (team ults used per fight won)
- Composition Win Rates
- Map Win Rates

### Metrics That Are Inherently Player-Level
These exist only in player scope (not meaningful per-team):
- Individual Deaths/10
- Individual First Death Rate
- Individual Entry Pick Rate
- Individual FB/Elim Ratio
- Individual Ult Charge Time
- Individual Ult Hold Time
- Individual Ult Win Rate

---

## 3. The Concept Model

Each concept has:

| Property | Description |
|---|---|
| **Name** | Short, action-oriented (e.g., "Stay Alive") |
| **Scope** | `player`, `team`, or `both` |
| **Why It Matters** | 1-2 sentences connecting it to winning. Educational, not preachy. |
| **What Excellence Looks Like** | Concrete benchmark from the Parsertime dataset with context |
| **Your Performance** | Current value + trend + status indicator |
| **How To Improve** | 1-3 actionable tips referencing specific in-game behaviors |
| **Prerequisites** | Which concepts must be green before this unlocks |
| **Min Sample Size** | Minimum fights/matches for statistical significance |

### Status Indicators

Rather than a traditional red/yellow/green stoplight (which can feel punitive), we use a **growth-oriented framing**:

| Status | Visual | Meaning | User-Facing Label |
|---|---|---|---|
| **Locked** | Muted/grayed | Prerequisites not met | "Complete [X] to unlock" |
| **Gathering Data** | Pulsing/loading | Not enough data yet | "N more scrims to unlock" |
| **Active Focus** | Highlighted/primary | The concept you're currently working on | "Current Focus" |
| **Thriving** | Green indicator | Metric consistently in excellent range | "Looking great" |
| **Steady** | Neutral/blue indicator | Metric in acceptable range | "On track" |
| **Needs Attention** | Amber/warm indicator | Metric dipping below threshold | "Worth reviewing" |
| **Foundation Check** | Orange indicator (Tier 1 only) | A fundamental has regressed | "Revisit the basics" |

Key framing decisions:
- We never say "Poor" or "Bad" or "Failing"
- "Needs Attention" is the strongest negative — it's a nudge, not a judgment
- "Foundation Check" only applies to Tier 1 concepts and is explicitly about "your basics have shifted, let's shore them up before going further"
- Trends are always shown alongside absolute values — improvement matters even if you're not green yet

### Advancement Logic

```
Window = last N scrims (default 3, configurable)

IF concept has insufficient data (below min sample size):
  → status = "Gathering Data"
  → show "N more scrims to measure this"

IF all monitored concepts are Thriving or Steady for the window:
  → next locked concept becomes available
  → user can activate it (or keep current focus)

IF any monitored concept drops to "Needs Attention":
  → pause advancement (no new unlocks)
  → surface a gentle nudge: "Your [concept] has shifted — worth a look"
  → do NOT re-lock concepts the user has already mastered
  → do NOT force them to change their active focus

IF a Tier 1 concept drops to "Needs Attention":
  → stronger nudge: "Your fundamentals have shifted"
  → advancement paused until Tier 1 stabilizes
  → suggest (don't force) refocusing on the Tier 1 concept
```

### Statistical Significance

Rather than fixed thresholds, we use a statistical approach:
- For rate-based metrics (win rates, first death rate): require enough observations that the 95% confidence interval is narrower than the difference between status thresholds
- For continuous metrics (D/10, charge time): require enough observations for a stable rolling mean (variance of the rolling mean < threshold)
- In practice, this means roughly **30+ teamfights** for fight-based metrics and **5+ matches** for match-based metrics, but the actual threshold adapts to variance in the data
- Display: "N more scrims to unlock" shows the estimated number of scrims needed based on current data accumulation rate

---

## 4. The Training Path: Concept Definitions

### Tier 1: Survival Foundations (Free)

> *The prerequisite for everything. You can't contribute while dead.*

These concepts are always monitored once learned. A regression here pauses all advancement.

---

#### Concept 1: Stay Alive
**Scope:** Player

> *"You can't deal damage, heal, or contest objectives while waiting to respawn. Every death also gives the enemy ult charge. Staying alive is the single most impactful thing you can do."*

| Attribute | Details |
|---|---|
| **Metric** | Deaths per 10 minutes (D/10) |
| **Data source** | `playerStats` — already computed in STAT_CONFIG |
| **Benchmarks** | Role-adjusted percentiles from Parsertime dataset (notebook 04): |
| | *Tank:* Thriving < p25, Steady < p50, Needs Attention > p75 |
| | *DPS:* Thriving < p25, Steady < p50, Needs Attention > p75 |
| | *Support:* Thriving < p25, Steady < p50, Needs Attention > p75 |
| **Min sample** | 5 matches with ≥60s playtime per hero |
| **How to improve** | "Look at your deaths in the timeline view. Are you dying in fights your team is already losing? If so, recognize lost fights faster and disengage. Are you dying first? That's Concept 3." |

**Why role-adjusted:** The analysis confirmed Tanks naturally die more than Supports. A Tank at 6.5 D/10 may be performing well; a Support at 6.5 is underperforming. Hero-specific benchmarks (from notebook 04) can be shown as a drill-down.

---

#### Concept 2: Win Your Fights
**Scope:** Team

> *"Overwatch is a series of 15-30 teamfights per match. Win rate in these fights is the single most important team-level metric — it smooths out the noise of individual match outcomes."*

| Attribute | Details |
|---|---|
| **Metric** | Teamfight Win Rate (TFWR) |
| **Data source** | `teamfights[].winner` — already computed |
| **Benchmarks** | Thriving > 55%, Steady 48-55%, Needs Attention < 48% |
| **Min sample** | 30 teamfights (roughly 2-3 matches) |
| **How to improve** | "This is a team-level metric. If it's low, the concepts below will help diagnose why — focus on not dying first, converting advantages, and winning without ults." |

**Note:** TFWR should be measured against opponents of similar caliber. If the team scrims up (against stronger opponents), a lower TFWR is expected. Future enhancement: allow tagging scrims by opponent strength.

---

**Advancement gate:** Both Concepts 1 & 2 at Thriving or Steady across the evaluation window.

---

### Tier 2: Fight Fundamentals (Free)

> *Now we diagnose WHY fights are won or lost. The research is unambiguous: the opening seconds of a fight determine the outcome.*

---

#### Concept 3: Don't Die First
**Scope:** Player

> *"The team that loses a player first loses the fight ~79% of the time (from our dataset of 4,800+ matches). In 5v5, one death = 20% of your team gone. If you're consistently dying first, you're the single biggest factor in your team's fight losses — regardless of your other stats."*

| Attribute | Details |
|---|---|
| **Metric** | First Death Rate — % of teamfights where you are the first death on your team |
| **Data source** | `teamfights[].firstPick` (victim side) — already computed |
| **Benchmarks** | Role-adjusted: |
| | *Support:* Thriving < 8%, Steady 8-15%, Needs Attention > 15% |
| | *DPS:* Thriving < 10%, Steady 10-18%, Needs Attention > 18% |
| | *Tank:* Thriving < 12%, Steady 12-22%, Needs Attention > 22% |
| **Min sample** | 30 teamfights |
| **How to improve** | "Open the timeline for fights where you died first. Check: Were you ahead of your team? Were you in the enemy's sightline without cover? The pattern will reveal if it's a positioning issue (you're overextending) or a peel issue (your team isn't protecting you)." |

**Why role-adjusted:** The analysis shows supports dying first is more devastating (guaranteed lost fight), while tanks are expected to be in danger more often. The thresholds reflect this — support first deaths are held to a tighter standard.

---

#### Concept 4: Close Out Advantages
**Scope:** Team

> *"Getting first pick means nothing if you throw the advantage. Teams that get first pick should win ~79% of those fights. If your conversion rate is lower, you're giving back advantages you've earned."*

| Attribute | Details |
|---|---|
| **Metric** | First Pick Conversion Rate (Snowball %) |
| **Data source** | `teamfights[].firstPick` + `teamfights[].winner` — already computed, shown in WinConditionCard |
| **Benchmarks** | Thriving > 75%, Steady 65-75%, Needs Attention < 65% |
| **Min sample** | 20 fights where your team got first pick |
| **How to improve** | "After getting first pick, play the 5v4 patiently. Collapse together rather than chasing individual kills. A coordinated 5v4 push is almost always a win — the mistake is splitting up to chase." |

---

#### Concept 5: Fight Back From Disadvantage
**Scope:** Team

> *"You won't always get first pick. Your resilience — how often you win after losing a player — separates teams that crumble from teams that adapt."*

| Attribute | Details |
|---|---|
| **Metric** | Resilience — win rate after suffering first death (FD Win %) |
| **Data source** | Same teamfight data, opposite perspective |
| **Benchmarks** | Thriving > 28%, Steady 18-28%, Needs Attention < 18% |
| **Min sample** | 20 fights where your team lost first player |
| **How to improve** | "When you lose a player, the decision is: commit or disengage? If you're always committing to 4v5s and losing, practice recognizing lost fights. If you're always disengaging, practice stabilizing with defensive ults or positional retreats." |

---

**Advancement gate:** Concepts 3-5 at Thriving or Steady. Concepts 1-2 still Thriving or Steady.

---

### Tier 3: Neutral Game (Free)

> *This tier separates teams that win because they press Q from teams with real coordination. If you can only win with ults, you're one bad economy away from a losing streak.*

---

#### Concept 6: Win Without Ults
**Scope:** Team

> *"Dry fight win rate — fights where neither team uses ultimates — is the truest measure of fundamental coordination. It strips away the crutch of ultimate abilities and tests raw teamwork."*

| Attribute | Details |
|---|---|
| **Metric** | Dry Fight Win Rate |
| **Data source** | `teamfights[].type === 'dry'` + `winner` — computed but only partially surfaced in WinConditionCard |
| **Benchmarks** | Thriving > 55%, Steady 45-55%, Needs Attention < 45% |
| **Min sample** | 15 dry fights |
| **How to improve** | "Low dry fight win rate usually points to one of two things: (1) target focus — is everyone shooting the same person? or (2) engage timing — is the tank going in before the team is ready? Check the timeline for dry fights you lost and look for these patterns." |

---

#### Concept 7: Make Your Kills Count
**Scope:** Player

> *"High eliminations with low final blows means you're participating in kills but not finishing them. Your damage is getting healed up — which actually helps the enemy by charging their support ults."*

| Attribute | Details |
|---|---|
| **Metric** | Final Blow / Elimination Ratio |
| **Data source** | `playerStats` — finalBlows and eliminations in STAT_CONFIG |
| **Benchmarks** | Role-adjusted: |
| | *DPS:* Thriving > 0.50, Steady 0.35-0.50, Needs Attention < 0.35 |
| | *Tank:* Thriving > 0.40, Steady 0.25-0.40, Needs Attention < 0.25 |
| | *Support:* Thriving > 0.30, Steady 0.15-0.30, Needs Attention < 0.15 |
| **Min sample** | 5 matches |
| **How to improve** | "Focus on confirming low-HP targets rather than spreading damage. If you're breaking even on elims but low on final blows, your damage is being healed before you finish the kill. Try to burst down single targets rather than poking multiple." |

---

**Paywall boundary: Tiers 1-3 (7 concepts) are free.**

By the time a player has all 7 green, they've:
- Proven genuine engagement with the tool
- Seen real, measurable improvement in their fundamentals
- Built the habit of checking ScrimSight after scrims
- Naturally reached the point where they want deeper analysis

The Plus concepts are the "advanced" analysis that the research says matters most for the jump from amateur to competitive: ult economy, fight impact, and strategic composition analysis.

---

### Tier 4: Ultimate Economy (ScrimSight Plus)

> *Ultimates are the currency of Overwatch. How you earn, save, and spend them determines the pace of the match.*

---

#### Concept 8: Don't Over-Ult
**Scope:** Team

> *"Using 4 ults to win a fight you could have won with 2 is a pyrrhic victory. You win the battle but enter the next fight with nothing, while the enemy has a full bank. The research calls this 'ult vomit' — and it's one of the most common amateur mistakes."*

| Attribute | Details |
|---|---|
| **Metric** | Ult Efficiency — average team ults used per fight won |
| **Data source** | `teamfights[].team1UltsUsed` / `team2UltsUsed` + `winner` — already computed |
| **Benchmarks** | Thriving < 2.0, Steady 2.0-3.0, Needs Attention > 3.0 |
| **Min sample** | 15 won fights |
| **How to improve** | "Before pressing Q, check the kill feed. If your team already has a numbers advantage (5v3 or better), save your ult. Practice calling 'save ults' when the fight is already won." |

---

#### Concept 9: Charge Faster
**Scope:** Player

> *"The player who builds ult first dictates the tempo of the next fight. If you're consistently slower than average, you're forcing your team to wait or fight without key abilities."*

| Attribute | Details |
|---|---|
| **Metric** | Average Time to Charge Ultimate |
| **Data source** | `ultCycles[].chargeTime` — **domain exists but not surfaced in UI** |
| **Benchmarks** | Role-level medians from dataset (notebook 02): Tank ~163s, DPS ~160s, Support ~173s. Hero-specific benchmarks available as drill-down. |
| | Thriving: below role median. Steady: within 15% above median. Needs Attention: >15% above median. |
| **Min sample** | 10 ult cycles |
| **How to improve** | "Slow ult charge usually means low uptime — you're either dead too often (revisit Concept 1) or not finding opportunities to deal meaningful damage/healing. Consider: are you playing too passively? Are you positioned where you can contribute?" |

---

#### Concept 10: Use Ults at the Right Time
**Scope:** Player

> *"A well-timed ult wins the fight. A wasted ult — used in a fight that's already lost, or that you would have won anyway — costs you the next fight."*

| Attribute | Details |
|---|---|
| **Metric** | Ult Win Rate — fight win rate when you use your ultimate |
| **Data source** | `PlayerImpactMetrics.ultWinRate` — exists but only shown per-match |
| **Benchmarks** | Thriving > 60%, Steady 45-60%, Needs Attention < 45% |
| **Min sample** | 15 ult uses |
| **How to improve** | "Open the timeline for fights where you ulted and lost. Ask: Was the fight already lost when I pressed Q? Was I using my ult reactively (trying to save a lost fight) instead of proactively (starting a winning fight)?" |

---

#### Concept 11: Hold Smart
**Scope:** Player

> *"Holding your ult too long wastes tempo — your team fights without a key ability. Using it immediately wastes value — you might not have the right opportunity. Finding the balance is a skill."*

| Attribute | Details |
|---|---|
| **Metric** | Average Ult Hold Time |
| **Data source** | `UltimateEvent.ultimateHoldTime` — **computed but never displayed** |
| **Benchmarks** | Hero-specific (defensive ults like Sound Barrier should be held briefly; combo ults like Graviton can be held longer). Use hero-specific percentiles from dataset. |
| **Min sample** | 10 ult uses |
| **How to improve** | "If you're holding too long, you might be waiting for 'the perfect moment' that never comes. A good-enough ult now is often better than a perfect ult never. If you're using too fast, you might be panic-ulting — take a breath and evaluate the fight state first." |

**Note:** This concept requires hero-specific benchmarks. The analysis pipeline (notebook 02) has charge time distributions by hero — we need equivalent hold time distributions. This is a research gap to fill.

---

### Tier 5: Fight Impact (ScrimSight Plus)

> *Moving from team-level understanding to individual-level fight contribution. How much of a difference are YOU making in each fight?*

---

#### Concept 12: Be the Playmaker
**Scope:** Player

> *"Entry pick rate — how often you secure the opening kill — is the single highest 'carry' stat in Overwatch. If your team gets first pick, they win ~79% of the time. Being the one who creates that advantage is the definition of impact."*

| Attribute | Details |
|---|---|
| **Metric** | Entry Pick Rate — % of fights where you secure first kill |
| **Data source** | `PlayerImpactMetrics.entryPickRate` — exists, shown per-match only |
| **Benchmarks** | Role-adjusted: |
| | *DPS:* Thriving > 18%, Steady 10-18%, Needs Attention < 10% |
| | *Tank:* Thriving > 12%, Steady 6-12%, Needs Attention < 6% |
| | *Support:* Thriving > 8%, Steady 3-8%, Needs Attention < 3% |
| **Min sample** | 30 teamfights |
| **How to improve** | "Entry picks come from positioning (finding angles), timing (engaging when the enemy is vulnerable), and coordination (diving together). But balance this against Concept 3 — don't chase picks at the cost of dying first. The best playmakers have a high entry pick rate AND a low first death rate." |

---

#### Concept 13: Fight Type Awareness
**Scope:** Team

> *"Understanding which types of fights you win reveals your strategic identity. Are you a team that dominates neutral game, or one that relies on ultimates?"*

| Attribute | Details |
|---|---|
| **Metric** | Win Rate by Fight Type (dry, ult-invested, all-in, stagger) |
| **Data source** | `teamfights[].type` + `winner` — **computed but hidden** |
| **Benchmarks** | Thriving: no fight type below 45%. Steady: no fight type below 35%. Needs Attention: any fight type below 35%. |
| **Min sample** | 10 fights per type |
| **How to improve** | "Compare your dry fight win rate to your all-in win rate. If you only win all-in fights, you're too ult-dependent — revisit Concept 6. If you win dry but lose ult fights, your ult coordination needs work — revisit Concepts 8-11." |

---

### Tier 6: Strategy & Growth (ScrimSight Plus)

> *The highest level: composition choices, map strategy, and the meta-skill of tracking your own improvement.*

---

#### Concept 14: Know Your Maps
**Scope:** Team

> *"Your win rate varies significantly by map type. Knowing where you're strong and weak lets you prioritize practice and make informed map picks in tournaments."*

| Attribute | Details |
|---|---|
| **Metric** | Win Rate by Map Type (Control, Escort, Hybrid, Push, Flashpoint) |
| **Data source** | `matchMetadata.mode` + `winner` — already displayed in TeamOverview |
| **Benchmarks** | Thriving: no map type below 45%. Steady: no map type below 35%. Needs Attention: any map type below 35%. |
| **Min sample** | 5 matches per map type |
| **How to improve** | "Identify your weakest map type and dedicate scrim blocks to practicing it specifically. If you're weak on Escort but strong on Control, the issue is likely attacking coordination (Escort requires sustained pushes; Control rewards brawling)." |

---

#### Concept 15: Know Your Compositions
**Scope:** Team

> *"What compositions does your team actually play, and how do they perform? Data often reveals that the comp you think is your best isn't — and the comp you never practice might be your strongest."*

| Attribute | Details |
|---|---|
| **Metric** | Win Rate by Composition Archetype (Dive, Brawl, Poke, Mixed) |
| **Data source** | Composition classification from `heroSwap` + `heroSpawn` events (signature-based classifier exists in analysis pipeline) |
| **Benchmarks** | Thriving: primary comp > 55% win rate. Steady: primary comp > 45%. Needs Attention: primary comp < 45%. |
| **Min sample** | 10 matches per archetype |
| **How to improve** | "If your primary comp has a low win rate, consider: (1) Is this the right comp for the maps you're playing? (2) Are you executing the comp's win condition? (Dive needs synchronized burst; Brawl needs speed and tight pathing; Poke needs sightline control.) (3) Would switching to your secondary comp improve results?" |

**Implementation note:** Requires porting the `classify_composition` function from the Python analysis pipeline to TypeScript. The approach: each hero has a primary archetype tag (Dive/Brawl/Poke), the team's composition is classified by the dominant archetype among its 5 heroes, with "Mixed" as the fallback when no archetype has a clear majority.

---

#### Concept 16: Track Your Growth
**Scope:** Both (player and team)

> *"Improvement is a trend line, not a data point. The research says teams should look at trends 80% of the time. This concept monitors the direction of all your other metrics."*

| Attribute | Details |
|---|---|
| **Metric** | Trend direction of all monitored concepts over a configurable rolling window |
| **Data source** | All prior concept metrics, aggregated over time |
| **Benchmarks** | Thriving: all metrics trending stable or improving. Steady: 1-2 metrics trending slightly down. Needs Attention: 3+ metrics trending down. |
| **Min sample** | 6+ scrims (enough for meaningful trend) |
| **How to improve** | "If multiple metrics are trending down, you may be overloaded with changes or fatigued. Focus on the metric that dropped most — stabilize it before expanding your focus. Remember: improvement is not linear. Plateaus and small regressions are normal." |

---

## 5. Monetization Boundary

| Tier | Concepts | Scope | Pricing |
|---|---|---|---|
| **Free** | 1-7 (Survival, Fight Fundamentals, Neutral Game) | Full functionality | Always free |
| **ScrimSight Plus** | 8-16 (Ult Economy, Fight Impact, Strategy, Growth) | Full functionality | Subscription |

### Why This Boundary Works

1. **Free tier delivers real, standalone value.** 7 concepts covering the fundamentals that every research document says matter most for amateur teams. Users will see concrete, measurable improvement before ever hitting the paywall.

2. **Plus tier unlocks depth, not basics.** By the time a player has mastered 7 concepts, they've proven engagement and are ready for advanced analysis. The ult economy and fight impact concepts are the most-requested analytical features in the coaching community.

3. **The data already exists.** The domain layer computes ult cycles, hold times, fight types — it's just never surfaced in UI. Plus is mostly a UI unlock and aggregation work, not new computation.

4. **Natural timing.** A team that scrims 3x/week would hit the paywall gate in roughly 2-3 weeks — enough time to build habit and see value, but not so long that engagement drops.

5. **Upgrade motivation is intrinsic.** "You've mastered the fundamentals — here's the next level" is a much better value proposition than "pay to unlock basic features." The player has context for WHY the advanced metrics matter because the free tier taught them the framework.

---

## 6. Implementation Considerations

### Data Requirements

| Concept | Domain Layer | UI Status | Work Needed |
|---|---|---|---|
| Deaths/10 | Computed | Displayed | Cross-scrim aggregation |
| TFWR | Computed | Partial (per-match) | Cross-scrim aggregation |
| First Death Rate | Computed | Per-match only | Cross-scrim aggregation, player-level rollup |
| First Pick Conversion | Computed | WinConditionCard | Cross-scrim aggregation |
| Resilience | Computed | WinConditionCard | Cross-scrim aggregation |
| Dry Fight Win Rate | Computed | Partially hidden | Surface in UI, cross-scrim aggregation |
| FB/Elim Ratio | Computed | Available in STAT_CONFIG | Cross-scrim aggregation |
| Ult Efficiency | Computed | **Not displayed** | Surface in UI, cross-scrim aggregation |
| Avg Time to Charge | Computed | **Not displayed** | Surface in UI, cross-scrim aggregation |
| Ult Win Rate | Computed | Per-match only | Cross-scrim aggregation |
| Ult Hold Time | Computed | **Not displayed** | Surface in UI, cross-scrim aggregation |
| Entry Pick Rate | Computed | Per-match only | Cross-scrim aggregation |
| Fight Type Win Rates | Computed | **Not displayed** | Surface in UI, cross-scrim aggregation |
| Map Win Rates | Computed | TeamOverview | Cross-scrim aggregation |
| Comp Classification | Python only | Not in TS | Port classifier to TypeScript |
| Trend Analysis | Partial | HomePage/Player | Extend to all concepts |

**Common theme:** The biggest implementation task is **cross-scrim aggregation** — computing rolling metrics across the last N scrims rather than per-match. This needs a new aggregation layer, likely in the domain or hooks layer.

### Benchmark Data Pipeline

Benchmarks should be derived from the Parsertime dataset using the existing analysis notebooks:
1. Run notebooks 02 (ult economy), 04 (D/10), and new notebooks for the remaining metrics
2. Extract percentile distributions by role and hero
3. Export as a JSON file that ScrimSight loads as benchmark configuration
4. This allows benchmarks to be updated independently of the app code

### Composition Classifier

Port from Python to TypeScript:
- Each hero has an archetype affinity: `{ Winston: 'Dive', Reinhardt: 'Brawl', Sigma: 'Poke', ... }`
- A composition's archetype = the dominant affinity among its 5 heroes
- If no clear majority (e.g., 2 Dive + 2 Brawl + 1 Poke): classify as "Mixed"
- Output: `'Pure Dive' | 'Pure Brawl' | 'Pure Poke' | 'Hybrid Dive/Brawl' | 'Hybrid Dive/Poke' | 'Hybrid Brawl/Poke' | 'Mixed'`
- Input: from `heroSwap` + `heroSpawn` events (existing in MatchEvents) — use the hero with the most playtime per player per round

---

## 7. Remaining Research Gaps

### Must-Resolve Before Implementation

1. **Hero-specific ult hold time benchmarks.** Notebook 02 has charge times but not hold times. Need a new analysis pass on the Parsertime dataset to compute hold time percentiles by hero.

2. **FB/Elim ratio benchmarks by role.** The synthesis notebook mentions this metric but doesn't compute role-specific percentiles. Need a targeted analysis.

3. **Entry pick rate distribution.** Need to compute what "normal" entry pick rates look like by role from the dataset to set thresholds.

4. **Regroup discipline metric.** Every research document calls this top-3 most important. Can we derive it from time gaps between teamfights? This would be a valuable addition to Tier 2 or 3 if feasible.

### Nice-to-Have Research

5. **Win rate by comp × map type.** The analysis pipeline has comp classification and map types — crossing them would power a more advanced version of Concept 15.

6. **Statistical significance calculator.** The exact minimum sample sizes depend on the variance in each metric. Run a power analysis on the dataset to set principled minimums.

7. **Assist correlation deep-dive.** The synthesis notebook found that assists correlate with winning. Could become a concept: "Enable Your Team" (offensive + defensive assists per 10).

### UX Research Needed

8. **User testing of the status indicator language.** "Thriving / Steady / Needs Attention" needs validation with real users. Does it feel motivating? Too soft? Too corporate?

9. **Agency vs. guidance balance.** How much should users be able to customize their path? Current design: they can choose their active focus within unlocked concepts, but can't skip tiers. Test whether this feels empowering or restrictive.

10. **Coach vs. player experience.** The scope toggle (team vs. player) is a good start, but coaches may want to see all players' training paths side by side. Design the multi-player coach view.
