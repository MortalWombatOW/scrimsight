# Testing Playbook

Scrimsight relies exclusively on **Vitest** for unit coverage and **Storybook** for visual and interaction regression.

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

### 3.1 Playwright MCP testing for Storybook

Use Playwright MCP tools to test Storybook stories during development. The MCP server provides built-in Playwright functions that don't require separate installation or setup.

**Essential error checking workflow:**
1. **Navigate to story**: Use `mcp__playwright__playwright_navigate` with the story URL
2. **Check console errors**: Always use `mcp__playwright__playwright_console_logs` with `type: "error"` to catch runtime errors
3. **Visual verification**: Use `mcp__playwright__playwright_screenshot` to verify rendering
4. **Context validation**: For components using React Router, ensure proper context providers are set up

**Example MCP workflow:**
```typescript
// Navigate to a specific story
mcp__playwright__playwright_navigate({
  url: "http://localhost:6006/?path=/story/components-cardbase--with-link",
  headless: true
})

// Check for errors immediately after navigation
mcp__playwright__playwright_console_logs({
  type: "error"
})

// Take screenshot for visual verification
mcp__playwright__playwright_screenshot({
  name: "story-test",
  fullPage: true
})
```

**Common error patterns to check for:**
- React Router context errors (e.g., "Cannot destructure property 'basename'")
- Missing Jotai providers for atom-dependent components  
- TypeScript errors in component props
- CSS/styling issues causing layout breaks

**Context provider requirements:**
- Components using React Router `Link` require Router context in stories
- Components using Jotai atoms need Provider setup in `.storybook/preview.ts`
- Always check console for context-related errors before committing

**Story URL format:**
```
http://localhost:6006/?path=/story/[folder]-[component]--[variant]
```
Example: `components-cardbase--with-link` for CardBase component's "With Link" story.

**Important**: Always start Storybook (`npm run storybook`) before using Playwright MCP tools. Use the MCP functions rather than console commands for automated testing.

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

---

**See also:**
- [atom-patterns.md](atom-patterns.md) — Atom testing patterns and examples
- [ui-guidelines.md](ui-guidelines.md) — Component and styling guidelines
- [troubleshooting.md](troubleshooting.md) — Common testing and Storybook issues
