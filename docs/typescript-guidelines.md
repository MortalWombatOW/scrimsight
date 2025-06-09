# TypeScript Guidelines

Scrimsight runs **`"strict": true`** so the compiler becomes your first line of defence. :contentReference[oaicite:9]{index=9}

## 1 Central type registry

All exported interfaces, enums, and type aliases for the business logic live in **`src/atoms/index.ts`**.  
Reasons:

1. **Discoverability** – IDE auto-import shows the entire domain model in one place.  
2. **Lint enforcement** – `file-composition` forbids interface exports elsewhere.

## 2 Import patterns

| Situation | Correct import |
|-----------|----------------|
| Using an atom in a component | `import { matchStatsAtom } from '@atoms';` |
| Using a type in a util | `import type { MatchStats } from '@atoms';` |
| Registering an atom in `src/atoms/index.ts` | `import matchStatsAtom from './matchStatsAtom';` |

## 3 Prefer `unknown` to `any`

If you must handle truly dynamic JSON, parse to `unknown` then narrow.  
`any` suppresses all checks and will fail CI lint rules.
