# Scrimsight Documentation Hub

Welcome to the Scrimsight knowledge base. Everything you need—architecture notes,
lint rules, testing guides—lives in this folder. Start with the sections below and
dive deeper as you work on a feature.

---

## 📑 Document index

| Area | File | What you’ll learn |
| ---- | ---- | ----------------- |
| Project overview | [README (root)](/README.md) | Elevator pitch, quick-start commands, and project layout |
| Folder rules | [file-structure.md](file-structure.md) | Directory constraints enforced by `eslint-plugin-project-structure` |
| Atom patterns | [atom-patterns.md](atom-patterns.md) | Required exports, test helpers, and ESLint limits for atoms |
| Testing | [testing.md](testing.md) | Vitest workflow, Storybook usage, and coverage hints |
| Linting | [linting.md](linting.md) | ESLint setup, custom rule sets, and suggested commands |
| TypeScript style | [typescript-guidelines.md](typescript-guidelines.md) | Type organisation, import aliases, and strict-mode tips |
| UI conventions | [ui-guidelines.md](ui-guidelines.md) | Tailwind/daisyUI guidelines and Storybook expectations |
| Troubleshooting | [troubleshooting.md](troubleshooting.md) | Quick fixes for lint, test, and Storybook issues |

---

## 🚀 Getting started

Follow the [root README](/README.md#quick-start) for install and dev-server commands.
The authoritative list of scripts (Storybook, linting, tests, build, etc.) lives in
[`package.json`](/package.json); run `npm run` to explore them instead of maintaining
command tables in multiple docs.

---

**Conventions**

* Commit message prefix examples: `feat`, `fix`, `refactor`, `docs`.
* Use the Storybook story that sits beside each component while iterating.
* Atom tests should exercise the exported `{name}Fn` helper rather than the default atom.

---

## 🛠️ Tooling source of truth

Versions and configuration live beside the code that uses them:

* Dependencies and scripts → [`package.json`](/package.json)
* Vite aliases and plugins → [`vite.config.ts`](/vite.config.ts)
* ESLint layout rules → [`eslint.config.mjs`](/eslint.config.mjs) plus the `*.mjs` helpers
* Vitest setup → [`vitest.workspace.ts`](/vitest.workspace.ts)
* Storybook entry → [`.storybook/main.ts`](/.storybook/main.ts)

Run `npm run build` before merging to confirm those configurations still agree.

---

## ✍️ Editing these docs

* Use Markdown; prefer headings up to H3.
* Keep a single source of truth—link to other docs instead of duplicating.
* Run `npx markdownlint-cli2 '**/*.md'` if you make large documentation edits.

---

## ❔ Need help?

* Start with [troubleshooting.md](troubleshooting.md).
