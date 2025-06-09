# Pages Compliance Report

## Executive Summary

The `src/pages/` folder contains **critical violations** of the new project structure rules. All pages are organized in nested folders, but the ESLint rules require a **flat structure** with only `.tsx` and `.stories.tsx` files directly in `src/pages/`.

**Current Status**: ❌ **0% compliant** with new folder structure rules  
**Total Pages Analyzed**: 14 page files across 13 folders  
**Critical Issues**: 13 folder structure violations, 14 missing Storybook files

---

## Detailed Findings by Page

### 1. AddFiles Page
**Path**: `src/pages/AddFiles/AddFilesPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `AddFilesPage.stories.tsx`
**Suggested**: Rename to `AddFilesPage.tsx` in root, create story file  
**Effort**: S

### 2. Auth Callback Page  
**Path**: `src/pages/Auth/CallbackPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `CallbackPage.stories.tsx`
**Suggested**: Rename to `AuthCallbackPage.tsx` in root, create story file  
**Effort**: S

### 3. Home Page
**Path**: `src/pages/Home/HomePage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `HomePage.stories.tsx`
- ❌ Contains `ZeroState.tsx` component (should move to components)
- ❌ Has `index.ts` re-export file
**Suggested**: Rename to `HomePage.tsx` in root, move ZeroState to components, create story file  
**Effort**: M

### 4. Match Pages (Complex)
**Path**: `src/pages/Match/` (5 page files)  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing story files for all 5 pages
- ❌ Contains 3 subdirectories with 6 components (should move to main components folder)
- ❌ Complex nested routing structure
**Files**:
- `MatchOverviewPage.tsx` → `MatchOverviewPage.tsx`
- `MatchPage2.tsx` → `MatchPage.tsx` 
- `MatchPlayersPage.tsx` → `MatchPlayersPage.tsx`
- `MatchStatComparisonPage.tsx` → `MatchStatComparisonPage.tsx`
- `TimelinePage.tsx` → `MatchTimelinePage.tsx`
**Suggested**: Flatten all pages, move components to main components folder, create story files  
**Effort**: XL

### 5. MetricsExplorer Page
**Path**: `src/pages/MetricsExplorer/MetricsExplorerPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `MetricsExplorerPage.stories.tsx`
- ❌ Contains components/, hooks/, utils/ subdirectories (should move to appropriate folders)
- ⚠️ TypeScript any type violations
**Suggested**: Flatten page, redistribute components/hooks/utils, create story file  
**Effort**: L

### 6. Player Page
**Path**: `src/pages/Player/PlayerPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `PlayerPage.stories.tsx`
- ❌ Contains components/ subdirectory (3 files should move to main components)
- ❌ Has `index.ts` re-export file
**Suggested**: Flatten page, move components to main components folder, create story file  
**Effort**: M

### 7. Players Page
**Path**: `src/pages/Players/PlayersPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `PlayersPage.stories.tsx`
- ❌ Contains components/ subdirectory with 3 subdirectories (should move to main components)
- ❌ Has `index.ts` re-export file
**Suggested**: Flatten page, move 5 components to main components folder, create story file  
**Effort**: L

### 8. SchemaVisualizer Page
**Path**: `src/pages/SchemaVisualizer/SchemaVisualizerPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `SchemaVisualizerPage.stories.tsx`
- ❌ Most complex structure: components/, hooks/, services/, types/, utils/
- ❌ Has extensive supporting infrastructure
**Suggested**: Flatten page, redistribute all supporting files to appropriate folders, create story file  
**Effort**: XL

### 9. Scrim Page
**Path**: `src/pages/Scrim/ScrimPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `ScrimPage.stories.tsx`
**Suggested**: Rename to `ScrimPage.tsx` in root, create story file  
**Effort**: S

