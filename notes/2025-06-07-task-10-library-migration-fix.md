## BACKGROUND
* Scrimsight library files need migration to new pattern with strict ESLint rules - 2025-06-07 20:23

## TASK
* Task 10: Refactor Library and Implement Tests

## SUMMARY
* Fix 29 lint/build problems in src/lib: 12 independent-module violations and 17 TypeScript 'any' usage warnings

## OBJECTIVES
* Resolve all ESLint independent-module violations in library files
* Replace TypeScript 'any' types with proper type definitions
* Ensure library files follow new import pattern (@library index only)
* Maintain API contracts while updating implementation
* Achieve zero lint errors in src/lib folder

## RESEARCH PLAN
* Analyze current lib/index.ts exports and import structure
* Identify specific independent-module violations and required fixes
* Map TypeScript 'any' usage to existing type definitions in atoms/index.ts
* Document any required changes outside src/lib folder
* Create implementation plan with proper dependency order

## RESEARCH FINDINGS

### Library Index Analysis

**Current Export Pattern in src/lib/index.ts:**
- **Utility exports**: Clean barrel exports for basic utilities (base64, color, date, string, time, hero, scrimtime)
- **Format exports**: Explicit named exports to avoid conflicts, including renaming `formatDuration` to `formatDurationDetailed`
- **Metric utilities**: Exports advanced metric processing functions (metricUtils, playerMetricsUtils, playerComparison, killMatrixUtils)
- **Hook exports**: Custom React hooks (useAtomData, useMetricsTableColumns)
- **Service exports**: Data services (atomDataService, schemaVisualizer, metricExplorerStyles, dagre)
- **VIOLATION**: Atom re-exports (lines 37-64) - Re-exports specific atoms from @atoms, violating independent-modules rule
- **VIOLATION**: Type re-exports (lines 67-72) - Re-exports types from @atoms

**Key Problems Identified:**
1. **Independent-Module Violations**: Library index is importing and re-exporting from @atoms (lines 64, 72)
   - Violates library-index rule: "can only import files from '@library/filename.ts'"
   - Library files should not depend on atoms - this creates circular dependency risk

2. **Individual Library File Violations**: Based on the independent-modules config, library files are importing from @atoms
   - `playerMetricsUtils.ts` imports from '@atoms' (lines 4-13) - should use @library index only
   - Library files should import types/utilities through @library index, not directly from @atoms

3. **TypeScript 'any' Usage**: 
   - `playerMetricsUtils.ts` line 168: `statsAtomCache = new Map<string, Atom<Promise<Metric<any, any, any>>>>()`
   - Should use proper type definitions from existing interfaces

