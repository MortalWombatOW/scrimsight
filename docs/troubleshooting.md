# Troubleshooting

Quick fixes for common development issues, organized by area.

## ESLint & Linting Issues

### "Selector limit exceeded" error

**Symptom:**
```
[project-structure/file-composition] Too many arrowFunction in root of file
```

**Fix:**  
Ensure only the exports listed in [atom-patterns.md](atom-patterns.md) are present.  
Often an extra helper sneaks to file root—nest it inside the main `Fn`.

## Testing Issues

### Vitest "Cannot find module 'react'"

**Cause:** Vitest reuses Vite aliases; configuration or dependency issue.

**Fix:**
1. Verify `vite.config.ts` has `react` plugin
2. Delete `node_modules` and run `npm install`
3. Ensure test file ends with `.test.ts` (needed for glob)

## Storybook Issues

### React Router context errors

**Symptom:**
```
Cannot destructure property 'basename' of 'React10.useContext(...)' as it is null.
```

**Cause:** Component uses React Router `Link` but Storybook stories lack Router context.

**Fix:**
1. Use Playwright MCP to detect: `mcp__playwright__playwright_console_logs({ type: "error" })`
2. Add Router provider to `.storybook/preview.ts` or mock the component prop
3. Test fix with `mcp__playwright__playwright_navigate` to story URL

### Jotai atom errors

**Symptom:** Component renders blank or throws atom-related errors in console.

**Fix:**
1. Check console with `mcp__playwright__playwright_console_logs({ type: "error" })`
2. Add Jotai Provider to `.storybook/preview.ts`
3. Initialize required atoms in story decorators

### General Storybook debugging

For comprehensive Storybook testing and debugging guidance, see [testing.md](testing.md#31-playwright-mcp-testing-for-storybook).