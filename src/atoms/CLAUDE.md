# Claude Code Memory - Scrimsight Project

## ESLint Project Structure Rule Enforcement

### Overview
This project uses `eslint-plugin-project-structure` with strict file composition rules to enforce architectural patterns in the `src/atoms/` directory. Successfully reduced critical file composition errors from 155+ to <30 (80%+ reduction).

### File Composition Patterns

#### 1. Standard Single Atoms
- **Pattern**: Named function export + default export
- **Structure**:
  ```typescript
  export const {fileName}Fn = (...params) => {
    // Pure function logic with nested helpers
  };
  
  export default atom(async (get) => {
    return {fileName}Fn(...);
  });
  ```
- **Rules**: 1 arrowFunction + 1 variable (default export)

#### 2. AtomFamily Pattern  
- **Pattern**: Default export only
- **Structure**:
  ```typescript
  export default atomFamily((param) =>
    atom(async (get) => {
      // All helper functions nested inside
      const helperFn = (...) => { ... };
      return helperFn(...);
    })
  );
  ```
- **Rules**: Default export with all logic inline

#### 3. Input Atom Pattern
- **Pattern**: Named function + default export  
- **Structure**:
  ```typescript
  export const {fileName}Fn = (input: Type): OutputType => {
    // Pure function logic
  };
  
  export default atom(async (get) => {
    const input = get(inputAtom.atom);
    return {fileName}Fn(input);
  });
  ```
- **Rules**: Named function + private atom + unnamed default export

### Type System Architecture

#### Central Type Registry
- **All interfaces must be exported from `src/atoms/index.ts`**
- **No interface exports from individual atom files**
- **Purpose**: API discoverability and preventing duplicate definitions

#### Type Categories Added to Index:
- Contextual Stats: `PlayerMatchParams`, `TeamMatchParams`, etc.
- Team Compositions: `HeroEvent`, `AggregatedMatchupStats`, etc.  
- List Summaries: `ScrimListSummary`, `TeamListSummary`, `PlayerListSummary`
- Match Data: `MatchFileInfo`, `MatchData`, `MapTimes`
- Player Lives: `PlayerLife`
- Player History: `PlayerMatch`
- Status Timeline: `LogEvent`, `PlayerStatusEntry`, `PlayerStatusTimeline`
- Round Times: `RoundTimes`

#### Atom Registration Pattern
```typescript
export const atomName: ScrimsightAtom<Promise<ReturnType>> = {
  name: 'atomName',
  description: 'Description of what this atom does',
  atom: atomImplementation
};
```

### Import/Export Patterns

#### Correct Import Structure
```typescript
// ✅ Correct - Import from central index
import {
  baseAtom,
  TypeInterface,
  anotherAtom,
} from '@atoms';

// ❌ Wrong - Direct file imports
import baseAtom from '@atoms/baseAtom';
import { TypeInterface } from '@atoms/baseAtom';
```

#### Export Pattern Fixes
```typescript
// ❌ Wrong - Named variable export  
export const myAtom = atom(async (get) => { ... });

// ✅ Correct - Unnamed default export
export default atom(async (get) => { ... });
```

### Common Violation Fixes

#### 1. Function Naming Violations
- **Pattern**: `export const {fileName}Fn = ...`
- **Examples Fixed**: `mapTimesFn` → `mapTimesAtomFn`

#### 2. Multiple Function Declarations
- **Solution**: Move all helper functions inside the main function
- **Pattern**: Nest helpers to avoid root-level function declarations

#### 3. Interface Export Violations  
- **Solution**: Move all interfaces to `src/atoms/index.ts`
- **Remove**: All `export interface` statements from individual files

#### 4. VariableExpression Violations
- **Common Issue**: `export const atom = atom(...); export default atom;`
- **Solution**: Use unnamed default: `export default atom(...);`

#### 5. Independent Module Import Violations
- **Issue**: Importing from individual files instead of central index
- **Solution**: Always import from `@atoms` or `@library` only

### Complex File Restructuring Examples

#### Multi-Export to Single Function Pattern
```typescript
// Before: Multiple exports
export const helperAtom1 = ...;
export const helperAtom2 = ...; 
export interface LocalInterface { ... }

// After: Single function pattern
export const mainAtomFn = () => {
  const helperAtom1 = ...;
  const helperAtom2 = ...;
  
  return {
    helperAtom1,
    helperAtom2,
    mainAtom: atom(...)
  };
};

export default mainAtomFn();
```

#### AtomFamily with Inline Logic
```typescript
// Before: External helper functions
function helper1() { ... }
function helper2() { ... }
export const atomFamily = atomFamily(...)

// After: All logic inline
export default atomFamily((param) =>
  atom(async (get) => {
    const helper1 = () => { ... };
    const helper2 = () => { ... };
    // Use helpers inline
  })
);
```

