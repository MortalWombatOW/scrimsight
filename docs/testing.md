# Testing Playbook

Scrimsight relies on Vitest for unit and integration tests and Storybook for manual UI
checks. The commands below match the scripts in `package.json`.

---

## 1. Vitest

Vitest shares Vite’s configuration so JSX transforms, path aliases, and CSS handling
work the same way as in the dev server.

### Commands

```bash
npm run test        # single run in Node
npm run test:watch  # watch mode while developing
npm run test -- --coverage  # generate coverage reports in coverage/
```

Vitest is configured via `vitest.workspace.ts`; globals such as `describe`, `it`, and
`expect` are automatically available.

### Atom tests

* Import the `{name}Fn` helper exported from each atom file rather than the default
  atom. This keeps tests deterministic and avoids needing to mock providers.
* Keep one top-level `describe` block per test file—this is enforced by ESLint.
* Reach into other atoms via the `@atoms` alias so imports stay consistent.

### Component tests

Components are primarily exercised through their Storybook stories. When you do need a
Vitest component test, use `@testing-library/react` helpers (already installed) and
assert on visible behaviour, not implementation details.

---

## 2. Storybook

Storybook runs alongside the application code and is used for manual visual checks and
spot regression testing.

```bash
npm run storybook
```

* Each component should have a matching `*.stories.tsx` file next to it.
* Use controls and args in stories to cover the important UI states.
* Capture screenshots manually when making noticeable visual changes; there is no
  Chromatic integration in this repo.

---

## 3. Coverage targets

Coverage is not enforced in CI, but keeping atom logic near 100 % and component stories
covering the primary states helps catch regressions early. Coverage reports from
`npm run test -- --coverage` are written to `coverage/`.

---

## 4. Troubleshooting

* If tests cannot resolve imports, run `npm run type-check` to surface TypeScript
  errors and ensure path aliases match `tsconfig.json`.
* For flaky time-based assertions, prefer the utilities in `src/lib/time.ts` and
  inject the current time as a parameter that tests can control.
* When components fail in Storybook, check the browser console for missing providers
  (Router, Jotai) and update `.storybook/preview.tsx` accordingly.
