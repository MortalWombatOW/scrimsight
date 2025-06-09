
# Linting & Static Analysis

Scrimsight’s codebase will not compile—or commit—unless three ESLint rule-sets pass.

## 1 Stack overview

| Layer | Plugin / tool | Purpose |
|-------|---------------|---------|
| **core** | `@eslint/js` + TypeScript ESLint | generic JS/TS quality |
| **project structure** | `eslint-plugin-project-structure` | folder, file, module guards :contentReference[oaicite:8]{index=8} |
| **style** | `eslint-plugin-unused-imports`, `eslint-plugin-import` | dead code & path sanity |

The config file is `eslint.config.mjs` (flat-config syntax).

## 2 fileComposition.mjs

Defines **selector limits** per atom pattern (see docs/atom-patterns.md).  
If you hit an error like “too many `arrowFunction` in file root” revise exports to match the table.

## 3 folderStructure.mjs

Ensures names and required siblings (e.g. `<atom>.ts` ↔ `<atom>.test.ts`).  
Tip: `eslint --fix` can *move* files to satisfy patterns.

## 4 independentModules.mjs

Prevents dependency spaghetti.  Violations read like:

````

🔥 Atoms (src/atoms/foo.ts) can only import from the atom index (@atoms) or the library index (@library). 🔥

```

Fix by routing imports through the appropriate index barrel.

## 5 Running lints

* Whole repo: `./check-lint-build-errors.sh`  
* Single folder: `./check-lint-build-errors.sh src/pages/`  
* Auto-fix safe rules: `eslint . --fix`

## 6 Long path warnings

`folderStructure` warns at 240-character paths by default; override in the rule config if your filesystem supports longer paths.
