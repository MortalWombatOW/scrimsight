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