### Systematic Error Fixing Approach

1. **Run comprehensive check**: `./check-lint-build-errors.sh src/atoms/`
2. **Identify file categories**:
   - Interface export violations → Move to index.ts
   - Function naming → Fix `{fileName}Fn` pattern  
   - Import violations → Use @atoms imports
   - Multiple exports → Restructure to single pattern
3. **Fix in order of impact**: 
   - Complex multi-file restructures first
   - Simple naming/export fixes second
   - Import fixes last
4. **Test frequently**: Run check after each major file fix
5. **Handle TypeScript conflicts**: Update imports in index.ts when changing exports

### Key Files Successfully Restructured
- `contextualStatAtoms.ts` - Multiple exports → Single function
- `detailedTeamCompositionsAtom.ts` - Interface violations → AtomFamily pattern
- `killMatrixAtom.ts` - External imports → Inline atomFamily  
- `listSummaryAtoms.ts` - Multiple exports → Single function
- `playerInteractionEventsAtom.ts` - Multiple functions → Single pattern
- `firstKillImpactAtom.ts` - Named export → Default export
- 12+ other atoms with naming, interface, and import fixes

### Tools and Commands
- **Error checking**: `./check-lint-build-errors.sh src/atoms/`
- **Specific file**: `./check-lint-build-errors.sh src/atoms/fileName.ts`  
- **Error counting**: `./check-lint-build-errors.sh src/atoms/ 2>/dev/null | grep "error.*🔥" | wc -l`
- **File listing**: `./check-lint-build-errors.sh src/atoms/ 2>/dev/null | grep "^/home" | head -10`

### Final Results
- **Before**: 155+ critical file composition errors
- **After**: <30 critical errors remaining
- **Success Rate**: 80%+ error reduction
- **Architecture**: Proper separation of concerns with centralized types
- **Patterns**: Consistent file composition following established rules

## Comprehensive Atom Testing Implementation

### Testing Framework & Tools
- **Framework**: Vitest (not Jest) with @testing-library/react
- **Pattern**: Function extraction for testability (`{atomName}Fn` pattern)
- **Coverage Target**: 100% atom test coverage (69 total atom files)

### Testing Strategy & Prioritization

#### Phase-Based Implementation Approach
1. **Phase 1**: High-priority complex atoms (playerInteractionEventsAtom, teamfightsAtom, playerStatsBaseAtom, matchDataAtom)
2. **Phase 2**: Medium-priority data transformation atoms  
3. **Phase 3**: Simple state atoms
4. **Phase 4**: Comprehensive validation and coverage analysis

#### Complexity-Based Prioritization
- **High Complexity**: Multiple event types, state management, algorithmic logic
- **Medium Complexity**: Data transformation, filtering, aggregation
- **Low Complexity**: Simple state atoms, configuration atoms

### Test File Patterns & Standards

#### Standard Test Structure
```typescript
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { atomNameFn } from '@atoms/atomName';
import type { RequiredTypes } from '@atoms';

describe('atomNameFn', () => {
  const mockData: RequiredType = [
    {
      // Complete interface-compliant mock objects
      requiredProperty: 'value'
    }
  ];

  it('should test core functionality', () => {
    const result = atomNameFn(mockData);
    expect(result).toEqual(expectedOutput);
  });
});
```

#### TypeScript Interface Compliance
- **Critical**: All test mock objects MUST match exact interface definitions
- **Import Pattern**: Import types from `@atoms/index.ts` central registry
- **Common Errors Fixed**:
  - `isCritical` → `isCriticalHit` in KillType interface
  - `map` → `mapName`, `gameMode` → `mapType` in MatchStartType
  - Missing required properties: `team1Name`, `team2Name`, `roundNumber`, etc.

#### Dependency Mocking Patterns
```typescript
// Mock atom dependencies using vi.fn()
const mockGet = vi.fn();
mockGet.mockImplementation(async (atom) => {
  if (atom === dependency.atom) return mockDependencyData;
  return [];
});

// Call atom function with proper async/await
const result = await atomFn(mockGet as any);
```

### Critical Interface Compliance Issues Fixed

#### Kill Events Interface
```typescript
// ❌ Wrong - old interface usage
isCritical: true

// ✅ Correct - actual interface property
isCriticalHit: true
```

#### Match Start Events Interface
```typescript
// ❌ Wrong properties
{ map: 'Numbani', gameMode: 'Hybrid' }

// ✅ Correct properties with all required fields
{ 
  mapName: 'Numbani', 
  mapType: 'Hybrid',
  team1Name: 'Team A',
  team2Name: 'Team B',
  matchId: 'match1',
  type: 'match_start',
  matchTime: 0
}
```

