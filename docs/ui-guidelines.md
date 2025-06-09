
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

For comprehensive Playwright MCP testing guidance, including error checking workflows, context provider requirements, and story URL formats, see [testing.md](testing.md#31-playwright-mcp-testing-for-storybook).