**Current Import Patterns in Library Files:**
- ✅ **Compliant**: `metricUtils.ts` - Only imports external packages (jotai)
- ✅ **Compliant**: `playerComparison.ts` - Pure utility functions, no internal imports
- ✅ **Compliant**: `useAtomData.ts` - Only imports from library files and external packages
- ❌ **Violation**: `playerMetricsUtils.ts` - Imports types and atom from '@atoms'
- ❌ **Violation**: `atomDataService.ts` - Uses types from local import (acceptable as it's self-contained)

**Library Index Structure Issues:**
- The current pattern tries to make the library index a "super-index" that also provides atoms
- This violates the architectural boundary between library utilities and state management
- Pages currently expect atoms to be available from @library, which is incorrect

### Independent Module Violations Analysis

#### 1. atomDataService.ts
**Current imports:** 
- `import type { AtomCollection } from './schemaVisualizer';`

**Issues:**
- Imports directly from another library file instead of @library index
- Should import AtomCollection from @library

**Required fix:**
- Change to: `import type { AtomCollection } from '@library';`
- Ensure AtomCollection is exported in lib/index.ts (already is via schemaVisualizer export)

#### 2. metricExplorerStyles.ts
**Current imports:**
- Line 2: `import { PlayerStatsCategoryKeys, PlayerStatsNumericalKeys } from "@atoms";`

**Issues:**
- Imports directly from @atoms instead of @library index
- These types should be re-exported from lib/index.ts

**Required fix:**
- Change to: `import type { PlayerStatsCategoryKeys, PlayerStatsNumericalKeys } from '@library';`
- Ensure these types are exported in lib/index.ts (already are via atoms re-export)

#### 3. playerEvents.ts
**Current imports:**
- Line 1-14: Multiple type imports from @atoms

**Issues:**
- All imports are directly from @atoms instead of @library index
- All these types should be available from @library

**Required fix:**
- Change all imports to use @library index
- Ensure all required types are re-exported in lib/index.ts

#### 4. playerMetricsUtils.ts
**Current imports:**
- Line 2: `import { groupByAtom, Grouped, Metric } from "./metricUtils";`
- Line 3: `import { OverwatchRole, getRankForRole } from "./hero";`
- Line 4: `import { ... } from '@atoms';`
- Line 13: `import playerStatsBaseAtom from '@atoms/playerStatsBaseAtom';`

**Issues:**
- Multiple direct imports from other library files instead of @library index
- Direct atom import from @atoms instead of @library
- Should use @library for all imports

**Required fix:**
- Change all imports to use @library index
- Ensure groupByAtom, Grouped, Metric, OverwatchRole, getRankForRole, and playerStatsBaseAtom are exported from lib/index.ts

#### 5. useAtomData.ts
**Current imports:**
- Line 3: `import type { AtomCollection } from './schemaVisualizer';`
- Line 4: `import { getAtomData } from './atomDataService';`

**Issues:**
- Direct imports from other library files instead of @library index

**Required fix:**
- Change to import from @library: `import type { AtomCollection, getAtomData } from '@library';`

#### 6. useMetricsTableColumns.ts
**Current imports:**
- Line 3-6: `import { PlayerStatsCategoryKeys, PlayerStatsNumericalKeys } from "@atoms";`

**Issues:**
- Direct import from @atoms instead of @library index

**Required fix:**
- Change to: `import type { PlayerStatsCategoryKeys, PlayerStatsNumericalKeys } from '@library';`

### Missing Exports Analysis

The following items need to be ensured in lib/index.ts:
1. All atom types from @atoms (already exported via re-export)
2. playerStatsBaseAtom (needs to be added to atoms re-export)
3. All library utility functions (already exported)

### Required lib/index.ts Updates

Need to add to the atoms re-export section:
```typescript
export {
  // ... existing exports ...
  playerStatsBaseAtom, // Add this
  // ... rest of exports ...
} from '@atoms';
```

### TypeScript Any Usage Analysis

#### metricExplorerStyles.ts (11 warnings)
**Issues:** 
- Lines 16, 28, 35, 49-51, 56-57, 64: Function parameters typed as `any` in style functions
- These are react-select style functions where proper types are `ProvidedValue` and `State`

**Required fix:**
- Import proper types from react-select: `import type { ProvidedValue, State } from 'react-select';`
- Replace `any` parameters with proper types

#### playerMetricsUtils.ts (3 warnings)
**Issues:**
- Line 168: Cache type uses `any` for flexibility
- This is acceptable for caching mechanism but could be improved

**Required fix:**
- Consider using a more specific type or keep as-is if complexity is too high

#### useMetricsTableColumns.ts (3 warnings)
**Issues:**
- Lines 12, 14, 20: ColumnDef uses `any` for table row type
- Should use a proper generic type

**Required fix:**
- Import proper types and use specific row types instead of `any`

### Summary of Required Changes

#### lib/index.ts updates:
1. Add `playerStatsBaseAtom` to atoms re-export
2. Ensure all required types are properly exported

#### File-specific import fixes:
1. **atomDataService.ts**: Change `./schemaVisualizer` to `@library`
2. **metricExplorerStyles.ts**: Change `@atoms` to `@library`, add react-select types
3. **playerEvents.ts**: Change `@atoms` to `@library`
4. **playerMetricsUtils.ts**: Change all direct imports to `@library`
5. **useAtomData.ts**: Change direct library imports to `@library`
6. **useMetricsTableColumns.ts**: Change `@atoms` to `@library`

#### TypeScript 'any' replacements:
1. **metricExplorerStyles.ts**: Use proper react-select types
2. **playerMetricsUtils.ts**: Consider improving cache types (optional)
3. **useMetricsTableColumns.ts**: Use proper generic types for table definitions
**Context**: React-select style functions receiving parameters typed as 'any'

**Lines 16, 19, 28, 35, 49, 50, 51, 56, 57, 64**: Style functions using parameters `provided: any` and `state: any`

**Proper Types**: React-select provides proper type definitions:
- `provided` should be typed as the specific style object type from react-select
- `state` should be typed as `ControlProps`, `MenuProps`, `OptionProps`, etc. from react-select

**Example Fix**:
```typescript
import { ControlProps, StylesConfig } from "react-select";
const baseControlStyles = (provided: CSSObjectWithLabel, state: ControlProps<OptionType>) => ({
```

**Available Types in atoms/index.ts**: No direct equivalents - need react-select types

#### playerMetricsUtils.ts (3 warnings)
**Context**: Stats atom cache and return types using 'any'

**Line 168**: `statsAtomCache = new Map<string, Atom<Promise<Metric<any, any, any>>>>();`
**Line 178**: Cache retrieval casting with 'any' types

**Proper Types**: Should use generic constraints with existing types:
- `Metric<PlayerStats, T, PlayerStatsNumericalKeys>` from atoms/index.ts
- Generic type parameters already defined: `T extends PlayerStatsCategoryKeys`

**Comment indicates intentional revert**: "Reverting to 'any' for cache type to resolve immediate errors, will revisit if possible."

**Available Types in atoms/index.ts**: 
- `Metric<T, K, N>` 
- `PlayerStats`
- `PlayerStatsCategoryKeys`
- `PlayerStatsNumericalKeys`

#### useMetricsTableColumns.ts (3 warnings)
**Context**: Table column definitions using 'any' for row data type

**Lines 12, 14, 20**: `ColumnDef<any>[]` and related 'any' usage in column definitions

**Proper Types**: Should use proper row data types:
- `ColumnDef<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>>` 
- Where `T extends PlayerStatsCategoryKeys`

**Available Types in atoms/index.ts**:
- `PlayerStats` interface
- `PlayerStatsCategoryKeys` type
- `PlayerStatsNumericalKeys` type
- `Grouped<T, K, N>` type (from Metric)

**Recommended Approach**:
1. Import react-select types for metricExplorerStyles.ts
2. Use generic constraints for playerMetricsUtils.ts cache
3. Define proper row type for useMetricsTableColumns.ts using existing PlayerStats types

## HIGH-LEVEL PLAN

### Phase 1: Fix Library Index Independent-Module Violations
- Remove atom re-exports from lib/index.ts that violate independent-modules rule
- Document breaking change for consuming files outside src/lib

### Phase 2: Update Library Files Import Patterns  
- Fix all 6 library files to import from @library index only
- Ensure required utilities are exported from lib/index.ts

### Phase 3: Replace TypeScript 'any' Usage
- Add proper React-select types to metricExplorerStyles.ts
- Improve type safety in playerMetricsUtils.ts cache
- Define proper table row types in useMetricsTableColumns.ts

### Phase 4: Validation
- Run lint check to confirm zero errors in src/lib
- Document any breaking changes for files outside src/lib

## IMPLEMENTATION

1. Fix lib/index.ts independent-module violations by removing atom re-exports
2. Update atomDataService.ts imports to use @library index
3. Update metricExplorerStyles.ts imports and replace 'any' types with React-select types
4. Update playerEvents.ts imports to use @library index
5. Update playerMetricsUtils.ts imports and improve cache typing
6. Update useAtomData.ts imports to use @library index
7. Update useMetricsTableColumns.ts imports and improve table typing
8. Run final validation with ./check-lint-build-errors.sh src/lib
9. Document breaking changes for consuming files outside src/lib

--- APPROVAL GRANTED ---
"Option A please, continue without asking me for clarification"