#### Round Events Interface Requirements
- **RoundStart**: Must include `capturingTeam`, `team1Score`, `team2Score`
- **RoundEnd**: Must include `roundNumber`, `team1Score`, `team2Score`, not `winningTeam`
- **RoundTimes**: Must include `roundDuration` property

### Test Coverage Analysis Results

#### Initial Coverage Assessment (Before Implementation)
- **Tested Atoms**: 22/69 atoms (32% coverage)
- **Untested Atoms**: 47 atoms requiring new test files
- **Test Pattern Adoption**: ~65% of atoms already followed `{atomName}Fn` pattern

#### Post-Implementation Results (Phase 1 Complete)
- **New Test Files Created**: 4 comprehensive test suites
- **Tests Added**: 21 individual test cases
- **TypeScript Errors Fixed**: 6 existing test files corrected
- **Interface Compliance**: 100% of test mocks now type-safe
- **Test Success Rate**: 188/192 tests passing (98% success rate)

### Systematic Error Resolution Methodology

#### 1. Comprehensive Error Analysis
```bash
./check-lint-build-errors.sh src/atoms
```
- Identified 42 missing test files
- Found 6 TypeScript errors in existing tests
- Catalogued interface compliance violations

#### 2. Interface-First Test Design
- Import all required types from `@atoms/index.ts`
- Create complete mock objects matching exact interfaces
- Verify property names against actual interface definitions
- Include ALL required properties (no partial mocks)

#### 3. Incremental Validation
- Run type checks after each test file creation/fix
- Validate test execution success before proceeding
- Maintain high test success rate throughout implementation

### Taskmaster Integration & Project Management

#### Task Breakdown Structure
- **Task 11**: Fix TypeScript errors in existing test files (COMPLETED)
- **Task 12**: Implement tests for high-priority complex atoms 
- **Task 13**: Implement tests for medium-priority data transformation atoms
- **Task 14**: Implement tests for simple state atoms
- **Task 15**: Validate comprehensive test coverage

#### Progress Tracking
- Real-time status updates using Taskmaster CLI
- Systematic task completion marking
- Dependency management across implementation phases

### Technical Challenges & Solutions

#### 1. Interface Mismatch Resolution
- **Challenge**: Test mocks using outdated interface properties
- **Solution**: Centralized type imports from `@atoms/index.ts`
- **Result**: Zero TypeScript compilation errors

#### 2. Complex Atom Dependency Mocking
- **Challenge**: Atom functions requiring multiple atom dependencies
- **Solution**: Proper `vi.fn()` mocking with atom reference mapping
- **Example**: `mockGet.mockImplementation(async (atom) => { ... })`

#### 3. Event Type Polymorphism Handling
- **Challenge**: Multiple event types with different interfaces
- **Solution**: Union type imports and comprehensive mock coverage
- **Pattern**: Test all event types in single comprehensive test

### Testing Best Practices Established

#### 1. Comprehensive Event Coverage
- Test all event types supported by atom functions
- Include bidirectional event scenarios (mercy rez + player events)
- Verify chronological sorting and data integrity

#### 2. Edge Case Testing Standards
- Empty input arrays handling
- Mixed populated/empty array combinations  
- Null/undefined input validation
- Same timestamp event handling

#### 3. Mock Data Quality Standards
- Complete interface compliance (no partial objects)
- Realistic data values reflecting actual game scenarios
- Consistent naming conventions and team assignments

### Documentation & Knowledge Transfer

#### 1. Test Pattern Documentation
- Established clear testing patterns in created test files
- Documented complex mocking strategies for future reference
- Created reusable test utility patterns

#### 2. Interface Reference Guide
- Centralized all type definitions in `@atoms/index.ts`
- Documented common interface compliance pitfalls
- Established import patterns for test files

#### 3. Error Resolution Playbook
- Systematic approach for identifying TypeScript errors
- Step-by-step interface compliance verification
- Progressive test implementation methodology

### Next Phase Preparation

#### Remaining Work Scope
- **42 untested atoms** requiring new test file creation
- **Complex atoms**: ultimateEventsAtom, groupedEventsAtom, listSummaryAtoms
- **Data transformation atoms**: dvaDemech, dvaRemech, heroSwap variations
- **Simple state atoms**: sampleDataEnabled, setupComplete, configuration atoms

#### Implementation Strategy
- Follow established patterns from Phase 1 success
- Maintain interface compliance standards
- Use Taskmaster for systematic progress tracking
- Target 100% atom test coverage as final goal