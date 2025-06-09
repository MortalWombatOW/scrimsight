## Scrimsight

*Analyze and visualise Overwatch scrims with an atom-driven React stack*

---

### Quick-start

```bash
npm install            # or npm / yarn
npm run dev                # runs Vite HMR dev serve
npm run test               # Vitest in watch mode
./check-lint-build-errors.sh   # ESLint + TS + Vitest headless
```
> For detailed documentation, see **docs/README.md**.

---

## File layout (high-level)

```
src/
  atoms/        ── Jotai atoms (business logic)
  components/   ── Re-usable UI components
  pages/        ── Route-level views
  lib/          ── Pure TS utilities
```

Strict folder/filename rules are enforced by **eslint-plugin-project-structure**.
See **docs/file-structure.md** for the rule matrix and examples.

---

## Tech stack

**React 18** + **Tailwind CSS/daisyUI** + **Jotai** atoms + **Vite** + **Vitest** + **Storybook 8**

For detailed tech stack information, tool versions, and configuration files, see **[docs/README.md](docs/README.md#🛠️-tech-stack--tool-versions)**.

---

## 🧩  Atom pattern (quick glance)

* **Standard atom** → `myFeatureAtom.ts`
  *named* `myFeatureAtomFn` export + **default unnamed** Jotai atom
* **Input atom** → `myInputAtom.ts`
  helper Fn + private `_stateAtom` + public `stateAtom` + **default unnamed** writable atom
* **Atom family** → `mySomethingAtomFamily.ts`
  *named* `mySomethingAtomFamilyFn` export + **default unnamed** `atomFamily`

Full spec—including selector limits enforced by ESLint—lives in **docs/atom-patterns.md**.

---

## 🚦 Code quality & linting

```bash
./check-lint-build-errors.sh {path of interest}
```

The script wraps:

* **ESLint** with three custom rule-sets: *file-composition*, *folder-structure*, *independent-modules*
* TypeScript `--noEmit`
* Headless **Vitest**

All three must pass for a clean build.

---

## Testing

* **Unit & integration** – Vitest + `@testing-library/react`
  *Atoms are tested via their `{fileName}Fn` helper; components via Storybook stories.*
* **Visual regressions** – Storybook Visual Tests addon (Chromatic cloud).
* **Coverage** goals: atoms 100 %, components 80 %.

See **docs/testing.md** for recipes.

---

## Documentation map

* **docs/README.md** – documentation index
* **docs/file-structure.md** – folder rules & architecture  
* **docs/atom-patterns.md** – atom + atom-family blueprints
* **docs/testing.md** – Vitest + Storybook testing
* **docs/linting.md** – ESLint config details
* **docs/typescript-guidelines.md** – strict typing patterns
* **docs/ui-guidelines.md** – Tailwind/DaisyUI conventions
* **docs/taskmaster-cli.md** – taskmaster CLI reference
* **docs/troubleshooting.md** – common error fixes

