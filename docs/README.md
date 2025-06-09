````markdown
# Scrimsight Documentation Hub

Welcome to the Scrimsight knowledge-base.  
Everything you need—architecture diagrams, lint rules, testing guides—lives here.  
If you’re new, start with **“Getting started”** below, then skim the topic guides as you dive deeper.

---

## 📑 Document index

| Area | File | What you’ll learn |
|------|------|-------------------|
| **Project overview** | [README (root)](/README.md) | Elevator pitch, quick-start commands, high-level structure |
| **File & folder rules** | [file-structure.md](file-structure.md) | Allowed paths, naming patterns, folderStructure eslint config |
| **Atoms & state** | [atom-patterns.md](atom-patterns.md) | Standard/Input/Family blueprints, selector limits, examples |
| **Testing** | [testing.md](testing.md) | Vitest setup, Storybook visual tests, atom-Fn unit pattern |
| **Linting details** | [linting.md](linting.md) | All custom ESLint rule-sets (file-composition, folder-structure, independent-modules) |
| **TypeScript style** | [typescript-guidelines.md](typescript-guidelines.md) | Central type registry, import alias rules, strict-mode tips |
| **UI conventions** | [ui-guidelines.md](ui-guidelines.md) | Tailwind & daisyUI theme tokens, accessibility checklist |
| **Taskmaster CLI** | [taskmaster-cli.md](taskmaster-cli.md) | Full command reference and examples |
| **Troubleshooting** | [troubleshooting.md](troubleshooting.md) | Common ESLint, Vite, Vitest errors and quick fixes |

*(Links are relative—click within GitHub or VS Code to jump.)*

---

## 🚀 Getting started

1. **Clone and install**

   ```bash
   git clone https://github.com/your-org/scrimsight.git
   cd scrimsight
   npm install
````

2. **Run dev server**

   ```bash
   npm run dev             # Vite HMR at http://localhost:5173
   ```

3. **Verify quality gates**

   ```bash
   ./check-lint-build-errors.sh   # ESLint + TS + Vitest headless
   ```

4. **Open Taskmaster**

   ```bash
   npx task-master list --with-subtasks
   ```

5. **First test edit**

   *Pick an open “good-first-issue” atom, follow* **atom-patterns.md**, *run* `npm test`*, and open a PR.*

---

## 🏗️ Development workflow (snapshot)

```text
task-master next → create branch → code w/ VS Code & Storybook
   └─ ./check-lint-build-errors.sh  ✅
   └─ npm test (Vitest)            ✅
open PR → Chromatic runs visuals → review → squash & merge
```

**Key conventions**

* Commit titles: `feat(atom): add teamStatsAtom`
* Branch name: `<task-id>-short-slug`, e.g. `42-team-stats`
* All new atoms must achieve --100 % unit coverage.

---

## 🛠️  Tech stack & tool versions

### Core Technology Stack

| Layer              | Choice                                       | Why                                                                    |
| ------------------ | -------------------------------------------- | ---------------------------------------------------------------------- |
| Build / dev-server | **Vite**                                     | sub-100 ms HMR and Rollup-powered prod builds                         |
| UI                 | **React 18**, **Tailwind CSS** + **daisyUI** | high-level design system on top of utility classes                    |
| State              | **Jotai** atoms                              | atomic, type-safe, minimal re-renders                                 |
| Tests              | **Vitest**                                   | Vite-native runner; zero Jest shims needed                            |
| Visual tests       | **Storybook 8** + Chromatic                  | snapshot & diff every story automatically                              |
| Lint / structure   | **ESLint** + *project-structure* plugin      | enforces file-composition, folder-structure, and independent-modules rules |

### Tool Versions & Configuration

| Tool           | Version (min)       | Config file              |
| -------------- | ------------------- | ------------------------ |
| Node           | ≥ 18 LTS            | `.nvmrc`                 |
| npm            | ≥ 10                | —                        |
| ESLint         | 9 (new flat config) | `eslint.config.mjs`      |
| Vitest         | 1.x                 | `vitest.config.ts`       |
| Storybook      | 8.x                 | `.storybook/`            |
| Taskmaster CLI | 0.9                 | auto-installed via `npx` |

Run `npx envinfo --system --binaries` before filing bug reports.

---

## ✍️ Editing these docs

* Use Markdown; limit headings to ≤ H3.
* Keep one fact in one place—link elsewhere instead of copying text.
* After edits, run `npx markdownlint-cli2 '**/*.md'` (configured in repo).
* For large doc changes, open a PR with label **docs**.

---

## ❔ Need help?

* Check **troubleshooting.md** first.
* Ask in *#scrimsight-dev* Slack channel; tag the maintainer group.
* For architectural questions, open a *Discussion* in GitHub.
