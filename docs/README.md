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
| **Testing** | [testing.md](testing.md) | Vitest setup, Storybook visual tests, comprehensive Playwright MCP testing guide |
| **Linting details** | [linting.md](linting.md) | ESLint configuration, custom rule-sets, project structure enforcement |
| **TypeScript style** | [typescript-guidelines.md](typescript-guidelines.md) | Central type registry, import alias rules, strict-mode tips |
| **UI conventions** | [ui-guidelines.md](ui-guidelines.md) | Tailwind & daisyUI styling guidelines, component rules |
| **Troubleshooting** | [troubleshooting.md](troubleshooting.md) | Categorized solutions for ESLint, testing, and Storybook issues |
| **Github Issues** | [github-issues-guide.md](github-issues-guide.md) | How to use GitHub Issues to track and manage tasks |

*(Links are relative—click within GitHub or VS Code to jump.)*

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
