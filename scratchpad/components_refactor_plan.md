# Components Refactor Plan

## Overview
This document outlines the plan to bring the `src/components/` folder into compliance with the new project structure rules enforced by `eslint-plugin-project-structure`.

## Critical Violations Found

### 1. **Folder Structure Violations**
**Problem**: ESLint rules require components to be flat files in `src/components/` - no subfolders allowed.

**Current Structure (INVALID):**
```
src/components/
├── Card/           ❌ Folder not allowed
├── Common/         ❌ Folder not allowed  
├── Container/      ❌ Folder not allowed
├── ControlPanel/   ❌ Folder not allowed
├── Heatmap/        ❌ Folder not allowed
├── Icons/          ❌ Folder not allowed
├── KillsTable/     ❌ Folder not allowed
├── Layout/         ❌ Folder not allowed
├── Timeline/       ❌ Folder not allowed
```

**Required Structure:**
```
src/components/
├── index.tsx                    ✅ Required
├── ComponentName.tsx            ✅ Required for each component
├── ComponentName.stories.tsx    ✅ Required for each component
```

### 2. **Missing Storybook Files**
Components without required `.stories.tsx` files:
- `CompositionCard.tsx` → needs `CompositionCard.stories.tsx`
- `LoadFilesButton.tsx` → needs `LoadFilesButton.stories.tsx`  
- `ProgressBar.tsx` → needs `ProgressBar.stories.tsx`
- `StatCard.tsx` → needs `StatCard.stories.tsx`

### 3. **Import/Export Pattern Violations**
- Direct imports from specific atom files instead of `@atoms` index
- Missing `@lib` exports in lib index
- Components importing from non-index files

## Solution Strategy

### Phase 1: Flatten Structure & Consolidate
1. **Move all components to flat structure** with descriptive names
2. **Create missing Storybook files**
3. **Update component index.tsx** for proper exports

### Phase 2: Fix Import/Export Issues  
1. **Update atoms/index.ts** to export missing types/atoms
2. **Update lib/index.ts** to export missing utilities
3. **Fix component imports** to use index-only imports

### Phase 3: Rename Components for Clarity
Flatten folder-based components with descriptive names:

#### Card Components
```
Card/CardBase.tsx → CardBase.tsx
Card/MatchCard.tsx → MatchCard.tsx  
Card/PlayerCard.tsx → PlayerCard.tsx
Card/ScrimCard.tsx → ScrimCard.tsx
Card/TeamCard.tsx → TeamCard.tsx
```

#### Common Components
```
Common/ErrorMessage.tsx → ErrorMessage.tsx
Common/IconAndText.tsx → IconAndText.tsx
Common/RoleIcon.tsx → RoleIcon.tsx
Common/RoleIconSvg.tsx → RoleIconSvg.tsx
```

#### Control Panel Components
```
ControlPanel/IconAutocomplete.tsx → IconAutocomplete.tsx
ControlPanel/RoleCheckbox.tsx → RoleCheckbox.tsx
ControlPanel/RoleControl.tsx → RoleControl.tsx
ControlPanel/TimeRangeSlider.tsx → TimeRangeSlider.tsx
```

#### Icon Components
```
Icons/BeamsAuraIcon.tsx → BeamsAuraIcon.tsx
Icons/GhostAllyIcon.tsx → GhostAllyIcon.tsx
Icons/GrimReaperIcon.tsx → GrimReaperIcon.tsx
Icons/HealingIcon.tsx → HealingIcon.tsx
Icons/MacheteIcon.tsx → MacheteIcon.tsx
Icons/UpCardIcon.tsx → UpCardIcon.tsx
```

#### Layout Components
```
Layout/Layout.tsx → Layout.tsx
Layout/Navigation.tsx → Navigation.tsx
Layout/SubPageNavigation.tsx → SubPageNavigation.tsx
```

#### Timeline Components
```
Timeline/Timeline.tsx → Timeline.tsx
Timeline/TimelineButton.tsx → TimelineButton.tsx
Timeline/TimelineContext.tsx → TimelineContext.tsx
Timeline/TimelineControls.tsx → TimelineControls.tsx
Timeline/TimelineDisplay.tsx → TimelineDisplay.tsx
Timeline/TimelineEvents.tsx → TimelineEvents.tsx
Timeline/TimelineTable.tsx → TimelineTable.tsx
Timeline/TimeSegmentDisplay.tsx → TimeSegmentDisplay.tsx
```

#### Single Components
```
Container/Container.tsx → Container.tsx
Heatmap/HeatmapGrid.tsx → HeatmapGrid.tsx
KillsTable/KillsTable.tsx → KillsTable.tsx
```

## Implementation Steps

### Step 1: Backup and Create Missing Stories
1. Create missing `.stories.tsx` files for loose components
2. Ensure all existing stories are preserved

### Step 2: Flatten Component Structure
1. Move all components from subfolders to `src/components/` root
2. Rename components to avoid conflicts
3. Update internal component imports

### Step 3: Fix Import/Export Issues
1. Update `src/atoms/index.ts` to export missing atoms and types
2. Update `src/lib/index.ts` to export missing utilities
3. Update component imports to use only index imports (`@atoms`, `@lib`, `@components`)

### Step 4: Update Component Index
1. Create/update `src/components/index.tsx` with all component exports
2. Ensure proper TypeScript types are exported

### Step 5: Update Pages and Other Consumers
1. Update all imports in `src/pages/` to use new component names
2. Update any other files that import components

## Implementation Priority

| Priority | Task | Reasoning |
|----------|------|-----------|
| **HIGH** | Fix folder structure violations | Blocks ESLint completely |
| **HIGH** | Create missing Storybook files | Required by project rules |
| **MEDIUM** | Fix import/export issues | Blocks TypeScript compilation |
| **LOW** | Update component index | Improves developer experience |

## Validation

After implementation, validate with:
```bash
./check-lint-build-errors.sh src/components/
npm test -- src/components/
npm run storybook  # Verify stories still work
```

## Risks and Considerations

1. **Breaking Changes**: Moving components will break existing imports
2. **Story Loss**: Must preserve existing Storybook stories during move
3. **Timeline Complexity**: Timeline components have complex interdependencies
4. **Import Chains**: Some components may have deep import dependencies

## Success Criteria

- [ ] All ESLint folder-structure errors resolved
- [ ] All components have required `.stories.tsx` files
- [ ] All TypeScript compilation errors resolved
- [ ] All existing functionality preserved
- [ ] All tests pass
- [ ] Storybook builds and displays all components correctly