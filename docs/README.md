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

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd scrimsight
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. **Run the component sandbox**
   ```bash
   npm run storybook
   ```
4. **Check quality gates**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```
5. **Targeted checks while iterating**
   ```bash
   ./check-lint-build-errors.sh src/atoms
   ```
   The script accepts a space-separated list of files or folders and runs ESLint,
   TypeScript, and Vitest against just those targets.

---

## 🏗️ Development workflow snapshot

```
create branch → implement change → npm run lint && npm run test
   └─ optional: ./check-lint-build-errors.sh src/path/to/folder
open PR → reviewers run npm run build → merge
```

**Conventions**

* Commit message prefix examples: `feat`, `fix`, `refactor`, `docs`.
* Use the Storybook story that sits beside each component while iterating.
* Atom tests should exercise the exported `{name}Fn` helper rather than the default atom.

---

## 🛠️ Tool versions & configuration

| Tool | Notes |
| ---- | ----- |
| Node ≥ 18 | Vite requires a modern runtime |
| Vite 6 | `vite.config.ts` manages aliases and plugins |
| ESLint 9 | Configured via `eslint.config.mjs` using flat config syntax |
| Vitest 3 | Global setup defined in `vitest.workspace.ts` |
| Storybook 9 | Entry point in `.storybook/main.ts` |

Run `npm run build` before merging to ensure Vite, TypeScript, and ESLint agree.

---

## ✍️ Editing these docs

* Use Markdown; prefer headings up to H3.
* Keep a single source of truth—link to other docs instead of duplicating.
* Run `npx markdownlint-cli2 '**/*.md'` if you make large documentation edits.

---

## ❔ Need help?

* Start with [troubleshooting.md](troubleshooting.md).
* Drop a message in the `#scrimsight-dev` Slack channel for quick questions.
* For architectural discussions, open a GitHub discussion so answers are searchable.
