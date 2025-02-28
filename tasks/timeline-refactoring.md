# Timeline Component Refactoring Plan

## Overview

The current Timeline component implementation has grown complex and needs to be refactored to improve maintainability, performance, and adherence to React best practices. This document outlines a detailed plan for refactoring the Timeline component files according to best practices and common patterns.

## Current Issues

After analyzing the codebase, the following issues have been identified:

1. **Component Size and Responsibility**: Components like `TimelineRenderer.tsx` are too large (951 lines) and have too many responsibilities.
2. **Prop Drilling**: Excessive props are being passed down through component hierarchies.
3. **Inconsistent Hook Usage**: Some hooks could be better optimized or refactored.
4. **Redundant State Management**: Some state is duplicated or could be better managed.
5. **Unfinished Features**: Several features mentioned in the task list are still incomplete.
6. **Performance Optimization**: The code lacks some key performance optimizations.
7. **Code Organization**: Logic is sometimes mixed between rendering and data processing.

## Refactoring Principles

The refactoring will follow these principles:

1. **Single Responsibility**: Each component should have a clear, single responsibility.
2. **Clean Component Hierarchy**: Establish a clear component hierarchy with proper data flow.
3. **Custom Hooks for Logic**: Extract logic into custom hooks for reusability and separation of concerns.
4. **Consistent Naming**: Apply consistent naming conventions across files and components.
5. **Performance Optimization**: Implement memoization, virtualization, and other performance techniques.
6. **Tailwind Best Practices**: Follow the project's UI guidelines for styling.
7. **Code Splitting**: Break down large files into manageable, focused components.

## Detailed Refactoring Plan

### 1. Restructure the Component Hierarchy

#### Current Structure:

```
Timeline/
  ├── Timeline.tsx
  ├── TimelineRenderer.tsx
  ├── TimelineControls.tsx
  ├── TimelineDetails.tsx
  └── hooks/
      ├── useTimelineData.ts
      └── useTimelineInteractions.ts
```

#### Proposed Structure:

```
Timeline/
  ├── Timeline.tsx (Main container)
  ├── components/
  │   ├── TimelineRenderer/
  │   │   ├── TimelineRenderer.tsx (Main renderer component)
  │   │   ├── TimelineScene.tsx (THREE.js scene)
  │   │   ├── TimelineMarker.tsx (Event marker)
  │   │   ├── TimelineConnection.tsx (Event connection)
  │   │   ├── TimelineLane.tsx (Player lane)
  │   │   └── TimelineAxis.tsx (Time axis)
  │   ├── TimelineControls/
  │   │   ├── TimelineControls.tsx (Main controls container)
  │   │   ├── TimelineSlider.tsx (Time slider)
  │   │   └── TimelineFilters.tsx (Filter controls)
  │   └── TimelineDetails/
  │       ├── TimelineDetails.tsx (Main details container)
  │       ├── EventCard.tsx (Event details card)
  │       └── RelatedEvents.tsx (Related events section)
  └── hooks/
      ├── useTimelineData.ts (Data processing)
      ├── useTimelineFilters.ts (Filter management)
      ├── useTimelineInteractions.ts (Interaction handling)
      ├── useTimelineSelection.ts (Selection management)
      └── useTimelineRendering.ts (THREE.js rendering helpers)
```

### 2. Component-Specific Refactoring

#### 2.1 Timeline.tsx

- **Current issues**: Handles too many state changes and filter logic
- **Changes**:
  - Move filter state into a dedicated hook (`useTimelineFilters`)
  - Move selection state into a dedicated hook (`useTimelineSelection`)
  - Keep only top-level state and pass custom hooks to children
  - Add proper context management if necessary

#### 2.2 TimelineRenderer.tsx

- **Current issues**: Too large (951 lines), mixes rendering, animation, and interaction logic
- **Changes**:
  - Split into smaller components:
    - `TimelineRenderer.tsx`: Container component with Canvas
    - `TimelineScene.tsx`: Scene configuration and camera setup
    - `TimelineMarker.tsx`: Event marker visualization
    - `TimelineConnection.tsx`: Connection visualization between events
    - `TimelineLane.tsx`: Player lane visualization
    - `TimelineAxis.tsx`: Time axis with ticks and labels
  - Move animation logic to `AnimatedConnection.tsx`
  - Optimize render performance with instancing where possible

#### 2.3 TimelineControls.tsx

