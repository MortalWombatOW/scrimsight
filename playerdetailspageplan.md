# Plan for Refactoring PlayerDetailsPage

This document outlines a detailed plan to refactor the `PlayerDetailsPage` to align with the project's architectural goals, as described in the `README.md`.

## 1. Data to be Presented

The page will be structured around the three key areas of player analysis defined in the `README.md`:

### Overall Performance Summary
- **Key Performance Indicators (KPIs):** A set of `CardStat` components will display the player's most important stats (e.g., K/D ratio, damage/10min, healing/10min).
- **Performance Trend:** A line chart will show the player's performance trend over time, plotting a key metric across all their matches.

### Role-Specific Analysis
- **Role Performance Comparison:** A radar chart will compare the player's stats against the average for their primary role, showing their strengths and weaknesses.
- **Ultimate Usage:** A section with `CardStat`s will detail ultimate-related statistics, such as `ultimateChargeTime`, `ultKills`, and `deathsWithUltAvailable`.

### Hero Pool & Versatility
- **Best Heroes:** A bar chart will display the player's win rate or a calculated performance score for each hero they play, highlighting their most effective picks.
- **Hero Performance Table:** A filterable data table will show detailed performance stats for each hero played, allowing for in-depth analysis.

## 2. Data Model Analysis

The existing `ScrimsightDataModel` is comprehensive and **does not require any modifications**. All the data needed for the planned page is already available or can be derived from the existing model.

- **KPIs and Trends:** The `playerStatBreakdown` and `playerStatBreakdownRanks` objects provide all necessary stats. The `byTeamAndPlayerAndMatch` breakdown can be used to generate trend data.
- **Role-Specific Data:** The `playerStatBreakdown.byRole` breakdown allows for direct comparison against role averages. The extensive `PlayerStatsDerivedNumericalKeys` include all the necessary ultimate usage stats.
- **Hero Data:** The `playerStatBreakdown.byPlayerAndHero` breakdown provides the data needed for the hero performance charts and tables.

## 3. Component Usage and Creation

### Reusable Components
The following existing components from `src/components` will be used:
- `ScrimsightPage`: Main page container.
- `PageHeader`: For the page title and breadcrumbs.
- `PageSection`: For structuring the different analysis sections.
- `CardStat`: To display individual KPIs and stats.
- `ScrimCard`: For the "Recent Scrims" section.
- `HeroIcon`, `RoleIcon`, `TeamColorDot`: For visual identification.
- `ChartWrapper`: To display data in a chart.
- `DataTable`: For the hero performance table.

## 4. PlayerDetailsPage Refactoring

The `PlayerDetailsPage.tsx` file will be refactored to improve readability and maintainability by extracting UI logic into semantic components defined within the same file. The main page component will become a clean composition of these new components.

### New Semantic Components (in `PlayerDetailsPage.tsx`)
- **`PlayerPageHeader`**: Will manage the display of the page title, breadcrumbs, and player name.
- **`PlayerOverview`**: Will display the player's roles, top heroes, and teams, replacing the current scattered implementation.
- **`PerformanceSummary`**: Will contain the KPIs and the performance trend chart, corresponding to the "Overall Performance Summary."
- **`RoleAnalysis`**: Will house the role performance sections. They should be ranked by playtime, and not be shown if playtime for that player on that role is 0.
  - **`TankAnalysis`**: Will house the radar chart for tank performance and related stats.
  - **`DamageAnalysis`**: Will house the radar chart for damage performance and related stats.
  - **`SupportAnalysis`**: Will house the radar chart for support performance and related stats.
- **`HeroBreakdown`**: Will display the bar chart of the player's best heroes using `ChartWrapper` and the detailed hero performance table using `DataTable`.
- **`RecentActivity`**: Will show the list of recent scrims using the `ScrimCard` component.

The main `PlayerDetailsPage` component will then look something like this:

```tsx
const PlayerDetailsPage = () => {
  // ... data fetching and processing hooks ...

  return (
    <ScrimsightPage>
      <PlayerPageHeader playerName={playerName} />
      <PlayerOverview playerData={playerRelationship} />
      <PerformanceSummary stats={playerStats} history={playerHistory} />
      <RoleAnalysis stats={playerStats} roleAverage={roleAverageStats} />
      <HeroBreakdown heroStats={playerHeroStats} />
      <RecentActivity scrims={playerRecentScrims} />
    </ScrimsightPage>
  );
};
```

This structure will make the page's layout clear and easy to understand, with each semantic component responsible for a distinct part of the page.
