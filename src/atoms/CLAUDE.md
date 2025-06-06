# Scrimsight • Atoms Ground-Rules (for Claude)

## 1 Mandatory file patterns   (ESLint‐enforced)

| Pattern | Root selectors (exact limits) | Export order |
|---------|------------------------------|--------------|
| **Standard atom** `{camelCase}.ts` | 1 `arrowFunction` named **{fileName}Fn**<br>1 `variable` default export | 1) `{fileName}Fn`  2) `export default` |
| **Input atom** `*Input*.ts` | 1 `arrowFunction` named **{fileName}Fn**<br>2 `variable` in root (`_{camelCase}` & `{camelCase}Atom`)<br>1 `variable` default export | 1) Fn  2) `_{camelCase}`  3) `{camelCase}Atom`  4) `export default` |
| **Atom family** `*AtomFamily.ts` | 1 `arrowFunction` named **{fileName}Fn**<br>1 `variable` default export | 1) Fn  2) `export default` |

*No other root-level selectors are allowed.*  
Selectors in nested scope are unrestricted.

## 2 Import rules (summary)

* **Registration** in `src/atoms/index.ts` ⇒ import the *default* export directly from its file.  
* **Consumption elsewhere** ⇒ `import { myAtom } from '@atoms';`  
* Types live only in `src/atoms/index.ts`; never re-declare interfaces in individual atom files.

## 3 Testing pattern (Vitest only)

```ts
import { describe, it, expect } from 'vitest';
import { demoFn } from '@atoms/demo';

describe('demoFn', () => {
  it('returns expected result', () => {
    const result = demoFn(mockData);
    expect(result).toEqual(expected);
  });
});
```

* **Test file name** `src/atoms/demo.test.ts` — must sit beside impl file.
* One root-level `describe` call per test file (ESLint rule).
* Mock any `get`/`set` with `vi.fn()`; do **not** import the default atom inside unit tests.

## 4 Quick lint-fix checklist

1. **“Too many arrowFunctions/variables”** → ensure only the selectors listed in §1 are at file root.
2. **“exported selector name mismatch”** → confirm the Fn is exactly `{fileName}Fn` (PascalCase + `Fn`).
3. **Interface export error** → move interface to `src/atoms/index.ts` and import from `@atoms`.
4. **Independent-modules violation** → atoms may import only `@atoms` index or `@lib` index.

## 5 Helpful commands

```bash
./check-lint-build-errors.sh src/atoms/      # lint + TS + Vitest for atoms
pnpm test --filter src/atoms/<name>.test.ts  # run one atom test
```
