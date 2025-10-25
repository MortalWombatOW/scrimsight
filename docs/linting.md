# Linting & Static Analysis

Scrimsight uses ESLint’s flat configuration together with
`eslint-plugin-project-structure` to enforce naming, dependency, and file-shape rules.
This document explains the layers and how to run them locally.

---

## 1. Stack overview

| Layer | Plugin / tool | Purpose |
| ----- | ------------- | ------- |
| Core | `@typescript-eslint` + `eslint-plugin-react` | General TypeScript and React quality rules |
| Structure | `eslint-plugin-project-structure` | Directory layout, required siblings, and dependency boundaries |
| Style hygiene | `eslint-plugin-unused-imports`, `eslint-plugin-import`, `@stylistic/eslint-plugin` | Keep imports tidy and formatting consistent |

The main configuration file is `eslint.config.mjs`.

---

## 2. Project structure helpers

* `folderStructure.mjs` – defines which files are allowed in each directory and which
  siblings are required (for example components must have a matching story).
* `fileComposition.mjs` – enforces the allowed exports within a file. Atom files, for
  instance, must expose exactly one `{name}Fn` helper and a default atom export.
* `independentModules.mjs` – restricts which folders can import from each other so that
  atoms, components, pages, and libraries stay decoupled.

---

## 3. Running the lints

```bash
npm run lint                # run ESLint over src/**/*.{ts,tsx}
npm run type-check          # tsc --noEmit for the whole project
./check-lint-build-errors.sh src/atoms src/lib  # targeted lint/type/test
```

The helper script accepts a list of files or folders and, for each, runs ESLint,
TypeScript, and Vitest. It exits with a non-zero status if any of the tools report
issues for the provided targets.

---

## 4. Tips

* Keep helper functions inside the `{name}Fn` implementations when working on atoms so
  the `file-composition` rule does not flag extra top-level exports.
* When reorganising folders, update the matching `index.ts` barrel and run
  `npm run lint` immediately to surface missing stories or tests.
* Set your editor to use the repository `.editorconfig` values (two-space indentation)
  to avoid stylistic noise in diffs.

---

## 5. Related docs

* [file-structure.md](file-structure.md) – directory rules and examples
* [atom-patterns.md](atom-patterns.md) – required exports for atom files
* [troubleshooting.md](troubleshooting.md) – common lint and type-check fixes