### 10. Scrims Page
**Path**: `src/pages/Scrims/ScrimsPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `ScrimsPage.stories.tsx`
- ❌ Contains components/ subdirectory (1 MatchCard component)
**Suggested**: Flatten page, move MatchCard to main components (may conflict with existing), create story file  
**Effort**: M

### 11. Team Pages
**Path**: `src/pages/Team/` (2 page files)  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing story files for both pages
- ❌ Contains components/ subdirectory (4 components should move to main components)
- ❌ Duplicate `TeamCompositions.tsx` (exists both as page and component)
**Files**:
- `TeamCompositions.tsx` → `TeamCompositionsPage.tsx`
- `TeamPage.tsx` → `TeamPage.tsx`
**Suggested**: Flatten pages, resolve naming conflicts, move components, create story files  
**Effort**: L

### 12. Teams Page
**Path**: `src/pages/Teams/TeamsPage.tsx`  
**Issues**: 
- ❌ Folder structure violation (nested folder not allowed)
- ❌ Missing `TeamsPage.stories.tsx`
- ❌ Contains components/ subdirectory (4 components should move to main components)
- ❌ Has `index.ts` re-export file
**Suggested**: Flatten page, move 4 components to main components folder, create story file  
**Effort**: M

### 13. SplashPage (Empty)
**Path**: `src/pages/SplashPage/` (empty directory)  
**Issues**: 
- ❌ Folder structure violation (empty nested folder)
**Suggested**: Remove empty directory  
**Effort**: S

---

## Import/Export Pattern Issues

### Atom Import Violations
**Problem**: Pages importing specific atom files instead of using `@atoms` index  

**Examples**:
```typescript
// ❌ Incorrect
import { teamNamesAtom } from '@atoms/teamNamesAtom';

// ✅ Correct  
import { teamNamesAtom } from '@atoms';
```

**Affected Files**: Timeline components, Team pages, Players pages, Match pages

### Missing Type Exports
**Problem**: Types not exported from `@atoms` index, causing import errors

**Examples**:
```typescript
// ❌ Failing imports
import { PlayerEvent } from '@atoms';
import { MatchData } from '@atoms/matchDataAtom';
```

### Library Import Issues  
**Problem**: Missing `@lib` exports causing import failures

**Examples**:
```typescript
// ❌ Failing import
import { formatTime } from '@lib';
```

---

## TypeScript Compliance Issues

### React Hooks Violations
**Files**: `AllPlayerComparison.tsx`, `SingleStatPlayerComparison.tsx`  
**Issue**: Conditional hook calls violating Rules of Hooks  
**Severity**: Critical (will cause runtime errors)

### Type Safety Issues
**Problem**: Widespread use of `any` types  
**Count**: 50+ violations across multiple files  
**Impact**: Reduces type safety benefits

---

## Summary by Priority

### Critical (Blocks ESLint)
- **13 folder structure violations** - All pages in nested folders
- **1 React Hooks violation** - Conditional hook usage

### High (Blocks Development)  
- **14 missing Storybook files** - Required by project rules
- **Multiple import/export violations** - Blocks TypeScript compilation

### Medium (Code Quality)
- **50+ TypeScript any violations** - Reduces type safety
- **Missing component organization** - 25+ components in wrong locations

### Low (Cleanup)
- **1 empty directory** - SplashPage folder

---

## Recommended Implementation Strategy

### Phase 1: Structure Compliance (Critical)
1. **Flatten all page files** to `src/pages/` root
2. **Rename pages** to avoid conflicts (see individual suggestions)
3. **Create all missing `.stories.tsx` files**

### Phase 2: Component Reorganization (High)
1. **Move 25+ page-specific components** to `src/components/`
2. **Resolve naming conflicts** (e.g., multiple MatchCard components)
3. **Update imports** in moved components

### Phase 3: Import/Export Fixes (High)
1. **Update `src/atoms/index.ts`** to export missing atoms and types
2. **Update `src/lib/index.ts`** to export missing utilities  
3. **Fix all page imports** to use index-only imports

### Phase 4: Code Quality (Medium)
1. **Fix React Hooks violations** in comparison components
2. **Replace `any` types** with proper TypeScript types
3. **Remove empty directories**

---

## Effort Estimates

| Task Category | Effort | Files Affected |
|---------------|--------|----------------|
| Structure flattening | XL | 14 pages + 25 components |
| Storybook creation | L | 14 story files |
| Import/export fixes | M | 50+ import statements |
| TypeScript cleanup | M | 50+ type violations |

**Total Estimated Effort**: XL (Multiple weeks for complete compliance)

---

## Success Criteria

- [ ] All pages in flat `src/pages/` structure
- [ ] All pages have corresponding `.stories.tsx` files
- [ ] All ESLint folder-structure errors resolved
- [ ] All TypeScript compilation errors resolved
- [ ] All import statements use index files only
- [ ] No React Hooks violations
- [ ] Storybook builds and displays all page stories