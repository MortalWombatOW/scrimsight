# Folder & File Structure — rules & architecture

Scrimsight uses **eslint-plugin-project-structure** to guarantee every path, file name, and export shape follows a predictable pattern.  
If ESLint fails, this is the document to check first.

## 1 High-level layout & data flow

```

src/
atoms/        Jotai business logic & state
components/   Re-usable UI building blocks  
pages/        Route-level views
lib/          Pure TypeScript utilities
icons/        SVG icons

```

### Architecture & component interactions

**Atoms** (`src/atoms/`) define the application's data flow and business logic using Jotai. Each atom resides in its own file (`{atomName}Atom.ts`), exporting core logic as a named `{atomName}Fn` function and the Jotai atom instance as the default export. Atoms depend on other atoms (via `get`) and utility libraries (`src/lib/`), providing data to React components.

**Components** (`src/components/`) define the UI using React, styled with DaisyUI and Tailwind CSS. Components consume data from Jotai atoms and depend on other components or utility libraries. They are designed to be "dumb" and fetch minimal props.

**Pages** (`src/pages/`) define top-level UI views and primarily depend on components and utility libraries, receiving props from the URL.

**Libraries** (`src/lib/`) provide reusable functionality consumed by atoms, components, pages, or other libraries. Key files include `playerMetricsUtils.ts` for player stat processing and `eventExtractionUtils.ts` for log parsing helpers.

**Icons** (`src/icons/`) are SVG files used in the UI. They are imported as React components and can be used directly in JSX.

### Data processing pipeline

1. Raw log files → `logFileLoaderAtom` → `logFileParserAtom`
2. Parsed logs → extractor atoms (`killExtractorAtom`, `heroSpawnExtractorAtom`) using `eventExtractionUtils.ts`
3. Extracted events → derived atoms (`playerStatsBaseAtom`, `teamfightsAtom`) using `playerMetricsUtils.ts`  
4. Processed data → UI components and pages

Anything outside `src/` (config, scripts, docs) is ignored by the linter.

## 2 FolderStructure rule (src only)

The rule set lives in `folderStructure.mjs`; the table below is a human-readable summary.

| Path | Allowed children | Required siblings |
|------|------------------|-------------------|
| `src/` | `atoms/`, `components/`, `pages/`, `lib/`, `index.tsx`, `App.tsx`, `index.css` | — |
| `src/atoms/` | `<atom>.ts`, `<atom>.test.ts`, `index.ts`, `CLAUDE.md`, `atomTemplate.ts.txt` | each `<atom>.ts` **must** have `<atom>.test.ts` |
| `src/components/` | `<Component>.tsx`, `<Component>.stories.tsx`, `index.tsx` | component ↔ story must coexist |
| `src/pages/` | `<Page>.tsx`, `<Page>.stories.tsx`, `index.tsx` | page ↔ story must coexist |
| `src/lib/` | `<util>.ts`, `<util>.test.ts`, `index.ts` | util ↔ test must coexist |
| `src/icons/` | `<icon>.tsx`, `<icon>.svg` | — |

See the [plugin docs] for advanced syntax such as recursion and `enforceExistence`. :contentReference[oaicite:0]{index=0}

## 3 Independent-modules rule

* Index files (`src/atoms/index.ts`, `src/components/index.tsx`, …) may import **only** implementation files in their own folder trees.  
* Implementation files may import **only** their corresponding index files (atoms → `@atoms`, components → `@components`, etc.).  
* Unit tests have a relaxed rule-set but can never import across feature boundaries.

Config lives in `independentModules.mjs`.

## 4 File-Composition rule

File-level selector limits (arrows, variables, interfaces) are defined in `fileComposition.mjs`.  
The three atom patterns (Standard / Input / Family) are described in detail in **atom-patterns.md**.

## 5 Import patterns & path aliases

Use these standard path aliases consistently:

| Situation | Correct import |
|-----------|----------------|
| Using an atom in a component | `import { matchStatsAtom } from '@atoms';` |
| Using a type | `import type { MatchStats } from '@atoms';` |
| Registering an atom in `index.ts` | `import matchStatsAtom from './matchStatsAtom';` |
| Using utilities | `import { formatTime } from '@lib';` |

**Rules:**
* Types defined in `src/atoms/index.ts` are imported via `@atoms`
* Atom instances (default exports) are imported from specific files during registration
* Avoid using `~/` as it's not configured in this project

## 6 Cheat-sheet

| Task | Command |
|------|---------|
| Validate only atoms folder | `./check-lint-build-errors.sh src/atoms/` |
| List long paths >240 chars | `eslint --rule 'project-structure/folder-structure: warn'` |
