
# UI & Styling Guidelines

## 1 Tailwind + DaisyUI stack

* Tailwind provides low-level utility classes → rapid iteration. {index=11}  
* DaisyUI layers component class shortcuts & themes on top.

### Theme tokens

The theme is defined in in `src/index.css > daisyui/theme`.

## 2 Component rules

* Props **first**, visual state **second** – avoid passing entire atoms; instead pass primitives.  
* Responsive breakpoints must use Tailwind’s default scale (`sm`, `md`, `lg`, `xl`, `2xl`).  
* Accessibility: every interactive element needs an aria-label or visible text.

## 3 Storybook workflow

Run `npm storybook` to open the browser; each story doubles as a test file.  
Use the Visual Tests addon for pixel diffs before committing.

### 3.1 Testing stories with Playwright MCP

When working on Storybook stories, always use Playwright MCP tools to verify they work correctly:

**Required testing steps:**
1. **Navigate to story**: `mcp__playwright__playwright_navigate` to the story URL
2. **Error check**: `mcp__playwright__playwright_console_logs` with `type: "error"` 
3. **Visual check**: `mcp__playwright__playwright_screenshot` to verify appearance

**Context provider requirements:**
- Components using React Router `Link` require Router context in stories
- Components using Jotai atoms need Provider setup in `.storybook/preview.ts`
- Always check console for context-related errors before committing

**Story URL format:**
```
http://localhost:6006/?path=/story/[folder]-[component]--[variant]
```

Example: `components-cardbase--with-link` for CardBase component's "With Link" story.
