# Troubleshooting

Quick fixes for common development issues.

---

## ESLint & linting issues

### “Selector limit exceeded”

```
[project-structure/file-composition] Too many arrowFunction in root of file
```

* Ensure the atom file matches one of the patterns in
  [atom-patterns.md](atom-patterns.md).
* Move helper functions inside `{name}Fn` so only the allowed top-level exports remain.

### Missing story or test warnings

* The folder structure rule expects component ↔ story and atom ↔ test pairs.
* Create the missing companion file or update `folderStructure.mjs` if the rule needs to
  be adjusted for a refactor.

---

## Testing issues

### “Cannot find module …” during `npm run test`

* Run `npm run type-check` to surface TypeScript errors that may block Vitest.
* Confirm the import path uses one of the aliases configured in `tsconfig.json`.
* Delete `node_modules` and reinstall dependencies if the issue persists.

### Failing Storybook stories

* Make sure `.storybook/preview.tsx` provides the same providers used in the app
  (Router, Jotai, Auth, etc.).
* Reload the Storybook iframe after editing providers; hot reload occasionally needs a
  manual refresh to pick up context changes.

---

## Build issues

### `npm run build` fails on type errors only seen in CI

* Run `npm run type-check` locally with the same Node version as CI (Node 18+).
* Ensure any environment-based logic is guarded so it does not run during static
  evaluation.
