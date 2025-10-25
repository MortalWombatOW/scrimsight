# Atom & Atom Family Patterns

The Jotai layer powers Scrimsight’s data model. Every atom file must follow one of the
patterns below; ESLint checks the structure via `fileComposition.mjs`.

---

## 1. Standard single atom

```
myFeatureAtom.ts
├─ export const myFeatureAtomFn = (…) => { … }
└─ export default atom((get) => myFeatureAtomFn(get(depAtom)))
```

Use for read-only or derived atoms. The default export is the atom instance; tests
import `myFeatureAtomFn`.

---

## 2. Input atom (writable)

```
playerNameInputAtom.ts
├─ export const playerNameInputAtomFn = (prev, next) => …
├─ const _playerNameAtom = atom('')
├─ const playerNameAtom = atom(
│     (get) => get(_playerNameAtom),
│     (_get, set, value) => set(_playerNameAtom, playerNameInputAtomFn(value))
│   )
└─ export default playerNameAtom
```

Owns its own state and exposes a writable default export.

---

## 3. Atom family

```
teamStatsAtomFamily.ts
├─ export const teamStatsAtomFamilyFn = (teamId) => …
└─ export default atomFamily((id) =>
     atom((get) => teamStatsAtomFamilyFn(id, get(playersAtom))))
```

Use when the computation depends on an identifier. Keep helpers pure so tests can call
them with mocked inputs.

---

## 4. Selector limits enforced by ESLint

| Pattern | Allowed root arrow functions | Allowed root variables | Notes |
| ------- | --------------------------- | ---------------------- | ----- |
| Standard | 1 (`{name}Fn`) | 1 (default export) | Define helpers inside the function |
| Input | 1 (`{name}Fn`) | 3 (`_state`, public alias, default export) | Keep order Fn → private → public → default |
| Family | 1 (`{name}Fn`) | 1 (default export) | Wrap `atomFamily` in the default export |

Breaking these limits triggers the `project-structure/file-composition` rule.

---

## 5. Testing checklist

* Import `{name}Fn` from the atom file and pass in mock dependencies.
* Store reusable fixtures in `src/lib/sampledata/` and read them via utility helpers.
* Keep snapshots out of atom tests—assert on returned objects instead.

---

## 6. Performance tips

* Compose smaller atoms rather than building one giant selector.
* Prefer `selectAtom` from `jotai/utils` when components only need a slice of a larger
  object.
* Normalise data in `src/lib` helpers so atoms remain thin wrappers around business
  logic.
