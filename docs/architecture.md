# Architecture & State Management

Scrimsight uses a **Layered Architecture** to separate concerns between raw data storage, business logic, and UI presentation.

---

## The Three Layers

### 1. Data Layer (`src/data`)
**Responsibility:** Storage, persistence, and ingestion.
* **Repositories:** Atoms that hold the "Source of Truth" (e.g., `matchesRepositoryAtom`).
* **Ingestors:** Functions that parse raw text files into structured JSON objects.
* **Persistence:** Match data is persisted to IndexedDB via Dexie.js (`db.ts`). Serialization helpers (`serialization.ts`) convert non-JSON-safe types (`Map`, `Set`) to plain objects/arrays for storage. On startup, `hydrateFromDbAction` restores data from IndexedDB into the Jotai atoms — the `useHydration` hook gates the UI until hydration completes.
* **Types:** Raw entity definitions (DTOs) from the logs.

*Rule:* This layer should not contain complex business logic or UI code.

### 2. Domain Layer (`src/domain`)
**Responsibility:** Business logic and derived knowledge.
* **Pure Functions:** Algorithms that calculate stats, detect team fights, or group matches into scrims.
* **Testability:** These files are pure TypeScript and easy to unit test without mocking React or Atoms.

*Example:* `detectScrims(matches)` takes a list of matches and returns grouped Scrim objects.

### 3. Hook/Facade Layer (`src/hooks`)
**Responsibility:** Connecting Data/Domain to React.
* **Facades:** Hooks like `useScrims()` use `useAtomValue` to read from the repository, apply domain functions, and return ready-to-render data.
* **Abstraction:** Components never import atoms directly; they import hooks.

---

## Data Flow Example

### Importing files
When a user imports log files:

1.  **Ingestion**: `loadFilesAction` reads each file, parses it via `ingestFile`, and stores the resulting `ProcessedMatch` objects in `matchesRepositoryAtom`.
2.  **Persistence**: After updating the atom, the action serializes new matches (converting `Map`→`Record`, `Set`→`Array`) and writes them to IndexedDB via `putMatches()`. This is best-effort — if it fails, data is still available for the current session.
3.  **On next page load**: `useHydration()` runs on mount, reads all stored matches from IndexedDB, deserializes them back into `ProcessedMatch` objects, and populates the atom. The `HydratedRoutes` component gates the UI until this completes.

### Viewing data
When a user opens the "Scrims" page:

1.  **Repository**: `matchesRepositoryAtom` contains all loaded match data (from import or hydration).
2.  **Hook**: `useScrims()` is called by the page.
    * It reads the matches from the repository.
    * It imports `detectScrims` from `src/domain/scrims`.
    * It memoizes the result of `detectScrims(matches)`.
3.  **UI**: `ScrimsPage.tsx` receives a list of `Scrim` objects and renders them.

---

## Invariants

Hard rules about how ScrimSight is structured.

### Persistence is fire-and-forget
Atom updates happen first (instant UI), Dexie writes happen after (async, best-effort). Log persistence errors — never throw. If IndexedDB fails, data is still available for the current session.

### Serialization boundary
`ProcessedMatch` contains non-JSON types: `playerStatusTimeline` is a `Map<string, PlayerStatusTimeline>`, and `PlayerStatusEntry` contains `Set<string>`. Serialization helpers in `src/data/serialization.ts` handle Map↔Record and Set↔Array conversion at the Dexie boundary. Any new non-JSON-safe types added to `ProcessedMatch` must have corresponding serialization logic.

### Domain capabilities exceed UI surface
Not all domain functions are displayed in the UI. The domain layer computes more than the UI currently shows (e.g., `calculateUltMetrics()` exists but has no UI). Check `docs/information-architecture.md` for the current coverage matrix before adding new UI — the domain layer may already have what you need.

### Insights are rule-based, not AI
All auto-generated insights must be deterministic and explainable. No ML models, no LLM calls in the product. AI is used for development only.

### Barrel imports: avoid self-referencing
A file that is re-exported by a barrel (`index.ts`) must not import from that same barrel — doing so creates circular chunk dependencies at build time. Use direct relative imports instead. In practice:
- **Components** within `src/components/` import siblings via relative paths (e.g., `../ui/StatCard`), not `@components`.
- **Pages**, **hooks**, and other leaf consumers that are NOT re-exported by a barrel may freely use barrel aliases like `@components` or `@library`.

This rule applies to all barrel files (`@components`, `@library`, `@hooks`, etc.), not just components.

### Code splitting requires direct imports
`React.lazy()` requires direct file imports, not barrel exports (`@pages`, `@components`). Barrel re-exports defeat chunk splitting. For named exports, use `.then(m => ({ default: m.ComponentName }))` to adapt for `React.lazy()`.

### Type safety for union types
When working with union types like `TeamfightEvent` (`KillLogEvent | UltimateStartLogEvent | MercyRezLogEvent`), use type guard functions (`isKillEvent()`, `isUltStartEvent()`) for narrowing. Avoid `as` casts — they bypass the compiler and hide bugs.

