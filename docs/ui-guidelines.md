# UI & Styling Guidelines

---

## 1. Tailwind + daisyUI

* Tailwind provides low-level utility classes for layout; daisyUI supplies higher-level
  component styles and themes.
* Theme tokens are defined in `src/index.css`. Update them there rather than scattering
  hard-coded colours.
* Stick to Tailwind’s default responsive breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).

---

## 2. Component expectations

* Components should receive the minimum data they need—derive heavy objects inside atoms
  or utility helpers first.
* Prefer composition over deeply nested conditionals; extract subcomponents if a block
  grows beyond ~100 lines.
* Every component must have a matching `*.stories.tsx` file that demonstrates its key
  states. Use args/controls to surface interactive variants.
* Ensure interactive elements have accessible labels (visible text or `aria-*`).

---

## 3. Storybook workflow

```bash
npm run storybook
```

* Keep stories colocated with components to match the lint rules.
* Use decorators in `.storybook/preview.tsx` to provide Router, Jotai, or theme context
  when necessary.
* Manually verify new visual states by interacting with the story; automated visual
  regression tooling is not configured in this repo.
