
# Atom & Atom Family Patterns

The Jotai layer is the beating heart of Scrimsight.  
Every file must follow **one** of the three patterns below or ESLint will block the commit.

## 1 Standard single atom

```

myFeatureAtom.ts
├─ export const myFeatureAtomFn = (…) => { … }
└─ export default atom((get) => myFeatureAtomFn(get(depAtom)))

```

*Exactly one* named `arrowFunction` (`{fileName}Fn`) and *exactly one* unnamed `default` export.  
Ideal for read-only or derived atoms.

## 2 Input atom (writable)

```

playerNameInputAtom.ts
├─ export const playerNameInputAtomFn = (prev, next) => …
├─ const \_playerNameAtom = atom('')
├─ const playerNameAtom = atom(
│     get => get(*playerNameAtom),
│     (*, set, v) => set(\_playerNameAtom, playerNameInputAtomFn(v))
│   )
└─ export default playerNameAtom

```

Used when the atom owns local state and exposes both read & write.

## 3 Atom family

```

teamStatsAtomFamily.ts
├─ export const teamStatsAtomFamilyFn = (teamId) => …
└─ export default atomFamily((id) =>
atom((get) => teamStatsAtomFamilyFn(id, get(playersAtom))))

```

Like Standard atoms but parameterised.  Requires a named `Fn` for testability.

## 4 Selector limits (file-composition)

| Pattern | Root `arrowFunction` | Root `variable` | Notes |
|---------|---------------------|-----------------|-------|
| Standard | 1 | 1 | order: Fn then default |
| Input    | 1 | 3 (`_state`, `stateAtom`, default) | order: Fn → private → public → default |
| Family   | 1 | 1 | order: Fn then default |

These limits are enforced by ESLint rule **project-structure/file-composition**. :contentReference[oaicite:1]{index=1}

## 5 Testing rule

* Import the **Fn**, not the atom: `import { myAtomFn } from '@atoms/myAtom';`  
* Use **Vitest** assertions: `expect(result).toEqual(…)`. :contentReference[oaicite:2]{index=2}  
* Test file **must** sit next to the impl file (`myAtom.test.ts`) and contain a single root-level `describe`.

## 6 Performance tips

* Compose atoms; avoid giant selector chains that recalculate needlessly.  
* Use `selectAtom` from Jotai utils when a component needs only part of a large object.

---

**See also:**
- [file-structure.md](file-structure.md) — Architecture overview and import patterns
- [testing.md](testing.md) — Atom testing strategies
- [troubleshooting.md](troubleshooting.md) — Common ESLint issues with atoms
