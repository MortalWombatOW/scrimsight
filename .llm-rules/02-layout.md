# 02 - Layout and Spacing

## DaisyUI Layout

- **Components:** Use DaisyUI layout components: `card`, `hero`, `divider`, `drawer`, `footer`, `stack`, `indicator`.
- **Responsiveness:** Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`) with DaisyUI.  Design mobile-first.

## Spacing

- **White Space:** Start with generous padding and margins. Reduce spacing iteratively.
- **Screen Filling:** Avoid full-width elements. Use `max-w-*` to constrain content.
- **Spacing Scale:** Use a consistent spacing scale (not specified - need clarification).  Avoid arbitrary pixel values.
- **Grouping:** Space *around* groups should be greater than space *within* groups.
- **Grids:** Avoid over-reliance on fixed-column grids. Use flexbox and grid strategically.

## Mobile First
- Start designing for smaller screens first, and then use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to adjust the layout for larger screens.