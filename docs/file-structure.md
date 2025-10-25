# Folder & File Structure

Scrimsight uses `eslint-plugin-project-structure` to keep the codebase organised. This
reference explains what belongs in each directory and the key rules enforced by the
linter.

---

## 1. High-level layout

```
src/
  atoms/        Jotai business logic & derived data
  components/   Reusable UI building blocks with stories
  pages/        Route-level views rendered by the router
  lib/          Pure TypeScript utilities and helpers
  icons/        Icon components and SVG assets
```

Atoms feed data into components and pages, while utilities in `src/lib` provide shared
parsing and aggregation helpers. Icons are treated like components and share the same
story requirement.

---

## 2. Folder rules (from `folderStructure.mjs`)

| Path | Allowed children | Required siblings |
| ---- | ---------------- | ----------------- |
| `src/` | `index.tsx`, `App.tsx`, `index.css`, `atoms/`, `components/`, `pages/`, `lib/`, `icons/` | — |
| `src/atoms/` | `CLAUDE.md`, `index.ts`, optional templates, `{camelCase}.ts`, `{camelCase}.test.ts` | atom ↔ test pairs |
| `src/components/` | `index.ts`, `{PascalCase}.tsx`, `{PascalCase}.stories.tsx` | component ↔ story pairs |
| `src/pages/` | `index.tsx`, `{PascalCase}Page.tsx` | page files only (no stories enforced) |
| `src/lib/` | `index.ts`, `{camelCase}.ts`, optional `{camelCase}.test.ts` | tests encouraged but not enforced |
| `src/icons/` | `index.ts`, `{PascalCase}Icon.tsx`, `{PascalCase}Icon.stories.tsx`, `*.svg` | icon ↔ story pairs |

The rule set will flag missing companions (for example a component without a story) or
unexpected file names.

---

## 3. Independent module rules

`independentModules.mjs` defines which areas can talk to each other. Highlights:

* `src/index.tsx` can only import `App.tsx` and `index.css`.
* `App.tsx` imports from the barrel files (`@pages`, `@components`, `@atoms`, `@library`).
* Atoms may depend on other atoms and utilities but not on components or pages.
* Component stories can import atoms via the barrel when they need data fixtures.

Violations surface as ESLint errors, making it clear when cross-folder dependencies
need a rethink.

---

## 4. File composition rules

`fileComposition.mjs` ensures that files expose a predictable set of top-level exports.
Examples:

* Atom files must export exactly one helper function and a default atom.
* Component files may export multiple React components, but the default export should be
the primary component documented in the story.
* Tests live next to their implementations and should not introduce extra exports.

---

## 5. Import aliases

`tsconfig.json` defines aliases to keep imports tidy:

| Alias | Resolves to |
| ----- | ----------- |
| `@atoms` | `src/atoms/index.ts` |
| `@components` | `src/components/index.ts` |
| `@pages` | `src/pages/index.tsx` |
| `@library` | `src/lib/index.ts` |
| `@icons` | `src/icons/index.ts` |

Use the aliases when referencing code across folders so the independent-modules rules
stay satisfied.

---

## 6. Data flow cheat sheet

1. Log files are uploaded and parsed by atoms in `src/atoms/logFile*.ts`.
2. Utilities in `src/lib/eventExtractionUtils.ts` and friends expand the raw data into
   typed event collections.
3. Derived atoms such as `playerStatsBaseAtom` and `teamfightsAtom` aggregate metrics.
4. Components and pages present the data using Tailwind/daisyUI.

Refer to individual atom and utility files for implementation details.