- **Current issues**: Mixes slider and filter UI
- **Changes**:
  - Split into:
    - `TimelineControls.tsx`: Container
    - `TimelineSlider.tsx`: Time range selector
    - `TimelineFilters.tsx`: Player/event filters (if needed)
  - Extract state logic to custom hooks

#### 2.4 TimelineDetails.tsx

- **Current issues**: Monolithic event details display
- **Changes**:
  - Split into:
    - `TimelineDetails.tsx`: Container
    - `EventCard.tsx`: Single event details
    - `RelatedEvents.tsx`: Related events list
  - Improve rendering of complex event data

### 3. Hook Refactoring

#### 3.1 useTimelineData.ts

- **Current issues**: Very large and handles multiple concerns
- **Changes**:
  - Break down into smaller, more focused hooks:
    - `useTimelineData.ts`: Core data processing
    - `useTimelineEvents.ts`: Event processing
    - `useTimelineConnections.ts`: Connection processing
  - Optimize memoization for better performance

#### 3.2 useTimelineInteractions.ts

- **Current issues**: Handles all interactions
- **Changes**:
  - Split into:
    - `useTimelineInteractions.ts`: Core interaction logic
    - `useTimelineSelection.ts`: Selection state management
    - `useTimelineHover.ts`: Hover state management

#### 3.3 New Hooks

- Create `useTimelineFilters.ts` for filter state and logic
- Create `useTimelineRendering.ts` for THREE.js rendering utilities
- Create `useTimelineVirtualization.ts` for event virtualization

### 4. Performance Optimizations

1. **Implement Instanced Rendering**: Use THREE.js instanced meshes for event markers
2. **Add Frustum Culling**: Only render objects within the camera viewport
3. **Implement Virtualization**: Only process visible time ranges
4. **Optimize State Updates**: Minimize React re-renders with proper memoization
5. **Optimize THREE.js Scene**: Reuse geometries, materials, and textures

### 5. Implement Missing Features

1. **Text Rendering**: Add proper text rendering for player names
2. **Round Time Indicators**: Implement round transition markers
3. **Level-of-Detail Adjustments**: Show fewer details when zoomed out

## Implementation Approach

This refactoring should be done incrementally to maintain a working application throughout:

1. First, reorganize the folder structure
2. Extract smaller components from larger ones
3. Create new hooks and move logic
4. Update imports and connections
5. Implement performance optimizations
6. Add missing features

## Timeline Component Refactoring

### Phase 1: Reorganize Structure ✅

- [x] Create index files for components and hooks
- [x] Update import paths in existing files
- [x] Ensure all components are properly exported

### Phase 2: Timeline.tsx Refactoring ✅

- [x] Create useTimelineFilters hook
- [x] Create useTimelineSelection hook
- [x] Refactor Timeline.tsx to use the new hooks

### Phase 3: TimelineRenderer.tsx Refactoring ✅

- [x] Extract TimelineScene component
- [x] Extract TimelineMarker component
- [x] Extract TimelineConnection component
- [x] Extract TimelineLane component
- [x] Extract TimelineAxis component
- [x] Refactor TimelineRenderer.tsx to use the new components

### Phase 4: Additional Improvements ⬜

- [ ] Add unit tests for hooks
- [ ] Add documentation
- [ ] Performance optimizations

## Phase 3 Summary

In Phase 3, we successfully refactored the TimelineRenderer component by breaking it down into smaller, more focused components:

1. **TimelineScene**: The main scene component that coordinates all visual elements and handles interactions.
2. **TimelineMarker**: Renders individual event markers with appropriate shapes and colors.
3. **TimelineConnection**: Handles the animated connections between related events.
4. **TimelineLane**: Renders player lanes and labels.
5. **TimelineAxis**: Displays time ticks and labels.

This refactoring has several benefits:

- Improved code organization and readability
- Better separation of concerns
- Easier maintenance and testing
- More reusable components
- Clearer component responsibilities

The main TimelineRenderer component is now much simpler, focusing only on setting up the Canvas and passing props to the TimelineScene component.

## Conclusion

This refactoring will significantly improve the maintainability, performance, and user experience of the Timeline component. By breaking down large components into smaller, more focused ones and applying proper separation of concerns, the codebase will become easier to understand, extend, and optimize.

The approach maintains compatibility with the existing application while incrementally improving the code structure and adding missing features.
