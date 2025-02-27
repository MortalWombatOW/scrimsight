# Migration from Material UI and Mantine to Tailwind CSS

## Overview

This task involves migrating the Scrimsight application from using Material UI and Mantine UI frameworks to using Tailwind CSS for styling. This will simplify the styling approach and reduce dependencies.

## Current State

- The application uses Material UI (`@mui/material` and related packages) for most components
- Mantine UI (`@mantine/core` and related packages) is also used for theming and some components
- Both frameworks have their own styling systems that we want to replace with Tailwind CSS

## Migration Plan

### Step 1: Set up Tailwind CSS

- Install Tailwind CSS and its dependencies
- Configure Tailwind CSS with the project
- Create a base configuration that matches our current theme colors

### Step 2: Create a Common Component Library

- Identify the most commonly used Material UI and Mantine components
- Create Tailwind CSS equivalents for these components
- Ensure the new components match the current design system

### Step 3: Migrate Components

- Start with simpler components (like StatCard, CompositionCard)
- Gradually migrate more complex components
- Ensure that the migrated components maintain their functionality and appearance

### Step 4: Update App Layout and Theming

- Remove Material UI ThemeProvider and Mantine Provider
- Create a Tailwind-based theme system
- Update the main Layout component

### Step 5: Clean Up Dependencies

- Remove unused Material UI and Mantine packages
- Update imports throughout the codebase
- Optimize bundle size

### Step 6: Testing and Refinement

- Test all components in different scenarios
- Fix any styling issues or inconsistencies
- Ensure responsive design works correctly

### Step 7: Documentation

- Update documentation to reflect the new styling approach
- Create guidelines for using Tailwind CSS in the project

## Migration Checklist

### Basic Components

- [x] `src/components/StatCard.tsx` (Card, CardContent, Typography, Box)
- [x] `src/components/CompositionCard.tsx` (Box, Card, Typography, Stack)
- [x] `src/components/TeamCard.tsx` (Card, CardContent, Typography, Grid, Box, Avatar)
- [x] `src/components/Common/IconAndText.tsx` (Button, Popover, Typography)
- [x] `src/components/ControlPanel/RoleCheckbox.tsx` (Checkbox)
- [x] `src/components/ControlPanel/TimeRangeSlider.tsx` (Slider)
- [x] `src/components/LoadFilesButton.tsx` (Button)
- [x] `src/components/PlayerList/PlayerList.tsx` (Card, CardContent, Typography)
- [x] `src/components/StatPercentage.tsx`
- [x] `src/components/EmptyState.tsx`
- [x] `src/components/SectionHeading.tsx`
- [x] `src/components/SplitButton.tsx`

### Common Layout Components

- [x] `src/components/Layout/Layout.tsx` (AppShell, NavLink, Stack from Mantine)
- [x] `src/components/Layout/Navigation.tsx` (AppShell, NavLink, Stack from Mantine)
- [x] `src/components/ControlPanel/RoleControl.tsx` (FormControlLabel, FormGroup, Typography)
- [x] `src/components/ControlPanel/IconAutocomplete.tsx` (Autocomplete, Box, Checkbox, Chip, TextField, Typography)
- [x] `src/components/Common/RoleIcon.tsx` (Various icons from Material UI)
- [x] `src/components/Layout/Header.tsx`
- [x] `src/components/Layout/Sidebar.tsx`
- [x] `src/components/Layout/Footer.tsx`

### Player Components

- [x] `src/components/Player/PlayerMatchHistory.tsx`
- [x] `src/components/Player/PlayerDetailedStats.tsx`
- [x] ~~`src/components/Player/PlayerComparisonDialog.tsx`~~
- [x] ~~`src/components/Player/PlayerHeroBreakdown.tsx`~~

### Page Layouts

- [x] `src/pages/Home/HomePage.tsx`
- [x] `src/pages/ZeroState/ZeroState.tsx`
- [x] `src/pages/Teams/TeamsPage.tsx`
- [x] `src/pages/Teams/components/TeamsFilter.tsx`
- [x] `src/pages/Teams/components/TeamsList.tsx`
- [x] `src/pages/Teams/components/TeamsSummaryStats.tsx`
- [x] `src/pages/Player/PlayerPage.tsx`
- [x] `src/pages/Players/PlayersPage.tsx`

### Complex Components

- [x] `src/pages/Players/components/PlayerStatsGrid.tsx`
- [x] `src/pages/Players/components/TopPlayersSection.tsx`
- [x] `src/pages/Players/components/PlayerPerformanceMetrics.tsx`
- [x] `src/pages/Players/components/HeroPoolAnalysis.tsx`
- [x] `src/pages/Players/components/HeroDistributionChart.tsx`
- [x] `src/pages/SplashPage/SplashPage.tsx`
- [x] `src/pages/SplashPage/SplashRow.tsx`
- [x] `src/pages/Team/TeamCompositions.tsx`
- [x] `src/pages/Team/TeamPage.tsx`
- [x] `src/pages/AddFiles/AddFilesPage.tsx`

### Mantine-specific Components

- [x] `src/pages/Match/components/comparison/SingleStatPlayerComparison.tsx`
- [x] `src/pages/Match/components/comparison/AllPlayerComparison.tsx`
- [x] `src/pages/Match/components/timeline/Timeline.tsx`
- [x] `src/pages/Match/components/stats/PlayerStatsComparison.tsx`
- [x] `src/pages/Match/components/scorecard/MatchScoreCard.tsx`
- [x] `src/pages/Match/components/stats/PlayerStatsCard.tsx`
- [x] `src/pages/Match/components/stats/TeamStatsComparison.tsx`
- [x] `src/pages/Matches/Matches.tsx`
- [x] `src/pages/Auth/CallbackPage.tsx`
- [x] `src/components/KillsTable/KillsTable.tsx`
- [x] `src/pages/Match/MatchPage2.tsx`

### Theme Configuration

- [x] `src/App.tsx` (removed ThemeProvider from Material UI, MantineProvider, and theme configuration)

## Success Criteria

- All UI components render correctly with Tailwind CSS
- No dependencies on Material UI or Mantine UI remain (except potentially for specific advanced components)
- The application maintains its current look and feel
- Bundle size is reduced
- No regressions in functionality

## Challenges and Considerations

- Material UI and Mantine provide complex components (DataGrid, Charts, etc.) that might be challenging to replace
- Ensuring consistent spacing, colors, and typography across the application
- Maintaining accessibility features present in the original UI libraries
