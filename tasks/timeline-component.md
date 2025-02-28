# Timeline Component Implementation

## Overview

Design and implement a high-performance Timeline component to visualize match flow in Scrimsight. The component will display player events and interactions chronologically, using THREE.js for optimal performance while maintaining an elegant, clear interface.

## Problem

Users need a way to visualize and understand the flow of a match, including all player events and interactions. The current interface doesn't provide a clear temporal view of match progression, making it difficult to analyze performance patterns and key moments.

## Implementation Plan

### Phase 1: Project Setup and Data Integration

- [x] Update `tasks/index.md` to include this task
- [x] Create basic component files:
  - [x] `src/components/Timeline/Timeline.tsx` (main container)
  - [x] `src/components/Timeline/TimelineRenderer.tsx` (THREE.js implementation)
  - [x] `src/components/Timeline/TimelineControls.tsx` (UI controls)
  - [x] `src/components/Timeline/TimelineDetails.tsx` (details panel)
- [x] Create custom hooks for data handling:
  - [x] `src/components/Timeline/hooks/useTimelineData.ts` (data processing)
  - [x] `src/components/Timeline/hooks/useTimelineInteractions.ts` (interaction logic)
- [x] Set up data integration with Jotai atoms:
  - [x] Connect to `mapTimesAtom` for match timing data
  - [x] Connect to `playerEventsAtom` for individual player events
  - [x] Connect to `playerInteractionEventsAtom` for player interactions
- [x] Implement data transformation utilities:
  - [x] Create normalized data structure for efficient rendering
  - [x] Add indexing by time, player, and event type
  - [x] Implement memoization for derived data

### Phase 2: Basic Timeline Visualization

- [x] Set up THREE.js canvas integration:
  - [x] Initialize react-three-fiber setup
  - [x] Configure camera and viewport
  - [x] Implement basic zooming and panning controls
- [x] Create basic timeline rendering:
  - [x] Implement time axis with appropriate scale
  - [x] Add player lanes (one per player)
  - [x] Render simple event markers (dots/circles)
- [ ] Implement basic visual structure:
  - [x] Add grid/reference lines for time intervals
  - [x] Create distinct visual separation between teams
  - [x] Add match start/end indicators
  - [ ] Implement round time indicators

### Phase 3: Advanced Visualization Features

- [x] Enhance event markers:
  - [x] Create different shapes/icons for different event types
  - [x] Implement size variations for event importance
  - [x] Add hover states for interactive elements
- [x] Implement connection visualization:
  - [x] Add lines between related events
  - [x] Create visual distinctions for different types of interactions
  - [ ] Optimize line rendering for performance
- [x] Add visual hierarchy:
  - [x] Implement greyscale design with clear contrast levels
  - [x] Use size, weight, and shade to establish hierarchy
  - [x] Add subtle shadows for depth

### Phase 4: Interactivity and Controls

- [x] Implement selection mechanics:
  - [x] Add raycasting for object selection
  - [x] Create highlight effects for selected events
  - [x] Implement multi-select capability
- [x] Build filtering controls:
  - [x] Add player/team filters
  - [x] Create event type filters
  - [x] Implement time range selection
- [x] Create details panel:
  - [x] Design layout for event details
  - [x] Add context information for selected events
  - [x] Implement related events navigation

### Phase 5: Performance Optimization

- [ ] Implement rendering optimizations:
  - [ ] Add instanced rendering for similar objects
  - [ ] Implement frustum culling for off-screen elements
  - [ ] Add level-of-detail adjustments based on zoom level
- [x] Optimize React integration:
  - [x] Minimize state updates using refs where appropriate
  - [x] Implement batch updates for UI changes
  - [x] Use memo and callbacks to prevent unnecessary renders
- [ ] Add virtualization for large datasets:
  - [ ] Implement time-window based rendering
  - [ ] Add dynamic loading/unloading of events
  - [ ] Create efficient caching mechanism

### Phase 6: Testing and Refinement

- [ ] Implement comprehensive testing:
  - [ ] Test with various dataset sizes
  - [ ] Verify performance on different devices
  - [ ] Validate user interactions work as expected
- [ ] Gather user feedback:
  - [ ] Conduct usability testing
  - [ ] Identify pain points and confusion areas
- [ ] Refine based on feedback:
  - [ ] Adjust visual design for clarity
  - [ ] Optimize interaction patterns
  - [ ] Enhance performance where needed

## Notes

- Focus on maintaining the separation of concerns - data processing in atoms, visualization in components
- Keep THREE.js logic isolated from React state management
- Prioritize performance at all stages of implementation
- Follow the greyscale design principle while ensuring clear visual hierarchy

## Implementation Progress

- [x] Initial implementation of all core components
- [x] Refactored THREE.js implementation to use react-three-fiber for better React integration
- [x] Implemented multi-select capability in the interaction system
- [ ] Add proper text rendering for player names in the visualization (currently uses placeholder shapes)
- [ ] Implement round time indicators
- [ ] Add instanced rendering for performance optimization

## Next Steps

1. Add text rendering for player names using Troika or similar library
2. Implement round time indicators to show round transitions
3. Add virtualization for large datasets to improve performance
4. Test with real match data to ensure performance and accuracy
5. Gather user feedback on usability and visualization clarity

## Implementation Issues to Resolve

- Need to install THREE.js and related dependencies:
  - `three`
  - `@types/three`
  - May need to install `@react-three/fiber` for better React integration
- The current THREE.js implementation uses direct imperative code; consider refactoring to use react-three-fiber for better React integration
- Implement full multi-select capability in the interaction system
- Add proper text rendering for player names in the visualization
- Improve time formatting for better readability
- Add proper event icons/shapes with better visual distinction
