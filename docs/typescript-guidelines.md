# TypeScript Guidelines

Scrimsight runs with `"strict": true`, so the TypeScript compiler should be treated as
the first line of defence against bugs. The tips below keep types predictable across
the project.

---

## 1. Central type registry

Domain types that need to be shared live in `src/atoms/index.ts`. Keeping types close to
the atoms that use them makes auto-imports reliable and helps the
`project-structure/file-composition` rule enforce consistency.

---

## 2. Import patterns

| Situation | Preferred import |
| --------- | ---------------- |
| Using an atom in a component | `import playerStatsAtom from '@atoms/playerStatsAtom';` |
| Reusing a shared type | `import type { PlayerStats } from '@atoms';` |
| Registering an atom in the index | `import playerStatsAtom from './playerStatsAtom';` |

Stick to the path aliases defined in `tsconfig.json` so lint rules continue to validate
dependencies correctly.

---

## 3. General advice

* Prefer `unknown` over `any` when handling untyped JSON payloads—narrow as soon as
  possible using type guards or `zod` schemas.
* Use discriminated unions for status enums (`"loading" | "ready" | "error"`) rather
  than boolean flags.
* If a helper is reused across multiple files, move it into `src/lib` to keep atom files
  small and focused.
* Keep literal values (for example, hero names) in dedicated constants in `src/lib` so
  the same strings are reused across atoms, components, and tests.
