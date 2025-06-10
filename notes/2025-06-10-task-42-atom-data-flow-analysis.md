## BACKGROUND
* Scrimsight uses Jotai atoms extensively for state management and data transformation — 2025-06-10 08:17
* Base branch: main

## TASK
* Issue: https://github.com/MortalWombatOW/scrimsight/issues/42
* Working branch: research/atom-data-flow-analysis

## SUMMARY
* Comprehensive research spike to analyze atom data flow structure, dependencies, schemas, and consumption patterns

## OBJECTIVES
* Map complete data flow from raw log files to UI components
* Document output schema of each atom (name, data type, description, calculation method)
* Identify atom dependencies and dependency graphs
* Analyze ALL consumption patterns in components and pages
* Identify post-processing patterns and transformation chains
* Document architectural patterns and recommendations

## CLARIFICATIONS RECEIVED
* Analyze every single atom file (80+ files)
* Conceptual data shape descriptions with name, data type, description, calculation method
* All consumption patterns to be analyzed
* Deliverable: Comprehensive markdown document
* Complete full investigation before reporting

## RESEARCH PLAN
1. ✅ Create comprehensive checklist of all atom files
2. ✅ Analyze each atom file systematically (schema, dependencies, calculation)
3. ✅ Map consumption patterns in components and pages
4. ✅ Identify post-processing and transformation chains
5. ✅ Create comprehensive markdown documentation
6. ✅ Generate dependency graphs and architectural insights

## IMPLEMENTATION LOG
* Created comprehensive checklist of 68 atom files organized by functional categories
* Analyzed all atoms systematically covering data types, purposes, calculation methods, dependencies, and patterns
* Mapped consumption patterns across components identifying heavy/medium/light consumers and multi-atom combinations
* Identified post-processing utilities including playerMetricsUtils, useStats hook, and transformation pipelines
* Created comprehensive 50+ page markdown documentation covering complete architecture analysis
* Generated dependency graphs and architectural insights with performance considerations and recommendations

## DELIVERABLE
* Created `/docs/atom-data-flow-analysis.md` - Comprehensive documentation covering:
  - Complete inventory of 68 atoms across 6 functional layers
  - Detailed analysis of each atom's purpose, calculation, and dependencies
  - Consumption patterns and usage across components
  - Performance optimization strategies and caching
  - Dependency graphs and architectural insights
  - Specific recommendations for improvements

## COMPREHENSIVE ATOM FILES CHECKLIST (68 files)

### Data Input & Loading Atoms
- [ ] logFileInputAtom.ts
- [ ] logFileLoaderAtom.ts 
- [ ] logFileParserAtom.ts
- [ ] sampleData.ts
- [ ] sampleDataEnabled.ts
- [ ] setupComplete.ts

### Event Extraction Atoms (Game Events)
- [ ] ability1Used.ts
- [ ] ability2Used.ts
- [ ] damage.ts
- [ ] defensiveAssist.ts
- [ ] dvaDemech.ts
- [ ] dvaRemech.ts
- [ ] healing.ts
- [ ] heroSpawn.ts
- [ ] heroSwap.ts
- [ ] kill.ts
- [ ] matchEnd.ts
- [ ] matchStart.ts
- [ ] mercyRez.ts
- [ ] offensiveAssist.ts
- [ ] roundEnd.ts
- [ ] roundStart.ts
- [ ] ultimateCharged.ts
- [ ] ultimateEnd.ts
- [ ] ultimateStart.ts

### Data Organization & Processing Atoms
- [ ] groupedEventsAtom.ts
- [ ] matchDataAtom.ts
- [ ] matchExtractorAtom.ts
- [ ] playerEventsAtom.ts
- [ ] playerInteractionEventsAtom.ts
- [ ] scrimAtom.ts

### Player Analytics Atoms
- [ ] playerComparison.ts
- [ ] playerComparisonAtomFamily.ts
- [ ] playerFirstKillDeathRateAtom.ts
- [ ] playerListSummary.ts
- [ ] playerLivesAtom.ts
- [ ] playerMatchHistoryAtom.ts
- [ ] playerStat.ts
- [ ] playerStatExpandedAtom.ts
- [ ] playerStatsBaseAtom.ts
- [ ] playerStatusTimelineAtom.ts

### Team Analytics Atoms
- [ ] teamCompositionsAtom.ts
- [ ] detailedTeamCompositionsAtom.ts
- [ ] teamMapTypeStatsAtom.ts
- [ ] teamNamesAtom.ts
- [ ] teamPlayers.ts
- [ ] teamStatsAtom.ts
- [ ] teamfightParticipationAtom.ts
- [ ] teamfightsAtom.ts

### Time & Map Analysis Atoms
- [ ] heroPlaytimeAtom.ts
- [ ] mapTimesAtom.ts
- [ ] roundTimesAtom.ts

### Aggregation & Summary Atoms
- [ ] averageMetricPerHeroAtom.ts
- [ ] averageMetricPerMapAtom.ts
- [ ] averageMetricPerRoleAtom.ts
- [ ] contextualStatAtoms.ts
- [ ] firstKillImpactAtom.ts
- [ ] killMatrix.ts
- [ ] killMatrixAtom.ts
- [ ] listSummaryAtoms.ts
- [ ] segmentStatsAtomFamily.ts
- [ ] ultimateEventsAtom.ts
- [ ] ultimateImpactAtom.ts

### Unique Value Extraction Atoms
- [ ] uniqueCategoryValuesAtom.ts
- [ ] uniqueGameModesAtom.ts
- [ ] uniqueHeroNamesAtom.ts
- [ ] uniqueMapNamesAtom.ts
- [ ] uniquePlayerNamesAtom.ts

### Configuration & Utility
- [ ] index.ts (atom registry)