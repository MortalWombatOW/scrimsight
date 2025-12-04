# Folder & File Structure

Scrimsight enforces strict architectural boundaries to maintain scalability.

---

## 1. High-level layout

```
src/
  data/         Raw state and ingestion (The "Database")
  domain/       Business logic and calculations (The "Brain")
  hooks/        React adapters for data and logic (The "Connector")
  components/   Reusable UI building blocks
  pages/        Route-level views
  lib/          General purpose utilities
  icons/        Icon assets
```

---

## 2. Folder details

### `src/data`
Contains the application state.
* **Key Files**: `repository.ts` (Stores matches), `ingestor.ts` (Parses files).
* **Pattern**: Export atoms named `*Atom` and action atoms named `*Action`.

### `src/domain`
Contains the "rules" of Overwatch analysis.
* **Key Files**: `scrims.ts`, `stats.ts`, `teamfights.ts`.
* **Pattern**: Pure functions exported as named exports. No React code here.

### `src/hooks`
The public API for the UI.
* **Key Files**: `useMatch.ts`, `useScrims.ts`, `useRepository.ts`.
* **Pattern**: Custom hooks starting with `use`.

---

## 3. Import Aliases

`tsconfig.json` defines aliases to ensure clean imports:

| Alias | Path | Usage |
| :--- | :--- | :--- |
| `@hooks` | `src/hooks/index.ts` | Accessing data in components |
| `@components` | `src/components/index.ts` | Importing UI widgets |
| `@pages` | `src/pages/index.tsx` | Route definitions |
| `@library` | `src/lib/index.ts` | Shared utilities |
| `@icons` | `src/icons/index.ts` | Iconography |
| `@services` | `src/services/index.ts` | External services |
| `@types` | `src/types/index.ts` | Shared types |

*Note: Direct imports from `src/data` or `src/domain` in UI components are discouraged. Prefer using `@hooks`.*