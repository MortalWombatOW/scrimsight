# 03 - Typography

## Type Scale

- **Font Sizes:** Use a consistent type scale (not specified - need clarification). Avoid arbitrary pixel values.

## Font Choice

- **Readability:** Prioritize readable fonts. Prefer neutral sans-serif for UI.
- **System Fonts:** Consider system font stack for performance.
- **Custom Fonts:** If using, ensure at least five weights (with italics).
- **Avoid:** Avoid condensed fonts with short x-heights for body text.
- **User Preference:** Ask user for font family preference.

## Line Length & Height

- **Line Length:** 45-75 characters. Use `max-w-*` (e.g., `max-w-prose`).
- **Line Height:** Adjust based on font size and line length. Use `leading-*` classes. Start with `leading-normal` for body text.

## Alignment

- **Baseline:** Align text to baseline when mixing font sizes. Use `align-baseline`.
- **Letter Spacing:** Use default unless adjusting for large headlines (`tracking-tight`) or all-caps (`tracking-wide`).
- **Text Alignment:** Left-align text generally. Center-align short headlines. Right-align numbers in tables. Justify sparingly.