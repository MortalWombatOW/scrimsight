# Fix import resolution for hero file in playerMetricsAtoms.ts

## Problem

The file `src/atoms/metrics/playerMetricsAtoms.ts` is failing to resolve import from "../../lib/data/hero". After investigation, we found that the hero.ts file is located directly in the src/lib directory, not in src/lib/data.

## Plan

1. Check the source code to verify imports needed from hero.ts
2. Update the import path in playerMetricsAtoms.ts to point to the correct location
3. Verify the fix works

## Steps Taken

1. Created a new branch off of prod called fix/hero-import
2. Changed the import path from "../../lib/data/hero" to "../../lib/hero" in playerMetricsAtoms.ts
3. The fix should resolve the import error, as the required symbols `OverwatchRole` and `getRankForRole` are available in the src/lib/hero.ts file

## Results

Updated the import statement to correctly point to the hero file at its actual location:

```diff
- import { OverwatchRole, getRankForRole } from "../../lib/data/hero";
+ import { OverwatchRole, getRankForRole } from "../../lib/hero";
```

## Learnings

- Always verify file paths before attempting to import files
- When encountering import errors, check the actual location of the file and its exported symbols
- Following the project structure and workflow helps to quickly identify and fix issues
