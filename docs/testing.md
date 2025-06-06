# Testing Playbook

Scrimsight relies exclusively on **Vitest** for unit & integration coverage and **Storybook 8** for visual regression.

## 1 Vitest setup

Vitest is a Vite-native runner, so it reuses the same plugins & aliases as the dev server, keeping test startup <200 ms on cold runs.

### Basic usage

```bash
npm test              # watch mode
npm run test:ci       # vitest run --coverage
````

Vitest includes globals by default in our config, so you can use `describe`, `it`, `expect` directly without imports.

## 2 Atom tests

* Import `{atomName}Fn` directly.
* Mock atom dependencies with `vi.fn()` or pass pre-computed values.
* One root-level `describe` per file (ESLint enforced).

## 3 Component & page stories

Story files (`*.stories.tsx`) double as interaction/visual tests.

```ts
export const Primary = playStory.bind({});
Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText(/Submit/i)).toBeVisible();
};
```

Run locally via the Storybook Visual Tests addon or automatically on PRs via Chromatic.

## 4 Coverage targets

| Layer        | Target                   |
| ------------ | ------------------------ |
| Atoms & libs | **100 %** lines/branches |
| Components   | 80 % lines               |
| Pages        | snapshot diff only       |

Vitest generates Istanbul reports in `coverage/`; CI fails if totals drop.

## 5 CI matrix

| Job          | Script                         |
| ------------ | ------------------------------ |
| Lint & types | `./check-lint-build-errors.sh` |
| Unit tests   | `vitest run --coverage`        |
| Visual tests | Chromatic via GitHub action    |
