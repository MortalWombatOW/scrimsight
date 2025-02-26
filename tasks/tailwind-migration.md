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

- [ ] `src/components/StatCard.tsx` (Card, CardContent, Typography, Box)
- [ ] `src/components/CompositionCard.tsx` (Box, Card, Typography, Stack)
- [ ] `src/components/TeamCard.tsx` (Card, CardContent, Typography, Grid, Box, Avatar)
- [ ] `src/components/Common/IconAndText.tsx` (Button, Popover, Typography)
- [ ] `src/components/ControlPanel/RoleCheckbox.tsx` (Checkbox)
- [ ] `src/components/ControlPanel/TimeRangeSlider.tsx` (Slider)
- [ ] `src/components/LoadFilesButton.tsx` (Button)
- [ ] `src/components/PlayerList/PlayerList.tsx` (Card, CardContent, Typography)

### Common Layout Components

- [ ] `src/components/Layout/Layout.tsx` (AppShell, NavLink, Stack from Mantine)
- [ ] `src/components/Layout/Navigation.tsx` (AppShell, NavLink, Stack from Mantine)
- [ ] `src/components/ControlPanel/RoleControl.tsx` (FormControlLabel, FormGroup, Typography)
- [ ] `src/components/ControlPanel/IconAutocomplete.tsx` (Autocomplete, Box, Checkbox, Chip, TextField, Typography)
- [ ] `src/components/Common/RoleIcon.tsx` (Various icons from Material UI)

### Player Components

- [ ] `src/components/Player/PlayerOverviewCard.tsx` (Box, Typography, Card, CardContent, Avatar, Grid from Material, various icons)
- [ ] `src/components/Player/PlayerMatchHistory.tsx` (Card, CardContent, Typography, Grid)
- [ ] `src/components/Player/PlayerDetailedStats.tsx` (Card, CardContent, Typography, Grid, Box, icons)
- [ ] `src/components/Player/PlayerMetricsDashboard.tsx` (Box, Typography, Paper, Grid, Tabs, Tab)

### Page Layouts

- [ ] `src/pages/Home/HomePage.tsx` (Material UI components)
- [ ] `src/pages/Home/ZeroState.tsx` (Mantine components)
- [ ] `src/pages/Teams/TeamsPage.tsx` (Container, Typography, Box)
- [ ] `src/pages/Teams/components/TeamsVisualization.tsx` (Paper, Typography, Box)
- [ ] `src/pages/Teams/components/TeamsFilter.tsx` (Grid, Paper, TextField, MenuItem)
- [ ] `src/pages/Teams/components/TeamsList.tsx` (Grid)
- [ ] `src/pages/Teams/components/TeamsSummaryStats.tsx` (Grid, icons)
- [ ] `src/pages/Player/PlayerPage.tsx` (Box, Container, Grid)
- [ ] `src/pages/Players/PlayersPage.tsx` (Material UI components, icons)

### Complex Components

- [ ] `src/pages/Players/components/PlayerStatsGrid.tsx` (Box, Tooltip, Paper, TextField, MenuItem, InputAdornment, DataGrid, SearchIcon)
- [ ] `src/pages/Players/components/PlayerPerformanceMetrics.tsx` (Box, Paper, Typography)
- [ ] `src/pages/Players/components/HeroPoolAnalysis.tsx` (Box, Paper, Typography, LinearProgress)
- [ ] `src/pages/Players/components/TopPlayersSection.tsx` (Grid, Paper, Typography, Box, Avatar)
- [ ] `src/pages/Players/components/HeroDistributionChart.tsx` (Box, Paper, Typography, PieChart)
- [ ] `src/pages/SplashPage/SplashPage.tsx` (Box, Typography, Button)
- [ ] `src/pages/SplashPage/SplashRow.tsx` (Grid, Typography, Button, Box)
- [ ] `src/pages/Team/TeamCompositions.tsx` (Material UI components)
- [ ] `src/pages/Team/TeamPage.tsx` (Material UI components)
- [ ] `src/pages/AddFiles/AddFilesPage.tsx` (Container, Typography, Box, Button, List, ListItem, Paper, IconButton, Switch, DeleteIcon)

### Mantine-specific Components

- [ ] `src/pages/Match/components/comparison/SingleStatPlayerComparison.tsx` (Paper, Select, Stack, Title, BarChart)
- [ ] `src/pages/Match/components/comparison/AllPlayerComparison.tsx` (Group, Paper, Select, Stack, Title, ScatterChart)
- [ ] `src/pages/Match/components/timeline/Timeline.tsx` (Paper, Stack, hooks)
- [ ] `src/pages/Match/components/stats/PlayerStatsComparison.tsx` (Group, Paper, Stack, Title)
- [ ] `src/pages/Match/components/scorecard/MatchScoreCard.tsx` (Grid, Group, Paper, Stack, Text, Title)
- [ ] `src/pages/Match/components/stats/PlayerStatsCard.tsx` (Mantine components, BarChart, hooks)
- [ ] `src/pages/Match/components/stats/TeamStatsComparison.tsx` (Mantine components, BarChart)
- [ ] `src/pages/Matches/Matches.tsx` (Mantine components, DatePickerInput)
- [ ] `src/pages/Auth/CallbackPage.tsx` (Center, Loader, Text)
- [ ] `src/components/KillsTable/KillsTable.tsx` (Paper, Group, Title, Stack, Text, Grid, Center)
- [ ] `src/pages/Match/MatchPage2.tsx` (Title, Group, Grid, Paper, Stack, Text, Image)

### Theme Configuration (Last Step)

- [ ] `.storybook/preview.tsx` (ThemeProvider, CssBaseline from Material UI)
- [ ] `src/App.tsx` (ThemeProvider from Material UI, MantineProvider, createTheme from Mantine)

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
